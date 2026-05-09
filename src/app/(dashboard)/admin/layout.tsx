import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Topbar } from "@/components/admin/topbar"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* SidebarInset adapta-se automaticamente à largura da Sidebar. Quando a Sidebar fecha (offcanvas), ele expande a 100% da largura */}
      <SidebarInset className="bg-[#FAFAFA] min-h-screen flex flex-col w-full transition-all duration-300 ease-in-out">
        
        {/* A Topbar continua a ser uma pílula centralizada que lhe enviei na última resposta */}
        <Topbar user={user} />
        
        <main className="flex-1 p-6 md:p-10 pt-8 mx-auto w-full max-w-7xl">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}