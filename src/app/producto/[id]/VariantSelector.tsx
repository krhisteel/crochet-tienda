"use client";

import { useState } from "react";

interface Variant {
  name: string;
  color: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  onSelect: (variant: Variant) => void;
}

export function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const [selected, setSelected] = useState<number>(0);

  function handleSelect(index: number) {
    setSelected(index);
    onSelect(variants[index]);
  }

  return (
    <div className="mb-6">
      <p className="text-[11px] font-bold text-rose-text/30 uppercase tracking-[0.2em] mb-3">
        Elegí tu opción
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`inline-flex items-center gap-2.5 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              selected === i
                ? "border-rose-400 bg-rose-50 text-rose-text shadow-md shadow-rose-200/30"
                : "border-rose-200/30 bg-white text-rose-text/50 hover:border-rose-300/50 hover:bg-rose-50/50"
            }`}
          >
            <span
              className="w-5 h-5 rounded-full border border-rose-200/30 shrink-0"
              style={{ backgroundColor: v.color }}
            />
            {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}
