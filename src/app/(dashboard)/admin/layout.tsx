import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} style={{ "--sidebar-width": "17rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-full min-h-screen bg-[#FAFAFA] transition-all duration-300">
        <AdminTopbar />
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </SidebarProvider>
  )
}