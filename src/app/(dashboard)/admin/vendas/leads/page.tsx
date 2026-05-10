"use client"

import { useState, useEffect, useMemo, useTransition } from "react"
import { toast } from "sonner"
import {
  X, Star, Globe, Phone, MapPin, ExternalLink,
  Target, Users, ArrowUpRight, Loader2, 
  LayoutGrid, List, Filter, Download, Search,
  Navigation, Building2, Calendar, Sparkles,
  ShieldCheck, AlertTriangle
} from "lucide-react"
import { PAIN_LABELS } from "@/lib/ai-finder"
import { getLeads, updateLeadStatus } from "./actions"
import type { LeadStatus } from "./actions"

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: 'Novo',          color: 'text-gray-600',   bg: 'bg-gray-100', border: 'border-gray-200' },
  contacted: { label: 'Contactado',    color: 'text-blue-600',   bg: 'bg-blue-50',  border: 'border-blue-100' },
  demo:      { label: 'Demo Agendada', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  converted: { label: 'Convertido',    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  rejected:  { label: 'Rejeitado',     color: 'text-red-600',     bg: 'bg-red-50',    border: 'border-red-100' },
}

// --- COMPONENTE: LEAD CARD (MODO CATÁLOGO) ---
function LeadCard({ lead, onSelect }: { lead: any; onSelect: () => void }) {
  const comp = lead.finder_companies
  const isGold = lead.score >= 85

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
            <Building2 className="size-5 text-gray-400 group-hover:text-[#5CA3FF]" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
              lead.score >= 70 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {Number(lead.score).toFixed(0)} pts
            </span>
            {isGold && (
              <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase tracking-tighter animate-pulse">
                <Sparkles className="size-2.5 fill-current" /> Oportunidade Ouro
              </span>
            )}
          </div>
        </div>

        <h3 className="text-[16px] font-bold text-gray-900 mb-1 truncate flex items-center gap-2">
          {comp.name}
        </h3>
        <p className="text-[12px] text-gray-400 mb-4 flex items-center gap-1.5">
          <Target className="size-3" /> {comp.category || 'Setor não definido'}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{comp.address}</span>
          </div>
          {comp.phone && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Phone className="size-3.5 shrink-0" /> {comp.phone}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onSelect}
        className="w-full py-3 bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-2xl transition-all flex items-center justify-center gap-2"
      >
        Analisar Lead <ArrowUpRight className="size-4" />
      </button>
    </div>
  )
}

