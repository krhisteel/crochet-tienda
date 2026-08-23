import Link from "next/link";
import Image from "next/image";
import { ClockIcon, WhatsAppIcon } from "./Icons";

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
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(price);
}

function whatsappLink(product: Product) {
  const msg = encodeURIComponent(
    `Hola! Me interesa: ${product.title} — ${formatPrice(product.price)}\n¿Está disponible?`
  );
  return `https://wa.me/56936621284?text=${msg}`;
}

const categoryLabels: Record<string, string> = {
  Amigurumis: "Amigurumis",
  Ropa: "Ropa",
  Accesorios: "Accesorios",
  Patrones: "Patrones",
  Promociones: "Promos",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group liquid-card rounded-3xl overflow-hidden">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-rose-100 via-rose-50 to-cream">
              <YarnBallPlaceholder />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-rose-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-400 to-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                <StarIcon /> Destacado
              </span>
            )}
          </div>

          {!product.available && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center bg-rose-500/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                Bajo Pedido
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 bg-rose-100 rounded-full px-2.5 py-1">
            <ClockIcon className="w-3 h-3" />
            {product.craftingTime}
          </span>
          <span className="text-[10px] text-rose-text/30 font-semibold uppercase tracking-widest">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>

        <Link href={`/producto/${product.id}`}>
          <h3 className="font-bold text-rose-text text-[15px] leading-snug line-clamp-2 mb-3 group-hover:text-rose-400 transition-colors duration-300">
            {product.title}
          </h3>
        </Link>

        <p className="text-[13px] text-rose-text-light/60 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-rose-200/30">
          <span className="text-xl font-bold text-rose-text">
            {formatPrice(product.price)}
          </span>
          <a
            href={whatsappLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp text-white text-xs font-semibold px-4 py-2.5 hover:bg-whatsapp-hover transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-whatsapp/20 hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            Pedir
          </a>
        </div>
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function YarnBallPlaceholder() {
  return (
    <svg className="w-20 h-20 opacity-15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
      <path d="M7 13c1.5 1.5 3 2.5 5 2.5s3.5-1 5-2.5" />
      <path d="M8 17c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" />
    </svg>
  );
}
