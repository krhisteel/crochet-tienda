import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductForm } from "./ProductForm";

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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-charcoal mb-8">
        Nuevo Producto
      </h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
