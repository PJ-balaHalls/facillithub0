"use client"

import { BadgeCheck, MoreVertical, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Seal {
  id: string
  name: string
  description: string
  color: string
  is_automatic: boolean
  key: string
}

export function SealCard({ seal }: { seal: Seal }) {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${seal.color}15` }} // 15% opacidade
        >
          <BadgeCheck size={24} style={{ color: seal.color }} strokeWidth={1.5} />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <Edit2 size={14} /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <Trash2 size={14} /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          {seal.name}
          {seal.is_automatic && (
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium uppercase">
              Auto
            </span>
          )}
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
          {seal.description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
        <span>KEY: {seal.key}</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seal.color }} />
          {seal.color}
        </div>
      </div>
    </div>
  )
}