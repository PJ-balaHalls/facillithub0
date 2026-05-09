import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Topbar } from "@/components/admin/topbar"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Chamada Real ao Banco de Dados (Server-side)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Segurança extra: se não tiver usuário, chuta pro login
  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      {/* Passamos o utilizador real para a Sidebar (Footer) */}
      <AppSidebar user={user} />
      
      {/* SidebarInset é a área de conteúdo que encolhe/estica automaticamente */}
      <SidebarInset className="bg-[#FAFAFA] min-h-screen">
        {/* Passamos o utilizador real para a Topbar */}
        <Topbar user={user} />
        
        {/* Conteúdo da página (Overview, Clientes, etc) */}
        <main className="p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}