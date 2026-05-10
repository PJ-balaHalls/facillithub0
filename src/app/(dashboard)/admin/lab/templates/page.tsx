"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TemplateGrid } from "./components/template-grid";
import { EnvStatusPanel } from "./components/env-status-panel";
import CreateTemplateModal from "./components/create-modal"; // O index.tsx do modal

export default function TemplatesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Template
          </Button>
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

      {/* Modal Orquestrador de Criação de Template */}
      {isCreateModalOpen && (
        <CreateTemplateModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}
    </div>
  );
}