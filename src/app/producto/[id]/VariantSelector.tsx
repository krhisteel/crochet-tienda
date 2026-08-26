"use client";

interface Variant {
  name: string;
  color: string;
  image?: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  quantities: Record<number, number>;
  onQuantityChange: (index: number, qty: number) => void;
}

export function VariantSelector({ variants, quantities, onQuantityChange }: VariantSelectorProps) {
  return (
    <div>
      <p className="text-[11px] font-bold text-rose-text/30 uppercase tracking-[0.2em] mb-3">
        Elegí tu opción
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
        {variants.map((v, i) => {
          const qty = quantities[i] || 0;
          return (
            <div
              key={i}
              className={`flex items-center gap-2.5 shrink-0 snap-start rounded-full border px-1 py-1 pl-1 pr-1 transition-all duration-300 ${
                qty > 0
                  ? "border-rose-400 bg-rose-50 shadow-sm shadow-rose-200/30"
                  : "border-rose-200/30 bg-white hover:border-rose-300/50"
              }`}
            >
              {v.image ? (
                <img src={v.image} alt={v.name} className="w-8 h-8 rounded-full object-cover border border-rose-200/30 shrink-0" />
              ) : (
                <span
                  className="w-8 h-8 rounded-full border border-rose-200/30 shrink-0"
                  style={{ backgroundColor: v.color }}
                />
              )}

              <span className={`text-sm font-medium whitespace-nowrap pr-1 ${qty > 0 ? "text-rose-text" : "text-rose-text/50"}`}>
                {v.name}
              </span>

              <div className="flex items-center gap-0 bg-rose-100/60 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => onQuantityChange(i, Math.max(0, qty - 1))}
                  className="w-7 h-7 flex items-center justify-center text-rose-text/40 hover:text-rose-text hover:bg-rose-200/50 transition-all text-sm font-bold"
                  disabled={qty === 0}
                >
                  −
                </button>
                <span className={`w-6 text-center text-xs font-bold tabular-nums ${qty > 0 ? "text-rose-text" : "text-rose-text/30"}`}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(i, qty + 1)}
                  className="w-7 h-7 flex items-center justify-center text-rose-text/40 hover:text-rose-text hover:bg-rose-200/50 transition-all text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
