import Link from "next/link";
import { LayoutDashboard, Users, Zap, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 font-bold text-lg">
          Facillit Hub OS
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 bg-gray-800 rounded-md text-sm">
            <LayoutDashboard size={18} /> Overview
          </Link>
          <Link href="/admin/clientes" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-md text-sm transition">
            <Users size={18} /> Clientes
          </Link>
          <Link href="/admin/automacoes" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-md text-sm transition">
            <Zap size={18} /> Automações (n8n)
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-gray-800 rounded-md text-sm transition">
            <Settings size={18} /> Configurações
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm">
          <h2 className="text-lg font-medium text-gray-800">Dashboard Interno</h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}