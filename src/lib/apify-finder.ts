/**
 * lib/apify-finder.ts
 * Integração com a API do Apify para scraping do Google Maps.
 *
 * Ator recomendado: compass/crawler-google-places
 * Documentação: https://apify.com/compass/crawler-google-places
 *
 * Variáveis de ambiente necessárias:
 * APIFY_TOKEN            - Token da API do Apify (console.apify.com > Settings > Integrations)
 * APIFY_MAPS_ACTOR_ID    - Opcional, padrão: compass~crawler-google-places
 */

const APIFY_TOKEN   = process.env.APIFY_TOKEN!
const APIFY_BASE    = 'https://api.apify.com/v2'
const DEFAULT_ACTOR = 'compass~crawler-google-places'

export interface ApifyRunResult {
  id: string
  status: string
  startedAt: string
  finishedAt?: string
  stats?: { itemCount: number }
}

export interface ApifyMapsItem {
  placeId?: string
  title?: string
  categoryName?: string
  address?: string
  phone?: string
  website?: string
  url?: string
  location?: { lat: number; lng: number }
  totalScore?: number
  reviewsCount?: number
  reviews?: {
    name?: string
    stars?: number
    text?: string
    publishedAtDate?: string
  }[]
}

/**
 * Dispara um ator no Apify com os parâmetros da busca.
 * Retorna os dados do run criado (id, status).
 */
export async function startMapsScraping(params: {
  searchTerms: string[]
  regions: string[]
  maxResults: number
  webhookUrl?: string
}): Promise<ApifyRunResult> {
  const actorId  = process.env.APIFY_MAPS_ACTOR_ID || DEFAULT_ACTOR
  const endpoint = `${APIFY_BASE}/acts/${encodeURIComponent(actorId)}/runs?token=${APIFY_TOKEN}`

  // Combina termos + regiões em queries para o Maps
  const searchStringsArray = params.regions.length > 0
    ? params.searchTerms.flatMap(term =>
        params.regions.map(region => `${term} ${region}`)
      )
    : params.searchTerms

  const input: Record<string, unknown> = {
    searchStringsArray,
    maxCrawledPlacesPerSearch: Math.max(
      10,
      Math.ceil(params.maxResults / Math.max(searchStringsArray.length, 1))
    ),
    language:       'pt-BR',
    countryCode:    'br',
    includeReviews: true,
    maxReviews:     30,
    reviewsSort:    'newest',
    reviewsTranslation: 'originalAndTranslated',
  }

  // Webhook opcional (requer URL pública — use ngrok em dev)
  if (params.webhookUrl) {
    input.webhooks = [
      {
        eventTypes:  ['ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED'],
        requestUrl:  params.webhookUrl,
        payloadTemplate: JSON.stringify({
          searchId: '{{eventData.searchId}}',
          runId:    '{{resource.id}}',
          status:   '{{resource.status}}',
        }),
      },
    ]
  }

  const res = await fetch(endpoint, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(input),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Apify API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.data as ApifyRunResult
}

/**
 * Consulta o status atual de um run do Apify.
 */
export async function getRunStatus(runId: string): Promise<ApifyRunResult> {
  const res = await fetch(
    `${APIFY_BASE}/actor-runs/${runId}?token=${APIFY_TOKEN}`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) throw new Error(`Apify status error ${res.status}`)
  const data = await res.json()
  return data.data as ApifyRunResult
}

/**
 * Baixa todos os itens do dataset de um run concluído.
 * Limita a 500 itens por segurança.
 */
export async function getRunItems(runId: string): Promise<ApifyMapsItem[]> {
  const res = await fetch(
    `${APIFY_BASE}/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&clean=true&limit=500`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) throw new Error(`Apify dataset error ${res.status}`)
  return res.json()
}

/**
 * Mapeia o status do Apify para o status interno do Finder.
 */
export function mapApifyStatus(apifyStatus: string): string {
  const map: Record<string, string> = {
    READY:     'running',
    RUNNING:   'running',
    SUCCEEDED: 'processing',
    FAILED:    'failed',
    ABORTED:   'failed',
    TIMED_OUT: 'failed',
  }
  return map[apifyStatus] ?? 'running'
}