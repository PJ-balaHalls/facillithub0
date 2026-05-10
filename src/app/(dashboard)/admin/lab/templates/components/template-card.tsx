"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TemplateBase } from "./template-grid";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface TemplateCardProps {
  template: TemplateBase;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-muted capitalize">
            {template.niche.replace('_', ' ')}
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
            {template.description || "Sem descrição."}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md font-mono">
          <GithubIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{template.github_template_repo}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {template.is_active ? (
            <span className="flex items-center text-emerald-500 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Ativo
            </span>
          ) : (
            <span className="flex items-center text-muted-foreground font-medium">
              <XCircle className="w-4 h-4 mr-1" />
              Inativo
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(template.updated_at).toLocaleDateString('pt-BR')}
        </div>
      </CardFooter>
    </Card>
  );
}