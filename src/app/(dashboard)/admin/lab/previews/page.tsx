"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate } from "lucide-react";
import { PreviewsTable } from "./components/previews-table";
import GenerateModal from "./components/generate-modal"; // Assumindo export default no seu index.tsx do modal

export default function PreviewsPage() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ambientes Preview</h2>
          <p className="text-muted-foreground">
            Gerencie os laboratórios temporários gerados para os clientes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsGenerateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Gerar Novo Preview
          </Button>
        </div>
      </div>

      {/* Área Principal de Listagem */}
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Instâncias Ativas</h3>
        </div>
        <PreviewsTable />
      </div>

      {/* Modal Orquestrador de Geração */}
      {isGenerateModalOpen && (
        <GenerateModal 
          isOpen={isGenerateModalOpen} 
          onClose={() => setIsGenerateModalOpen(false)} 
        />
      )}
    </div>
  );
}