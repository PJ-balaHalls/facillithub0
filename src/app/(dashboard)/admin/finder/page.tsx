// src/app/(dashboard)/admin/finder/page.tsx
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

export default async function FinderPage() {
  const supabase = await createClient()
  
  const { data: searches } = await supabase
    .from('finder_searches')
    .select('*')
    .order('created_at', { ascending: false })

  const stats = await getStats(supabase)

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">Finder Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Mapeamento de infraestrutura digital para negócios locais.
          </p>
        </div>
        <SearchForm />
      </header>

      {/* Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-muted/40 text-primary">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Varreduras Totais</p>
              <p className="text-2xl font-semibold tracking-tight">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/10 text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Finalizados</p>
              <p className="text-2xl font-semibold tracking-tight">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stats.running > 0 ? 'bg-blue-500/10 text-blue-500' : 'bg-muted/40 text-muted-foreground'}`}>
              <Clock size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Ativos</p>
              <p className="text-2xl font-semibold tracking-tight">{stats.running}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <main className="lg:col-span-8 rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/60 flex items-center gap-4">
            <BarChart3 className="text-muted-foreground" size={20} />
            <h2 className="text-lg font-medium">Histórico de Operações</h2>
          </div>
          <Suspense fallback={<div className="p-6 flex flex-col gap-4"><Skeleton className="h-20 w-full rounded-2xl" /><Skeleton className="h-20 w-full rounded-2xl" /></div>}>
            <SearchesList searches={searches || []} />
          </Suspense>
        </main>

        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-muted/40 text-primary">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-medium">Infra Performance</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-background">
                <span className="text-sm font-medium">Motor de IA</span>
                <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <ShieldCheck size={16} /> ONLINE
                </span>
              </div>
            </div>
          </div>
          
          <Link 
            href="/admin/vendas/leads" 
            className="flex items-center justify-between h-11 rounded-xl px-4 border border-border/60 bg-card hover:bg-muted/40 transition-all duration-200 ease-in-out text-sm font-medium shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Acessar CRM de Leads</span>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground" />
          </Link>
        </aside>
      </div>
    </div>
  )
}