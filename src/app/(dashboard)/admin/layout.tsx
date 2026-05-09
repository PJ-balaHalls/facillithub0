import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      {/* SidebarInset é quem garante que o conteúdo seja "empurrado" suavemente */}
      <SidebarInset className="bg-[#FAFAFA] flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <AdminTopbar />
        
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}