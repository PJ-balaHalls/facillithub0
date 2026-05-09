"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Award } from "lucide-react"
import { SealBadge } from "@/components/ui/seal-badge"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AssignSealModal } from "./assign-seal-modal"

export function WorkspaceTable() {
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  const fetchWorkspaces = async () => {
    // Busca workspaces e faz o join com os selos ativos
    const { data, error } = await supabase
      .from('profiles') // Ajuste para sua tabela de usuários/workspaces
      .select(`
        id, 
        full_name, 
        email,
        workspace_seals (
          id,
          seal_definitions (name, color, icon_name, key)
        )
      `)
      .ilike('full_name', `%${searchTerm}%`)
    
    if (!error) setWorkspaces(data)
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [searchTerm])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Buscar empresa ou responsável..." 
          className="pl-10 bg-gray-50/50 border-none focus-visible:ring-1 focus-visible:ring-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-gray-50 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="text-[10px] uppercase font-bold text-gray-400">Empresa</TableHead>
              <TableHead className="text-[10px] uppercase font-bold text-gray-400">Selos Ativos</TableHead>
              <TableHead className="text-[10px] uppercase font-bold text-gray-400 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.map((ws) => (
              <TableRow key={ws.id} className="hover:bg-gray-50/30 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900">{ws.full_name}</span>
                    <span className="text-[10px] text-gray-400">{ws.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {ws.workspace_seals?.map((s: any) => (
                      <SealBadge 
                        key={s.id}
                        name={s.seal_definitions.name}
                        color={s.seal_definitions.color}
                        size={14}
                      />
                    ))}
                    {ws.workspace_seals?.length === 0 && (
                      <span className="text-[10px] text-gray-300 italic">Nenhum selo</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AssignSealModal 
                        workspaceId={ws.id} 
                        workspaceName={ws.full_name}
                        onSuccess={fetchWorkspaces}
                      >
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2">
                           <Award size={14} /> Atribuir Selo
                         </DropdownMenuItem>
                      </AssignSealModal>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}