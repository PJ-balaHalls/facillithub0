// src/app/(dashboard)/admin/finder/components/searches-list.tsx
"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import Link from "next/link"
import {
  Search, CheckCircle2, Clock, AlertCircle, Loader2,
  RefreshCw, Cpu, Trash2, ArrowRight, Target, Users, MapPin
} from "lucide-react"
import { syncSearchStatus, processSearch, deleteSearch } from "../actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

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
  pending:    { label: 'Pendente',       color: 'text-muted-foreground', bg: 'bg-muted/40',       border: 'border-border',          icon: Clock },
  running:    { label: 'Coletando',      color: 'text-blue-500',         bg: 'bg-blue-500/10',    border: 'border-blue-500/20',     icon: Loader2 },
  processing: { label: 'Processando IA', color: 'text-purple-500',       bg: 'bg-purple-500/10',  border: 'border-purple-500/20',   icon: Cpu },
  completed:  { label: 'Concluído',      color: 'text-green-500',        bg: 'bg-green-500/10',   border: 'border-green-500/20',    icon: CheckCircle2 },
  failed:     { label: 'Falhou',         color: 'text-red-500',          bg: 'bg-red-500/10',     border: 'border-red-500/20',      icon: AlertCircle },
}

function ProcessSearchButton({ searchId, disabled }: { searchId: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ logs: string[], totalLeads: number } | null>(null)
  const [open, setOpen] = useState(false)

  const handleProcess = async () => {
    setLoading(true)
    try {
      const data = await processSearch(searchId)
      setResult({ logs: data.logs, totalLeads: data.totalLeads })
      setOpen(true)
      toast.success("Análise IA finalizada!")
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
        className="h-11 rounded-xl px-4 bg-muted hover:bg-muted/60 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ease-in-out disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Cpu size={16} />}
        {loading ? 'Analisando...' : 'Processar IA'}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-6 border border-border/60 bg-background shadow-sm flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight">Análise Concluída</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              A Inteligência Artificial filtrou os resultados e identificou <strong>{result?.totalLeads} oportunidades qualificadas</strong>.
            </p>
          </DialogHeader>

          <div className="bg-muted/40 border border-border/60 rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs space-y-2 flex flex-col">
            {result?.logs.map((log, i) => (
              <div key={i} className="text-muted-foreground">
                {log}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/60">
            <button 
              onClick={() => setOpen(false)} 
              className="h-11 rounded-xl px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out"
            >
              Fechar
            </button>
            <Link 
              href={`/admin/vendas/leads`} 
              className="h-11 rounded-xl px-4 bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 ease-in-out"
            >
              Ver Oportunidades no CRM <ArrowRight size={16} />
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

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
          toast.info("Ainda em execução", { description: "Aguarde e tente novamente." })
        } else if (result.status === 'processing') {
          toast.success("Coleta concluída!", { description: "Processamento de IA liberado." })
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
        toast.error("Erro", { description: err.message })
      }
    })
  }

  if (searches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-4">
        <Search size={32} />
        <div className="flex flex-col items-center text-center">
          <p className="text-base font-medium text-foreground">Nenhuma busca ainda</p>
          <p className="text-sm">Crie sua primeira operação de garimpo acima</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {searches.map(s => {
        const cfg = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
        const Icon = cfg.icon
        const isLoading = loadingId === s.id && isPending

        return (
          <div key={s.id} className="p-6 border-b border-border/60 hover:bg-muted/40 transition-all duration-200 ease-in-out flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start md:items-center gap-4 flex-1">
              <div className={`p-3 rounded-xl border ${cfg.bg} ${cfg.border} shrink-0`}>
                <Icon size={20} className={`${cfg.color} ${s.status === 'running' ? 'animate-spin' : ''}`} />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-sm font-semibold">{s.name}</h3>
                  <Badge className={`rounded-full ${cfg.bg} ${cfg.border} ${cfg.color} hover:${cfg.bg}`}>
                    {cfg.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Search size={14} />
                    {s.search_terms.slice(0, 2).join(', ')}
                    {s.search_terms.length > 2 && ` +${s.search_terms.length - 2}`}
                  </span>
                  {s.regions.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {s.regions.slice(0, 2).join(', ')}
                      {s.regions.length > 2 && ` +${s.regions.length - 2}`}
                    </span>
                  )}
                  <span>
                    {new Date(s.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {s.error_message && (
                  <p className="text-xs text-red-500 mt-1">
                    {s.error_message}
                  </p>
                )}

                {s.status === 'completed' && (
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Users size={14} />
                      {s.total_companies} empresas
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                      <Target size={14} />
                      {s.total_leads} leads qualificados
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-end">
              {s.status === 'running' && (
                <button onClick={() => handleSync(s.id)} disabled={isLoading}
                  className="h-11 rounded-xl px-4 bg-muted hover:bg-muted/60 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ease-in-out disabled:opacity-50">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  Sincronizar
                </button>
              )}

              {(s.status === 'processing' || s.status === 'running') && (
                <ProcessSearchButton searchId={s.id} disabled={isLoading} />
              )}

              {s.status === 'completed' && (
                <Link href={`/admin/vendas/leads`}
                  className="h-11 rounded-xl px-4 bg-muted hover:bg-muted/60 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ease-in-out">
                  Ver Leads <ArrowRight size={16} />
                </Link>
              )}

              <button onClick={() => handleDelete(s.id, s.name)} disabled={isPending}
                className="h-11 w-11 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 ease-in-out disabled:opacity-50">
                <Trash2 size={16} />
              </button>
            </div>

          </div>
        )
      })}
    </div>
  )
}