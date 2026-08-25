"use client";

const testimonios = [
  {
    id: 1,
    name: "María José",
    rating: 5,
    text: "El amigurumi que pedí quedó hermoso! La atención fue increíble y llegó en el tiempo prometido. 100% recomendado.",
    product: "Osito Amigurumi",
  },
  {
    id: 2,
    name: "Constanza",
    rating: 5,
    text: "Compré el patrón del gato y la explicación es súper clara. Ya hice 3 gatitos diferentes. ¡Me encanta!",
    product: "Patrón Gato Decorativo",
  },
  {
    id: 3,
    name: "Francisca",
    rating: 5,
    text: "Pedí un set de flores para mi mamá y quedó fascinada. La calidad del tejido es impecable.",
    product: "Set de Flores",
  },
  {
    id: 4,
    name: "Javiera",
    rating: 5,
    text: "El chal que me tejí es precioso. Me ayudaron a elegir los colores y quedó mejor de lo que imaginaba.",
    product: "Chal Tejido",
  },
  {
    id: 5,
    name: "Camila",
    rating: 5,
    text: "Mi hija está obsesionada con su amigurumi. Es su juguete favorito. Gracias por tanta dedicación!",
    product: "Amigurumi Personalizado",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-rose-200"}`} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-500 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          Testimonios
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text">Lo que dicen nuestras clientas</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonios.map((t) => (
          <div key={t.id} className="liquid-card rounded-3xl p-6">
            <StarRating rating={t.rating} />
            <p className="text-sm text-rose-text/60 leading-relaxed mt-4 mb-4 flex-1">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-rose-200/20">
              <div>
                <p className="text-sm font-bold text-rose-text">{t.name}</p>
                <p className="text-[11px] text-rose-text/30">{t.product}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
