// src/app/(dashboard)/admin/lab/actions.ts
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import type { ConfigJson, LabNiche } from '@/types/lab'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_ORG   = process.env.GITHUB_ORG || 'facillithub'
const GH_API       = 'https://api.github.com'

// ─── GITHUB HELPERS ──────────────────────────────────────────────────────────

async function githubFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${GH_API}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept':        'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type':  'application/json',
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`[${options?.method || 'GET'} ${path}] -> GitHub API Error: ${body}`)
  }
  if (res.status === 204) return {}
  return res.json()
}

// ─── MOTOR DE PERSONALIZAÇÃO (HTML) ──────────────────────────────────────────

function generateMenuHtml(menuItems: any[]) {
  if (!menuItems || !menuItems.length) return '<p class="text-center opacity-50 py-10">Cardápio em atualização...</p>';
  return menuItems.map(item => `
    <div class="menu-item reveal">
      <div class="menu-item-header">
        <span class="menu-item-name">${item.nome}</span>
        <span class="menu-item-price">R$ ${item.preco}</span>
      </div>
      <p class="menu-item-desc">${item.descricao}</p>
    </div>
  `).join('');
}

async function deployToGithubPages(
  templateRepo: string,
  slug: string,
  config: any,
  features: any
): Promise<{ repoName: string; htmlUrl: string; pagesUrl: string }> {

  const repoName = `prev-${slug}`
  let cleanTemplate = templateRepo.trim()
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
    .replace(/\.git$/, '')

  // 1. Criar repositório do template
  await githubFetch(`/repos/${cleanTemplate}/generate`, {
    method: 'POST',
    body: JSON.stringify({
      owner: GITHUB_ORG,
      name: repoName,
      description: `Facillit Lab — Preview: ${config.nomeEmpresa || 'Cliente'}`,
      private: false,
      include_all_branches: false
    }),
  })

  // 2. Polling: Aguarda o repo existir (máximo 30s)
  let isReady = false;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000))
    try {
      await githubFetch(`/repos/${GITHUB_ORG}/${repoName}`)
      isReady = true; break;
    } catch {}
  }
  if (!isReady) throw new Error("O GitHub demorou demais para provisionar o repositório.")
  await new Promise(r => setTimeout(r, 2000))

  // 3. Processar Injeção de Identidade no HTML
  const indexData = await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/index.html`)
  let html = Buffer.from(indexData.content, 'base64').toString('utf-8')

  const tokens: Record<string, string> = {
    nomeEmpresa:      config.nomeEmpresa || "Nova Experiência",
    slogan:           config.slogan || "Excelência em cada detalhe",
    metaDescricao:    config.metaDescricao || "Venha viver uma experiência única conosco.",
    corPrimaria:      config.corPrimaria || "#b8860b",
    corPrimariaHover: config.corPrimariaHover || "#9a7209",
    fonteTitulo:      config.fonteTitulo || "Playfair Display",
    fonteCorpo:       config.fonteCorpo || "Inter",
    telefoneWhatsapp: config.telefoneWhatsapp || "",
    linkImagemHero:   config.linkImagemHero || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    linkImagemSobre:  config.linkImagemSobre || "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    sobreNosTitulo:   config.sobreNosTitulo || "Nossa Essência",
    sobreNosTexto:    config.sobreNosTexto || "Trabalhamos para entregar o melhor.",
    cidade:           config.cidade || "São Paulo",
    cardapioHtml:     generateMenuHtml(config.cardapio || []),
    featureFlagsCss: `
      ${!features?.menu_list ? '#menu { display: none !important; }' : ''}
      ${!features?.booking_form ? '#reserva { display: none !important; }' : ''}
      ${!features?.whatsapp_button ? '.whatsapp { display: none !important; }' : ''}
    `
  }

  for (const [key, val] of Object.entries(tokens)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), val)
  }

  // 4. Update index.html
  await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/index.html`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `🎨 style: identidade visual aplicada`,
      content: Buffer.from(html).toString('base64'),
      sha: indexData.sha
    }),
  })

  // 5. Update config.json
  const configContent = Buffer.from(JSON.stringify(config, null, 2)).toString('base64')
  try {
    await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/config.json`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'chore: config inicial', content: configContent }),
    })
  } catch (e) {}

  // 6. Ativar Pages
  try {
    await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/pages`, {
      method: 'POST',
      body: JSON.stringify({ source: { branch: 'main', path: '/' } }),
    })
  } catch (e) {}

  return { 
    repoName, 
    htmlUrl: `https://github.com/${GITHUB_ORG}/${repoName}`,
    pagesUrl: `https://${GITHUB_ORG}.github.io/${repoName}` 
  }
}

// ─── STATUS & TEMPLATES ──────────────────────────────────────────────────────

export async function checkEnvStatus() {
  return {
    GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
    GITHUB_ORG: !!process.env.GITHUB_ORG,
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    LAB_URL: !!process.env.NEXT_PUBLIC_LAB_BASE_URL,
  }
}

