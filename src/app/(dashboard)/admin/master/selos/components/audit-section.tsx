"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { History, User, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Note que aqui exportamos AuditSection
export function AuditSection() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('master_audit_log')
        .select('*, profiles:admin_id(full_name)')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (data) setLogs(data)
      setLoading(false)
    }
    fetchLogs()
  }, [supabase])

  return (
    <Card className="border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-3xl bg-white overflow-hidden w-full">
      <CardHeader className="p-6 border-b border-gray-50 bg-gray-50/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <History className="size-4 text-gray-700" />
          </div>
          <CardTitle className="text-[15px] font-semibold tracking-tight text-gray-900">Log de Operações</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/30">
            <TableRow className="hover:bg-transparent border-b border-gray-100">
              <TableHead className="py-4 pl-8 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Admin</TableHead>
              <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Ação</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="py-12 text-center text-gray-400 animate-pulse text-xs uppercase tracking-widest">Sincronizando logs...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="py-12 text-center text-gray-400 text-xs italic">Nenhuma operação registrada.</TableCell></TableRow>
            ) : logs.map((log) => (
              <TableRow key={log.id} className="border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors">
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                    <User className="size-3.5 text-gray-400" />
                    {log.profiles?.full_name || 'Sistema'}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${log.action_type === 'ASSIGN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {log.action_type === 'ASSIGN' ? 'Atribuiu' : 'Revogou'}
                  </span>
                </TableCell>
                <TableCell className="py-5 pr-8 text-right">
                  <div className="flex items-center justify-end gap-2 text-[11px] text-gray-400 font-medium">
                    <Clock className="size-3" />
                    {new Date(log.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}