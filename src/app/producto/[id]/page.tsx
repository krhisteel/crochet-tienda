import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ReviewsSection } from "@/components/ReviewsSection";
import { RelatedProducts } from "@/components/RelatedProducts";
import { SizeGuide } from "@/components/SizeGuide";
import { ProductPageContent } from "./ProductPageContent";

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

  let variants: { name: string; color: string; image?: string }[] = [];
  if (product.variants) {
    try {
      const parsed = JSON.parse(product.variants);
      if (Array.isArray(parsed)) variants = parsed;
    } catch {}
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-32 pb-12">
        <nav className="mb-8 flex items-center gap-2 text-xs text-rose-text/25">
          <a href="/" className="hover:text-rose-400 transition-colors duration-300">Catálogo</a>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          <span className="text-rose-text/40 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <ProductPageContent
          title={product.title}
          price={formatPrice(product.price)}
          originalPrice={product.originalPrice ? formatPrice(product.originalPrice) : undefined}
          discountPercent={discountPercent}
          mainImage={product.imageUrl}
          images={product.images}
          variants={variants}
          category={product.category}
          featured={product.featured}
          available={product.available}
          craftingTime={product.craftingTime}
          shippingTime={product.shippingTime}
          description={product.description}
          materials={product.materials}
          dimensions={product.dimensions}
          colors={product.colors}
          weight={product.weight}
          hasDetails={!!hasDetails}
          productCategory={product.category}
        />

        <div className="mt-16">
          <ReviewsSection productId={product.id} />
        </div>

        <RelatedProducts currentId={product.id} category={product.category} />
      </div>
    </div>
  );
}
