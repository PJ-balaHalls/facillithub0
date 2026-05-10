"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function getActivationStats() {
  const supabase = await createClient();
  
  const { data: pending } = await supabase.from("lab_previews").select("id").eq("status", "completed").is("activated_at", null);
  const { data: active } = await supabase.from("lab_previews").select("id").not("activated_at", "is", null);
  
  return {
    pending: pending?.length || 0,
    active: active?.length || 0,
    conversion: active && pending ? Math.round((active.length / (active.length + pending.length)) * 100) : 0
  };
}

export async function getPendingActivations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lab_previews")
    .select(`*, lab_templates(name)`)
    .is("activated_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function confirmActivation(previewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("lab_previews")
    .update({ 
      activated_at: new Date().toISOString(),
      activated_by: user?.id,
      modo_previa: false 
    })
    .eq("id", previewId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/lab/ativacao");
  return { success: true };
}