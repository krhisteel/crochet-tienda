"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";

interface Props {
  mainImage: string | null;
  images: string | null;
  title: string;
}

export function ImageGallery({ mainImage, images, title }: Props) {
  const allImages = useMemo(() => {
    const result: string[] = [];
    if (mainImage) result.push(mainImage);
    if (images) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) result.push(...parsed);
      } catch {}
    }
    return result;
  }, [mainImage, images]);

  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setSelected((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prev = useCallback(() => {
    setSelected((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (allImages.length <= 1 || paused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [allImages.length, paused, next]);

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-[4/3] max-h-[400px] rounded-2xl overflow-hidden liquid-card p-1.5">
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-rose-100 via-rose-50 to-cream flex items-center justify-center">
          <svg className="w-20 h-20 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <path d="M6.5 8.5c1.5 2 3.5 3 5.5 3s4-1 5.5-3" />
          </svg>
        </div>
      </div>
    );
  }

  if (allImages.length === 1) {
    return (
      <div className="relative aspect-[4/3] max-h-[400px] rounded-2xl overflow-hidden liquid-card p-1.5">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image src={allImages[0]} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] max-h-[400px] rounded-2xl overflow-hidden liquid-card p-1.5">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {allImages.map((url, i) => (
            <Image
              key={url}
              src={url}
              alt={`${title} ${i + 1}`}
              fill
              className={`object-cover transition-all duration-700 ${
                i === selected ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-rose-text/60 hover:text-rose-text hover:bg-white/90 transition-all duration-300 shadow-lg"
          aria-label="Imagen anterior"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-rose-text/60 hover:text-rose-text hover:bg-white/90 transition-all duration-300 shadow-lg"
          aria-label="Imagen siguiente"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selected ? "w-5 bg-white shadow-lg" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-none justify-center">
        {allImages.map((url, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-300 ${
              selected === i ? "border-rose-400 shadow-md shadow-rose-300/20 scale-105" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={url} alt="" fill className="object-cover" sizes="56px" />
          </button>
        ))}
      </div>
    </div>
  );
}
