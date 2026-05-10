// src/app/(dashboard)/admin/lab/_components/config-json-viewer.tsx
"use client"

import { useState } from "react"
import { Code2, Copy, Check, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"

interface ConfigJsonViewerProps {
  config:      Record<string, any>
  title?:      string
  collapsible?: boolean
  showWarning?: boolean
}

export function ConfigJsonViewer({
  config,
  title      = 'config.json',
  collapsible = true,
  showWarning = false,
}: ConfigJsonViewerProps) {
  const [open,   setOpen]   = useState(!collapsible)
  const [copied, setCopied] = useState(false)

  const json = JSON.stringify(config, null, 2)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // Destacar valores vazios/undefined
  const highlighted = json
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="json-str">"$1"</span>')
    .replace(/: (true|false)/g, ': <span class="json-bool">$1</span>')
    .replace(/: (\d+)/g, ': <span class="json-num">$1</span>')
    .replace(/: null/g, ': <span class="json-null">null</span>')

  const emptyFields = Object.entries(config)
    .filter(([, v]) => v === '' || v === null || v === undefined)
    .map(([k]) => k)

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-gray-500" />
          <span className="text-[12px] font-mono font-bold text-gray-400">{title}</span>
          {emptyFields.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              <AlertTriangle className="size-3" />
              {emptyFields.length} vazios
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
          >
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          {collapsible && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-1 text-gray-500 hover:text-white rounded-lg transition-all"
            >
              {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Warnings para campos vazios */}
      {open && showWarning && emptyFields.length > 0 && (
        <div className="px-4 py-3 bg-amber-950/40 border-b border-amber-900/30">
          <p className="text-[11px] text-amber-400 font-bold">
            ⚠️ Campos sem preenchimento:
          </p>
          <p className="text-[11px] text-amber-500/80 font-mono mt-1">
            {emptyFields.join(', ')}
          </p>
        </div>
      )}

      {/* JSON */}
      {open && (
        <div className="overflow-auto max-h-96">
          <style>{`
            .json-key  { color: #79c0ff; }
            .json-str  { color: #a5d6ff; }
            .json-bool { color: #ff7b72; }
            .json-num  { color: #f0883e; }
            .json-null { color: #8b949e; }
          `}</style>
          <pre
            className="p-4 text-[11px] leading-relaxed font-mono text-gray-400 whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}
    </div>
  )
}

// ─── MODAL DE CONFIRMAÇÃO ─────────────────────────────────────────────────────

interface ConfirmConfigModalProps {
  config:      Record<string, any>
  companyName: string
  onConfirm:   () => void
  onCancel:    () => void
  isPending:   boolean
}

export function ConfirmConfigModal({
  config,
  companyName,
  onConfirm,
  onCancel,
  isPending,
}: ConfirmConfigModalProps) {
  const emptyFields = Object.entries(config)
    .filter(([k, v]) => !['features', 'modoPrevia'].includes(k) && (v === '' || v === null || v === undefined))
    .map(([k]) => k)

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-950 p-8 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-[#5CA3FF]/20 rounded-2xl">
              <Code2 className="size-5 text-[#5CA3FF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Confirme antes de gerar</p>
              <h3 className="text-lg font-bold text-white">Revisão do config.json</h3>
            </div>
          </div>
          <p className="text-[13px] text-gray-400">
            Este arquivo será injetado no template e define toda a identidade de{' '}
            <strong className="text-white">{companyName}</strong>. Verifique antes de prosseguir.
          </p>
        </div>

        {/* Config */}
        <div className="p-6 bg-gray-950 max-h-72 overflow-y-auto">
          <ConfigJsonViewer
            config={config}
            collapsible={false}
            showWarning={true}
          />
        </div>

        {/* Warning */}
        {emptyFields.length > 0 && (
          <div className="px-8 py-4 bg-amber-50 border-t border-amber-100">
            <p className="text-[12px] text-amber-800 font-medium">
              <strong>Atenção:</strong> {emptyFields.length} campo(s) ficará(ão) em branco no site.{' '}
              Você pode preencher depois, mas o site pode ficar incompleto.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 p-8 pt-6 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 h-12 border border-gray-200 text-gray-600 rounded-full font-semibold text-[13px] hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Voltar e editar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-[2] h-12 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white rounded-full font-bold text-[13px] shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando site...
              </>
            ) : (
              '🚀 Confirmar e Gerar Site'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}