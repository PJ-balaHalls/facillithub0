// src/app/(dashboard)/admin/lab/previews/components/generate-modal/index.tsx
"use client"

import React, { useState, useTransition } from "react"
import { generatePreview } from "../../../actions/previews"
import type { LabTemplate, LabNiche, ConfigJson } from "@/types/lab"
import { NICHE_LABELS } from "@/types/lab"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ConfirmConfigModal } from "../../../_components/config-json-viewer"

// Steps
import { StepTemplate } from "./step-template"
import { StepIdentity }  from "./step-identity"
import { StepBranding }  from "./step-branding"
import { StepContact }   from "./step-contact"
import { StepContent }   from "./step-content"
import { StepReview }    from "./step-review"

// Icons inline para evitar problemas de build
const Rocket   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 22 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>
const CheckMini = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const NextIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
const BackIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
const Loader    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export type StepKey = 'template' | 'identity' | 'branding' | 'contact' | 'content' | 'review'

export interface FormState {
  // Template
  template_id:    string
  template?:      LabTemplate
  // Identity
  company_name:   string
  niche:          LabNiche | ''
  slogan:         string
  descricao:      string
  // Branding
  corPrimaria:    string
  corSecundaria:  string
  fonteTitulo:    string
  fonteCopo:      string
  // Contact
  numeroWhatsApp: string
  instagram:      string
  facebook:       string
  endereco:       string
  email:          string
  urlMaps:        string
  // Content
  cardapio:       any[]
  horarios:       Record<string, any>
}

const INITIAL_FORM: FormState = {
  template_id:    '',
  company_name:   '',
  niche:          '',
  slogan:         '',
  descricao:      '',
  corPrimaria:    '#5CA3FF',
  corSecundaria:  '#1A1A2E',
  fonteTitulo:    'Playfair Display',
  fonteCopo:      'Inter',
  numeroWhatsApp: '',
  instagram:      '',
  facebook:       '',
  endereco:       '',
  email:          '',
  urlMaps:        '',
  cardapio:       [],
  horarios:       {},
}

const STEPS: { key: StepKey; label: string; emoji: string }[] = [
  { key: 'template',  label: 'Template',    emoji: '🏗' },
  { key: 'identity',  label: 'Identidade',  emoji: '🏷' },
  { key: 'branding',  label: 'Visual',      emoji: '🎨' },
  { key: 'contact',   label: 'Contato',     emoji: '📞' },
  { key: 'content',   label: 'Conteúdo',    emoji: '📋' },
  { key: 'review',    label: 'Revisão',     emoji: '✅' },
]

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

interface GenerateModalProps {
  templates: LabTemplate[]
  children:  React.ReactNode
}

