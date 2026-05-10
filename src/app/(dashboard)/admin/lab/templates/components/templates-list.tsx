// src/app/(dashboard)/admin/lab/templates/components/templates-list.tsx
"use client"

import React, { useState, useTransition } from "react"
import { toggleTemplateStatus } from "../../actions"
import type { LabTemplate } from "@/types/lab"
import { NICHE_LABELS } from "@/types/lab"
import { ExternalLink, Power, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export function TemplatesList({ initialTemplates }: { initialTemplates: LabTemplate[] }) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleTemplateStatus(id, !current)
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t))
        toast.success(!current ? 'Ativado' : 'Inativado')
      } catch { toast.error('Erro') }
    })
  }

  if (!templates.length) return <div className="py-20 text-center">Nenhum template.</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {templates.map((t) => (
        <div key={t.id} className={`p-8 rounded-[2.5rem] bg-white border border-gray-100 flex flex-col gap-6 ${!t.is_active ? 'opacity-60' : ''}`}>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-blue-50 text-blue-600 border-blue-100">{NICHE_LABELS[t.niche] || t.niche}</span>
              <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
            </div>
            {t.is_active ? <CheckCircle2 className="size-6 text-emerald-500" /> : <AlertCircle className="size-6 text-gray-300" />}
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <GithubIcon className="size-5 text-gray-400 shrink-0" />
            <span className="text-[12px] font-mono text-gray-600 truncate">{t.github_template_repo}</span>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <a href={t.preview_demo_url} target="_blank" className="flex items-center gap-1.5 text-xs font-bold text-[#5CA3FF] hover:underline"><ExternalLink className="size-4" /> Demo</a>
            <button disabled={isPending} onClick={() => handleToggle(t.id, t.is_active)} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${t.is_active ? 'text-red-500 border-red-100' : 'text-emerald-600 border-emerald-100'}`}>{t.is_active ? 'Desativar' : 'Ativar'}</button>
          </div>
        </div>
      ))}
    </div>
  )
}