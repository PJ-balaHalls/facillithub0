/**
 * lib/ai-finder.ts
 * Motor de IA para análise de avaliações e geração de score de oportunidade.
 * Suporta o modo "Oportunidade Ouro" para focar em ausência de infraestrutura.
 * Versão melhorada com caching, pré‑filtro, validação e prompt refinado.
 */

export interface PainExcerpt {
  category: string
  label:    string
  excerpt:  string
  severity: 'high' | 'medium' | 'low'
  confidence?: number  // 0–1 probabilidade de a dor ser real
}

export interface CompanyAnalysis {
  score:           number       // 0-100
  pain_categories: string[]
  pain_excerpts:   PainExcerpt[]
  ai_summary:      string
}

export const PAIN_LABELS: Record<string, string> = {
  no_website:           'Site inexistente ou quebrado',
  no_whatsapp:          'WhatsApp não responde',
  no_online_booking:    'Sem agendamento online',
  poor_digital_presence:'Difícil de encontrar online',
  outdated_google:      'Google desatualizado (horário/fotos)',
  no_online_menu:       'Sem cardápio digital',
  poor_communication:   'Não responde mensagens/redes',
  no_online_payment:    'Sem pagamento online/integração',
  outdated_info:        'Informações erradas na internet',
}

// ── Cache simples em memória ───────────────────────────────────
const analysisCache = new Map<string, { result: CompanyAnalysis; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 30 // 30 minutos

// ── Filtro de relevância para avaliações ────────────────────────
// Palavras-chave que indicam dores digitais (minúsculo)
const DIGITAL_PAIN_KEYWORDS = [
  'site', 'whatsapp', 'cardápio', 'menu', 'agendamento', 'agenda',
  'online', 'internet', 'instagram', 'facebook', 'rede social',
  'horário', 'telefone', 'contato', 'reserva', 'pagamento',
  'pix', 'cartão', 'comprar', 'pedido', 'entrega', 'ifood',
  'não encontrei', 'não achei', 'não tem', 'não funciona',
  'quebrado', 'desatualizado', 'difícil', 'sumiu', 'cadê'
]

function isReviewRelevant(review: { rating: number; text: string }): boolean {
  // Ficam apenas avaliações com nota baixa (1-3) ou que mencionem palavras-chave
  if (review.rating <= 3) return true
  const lower = review.text.toLowerCase()
  return DIGITAL_PAIN_KEYWORDS.some(kw => lower.includes(kw))
}

// ── Validação de trecho (excerpt) ─────────────────────────────
function excerptExistsInReviews(excerpt: string, reviews: string[]): boolean {
  if (!excerpt || excerpt.length < 10) return false
  const norm = excerpt.toLowerCase().replace(/[^a-z0-9á-ú\s]/g, '')
  return reviews.some(rev => {
    const revNorm = rev.toLowerCase().replace(/[^a-z0-9á-ú\s]/g, '')
    return revNorm.includes(norm)
  })
}

// ── Fallback heurístico (se a API falhar) ─────────────────────
function heuristicPainExtraction(
  reviews: { rating: number; text: string }[],
  hasWebsite: boolean
): { pains: PainExcerpt[]; score: number; summary: string } {
  const pains: PainExcerpt[] = []
  let mentionCount = 0

  if (!hasWebsite) {
    pains.push({
      category: 'no_website',
      label: PAIN_LABELS.no_website,
      excerpt: 'Empresa sem website registrado no Google.',
      severity: 'high',
      confidence: 1
    })
    mentionCount++
  }

  // Varredura simples por palavras-chave
  for (const r of reviews) {
    const txt = r.text.toLowerCase()
    if (txt.includes('whatsapp') && (txt.includes('não responde') || txt.includes('não atende') || txt.includes('ignorou'))) {
      pains.push({ category: 'no_whatsapp', label: PAIN_LABELS.no_whatsapp, excerpt: r.text, severity: 'high', confidence: 0.7 })
      mentionCount++
    }
    if ((txt.includes('cardápio') || txt.includes('menu')) && (txt.includes('não tem') || txt.includes('não achei') || txt.includes('sem'))) {
      pains.push({ category: 'no_online_menu', label: PAIN_LABELS.no_online_menu, excerpt: r.text, severity: 'medium', confidence: 0.6 })
      mentionCount++
    }
    if (txt.includes('agendamento') || txt.includes('agenda online')) {
      pains.push({ category: 'no_online_booking', label: PAIN_LABELS.no_online_booking, excerpt: r.text, severity: 'medium', confidence: 0.5 })
      mentionCount++
    }
  }

  const score = Math.min(100, mentionCount * 15 + (hasWebsite ? 0 : 25))
  return {
    pains: pains.slice(0, 5), // no máximo 5 dores no fallback
    score,
    summary: `Análise automática (IA indisponível). ${mentionCount} indícios de dor digital encontrados.`
  }
}

// ── Prompt refinado com few‑shot ───────────────────────────────
function buildPrompt(name: string, reviewsBlock: string, isGold: boolean): string {
  const modeInstruction = isGold
    ? `FOCO PRIORITÁRIO (OPORTUNIDADE OURO): identifique principalmente:
- Reclamações sobre falta de site, cardápio digital, Instagram/Facebook inexistentes ou desatualizados.
- Clientes que sugerem que a empresa "precisava ter um site" ou "não tem como ver preços".
- Dê atenção máxima a essas evidências.`
    : 'Identifique todas as dores digitais (site, WhatsApp, agendamento, menu, etc.).'

  const fewShotExample = `Exemplo de resposta JSON:
{
  "pains": [
    {
      "category": "no_website",
      "excerpt": "não tem site, tive que ligar",
      "severity": "high",
      "confidence": 0.95,
      "justification": "Cliente reclama explicitamente da ausência de site."
    },
    {
      "category": "no_online_menu",
      "excerpt": "cardápio online tá desatualizado, preços errados",
      "severity": "medium",
      "confidence": 0.8,
      "justification": "Menção a cardápio online com informações incorretas."
    }
  ],
  "score": 70,
  "summary": "A empresa carece de site e seu cardápio digital está desatualizado, sugerindo necessidade urgente de infraestrutura."
}`

  return `Você é um analista de infraestrutura digital para negócios locais brasileiros.
Analise as avaliações do estabelecimento "${name}".

${modeInstruction}

AVALIAÇÕES (somente as relevantes):
${reviewsBlock}

CATEGORIAS DE DORES (use exatamente essas strings como "category"):
${Object.entries(PAIN_LABELS).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

REGRAS RÍGIDAS:
1. O campo "excerpt" DEVE ser uma frase EXATA retirada de uma avaliação (copie e cole).
2. Não invente nenhum trecho. Se não houver evidência clara, não crie a dor.
3. "confidence" deve refletir quão certa a IA está daquela dor (0 a 1). Baseie-se na clareza da menção e na quantidade de citações.
4. O "score" (0-100) representa a urgência de investimento em presença digital. ${isGold ? 'Se houver menção à falta de site/menu, o score deve ser ≥ 70.' : ''}
5. O "summary" deve ser um parágrafo conciso em português explicando os principais problemas.

${fewShotExample}

Responda APENAS com o JSON.`
}

// ── Função principal (mantém assinatura original) ──────────────
export async function analyzeCompany(params: {
  name:         string
  rating?:      number
  reviewCount?: number
  hasWebsite?:  boolean
  reviews:      { rating: number; text: string }[]
  priorityMode?: 'standard' | 'gold_opportunity'
}): Promise<CompanyAnalysis> {
  const { name, rating, reviewCount, hasWebsite = false, reviews, priorityMode } = params

  // 1. Pré‑filtra as reviews relevantes
  const relevantReviews = reviews
    .filter(r => r.text && r.text.trim().length > 15 && isReviewRelevant(r))
    .slice(0, 25)

  // Se não houver reviews suficientes, mantém lógica original simples
  if (relevantReviews.length < 2) {
    return {
      score: hasWebsite ? 0 : (priorityMode === 'gold_opportunity' ? 50 : 30),
      pain_categories: hasWebsite ? [] : ['no_website'],
      pain_excerpts: hasWebsite
        ? []
        : [{ category: 'no_website', label: PAIN_LABELS.no_website, excerpt: 'Empresa sem site cadastrado.', severity: 'high', confidence: 1 }],
      ai_summary: `${name} possui ${reviewCount || 0} avaliações. ${hasWebsite ? 'Possui site.' : 'Não possui website.'} Dados insuficientes para análise profunda via IA.`
    }
  }

  // 2. Cache key simples (nome + hash das reviews) e cache hit
  const cacheKey = `${name}|${hasWebsite}|${relevantReviews.map(r => r.text).join('|')}`
  const cached = analysisCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.result
  }

  // 3. Monta bloco de reviews para o prompt
  const reviewBlock = relevantReviews
    .map((r, i) => `[${i + 1}] (${r.rating}★) ${r.text}`)
    .join('\n')

  const isGold = priorityMode === 'gold_opportunity'
  const prompt = buildPrompt(name, reviewBlock, isGold)

  // 4. Função de retry com backoff
  async function callGemini(retries = 2): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1000,
              responseMimeType: 'application/json',
            },
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}')
      } catch (err) {
        console.warn(`[ai-finder] Tentativa ${attempt} falhou:`, err)
        if (attempt === retries) throw err
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt))) // backoff exponencial
      }
    }
    throw new Error('Todas as tentativas de chamada à API falharam')
  }

  // 5. Processamento principal (com fallback)
  try {
    const content = await callGemini()

    // 6. Validação e montagem das dores
    const rawPains: any[] = content.pains || []
    const validReviewsTexts = relevantReviews.map(r => r.text)
    
    const pains: PainExcerpt[] = rawPains
      .filter((p: any) => p.category && PAIN_LABELS[p.category]) // só categorias válidas
      .map((p: any) => ({
        category: p.category,
        label:    PAIN_LABELS[p.category],
        excerpt:  p.excerpt || '',
        severity: p.severity || 'medium',
        confidence: typeof p.confidence === 'number' ? p.confidence : 0.5,
      }))
      .filter(p => excerptExistsInReviews(p.excerpt, validReviewsTexts)) // só trechos reais

    // 7. Força a dor "no_website" se for o caso e ainda não estiver presente
    if (!hasWebsite && !pains.some(p => p.category === 'no_website')) {
      pains.unshift({
        category: 'no_website',
        label: PAIN_LABELS.no_website,
        excerpt: 'Não possui website cadastrado no Google Maps.',
        severity: 'high',
        confidence: 1,
      })
    }

    // 8. Score final (IA + base se não tiver site). O bônus do gold é interno ao prompt.
    let baseScore = 0
    if (!hasWebsite) baseScore = 20 // reduzi para não inflar, pois a IA já pondera
    const aiScore = typeof content.score === 'number' ? content.score : 0
    const finalScore = Math.min(100, Math.max(0, aiScore + baseScore))

    const result: CompanyAnalysis = {
      score: finalScore,
      pain_categories: [...new Set(pains.map(p => p.category))],
      pain_excerpts: pains,
      ai_summary: content.summary || `${name} apresenta ${pains.length} dores digitais.`,
    }

    // 9. Armazena no cache e retorna
    analysisCache.set(cacheKey, { result, timestamp: Date.now() })
    return result

  } catch (error) {
    console.error('[ai-finder] Erro na chamada à IA, usando fallback heurístico:', error)
    // Fallback heurístico em caso de erro
    const fallback = heuristicPainExtraction(relevantReviews, hasWebsite)
    const result: CompanyAnalysis = {
      score: fallback.score,
      pain_categories: [...new Set(fallback.pains.map(p => p.category))],
      pain_excerpts: fallback.pains,
      ai_summary: fallback.summary,
    }
    // Cache também o fallback para não repetir erro imediatamente (TTL reduzido)
    analysisCache.set(cacheKey, { result, timestamp: Date.now() - CACHE_TTL + 1000 * 60 * 5 })
    return result
  }
}