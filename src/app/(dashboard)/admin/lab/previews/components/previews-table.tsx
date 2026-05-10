"use client";

import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PreviewRow } from "./preview-row";

// Mock temporário para tipagem e visualização
export type PreviewInstance = {
  id: string;
  name: string;
  templateId: string;
  url: string;
  status: "active" | "building" | "error";
  createdAt: string;
};

const mockPreviews: PreviewInstance[] = [
  {
    id: "prev_123",
    name: "Burger King - Filial Sul",
    templateId: "delivery-v1",
    url: "https://burger-king-sul.preview.facillithub.com",
    status: "active",
    createdAt: "Há 2 horas",
  },
  {
    id: "prev_456",
    name: "Clínica Odonto Vida",
    templateId: "health-clinic",
    url: "https://odonto-vida.preview.facillithub.com",
    status: "building",
    createdAt: "Há 5 minutos",
  }
];

export function PreviewsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Identificação</TableHead>
          <TableHead>Template Base</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockPreviews.map((preview) => (
          <PreviewRow key={preview.id} preview={preview} />
        ))}
      </TableBody>
    </Table>
  );
}