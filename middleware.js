import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected route, redirect to login
  if (!session && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If session exists and on login page, redirect to calendar
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/calendar', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/calendar', '/settings'],
}