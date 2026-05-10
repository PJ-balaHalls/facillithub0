import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/server'
import { getRunItems } from '@/lib/apify-finder'
import { analyzeCompany } from '@/lib/ai-finder'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const runId = body.runId || body.resource?.id
    const status = body.status || body.resource?.status
    if (!runId) return NextResponse.json({ error: 'runId ausente' }, { status: 400 })

    const supabase = await createClient()
    const { data: search } = await supabase.from('finder_searches').select('*').eq('apify_run_id', runId).single()
    if (!search) return NextResponse.json({ ok: true })

    if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED_OUT') {
      await supabase.from('finder_searches').update({ status: 'failed' }).eq('id', search.id)
      return NextResponse.json({ ok: true })
    }

    if (status === 'SUCCEEDED') {
      await processSearchResults(supabase, search, runId)
    }
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * Processa resultados e retorna logs e contagem para o Server Action.
 */
export async function processSearchResults(supabase: any, search: any, runId: string) {
  const logs: string[] = []
  const addLog = (m: string) => {
    const time = new Date().toLocaleTimeString('pt-BR')
    logs.push(`[${time}] ${m}`)
    console.log(`[finder] ${m}`)
  }

  addLog(`🔄 Iniciando análise do garimpo: ${search.name}`)
  await supabase.from('finder_searches').update({ status: 'processing' }).eq('id', search.id)

  const items = await getRunItems(runId)
  addLog(`📦 ${items.length} locais encontrados. Iniciando triagem de IA...`)

  let totalLeads = 0

  for (const item of items) {
    if (!item.title) continue

    // Upsert da Empresa
    const { data: company, error: compErr } = await supabase
      .from('finder_companies')
      .upsert({
        search_id:       search.id,
        place_id:        item.placeId || `m_${Date.now()}_${Math.random()}`,
        name:            item.title,
        category:        item.categoryName,
        address:         item.address,
        phone:           item.phone,
        website:         item.website,
        latitude:        item.location?.lat,
        longitude:       item.location?.lng,
        rating:          item.totalScore,
        review_count:    item.reviewsCount,
        google_maps_url: item.url,
        has_website:     !!item.website,
        raw_data:        item,
      }, { onConflict: 'search_id,place_id' })
      .select('id').single()

    if (compErr || !company) continue

    const rawReviews = item.reviews || []
    const reviewsForAI = rawReviews.map((r: any) => ({ rating: r.stars || 0, text: r.text || '' }))

    // Salva reviews no banco (upsert opcional)
    if (rawReviews.length > 0) {
      await supabase.from('finder_reviews').upsert(
        rawReviews.map((r: any) => ({
          company_id: company.id, author: r.name, rating: r.stars, text: r.text, published_at: r.publishedAtDate
        })), { onConflict: 'company_id,author,text' }
      )
    }

    // Análise Semântica via IA
    try {
      addLog(`🧠 Analisando: "${item.title}"...`)
      const analysis = await analyzeCompany({
        name:         item.title,
        rating:       item.totalScore,
        reviewCount:  item.reviewsCount,
        hasWebsite:   !!item.website,
        reviews:      reviewsForAI,
        priorityMode: search.priority_mode
      })

      if (analysis.score > 10) {
        await supabase.from('finder_leads').upsert({
          search_id:       search.id,
          company_id:      company.id,
          score:           analysis.score,
          pain_categories: analysis.pain_categories,
          pain_excerpts:   analysis.pain_excerpts,
          ai_summary:      analysis.ai_summary,
          status:          'new',
        }, { onConflict: 'company_id' })

        totalLeads++
        addLog(`✅ OPORTUNIDADE! Score: ${analysis.score.toFixed(0)} | ${item.title}`)
      } else {
        addLog(`⏭️ Descartado: ${item.title} (Baixa urgência)`)
      }
    } catch (aiErr) {
      addLog(`❌ Erro IA em ${item.title}`)
    }
  }

  await supabase.from('finder_searches').update({
    status: 'completed',
    total_companies: items.length,
    total_leads: totalLeads,
    completed_at: new Date().toISOString()
  }).eq('id', search.id)

  addLog(`🎉 GARIMPO FINALIZADO! ${totalLeads} leads gerados.`)
  return { totalLeads, logs }
}