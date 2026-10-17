import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";

/**
 * Sends visitors without a language in the URL to their saved language,
 * or to English by default. Example: "/" → "/en".
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (isLocale(firstSegment)) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
  const locale = isLocale(saved) ? saved : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next.js internals and files with an extension (images, icons…)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
