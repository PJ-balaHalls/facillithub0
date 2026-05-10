// src/app/(dashboard)/admin/lab/templates/components/templates-list.tsx
"use client"

import { useState, useTransition } from "react"
import { toggleTemplateStatus } from "../../actions"
import type { LabTemplate } from "@/types/lab"
import { NICHE_LABELS, ALL_FEATURES } from "@/types/lab"
import { ExternalLink, Power, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

// SVG Manual do Github para evitar erro do lucide-react
function GithubIconCard(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  )
}

const NICHE_COLORS: Record<string, string> = {
  restaurante:  'bg-orange-50 text-orange-700 border-orange-100',
  clinica:      'bg-blue-50 text-blue-700 border-blue-100',
  salao_beleza: 'bg-pink-50 text-pink-700 border-pink-100',
  barbearia:    'bg-yellow-50 text-yellow-700 border-yellow-100',
  academia:     'bg-green-50 text-green-700 border-green-100',
  outro:        'bg-gray-50 text-gray-700 border-gray-100',
}

interface Props {
  initialTemplates: LabTemplate[]
}

export function TemplatesList({ initialTemplates }: Props) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleTemplateStatus(id, !current)
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t))
        toast.success(!current ? 'Template ativado!' : 'Template inativado.')
      } catch {
        toast.error('Erro ao alterar status no banco de dados.')
      }
    })
  }

  if (!templates.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
        <LayersIcon className="size-12 text-gray-200 mb-4" />
        <h3 className="text-gray-900 font-bold mb-1">Nenhum template cadastrado</h3>
        <p className="text-gray-400 text-[13px] font-light max-w-sm">
          Clique no botão "Novo Template" acima para conectar seu primeiro repositório do GitHub à Fábrica.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {templates.map((t) => {
        const nicheColor = NICHE_COLORS[t.niche] || NICHE_COLORS.outro
        const activeFeatures = Object.entries(t.default_features ?? {}).filter(([, v]) => v).map(([k]) => k)

        return (
          <div
            key={t.id}
            className={`group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6 ${!t.is_active ? 'opacity-60 grayscale' : ''}`}
          >
            {/* Header do Card */}
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${nicheColor}`}>
                  {NICHE_LABELS[t.niche] ?? t.niche}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">{t.name}</h3>
                  <p className="text-[13px] text-gray-500 font-light leading-relaxed mt-1 line-clamp-2">
                    {t.description || 'Sem descrição cadastrada.'}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {t.is_active ? (
                  <div className="bg-emerald-50 p-2 rounded-full border border-emerald-100">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                  </div>
                ) : (
                  <div className="bg-gray-50 p-2 rounded-full border border-gray-100">
                    <AlertCircle className="size-5 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Badges de Features Nativas */}
            {activeFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeFeatures.slice(0, 3).map(fk => {
                  const feat = ALL_FEATURES.find(f => f.key === fk)
                  return (
                    <span key={fk} className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                      {feat?.label ?? fk}
                    </span>
                  )
                })}
                {activeFeatures.length > 3 && (
                  <span className="text-[10px] font-bold text-gray-400 px-2 py-1">
                    +{activeFeatures.length - 3} mais
                  </span>
                )}
              </div>
            )}

            {/* Repositório Vinculado */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <GithubIconCard className="size-5 text-gray-400 shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source Repo</span>
                <span className="text-[12px] font-mono text-gray-600 truncate">{t.github_template_repo}</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
              {t.preview_demo_url ? (
                <a
                  href={t.preview_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[13px] font-bold text-[#5CA3FF] hover:text-[#4b8ce0] hover:underline"
                >
                  <ExternalLink className="size-4" /> Demo
                </a>
              ) : (
                <span className="text-[11px] font-medium text-gray-300">Sem URL de demo</span>
              )}

              <button
                disabled={isPending}
                onClick={() => handleToggle(t.id, t.is_active)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold transition-all border shadow-sm ${
                  t.is_active
                    ? 'bg-white border-red-100 text-red-500 hover:bg-red-50'
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                <Power className="size-3.5" />
                {t.is_active ? 'Desativar' : 'Ativar Template'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LayersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.1 6.3a2 2 0 0 0 0 3.42l8.48 4.13a2 2 0 0 0 1.66 0l8.48-4.13a2 2 0 0 0 0-3.42ZM2 12.5a2 2 0 0 0 0 3.42l8.48 4.13a2 2 0 0 0 1.66 0l8.48-4.13a2 2 0 0 0 0-3.42ZM2 17.5a2 2 0 0 0 0 3.42l8.48 4.13a2 2 0 0 0 1.66 0l8.48-4.13a2 2 0 0 0 0-3.42Z"/></svg>
  )
}