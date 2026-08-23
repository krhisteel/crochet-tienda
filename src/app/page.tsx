import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Banner } from "@/components/Banner";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function getProducts(category?: string) {
  const where = category ? { category } : {};
  return prisma.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params.cat);

  return (
    <>
      <Banner />

      <section id="catalogo" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-charcoal">Nuestros Tejidos</h2>
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-charcoal/50">
            <p className="text-5xl mb-4">🧶</p>
            <p className="text-lg">
              {params.cat
                ? "No hay productos en esta categoría todavía."
                : "El catálogo está vacío. ¡Pronto agregaremos nuevos tejidos!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
