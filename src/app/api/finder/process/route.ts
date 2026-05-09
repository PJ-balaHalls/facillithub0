/**
 * app/api/finder/process/route.ts
 * Endpoint para processamento MANUAL de um run concluído.
 * Chamado pelo botão "Processar Resultados" na UI quando não há webhook configurado.
 *
 * POST /api/finder/process
 * Body: { searchId: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/server'
import { getRunStatus, mapApifyStatus } from '@/lib/apify-finder'
import { processSearchResults } from '../webhook/route'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const { searchId } = await req.json()
    if (!searchId) {
      return NextResponse.json({ error: 'searchId obrigatório' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verifica se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Carrega a busca
    const { data: search, error } = await supabase
      .from('finder_searches')
      .select('id, status, apify_run_id')
      .eq('id', searchId)
      .single()

    if (error || !search) {
      return NextResponse.json({ error: 'Busca não encontrada' }, { status: 404 })
    }

    if (search.status === 'completed') {
      return NextResponse.json({ ok: true, message: 'Busca já processada' })
    }

    if (search.status === 'processing') {
      return NextResponse.json({ ok: true, message: 'Processamento em andamento' })
    }

    // Se ainda tiver run_id, verifica status no Apify
    if (search.apify_run_id) {
      const runStatus = await getRunStatus(search.apify_run_id)
      const mapped    = mapApifyStatus(runStatus.status)

      if (mapped === 'running') {
        // Atualiza status no banco
        await supabase
          .from('finder_searches')
          .update({ status: 'running' })
          .eq('id', searchId)
        return NextResponse.json({ ok: true, message: 'Apify ainda rodando', apifyStatus: runStatus.status })
      }

      if (mapped === 'failed') {
        await supabase
          .from('finder_searches')
          .update({ status: 'failed', error_message: `Apify: ${runStatus.status}` })
          .eq('id', searchId)
        return NextResponse.json({ ok: false, message: 'Run falhou no Apify' })
      }

      // Sucesso — processar
      await processSearchResults(supabase, search.id, search.apify_run_id)
      return NextResponse.json({ ok: true, message: 'Processado com sucesso' })
    }

    return NextResponse.json({ error: 'Sem apify_run_id para processar' }, { status: 400 })
  } catch (err: any) {
    console.error('[finder/process] Erro:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}