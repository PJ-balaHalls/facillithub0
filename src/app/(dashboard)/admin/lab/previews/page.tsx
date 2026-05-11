// src/app/(dashboard)/admin/lab/previews/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Box } from "lucide-react";
import { PreviewsTable } from "./components/previews-table";
import { GenerateModal } from "./components/generate-modal";

export default function PreviewsPage() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ambientes Preview</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Laboratórios temporários instanciados para prospecção.
          </p>
        </div>
        
        {/* O BOTÃO VOLTOU: Fixo, vísivel e com estilo premium padronizado */}
        <Button 
          onClick={() => setIsGenerateModalOpen(true)}
          className="h-11 rounded-xl px-4 gap-2 transition-all duration-200 ease-in-out"
        >
          <Plus size={20} />
          Gerar Novo Preview
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 border-b border-border/60 flex items-center gap-4">
          <Box className="text-muted-foreground" size={20} />
          <h3 className="text-lg font-medium">Cluster de Instâncias Ativas</h3>
        </div>
        
        {/* Tabela de Previews Reais */}
        <PreviewsTable />
      </div>

      {/* Renderiza o Modal Orquestrador passando os controles corretos */}
      {isGenerateModalOpen && (
        <GenerateModal 
          isOpen={isGenerateModalOpen} 
          onClose={() => setIsGenerateModalOpen(false)} 
        />
      )}
    </div>
  );
}