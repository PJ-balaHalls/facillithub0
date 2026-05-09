'use server'

import { revalidatePath } from 'next/cache'
import { createClient }   from '@/lib/server'
import { startMapsScraping, getRunStatus, mapApifyStatus } from '@/lib/apify-finder'

/**
 * Cria uma nova configuração de busca e dispara o scraping no Apify.
 * Agora suporta batch_size e priority_mode (Oportunidade Ouro).
 */
export async function createSearch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const name         = formData.get('name')         as string
  const termsRaw     = formData.get('searchTerms')  as string
  const regionsRaw   = formData.get('regions')      as string
  const maxResults   = parseInt(formData.get('maxResults') as string || '50', 10)
  const radiusKm     = parseInt(formData.get('radiusKm')   as string || '5',  10)
  
  // Novos Campos
  const batchSize    = parseInt(formData.get('batch_size') as string || '10', 10)
  const priorityMode = formData.get('priority_mode') as string || 'standard'

  const searchTerms = termsRaw.split('\n').map(t => t.trim()).filter(Boolean)
  const regions     = regionsRaw.split('\n').map(r => r.trim()).filter(Boolean)

  if (!name || searchTerms.length === 0) {
    throw new Error('Nome e pelo menos 1 termo de busca são obrigatórios')
  }

  // Cria registro no banco
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
    throw new Error('Erro ao criar busca: ' + error?.message)
  }

  try {
    const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`
      : undefined

    const run = await startMapsScraping({ searchTerms, regions, maxResults, webhookUrl })

    await supabase
      .from('finder_searches')
      .update({ status: 'running', apify_run_id: run.id })
      .eq('id', search.id)
  } catch (apifyErr: any) {
    await supabase
      .from('finder_searches')
      .update({ status: 'failed', error_message: 'Falha ao iniciar Apify: ' + apifyErr.message })
      .eq('id', search.id)
    throw new Error('Falha ao iniciar scraping: ' + apifyErr.message)
  }

  revalidatePath('/admin/finder/buscas')
  return { searchId: search.id }
}

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

  revalidatePath('/admin/finder/buscas')
  return { status: mapped, apifyStatus: run.status }
}

export async function processSearch(searchId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const res = await fetch(`${siteUrl}/api/finder/process`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ searchId }),
    cache:   'no-store',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Falha no processamento')
  }

  revalidatePath('/admin/finder/buscas')
  revalidatePath('/admin/finder/leads')
  return res.json()
}

export async function deleteSearch(searchId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')
  await supabase.from('finder_searches').delete().eq('id', searchId)
  revalidatePath('/admin/finder/buscas')
}

export async function getSearches() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('finder_searches')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}