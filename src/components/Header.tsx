"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";
import { CloseIcon, MenuIcon } from "./icons";

type NavLabels = {
  services: string;
  projects: string;
  process: string;
  reviews: string;
  contact: string;
  quote: string;
  openMenu: string;
  closeMenu: string;
  language: string;
};

type Props = {
  locale: Locale;
  labels: NavLabels;
  showProjects: boolean;
  showReviews: boolean;
};

export default function Header({ locale, labels, showProjects, showReviews }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu when the screen gets wide
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1001px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const links = [
    { href: "#services", label: labels.services },
    ...(showProjects ? [{ href: "#projects", label: labels.projects }] : []),
    { href: "#process", label: labels.process },
    ...(showReviews ? [{ href: "#reviews", label: labels.reviews }] : []),
    { href: "#contact", label: labels.contact },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="logo" aria-label="RoWorks">
          <span className="logo-mark" aria-hidden />
          Ro Works
        </a>

        <nav className="pill-nav" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher current={locale} label={labels.language} />
          <a href="#contact" className="btn btn-accent header-quote">
            {labels.quote}
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-panel" hidden={!menuOpen}>
        <div className="container">
          <nav aria-label="Mobile">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="btn btn-accent" onClick={() => setMenuOpen(false)}>
            {labels.quote}
          </a>
        </div>
      </div>
    </header>
  );
}
