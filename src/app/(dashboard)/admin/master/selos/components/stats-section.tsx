import { createClient } from "@/lib/server"
import { BadgeCheck, Users, ShieldAlert, Zap } from "lucide-react"

export async function StatsSection() {
  const supabase = await createClient()
  
  const { count: totalVerified } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified')
  const { count: totalSeals } = await supabase.from('workspace_seals').select('*', { count: 'exact', head: true })
  const { count: totalMembers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  const stats = [
    { label: "Membros Totais", value: totalMembers || 0, icon: Users, color: "text-gray-900" },
    { label: "Selos Atribuídos", value: totalSeals || 0, icon: BadgeCheck, color: "text-blue-500" },
    { label: "Verificações KYC", value: totalVerified || 0, icon: ShieldAlert, color: "text-green-500" },
    { label: "Uptime Autoridade", value: "99.9%", icon: Zap, color: "text-orange-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div key={s.label} className="group bg-white border border-gray-100 p-8 rounded-[32px] hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live</span>
          </div>
          <div>
            <p className="text-4xl font-black tracking-tighter text-black">{s.value}</p>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-tight">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}