import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Faz o match de todas as rotas, EXCETO:
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de imagem otimizados)
     * - favicon.ico, site.webmanifest (ícones do app)
     * - Arquivos com extensões (imagens, svgs, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}