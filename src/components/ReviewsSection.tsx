"use client";

import { useState, useEffect, useCallback } from "react";
import { StarIcon } from "./Icons";
import { ReviewForm } from "./ReviewForm";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {}
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-rose-text">Reseñas</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} className="w-4 h-4 text-rose-300" filled={s <= Math.round(avgRating)} />
                ))}
              </div>
              <span className="text-sm text-rose-text/40">
                {avgRating.toFixed(1)} ({reviews.length} reseña{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-semibold text-rose-400 hover:text-rose-500 transition-colors"
        >
          {showForm ? "Cancelar" : "+ Escribir reseña"}
        </button>
      </div>

      {showForm && (
        <div className="liquid-card rounded-2xl p-5">
          <ReviewForm productId={productId} onSuccess={() => { fetchReviews(); setShowForm(false); }} />
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <p className="text-sm text-rose-text/40 text-center py-4">
          Todavía no hay reseñas. ¡Sé el primero!
        </p>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="liquid-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-rose-text">{review.name}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} className="w-3.5 h-3.5 text-rose-300" filled={s <= review.rating} />
                ))}
              </div>
            </div>
            <p className="text-sm text-rose-text/60">{review.comment}</p>
            <p className="text-xs text-rose-text/30 mt-2">
              {new Date(review.createdAt).toLocaleDateString("es-CL")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
