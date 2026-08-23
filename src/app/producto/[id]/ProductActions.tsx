"use client";

import { WhatsAppIcon } from "@/components/Icons";

interface ProductActionsProps {
  title: string;
  price: string;
}

export function ProductActions({ title, price }: ProductActionsProps) {
  const msg = encodeURIComponent(
    `Hola! Me interesa: ${title} — ${price}\n¿Está disponible?`
  );
  const whatsappUrl = `https://wa.me/56936621284?text=${msg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2.5 w-full rounded-full bg-whatsapp text-white font-semibold py-4 px-6 hover:bg-whatsapp-hover transition-all duration-300 shadow-lg shadow-whatsapp/20 hover:shadow-xl hover:shadow-whatsapp/30 hover:-translate-y-0.5 text-base"
    >
      <WhatsAppIcon className="w-5 h-5" />
      Pedir por WhatsApp
    </a>
  );
}
