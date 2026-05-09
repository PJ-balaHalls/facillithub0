'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function handleSealAction(
  memberId: string, 
  sealId: string, 
  action: 'assign' | 'revoke'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autorizado')

  if (action === 'assign') {
    const { error: sealError } = await supabase
      .from('workspace_seals')
      .upsert({ 
        workspace_id: memberId, 
        seal_id: sealId,
        granted_by: user.id 
      })
    
    if (sealError) throw sealError

    // Log de Auditoria
    await supabase.from('master_audit_log').insert({
      admin_id: user.id,
      action_type: 'ASSIGN_SEAL',
      target_id: memberId,
      details: { seal_id: sealId }
    })

  } else {
    const { error: revokeError } = await supabase
      .from('workspace_seals')
      .delete()
      .match({ workspace_id: memberId, seal_id: sealId })

    if (revokeError) throw revokeError

    await supabase.from('master_audit_log').insert({
      admin_id: user.id,
      action_type: 'REVOKE_SEAL',
      target_id: memberId,
      details: { seal_id: sealId }
    })
  }

  revalidatePath('/admin/master/selos')
}