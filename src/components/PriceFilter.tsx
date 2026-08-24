"use client";

interface PriceFilterProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export function PriceFilter({ min, max, onChange }: PriceFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-rose-text/40 font-medium">Precio:</span>
      <input
        type="number"
        value={min || ""}
        onChange={(e) => onChange(Number(e.target.value), max)}
        placeholder="Min"
        className="w-20 px-3 py-2 rounded-full bg-white/60 border border-rose-200/40 text-sm text-rose-text placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
      />
      <span className="text-rose-text/30">-</span>
      <input
        type="number"
        value={max || ""}
        onChange={(e) => onChange(min, Number(e.target.value))}
        placeholder="Max"
        className="w-20 px-3 py-2 rounded-full bg-white/60 border border-rose-200/40 text-sm text-rose-text placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
      />
    </div>
  );
}
