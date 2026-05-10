// src/app/(dashboard)/admin/lab/actions/previews.ts
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import type { LabNiche, ConfigJson } from '@/types/lab'
import { deployToGithubPages, updateGithubConfig } from './github'

const GITHUB_ORG = process.env.GITHUB_ORG || 'facillithub'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildSlug(companyName: string): string {
  return `${companyName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')}-${Date.now().toString(36)}`
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getPreviews() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lab_previews')
    .select('*, lab_templates(name, niche)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getPreviewById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lab_previews')
    .select('*, lab_templates(*)')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

// ─── GERAÇÃO ─────────────────────────────────────────────────────────────────

export async function generatePreview(input: {
  template_id:  string
  company_name: string
  niche:        LabNiche
  config:       ConfigJson
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { data: template } = await supabase
    .from('lab_templates')
    .select('*')
    .eq('id', input.template_id)
    .single()
  if (!template) throw new Error('Template não encontrado')

  const slug = buildSlug(input.company_name)

  const { data: preview, error: insertError } = await supabase
    .from('lab_previews')
    .insert({
      template_id:  input.template_id,
      company_name: input.company_name,
      niche:        input.niche,
      status:       'building',
      slug,
      config_json:  input.config,
      features:     template.default_features,
      generated_by: user.id,
      modo_previa:  true,
    })
    .select()
    .single()

  if (insertError) throw insertError

  try {
    const { repoName, pagesUrl } = await deployToGithubPages(
      template.github_template_repo,
      slug,
      input.config,
      template.default_features
    )
    await supabase
      .from('lab_previews')
      .update({ github_repo: repoName, preview_url: pagesUrl, status: 'live' })
      .eq('id', preview.id)
    revalidatePath('/admin/lab/previews')
    return { success: true, url: pagesUrl, previewId: preview.id }
  } catch (err: any) {
    await supabase
      .from('lab_previews')
      .update({ status: 'failed', error_log: err.message })
      .eq('id', preview.id)
    throw err
  }
}

// ─── ATUALIZAÇÃO DE CONFIG ────────────────────────────────────────────────────

export async function updatePreviewConfig(previewId: string, config: Partial<ConfigJson>) {
  const supabase = await createClient()
  const { data: preview } = await supabase
    .from('lab_previews')
    .select('*')
    .eq('id', previewId)
    .single()
  if (!preview) throw new Error('Preview não encontrado')

  const newConfig = { ...preview.config_json, ...config }
  await supabase
    .from('lab_previews')
    .update({ config_json: newConfig, status: 'building' })
    .eq('id', previewId)

  if (preview.github_repo) {
    try {
      await updateGithubConfig(preview.github_repo, newConfig)
      await supabase
        .from('lab_previews')
        .update({ status: 'live' })
        .eq('id', previewId)
    } catch (err: any) {
      await supabase
        .from('lab_previews')
        .update({ status: 'failed', error_log: err.message })
        .eq('id', previewId)
    }
  }
  revalidatePath('/admin/lab/previews')
}

// ─── STATUS ───────────────────────────────────────────────────────────────────

export async function refreshPreviewStatus(previewId: string) {
  const supabase = await createClient()
  const { data: preview } = await supabase
    .from('lab_previews')
    .select('github_repo, status')
    .eq('id', previewId)
    .single()
  if (!preview?.github_repo || preview.status !== 'building') return

  try {
    const res = await fetch(
      `https://${GITHUB_ORG}.github.io/${preview.github_repo}/`,
      { method: 'HEAD' }
    )
    if (res.ok) {
      await supabase
        .from('lab_previews')
        .update({ status: 'live' })
        .eq('id', previewId)
    }
  } catch {}
  revalidatePath('/admin/lab/previews')
}

export async function deletePreview(previewId: string) {
  const supabase = await createClient()
  await supabase.from('lab_previews').delete().eq('id', previewId)
  revalidatePath('/admin/lab/previews')
}