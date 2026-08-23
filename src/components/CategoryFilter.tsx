"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const categories = [
  { label: "Todos", value: "" },
  { label: "🧸 Amigurumis", value: "Amigurumis" },
  { label: "👗 Ropa", value: "Ropa" },
  { label: "🧣 Accesorios", value: "Accesorios" },
  { label: "📄 Patrones", value: "Patrones" },
  { label: "🏷️ Promociones", value: "Promociones" },
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
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c.value}
          onClick={() => setCategory(c.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            current === c.value
              ? "bg-blush text-white shadow-md"
              : "bg-white text-charcoal/70 border border-beige hover:border-blush hover:text-blush"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
