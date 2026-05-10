"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// Importando o visualizador criado na etapa anterior
import { ConfigJsonViewer } from "../../_components/config-json-viewer";

interface ConfigInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  previewId: string;
}

export function ConfigInspector({ isOpen, onClose, previewId }: ConfigInspectorProps) {
  // Mock da configuração que estaria atrelada a este preview
  const mockConfig = {
    appId: previewId,
    theme: {
      primary: "#FF5733",
      mode: "light",
      font: "Inter"
    },
    flags: {
      hasDelivery: true,
      hasPix: false
    },
    version: "1.0.4-rc"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Inspetor de Configuração</DialogTitle>
          <DialogDescription>
            Visualize o JSON bruto que está gerando o ambiente <code className="bg-muted px-1 rounded">{previewId}</code>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          {/* Componente compartilhado injetado aqui */}
          <ConfigJsonViewer config={mockConfig} />
        </div>
      </DialogContent>
    </Dialog>
  );
}