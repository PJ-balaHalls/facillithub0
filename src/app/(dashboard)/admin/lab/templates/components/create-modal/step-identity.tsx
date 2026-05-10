"use client";

import React from "react";
import { CreateTemplateData } from "./index";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepProps {
  data: CreateTemplateData;
  updateData: (fields: Partial<CreateTemplateData>) => void;
}

export function StepIdentity({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-medium">Informações do Template</h3>
        <p className="text-sm text-muted-foreground">Como este template será identificado no sistema.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Template</Label>
          <Input 
            id="name" 
            placeholder="Ex: Delivery Express V2" 
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input 
            id="category" 
            placeholder="Ex: Food, Saúde, E-commerce..." 
            value={data.category}
            onChange={(e) => updateData({ category: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            placeholder="Descreva as principais features e o propósito deste template..." 
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="resize-none h-24"
          />
        </div>
      </div>
    </div>
  );
}