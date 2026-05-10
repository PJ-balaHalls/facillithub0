"use client";

import React from "react";
import { GenerateFormData } from "./index";
import { CheckCircle2, LayoutTemplate, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Ícone SVG Customizado do Github
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface StepProps {
  data: GenerateFormData;
  updateData: (fields: Partial<GenerateFormData>) => void;
  templates?: any[]; // Recebe os templates do BD
  isLoading?: boolean;
}

export function StepTemplate({ data, updateData, templates = [], isLoading }: StepProps) {
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#5CA3FF]" />
        <p className="text-sm font-bold tracking-widest uppercase">Carregando matrizes...</p>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 text-center">
        <LayoutTemplate className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-700">Nenhum Template Ativo</h3>
        <p className="text-sm text-gray-500 mt-2">
          Você precisa cadastrar e ativar um "Template Mestre" na aba Templates antes de gerar um preview.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h3 className="text-xl font-extrabold text-[#0f172a]">Selecione a Matriz</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">Escolha a arquitetura base que será clonada para este cliente.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => updateData({ templateId: tpl.id, niche: tpl.niche })}
            className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 bg-white ${
              data.templateId === tpl.id 
                ? "border-[#5CA3FF] shadow-[0_0_0_4px_rgba(92,163,255,0.1)]" 
                : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl ${data.templateId === tpl.id ? 'bg-[#5CA3FF]/10 text-[#5CA3FF]' : 'bg-gray-100 text-gray-500'}`}>
                <LayoutTemplate className="w-5 h-5" />
              </div>
              {data.templateId === tpl.id && (
                <CheckCircle2 className="w-6 h-6 text-[#5CA3FF] drop-shadow-sm" />
              )}
            </div>
            
            <h4 className="font-extrabold text-gray-900 text-lg line-clamp-1">{tpl.name}</h4>
            <Badge variant="secondary" className="mt-2 text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600">
              {tpl.niche.replace('_', ' ')}
            </Badge>
            
            <p className="text-xs font-medium text-gray-500 mt-3 line-clamp-2 min-h-[32px]">
              {tpl.description || "Sem descrição técnica."}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] font-mono text-gray-400 truncate">
              <GithubIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">{tpl.github_template_repo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}