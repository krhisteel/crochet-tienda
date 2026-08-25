"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";
import { PlusIcon, LogoutIcon, BoxIcon, TrashIcon, PencilIcon } from "@/components/Icons";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number | null;
  available: boolean;
  featured: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(price);
}

async function fetchWithTimeout(url: string, ms = 15000, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal, ...options });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<"login" | "loading" | "dashboard" | "error">("login");
  const [errorMsg, setErrorMsg] = useState("");
  const alive = useRef(true);

  const stats = useMemo(() => ({
    total: products.length,
    available: products.filter((p) => p.available).length,
    featured: products.filter((p) => p.featured).length,
    promotions: products.filter((p) => p.originalPrice && p.originalPrice > p.price).length,
  }), [products]);

  useEffect(() => {
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      loadProducts();
    }
  }, []);

  async function loadProducts() {
    setView("loading");
    const t = localStorage.getItem("admin-token") || "";
    try {
      const res = await fetchWithTimeout("/api/products?admin=true", 15000, {
        headers: { "x-admin-token": t },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin-token");
        if (alive.current) setView("login");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inválida");
      if (alive.current) {
        setProducts(data);
        setView("dashboard");
      }
    } catch (err: unknown) {
      console.error("Admin fetch error:", err);
      if (alive.current) {
        const msg = err instanceof DOMException && err.name === "AbortError"
          ? "La conexión tardó demasiado. Intentá de nuevo."
          : "Error al conectar con la base de datos.";
        setErrorMsg(msg);
        setView("error");
      }
    }
  }

  function handleLogin() {
    loadProducts();
  }

  function handleLogout() {
    localStorage.removeItem("admin-token");
    window.location.href = "/";
  }

  async function toggleAvailable(product: Product) {
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": t },
      body: JSON.stringify({ available: !product.available }),
    });
    await loadProducts();
  }

  async function toggleFeatured(product: Product) {
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": t },
      body: JSON.stringify({ featured: !product.featured }),
    });
    await loadProducts();
  }

  async function deleteProduct(product: Product) {
    if (!confirm("¿Eliminar este producto permanentemente?")) return;
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
      headers: { "x-admin-token": t },
    });
    await loadProducts();
  }

  if (view === "login") {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (view === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-2 border-rose-200/30" />
            <div className="absolute inset-0 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-rose-text/40 font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (view === "error") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center liquid-card rounded-3xl p-10 max-w-md">
          <h3 className="text-lg font-bold text-rose-text mb-2">Error</h3>
          <p className="text-sm text-rose-text/40 mb-6">{errorMsg}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleLogout} className="rounded-2xl border border-rose-200/30 bg-white text-rose-text/50 px-5 py-2.5 text-sm font-medium hover:bg-rose-50 transition-all">
              Salir
            </button>
            <button onClick={loadProducts} className="rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-6 py-2.5 text-sm hover:shadow-lg hover:shadow-rose-300/20 transition-all">
              Reintentar
            </button>
          </div>
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
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200/30 bg-white text-rose-text/40 px-5 py-2.5 text-sm font-medium hover:bg-rose-50 hover:text-rose-text transition-all duration-300">
            <LogoutIcon className="w-4 h-4" />
            Salir
          </button>
          <Link href="/admin/nuevo" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-6 py-2.5 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300 text-sm">
            <PlusIcon className="w-4 h-4" />
            Nuevo
          </Link>
        </div>
      </div>

      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: stats.total, color: "bg-rose-100 text-rose-500" },
            { label: "Disponibles", value: stats.available, color: "bg-emerald-100 text-emerald-600" },
            { label: "Destacados", value: stats.featured, color: "bg-amber-100 text-amber-600" },
            { label: "En promo", value: stats.promotions, color: "bg-blue-100 text-blue-600" },
          ].map((stat) => (
            <div key={stat.label} className="liquid-card rounded-2xl p-4 text-center">
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl ${stat.color} flex items-center justify-center text-lg font-bold`}>
                {stat.value}
              </div>
              <p className="text-xs text-rose-text/40 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-24 liquid-card rounded-3xl">
          <BoxIcon className="w-16 h-16 mx-auto mb-6 text-rose-200/40" />
          <h3 className="text-xl font-bold text-rose-text mb-2">Sin productos</h3>
          <p className="text-sm text-rose-text/40 mb-8">Agregá tu primer producto al catálogo</p>
          <Link href="/admin/nuevo" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-8 py-3 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300 text-sm">
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
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-rose-100/20 transition-colors duration-300">
                    <td className="px-6 py-5 font-semibold text-rose-text text-sm">{p.title}</td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      <span className="text-[11px] font-bold text-rose-text/40 bg-rose-100 rounded-full px-3 py-1 uppercase tracking-wider">{p.category}</span>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell text-sm text-rose-text/60 font-semibold">
                      {formatPrice(p.price)}
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-xs text-rose-text/30 line-through ml-2">{formatPrice(p.originalPrice)}</span>
                      )}
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <button onClick={() => toggleAvailable(p)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${p.available ? "bg-rose-300/15 text-rose-500 hover:bg-rose-300/25" : "bg-rose-200/50 text-rose-400 hover:bg-rose-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.available ? "bg-rose-400" : "bg-rose-300"}`} />
                        {p.available ? "Disponible" : "Bajo Pedido"}
                      </button>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <button onClick={() => toggleFeatured(p)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${p.featured ? "bg-rose-300/15 text-rose-400 hover:bg-rose-300/25" : "bg-rose-100/50 text-rose-text/25 hover:bg-rose-100"}`}>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill={p.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        {p.featured ? "Sí" : "No"}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/editar/${p.id}`} className="inline-flex items-center gap-1 text-rose-text/30 hover:text-rose-400 text-xs font-semibold transition-colors duration-300">
                          <PencilIcon className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                        <button onClick={() => deleteProduct(p)} className="inline-flex items-center gap-1 text-danger/30 hover:text-danger text-xs font-semibold transition-colors duration-300">
                          <TrashIcon className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
