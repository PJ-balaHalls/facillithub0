// src/app/(dashboard)/admin/finder/components/search-form.tsx
"use client"

import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { 
  Search, MapPin, Settings2, Loader2, Sparkles, 
  Plus, X, Timer, Zap, Layers, ChevronDown, ChevronUp 
} from "lucide-react"
import { createSearch } from "../actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const TERM_SUGGESTIONS = [
  "Clínica Dentária", "Restaurante", "Oficina Mecânica", "Salão de Beleza",
  "Academia", "Farmácia", "Pet Shop", "Escola de Idiomas", "Clínica Médica",
  "Imobiliária", "Estética", "Hoteis", "Advocacia", "Contabilidade"
]

const REGION_SUGGESTIONS = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Curitiba, PR", "Belo Horizonte, MG",
  "Porto Alegre, RS", "Brasília, DF", "Campinas, SP", "Guarulhos, SP"
]

interface Props {
  onSuccess?: (searchId: string) => void
}

export function SearchForm({ onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [terms, setTerms] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [termInput, setTermInput] = useState("")
  const [regionInput, setRegionInput] = useState("")
  const [goldMode, setGoldMode] = useState(false)
  
  const [progress, setProgress] = useState(0)
  const [eta, setEta] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPending) {
      setProgress(0)
      setEta(45)
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + (prev < 80 ? 3 : 0.5)))
        setEta((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    } else {
      setProgress(100)
      setTimeout(() => setProgress(0), 1000)
    }
    return () => clearInterval(interval)
  }, [isPending])

  const addTerm = (val?: string) => {
    const t = (val || termInput).trim()
    if (t && !terms.includes(t)) setTerms(p => [...p, t])
    setTermInput("")
  }

  const addRegion = (val?: string) => {
    const r = (val || regionInput).trim()
    if (r && !regions.includes(r)) setRegions(p => [...p, r])
    setRegionInput("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (terms.length === 0) return toast.error("Adicione pelo menos 1 nicho de busca")

    const fd = new FormData(e.currentTarget)
    fd.set('searchTerms', terms.join('\n'))
    fd.set('regions',     regions.join('\n'))
    fd.set('priority_mode', goldMode ? 'gold_opportunity' : 'standard')

    startTransition(async () => {
      try {
        const result = await createSearch(fd)
        toast.success(goldMode ? "Operação de Ouro Iniciada!" : "Operação iniciada com sucesso!")
        setTimeout(() => {
          setOpen(false)
          setTerms([]); setRegions([]); setGoldMode(false)
          onSuccess?.(result.searchId)
        }, 800)
      } catch (err: any) {
        toast.error("Falha ao iniciar busca", { description: err.message })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-11 rounded-xl px-4 bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 ease-in-out">
          <Sparkles size={16} />
          Novo Garimpo
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6 border border-border/60 bg-background shadow-sm flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">Configurar Garimpo</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Motores de busca e IA de auditoria</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative">
          {isPending && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl gap-4">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-sm font-medium">Iniciando operação ({Math.round(progress)}%)</p>
            </div>
          )}

          {/* Modo Ouro */}
          <div 
            className={`p-6 rounded-2xl border transition-all duration-200 ease-in-out cursor-pointer flex gap-4 ${
              goldMode ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700' : 'bg-background border-border hover:bg-muted/40'
            }`}
            onClick={() => setGoldMode(!goldMode)}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                Oportunidade Ouro
              </label>
              <p className="text-sm text-muted-foreground">
                Prioriza empresas com boas avaliações mas que <strong>não possuem infraestrutura digital</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Identificação do Lote</label>
            <input name="name" required disabled={isPending} placeholder="Ex: Clínicas Odonto - Zona Sul"
              className="h-11 rounded-xl px-4 border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all duration-200 ease-in-out text-sm" />
          </div>

          {/* Nichos */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Segmentos de Negócio</label>
            <div className="flex flex-wrap gap-2">
              {terms.map(t => (
                <span key={t} className="rounded-full px-3 py-1 bg-muted/40 text-sm flex items-center gap-2 border border-border/60">
                  {t} <button type="button" onClick={() => setTerms(p => p.filter(x => x !== t))} className="hover:text-red-500 transition-all"><X size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <input value={termInput} onChange={e => setTermInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTerm())}
                placeholder="Digite um nicho..." className="flex-1 h-11 rounded-xl px-4 border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all duration-200 ease-in-out text-sm" />
              <button type="button" onClick={() => addTerm()} className="h-11 rounded-xl px-4 bg-muted hover:bg-muted/60 transition-all duration-200 ease-in-out text-sm font-medium">Adicionar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {TERM_SUGGESTIONS.filter(s => !terms.includes(s)).slice(0, 8).map(s => (
                <button key={s} type="button" onClick={() => addTerm(s)} className="rounded-full px-3 py-1 text-xs text-muted-foreground border border-border/60 hover:bg-muted/40 transition-all duration-200 ease-in-out">+ {s}</button>
              ))}
            </div>
          </div>

          {/* Regiões */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Regiões e Cidades</label>
            <div className="flex flex-wrap gap-2">
              {regions.map(r => (
                <span key={r} className="rounded-full px-3 py-1 bg-muted/40 text-sm flex items-center gap-2 border border-border/60">
                  <MapPin size={14} className="text-muted-foreground" /> {r} 
                  <button type="button" onClick={() => setRegions(p => p.filter(x => x !== r))} className="hover:text-red-500 transition-all"><X size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <input value={regionInput} onChange={e => setRegionInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRegion())}
                placeholder="Digite uma cidade/bairro..." className="flex-1 h-11 rounded-xl px-4 border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all duration-200 ease-in-out text-sm" />
              <button type="button" onClick={() => addRegion()} className="h-11 rounded-xl px-4 bg-muted hover:bg-muted/60 transition-all duration-200 ease-in-out text-sm font-medium">Adicionar</button>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-border/60">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out w-fit">
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Parâmetros Avançados
            </button>
            
            {showAdvanced && (
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Volume Máximo</label>
                  <select name="maxResults" defaultValue="20" className="h-11 rounded-xl px-4 border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all duration-200 ease-in-out text-sm">
                    <option value="10">10 empresas</option>
                    <option value="20">20 empresas</option>
                    <option value="50">50 empresas</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Lote de Análise</label>
                  <select name="batch_size" defaultValue="10" className="h-11 rounded-xl px-4 border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all duration-200 ease-in-out text-sm">
                    <option value="5">5 por vez</option>
                    <option value="10">10 por vez</option>
                    <option value="20">20 por vez</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/60">
            <button type="button" onClick={() => setOpen(false)} className="h-11 rounded-xl px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out">
              Cancelar
            </button>
            <button type="submit" disabled={isPending || terms.length === 0}
              className="h-11 rounded-xl px-6 bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 ease-in-out disabled:opacity-50">
              <Zap size={16} /> Iniciar Garimpo
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}