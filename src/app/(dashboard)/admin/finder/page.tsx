/**
 * src/app/(dashboard)/admin/finder/page.tsx
 * Página modular do Finder Inteligente.
 * Organizada em blocos independentes para manutenção segura.
 */

import { Suspense } from "react"
import { createClient } from "@/lib/server"
import Link from "next/link"
import { 
  Search, Activity, CheckCircle2, Clock, 
  BarChart3, Users, ArrowUpRight, ShieldCheck, Zap
} from "lucide-react"
import { SearchDrawer } from "./components/search-drawer"
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

export default async function FinderPage() {
  const supabase = await createClient()
  const [stats, searches] = await Promise.all([
    getStats(supabase),
    getSearches(supabase),
  ])

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-20 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* BLOCO 1: Header Estratégico & Drawer de Configuração */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Facillit Finder</h1>
          <p className="text-[14px] font-light text-gray-500 max-w-md">
            Garimpo autônomo de inteligência digital para negócios locais.
          </p>
        </div>

        {/* Componente Drawer (Lado Direito) */}
        <SearchDrawer />
      </header>

      {/* BLOCO 2: Grid de Métricas (Módulos Independentes) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total de Operações</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
            <Activity className="size-5 text-gray-200" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Garimpos Finalizados</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900">{stats.completed}</span>
            <CheckCircle2 className="size-5 text-emerald-100" />
          </div>
        </div>

        <div className={`p-6 border rounded-[2rem] shadow-sm flex flex-col justify-between h-32 transition-all ${
          stats.running > 0 ? 'bg-blue-50/50 border-blue-100 animate-pulse' : 'bg-white border-gray-100'
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${stats.running > 0 ? 'text-blue-500' : 'text-gray-400'}`}>
            Processamento Ativo
          </span>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${stats.running > 0 ? 'text-blue-700' : 'text-gray-900'}`}>{stats.running}</span>
            <Clock className={`size-5 ${stats.running > 0 ? 'text-blue-200' : 'text-gray-200'}`} />
          </div>
        </div>
      </section>

      {/* BLOCO 3: Área Operacional (Layout Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Lista de Histórico (Módulo Principal) */}
        <main className="lg:col-span-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50">
            <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
              <BarChart3 strokeWidth={1.5} className="size-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">Histórico de Inteligência</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Gestão de extrações e status de análise</p>
            </div>
          </div>

          <Suspense fallback={<div className="p-10 space-y-4"><Skeleton className="h-20 w-full rounded-2xl" /></div>}>
            <SearchesList searches={searches} />
          </Suspense>
        </main>

        {/* Lado Direito: Infra & Deep Links (Módulos de Apoio) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Status da Infra */}
          <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white/10 rounded-xl">
                <Zap className="size-4 text-yellow-400 fill-yellow-400" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest">System Health</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[11px] text-gray-400">Scraper Engine</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="size-3" /> ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[11px] text-gray-400">AI Analyzer</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="size-3" /> GEMINI 1.5
                </span>
              </div>
            </div>
          </div>

          {/* Deep Link para o CRM */}
          <Link 
            href="/admin/vendas/leads"
            className="flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-[2rem] group hover:bg-blue-100 transition-all shadow-sm hover:shadow-blue-500/10"
          >
            <div className="flex items-center gap-3">
              <Users className="size-5 text-[#5CA3FF]" />
              <span className="text-sm font-bold text-[#5CA3FF]">Acessar CRM de Leads</span>
            </div>
            <ArrowUpRight className="size-4 text-[#5CA3FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </aside>
      </div>
    </div>
  )
}