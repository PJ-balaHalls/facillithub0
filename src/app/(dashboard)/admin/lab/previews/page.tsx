// src/app/(dashboard)/admin/lab/previews/page.tsx
import { createClient } from '@/lib/server'
import { Suspense } from 'react'
import { PreviewsTable } from './components/previews-table'
import { GenerateModal } from './components/generate-modal'
import { Skeleton } from '@/components/ui/skeleton'
import { Rocket, Zap } from 'lucide-react'
import { STATUS_CONFIG } from '@/types/lab'
import type { LabDeploymentStatus } from '@/types/lab'

export const metadata = { title: 'Previews | Facillit Lab' }

export default async function PreviewsPage() {
  const supabase = await createClient()

  const [{ data: previews }, { data: templates }] = await Promise.all([
    supabase
      .from('lab_previews')
      .select('*, lab_templates(name, niche)')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('lab_templates')
      .select('id, name, niche, default_features, default_tokens, description')
      .eq('is_active', true),
  ])

  const statsByStatus = (previews ?? []).reduce((acc, p) => {
    acc[p.status as LabDeploymentStatus] = (acc[p.status as LabDeploymentStatus] ?? 0) + 1
    return acc
  }, {} as Record<LabDeploymentStatus, number>)

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-20 mt-2 animate-in fade-in duration-700">

      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
              <Rocket strokeWidth={1.5} className="size-5 text-[#5CA3FF]" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Previews</h1>
          </div>
          <p className="text-[13px] font-light text-gray-500">
            Pipeline de geração — do lead ao site de demonstração em segundos.
          </p>
        </div>

        {/* Uso correto do componente importado */}
        <GenerateModal templates={templates ?? []}>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white text-[13px] font-medium rounded-full transition shadow-sm shadow-blue-500/20">
            <Zap className="size-3.5 fill-white" /> Gerar Prévia
          </button>
        </GenerateModal>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {(Object.entries(STATUS_CONFIG) as [LabDeploymentStatus, typeof STATUS_CONFIG[LabDeploymentStatus]][]).map(([status, cfg]) => (
          <div key={status} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{cfg.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${cfg.color}`}>
              {statsByStatus[status] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <PreviewsTable initialPreviews={previews ?? []} />
        </div>
      </Suspense>

    </div>
  )
}