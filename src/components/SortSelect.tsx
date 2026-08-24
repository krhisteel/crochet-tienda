"use client";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-rose-200/40 text-sm text-rose-text focus:outline-none focus:ring-2 focus:ring-rose-300/40 appearance-none cursor-pointer"
    >
      <option value="newest">Más nuevo</option>
      <option value="price-asc">Menor precio</option>
      <option value="price-desc">Mayor precio</option>
      <option value="featured">Destacados</option>
    </select>
  );
}
