// src/app/(dashboard)/admin/lab/previews/components/generate-modal/step-identity.tsx
"use client"

import type { FormState } from "./index"
import { NICHE_LABELS, LabNiche } from "@/types/lab"

interface Props { form: FormState; onChange: (f: Partial<FormState>) => void }

const NICHES = Object.entries(NICHE_LABELS) as [LabNiche, string][]

export function StepIdentity({ form, onChange }: Props) {
  return (
    <div className="space-y-5 pt-4">
      <div>
        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Nome da Empresa *</label>
        <input
          type="text"
          value={form.company_name}
          onChange={e => onChange({ company_name: e.target.value })}
          placeholder="Ex: Pizzaria Bella Napoli"
          className="mt-2 w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[14px] text-gray-900 placeholder:text-gray-300 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Slogan</label>
        <input
          type="text"
          value={form.slogan}
          onChange={e => onChange({ slogan: e.target.value })}
          placeholder="Ex: O melhor da culinária italiana"
          className="mt-2 w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[14px] placeholder:text-gray-300 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Descrição curta</label>
        <textarea
          value={form.descricao}
          onChange={e => onChange({ descricao: e.target.value })}
          placeholder="2-3 frases sobre o negócio..."
          rows={3}
          className="mt-2 w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-[14px] placeholder:text-gray-300 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all resize-none"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Nicho / Segmento *</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {NICHES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ niche: key })}
              className={`px-4 py-2 text-[12px] font-bold rounded-full border transition-all ${
                form.niche === key
                  ? 'bg-[#5CA3FF] text-white border-[#5CA3FF]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#5CA3FF]/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}