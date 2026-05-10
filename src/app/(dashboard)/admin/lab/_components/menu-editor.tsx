// src/app/(dashboard)/admin/lab/_components/menu-editor.tsx
"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, UtensilsCrossed } from "lucide-react"

export interface MenuItem {
  id:        string
  nome:      string
  descricao: string
  preco:     string
  categoria: string
}

interface MenuEditorProps {
  items:    MenuItem[]
  onChange: (items: MenuItem[]) => void
  label?:   string
}

const CATEGORIAS = ['Entrada', 'Principal', 'Sobremesa', 'Bebida', 'Executivo', 'Especial', 'Outro']

export function MenuEditor({ items, onChange, label = 'Cardápio / Serviços' }: MenuEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const addItem = () => {
    const newItem: MenuItem = {
      id:        crypto.randomUUID(),
      nome:      '',
      descricao: '',
      preco:     '',
      categoria: 'Principal',
    }
    onChange([...items, newItem])
    setExpandedId(newItem.id)
  }

  const updateItem = (id: string, field: keyof MenuItem, value: string) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="size-4 text-gray-400" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
          <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">
            {items.length} itens
          </span>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#5CA3FF] bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-full transition-all"
        >
          <Plus className="size-3.5" /> Adicionar item
        </button>
      </div>

      {items.length === 0 && (
        <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
          <UtensilsCrossed className="size-8 text-gray-200 mx-auto mb-2" />
          <p className="text-[12px] text-gray-400">Nenhum item ainda. Clique em "Adicionar item".</p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, index) => {
          const isOpen = expandedId === item.id
          return (
            <div
              key={item.id}
              className={`border rounded-2xl overflow-hidden transition-all ${
                isOpen ? 'border-[#5CA3FF]/30 bg-blue-50/20' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {/* Item Header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpandedId(isOpen ? null : item.id)}
              >
                <GripVertical className="size-4 text-gray-300 shrink-0" />
                <span className="text-[11px] font-bold text-gray-400 shrink-0 w-5">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold truncate ${item.nome ? 'text-gray-900' : 'text-gray-300'}`}>
                    {item.nome || 'Novo item...'}
                  </p>
                  {item.preco && (
                    <p className="text-[11px] text-gray-400 font-mono">R$ {item.preco}</p>
                  )}
                </div>
                {item.categoria && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full shrink-0">
                    {item.categoria}
                  </span>
                )}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeItem(item.id) }}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {/* Item Form */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100/50">
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome *</label>
                      <input
                        type="text"
                        value={item.nome}
                        onChange={e => updateItem(item.id, 'nome', e.target.value)}
                        placeholder="Ex: Carpaccio Imperial"
                        className="mt-1 w-full h-10 px-3 text-[13px] bg-white border border-gray-100 rounded-xl outline-none focus:border-[#5CA3FF] transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preço</label>
                      <div className="mt-1 flex items-center gap-1 h-10 px-3 bg-white border border-gray-100 rounded-xl focus-within:border-[#5CA3FF] transition-all">
                        <span className="text-[12px] text-gray-400 font-bold">R$</span>
                        <input
                          type="text"
                          value={item.preco}
                          onChange={e => updateItem(item.id, 'preco', e.target.value)}
                          placeholder="0,00"
                          className="flex-1 text-[13px] bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categoria</label>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {CATEGORIAS.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => updateItem(item.id, 'categoria', cat)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                            item.categoria === cat
                              ? 'bg-[#5CA3FF] text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Descrição</label>
                    <textarea
                      value={item.descricao}
                      onChange={e => updateItem(item.id, 'descricao', e.target.value)}
                      placeholder="Descrição do prato ou serviço..."
                      rows={2}
                      className="mt-1 w-full px-3 py-2 text-[13px] bg-white border border-gray-100 rounded-xl outline-none focus:border-[#5CA3FF] transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}