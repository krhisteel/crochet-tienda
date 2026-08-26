"use client";

import { useState } from "react";

interface Variant {
  name: string;
  color: string;
  image?: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  quantities: Record<number, number>;
  onQuantityChange: (index: number, qty: number) => void;
  onVariantFocus: (index: number) => void;
}

export function VariantSelector({ variants, quantities, onQuantityChange, onVariantFocus }: VariantSelectorProps) {
  const [open, setOpen] = useState(false);
  const totalItems = variants.reduce((s, _, i) => s + (quantities[i] || 0), 0);
  const selectedNames = variants
    .map((v, i) => (quantities[i] > 0 ? `${quantities[i]}x ${v.name}` : null))
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-2xl border border-rose-200/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-rose-50/50 transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[11px] font-bold text-rose-text/30 uppercase tracking-[0.2em]">
            Elegí tu opción
          </span>
          {totalItems > 0 ? (
            <span className="text-sm text-rose-text font-medium">{selectedNames}</span>
          ) : (
            <span className="text-sm text-rose-text/30">Seleccioná una o más opciones</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-rose-text/30 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <div className="border-t border-rose-200/20 bg-rose-50/30">
          {variants.map((v, i) => {
            const qty = quantities[i] || 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onVariantFocus(i)}
                className={`w-full flex items-center gap-3 px-5 py-3 transition-colors text-left ${
                  i < variants.length - 1 ? "border-b border-rose-200/15" : ""
                } ${qty > 0 ? "bg-rose-100/40" : "hover:bg-rose-50/50"}`}
              >
                {v.image ? (
                  <img src={v.image} alt={v.name} className="w-10 h-10 rounded-full object-cover border border-rose-200/30 shrink-0" />
                ) : (
                  <span
                    className="w-10 h-10 rounded-full border border-rose-200/30 shrink-0"
                    style={{ backgroundColor: v.color }}
                  />
                )}

                <span className={`flex-1 text-sm font-medium ${qty > 0 ? "text-rose-text" : "text-rose-text/60"}`}>
                  {v.name}
                </span>

                <div
                  className="flex items-center gap-0 bg-white rounded-full border border-rose-200/30 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onQuantityChange(i, Math.max(0, qty - 1))}
                    className="w-8 h-8 flex items-center justify-center text-rose-text/40 hover:text-rose-text hover:bg-rose-100/50 transition-all text-sm font-bold"
                    disabled={qty === 0}
                  >
                    −
                  </button>
                  <span className={`w-7 text-center text-sm font-bold tabular-nums ${qty > 0 ? "text-rose-text" : "text-rose-text/30"}`}>
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(i, qty + 1)}
                    className="w-8 h-8 flex items-center justify-center text-rose-text/40 hover:text-rose-text hover:bg-rose-100/50 transition-all text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
