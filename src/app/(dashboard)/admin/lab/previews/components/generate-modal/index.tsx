"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Rocket, Layout, Loader2, CheckCircle2, XCircle, Terminal, ExternalLink } from "lucide-react";

import { getTemplates } from "../../../actions/templates";
import { step1_createPreviewRecord, step4_finalizeDeploy } from "../../../actions/previews";
import { gh_provisionRepo, gh_injectIdentity, gh_activatePages } from "../../../actions/github";

import { StepTemplate } from "./step-template";
import { StepIdentity } from "./step-identity";
import { StepBranding } from "./step-branding";
import { StepContact } from "./step-contact";
import { StepContent } from "./step-content";
import { StepReview } from "./step-review";

export interface GenerateFormData {
  templateId: string;
  businessName: string;
  slug: string;
  primaryColor: string;
  logoUrl: string;
  socialLinks: Array<{ platform: string; url: string }>;
  services: Array<{ id: string; name: string; price: string }>;
  niche: string;
}

const initialData: GenerateFormData = {
  templateId: "", businessName: "", slug: "", primaryColor: "#000000", logoUrl: "", socialLinks: [], services: [], niche: "outro"
};

type LogStep = { id: string; label: string; status: 'idle' | 'loading' | 'success' | 'error'; detail?: string; };

