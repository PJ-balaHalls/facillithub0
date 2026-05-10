// src/app/(dashboard)/admin/lab/actions.ts
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import type { ConfigJson, LabNiche } from '@/types/lab'

// ─── GITHUB HELPERS ──────────────────────────────────────────────────────────

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_ORG   = process.env.GITHUB_ORG || 'facillithub'
const GH_API       = 'https://api.github.com'

async function githubFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${GH_API}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept':        'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type':  'application/json',
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API ${res.status}: ${body}`)
  }
  return res.json()
}

/**
 * Cria um repo a partir de um template e commita o config.json
 * Returns: { repoName, htmlUrl, pagesUrl }
 */
async function deployToGithubPages(
  templateRepo: string,
  slug: string,
  config: ConfigJson
): Promise<{ repoName: string; htmlUrl: string; pagesUrl: string }> {

  const repoName = `prev-${slug}`

  // 1. Criar repositório a partir do template
  await githubFetch(`/repos/${templateRepo}/generate`, {
    method: 'POST',
    body: JSON.stringify({
      owner:       GITHUB_ORG,
      name:        repoName,
      description: `Facillit Lab — Prévia: ${config.nomeEmpresa}`,
      private:     false,
      include_all_branches: false,
    }),
  })

  // 2. Aguardar o repo existir (GitHub Pages leva ~2s para criar)
  await new Promise(r => setTimeout(r, 3000))

  // 3. Obter SHA do config.json existente (ou criar se não existir)
  let existingSha: string | undefined
  try {
    const existing = await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/config.json`)
    existingSha = existing.sha
  } catch { /* arquivo não existe ainda, ok */ }

  // 4. Commitar o config.json com os dados do cliente
  const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64')
  await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/config.json`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `chore: config inicial — ${config.nomeEmpresa}`,
      content,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  })

  // 5. Ativar GitHub Pages (branch main, pasta root)
  try {
    await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/pages`, {
      method: 'POST',
      body: JSON.stringify({ source: { branch: 'main', path: '/' } }),
    })
  } catch { /* Pages pode já estar ativo via template */ }

  const pagesUrl = `https://${GITHUB_ORG}.github.io/${repoName}`
  const htmlUrl  = `https://github.com/${GITHUB_ORG}/${repoName}`

  return { repoName, htmlUrl, pagesUrl }
}

// ─── TEMPLATES ───────────────────────────────────────────────────────────────

export async function createTemplate(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { error } = await supabase.from('lab_templates').insert({
    name:                 formData.get('name') as string,
    niche:                formData.get('niche') as LabNiche,
    description:          formData.get('description') as string,
    github_template_repo: formData.get('github_template_repo') as string,
    thumbnail_url:        formData.get('thumbnail_url') as string || null,
    preview_demo_url:     formData.get('preview_demo_url') as string || null,
    created_by:           user.id,
  })

  if (error) throw error
  revalidatePath('/admin/lab/templates')
}

export async function toggleTemplateStatus(id: string, is_active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('lab_templates')
    .update({ is_active })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/admin/lab/templates')
}

// ─── PREVIEWS ────────────────────────────────────────────────────────────────

export interface GeneratePreviewInput {
  template_id: string
  lead_id?: string
  company_name: string
  niche: LabNiche
  config: ConfigJson
}

export async function generatePreview(input: GeneratePreviewInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  // Buscar template
  const { data: template } = await supabase
    .from('lab_templates')
    .select('*')
    .eq('id', input.template_id)
    .single()
  if (!template) throw new Error('Template não encontrado')

  // Gerar slug único
  const baseSlug = input.company_name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
    .slice(0, 40)
  const slug = `${baseSlug}-${Date.now().toString(36)}`

  // Criar registro com status "building"
  const { data: preview, error: insertError } = await supabase
    .from('lab_previews')
    .insert({
      template_id:  input.template_id,
      lead_id:      input.lead_id || null,
      slug,
      company_name: input.company_name,
      niche:        input.niche,
      config_json:  input.config,
      features:     template.default_features,
      status:       'building',
      modo_previa:  true,
      generated_by: user.id,
    })
    .select()
    .single()

  if (insertError) throw insertError

  // Log
  await supabase.from('lab_deployment_logs').insert({
    preview_id:  preview.id,
    status:      'building',
    message:     'Geração iniciada — conectando ao GitHub',
    triggered_by: user.id,
  })

  // Deploy (em produção isso seria um background job; aqui é síncrono)
  try {
    const { repoName, pagesUrl } = await deployToGithubPages(
      template.github_template_repo,
      slug,
      { ...input.config, modoPrevia: true, features: template.default_features }
    )

    await supabase.from('lab_previews').update({
      github_repo: repoName,
      preview_url: pagesUrl,
      status:      'live',
    }).eq('id', preview.id)

    await supabase.from('lab_deployment_logs').insert({
      preview_id: preview.id,
      status:     'live',
      message:    `Deploy concluído: ${pagesUrl}`,
      triggered_by: user.id,
    })

  } catch (err: any) {
    await supabase.from('lab_previews').update({
      status:    'failed',
      error_log: err.message,
    }).eq('id', preview.id)

    await supabase.from('lab_deployment_logs').insert({
      preview_id: preview.id,
      status:     'failed',
      message:    `Erro: ${err.message}`,
      triggered_by: user.id,
    })

    throw err
  }

  revalidatePath('/admin/lab/previews')
  return preview
}

