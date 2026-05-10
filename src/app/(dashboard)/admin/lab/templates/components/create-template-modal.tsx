// src/app/(dashboard)/admin/lab/templates/components/create-template-modal.tsx
"use client"

import { useState, useTransition } from "react"
import { createTemplate } from "../../../lab/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NICHE_LABELS } from "@/types/lab"
import type { LabNiche } from "@/types/lab"
import { Loader2, Layers } from "lucide-react"
import { toast } from "sonner"

export function CreateTemplateModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [niche, setNiche] = useState<LabNiche | ''>('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (niche) fd.set('niche', niche)

    startTransition(async () => {
      try {
        await createTemplate(fd)
        toast.success('Template criado com sucesso!')
        setOpen(false)
      } catch (err: any) {
        toast.error('Erro: ' + err.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white rounded-[2rem] border-none shadow-[0_10px_40px_rgb(0,0,0,0.08)] sm:max-w-lg p-8">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-100">
              <Layers className="size-5 text-[#5CA3FF]" />
            </div>
            <DialogTitle className="text-lg font-semibold tracking-tight">Novo Template</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Nome</Label>
            <Input name="name" placeholder="Ex: Template Restaurante Premium" required
              className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Nicho</Label>
            <Select onValueChange={(v) => setNiche(v as LabNiche)} required>
              <SelectTrigger className="h-11 bg-gray-50 border-gray-100 rounded-xl w-full">
                <SelectValue placeholder="Selecione o nicho..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {(Object.entries(NICHE_LABELS) as [LabNiche, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Repositório Template (GitHub)
            </Label>
            <Input name="github_template_repo" placeholder="facillithub/template-restaurante" required
              className="h-11 bg-gray-50 border-gray-100 rounded-xl font-mono text-[13px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">URL Demo</Label>
              <Input name="preview_demo_url" placeholder="https://..." type="url"
                className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Thumbnail URL</Label>
              <Input name="thumbnail_url" placeholder="https://..." type="url"
                className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Descrição</Label>
            <Input name="description" placeholder="Página única com cardápio tokenizado..."
              className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-50">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}
              className="flex-1 rounded-full h-11 border border-gray-100">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !niche}
              className="flex-1 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full h-11">
              {isPending ? <Loader2 className="animate-spin size-4" /> : 'Criar Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}