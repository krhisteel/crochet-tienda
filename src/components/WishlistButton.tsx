"use client";

import { useWishlist } from "@/context/WishlistContext";

export function WishlistButton({ productId }: { productId: string }) {
  const { toggle, isLiked } = useWishlist();
  const liked = isLiked(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        className={`w-4 h-4 transition-all duration-300 ${liked ? "text-rose-500 fill-rose-500 scale-110" : "text-rose-300"}`}
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
