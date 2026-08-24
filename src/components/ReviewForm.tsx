"use client";

import { useState } from "react";
import { StarIcon } from "./Icons";

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !rating || !comment) {
      setError("Completá todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment, productId }),
      });

      if (!res.ok) throw new Error("Error al enviar");

      setName("");
      setRating(0);
      setComment("");
      onSuccess();
    } catch {
      setError("No se pudo enviar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-rose-text mb-1">Tu nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="María"
          className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-rose-200/40 text-sm text-rose-text placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-rose-text mb-1">Calificación</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <StarIcon
                className="w-6 h-6 text-rose-300"
                filled={star <= (hoverRating || rating)}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-rose-text mb-1">Tu reseña</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Qué te pareció el producto?"
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-rose-200/40 text-sm text-rose-text placeholder:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300/40 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold text-sm hover:from-rose-400 hover:to-rose-500 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}
