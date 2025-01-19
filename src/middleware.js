import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access protected routes
  if (!session && (
    req.nextUrl.pathname.startsWith('/calendar') ||
    req.nextUrl.pathname.startsWith('/settings')
  )) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If there's a session and the user is on the login page
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/calendar', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/calendar/:path*', '/settings/:path*'],
}