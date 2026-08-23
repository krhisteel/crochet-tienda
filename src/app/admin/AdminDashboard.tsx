"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  available: boolean;
  featured: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(price);
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    setAuthenticated(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      console.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin-token");
    window.location.reload();
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => { setAuthenticated(true); setLoading(true); }} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-spin inline-block">🧶</div>
          <p className="text-sm text-charcoal/40">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Administración</h1>
          <p className="text-sm text-charcoal/40 mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""} registrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="rounded-xl border border-black/10 bg-white text-charcoal/50 px-4 py-2.5 text-sm font-medium hover:bg-cream hover:text-charcoal transition-all"
          >
            Salir
          </button>
          <Link
            href="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-xl bg-blush text-white font-semibold px-5 py-2.5 hover:bg-blush-dark transition-all shadow-sm hover:shadow-md text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-black/5">
          <div className="text-5xl mb-4 opacity-30">📦</div>
          <h3 className="text-lg font-semibold text-charcoal mb-1">Sin productos</h3>
          <p className="text-sm text-charcoal/40 mb-6">Agregá tu primer producto al catálogo</p>
          <Link
            href="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-xl bg-blush text-white font-semibold px-6 py-2.5 hover:bg-blush-dark transition-all shadow-sm text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar producto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-charcoal/[0.03] border-b border-black/5">
                <tr>
                  <th className="px-5 py-3.5 font-semibold text-charcoal/60 text-xs uppercase tracking-wider">Producto</th>
                  <th className="px-5 py-3.5 font-semibold text-charcoal/60 text-xs uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                  <th className="px-5 py-3.5 font-semibold text-charcoal/60 text-xs uppercase tracking-wider hidden sm:table-cell">Precio</th>
                  <th className="px-5 py-3.5 font-semibold text-charcoal/60 text-xs uppercase tracking-wider hidden md:table-cell">Estado</th>
                  <th className="px-5 py-3.5 font-semibold text-charcoal/60 text-xs uppercase tracking-wider hidden md:table-cell">Destacado</th>
                  <th className="px-5 py-3.5 font-semibold text-charcoal/60 text-xs uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {products.map((product) => (
                  <AdminProductRow key={product.id} product={product} onUpdate={fetchProducts} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminProductRow({ product, onUpdate }: { product: Product; onUpdate: () => void }) {
  const [isPending, setIsPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const adminToken = typeof window !== "undefined" ? localStorage.getItem("admin-token") || "" : "";

  async function toggleAvailable() {
    setIsPending(true);
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
      body: JSON.stringify({ available: !product.available }),
    });
    await onUpdate();
    setIsPending(false);
  }

  async function toggleFeatured() {
    setIsPending(true);
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
      body: JSON.stringify({ featured: !product.featured }),
    });
    await onUpdate();
    setIsPending(false);
  }

  async function deleteProduct() {
    if (!confirm("¿Eliminar este producto permanentemente?")) return;
    setDeleting(true);
    await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    });
    await onUpdate();
  }

  return (
    <tr className={`hover:bg-cream/30 transition-colors ${isPending ? "opacity-40" : ""}`}>
      <td className="px-5 py-4">
        <span className="font-medium text-charcoal text-sm">{product.title}</span>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell">
        <span className="text-xs font-medium text-charcoal/40 bg-charcoal/5 rounded-full px-2.5 py-1">
          {product.category}
        </span>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell text-sm text-charcoal/60 font-medium">
        {formatPrice(product.price)}
      </td>
      <td className="px-5 py-4 hidden md:table-cell">
        <button
          onClick={toggleAvailable}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all ${
            product.available
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-amber/10 text-amber hover:bg-amber/20"
          }`}
        >
          {product.available ? "● Disponible" : "○ Bajo Pedido"}
        </button>
      </td>
      <td className="px-5 py-4 hidden md:table-cell">
        <button
          onClick={toggleFeatured}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all ${
            product.featured
              ? "bg-blush/10 text-blush hover:bg-blush/20"
              : "bg-charcoal/5 text-charcoal/30 hover:bg-charcoal/10"
          }`}
        >
          {product.featured ? "★ Sí" : "☆ No"}
        </button>
      </td>
      <td className="px-5 py-4 text-right">
        <button
          onClick={deleteProduct}
          disabled={deleting}
          className="text-danger/40 hover:text-danger text-xs font-medium transition-colors disabled:opacity-30 hover:underline"
        >
          {deleting ? "..." : "Eliminar"}
        </button>
      </td>
    </tr>
  );
}
