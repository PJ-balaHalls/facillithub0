"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Search, MoreHorizontal, UserCheck, ShieldPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AssignSealModal } from "./assign-seal-modal"
import { SealBadge } from "@/components/ui/seal-badge"

export function RegistrySection() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const supabase = createClient()

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select(`
        id, full_name, email, avatar_url,
        workspace_seals (id, seal_id, seal_definitions (name, color, key))
      `)
      .or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      .order('full_name', { ascending: true })
    
    if (data) setProfiles(data)
  }

  useEffect(() => {
    fetchProfiles()
  }, [search])

  return (
    <div className="flex flex-col h-[700px]">
      <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-white/50 backdrop-blur-sm z-10">
        <Search className="text-gray-300" size={24} />
        <Input 
          placeholder="Pesquisar por nome ou e-mail..."
          className="h-14 border-none bg-transparent text-xl font-bold placeholder:text-gray-200 focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Usuário</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest">Autoridade Atual</TableHead>
              <TableHead className="text-right pr-6 text-[10px] font-black uppercase tracking-widest">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((p) => (
              <TableRow key={p.id} className="group border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                <TableCell className="py-8">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-xl shadow-black/5">
                      <AvatarImage src={p.avatar_url} />
                      <AvatarFallback className="bg-black text-white font-black">{p.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-gray-900 tracking-tighter">{p.full_name || "Sem Nome"}</span>
                      <span className="text-xs text-gray-400 font-bold tracking-tight uppercase">{p.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {p.workspace_seals?.map((s: any) => (
                      <SealBadge key={s.id} name={s.seal_definitions.name} color={s.seal_definitions.color} size={18} />
                    ))}
                    {p.workspace_seals?.length === 0 && <span className="text-[10px] text-gray-200 font-black uppercase tracking-widest">Neutro</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <AssignSealModal memberId={p.id} memberName={p.full_name} onSuccess={fetchProfiles}>
                    <Button variant="ghost" className="h-14 w-14 rounded-3xl hover:bg-white hover:shadow-xl group">
                      <ShieldPlus className="text-gray-300 group-hover:text-black transition-colors" size={24} />
                    </Button>
                  </AssignSealModal>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}