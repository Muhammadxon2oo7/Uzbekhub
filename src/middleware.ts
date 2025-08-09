// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // Получаем токен из куки
  const pathname = req.nextUrl.pathname; // Текущий путь

  // Логи для отладки (удалить в продакшене)
  console.log('TOKEN:', token, 'PATH:', pathname);

  // Определяем публичные пути, где не требуется токен (страницы входа/регистрации)
  const publicPaths = ['/', '/login', '/register'];

  const isPublicPath = publicPaths.includes(pathname);

  // Если это публичный путь
  if (isPublicPath) {
    // Если токен есть и он не пустой, перенаправляем на /main
    if (token && token.trim() !== '') {
      return NextResponse.redirect(new URL('/main', req.url));
    }
  } else {
    // Если это защищенный путь и токена нет, перенаправляем на главную (/ или /login)
    if (!token || token.trim() === '') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next(); // Продолжить, если перенаправление не требуется
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|locales).*)'], // Добавьте |locales
};