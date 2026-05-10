// src/app/(dashboard)/admin/lab/_components/color-picker.tsx
"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

const PRESETS = [
  '#5CA3FF', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#0F172A', '#1E293B',
  '#B8860B', '#C0392B', '#27AE60', '#2980B9',
]

interface ColorPickerProps {
  label:    string
  value:    string
  onChange: (hex: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [hex, setHex]   = useState(value)

  const apply = (color: string) => {
    setHex(color)
    onChange(color)
    setOpen(false)
  }

  const handleHexInput = (v: string) => {
    setHex(v)
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v)
  }

  return (
    <div className="relative">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-gray-200 transition-all"
      >
        <span
          className="size-6 rounded-lg border border-gray-200 shrink-0"
          style={{ background: hex }}
        />
        <span className="text-[13px] font-mono text-gray-700 flex-1 text-left">{hex}</span>
        <ChevronDown className={`size-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-white rounded-2xl border border-gray-100 shadow-2xl p-4 space-y-3">
            {/* Native color input */}
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={hex}
                onChange={e => apply(e.target.value)}
                className="w-12 h-10 rounded-xl cursor-pointer border border-gray-100 p-1"
              />
              <input
                type="text"
                value={hex}
                maxLength={7}
                onChange={e => handleHexInput(e.target.value)}
                className="flex-1 h-10 px-3 font-mono text-[13px] rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-[#5CA3FF] focus:bg-white transition-all"
                placeholder="#RRGGBB"
              />
            </div>

            {/* Presets */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Paleta rápida</p>
              <div className="grid grid-cols-6 gap-1.5">
                {PRESETS.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => apply(preset)}
                    className="relative size-8 rounded-lg border-2 transition-all hover:scale-110"
                    style={{
                      background: preset,
                      borderColor: preset === hex ? '#fff' : 'transparent',
                      boxShadow: preset === hex ? `0 0 0 2px ${preset}` : 'none',
                    }}
                  >
                    {preset === hex && (
                      <Check className="size-3 text-white absolute inset-0 m-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}