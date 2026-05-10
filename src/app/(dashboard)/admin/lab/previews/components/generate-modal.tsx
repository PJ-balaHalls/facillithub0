// src/app/(dashboard)/admin/lab/previews/components/generate-modal.tsx
"use client"

import { useState, useTransition } from "react"
import { generatePreview } from "../../../lab/actions"
import type { LabTemplate, LabNiche, ConfigJson } from "@/types/lab"
import { NICHE_LABELS } from "@/types/lab"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Rocket, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { toast } from "sonner"

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

  // Form state
  const [form, setForm] = useState({
    company_name:   '',
    niche:          '' as LabNiche | '',
    slogan:         '',
    descricao:      '',
    corPrimaria:    '#5CA3FF',
    corSecundaria:  '#1A1A2E',
    telefone:       '',
    numeroWhatsApp: '',
    email:          '',
    endereco:       '',
    urlMaps:        '',
    instagram:      '',
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
      descricao:      form.descricao || undefined,
      corPrimaria:    form.corPrimaria,
      corSecundaria:  form.corSecundaria,
      fonteTitulo:    selectedTemplate.default_tokens?.fonteTitulo ?? 'Inter',
      fonteCopo:      selectedTemplate.default_tokens?.fonteCopo ?? 'Inter',
      telefone:       form.telefone || undefined,
      numeroWhatsApp: form.numeroWhatsApp || undefined,
      email:          form.email || undefined,
      endereco:       form.endereco || undefined,
      urlMaps:        form.urlMaps || undefined,
      instagram:      form.instagram || undefined,
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
        toast.success('Prévia em geração! Aguarde alguns segundos.', {
          description: 'O status será atualizado automaticamente.'
        })
        setOpen(false)
        setStep('template')
        setTpl(null)
        setForm({ company_name: '', niche: '', slogan: '', descricao: '', corPrimaria: '#5CA3FF', corSecundaria: '#1A1A2E', telefone: '', numeroWhatsApp: '', email: '', endereco: '', urlMaps: '', instagram: '' })
      } catch (err: any) {
        toast.error('Erro na geração: ' + err.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStep('template') }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white rounded-[2rem] border-none shadow-[0_20px_60px_rgb(0,0,0,0.1)] sm:max-w-xl p-0 overflow-hidden">
        
        {/* Progress header */}
        <div className="p-8 pb-0">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-100">
                <Rocket strokeWidth={1.5} className="size-5 text-[#5CA3FF]" />
              </div>
              <DialogTitle className="text-lg font-semibold tracking-tight">Gerar Prévia</DialogTitle>
            </div>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`flex items-center justify-center size-6 rounded-full text-[11px] font-bold transition-colors ${
                  i < stepIndex ? 'bg-emerald-500 text-white' :
                  i === stepIndex ? 'bg-[#5CA3FF] text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < stepIndex ? <Check className="size-3" /> : i + 1}
                </div>
                <span className={`text-[12px] font-medium ${i === stepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <ChevronRight className="size-3 text-gray-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-8 pb-4 min-h-[280px]">

          {/* STEP 1: Template */}
          {step === 'template' && (
            <div className="space-y-3">
              <p className="text-[13px] font-medium text-gray-700 mb-4">Selecione o template base para este nicho:</p>
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTpl(t); update('niche', t.niche) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedTemplate?.id === t.id
                      ? 'border-[#5CA3FF] bg-blue-50/30'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className={`size-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    selectedTemplate?.id === t.id ? 'bg-[#5CA3FF] text-white' : 'bg-gray-100'
                  }`}>
                    🏗
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{NICHE_LABELS[t.niche]} — {t.description}</p>
                  </div>
                  {selectedTemplate?.id === t.id && (
                    <Check className="size-4 text-[#5CA3FF] ml-auto shrink-0" />
                  )}
                </button>
              ))}
              {!templates.length && (
                <p className="text-gray-400 text-center py-10 text-sm">Nenhum template ativo. Crie um na aba Templates.</p>
              )}
            </div>
          )}

          {/* STEP 2: Identidade */}
          {step === 'identity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Nome da Empresa *</Label>
                  <Input value={form.company_name} onChange={e => update('company_name', e.target.value)}
                    placeholder="Pizzaria Bela Napoli" required
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Slogan</Label>
                  <Input value={form.slogan} onChange={e => update('slogan', e.target.value)}
                    placeholder="A melhor pizza da cidade"
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Nicho *</Label>
                  <Select value={form.niche} onValueChange={v => update('niche', v)}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-100 rounded-xl w-full">
                      <SelectValue placeholder="Nicho..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {(Object.entries(NICHE_LABELS) as [LabNiche, string][]).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Cor Primária</Label>
                  <div className="flex gap-2">
                    <input type="color" value={form.corPrimaria}
                      onChange={e => update('corPrimaria', e.target.value)}
                      className="h-11 w-14 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer p-1" />
                    <Input value={form.corPrimaria} onChange={e => update('corPrimaria', e.target.value)}
                      className="h-11 bg-gray-50 border-gray-100 rounded-xl font-mono text-[13px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <input type="color" value={form.corSecundaria}
                      onChange={e => update('corSecundaria', e.target.value)}
                      className="h-11 w-14 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer p-1" />
                    <Input value={form.corSecundaria} onChange={e => update('corSecundaria', e.target.value)}
                      className="h-11 bg-gray-50 border-gray-100 rounded-xl font-mono text-[13px]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contato */}
          {step === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Telefone</Label>
                  <Input value={form.telefone} onChange={e => update('telefone', e.target.value)}
                    placeholder="(11) 9 9999-9999"
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">WhatsApp</Label>
                  <Input value={form.numeroWhatsApp} onChange={e => update('numeroWhatsApp', e.target.value)}
                    placeholder="5511999999999"
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Endereço</Label>
                  <Input value={form.endereco} onChange={e => update('endereco', e.target.value)}
                    placeholder="Rua das Flores, 123 - São Paulo, SP"
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Link Google Maps</Label>
                  <Input value={form.urlMaps} onChange={e => update('urlMaps', e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Instagram</Label>
                  <Input value={form.instagram} onChange={e => update('instagram', e.target.value)}
                    placeholder="@pizzariabelanapoli"
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">E-mail</Label>
                  <Input value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="contato@..."
                    className="h-11 bg-gray-50 border-gray-100 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50/60 rounded-2xl space-y-3 text-[13px]">
                <div className="flex justify-between"><span className="text-gray-500">Template</span><span className="font-medium">{selectedTemplate?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Empresa</span><span className="font-medium">{form.company_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Nicho</span><span className="font-medium">{NICHE_LABELS[form.niche as LabNiche] ?? form.niche}</span></div>
                {form.telefone && <div className="flex justify-between"><span className="text-gray-500">Telefone</span><span className="font-medium">{form.telefone}</span></div>}
                {form.endereco && <div className="flex justify-between"><span className="text-gray-500">Endereço</span><span className="font-medium text-right text-xs">{form.endereco}</span></div>}
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[12px] font-medium text-amber-800">
                  🔒 O site será gerado em <strong>modo prévia</strong>. Preços embaçados, CTAs bloqueados e banner de demonstração ativo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex gap-3 p-8 pt-4 border-t border-gray-50">
          {stepIndex > 0 ? (
            <Button variant="ghost" onClick={() => setStep(STEPS[stepIndex - 1].key)}
              className="flex-1 rounded-full h-11 border border-gray-100 gap-2">
              <ChevronLeft className="size-4" /> Voltar
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setOpen(false)}
              className="flex-1 rounded-full h-11 border border-gray-100">
              Cancelar
            </Button>
          )}

          {step !== 'review' ? (
            <Button
              disabled={!canNext}
              onClick={() => setStep(STEPS[stepIndex + 1].key)}
              className="flex-1 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full h-11 gap-2"
            >
              Próximo <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              disabled={isPending}
              onClick={handleSubmit}
              className="flex-1 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full h-11 gap-2"
            >
              {isPending ? <Loader2 className="animate-spin size-4" /> : <><Rocket className="size-4" /> Gerar Agora</>}
            </Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}