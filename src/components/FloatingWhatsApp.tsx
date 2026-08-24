"use client";

import { WhatsAppIcon } from "./Icons";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/56936621284?text=Hola!%20Me%20interesan%20sus%20tejidos"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 transition-all duration-300 animate-bounce"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
