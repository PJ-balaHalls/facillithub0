"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createTemplate } from "../../actions/templates";
import { toast } from "sonner";
import { 
  Layout, Globe, Smartphone, 
  Utensils, Stethoscope, Scissors, 
  Dumbbell, Briefcase, Plus, Loader2 
} from "lucide-react";

// Ícone SVG Customizado do Github para evitar o erro do lucide-react
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const NICHES = [
  { key: "restaurante", label: "Gastronomia", icon: Utensils },
  { key: "clinica", label: "Saúde", icon: Stethoscope },
  { key: "salao_beleza", label: "Beleza", icon: Scissors },
  { key: "academia", label: "Fitness", icon: Dumbbell },
  { key: "servicos", label: "Serviços", icon: Briefcase },
  { key: "outro", label: "Geral", icon: Globe },
];

export function CreateTemplateModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState("outro");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(formData.entries()), niche: selectedNiche };

    const res = await createTemplate(data);
    if (res.success) {
      toast.success("Template mestre ativado com sucesso!");
      setOpen(false);
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[850px] p-0 border-none bg-white shadow-2xl rounded-3xl overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header Finder-Style */}
          <div className="bg-[#0f172a] p-8 text-white relative">
            <div className="absolute top-0 right-0 opacity-10 p-4">
              <Layout size={120} />
            </div>
            <DialogHeader>
              <p className="text-[#5CA3FF] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Engenharia de Software</p>
              <DialogTitle className="text-3xl font-extrabold tracking-tight">Factory: Template Mestre</DialogTitle>
              <p className="text-gray-400 text-sm mt-2 max-w-md">Configure o repositório base que servirá de matriz para deploys automatizados.</p>
            </DialogHeader>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto bg-white">
            {/* Coluna Esquerda: Nicho e Identificação */}
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-4 block">Segmentação de Mercado</label>
                <div className="grid grid-cols-3 gap-2">
                  {NICHES.map((n) => (
                    <button
                      key={n.key}
                      type="button"
                      onClick={() => setSelectedNiche(n.key)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        selectedNiche === n.key 
                        ? "border-[#5CA3FF] bg-blue-50 text-[#5CA3FF]" 
                        : "border-gray-100 hover:bg-gray-50 text-gray-500"
                      }`}
                    >
                      <n.icon size={20} className="mb-1" />
                      <span className="text-[10px] font-bold">{n.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Nome Comercial</label>
                  <input name="name" required placeholder="Ex: Delivery Pro V3" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#5CA3FF] focus:ring-0 transition-all text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Descrição Técnica</label>
                  <textarea name="description" rows={3} placeholder="Diferenciais técnicos deste modelo..." className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#5CA3FF] transition-all text-sm resize-none" />
                </div>
              </div>
            </div>

            {/* Coluna Direita: Repositório e Links */}
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Conector GitHub</label>
                <div className="relative">
                  <GithubIcon className="absolute left-4 top-3 size-4 text-gray-400" />
                  <input name="github_template_repo" required placeholder="org/repositorio" className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-mono" />
                </div>
                <p className="text-[10px] text-gray-400 italic">O sistema irá clonar automaticamente este repositório durante o processo de geração de leads.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Smartphone className="absolute left-4 top-3 size-4 text-gray-400" />
                  <input name="preview_demo_url" placeholder="URL Live Demo" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm" />
                </div>
                <div className="relative">
                  <Layout className="absolute left-4 top-3 size-4 text-gray-400" />
                  <input name="thumbnail_url" placeholder="URL da Thumbnail" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Ações */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-4">
              <button type="button" onClick={() => setOpen(false)} className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all">Descartar</button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0f172a] hover:bg-black text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg flex items-center gap-3 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin size-4" /> : <><Plus size={18} /> Ativar no Cluster</>}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}