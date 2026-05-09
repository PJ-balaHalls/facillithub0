/**
 * app/api/finder/webhook/route.ts
 * Endpoint para receber callbacks do Apify quando um run terminar.
 *
 * URL para configurar no Apify:
 *   https://seudominio.com/api/finder/webhook
 *
 * Em desenvolvimento: use ngrok para expor localmente
 *   npx ngrok http 3000 → https://xxx.ngrok.io/api/finder/webhook
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/server'
import { getRunItems } from '@/lib/apify-finder'
import { analyzeCompany } from '@/lib/ai-finder'

export const maxDuration = 300 // Vercel Fluid Compute: até 5 min

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[finder/webhook] Payload recebido:', JSON.stringify(body).slice(0, 200))

    // Apify envia diferentes formatos dependendo da configuração
    const runId    = body.runId    || body.resource?.id
    const status   = body.status   || body.resource?.status
    const searchId = body.searchId // Passado via payload template

    if (!runId) {
      return NextResponse.json({ error: 'runId ausente' }, { status: 400 })
    }

    const supabase = await createClient()

    // Busca o search pelo apify_run_id se não tiver o searchId direto
    const { data: search } = await supabase
      .from('finder_searches')
      .select('id, status')
      .eq('apify_run_id', runId)
      .single()

    if (!search) {
      console.warn('[finder/webhook] Search não encontrado para run:', runId)
      return NextResponse.json({ ok: true, message: 'search não encontrado' })
    }

    if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED_OUT') {
      await supabase
        .from('finder_searches')
        .update({ status: 'failed', error_message: `Apify run ${status}` })
        .eq('id', search.id)
      return NextResponse.json({ ok: true })
    }

    if (status !== 'SUCCEEDED') {
      return NextResponse.json({ ok: true, message: 'Run ainda não concluído' })
    }

    // Processar resultados
    await processSearchResults(supabase, search.id, runId)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[finder/webhook] Erro:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Também aceita GET para teste de conectividade
export async function GET() {
  return NextResponse.json({ ok: true, service: 'Facillit Finder Webhook' })
}

/**
 * Processa os resultados do Apify: salva empresas, reviews e roda IA.
 * Exportada para reutilização no endpoint de processamento manual.
 */
export async function processSearchResults(
  supabase: any,
  searchId: string,
  runId: string
) {
  // Atualiza status para "processing"
  await supabase
    .from('finder_searches')
    .update({ status: 'processing' })
    .eq('id', searchId)

  // Baixa itens do Apify
  const items = await getRunItems(runId)
  console.log(`[finder] ${items.length} itens recebidos do Apify`)

  let totalLeads = 0

  for (const item of items) {
    if (!item.title) continue

    const placeId = item.placeId || `manual_${Date.now()}_${Math.random()}`

    // Inserir empresa (upsert por place_id dentro do search)
    const { data: company, error: compErr } = await supabase
      .from('finder_companies')
      .upsert({
        search_id:       searchId,
        place_id:        placeId,
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
      }, { onConflict: 'search_id,place_id', ignoreDuplicates: false })
      .select('id')
      .single()

    if (compErr || !company) {
      console.error('[finder] Erro ao inserir empresa:', compErr?.message)
      continue
    }

    // Inserir avaliações
    const reviews = item.reviews || []
    if (reviews.length > 0) {
      await supabase.from('finder_reviews').insert(
        reviews.map((r: any) => ({
          company_id:   company.id,
          author:       r.name,
          rating:       r.stars,
          text:         r.text,
          published_at: r.publishedAtDate,
        }))
      )
    }

    // Análise de IA
    try {
      const analysis = await analyzeCompany({
        name:        item.title,
        rating:      item.totalScore,
        reviewCount: item.reviewsCount,
        hasWebsite:  !!item.website,
        reviews:     reviews.map((r: any) => ({ rating: r.stars, text: r.text || '' })),
      })

      // Só gera lead se score > 10 (tem alguma oportunidade)
      if (analysis.score > 10) {
        await supabase.from('finder_leads').upsert({
          search_id:       searchId,
          company_id:      company.id,
          score:           analysis.score,
          pain_categories: analysis.pain_categories,
          pain_excerpts:   analysis.pain_excerpts,
          ai_summary:      analysis.ai_summary,
          status:          'new',
        }, { onConflict: 'company_id', ignoreDuplicates: false })

        totalLeads++
      }
    } catch (aiErr) {
      console.error('[finder] Erro IA para empresa:', item.title, aiErr)
    }
  }

  // Atualiza totais e status
  await supabase
    .from('finder_searches')
    .update({
      status:          'completed',
      total_companies: items.length,
      total_leads:     totalLeads,
      completed_at:    new Date().toISOString(),
    })
    .eq('id', searchId)

  console.log(`[finder] Processamento concluído: ${totalLeads} leads de ${items.length} empresas`)
}