import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const protectedRoutes = ['/home', '/profile-update'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const authToken = request.cookies.get('auth_token')?.value;
  // const tempToken = request.cookies.get('temp_token')?.value;

  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token')?.value;

  // Protect /home → must have auth_token
  if (protectedRoutes.includes(pathname) && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // if (pathname.startsWith('/home') && !authToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // // Protect /profile-update → must have temp_token
  // if (pathname.startsWith('/profile-update') && !tempToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}
export const config = {
  matcher: ['/home', '/profile-update'],
};
