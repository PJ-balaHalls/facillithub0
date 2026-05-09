'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient }   from '@/lib/server'
import { startMapsScraping, getRunStatus, mapApifyStatus } from '@/lib/apify-finder'

/**
 * Cria uma nova configuração de busca e dispara o scraping no Apify.
 */
export async function createSearch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const name        = formData.get('name')        as string
  const termsRaw    = formData.get('searchTerms') as string
  const regionsRaw  = formData.get('regions')     as string
  const maxResults  = parseInt(formData.get('maxResults') as string || '50', 10)
  const radiusKm    = parseInt(formData.get('radiusKm')   as string || '5',  10)

  const searchTerms = termsRaw.split('\n').map(t => t.trim()).filter(Boolean)
  const regions     = regionsRaw.split('\n').map(r => r.trim()).filter(Boolean)

  if (!name || searchTerms.length === 0) {
    throw new Error('Nome e pelo menos 1 termo de busca são obrigatórios')
  }

  // Cria registro no banco primeiro
  const { data: search, error } = await supabase
    .from('finder_searches')
    .insert({
      created_by:   user.id,
      name,
      search_terms: searchTerms,
      regions:      regions,
      max_results:  maxResults,
      radius_km:    radiusKm,
      status:       'pending',
    })
    .select()
    .single()

  if (error || !search) {
    throw new Error('Erro ao criar busca: ' + error?.message)
  }

  // Dispara o Apify (webhook opcional — use NEXT_PUBLIC_SITE_URL)
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/finder/webhook`
      : undefined

    const run = await startMapsScraping({ searchTerms, regions, maxResults, webhookUrl })

    await supabase
      .from('finder_searches')
      .update({ status: 'running', apify_run_id: run.id })
      .eq('id', search.id)
  } catch (apifyErr: any) {
    // Mesmo se o Apify falhar, preserva o registro para reprocessamento
    await supabase
      .from('finder_searches')
      .update({ status: 'failed', error_message: 'Falha ao iniciar Apify: ' + apifyErr.message })
      .eq('id', search.id)
    throw new Error('Falha ao iniciar scraping: ' + apifyErr.message)
  }

  revalidatePath('/admin/finder/buscas')
  return { searchId: search.id }
}

/**
 * Sincroniza o status de uma busca com o Apify e,
 * se concluído, dispara o processamento via API.
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
    await supabase
      .from('finder_searches')
      .update({ status: mapped })
      .eq('id', searchId)
  }

  revalidatePath('/admin/finder/buscas')
  return { status: mapped, apifyStatus: run.status }
}

/**
 * Dispara o processamento manual de uma busca (via API route).
 * Atualizado com injeção de cookies para manter a sessão do usuário.
 */
export async function processSearch(searchId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // 1. Extrai os cookies da requisição atual (do usuário logado)
  const cookieStore = await cookies()
  const cookieString = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

  // 2. Repassa os cookies na chamada para a API Route
  const res = await fetch(`${siteUrl}/api/finder/process`, {
    method:  'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': cookieString // Injeção de autenticação aqui
    },
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

/**
 * Exclui uma busca e todos os dados associados.
 */
export async function deleteSearch(searchId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  await supabase.from('finder_searches').delete().eq('id', searchId)
  revalidatePath('/admin/finder/buscas')
}

/**
 * Lista todas as buscas do banco.
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