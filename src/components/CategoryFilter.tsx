"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FilterIcon } from "./Icons";

const categories = [
  { label: "Todos", value: "", icon: FilterIcon },
  { label: "Amigurumis", value: "Amigurumis", icon: null },
  { label: "Ropa", value: "Ropa", icon: null },
  { label: "Accesorios", value: "Accesorios", icon: null },
  { label: "Patrones", value: "Patrones", icon: null },
  { label: "Promociones", value: "Promociones", icon: null },
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
      {categories.map((c) => {
        const isActive = current === c.value;
        return (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-rose-300 to-rose-400 text-white shadow-lg shadow-rose-300/25"
                : "liquid-card text-rose-text/50 hover:text-rose-400 hover:border-rose-300/30"
            }`}
          >
            {c.icon && <c.icon className="w-3.5 h-3.5" />}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
