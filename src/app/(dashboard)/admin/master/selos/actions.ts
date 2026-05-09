'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function manageSeal(memberId: string, sealId: string, type: 'assign' | 'revoke') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  if (type === 'assign') {
    const { error } = await supabase.from('workspace_seals').upsert({ 
      workspace_id: memberId, 
      seal_id: sealId, 
      granted_by: user.id 
    })
    if (error) throw error
  } else {
    const { error } = await supabase.from('workspace_seals').delete().match({ 
      workspace_id: memberId, 
      seal_id: sealId 
    })
    if (error) throw error
  }

  // Log de Auditoria
  await supabase.from('master_audit_log').insert({
    admin_id: user.id,
    action_type: type === 'assign' ? 'ASSIGN' : 'REVOKE',
    target_id: memberId,
    details: { seal_id: sealId }
  })

  revalidatePath('/admin/master/selos')
}