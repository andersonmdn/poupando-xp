import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware do Next.js para proteger rotas
 *
 * TUTORIAL: Este middleware executa ANTES de qualquer página ser carregada.
 * É ideal para:
 * - Verificar autenticação
 * - Redirects
 * - Modificar headers
 * - Logging
 *
 * Aqui implementamos proteção básica de rotas baseada em token no cookie.
 * Em produção, considere validar o token JWT aqui também.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que precisam de autenticação
  const protectedPaths = ['/dashboard', '/transactions'];
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  // Busca o token de autenticação
  // NOTA: Aqui usamos cookie, mas se você usar localStorage,
  // este middleware não funcionará (localStorage é client-side only)
  const token = request.cookies.get('auth-token')?.value;

  if (isProtectedPath && !token) {
    // Se não tem token e está tentando acessar rota protegida,
    // redireciona para login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tem token e está tentando acessar login/register,
  // redireciona para dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Configura em quais rotas o middleware deve executar
 * Evita executar em arquivos estáticos (_next, favicon, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
