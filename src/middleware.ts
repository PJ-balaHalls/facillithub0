import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Inicializa o cliente na camada de middleware para ler/escrever cookies de sessão
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

  // Recupera o usuário logado de forma segura
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register')
  const isAdminRoute = path.startsWith('/admin')
  const isClientRoute = path.startsWith('/client')

  // 1. Usuário anônimo tentando acessar painéis internos -> Vai pro login
  if (!user && (isAdminRoute || isClientRoute)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Lógica de Roteamento Dinâmico por Domínio (Equipe vs Clientes)
  if (user) {
    const isTeamMember = user.email?.endsWith('@facillithub.com.br')

    // Se está logado e tentando ir pra tela de login, redireciona pro painel correto
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(isTeamMember ? '/admin' : '/client', request.url))
    }

    // Se é cliente tentando acessar o Admin, joga pro dashboard dele
    if (isAdminRoute && !isTeamMember) {
      return NextResponse.redirect(new URL('/client', request.url))
    }

    // Se é admin (sua equipe) tentando acessar painel de cliente (opcional, pode ser flexibilizado)
    if (isClientRoute && isTeamMember) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return supabaseResponse
}

// Executar o middleware apenas nas rotas que importam (evita sobrecarga em imagens, css, etc)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}