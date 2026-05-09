"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client" // Certifique-se que o caminho está correto
import { SealCard } from "./seal-card"
import { Skeleton } from "@/components/ui/skeleton"

export function SealsList() {
  const [seals, setSeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSeals() {
      const { data, error } = await supabase
        .from('seal_definitions')
        .select('*')
        .order('priority', { ascending: false })
      
      if (!error) setSeals(data)
      setLoading(false)
    }
    fetchSeals()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      {seals.map((seal) => (
        <SealCard key={seal.id} seal={seal} />
      ))}
    </div>
  )
}