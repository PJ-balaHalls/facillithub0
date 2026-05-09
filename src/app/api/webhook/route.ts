/**
 * app/api/webhook/route.ts
 * Processamento robusto de resultados com suporte a Oportunidade Ouro.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/server'
import { getRunItems } from '@/lib/apify-finder'
import { analyzeCompany } from '@/lib/ai-finder'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const runId    = body.runId    || body.resource?.id
    const status   = body.status   || body.resource?.status
    
    if (!runId) return NextResponse.json({ error: 'runId ausente' }, { status: 400 })

    const supabase = await createClient()

    // Busca a busca pelo run_id, agora incluindo priority_mode
    const { data: search } = await supabase
      .from('finder_searches')
      .select('id, status, priority_mode')
      .eq('apify_run_id', runId)
      .single()

    if (!search) return NextResponse.json({ ok: true, message: 'Busca não encontrada' })

    if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED_OUT') {
      await supabase.from('finder_searches').update({ status: 'failed' }).eq('id', search.id)
      return NextResponse.json({ ok: true })
    }

    if (status === 'SUCCEEDED') {
      // Passamos o search inteiro para o processador usar o priority_mode
      await processSearchResults(supabase, search, runId)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[webhook/error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function processSearchResults(supabase: any, search: any, runId: string) {
  // Atualiza para processing
  await supabase.from('finder_searches').update({ status: 'processing' }).eq('id', search.id)

  const items = await getRunItems(runId)
  let totalLeads = 0

  for (const item of items) {
    if (!item.title) continue

    // Inserção/Atualização da Empresa
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
      .select('id')
      .single()

    if (compErr || !company) continue

    // Salva Reviews (batch opcional)
    const reviews = item.reviews || []
    if (reviews.length > 0) {
      await supabase.from('finder_reviews').insert(
        reviews.map((r: any) => ({
          company_id: company.id, author: r.name, rating: r.stars, text: r.text, published_at: r.publishedAtDate,
        }))
      )
    }

    // IA com modo de prioridade
    try {
      const analysis = await analyzeCompany({
        name:         item.title,
        rating:       item.totalScore,
        reviewCount:  item.reviewsCount,
        hasWebsite:   !!item.website,
        reviews:      reviews.map((r: any) => ({ rating: r.stars, text: r.text || '' })),
        priorityMode: search.priority_mode // <-- Aqui injetamos a inteligência "Ouro"
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
      }
    } catch (aiErr) {
      console.error('[IA/Error]', item.title, aiErr)
    }
  }

  // Finaliza a busca
  await supabase.from('finder_searches').update({
    status: 'completed',
    total_companies: items.length,
    total_leads: totalLeads,
    completed_at: new Date().toISOString()
  }).eq('id', search.id)
}