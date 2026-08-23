import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-7xl mb-6 opacity-20">🧶</div>
      <h1 className="text-2xl font-bold text-charcoal mb-2">Página no encontrada</h1>
      <p className="text-sm text-charcoal/40 mb-8 max-w-sm">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-charcoal text-white font-semibold px-6 py-3 hover:bg-charcoal-light transition-all shadow-sm text-sm"
      >
        Volver al Catálogo
      </Link>
    </div>
  );
}
