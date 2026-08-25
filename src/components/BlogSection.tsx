"use client";

import { useState } from "react";

const posts = [
  {
    id: 1,
    title: "Cómo empezar a tejer amigurumis",
    excerpt: "Guía completa para principiantes: materiales básicos, puntos esenciales y tu primer proyecto.",
    date: "15 Mar 2026",
    readTime: "5 min",
    category: "Principiantes",
    content: `Empezar a tejer amigurumis es más fácil de lo que parece. Necesitás solo algunos materiales básicos y ganas de aprender.

**Materiales que necesitás:**
- Lana acrílica de color a tu gusto
- Aguja de crochet del número adecuado (generalmente 2.5mm a 3.5mm)
- Ojos de seguridad
- Relleno de fibra
- Tijeras e hilo de color similar

**Puntos esenciales:**
- Anillo mágico
- Punto bajo (pb)
- Aumento (aum)
- Disminución (dis)

Con estos 4 puntos podés crear cualquier amigurumi. Lo importante es practice y tener paciencia.`,
  },
  {
    id: 2,
    title: "Cuidados de tus tejidos a crochet",
    excerpt: "Cómo lavar, secar y guardar tus amigurumis para que duren mucho tiempo.",
    date: "10 Mar 2026",
    readTime: "3 min",
    category: "Cuidados",
    content: `Tus tejidos artesanales merecen un cuidado especial para mantenerse como nuevos por mucho tiempo.

**Lavado:**
- Lavar a mano con agua tibia (no caliente)
- Usar jabón neutro o shampoo suave
- No frotar con fuerza, simplemente presionar

**Secado:**
- Escurrir suavemente sin exprimir
- Secar a la sombra, nunca al sol directo
- Puedes usar una toalla para absorber el exceso de agua

**Guardado:**
- Guardar en lugar fresco y seco
- Evitar la luz solar directa
- Usar bolsa de tela para proteger del polvo`,
  },
  {
    id: 3,
    title: "Tendencias en crochet 2026",
    excerpt: "Los colores, figuras y estilos que están marcando el año en el mundo del tejido.",
    date: "1 Mar 2026",
    readTime: "4 min",
    category: "Tendencias",
    content: `El crochet sigue creciendo como tendencia artesanal. Estos son los looks que dominan este año:

**Colores pasteles:**
El rosa, lavanda y menta siguen liderando. Son perfectos para amigurumis y ropa tejida.

**Amigurumis kawaii:**
Las figuras con caras tiernas y proporciones exageradas siguen siendo las más buscadas.

**Ropa oversized:**
Cardigans y sweaters holgados tejidos a crochet son tendencia en moda.

**Accesorios ecológicos:**
Bolsos y bucket hats tejidos a mano reemplazan los productos industriales.`,
  },
  {
    id: 4,
    title: "Tips para vender tus tejidos",
    excerpt: "Consejos prácticos para convertir tu hobby en un negocio rentable.",
    date: "20 Feb 2026",
    readTime: "6 min",
    category: "Negocios",
    content: `Si te encanta tejer y quieres monetizar tu talento, estos tips te van a ayudar:

**1. Fotos de calidad:**
Invierte en buenas fotos. Un fondo limpio y luz natural hacen la diferencia.

**2. Precios justos:**
Calcula el costo de materiales + tiempo de trabajo + gastos operativos. No regales tu trabajo.

**3. Redes sociales:**
Instagram y TikTok son tus mejores aliados. Publica contenido de proceso y resultado.

**4. Atención personalizada:**
La diferencia entre una venta y un cliente fiel es el trato personal.

**5. Paciencia:**
Un negocio artesanal crece lento pero constante. No te desanimes.`,
  },
];

export function BlogSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-500 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          Blog
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text">Noticias y Consejos</h2>
        <p className="text-rose-text/40 mt-3 max-w-lg mx-auto">
          Tips, tendencias y todo sobre el mundo del crochet
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="liquid-card rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-bold text-rose-400 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-[11px] text-rose-text/30">{post.date}</span>
                <span className="text-[11px] text-rose-text/30">· {post.readTime}</span>
              </div>

              <h3 className="text-xl font-bold text-rose-text mb-3">{post.title}</h3>
              <p className="text-sm text-rose-text/50 leading-relaxed">{post.excerpt}</p>

              {expanded === post.id && (
                <div className="mt-4 pt-4 border-t border-rose-200/20 text-sm text-rose-text/60 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              )}

              <button
                onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                className="mt-4 text-sm font-semibold text-rose-400 hover:text-rose-500 transition-colors"
              >
                {expanded === post.id ? "Leer menos ↑" : "Leer más ↓"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
