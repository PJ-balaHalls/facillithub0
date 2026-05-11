// src/app/(dashboard)/admin/lab/ativacao/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getActivationStats, getPendingActivations } from "../actions/activation";
import { ActivationTable } from "./components/activation-table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ActivationsPage() {
  const [stats, setActivationStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getActivationStats();
      setActivationStats(res);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ativação de Contas</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Converta laboratórios de teste em ambientes de produção cliente.
          </p>
        </div>
        <Link 
          href="/admin/lab/previews" 
          className="inline-flex items-center justify-center gap-2 h-11 rounded-xl px-4 border border-border/60 bg-card hover:bg-muted/40 transition-all duration-200 ease-in-out text-sm font-medium shadow-sm"
        >
          Ver Instâncias <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Aguardando" value={stats.pending} icon={Clock} />
        <StatCard label="Clientes Ativos" value={stats.active} icon={CheckCircle2} />
        <StatCard label="Conversão" value={`${stats.conversion}%`} icon={Zap} />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border/60">
          <h3 className="text-lg font-medium">Fila de Ativação</h3>
        </div>
        <ActivationTable />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <Card className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-0 flex items-center gap-4">
        <div className="p-4 rounded-xl bg-muted/40 text-primary">
          <Icon size={24} />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}