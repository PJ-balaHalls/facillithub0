"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
// import { activateClient } from "../../actions"; // Exemplo de uso de action real

interface ConfirmActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewName: string;
  previewId: string;
}

export function ConfirmActivationModal({ isOpen, onClose, previewName, previewId }: ConfirmActivationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleActivation = async () => {
    setIsLoading(true);
    try {
      // Simulação da chamada da action de ativação
      // await activateClient(previewId);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Confirmar Ativação</DialogTitle>
              <DialogDescription>
                Você está prestes a converter o preview <strong>{previewName}</strong> em um ambiente de produção.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-start gap-3 p-4 bg-muted rounded-md text-sm">
                <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                <p>
                  Esta ação irá desvincular o projeto do ambiente temporário, aplicar as chaves de produção e registrar um novo cliente na base.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleActivation} disabled={isLoading}>
                {isLoading ? "Processando..." : "Confirmar e Ativar"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-in zoom-in" />
            <h2 className="text-xl font-semibold">Ativado com Sucesso!</h2>
            <p className="text-sm text-muted-foreground">O ambiente foi migrado para produção.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}