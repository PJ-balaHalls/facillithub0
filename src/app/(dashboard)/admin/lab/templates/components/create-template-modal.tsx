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
      toast.success("Template ativado com sucesso!");
      setOpen(false);
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl rounded-2xl p-6 border border-border/60 bg-background shadow-sm flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">Factory: Template Mestre</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Configure o repositório base que servirá de matriz para deploys automatizados.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Segmentação de Mercado</label>
                <div className="grid grid-cols-3 gap-2">
                  {NICHES.map((n) => (
                    <button
                      key={n.key}
                      type="button"
                      onClick={() => setSelectedNiche(n.key)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ease-in-out ${
                        selectedNiche === n.key 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-border bg-background hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <n.icon size={20} className="mb-1" />
                      <span className="text-xs font-medium">{n.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome Comercial</label>
                  <input name="name" required placeholder="Ex: Delivery Pro V3" className="h-11 rounded-xl px-4 border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Descrição Técnica</label>
                  <textarea name="description" rows={3} placeholder="Diferenciais técnicos deste modelo..." className="rounded-xl p-4 border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all text-sm resize-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/60 bg-muted/40">
                <label className="text-sm font-medium">Conector GitHub</label>
                <div className="relative">
                  <GithubIcon className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
                  <input name="github_template_repo" required placeholder="org/repositorio" className="h-11 w-full pl-11 pr-4 rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all text-sm font-mono" />
                </div>
                <p className="text-xs text-muted-foreground">O sistema irá clonar automaticamente este repositório durante o processo de geração de leads.</p>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <div className="relative">
                  <Smartphone className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
                  <input name="preview_demo_url" placeholder="URL Live Demo" className="h-11 w-full pl-11 pr-4 rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all text-sm" />
                </div>
                <div className="relative">
                  <Layout className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
                  <input name="thumbnail_url" placeholder="URL da Thumbnail" className="h-11 w-full pl-11 pr-4 rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 outline-none transition-all text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/60">
            <button type="button" onClick={() => setOpen(false)} className="h-11 rounded-xl px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out">
              Descartar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl px-6 bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 ease-in-out disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin size-4" /> : <><Plus size={16} /> Ativar no Cluster</>}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}