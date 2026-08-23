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
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <a href="/admin" className="text-sm text-charcoal/40 hover:text-blush transition-colors">
          ← Volver al admin
        </a>
        <h1 className="text-2xl font-bold text-charcoal mt-3">Nuevo Producto</h1>
        <p className="text-sm text-charcoal/40 mt-1">
          Completá los datos para agregar un nuevo tejido al catálogo
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 p-6 sm:p-8">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
