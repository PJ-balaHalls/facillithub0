import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Inicializa o cliente na camada de proxy para ler/escrever cookies de sessão
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Recupera o utilizador logado de forma segura
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register')
  const isAdminRoute = path.startsWith('/admin')
  const isClientRoute = path.startsWith('/client')

  // 1. Utilizador anónimo a tentar aceder a painéis internos -> Vai para o login
  if (!user && (isAdminRoute || isClientRoute)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Lógica de Roteamento Dinâmico por Domínio (Equipa vs Clientes)
  if (user) {
    const isTeamMember = user.email?.endsWith('@facillithub.com.br')

    // Se está logado e a tentar ir para a tela de login/registo, redireciona para o painel correto
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(isTeamMember ? '/admin' : '/client', request.url))
    }

    // Se é cliente a tentar aceder ao Admin, joga-o para o dashboard dele
    if (isAdminRoute && !isTeamMember) {
      return NextResponse.redirect(new URL('/client', request.url))
    }

    // Se é admin (sua equipa) a tentar aceder ao painel de cliente
    if (isClientRoute && isTeamMember) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return supabaseResponse
}

// Executar o proxy apenas nas rotas que importam (evita sobrecarga em imagens, css, etc)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}