"use client";

import React from "react";
import { GenerateFormData } from "./index";
import { ColorPicker } from "../../../../_components/color-picker";
import { ImageUpload } from "../../../../_components/image-upload";
import { Label } from "@/components/ui/label";

interface StepProps {
  data: GenerateFormData;
  updateData: (fields: Partial<GenerateFormData>) => void;
}

export function StepBranding({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-medium">Branding e Visual</h3>
        <p className="text-sm text-muted-foreground">Personalize as cores e a marca para que o preview tenha a cara do cliente.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Logo do Cliente</Label>
          <ImageUpload 
            value={data.logoUrl} 
            onChange={(url) => updateData({ logoUrl: url })} 
          />
        </div>

        <div className="space-y-2">
          <Label>Cor Primária</Label>
          <ColorPicker 
            color={data.primaryColor} 
            onChange={(color) => updateData({ primaryColor: color })} 
          />
        </div>
      </div>
    </div>
  );
}