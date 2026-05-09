"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { createClient } from "@/lib/client"

export function ExportButtons() {
  const handleExport = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('workspace_seals')
      .select('granted_at, workspace_id, seal_definitions(name)')

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Data,WorkspaceID,Selo\n"
      + data?.map(r => `${r.granted_at},${r.workspace_id},${r.seal_definitions?.name}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "relatorio_selos_facillit.csv")
    document.body.appendChild(link)
    link.click()
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport}
      className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
    >
      <Download className="mr-2 h-4 w-4" />
      Exportar Relatório
    </Button>
  )
}