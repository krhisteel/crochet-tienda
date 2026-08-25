"use client";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { value: "newest", label: "Más nuevo" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "featured", label: "Destacados" },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/60 backdrop-blur-xl border border-rose-200/30">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            value === opt.value
              ? "bg-rose-400 text-white shadow-md shadow-rose-300/20"
              : "text-rose-text/40 hover:text-rose-text/60 hover:bg-rose-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
