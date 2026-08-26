"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, FormEvent } from "react";
import { UploadIcon } from "@/components/Icons";

interface ProductFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    price: number;
    originalPrice: number | null;
    craftingTime: string;
    category: string;
    imageUrl: string | null;
    images: string | null;
    materials: string | null;
    dimensions: string | null;
    colors: string | null;
    weight: string | null;
    shippingTime: string | null;
  };
}

const categories = ["Amigurumis", "Ropa", "Accesorios", "Patrones", "Promociones"];

export function ProductForm({ action, initialData }: ProductFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (initialData?.images) {
      try {
        const parsed = JSON.parse(initialData.images);
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    }
    return [];
  });
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const timestamp = Date.now();
      const ext = file.name.split(".").pop() || "jpg";
      const uniqueName = `product-${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const renamedFile = new File([file], uniqueName, { type: file.type });

      const fd = new FormData();
      fd.append("file", renamedFile);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok && data.url) {
          setGalleryImages((prev) => [...prev, data.url]);
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 3000));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }

  function setAsMain(index: number) {
    setGalleryImages((prev) => {
      const newGallery = [...prev];
      const mainImg = newGallery.splice(index, 1)[0];
      setImageUrl(mainImg);
      return newGallery;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (imageUrl) {
      fd.set("imageUrl", imageUrl);
    } else if (galleryImages.length > 0) {
      fd.set("imageUrl", galleryImages[0]);
      fd.set("images", JSON.stringify(galleryImages.slice(1)));
    } else {
      fd.set("images", JSON.stringify([]));
    }
    await action(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
          Título del producto
        </label>
        <input
          name="title"
          required
          defaultValue={initialData?.title}
          placeholder="Ej: Osito Amigurumi Tejido"
          className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
          Descripción
        </label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initialData?.description}
          placeholder="Materiales, tamaño, detalles del tejido..."
          className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 resize-none transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
            Precio (CLP)
          </label>
          <input
            name="price"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={initialData?.price}
            placeholder="0"
            className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
            Precio original (CLP) — Opcional
          </label>
          <input
            name="originalPrice"
            type="number"
            step="1"
            min="0"
            defaultValue={initialData?.originalPrice ?? ""}
            placeholder="Dejar vacío si no hay promo"
            className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
          Tiempo de confección
        </label>
        <input
          name="craftingTime"
          required
          defaultValue={initialData?.craftingTime}
          placeholder="Ej: 3 a 5 días"
          className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
          Categoría
        </label>
        <select
          name="category"
          required
          defaultValue={initialData?.category}
          className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300 appearance-none"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-rose-200/20 pt-6">
        <h3 className="text-xs font-bold text-rose-text/30 uppercase tracking-widest mb-4">Detalles del producto (opcional)</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
              Materiales
            </label>
            <input
              name="materials"
              defaultValue={initialData?.materials ?? ""}
              placeholder="Ej: Lana acrílica, ojos de seguridad"
              className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
                Dimensiones
              </label>
              <input
                name="dimensions"
                defaultValue={initialData?.dimensions ?? ""}
                placeholder="Ej: 15cm de alto"
                className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
                Peso
              </label>
              <input
                name="weight"
                defaultValue={initialData?.weight ?? ""}
                placeholder="Ej: 200g"
                className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
                Colores disponibles
              </label>
              <input
                name="colors"
                defaultValue={initialData?.colors ?? ""}
                placeholder="Ej: Rosa, blanco, beige"
                className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
                Tiempo de envío
              </label>
              <input
                name="shippingTime"
                defaultValue={initialData?.shippingTime ?? ""}
                placeholder="Ej: 3-5 días hábiles"
                className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">
          Fotos del producto
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-2xl border-2 border-dashed border-rose-200/40 bg-white px-5 py-12 text-center hover:border-rose-300/40 hover:bg-rose-50 transition-all duration-300 disabled:opacity-50 group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-rose-300/40 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
              </svg>
              <span className="text-sm text-rose-text/40 font-medium">Subiendo imágenes...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <UploadIcon className="w-10 h-10 text-rose-text/15 group-hover:text-rose-300/40 transition-colors duration-300" />
              <span className="text-sm text-rose-text/30 font-medium">Click para seleccionar fotos</span>
              <span className="text-xs text-rose-text/20">Podés seleccionar varias de una vez — Max 5MB c/u</span>
            </div>
          )}
        </button>

        {(imageUrl || galleryImages.length > 0) && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {imageUrl && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-rose-400 shadow-md shadow-rose-300/20 group">
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 bg-rose-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Principal</span>
                <button
                  type="button"
                  onClick={() => { setImageUrl(null); if (galleryImages.length > 0) setAsMain(0); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            )}
            {galleryImages.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-rose-200/30 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setAsMain(i)}
                  className="absolute bottom-1 left-1 bg-white/80 backdrop-blur-sm text-rose-text text-[9px] font-bold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Principal
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {imageUrl && <input type="hidden" name="imageUrl" value={imageUrl} />}
        <input type="hidden" name="images" value={JSON.stringify(galleryImages)} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-2xl border border-rose-200/30 bg-white text-rose-text/40 font-semibold py-3.5 hover:bg-rose-50 hover:text-rose-text transition-all duration-300 text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex-1 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold py-3.5 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300 disabled:opacity-40 text-sm"
        >
          {submitting ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
