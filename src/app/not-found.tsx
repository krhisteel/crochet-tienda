import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-7xl mb-6">🧶</p>
      <h1 className="text-3xl font-bold text-charcoal mb-2">Página no encontrada</h1>
      <p className="text-charcoal/60 mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o fue movida. Te invitamos a seguir explorando nuestros tejidos.
      </p>
      <Link
        href="/"
        className="rounded-full bg-blush text-white font-bold px-8 py-3 hover:bg-blush-light transition-colors shadow-md"
      >
        Volver al Catálogo
      </Link>
    </div>
  );
}
