"use client";

import { useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { VariantSelector } from "./VariantSelector";
import { ProductActions } from "./ProductActions";
import { SizeGuide } from "@/components/SizeGuide";

interface Variant {
  name: string;
  color: string;
  image?: string;
}

interface ProductPageContentProps {
  title: string;
  price: string;
  originalPrice?: string;
  discountPercent?: number;
  mainImage: string | null;
  images: string | null;
  variants: Variant[];
  category: string;
  featured: boolean;
  available: boolean;
  craftingTime: string;
  shippingTime?: string | null;
  description: string;
  materials?: string | null;
  dimensions?: string | null;
  colors?: string | null;
  weight?: string | null;
  hasDetails: boolean;
  productCategory: string;
}

export function ProductPageContent({
  title,
  price,
  originalPrice,
  discountPercent,
  mainImage,
  images,
  variants,
  category,
  featured,
  available,
  craftingTime,
  shippingTime,
  description,
  materials,
  dimensions,
  colors,
  weight,
  hasDetails,
  productCategory,
}: ProductPageContentProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    variants.forEach((_, i) => { init[i] = 0; });
    return init;
  });
  const [focusedVariant, setFocusedVariant] = useState(0);

  function handleQuantityChange(index: number, qty: number) {
    setQuantities((prev) => ({ ...prev, [index]: qty }));
    setFocusedVariant(index);
  }

  function handleVariantFocus(index: number) {
    setFocusedVariant(index);
  }

  const selectedVariants = variants
    .map((v, i) => ({ name: v.name, qty: quantities[i] || 0 }))
    .filter((v) => v.qty > 0);

  const selectedVariantIndex = focusedVariant;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      <div>
        <ImageGallery
          mainImage={mainImage}
          images={images}
          title={title}
          variants={variants}
          selectedVariant={selectedVariantIndex}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-200/40 text-rose-500 text-[10px] font-bold px-3.5 py-1.5 uppercase tracking-widest">
            {category}
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-white text-[10px] font-bold px-3.5 py-1.5 uppercase tracking-widest shadow-md shadow-rose-300/20">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Destacado
            </span>
          )}
          {available ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3.5 py-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Disponible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold px-3.5 py-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Bajo Pedido
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-rose-text leading-tight mb-4">
          {title}
        </h1>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-extrabold text-rose-text">
            {price}
          </span>
          {originalPrice && discountPercent && (
            <>
              <span className="text-lg text-rose-text/25 line-through">
                {originalPrice}
              </span>
              <span className="text-xs font-bold text-white bg-gradient-to-r from-rose-400 to-rose-500 px-3 py-1 rounded-full shadow-sm">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200/30">
            <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm font-medium text-rose-text/60">{craftingTime}</span>
          </div>
          {shippingTime && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200/30">
              <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span className="text-sm font-medium text-rose-text/60">{shippingTime}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-rose-text-light/50 leading-relaxed whitespace-pre-wrap mb-6">
          {description}
        </p>

        {variants.length > 0 && (
          <div className="mb-6">
            <VariantSelector
              variants={variants}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              onVariantFocus={handleVariantFocus}
            />
          </div>
        )}

        <ProductActions
          title={title}
          price={price}
          variants={variants.length > 0 ? selectedVariants : undefined}
        />

        {hasDetails && (
          <div className="rounded-2xl border border-rose-200/30 overflow-hidden mt-6">
            <div className="px-5 py-3 bg-rose-50/50 border-b border-rose-200/20">
              <h3 className="text-xs font-bold text-rose-text/50 uppercase tracking-widest">Detalles del producto</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-5">
              {materials && (
                <div>
                  <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Materiales</p>
                  <p className="text-sm text-rose-text/70 font-medium">{materials}</p>
                </div>
              )}
              {dimensions && (
                <div>
                  <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Dimensiones</p>
                  <p className="text-sm text-rose-text/70 font-medium">{dimensions}</p>
                </div>
              )}
              {colors && (
                <div>
                  <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Colores</p>
                  <p className="text-sm text-rose-text/70 font-medium">{colors}</p>
                </div>
              )}
              {weight && (
                <div>
                  <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Peso</p>
                  <p className="text-sm text-rose-text/70 font-medium">{weight}</p>
                </div>
              )}
              {shippingTime && (
                <div className="col-span-2">
                  <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Tiempo de envío</p>
                  <p className="text-sm text-rose-text/70 font-medium">{shippingTime}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-rose-200/30 overflow-hidden mt-6">
          <div className="px-5 py-3 bg-rose-50/50 border-b border-rose-200/20">
            <h3 className="text-xs font-bold text-rose-text/50 uppercase tracking-widest">Cuidados</h3>
          </div>
          <div className="p-5">
            <ul className="space-y-2.5">
              {[
                "Lavado a mano con agua tibia",
                "No usar lejía ni blanqueadores",
                "Secar a la sombra, sin exprimir",
                "No planchar directamente",
              ].map((cuidado, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-rose-text/50">
                  <span className="w-1 h-1 rounded-full bg-rose-300 shrink-0" />
                  {cuidado}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {productCategory === "Ropa" && <SizeGuide />}
      </div>
    </div>
  );
}
