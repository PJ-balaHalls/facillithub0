// src/app/(dashboard)/admin/lab/_components/feature-flags-panel.tsx
"use client"

import { useState, useTransition } from "react"
import { ALL_FEATURES } from "@/types/lab"
import { toggleFeatureFlag } from "../actions/features"
import { toast } from "sonner"
import {
  MessageCircle, Map, Images, UtensilsCrossed, 
  CalendarDays, Play, Search, 
  Loader2, Info
} from "lucide-react"

// Ícone SVG Customizado do Instagram
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const FEATURE_ICONS: Record<string, React.ElementType> = {
  whatsapp_button: MessageCircle,
  google_maps:     Map,
  gallery:         Images,
  menu_list:       UtensilsCrossed,
  booking_form:    CalendarDays,
  carousel:        Play,
  seo_schema:      Search,
  instagram_feed:  InstagramIcon,
}

interface FeatureFlagsPanelProps {
  previewId: string
  features:  Record<string, boolean>
  onChange?: (key: string, val: boolean) => void
  compact?:  boolean
}

export function FeatureFlagsPanel({
  previewId,
  features: initialFeatures,
  onChange,
  compact = false,
}: FeatureFlagsPanelProps) {
  const [features, setFeatures] = useState<Record<string, boolean>>(initialFeatures ?? {})
  const [isPending, startTransition] = useTransition()
  const [toggling, setToggling] = useState<string | null>(null)

  const handleToggle = (featureKey: string, current: boolean) => {
    setToggling(featureKey)
    startTransition(async () => {
      try {
        await toggleFeatureFlag(previewId, featureKey, !current)
        setFeatures(prev => ({ ...prev, [featureKey]: !current }))
        onChange?.(featureKey, !current)
        toast.success(`${!current ? '✅' : '🔴'} ${featureKey.replace(/_/g, ' ')} ${!current ? 'ativada' : 'desativada'}`)
      } catch {
        toast.error('Erro ao alterar feature')
      } finally {
        setToggling(null)
      }
    })
  }

  return (
    <div className={`space-y-2 ${compact ? '' : 'p-1'}`}>
      {!compact && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-50">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Feature Flags
          </p>
          <span className="text-[10px] bg-[#5CA3FF]/10 text-[#5CA3FF] font-bold px-2 py-0.5 rounded-full">
            {Object.values(features).filter(Boolean).length} ativas
          </span>
        </div>
      )}

      {ALL_FEATURES.map((feat) => {
        const enabled  = features[feat.key] ?? false
        const Icon     = FEATURE_ICONS[feat.key] || Info
        const isLoading = toggling === feat.key && isPending

        return (
          <button
            key={feat.key}
            type="button"
            disabled={isPending}
            onClick={() => handleToggle(feat.key, enabled)}
            className={`w-full flex items-center gap-3 ${compact ? 'px-2 py-2' : 'px-3 py-2.5'} rounded-xl transition-all text-left group ${
              enabled
                ? 'bg-blue-50/70 border border-blue-100/80'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              enabled ? 'bg-[#5CA3FF] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
            }`}>
              {isLoading
                ? <Loader2 className="size-3.5 animate-spin" />
                : <Icon className="size-3.5" />
              }
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-[12px] font-semibold leading-tight ${enabled ? 'text-[#5CA3FF]' : 'text-gray-700'}`}>
                {feat.label}
              </p>
              {!compact && (
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{feat.description}</p>
              )}
            </div>

            {/* Toggle */}
            <div className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${
              enabled ? 'bg-[#5CA3FF]' : 'bg-gray-200'
            }`}>
              <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 ${
                enabled ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </div>
          </button>
        )
      })}
    </div>
  )
}