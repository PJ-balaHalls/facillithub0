"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

// 1. Função para buscar (Ler) a lista na tabela lab_previews
export async function getPreviews() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("lab_previews")
      .select(`
        *,
        lab_templates (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao buscar previews:", error);
    return { success: false, data: [], error: error.message };
  }
}

// 2. NOVA FUNÇÃO: Para inserir um novo Preview no banco real
export async function generatePreview(formData: any) {
  try {
    const supabase = await createClient();

    // Mapeamos os dados que vêm do seu modal GenerateModal para as colunas reais da sua tabela lab_previews
    const insertData = {
      template_id: formData.templateId || formData.template_id, 
      company_name: formData.companyName || formData.businessName || formData.company_name,
      slug: formData.slug,
      niche: formData.niche || 'outro', // Precisa de um niche por causa do seu schema
      config_json: formData.configJson || formData.config_json || {},
      features: formData.features || {},
      status: 'pending' // Status inicial padrão do schema
    };

    const { error } = await supabase
      .from("lab_previews")
      .insert(insertData);

    if (error) throw error;

    // Revalida a página para a tabela atualizar automaticamente com o novo preview inserido
    revalidatePath("/admin/lab/previews");

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao gerar preview:", error);
    return { success: false, error: error.message || "Falha ao gravar no banco de dados." };
  }
}