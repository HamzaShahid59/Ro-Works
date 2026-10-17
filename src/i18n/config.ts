export const locales = ["en", "nl", "de", "fr", "ar", "tr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Name of each language written in that language, shown in the switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  ar: "العربية",
  tr: "Türkçe",
};

/** Short code shown on the switcher button. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  nl: "NL",
  de: "DE",
  fr: "FR",
  ar: "AR",
  tr: "TR",
};

export const rtlLocales: Locale[] = ["ar"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
