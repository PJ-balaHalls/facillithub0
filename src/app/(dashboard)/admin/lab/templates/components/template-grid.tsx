"use client";

import React from "react";
import { TemplateCard } from "./template-card";

// Mock de dados para os templates
export type TemplateBase = {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  category: string;
  status: "ready" | "syncing" | "error";
  lastUpdate: string;
};

const mockTemplates: TemplateBase[] = [
  {
    id: "delivery-v1",
    name: "Delivery Express",
    description: "Template otimizado para lanchonetes e pizzarias, com carrinho de compras nativo.",
    repoUrl: "facillithub/tpl-delivery-v1",
    category: "Food",
    status: "ready",
    lastUpdate: "Atualizado há 2 dias",
  },
  {
    id: "health-clinic",
    name: "Clínica Saúde Base",
    description: "Landing page para consultórios com integração de agendamento via WhatsApp.",
    repoUrl: "facillithub/tpl-health-clinic",
    category: "Saúde",
    status: "syncing",
    lastUpdate: "Sincronizando...",
  },
  {
    id: "barber-shop",
    name: "Barbearia Pro",
    description: "Sistema para barbearias com vitrine de cortes e controle de profissionais.",
    repoUrl: "facillithub/tpl-barber-shop",
    category: "Beleza",
    status: "ready",
    lastUpdate: "Atualizado há 1 mês",
  }
];

export function TemplateGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {mockTemplates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}