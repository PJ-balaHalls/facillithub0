import { 
  ArrowRight, Search, Target, Rocket, 
  TrendingUp, Users, Activity, MapPin, 
  Clock, Server, CheckCircle2, ShieldAlert, 
  MessageCircle, Wallet, Zap, Layers
} from "lucide-react"
import Link from "next/link"

// ============================================================================
// BLOCOS COMPONENTIZADOS (PODE APAGAR OU MOVER SEM QUEBRAR A PÁGINA)
// ============================================================================

function HeaderBlock() {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Bom dia, Operação</h1>
        <p className="text-[13px] font-light text-gray-500 mt-1">Visão geral da sua fábrica de clientes e automações.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-900 text-[13px] font-medium rounded-full transition-all border border-gray-200/60 shadow-sm">
          Auditar Inteligência
        </button>
        <button className="px-5 py-2.5 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white text-[13px] font-medium rounded-full transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2">
          <Zap className="size-3.5 fill-white" /> Deploy Rápido
        </button>
      </div>
    </section>
  )
}

function AlertsBlock() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
        <ShieldAlert className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-amber-900">3 Leads Quentes Parados</p>
          <p className="text-[11px] text-amber-700 mt-0.5">Negócios com dor explícita aguardando abordagem no WhatsApp.</p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
        <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-emerald-900">Novo Setup Confirmado</p>
          <p className="text-[11px] text-emerald-700 mt-0.5">Pizzaria Bela Napoli realizou o pagamento via Stripe.</p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
        <Rocket className="size-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-blue-900">2 Deploys Concluídos</p>
          <p className="text-[11px] text-blue-700 mt-0.5">As prévias da "Fábrica" estão prontas para demonstração.</p>
        </div>
      </div>
    </section>
  )
}

function KpisBlock() {
  const kpis = [
    { title: "Receita Mensal (MRR)", value: "R$ 8.450", change: "+12%", trend: "up", icon: TrendingUp },
    { title: "Clientes Ativos", value: "42", change: "+4", trend: "up", icon: Users },
    { title: "Leads Qualificados (>4.5)", value: "1.204", change: "+148", trend: "up", icon: Target },
    { title: "Taxa de Conversão", value: "8.2%", change: "+1.1%", trend: "up", icon: Activity },
  ]
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div key={i} className="p-5 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 rounded-xl"><kpi.icon strokeWidth={1.5} className="size-4 text-gray-700" /></div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {kpi.change}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-500">{kpi.title}</p>
          <h3 className="text-2xl font-semibold tracking-tight text-gray-900 mt-1">{kpi.value}</h3>
        </div>
      ))}
    </section>
  )
}

