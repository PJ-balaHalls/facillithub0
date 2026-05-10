// src/app/(dashboard)/admin/lab/templates/components/templates-list.tsx
"use client"

import { useState, useTransition } from "react"
import { toggleTemplateStatus } from "../../../lab/actions"
import type { LabTemplate } from "@/types/lab"
import { NICHE_LABELS } from "@/types/lab"
import { ALL_FEATURES } from "@/types/lab"
import { ExternalLink, Github, Power, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface Props {
  initialTemplates: LabTemplate[]
}

const NICHE_COLORS: Record<string, string> = {
  restaurante:  'bg-orange-50 text-orange-700 border-orange-100',
  clinica:      'bg-blue-50 text-blue-700 border-blue-100',
  salao_beleza: 'bg-pink-50 text-pink-700 border-pink-100',
  barbearia:    'bg-yellow-50 text-yellow-700 border-yellow-100',
  academia:     'bg-green-50 text-green-700 border-green-100',
  outro:        'bg-gray-50 text-gray-700 border-gray-100',
}

export function TemplatesList({ initialTemplates }: Props) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleTemplateStatus(id, !current)
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t))
        toast.success(!current ? 'Template ativado' : 'Template desativado')
      } catch {
        toast.error('Erro ao alterar status')
      }
    })
  }

  if (!templates.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400 text-sm">Nenhum template cadastrado ainda.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {templates.map((t) => {
        const nicheColor = NICHE_COLORS[t.niche] || NICHE_COLORS.outro
        const activeFeatures = Object.entries(t.default_features ?? {})
          .filter(([, v]) => v).map(([k]) => k)

        return (
          <div
            key={t.id}
            className={`group p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 ${!t.is_active ? 'opacity-60' : ''}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border w-fit ${nicheColor}`}>
                  {NICHE_LABELS[t.niche] ?? t.niche}
                </span>
                <h3 className="text-[15px] font-semibold text-gray-900">{t.name}</h3>
                {t.description && (
                  <p className="text-[12px] text-gray-500 font-light leading-relaxed">{t.description}</p>
                )}
              </div>

              {/* Status indicator */}
              <div className="shrink-0">
                {t.is_active
                  ? <CheckCircle2 strokeWidth={1.5} className="size-5 text-emerald-500" />
                  : <AlertCircle strokeWidth={1.5} className="size-5 text-gray-300" />
                }
              </div>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-1.5">
              {activeFeatures.slice(0, 5).map(fk => {
                const feat = ALL_FEATURES.find(f => f.key === fk)
                return (
                  <span key={fk} className="text-[10px] font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                    {feat?.label ?? fk}
                  </span>
                )
              })}
              {activeFeatures.length > 5 && (
                <span className="text-[10px] font-medium text-gray-400 px-2 py-0.5">
                  +{activeFeatures.length - 5}
                </span>
              )}
            </div>

            {/* GitHub repo */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono bg-gray-50 rounded-xl px-3 py-2">
              <Github className="size-3.5 shrink-0" />
              <span className="truncate">{t.github_template_repo}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
              {t.preview_demo_url && (
                <a
                  href={t.preview_demo_url}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#5CA3FF] hover:underline"
                >
                  <ExternalLink className="size-3.5" /> Ver demo
                </a>
              )}
              <button
                disabled={isPending}
                onClick={() => handleToggle(t.id, t.is_active)}
                className={`ml-auto flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors border ${
                  t.is_active
                    ? 'border-red-100 text-red-500 hover:bg-red-50'
                    : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <Power className="size-3" />
                {t.is_active ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}