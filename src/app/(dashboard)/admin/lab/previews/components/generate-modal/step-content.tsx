"use client";

import React from "react";
import { GenerateFormData } from "./index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface StepProps {
  data: GenerateFormData;
  updateData: (fields: Partial<GenerateFormData>) => void;
}

export function StepContent({ data, updateData }: StepProps) {
  const addService = () => {
    const newService = { id: crypto.randomUUID(), name: "", price: "" };
    updateData({ services: [...data.services, newService] });
  };

  const updateService = (id: string, field: "name" | "price", value: string) => {
    const updated = data.services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    updateData({ services: updated });
  };

  const removeService = (id: string) => {
    updateData({ services: data.services.filter(s => s.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Conteúdo Inicial</h3>
          <p className="text-sm text-muted-foreground">Adicione os principais produtos ou serviços do cliente.</p>
        </div>
        <Button onClick={addService} size="sm" variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {data.services.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
            Nenhum serviço adicionado. Clique no botão acima para começar.
          </div>
        ) : (
          data.services.map((service) => (
            <div key={service.id} className="flex gap-2 items-end bg-card p-3 border rounded-md">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Nome do Item</Label>
                <Input 
                  placeholder="Ex: Corte Degrade" 
                  value={service.name}
                  onChange={(e) => updateService(service.id, "name", e.target.value)}
                />
              </div>
              <div className="w-32 space-y-1">
                <Label className="text-xs">Preço</Label>
                <Input 
                  placeholder="R$ 00,00" 
                  value={service.price}
                  onChange={(e) => updateService(service.id, "price", e.target.value)}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeService(service.id)}
                className="text-destructive hover:bg-destructive/10 mb-[2px]"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}