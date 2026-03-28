import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect dashboard and file API routes
  if (path.startsWith('/dashboard') || path.startsWith('/api/files')) {
    const token = request.cookies.get('auth_token');

    if (!token) {
      if (path.startsWith('/api/files')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard', '/api/files/:path*', '/api/files'],
};
