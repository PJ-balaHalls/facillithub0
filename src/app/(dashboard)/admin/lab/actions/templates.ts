// src/app/(dashboard)/admin/lab/actions/templates.ts
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function checkEnvStatus() {
  return {
    GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
    GITHUB_ORG:   !!process.env.GITHUB_ORG,
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    LAB_URL:      !!process.env.NEXT_PUBLIC_LAB_BASE_URL,
  }
}

export async function getTemplates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lab_templates')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getActiveTemplates() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lab_templates')
    .select('id, name, niche, default_features, default_tokens, description')
    .eq('is_active', true)
  return data || []
}

export async function createTemplate(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autorizado' }

  const { error } = await supabase.from('lab_templates').insert({
    name:                 formData.name,
    niche:                formData.niche,
    description:          formData.description,
    github_template_repo: formData.github_template_repo,
    thumbnail_url:        formData.thumbnail_url || null,
    preview_demo_url:     formData.preview_demo_url || null,
    created_by:           user.id,
    is_active:            true,
    default_features: {
      whatsapp_button: true,
      booking_form:    true,
      menu_list:       true,
      seo_schema:      true,
      google_maps:     true,
      gallery:         false,
      instagram_feed:  false,
      carousel:        false,
    },
    default_tokens: {
      fonteTitulo: formData.fonteTitulo || 'Playfair Display',
      fonteCopo:   formData.fonteCopo   || 'Inter',
    },
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/lab/templates')
  return { success: true }
}

export async function updateTemplate(id: string, data: Partial<{
  name: string
  description: string
  thumbnail_url: string
  preview_demo_url: string
  default_features: Record<string, boolean>
  default_tokens: Record<string, string>
}>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('lab_templates')
    .update(data)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/lab/templates')
}

export async function toggleTemplateStatus(id: string, is_active: boolean) {
  const supabase = await createClient()
  await supabase.from('lab_templates').update({ is_active }).eq('id', id)
  revalidatePath('/admin/lab/templates')
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('lab_templates').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/lab/templates')
}