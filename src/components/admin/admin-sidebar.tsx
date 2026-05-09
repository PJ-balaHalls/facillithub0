"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Briefcase, Compass, Wrench, MessageCircle, 
  Megaphone, PieChart, ShieldAlert, Server,
  LifeBuoy, LogOut, ChevronDown, ChevronRight,
  Settings, UserCircle, Rocket
} from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dados estruturados: Ícones apenas no grupo pai para visual clean.
const navGroups = [
  {
    title: "Facillit", icon: Briefcase,
    items: [
      { title: "Carteira de Clientes", url: "/admin/clientes" },
      { title: "Faturamento", url: "/admin/faturamento" },
      { title: "Métricas", url: "/admin/metricas" },
      { title: "Usuários", url: "/admin/usuarios" },
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
      { title: "Leads", url: "/admin/vendas/leads" },
      { title: "CRM", url: "/admin/vendas/crm" },
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
      { title: "Analytics", url: "/admin/insights/analytics" },
      { title: "Catálogo", url: "/admin/insights/catalogo" },
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
      { title: "Status", url: "/admin/infra/status" },
      { title: "Motor Deploy", url: "/admin/infra/deploy" },
      { title: "Logs", url: "/admin/infra/logs" },
      { title: "Erros", url: "/admin/infra/erros" },
    ],
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-100 bg-white" {...props}>
      {/* HEADER: Limpo e sutil */}
      <SidebarHeader className="border-b border-gray-50 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white shadow-sm">
                <Rocket strokeWidth={1.5} className="size-4" /> 
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium tracking-wide">Facillit Hub</span>
                <span className="truncate text-[11px] font-light text-gray-400">Master Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT: Sistema de Accordion (Collapsible) */}
      <SidebarContent className="px-2 pt-4 scrollbar-thin scrollbar-thumb-gray-100">
        <SidebarMenu className="gap-1.5">
          {navGroups.map((group) => {
            // Verifica se alguma rota filha está ativa para deixar a sanfona aberta
            const isActiveGroup = group.items.some(item => pathname.startsWith(item.url))
            
            return (
              <Collapsible key={group.title} asChild defaultOpen={isActiveGroup} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={group.title}
                      className="font-normal text-[13px] text-gray-600 hover:text-black hover:bg-gray-50/80 data-[state=open]:text-black transition-all"
                    >
                      <group.icon strokeWidth={1.25} />
                      <span className="tracking-wide">{group.title}</span>
                      <ChevronRight strokeWidth={1} className="ml-auto size-4 text-gray-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-gray-100/60 ml-3.5 pl-2 mt-1 gap-1">
                      {group.items.map((item) => {
                        const isActive = pathname.startsWith(item.url)
                        return (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <Link 
                                href={item.url}
                                className={`text-[13px] transition-colors rounded-md py-1.5 px-2 ${
                                  isActive 
                                    ? "text-[#5CA3FF] font-medium bg-blue-50/40" 
                                    : "text-gray-500 font-light hover:text-black hover:bg-gray-50/50"
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
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER: Padrão Apple, Dropdown em Vidro */}
      <SidebarFooter className="border-t border-gray-50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-gray-50 hover:bg-gray-50/80 rounded-xl transition-all border border-transparent hover:border-gray-100"
                >
                  <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                    <AvatarFallback className="rounded-lg bg-gradient-to-tr from-[#5CA3FF] to-[#3b8af0] text-white font-light text-xs">
                      FH
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-[13px] leading-tight">
                    <span className="truncate font-medium">Equipe Hub</span>
                    <span className="truncate text-[11px] font-light text-gray-400">admin@facillithub</span>
                  </div>
                  <ChevronDown strokeWidth={1} className="ml-auto size-3 text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-1.5" 
                side="bottom" 
                align="end" 
                sideOffset={10}
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex items-center gap-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-gradient-to-tr from-[#5CA3FF] to-[#3b8af0] text-white font-light text-xs">FH</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-[13px] leading-tight">
                      <span className="truncate font-medium">Equipe Hub</span>
                      <span className="truncate text-[11px] font-light text-gray-400">admin@facillithub.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-gray-100/50 my-1" />
                
                <DropdownMenuItem className="font-light text-[13px] text-gray-600 cursor-pointer focus:bg-gray-50/80 focus:text-black rounded-lg py-2">
                  <UserCircle strokeWidth={1.25} className="mr-2 size-4" />
                  Minha Conta
                </DropdownMenuItem>
                <DropdownMenuItem className="font-light text-[13px] text-gray-600 cursor-pointer focus:bg-gray-50/80 focus:text-black rounded-lg py-2">
                  <Settings strokeWidth={1.25} className="mr-2 size-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem className="font-light text-[13px] text-gray-600 cursor-pointer focus:bg-gray-50/80 focus:text-black rounded-lg py-2">
                  <LifeBuoy strokeWidth={1.25} className="mr-2 size-4" />
                  Suporte Técnico
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-gray-100/50 my-1" />
                
                <DropdownMenuItem className="font-light text-[13px] text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-lg py-2 transition-colors">
                  <LogOut strokeWidth={1.25} className="mr-2 size-4" />
                  Sair da Plataforma
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