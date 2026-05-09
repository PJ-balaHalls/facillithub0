import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48 rounded-md bg-gray-200/60" />
        <Skeleton className="h-4 w-96 rounded-md bg-gray-100" />
      </div>

      {/* Grid de Métricas - 4 Cards Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 bg-gray-100" />
              <Skeleton className="size-8 rounded-md bg-gray-50" />
            </div>
            <div className="space-y-2 mt-2">
              <Skeleton className="h-7 w-32 bg-gray-200/60" />
              <Skeleton className="h-3 w-40 bg-gray-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Seção Inferior - Painéis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Painel 1 Skeleton */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 bg-gray-200/60" />
              <Skeleton className="h-3 w-64 bg-gray-100" />
            </div>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200/60" />
                  <Skeleton className="h-3 w-48 bg-gray-100" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md bg-gray-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Painel 2 Skeleton */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36 bg-gray-200/60" />
              <Skeleton className="h-3 w-56 bg-gray-100" />
            </div>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-3 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40 bg-gray-200/60" />
                  <Skeleton className="h-3 w-24 bg-gray-100" />
                </div>
                <Skeleton className="h-4 w-16 bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}