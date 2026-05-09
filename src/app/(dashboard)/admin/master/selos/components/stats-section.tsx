import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/server"

export async function StatsSection() {
  const supabase = await createClient()
  const { count: seals } = await supabase.from('workspace_seals').select('*', { count: 'exact', head: true })
  const { count: members } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-sm ring-1 ring-gray-100">
        <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Membros</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{members || 0}</div></CardContent>
      </Card>
      <Card className="border-none shadow-sm ring-1 ring-gray-100">
        <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Selos Ativos</CardTitle></CardHeader>
        <CardContent><div className="text-2xl font-bold">{seals || 0}</div></CardContent>
      </Card>
    </div>
  )
}