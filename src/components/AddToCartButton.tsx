"use client";

import { useCart } from "@/context/CartContext";

interface Props {
  product: { id: string; title: string; price: number; imageUrl: string | null };
  available: boolean;
  compact?: boolean;
}

export function AddToCartButton({ product, available, compact }: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(product)}
      disabled={!available}
      className={`inline-flex items-center justify-center rounded-full border border-rose-300 text-rose-400 hover:bg-rose-50 hover:border-rose-400 transition-all duration-300 ${
        compact ? "w-9 h-9" : "px-4 py-2.5 text-xs font-semibold gap-1.5"
      } ${!available ? "opacity-40 cursor-not-allowed" : ""}`}
      aria-label="Agregar al carrito"
    >
      <svg className={compact ? "w-4 h-4" : "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {!compact && "Agregar"}
    </button>
  );
}
