// src/app/(dashboard)/admin/lab/templates/components/create-template-modal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createTemplate } from "../../actions"
import { toast } from "sonner"
import { Github, Globe, Tag, FileText, Loader2, Plus, Info, Layout, ExternalLink, Settings2, ShieldCheck } from "lucide-react"

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
        toast.success("Template configurado com sucesso!")
        setOpen(false)
      } else {
        toast.error("Erro ao salvar: " + res.error)
      }
    } catch (err) {
      toast.error("Erro na comunicação com o Lab Server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[750px] rounded-[3.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
        <form onSubmit={handleSubmit}>
          {/* Top Header Dark */}
          <div className="bg-[#0a0a0a] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Layout className="size-40 rotate-12" />
            </div>
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#5CA3FF]/20 rounded-2xl border border-white/5">
                  <Layout className="size-7 text-[#5CA3FF]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5CA3FF]">Lab Infrastructure</span>
                  <DialogTitle className="text-3xl font-bold tracking-tight">Novo Template Mestre</DialogTitle>
                </div>
              </div>
              <p className="text-gray-400 text-sm font-light max-w-md leading-relaxed">
                Conecte um repositório GitHub para servir de base. O sistema clonará este código para cada novo cliente.
              </p>
            </DialogHeader>
          </div>

          <div className="p-12 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
            
            {/* Bloco 1: Identidade Visual e Comercial */}
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Tag className="size-3" /> Identificação do Modelo
                </h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 ml-1">NOME DO TEMPLATE</label>
                    <input name="name" required placeholder="Ex: Restaurante Ultra v2" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm font-medium text-gray-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 ml-1">NICHO PRINCIPAL</label>
                    <div className="relative">
                      <select name="niche" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm font-medium appearance-none text-gray-900">
                        <option value="restaurante">Gastronomia & Restaurantes</option>
                        <option value="clinica">Saúde & Bem-estar</option>
                        <option value="salao_beleza">Estética & Beleza</option>
                        <option value="barbearia">Barbearia & Estilo</option>
                        <option value="academia">Fitness & Esportes</option>
                        <option value="outro">Serviços Especializados</option>
                      </select>
                      <Settings2 className="absolute right-6 top-5 size-4 text-gray-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco 2: Integração GitHub */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Github className="size-3" /> Conexão Cloud
                </h3>
                <div className="p-8 bg-[#5CA3FF]/5 border border-[#5CA3FF]/10 rounded-[2.5rem] space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#5CA3FF] ml-1">REPOSITÓRIO FONTE (GITHub)</label>
                    <div className="relative">
                      <Github className="absolute left-5 top-4 size-4 text-[#5CA3FF]/40" />
                      <input name="github_template_repo" required placeholder="facillithub/nome-do-repo" className="w-full pl-12 pr-6 py-4 rounded-xl bg-white border border-[#5CA3FF]/20 focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm font-mono text-[#5CA3FF] placeholder:text-[#5CA3FF]/20" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-1">
                    <ShieldCheck className="size-4 text-[#5CA3FF] mt-0.5 shrink-0" />
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                      O motor clonará os arquivos deste repositório e injetará as cores e o cardápio automaticamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 3: Demo e Vendas */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe className="size-3" /> Entrega Comercial
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 ml-1">URL DE DEMONSTRAÇÃO (O que o cliente vê)</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-6 top-4.5 size-4 text-gray-300" />
                    <input name="preview_demo_url" placeholder="https://exemplo-modelo.com.br" className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm text-gray-900" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 ml-1">NOTAS PARA O TIME DE VENDAS</label>
                  <textarea name="description" rows={3} placeholder="Descreva os diferenciais deste modelo..." className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm text-gray-900 resize-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Footer fixo */}
          <div className="p-10 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button type="button" onClick={() => setOpen(false)} className="px-8 py-3 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-[0.2em]">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-3 px-12 py-5 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-[2rem] font-bold text-sm transition-all shadow-xl shadow-[#5CA3FF]/20 disabled:opacity-50 active:scale-95">
              {loading ? <Loader2 className="size-5 animate-spin" /> : <><Plus className="size-5" /> Ativar Modelo na Fábrica</>}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}