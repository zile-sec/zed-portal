import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define which paths are protected (require authentication)
  const isProtectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/transactions") ||
    path.startsWith("/documents") ||
    path.startsWith("/profile")

  // Define which paths are public (login, register, etc.)
  const isPublicPath = path === "/login"

  // Simple session check
  const hasSession = request.cookies.has("session")

  // Redirect to login if trying to access protected route without session
  if (isProtectedPath && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if trying to access login page with session
  if (isPublicPath && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/login", "/dashboard/:path*", "/transactions/:path*", "/documents/:path*", "/profile/:path*"],
}
