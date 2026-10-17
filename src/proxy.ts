import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";

/**
 * Files in /public that visitors are allowed to open directly.
 * If you add more public files or folders later, add them here.
 */
const PUBLIC_FILES = /^\/(images\/.+|icon\.svg|favicon\.ico|robots\.txt|sitemap\.xml|apple-icon\.png)$/;

/**
 * The site has one page per language: /en, /nl, /de, /fr, /ar, /tr.
 * Every other address is sent to the home page in the right language:
 *   /                → /en (or the language the visitor chose before)
 *   /en/lander       → /en
 *   /nl/whatever/xyz → /nl
 *   /lander          → /en
 *   /wp-login.php    → /en
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let real public files through
  if (PUBLIC_FILES.test(pathname)) return NextResponse.next();

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0] ?? "";

  // A valid language home page, e.g. /en or /en/ → show it
  if (isLocale(first) && segments.length === 1) return NextResponse.next();

  // Anything else → redirect to the home page of the best language
  const saved = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
  const locale = isLocale(first) ? first : isLocale(saved) ? saved : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on every address except Next.js internals and the quote form API
  matcher: ["/((?!_next/|api/).*)"],
};
