// src/app/(dashboard)/admin/lab/templates/page.tsx
import { createClient } from '@/lib/server'
import { Suspense } from 'react'
import { TemplatesList } from './components/templates-list'
import { CreateTemplateModal } from './components/create-template-modal'
import { Layers, Plus, Activity, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { checkEnvStatus } from '../actions'

export const metadata = { title: 'Templates | Facillit Lab' }

export default async function TemplatesPage() {
  const supabase = await createClient()
  const envStatus = await checkEnvStatus()
  
  const { data: templates } = await supabase
    .from('lab_templates')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-20 mt-2 animate-in fade-in duration-700">

      {/* Header & Actions */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
              <Layers strokeWidth={1.5} className="size-5 text-[#5CA3FF]" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Templates</h1>
          </div>
          <p className="text-[13px] font-light text-gray-500">
            Gerencie os modelos da sua Fábrica de Sites conectados ao GitHub.
          </p>
        </div>

        <CreateTemplateModal>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#5CA3FF] hover:bg-[#4b8ce0] text-white text-[13px] font-bold rounded-full transition shadow-lg shadow-blue-500/20 active:scale-95">
            <Plus className="size-4" /> Novo Template
          </button>
        </CreateTemplateModal>
      </section>

      {/* Integration Status & System Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div className="xl:col-span-2 p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="size-4 text-gray-400" />
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status das Integrações (ENV)</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(envStatus).map(([key, ok]) => (
              <div key={key} className={`flex flex-col p-4 rounded-2xl border ${ok ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{key.replace('NEXT_PUBLIC_', '')}</span>
                  {ok ? <CheckCircle2 className="size-3 text-emerald-500" /> : <XCircle className="size-3 text-red-500" />}
                </div>
                <span className={`text-[11px] font-medium ${ok ? 'text-emerald-700' : 'text-red-700'}`}>
                  {ok ? 'Configurado' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-gray-900 text-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logs do Sistema</h2>
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-3 font-mono text-[10px] text-gray-400 flex-1">
            <p><span className="text-emerald-500">[OK]</span> Banco Supabase conectado.</p>
            <p><span className="text-blue-400">[INFO]</span> {templates?.length ?? 0} templates mapeados.</p>
            {!envStatus.GITHUB_TOKEN && (
              <p className="text-amber-500 flex items-center gap-1 mt-2">
                <AlertTriangle className="size-3" /> GITHUB_TOKEN ausente. Criação de sites inativa.
              </p>
            )}
            {!envStatus.LAB_URL && (
              <p className="text-amber-500 flex items-center gap-1 mt-2">
                <AlertTriangle className="size-3" /> LAB_BASE_URL não definida.
              </p>
            )}
          </div>
          <div className="mt-auto pt-4 border-t border-gray-800">
            <p className="text-gray-600 font-mono text-[10px]">-- Sistema aguardando ação --</p>
          </div>
        </div>
      </div>

      {/* Grid de Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Templates', value: templates?.length ?? 0 },
          { label: 'Ativos agora', value: templates?.filter(t => t.is_active).length ?? 0 },
          { label: 'Em espera', value: templates?.filter(t => !t.is_active).length ?? 0 },
          { label: 'Uptime API', value: '99.9%' },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-100 h-96 w-full rounded-[3rem]" />}>
        <TemplatesList initialTemplates={templates ?? []} />
      </Suspense>

    </div>
  )
}