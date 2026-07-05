import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, PIN_COOKIE_NAME } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminAuthenticated =
    request.cookies.get(ADMIN_COOKIE_NAME)?.value === 'authenticated';

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAdminAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  const isAdminApiRoute =
    pathname.startsWith('/api/photos') ||
    pathname.startsWith('/api/settings') ||
    pathname.startsWith('/api/generate-caption');

  if (isAdminApiRoute && !isAdminAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.next();

  if (pathname === '/') {
    response.cookies.delete(PIN_COOKIE_NAME);
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/admin/photos',
    '/admin/settings',
    '/api/photos/:path*',
    '/api/settings/:path*',
    '/api/generate-caption',
  ],
};
