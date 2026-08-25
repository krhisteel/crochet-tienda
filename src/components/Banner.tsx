"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WhatsAppIcon, ChevronDownIcon } from "./Icons";

export function Banner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
            alt="Amigurumis artesanales de Mundito Amigurumi"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/80 via-rose-400/60 to-rose-300/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-600/40 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-32 w-full">
        <div className="max-w-2xl">
          <div
            className={`inline-flex items-center gap-2.5 bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/25 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Artesanía con amor</span>
          </div>

          <h1
            className={`text-5xl sm:text-7xl font-extrabold text-white mb-8 leading-[1.05] tracking-tight transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Amigurumis que
            <br />
            enamoran
          </h1>

          <p
            className={`text-lg sm:text-xl text-white/75 max-w-lg mb-12 leading-relaxed transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Cada puntada es única. Amigurumis, ropa, accesorios y patrones
            tejidos a mano con dedicación y los mejores materiales.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <a
              href="#catalogo"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center justify-center gap-3 bg-white text-rose-500 font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-2xl shadow-rose-500/20 hover:shadow-rose-400/30 hover:-translate-y-1"
            >
              Explorar Catálogo
              <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <Link
              href="https://wa.me/56936621284"
              target="_blank"
              className="group inline-flex items-center justify-center gap-3 bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/25 hover:-translate-y-1"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
