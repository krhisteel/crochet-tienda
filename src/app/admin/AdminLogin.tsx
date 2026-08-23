"use client";

import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem("admin-token", token.trim());
      onLogin();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-beige p-8 text-center">
        <p className="text-5xl mb-4">🔐</p>
        <h1 className="text-xl font-bold text-charcoal mb-2">Panel Admin</h1>
        <p className="text-sm text-charcoal/50 mb-6">
          Ingresa el token de administrador para continuar
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={token}
            onChange={(e) => { setToken(e.target.value); setError(false); }}
            placeholder="Token de admin"
            className="w-full rounded-xl border border-beige bg-cream/50 px-4 py-2.5 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush text-center"
          />
          {error && (
            <p className="text-red-500 text-xs">Token inválido</p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-blush text-white font-bold py-2.5 hover:bg-blush-light transition-colors shadow-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
