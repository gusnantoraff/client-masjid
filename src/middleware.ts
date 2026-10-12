import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const cookie = request.cookies.get('api_token');
  
  const guardedRoutes = [
    '/dashboard',
    '/kelola-masjid',
    '/keuangan',
    '/jamaah',
    '/kegiatan',
    '/surat',
    '/berita',
    '/yatim-dhuafa',
    '/jadwal-sholat'
  ];

  if (guardedRoutes.some((route) => pathname.startsWith(route)) && !cookie) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (pathname === '/login' && cookie) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.next();
}
