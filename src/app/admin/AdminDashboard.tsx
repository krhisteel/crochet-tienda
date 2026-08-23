"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";
import { PlusIcon, LogoutIcon, BoxIcon, TrashIcon } from "@/components/Icons";

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
          <svg className="w-12 h-12 mx-auto mb-4 text-rose-300/40 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
            <path d="M7 13c1.5 1.5 3 2.5 5 2.5s3.5-1 5-2.5" />
          </svg>
          <p className="text-sm text-rose-text/40 font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-rose-text">Administración</h1>
          <p className="text-sm text-rose-text/40 mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""} registrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200/30 bg-white text-rose-text/40 px-5 py-2.5 text-sm font-medium hover:bg-rose-50 hover:text-rose-text transition-all duration-300"
          >
            <LogoutIcon className="w-4 h-4" />
            Salir
          </button>
          <Link
            href="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-6 py-2.5 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 liquid-card rounded-3xl">
          <BoxIcon className="w-16 h-16 mx-auto mb-6 text-rose-200/40" />
          <h3 className="text-xl font-bold text-rose-text mb-2">Sin productos</h3>
          <p className="text-sm text-rose-text/40 mb-8">Agregá tu primer producto al catálogo</p>
          <Link
            href="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-8 py-3 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar producto
          </Link>
        </div>
      ) : (
        <div className="liquid-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-100/30 border-b border-rose-200/20">
                <tr>
                  <th className="px-6 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Producto</th>
                  <th className="px-6 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden sm:table-cell">Categoría</th>
                  <th className="px-6 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden sm:table-cell">Precio</th>
                  <th className="px-6 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Estado</th>
                  <th className="px-6 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Destacado</th>
                  <th className="px-6 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-200/15">
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
    <tr className={`hover:bg-rose-100/20 transition-colors duration-300 ${isPending ? "opacity-40" : ""}`}>
      <td className="px-6 py-5">
        <span className="font-semibold text-rose-text text-sm">{product.title}</span>
      </td>
      <td className="px-6 py-5 hidden sm:table-cell">
        <span className="text-[11px] font-bold text-rose-text/40 bg-rose-100 rounded-full px-3 py-1 uppercase tracking-wider">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-5 hidden sm:table-cell text-sm text-rose-text/60 font-semibold">
        {formatPrice(product.price)}
      </td>
      <td className="px-6 py-5 hidden md:table-cell">
        <button
          onClick={toggleAvailable}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
            product.available
              ? "bg-rose-300/15 text-rose-500 hover:bg-rose-300/25"
              : "bg-rose-200/50 text-rose-400 hover:bg-rose-200"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${product.available ? "bg-rose-400" : "bg-rose-300"}`} />
          {product.available ? "Disponible" : "Bajo Pedido"}
        </button>
      </td>
      <td className="px-6 py-5 hidden md:table-cell">
        <button
          onClick={toggleFeatured}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
            product.featured
              ? "bg-rose-300/15 text-rose-400 hover:bg-rose-300/25"
              : "bg-rose-100/50 text-rose-text/25 hover:bg-rose-100"
          }`}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill={product.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {product.featured ? "Sí" : "No"}
        </button>
      </td>
      <td className="px-6 py-5 text-right">
        <button
          onClick={deleteProduct}
          disabled={deleting}
          className="inline-flex items-center gap-1 text-danger/30 hover:text-danger text-xs font-semibold transition-colors duration-300 disabled:opacity-30"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          {deleting ? "..." : "Eliminar"}
        </button>
      </td>
    </tr>
  );
}
