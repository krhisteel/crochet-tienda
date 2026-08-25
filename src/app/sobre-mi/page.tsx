import { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon, YarnBallIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Sobre Mí — Mundito Amigurumi",
  description:
    "Conocé a quien está detrás de cada tejido hecho a mano con amor y dedicación.",
};

export default function SobreMiPage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-100 rounded-full px-4 py-1.5 uppercase tracking-widest mb-4">
            Sobre Mí
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-rose-text mb-4">
            Hola, soy <span className="text-rose-400">[Tu Nombre]</span>
          </h1>
          <p className="text-lg text-rose-text/50 max-w-2xl mx-auto">
            La persona que está detrás de cada tejido hecho a mano.
          </p>
        </div>

        <div className="liquid-card rounded-3xl p-8 sm:p-12 mb-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-300/30 shrink-0">
              <YarnBallIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-rose-text mb-4">
                Mi Historia
              </h2>
              <div className="space-y-4 text-rose-text/60 leading-relaxed">
                <p>
                  Todo comenzó con un ovillo de lana y muchas ganas de aprender.
                  Lo que empezó como un pasatiempo se convirtió en mi manera
                  favorita de expresar creatividad y cariño.
                </p>
                <p>
                  Cada pieza que tejo lleva horas de dedicación, amor y mucha
                  paciencia. No hay dos piezas iguales, y eso es lo que las hace
                  especiales.
                </p>
                <p>
                  Me encanta ver la cara de alegría cuando alguien recibe un
                  amigurumi o prenda tejida a mano. Esa sonrisa es lo que me
                  motiva a seguir tejiendo día a día.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "♡",
              title: "Hecho a Mano",
              desc: "Cada pieza es tejida completamente a mano, sin máquinas.",
            },
            {
              icon: "✦",
              title: "Materiales Premium",
              desc: "Uso solo lanas y hilos de la mejor calidad para durabilidad.",
            },
            {
              icon: "✦",
              title: "Personalizado",
              desc: "Hago pedidos personalizados según tu gusto y necesidad.",
            },
          ].map((item, i) => (
            <div key={i} className="liquid-card rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-rose-text mb-2">{item.title}</h3>
              <p className="text-sm text-rose-text/50">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://wa.me/56936621284?text=Hola!%20Quería%20saber%20más%20sobre%20tus%20tejidos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-whatsapp text-white font-semibold px-8 py-4 rounded-full hover:bg-whatsapp-hover transition-all duration-300 shadow-lg shadow-whatsapp/20 hover:shadow-xl hover:shadow-whatsapp/30 hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Escribime en WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
