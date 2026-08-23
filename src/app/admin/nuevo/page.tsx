import { ProductForm } from "./ProductForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const craftingTime = formData.get("craftingTime") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("imageUrl") as string | null;

    await prisma.product.create({
      data: {
        title,
        description,
        price,
        craftingTime,
        category,
        imageUrl: imageUrl || null,
      },
    });

    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-16 pt-24 sm:pt-32">
      <div className="mb-10">
        <a href="/admin" className="inline-flex items-center gap-1.5 text-sm text-charcoal/30 hover:text-blush transition-colors duration-300 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Volver al admin
        </a>
        <h1 className="text-3xl font-bold text-charcoal">Nuevo Producto</h1>
        <p className="text-sm text-charcoal/40 mt-2">
          Completá los datos para agregar un nuevo tejido al catálogo
        </p>
      </div>

      <div className="liquid-card rounded-3xl p-6 sm:p-8">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
