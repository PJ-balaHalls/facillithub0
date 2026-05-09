"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck } from "lucide-react"

const SEALS = [
  { name: "Conta Verificada", key: "verified_account", color: "#11df6a" },
  { name: "Assinatura Ativa", key: "active_subscription", color: "#22c55e" },
  { name: "Presença Completa", key: "complete_presence", color: "#00c2ff" },
  { name: "Operação Ativa", key: "active_operation", color: "#ff9f43" },
  { name: "Atendimento Verificado", key: "verified_support", color: "#5865f2" },
  { name: "Segurança Ativa", key: "active_security", color: "#3b82f6" },
  { name: "Parceiro Oficial", key: "official_partner", color: "#a855f7" },
  { name: "Empresa Recomendada", key: "recommended", color: "#facc15" },
  { name: "Performance Excelente", key: "excellent_performance", color: "#ef4444" },
]

export function LibrarySection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {SEALS.map((s) => (
        <Card key={s.key} className="border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold">{s.name}</CardTitle>
            <BadgeCheck size={18} style={{ color: s.color }} />
          </CardHeader>
          <CardContent><p className="text-[10px] text-muted-foreground font-mono">{s.key}</p></CardContent>
        </Card>
      ))}
    </div>
  )
}