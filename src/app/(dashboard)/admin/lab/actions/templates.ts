"use server";

import { createClient } from "@/lib/server"; // Ajuste se o seu import do Supabase for diferente
import { revalidatePath } from "next/cache";

// 1. Função que já criámos para listar os templates
export async function getTemplates() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("lab_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao buscar templates:", error);
    return { success: false, data: [], error: error.message };
  }
}

// 2. NOVA FUNÇÃO: Para criar um template através do Modal Factory V2
export async function createTemplate(formData: Record<string, any>) {
  try {
    const supabase = await createClient();

    // Mapeamos os dados vindos do form para as colunas exatas da sua tabela lab_templates
    const insertData = {
      name: formData.name,
      niche: formData.niche,
      github_template_repo: formData.github_template_repo,
      preview_demo_url: formData.preview_demo_url || null,
      thumbnail_url: formData.thumbnail_url || null,
      description: formData.description || null,
      is_active: true, // Por padrão entra como ativo
    };

    const { error } = await supabase
      .from("lab_templates")
      .insert(insertData);

    if (error) throw error;

    // Atualiza a cache da página para o novo template aparecer no grid instantaneamente
    revalidatePath("/admin/lab/templates");

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar template:", error);
    return { success: false, error: error.message || "Falha ao gravar no banco de dados." };
  }
}