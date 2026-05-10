"use server";

import { revalidatePath } from "next/cache";

// Exemplo de action para salvar dados genéricos de um form de preview ou template
export async function saveLabFormData(formData: FormData, contextId: string) {
  try {
    // 1. Extrair e validar dados do FormData (idealmente com Zod)
    const data = Object.fromEntries(formData.entries());
    
    // 2. Simulação de processamento no banco
    console.log(`[Forms Action] Processando dados para ${contextId}:`, data);
    
    // await db.preview.update({ where: { id: contextId }, data: { ... } });

    // 3. Revalidar rotas impactadas
    revalidatePath("/admin/lab/previews");
    
    return {
      success: true,
      message: "Dados do formulário salvos com sucesso.",
    };
  } catch (error) {
    console.error("[Forms Action] Erro ao salvar dados:", error);
    return {
      success: false,
      message: "Falha ao salvar os dados do formulário.",
    };
  }
}