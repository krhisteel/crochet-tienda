import Link from "next/link";

export function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2D2723] via-[#3d3530] to-[#2D2723]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blush/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-[0.03] select-none pointer-events-none">
          🧶
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
            <span className="text-white/80 text-xs font-medium">Hecho a mano con amor</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Cada puntada cuenta una{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blush-light to-amber-light">
              historia
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-lg mb-10 leading-relaxed">
            Amigurumis, ropa, accesorios y patrones tejidos a crochet. 
            Piezas únicas creadas con dedicación artesanal.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="#catalogo"
              className="inline-flex items-center justify-center gap-2 bg-blush hover:bg-blush-dark text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-blush/25 hover:shadow-xl hover:shadow-blush/30 hover:-translate-y-0.5"
            >
              Ver Catálogo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <Link
              href="https://wa.me/56936621284"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-full transition-all backdrop-blur-sm border border-white/10"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escribir por WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
