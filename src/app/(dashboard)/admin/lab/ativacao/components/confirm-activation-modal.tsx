"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { confirmActivation } from "../../actions/activation";
import { toast } from "sonner";

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
      // Chama a Server Action real!
      const res = await confirmActivation(previewId);
      
      if (res.success) {
        setIsSuccess(true);
        toast.success(`O ambiente ${previewName} foi ativado!`);
        setTimeout(() => {
          setIsSuccess(false);
          onClose(); // Ao fechar, a tabela principal fará re-fetch automático
        }, 2000);
      } else {
        toast.error(res.error || "Erro ao ativar o ambiente.");
      }
    } catch (error) {
      toast.error("Erro crítico de rede.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
        {!isSuccess ? (
          <>
            <div className="bg-[#0f172a] p-6 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Confirmar Ativação</DialogTitle>
                <DialogDescription className="text-gray-400 mt-1">
                  Você está prestes a converter o ambiente <strong>{previewName}</strong> para produção.
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="flex flex-col gap-4 p-6 bg-white">
              <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-800">
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <p className="font-medium">
                  Esta ação irá desvincular o projeto do ambiente temporário, aplicar as chaves de produção e converter a conta em um cliente faturável ativo.
                </p>
              </div>
            </div>

            <DialogFooter className="p-6 pt-0 bg-white sm:justify-between items-center border-t border-gray-50 mt-2">
              <Button variant="ghost" onClick={onClose} disabled={isLoading} className="font-bold text-gray-400 hover:text-gray-600">
                Cancelar
              </Button>
              <Button 
                onClick={handleActivation} 
                disabled={isLoading}
                className="bg-[#5CA3FF] hover:bg-blue-600 text-white rounded-full font-bold px-8 shadow-md"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isLoading ? "Processando..." : "Confirmar e Ativar"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white">
            <div className="p-4 bg-emerald-50 rounded-full mb-2">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-in zoom-in duration-300" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f172a]">Ativado com Sucesso!</h2>
            <p className="text-sm font-medium text-gray-500">O ambiente foi migrado para produção.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}