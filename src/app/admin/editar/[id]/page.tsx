"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/app/admin/nuevo/ProductForm";
import { ArrowLeftIcon } from "@/components/Icons";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  craftingTime: string;
  category: string;
  imageUrl: string | null;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/products/${id}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("Producto no encontrado");
          return res.json();
        })
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    });
  }, [params]);

  async function handleUpdate(formData: FormData) {
    if (!product) return;
    const t = localStorage.getItem("admin-token") || "";
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": t },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
        craftingTime: formData.get("craftingTime"),
        category: formData.get("category"),
        imageUrl: formData.get("imageUrl"),
      }),
    });
    if (res.ok) {
      router.push("/admin");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 rounded-full border-2 border-rose-200/30" />
          <div className="absolute inset-0 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 pt-24 sm:pt-32 text-center">
        <p className="text-rose-text/40 mb-4">{error || "Producto no encontrado"}</p>
        <Link href="/admin" className="text-rose-400 hover:text-rose-500 text-sm font-semibold">
          Volver al admin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-rose-text/40 hover:text-rose-400 transition-colors mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Volver al admin
      </Link>

      <h1 className="text-2xl font-bold text-rose-text mb-8">Editar Producto</h1>

      <ProductForm action={handleUpdate} initialData={product} />
    </div>
  );
}
