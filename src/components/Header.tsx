"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { YarnBallIcon, MenuIcon, XIcon, WhatsAppIcon, LockIcon } from "./Icons";

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
          ? "bg-white/80 backdrop-blur-xl border-b border-blush/10 py-3 shadow-lg shadow-blush/5"
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
              <span className={`text-lg font-extrabold tracking-tight block leading-tight transition-colors duration-500 ${scrolled ? "text-charcoal" : "text-white"}`}>
                Tejidos a <span className={scrolled ? "text-blush" : "text-blush-light"}>Crochet</span>
              </span>
              <span className={`text-[10px] font-semibold tracking-widest uppercase transition-colors duration-500 ${scrolled ? "text-charcoal/40" : "text-white/50"}`}>
                Artesanía con amor
              </span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${scrolled ? "text-charcoal/70 hover:text-blush hover:bg-blush/5" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              Catálogo
            </Link>
            <Link
              href="/admin"
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${scrolled ? "text-charcoal/70 hover:text-blush hover:bg-blush/5" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              Admin
            </Link>
            <div className={`w-px h-5 mx-1 ${scrolled ? "bg-charcoal/10" : "bg-white/20"}`} />
            <a
              href="https://wa.me/56936621284"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-whatsapp-hover transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-whatsapp/20 hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`sm:hidden p-2.5 rounded-xl transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl border border-blush/10" : "bg-white/10 backdrop-blur-xl border border-white/20"}`}
            aria-label="Menú"
          >
            {menuOpen ? (
              <XIcon className={`w-5 h-5 ${scrolled ? "text-charcoal" : "text-white"}`} />
            ) : (
              <MenuIcon className={`w-5 h-5 ${scrolled ? "text-charcoal" : "text-white"}`} />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-3 bg-white/90 backdrop-blur-xl rounded-2xl p-3 space-y-1 border border-blush/10 shadow-xl shadow-blush/5">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              <YarnBallIcon className="w-4 h-4" />
              Catálogo
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-charcoal/70 hover:text-blush hover:bg-blush/5 rounded-xl transition-all">
              <LockIcon className="w-4 h-4" />
              Admin
            </Link>
            <a href="https://wa.me/56936621284" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-whatsapp hover:bg-whatsapp/5 rounded-xl transition-all">
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
