"use client";

const cuidados = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
    title: "Lavado a mano",
    description: "Usá agua tibia y jabón neutro. No frotés con fuerza, presioná suavemente para limpiar.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    title: "Secado a la sombra",
    description: "Secá siempre a la sombra, nunca al sol directo. El sol decolora los tejidos.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    ),
    title: "Guardado correcto",
    description: "Guardá en lugar fresco y seco. Usá bolsa de tela para proteger del polvo.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Sin plancha",
    description: "Nunca planches directamente. Si necesitás alisar, usá vapor a distancia.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Sin químicos fuertes",
    description: "No uses lejía ni blanqueadores. Jabón neutro o shampoo suave es suficiente.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    title: "Amor y dedicación",
    description: "Cada pieza fue tejida a mano con mucho cariño. Tratala con el mismo amor.",
  },
];

export function CareGuideSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-500 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          Cuidados
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text">Guía de Cuidados</h2>
        <p className="text-rose-text/40 mt-3 max-w-lg mx-auto">
          Seguí estos consejos para que tus tejidos se mantengan como nuevos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cuidados.map((c, i) => (
          <div key={i} className="liquid-card rounded-3xl p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-400">
              {c.icon}
            </div>
            <h3 className="font-bold text-rose-text mb-2">{c.title}</h3>
            <p className="text-sm text-rose-text/50 leading-relaxed">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
