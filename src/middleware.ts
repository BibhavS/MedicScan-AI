import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verify-email' || path === '/'

  const token = request.cookies.get('token')?.value || ''

  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }   
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/logout',
    '/signup',
    '/verify-email',
    '/dashboard',
    '/saved-reports'
  ]
}