"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksEditorProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export function SocialLinksEditor({ links, onChange }: SocialLinksEditorProps) {
  const handleAdd = () => {
    onChange([...links, { platform: "", url: "" }]);
  };

  const handleUpdate = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    onChange(newLinks);
  };

  const handleRemove = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Redes Sociais</h3>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center">
          Nenhuma rede social adicionada.
        </p>
      ) : (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Ex: Instagram"
                value={link.platform}
                onChange={(e) => handleUpdate(index, "platform", e.target.value)}
                className="w-1/3"
              />
              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => handleUpdate(index, "url", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}