import { Metadata } from "next"
import { Suspense } from "react"
import { ShieldCheck, Award, Users, ChevronDown } from "lucide-react"
import { RegistrySection } from "./components/registry-section"
import { LibrarySection } from "./components/library-section"
import { StatsSection } from "./components/stats-section"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Selos | Master Control",
}

export default function SealsPage() {
  return (
    <div className="flex-1 bg-white scroll-smooth overflow-x-hidden">
      {/* ÍNDICE FIXO - CLEAN WHITE */}
      <nav className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100/50 h-16">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-lg shadow-black/10">
              <ShieldCheck size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-black">Master.Authority</span>
          </div>
          <div className="flex gap-10">
            {['Overview', 'Membros', 'Biblioteca'].map((item, i) => (
              <a 
                key={item}
                href={`#section-${i}`} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* SEÇÃO 01: VISÃO GERAL (TELA CHEIA) */}
      <section id="section-0" className="min-h-screen flex flex-col justify-center bg-white px-8 md:px-16 pt-16">
        <div className="max-w-[1400px] mx-auto w-full space-y-12">
          <div className="space-y-4">
            <h1 className="text-[12vw] lg:text-[140px] font-black tracking-tighter leading-[0.8] text-black">
              Legitimidade.
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-medium">
              O sistema operacional de confiança do Facillit Hub. Gerencie o prestígio oficial de cada membro da rede.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-40 w-full rounded-[40px]" />}>
            <StatsSection />
          </Suspense>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-200">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* SEÇÃO 02: REGISTRO DE MEMBROS (TELA CHEIA) */}
      <section id="section-1" className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center px-8 md:px-16 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto w-full py-20">
          <header className="mb-16 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Registro Geral</span>
            <h2 className="text-6xl font-black tracking-tighter text-black leading-none">Gestão de Membros</h2>
          </header>
          <div className="bg-white rounded-[48px] p-1 shadow-2xl shadow-black/5 overflow-hidden">
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
              <RegistrySection />
            </Suspense>
          </div>
        </div>
      </section>

      {/* SEÇÃO 03: BIBLIOTECA (TELA CHEIA) */}
      <section id="section-2" className="min-h-screen bg-white flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto w-full py-20 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-black rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-black/20">
              <Award size={40} />
            </div>
            <h2 className="text-7xl font-black tracking-tighter text-black leading-none">
              Biblioteca <br /> de Selos
            </h2>
            <p className="text-xl text-gray-400 font-medium">
              A arquitetura de autoridade dividida em 9 camadas fundamentais de validação.
            </p>
          </div>
          <LibrarySection />
        </div>
      </section>
    </div>
  )
}