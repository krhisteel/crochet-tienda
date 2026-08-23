import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductActions } from "./ProductActions";

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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-8 text-sm text-charcoal/40">
        <a href="/" className="hover:text-blush transition-colors">Catálogo</a>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-beige/30 border border-black/5">
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
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-beige/50 to-cream">
              <span className="text-8xl opacity-30">🧶</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-charcoal/5 text-charcoal/60 text-xs font-medium px-3 py-1.5 uppercase tracking-wider">
              {product.category}
            </span>
            {!product.available && (
              <span className="inline-flex items-center rounded-full bg-amber/10 text-amber text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                Bajo Pedido
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
            {product.title}
          </h1>

          <div className="inline-flex items-center gap-2 bg-amber/5 border border-amber/10 rounded-xl px-4 py-2.5 w-fit">
            <span className="text-amber">⏱</span>
            <span className="text-sm font-medium text-charcoal/70">
              Tiempo de tejido: <span className="text-amber font-semibold">{product.craftingTime}</span>
            </span>
          </div>

          <div className="text-3xl font-bold text-charcoal">
            {formatPrice(product.price)}
          </div>

          <div className="text-sm text-charcoal/60 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </div>

          <div className="pt-4 border-t border-black/5">
            <ProductActions
              title={product.title}
              price={formatPrice(product.price)}
            />
          </div>

          <div className="bg-beige/30 rounded-2xl p-5 border border-black/5">
            <h3 className="text-sm font-semibold text-charcoal mb-3">Cuidados del producto</h3>
            <ul className="space-y-2 text-sm text-charcoal/50">
              <li className="flex items-start gap-2">
                <span className="text-blush mt-0.5">•</span>
                Lavado a mano con agua tibia
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blush mt-0.5">•</span>
                No usar lejía ni blanqueadores
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blush mt-0.5">•</span>
                Secar a la sombra, sinexprimir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blush mt-0.5">•</span>
                No planchar directamente
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
