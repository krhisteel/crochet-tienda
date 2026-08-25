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
  title: "Mundito Amigurumi | Artesanías Hechas a Mano",
  description:
    "Tienda artesanal de amigurumis, ropa, accesorios y patrones digitales tejidos a mano. Cada pieza es única y hecha con amor.",
  keywords: ["crochet", "amigurumi", "tejidos a mano", "ropa tejida", "patrones crochet"],
  openGraph: {
    title: "Mundito Amigurumi | Artesanías Hechas a Mano",
    description:
      "Tienda artesanal de amigurumis, ropa, accesorios y patrones digitales tejidos a mano.",
    type: "website",
    locale: "es_CL",
    siteName: "Mundito Amigurumi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mundito Amigurumi | Artesanías Hechas a Mano",
    description:
      "Tienda artesanal de amigurumis, ropa, accesorios y patrones digitales tejidos a mano.",
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
