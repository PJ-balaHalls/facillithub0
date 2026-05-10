"use client";

import React, { useState, useCallback } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Upload de Imagem" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock de upload local usando object URL para preview.
      // Em produção, aqui você chamaria a sua Action/API do Supabase, AWS S3, etc.
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(objectUrl); 
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      {!preview ? (
        <div 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 bg-muted/50 hover:bg-muted"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* Lógica de drop de arquivo aqui */ }}
        >
          <label htmlFor="image-upload-input" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Clique para enviar</span> ou arraste
              </p>
              <p className="text-xs text-muted-foreground">SVG, PNG, JPG ou GIF (MAX. 2MB)</p>
            </div>
            <input 
              id="image-upload-input" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <div className="relative w-full h-32 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="object-contain h-full w-full" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}