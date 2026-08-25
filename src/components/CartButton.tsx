"use client";

import { useCart } from "@/context/CartContext";

export function CartButton({ solid }: { solid: boolean }) {
  const { totalItems, setIsOpen } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`relative p-2.5 rounded-full transition-all duration-300 ${
        solid
          ? "bg-rose-100/50 text-rose-text hover:bg-rose-100"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
      aria-label="Abrir carrito"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
