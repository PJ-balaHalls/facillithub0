// src/app/(dashboard)/admin/lab/templates/components/create-template-modal.tsx
"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createTemplate } from "../../actions"
import { toast } from "sonner"
import { 
  Globe, 
  Tag, 
  FileText, 
  Loader2, 
  Plus, 
  Info, 
  Layout, 
  ExternalLink, 
  Settings2, 
  ShieldCheck 
} from "lucide-react"

// Ícone SVG Customizado do Github
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export function CreateTemplateModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    try {
      const res = await createTemplate(data)
      if (res.success) {
        toast.success("Template mestre configurado!")
        setOpen(false)
      } else {
        toast.error("Erro: " + res.error)
      }
    } catch {
      toast.error("Erro de rede.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-[3.5rem] p-0 overflow-hidden border-none bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="bg-[#0a0a0a] p-12 text-white shrink-0 relative">
            <Layout className="absolute top-0 right-0 p-12 size-48 opacity-10 rotate-12" />
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#5CA3FF]/20 rounded-2xl">
                  <Layout className="size-8 text-[#5CA3FF]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5CA3FF]">Lab Factory v2.0</span>
                  <DialogTitle className="text-3xl font-bold tracking-tight">Novo Template Mestre</DialogTitle>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-12 space-y-12 max-h-[60vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identificação</h3>
                <div className="space-y-5">
                  <div className="relative">
                    <Tag className="absolute left-5 top-4.5 size-4 text-gray-300" />
                    <input name="name" required placeholder="Nome do Modelo" className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-sm text-gray-900" />
                  </div>
                  <div className="relative">
                    <Settings2 className="absolute left-5 top-4.5 size-4 text-gray-300" />
                    <select name="niche" className="w-full pl-12 pr-10 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-sm text-gray-900 appearance-none">
                      <option value="restaurante">Restaurantes</option>
                      <option value="clinica">Saúde</option>
                      <option value="salao_beleza">Beleza</option>
                      <option value="barbearia">Barbearia</option>
                      <option value="academia">Fitness</option>
                      <option value="outro">Outros</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Repositório Cloud</h3>
                <div className="p-8 bg-[#5CA3FF]/5 border border-[#5CA3FF]/10 rounded-[3rem] space-y-5">
                  <div className="relative">
                    <GithubIcon className="absolute left-5 top-4.5 size-4 text-[#5CA3FF]/40" />
                    <input name="github_template_repo" required placeholder="organizacao/repo" className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-white border border-[#5CA3FF]/20 text-sm font-mono text-[#1a1a1a]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visualização e Vendas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input name="preview_demo_url" placeholder="URL Live Preview" className="w-full px-6 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-sm" />
                <input name="thumbnail_url" placeholder="Thumbnail URL" className="w-full px-6 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-sm" />
              </div>
              <textarea name="description" rows={4} placeholder="Argumentos de venda..." className="w-full px-8 py-6 rounded-[2.5rem] bg-gray-50 border border-gray-100 outline-none text-sm resize-none" />
            </div>
          </div>

          <div className="p-12 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
            <button type="button" onClick={() => setOpen(false)} className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Cancelar</button>
            <button type="submit" disabled={loading} className="flex items-center gap-3 px-14 py-5 bg-[#5CA3FF] text-white rounded-full font-black text-sm uppercase tracking-wider disabled:opacity-50">
              {loading ? <Loader2 className="size-5 animate-spin" /> : <><Plus className="size-5" /> Ativar Template</>}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}