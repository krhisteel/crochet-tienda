import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
