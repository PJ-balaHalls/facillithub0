import { Suspense } from "react"
import { createClient } from "@/lib/server"
import Link from "next/link"
import { 
  Activity, CheckCircle2, Clock, BarChart3, 
  Users, ArrowUpRight, ShieldCheck, Zap 
} from "lucide-react"
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
    total: total.count || 0,
    completed: completed.count || 0,
    running: running.count || 0,
  }
}

// ✅ EXPORTAÇÃO PADRÃO OBRIGATÓRIA (REACT COMPONENT)
export default async function FinderPage() {
  const supabase = await createClient()
  
  const { data: searches } = await supabase
    .from('finder_searches')
    .select('*')
    .order('created_at', { ascending: false })

  const stats = await getStats(supabase)

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Finder Intelligence</h1>
          <p className="text-muted-foreground text-sm font-light">Mapeamento de infraestrutura digital para negócios locais.</p>
        </div>
        <SearchForm />
      </header>

      {/* Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-36">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Varreduras Totais</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-gray-900">{stats.total}</span>
            <Activity className="size-6 text-gray-200" />
          </div>
        </div>
        <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-36">
          <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-widest">Finalizados</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-gray-900">{stats.completed}</span>
            <CheckCircle2 className="size-6 text-emerald-100" />
          </div>
        </div>
        <div className={`p-8 border rounded-[2.5rem] shadow-sm flex flex-col justify-between h-36 ${stats.running > 0 ? 'bg-blue-50/50 border-blue-100 animate-pulse' : 'bg-white border-gray-100'}`}>
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Ativos</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-gray-900">{stats.running}</span>
            <Clock className="size-6 text-gray-200" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <main className="lg:col-span-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center gap-3">
            <BarChart3 className="size-5 text-blue-500" />
            <h2 className="font-bold text-gray-900 text-lg">Histórico</h2>
          </div>
          <Suspense fallback={<div className="p-10 space-y-6"><Skeleton className="h-20 w-full rounded-2xl" /></div>}>
            <SearchesList searches={searches || []} />
          </Suspense>
        </main>

        <aside className="lg:col-span-4 space-y-6">
          <div className="p-10 bg-gray-900 rounded-[3rem] text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-white/10 rounded-2xl">
                <Zap className="size-5 text-yellow-400 fill-yellow-400" />
              </div>
              <h3 className="text-xs font-bold uppercase opacity-80">Infra Performance</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[12px] text-gray-400">AI Engine</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="size-3" /> ONLINE
                </span>
              </div>
            </div>
          </div>
          <Link href="/admin/vendas/leads" className="flex items-center justify-between p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] group hover:bg-blue-100 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <Users className="size-6 text-[#5CA3FF]" />
              <span className="text-md font-bold text-[#5CA3FF]">Ver Leads</span>
            </div>
            <ArrowUpRight className="size-5 text-[#5CA3FF]" />
          </Link>
        </aside>
      </div>
    </div>
  )
}