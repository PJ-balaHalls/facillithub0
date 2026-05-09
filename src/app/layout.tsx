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
      {/* Removemos classes forçadas. O SidebarInset nativo já cuida de empurrar o conteúdo perfeitamente */}
      <SidebarInset className="bg-[#FAFAFA]">
        <AdminTopbar />
        
        {/* Container principal sem overflow horizontal forçado */}
        <main className="p-4 md:p-6 lg:p-8 w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}