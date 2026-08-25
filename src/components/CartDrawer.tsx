"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);
}

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  const whatsappMsg = encodeURIComponent(
    `Hola! Quiero hacer un pedido:\n\n${items.map((i) => `- ${i.title} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join("\n")}\n\nTotal: ${formatPrice(totalPrice)}`
  );

  return (
    <>
      <div className="fixed inset-0 bg-rose-text/30 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsOpen(false)} />

      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-rose-200/30">
          <h2 className="text-lg font-bold text-rose-text">
            Mi Carrito <span className="text-sm font-normal text-rose-text/40">({totalItems})</span>
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-rose-50 transition-colors" aria-label="Cerrar">
            <svg className="w-5 h-5 text-rose-text/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg className="w-16 h-16 text-rose-200 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <p className="text-rose-text/40 font-medium mb-2">Tu carrito está vacío</p>
            <p className="text-rose-text/30 text-sm">Agregá productos desde el catálogo</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-rose-50/50 border border-rose-100/50">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-rose-100">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-8 h-8 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-rose-text line-clamp-1">{item.title}</h3>
                    <p className="text-sm font-semibold text-rose-400 mt-0.5">{formatPrice(item.price)}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white rounded-full border border-rose-200/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-rose-text/40 hover:text-rose-400 transition-colors rounded-full"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-rose-text w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-rose-text/40 hover:text-rose-400 transition-colors rounded-full"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-rose-text/30 hover:text-red-400 transition-colors p-1"
                        aria-label="Eliminar"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-rose-200/30 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-rose-text/50">Total</span>
                <span className="text-xl font-bold text-rose-text">{formatPrice(totalPrice)}</span>
              </div>

              <a
                href={`https://wa.me/56936621284?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-whatsapp text-white font-bold py-3.5 rounded-2xl hover:bg-whatsapp-hover transition-all duration-300 shadow-lg shadow-whatsapp/20"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Pedir por WhatsApp
              </a>

              <button
                onClick={clearCart}
                className="w-full text-center text-sm text-rose-text/30 hover:text-red-400 transition-colors py-2"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
