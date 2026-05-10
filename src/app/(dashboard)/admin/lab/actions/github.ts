// src/app/(dashboard)/admin/lab/actions/github.ts
'use server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_ORG   = process.env.GITHUB_ORG || 'facillithub'
const GH_API       = 'https://api.github.com'

// ─── HELPER HTTP ─────────────────────────────────────────────────────────────

export async function githubFetch(path: string, options?: RequestInit) {
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
    throw new Error(`GitHub API Error [${options?.method || 'GET'} ${path}]: ${res.status} — ${body}`)
  }
  if (res.status === 204) return {}
  return res.json()
}

// ─── GERAÇÃO DE HTML COM TOKENS ──────────────────────────────────────────────

export function generateMenuHtml(menuItems: Array<{ nome: string; preco: string; descricao: string }>) {
  if (!menuItems?.length) return '<p class="empty-menu">Cardápio em atualização...</p>'
  return menuItems.map(item => `
    <div class="menu-item reveal">
      <div class="menu-item-header">
        <span class="menu-item-name">${item.nome}</span>
        <span class="menu-item-price">R$ ${item.preco}</span>
      </div>
      <p class="menu-item-desc">${item.descricao}</p>
    </div>
  `).join('')
}

// ─── DEPLOY COMPLETO ──────────────────────────────────────────────────────────

export async function deployToGithubPages(
  templateRepo: string,
  slug: string,
  config: Record<string, any>,
  features: Record<string, boolean>
): Promise<{ repoName: string; htmlUrl: string; pagesUrl: string }> {
  const repoName = `prev-${slug}`
  const cleanTemplate = templateRepo.trim()
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
    .replace(/\.git$/, '')

  // 1. Fork do template
  await githubFetch(`/repos/${cleanTemplate}/generate`, {
    method: 'POST',
    body: JSON.stringify({
      owner: GITHUB_ORG,
      name: repoName,
      description: `Facillit Lab — ${config.nomeEmpresa}`,
      private: false,
      include_all_branches: false,
    }),
  })

  // 2. Polling até repositório ficar disponível (máx 30s)
  let isReady = false
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000))
    try {
      await githubFetch(`/repos/${GITHUB_ORG}/${repoName}`)
      isReady = true
      break
    } catch {}
  }
  if (!isReady) throw new Error('GitHub Timeout: repositório demorou demais para provisionar.')
  await new Promise(r => setTimeout(r, 2000))

  // 3. Ler index.html do template
  const indexData = await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/index.html`)
  let html = Buffer.from(indexData.content, 'base64').toString('utf-8')

  // 4. Substituir tokens
  const tokens: Record<string, string> = {
    nomeEmpresa:      config.nomeEmpresa      || 'Empresa',
    slogan:           config.slogan           || 'Excelência garantida',
    descricao:        config.descricao        || '',
    corPrimaria:      config.corPrimaria      || '#5CA3FF',
    corSecundaria:    config.corSecundaria    || '#1A1A2E',
    fonteTitulo:      config.fonteTitulo      || 'Playfair Display',
    fonteCorpo:       config.fonteCopo        || 'Inter',
    telefoneWhatsapp: config.numeroWhatsApp   || '',
    instagram:        config.instagram        || '',
    facebook:         config.facebook         || '',
    endereco:         config.endereco         || '',
    email:            config.email            || '',
    urlMaps:          config.urlMaps          || '',
    cardapioHtml:     generateMenuHtml(config.cardapio || []),
    featureFlagsCss: [
      !features?.menu_list       ? '#menu, #cardapio { display: none !important; }' : '',
      !features?.booking_form    ? '#reservas, .booking-form { display: none !important; }' : '',
      !features?.whatsapp_button ? '.whatsapp-float, .btn-whatsapp { display: none !important; }' : '',
      !features?.google_maps     ? '.map-section, #localizacao iframe { display: none !important; }' : '',
      !features?.gallery         ? '#galeria, .gallery-section { display: none !important; }' : '',
      !features?.instagram_feed  ? '.instagram-feed { display: none !important; }' : '',
    ].filter(Boolean).join('\n'),
  }

  for (const [key, val] of Object.entries(tokens)) {
    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
  }

  // 5. Commit do HTML personalizado
  await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/index.html`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `🎨 style: identidade de ${tokens.nomeEmpresa} aplicada`,
      content: Buffer.from(html).toString('base64'),
      sha: indexData.sha,
    }),
  })

  // 6. Commit do config.json
  const configContent = Buffer.from(JSON.stringify(config, null, 2)).toString('base64')
  try {
    await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/config.json`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'chore: config inicial', content: configContent }),
    })
  } catch {}

  // 7. Ativar GitHub Pages
  try {
    await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/pages`, {
      method: 'POST',
      body: JSON.stringify({ source: { branch: 'main', path: '/' } }),
    })
  } catch {}

  return {
    repoName,
    htmlUrl:  `https://github.com/${GITHUB_ORG}/${repoName}`,
    pagesUrl: `https://${GITHUB_ORG}.github.io/${repoName}`,
  }
}

// ─── UPDATE CONFIG NO REPOSITÓRIO ────────────────────────────────────────────

export async function updateGithubConfig(repoName: string, config: Record<string, any>) {
  const existing = await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/config.json`)
  const content  = Buffer.from(JSON.stringify(config, null, 2)).toString('base64')
  await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/config.json`, {
    method: 'PUT',
    body: JSON.stringify({ message: 'chore: update config', content, sha: existing.sha }),
  })
}