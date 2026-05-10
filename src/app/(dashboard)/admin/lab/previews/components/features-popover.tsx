// src/app/(dashboard)/admin/lab/previews/components/features-popover.tsx
"use client"

import { useState, useTransition } from "react"
import { toggleFeatureFlag } from "../../../lab/actions"
import type { LabPreview } from "@/types/lab"
import { ALL_FEATURES } from "@/types/lab"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"

interface Props {
  preview: LabPreview
  children: React.ReactNode
}

// Precisamos adicionar Popover ao projeto se não existir
// Usando uma implementação simples com estado
export function FeaturesPopover({ preview, children }: Props) {
  const [open, setOpen] = useState(false)
  const [features, setFeatures] = useState<Record<string, boolean>>(preview.features ?? {})
  const [isPending, startTransition] = useTransition()

  const handleToggle = (featureKey: string, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleFeatureFlag(preview.id, featureKey, !current)
        setFeatures(prev => ({ ...prev, [featureKey]: !current }))
        toast.success(`Feature ${!current ? 'ativada' : 'desativada'}`)
      } catch {
        toast.error('Erro ao alterar feature')
      }
    })
  }

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{children}</div>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Popover */}
          <div className="absolute left-0 top-full mt-2 z-50 w-64 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.08)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 pb-2 mb-1 border-b border-gray-50">
              Feature Flags
            </p>
            <div className="space-y-1">
              {ALL_FEATURES.map((feat) => {
                const enabled = features[feat.key] ?? false
                return (
                  <button
                    key={feat.key}
                    disabled={isPending}
                    onClick={() => handleToggle(feat.key, enabled)}
                    className={`w-full flex items-center justify-between px-2 py-2 rounded-xl transition-colors text-left ${
                      enabled ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className={`text-[12px] font-medium ${enabled ? 'text-[#5CA3FF]' : 'text-gray-700'}`}>
                        {feat.label}
                      </p>
                      <p className="text-[10px] text-gray-400">{feat.description}</p>
                    </div>
                    <div className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-[#5CA3FF]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}