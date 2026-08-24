"use client";

import { useState } from "react";

export function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="liquid-card rounded-2xl p-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-sm font-bold text-rose-text flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
          </div>
          Guía de Tamaños
        </h3>
        <svg
          className={`w-5 h-5 text-rose-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 text-sm text-rose-text/60">
          <table className="w-full">
            <thead>
              <tr className="border-b border-rose-200/20">
                <th className="text-left py-2 text-xs text-rose-text/40 font-semibold">Tamaño</th>
                <th className="text-left py-2 text-xs text-rose-text/40 font-semibold">Altura</th>
                <th className="text-left py-2 text-xs text-rose-text/40 font-semibold">Pecho</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-rose-200/10">
                <td className="py-2 font-medium">XS</td>
                <td className="py-2">155-160 cm</td>
                <td className="py-2">80-84 cm</td>
              </tr>
              <tr className="border-b border-rose-200/10">
                <td className="py-2 font-medium">S</td>
                <td className="py-2">160-165 cm</td>
                <td className="py-2">84-88 cm</td>
              </tr>
              <tr className="border-b border-rose-200/10">
                <td className="py-2 font-medium">M</td>
                <td className="py-2">165-170 cm</td>
                <td className="py-2">88-92 cm</td>
              </tr>
              <tr className="border-b border-rose-200/10">
                <td className="py-2 font-medium">L</td>
                <td className="py-2">170-175 cm</td>
                <td className="py-2">92-96 cm</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">XL</td>
                <td className="py-2">175-180 cm</td>
                <td className="py-2">96-100 cm</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-rose-text/30">
            * Los amigurumis miden entre 15-30 cm según diseño.
          </p>
        </div>
      )}
    </div>
  );
}
