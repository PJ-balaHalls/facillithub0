"use client";

import React from "react";
import { CreateTemplateData } from "./index";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";

interface StepProps {
  data: CreateTemplateData;
  updateData: (fields: Partial<CreateTemplateData>) => void;
}

export function StepRepo({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-medium">Conexão com o Repositório</h3>
        <p className="text-sm text-muted-foreground">Informe o repositório base que será clonado para os novos previews.</p>
      </div>

      <div className="p-4 bg-muted/50 border rounded-lg flex items-start gap-3 mb-4">
        <Github className="w-5 h-5 mt-0.5 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          O sistema precisa de acesso de leitura a este repositório através do GitHub App configurado.
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repoUrl">Caminho do Repositório</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              github.com/
            </span>
            <Input 
              id="repoUrl" 
              className="rounded-none rounded-r-md font-mono" 
              placeholder="sua-org/nome-do-repo" 
              value={data.repoUrl}
              onChange={(e) => updateData({ repoUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch Principal (Padrão: main)</Label>
          <Input 
            id="branch" 
            placeholder="main" 
            value={data.branch}
            onChange={(e) => updateData({ branch: e.target.value })}
            className="font-mono"
          />
        </div>
      </div>
    </div>
  );
}