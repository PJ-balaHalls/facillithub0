'use server'

import { revalidatePath } from 'next/cache'
import { createClient }   from '@/lib/server'

export type LeadStatus = 'new' | 'contacted' | 'demo' | 'converted' | 'rejected'

/**
 * Lista leads com filtros opcionais.
 */
export async function getLeads(params?: {
  searchId?:  string
  status?:    LeadStatus
  minScore?:  number
  category?:  string
  limit?:     number
  offset?:    number
}) {
  const supabase = await createClient()

  let query = supabase
    .from('finder_leads')
    .select(`
      id, score, pain_categories, pain_excerpts, ai_summary, status, created_at,
      finder_companies (
        id, name, category, address, phone, website, rating,
        review_count, google_maps_url, has_website, place_id
      ),
      finder_searches (
        id, name
      )
    `)
    .order('score', { ascending: false })
    .limit(params?.limit || 50)

  if (params?.searchId)  query = query.eq('search_id', params.searchId)
  if (params?.status)    query = query.eq('status',    params.status)
  if (params?.minScore)  query = query.gte('score',    params.minScore)
  if (params?.category)  query = query.contains('pain_categories', [params.category])
  if (params?.offset)    query = query.range(params.offset, (params.offset + (params.limit || 50)) - 1)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

/**
 * Atualiza o status de um lead (pipeline de vendas).
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { error } = await supabase
    .from('finder_leads')
    .update({ status })
    .eq('id', leadId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/finder/leads')
}

/**
 * Busca os reviews de uma empresa específica.
 */
export async function getCompanyReviews(companyId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('finder_reviews')
    .select('id, author, rating, text, published_at')
    .eq('company_id', companyId)
    .order('rating', { ascending: true }) // negativos primeiro
    .limit(30)

  if (error) throw new Error(error.message)
  return data || []
}

/**
 * Retorna estatísticas dos leads para filtros.
 */
export async function getLeadStats(searchId?: string) {
  const supabase = await createClient()

  let query = supabase.from('finder_leads').select('score, status, pain_categories')
  if (searchId) query = query.eq('search_id', searchId)

  const { data } = await query
  if (!data) return { total: 0, byStatus: {}, avgScore: 0, topCategories: [] }

  const byStatus: Record<string, number> = {}
  const catCount: Record<string, number> = {}
  let totalScore = 0

  for (const lead of data) {
    byStatus[lead.status] = (byStatus[lead.status] || 0) + 1
    totalScore += lead.score || 0
    for (const cat of (lead.pain_categories || [])) {
      catCount[cat] = (catCount[cat] || 0) + 1
    }
  }

  const topCategories = Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, count]) => ({ cat, count }))

  return {
    total:         data.length,
    byStatus,
    avgScore:      data.length ? Math.round(totalScore / data.length) : 0,
    topCategories,
  }
}