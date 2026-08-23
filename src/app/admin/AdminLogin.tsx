"use client";

import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [token, setToken] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem("admin-token", token.trim());
      onLogin();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-charcoal/5 mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-xl font-bold text-charcoal">Panel de Admin</h1>
          <p className="text-sm text-charcoal/40 mt-1">
            Ingresa el token para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token de administrador"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/40 text-center text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-charcoal text-white font-semibold py-3 hover:bg-charcoal-light transition-all shadow-sm hover:shadow-md text-sm"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
