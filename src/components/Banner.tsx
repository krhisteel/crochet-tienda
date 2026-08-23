"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WhatsAppIcon, ChevronDownIcon, YarnBallIcon } from "./Icons";

export function Banner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1920&q=80"
          alt="Tejidos a crochet artesanales"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/85 via-rose-500/70 to-rose-400/60" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 opacity-[0.08]">
          <YarnBallIcon className="w-40 h-40 text-white" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-[0.08]">
          <YarnBallIcon className="w-56 h-56 text-white" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 w-full">
        <div className="max-w-2xl">
          <div
            className={`inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-200 animate-pulse" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">Hecho a mano con amor</span>
          </div>

          <h1
            className={`text-5xl sm:text-7xl font-extrabold text-white mb-8 leading-[1.05] tracking-tight transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Cada puntada
            <br />
            cuenta una{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-rose-200 to-rose-100">
                historia
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 Q50 2 100 7 Q150 12 198 4" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" className="thread-path" />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0">
                    <stop offset="0%" stopColor="#F0B8C8" />
                    <stop offset="100%" stopColor="#FBD5DE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl text-white/70 max-w-lg mb-12 leading-relaxed transition-all duration-700 delay-200 ${
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
              className="group inline-flex items-center justify-center gap-3 bg-white text-rose-500 font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-xl shadow-rose-400/20 hover:shadow-2xl hover:shadow-rose-300/30 hover:-translate-y-1 shimmer"
            >
              Ver Catálogo
              <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="https://wa.me/56936621284"
              target="_blank"
              className="group inline-flex items-center justify-center gap-3 bg-white/15 backdrop-blur-sm border border-white/25 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/25 hover:-translate-y-1"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Escribir por WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
