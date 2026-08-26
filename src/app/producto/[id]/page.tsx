import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ReviewsSection } from "@/components/ReviewsSection";
import { RelatedProducts } from "@/components/RelatedProducts";
import { SizeGuide } from "@/components/SizeGuide";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductInfo } from "./ProductInfo";

export const dynamic = "force-dynamic";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(price);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  const hasDetails = product.materials || product.dimensions || product.colors || product.weight || product.shippingTime;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  let variants: { name: string; color: string }[] = [];
  if (product.variants) {
    try {
      const parsed = JSON.parse(product.variants);
      if (Array.isArray(parsed)) variants = parsed;
    } catch {}
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Full-width hero gallery */}
      <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] relative overflow-hidden">
        <ImageGallery
          mainImage={product.imageUrl}
          images={product.images}
          title={product.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
          <nav className="mb-4 flex items-center gap-2 text-xs text-white/50">
            <a href="/" className="hover:text-white transition-colors">Catálogo</a>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            <span className="text-white/70 truncate max-w-[180px]">{product.title}</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            {product.title}
          </h1>
        </div>
      </div>

      {/* Content section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-10">
        {/* Sticky price/action bar */}
        <div className="bg-white rounded-3xl shadow-xl shadow-rose-200/30 border border-rose-100/50 p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-200/40 text-rose-500 text-[10px] font-bold px-3.5 py-1.5 uppercase tracking-widest">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-white text-[10px] font-bold px-3.5 py-1.5 uppercase tracking-widest shadow-md shadow-rose-300/20">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    Destacado
                  </span>
                )}
                {product.available ? (
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

              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-rose-text tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-rose-text/20 line-through decoration-rose-300/50">
                      {formatPrice(product.originalPrice!)}
                    </span>
                    <span className="text-xs font-bold text-white bg-gradient-to-r from-rose-400 to-rose-500 px-3 py-1 rounded-full shadow-sm">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="sm:w-px sm:h-20 bg-rose-100/50" />

            <div className="flex items-center gap-3 text-sm text-rose-text/50">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200/30">
                <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-medium">{product.craftingTime}</span>
              </div>
              {product.shippingTime && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200/30">
                  <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span className="font-medium">{product.shippingTime}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-rose-100/50">
            <ProductInfo
              title={product.title}
              price={formatPrice(product.price)}
              variants={variants}
            />
          </div>
        </div>

        {/* Description - editorial style */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative pl-8 border-l-2 border-rose-200/40">
            <p className="text-lg sm:text-xl text-rose-text-light/60 leading-[1.9] font-light">
              {product.description}
            </p>
          </div>
        </div>

        {/* Details grid */}
        {hasDetails && (
          <div className="mb-16">
            <h2 className="text-xs font-bold text-rose-text/25 uppercase tracking-[0.25em] mb-8 text-center">
              Detalles del producto
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px rounded-2xl overflow-hidden bg-rose-100/30">
              {product.materials && (
                <div className="bg-white p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-rose-text/25 font-bold uppercase tracking-wider mb-1">Materiales</p>
                  <p className="text-sm text-rose-text/70 font-medium">{product.materials}</p>
                </div>
              )}
              {product.dimensions && (
                <div className="bg-white p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 3H3v7h18V3z" />
                      <path d="M21 14H3v7h18v-7z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-rose-text/25 font-bold uppercase tracking-wider mb-1">Dimensiones</p>
                  <p className="text-sm text-rose-text/70 font-medium">{product.dimensions}</p>
                </div>
              )}
              {product.colors && (
                <div className="bg-white p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="13.5" cy="6.5" r="2.5" />
                      <circle cx="6.5" cy="13.5" r="2.5" />
                      <circle cx="17.5" cy="17.5" r="2.5" />
                      <path d="M13.5 9v2.5" />
                      <path d="M9 13.5h2.5" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-rose-text/25 font-bold uppercase tracking-wider mb-1">Colores</p>
                  <p className="text-sm text-rose-text/70 font-medium">{product.colors}</p>
                </div>
              )}
              {product.weight && (
                <div className="bg-white p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-rose-text/25 font-bold uppercase tracking-wider mb-1">Peso</p>
                  <p className="text-sm text-rose-text/70 font-medium">{product.weight}</p>
                </div>
              )}
              {product.shippingTime && (
                <div className="bg-white p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-rose-text/25 font-bold uppercase tracking-wider mb-1">Envío</p>
                  <p className="text-sm text-rose-text/70 font-medium">{product.shippingTime}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Care & Trust - side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/30 p-8">
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm mb-5">
              <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-rose-text mb-4">Cuidados del producto</h3>
            <ul className="space-y-3">
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

          <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/30 p-8">
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm mb-5">
              <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-rose-text mb-4">Nuestra promesa</h3>
            <ul className="space-y-3">
              {[
                "Cada pieza es tejida a mano con dedicación",
                "Materiales de alta calidad seleccionados",
                "Envío cuidadoso y seguro a todo Chile",
                "Atención personalizada por WhatsApp",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-rose-text/50">
                  <span className="w-1 h-1 rounded-full bg-rose-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {product.category === "Ropa" && (
          <div className="mb-16">
            <SizeGuide />
          </div>
        )}

        {/* Reviews */}
        <div className="mb-16">
          <ReviewsSection productId={product.id} />
        </div>

        {/* Related */}
        <RelatedProducts currentId={product.id} category={product.category} />
      </div>
    </div>
  );
}
