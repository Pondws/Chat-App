import { NextResponse, type NextRequest } from "next/server"

const PROTECTED = ["/chat"]
const AUTH_ONLY = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.has("refreshToken")

  console.log("hasSession", hasSession)

  if (!hasSession && PROTECTED.some((p) => pathname.startsWith(p))) {
    const url = new URL("/login", request.url)
    // url.searchParams.set("next", pathname + search)
    return NextResponse.redirect(url)
  }

  if (hasSession && AUTH_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
}