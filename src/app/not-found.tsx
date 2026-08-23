import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <svg className="w-24 h-24 text-rose-200/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
          <path d="M7 13c1.5 1.5 3 2.5 5 2.5s3.5-1 5-2.5" />
          <path d="M8 17c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" />
        </svg>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center">
          <span className="text-xs font-bold text-white">404</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-rose-text mb-3">Página no encontrada</h1>
      <p className="text-sm text-rose-text/40 mb-8 max-w-sm">
        La página que buscás no existe o fue movida. Explorá nuestro catálogo de tejidos.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold px-8 py-3.5 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300 text-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Volver al Catálogo
      </Link>
    </div>
  );
}
