"use client"

import { useState, useEffect, useTransition } from "react"
import { toast } from "sonner"
import {
  X, Star, Globe, Phone, MapPin, ExternalLink,
  AlertTriangle, CheckCircle2, ChevronRight, Loader2
} from "lucide-react"
import { PAIN_LABELS } from "@/lib/ai-finder"
// ✅ CORREÇÃO 1: Caminho alterado de ../actions para ./actions
import { updateLeadStatus, getCompanyReviews } from "./actions"
import type { LeadStatus } from "./actions"

interface Lead {
  id:              string
  score:           number
  status:          string
  ai_summary?:     string
  pain_categories: string[]
  pain_excerpts:   any[]
  finder_companies: {
    id:             string
    name:           string
    category?:      string
    address?:       string
    phone?:         string
    website?:       string
    rating?:        number
    review_count?:  number
    google_maps_url?: string
    has_website:    boolean
  }
  finder_searches: { name: string }
}

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new',       label: 'Novo',          color: 'bg-gray-100 text-gray-600' },
  { value: 'contacted', label: 'Contactado',    color: 'bg-blue-50 text-blue-600' },
  { value: 'demo',      label: 'Demo Agendada', color: 'bg-purple-50 text-purple-600' },
  { value: 'converted', label: 'Convertido',    color: 'bg-emerald-50 text-emerald-600' },
  { value: 'rejected',  label: 'Rejeitado',     color: 'bg-red-50 text-red-600' },
]

