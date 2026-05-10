"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PreviewRow } from "./preview-row";
import { getPreviews } from "../../actions/previews";
import { Loader2 } from "lucide-react";

export function PreviewsTable() {
  const [previews, setPreviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPreviews() {
      const res = await getPreviews();
      if (res.success) {
        setPreviews(res.data);
      }
      setIsLoading(false);
    }
    
    fetchPreviews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground w-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (previews.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground w-full">
        Nenhum preview ativo no momento. Clique em "Gerar Novo Preview" para criar um laboratório.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Identificação / Negócio</TableHead>
          <TableHead>Template Base</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {previews.map((preview) => (
          <PreviewRow key={preview.id} preview={preview} />
        ))}
      </TableBody>
    </Table>
  );
}