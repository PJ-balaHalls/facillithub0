"use client"

import { Bell, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Topbar({ user }: { user: any }) {
  const userName = user?.user_metadata?.full_name || "Admin Facillit"
  const initials = userName.substring(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6">
      <div className="flex items-center gap-4 w-full">
        {/* Gatilho Nativo da Sidebar Shadcn */}
        <SidebarTrigger className="-ml-2 text-gray-500 hover:text-primary" />
        
        {/* Separador Visual */}
        <div className="h-4 w-[1px] bg-gray-200" />

        {/* Barra de Busca Real */}
        <div className="flex items-center bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100 w-full max-w-md focus-within:bg-white focus-within:border-brand-500 transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar leads no Finder, clientes ou automações..." 
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Informação do Utilizador à Direita */}
        <div className="ml-auto flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-[1px] bg-gray-100 mx-1" />
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-sm font-bold text-primary">{userName}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Master Admin</p>
            </div>
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-primary font-bold text-xs border border-gray-200">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}