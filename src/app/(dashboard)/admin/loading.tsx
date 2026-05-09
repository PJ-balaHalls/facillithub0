import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

// IMPORTAÇÃO OBRIGATÓRIA PARA A SIDEBAR NÃO QUEBRAR
import { TooltipProvider } from "@/components/ui/tooltip"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 1. O TooltipProvider DEVE envolver todo o SidebarProvider
    <TooltipProvider delayDuration={0}>
      
      {/* 2. Variáveis de CSS forçadas para a Sidebar empurrar o conteúdo certo */}
      <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "4.5rem" } as React.CSSProperties}>
        
        <AdminSidebar />
        
        {/* 3. min-w-0 trava o vazamento de tabelas/grids grandes */}
        <SidebarInset className="bg-[#FAFAFA] flex flex-col w-full min-w-0 min-h-screen overflow-x-hidden">
          <AdminTopbar />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
        
      </SidebarProvider>
      
    </TooltipProvider>
  )
}