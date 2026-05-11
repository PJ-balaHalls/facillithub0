"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Loader2, Info } from "lucide-react";
import { ConfirmActivationModal } from "./confirm-activation-modal";
import { getPendingActivations } from "../../actions/activation";

export function ActivationTable() {
  const [activations, setActivations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPendingActivations();
        setActivations(data || []);
      } catch (error) {
        console.error("Erro ao buscar ativações", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedPreview]); 

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-48 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs uppercase tracking-wide">Carregando Fila...</p>
      </div>
    );
  }

  if (activations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-48 border-t border-border/60 bg-muted/20">
        <Info className="w-8 h-8 mb-4 opacity-50" />
        <h3 className="text-base font-medium text-foreground">Fila Limpa</h3>
        <p className="text-sm mt-1 text-muted-foreground">Nenhum cliente está a aguardar ativação de produção no momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Cliente / Negócio</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Template Base</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
            <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Data de Criação</TableHead>
            <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activations.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/40 transition-all duration-200 ease-in-out cursor-default">
              <TableCell className="font-medium text-foreground">
                {item.company_name}
                <div className="text-sm text-muted-foreground mt-1">
                  {item.slug}.preview.facillithub.com
                </div>
              </TableCell>
              <TableCell className="text-sm text-foreground font-medium">
                {item.lab_templates?.name || "Template Desconhecido"}
              </TableCell>
              <TableCell>
                <Badge className={`rounded-full ${
                  item.status === 'completed' 
                    ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" 
                    : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"
                }`}>
                  {item.status === 'completed' ? 'Aprovado / Online' : item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground font-medium">
                {new Date(item.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  onClick={() => setSelectedPreview({ id: item.id, name: item.company_name })}
                  disabled={item.status !== 'completed'}
                  className="h-11 rounded-xl px-4 gap-2 transition-all duration-200 ease-in-out"
                >
                  <Rocket className="w-4 h-4" />
                  Ativar Produção
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPreview && (
        <ConfirmActivationModal
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
          previewId={selectedPreview.id}
          previewName={selectedPreview.name}
        />
      )}
    </div>
  );
}