import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductActions } from "./ProductActions";
import { ReviewsSection } from "@/components/ReviewsSection";
import { RelatedProducts } from "@/components/RelatedProducts";
import { SizeGuide } from "@/components/SizeGuide";
import { ImageGallery } from "@/components/ImageGallery";

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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <nav className="mb-8 flex items-center gap-2 text-xs text-rose-text/30">
        <a href="/" className="hover:text-rose-400 transition-colors duration-300">Catálogo</a>
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-rose-text/50 truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        <ImageGallery
          mainImage={product.imageUrl}
          images={product.images}
          title={product.title}
        />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-500 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
              {product.category}
            </span>
            {product.available ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Bajo Pedido
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-rose-text leading-tight mb-6">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-extrabold text-rose-text">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-rose-text/30 line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
                <span className="text-xs font-bold text-white bg-rose-400 px-2.5 py-1 rounded-full">
                  -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-rose-text-light/60 leading-relaxed whitespace-pre-wrap mb-8">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider">Tiempo de confección</p>
              <p className="text-sm font-bold text-rose-text">{product.craftingTime}</p>
            </div>
          </div>

          <div className="mb-8">
            <ProductActions
              title={product.title}
              price={formatPrice(product.price)}
            />
          </div>

          {hasDetails && (
            <div className="rounded-2xl border border-rose-200/30 overflow-hidden mb-6">
              <div className="px-5 py-3 bg-rose-50/50 border-b border-rose-200/20">
                <h3 className="text-xs font-bold text-rose-text/50 uppercase tracking-widest">Detalles del producto</h3>
              </div>
              <div className="p-5 grid grid-cols-2 gap-5">
                {product.materials && (
                  <div>
                    <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Materiales</p>
                    <p className="text-sm text-rose-text/70 font-medium">{product.materials}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Dimensiones</p>
                    <p className="text-sm text-rose-text/70 font-medium">{product.dimensions}</p>
                  </div>
                )}
                {product.colors && (
                  <div>
                    <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Colores</p>
                    <p className="text-sm text-rose-text/70 font-medium">{product.colors}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Peso</p>
                    <p className="text-sm text-rose-text/70 font-medium">{product.weight}</p>
                  </div>
                )}
                {product.shippingTime && (
                  <div className="col-span-2">
                    <p className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-wider mb-1">Tiempo de envío</p>
                    <p className="text-sm text-rose-text/70 font-medium">{product.shippingTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-rose-200/30 overflow-hidden">
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

          {product.category === "Ropa" && <SizeGuide />}
        </div>
      </div>

      <div className="mt-16">
        <ReviewsSection productId={product.id} />
      </div>

      <RelatedProducts currentId={product.id} category={product.category} />
    </div>
  );
}
