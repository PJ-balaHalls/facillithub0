// src/app/(dashboard)/admin/lab/actions/activation.ts
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import { updateGithubConfig } from './github'

export async function getActivationPreviews() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lab_previews')
    .select('*, lab_templates(name, niche)')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  const all = data || []
  return {
    previews: all.filter(p => p.modo_previa),
    live:     all.filter(p => !p.modo_previa),
  }
}

export async function activateSite(previewId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  await supabase.rpc('activate_lab_preview', { p_preview_id: previewId })

  const { data: preview } = await supabase
    .from('lab_previews')
    .select('*')
    .eq('id', previewId)
    .single()

  if (preview?.github_repo) {
    try {
      const newConfig = {
        ...preview.config_json,
        modoPrevia: false,
        features: preview.features,
      }
      await updateGithubConfig(preview.github_repo, newConfig)
      await supabase
        .from('lab_previews')
        .update({ status: 'live', modo_previa: false, activated_at: new Date().toISOString() })
        .eq('id', previewId)
    } catch {}
  }

  revalidatePath('/admin/lab/ativacao')
  revalidatePath('/admin/lab/previews')
}

export async function deactivateSite(previewId: string) {
  const supabase = await createClient()
  await supabase
    .from('lab_previews')
    .update({ status: 'deactivated' })
    .eq('id', previewId)
  revalidatePath('/admin/lab/ativacao')
}