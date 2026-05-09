"use client"

// ✅ CORREÇÃO AQUI: useTransition adicionado de volta na importação
import { useState, useEffect, useMemo, useTransition } from "react"
import { toast } from "sonner"
import {
  X, Star, Globe, Phone, MapPin, ExternalLink,
  Target, Users, ArrowUpRight, Loader2, 
  LayoutGrid, List, Filter, Download, Search,
  Navigation, Building2, Calendar
} from "lucide-react"
import { PAIN_LABELS } from "@/lib/ai-finder"
import { getLeads, updateLeadStatus, getCompanyReviews } from "./actions"
import type { LeadStatus } from "./actions"

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new:       { label: 'Novo',          color: 'bg-gray-100 text-gray-600' },
  contacted: { label: 'Contactado',    color: 'bg-blue-50 text-blue-600' },
  demo:      { label: 'Demo Agendada', color: 'bg-purple-50 text-purple-600' },
  converted: { label: 'Convertido',    color: 'bg-emerald-50 text-emerald-600' },
  rejected:  { label: 'Rejeitado',     color: 'bg-red-50 text-red-600' },
}

// --- COMPONENTE: LEAD CARD (MODO CATÁLOGO) ---
function LeadCard({ lead, onSelect }: { lead: any; onSelect: () => void }) {
  const comp = lead.finder_companies
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
            <Building2 className="size-5 text-gray-400 group-hover:text-[#5CA3FF]" />
          </div>
          <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
            lead.score >= 70 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {Number(lead.score).toFixed(0)} pts
          </span>
        </div>

        <h3 className="text-[16px] font-bold text-gray-900 mb-1 truncate">{comp.name}</h3>
        <p className="text-[12px] text-gray-400 mb-4 flex items-center gap-1.5">
          <Target className="size-3" /> {comp.category || 'Setor não definido'}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <MapPin className="size-3.5" /> <span className="truncate">{comp.address}</span>
          </div>
          {comp.phone && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Phone className="size-3.5" /> {comp.phone}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onSelect}
        className="w-full py-3 bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-2xl transition-all flex items-center justify-center gap-2"
      >
        Analisar Oportunidade <ArrowUpRight className="size-4" />
      </button>
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
    const data = await getLeads()
    setLeads(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Lógica de Filtros
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.finder_companies.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = statusFilter === "all" || l.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [leads, searchTerm, statusFilter])

  // Função para baixar CSV
  const downloadCSV = () => {
    const headers = "Nome,Categoria,Score,Status,Telefone,Website,Endereco\n"
    const csv = filteredLeads.map(l => (
      `"${l.finder_companies.name}","${l.finder_companies.category}",${l.score},${l.status},"${l.finder_companies.phone}","${l.finder_companies.website}","${l.finder_companies.address}"`
    )).join("\n")
    const blob = new Blob([headers + csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `leads_facillithub_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
      <Loader2 className="animate-spin text-[#5CA3FF] size-10" />
    </div>
  )

  return (
    <div className="max-w-[1400px] mx-auto p-8 animate-in fade-in duration-700">
      
      {/* HEADER E FILTROS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Leads Qualificados</h1>
          <p className="text-gray-500 text-[13px] mt-1">Gerencie seu pipeline de vendas e análise de dores.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar empresa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all w-64 shadow-sm"
            />
          </div>

          {/* Toggle de Visão */}
          <div className="flex bg-white border border-gray-100 p-1 rounded-2xl shadow-sm">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="size-4" />
            </button>
          </div>

          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-700 text-sm font-medium rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="size-4" /> Exportar
          </button>
        </div>
      </div>

      {/* RENDERIZAÇÃO DA VISÃO SELECIONADA */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} onSelect={() => setSelectedLead(lead)} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold uppercase text-gray-400">Empresa</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400">Score</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400">Status</th>
                <th className="px-8 py-4 text-right text-[11px] font-bold uppercase text-gray-400">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <span className="font-semibold text-gray-900 block">{lead.finder_companies.name}</span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin className="size-3" /> {lead.finder_companies.address}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-bold text-[#5CA3FF]">{Number(lead.score).toFixed(0)} pts</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS_MAP[lead.status]?.color}`}>
                      {STATUS_MAP[lead.status]?.label}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => setSelectedLead(lead)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                      <ArrowUpRight className="size-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE DETALHES ENRIQUECIDO */}
      {selectedLead && (
        <DetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={load} />
      )}
    </div>
  )
}

// --- COMPONENTE: MODAL DE DETALHES (VISTA 360 DO LEAD) ---
function DetailModal({ lead, onClose, onUpdate }: { lead: any; onClose: () => void; onUpdate: () => void }) {
  const comp = lead.finder_companies
  const [isPending, startTransition] = useTransition()

  const handleStatus = (status: LeadStatus) => {
    startTransition(async () => {
      await updateLeadStatus(lead.id, status)
      onUpdate()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] shadow-2xl p-10 border border-gray-100">
        
        {/* Header Modal */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{comp.name}</h2>
              <span className="px-3 py-1 bg-blue-50 text-[#5CA3FF] border border-blue-100 rounded-full text-[12px] font-bold">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Coluna 1: Dados Estruturados */}
          <div className="space-y-8">
            <section>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Informações de Contato</h4>
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
                    <span className="text-[13px] font-medium truncate">Visitar Website</span>
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                )}
                <a href={comp.google_maps_url} target="_blank" className="flex items-center gap-3 p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-emerald-600 hover:bg-emerald-50 transition-all">
                  <Navigation className="size-4" />
                  <span className="text-[13px] font-medium">Ver no Google Maps</span>
                  <ExternalLink className="size-3 ml-auto" />
                </a>
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Dados Geográficos</h4>
              <div className="grid grid-cols-2 gap-3 text-[12px] text-gray-500">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Lat</p>
                  <p className="font-mono">{comp.latitude}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Lng</p>
                  <p className="font-mono">{comp.longitude}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Coluna 2 e 3: IA e Pipeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[2.5rem]">
              <div className="flex items-center gap-2 mb-4">
                <Target className="size-5 text-[#5CA3FF]" />
                <h4 className="text-sm font-bold text-[#5CA3FF] uppercase tracking-widest">Diagnóstico Facillit IA</h4>
              </div>
              <p className="text-[15px] text-gray-800 leading-relaxed mb-6 font-medium">
                {lead.ai_summary}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {lead.pain_categories.map((p: string) => (
                  <span key={p} className="px-4 py-1.5 bg-white text-[#5CA3FF] text-[11px] font-bold rounded-full border border-blue-100 shadow-sm">
                    {PAIN_LABELS[p] || p}
                  </span>
                ))}
              </div>
            </div>

            <section>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Mudar Status do Pipeline</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.keys(STATUS_MAP).map((s) => (
                  <button 
                    key={s}
                    onClick={() => handleStatus(s as LeadStatus)}
                    className={`py-3 rounded-2xl text-[11px] font-bold uppercase border transition-all ${
                      lead.status === s ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border-gray-100'
                    }`}
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