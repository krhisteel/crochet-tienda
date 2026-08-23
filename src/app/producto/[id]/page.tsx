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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-beige/30 border border-beige">
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
            <div className="flex items-center justify-center h-full text-7xl">
              🧶
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-beige text-charcoal/70 text-xs font-medium px-3 py-1">
              {product.category}
            </span>
            {!product.available && (
              <span className="rounded-full bg-amber/20 text-amber text-xs font-bold px-3 py-1">
                Bajo Pedido
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">
            {product.title}
          </h1>

          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber bg-amber/10 rounded-full px-3 py-1.5 w-fit">
            ⏱ Tiempo de tejido: {product.craftingTime}
          </span>

          <p className="text-3xl font-bold text-blush">{formatPrice(product.price)}</p>

          <div className="prose prose-sm text-charcoal/70 max-w-none">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-beige">
            <ProductActions
              title={product.title}
              price={formatPrice(product.price)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
