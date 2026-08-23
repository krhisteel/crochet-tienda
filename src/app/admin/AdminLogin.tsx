"use client";

import { useState } from "react";
import { LockIcon } from "@/components/Icons";

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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blush/10 to-beige mb-6">
            <LockIcon className="w-8 h-8 text-blush" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">Panel de Admin</h1>
          <p className="text-sm text-charcoal/40">
            Ingresa el token para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token de administrador"
            className="w-full rounded-2xl border border-black/5 bg-white px-5 py-4 text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-blush/20 focus:border-blush/30 text-center transition-all duration-300"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blush to-blush-dark text-white font-semibold py-4 hover:shadow-lg hover:shadow-blush/20 transition-all duration-300 text-sm"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
