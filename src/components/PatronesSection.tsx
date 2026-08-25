"use client";

const patrones = [
  {
    id: 1,
    title: "Amigurumi Osito Clásico",
    description: "Patrón paso a paso para tejer un osito de 15cm. Incluye instrucciones para vestido.",
    difficulty: "Fácil",
    pages: 12,
    price: 3500,
    materials: "Lana acrílica, aguja 3mm",
  },
  {
    id: 2,
    title: "Gato.colgante decorativo",
    description: "Pequeño gato para colgar en llaveros o bolsos. Ideal para regalar.",
    difficulty: "Fácil",
    pages: 8,
    price: 2500,
    materials: "Lana acrílica, aguja 2.5mm",
  },
  {
    id: 3,
    title: "Base para Bucket Hat",
    description: "Base completa para tejer tu propio sombrero estilo bucket hat.",
    difficulty: "Intermedio",
    pages: 15,
    price: 4500,
    materials: "Algodón, aguja 4mm",
  },
  {
    id: 4,
    title: "Amigurumi Dragón",
    description: "Dragón kawaii con alas y colita. Proyecto para tejedoras con experiencia.",
    difficulty: "Avanzado",
    pages: 20,
    price: 6000,
    materials: "Lana acrílica, aguja 3mm, ojos de seguridad",
  },
  {
    id: 5,
    title: "Kit de Flores crochet",
    description: "5 diseños de flores: rosa, girasol, lavanda, margarita y tulipán.",
    difficulty: "Fácil",
    pages: 18,
    price: 5000,
    materials: "Algodón, aguja 2.5mm",
  },
  {
    id: 6,
    title: "Chal triangular tejido",
    description: "Chal elegante con bordado floral. Perfecto para ocasiones especiales.",
    difficulty: "Intermedio",
    pages: 22,
    price: 7000,
    materials: "Lana merino, aguja 5mm",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);
}

const difficultyColor: Record<string, string> = {
  Fácil: "bg-emerald-100 text-emerald-600",
  Intermedio: "bg-amber-100 text-amber-600",
  Avanzado: "bg-rose-100 text-rose-600",
};

export function PatronesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-500 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          Patrones PDF
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text">Descargá y Tejí</h2>
        <p className="text-rose-text/40 mt-3 max-w-lg mx-auto">
          Patrones digitales con instrucciones detalladas para que tejas tus propios proyectos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {patrones.map((p) => (
          <div key={p.id} className="liquid-card rounded-3xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${difficultyColor[p.difficulty]}`}>
                {p.difficulty}
              </span>
              <span className="text-[10px] text-rose-text/30">{p.pages} páginas</span>
            </div>

            <h3 className="font-bold text-rose-text text-lg mb-2">{p.title}</h3>
            <p className="text-sm text-rose-text/50 leading-relaxed mb-4 flex-1">{p.description}</p>

            <div className="text-[11px] text-rose-text/30 mb-4">
              <span className="font-semibold">Materiales:</span> {p.materials}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-rose-200/20">
              <span className="text-xl font-bold text-rose-text">{formatPrice(p.price)}</span>
              <a
                href={`https://wa.me/56936621284?text=${encodeURIComponent(`Hola! Quiero comprar el patrón: ${p.title} — ${formatPrice(p.price)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp text-white text-xs font-semibold px-4 py-2.5 hover:bg-whatsapp-hover transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Comprar
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