export function GenerateModal({ templates, children }: GenerateModalProps) {
  const [open,    setOpen]    = useState(false)
  const [step,    setStep]    = useState<StepKey>('template')
  const [form,    setForm]    = useState<FormState>(INITIAL_FORM)
  const [confirm, setConfirm] = useState(false)
  const [isPending, start]    = useTransition()

  const stepIndex = STEPS.findIndex(s => s.key === step)

  const update = (fields: Partial<FormState>) =>
    setForm(prev => ({ ...prev, ...fields }))

  const canNext = (() => {
    if (step === 'template')  return !!form.template_id
    if (step === 'identity')  return !!form.company_name && !!form.niche
    return true
  })()

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setStep('template')
      setForm(INITIAL_FORM)
      setConfirm(false)
    }, 300)
  }

  const buildConfig = (): ConfigJson => ({
    nomeEmpresa:    form.company_name,
    slogan:         form.slogan         || undefined,
    descricao:      form.descricao      || undefined,
    corPrimaria:    form.corPrimaria,
    corSecundaria:  form.corSecundaria,
    fonteTitulo:    form.fonteTitulo,
    fonteCopo:      form.fonteCopo,
    numeroWhatsApp: form.numeroWhatsApp || undefined,
    instagram:      form.instagram      || undefined,
    facebook:       form.facebook       || undefined,
    endereco:       form.endereco       || undefined,
    email:          form.email          || undefined,
    urlMaps:        form.urlMaps        || undefined,
    cardapio:       form.cardapio.length ? form.cardapio : undefined,
    horarios:       Object.keys(form.horarios).length ? form.horarios : undefined,
    modoPrevia:     true,
    features:       form.template?.default_features || {},
  } as any)

  const handleGenerate = () => {
    if (!form.template) return
    const config = buildConfig()

    start(async () => {
      try {
        await generatePreview({
          template_id:  form.template_id,
          company_name: form.company_name,
          niche:        form.niche as LabNiche,
          config,
        })
        toast.success('🚀 Site em geração! Motor disparado.', {
          description: 'O site estará disponível em alguns minutos no GitHub Pages.',
        })
        handleClose()
      } catch (err: any) {
        toast.error('Erro ao gerar: ' + err.message)
      }
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); else setOpen(true) }}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          className="!rounded-[2.5rem] border-none shadow-2xl sm:max-w-2xl p-0 overflow-hidden bg-white"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-8 pt-8 pb-0">
            <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-100">
              <Rocket />
            </div>
            <DialogHeader className="flex-1">
              <DialogTitle className="text-[17px] font-bold tracking-tight text-gray-900">
                Gerar Site de Luxo
              </DialogTitle>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {form.company_name
                  ? `Criando site para "${form.company_name}"`
                  : 'Configure e publique em segundos'
                }
              </p>
            </DialogHeader>
            <button
              onClick={handleClose}
              className="p-2 text-gray-300 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
            >
              ✕
            </button>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-1.5 px-8 pt-6 pb-2 overflow-x-auto scrollbar-hide">
            {STEPS.map((s, i) => {
              const past    = i < stepIndex
              const current = i === stepIndex
              return (
                <React.Fragment key={s.key}>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className={`
                      flex items-center justify-center size-6 rounded-full text-[11px] font-bold transition-all
                      ${past    ? 'bg-[#5CA3FF] text-white' : ''}
                      ${current ? 'bg-[#5CA3FF] text-white ring-4 ring-blue-100' : ''}
                      ${!past && !current ? 'bg-gray-100 text-gray-400' : ''}
                    `}>
                      {past ? <CheckMini /> : i + 1}
                    </div>
                    <span className={`text-[11px] font-semibold whitespace-nowrap ${
                      current ? 'text-gray-900' : past ? 'text-[#5CA3FF]' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px min-w-[12px] max-w-[20px] transition-colors ${
                      i < stepIndex ? 'bg-[#5CA3FF]' : 'bg-gray-100'
                    }`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Step Content */}
          <div className="px-8 pb-2 min-h-[380px] overflow-y-auto max-h-[55vh]">
            {step === 'template' && (
              <StepTemplate
                templates={templates}
                selected={form.template_id}
                onSelect={(id, tpl) => update({ template_id: id, template: tpl, niche: tpl.niche })}
              />
            )}
            {step === 'identity' && (
              <StepIdentity form={form} onChange={update} />
            )}
            {step === 'branding' && (
              <StepBranding form={form} onChange={update} />
            )}
            {step === 'contact' && (
              <StepContact form={form} onChange={update} />
            )}
            {step === 'content' && (
              <StepContent form={form} onChange={update} />
            )}
            {step === 'review' && (
              <StepReview form={form} config={buildConfig()} />
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 px-8 py-6 border-t border-gray-50">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => setStep(STEPS[stepIndex - 1].key)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-6 h-12 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full font-medium text-[13px] transition-all disabled:opacity-50"
              >
                <BackIcon /> Voltar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-6 h-12 border border-gray-100 text-gray-500 hover:bg-gray-50 rounded-full font-medium text-[13px] transition-all"
              >
                Cancelar
              </button>
            )}

            {step !== 'review' ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep(STEPS[stepIndex + 1].key)}
                className="flex-1 flex items-center justify-center gap-1.5 h-12 bg-[#5CA3FF] hover:bg-[#4b8ce0] disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-full font-bold text-[13px] shadow-lg shadow-blue-500/20 transition-all"
              >
                Próximo <NextIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirm(true)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-black hover:bg-gray-900 text-white rounded-full font-bold text-[13px] shadow-xl transition-all disabled:opacity-50"
              >
                {isPending ? <Loader /> : <Rocket />}
                {isPending ? 'Gerando...' : 'Confirmar e Gerar Site'}
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação do config.json */}
      {confirm && (
        <ConfirmConfigModal
          config={buildConfig()}
          companyName={form.company_name}
          onConfirm={() => { setConfirm(false); handleGenerate() }}
          onCancel={() => setConfirm(false)}
          isPending={isPending}
        />
      )}
    </>
  )
}