function ShortcutsBlock() {
  const shortcuts = [
    { label: "Garimpar Local", desc: "Configurar Apify", icon: Search, href: "/admin/finder/buscas" },
    { label: "Análise de Dores", desc: "Revisão Gemini", icon: Target, href: "/admin/finder/analise" },
    { label: "Central de Vendas", desc: "Disparos WPP", icon: MessageCircle, href: "/admin/vendas/crm" },
    { label: "Fábrica de Sites", desc: "Gestão Lab", icon: Rocket, href: "/admin/lab/previews" },
    { label: "Gestão Financeira", desc: "Faturas Stripe", icon: Wallet, href: "/admin/faturamento" },
    { label: "Catálogo Evolutivo", desc: "Upsell Clientes", icon: Layers, href: "/admin/insights/catalogo" },
  ]
  return (
    <section>
      <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">Atalhos Operacionais</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {shortcuts.map((action, i) => (
          <Link key={i} href={action.href} className="group p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all shadow-sm hover:shadow-md flex flex-col items-start gap-4">
            <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <action.icon strokeWidth={1.5} className="size-5 text-gray-600 group-hover:text-[#5CA3FF] transition-colors" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">{action.label}</p>
              <p className="text-[11px] font-medium text-gray-500 mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function FinderRadarBlock() {
  return (
    <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">Radar de Oportunidades (IA)</h2>
          <p className="text-[12px] font-light text-gray-500 mt-1">Negócios mapeados com dores de infraestrutura explícitas.</p>
        </div>
        <Link href="/admin/finder/leads" className="text-[11px] font-semibold text-[#5CA3FF] flex items-center gap-1 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-full uppercase tracking-wider">
          Ver Funil <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="divide-y divide-gray-50 flex-1">
        {[
          { nome: "Clínica Odonto Vida", dor: "Sem botão de WhatsApp e site quebrado", score: "4.9", city: "São Paulo, SP" },
          { nome: "Pizzaria Bela Napoli", dor: "Cardápio em PDF ilegível no Maps", score: "4.7", city: "Campinas, SP" },
          { nome: "Barbearia do João", dor: "Reclamações de telefone não atende", score: "4.6", city: "Curitiba, PR" },
        ].map((lead, i) => (
          <div key={i} className="py-4 flex justify-between items-center group">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-gray-50 rounded-xl border border-gray-100"><MapPin strokeWidth={1.5} className="size-4 text-gray-500" /></div>
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900">{lead.nome} <span className="text-[11px] font-normal text-gray-400 ml-2">{lead.city}</span></h3>
                <p className="text-[11px] text-red-500 font-semibold mt-1 uppercase tracking-wider bg-red-50 inline-block px-2 py-0.5 rounded-md">Identificado: {lead.dor}</p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-bold rounded-lg border border-emerald-100">
              ★ {lead.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DeployEngineBlock() {
  return (
    <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-full">
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900 mb-6">Motor de Deploy (Lab)</h2>
      <div className="space-y-6">
        {[
          { cliente: "Odonto Vida", status: "Building", time: "Há 2 min", active: true },
          { cliente: "Bela Napoli", status: "Concluído", time: "Há 15 min", active: false },
          { cliente: "Mecânica Auto", status: "Falhou", time: "Há 1 hora", active: false, error: true },
          { cliente: "Restaurante Sabor", status: "Na Fila", time: "Há 2 horas", active: false, pending: true },
        ].map((job, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex size-3">
                {job.active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5CA3FF] opacity-75"></span>}
                <span className={`relative inline-flex rounded-full size-3 ${job.error ? 'bg-red-500' : job.active ? 'bg-[#5CA3FF]' : job.pending ? 'bg-gray-200' : 'bg-emerald-500'}`}></span>
              </span>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">{job.cliente}</p>
                <p className="text-[11px] font-medium text-gray-400 mt-0.5">{job.time}</p>
              </div>
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${job.error ? 'bg-red-50 text-red-600' : job.active ? 'bg-blue-50 text-[#5CA3FF]' : job.pending ? 'bg-gray-50 text-gray-500' : 'bg-emerald-50 text-emerald-600'}`}>
              {job.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PipelineBlock() {
  return (
    <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900 mb-6">Pipeline de Vendas (Sniper)</h2>
      <div className="space-y-6">
        {[
          { step: "Abordagens Hoje", count: 24, percent: "100%", color: "bg-gray-200" },
          { step: "Prévias Enviadas (Demos)", count: 8, percent: "33%", color: "bg-[#5CA3FF]" },
          { step: "Fechamentos (Setup Pago)", count: 2, percent: "8%", color: "bg-emerald-400" },
        ].map((pipe, i) => (
          <div key={i}>
            <div className="flex justify-between text-[12px] text-gray-700 mb-2 font-semibold">
              <span>{pipe.step} <span className="text-gray-400 font-medium">({pipe.count})</span></span>
              <span>{pipe.percent}</span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
              <div className={`h-full ${pipe.color} rounded-full`} style={{ width: pipe.percent }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SystemHealthBlock() {
  return (
    <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900 mb-6">Saúde das APIs</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { nome: "Apify Crawler", status: "Operacional", icon: Search },
          { nome: "OpenAI Gemini", status: "Operacional", icon: Target },
          { nome: "GitHub Actions", status: "Latência", icon: Server, warn: true },
          { nome: "Stripe Billing", status: "Operacional", icon: Wallet },
        ].map((api, i) => (
          <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><api.icon strokeWidth={1.5} className="size-4 text-gray-700" /></div>
            <div>
              <p className="text-[12px] font-semibold text-gray-900">{api.nome}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`size-1.5 rounded-full ${api.warn ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{api.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MONTAGEM FINAL DA PÁGINA (CHAMANDO OS BLOCOS)
// ============================================================================

export default async function AdminDashboardPage() {
  // Simulador de carregamento assíncrono para você ver o Skeleton Premium
  await new Promise(resolve => setTimeout(resolve, 800))

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-700 pb-20 mt-2">
      <HeaderBlock />
      <AlertsBlock />
      <KpisBlock />
      
      <hr className="border-t border-gray-200/60 w-full" />
      
      <ShortcutsBlock />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2"><FinderRadarBlock /></div>
        <div><DeployEngineBlock /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineBlock />
        <SystemHealthBlock />
      </div>
    </div>
  )
}