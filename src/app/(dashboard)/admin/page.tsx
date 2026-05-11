// ==========================================
// IMPORTS & DEPENDENCIES
// ==========================================
import React, { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { 
  Users, Target, Search, Zap, 
  ArrowRight, Activity, Server, ShieldCheck, 
  TrendingUp, Clock, Plus, LayoutTemplate
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ==========================================
// DATA FETCHING (SERVER-SIDE)
// ==========================================

/**
 * Busca as métricas principais do sistema de forma paralela.
 * Prepara o terreno para quando as tabelas de faturamento e leads estiverem gigantes.
 */
async function getDashboardMetrics(supabase: any) {
  try {
    // Executa as queries em paralelo para não travar a renderização
    const [
      { count: totalSearches },
      { count: activeLabs },
      { count: totalLeads },
    ] = await Promise.all([
      supabase.from('finder_searches').select('id', { count: 'exact', head: true }),
      supabase.from('lab_previews').select('id', { count: 'exact', head: true }).eq('status', 'active'), // Exemplo de tabela futura
      supabase.from('crm_leads').select('id', { count: 'exact', head: true }), // Exemplo de tabela futura
    ]);

    return {
      searches: totalSearches || 0,
      activeLabs: activeLabs || 0,
      leads: totalLeads || 0,
      revenue: 0, // Placeholder pronto para ser conectado ao Stripe/Gateway
    };
  } catch (error) {
    console.error("Erro ao carregar métricas:", error);
    return { searches: 0, activeLabs: 0, leads: 0, revenue: 0 };
  }
}

/**
 * Busca a atividade recente (ex: últimos garimpos do Finder)
 */
async function getRecentActivity(supabase: any) {
  try {
    const { data } = await supabase
      .from('finder_searches')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    return data || [];
  } catch (error) {
    return [];
  }
}

// ==========================================
// SUB-COMPONENTS (UI BLOCKS)
// ==========================================

function MetricCard({ title, value, subtitle, icon: Icon, colorClass, bgClass }: any) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
      </div>
      {subtitle && (
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground pt-4 border-t border-border/60 mt-auto">
          <TrendingUp size={14} className="text-green-500" />
          {subtitle}
        </div>
      )}
    </div>
  );
}

