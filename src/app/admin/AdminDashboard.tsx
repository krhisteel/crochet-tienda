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

type AdminView = "login" | "loading" | "dashboard" | "error" | "reviews" | "materials" | "sales" | "production";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number | null;
  available: boolean;
  featured: boolean;
  imageUrl: string | null;
  stock: number;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  productId: string | null;
  createdAt: string;
  product: { title: string; imageUrl: string | null } | null;
}

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPerUnit: number | null;
  supplier: string | null;
  notes: string | null;
}

interface Sale {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  channel: string;
  customerName: string | null;
  notes: string | null;
  soldAt: string;
}

interface ProductionTask {
  id: string;
  productName: string;
  quantity: number;
  priority: string;
  status: string;
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
}

interface ProductStats {
  productId: string;
  avgRating: number | null;
  reviewCount: number;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
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
        <svg key={i} className={`${size} ${i <= rating ? "text-amber-400" : "text-rose-200"}`} viewBox="0 0 24 24" fill="currentColor">
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
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialStats, setMaterialStats] = useState({ total: 0, totalValue: 0, lowStockCount: 0 });
  const [sales, setSales] = useState<Sale[]>([]);
  const [saleStats, setSaleStats] = useState({ totalRevenue: 0, totalQuantity: 0, totalSales: 0, avgSale: 0 });
  const [salesByCategory, setSalesByCategory] = useState<{ category: string; revenue: number; quantity: number; count: number }[]>([]);
  const [tasks, setTasks] = useState<ProductionTask[]>([]);
  const [taskStats, setTaskStats] = useState({ total: 0, pendiente: 0, enProgreso: 0, completada: 0 });
  const [view, setView] = useState<AdminView>("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "unavailable">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [salesPeriod, setSalesPeriod] = useState<"all" | "month" | "week">("all");

  // Material form
  const [matForm, setMatForm] = useState({ name: "", category: "Hilo", quantity: 0, unit: "rollos", minStock: 5, costPerUnit: 0, supplier: "", notes: "" });
  const [matEditing, setMatEditing] = useState<string | null>(null);

  // Sale form
  const [saleForm, setSaleForm] = useState({ productName: "", category: "Amigurumis", quantity: 1, unitPrice: 0, channel: "whatsapp", customerName: "", notes: "", soldAt: "" });
  const [saleEditing, setSaleEditing] = useState<string | null>(null);

  // Task form
  const [taskForm, setTaskForm] = useState({ productName: "", quantity: 1, priority: "normal", status: "pendiente", dueDate: "", notes: "" });
  const [taskEditing, setTaskEditing] = useState<string | null>(null);

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
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    };
  }, [products]);

  useEffect(() => { return () => { alive.current = false; }; }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) loadProducts();
  }, []);

  const loadProducts = useCallback(async () => {
    setView("loading");
    const t = localStorage.getItem("admin-token") || "";
    try {
      const res = await fetchWithTimeout("/api/products?admin=true", 15000, { headers: { "x-admin-token": t } });
      if (res.status === 401) { localStorage.removeItem("admin-token"); if (alive.current) setView("login"); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inválida");
      if (alive.current) { setProducts(data); setView("dashboard"); }
    } catch (err: unknown) {
      if (alive.current) {
        setErrorMsg(err instanceof DOMException && err.name === "AbortError" ? "Conexión tardó demasiado." : "Error al conectar.");
        setView("error");
      }
    }
  }, []);

  const loadReviews = useCallback(async () => {
    const t = localStorage.getItem("admin-token") || "";
    try {
      const res = await fetchWithTimeout("/api/admin/reviews", 15000, { headers: { "x-admin-token": t } });
      if (!res.ok) return;
      const data = await res.json();
      if (alive.current) { setReviews(data.reviews || []); setReviewStats(data.stats || { totalReviews: 0, avgRating: 0 }); setProductReviewStats(data.productStats || []); }
    } catch {}
  }, []);

  const loadMaterials = useCallback(async () => {
    const t = localStorage.getItem("admin-token") || "";
    try {
      const res = await fetchWithTimeout("/api/admin/materials", 15000, { headers: { "x-admin-token": t } });
      if (!res.ok) return;
      const data = await res.json();
      if (alive.current) { setMaterials(data.materials || []); setMaterialStats(data.stats || { total: 0, totalValue: 0, lowStockCount: 0 }); }
    } catch {}
  }, []);

  const loadSales = useCallback(async () => {
    const t = localStorage.getItem("admin-token") || "";
    try {
      const res = await fetchWithTimeout(`/api/admin/sales?period=${salesPeriod}`, 15000, { headers: { "x-admin-token": t } });
      if (!res.ok) return;
      const data = await res.json();
      if (alive.current) { setSales(data.sales || []); setSaleStats(data.stats || { totalRevenue: 0, totalQuantity: 0, totalSales: 0, avgSale: 0 }); setSalesByCategory(data.byCategory || []); }
    } catch {}
  }, [salesPeriod]);

  const loadTasks = useCallback(async () => {
    const t = localStorage.getItem("admin-token") || "";
    try {
      const res = await fetchWithTimeout("/api/admin/production", 15000, { headers: { "x-admin-token": t } });
      if (!res.ok) return;
      const data = await res.json();
      if (alive.current) { setTasks(data.tasks || []); setTaskStats(data.stats || { total: 0, pendiente: 0, enProgreso: 0, completada: 0 }); }
    } catch {}
  }, []);

  useEffect(() => { if (view === "sales") loadSales(); }, [view, salesPeriod, loadSales]);

  function handleLogin() { loadProducts(); }
  function handleLogout() { localStorage.removeItem("admin-token"); window.location.href = "/"; }

  async function toggleAvailable(product: Product) {
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": t }, body: JSON.stringify({ available: !product.available }) });
    await loadProducts();
  }

  async function toggleFeatured(product: Product) {
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/products/${product.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": t }, body: JSON.stringify({ featured: !product.featured }) });
    await loadProducts();
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`¿Eliminar "${product.title}"?`)) return;
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/products/${product.id}`, { method: "DELETE", headers: { "x-admin-token": t } });
    await loadProducts();
  }

  function toggleSelect(id: string) { setSelectedIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }
  function toggleSelectAll() { setSelectedIds(selectedIds.size === filteredProducts.length ? new Set() : new Set(filteredProducts.map((p) => p.id))); }

  async function bulkToggleAvailable() {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    const t = localStorage.getItem("admin-token") || "";
    const allAvail = filteredProducts.filter((p) => selectedIds.has(p.id)).every((p) => p.available);
    await Promise.all(Array.from(selectedIds).map((id) => fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": t }, body: JSON.stringify({ available: !allAvail }) })));
    setSelectedIds(new Set()); setBulkLoading(false); await loadProducts();
  }

  async function bulkToggleFeatured() {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    const t = localStorage.getItem("admin-token") || "";
    const allFeat = filteredProducts.filter((p) => selectedIds.has(p.id)).every((p) => p.featured);
    await Promise.all(Array.from(selectedIds).map((id) => fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": t }, body: JSON.stringify({ featured: !allFeat }) })));
    setSelectedIds(new Set()); setBulkLoading(false); await loadProducts();
  }

  async function bulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`¿Eliminar ${selectedIds.size} producto(s)?`)) return;
    setBulkLoading(true);
    const t = localStorage.getItem("admin-token") || "";
    await Promise.all(Array.from(selectedIds).map((id) => fetch(`/api/products/${id}`, { method: "DELETE", headers: { "x-admin-token": t } })));
    setSelectedIds(new Set()); setBulkLoading(false); await loadProducts();
  }

  async function deleteReview(id: string) {
    if (!confirm("¿Eliminar reseña?")) return;
    setDeletingReviewId(id);
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE", headers: { "x-admin-token": t } });
    setReviews((p) => p.filter((r) => r.id !== id)); setDeletingReviewId(null); await loadReviews();
  }

  // Materials CRUD
  async function saveMaterial() {
    const t = localStorage.getItem("admin-token") || "";
    const body = matEditing ? { id: matEditing, ...matForm } : matForm;
    await fetch("/api/admin/materials", { method: matEditing ? "PATCH" : "POST", headers: { "Content-Type": "application/json", "x-admin-token": t }, body: JSON.stringify(body) });
    setMatForm({ name: "", category: "Hilo", quantity: 0, unit: "rollos", minStock: 5, costPerUnit: 0, supplier: "", notes: "" });
    setMatEditing(null); await loadMaterials();
  }

  async function deleteMaterial(id: string) {
    if (!confirm("¿Eliminar material?")) return;
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/admin/materials?id=${id}`, { method: "DELETE", headers: { "x-admin-token": t } });
    await loadMaterials();
  }

  // Sales CRUD
  async function saveSale() {
    const t = localStorage.getItem("admin-token") || "";
    await fetch("/api/admin/sales", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": t }, body: JSON.stringify(saleForm) });
    setSaleForm({ productName: "", category: "Amigurumis", quantity: 1, unitPrice: 0, channel: "whatsapp", customerName: "", notes: "", soldAt: "" });
    await loadSales();
  }

  async function deleteSale(id: string) {
    if (!confirm("¿Eliminar venta?")) return;
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/admin/sales?id=${id}`, { method: "DELETE", headers: { "x-admin-token": t } });
    await loadSales();
  }

  // Tasks CRUD
  async function saveTask() {
    const t = localStorage.getItem("admin-token") || "";
    const body = taskEditing ? { id: taskEditing, ...taskForm } : taskForm;
    await fetch("/api/admin/production", { method: taskEditing ? "PATCH" : "POST", headers: { "Content-Type": "application/json", "x-admin-token": t }, body: JSON.stringify(body) });
    setTaskForm({ productName: "", quantity: 1, priority: "normal", status: "pendiente", dueDate: "", notes: "" });
    setTaskEditing(null); await loadTasks();
  }

  async function deleteTask(id: string) {
    if (!confirm("¿Eliminar tarea?")) return;
    const t = localStorage.getItem("admin-token") || "";
    await fetch(`/api/admin/production?id=${id}`, { method: "DELETE", headers: { "x-admin-token": t } });
    await loadTasks();
  }

  function switchView(v: AdminView) {
    setView(v);
    if (v === "reviews") loadReviews();
    if (v === "materials") loadMaterials();
    if (v === "sales") loadSales();
    if (v === "production") loadTasks();
  }

  if (view === "login") return <AdminLogin onLogin={handleLogin} />;

  if (view === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-2 border-rose-200/30" />
            <div className="absolute inset-0 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-rose-text/40 font-medium">Cargando...</p>
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
            <button onClick={handleLogout} className="rounded-2xl border border-rose-200/30 bg-white text-rose-text/50 px-5 py-2.5 text-sm font-medium hover:bg-rose-50 transition-all">Salir</button>
            <button onClick={loadProducts} className="rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-6 py-2.5 text-sm hover:shadow-lg hover:shadow-rose-300/20 transition-all">Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  const navTabs = [
    { id: "dashboard" as AdminView, label: "Productos", icon: <BoxIcon className="w-4 h-4" /> },
    { id: "reviews" as AdminView, label: "Reseñas", icon: <MessageIcon className="w-4 h-4" /> },
    { id: "materials" as AdminView, label: "Materiales", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg> },
    { id: "sales" as AdminView, label: "Ventas", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg> },
    { id: "production" as AdminView, label: "Producción", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg> },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-rose-text">Administración</h1>
          <p className="text-sm text-rose-text/40 mt-1">{products.length} producto{products.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200/30 bg-white text-rose-text/40 px-5 py-2.5 text-sm font-medium hover:bg-rose-50 hover:text-rose-text transition-all">
            <LogoutIcon className="w-4 h-4" /> Salir
          </button>
          {view === "dashboard" && (
            <Link href="/admin/nuevo" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-6 py-2.5 hover:shadow-lg hover:shadow-rose-300/20 transition-all text-sm">
              <PlusIcon className="w-4 h-4" /> Nuevo
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchView(tab.id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
              view === tab.id
                ? "bg-gradient-to-r from-rose-300 to-rose-400 text-white shadow-md shadow-rose-300/20"
                : "bg-white border border-rose-200/30 text-rose-text/40 hover:bg-rose-50 hover:text-rose-text"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ============ DASHBOARD / PRODUCTS ============ */}
      {view === "dashboard" && (
        <>
          {products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-10">
              {[
                { label: "Total", value: stats.total, color: "bg-rose-100 text-rose-500", icon: <BoxIcon className="w-4 h-4" /> },
                { label: "Disponibles", value: stats.available, color: "bg-emerald-100 text-emerald-600", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> },
                { label: "Destacados", value: stats.featured, color: "bg-amber-100 text-amber-600", icon: <StarIcon className="w-4 h-4" /> },
                { label: "En promo", value: stats.promotions, color: "bg-blue-100 text-blue-600", icon: <CopyIcon className="w-4 h-4" /> },
                { label: "Reseñas", value: reviewStats.totalReviews, color: "bg-purple-100 text-purple-600", icon: <MessageIcon className="w-4 h-4" /> },
                { label: "Stock total", value: stats.totalStock, color: "bg-rose-100 text-rose-500", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg> },
                { label: "P. promedio", value: formatPrice(stats.avgPrice), color: "bg-rose-100 text-rose-500", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg> },
              ].map((s) => (
                <div key={s.label} className="liquid-card rounded-2xl p-4">
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>{s.icon}</div>
                  <p className="text-xl font-bold text-rose-text">{s.value}</p>
                  <p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-text/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="text" placeholder="Buscar producto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-rose-200/30 text-sm text-rose-text placeholder:text-rose-text/25 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200/20 transition-all" />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-text/25 hover:text-rose-text/50"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>}
              </div>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white border border-rose-200/30 text-sm text-rose-text focus:outline-none focus:border-rose-300 appearance-none cursor-pointer">
                <option value="all">Todas las categorías</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="px-4 py-2.5 rounded-xl bg-white border border-rose-200/30 text-sm text-rose-text focus:outline-none focus:border-rose-300 appearance-none cursor-pointer">
                <option value="all">Todos los estados</option>
                <option value="available">Disponible</option>
                <option value="unavailable">Bajo pedido</option>
              </select>
            </div>
          </div>

          {selectedIds.size > 0 && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm font-medium text-rose-text">{selectedIds.size} seleccionado{selectedIds.size !== 1 ? "s" : ""}</span>
              <div className="flex gap-2 flex-wrap">
                <button onClick={bulkToggleAvailable} disabled={bulkLoading} className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-rose-200/30 text-rose-text/60 px-3.5 py-1.5 text-xs font-semibold hover:bg-rose-100 transition-all disabled:opacity-50">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg> Disponibilidad
                </button>
                <button onClick={bulkToggleFeatured} disabled={bulkLoading} className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-rose-200/30 text-rose-text/60 px-3.5 py-1.5 text-xs font-semibold hover:bg-rose-100 transition-all disabled:opacity-50">
                  <StarIcon className="w-3.5 h-3.5" /> Destacado
                </button>
                <button onClick={bulkDelete} disabled={bulkLoading} className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-danger/20 text-danger/60 px-3.5 py-1.5 text-xs font-semibold hover:bg-red-50 transition-all disabled:opacity-50">
                  <TrashIcon className="w-3.5 h-3.5" /> Eliminar
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="text-rose-text/30 px-3.5 py-1.5 text-xs font-semibold hover:text-rose-text/50">Deseleccionar</button>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-24 liquid-card rounded-3xl">
              <BoxIcon className="w-16 h-16 mx-auto mb-6 text-rose-200/40" />
              <h3 className="text-xl font-bold text-rose-text mb-2">Sin productos</h3>
              <p className="text-sm text-rose-text/40 mb-8">Agregá tu primer producto al catálogo</p>
              <Link href="/admin/nuevo" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-8 py-3 hover:shadow-lg hover:shadow-rose-300/20 transition-all text-sm">
                <PlusIcon className="w-4 h-4" /> Agregar producto
              </Link>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 liquid-card rounded-3xl">
              <svg className="w-16 h-16 mx-auto mb-6 text-rose-200/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <h3 className="text-xl font-bold text-rose-text mb-2">Sin resultados</h3>
              <p className="text-sm text-rose-text/40">No se encontraron productos con esos filtros</p>
            </div>
          ) : (
            <div className="liquid-card rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-rose-100/30 border-b border-rose-200/20">
                    <tr>
                      <th className="px-4 py-4 w-10"><input type="checkbox" checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-rose-300 accent-[#C06E86] cursor-pointer" /></th>
                      <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Producto</th>
                      <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden lg:table-cell">Categoría</th>
                      <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden lg:table-cell">Precio</th>
                      <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden xl:table-cell">Stock</th>
                      <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Estado</th>
                      <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Destacado</th>
                      <th className="px-4 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-200/15">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className={`hover:bg-rose-100/20 transition-colors ${selectedIds.has(p.id) ? "bg-rose-50/50" : ""}`}>
                        <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} className="w-4 h-4 rounded border-rose-300 accent-[#C06E86] cursor-pointer" /></td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-rose-100 border border-rose-200/30 shrink-0">
                              {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BoxIcon className="w-5 h-5 text-rose-200" /></div>}
                            </div>
                            <span className="font-semibold text-rose-text text-sm truncate max-w-[180px]">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell"><span className="text-[11px] font-bold text-rose-text/40 bg-rose-100 rounded-full px-3 py-1 uppercase tracking-wider">{p.category}</span></td>
                        <td className="px-4 py-4 hidden lg:table-cell text-sm text-rose-text/60 font-semibold">
                          {formatPrice(p.price)}
                          {p.originalPrice && p.originalPrice > p.price && <span className="text-xs text-rose-text/30 line-through ml-2">{formatPrice(p.originalPrice)}</span>}
                        </td>
                        <td className="px-4 py-4 hidden xl:table-cell">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${p.stock > 5 ? "bg-emerald-100 text-emerald-600" : p.stock > 0 ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-500"}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <button onClick={() => toggleAvailable(p)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${p.available ? "bg-rose-300/15 text-rose-500 hover:bg-rose-300/25" : "bg-rose-200/50 text-rose-400 hover:bg-rose-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.available ? "bg-rose-400" : "bg-rose-300"}`} />
                            {p.available ? "Disponible" : "Bajo Pedido"}
                          </button>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <button onClick={() => toggleFeatured(p)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${p.featured ? "bg-rose-300/15 text-rose-400 hover:bg-rose-300/25" : "bg-rose-100/50 text-rose-text/25 hover:bg-rose-100"}`}>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill={p.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            {p.featured ? "Sí" : "No"}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link href={`/admin/editar/${p.id}`} className="inline-flex items-center gap-1 text-rose-text/30 hover:text-rose-400 text-xs font-semibold transition-colors"><PencilIcon className="w-3.5 h-3.5" /> Editar</Link>
                            <button onClick={() => deleteProduct(p)} className="inline-flex items-center gap-1 text-danger/30 hover:text-danger text-xs font-semibold transition-colors"><TrashIcon className="w-3.5 h-3.5" /> Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============ REVIEWS ============ */}
      {view === "reviews" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{reviewStats.totalReviews}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Total reseñas</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{reviewStats.avgRating ? reviewStats.avgRating.toFixed(1) : "—"}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Rating promedio</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{products.length}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Productos</p></div>
          </div>
          {reviews.length === 0 ? (
            <div className="text-center py-24 liquid-card rounded-3xl"><MessageIcon className="w-16 h-16 mx-auto mb-6 text-rose-200/40" /><h3 className="text-xl font-bold text-rose-text mb-2">Sin reseñas</h3></div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="liquid-card rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex items-center justify-center text-sm font-bold text-white shrink-0">{r.name.charAt(0).toUpperCase()}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-rose-text truncate">{r.name}</p>
                          <div className="flex items-center gap-2"><StarRating rating={r.rating} size="w-3 h-3" /><span className="text-[11px] text-rose-text/30">{formatDate(r.createdAt)}</span></div>
                        </div>
                      </div>
                      <p className="text-sm text-rose-text/60 leading-relaxed mt-2 ml-12">{r.comment}</p>
                      {r.product && <p className="text-[11px] text-rose-text/25 mt-2 ml-12">sobre: <span className="font-medium text-rose-text/40">{r.product.title}</span></p>}
                    </div>
                    <button onClick={() => deleteReview(r.id)} disabled={deletingReviewId === r.id} className="text-rose-text/20 hover:text-danger transition-colors disabled:opacity-50 shrink-0"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============ MATERIALS ============ */}
      {view === "materials" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{materialStats.total}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Materiales</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{formatPrice(materialStats.totalValue)}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Valor total</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className={`text-2xl font-bold ${materialStats.lowStockCount > 0 ? "text-red-500" : "text-rose-text"}`}>{materialStats.lowStockCount}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Stock bajo</p></div>
          </div>

          <div className="liquid-card rounded-3xl p-6 mb-8">
            <h3 className="text-sm font-bold text-rose-text mb-4">{matEditing ? "Editar material" : "Agregar material"}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input placeholder="Nombre" value={matForm.name} onChange={(e) => setMatForm({ ...matForm, name: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <select value={matForm.category} onChange={(e) => setMatForm({ ...matForm, category: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 appearance-none">
                <option>Hilo</option><option>Botones</option><option>Alfileres</option><option>Herramientas</option><option>Otros</option>
              </select>
              <input type="number" placeholder="Cantidad" value={matForm.quantity || ""} onChange={(e) => setMatForm({ ...matForm, quantity: Number(e.target.value) })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input placeholder="Unidad" value={matForm.unit} onChange={(e) => setMatForm({ ...matForm, unit: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input type="number" placeholder="Stock mín." value={matForm.minStock || ""} onChange={(e) => setMatForm({ ...matForm, minStock: Number(e.target.value) })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input type="number" placeholder="Costo unit." value={matForm.costPerUnit || ""} onChange={(e) => setMatForm({ ...matForm, costPerUnit: Number(e.target.value) })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input placeholder="Proveedor" value={matForm.supplier} onChange={(e) => setMatForm({ ...matForm, supplier: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <div className="flex gap-2">
                <button onClick={saveMaterial} disabled={!matForm.name} className="flex-1 rounded-xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold py-2.5 text-sm hover:shadow-lg hover:shadow-rose-300/20 transition-all disabled:opacity-40">{matEditing ? "Guardar" : "Agregar"}</button>
                {matEditing && <button onClick={() => { setMatEditing(null); setMatForm({ name: "", category: "Hilo", quantity: 0, unit: "rollos", minStock: 5, costPerUnit: 0, supplier: "", notes: "" }); }} className="rounded-xl border border-rose-200/30 px-3 py-2.5 text-sm text-rose-text/40 hover:bg-rose-50">Cancelar</button>}
              </div>
            </div>
          </div>

          {materials.length === 0 ? (
            <div className="text-center py-16 liquid-card rounded-3xl"><p className="text-rose-text/40">Sin materiales registrados</p></div>
          ) : (
            <div className="liquid-card rounded-3xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-rose-100/30 border-b border-rose-200/20">
                  <tr>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Material</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden sm:table-cell">Categoría</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Cantidad</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Mín.</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Estado</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden lg:table-cell">Proveedor</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-200/15">
                  {materials.map((m) => (
                    <tr key={m.id} className="hover:bg-rose-100/20 transition-colors">
                      <td className="px-5 py-4 font-semibold text-rose-text">{m.name}</td>
                      <td className="px-5 py-4 hidden sm:table-cell"><span className="text-[11px] font-bold text-rose-text/40 bg-rose-100 rounded-full px-3 py-1 uppercase tracking-wider">{m.category}</span></td>
                      <td className="px-5 py-4 font-semibold text-rose-text">{m.quantity} <span className="text-rose-text/30 text-xs">{m.unit}</span></td>
                      <td className="px-5 py-4 hidden md:table-cell text-rose-text/50">{m.minStock}</td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${m.quantity <= m.minStock ? "bg-red-100 text-red-500" : "bg-emerald-100 text-emerald-600"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${m.quantity <= m.minStock ? "bg-red-400" : "bg-emerald-400"}`} />
                          {m.quantity <= m.minStock ? "Bajo" : "OK"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-rose-text/40 text-xs">{m.supplier || "—"}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => { setMatEditing(m.id); setMatForm({ name: m.name, category: m.category, quantity: m.quantity, unit: m.unit, minStock: m.minStock, costPerUnit: m.costPerUnit || 0, supplier: m.supplier || "", notes: m.notes || "" }); }} className="text-rose-text/30 hover:text-rose-400 transition-colors"><PencilIcon className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteMaterial(m.id)} className="text-danger/30 hover:text-danger transition-colors"><TrashIcon className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ============ SALES ============ */}
      {view === "sales" && (
        <>
          <div className="flex items-center gap-3 mb-8">
            {(["all", "month", "week"] as const).map((p) => (
              <button key={p} onClick={() => setSalesPeriod(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${salesPeriod === p ? "bg-gradient-to-r from-rose-300 to-rose-400 text-white shadow-md shadow-rose-300/20" : "bg-white border border-rose-200/30 text-rose-text/40 hover:bg-rose-50"}`}>
                {p === "all" ? "Todo" : p === "month" ? "Este mes" : "Esta semana"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{formatPrice(saleStats.totalRevenue)}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Ingresos</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{saleStats.totalSales}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Ventas</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{saleStats.totalQuantity}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Unidades</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{formatPrice(saleStats.avgSale)}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Venta promedio</p></div>
          </div>

          {salesByCategory.length > 0 && (
            <div className="liquid-card rounded-3xl p-6 mb-8">
              <h3 className="text-sm font-bold text-rose-text mb-4">Por categoría</h3>
              <div className="space-y-3">
                {salesByCategory.map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-rose-text/40 bg-rose-100 rounded-full px-3 py-1 uppercase tracking-wider">{c.category}</span>
                      <span className="text-xs text-rose-text/30">{c.count} venta{c.count !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="text-sm font-bold text-rose-text">{formatPrice(c.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="liquid-card rounded-3xl p-6 mb-8">
            <h3 className="text-sm font-bold text-rose-text mb-4">Registrar venta</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input placeholder="Producto" value={saleForm.productName} onChange={(e) => setSaleForm({ ...saleForm, productName: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <select value={saleForm.category} onChange={(e) => setSaleForm({ ...saleForm, category: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 appearance-none">
                <option>Amigurumis</option><option>Ropa</option><option>Accesorios</option><option>Patrones</option><option>Promociones</option>
              </select>
              <input type="number" placeholder="Cantidad" value={saleForm.quantity || ""} onChange={(e) => setSaleForm({ ...saleForm, quantity: Number(e.target.value) })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input type="number" placeholder="Precio unitario" value={saleForm.unitPrice || ""} onChange={(e) => setSaleForm({ ...saleForm, unitPrice: Number(e.target.value) })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input placeholder="Cliente (opc.)" value={saleForm.customerName} onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input type="date" value={saleForm.soldAt} onChange={(e) => setSaleForm({ ...saleForm, soldAt: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <button onClick={saveSale} disabled={!saleForm.productName || !saleForm.unitPrice} className="rounded-xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold py-2.5 text-sm hover:shadow-lg hover:shadow-rose-300/20 transition-all disabled:opacity-40">Registrar</button>
            </div>
          </div>

          {sales.length === 0 ? (
            <div className="text-center py-16 liquid-card rounded-3xl"><p className="text-rose-text/40">Sin ventas registradas</p></div>
          ) : (
            <div className="liquid-card rounded-3xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-rose-100/30 border-b border-rose-200/20">
                  <tr>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Producto</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden sm:table-cell">Cliente</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Cant.</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden md:table-cell">Canal</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest">Total</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest hidden lg:table-cell">Fecha</th>
                    <th className="px-5 py-4 font-bold text-rose-text/40 text-[11px] uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-200/15">
                  {sales.map((s) => (
                    <tr key={s.id} className="hover:bg-rose-100/20 transition-colors">
                      <td className="px-5 py-4 font-semibold text-rose-text">{s.productName}</td>
                      <td className="px-5 py-4 hidden sm:table-cell text-rose-text/50">{s.customerName || "—"}</td>
                      <td className="px-5 py-4 font-semibold text-rose-text">{s.quantity}</td>
                      <td className="px-5 py-4 hidden md:table-cell"><span className="text-[11px] font-bold text-rose-text/40 bg-rose-100 rounded-full px-3 py-1 uppercase tracking-wider">{s.channel}</span></td>
                      <td className="px-5 py-4 font-bold text-rose-text">{formatPrice(s.totalPrice)}</td>
                      <td className="px-5 py-4 hidden lg:table-cell text-rose-text/40 text-xs">{formatDate(s.soldAt)}</td>
                      <td className="px-5 py-4 text-right"><button onClick={() => deleteSale(s.id)} className="text-danger/30 hover:text-danger transition-colors"><TrashIcon className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ============ PRODUCTION ============ */}
      {view === "production" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-rose-text">{taskStats.total}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Total</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-amber-500">{taskStats.pendiente}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Pendientes</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-blue-500">{taskStats.enProgreso}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">En progreso</p></div>
            <div className="liquid-card rounded-2xl p-4"><p className="text-2xl font-bold text-emerald-500">{taskStats.completada}</p><p className="text-[11px] text-rose-text/35 font-semibold uppercase tracking-wider">Completadas</p></div>
          </div>

          <div className="liquid-card rounded-3xl p-6 mb-8">
            <h3 className="text-sm font-bold text-rose-text mb-4">{taskEditing ? "Editar tarea" : "Nueva tarea de producción"}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <input placeholder="Producto" value={taskForm.productName} onChange={(e) => setTaskForm({ ...taskForm, productName: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <input type="number" placeholder="Cantidad" value={taskForm.quantity || ""} onChange={(e) => setTaskForm({ ...taskForm, quantity: Number(e.target.value) })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300" />
              <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 appearance-none">
                <option value="baja">Baja</option><option value="normal">Normal</option><option value="alta">Alta</option><option value="urgente">Urgente</option>
              </select>
              <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} className="rounded-xl border border-rose-200/30 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-rose-300 appearance-none">
                <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option>
              </select>
              <div className="flex gap-2">
                <button onClick={saveTask} disabled={!taskForm.productName} className="flex-1 rounded-xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold py-2.5 text-sm hover:shadow-lg hover:shadow-rose-300/20 transition-all disabled:opacity-40">{taskEditing ? "Guardar" : "Crear"}</button>
                {taskEditing && <button onClick={() => { setTaskEditing(null); setTaskForm({ productName: "", quantity: 1, priority: "normal", status: "pendiente", dueDate: "", notes: "" }); }} className="rounded-xl border border-rose-200/30 px-3 py-2.5 text-sm text-rose-text/40 hover:bg-rose-50">✕</button>}
              </div>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 liquid-card rounded-3xl"><p className="text-rose-text/40">Sin tareas de producción</p></div>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => {
                const priorityColors: Record<string, string> = { urgente: "bg-red-100 text-red-600", alta: "bg-amber-100 text-amber-600", normal: "bg-blue-100 text-blue-600", baja: "bg-gray-100 text-gray-500" };
                const statusColors: Record<string, string> = { pendiente: "bg-amber-100 text-amber-600", en_progreso: "bg-blue-100 text-blue-600", completada: "bg-emerald-100 text-emerald-600" };
                return (
                  <div key={t.id} className="liquid-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${priorityColors[t.priority] || "bg-gray-100"}`}>{t.priority}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColors[t.status] || "bg-gray-100"}`}>{t.status.replace("_", " ")}</span>
                      </div>
                      <p className="font-semibold text-rose-text">{t.productName}</p>
                      <p className="text-xs text-rose-text/30">Cantidad: {t.quantity} · {formatDate(t.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={t.status}
                        onChange={async (e) => {
                          const tt = localStorage.getItem("admin-token") || "";
                          await fetch("/api/admin/production", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": tt }, body: JSON.stringify({ id: t.id, status: e.target.value }) });
                          await loadTasks();
                        }}
                        className="rounded-lg border border-rose-200/30 bg-white px-3 py-1.5 text-xs font-semibold text-rose-text focus:outline-none focus:border-rose-300 appearance-none cursor-pointer"
                      >
                        <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option>
                      </select>
                      <button onClick={() => { setTaskEditing(t.id); setTaskForm({ productName: t.productName, quantity: t.quantity, priority: t.priority, status: t.status, dueDate: t.dueDate ? t.dueDate.split("T")[0] : "", notes: t.notes || "" }); }} className="text-rose-text/30 hover:text-rose-400 transition-colors"><PencilIcon className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteTask(t.id)} className="text-danger/30 hover:text-danger transition-colors"><TrashIcon className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
