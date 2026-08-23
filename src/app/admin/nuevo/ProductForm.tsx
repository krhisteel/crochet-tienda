"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, FormEvent } from "react";
import { UploadIcon, CheckIcon } from "@/components/Icons";

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
      } else {
        alert(data.error || "Error al subir la imagen");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">
          Título del producto
        </label>
        <input
          name="title"
          required
          placeholder="Ej: Osito Amigurumi Tejido"
          className="w-full rounded-2xl border border-black/5 bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/30 transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">
          Descripción
        </label>
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Materiales, tamaño, detalles del tejido..."
          className="w-full rounded-2xl border border-black/5 bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/30 resize-none transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">
            Precio (CLP)
          </label>
          <input
            name="price"
            type="number"
            step="1"
            min="0"
            required
            placeholder="0"
            className="w-full rounded-2xl border border-black/5 bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/30 transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">
            Tiempo de confección
          </label>
          <input
            name="craftingTime"
            required
            placeholder="Ej: 3 a 5 días"
            className="w-full rounded-2xl border border-black/5 bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/30 transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">
          Categoría
        </label>
        <select
          name="category"
          required
          className="w-full rounded-2xl border border-black/5 bg-white px-5 py-3.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/30 transition-all duration-300 appearance-none"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2.5">
          Foto del producto
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-2xl border-2 border-dashed border-black/8 bg-white px-5 py-12 text-center hover:border-blush/30 hover:bg-blush/5 transition-all duration-300 disabled:opacity-50 group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-blush/30 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
              </svg>
              <span className="text-sm text-charcoal/40 font-medium">Subiendo imagen...</span>
            </div>
          ) : imageUrl ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-success" />
              </div>
              <span className="text-sm text-success font-semibold">Imagen cargada</span>
              <span className="text-xs text-charcoal/30">Click para cambiar</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <UploadIcon className="w-10 h-10 text-charcoal/15 group-hover:text-blush/30 transition-colors duration-300" />
              <span className="text-sm text-charcoal/30 font-medium">Click para seleccionar imagen</span>
              <span className="text-xs text-charcoal/20">JPG, PNG, WebP o GIF — Max 5MB</span>
            </div>
          )}
        </button>
        {imageUrl && <input type="hidden" name="imageUrl" value={imageUrl} />}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-2xl border border-black/5 bg-white text-charcoal/40 font-semibold py-3.5 hover:bg-cream hover:text-charcoal transition-all duration-300 text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex-1 rounded-2xl bg-gradient-to-r from-blush to-blush-dark text-white font-semibold py-3.5 hover:shadow-lg hover:shadow-blush/20 transition-all duration-300 disabled:opacity-40 text-sm"
        >
          {submitting ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
