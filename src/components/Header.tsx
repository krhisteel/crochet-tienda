"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { YarnBallIcon, MenuIcon, XIcon, WhatsAppIcon } from "./Icons";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled
            ? "w-[calc(100%-2rem)] max-w-4xl"
            : "w-[calc(100%-2rem)] max-w-5xl"
        }`}
      >
        <nav
          className={`flex items-center justify-between gap-4 px-2 py-2 rounded-full transition-all duration-500 ${
            scrolled
              ? "bg-white/80 backdrop-blur-2xl shadow-xl shadow-rose-300/15 border border-rose-200/30"
              : "bg-white/15 backdrop-blur-xl border border-white/20"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5 pl-3 pr-4 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-300/30 group-hover:shadow-rose-300/50 transition-all duration-300 group-hover:scale-110">
              <YarnBallIcon className="w-4 h-4 text-white" />
            </div>
            <span className={`text-sm font-extrabold tracking-tight transition-colors duration-500 hidden sm:block ${scrolled ? "text-rose-text" : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"}`}>
              Tejidos a <span className={scrolled ? "text-rose-400" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"}>Crochet</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${scrolled ? "text-rose-text/60 hover:text-rose-400 hover:bg-rose-100/50" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              Catálogo
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${scrolled ? "text-rose-text/60 hover:text-rose-400 hover:bg-rose-100/50" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <a
              href="https://wa.me/56936621284"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? "bg-whatsapp text-white hover:bg-whatsapp-hover shadow-sm hover:shadow-lg hover:shadow-whatsapp/20"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/20"
              }`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? "bg-rose-100/50 text-rose-text hover:bg-rose-100"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label="Menú"
            >
              {menuOpen ? (
                <XIcon className="w-4 h-4" />
              ) : (
                <MenuIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden mt-2 mx-2 bg-white/95 backdrop-blur-2xl rounded-3xl p-4 space-y-1 border border-rose-200/30 shadow-2xl shadow-rose-300/15">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-text/70 hover:text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
              <YarnBallIcon className="w-4 h-4" />
              Catálogo
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-text/70 hover:text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Admin
            </Link>
            <div className="h-px bg-rose-200/20 my-1" />
            <a href="https://wa.me/56936621284" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-whatsapp hover:bg-rose-50 rounded-2xl transition-all">
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        )}
      </header>
    </>
  );
}
