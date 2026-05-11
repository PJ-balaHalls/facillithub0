"use client";

import React, { useState } from "react";
import { Terminal, Server, Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { checkServerEnvs } from "../actions";

export default function InfraStatusPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Mapeamento explícito para o Next.js conseguir injetar as variáveis de build-time
  const clientEnvsToCheck = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { name: "NEXT_PUBLIC_SITE_URL", value: process.env.NEXT_PUBLIC_SITE_URL },
    { name: "NEXT_PUBLIC_GA_ID", value: process.env.NEXT_PUBLIC_GA_ID },
    { name: "NEXT_PUBLIC_GTM_ID", value: process.env.NEXT_PUBLIC_GTM_ID },
    { name: "NEXT_PUBLIC_LAB_BASE_URL", value: process.env.NEXT_PUBLIC_LAB_BASE_URL },
  ];

  const runTests = async () => {
    setIsRunning(true);
    setLogs([]);
    
    const addLog = (message: string) => {
      setLogs((prev) => [...prev, message]);
    };

    addLog("> Iniciando auditoria de sistema e conectores...");
    await new Promise((r) => setTimeout(r, 600));

    addLog(" ");
    addLog("> [ETAPA 1] Verificando variáveis públicas (Client-side)...");
    
    let hasClientErrors = false;
    for (const env of clientEnvsToCheck) {
      await new Promise((r) => setTimeout(r, 150));
      if (env.value) {
        addLog(`[OK] ${env.name} carregada.`);
      } else {
        addLog(`[FALHA] ${env.name} não encontrada.`);
        hasClientErrors = true;
      }
    }

    addLog(" ");
    addLog("> [ETAPA 2] Solicitando auditoria de cofre ao servidor (Server-side)...");
    
    let hasServerErrors = false;
    try {
      const serverResults = await checkServerEnvs();
      for (const res of serverResults) {
        await new Promise((r) => setTimeout(r, 150));
        if (res.status === "OK") {
          addLog(`[OK] ${res.name} validada com segurança.`);
        } else {
          addLog(`[FALHA] ${res.name} ausente no servidor.`);
          hasServerErrors = true;
        }
      }
    } catch (error: any) {
      addLog(`[ERRO CRÍTICO] Falha ao comunicar com o servidor: ${error.message}`);
      hasServerErrors = true;
    }

    addLog(" ");
    if (hasClientErrors || hasServerErrors) {
      addLog("> Auditoria concluída com AVISOS. Verifique as falhas acima.");
    } else {
      addLog("> Auditoria concluída. Todos os sistemas estão operacionais.");
    }
    
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">Infraestrutura & Status</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Terminal de diagnóstico para verificação de chaves e instâncias de serviço.
          </p>
        </div>
        <button 
          onClick={runTests}
          disabled={isRunning}
          className="h-11 rounded-xl px-6 bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 ease-in-out disabled:opacity-50 shadow-sm"
        >
          {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          {isRunning ? "A Executar..." : "Correr Diagnóstico"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Informativo Client */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-muted/40 text-primary">
              <Terminal size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">Ambiente Web</p>
              <p className="text-xs text-muted-foreground mt-0.5">7 Variáveis Públicas (NEXT_PUBLIC_)</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Responsáveis pela conexão do navegador com o Supabase e chaves de Analytics.
          </p>
        </div>

        {/* Card Informativo Server */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-muted/40 text-primary">
              <Server size={20} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">Cofre do Servidor</p>
              <p className="text-xs text-muted-foreground mt-0.5">6 Chaves Privadas (Tokens/APIs)</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Acesso root ao Supabase, Apify, Gemini e conectores do GitHub. Totalmente isoladas.
          </p>
        </div>
      </div>

      {/* Janela de Terminal Fiel ao Design System */}
      <div className="rounded-2xl border border-border/60 bg-[#0a0a0a] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {/* Header do Terminal (Estilo Mac/Gnome) */}
        <div className="p-4 bg-[#111111] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <p className="text-xs font-mono text-gray-500">admin@facillithub: ~/infra/status</p>
          <div className="w-12"></div> {/* Spacer para centralizar o texto */}
        </div>

        {/* Console de Logs */}
        <div className="p-6 font-mono text-sm flex flex-col gap-1.5 h-full overflow-y-auto max-h-[500px]">
          {logs.length === 0 && !isRunning && (
            <div className="text-gray-500 flex flex-col items-center justify-center h-48 gap-4">
              <Terminal size={32} className="opacity-50" />
              <p>Aguardando comando de execução...</p>
            </div>
          )}
          
          {logs.map((log, index) => (
            <span 
              key={index} 
              className={
                log.includes("[FALHA]") || log.includes("[ERRO") ? "text-red-400" :
                log.includes("[OK]") ? "text-green-400" : 
                "text-gray-300"
              }
            >
              {log}
            </span>
          ))}
          
          {/* Cursor piscante enquanto roda */}
          {isRunning && (
            <span className="w-2 h-4 bg-gray-400 animate-pulse mt-1 inline-block"></span>
          )}
        </div>
      </div>
    </div>
  );
}