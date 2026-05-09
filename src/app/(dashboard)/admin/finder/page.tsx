import { Suspense } from "react"
import { createClient } from "@/lib/server"
import { Search, Activity, CheckCircle2, Clock } from "lucide-react"
import { SearchForm } from "./components/search-form"
import { SearchesList } from "./components/searches-list"
import { Skeleton } from "@/components/ui/skeleton"

async function getStats(supabase: any) {
  const [total, completed, running] = await Promise.all([
    supabase.from('finder_searches').select('id', { count: 'exact', head: true }),
    supabase.from('finder_searches').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('finder_searches').select('id', { count: 'exact', head: true }).in('status', ['running', 'processing']),
  ])
  return {
    total:     total.count     || 0,
    completed: completed.count || 0,
    running:   running.count   || 0,
  }
}

async function getSearches(supabase: any) {
  const { data } = await supabase
    .from('finder_searches')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function BuscasPage() {
  const supabase = await createClient()
  const [stats, searches] = await Promise.all([
    getStats(supabase),
    getSearches(supabase),
  ])

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-20 mt-2 animate-in fade-in duration-700">

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Finder · Buscas</h1>
          <p className="text-[13px] font-light text-gray-500 mt-1">
            Garimpo inteligente de oportunidades via Google Maps + Apify
          </p>
        </div>

        {/* KPIs inline */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <Activity strokeWidth={1.5} className="size-4 text-gray-400" />
            <span className="text-[13px] font-semibold text-gray-900">{stats.total}</span>
            <span className="text-[11px] text-gray-400">buscas</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <CheckCircle2 strokeWidth={1.5} className="size-4 text-emerald-600" />
            <span className="text-[13px] font-semibold text-emerald-700">{stats.completed}</span>
            <span className="text-[11px] text-emerald-500">concluídas</span>
          </div>
          {stats.running > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl">
              <Clock strokeWidth={1.5} className="size-4 text-blue-600 animate-pulse" />
              <span className="text-[13px] font-semibold text-blue-700">{stats.running}</span>
              <span className="text-[11px] text-blue-500">em curso</span>
            </div>
          )}
        </div>
      </section>

      {/* Form Nova Busca */}
      <section className="mb-8">
        <SearchForm />
      </section>

      {/* Lista de buscas */}
      <section className="bg-white border border-gray-100 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-50">
          <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
            <Search strokeWidth={1.5} className="size-4 text-gray-600" />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">Operações de Garimpo</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {searches.length} busca{searches.length !== 1 ? 's' : ''} registrada{searches.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-40 m-6 rounded-2xl" />}>
          <SearchesList searches={searches} />
        </Suspense>
      </section>

      {/* Guia rápido de setup */}
      <section className="mt-8 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/50 rounded-3xl">
        <h3 className="text-[13px] font-semibold text-gray-700 mb-3">⚡ Setup rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] text-gray-600">
          <div className="space-y-1">
            <p className="font-semibold text-gray-700">1. Variáveis de ambiente</p>
            <code className="block bg-white/80 px-3 py-2 rounded-xl border border-blue-100 font-mono text-[11px] text-gray-700">
              APIFY_TOKEN=seu_token<br />
              OPENAI_API_KEY=sua_chave
            </code>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-700">2. Webhook (produção)</p>
            <p className="text-gray-500">Configure <code className="bg-white/80 px-1 rounded">NEXT_PUBLIC_SITE_URL</code> para receber callbacks automáticos do Apify.</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-700">3. Processamento</p>
            <p className="text-gray-500">Em dev, após a coleta, clique <strong>"Processar IA"</strong> manualmente para gerar os leads com análise de dores.</p>
          </div>
        </div>
      </section>
    </div>
  )
}