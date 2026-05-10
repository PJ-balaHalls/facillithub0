// src/app/(dashboard)/admin/lab/previews/components/generate-modal.tsx
"use client"

import React, { useState, useTransition } from "react"
import { generatePreview } from "../../../lab/actions"
import type { LabTemplate, LabNiche, ConfigJson } from "@/types/lab"
import { NICHE_LABELS } from "@/types/lab"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// ÍCONES MANUAIS PARA EVITAR ERRO DE BUILD DO LUCIDE
const IconRocket = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 22 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconNext = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
const IconBack = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
const IconLoader = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>

interface Props {
  templates: LabTemplate[]
  children: React.ReactNode
}

type Step = 'template' | 'identity' | 'contact' | 'review'

const STEPS: { key: Step; label: string }[] = [
  { key: 'template',  label: 'Template' },
  { key: 'identity',  label: 'Identidade' },
  { key: 'contact',   label: 'Contato' },
  { key: 'review',    label: 'Revisão' },
]

export function GenerateModal({ templates, children }: Props) {
  const [open, setOpen]               = useState(false)
  const [step, setStep]               = useState<Step>('template')
  const [selectedTemplate, setTpl]    = useState<LabTemplate | null>(null)
  const [isPending, startTransition]  = useTransition()

  const [form, setForm] = useState({
    company_name:   '',
    niche:          '' as LabNiche | '',
    slogan:         '',
    corPrimaria:    '#5CA3FF',
    corSecundaria:  '#1A1A2E',
    telefone:       '',
    numeroWhatsApp: '',
    instagram:      '',
    endereco:       '',
  })

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const stepIndex = STEPS.findIndex(s => s.key === step)
  const canNext   = step === 'template'  ? !!selectedTemplate :
                    step === 'identity'  ? !!form.company_name && !!form.niche :
                    step === 'contact'   ? true : false

  const handleSubmit = () => {
    if (!selectedTemplate) return

    const config: ConfigJson = {
      nomeEmpresa:    form.company_name,
      slogan:         form.slogan || undefined,
      corPrimaria:    form.corPrimaria,
      corSecundaria:  form.corSecundaria,
      fonteTitulo:    selectedTemplate.default_tokens?.fonteTitulo ?? 'Playfair Display',
      fonteCopo:      selectedTemplate.default_tokens?.fonteCopo ?? 'Inter',
      numeroWhatsApp: form.numeroWhatsApp || undefined,
      instagram:      form.instagram || undefined,
      endereco:       form.endereco || undefined,
      modoPrevia:     true,
      features:       selectedTemplate.default_features,
    }

    startTransition(async () => {
      try {
        await generatePreview({
          template_id:  selectedTemplate.id,
          company_name: form.company_name,
          niche:        form.niche as LabNiche,
          config,
        })
        toast.success('Prévia em geração! O motor do Lab foi disparado.')
        setOpen(false)
        setStep('template')
      } catch (err: any) {
        toast.error('Erro na geração: ' + err.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStep('template') }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white rounded-[2rem] border-none shadow-2xl sm:max-w-xl p-0 overflow-hidden">
        
        <div className="p-8 pb-0">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-100 text-[#5CA3FF]">
                <IconRocket />
              </div>
              <DialogTitle className="text-lg font-semibold tracking-tight">Gerar Site de Luxo</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`flex items-center justify-center size-6 rounded-full text-[11px] font-bold transition-colors ${
                  i <= stepIndex ? 'bg-[#5CA3FF] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < stepIndex ? <IconCheck /> : i + 1}
                </div>
                <span className={`text-[12px] font-medium ${i === stepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className="w-4 h-[1px] bg-gray-100 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-4 min-h-[350px]">
          {step === 'template' && (
            <div className="space-y-3">
              <p className="text-[13px] font-medium text-gray-700 mb-4">Selecione o motor base:</p>
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTpl(t); update('niche', t.niche) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedTemplate?.id === t.id ? 'border-[#5CA3FF] bg-blue-50/30' : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">🏗</div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{NICHE_LABELS[t.niche]} — {t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'identity' && (
            <div className="space-y-4 animate-in slide-in-from-right-2">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-gray-400 uppercase">Nome da Empresa</Label>
                <Input value={form.company_name} onChange={e => update('company_name', e.target.value)} placeholder="Ex: Pizzaria Napoli" className="h-11 rounded-xl bg-gray-50 border-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase">Nicho</Label>
                  <Select value={form.niche} onValueChange={v => update('niche', v as LabNiche)}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-100"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(NICHE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase">Cor Primária</Label>
                  <div className="flex gap-2">
                    <input type="color" value={form.corPrimaria} onChange={e => update('corPrimaria', e.target.value)} className="h-11 w-12 rounded-xl cursor-pointer p-1 bg-gray-50 border border-gray-100" />
                    <Input value={form.corPrimaria} onChange={e => update('corPrimaria', e.target.value)} className="h-11 font-mono text-xs rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'contact' && (
            <div className="space-y-4 animate-in slide-in-from-right-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-[11px] font-bold">WhatsApp</Label><Input value={form.numeroWhatsApp} onChange={e => update('numeroWhatsApp', e.target.value)} placeholder="55119..." className="h-11 rounded-xl" /></div>
                <div className="space-y-2"><Label className="text-[11px] font-bold">Instagram</Label><Input value={form.instagram} onChange={e => update('instagram', e.target.value)} placeholder="@perfil" className="h-11 rounded-xl" /></div>
              </div>
              <div className="space-y-2"><Label className="text-[11px] font-bold">Endereço Público</Label><Input value={form.endereco} onChange={e => update('endereco', e.target.value)} placeholder="Rua das Flores, 123" className="h-11 rounded-xl" /></div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6 animate-in zoom-in-95">
              <div className="p-6 bg-gray-50 rounded-[2rem] space-y-3 text-sm">
                <div className="flex justify-between"><span>Template Base</span><span className="font-bold text-[#5CA3FF]">{selectedTemplate?.name}</span></div>
                <div className="flex justify-between"><span>Nome do Site</span><span className="font-bold text-gray-900">{form.company_name}</span></div>
                <div className="flex justify-between"><span>Nicho</span><span className="font-bold">{NICHE_LABELS[form.niche as LabNiche]}</span></div>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800 text-[11px] leading-relaxed">
                <div className="shrink-0 text-amber-500">⚠️</div>
                <p>O site será gerado em <strong>MODO PRÉVIA</strong>. Preços embaçados e CTAs bloqueados para garantir o fechamento da venda pelo administrador.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-8 pt-4 border-t border-gray-50">
          {stepIndex > 0 ? (
            <Button variant="ghost" onClick={() => setStep(STEPS[stepIndex - 1].key)} className="flex-1 rounded-full h-12 border border-gray-100 gap-2">
              <IconBack /> Voltar
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1 rounded-full h-12 border border-gray-100">Cancelar</Button>
          )}

          {step !== 'review' ? (
            <Button disabled={!canNext} onClick={() => setStep(STEPS[stepIndex + 1].key)} className="flex-1 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full h-12 gap-2 shadow-lg shadow-blue-500/20">
              Próximo <IconNext />
            </Button>
          ) : (
            <Button disabled={isPending} onClick={handleSubmit} className="flex-1 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full h-12 gap-3 shadow-xl shadow-blue-500/30 font-bold">
              {isPending ? <IconLoader /> : <><IconRocket /> GERAR AGORA</>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}