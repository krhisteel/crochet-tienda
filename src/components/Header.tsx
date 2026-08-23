"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { YarnBallIcon, MenuIcon, XIcon, WhatsAppIcon } from "./Icons";

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
                <YarnBallIcon className="w-5 h-5 text-white" />
              </div>
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
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2.5 rounded-xl liquid-glass"
            aria-label="Menú"
          >
            {menuOpen ? (
              <XIcon className="w-5 h-5 text-charcoal" />
            ) : (
              <MenuIcon className="w-5 h-5 text-charcoal" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-3 liquid-glass rounded-2xl p-3 space-y-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              <YarnBallIcon className="w-4 h-4" />
              Catálogo
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              <LockIcon className="w-4 h-4" />
              Admin
            </Link>
            <a href="https://wa.me/56936621284" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-whatsapp hover:bg-whatsapp/5 rounded-xl transition-all">
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