export function GenerateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GenerateFormData>(initialData);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  
  // Estados do Deploy em Tempo Real
  const [isDeploying, setIsDeploying] = useState(false);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogStep[]>([
    { id: 'db', label: 'Registrar ambiente no banco de dados', status: 'idle' },
    { id: 'repo', label: 'Provisionar infraestrutura (Aguardando GitHub)', status: 'idle' },
    { id: 'code', label: 'Compilar e injetar identidade visual', status: 'idle' },
    { id: 'dns', label: 'Propagar DNS e ativar ambiente live', status: 'idle' },
  ]);

  const totalSteps = 6;

  useEffect(() => {
    async function fetchTemplates() {
      if (!isOpen) return;
      const res = await getTemplates();
      if (res.success) setTemplates(res.data.filter((t: any) => t.is_active));
      setIsLoadingTemplates(false);
    }
    fetchTemplates();
  }, [isOpen]);

  const updateData = (fields: Partial<GenerateFormData>) => setFormData((prev) => ({ ...prev, ...fields }));
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateLog = (id: string, status: LogStep['status'], detail?: string) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, status, detail } : log));
  };

  const handleOrchestrateDeploy = async () => {
    setIsDeploying(true);
    let generatedPreviewId = "";

    try {
      // Passo 1: Banco de Dados
      updateLog('db', 'loading', 'Criando registo inicial...');
      const dbRes = await step1_createPreviewRecord(formData);
      generatedPreviewId = dbRes.previewId;
      updateLog('db', 'success', 'Sincronizado com Supabase.');

      // Passo 2: Github Fork (Demorado)
      updateLog('repo', 'loading', 'Clonando repositório matriz... Pode levar até 30s.');
      const repoName = await gh_provisionRepo(dbRes.templateRepo, formData.slug);
      updateLog('repo', 'success', `Repositório criado: ${repoName}`);

      // Passo 3: Injetar Variáveis
      updateLog('code', 'loading', 'Reescrevendo source code com dados do cliente...');
      await gh_injectIdentity(repoName, dbRes.configToInject, dbRes.features);
      updateLog('code', 'success', 'Variáveis injetadas no HTML e Config.json.');

      // Passo 4: Ativar Domínio
      updateLog('dns', 'loading', 'Aguardando propagação do GitHub Pages...');
      const pagesRes = await gh_activatePages(repoName);
      
      // Finalização
      await step4_finalizeDeploy(dbRes.previewId, 'completed', pagesRes.htmlUrl, pagesRes.pagesUrl);
      updateLog('dns', 'success', 'Servidor de borda ativado.');
      setFinalUrl(pagesRes.pagesUrl);

    } catch (err: any) {
      const failedStep = logs.find(l => l.status === 'loading') || logs[0];
      updateLog(failedStep.id, 'error', err.message);
      if (generatedPreviewId) {
        await step4_finalizeDeploy(generatedPreviewId, 'error', undefined, undefined, err.message);
      }
    }
  };

  // UI do Terminal de Deploy
  if (isDeploying) {
    const isFinished = logs.every(l => l.status === 'success' || l.status === 'error');
    const hasError = logs.some(l => l.status === 'error');

    return (
      <Dialog open={isOpen} onOpenChange={() => !isFinished ? null : onClose()}>
        <DialogContent className="sm:max-w-[750px] border-none bg-white shadow-2xl rounded-[2rem] overflow-hidden p-0">
          <div className="bg-[#0f172a] p-8 pb-8 text-white relative">
            <Terminal size={100} className="absolute top-0 right-0 opacity-5 p-4" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">Instanciando Laboratório</DialogTitle>
              <p className="text-gray-400 text-sm mt-2">Acompanhe o processo de deploy em tempo real.</p>
            </DialogHeader>
          </div>
          
          <div className="p-8 space-y-6 bg-gray-50 min-h-[350px]">
            {logs.map((log) => (
              <div key={log.id} className={`flex gap-4 p-4 rounded-xl border transition-all ${log.status === 'active' ? 'bg-white shadow-sm border-[#5CA3FF]/20' : 'border-transparent'}`}>
                <div className="mt-1 shrink-0">
                  {log.status === 'idle' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                  {log.status === 'loading' && <Loader2 className="w-5 h-5 text-[#5CA3FF] animate-spin" />}
                  {log.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {log.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
                <div>
                  <p className={`font-bold ${log.status === 'idle' ? 'text-gray-400' : 'text-gray-900'}`}>{log.label}</p>
                  {log.detail && (
                    <p className={`text-xs mt-1 font-mono ${log.status === 'error' ? 'text-red-500' : 'text-gray-500'}`}>{log.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
            {isFinished ? (
              <>
                <Button variant="outline" onClick={onClose} className="rounded-full px-8 font-bold border-gray-200">Fechar</Button>
                {finalUrl && !hasError && (
                  <Button asChild className="bg-[#5CA3FF] hover:bg-blue-600 text-white rounded-full px-8 font-bold shadow-md">
                    <a href={finalUrl} target="_blank" rel="noreferrer">
                      Acessar Aplicação <ExternalLink size={16} className="ml-2" />
                    </a>
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm font-bold text-gray-400 animate-pulse flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Operação em andamento... não feche.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Renderização normal do Form
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] h-[85vh] flex flex-col p-0 gap-0 border-none bg-white shadow-2xl rounded-[2rem] overflow-hidden">
        <div className="bg-[#0f172a] p-8 pb-6 text-white relative shrink-0">
          <Layout size={100} className="absolute top-0 right-0 opacity-5 p-4" />
          <DialogHeader>
            <p className="text-[#5CA3FF] text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Passo {currentStep} de {totalSteps}</p>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">Gerador de Laboratório</DialogTitle>
          </DialogHeader>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-6 overflow-hidden">
            <div className="bg-[#5CA3FF] h-full transition-all duration-500 ease-in-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-white">
          {currentStep === 1 && <StepTemplate templates={templates} isLoading={isLoadingTemplates} data={formData} updateData={updateData} />}
          {currentStep === 2 && <StepIdentity data={formData} updateData={updateData} />}
          {currentStep === 3 && <StepBranding data={formData} updateData={updateData} />}
          {currentStep === 4 && <StepContact data={formData} updateData={updateData} />}
          {currentStep === 5 && <StepContent data={formData} updateData={updateData} />}
          {currentStep === 6 && <StepReview data={formData} />}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-full px-6 font-bold text-gray-500 border-gray-200 bg-white">
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} disabled={currentStep === 1 && !formData.templateId} className="bg-[#0f172a] hover:bg-black text-white rounded-full px-8 font-bold shadow-md">
              Próxima Etapa <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleOrchestrateDeploy} className="bg-[#5CA3FF] hover:bg-blue-600 text-white rounded-full px-8 font-bold shadow-md">
              <Rocket className="w-4 h-4 mr-2" />
              Realizar Deploy
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}