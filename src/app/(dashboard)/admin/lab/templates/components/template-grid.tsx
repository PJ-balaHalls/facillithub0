"use client";

import React, { useEffect, useState } from "react";
import { TemplateCard } from "./template-card";
import { getTemplates } from "../../actions/templates";
import { Loader2 } from "lucide-react";

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
      <div className="flex items-center justify-center p-6 text-muted-foreground w-full h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-center rounded-2xl border border-border/60 bg-muted/40 text-sm text-muted-foreground w-full h-40">
        Nenhum template base cadastrado. Clique em "Adicionar Template" para começar.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}