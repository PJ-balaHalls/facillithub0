// src/app/(dashboard)/admin/lab/actions/features.ts
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function toggleFeatureFlag(
  previewId:  string,
  featureKey: string,
  enabled:    boolean,
  config:     Record<string, unknown> = {}
) {
  const supabase = await createClient()
  await supabase.rpc('toggle_lab_feature', {
    p_preview_id: previewId,
    p_feature_key: featureKey,
    p_enabled: enabled,
    p_config: config,
  })
  revalidatePath('/admin/lab/previews')
  revalidatePath('/admin/lab/ativacao')
}

export async function bulkUpdateFeatures(
  previewId: string,
  features:  Record<string, boolean>
) {
  const supabase = await createClient()
  await supabase
    .from('lab_previews')
    .update({ features })
    .eq('id', previewId)
  revalidatePath('/admin/lab/previews')
}