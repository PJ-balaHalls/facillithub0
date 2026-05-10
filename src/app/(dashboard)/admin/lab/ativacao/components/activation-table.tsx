"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Loader2 } from "lucide-react";
import { ConfirmActivationModal } from "./confirm-activation-modal";
import { getPendingActivations } from "../../actions/activation";

export function ActivationTable() {
  const [activations, setActivations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState<{ id: string; name: string } | null>(null);

  // Busca as ativações reais da base de dados
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
  }, [selectedPreview]); // Recarrega se o modal fechar (caso tenha ativado um)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#5CA3FF] mb-4" />
        <p className="text-sm font-bold tracking-widest uppercase">Carregando Fila...</p>
      </div>
    );
  }

  if (activations.length === 0) {
    return (
      <div className="p-16 text-center text-gray-500">
        <CheckCircle2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-700">Fila Limpa</h3>
        <p className="text-sm mt-1">Nenhum cliente está a aguardar ativação de produção no momento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold text-gray-700 uppercase tracking-wider text-xs">Cliente / Negócio</TableHead>
            <TableHead className="font-bold text-gray-700 uppercase tracking-wider text-xs">Template Base</TableHead>
            <TableHead className="font-bold text-gray-700 uppercase tracking-wider text-xs">Status</TableHead>
            <TableHead className="font-bold text-gray-700 uppercase tracking-wider text-xs">Data de Criação</TableHead>
            <TableHead className="text-right font-bold text-gray-700 uppercase tracking-wider text-xs">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activations.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium text-gray-900">
                {item.company_name}
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  {item.slug}.preview.facillithub.com
                </div>
              </TableCell>
              <TableCell className="text-gray-600 font-medium">
                {item.lab_templates?.name || "Template Desconhecido"}
              </TableCell>
              <TableCell>
                <Badge className={
                  item.status === 'completed' 
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" 
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
                }>
                  {item.status === 'completed' ? 'Aprovado / Online' : item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-500 text-sm font-medium">
                {new Date(item.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  className="bg-[#0f172a] hover:bg-black text-white rounded-full font-bold shadow-md gap-2 transition-all px-6"
                  onClick={() => setSelectedPreview({ id: item.id, name: item.company_name })}
                  disabled={item.status !== 'completed'}
                >
                  <Rocket className="w-4 h-4" />
                  Ativar Produção
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Confirmação */}
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