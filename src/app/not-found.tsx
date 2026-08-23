import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <div className="text-8xl opacity-15">🧶</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blush/20 flex items-center justify-center">
          <span className="text-sm font-bold text-blush">404</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-charcoal mb-3">Página no encontrada</h1>
      <p className="text-sm text-charcoal/40 mb-8 max-w-sm">
        La página que buscás no existe o fue movida. Explorá nuestro catálogo de tejidos.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blush to-blush-dark text-white font-semibold px-8 py-3.5 hover:shadow-lg hover:shadow-blush/20 transition-all duration-300 text-sm"
      >
        Volver al Catálogo
      </Link>
    </div>
  );
}
