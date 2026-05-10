"use client";

import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings2, Code, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FeaturesPopover } from "./features-popover";
import { ConfigInspector } from "./config-inspector";

interface PreviewRowProps {
  preview: any;
}

export function PreviewRow({ preview }: PreviewRowProps) {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "completed": 
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Online</Badge>;
      case "pending":
      case "building": 
        return <Badge variant="secondary" className="animate-pulse">Construindo...</Badge>;
      case "error":
      case "failed": 
        return <Badge variant="destructive">Falha</Badge>;
      default: 
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="font-medium">{preview.company_name}</div>
          <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
            {preview.slug}.preview...
          </div>
        </TableCell>
        <TableCell>
          {preview.lab_templates?.name ? preview.lab_templates.name : (
             <span className="text-xs font-mono" title={preview.template_id}>{preview.template_id.split('-')[0]}...</span>
          )}
        </TableCell>
        <TableCell>{getStatusBadge(preview.status)}</TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {new Date(preview.created_at).toLocaleDateString('pt-BR')}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" title="Abrir Preview" disabled={!preview.preview_url} asChild>
              {preview.preview_url ? (
                <a href={preview.preview_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span><ExternalLink className="w-4 h-4 text-muted" /></span>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Ações do Ambiente</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsFeaturesOpen(true)}>
                  <Settings2 className="w-4 h-4 mr-2" />
                  Gerenciar Features
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsInspectorOpen(true)}>
                  <Code className="w-4 h-4 mr-2" />
                  Inspecionar Config
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Deletar Preview
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {isFeaturesOpen && (
        <FeaturesPopover 
          isOpen={isFeaturesOpen} 
          onClose={() => setIsFeaturesOpen(false)} 
          previewId={preview.id} 
        />
      )}
      
      {isInspectorOpen && (
        <ConfigInspector 
          isOpen={isInspectorOpen} 
          onClose={() => setIsInspectorOpen(false)} 
          previewId={preview.id} 
        />
      )}
    </>
  );
}