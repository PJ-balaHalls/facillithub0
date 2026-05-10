"use client";

import React, { useEffect, useState } from "react";
import { TemplateCard } from "./template-card";
import { getTemplates } from "../../actions/templates";
import { Loader2 } from "lucide-react";

// Tipagem exata baseada na sua tabela lab_templates
export type TemplateBase = {
  id: string;
  name: string;
  description: string;
  github_template_repo: string;
  niche: string;
  is_active: boolean;
  updated_at: string;
};

export function TemplateGrid() {
  const [templates, setTemplates] = useState<TemplateBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      const res = await getTemplates();
      if (res.success) {
        setTemplates(res.data);
      }
      setIsLoading(false);
    }
    
    fetchTemplates();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground w-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed rounded-lg text-muted-foreground bg-muted/20 w-full">
        Nenhum template base cadastrado. Clique em "Adicionar Template" para começar.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}