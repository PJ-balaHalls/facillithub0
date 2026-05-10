"use client";

import React from "react";
import { GenerateFormData } from "./index";

interface StepProps {
  data: GenerateFormData;
  updateData: (fields: Partial<GenerateFormData>) => void;
}

export function StepIdentity({ data, updateData }: StepProps) {
  // Gera um slug amigável automaticamente a partir do nome
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const slug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
      
    updateData({ businessName: val, slug });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h3 className="text-xl font-extrabold text-[#0f172a]">Identidade do Negócio</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Defina o nome do cliente e a URL de acesso ao preview.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="businessName" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Nome do Negócio / Cliente
          </label>
          <input 
            id="businessName" 
            type="text"
            placeholder="Ex: Pizzaria Bella Napoli" 
            value={data?.businessName || ""}
            onChange={handleNameChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#5CA3FF] outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Subdomínio do Preview
          </label>
          <div className="flex rounded-xl shadow-sm overflow-hidden border border-gray-200 focus-within:border-[#5CA3FF] transition-all">
            <span className="inline-flex items-center px-4 bg-gray-100 text-sm font-bold text-gray-400 border-r border-gray-200">
              https://
            </span>
            <input 
              id="slug" 
              type="text"
              className="flex-1 px-4 py-3 bg-white outline-none font-mono text-sm" 
              placeholder="pizzaria-bella-napoli" 
              value={data?.slug || ""}
              onChange={(e) => updateData({ slug: e.target.value })}
            />
            <span className="inline-flex items-center px-4 bg-gray-100 text-sm font-bold text-gray-400 border-l border-gray-200">
              .preview.facillithub.com
            </span>
          </div>
          <p className="text-[11px] font-medium text-gray-400 mt-2">
            Esta URL será gerada automaticamente e servirá como ambiente de acesso para validação do cliente.
          </p>
        </div>
      </div>
    </div>
  );
}