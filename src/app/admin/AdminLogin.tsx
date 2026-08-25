"use client";

import { useState } from "react";
import { LockIcon } from "@/components/Icons";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/products", {
        headers: { "x-admin-token": token.trim() },
      });

      if (res.ok) {
        localStorage.setItem("admin-token", token.trim());
        onLogin();
      } else {
        setError("Token incorrecto. Intentá de nuevo.");
      }
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 mb-6">
            <LockIcon className="w-8 h-8 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-rose-text mb-2">Panel de Admin</h1>
          <p className="text-sm text-rose-text/40">
            Ingresa el token para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={token}
            onChange={(e) => { setToken(e.target.value); setError(""); }}
            placeholder="Token de administrador"
            className="w-full rounded-2xl border border-rose-200/50 bg-white px-5 py-4 text-sm text-rose-text placeholder:text-rose-text/20 focus:outline-none focus:ring-2 focus:ring-rose-300/30 focus:border-rose-300 text-center transition-all duration-300"
          />
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-300 to-rose-400 text-white font-semibold py-4 hover:shadow-lg hover:shadow-rose-300/20 transition-all duration-300 text-sm disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