const SEVERITY_COLORS = {
  high:   { bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-600',    dot: 'bg-red-400' },
  medium: { bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-600',  dot: 'bg-amber-400' },
  low:    { bg: 'bg-gray-50',   border: 'border-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-300' },
}

// ==========================================
// 1. COMPONENTE MODAL (O que você já tinha)
// ==========================================
interface Props {
  lead:     Lead | null
  onClose:  () => void
  onUpdate: () => void
}

export function LeadDetailModal({ lead, onClose, onUpdate }: Props) {
  const [reviews, setReviews]         = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [isPending, startTransition]  = useTransition()

  useEffect(() => {
    if (!lead) return
    setLoadingReviews(true)
    getCompanyReviews(lead.finder_companies.id)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoadingReviews(false))
  }, [lead?.id])

  if (!lead) return null

  const company  = lead.finder_companies
  const scoreColor =
    lead.score >= 70 ? 'text-red-600 bg-red-50 border-red-100' :
    lead.score >= 50 ? 'text-amber-600 bg-amber-50 border-amber-100' :
    'text-emerald-600 bg-emerald-50 border-emerald-100'

  const handleStatusChange = (status: LeadStatus) => {
    startTransition(async () => {
      try {
        await updateLeadStatus(lead.id, status)
        toast.success("Status atualizado")
        onUpdate()
      } catch (err: any) {
        toast.error("Erro ao atualizar", { description: err.message })
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[4px]" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto
        bg-white rounded-[2rem] shadow-[0_25px_60px_rgb(0,0,0,0.12)] border border-gray-100">

        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-white border-b border-gray-50 rounded-t-[2rem]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[17px] font-semibold text-gray-900">{company.name}</h2>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${scoreColor}`}>
                {lead.score.toFixed(0)} pts
              </span>
            </div>
            <p className="text-[12px] text-gray-400">{company.category} · {lead.finder_searches.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dados da empresa */}
          <div className="grid grid-cols-2 gap-3">
            {company.address && (
              <div className="flex items-start gap-2.5 p-3 bg-gray-50/60 rounded-2xl">
                <MapPin strokeWidth={1.5} className="size-4 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-[12px] text-gray-600">{company.address}</span>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-2.5 p-3 bg-gray-50/60 rounded-2xl">
                <Phone strokeWidth={1.5} className="size-4 text-gray-400 shrink-0" />
                <span className="text-[12px] text-gray-600">{company.phone}</span>
              </div>
            )}
            {company.rating && (
              <div className="flex items-center gap-2.5 p-3 bg-amber-50/60 border border-amber-100/50 rounded-2xl">
                <Star strokeWidth={1.5} className="size-4 text-amber-500 shrink-0" />
                <span className="text-[12px] text-gray-700 font-medium">
                  {company.rating} · {company.review_count} avaliações
                </span>
              </div>
            )}
            {company.website ? (
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 bg-blue-50/60 border border-blue-100/50 rounded-2xl hover:bg-blue-50 transition-all">
                <Globe strokeWidth={1.5} className="size-4 text-[#5CA3FF] shrink-0" />
                <span className="text-[12px] text-[#5CA3FF] truncate">{company.website}</span>
                <ExternalLink strokeWidth={1.5} className="size-3 text-[#5CA3FF] shrink-0 ml-auto" />
              </a>
            ) : (
              <div className="flex items-center gap-2.5 p-3 bg-red-50/60 border border-red-100/50 rounded-2xl">
                <Globe strokeWidth={1.5} className="size-4 text-red-400 shrink-0" />
                <span className="text-[12px] text-red-500 font-medium">Sem website</span>
              </div>
            )}
          </div>

          {/* Resumo de IA */}
          {lead.ai_summary && (
            <div className="p-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100/50 rounded-2xl">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#5CA3FF] mb-2">Oportunidade Identificada pela IA</p>
              <p className="text-[13px] text-gray-700 leading-relaxed">{lead.ai_summary}</p>
            </div>
          )}

          {/* Dores digitais */}
          {lead.pain_excerpts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Dores Digitais Detectadas</p>
              {lead.pain_excerpts.map((pain: any, i: number) => {
                const sev = SEVERITY_COLORS[pain.severity as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.medium
                return (
                  <div key={i} className={`p-4 rounded-2xl border ${sev.bg} ${sev.border}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`size-2 rounded-full ${sev.dot}`} />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${sev.text}`}>
                        {PAIN_LABELS[pain.category] || pain.category}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-600 italic">"{pain.excerpt}"</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pipeline de vendas */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Pipeline de Vendas</p>
            <div className="grid grid-cols-5 gap-1.5">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={isPending || lead.status === opt.value}
                  className={`px-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                    ${lead.status === opt.value
                      ? opt.color + ' ring-2 ring-offset-1 ring-current/30'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100'
                    }
                    disabled:cursor-not-allowed`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Avaliações brutas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Avaliações Coletadas ({reviews.length})
              </p>
              {company.google_maps_url && (
                <a href={company.google_maps_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[#5CA3FF] hover:underline">
                  Ver no Maps <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            {loadingReviews ? (
              <div className="text-center py-6 text-gray-300 animate-pulse text-[12px]">Carregando avaliações...</div>
            ) : reviews.length === 0 ? (
              <p className="text-[12px] text-gray-400 italic text-center py-4">Sem avaliações coletadas.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {reviews.map((r, i) => (
                  <div key={i} className="p-3.5 bg-gray-50/60 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-gray-700">{r.author || 'Anônimo'}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className={`size-3 ${s < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {r.text && <p className="text-[12px] text-gray-600 leading-relaxed">{r.text}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// ✅ 2. COMPONENTE DA PÁGINA (A CORREÇÃO PRINCIPAL)
// ==========================================
export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads e Oportunidades</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os potenciais clientes encontrados pelo Facillit Finder.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm flex flex-col items-center justify-center text-center">
        <Star className="size-8 text-gray-300 mb-3" />
        <h3 className="text-sm font-medium text-gray-900">Nenhum lead listado na tela ainda</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-md">
          A interface de tabela/lista de leads precisa ser montada aqui. 
          O seu modal de detalhes (`LeadDetailModal`) está perfeito e pronto para ser chamado assim que clicarmos num lead da lista!
        </p>
      </div>

      {/* Renderiza o modal quando houver um lead selecionado */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={() => {
          // Aqui no futuro adicionamos a lógica para atualizar a lista
          setSelectedLead(null)
        }}
      />
    </div>
  )
}