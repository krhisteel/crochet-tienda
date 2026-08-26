"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-rose-200"}`} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews/public")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-500 text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-4">
          Testimonios
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-rose-text">Lo que dicen nuestras clientas</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <div key={r.id} className="liquid-card rounded-3xl p-6">
            <StarRating rating={r.rating} />
            <p className="text-sm text-rose-text/60 leading-relaxed mt-4 mb-4 flex-1">
              &ldquo;{r.comment}&rdquo;
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-rose-200/20">
              <div>
                <p className="text-sm font-bold text-rose-text">{r.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
