"use client";

import { WhatsAppIcon, ShareIcon, CopyIcon } from "@/components/Icons";
import { useState } from "react";

interface VariantSelection {
  name: string;
  qty: number;
}

interface ProductActionsProps {
  title: string;
  price: string;
  variants?: VariantSelection[];
}

export function ProductActions({ title, price, variants = [] }: ProductActionsProps) {
  const [copied, setCopied] = useState(false);

  const hasVariants = variants.length > 0;
  const totalItems = variants.reduce((s, v) => s + v.qty, 0);

  function buildMessage(): string {
    if (!hasVariants) {
      return `Hola! Me interesa: ${title} — ${price}\n¿Está disponible?`;
    }
    const lines = variants.map((v) => `  ${v.qty}x ${v.name}`);
    return `Hola! Me interesa:\n${title}\n${lines.join("\n")}\n\nPrecio: ${price}\n¿Está disponible?`;
  }

  const msg = encodeURIComponent(buildMessage());
  const whatsappUrl = `https://wa.me/56936621284?text=${msg}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`Mira este tejido: ${title} ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  const isDisabled = hasVariants && totalItems === 0;

  return (
    <div className="space-y-3">
      <a
        href={isDisabled ? undefined : whatsappUrl}
        target={isDisabled ? undefined : "_blank"}
        rel={isDisabled ? undefined : "noopener noreferrer"}
        onClick={(e) => { if (isDisabled) e.preventDefault(); }}
        className={`flex items-center justify-center gap-2.5 w-full rounded-full font-semibold py-4 px-6 transition-all duration-300 shadow-lg text-base ${
          isDisabled
            ? "bg-rose-200/50 text-rose-text/30 cursor-not-allowed shadow-none"
            : "bg-whatsapp text-white hover:bg-whatsapp-hover hover:shadow-xl hover:shadow-whatsapp/30 hover:-translate-y-0.5 shadow-whatsapp/20"
        }`}
      >
        <WhatsAppIcon className="w-5 h-5" />
        {hasVariants ? `Pedir${totalItems > 0 ? ` (${totalItems})` : ""} por WhatsApp` : "Pedir por WhatsApp"}
      </a>

      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-rose-100/60 text-rose-text font-semibold py-3 px-4 hover:bg-rose-100 transition-all duration-300 text-sm"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-emerald-500" />
              Copiado
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              Copiar enlace
            </>
          )}
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-rose-100/60 text-rose-text font-semibold py-3 px-4 hover:bg-rose-100 transition-all duration-300 text-sm"
        >
          <ShareIcon className="w-4 h-4" />
          Compartir
        </button>
      </div>
    </div>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
