"use client";

import { useState } from "react";

export function CustomOrderSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name");
    const type = fd.get("type");
    const description = fd.get("description");
    const colors = fd.get("colors");
    const size = fd.get("size");

    const msg = encodeURIComponent(
      `Hola! Quiero hacer un pedido personalizado:\n\n` +
      `Nombre: ${name}\n` +
      `Tipo: ${type}\n` +
      `Descripción: ${description}\n` +
      `Colores: ${colors}\n` +
      `Tamaño: ${size}`
    );
    window.open(`https://wa.me/56936621284?text=${msg}`, "_blank");
    setSubmitted(true);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-500 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          A Medida
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text">Pedí tu tejido personalizado</h2>
        <p className="text-rose-text/40 mt-3 max-w-lg mx-auto">
          Contanos tu idea y lo hacemos realidad. Amigurumis, ropa, accesorios o lo que imagines.
        </p>
      </div>

      {submitted ? (
        <div className="liquid-card rounded-3xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-rose-text mb-2">¡Mensaje enviado!</h3>
          <p className="text-sm text-rose-text/40 mb-6">Te vamos a responder pronto por WhatsApp</p>
          <button onClick={() => setSubmitted(false)} className="text-sm font-semibold text-rose-400 hover:text-rose-500">
            Enviar otro pedido
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="liquid-card rounded-3xl p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">Tu nombre</label>
            <input name="name" required placeholder="Ej: María" className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">¿Qué querés?</label>
            <select name="type" required className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all appearance-none">
              <option value="">Seleccionar...</option>
              <option value="Amigurumi">Amigurumi</option>
              <option value="Ropa">Ropa tejida</option>
              <option value="Accesorio">Accesorio</option>
              <option value="Decoración">Decoración</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">Describí tu idea</label>
            <textarea name="description" required rows={4} placeholder="Contanos los detalles: personaje, estilo, inspiración..." className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 resize-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">Colores</label>
              <input name="colors" placeholder="Ej: Rosa y blanco" className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-rose-text/40 uppercase tracking-widest mb-2.5">Tamaño</label>
              <input name="size" placeholder="Ej: 20cm" className="w-full rounded-2xl border border-rose-200/40 bg-white px-5 py-3.5 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/20 focus:border-rose-300 transition-all" />
            </div>
          </div>

          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold py-3.5 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300">
            Enviar por WhatsApp
          </button>
        </form>
      )}
    </section>
  );
}
