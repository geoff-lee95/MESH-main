import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is an OPTIONS request (preflight request)
  if (request.method === 'OPTIONS') {
    // Create a new response with 200 status
    const response = new NextResponse(null, { status: 200 })
    
    // Add the CORS headers for preflight
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info, apikey')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
    
    return response
  }
  
  // For regular requests, we just add CORS headers to the response
  const response = NextResponse.next()
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info, apikey')
  
  return response
}

// Specify which routes this middleware should run on
export const config = {
  // Apply to auth-related API routes and Supabase requests
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 