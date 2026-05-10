// src/app/(dashboard)/admin/lab/templates/components/create-template-modal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createTemplate } from "../../actions"
import { toast } from "sonner"
import { Globe, Tag, FileText, Loader2 } from "lucide-react"

export function CreateTemplateModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    // Transforma o formulário em um objeto para a action
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await createTemplate(data)
      if (res.success) {
        toast.success("Template cadastrado com sucesso e sincronizado com GitHub!")
        setOpen(false)
      } else {
        toast.error("Erro ao cadastrar: " + res.error)
      }
    } catch (err) {
      toast.error("Falha na conexão com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-8 bg-white border-gray-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <PlusCircle className="size-6 text-[#5CA3FF]" />
            Novo Template
          </DialogTitle>
          <p className="text-sm text-gray-500 font-light mt-1">
            Conecte um repositório GitHub para torná-lo um modelo oficial da Fábrica.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome do Modelo</label>
              <div className="relative">
                <Tag className="absolute left-4 top-3.5 size-4 text-gray-400" />
                <input name="name" required placeholder="Ex: Ultrapremium Restaurante" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#5CA3FF] focus:border-transparent transition-all text-sm text-gray-900 outline-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nicho</label>
              <select name="niche" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#5CA3FF] focus:border-transparent transition-all text-sm text-gray-900 outline-none appearance-none">
                <option value="restaurante">Restaurante</option>
                <option value="clinica">Clínica</option>
                <option value="salao_beleza">Salão de Beleza</option>
                <option value="barbearia">Barbearia</option>
                <option value="academia">Academia</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Repositório GitHub (Source)</label>
            <div className="relative">
              <GithubIconInput className="absolute left-4 top-3.5 size-4 text-gray-400" />
              <input name="github_template_repo" required placeholder="facillithub/template-restaurante-ultra" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#5CA3FF] focus:border-transparent transition-all text-sm font-mono text-gray-900 outline-none" />
            </div>
            <p className="text-[10px] text-gray-400 ml-1">Exatamente como está no GitHub (dono/repositório). Lembre de marcar como "Template" lá.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">URL de Demonstração (Opcional)</label>
            <div className="relative">
              <Globe className="absolute left-4 top-3.5 size-4 text-gray-400" />
              <input name="preview_demo_url" placeholder="https://exemplo.com.br" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#5CA3FF] focus:border-transparent transition-all text-sm text-gray-900 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 size-4 text-gray-400" />
              <textarea name="description" rows={3} placeholder="Descreva as principais características deste modelo..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#5CA3FF] focus:border-transparent transition-all text-sm text-gray-900 resize-none outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-2xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm shadow-blue-500/30">
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Confirmar e Cadastrar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Ícones auxiliares em SVG para evitar dependências ausentes
function PlusCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
  )
}

function GithubIconInput(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  )
}