import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/';

  if (isPublicPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (session) {
    const { role } = session.user;

    if (pathname.startsWith('/admin') && role !== 'administrator') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.startsWith('/supervisor') && role === 'technician') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (pathname.startsWith('/technician') && role === 'supervisor') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
