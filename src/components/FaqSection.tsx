"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "Depende del producto. Los amigurumis tardan entre 3-7 días hábiles. Las prendas de ropa pueden tomar 1-2 semanas. Te aviso por WhatsApp cuando esté listo.",
  },
  {
    q: "¿Puedo pedir algo personalizado?",
    a: "¡Sí! Escribime por WhatsApp con tu idea y te doy un presupuesto sin compromiso. Me encantan los desafíos.",
  },
  {
    q: "¿Qué materiales usás?",
    a: "Uso lana acrílica de alta calidad, algodón mercerizado y ojos de seguridad plásticos. Todos los materiales son aptos para niños.",
  },
  {
    q: "¿Cómo cuido mi amigurumi?",
    a: "Lavado a mano con agua tibia, sin lejía. Secar a la sombra sin exprimir. No planchar directamente.",
  },
  {
    q: "¿Aceptas devoluciones?",
    a: "Si el producto llega dañado o no coincide con lo acordado, lo reemplazo sin costo. Contame por WhatsApp.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-100 rounded-full px-4 py-1.5 uppercase tracking-widest mb-4">
          Preguntas Frecuentes
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text mb-3">
          ¿Tenés dudas?
        </h2>
        <p className="text-sm text-rose-text/40 max-w-md mx-auto">
          Acá respondo las preguntas más comunes
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="liquid-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-semibold text-sm text-rose-text pr-4">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-rose-300 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 text-sm text-rose-text/60 leading-relaxed border-t border-rose-200/10 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
