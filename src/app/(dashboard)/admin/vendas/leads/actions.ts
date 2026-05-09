'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export type LeadStatus = 'new' | 'contacted' | 'demo' | 'converted' | 'rejected'

export async function getLeads() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('finder_leads')
    .select(`
      *,
      finder_companies (*),
      finder_searches (name)
    `)
    .order('score', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('finder_leads')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/vendas/leads')
}

export async function getCompanyReviews(companyId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('finder_reviews')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
  return data || []
}