"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  Users,
  Zap,
  Eye,
  Rocket,
  CreditCard,
  BarChart3,
  Settings2,
  LifeBuoy,
  Send,
  Plus,
  ShieldCheck,
  ChevronRight
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// 1. DADOS DE NAVEGAÇÃO MAPEADOS (Arquitetura Completa do Facillit Hub)
const navData = {
  main: [
    {
      title: "Visão Geral",
      url: "/admin",
      icon: LayoutDashboard,
      status: "active",
    },
    {
      title: "Meus Clientes",
      url: "/admin/clientes",
      icon: Users,
      status: "active",
    },
    {
      title: "Automações (n8n)",
      url: "/admin/automacoes",
      icon: Zap,
      status: "active",
    },
  ],
  growth: [
    {
      title: "Facillit FINDER",
      url: "/admin/finder",
      icon: Search,
      badge: "NOVO",
      badgeColor: "bg-brand-500 text-white",
      status: "active",
    },
    {
      title: "Modo Prévia",
      url: "/admin/previa",
      icon: Eye,
      badge: "EM BREVE",
      badgeColor: "bg-gray-100 text-gray-400 border border-gray-200",
      status: "soon",
    },
    {
      title: "Deploy Automático",
      url: "/admin/deploy",
      icon: Rocket,
      badge: "EM BREVE",
      badgeColor: "bg-gray-100 text-gray-400 border border-gray-200",
      status: "soon",
    },
  ],
  management: [
    {
      title: "Financeiro",
      url: "/admin/financeiro",
      icon: CreditCard,
      status: "soon",
    },
    {
      title: "Relatórios",
      url: "/admin/relatorios",
      icon: BarChart3,
      status: "soon",
    },
  ],
  system: [
    {
      title: "Configurações",
      url: "/admin/configuracoes",
      icon: Settings2,
      status: "active",
    },
    {
      title: "Central de Ajuda",
      url: "/admin/suporte",
      icon: LifeBuoy,
      status: "active",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Hook do Next.js para saber em qual página estamos e acender o botão correto
  const pathname = usePathname()

  return (
    <Sidebar 
      collapsible="offcanvas" 
      className="border-r border-gray-200 bg-white shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]" 
      {...props}
    >
      {/* ========================================== */}
      {/* HEADER: LOGO E IDENTIDADE VISUAL           */}
      {/* ========================================== */}
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-gray-100 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-gray-50 transition-colors">
              <Link href="/admin">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                  <Zap className="size-5 fill-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                  <span className="truncate font-black text-primary text-base tracking-tight">Facillit Hub</span>
                  <span className="truncate text-[11px] font-semibold text-gray-400 tracking-widest uppercase">OS v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ========================================== */}
      {/* CONTENT: TODOS OS GRUPOS E MENUS DA SIDEBAR*/}
      {/* ========================================== */}
      <SidebarContent className="px-2 py-4 gap-6 scrollbar-hide">
        
        {/* GRUPO 1: CORE / PRINCIPAL */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.main.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                      className={`h-10 rounded-lg transition-all ${isActive ? 'bg-brand-50 text-brand-500 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-primary font-medium'}`}
                    >
                      <Link href={item.url}>
                        <item.icon className={isActive ? 'text-brand-500' : 'text-gray-400'} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GRUPO 2: GROWTH TOOLS (Com botão de ação extra no label) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
            Motor de Crescimento
          </SidebarGroupLabel>
          <SidebarGroupAction title="Nova Prospecção" className="hover:bg-brand-50 hover:text-brand-500">
            <Plus className="size-4" /> <span className="sr-only">Nova Prospecção</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.growth.map((item) => {
                const isActive = pathname === item.url
                const isSoon = item.status === "soon"
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      disabled={isSoon}
                      className={`h-10 rounded-lg transition-all ${isActive ? 'bg-brand-50 text-brand-500 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-primary font-medium'} ${isSoon ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-500' : ''}`}
                    >
                      <Link href={isSoon ? "#" : item.url}>
                        <item.icon className={isActive ? 'text-brand-500' : 'text-gray-400'} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className={`text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GRUPO 3: GESTÃO DA AGÊNCIA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
            Gestão Interna
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.management.map((item) => {
                const isSoon = item.status === "soon"
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      disabled={isSoon}
                      className="h-10 rounded-lg text-gray-500 font-medium opacity-60 hover:bg-transparent cursor-not-allowed"
                    >
                      <Link href="#">
                        <item.icon className="text-gray-400" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gray-50 text-gray-300">
                      EM BREVE
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GRUPO 4: SISTEMA E SUPORTE */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navData.system.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                      className={`h-10 rounded-lg transition-all ${isActive ? 'bg-brand-50 text-brand-500 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-primary font-medium'}`}
                    >
                      <Link href={item.url}>
                        <item.icon className={isActive ? 'text-brand-500' : 'text-gray-400'} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* ========================================== */}
      {/* FOOTER: CARD DE ATALHO / SUPORTE PREMIUM   */}
      {/* ========================================== */}
      <SidebarFooter className="p-4 border-t border-gray-100">
        <div className="flex flex-col items-start rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm relative overflow-hidden group">
          {/* Ícone de fundo decorativo */}
          <ShieldCheck className="absolute -right-4 -bottom-4 size-16 text-gray-200/50 group-hover:scale-110 transition-transform duration-500" />
          
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 z-10">Suporte Dedicado</p>
          <p className="text-xs text-gray-600 font-medium mb-3 z-10 leading-relaxed">
            Precisa de ajuda com uma automação complexa?
          </p>
          
          <SidebarMenuButton asChild className="w-full bg-white border border-gray-200 shadow-sm text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all z-10 justify-center h-9">
            <Link href="mailto:suporte@facillithub.com.br">
              <Send className="size-3 mr-2" /> Falar com Equipe
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>

      {/* COMPONENTE NATIVO SHADCN PARA RECOLHER A SIDEBAR PELO TRILHO */}
      <SidebarRail />
    </Sidebar>
  )
}