import { NextRequest, NextResponse } from "next/server"
import { locales, defaultLocale } from "./i18n/dictionaries"

const LOCALE_COOKIE = "fps_locale"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // "/" is the clinic homepage (src/app/(clinic)/page.tsx) — never redirect it.
  // Skip static assets, api routes, and admin (admin UI is English-only).
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/images/") || // clinic gallery images
    pathname.startsWith("/products/") || // public/products images
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const segments = pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]

  if (locales.includes(firstSegment as (typeof locales)[number])) {
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE, firstSegment, { path: "/", maxAge: 60 * 60 * 24 * 365 })
    return response
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  const acceptLang = request.headers.get("accept-language") ?? ""
  const browserPrefersAr = acceptLang.toLowerCase().startsWith("ar")

  const locale =
    (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number]) && cookieLocale) ||
    (browserPrefersAr ? "ar" : defaultLocale)

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next|api|admin|products|.*\\..*).*)"],
}