// --- COMPONENTE: MODAL DE DETALHES (VISTA 360 DO LEAD) ---
function DetailModal({ lead, onClose, onUpdate }: { lead: any; onClose: () => void; onUpdate: () => void }) {
  const comp = lead.finder_companies
  const [isPending, startTransition] = useTransition()

  const handleStatus = (status: LeadStatus) => {
    startTransition(async () => {
      try {
        await updateLeadStatus(lead.id, status)
        toast.success("Status atualizado no CRM")
        onUpdate()
        onClose()
      } catch (err: any) {
        toast.error("Erro ao atualizar", { description: err.message })
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] shadow-2xl p-10 border border-gray-100 custom-scrollbar">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">{comp.name}</h2>
              <span className="px-4 py-1.5 bg-blue-50 text-[#5CA3FF] border border-blue-100 rounded-full text-[12px] font-bold">
                {comp.category}
              </span>
            </div>
            <p className="text-gray-400 flex items-center gap-2 text-sm">
              <MapPin className="size-4" /> {comp.address}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <section>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Contato & Links</h4>
              <div className="space-y-3">
                {comp.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <Phone className="size-4 text-gray-400" />
                    <span className="text-[13px] text-gray-700 font-medium">{comp.phone}</span>
                  </div>
                )}
                {comp.website && (
                  <a href={comp.website} target="_blank" className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-[#5CA3FF] hover:bg-blue-50 transition-all">
                    <Globe className="size-4" />
                    <span className="text-[13px] font-medium truncate">Ver Website</span>
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                )}
                <a href={comp.google_maps_url} target="_blank" className="flex items-center gap-3 p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-emerald-600 hover:bg-emerald-50 transition-all">
                  <Navigation className="size-4" />
                  <span className="text-[13px] font-medium">Google Maps</span>
                  <ExternalLink className="size-3 ml-auto" />
                </a>
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Localização Técnica</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Lat</p>
                  <p className="font-mono text-[12px] text-gray-600 truncate">{comp.latitude}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Lng</p>
                  <p className="font-mono text-[12px] text-gray-600 truncate">{comp.longitude}</p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[2.5rem] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="size-5 text-[#5CA3FF] fill-current" />
                  <h4 className="text-sm font-bold text-[#5CA3FF] uppercase tracking-widest">IA Strategic Summary</h4>
                </div>
                <p className="text-[16px] text-gray-800 leading-relaxed font-medium">
                  {lead.ai_summary || "Análise detalhada não disponível para este lead."}
                </p>
              </div>
            </div>

            {/* Dores Digitais com Indicadores de Confiança */}
            {lead.pain_excerpts && lead.pain_excerpts.length > 0 && (
              <section className="space-y-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Dores Digitais Auditadas</h4>
                <div className="grid gap-4">
                  {lead.pain_excerpts.map((pain: any, i: number) => {
                    const confPct = (pain.confidence || 0.5) * 100
                    return (
                      <div key={i} className="p-5 bg-white border border-gray-100 rounded-3xl space-y-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-[#5CA3FF] text-[11px] font-bold rounded-lg uppercase">
                              {PAIN_LABELS[pain.category] || pain.category}
                            </span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold">
                              <AlertTriangle className="size-3" /> 
                              {pain.severity === 'high' ? 'Crítica' : 'Média'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`size-3 ${confPct > 80 ? 'text-emerald-500' : 'text-blue-500'}`} />
                            <span className="text-[11px] font-bold text-gray-700">{confPct.toFixed(0)}% Confiança</span>
                          </div>
                        </div>
                        <p className="text-[13px] text-gray-600 italic border-l-3 border-blue-500/20 pl-4 py-1 leading-relaxed">
                          "{pain.excerpt}"
                        </p>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-[1500ms] rounded-full ${
                              confPct > 80 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 
                              confPct > 50 ? 'bg-blue-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${confPct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            <section className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">Pipeline de Vendas</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.keys(STATUS_MAP).map((s) => (
                  <button 
                    key={s}
                    disabled={isPending}
                    onClick={() => handleStatus(s as LeadStatus)}
                    className={`py-4 rounded-2xl text-[11px] font-bold uppercase border transition-all ${
                      lead.status === s 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                        : 'bg-white text-gray-400 hover:border-[#5CA3FF]/50 hover:text-[#5CA3FF] border-gray-100'
                    } disabled:opacity-50`}
                  >
                    {STATUS_MAP[s].label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- PÁGINA PRINCIPAL ---
export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'grid'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<any | null>(null)

  const load = async () => {
    try {
      const data = await getLeads()
      setLeads(data)
    } catch (e) {
      toast.error("Erro ao sincronizar CRM")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.finder_companies.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = statusFilter === "all" || l.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [leads, searchTerm, statusFilter])

  const downloadCSV = () => {
    const headers = "Nome,Categoria,Score,Status,Telefone,Website,Endereco\n"
    const csv = filteredLeads.map(l => (
      `"${l.finder_companies.name}","${l.finder_companies.category}",${l.score},${l.status},"${l.finder_companies.phone}","${l.finder_companies.website}","${l.finder_companies.address}"`
    )).join("\n")
    const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facillit_leads_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
      <Loader2 className="animate-spin text-[#5CA3FF] size-12" />
    </div>
  )

  return (
    <div className="max-w-[1400px] mx-auto p-8 animate-in fade-in slide-in-from-bottom-2 duration-700 space-y-12">
      
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Leads Qualificados</h1>
          <p className="text-gray-500 text-[15px] font-light mt-1">Gestão de oportunidades geradas pelo garimpo inteligente.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Localizar empresa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-[#5CA3FF]/50 transition-all w-full lg:w-64 shadow-sm"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm text-gray-500 focus:outline-none shadow-sm"
          >
            <option value="all">Filtro: Todos</option>
            {Object.keys(STATUS_MAP).map(k => <option key={k} value={k}>{STATUS_MAP[k].label}</option>)}
          </select>

          <div className="flex bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm">
            <button onClick={() => setView('grid')} className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid className="size-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}><List className="size-4" /></button>
          </div>

          <button onClick={downloadCSV} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            <Download className="size-4" /> CSV
          </button>
        </div>
      </header>

      {filteredLeads.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center">
          <Search className="size-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Nenhum resultado</h3>
          <p className="text-gray-400 text-sm">Ajuste os filtros ou inicie um novo garimpo.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredLeads.map(lead => <LeadCard key={lead.id} lead={lead} onSelect={() => setSelectedLead(lead)} />)}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Lead / Localização</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Score</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status CRM</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-gray-400">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead) => {
                const s = STATUS_MAP[lead.status] || STATUS_MAP.new
                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="px-8 py-6">
                      <span className="font-bold text-gray-900 block flex items-center gap-2">
                        {lead.finder_companies.name}
                        {lead.score >= 85 && <Sparkles className="size-3 text-amber-500 fill-current" />}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="size-3" /> {lead.finder_companies.address}</span>
                    </td>
                    <td className="px-6 py-6 font-bold text-gray-700 text-sm">{Number(lead.score).toFixed(0)} pts</td>
                    <td className="px-6 py-6"><span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${s.bg} ${s.color} ${s.border}`}>{s.label}</span></td>
                    <td className="px-8 py-6 text-right"><button className="p-3 bg-gray-50 group-hover:bg-gray-900 group-hover:text-white rounded-2xl transition-all"><ArrowUpRight className="size-4" /></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedLead && <DetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={load} />}
    </div>
  )
}