export async function refreshPreviewStatus(previewId: string) {
  const supabase = await createClient()
  const { data: preview } = await supabase
    .from('lab_previews')
    .select('github_repo, status')
    .eq('id', previewId)
    .single()

  if (!preview?.github_repo || preview.status !== 'building') return

  // Verificar se o GitHub Pages já está no ar
  try {
    const res = await fetch(`https://${GITHUB_ORG}.github.io/${preview.github_repo}/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      await supabase.from('lab_previews')
        .update({ status: 'live' })
        .eq('id', previewId)
    }
  } catch { /* ainda buildando */ }

  revalidatePath('/admin/lab/previews')
}

export async function updatePreviewConfig(previewId: string, config: Partial<ConfigJson>) {
  const supabase = await createClient()
  const { data: preview } = await supabase
    .from('lab_previews')
    .select('config_json, github_repo')
    .eq('id', previewId)
    .single()

  if (!preview) throw new Error('Preview não encontrado')

  const newConfig = { ...preview.config_json, ...config }

  await supabase.from('lab_previews')
    .update({ config_json: newConfig, status: 'building' })
    .eq('id', previewId)

  // Re-commit o config.json no GitHub
  if (preview.github_repo) {
    try {
      const existing = await githubFetch(
        `/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`
      )
      const content = Buffer.from(JSON.stringify(newConfig, null, 2)).toString('base64')
      await githubFetch(
        `/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: 'chore: atualização de config',
            content,
            sha: existing.sha,
          }),
        }
      )
      await supabase.from('lab_previews').update({ status: 'live' }).eq('id', previewId)
    } catch (err: any) {
      await supabase.from('lab_previews').update({
        status: 'failed', error_log: err.message
      }).eq('id', previewId)
    }
  }

  revalidatePath('/admin/lab/previews')
  revalidatePath('/admin/lab/ativacao')
}

// ─── FEATURE FLAGS ───────────────────────────────────────────────────────────

export async function toggleFeatureFlag(
  previewId: string,
  featureKey: string,
  enabled: boolean,
  config: Record<string, unknown> = {}
) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('toggle_lab_feature', {
    p_preview_id:  previewId,
    p_feature_key: featureKey,
    p_enabled:     enabled,
    p_config:      config,
  })

  if (error) throw error
  revalidatePath('/admin/lab/previews')
  revalidatePath('/admin/lab/ativacao')
}

// ─── ATIVAÇÃO ────────────────────────────────────────────────────────────────

export async function activateSite(previewId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  // Chama a função RPC que remove o modo prévia
  const { error } = await supabase.rpc('activate_lab_preview', {
    p_preview_id: previewId,
  })
  if (error) throw error

  // Re-commit o config.json sem o modo prévia
  const { data: preview } = await supabase
    .from('lab_previews')
    .select('config_json, github_repo, features')
    .eq('id', previewId)
    .single()

  if (preview?.github_repo) {
    try {
      const newConfig = { ...preview.config_json, modoPrevia: false, features: preview.features }
      const existing  = await githubFetch(
        `/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`
      )
      const content = Buffer.from(JSON.stringify(newConfig, null, 2)).toString('base64')
      await githubFetch(
        `/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`,
        {
          method: 'PUT',
          body: JSON.stringify({
            message: '🚀 chore: ativação do site — modo prévia removido',
            content,
            sha: existing.sha,
          }),
        }
      )
      await supabase.from('lab_previews').update({ status: 'live' }).eq('id', previewId)
    } catch { /* log já criado pelo RPC */ }
  }

  revalidatePath('/admin/lab/ativacao')
  revalidatePath('/admin/lab/previews')
}

// ─── FORMULÁRIOS PÚBLICOS ────────────────────────────────────────────────────

export async function createFormToken(leadId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lab_form_submissions')
    .insert({ lead_id: leadId })
    .select('public_token')
    .single()
  if (error) throw error
  return data.public_token
}

export async function processFormSubmission(token: string) {
  const supabase = await createClient()
  const { data: submission } = await supabase
    .from('lab_form_submissions')
    .select('*')
    .eq('public_token', token)
    .single()

  if (!submission) throw new Error('Formulário não encontrado')
  if (submission.status !== 'pending') throw new Error('Formulário já processado')

  await supabase.from('lab_form_submissions').update({
    status:       'processing',
    processed_at: new Date().toISOString(),
  }).eq('id', submission.id)

  revalidatePath('/admin/lab/previews')
  return submission
}