export async function createTemplate(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autorizado' }

  const { error } = await supabase.from('lab_templates').insert({
    name: formData.name,
    niche: formData.niche,
    description: formData.description,
    github_template_repo: formData.github_template_repo,
    preview_demo_url: formData.preview_demo_url,
    created_by: user.id,
    is_active: true,
    default_features: { whatsapp_button: true, booking_form: true, menu_list: true, seo_schema: true }
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/lab/templates')
  return { success: true }
}

export async function toggleTemplateStatus(id: string, is_active: boolean) {
  const supabase = await createClient()
  await supabase.from('lab_templates').update({ is_active }).eq('id', id)
  revalidatePath('/admin/lab/templates')
}

// ─── PREVIEWS & GERAÇÃO ──────────────────────────────────────────────────────

export async function generatePreview(input: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { data: template } = await supabase.from('lab_templates').select('*').eq('id', input.template_id).single()
  const slug = `${input.company_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`

  const { data: preview, error: insertError } = await supabase.from('lab_previews').insert({
    template_id: input.template_id,
    company_name: input.company_name,
    niche: input.niche,
    status: 'building',
    slug,
    config_json: input.config,
    features: template.default_features,
    generated_by: user.id,
    modo_previa: true
  }).select().single()

  if (insertError) throw insertError

  try {
    const { repoName, pagesUrl } = await deployToGithubPages(template.github_template_repo, slug, input.config, template.default_features)
    await supabase.from('lab_previews').update({ github_repo: repoName, preview_url: pagesUrl, status: 'live' }).eq('id', preview.id)
    revalidatePath('/admin/lab/previews')
    return { success: true, url: pagesUrl }
  } catch (err: any) {
    await supabase.from('lab_previews').update({ status: 'failed', error_log: err.message }).eq('id', preview.id)
    throw err
  }
}

export async function refreshPreviewStatus(previewId: string) {
  const supabase = await createClient()
  const { data: preview } = await supabase.from('lab_previews').select('github_repo, status').eq('id', previewId).single()
  if (!preview?.github_repo || preview.status !== 'building') return
  try {
    const res = await fetch(`https://${GITHUB_ORG}.github.io/${preview.github_repo}/`, { method: 'HEAD' })
    if (res.ok) { await supabase.from('lab_previews').update({ status: 'live' }).eq('id', previewId) }
  } catch {}
  revalidatePath('/admin/lab/previews')
}

export async function updatePreviewConfig(previewId: string, config: Partial<ConfigJson>) {
  const supabase = await createClient()
  const { data: preview } = await supabase.from('lab_previews').select('*').eq('id', previewId).single()
  if (!preview) throw new Error('Preview não encontrado')

  const newConfig = { ...preview.config_json, ...config }
  await supabase.from('lab_previews').update({ config_json: newConfig, status: 'building' }).eq('id', previewId)

  if (preview.github_repo) {
    try {
      // Update config.json no GitHub
      const existing = await githubFetch(`/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`)
      const content = Buffer.from(JSON.stringify(newConfig, null, 2)).toString('base64')
      await githubFetch(`/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`, {
        method: 'PUT',
        body: JSON.stringify({ message: 'chore: update config', content, sha: existing.sha }),
      })
      await supabase.from('lab_previews').update({ status: 'live' }).eq('id', previewId)
    } catch (err: any) {
      await supabase.from('lab_previews').update({ status: 'failed', error_log: err.message }).eq('id', previewId)
    }
  }
  revalidatePath('/admin/lab/previews')
  revalidatePath('/admin/lab/ativacao')
}

// ─── FEATURES & ATIVAÇÃO ─────────────────────────────────────────────────────

export async function toggleFeatureFlag(previewId: string, featureKey: string, enabled: boolean, config: Record<string, unknown> = {}) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('toggle_lab_feature', {
    p_preview_id: previewId, p_feature_key: featureKey, p_enabled: enabled, p_config: config,
  })
  if (error) throw error
  revalidatePath('/admin/lab/previews')
  revalidatePath('/admin/lab/ativacao')
}

export async function activateSite(previewId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { error: rpcError } = await supabase.rpc('activate_lab_preview', { p_preview_id: previewId })
  if (rpcError) throw rpcError

  const { data: preview } = await supabase.from('lab_previews').select('*').eq('id', previewId).single()
  if (preview?.github_repo) {
    try {
      const newConfig = { ...preview.config_json, modoPrevia: false, features: preview.features }
      const existing = await githubFetch(`/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`)
      const content = Buffer.from(JSON.stringify(newConfig, null, 2)).toString('base64')
      await githubFetch(`/repos/${GITHUB_ORG}/${preview.github_repo}/contents/config.json`, {
        method: 'PUT',
        body: JSON.stringify({ message: '🚀 chore: site ativado - produção', content, sha: existing.sha }),
      })
      await supabase.from('lab_previews').update({ status: 'live' }).eq('id', previewId)
    } catch {}
  }
  revalidatePath('/admin/lab/ativacao')
  revalidatePath('/admin/lab/previews')
}

// ─── FORMULÁRIOS PÚBLICOS ────────────────────────────────────────────────────

export async function createFormToken(leadId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('lab_form_submissions').insert({ lead_id: leadId }).select('public_token').single()
  if (error) throw error
  return data.public_token
}

export async function processFormSubmission(token: string) {
  const supabase = await createClient()
  const { data: sub } = await supabase.from('lab_form_submissions').select('*').eq('public_token', token).single()
  if (!sub) throw new Error('Não encontrado')
  await supabase.from('lab_form_submissions').update({ status: 'processing', processed_at: new Date().toISOString() }).eq('id', sub.id)
  revalidatePath('/admin/lab/previews')
  return sub
}