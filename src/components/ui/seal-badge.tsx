"use client"

import * as React from "react"
import { BadgeCheck, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SealBadgeProps {
  name: string
  description?: string
  color?: string
  className?: string
  icon?: LucideIcon
  size?: number
}

export function SealBadge({
  name,
  description,
  color = "#5CA3FF",
  className,
  icon: Icon = BadgeCheck,
  size = 16
}: SealBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center cursor-help", className)}>
            <Icon 
              size={size} 
              strokeWidth={1.8} 
              style={{ color: color }} 
              className="drop-shadow-sm"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-white text-black border border-gray-200 shadow-xl p-3 max-w-xs">
          <div className="space-y-1">
            <p className="text-sm font-bold flex items-center gap-2">
              <Icon size={14} style={{ color: color }} />
              {name}
            </p>
            {description && <p className="text-xs text-gray-500 leading-relaxed">{description}</p>}
            <div className="pt-1 mt-1 border-t border-gray-100">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                Validado por Facillit Hub
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}