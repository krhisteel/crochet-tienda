"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { YarnBallIcon, MenuIcon, XIcon, WhatsAppIcon } from "./Icons";
import { CartButton } from "./CartButton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { setIsOpen } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showSolid = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          showSolid
            ? "w-[calc(100%-2rem)] max-w-4xl"
            : "w-[calc(100%-2rem)] max-w-5xl"
        }`}
      >
        <nav
          className={`flex items-center justify-between gap-4 px-2 py-2 rounded-full transition-all duration-500 ${
            showSolid
              ? "bg-white/80 backdrop-blur-2xl shadow-xl shadow-rose-300/15 border border-rose-200/30"
              : "bg-white/15 backdrop-blur-xl border border-white/20"
          }`}
        >
          <Link href="/admin" className="flex items-center gap-2.5 pl-3 pr-4 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-300/30 group-hover:shadow-rose-300/50 transition-all duration-300 group-hover:scale-110">
              <YarnBallIcon className="w-4 h-4 text-white" />
            </div>
            <span className={`text-sm font-extrabold tracking-tight transition-colors duration-500 hidden sm:block ${showSolid ? "text-rose-text" : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"}`}>
              <span className={showSolid ? "text-rose-400" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"}>Mundito</span> Amigurumi
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${showSolid ? "text-rose-text/60 hover:text-rose-400 hover:bg-rose-100/50" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              Catálogo
            </Link>
            <Link
              href="/favoritos"
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${showSolid ? "text-rose-text/60 hover:text-rose-400 hover:bg-rose-100/50" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              Favoritos
            </Link>
            <Link
              href="/sobre-mi"
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${showSolid ? "text-rose-text/60 hover:text-rose-400 hover:bg-rose-100/50" : "text-white/80 hover:text-white hover:bg-white/10"}`}
            >
              Sobre Mí
            </Link>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <CartButton solid={showSolid} />
            <Link
              href="/favoritos"
              className={`relative p-3 rounded-full transition-all duration-300 ${
                showSolid
                  ? "bg-rose-100/50 text-rose-text hover:bg-rose-100"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label="Favoritos"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <a
              href="https://wa.me/56936621284"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 ${
                showSolid
                  ? "bg-whatsapp text-white hover:bg-whatsapp-hover shadow-sm hover:shadow-lg hover:shadow-whatsapp/20"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/20"
              }`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-3 rounded-full transition-all duration-300 ${
                showSolid
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
            <Link href="/sobre-mi" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-text/70 hover:text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Sobre Mí
            </Link>
            <Link href="/favoritos" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-text/70 hover:text-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              Favoritos {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <div className="h-px bg-rose-200/20 my-1" />
            <button
              onClick={() => { setMenuOpen(false); setIsOpen(true); }}
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-text/70 hover:text-rose-400 hover:bg-rose-50 rounded-2xl transition-all w-full"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              Mi Carrito
            </button>
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
