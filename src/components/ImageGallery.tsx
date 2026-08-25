"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  mainImage: string | null;
  images: string | null;
  title: string;
}

export function ImageGallery({ mainImage, images, title }: Props) {
  let allImages: string[] = [];
  if (mainImage) allImages.push(mainImage);
  if (images) {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) allImages = [...allImages, ...parsed];
    } catch {}
  }

  const [selected, setSelected] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-square rounded-[2rem] overflow-hidden liquid-card p-2">
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-rose-100 via-rose-50 to-cream flex items-center justify-center">
          <svg className="w-24 h-24 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
          </svg>
        </div>
      </div>
    );
  }

  if (allImages.length === 1) {
    return (
      <div className="relative aspect-square rounded-[2rem] overflow-hidden liquid-card p-2">
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
          <Image src={allImages[0]} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square rounded-[2rem] overflow-hidden liquid-card p-2">
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
          <Image src={allImages[selected]} alt={title} fill className="object-cover transition-opacity duration-300" sizes="(max-width: 768px) 100vw, 50vw" priority />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {allImages.map((url, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
              selected === i ? "border-rose-400 shadow-lg shadow-rose-300/20" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={url} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
