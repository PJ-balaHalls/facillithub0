import { 
  Users, Target, DollarSign, Activity, 
  ArrowUpRight, ArrowRight, ArrowDownRight
} from "lucide-react"
import Link from "next/link"

// Componente utilitário para os Cards de Métrica
function MetricCard({ title, value, change, icon: Icon, trendUp }: any) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="p-2 bg-gray-50 rounded-md">
          <Icon className="size-4 text-gray-600" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {trendUp ? (
            <ArrowUpRight className="size-3 text-emerald-500" />
          ) : (
            <ArrowDownRight className="size-3 text-red-500" />
          )}
          <span className={trendUp ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
            {change}
          </span>
          <span className="text-gray-400">vs. mês passado</span>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      {/* Header do Dashboard */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Painel de Comando</h1>
        <p className="text-sm text-gray-500">Resumo da sua operação diária. Foco na geração de receita e leads quentes.</p>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Receita Mensal (MRR)" value="R$ 4.250" change="+12%" icon={DollarSign} trendUp={true} />
        <MetricCard title="Leads Mapeados (> 4.2)" value="842" change="+24%" icon={Target} trendUp={true} />
        <MetricCard title="Clientes Ativos" value="28" change="+3" icon={Users} trendUp={true} />
        <MetricCard title="Falhas de Automação" value="2" change="-5%" icon={Activity} trendUp={false} />
      </div>

      {/* Seção de Operações Rápidas */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Painel Finder - Leads */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Descobertas Recentes</h2>
              <p className="text-xs text-gray-500 mt-1">Negócios locais com dores explícitas mapeadas.</p>
            </div>
            <Link href="/admin/finder/leads" className="text-xs text-[#5CA3FF] hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              Ver Funil <ArrowRight className="size-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Pizzaria Bela Vista", pain: "Sem link de pedido", score: "4.8" },
              { name: "Barbearia do João", pain: "Não responde WhatsApp", score: "4.5" },
              { name: "Clínica Vida Ativa", pain: "Informações confusas", score: "4.9" },
            ].map((lead, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs font-medium text-red-500 mt-0.5 uppercase tracking-wider">
                    DOR: {lead.pain}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Nota {lead.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel Motor de Deploy */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Motor Lab (Deploys)</h2>
              <p className="text-xs text-gray-500 mt-1">Status de geração dos templates via GitHub Actions.</p>
            </div>
            <Link href="/admin/lab/previews" className="text-xs text-[#5CA3FF] hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              Ir para o Lab <ArrowRight className="size-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Pizzaria Bela Vista (Prévia)", status: "Concluído", time: "Há 10 min", type: "success" },
              { name: "Restaurante Sabor (Setup)", status: "Construindo", time: "Agora", type: "building" },
              { name: "Estética Premium (Prévia)", status: "Falha no Build", time: "Há 1 hora", type: "error" },
            ].map((deploy, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    {deploy.type === "building" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5CA3FF] opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      deploy.type === "success" ? "bg-emerald-500" :
                      deploy.type === "error" ? "bg-red-500" : "bg-[#5CA3FF]"
                    }`}></span>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{deploy.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{deploy.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${
                  deploy.type === "success" ? "text-emerald-600" :
                  deploy.type === "error" ? "text-red-600" : "text-[#5CA3FF]"
                }`}>
                  {deploy.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}