// src/app/(dashboard)/admin/lab/templates/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TemplateGrid } from "./components/template-grid";
import { EnvStatusPanel } from "./components/env-status-panel";
// 1. Atualizamos a importação para o ficheiro correto
import { CreateTemplateModal } from "./components/create-template-modal";

export default function TemplatesPage() {
  // 2. Removemos o estado isCreateModalOpen, pois o novo modal gere-se a si próprio

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Templates Base</h2>
          <p className="text-muted-foreground">
            Gerencie os repositórios matriz que servem de base para os novos ambientes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* 3. O modal agora envolve o botão que serve de gatilho (Trigger) */}
          <CreateTemplateModal>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Template
            </Button>
          </CreateTemplateModal>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Coluna Principal: Grid de Templates */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <TemplateGrid />
        </div>

        {/* Coluna Lateral: Status do Ambiente e Integrações */}
        <div className="md:col-span-4 lg:col-span-3">
          <EnvStatusPanel />
        </div>
      </div>
    </div>
  );
}