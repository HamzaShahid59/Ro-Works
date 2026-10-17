import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getDirection, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";

import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Build one static page per language; any other language code returns 404
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0e0f10",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/en",
      },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      siteName: site.name,
      locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
