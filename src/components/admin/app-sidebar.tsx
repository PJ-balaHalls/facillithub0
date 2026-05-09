"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BadgeCheck,
  Bot,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Eye,
  FileText,
  Gauge,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  PanelLeft,
  Rocket,
  Search,
  Settings2,
  Sparkles,
  Users,
  Workflow,
  Zap,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type MenuItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  soon?: boolean
  description?: string
}

const menuData: {
  overview: MenuItem[]
  acquisition: MenuItem[]
  delivery: MenuItem[]
  management: MenuItem[]
} = {
  overview: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      description: "Resumo operacional",
    },
    {
      title: "Clientes",
      url: "/admin/clientes",
      icon: Users,
      description: "Base ativa e prospects",
    },
  ],
  acquisition: [
    {
      title: "Facillit FINDER",
      url: "/admin/finder",
      icon: Search,
      badge: "Novo",
      description: "Garimpo de oportunidades",
    },
    {
      title: "Automações",
      url: "/admin/automacoes",
      icon: Workflow,
      description: "Fluxos e gatilhos n8n",
    },
    {
      title: "Modo Prévia",
      url: "/admin/previa",
      icon: Eye,
      soon: true,
      description: "Pitch visual provocativo",
    },
  ],
  delivery: [
    {
      title: "Deploy Automático",
      url: "/admin/deploy",
      icon: Rocket,
      soon: true,
      description: "Publicação em escala",
    },
    {
      title: "Templates",
      url: "/admin/templates",
      icon: FileText,
      soon: true,
      description: "Prateleira de modelos",
    },
    {
      title: "Lab",
      url: "/admin/lab",
      icon: Sparkles,
      soon: true,
      description: "Configuração de tokens",
    },
  ],
  management: [
    {
      title: "Financeiro",
      url: "/admin/financeiro",
      icon: CreditCard,
      soon: true,
      description: "MRR, setup e recorrência",
    },
    {
      title: "Relatórios",
      url: "/admin/relatorios",
      icon: BarChart3,
      soon: true,
      description: "Saúde e performance",
    },
    {
      title: "Configurações",
      url: "/admin/settings",
      icon: Settings2,
      description: "Ajustes do workspace",
    },
  ],
}

function isActivePath(pathname: string, url: string) {
  if (url === "/admin") return pathname === "/admin"
  return pathname === url || pathname.startsWith(`${url}/`)
}

