"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  available: boolean;
  featured: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}

export function AdminProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  async function toggleAvailable() {
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !product.available }),
    });
    startTransition(() => router.refresh());
  }

  async function toggleFeatured() {
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !product.featured }),
    });
    startTransition(() => router.refresh());
  }

  async function deleteProduct() {
    if (!confirm("¿Eliminar este producto permanentemente?")) return;
    setDeleting(true);
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  }

  return (
    <tr className={`hover:bg-cream/50 transition-colors ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-3">
        <span className="font-medium text-charcoal">{product.title}</span>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-charcoal/60">
        {product.category}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-charcoal/60">
        {formatPrice(product.price)}
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <button
          onClick={toggleAvailable}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
            product.available
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-amber/10 text-amber hover:bg-amber/20"
          }`}
        >
          {product.available ? "Disponible" : "Bajo Pedido"}
        </button>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <button
          onClick={toggleFeatured}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
            product.featured
              ? "bg-blush/20 text-blush hover:bg-blush/30"
              : "bg-charcoal/5 text-charcoal/40 hover:bg-charcoal/10"
          }`}
        >
          {product.featured ? "★ Sí" : "☆ No"}
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={deleteProduct}
          disabled={deleting}
          className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors disabled:opacity-50"
        >
          {deleting ? "..." : "Eliminar"}
        </button>
      </td>
    </tr>
  );
}
