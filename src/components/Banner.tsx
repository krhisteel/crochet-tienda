"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Banner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blush/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber/8 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blush-light/5 blur-[150px]" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <svg
            key={i}
            className="absolute opacity-[0.03]"
            style={{
              top: `${10 + i * 15}%`,
              left: `${5 + i * 18}%`,
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              animation: `floatYarn ${18 + i * 4}s linear infinite`,
              animationDelay: `${i * 3}s`,
            }}
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="1.5" strokeDasharray="4 8" />
            <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="1" />
          </svg>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 w-full">
        <div className="max-w-2xl">
          <div
            className={`inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2 mb-8 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
            <span className="text-white/70 text-xs font-medium tracking-wide">Hecho a mano con amor</span>
          </div>

          <h1
            className={`text-5xl sm:text-7xl font-bold text-white mb-8 leading-[1.05] tracking-tight transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Cada puntada
            <br />
            cuenta una{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blush-light via-blush to-amber-light">
                historia
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 Q50 2 100 7 Q150 12 198 4" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" className="thread-path" />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0">
                    <stop offset="0%" stopColor="#D4849A" />
                    <stop offset="100%" stopColor="#E8C9A0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl text-white/40 max-w-lg mb-12 leading-relaxed transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Amigurumis, ropa, accesorios y patrones tejidos a crochet.
            Piezas únicas creadas con dedicación artesanal.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="#catalogo"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blush to-blush-dark text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-xl shadow-blush/25 hover:shadow-2xl hover:shadow-blush/35 hover:-translate-y-1 shimmer"
            >
              Ver Catálogo
              <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <Link
              href="https://wa.me/56936621284"
              target="_blank"
              className="group inline-flex items-center justify-center gap-3 liquid-glass text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escribir por WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
