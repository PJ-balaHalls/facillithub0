import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Search } from "lucide-react"

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b border-gray-100 bg-white/70 backdrop-blur-xl px-4 sm:px-6 transition-all">
      <SidebarTrigger className="-ml-2 text-gray-400 hover:text-black transition-colors" />
      
      <div className="h-4 w-px bg-gray-200/60" />
      
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-[13px] font-normal text-gray-600 tracking-wide">Visão Geral</h1>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative text-gray-400 focus-within:text-[#5CA3FF] transition-colors">
            <Search strokeWidth={1.25} className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
            <input 
              type="text" 
              placeholder="Buscar lead, cliente ou template..." 
              className="h-8 w-64 rounded-full border border-gray-200/60 bg-gray-50/50 pl-9 pr-3 text-[13px] font-light text-gray-900 outline-none transition-all focus:border-[#5CA3FF]/50 focus:bg-white focus:ring-2 focus:ring-[#5CA3FF]/10 placeholder:text-gray-400"
            />
          </div>
          
          <button className="relative text-gray-400 hover:text-gray-900 transition-colors">
            <Bell strokeWidth={1.25} className="size-[18px]" />
            <span className="absolute top-0 right-0.5 size-1.5 rounded-full bg-[#5CA3FF] ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  )
}