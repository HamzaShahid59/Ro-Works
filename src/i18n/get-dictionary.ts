import type { Locale } from "./config";
import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  nl: () => import("./dictionaries/nl.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
