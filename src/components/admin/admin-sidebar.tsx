"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/client"
import { TooltipProvider } from "@/components/ui/tooltip"

import {
  Briefcase, Compass, Wrench, MessageCircle, 
  Megaphone, PieChart, ShieldAlert, Server,
  LogOut, ChevronRight, Settings, 
  PanelLeftClose, BadgeCheck, CreditCard, Sparkles, Bell
} from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, 
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navGroups = [
  {
    title: "Facillit", icon: Briefcase,
    items: [
      { title: "Carteira de Clientes", url: "/admin/clientes" },
      { title: "Faturamento", url: "/admin/faturamento" },
      { title: "Métricas Globais", url: "/admin/metricas" },
      { title: "Usuários", url: "/admin/usuarios" },
    ],
  },
  {
    title: "Finder", icon: Compass,
    items: [
      { title: "Buscas", url: "/admin/finder" },
      { title: "Leads Scored", url: "/admin/finder/leads" },
      { title: "Análise de IA", url: "/admin/finder/analise" },
    ],
  },
  {
    title: "Lab (Fábrica)", icon: Wrench,
    items: [
      { title: "Templates", url: "/admin/lab/templates" },
      { title: "Previews", url: "/admin/lab/previews" },
      { title: "Ativação", url: "/admin/lab/ativacao" },
    ],
  },
  {
    title: "Vendas", icon: MessageCircle,
    items: [
      { title: "Garimpo", url: "/admin/vendas/garimpo" },
      { title: "Leads Scored", url: "/admin/vendas/leads" },
      { title: "Sales (CRM)", url: "/admin/vendas/crm" },
    ],
  },
  {
    title: "Conteúdo & Mkt", icon: Megaphone,
    items: [
      { title: "Blog / Revista", url: "/admin/conteudo/blog" },
      { title: "SEO Local", url: "/admin/conteudo/seo" },
      { title: "Afiliados", url: "/admin/conteudo/afiliados" },
    ],
  },
  {
    title: "Insights", icon: PieChart,
    items: [
      { title: "Conversão Sniper", url: "/admin/insights/conversao" },
      { title: "Score Global", url: "/admin/insights/score" },
      { title: "Analytics de Dores", url: "/admin/insights/analytics" },
      { title: "Catálogo Evolutivo", url: "/admin/insights/catalogo" },
    ],
  },
  {
    title: "Master Admin", icon: ShieldAlert,
    items: [
      { title: "Feature Flags", url: "/admin/master/flags" },
      { title: "Badges", url: "/admin/master/badges" },
      { title: "Selos", url: "/admin/master/selos" },
    ],
  },
  {
    title: "Infraestrutura", icon: Server,
    items: [
      { title: "Status de APIs", url: "/admin/infra/status" },
      { title: "Motor de Deploy", url: "/admin/infra/deploy" },
      { title: "Logs de Automação", url: "/admin/infra/logs" },
    ],
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state, toggleSidebar } = useSidebar()
  const isExpanded = state === "expanded"
  const supabase = createClient()
  
  const [user, setUser] = React.useState<{ full_name: string | null; email: string | null } | null>(null)

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser({ full_name: "Admin Hub", email: user.email || "" })
    })
  }, [supabase])

  return (
    <TooltipProvider delayDuration={0}>
      
      {/* CAMADA 1: VÉU DE DESFOQUE NO FUNDO (z-40 para ficar abaixo da Sidebar no mobile) */}
      <div 
        className={`fixed inset-0 z-40 bg-black/5 backdrop-blur-[3px] transition-all duration-500 ease-in-out md:hidden ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* CAMADA 2: A GAVETA DE VIDRO FLUTUANTE (z-50 para ficar na frente de tudo no mobile) */}
      <Sidebar 
        collapsible="none" 
        className={`fixed z-50 top-0 left-0 h-full w-[280px] rounded-none md:top-5 md:left-5 md:h-[calc(100vh-40px)] md:rounded-3xl bg-white/95 md:bg-white/70 backdrop-blur-3xl border-r md:border border-white/60 shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isExpanded ? "translate-x-0" : "-translate-x-[150%]"
        }`} 
        {...props}
      >
        
        <SidebarHeader className="border-b border-gray-200/40 py-5 px-6 flex flex-row items-center justify-between">
          <img src="/images/isologos/logoblack.svg" alt="Facillit Hub" className="h-5 w-auto" />
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-black transition-colors bg-white/50 hover:bg-white p-1.5 rounded-xl border border-transparent hover:border-gray-200/50 shadow-sm">
            <PanelLeftClose strokeWidth={1.5} className="size-4" />
          </button>
        </SidebarHeader>

        <SidebarContent className="px-4 pt-6 pb-24 scrollbar-hide">
          <SidebarMenu className="gap-1.5">
            {navGroups.map((group) => {
              const isActiveGroup = group.items.some(item => pathname.startsWith(item.url))
              return (
                <SidebarMenuItem key={group.title}>
                  <Collapsible defaultOpen={isActiveGroup} className="group/collapsible w-full">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className={`w-full font-normal text-[13px] transition-all duration-200 py-5 group rounded-xl
                          ${isActiveGroup ? "text-black" : "text-gray-600 hover:text-black hover:bg-white/60"}
                        `}
                      >
                        <group.icon strokeWidth={1.75} className={`size-[18px] ${isActiveGroup ? "text-[#5CA3FF]" : "text-gray-800 group-hover:text-black"}`} />
                        <span className="ml-2 tracking-wide font-medium">{group.title}</span>
                        <ChevronRight strokeWidth={1.5} className="ml-auto size-3.5 text-gray-400 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                      <SidebarMenuSub className="border-l border-gray-300/50 ml-4.5 pl-3 mt-1 mb-2 gap-0.5">
                        {group.items.map((item) => {
                          const isActive = pathname === item.url
                          return (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={item.url} onClick={() => { if(window.innerWidth < 768) toggleSidebar() }} className={`text-[13px] transition-all rounded-lg py-2 px-3 ${isActive ? "text-[#5CA3FF] font-medium bg-blue-50/50 shadow-sm border border-blue-100/50" : "text-gray-600 font-light hover:text-black hover:bg-white/60"}`}>
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* FOOTER FLUTUANTE INTERNO */}
        <SidebarFooter className="absolute bottom-0 w-full p-4 border-t border-gray-200/40 bg-white/40 backdrop-blur-md">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="rounded-2xl border border-transparent hover:bg-white/80 p-2 transition-all shadow-sm">
                    <Avatar className="h-9 w-9 rounded-xl shadow-sm border border-white/50">
                      <AvatarFallback className="rounded-xl bg-gradient-to-tr from-gray-900 to-gray-700 text-white font-medium text-[11px]">FH</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-[13px] leading-tight ml-2">
                      <span className="truncate font-medium text-gray-900">{user?.full_name || "Facillit Admin"}</span>
                      <span className="truncate text-[11px] font-light text-gray-600">{user?.email || "Operação Hub"}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-64 rounded-3xl bg-white/95 backdrop-blur-2xl border border-gray-200/60 shadow-[0_20px_40px_rgb(0,0,0,0.1)] p-2" side="right" align="end" sideOffset={16}>
                  <div className="px-2 py-2 mb-2 flex items-center gap-3 bg-gray-50/80 rounded-2xl border border-gray-100/50">
                     <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100/50">
                       <Sparkles strokeWidth={1.5} className="size-4 text-[#5CA3FF]" />
                     </div>
                     <div>
                       <p className="text-[13px] font-semibold text-gray-900">Acesso Master</p>
                       <p className="text-[10px] text-gray-500">Controle total da infra</p>
                     </div>
                  </div>

                  <DropdownMenuItem className="text-[13px] font-medium rounded-xl py-2.5 cursor-pointer text-gray-700 hover:text-black hover:bg-gray-50">
                    <BadgeCheck strokeWidth={1.5} className="size-4 mr-2 text-gray-400" /> Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[13px] font-medium rounded-xl py-2.5 cursor-pointer text-gray-700 hover:text-black hover:bg-gray-50">
                    <CreditCard strokeWidth={1.5} className="size-4 mr-2 text-gray-400" /> Faturamento Hub
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[13px] font-medium rounded-xl py-2.5 cursor-pointer text-gray-700 hover:text-black hover:bg-gray-50">
                    <Settings strokeWidth={1.5} className="size-4 mr-2 text-gray-400" /> Configurações Globais
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-gray-100 my-1" />
                  
                  <DropdownMenuItem className="text-[13px] font-medium rounded-xl py-2.5 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 transition-colors">
                    <LogOut strokeWidth={1.5} className="size-4 mr-2" /> Encerrar Sessão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

    </TooltipProvider>
  )
}