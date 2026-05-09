"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Award, ShieldAlert, Check } from "lucide-react"

export function AssignSealModal({ workspaceId, workspaceName, onSuccess, children }: any) {
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
  }, [open])

  const handleAssign = async () => {
    if (!selectedSeal) return toast.error("Selecione um selo institucional.")
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('workspace_seals').upsert({
      workspace_id: workspaceId,
      seal_id: selectedSeal,
      granted_by: user?.id,
      granted_at: new Date().toISOString()
    })

    if (!error) {
      toast.success("Autoridade Concedida!", {
        description: `O selo agora está vinculado ao perfil de ${workspaceName}`,
        icon: <Check className="text-green-500" />
      })
      onSuccess()
      setOpen(false)
    } else {
      toast.error("Erro na Atribuição: " + error.message)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white rounded-[40px] border-none shadow-2xl sm:max-w-xl p-12">
        <DialogHeader className="space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-4xl font-black tracking-tighter">Conceder Selo</DialogTitle>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Você está prestes a elevar a autoridade de <span className="text-black font-bold underline decoration-blue-500 underline-offset-4">{workspaceName}</span>.
          </p>
        </DialogHeader>

        <div className="space-y-8 py-8">
          <div className="space-y-3">
            <Label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Escolha o Selo Oficial</Label>
            <Select onValueChange={setSelectedSeal}>
              <SelectTrigger className="h-20 bg-gray-50 border-none rounded-[24px] px-8 text-xl font-bold focus:ring-4 focus:ring-blue-100 transition-all">
                <SelectValue placeholder="Selecione na biblioteca..." />
              </SelectTrigger>
              <SelectContent className="rounded-[32px] border-none shadow-2xl p-4">
                {definitions.map(s => (
                  <SelectItem key={s.id} value={s.id} className="rounded-[20px] py-4 px-6 focus:bg-blue-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: s.color }} />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{s.name}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{s.key}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 bg-orange-50 rounded-[24px] flex gap-4 border border-orange-100/50">
            <ShieldAlert className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
            <p className="text-xs text-orange-800 leading-relaxed font-bold">
              ATENÇÃO: A atribuição manual é auditada e ficará associada ao seu usuário Admin Master. Isso altera a percepção pública do negócio.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-[20px] h-16 text-gray-400 font-black px-8 hover:bg-gray-50">
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={loading} className="bg-black text-white hover:bg-gray-800 rounded-[20px] h-16 px-12 font-black flex-1 shadow-xl shadow-black/10">
            {loading ? <Loader2 className="animate-spin" /> : "Confirmar e Validar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}