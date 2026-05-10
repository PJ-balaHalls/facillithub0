"use client";

import React from "react";
import { ActivationStats } from "./components/activation-stats";
import { ActivationTable } from "./components/activation-table";

export default function ActivationsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ativação de Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie a transição de ambientes Preview para Produção.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <ActivationStats />
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold tracking-tight mb-4">Aguardando Ativação</h3>
          <ActivationTable />
        </div>
      </div>
    </div>
  );
}