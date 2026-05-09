"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"

interface Props {
  workspaceId: string
  workspaceName: string
  onSuccess: () => void
  children: React.ReactNode
}

export function AssignSealModal({ workspaceId, workspaceName, onSuccess, children }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [definitions, setDefinitions] = useState<any[]>([])
  const [selectedSeal, setSelectedSeal] = useState<string>("")
  const [expiresIn, setExpiresIn] = useState<string>("never")

  const supabase = createClient()

  useEffect(() => {
    if (open) {
      supabase.from('seal_definitions').select('*').order('name').then(({ data }) => {
        if (data) setDefinitions(data)
      })
    }
  }, [open])

  const handleAssign = async () => {
    if (!selectedSeal) return toast.error("Selecione um selo")
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    let expiresAt = null
    if (expiresIn === "6months") expiresAt = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
    if (expiresIn === "1year") expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

    const { error } = await supabase
      .from('workspace_seals')
      .upsert({
        workspace_id: workspaceId,
        seal_id: selectedSeal,
        granted_by: user?.id,
        expires_at: expiresAt,
        granted_at: new Date().toISOString()
      })

    if (error) {
      toast.error("Erro ao atribuir selo: " + error.message)
    } else {
      toast.success(`Selo atribuído a ${workspaceName}`)
      onSuccess()
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Atribuir Selo de Confiança</DialogTitle>
          <p className="text-sm text-gray-500">Workspace: <span className="text-black font-semibold">{workspaceName}</span></p>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-gray-400">Tipo de Selo</Label>
            <Select onValueChange={setSelectedSeal}>
              <SelectTrigger className="bg-gray-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Selecione o selo oficial" />
              </SelectTrigger>
              <SelectContent>
                {definitions.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="focus:bg-blue-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-gray-400">Validade da Atribuição</Label>
            <Select onValueChange={setExpiresIn} defaultValue="never">
              <SelectTrigger className="bg-gray-50 border-none h-12 rounded-xl focus:ring-1 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Permanente (Vitalício)</SelectItem>
                <SelectItem value="6months">6 Meses</SelectItem>
                <SelectItem value="1year">1 Ano (Renovável)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)}
            className="rounded-xl text-gray-500"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={loading}
            className="bg-black text-white hover:bg-gray-800 rounded-xl px-8 h-11"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Atribuição"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}