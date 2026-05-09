"use client"

import { useState, useTransition } from "react"
import { 
  Sheet, SheetClose, SheetContent, SheetDescription, 
  SheetFooter, SheetHeader, SheetTitle, SheetTrigger 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, Sparkles, Plus, X, MapPin, 
  Zap, Loader2, Layers
} from "lucide-react"
import { toast } from "sonner"
import { createSearch } from "../actions"

const SUGGESTED_NICHE = [
  "Restaurantes", "Barbearias", "Clínicas Médicas", "Pet Shops", "Academias", 
  "Oficinas", "Escolas", "Imobiliárias", "Estética", "Hoteis", "Farmácias",
  "Pizzarias", "Hamburguerias", "Clínicas Odontológicas", "Autoescolas"
]

const SUGGESTED_CITIES = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR", 
  "Porto Alegre, RS", "Brasília, DF", "Campinas, SP", "Guarulhos, SP"
]

export function SearchDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const [terms, setTerms] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [termInput, setTermInput] = useState("")
  const [regionInput, setRegionInput] = useState("")
  const [goldMode, setGoldMode] = useState(false)

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
    if (terms.length === 0) return toast.error("Adicione ao menos um segmento")

    const formData = new FormData(e.currentTarget)
    formData.set('searchTerms', terms.join('\n'))
    formData.set('regions', regions.join('\n'))
    formData.set('priority_mode', goldMode ? 'gold_opportunity' : 'standard')

    startTransition(async () => {
      try {
        await createSearch(formData)
        toast.success(goldMode ? "Operação OURO Lançada!" : "Garimpo Iniciado!", {
          description: "O robô de busca está em campo agora.",
        })
        setIsOpen(false)
        setTerms([])
        setRegions([])
      } catch (err: any) {
        toast.error("Erro ao iniciar", { description: err.message })
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full px-6 bg-[#5CA3FF] hover:bg-blue-600 shadow-lg gap-2 h-11 transition-all hover:scale-105">
          <Search className="size-4" /> Nova Busca Inteligente
        </Button>
      </SheetTrigger>
      
      <SheetContent className="bg-white h-full w-full max-w-md sm:max-w-lg border-l shadow-2xl flex flex-col p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          
          <SheetHeader className="px-8 pt-10 pb-6 border-b border-gray-50 bg-white">
            <div className="p-2.5 bg-blue-50 rounded-2xl w-fit mb-4">
              <Zap className="size-5 text-blue-600 fill-blue-600" />
            </div>
            <SheetTitle className="text-2xl font-bold text-gray-900">Configurar Garimpo</SheetTitle>
            <SheetDescription className="text-sm text-gray-400">
              Personalize o motor de busca e os filtros de IA.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-white">
            
            {/* MODO OPORTUNIDADE OURO */}
            <div 
              className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${
                goldMode ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 hover:border-amber-200'
              }`}
              onClick={() => setGoldMode(!goldMode)}
            >
              <div className="flex items-start gap-4">
                <Checkbox checked={goldMode} onCheckedChange={(v) => setGoldMode(!!v)} className="mt-1 border-amber-400" />
                <div className="space-y-1">
                  <Label className="text-[14px] font-bold text-amber-900 flex items-center gap-2 cursor-pointer">
                    <Sparkles className="size-3.5 fill-amber-500 text-amber-500" /> Oportunidade Ouro
                  </Label>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Filtro especializado para empresas ativas que <strong>não possuem site ou redes sociais</strong> atualizadas.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Nome da Operação</Label>
              <Input name="name" required placeholder="Ex: Restaurantes Jardins" className="h-12 rounded-2xl bg-gray-50/50" />
            </div>

            {/* Segmentos */}
            <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Nicho de Negócio</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {terms.map(t => (
                  <span key={t} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded-full border border-blue-100">
                    {t} <X className="size-3 cursor-pointer" onClick={() => setTerms(p => p.filter(x => x !== t))} />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={termInput} onChange={e => setTermInput(e.target.value)} placeholder="Nicho manual..." className="rounded-xl h-11" />
                <Button type="button" onClick={() => addTerm()} variant="secondary" className="rounded-xl"><Plus /></Button>
              </div>
              <Select onValueChange={addTerm}>
                <SelectTrigger className="h-11 rounded-xl bg-white border-dashed text-gray-400"><SelectValue placeholder="Sugestões" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  {SUGGESTED_NICHE.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Regiões */}
            <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Região de Atendimento</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {regions.map(r => (
                  <span key={r} className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-[12px] font-medium rounded-full border border-emerald-100">
                    <MapPin className="size-3" /> {r} <X className="size-3 cursor-pointer" onClick={() => setRegions(p => p.filter(x => x !== r))} />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={regionInput} onChange={e => setRegionInput(e.target.value)} placeholder="Bairro/Cidade..." className="rounded-xl h-11" />
                <Button type="button" onClick={() => addRegion()} variant="secondary" className="rounded-xl"><Plus /></Button>
              </div>
              <Select onValueChange={addRegion}>
                <SelectTrigger className="h-11 rounded-xl bg-white border-dashed text-gray-400"><SelectValue placeholder="Sugestões" /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  {SUGGESTED_CITIES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-50" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Máx Empresas</Label>
                <Input name="maxResults" type="number" defaultValue={20} className="rounded-xl bg-gray-50/50 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <Layers className="size-3" /> Agrupamento
                </Label>
                <Input name="batch_size" type="number" defaultValue={10} className="rounded-xl bg-gray-50/50 h-11" />
              </div>
            </div>

          </div>

          <SheetFooter className="px-8 py-8 border-t border-gray-50 bg-white">
            <Button type="submit" disabled={isPending} className="w-full h-14 rounded-2xl bg-black text-white font-bold shadow-xl hover:scale-105 transition-all">
              {isPending ? <Loader2 className="animate-spin mr-2" /> : <Zap className="size-4 mr-2 fill-current" />}
              Lançar Robô de Busca
            </Button>
          </SheetFooter>

        </form>
      </SheetContent>
    </Sheet>
  )
}