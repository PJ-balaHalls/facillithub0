"use client"

import * as React from "react"
import {
  LayoutDashboard, Search, Users, Zap, Eye, 
  Rocket, CreditCard, BarChart, Settings, HelpCircle, LogOut, ChevronUp
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Menus baseados na sua documentação (Facillit FINDER, Modo Prévia, Deploy)
const data = {
  core: [
    { title: "Overview", url: "/admin", icon: LayoutDashboard },
    { title: "Clientes", url: "/admin/clientes", icon: Users },
    { title: "Automações (n8n)", url: "/admin/automacoes", icon: Zap },
  ],
  growth: [
    { title: "Facillit FINDER", url: "/admin/finder", icon: Search, badge: "Novo" },
    { title: "Modo Prévia", url: "/admin/previa", icon: Eye, badge: "Em breve" },
    { title: "Deploy Automático", url: "/admin/deploy", icon: Rocket, badge: "Em breve" },
  ],
  management: [
    { title: "Finanças", url: "#", icon: CreditCard, badge: "Em breve" },
    { title: "Relatórios", url: "#", icon: BarChart, badge: "Em breve" },
  ]
}

export function AppSidebar({ user }: { user: any }) {
  // Extraímos os dados reais do banco de dados
  const userName = user?.user_metadata?.full_name || "Admin Facillit"
  const userEmail = user?.email || "admin@facillithub.com.br"
  const initials = userName.substring(0, 2).toUpperCase()

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-100">
      
      {/* HEADER: Marca e Identidade */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-primary">Facillit Hub</span>
                <span className="text-xs text-muted-foreground">OS de Infraestrutura</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT: Grupos de Navegação */}
      <SidebarContent>
        {/* GRUPO 1: Core */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.core.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GRUPO 2: Crescimento e Ferramentas (Extraído do seu PDF) */}
        <SidebarGroup>
          <SidebarGroupLabel>Motor de Crescimento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.growth.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className={item.badge === "Em breve" ? "opacity-70 cursor-not-allowed" : ""}>
                    <Link href={item.badge === "Em breve" ? "#" : item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className={item.badge === "Novo" ? "bg-brand-500 text-white" : "text-[10px] uppercase"}>
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GRUPO 3: Gestão Futura */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestão da Agência</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.management.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="opacity-70 cursor-not-allowed">
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="text-[10px] uppercase">{item.badge}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER: Perfil de Utilizador Real e Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-primary font-bold text-xs">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 size-4" /> Suporte
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login" className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 size-4" /> Terminar Sessão
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Trilho lateral para mobile/colapso funcionar suavemente */}
      <SidebarRail />
    </Sidebar>
  )
}