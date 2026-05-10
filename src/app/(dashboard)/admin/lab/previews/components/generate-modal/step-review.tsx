"use client";

import React from "react";
import { GenerateFormData } from "./index";
import { CheckCircle2, LayoutTemplate, Link as LinkIcon, Palette, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StepProps {
  data: GenerateFormData;
}

export function StepReview({ data }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-medium">Revisão Final</h3>
        <p className="text-sm text-muted-foreground">Verifique os dados antes de iniciar o processo de build do preview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Card: Identidade */}
        <div className="p-4 border rounded-lg bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-medium border-b pb-2">
            <LayoutTemplate className="w-4 h-4" />
            Estrutura e Identidade
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Template:</span> <Badge variant="outline">{data.templateId || "Não definido"}</Badge></p>
            <p><span className="text-muted-foreground">Negócio:</span> <span className="font-medium">{data.businessName || "Sem nome"}</span></p>
            <p><span className="text-muted-foreground">URL:</span> <code className="text-xs bg-muted p-1 rounded">https://{data.slug}.preview...</code></p>
          </div>
        </div>

        {/* Card: Visual */}
        <div className="p-4 border rounded-lg bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-medium border-b pb-2">
            <Palette className="w-4 h-4" />
            Visual e Marca
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground block text-xs">Cor Primária</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: data.primaryColor }} />
                <span className="font-mono text-xs">{data.primaryColor}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block text-xs">Logo</span>
              {data.logoUrl ? (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">Anexada</Badge>
              ) : (
                <Badge variant="outline">Padrão do Sistema</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Card: Conteúdo */}
        <div className="p-4 border rounded-lg bg-card space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-primary font-medium border-b pb-2">
            <Briefcase className="w-4 h-4" />
            Módulos Ativos
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary"><LinkIcon className="w-3 h-3 mr-1" /> {data.socialLinks.length} Redes Sociais</Badge>
            <Badge variant="secondary"><CheckCircle2 className="w-3 h-3 mr-1" /> {data.services.length} Serviços Cadastrados</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}