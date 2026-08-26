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
      <div className="grid grid-cols-2 gap-3">
        {variants.map((v, i) => {
          const qty = quantities[i] || 0;
          return (
            <div
              key={i}
              className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                qty > 0
                  ? "border-rose-400 bg-rose-50/80 shadow-md shadow-rose-200/30"
                  : "border-rose-200/30 bg-white hover:border-rose-300/50 hover:bg-rose-50/30"
              }`}
            >
              {v.image && (
                <div className="w-full aspect-square relative overflow-hidden">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                  {qty > 0 && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-400 text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {qty}
                    </div>
                  )}
                </div>
              )}

              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  {v.image ? null : (
                    <span
                      className="w-4 h-4 rounded-full border border-rose-200/30 shrink-0"
                      style={{ backgroundColor: v.color }}
                    />
                  )}
                  <span className="text-sm font-semibold text-rose-text truncate">{v.name}</span>
                </div>

                <div className="flex items-center justify-center gap-0 bg-rose-100/60 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(i, Math.max(0, qty - 1))}
                    className="w-9 h-9 flex items-center justify-center text-rose-text/50 hover:text-rose-text hover:bg-rose-200/50 transition-all text-lg font-bold"
                    disabled={qty === 0}
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-rose-text tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(i, qty + 1)}
                    className="w-9 h-9 flex items-center justify-center text-rose-text/50 hover:text-rose-text hover:bg-rose-200/50 transition-all text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
