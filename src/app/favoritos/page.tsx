"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  category: string;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);
}

export default function WishlistPage() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((all: Product[]) => {
        setProducts(all.filter((p) => items.includes(p.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [items]);

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-10">
          <svg className="w-7 h-7 text-rose-400" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <h1 className="text-3xl font-bold text-rose-text">Mis Favoritos</h1>
          <span className="text-sm text-rose-text/30">({items.length})</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-rose-100 h-64" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto text-rose-200 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <h2 className="text-xl font-bold text-rose-text mb-2">No tenés favoritos aún</h2>
            <p className="text-rose-text/40 mb-6">Explorá el catálogo y tocá el corazón para guardar lo que más te guste</p>
            <Link href="/#catalogo" className="inline-flex items-center gap-2 bg-rose-400 text-white font-bold px-8 py-3 rounded-full hover:bg-rose-500 transition-all duration-300">
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <Link key={p.id} href={`/producto/${p.id}`} className="group liquid-card rounded-2xl overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-rose-100">
                      <svg className="w-12 h-12 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-rose-text text-sm line-clamp-1">{p.title}</h3>
                  <p className="text-rose-400 font-semibold text-sm mt-1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
