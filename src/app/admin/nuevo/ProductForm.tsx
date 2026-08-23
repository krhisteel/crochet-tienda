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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">
          Título del producto
        </label>
        <input
          name="title"
          required
          placeholder="Ej: Osito Amigurumi Tejido"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/40 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">
          Descripción
        </label>
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Materiales, tamaño, detalles del tejido..."
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/40 resize-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">
            Precio (CLP)
          </label>
          <input
            name="price"
            type="number"
            step="1"
            min="0"
            required
            placeholder="0"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">
            Tiempo de confección
          </label>
          <input
            name="craftingTime"
            required
            placeholder="Ej: 3 a 5 días"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/40 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">
          Categoría
        </label>
        <select
          name="category"
          required
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/40 transition-all appearance-none"
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
        <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">
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
          className="w-full rounded-xl border-2 border-dashed border-black/10 bg-white px-4 py-10 text-center hover:border-blush/30 hover:bg-blush/5 transition-all disabled:opacity-50 group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl animate-spin">🧶</div>
              <span className="text-sm text-charcoal/40">Subiendo imagen...</span>
            </div>
          ) : imageUrl ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-sm text-success font-medium">Imagen cargada — Click para cambiar</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-charcoal/20 group-hover:text-blush/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <span className="text-sm text-charcoal/30">Click para seleccionar imagen</span>
              <span className="text-xs text-charcoal/20">JPG, PNG, WebP o GIF — Max 5MB</span>
            </div>
          )}
        </button>
        {imageUrl && (
          <input type="hidden" name="imageUrl" value={imageUrl} />
        )}
      </div>

      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-xl border border-black/10 bg-white text-charcoal/50 font-medium py-3 hover:bg-cream hover:text-charcoal transition-all text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex-1 rounded-xl bg-charcoal text-white font-semibold py-3 hover:bg-charcoal-light transition-all shadow-sm disabled:opacity-40 text-sm"
        >
          {submitting ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
