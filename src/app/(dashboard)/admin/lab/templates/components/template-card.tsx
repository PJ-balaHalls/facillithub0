"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, MoreVertical, RefreshCw, Edit2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TemplateBase } from "./template-grid";

interface TemplateCardProps {
  template: TemplateBase;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-muted">
            {template.category}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mt-2 -mr-2 h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Dados
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold text-lg line-clamp-1">{template.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[40px]">
            {template.description}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md font-mono">
          <Github className="w-4 h-4 shrink-0" />
          <span className="truncate">{template.repoUrl}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {template.status === "ready" ? (
            <span className="flex items-center text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              {template.lastUpdate}
            </span>
          ) : (
            <span className="flex items-center text-amber-500">
              <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
              {template.lastUpdate}
            </span>
          )}
        </div>
        <Button variant="secondary" size="sm" disabled={template.status !== "ready"}>
          Forçar Sync
        </Button>
      </CardFooter>
    </Card>
  );
}