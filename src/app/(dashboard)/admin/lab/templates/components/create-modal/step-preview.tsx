"use client";

import React from "react";
import { CreateTemplateData } from "./index";
import { Badge } from "@/components/ui/badge";
import { Github, FolderGit2 } from "lucide-react";

interface StepProps {
  data: CreateTemplateData;
}

export function StepPreview({ data }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-medium">Revisão de Vínculo</h3>
        <p className="text-sm text-muted-foreground">Confira os dados antes de salvar o template base no sistema.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-medium border-b pb-2">
            <FolderGit2 className="w-4 h-4" />
            Identificação
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> <span className="font-medium">{data.name || "Não informado"}</span></p>
            <p><span className="text-muted-foreground">Categoria:</span> <Badge variant="secondary">{data.category || "Geral"}</Badge></p>
            <div>
              <span className="text-muted-foreground block mb-1">Descrição:</span>
              <p className="text-xs bg-muted p-2 rounded text-muted-foreground line-clamp-3">
                {data.description || "Nenhuma descrição fornecida."}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-medium border-b pb-2">
            <Github className="w-4 h-4" />
            Fonte do Código
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Repositório:</span>{' '}
              <code className="text-xs bg-muted p-1 rounded font-mono">
                {data.repoUrl ? `github.com/${data.repoUrl}` : "Não informado"}
              </code>
            </p>
            <p>
              <span className="text-muted-foreground">Branch alvo:</span>{' '}
              <Badge variant="outline" className="font-mono">{data.branch}</Badge>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}