"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import Link from "next/link"
import {
  Search, CheckCircle2, Clock, AlertCircle, Loader2,
  RefreshCw, Cpu, Trash2, ArrowRight, Target, Users
} from "lucide-react"
import { syncSearchStatus, processSearch, deleteSearch } from "../actions"

type Search = {
  id:              string
  name:            string
  search_terms:    string[]
  regions:         string[]
  status:          string
  total_companies: number
  total_leads:     number
  created_at:      string
  completed_at?:   string
  error_message?:  string
}

const STATUS_CONFIG = {
  pending:    { label: 'Pendente',       color: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200', icon: Clock },
  running:    { label: 'Coletando',      color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100', icon: Loader2 },
  processing: { label: 'Processando IA', color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-100', icon: Cpu },
  completed:  { label: 'Concluído',      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 },
  failed:     { label: 'Falhou',         color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100', icon: AlertCircle },
}

// ==========================================
// COMPONENTE INTERNO: Botão de Processar IA com Modal Hacker
// ==========================================
function ProcessSearchButton({ searchId, disabled }: { searchId: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ logs: string[], totalLeads: number } | null>(null)

  const handleProcess = async () => {
    setLoading(true)
    try {
      const data = await processSearch(searchId)
      setResult({ logs: data.logs, totalLeads: data.totalLeads })
      toast.success("Garimpo IA finalizado com sucesso!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={handleProcess} 
        disabled={disabled || loading}
        className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-purple-600
          bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-xl transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Cpu className="size-3.5" />}
        {loading ? 'Analisando...' : 'Processar IA'}
      </button>

      {/* MODAL DE PREVIEW DOS LOGS (TELA DE HACKER) */}
      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-3xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Garimpo Finalizado!</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Operação processada e salva no banco de dados.</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-sm text-blue-800">
                A Inteligência Artificial filtrou os resultados e identificou <strong>{result.totalLeads} oportunidades qualificadas</strong>.
              </p>
            </div>

            {/* CONSOLE DE LOGS */}
            <div className="bg-gray-950 rounded-2xl p-5 h-72 overflow-y-auto mb-8 font-mono text-[11px] text-emerald-400 space-y-1.5 shadow-inner">
              {result.logs.map((log, i) => (
                <div key={i} className={
                  log.includes('❌') ? 'text-red-400' : 
                  log.includes('✅') ? 'text-emerald-400 font-bold' : 
                  log.includes('🧠') ? 'text-blue-300' :
                  log.includes('⏭️') ? 'text-gray-500' : 'text-gray-300'
                }>
                  {log}
                </div>
              ))}
            </div>

            {/* DEEP LINK PARA O CRM */}
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setResult(null)} 
                className="px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium transition-all"
              >
                Fechar
              </button>
              <Link 
                href={`/admin/vendas/leads`} 
                className="flex items-center gap-2 px-6 py-2.5 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all"
              >
                Ver Oportunidades no CRM <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ==========================================
// EXPORTAÇÃO PRINCIPAL DO COMPONENTE DE LISTA
// ==========================================
interface Props { searches: Search[] }

export function SearchesList({ searches }: Props) {
  const [isPending, startTransition] = useTransition()
  const [loadingId, setLoadingId]    = useState<string | null>(null)

  const handleSync = (id: string) => {
    setLoadingId(id)
    startTransition(async () => {
      try {
        const result = await syncSearchStatus(id)
        if (result.status === 'running') {
          toast.info("Apify ainda em execução", { description: "Aguarde e sincronize novamente em alguns minutos." })
        } else if (result.status === 'processing') {
          toast.success("Coleta concluída!", { description: "Clique em 'Processar IA' para gerar os leads." })
        }
      } catch (err: any) {
        toast.error("Erro ao sincronizar", { description: err.message })
      } finally {
        setLoadingId(null)
      }
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Excluir busca "${name}" e todos os leads associados?`)) return
    startTransition(async () => {
      try {
        await deleteSearch(id)
        toast.success("Busca excluída")
      } catch (err: any) {
        toast.error("Erro ao excluir", { description: err.message })
      }
    })
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-20 text-gray-300">
        <Search strokeWidth={1} className="size-12 mx-auto mb-4" />
        <p className="text-[15px] font-medium text-gray-400">Nenhuma busca ainda</p>
        <p className="text-[13px] text-gray-300 mt-1">Crie sua primeira operação de garimpo acima</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-50">
      {searches.map(s => {
        const cfg     = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
        const Icon    = cfg.icon
        const isLoading = loadingId === s.id && isPending

        return (
          <div key={s.id} className="p-6 hover:bg-gray-50/30 transition-all group">
            <div className="flex items-start justify-between gap-4">
              {/* Info principal */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className={`mt-0.5 p-2 rounded-xl border ${cfg.bg} ${cfg.border} shrink-0`}>
                  <Icon strokeWidth={1.5} className={`size-4 ${cfg.color} ${s.status === 'running' ? 'animate-spin' : ''}`} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-[15px] font-semibold text-gray-900">{s.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-[12px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Search strokeWidth={1.5} className="size-3" />
                      {s.search_terms.slice(0, 2).join(', ')}
                      {s.search_terms.length > 2 && ` +${s.search_terms.length - 2}`}
                    </span>
                    {s.regions.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span>📍</span>
                        {s.regions.slice(0, 2).join(', ')}
                        {s.regions.length > 2 && ` +${s.regions.length - 2}`}
                      </span>
                    )}
                    <span className="text-gray-300">
                      {new Date(s.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {s.error_message && (
                    <p className="text-[11px] text-red-500 mt-1.5 bg-red-50 px-2 py-1 rounded-lg inline-block">
                      {s.error_message}
                    </p>
                  )}

                  {s.status === 'completed' && (
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        <Users strokeWidth={1.5} className="size-3" />
                        {s.total_companies} empresas
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
                        <Target strokeWidth={1.5} className="size-3" />
                        {s.total_leads} leads qualificados
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 shrink-0">
                {s.status === 'running' && (
                  <button onClick={() => handleSync(s.id)} disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-blue-600
                      bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all disabled:opacity-50">
                    {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                    Sincronizar
                  </button>
                )}

                {/* SUBSTITUÍDO PELO NOSSO NOVO COMPONENTE DE IA */}
                {(s.status === 'processing' || (s.status === 'running')) && (
                  <ProcessSearchButton searchId={s.id} disabled={isLoading} />
                )}

                {s.status === 'completed' && (
                  <Link href={`/admin/vendas/leads`}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-[#5CA3FF]
                      bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all">
                    Ver Leads <ArrowRight className="size-3.5" />
                  </Link>
                )}

                <button onClick={() => handleDelete(s.id, s.name)} disabled={isPending}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}