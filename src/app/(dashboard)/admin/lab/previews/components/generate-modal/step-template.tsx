// src/app/(dashboard)/admin/lab/previews/components/generate-modal/step-template.tsx
"use client"

import type { LabTemplate } from "@/types/lab"
import { NICHE_LABELS } from "@/types/lab"
import { ExternalLink } from "lucide-react"

interface StepTemplateProps {
  templates: LabTemplate[]
  selected:  string
  onSelect:  (id: string, tpl: LabTemplate) => void
}

export function StepTemplate({ templates, selected, onSelect }: StepTemplateProps) {
  if (!templates.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-[13px] text-gray-400">Nenhum template ativo. Cadastre um em Templates.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 pt-4">
      <p className="text-[12px] text-gray-500 font-medium mb-4">
        Selecione o motor base para este site. Cada template tem um design e nicho específico.
      </p>
      {templates.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.id, t)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
            selected === t.id
              ? 'border-[#5CA3FF] bg-blue-50/40'
              : 'border-gray-100 hover:border-gray-200 bg-white'
          }`}
        >
          <div className="size-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
            🏗
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-bold text-gray-900">{t.name}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#5CA3FF] border border-blue-100 rounded-full">
                {NICHE_LABELS[t.niche]}
              </span>
            </div>
            <p className="text-[12px] text-gray-400 mt-0.5 truncate">{t.description}</p>
          </div>
          {t.preview_demo_url && (
            <a
              href={t.preview_demo_url}
              target="_blank"
              rel="noopener"
              onClick={e => e.stopPropagation()}
              className="p-2 text-gray-300 hover:text-[#5CA3FF] rounded-xl transition-all shrink-0"
              title="Ver demo"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
        </button>
      ))}
    </div>
  )
}