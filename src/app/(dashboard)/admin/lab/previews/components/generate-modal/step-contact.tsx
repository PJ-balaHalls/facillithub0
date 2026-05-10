"use client";

import React from "react";
import { GenerateFormData } from "./index";
// Correção: Voltando apenas 3 níveis
import { SocialLinksEditor } from "../../../_components/social-links-editor";

interface StepProps {
  data: GenerateFormData;
  updateData: (fields: Partial<GenerateFormData>) => void;
}

export function StepContact({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-medium">Canais de Contato</h3>
        <p className="text-sm text-muted-foreground">Adicione os links das redes sociais e contatos do cliente.</p>
      </div>

      <div className="p-4 border rounded-lg bg-card">
        <SocialLinksEditor 
          links={data.socialLinks} 
          onChange={(links) => updateData({ socialLinks: links })} 
        />
      </div>
    </div>
  );
}