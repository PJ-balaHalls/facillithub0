// src/app/(dashboard)/admin/lab/templates/components/create-template-modal.tsx
"use client"

import { useState } from "react"
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

/**
 * Ícone do GitHub definido manualmente para evitar erro de exportação do lucide-react
 */
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
        toast.success("Template mestre configurado com sucesso!")
        setOpen(false)
      } else {
        toast.error("Erro ao salvar no banco: " + res.error)
      }
    } catch (err) {
      toast.error("Erro crítico na comunicação com o servidor de infraestrutura.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-[3.5rem] p-0 overflow-hidden border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col">
          
          {/* Header Ultrapremium - Lab Factory Identity */}
          <div className="bg-[#0a0a0a] p-12 text-white relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Layout className="size-48 rotate-12" />
            </div>
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#5CA3FF]/20 rounded-2xl border border-white/5">
                  <Layout className="size-8 text-[#5CA3FF]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5CA3FF]">Lab Factory v2.0</span>
                  <DialogTitle className="text-3xl font-bold tracking-tight mt-1">Configurar Template Mestre</DialogTitle>
                </div>
              </div>
              <p className="text-gray-400 text-sm font-light max-w-lg leading-relaxed">
                Registre o repositório base que servirá de semente para clonagem e injeção dinâmica de conteúdo para seus novos clientes.
              </p>
            </DialogHeader>
          </div>

          {/* Form Content - Scrolável */}
          <div className="p-12 space-y-12 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
            
            {/* Secção 1: Classificação Comercial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-[#5CA3FF]" />
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identificação</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="group space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 ml-1 group-focus-within:text-[#5CA3FF] transition-colors uppercase">Nome Público do Modelo</label>
                    <div className="relative">
                      <Tag className="absolute left-5 top-4.5 size-4 text-gray-300 group-focus-within:text-[#5CA3FF] transition-colors" />
                      <input 
                        name="name" 
                        required 
                        placeholder="Ex: Ultrapremium Restaurante v2" 
                        className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm font-medium text-gray-900" 
                      />
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 ml-1 group-focus-within:text-[#5CA3FF] transition-colors uppercase">Nicho de Mercado</label>
                    <div className="relative">
                      <Settings2 className="absolute left-5 top-4.5 size-4 text-gray-300" />
                      <select 
                        name="niche" 
                        className="w-full pl-12 pr-10 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm font-medium appearance-none text-gray-900 cursor-pointer"
                      >
                        <option value="restaurante">Gastronomia & Restaurantes</option>
                        <option value="clinica">Saúde & Clínicas Médicas</option>
                        <option value="salao_beleza">Estética & Centros de Beleza</option>
                        <option value="barbearia">Barbearia & Lifestyle Masculino</option>
                        <option value="academia">Fitness, Yoga & Academias</option>
                        <option value="outro">Serviços & Negócios Locais</option>
                      </select>
                      <div className="absolute right-5 top-5 pointer-events-none text-gray-300">
                        <Plus className="size-4 rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secção 2: Engine GitHub */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-[#5CA3FF]" />
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Repositório Cloud</h3>
                </div>

                <div className="p-8 bg-[#5CA3FF]/5 border border-[#5CA3FF]/10 rounded-[3rem] space-y-5 relative">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#5CA3FF] ml-1 uppercase">GitHub Source (Handle)</label>
                    <div className="relative">
                      <GithubIcon className="absolute left-5 top-4.5 size-4 text-[#5CA3FF]/40" />
                      <input 
                        name="github_template_repo" 
                        required 
                        placeholder="organizacao/nome-do-repo" 
                        className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-white border border-[#5CA3FF]/20 focus:ring-8 focus:ring-[#5CA3FF]/5 outline-none transition-all text-sm font-mono text-[#1a1a1a] placeholder:text-gray-300 shadow-sm" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-[#5CA3FF]/5">
                    <ShieldCheck className="size-5 text-[#5CA3FF] shrink-0" />
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                      O motor automático utilizará este repositório como <strong className="text-gray-700">Source of Truth</strong> para gerar os sites dos clientes. Certifique-se de que ele contém o arquivo index.html com os tokens de substituição.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secção 3: Visualização e Vendas */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#5CA3FF]" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Entrega & Demonstração</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 ml-1 group-focus-within:text-[#5CA3FF] transition-colors uppercase">URL de Live Preview</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-5 top-4.5 size-4 text-gray-300" />
                    <input 
                      name="preview_demo_url" 
                      placeholder="https://exemplo-modelo.com.br" 
                      className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm text-gray-900 shadow-sm" 
                    />
                  </div>
                </div>

                <div className="group space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 ml-1 group-focus-within:text-[#5CA3FF] transition-colors uppercase">Thumbnail do Template (URL)</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-4.5 size-4 text-gray-300" />
                    <input 
                      name="thumbnail_url" 
                      placeholder="https://link-da-imagem.jpg" 
                      className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm text-gray-900 shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="group space-y-2">
                <label className="text-[11px] font-bold text-gray-400 ml-1 group-focus-within:text-[#5CA3FF] transition-colors uppercase">Notas Estratégicas (Argumentos de Venda)</label>
                <div className="relative">
                  <FileText className="absolute left-6 top-6 size-4 text-gray-300" />
                  <textarea 
                    name="description" 
                    rows={4} 
                    placeholder="Descreva os diferenciais deste modelo para que o time de vendas saiba como oferecê-lo..." 
                    className="w-full pl-14 pr-8 py-6 rounded-[2.5rem] bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#5CA3FF]/10 outline-none transition-all text-sm text-gray-900 resize-none shadow-inner" 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Footer Fixo */}
          <div className="p-12 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
            <button 
              type="button" 
              onClick={() => setOpen(false)} 
              className="px-8 py-4 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]"
            >
              Descartar
            </button>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-3 px-14 py-5 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full font-black text-sm transition-all shadow-[0_20px_40px_-10px_rgba(92,163,255,0.4)] disabled:opacity-50 active:scale-95 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Plus className="size-5" />
                  Ativar Template na Fábrica
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}