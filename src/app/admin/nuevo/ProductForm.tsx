"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, FormEvent } from "react";

interface ProductFormProps {
  action: (formData: FormData) => Promise<void>;
}

const categories = ["Amigurumis", "Ropa", "Accesorios", "Patrones", "Promociones"];

export function ProductForm({ action }: ProductFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch {
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (imageUrl) {
      fd.set("imageUrl", imageUrl);
    }
    await action(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl border border-beige p-6 sm:p-8">
      <div>
        <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Título del producto
        </label>
        <input
          name="title"
          required
          placeholder="Ej: Osito Amigurumi Tejido"
          className="w-full rounded-xl border border-beige bg-cream/50 px-4 py-2.5 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Descripción
        </label>
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Materiales, tamaño, detalles del tejido..."
          className="w-full rounded-xl border border-beige bg-cream/50 px-4 py-2.5 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
            Precio (ARS)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            className="w-full rounded-xl border border-beige bg-cream/50 px-4 py-2.5 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
            Tiempo de confección
          </label>
          <input
            name="craftingTime"
            required
            placeholder="Ej: 3 a 5 días"
            className="w-full rounded-xl border border-beige bg-cream/50 px-4 py-2.5 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Categoría
        </label>
        <select
          name="category"
          required
          className="w-full rounded-xl border border-beige bg-cream/50 px-4 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Foto del producto
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-xl border-2 border-dashed border-beige bg-cream/30 px-4 py-8 text-charcoal/50 hover:border-blush hover:text-blush transition-colors disabled:opacity-50"
        >
          {uploading
            ? "Subiendo imagen..."
            : imageUrl
              ? "Imagen cargada ✓ — Click para cambiar"
              : "Click para seleccionar imagen"}
        </button>
        {imageUrl && (
          <input type="hidden" name="imageUrl" value={imageUrl} />
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-full border border-beige bg-white text-charcoal/70 font-medium py-3 hover:bg-cream transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex-1 rounded-full bg-blush text-white font-bold py-3 hover:bg-blush-light transition-colors shadow-md disabled:opacity-50"
        >
          {submitting ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
