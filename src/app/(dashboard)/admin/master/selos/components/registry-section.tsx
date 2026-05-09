"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Search, ShieldPlus, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SealBadge } from "@/components/ui/seal-badge"
import { AssignSealModal } from "./assign-seal-modal"

export function RegistrySection() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfiles = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select(`
        id, full_name, email, avatar_url,
        workspace_seals (id, seal_definitions (name, color, key))
      `)
      .or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      .order('full_name', { ascending: true })
    
    if (data) setProfiles(data)
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(fetchProfiles, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="flex flex-col h-[75vh]">
      <div className="p-10 border-b border-gray-50 bg-white/50 backdrop-blur-md flex items-center gap-6">
        <Search className="text-gray-300" size={28} />
        <Input 
          placeholder="Filtrar por nome ou e-mail..."
          className="h-16 border-none bg-transparent text-2xl font-bold placeholder:text-gray-200 focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-20">
            <TableRow className="border-none">
              <TableHead className="py-8 pl-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identidade</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Autoridade Digital</TableHead>
              <TableHead className="text-right pr-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Gestão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={3} className="py-20 text-center animate-pulse text-gray-300 font-bold uppercase text-xs tracking-widest">Sincronizando Registro...</TableCell></TableRow>
            ) : profiles.map((p) => (
              <TableRow key={p.id} className="group border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-300">
                <TableCell className="py-10 pl-12">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-2xl shadow-black/5 ring-1 ring-gray-100">
                      <AvatarImage src={p.avatar_url} />
                      <AvatarFallback className="bg-black text-white font-black text-lg">{p.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-gray-900 tracking-tighter leading-none mb-1">{p.full_name || "Membro Indefinido"}</span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">{p.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {p.workspace_seals?.map((s: any) => (
                      <SealBadge key={s.id} name={s.seal_definitions.name} color={s.seal_definitions.color} size={20} />
                    ))}
                    {p.workspace_seals?.length === 0 && <span className="text-[10px] text-gray-200 font-black uppercase tracking-widest">Sem Privilégios</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-12">
                  <AssignSealModal memberId={p.id} memberName={p.full_name} onSuccess={fetchProfiles}>
                    <Button variant="ghost" className="h-16 w-16 rounded-[24px] hover:bg-white hover:shadow-2xl transition-all group">
                      <ShieldPlus className="text-gray-200 group-hover:text-black transition-colors" size={28} />
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