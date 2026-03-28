import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper to generate expected token (using Web Crypto API for Edge compatibility)
async function getExpectedToken() {
  const SERVER_API_KEY = process.env.API_KEY || 'default_dev_key';
  const data = new TextEncoder().encode(SERVER_API_KEY + 'oliverslife-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect dashboard and file API routes
  if (path.startsWith('/dashboard') || path.startsWith('/api/files')) {
    const token = request.cookies.get('auth_token');
    const expectedToken = await getExpectedToken();

    if (!token || token.value !== expectedToken) {
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
