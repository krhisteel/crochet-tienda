import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tejidos a Crochet | Artesanías Hechas a Mano",
  description:
    "Tienda artesanal de productos tejidos a crochet: amigurumis, ropa, accesorios y patrones digitales. Cada pieza es única y hecha con amor.",
  keywords: ["crochet", "amigurumi", "tejidos a mano", "ropa tejida", "patrones crochet"],
  openGraph: {
    title: "Tejidos a Crochet | Artesanías Hechas a Mano",
    description:
      "Tienda artesanal de productos tejidos a crochet: amigurumis, ropa, accesorios y patrones digitales.",
    type: "website",
    locale: "es_CL",
    siteName: "Tejidos a Crochet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tejidos a Crochet | Artesanías Hechas a Mano",
    description:
      "Tienda artesanal de productos tejidos a crochet: amigurumis, ropa, accesorios y patrones digitales.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-rose-text font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
