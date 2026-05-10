"use client"

import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { 
  Search, MapPin, Settings2, Loader2, Sparkles, 
  Plus, X, Timer, Zap, Layers, ChevronDown, ChevronUp 
} from "lucide-react"
import { createSearch } from "../actions"

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
  const [open, setOpen]               = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isPending, startTransition]  = useTransition()
  const [terms, setTerms]             = useState<string[]>([])
  const [regions, setRegions]         = useState<string[]>([])
  const [termInput, setTermInput]     = useState("")
  const [regionInput, setRegionInput] = useState("")
  const [goldMode, setGoldMode]       = useState(false)
  
  const [progress, setProgress]       = useState(0)
  const [eta, setEta]                 = useState(0)

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
        toast.success(goldMode ? "Operação de OURO Iniciada!" : "Operação iniciada com sucesso!", {
          description: "O robô já está em campo minerando dados.",
        })
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-6 py-3 bg-[#5CA3FF] hover:bg-blue-600
          text-white text-[14px] font-bold rounded-full transition-all
          shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95"
      >
        <Sparkles className="size-4 fill-white" />
        Lançar Novo Garimpo
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_12px_40px_rgb(0,0,0,0.04)] overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-2xl">
            <Zap strokeWidth={1.5} className="size-5 text-[#5CA3FF] fill-[#5CA3FF]" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-gray-900">Configurar Garimpo</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Motores de busca e IA de auditoria</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
          <X className="size-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 relative bg-white">
        {isPending && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center p-8 rounded-b-[2.5rem]">
            <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] border border-gray-100 shadow-2xl space-y-5">
              <div className="flex items-center justify-between text-sm font-bold text-gray-800">
                <span className="flex items-center gap-2 italic">
                  <Loader2 className="size-5 text-[#5CA3FF] animate-spin" />
                  Sincronizando satélites...
                </span>
                <span className="text-[#5CA3FF] font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5CA3FF] transition-all duration-300 ease-out rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Timer className="size-3.5" /> ETA</span>
                <span>{eta}s</span>
              </div>
            </div>
          </div>
        )}

        {/* Modo Ouro */}
        <div 
          className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${
            goldMode ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 hover:border-amber-100'
          }`}
          onClick={() => setGoldMode(!goldMode)}
        >
          <div className="flex items-start gap-4">
            <div className={`mt-1 size-5 rounded-md border flex items-center justify-center transition-all ${goldMode ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-300'}`}>
              {goldMode && <Sparkles className="size-3 fill-current" />}
            </div>
            <div className="space-y-1">
              <label className="text-[14px] font-bold text-amber-900 flex items-center gap-2 cursor-pointer">
                Oportunidade Ouro
              </label>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Prioriza empresas com boas avaliações mas que <strong>não possuem infraestrutura digital</strong> (site/redes).
              </p>
            </div>
          </div>
        </div>

        {/* Nome Operação */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-1">Identificação do Lote</label>
          <input name="name" required disabled={isPending} placeholder="Ex: Clínicas Odonto - Zona Sul"
            className="w-full h-12 px-5 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] text-[14px] text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none" />
        </div>

        {/* Nichos */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-1">Segmentos de Negócio</label>
          <div className="flex flex-wrap gap-2">
            {terms.map(t => (
              <span key={t} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#5CA3FF] text-[12px] font-bold rounded-full border border-blue-100 animate-in zoom-in-95">
                {t} <button type="button" onClick={() => setTerms(p => p.filter(x => x !== t))} className="hover:text-red-500"><X className="size-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={termInput} onChange={e => setTermInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTerm())}
              placeholder="Digite um nicho..." className="flex-1 h-12 px-5 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] text-[14px] outline-none focus:bg-white transition-all" />
            <button type="button" onClick={() => addTerm()} className="p-3 bg-gray-900 text-white rounded-[1.2rem] hover:bg-black transition-all"><Plus /></button>
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {TERM_SUGGESTIONS.filter(s => !terms.includes(s)).slice(0, 8).map(s => (
              <button key={s} type="button" onClick={() => addTerm(s)} className="px-3 py-1.5 text-[11px] text-gray-500 border border-gray-100 rounded-full hover:bg-gray-50 transition-all">+ {s}</button>
            ))}
          </div>
        </div>

        {/* Regiões */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-1">Regiões e Cidades</label>
          <div className="flex flex-wrap gap-2">
            {regions.map(r => (
              <span key={r} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[12px] font-bold rounded-full border border-emerald-100 animate-in zoom-in-95">
                <MapPin className="size-3" /> {r} <button type="button" onClick={() => setRegions(p => p.filter(x => x !== r))} className="hover:text-red-500"><X className="size-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={regionInput} onChange={e => setRegionInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRegion())}
              placeholder="Digite uma cidade/bairro..." className="flex-1 h-12 px-5 bg-gray-50/50 border border-gray-100 rounded-[1.2rem] text-[14px] outline-none focus:bg-white transition-all" />
            <button type="button" onClick={() => addRegion()} className="p-3 bg-gray-900 text-white rounded-[1.2rem] hover:bg-black transition-all"><Plus /></button>
          </div>
        </div>

        {/* Configurações Avançadas Toggle */}
        <div className="pt-2 border-t border-gray-50">
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all">
            {showAdvanced ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            Parâmetros de Lote {showAdvanced ? '(Ocultar)' : '(Exibir)'}
          </button>
          
          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 mt-6 animate-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Volume Máximo</label>
                <select name="maxResults" defaultValue="20" className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-xl text-[13px] outline-none">
                  <option value="10">10 empresas</option>
                  <option value="20">20 empresas</option>
                  <option value="50">50 empresas</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Lote de Análise</label>
                <select name="batch_size" defaultValue="10" className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-xl text-[13px] outline-none">
                  <option value="5">5 por vez</option>
                  <option value="10">10 por vez</option>
                  <option value="20">20 por vez</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Final Actions */}
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => setOpen(false)} className="flex-1 h-14 border border-gray-200 text-gray-500 rounded-[1.5rem] font-bold text-[14px] hover:bg-gray-50 transition-all">Cancelar</button>
          <button type="submit" disabled={isPending || terms.length === 0}
            className="flex-[2] h-14 bg-black text-white rounded-[1.5rem] font-bold text-[14px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <Zap className="size-4 fill-white" /> Iniciar Garimpo Inteligente
          </button>
        </div>
      </form>
    </div>
  )
}