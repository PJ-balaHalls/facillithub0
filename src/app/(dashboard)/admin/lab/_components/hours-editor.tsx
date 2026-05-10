// src/app/(dashboard)/admin/lab/_components/hours-editor.tsx
"use client"

import { useState } from "react"
import { Clock } from "lucide-react"

const DIAS: { key: string; label: string; short: string }[] = [
  { key: 'segunda',  label: 'Segunda-feira', short: 'Seg' },
  { key: 'terca',    label: 'Terça-feira',   short: 'Ter' },
  { key: 'quarta',   label: 'Quarta-feira',  short: 'Qua' },
  { key: 'quinta',   label: 'Quinta-feira',  short: 'Qui' },
  { key: 'sexta',    label: 'Sexta-feira',   short: 'Sex' },
  { key: 'sabado',   label: 'Sábado',        short: 'Sáb' },
  { key: 'domingo',  label: 'Domingo',       short: 'Dom' },
]

interface HoursValue {
  abertura: string
  fechamento: string
  fechado: boolean
}

type HorariosMap = Record<string, HoursValue>

interface HoursEditorProps {
  value:    HorariosMap
  onChange: (v: HorariosMap) => void
}

const DEFAULT_HOURS: HoursValue = { abertura: '08:00', fechamento: '18:00', fechado: false }

export function HoursEditor({ value, onChange }: HoursEditorProps) {
  const update = (dia: string, field: keyof HoursValue, val: string | boolean) => {
    const current = value[dia] || { ...DEFAULT_HOURS }
    onChange({ ...value, [dia]: { ...current, [field]: val } })
  }

  const copyAll = (dia: string) => {
    const source = value[dia] || DEFAULT_HOURS
    const newVal: HorariosMap = {}
    DIAS.forEach(d => { newVal[d.key] = { ...source } })
    onChange({ ...value, ...newVal })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="size-4 text-gray-400" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Horários de Funcionamento</p>
      </div>

      <div className="space-y-1.5">
        {DIAS.map(dia => {
          const h = value[dia.key] || { ...DEFAULT_HOURS }
          return (
            <div
              key={dia.key}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${
                h.fechado ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Toggle fechado */}
              <button
                type="button"
                onClick={() => update(dia.key, 'fechado', !h.fechado)}
                className={`relative shrink-0 w-8 h-4.5 rounded-full transition-colors ${h.fechado ? 'bg-gray-300' : 'bg-emerald-400'}`}
              >
                <div className={`absolute top-0.5 size-3.5 rounded-full bg-white shadow transition-transform ${h.fechado ? 'translate-x-0.5' : 'translate-x-4'}`} />
              </button>

              <span className={`text-[12px] font-bold w-8 shrink-0 ${h.fechado ? 'text-gray-300' : 'text-gray-700'}`}>
                {dia.short}
              </span>

              {h.fechado ? (
                <span className="text-[11px] text-gray-400 font-medium flex-1">Fechado</span>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={h.abertura}
                    onChange={e => update(dia.key, 'abertura', e.target.value)}
                    className="h-8 px-2 text-[12px] font-mono bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-[#5CA3FF] transition-all w-[90px]"
                  />
                  <span className="text-gray-300 text-[12px]">–</span>
                  <input
                    type="time"
                    value={h.fechamento}
                    onChange={e => update(dia.key, 'fechamento', e.target.value)}
                    className="h-8 px-2 text-[12px] font-mono bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-[#5CA3FF] transition-all w-[90px]"
                  />
                  <button
                    type="button"
                    onClick={() => copyAll(dia.key)}
                    title="Aplicar para todos os dias"
                    className="text-[10px] text-gray-400 hover:text-[#5CA3FF] font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    Replicar
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}