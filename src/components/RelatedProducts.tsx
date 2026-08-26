"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";

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

interface RelatedProductsProps {
  currentId: string;
  category: string;
}

export function RelatedProducts({ currentId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Product[]) => {
        const sameCategory = data.filter((p) => p.id !== currentId && p.category === category);
        const others = data.filter((p) => p.id !== currentId && p.category !== category);
        const related = [...sameCategory, ...others].slice(0, 6);
        setProducts(related);
      })
      .catch(() => {});
  }, [currentId, category]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-100 rounded-full px-4 py-1.5 uppercase tracking-widest mb-4">
          Relacionados
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-rose-text">
          Te podría gustar
        </h2>
        <p className="text-sm text-rose-text/40 mt-2">Más productos que te pueden encantar</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product, i) => (
          <div key={product.id} className={`fade-in-up stagger-${Math.min(i + 1, 6)}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
