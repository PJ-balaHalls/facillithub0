'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export async function registerUser(formData: FormData) {
  const supabase = await createClient()
  
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    // Em produção, você retornaria o erro para o frontend exibir num Toast
    redirect('/register?message=Erro ao criar conta: ' + error.message)
  }

  // Redireciona para o login com mensagem de sucesso
  redirect('/login?message=Conta criada com sucesso! Faça login.')
}

export async function loginUser(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?message=Credenciais inválidas')
  }

  // O redirecionamento real com base no cargo será interceptado e gerido pelo Middleware!
  revalidatePath('/', 'layout')
  redirect('/admin') // Jogamos para admin, se ele for cliente o middleware chuta para /client
}