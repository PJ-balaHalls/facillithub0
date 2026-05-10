// src/app/(dashboard)/admin/lab/actions/github.ts
'use server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_ORG   = process.env.GITHUB_ORG || 'facillithub'
const GH_API       = 'https://api.github.com'

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
    throw new Error(`GitHub API Error [${options?.method || 'GET'} ${path}]: ${res.status} - ${body}`)
  }
  if (res.status === 204) return {}
  return res.json()
}

function generateMenuHtml(menuItems: any[]) {
  if (!menuItems || !menuItems.length) return '<p class="text-center opacity-50 py-10">Cardápio em atualização...</p>';
  return menuItems.map(item => `
    <div class="menu-item reveal">
      <div class="menu-item-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span class="menu-item-name" style="font-weight: 700; font-size: 1.1rem;">${item.nome || item.name}</span>
        <span class="menu-item-price" style="color: var(--color-primary); font-weight: 800;">R$ ${item.preco || item.price}</span>
      </div>
      <p class="menu-item-desc" style="font-size: 0.85rem; color: #71717a; line-height: 1.4;">${item.descricao || ''}</p>
    </div>
  `).join('');
}

// ETAPA 1: Criar Repositório
export async function gh_provisionRepo(templateRepo: string, slug: string) {
  const repoName = `prev-${slug}`
  const cleanTemplate = templateRepo.trim()
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
    .replace(/\.git$/, '')

  await githubFetch(`/repos/${cleanTemplate}/generate`, {
    method: 'POST',
    body: JSON.stringify({
      owner: GITHUB_ORG,
      name: repoName,
      description: `Facillit Lab — Prévia gerada automaticamente`,
      private: false,
      include_all_branches: false,
    }),
  })

  // Polling Robusto: Aguarda o GitHub provisionar (até 30s)
  let isReady = false;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000))
    try {
      await githubFetch(`/repos/${GITHUB_ORG}/${repoName}`)
      isReady = true; break;
    } catch {}
  }
  if (!isReady) throw new Error("GitHub Timeout: O repositório demorou demais para ser criado.")
  await new Promise(r => setTimeout(r, 2000)) // Pausa de segurança

  return repoName;
}

// ETAPA 2: Injetar Identidade
export async function gh_injectIdentity(repoName: string, config: any, features: any) {
  const indexData = await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/index.html`)
  let html = Buffer.from(indexData.content, 'base64').toString('utf-8')

  const tokens: Record<string, string> = {
    nomeEmpresa:      config.nomeEmpresa || "Nova Experiência",
    slogan:           config.slogan || "Excelência garantida",
    corPrimaria:      config.corPrimaria || "#5CA3FF",
    corSecundaria:    config.corSecundaria || "#1A1A2E",
    fonteTitulo:      config.fonteTitulo || "Playfair Display",
    fonteCorpo:       config.fonteCopo || "Inter",
    telefoneWhatsapp: config.numeroWhatsApp || "",
    instagram:        config.instagram || "",
    endereco:         config.endereco || "",
    cardapioHtml:     generateMenuHtml(config.cardapio || []),
    featureFlagsCss: `
      ${!features?.menu_list ? '#menu, #cardapio { display: none !important; }' : ''}
      ${!features?.booking_form ? '#reserva, .booking-form { display: none !important; }' : ''}
      ${!features?.whatsapp_button ? '.whatsapp-float, .btn-whatsapp { display: none !important; }' : ''}
    `
  }

  for (const [key, val] of Object.entries(tokens)) {
    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
  }

  // Commit do HTML
  await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/index.html`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `🎨 style: identidade de ${tokens.nomeEmpresa} aplicada`,
      content: Buffer.from(html).toString('base64'),
      sha: indexData.sha
    }),
  })

  // Commit do Config
  const configContent = Buffer.from(JSON.stringify(config, null, 2)).toString('base64')
  try {
    await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/contents/config.json`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'chore: config inicial sincronizada', content: configContent }),
    })
  } catch (e) {}

  return true;
}

// ETAPA 3: Ativar Domínio
export async function gh_activatePages(repoName: string) {
  await githubFetch(`/repos/${GITHUB_ORG}/${repoName}/pages`, {
    method: 'POST',
    body: JSON.stringify({ source: { branch: 'main', path: '/' } }),
  })

  return {
    htmlUrl:  `https://github.com/${GITHUB_ORG}/${repoName}`,
    pagesUrl: `https://${GITHUB_ORG}.github.io/${repoName}`,
  }
}