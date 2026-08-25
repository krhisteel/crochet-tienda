import Link from "next/link";
import Image from "next/image";
import { ClockIcon, WhatsAppIcon } from "./Icons";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
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

const categoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  Amigurumis: {
    label: "Amigurumis",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  Ropa: {
    label: "Ropa",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
      </svg>
    ),
  },
  Accesorios: {
    label: "Accesorios",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  Patrones: {
    label: "Patrones",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  Promociones: {
    label: "Promos",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
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
            {product.available ? (
              <span className="inline-flex items-center gap-1 bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                Disponible
              </span>
            ) : (
              <span className="inline-flex items-center bg-rose-500/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                Bajo Pedido
              </span>
            )}
          </div>

          <WishlistButton productId={product.id} />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 bg-rose-100 rounded-full px-2.5 py-1">
            <ClockIcon className="w-3 h-3" />
            {product.craftingTime}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-rose-text/30 font-semibold uppercase tracking-widest">
            {categoryConfig[product.category]?.icon}
            {categoryConfig[product.category]?.label || product.category}
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
          <div className="flex items-center gap-2">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="text-xl font-bold text-rose-text">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-rose-text/30 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-rose-text">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AddToCartButton
              product={{ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl }}
              available={product.available}
            />
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
