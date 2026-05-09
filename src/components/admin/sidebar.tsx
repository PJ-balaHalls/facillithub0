"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Search, Zap, 
  Eye, Settings, HelpCircle, ChevronLeft, Menu 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin", status: "active" },
  { name: "Facillit FINDER", icon: Search, href: "/admin/finder", status: "soon" },
  { name: "Clientes", icon: Users, href: "/admin/clientes", status: "soon" },
  { name: "Automações", icon: Zap, href: "/admin/automacoes", status: "soon" },
  { name: "Modo Prévia", icon: Eye, href: "/admin/previa", status: "soon" },
];

const secondaryItems = [
  { name: "Configurações", icon: Settings, href: "/admin/settings" },
  { name: "Suporte", icon: HelpCircle, href: "/admin/support" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Botão Collapse */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-gray-100 rounded-full p-1 shadow-sm hover:bg-gray-50 transition-colors z-50"
      >
        <ChevronLeft className={cn("w-4 h-4 text-gray-400 transition-transform", isCollapsed && "rotate-180")} />
      </button>

      {/* Logo */}
      <div className={cn("h-20 flex items-center px-6 mb-4", isCollapsed ? "justify-center" : "justify-start")}>
        <div className="w-8 h-8 bg-primary rounded-lg flex-shrink-0" />
        {!isCollapsed && <span className="ml-3 font-bold tracking-tight text-primary text-lg">Facillit Hub</span>}
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.status === "soon" ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-gray-50 text-primary" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary",
                item.status === "soon" && "cursor-not-allowed opacity-70"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-brand-500" : "text-gray-400 group-hover:text-primary")} />
              {!isCollapsed && (
                <div className="flex justify-between items-center w-full">
                  <span>{item.name}</span>
                  {item.status === "soon" && (
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Soon</span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Menu */}
      <div className="px-3 pb-6 space-y-1 border-t border-gray-50 pt-6">
        {secondaryItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-primary transition-all"
          >
            <item.icon className="w-5 h-5 text-gray-400" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}