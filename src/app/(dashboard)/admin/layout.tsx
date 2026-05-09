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
      {/* SidebarInset puro. Ele herda a largura dinâmica e "empurra" o conteúdo. */}
      <SidebarInset className="bg-[#FAFAFA] flex flex-col min-h-screen">
        <AdminTopbar />
        
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}