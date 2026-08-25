"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { SortSelect } from "./SortSelect";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  craftingTime: string;
  category: string;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
}

interface ProductGridProps {
  products: Product[];
  initialCategory: string;
}

export function ProductGrid({ products, initialCategory }: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesSearch = search
        ? p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, category, search, sort]);

  return (
    <>
      <div className="flex justify-center mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="flex justify-center mb-10">
        <CategoryFilter
          current={category}
          onChange={setCategory}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <p className="text-sm text-rose-text/30 font-medium">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 liquid-card rounded-3xl">
          <svg className="w-16 h-16 mx-auto mb-6 text-rose-200/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
            <path d="M7 13c1.5 1.5 3 2.5 5 2.5s3.5-1 5-2.5" />
            <path d="M8 17c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" />
          </svg>
          <h3 className="text-xl font-bold text-rose-text mb-2">
            {search ? "Sin resultados" : "Catálogo vacío"}
          </h3>
          <p className="text-sm text-rose-text/40 max-w-sm mx-auto">
            {search
              ? `No encontramos "${search}". Probá con otro término.`
              : "Pronto agregaremos nuevos tejidos artesanales."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((product, i) => (
            <div key={product.id} className={`fade-in-up stagger-${Math.min(i + 1, 6)}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
