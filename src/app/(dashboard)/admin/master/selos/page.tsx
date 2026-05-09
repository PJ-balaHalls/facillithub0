import { Metadata } from "next"
import { Suspense } from "react"
import { RegistrySection } from "./components/registry-section"
import { LibrarySection } from "./components/library-section"
import { AuditSection } from "./components/audit-section"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = { title: "Selos | Master Admin" }

export default function SealsPage() {
  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-32 mt-2 scroll-smooth animate-in fade-in duration-700">
      
      {/* HEADER LIMPO (Consistente com admin/page.tsx) */}
      <section className="px-8 mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Operação de Autoridade</h1>
        <p className="text-[13px] font-light text-gray-500 mt-1">Validação institucional de todos os membros e empresas.</p>
      </section>

      <div className="px-8 space-y-24">
        <section id="membros" className="scroll-mt-10">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-[0_4px_25px_rgb(0,0,0,0.03)]">
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <RegistrySection />
            </Suspense>
          </div>
        </section>

        <hr className="border-t border-gray-100/60" />

        <section id="biblioteca" className="scroll-mt-10">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-6 px-1">Biblioteca Oficial</h2>
          <LibrarySection />
        </section>

        <section id="auditoria" className="scroll-mt-10">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-6 px-1">Logs de Auditoria</h2>
          <AuditSection />
        </section>
      </div>

      {/* NAV FLUTUANTE */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
        <nav className="flex items-center gap-1 p-1.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-full shadow-[0_10px_30px_rgb(0,0,0,0.08)]">
          <a href="#membros" className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#5CA3FF]">01. Membros</a>
          <div className="w-[1px] h-4 bg-gray-200 mx-1" />
          <a href="#biblioteca" className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#5CA3FF]">02. Biblioteca</a>
          <div className="w-[1px] h-4 bg-gray-200 mx-1" />
          <a href="#auditoria" className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#5CA3FF]">03. Auditoria</a>
        </nav>
      </div>
    </div>
  )
}