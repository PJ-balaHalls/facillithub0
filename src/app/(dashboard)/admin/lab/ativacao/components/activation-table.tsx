"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket } from "lucide-react";
import { ConfirmActivationModal } from "./confirm-activation-modal";

// Mock para exemplo de renderização
const mockPendingActivations = [
  { id: "1", client: "Pizzaria Bella", template: "Food Delivery V1", status: "Aprovado pelo cliente", date: "10/05/2026" },
  { id: "2", client: "Consultório Dr. Silva", template: "Health Clinic", status: "Aguardando Domínio", date: "09/05/2026" },
];

export function ActivationTable() {
  const [selectedPreview, setSelectedPreview] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente / Negócio</TableHead>
            <TableHead>Template Base</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPendingActivations.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.client}</TableCell>
              <TableCell>{item.template}</TableCell>
              <TableCell>
                <Badge variant={item.status.includes("Aprovado") ? "default" : "secondary"}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{item.date}</TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setSelectedPreview({ id: item.id, name: item.client })}
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