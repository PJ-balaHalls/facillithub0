"use client"

import { Bell, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function Topbar({ user }: { user: any }) {
  const userName = user?.user_metadata?.full_name || "Admin Facillit"
  const initials = userName.substring(0, 2).toUpperCase()

  return (
    // Header transparente que centraliza a pílula e a descola do teto (top-4)
    <header className="sticky top-4 z-40 flex w-full justify-center px-4">
      
      {/* A Pílula Flutuante: max-w-3xl limita o tamanho, rounded-full deixa os cantos totalmente redondos */}
      <div className="flex h-14 w-full max-w-3xl items-center gap-4 rounded-full border border-gray-200 bg-white/80 px-4 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all">
        
        {/* Lado Esquerdo: Trigger da Sidebar */}
        <div className="flex items-center gap-2 pl-1">
          <SidebarTrigger className="text-gray-500 hover:text-primary transition-colors" />
          <Separator orientation="vertical" className="mr-1 h-5 bg-gray-200" />
        </div>

        {/* Centro: Busca Minimalista (Expande dentro da pílula) */}
        <div className="flex flex-1 items-center group">
          <Search className="w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar no Hub..." 
            className="ml-3 w-full bg-transparent text-sm outline-none text-gray-600 placeholder:text-gray-400"
          />
        </div>

        {/* Lado Direito: Notificações e Perfil */}
        <div className="flex items-center gap-3 pr-1 shrink-0">
          <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-brand-500 border-2 border-white" />
          </button>

          <Separator orientation="vertical" className="h-5 bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-xs font-bold text-gray-900">{userName}</span>
            </div>
            {/* Avatar circular para combinar com a pílula */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-[11px] font-bold text-primary">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}