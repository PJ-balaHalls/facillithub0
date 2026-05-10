// src/app/(dashboard)/admin/lab/previews/components/previews-table.tsx
"use client"

import { useState, useTransition } from "react"
import { refreshPreviewStatus, toggleFeatureFlag } from "../../../lab/actions"
import type { LabPreview } from "@/types/lab"
import { STATUS_CONFIG, NICHE_LABELS, ALL_FEATURES } from "@/types/lab"
import {
  ExternalLink, RefreshCw, Settings2, 
  ChevronDown, Globe, Eye
} from "lucide-react"
import { toast } from "sonner"
import { FeaturesPopover } from "./features-popover"

interface Props { initialPreviews: LabPreview[] }

export function PreviewsTable({ initialPreviews }: Props) {
  const [previews, setPreviews] = useState(initialPreviews)
  const [isPending, startTransition] = useTransition()

  const handleRefresh = (id: string) => {
    startTransition(async () => {
      try {
        await refreshPreviewStatus(id)
        toast.info('Status verificado')
      } catch {
        toast.error('Erro ao verificar status')
      }
    })
  }

  if (!previews.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[13px] text-gray-400">Nenhuma prévia gerada ainda.</p>
        <p className="text-[11px] text-gray-300 mt-1">Clique em "Gerar Prévia" para começar.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-50">
          <tr className="bg-gray-50/40">
            <th className="text-left py-5 pl-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Empresa</th>
            <th className="text-left py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Nicho</th>
            <th className="text-left py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
            <th className="text-left py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Modo</th>
            <th className="text-left py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Features</th>
            <th className="text-left py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Views</th>
            <th className="text-right py-5 pr-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ações</th>
          </tr>
        </thead>
        <tbody>
          {previews.map((p) => {
            const statusCfg = STATUS_CONFIG[p.status]
            const activeCount = Object.values(p.features ?? {}).filter(Boolean).length

            return (
              <tr key={p.id} className="border-b border-gray-50/50 hover:bg-gray-50/20 transition-colors group">
                {/* Empresa */}
                <td className="py-5 pl-8">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{p.company_name}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{p.slug}</p>
                  </div>
                </td>

                {/* Nicho */}
                <td className="py-5">
                  <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                    {NICHE_LABELS[p.niche] ?? p.niche}
                  </span>
                </td>

                {/* Status */}
                <td className="py-5">
                  <div className="flex items-center gap-2">
                    {p.status === 'building' && (
                      <span className="relative flex size-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full size-2 bg-blue-500" />
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </td>

                {/* Modo Prévia */}
                <td className="py-5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    p.modo_previa
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {p.modo_previa ? 'Prévia' : 'Ativo'}
                  </span>
                </td>

                {/* Features */}
                <td className="py-5">
                  <FeaturesPopover preview={p}>
                    <button className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 hover:text-[#5CA3FF] transition-colors">
                      <Settings2 className="size-3.5" />
                      {activeCount} ativas
                      <ChevronDown className="size-3" />
                    </button>
                  </FeaturesPopover>
                </td>

                {/* Views */}
                <td className="py-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Eye className="size-3.5" />
                    {p.preview_views ?? 0}
                  </div>
                </td>

                {/* Ações */}
                <td className="py-5 pr-8 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {p.status === 'building' && (
                      <button
                        onClick={() => handleRefresh(p.id)}
                        disabled={isPending}
                        className="p-2 text-gray-400 hover:text-[#5CA3FF] hover:bg-blue-50 rounded-xl transition-all"
                        title="Verificar status"
                      >
                        <RefreshCw className={`size-3.5 ${isPending ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                    {p.preview_url && (
                      <a
                        href={p.preview_url}
                        target="_blank"
                        rel="noopener"
                        className="p-2 text-gray-400 hover:text-[#5CA3FF] hover:bg-blue-50 rounded-xl transition-all"
                        title="Abrir prévia"
                      >
                        <Globe className="size-3.5" />
                      </a>
                    )}
                    {p.github_repo && (
                      <a
                        href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_ORG ?? 'facillithub'}/${p.github_repo}`}
                        target="_blank"
                        rel="noopener"
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                        title="Ver no GitHub"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}