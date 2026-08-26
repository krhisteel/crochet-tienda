import { ProductForm } from "./ProductForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const originalPrice = formData.get("originalPrice") ? parseFloat(formData.get("originalPrice") as string) : null;
    const craftingTime = formData.get("craftingTime") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    const images = formData.get("images") as string | null;
    const materials = formData.get("materials") as string | null;
    const dimensions = formData.get("dimensions") as string | null;
    const colors = formData.get("colors") as string | null;
    const weight = formData.get("weight") as string | null;
    const shippingTime = formData.get("shippingTime") as string | null;
    const stock = parseInt(formData.get("stock") as string) || 0;

    await prisma.product.create({
      data: {
        title,
        description,
        price,
        originalPrice,
        craftingTime,
        category,
        imageUrl: imageUrl || null,
        images: images || null,
        materials: materials || null,
        dimensions: dimensions || null,
        colors: colors || null,
        weight: weight || null,
        shippingTime: shippingTime || null,
        stock,
      },
    });

    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <div className="mb-10">
        <a href="/admin" className="inline-flex items-center gap-1.5 text-sm text-rose-text/30 hover:text-rose-400 transition-colors duration-300 mb-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver al admin
        </a>
        <h1 className="text-3xl font-bold text-rose-text">Nuevo Producto</h1>
        <p className="text-sm text-rose-text/40 mt-2">
          Completá los datos para agregar un nuevo tejido al catálogo
        </p>
      </div>

      <div className="liquid-card rounded-3xl p-6 sm:p-8">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
