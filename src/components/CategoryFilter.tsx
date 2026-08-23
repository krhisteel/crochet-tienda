"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const categories = [
  { label: "Todos", value: "", icon: "✦" },
  { label: "Amigurumis", value: "Amigurumis", icon: "🧸" },
  { label: "Ropa", value: "Ropa", icon: "👗" },
  { label: "Accesorios", value: "Accesorios", icon: "🧣" },
  { label: "Patrones", value: "Patrones", icon: "📄" },
  { label: "Promociones", value: "Promociones", icon: "🏷️" },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("cat") || "";

  const setCategory = useCallback(
    (cat: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat) {
        params.set("cat", cat);
      } else {
        params.delete("cat");
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((c) => (
        <button
          key={c.value}
          onClick={() => setCategory(c.value)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
            current === c.value
              ? "bg-gradient-to-r from-blush to-blush-dark text-white shadow-lg shadow-blush/20"
              : "liquid-card text-charcoal/60 hover:text-blush hover:border-blush/20"
          }`}
        >
          <span className="text-base">{c.icon}</span>
          {c.label}
        </button>
      ))}
    </div>
  );
}
