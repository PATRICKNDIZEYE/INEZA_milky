import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const publicRoutes = ['/login', '/api/debug/env', '/','/api/auth/login']

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value


  if (!token) {
    // console.log('[MIDDLEWARE] No token found, redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let payload = null
  try {
    const { payload: verified } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    )
    payload = verified
  } catch (e) {
    payload = null
  }
  // console.log('[MIDDLEWARE] Token payload:', payload)
  const userId = (typeof payload === 'object' && payload && 'userId' in payload) ? payload.userId : null;
  if (!userId) {
    // console.log('[MIDDLEWARE] Invalid token, redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', userId)
  // console.log('[MIDDLEWARE] Authenticated userId:', userId)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    '/api/debug/env',
    '/'
  ],
}