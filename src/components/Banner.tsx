import Link from "next/link";

export function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blush via-blush-light to-amber/40 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-8 text-8xl">🧶</div>
        <div className="absolute bottom-4 right-8 text-8xl">🪡</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem]">
          🧸
        </div>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 drop-shadow-sm">
          Tejidos a Crochet
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
          Cada pieza es única, tejida a mano con dedicación y amor. Encuentra
          amigurumis, ropa, accesorios y patrones para crear tus propios
          proyectos.
        </p>
        <Link
          href="#catalogo"
          className="inline-flex items-center gap-2 rounded-full bg-white text-blush font-bold px-8 py-3 shadow-lg hover:shadow-xl hover:bg-cream transition-all"
        >
          Ver Catálogo ↓
        </Link>
      </div>
    </section>
  );
}
