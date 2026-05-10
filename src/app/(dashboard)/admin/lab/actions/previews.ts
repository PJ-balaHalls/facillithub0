// src/app/(dashboard)/admin/lab/actions/previews.ts
"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function getPreviews() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lab_previews")
    .select(`*, lab_templates(name)`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, data: [], error: error.message };
  return { success: true, data };
}

// Cria o registo pendente no Banco e retorna os dados cruciais
export async function step1_createPreviewRecord(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: template, error: tplError } = await supabase
    .from("lab_templates")
    .select("github_template_repo, default_features")
    .eq("id", formData.templateId)
    .single();

  if (tplError || !template) throw new Error("Template base não encontrado.");

  const configToInject = {
    nomeEmpresa: formData.businessName,
    corPrimaria: formData.primaryColor,
    cardapio: formData.services || [],
  };

  const { data: inserted, error: insertError } = await supabase
    .from("lab_previews")
    .insert({
      template_id: formData.templateId,
      company_name: formData.businessName,
      slug: formData.slug,
      niche: formData.niche || 'outro',
      config_json: configToInject,
      features: template.default_features || {},
      status: 'pending',
      generated_by: user?.id
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  revalidatePath("/admin/lab/previews");

  return { 
    previewId: inserted.id, 
    templateRepo: template.github_template_repo, 
    configToInject, 
    features: template.default_features 
  };
}

// Atualiza o banco para Sucesso ou Falha no fim
export async function step4_finalizeDeploy(previewId: string, status: string, htmlUrl?: string, pagesUrl?: string, errorLog?: string) {
  const supabase = await createClient();
  await supabase
    .from("lab_previews")
    .update({
      status,
      github_repo: htmlUrl,
      preview_url: pagesUrl,
      error_log: errorLog
    })
    .eq("id", previewId);
    
  revalidatePath("/admin/lab/previews");
}