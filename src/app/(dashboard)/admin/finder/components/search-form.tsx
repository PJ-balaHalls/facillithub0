"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Search, MapPin, Settings2, Loader2, Sparkles, Plus, X } from "lucide-react"
import { createSearch } from "../actions"

const TERM_SUGGESTIONS = [
  "clínica dentária", "restaurante", "oficina mecânica", "salão de beleza",
  "academia", "farmácia", "padaria", "petshop", "escola de idiomas", "clínica médica",
]

const REGION_SUGGESTIONS = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Curitiba, PR", "Belo Horizonte, MG",
  "Porto Alegre, RS", "Brasília, DF", "Salvador, BA", "Fortaleza, CE",
]

interface Props {
  onSuccess?: (searchId: string) => void
}

export function SearchForm({ onSuccess }: Props) {
  const [open, setOpen]           = useState(false)
  const [isPending, startTransition] = useTransition()
  const [terms, setTerms]         = useState<string[]>([])
  const [regions, setRegions]     = useState<string[]>([])
  const [termInput, setTermInput] = useState("")
  const [regionInput, setRegionInput] = useState("")

  const addTerm = (val?: string) => {
    const t = (val || termInput).trim()
    if (t && !terms.includes(t)) setTerms(p => [...p, t])
    if (!val) setTermInput("")
  }

  const addRegion = (val?: string) => {
    const r = (val || regionInput).trim()
    if (r && !regions.includes(r)) setRegions(p => [...p, r])
    if (!val) setRegionInput("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (terms.length === 0) return toast.error("Adicione pelo menos 1 termo de busca")

    const fd = new FormData(e.currentTarget)
    fd.set('searchTerms', terms.join('\n'))
    fd.set('regions',     regions.join('\n'))

    startTransition(async () => {
      try {
        const result = await createSearch(fd)
        toast.success("Busca iniciada no Apify!", {
          description: "O scraping está em andamento. Acompanhe o status abaixo.",
        })
        setOpen(false)
        setTerms([])
        setRegions([])
        onSuccess?.(result.searchId)
      } catch (err: any) {
        toast.error("Falha ao iniciar busca", { description: err.message })
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-5 py-2.5 bg-[#5CA3FF] hover:bg-[#4b8ce0]
          text-white text-[13px] font-medium rounded-full transition-all
          shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/30"
      >
        <Sparkles className="size-3.5 fill-white" />
        Nova Busca Finder
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-2xl">
            <Search strokeWidth={1.5} className="size-5 text-[#5CA3FF]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">Configurar Nova Busca</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Defina o que e onde garimpar</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Nome da busca */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Nome da Operação
          </label>
          <input
            name="name"
            required
            placeholder="Ex: Clínicas SP - Mai/25"
            className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[14px]
              text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2
              focus:ring-blue-100 focus:border-[#5CA3FF]/30 transition-all"
          />
        </div>

        {/* Termos de busca */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Search className="size-3" />
            Segmentos de Negócio
          </label>

          {terms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {terms.map(t => (
                <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#5CA3FF] text-[12px] font-medium rounded-full border border-blue-100">
                  {t}
                  <button type="button" onClick={() => setTerms(p => p.filter(x => x !== t))}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={termInput}
              onChange={e => setTermInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTerm())}
              placeholder="Ex: clínica dentária"
              className="flex-1 h-10 px-4 bg-gray-50/50 border border-gray-100 rounded-xl text-[13px]
                text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2
                focus:ring-blue-100 transition-all"
            />
            <button
              type="button"
              onClick={() => addTerm()}
              className="px-4 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[13px] font-medium transition-all"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TERM_SUGGESTIONS.filter(s => !terms.includes(s)).slice(0, 6).map(s => (
              <button key={s} type="button" onClick={() => addTerm(s)}
                className="px-3 py-1 text-[11px] text-gray-500 border border-gray-200 rounded-full
                  hover:border-[#5CA3FF]/40 hover:text-[#5CA3FF] hover:bg-blue-50/50 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Regiões */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <MapPin className="size-3" />
            Regiões / Cidades
            <span className="text-gray-300 normal-case font-normal">(opcional)</span>
          </label>

          {regions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {regions.map(r => (
                <span key={r} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[12px] font-medium rounded-full border border-emerald-100">
                  <MapPin className="size-2.5" /> {r}
                  <button type="button" onClick={() => setRegions(p => p.filter(x => x !== r))}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={regionInput}
              onChange={e => setRegionInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRegion())}
              placeholder="Ex: São Paulo, SP"
              className="flex-1 h-10 px-4 bg-gray-50/50 border border-gray-100 rounded-xl text-[13px]
                text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2
                focus:ring-blue-100 transition-all"
            />
            <button type="button" onClick={() => addRegion()}
              className="px-4 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all">
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {REGION_SUGGESTIONS.filter(s => !regions.includes(s)).slice(0, 5).map(s => (
              <button key={s} type="button" onClick={() => addRegion(s)}
                className="px-3 py-1 text-[11px] text-gray-500 border border-gray-200 rounded-full
                  hover:border-emerald-400/40 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all"
              >
                <MapPin className="size-2.5 inline mr-1" />{s}
              </button>
            ))}
          </div>
        </div>

        {/* Configurações avançadas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Settings2 className="size-3" />
              Máx. Empresas
            </label>
            <select name="maxResults" defaultValue="50"
              className="w-full h-10 px-3 bg-gray-50/50 border border-gray-100 rounded-xl text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option value="20">20 empresas</option>
              <option value="50">50 empresas</option>
              <option value="100">100 empresas</option>
              <option value="200">200 empresas</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Raio de Busca
            </label>
            <select name="radiusKm" defaultValue="5"
              className="w-full h-10 px-3 bg-gray-50/50 border border-gray-100 rounded-xl text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option value="2">2 km</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setOpen(false)}
            className="flex-1 h-12 border border-gray-200 text-gray-600 rounded-full text-[13px] font-medium hover:bg-gray-50 transition-all">
            Cancelar
          </button>
          <button type="submit" disabled={isPending || terms.length === 0}
            className="flex-1 h-12 bg-[#5CA3FF] hover:bg-[#4b8ce0] disabled:opacity-50 disabled:cursor-not-allowed
              text-white rounded-full text-[13px] font-medium transition-all shadow-sm shadow-blue-500/20
              flex items-center justify-center gap-2">
            {isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Iniciando Apify...</>
            ) : (
              <><Sparkles className="size-3.5 fill-white" /> Iniciar Garimpo</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}