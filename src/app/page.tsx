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

      <section id="catalogo" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">
              Nuestros Tejidos
            </h2>
            <p className="text-sm text-charcoal/40 mt-1">
              {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-black/5">
            <div className="text-6xl mb-6 opacity-30">🧶</div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              {params.cat ? "Sin resultados" : "Catálogo vacío"}
            </h3>
            <p className="text-sm text-charcoal/40 max-w-sm mx-auto">
              {params.cat
                ? "No hay productos en esta categoría. Probá con otra categoría."
                : "Pronto agregaremos nuevos tejidos artesanales."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
