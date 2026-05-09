"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/client"
import {
  Briefcase, Compass, Wrench, MessageCircle, 
  Megaphone, PieChart, ShieldAlert, Server,
  LifeBuoy, LogOut, ChevronDown, ChevronRight,
  Settings, UserCircle, Rocket, Sparkles
} from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Estrutura de Navegação (Configuração)
const navGroups = [
  {
    title: "Facillit", icon: Briefcase,
    items: [
      { title: "Carteira de Clientes", url: "/admin/clientes" },
      { title: "Faturamento", url: "/admin/faturamento" },
      { title: "Métricas", url: "/admin/metricas" },
    ],
  },
  {
    title: "Finder", icon: Compass,
    items: [
      { title: "Buscas (Apify)", url: "/admin/finder/buscas" },
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
      { title: "CRM", url: "/admin/vendas/crm" },
    ],
  },
  {
    title: "Insights", icon: PieChart,
    items: [
      { title: "Conversão Sniper", url: "/admin/insights/conversao" },
      { title: "Analytics", url: "/admin/insights/analytics" },
    ],
  },
  {
    title: "Infraestrutura", icon: Server,
    items: [
      { title: "Status", url: "/admin/infra/status" },
      { title: "Logs", url: "/admin/infra/logs" },
    ],
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()
 const supabase = createClient()
  
  // Estado para dados reais do usuário
  const [user, setUser] = React.useState<{
    full_name: string | null
    email: string | null
    avatar_url?: string | null
  } | null>(null)

  React.useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', authUser.id)
          .single()
        
        setUser({
          full_name: profile?.full_name || "Membro Hub",
          email: authUser.email || "",
        })
      }
    }
    getUserProfile()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const isExpanded = state === "expanded"

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-100 bg-white" {...props}>
      {/* HEADER */}
      <SidebarHeader className="border-b border-gray-50/50 py-5 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent transition-all duration-300">
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-black text-white shadow-lg shadow-black/10">
                <Rocket strokeWidth={1.5} className="size-5" /> 
              </div>
              {isExpanded && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="truncate font-medium tracking-tight text-gray-900">Facillit Hub</span>
                  <span className="truncate text-[11px] font-light text-gray-400 uppercase tracking-widest">Admin Engine</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-3 pt-6 scrollbar-hide">
        <SidebarMenu className="gap-2">
          {navGroups.map((group) => {
            const isActiveGroup = group.items.some(item => pathname.startsWith(item.url))
            
            return (
              <SidebarMenuItem key={group.title}>
                <Collapsible defaultOpen={isActiveGroup} className="group/collapsible w-full">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={group.title}
                      className={`w-full font-normal text-[13px] transition-all duration-200 py-5
                        ${isActiveGroup ? "text-black" : "text-gray-500 hover:text-black hover:bg-gray-50/50"}
                      `}
                    >
                      <group.icon strokeWidth={1.2} className={isActiveGroup ? "text-[#5CA3FF]" : ""} />
                      {isExpanded && (
                        <>
                          <span className="ml-2 tracking-wide font-light">{group.title}</span>
                          <ChevronRight strokeWidth={1} className="ml-auto size-3.5 text-gray-300 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {isExpanded && (
                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                      <SidebarMenuSub className="border-l border-gray-100/80 ml-4.5 pl-3 mt-1 gap-1">
                        {group.items.map((item) => {
                          const isActive = pathname === item.url
                          return (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild>
                                <Link 
                                  href={item.url}
                                  className={`text-[13px] transition-all rounded-lg py-2 px-3 ${
                                    isActive 
                                      ? "text-[#5CA3FF] font-medium bg-blue-50/30" 
                                      : "text-gray-400 font-light hover:text-black hover:bg-gray-50/50"
                                  }`}
                                >
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER - APPLE STYLE PROFILE */}
      <SidebarFooter className="p-4 border-t border-gray-50/50 bg-gray-50/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`relative overflow-hidden transition-all duration-300 rounded-2xl border border-transparent
                    ${isExpanded ? "p-2 bg-white shadow-sm border-gray-100 hover:border-gray-200" : "p-0"}
                  `}
                >
                  <Avatar className="h-9 w-9 rounded-xl shadow-inner">
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-[#5CA3FF] to-[#3b8af0] text-white font-medium text-xs">
                      {user?.full_name?.substring(0, 2).toUpperCase() || "..."}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isExpanded && (
                    <div className="grid flex-1 text-left text-[13px] leading-tight ml-3">
                      <span className="truncate font-medium text-gray-900">{user?.full_name || "Carregando..."}</span>
                      <span className="truncate text-[11px] font-light text-gray-400">{user?.email}</span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className="w-64 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl p-2 mb-4" 
                side={isExpanded ? "bottom" : "right"}
                align={isExpanded ? "end" : "end"}
                sideOffset={12}
              >
                <DropdownMenuLabel className="px-2 py-3 font-normal">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#5CA3FF]/10 flex items-center justify-center">
                      <Sparkles className="size-5 text-[#5CA3FF]" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[13px] font-medium leading-none">Facillit Master</p>
                      <p className="text-[11px] text-gray-400 mt-1">Acesso Full Hub</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-gray-100/50" />
                
                <DropdownMenuItem className="flex items-center gap-2 font-light text-[13px] py-2.5 rounded-xl cursor-pointer focus:bg-gray-50">
                  <UserCircle strokeWidth={1.2} className="size-4" />
                  Perfil do Administrador
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center gap-2 font-light text-[13px] py-2.5 rounded-xl cursor-pointer focus:bg-gray-50">
                  <Settings strokeWidth={1.2} className="size-4" />
                  Configurações do Sistema
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100/50" />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-light text-[13px] py-2.5 rounded-xl cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors"
                >
                  <LogOut strokeWidth={1.2} className="size-4" />
                  Encerrar Sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}