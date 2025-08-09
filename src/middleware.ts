import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  // Пути, которые не нужно трогать (статические файлы, api и т.п.)
  const ignoredPaths = ['/api', '/_next', '/favicon.ico', '/locales'];

  if (ignoredPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Если пользователь заходит на главную
  if (pathname === '/') {
    if (token && token.trim() !== '') {
      // Если залогинен — редирект на /main
      return NextResponse.redirect(new URL('/main', req.url));
    }
    // Если не залогинен — остаёмся на /
    return NextResponse.next();
  }

  // Если пользователь заходит на /main
  if (pathname === '/main') {
    if (!token || token.trim() === '') {
      // Если нет токена — редирект на главную
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Для всех остальных страниц — пропускаем без проверки
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|locales).*)'],
};
