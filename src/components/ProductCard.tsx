import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  craftingTime: string;
  category: string;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}

function whatsappLink(product: Product) {
  const msg = encodeURIComponent(
    `Hola! Me interesa el producto: ${product.title} — ${formatPrice(product.price)}\n¿Está disponible?`
  );
  return `https://wa.me/5491100000000?text=${msg}`;
}

const categoryEmoji: Record<string, string> = {
  Amigurumis: "🧸",
  Ropa: "👗",
  Accesorios: "🧣",
  Patrones: "📄",
  Promociones: "🏷️",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-beige bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-beige/30">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">
              {categoryEmoji[product.category] || "🧶"}
            </div>
          )}

          {product.featured && (
            <span className="absolute top-3 left-3 rounded-full bg-amber text-white text-xs font-bold px-3 py-1 shadow-sm">
              Destacado
            </span>
          )}

          {!product.available && (
            <span className="absolute top-3 right-3 rounded-full bg-charcoal/70 text-white text-xs font-bold px-3 py-1">
              Bajo Pedido
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/producto/${product.id}`}>
            <h3 className="font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-blush transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber bg-amber/10 rounded-full px-2.5 py-1 w-fit">
          ⏱ {product.craftingTime}
        </span>

        <p className="text-sm text-charcoal/60 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-beige">
          <span className="text-lg font-bold text-blush">
            {formatPrice(product.price)}
          </span>
          <a
            href={whatsappLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp text-white text-xs font-bold px-3 py-2 hover:bg-whatsapp-hover transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pedir
          </a>
        </div>
      </div>
    </div>
  );
}
