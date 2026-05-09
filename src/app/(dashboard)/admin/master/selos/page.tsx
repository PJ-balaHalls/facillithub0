import { Metadata } from "next"
import { Suspense } from "react"
import { BadgeCheck, ShieldCheck, Users, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { StatsCards } from "./components/stats-cards"
import { WorkspaceTable } from "./components/workspace-table"
import { SealsList } from "./components/seals-list"
import { ExportButtons } from "./components/export-buttons"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Master | Selos e Legitimidade",
}

export default async function SealsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-[#FAFAFA]/50 min-h-screen">
      {/* HEADER E AÇÕES GLOBAIS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Legitimidade</h2>
          <p className="text-muted-foreground text-sm">
            Controle de autoridade, selos oficiais e validação de infraestrutura.
          </p>
        </div>
        <ExportButtons />
      </div>

      {/* SEÇÃO 1: RESUMOS (STATS REAIS) */}
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <StatsCards />
      </Suspense>

      {/* SEÇÃO 2: EXPLICAÇÃO E CONCEITO */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <div className="col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            Gestão de Workspaces e Atribuição
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Busque empresas para atribuir selos manualmente ou revisar validações automáticas do sistema.
          </p>
          
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <WorkspaceTable />
          </Suspense>
        </div>

        {/* SEÇÃO 3: CATÁLOGO DE DEFINIÇÕES */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-green-500" />
              Definições de Selos
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Configuração global dos critérios de cada selo.
            </p>
            <SealsList />
          </div>
        </div>
      </div>
    </div>
  )
}