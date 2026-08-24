import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductActions } from "./ProductActions";
import { ReviewsSection } from "@/components/ReviewsSection";
import { RelatedProducts } from "@/components/RelatedProducts";
import { SizeGuide } from "@/components/SizeGuide";

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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <nav className="mb-10 flex items-center gap-2 text-sm text-rose-text/30">
        <a href="/" className="hover:text-rose-400 transition-colors duration-300">Catálogo</a>
        <span>/</span>
        <span className="text-rose-text/60">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <div className="relative aspect-square rounded-[2rem] overflow-hidden liquid-card p-2">
          <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-rose-100 via-rose-50 to-cream">
                <svg className="w-24 h-24 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
                  <path d="M7 13c1.5 1.5 3 2.5 5 2.5s3.5-1 5-2.5" />
                  <path d="M8 17c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-text/50 text-[11px] font-semibold px-3 py-1.5 uppercase tracking-widest">
              {product.category}
            </span>
            {!product.available && (
              <span className="inline-flex items-center rounded-full bg-rose-200 text-rose-500 text-[11px] font-bold px-3 py-1.5 uppercase tracking-widest">
                Bajo Pedido
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-rose-text leading-[1.1]">
            {product.title}
          </h1>

          <div className="inline-flex items-center gap-3 liquid-card rounded-2xl px-5 py-3.5 w-fit">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-rose-text/30 font-semibold uppercase tracking-wider">Tiempo de tejido</p>
              <p className="text-sm font-bold text-rose-text">{product.craftingTime}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 liquid-card rounded-2xl px-5 py-3.5 w-fit">
            <div className="text-4xl font-bold text-rose-text">
              {formatPrice(product.price)}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-rose-text/30 line-through ml-3">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="text-sm text-rose-text-light/60 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </div>

          <div className="pt-2">
            <ProductActions
              title={product.title}
              price={formatPrice(product.price)}
            />
          </div>

          {product.category === "Ropa" && <SizeGuide />}

          <div className="liquid-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-rose-text mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
                  <path d="M7 13c1.5 1.5 3 2.5 5 2.5s3.5-1 5-2.5" />
                </svg>
              </div>
              Cuidados del producto
            </h3>
            <ul className="space-y-3">
              {[
                "Lavado a mano con agua tibia",
                "No usar lejía ni blanqueadores",
                "Secar a la sombra, sin exprimir",
                "No planchar directamente",
              ].map((cuidado, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-rose-text-light/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 shrink-0" />
                  {cuidado}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ReviewsSection productId={product.id} />
      </div>

      <RelatedProducts currentId={product.id} category={product.category} />
    </div>
  );
}
