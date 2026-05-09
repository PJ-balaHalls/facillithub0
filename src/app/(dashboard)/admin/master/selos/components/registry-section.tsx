"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/client"
import { Search, ShieldPlus, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { SealBadge } from "@/components/ui/seal-badge"
import { AssignSealModal } from "./assign-seal-modal"

export function RegistrySection() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, full_name, email, avatar_url,
        workspace_seals (
          id, 
          seal_definitions:seal_id (name, color)
        )
      `)
      .or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      .order('full_name', { ascending: true })
    
    if (!error && data) setProfiles(data)
    setLoading(false)
  }, [search, supabase])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  return (
    <div className="flex flex-col">
      <div className="p-8 border-b border-gray-50 bg-gray-50/10 flex items-center gap-4">
        <Search className="size-5 text-gray-300" />
        <Input 
          placeholder="Pesquisar Membro..."
          className="h-10 border-none bg-transparent text-lg font-medium placeholder:text-gray-200 focus-visible:ring-0 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader className="bg-gray-50/30">
          <TableRow className="border-b border-gray-100">
            <TableHead className="py-6 pl-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">Membro</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Selos</TableHead>
            <TableHead className="text-right pr-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={3} className="py-20 text-center animate-pulse text-gray-300 font-bold uppercase text-[10px]">Sincronizando...</TableCell></TableRow>
          ) : profiles.map((p) => (
            <TableRow key={p.id} className="group border-b border-gray-50/50 hover:bg-gray-50/20 transition-all">
              <TableCell className="py-8 pl-10">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-gray-100 shadow-sm"><AvatarImage src={p.avatar_url}/><AvatarFallback className="text-[10px] font-bold">{p.full_name?.charAt(0)}</AvatarFallback></Avatar>
                  <div className="flex flex-col"><span className="text-sm font-semibold text-gray-900">{p.full_name}</span><span className="text-[11px] text-gray-400">{p.email}</span></div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {p.workspace_seals?.map((s: any) => (
                    <SealBadge key={s.id} name={s.seal_definitions.name} color={s.seal_definitions.color} size={13} />
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right pr-10">
                <AssignSealModal memberId={p.id} memberName={p.full_name || p.email} onSuccess={fetchProfiles}>
                  <button className="p-2.5 text-gray-300 hover:text-[#5CA3FF] hover:bg-blue-50 rounded-xl transition-all"><ShieldPlus size={20} /></button>
                </AssignSealModal>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}