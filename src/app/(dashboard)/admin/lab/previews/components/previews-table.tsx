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
      <div className="flex items-center justify-center p-6 text-muted-foreground w-full h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (previews.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-center text-sm text-muted-foreground w-full h-40 border-t border-border/60 bg-muted/20">
        Nenhum preview ativo no momento. Clique em "Gerar Novo Preview" para criar um laboratório.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Identificação / Negócio</TableHead>
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Template Base</TableHead>
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Criado em</TableHead>
          <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">Ações</TableHead>
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