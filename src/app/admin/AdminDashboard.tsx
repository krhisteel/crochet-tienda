"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { AdminLogin } from "./AdminLogin";
import {
  PlusIcon,
  LogoutIcon,
  BoxIcon,
  TrashIcon,
  PencilIcon,
  StarIcon,
  MessageIcon,
  CopyIcon,
} from "@/components/Icons";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number | null;
  available: boolean;
  featured: boolean;
  imageUrl: string | null;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  productId: string;
  createdAt: string;
  product: { title: string; imageUrl: string | null };
}

interface ProductStats {
  productId: string;
  avgRating: number | null;
  reviewCount: number;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function fetchWithTimeout(url: string, ms = 15000, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal, ...options });
  } finally {
    clearTimeout(timeout);
  }
}

function StarRating({ rating, size = "w-3.5 h-3.5" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${size} ${i <= rating ? "text-amber-400" : "text-rose-200"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, avgRating: 0 });
  const [productReviewStats, setProductReviewStats] = useState<ProductStats[]>([]);
  const [view, setView] = useState<"login" | "loading" | "dashboard" | "error" | "reviews">("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "unavailable">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkAction, setIsBulkAction] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const alive = useRef(true);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || p.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "available" && p.available) ||
        (filterStatus === "unavailable" && !p.available);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
    return {
      total: products.length,
      available: products.filter((p) => p.available).length,
      featured: products.filter((p) => p.featured).length,
      promotions: products.filter((p) => p.originalPrice && p.originalPrice > p.price).length,
      totalRevenue,
      avgPrice: products.length > 0 ? totalRevenue / products.length : 0,
    };
  }, [products]);

  useEffect(() => {
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      loadProducts();
    }
  }, []);

  const loadProducts = useCallback(async () => {
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
        const msg =
          err instanceof DOMException && err.name === "AbortError"
            ? "La conexión tardó demasiado. Intentá de nuevo."
            : "Error al conectar con la base de datos.";
        setErrorMsg(msg);
        setView("error");
      }
    }
  }, []);

  const loadReviews = useCallback(async () => {
    const t = localStorage.getItem("admin-token") || "";
    try {
      const res = await fetchWithTimeout("/api/admin/reviews", 15000, {
        headers: { "x-admin-token": t },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (alive.current) {
        setReviews(data.reviews || []);
        setReviewStats(data.stats || { totalReviews: 0, avgRating: 0 });
        setProductReviewStats(data.productStats || []);
      }
    } catch (err) {
      console.error("Reviews fetch error:", err);
    }
  }, []);

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
    if (!confirm(`¿Eliminar "${product.title}" permanentemente?`)) return;
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
      headers: { "x-admin-token": t },
    });
    await loadProducts();
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  }

  async function bulkToggleAvailable() {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    const t = localStorage.getItem("admin-token") || "";
    const allAvailable = filteredProducts
      .filter((p) => selectedIds.has(p.id))
      .every((p) => p.available);

    await Promise.all(
      Array.from(selectedIds).map((id) =>
        fetch(`/api/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-token": t },
          body: JSON.stringify({ available: !allAvailable }),
        })
      )
    );
    setSelectedIds(new Set());
    setBulkLoading(false);
    await loadProducts();
  }

  async function bulkToggleFeatured() {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    const t = localStorage.getItem("admin-token") || "";
    const allFeatured = filteredProducts
      .filter((p) => selectedIds.has(p.id))
      .every((p) => p.featured);

    await Promise.all(
      Array.from(selectedIds).map((id) =>
        fetch(`/api/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-token": t },
          body: JSON.stringify({ featured: !allFeatured }),
        })
      )
    );
    setSelectedIds(new Set());
    setBulkLoading(false);
    await loadProducts();
  }

  async function bulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`¿Eliminar ${selectedIds.size} producto(s) permanentemente?`)) return;
    setBulkLoading(true);
    const t = localStorage.getItem("admin-token") || "";

    await Promise.all(
      Array.from(selectedIds).map((id) =>
        fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: { "x-admin-token": t },
        })
      )
    );
    setSelectedIds(new Set());
    setBulkLoading(false);
    await loadProducts();
  }

  async function deleteReview(reviewId: string) {
    if (!confirm("¿Eliminar esta reseña?")) return;
    setDeletingReviewId(reviewId);
    const t = localStorage.getItem("admin-token") || "";
    try {
      await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "DELETE",
        headers: { "x-admin-token": t },
      });
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      await loadReviews();
    } finally {
      setDeletingReviewId(null);
    }
  }

  function openReviews() {
    setView("reviews");
    loadReviews();
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
            <button
              onClick={handleLogout}
              className="rounded-2xl border border-rose-200/30 bg-white text-rose-text/50 px-5 py-2.5 text-sm font-medium hover:bg-rose-50 transition-all"
            >
              Salir
            </button>
            <button
              onClick={loadProducts}
              className="rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-6 py-2.5 text-sm hover:shadow-lg hover:shadow-rose-300/20 transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "reviews") {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <button
              onClick={() => setView("dashboard")}
              className="inline-flex items-center gap-1.5 text-sm text-rose-text/40 hover:text-rose-400 transition-colors mb-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Volver al panel
            </button>
            <h1 className="text-3xl font-bold text-rose-text">Reseñas</h1>
            <p className="text-sm text-rose-text/40 mt-1">
              {reviewStats.totalReviews} reseña{reviewStats.totalReviews !== 1 ? "s" : ""} en total
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-24 liquid-card rounded-3xl">
            <MessageIcon className="w-16 h-16 mx-auto mb-6 text-rose-200/40" />
            <h3 className="text-xl font-bold text-rose-text mb-2">Sin reseñas</h3>
            <p className="text-sm text-rose-text/40">Aún no hay reseñas de clientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="liquid-card rounded-2xl p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-rose-text truncate">{review.name}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="w-3 h-3" />
                          <span className="text-[11px] text-rose-text/30">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-rose-text/60 leading-relaxed mt-2 ml-12">{review.comment}</p>
                    <p className="text-[11px] text-rose-text/25 mt-2 ml-12">
                      sobre: <span className="font-medium text-rose-text/40">{review.product.title}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteReview(review.id)}
                    disabled={deletingReviewId === review.id}
                    className="text-rose-text/20 hover:text-danger transition-colors disabled:opacity-50 shrink-0"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
            onClick={openReviews}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200/30 bg-white text-rose-text/40 px-5 py-2.5 text-sm font-medium hover:bg-rose-50 hover:text-rose-text transition-all duration-300"
          >
            <MessageIcon className="w-4 h-4" />
            Reseñas
          </button>
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

      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "bg-rose-100 text-rose-500",
              icon: <BoxIcon className="w-4 h-4" />,
            },
            {
              label: "Disponibles",
              value: stats.available,
              color: "bg-emerald-100 text-emerald-600",
              icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>,
            },
            {
              label: "Destacados",
              value: stats.featured,
              color: "bg-amber-100 text-amber-600",
              icon: <StarIcon className="w-4 h-4" />,
            },
            {
              label: "En promo",
              value: stats.promotions,
              color: "bg-blue-100 text-blue-600",
              icon: <CopyIcon className="w-4 h-4" />,
            },
            {
              label: "Reseñas",
              value: reviewStats.totalReviews,
              color: "bg-purple-100 text-purple-600",
              icon: <MessageIcon className="w-4 h-4" />,
            },
            {
              label: "Precio prom.",
              value: formatPrice(stats.avgPrice),
              color: "bg-rose-100 text-rose-500",
              icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
            },
          ].map((stat) => (
            <div key={stat.label} className="liquid-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-xl font-bold text-rose-text">{stat.value}</p>
              <p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-text/25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-rose-200/30 text-sm text-rose-text placeholder:text-rose-text/25 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-text/25 hover:text-rose-text/50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white border border-rose-200/30 text-sm text-rose-text focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-4 py-2.5 rounded-xl bg-white border border-rose-200/30 text-sm text-rose-text focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="unavailable">Bajo pedido</option>
            </select>
          </div>
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm font-medium text-rose-text">
            {selectedIds.size} seleccionado{selectedIds.size !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={bulkToggleAvailable}
              disabled={bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-rose-200/30 text-rose-text/60 px-3.5 py-1.5 text-xs font-semibold hover:bg-rose-100 transition-all disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              Cambiar disponibilidad
            </button>
            <button
              onClick={bulkToggleFeatured}
              disabled={bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-rose-200/30 text-rose-text/60 px-3.5 py-1.5 text-xs font-semibold hover:bg-rose-100 transition-all disabled:opacity-50"
            >
              <StarIcon className="w-3.5 h-3.5" />
              Cambiar destacado
            </button>
            <button
              onClick={bulkDelete}
              disabled={bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-danger/20 text-danger/60 px-3.5 py-1.5 text-xs font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              Eliminar
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="inline-flex items-center gap-1.5 rounded-xl text-rose-text/30 px-3.5 py-1.5 text-xs font-semibold hover:text-rose-text/50 transition-all"
            >
              Deseleccionar
            </button>
          </div>
        </div>
      )}

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
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 liquid-card rounded-3xl">
          <svg className="w-16 h-16 mx-auto mb-6 text-rose-200/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h3 className="text-xl font-bold text-rose-text mb-2">Sin resultados</h3>
          <p className="text-sm text-rose-text/40">No se encontraron productos con esos filtros</p>
        </div>
      ) : (
        <div className="liquid-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-100/30 border-b border-rose-200/20">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-rose-300 text-rose-400 focus:ring-rose-200 cursor-pointer accent-[#C06E86]"
                    />
                  </th>
                  <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Producto</th>
                  <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden lg:table-cell">Categoría</th>
                  <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden lg:table-cell">Precio</th>
                  <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden xl:table-cell">Reseñas</th>
                  <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Estado</th>
                  <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Destacado</th>
                  <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-200/15">
                {filteredProducts.map((p) => {
                  const pStats = productReviewStats.find((s) => s.productId === p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-rose-100/20 transition-colors duration-300 ${
                        selectedIds.has(p.id) ? "bg-rose-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="w-4 h-4 rounded border-rose-300 text-rose-400 focus:ring-rose-200 cursor-pointer accent-[#C06E86]"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-rose-100 border border-rose-200/30 shrink-0">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BoxIcon className="w-5 h-5 text-rose-200" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-rose-text text-sm truncate max-w-[180px]">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-[11px] font-bold text-rose-text/40 bg-rose-100 rounded-full px-3 py-1 uppercase tracking-wider">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-sm text-rose-text/60 font-semibold">
                        {formatPrice(p.price)}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-rose-text/30 line-through ml-2">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        {pStats ? (
                          <div className="flex items-center gap-2">
                            <StarRating rating={Math.round(pStats.avgRating || 0)} size="w-3 h-3" />
                            <span className="text-xs text-rose-text/40 font-medium">
                              ({pStats.reviewCount})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-rose-text/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <button
                          onClick={() => toggleAvailable(p)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                            p.available
                              ? "bg-rose-300/15 text-rose-500 hover:bg-rose-300/25"
                              : "bg-rose-200/50 text-rose-400 hover:bg-rose-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.available ? "bg-rose-400" : "bg-rose-300"}`} />
                          {p.available ? "Disponible" : "Bajo Pedido"}
                        </button>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                            p.featured
                              ? "bg-rose-300/15 text-rose-400 hover:bg-rose-300/25"
                              : "bg-rose-100/50 text-rose-text/25 hover:bg-rose-100"
                          }`}
                        >
                          <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill={p.featured ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          {p.featured ? "Sí" : "No"}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/editar/${p.id}`}
                            className="inline-flex items-center gap-1 text-rose-text/30 hover:text-rose-400 text-xs font-semibold transition-colors duration-300"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                            Editar
                          </Link>
                          <button
                            onClick={() => deleteProduct(p)}
                            className="inline-flex items-center gap-1 text-danger/30 hover:text-danger text-xs font-semibold transition-colors duration-300"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
