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

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex-1 space-y-8 p-8 bg-[#f8fafc]">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-[#0f172a] tracking-tight">Ativação de Contas</h2>
          <p className="text-gray-500 font-medium mt-1">Converta laboratórios de teste em ambientes de produção cliente.</p>
        </div>
        <Link href="/admin/lab/previews" className="flex items-center gap-2 text-xs font-bold text-[#5CA3FF] hover:underline uppercase tracking-widest bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm transition-all">
          Ver Instâncias <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Aguardando" value={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-50" />
        <StatCard label="Clientes Ativos" value={stats.active} icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" />
        <StatCard label="Conversão" value={`${stats.conversion}%`} icon={Zap} color="text-blue-500" bg="bg-blue-50" />
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="text-lg font-bold text-[#0f172a]">Fila de Ativação</h3>
        </div>
        <ActivationTable />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
      <CardContent className="p-6 flex items-center gap-6">
        <div className={`p-4 rounded-2xl ${bg} ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-[#0f172a]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}