function MenuSection({
  label,
  description,
  items,
  pathname,
}: {
  label: string
  description: string
  items: MenuItem[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-3 pb-2 text-[11px] leading-4 text-muted-foreground/70">
          {description}
        </div>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active = isActivePath(pathname, item.url)
            const disabled = Boolean(item.soon)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={!disabled}
                  isActive={active}
                  disabled={disabled}
                  tooltip={item.title}
                  className={
                    "group relative h-auto rounded-xl px-3 py-2.5 transition-all " +
                    (disabled ? "opacity-60" : "hover:bg-accent/60")
                  }
                >
                  {disabled ? (
                    <div className="flex w-full items-start gap-3">
                      <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground transition-colors group-hover:bg-background">
                        <item.icon className="size-4" />
                      </span>
                      <span className="grid flex-1 text-left leading-tight">
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                          {item.title}
                          {item.badge ? (
                            <SidebarMenuBadge className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {item.badge}
                            </SidebarMenuBadge>
                          ) : null}
                          <SidebarMenuBadge className="rounded-full border border-dashed border-border/70 bg-transparent px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            SOON
                          </SidebarMenuBadge>
                        </span>
                        {item.description ? (
                          <span className="mt-1 text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  ) : (
                    <Link href={item.url} className="flex w-full items-start gap-3">
                      <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground transition-colors group-hover:bg-background group-data-[active=true]:border-primary/20 group-data-[active=true]:bg-primary/10 group-data-[active=true]:text-primary">
                        <item.icon className="size-4" />
                      </span>
                      <span className="grid flex-1 text-left leading-tight">
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                          {item.title}
                          {item.badge ? (
                            <SidebarMenuBadge className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {item.badge}
                            </SidebarMenuBadge>
                          ) : null}
                        </span>
                        {item.description ? (
                          <span className="mt-1 text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60 bg-background" {...props}>
      <SidebarHeader className="border-b border-border/60 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-auto rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/30 px-3 py-3 shadow-sm"
            >
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                  <Zap className="size-5 fill-current" />
                </div>
                <div className="grid flex-1 gap-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                    Facillit Hub
                  </span>
                  <span className="truncate text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground/70">
                    Agency OS
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/60" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-3 rounded-2xl border border-border/60 bg-muted/30 p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
            <PanelLeft className="size-3.5" />
            Workspace
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Estágio Inicial</p>
              <p className="text-xs text-muted-foreground">Facillit Hub • versão operacional</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Ativo
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <MenuSection
          label="Visão geral"
          description="Acesso rápido ao núcleo do painel."
          items={menuData.overview}
          pathname={pathname}
        />

        <MenuSection
          label="Aquisição"
          description="Captura, qualificação e contato."
          items={menuData.acquisition}
          pathname={pathname}
        />

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
            Operação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 pb-2 text-[11px] leading-4 text-muted-foreground/70">
              Fluxo de produção, publicação e escala.
            </div>

            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Automações"
                      className="h-auto rounded-xl px-3 py-2.5 hover:bg-accent/60"
                    >
                      <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground">
                        <Bot className="size-4" />
                      </span>
                      <span className="grid flex-1 text-left leading-tight">
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                          Automações
                          <SidebarMenuBadge className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            n8n
                          </SidebarMenuBadge>
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground">
                          Fluxos, gatilhos e integrações.
                        </span>
                      </span>
                      <ChevronDown className="ml-auto size-4 text-muted-foreground/60 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mt-1 border-l border-border/60 pl-2">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/admin/automacoes"}>
                          <Link href="/admin/automacoes">Ver fluxos</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/admin/automacoes/config"}>
                          <Link href="/admin/automacoes/config">Configurações</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </SidebarMenu>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>

        <MenuSection
          label="Entrega"
          description="Templates, preview e deploys." 
          items={menuData.delivery}
          pathname={pathname}
        />

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
            Gestão
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 pb-2 text-[11px] leading-4 text-muted-foreground/70">
              Controle financeiro e acompanhamento executivo.
            </div>
            <SidebarMenu className="gap-1">
              {menuData.management.map((item) => {
                const active = isActivePath(pathname, item.url)
                const disabled = Boolean(item.soon)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!disabled}
                      isActive={active}
                      disabled={disabled}
                      tooltip={item.title}
                      className={
                        "group h-auto rounded-xl px-3 py-2.5 transition-all " +
                        (disabled ? "opacity-60" : "hover:bg-accent/60")
                      }
                    >
                      {disabled ? (
                        <div className="flex w-full items-start gap-3">
                          <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground">
                            <item.icon className="size-4" />
                          </span>
                          <span className="grid flex-1 text-left leading-tight">
                            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                              {item.title}
                              <SidebarMenuBadge className="rounded-full border border-dashed border-border/70 bg-transparent px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                SOON
                              </SidebarMenuBadge>
                            </span>
                            {item.description ? (
                              <span className="mt-1 text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            ) : null}
                          </span>
                        </div>
                      ) : (
                        <Link href={item.url} className="flex w-full items-start gap-3">
                          <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground transition-colors group-hover:bg-background group-data-[active=true]:border-primary/20 group-data-[active=true]:bg-primary/10 group-data-[active=true]:text-primary">
                            <item.icon className="size-4" />
                          </span>
                          <span className="grid flex-1 text-left leading-tight">
                            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                              {item.title}
                            </span>
                            {item.description ? (
                              <span className="mt-1 text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-3">
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BadgeCheck className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Modo Operação</p>
              <p className="text-xs text-muted-foreground">
                Organização, escala e previsibilidade.
              </p>
            </div>
            <SidebarMenuBadge className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Pro
            </SidebarMenuBadge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <SidebarMenuButton asChild tooltip="Suporte" className="h-9 rounded-xl px-3">
              <Link href="#">
                <LifeBuoy className="size-4" />
                <span>Suporte</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild tooltip="Operação" className="h-9 rounded-xl px-3">
              <Link href="/admin/settings">
                <Gauge className="size-4" />
                <span>Ajustes</span>
              </Link>
            </SidebarMenuButton>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
