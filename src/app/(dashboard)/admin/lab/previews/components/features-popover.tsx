"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// Importando o componente compartilhado criado na etapa anterior
import { FeatureFlagsPanel } from "../../_components/feature-flags-panel";

interface FeaturesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  previewId: string;
}

export function FeaturesPopover({ isOpen, onClose, previewId }: FeaturesPopoverProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Features Ativas</DialogTitle>
          <DialogDescription>
            Ative ou desative módulos do sistema em tempo real para o preview <code className="bg-muted px-1 rounded">{previewId}</code>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Componente compartilhado injetado aqui */}
          <FeatureFlagsPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}