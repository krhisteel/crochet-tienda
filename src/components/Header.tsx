"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "liquid-glass py-3 shadow-lg shadow-blush/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blush to-blush-dark flex items-center justify-center shadow-lg shadow-blush/20 group-hover:shadow-blush/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg">🧶</span>
              </div>
              <div className="absolute -inset-1 rounded-xl bg-blush/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <span className="text-lg font-bold text-charcoal tracking-tight block leading-tight">
                Tejidos a <span className="text-blush">Crochet</span>
              </span>
              <span className="text-[10px] text-charcoal/30 font-medium tracking-widest uppercase">
                Artesanía con amor
              </span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-medium text-charcoal/60 hover:text-blush rounded-full hover:bg-blush/5 transition-all duration-300"
            >
              Catálogo
            </Link>
            <Link
              href="/admin"
              className="px-5 py-2.5 text-sm font-medium text-charcoal/60 hover:text-blush rounded-full hover:bg-blush/5 transition-all duration-300"
            >
              Admin
            </Link>
            <div className="w-px h-5 bg-charcoal/10 mx-1" />
            <a
              href="https://wa.me/56936621284"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-whatsapp-hover transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-whatsapp/20 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2.5 rounded-xl liquid-glass"
            aria-label="Menú"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-3 liquid-glass rounded-2xl p-3 space-y-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              Catálogo
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              Admin
            </Link>
            <a href="https://wa.me/56936621284" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-whatsapp hover:bg-whatsapp/5 rounded-xl transition-all">
              WhatsApp
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