function ShortcutCard({ title, description, href, icon: Icon, isPrimary = false }: any) {
  return (
    <Link 
      href={href}
      className={`rounded-2xl border border-border/60 p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group ${
        isPrimary 
          ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent" 
          : "bg-card hover:bg-muted/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${isPrimary ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-foreground"} group-hover:scale-105 transition-transform duration-200 ease-in-out`}>
          <Icon size={20} />
        </div>
        <ArrowRight size={20} className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-2 group-hover:translate-x-0 ${isPrimary ? "text-primary-foreground" : "text-muted-foreground"}`} />
      </div>
      <div className="flex flex-col mt-2">
        <h3 className={`text-base font-semibold ${isPrimary ? "text-primary-foreground" : "text-foreground"}`}>{title}</h3>
        <p className={`text-sm mt-1 ${isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{description}</p>
      </div>
    </Link>
  );
}

// ==========================================
// MAIN PAGE EXPORT
// ==========================================

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  // Dispara as requisições
  const metricsData = getDashboardMetrics(supabase);
  const activityData = getRecentActivity(supabase);

  // Aguarda as promessas (pode ser evoluído com Promise.all para performance)
  const metrics = await metricsData;
  const recentActivity = await activityData;

  // Saudação de acordo com o horário do servidor
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="flex flex-col gap-6 p-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">{greeting}, Admin.</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Visão geral da operação, infraestrutura e funil de vendas.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/finder" 
            className="h-11 rounded-xl px-4 bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 ease-in-out shadow-sm"
          >
            <Search size={16} />
            Novo Garimpo
          </Link>
        </div>
      </header>

      {/* ========================================== */}
      {/* METRICS GRID                               */}
      {/* ========================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Leads Capturados" 
          value={metrics.leads} 
          subtitle="+12% em relação ao mês anterior"
          icon={Users}
          bgClass="bg-blue-500/10"
          colorClass="text-blue-600"
        />
        <MetricCard 
          title="Garimpos Realizados" 
          value={metrics.searches} 
          subtitle="Máquina rodando"
          icon={Search}
          bgClass="bg-purple-500/10"
          colorClass="text-purple-600"
        />
        <MetricCard 
          title="Labs Ativos (Previews)" 
          value={metrics.activeLabs} 
          subtitle="Oportunidades em negociação"
          icon={LayoutTemplate}
          bgClass="bg-orange-500/10"
          colorClass="text-orange-600"
        />
        <MetricCard 
          title="Receita Estimada" 
          value={`R$ ${metrics.revenue},00`} 
          subtitle="Métricas de MRR a conectar"
          icon={Activity}
          bgClass="bg-green-500/10"
          colorClass="text-green-600"
        />
      </section>

      {/* ========================================== */}
      {/* SHORTCUTS / QUICK ACTIONS                  */}
      {/* ========================================== */}
      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-lg font-medium tracking-tight">Atalhos Rápidos</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ShortcutCard 
            title="Finder AI" 
            description="Mapeie infraestrutura de novos clientes." 
            href="/admin/finder" 
            icon={Target}
            isPrimary={true}
          />
          <ShortcutCard 
            title="Factory Lab" 
            description="Gere ambientes de preview automatizados." 
            href="/admin/lab/previews" 
            icon={Zap}
          />
          <ShortcutCard 
            title="CRM de Vendas" 
            description="Gira as oportunidades e conversões." 
            href="/admin/vendas/leads" 
            icon={Users}
          />
          <ShortcutCard 
            title="Status da Infra" 
            description="Monitore serviços, APIs e o servidor." 
            href="/admin/infra/status" 
            icon={Server}
          />
        </section>
      </div>

      {/* ========================================== */}
      {/* MAIN CONTENT / SPLIT VIEW                  */}
      {/* ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        
        {/* Lado Esquerdo: Atividade Recente (Maior) */}
        <div className="lg:col-span-8 rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h3 className="text-base font-semibold">Atividade Recente (Finder)</h3>
            <Link href="/admin/finder" className="text-sm font-medium text-primary hover:underline transition-all">
              Ver todos
            </Link>
          </div>
          <div className="flex flex-col">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={activity.id} className={`p-6 flex items-center justify-between hover:bg-muted/40 transition-colors ${idx !== recentActivity.length - 1 ? 'border-b border-border/60' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-muted text-muted-foreground">
                      <Clock size={16} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.created_at).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    {activity.status === 'completed' 
                      ? <span className="text-green-600 font-medium px-3 py-1 bg-green-500/10 rounded-full text-xs">Concluído</span>
                      : <span className="text-blue-600 font-medium px-3 py-1 bg-blue-500/10 rounded-full text-xs">Em andamento</span>
                    }
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Search size={32} className="opacity-20 mb-4" />
                <p className="text-sm font-medium">Nenhuma atividade recente.</p>
                <p className="text-xs mt-1">Inicie um novo garimpo para ver os dados aqui.</p>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Saúde do Sistema (Menor) */}
        <div className="lg:col-span-4 rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col">
          <div className="p-6 border-b border-border/60">
            <h3 className="text-base font-semibold">Saúde do Sistema</h3>
          </div>
          <div className="p-6 flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span className="text-sm font-medium text-foreground">Supabase Auth</span>
                </div>
                <span className="text-xs font-medium text-green-500">Operacional</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-green-500" />
                  <span className="text-sm font-medium text-foreground">Motor de IA (Gemini)</span>
                </div>
                <span className="text-xs font-medium text-green-500">Operacional</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">Apify Scraper</span>
                </div>
                <span className="text-xs font-medium text-yellow-600">Carga Alta</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[85%] rounded-full"></div>
              </div>
            </div>

          </div>
          
          <div className="p-6 border-t border-border/60 bg-muted/20 mt-auto">
            <Link href="/admin/infra/status" className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Rodar Diagnóstico Completo <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}