// src/app/(dashboard)/admin/lab/ativacao/components/activation-table.tsx
"use client"

import { ExternalLink, Rocket, ArrowRight, Clock } from "lucide-react"

type PreviewItem = {
  id: string
  client_name?: string
  vercel_url?: string
  created_at: string
  status: string
  modo_previa: boolean
  lab_templates?: {
    name: string
    niche: string
  } | null
  [key: string]: any
}

interface ActivationTableProps {
  previews: PreviewItem[]
  mode: 'preview' | 'live'
}

export function ActivationTable({ previews, mode }: ActivationTableProps) {
  if (!previews || previews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-[13px] text-gray-400 font-light">
          Nenhum site encontrado nesta categoria.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-50 bg-gray-50/50">
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Cliente / Projeto
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Template
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Data de Criação
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {previews.map((preview) => (
            <tr key={preview.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-900">
                    {preview.client_name || 'Cliente não definido'}
                  </span>
                  {preview.vercel_url && (
                    <a
                      href={preview.vercel_url.startsWith('http') ? preview.vercel_url : `https://${preview.vercel_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-[#5CA3FF] hover:text-[#4b8ce0] hover:underline flex items-center gap-1 mt-0.5 w-fit"
                    >
                      {preview.vercel_url.replace(/^https?:\/\//, '')} 
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[13px] text-gray-700 font-medium">
                    {preview.lab_templates?.name || 'Template desconhecido'}
                  </span>
                  {preview.lab_templates?.niche && (
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
                      {preview.lab_templates.niche}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-light">
                  <Clock className="size-3.5 text-gray-400" />
                  {new Date(preview.created_at).toLocaleDateString('pt-BR')}
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                {mode === 'preview' ? (
                  <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-100 transition-colors rounded-full text-[12px] font-semibold shadow-sm">
                    <Rocket className="size-3.5" />
                    Ativar Agora
                  </button>
                ) : (
                  <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 transition-colors rounded-full text-[12px] font-medium shadow-sm">
                    Gerenciar Site
                    <ArrowRight className="size-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}