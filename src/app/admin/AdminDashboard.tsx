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
          <div className="text-4xl mb-4 animate-spin inline-block">🧶</div>
          <p className="text-sm text-charcoal/40 font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Administración</h1>
          <p className="text-sm text-charcoal/40 mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""} registrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-black/5 bg-white text-charcoal/40 px-5 py-2.5 text-sm font-medium hover:bg-cream hover:text-charcoal transition-all duration-300"
          >
            Salir
          </button>
          <Link
            href="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blush to-blush-dark text-white font-semibold px-6 py-2.5 hover:shadow-lg hover:shadow-blush/20 transition-all duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 liquid-card rounded-3xl">
          <div className="text-6xl mb-6 opacity-20">📦</div>
          <h3 className="text-xl font-bold text-charcoal mb-2">Sin productos</h3>
          <p className="text-sm text-charcoal/40 mb-8">Agregá tu primer producto al catálogo</p>
          <Link
            href="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blush to-blush-dark text-white font-semibold px-8 py-3 hover:shadow-lg hover:shadow-blush/20 transition-all duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar producto
          </Link>
        </div>
      ) : (
        <div className="liquid-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-charcoal/[0.03] border-b border-black/5">
                <tr>
                  <th className="px-6 py-4 font-bold text-charcoal/40 text-[11px] uppercase tracking-widest">Producto</th>
                  <th className="px-6 py-4 font-bold text-charcoal/40 text-[11px] uppercase tracking-widest hidden sm:table-cell">Categoría</th>
                  <th className="px-6 py-4 font-bold text-charcoal/40 text-[11px] uppercase tracking-widest hidden sm:table-cell">Precio</th>
                  <th className="px-6 py-4 font-bold text-charcoal/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Estado</th>
                  <th className="px-6 py-4 font-bold text-charcoal/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Destacado</th>
                  <th className="px-6 py-4 font-bold text-charcoal/40 text-[11px] uppercase tracking-widest text-right">Acciones</th>
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
    <tr className={`hover:bg-blush/[0.02] transition-colors duration-300 ${isPending ? "opacity-40" : ""}`}>
      <td className="px-6 py-5">
        <span className="font-semibold text-charcoal text-sm">{product.title}</span>
      </td>
      <td className="px-6 py-5 hidden sm:table-cell">
        <span className="text-[11px] font-bold text-charcoal/40 bg-charcoal/5 rounded-full px-3 py-1 uppercase tracking-wider">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-5 hidden sm:table-cell text-sm text-charcoal/60 font-semibold">
        {formatPrice(product.price)}
      </td>
      <td className="px-6 py-5 hidden md:table-cell">
        <button
          onClick={toggleAvailable}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
            product.available
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-amber/10 text-amber hover:bg-amber/20"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${product.available ? "bg-success" : "bg-amber"}`} />
          {product.available ? "Disponible" : "Bajo Pedido"}
        </button>
      </td>
      <td className="px-6 py-5 hidden md:table-cell">
        <button
          onClick={toggleFeatured}
          className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
            product.featured
              ? "bg-blush/10 text-blush hover:bg-blush/20"
              : "bg-charcoal/5 text-charcoal/25 hover:bg-charcoal/10"
          }`}
        >
          {product.featured ? "★ Sí" : "☆ No"}
        </button>
      </td>
      <td className="px-6 py-5 text-right">
        <button
          onClick={deleteProduct}
          disabled={deleting}
          className="text-danger/30 hover:text-danger text-xs font-semibold transition-colors duration-300 disabled:opacity-30 hover:underline"
        >
          {deleting ? "..." : "Eliminar"}
        </button>
      </td>
    </tr>
  );
}
