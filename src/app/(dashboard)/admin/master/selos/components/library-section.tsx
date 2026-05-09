"use client"

import { BadgeCheck } from "lucide-react"

const SEALS = [
  { name: "Conta Verificada", key: "verified_account", color: "#11df6a", desc: "Identidade Validada" },
  { name: "Assinatura Ativa", key: "active_subscription", color: "#22c55e", desc: "SaaS em Dia" },
  { name: "Presença Completa", key: "complete_presence", color: "#00c2ff", desc: "Infra 100%" },
  { name: "Operação Ativa", key: "active_operation", color: "#ff9f43", desc: "Recorrência" },
  { name: "Atendimento Verificado", key: "verified_support", color: "#5865f2", desc: "WhatsApp OK" },
  { name: "Segurança Ativa", key: "active_security", color: "#3b82f6", desc: "Dados Protegidos" },
  { name: "Parceiro Oficial", key: "official_partner", color: "#a855f7", desc: "Institucional" },
  { name: "Empresa Recomendada", key: "recommended", color: "#facc15", desc: "Elite Review" },
  { name: "Performance Excelente", key: "excellent_performance", color: "#ef4444", desc: "Conversão" },
]

export function LibrarySection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SEALS.map((seal) => (
        <div key={seal.key} className="p-8 bg-white border border-gray-100 rounded-[32px] hover:border-blue-200 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${seal.color}10` }}>
              <BadgeCheck size={24} style={{ color: seal.color }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{seal.name}</h4>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{seal.key}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{seal.desc}</p>
        </div>
      ))}
    </div>
  )
}