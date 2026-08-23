"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🧶</span>
            <span className="text-lg font-bold text-charcoal tracking-tight">
              Tejidos a <span className="text-blush">Crochet</span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-charcoal/60 hover:text-blush rounded-full hover:bg-blush/5 transition-all"
            >
              Catálogo
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-charcoal/60 hover:text-blush rounded-full hover:bg-blush/5 transition-all"
            >
              Admin
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-full hover:bg-beige transition-colors"
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
          <div className="sm:hidden pb-4 border-t border-black/5 mt-2 pt-3 flex flex-col gap-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              Catálogo
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
