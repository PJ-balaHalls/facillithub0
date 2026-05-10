"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Box } from "lucide-react";
import { PreviewsTable } from "./components/previews-table";
import { GenerateModal } from "./components/generate-modal";

export default function PreviewsPage() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  return (
    <div className="flex-1 space-y-8 p-8 bg-[#f8fafc]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">Ambientes Preview</h2>
          <p className="text-gray-500 font-medium mt-1">Laboratórios temporários instanciados para prospecção.</p>
        </div>
        
        {/* O BOTÃO VOLTOU: Fixo, vísivel e com estilo premium */}
        <Button 
          onClick={() => setIsGenerateModalOpen(true)}
          className="bg-[#0f172a] hover:bg-black text-white px-8 py-6 rounded-full font-bold shadow-xl gap-3 transition-all hover:scale-105"
        >
          <Plus size={20} />
          Gerar Novo Preview
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
          <Box className="text-gray-400" size={20} />
          <h3 className="font-bold text-gray-700">Cluster de Instâncias Ativas</h3>
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