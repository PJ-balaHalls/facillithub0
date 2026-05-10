// src/app/(dashboard)/admin/lab/ativacao/page.tsx
import { createClient } from '@/lib/server'
import { ActivationTable } from './components/activation-table'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Zap, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Ativação | Facillit Lab' }

export default async function AtivacaoPage() {
  const supabase = await createClient()

  const { data: previews } = await supabase
    .from('lab_previews')
    .select('*, lab_templates(name, niche)')
    .eq('status', 'live')
    .order('created_at', { ascending: false })

  const previewSites = (previews ?? []).filter(p => p.modo_previa)
  const liveSites    = (previews ?? []).filter(p => !p.modo_previa)

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-20 mt-2 animate-in fade-in duration-700">

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <Zap strokeWidth={1.5} className="size-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Ativação</h1>
          </div>
          <p className="text-[13px] font-light text-gray-500">
            Sites em modo prévia aguardando conversão. Um clique para ativar.
          </p>
        </div>
      </section>

      {/* Stats de conversão */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Prévias Aguardando</p>
          <p className="text-3xl font-semibold text-amber-500 mt-2">{previewSites.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Demonstrações ativas</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Sites Ativos</p>
          <p className="text-3xl font-semibold text-emerald-500 mt-2">{liveSites.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Clientes convertidos</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp strokeWidth={1.5} className="size-4 text-[#5CA3FF]" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Taxa de Conversão</p>
          </div>
          <p className="text-3xl font-semibold text-[#5CA3FF] mt-2">
            {previewSites.length + liveSites.length > 0
              ? Math.round((liveSites.length / (previewSites.length + liveSites.length)) * 100)
              : 0}%
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Prévias → sites ativos</p>
        </div>
      </div>

      {/* Prévias aguardando ativação */}
      {previewSites.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">
            Aguardando Ativação
          </h2>
          <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <ActivationTable previews={previewSites} mode="preview" />
            </Suspense>
          </div>
        </div>
      )}

      {/* Sites já ativos */}
      <div>
        <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">
          Sites Ativos
        </h2>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <ActivationTable previews={liveSites} mode="live" />
          </Suspense>
        </div>
      </div>

    </div>
  )
}