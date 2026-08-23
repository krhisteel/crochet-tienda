import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminProductRow } from "./AdminProductRow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Panel de Administración</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""} registrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/nuevo"
          className="rounded-full bg-blush text-white font-bold px-6 py-2.5 hover:bg-blush-light transition-colors shadow-md"
        >
          + Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-charcoal/50 border-2 border-dashed border-beige rounded-3xl">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg mb-4">No hay productos registrados</p>
          <Link
            href="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-full bg-blush text-white font-bold px-6 py-2.5 hover:bg-blush-light transition-colors"
          >
            + Agregar primer producto
          </Link>
        </div>
      ) : (
        <div className="border border-beige rounded-2xl overflow-hidden bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-beige/50 text-charcoal/70">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Categoría</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Precio</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Estado</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Destacado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige">
              {products.map((product) => (
                <AdminProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
