"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { manageSeal } from "../actions"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Zap, ShieldCheck } from "lucide-react"

interface Props {
  memberId: string
  memberName: string
  onSuccess: () => void
  children: React.ReactNode
}

// Certifique-se de que o nome da função é exatamente este
export function AssignSealModal({ memberId, memberName, onSuccess, children }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [definitions, setDefinitions] = useState<any[]>([])
  const [selectedSeal, setSelectedSeal] = useState("")
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      supabase.from('seal_definitions').select('*').order('priority', { ascending: false })
        .then(({ data }) => setDefinitions(data || []))
    }
  }, [open, supabase])

  const handleAction = async () => {
    if (!selectedSeal) return toast.error("Selecione um selo institucional.")
    
    setLoading(true)
    try {
      await manageSeal(memberId, selectedSeal, 'assign')
      toast.success("Autoridade digital validada", {
        description: `${memberName} recebeu um novo nível de confiança.`
      })
      onSuccess()
      setOpen(false)
    } catch (error: any) {
      toast.error("Falha na operação: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white rounded-[2rem] border-none shadow-[0_10px_40px_rgb(0,0,0,0.08)] sm:max-w-md p-8">
        <DialogHeader className="space-y-4 text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100/50 shadow-sm">
              <ShieldCheck className="size-6 text-[#5CA3FF]" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-lg font-semibold tracking-tight text-gray-900">Atribuir Autoridade</DialogTitle>
              <p className="text-[13px] font-light text-gray-500">Membro: <span className="font-medium text-gray-900">{memberName}</span></p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-8">
          <div className="space-y-3">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-1">Selo Disponível</Label>
            <Select onValueChange={setSelectedSeal}>
              <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-blue-100/50 transition-all outline-none">
                <SelectValue placeholder="Selecione um selo..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 shadow-xl overflow-hidden bg-white">
                {definitions.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="py-3 focus:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="font-medium text-gray-700">{s.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 pt-4 border-t border-gray-50">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)} 
            className="flex-1 rounded-full text-[13px] font-medium h-12 border border-gray-100 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAction} 
            disabled={loading}
            className="flex-1 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full text-[13px] font-medium h-12 transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 justify-center"
          >
            {loading ? <Loader2 className="animate-spin size-4" /> : <Zap className="size-3.5 fill-white" />}
            Confirmar Selo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}