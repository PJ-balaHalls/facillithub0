"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Cloud, CheckCircle2, AlertCircle } from "lucide-react";

export function EnvStatusPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Integrações</CardTitle>
        <CardDescription>Status dos serviços de deploy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm font-medium">GitHub API</p>
              <p className="text-xs text-muted-foreground">Conectado</p>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm font-medium">Motor de Deploy</p>
              <p className="text-xs text-amber-500">Aviso: Cota alta</p>
            </div>
          </div>
          <AlertCircle className="w-4 h-4 text-amber-500" />
        </div>
      </CardContent>
    </Card>
  );
}