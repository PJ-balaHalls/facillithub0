import { createClient } from "@/lib/server" // Server Client
import { BadgeCheck, ShieldAlert, Zap, Globe } from "lucide-react"

export async function StatsCards() {
  const supabase = await createClient()

  // Queries paralelas para performance
  const [
    { count: totalVerified },
    { count: totalManual },
    { count: totalPending },
    { count: totalWorkspaces }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
    supabase.from('workspace_seals').select('*', { count: 'exact', head: true }).is('granted_by', 'not.null'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    {
      label: "Empresas Verificadas",
      value: totalVerified || 0,
      icon: BadgeCheck,
      color: "text-green-500",
      description: "Empresas com KYC aprovado"
    },
    {
      label: "Atribuições Manuais",
      value: totalManual || 0,
      icon: Zap,
      color: "text-blue-500",
      description: "Selos concedidos pelo admin"
    },
    {
      label: "Aguardando Revisão",
      value: totalPending || 0,
      icon: ShieldAlert,
      color: "text-orange-500",
      description: "Solicitações de verificação"
    },
    {
      label: "Alcance Digital",
      value: `${((totalVerified || 0) / (totalWorkspaces || 1) * 100).toFixed(0)}%`,
      icon: Globe,
      color: "text-purple-500",
      description: "Taxa de legitimação global"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl bg-gray-50`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Real Time</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-black tracking-tight">{stat.value}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}