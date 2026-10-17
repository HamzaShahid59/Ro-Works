"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { locales, localeNames, localeShort, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { ChevronIcon, GlobeIcon } from "./icons";

type Props = { current: Locale; label: string };

/** Swaps the first part of the URL (/en, /nl …) for the chosen language. */
function pathFor(pathname: string, locale: Locale) {
  const parts = pathname.split("/");
  parts[1] = locale;
  return parts.join("/") || `/${locale}`;
}

export default function LanguageSwitcher({ current, label }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? `/${current}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Move focus to the current language when the menu opens
  useEffect(() => {
    if (open) {
      wrapRef.current?.querySelector<HTMLAnchorElement>('a[aria-current="true"]')?.focus();
    }
  }, [open]);

  const remember = (locale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
  };

  const onMenuKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div className="lang" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="lang-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label}: ${localeNames[current]}`}
        onClick={() => setOpen((v) => !v)}
      >
        <GlobeIcon />
        <span>{localeShort[current]}</span>
        <ChevronIcon className="lang-chevron" />
      </button>

      {open && (
        <ul className="lang-menu" id={menuId} onKeyDown={onMenuKey}>
          {locales.map((locale) => (
            <li key={locale}>
              <Link
                href={pathFor(pathname, locale)}
                hrefLang={locale}
                lang={locale}
                aria-current={locale === current ? "true" : undefined}
                onClick={() => remember(locale)}
                scroll={false}
              >
                <span>{localeNames[locale]}</span>
                <span className="lang-code">{localeShort[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
