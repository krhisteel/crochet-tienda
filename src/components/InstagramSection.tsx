"use client";

export function InstagramSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-500 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          @munditoamigurumi
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text">Seguinos en Instagram</h2>
        <p className="text-rose-text/40 mt-3">Novelas, procesos y clientes felices</p>
      </div>

      <a
        href="https://www.instagram.com/munditoamigurumi/"
        target="_blank"
        rel="noopener noreferrer"
        className="block liquid-card rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-rose-300/10 transition-all duration-500 group"
      >
        <div className="relative bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 p-10 sm:p-16 text-center">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="65" cy="35" r="4" />
            </svg>
          </div>

          <div className="relative z-10">
            <svg className="w-16 h-16 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">@munditoamigurumi</h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">
              Mostrá tu amor por el crochet. Seguinos para ver nuevos diseños, tutoriales y más.
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-rose-500 font-bold px-8 py-3 rounded-full group-hover:shadow-xl transition-all duration-300">
              Seguir en Instagram
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </section>
  );
}
