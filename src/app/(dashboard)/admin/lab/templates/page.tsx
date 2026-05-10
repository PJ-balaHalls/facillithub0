// src/app/(dashboard)/admin/lab/templates/page.tsx
import { createClient } from '@/lib/server'
import { Suspense } from 'react' // CORRIGIDO: O Suspense vem do 'react' e não do 'next'
import { TemplatesList } from './components/templates-list'
import { CreateTemplateModal } from './components/create-template-modal'
import { Layers, Plus } from 'lucide-react'

export const metadata = { title: 'Templates | Facillit Lab' }

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: templates } = await supabase
    .from('lab_templates')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-20 mt-2 animate-in fade-in duration-700">

      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
              <Layers strokeWidth={1.5} className="size-5 text-[#5CA3FF]" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Templates</h1>
          </div>
          <p className="text-[13px] font-light text-gray-500">
            Modelos por nicho que alimentam a Fábrica de Sites.
          </p>
        </div>

        <CreateTemplateModal>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white text-[13px] font-medium rounded-full transition shadow-sm shadow-blue-500/20">
            <Plus className="size-3.5" /> Novo Template
          </button>
        </CreateTemplateModal>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total de Templates',  value: templates?.length ?? 0 },
          { label: 'Nichos Cobertos',     value: new Set(templates?.map(t => t.niche)).size ?? 0 },
          { label: 'Templates Ativos',    value: templates?.filter(t => t.is_active).length ?? 0 },
          { label: 'Em Manutenção',       value: templates?.filter(t => !t.is_active).length ?? 0 },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 w-full rounded-3xl" />}>
        <TemplatesList initialTemplates={templates ?? []} />
      </Suspense>

    </div>
  )
}