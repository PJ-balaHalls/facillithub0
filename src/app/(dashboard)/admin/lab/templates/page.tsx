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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Templates Base</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gerencie os repositórios matriz que servem de base para os novos ambientes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* 3. O modal agora envolve o botão que serve de gatilho (Trigger) */}
          <CreateTemplateModal>
            <Button className="h-11 rounded-xl px-4 gap-2 transition-all duration-200 ease-in-out">
              <Plus className="w-4 h-4" />
              Adicionar Template
            </Button>
          </CreateTemplateModal>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Coluna Principal: Grid de Templates */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <TemplateGrid />
        </div>

        {/* Coluna Lateral: Status do Ambiente e Integrações */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          <EnvStatusPanel />
        </div>
      </div>
    </div>
  );
}