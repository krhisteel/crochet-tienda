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
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
            current === c.value
              ? "bg-charcoal text-white shadow-md"
              : "bg-white text-charcoal/60 border border-black/8 hover:border-blush hover:text-blush hover:bg-blush/5"
          }`}
        >
          <span className="text-base">{c.icon}</span>
          {c.label}
        </button>
      ))}
    </div>
  );
}
