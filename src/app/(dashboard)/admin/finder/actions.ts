'use server'

import { revalidatePath } from 'next/cache'
import { createClient }   from '@/lib/server'
import { startMapsScraping, getRunStatus, mapApifyStatus } from '@/lib/apify-finder'
// Importação direta do motor de processamento para evitar erros de fetch circular
import { processSearchResults } from '@/app/api/webhook/route'

/**
 * Lança uma nova operação de garimpo com suporte a parâmetros avançados.
 */
export async function createSearch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const name         = formData.get('name')         as string
  const termsRaw     = formData.get('searchTerms')  as string
  const regionsRaw   = formData.get('regions')      as string
  const maxResults   = parseInt(formData.get('maxResults') as string || '20', 10)
  const radiusKm     = parseInt(formData.get('radiusKm')   as string || '5',  10)
  const batchSize    = parseInt(formData.get('batch_size') as string || '10', 10)
  const priorityMode = formData.get('priority_mode') as string || 'standard'

  const searchTerms = termsRaw.split('\n').map(t => t.trim()).filter(Boolean)
  const regions     = regionsRaw.split('\n').map(r => r.trim()).filter(Boolean)

  if (!name || searchTerms.length === 0) {
    throw new Error('O nome e pelo menos um nicho de busca são obrigatórios')
  }

  // 1. Regista a busca no Banco de Dados
  const { data: search, error } = await supabase
    .from('finder_searches')
    .insert({
      created_by:    user.id,
      name,
      search_terms:  searchTerms,
      regions:       regions,
      max_results:   maxResults,
      radius_km:     radiusKm,
      batch_size:    batchSize,
      priority_mode: priorityMode,
      status:        'pending',
    })
    .select()
    .single()

  if (error || !search) {
    throw new Error('Erro ao criar registo de busca: ' + error?.message)
  }

  try {
    const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`
      : undefined

    // 2. Inicia o Scraping no Apify
    const run = await startMapsScraping({ searchTerms, regions, maxResults, webhookUrl })

    // 3. Atualiza com o ID de execução do Apify
    await supabase
      .from('finder_searches')
      .update({ status: 'running', apify_run_id: run.id })
      .eq('id', search.id)

    revalidatePath('/admin/finder')
    return { searchId: search.id }

  } catch (apifyErr: any) {
    await supabase
      .from('finder_searches')
      .update({ status: 'failed', error_message: 'Falha ao iniciar robô: ' + apifyErr.message })
      .eq('id', search.id)
    
    throw new Error('Falha ao iniciar o scraping no Google Maps: ' + apifyErr.message)
  }
}

/**
 * ✅ CORREÇÃO BUILD: Função processSearch exportada.
 * Dispara o processamento manual chamando a lógica de IA diretamente.
 */
export async function processSearch(searchId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { data: search } = await supabase
    .from('finder_searches')
    .select('*')
    .eq('id', searchId)
    .single()

  if (!search?.apify_run_id) throw new Error('Operação sem ID de execução do Apify')

  // Chama o motor do webhook DIRETAMENTE (sem usar fetch/HTTP circular)
  // Isso retorna { totalLeads, logs }
  const result = await processSearchResults(supabase, search, search.apify_run_id)

  revalidatePath('/admin/finder')
  revalidatePath('/admin/vendas/leads')
  
  return { 
    ok: true, 
    logs: result.logs,
    totalLeads: result.totalLeads
  }
}

/**
 * Sincroniza o estado atual da execução entre Apify e Supabase.
 */
export async function syncSearchStatus(searchId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { data: search } = await supabase
    .from('finder_searches')
    .select('id, status, apify_run_id')
    .eq('id', searchId)
    .single()

  if (!search?.apify_run_id) return { status: search?.status || 'unknown' }

  const run    = await getRunStatus(search.apify_run_id)
  const mapped = mapApifyStatus(run.status)

  if (mapped !== search.status) {
    await supabase.from('finder_searches').update({ status: mapped }).eq('id', searchId)
  }

  revalidatePath('/admin/finder')
  return { status: mapped, apifyStatus: run.status }
}

/**
 * Remove uma operação de busca.
 */
export async function deleteSearch(searchId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  await supabase.from('finder_searches').delete().eq('id', searchId)
  revalidatePath('/admin/finder')
}

/**
 * Obtém a lista de todas as operações de garimpo.
 */
export async function getSearches() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('finder_searches')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}