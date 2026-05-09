/**
 * lib/ai-finder.ts
 * Motor de IA para análise de avaliações e geração de score de oportunidade.
 *
 * Agora usa Google Gemini (gemini-1.5-flash) – gratuito até 1500 req/dia.
 *
 * Variáveis de ambiente necessárias:
 *   GEMINI_API_KEY - Chave da API do Google AI (aistudio.google.com)
 */

export interface PainExcerpt {
  category: string
  label:    string
  excerpt:  string
  severity: 'high' | 'medium' | 'low'
}

export interface CompanyAnalysis {
  score:           number       // 0-100
  pain_categories: string[]
  pain_excerpts:   PainExcerpt[]
  ai_summary:      string
}

// Taxonomia das dores digitais identificáveis (mesma original)
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

/**
 * Analisa avaliações e retorna dores digitais + score.
 * Fallback para metadados quando não há textos suficientes.
 */
export async function analyzeCompany(params: {
  name:         string
  rating?:      number
  reviewCount?: number
  hasWebsite?:  boolean
  reviews:      { rating: number; text: string }[]
}): Promise<CompanyAnalysis> {
  const { name, rating, reviewCount, hasWebsite, reviews } = params

  let baseScore = 0
  if (!hasWebsite) baseScore += 30

  const textReviews = reviews
    .filter(r => r.text && r.text.trim().length > 15)
    .slice(0, 25)

  if (textReviews.length < 2) {
    return {
      score:           baseScore,
      pain_categories: hasWebsite ? [] : ['no_website'],
      pain_excerpts:   hasWebsite
        ? []
        : [{ category: 'no_website', label: PAIN_LABELS.no_website, excerpt: 'Empresa sem site cadastrado.', severity: 'high' }],
      ai_summary: `${name} possui ${reviewCount || 0} avaliações e nota ${rating || '?'}. ${
        hasWebsite ? '' : 'Não possui website cadastrado.'
      } Dados insuficientes para análise de dores digitais via IA.`,
    }
  }

  const reviewBlock = textReviews
    .map((r, i) => `[${i + 1}] (${r.rating}★) ${r.text}`)
    .join('\n')

  const prompt = `Você é um analista de infraestrutura digital para negócios locais brasileiros.

Analise as avaliações do estabelecimento "${name}" e identifique menções de problemas com presença digital.

AVALIAÇÕES:
${reviewBlock}

CATEGORIAS DE DORES DIGITAIS:
${Object.entries(PAIN_LABELS).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

REGRAS:
- Inclua SOMENTE dores mencionadas explicitamente nas avaliações
- O excerpt deve ser um trecho REAL da avaliação (máx 120 caracteres)
- severity: "high" se reclamação direta, "medium" se indireta, "low" se menção leve
- score 0-100: quanto maior, maior a oportunidade de venda de infraestrutura digital
- Se não houver dores digitais, retorne pains vazio e score baixo (0-20)

Responda SOMENTE com JSON válido, sem markdown:
{
  "pains": [
    { "category": "no_whatsapp", "excerpt": "trecho real da avaliação", "severity": "high" }
  ],
  "score": 65,
  "summary": "1-2 frases descrevendo a principal oportunidade digital neste negócio"
}`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
          responseMimeType: 'application/json', // força saída JSON puro
        },
      }),
    })

    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`)

    const data = await res.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) throw new Error('Resposta vazia do Gemini')

    const content = JSON.parse(rawText)

    const pains: PainExcerpt[] = (content.pains || []).map((p: any) => ({
      category: p.category,
      label:    PAIN_LABELS[p.category] || p.category,
      excerpt:  p.excerpt,
      severity: p.severity || 'medium',
    }))

    if (!hasWebsite && !pains.find(p => p.category === 'no_website')) {
      pains.unshift({
        category: 'no_website',
        label:    PAIN_LABELS.no_website,
        excerpt:  'Empresa sem website cadastrado no Google Maps.',
        severity: 'high',
      })
    }

    const finalScore = Math.min(100, Math.max(0, (content.score || 0) + baseScore))

    return {
      score:           finalScore,
      pain_categories: [...new Set(pains.map(p => p.category))],
      pain_excerpts:   pains,
      ai_summary:      content.summary || '',
    }
  } catch (err) {
    console.error('[ai-finder] Erro na análise:', err)
    return {
      score:           baseScore,
      pain_categories: hasWebsite ? [] : ['no_website'],
      pain_excerpts:   [],
      ai_summary:      `Análise automática indisponível. Score baseado em dados estruturais.`,
    }
  }
}

/**
 * Score de oportunidade baseado apenas em dados estruturais (fallback).
 */
export function structuralScore(params: {
  rating?:      number
  reviewCount?: number
  hasWebsite?:  boolean
  hasPhone?:    boolean
}): number {
  let score = 0
  if (!params.hasWebsite) score += 30
  if (!params.hasPhone)   score += 15

  if (params.rating && params.rating < 3.5 && (params.reviewCount || 0) > 20) score += 25
  else if (params.rating && params.rating < 4.0) score += 15

  if ((params.reviewCount || 0) < 10) score += 10

  return Math.min(100, score)
}