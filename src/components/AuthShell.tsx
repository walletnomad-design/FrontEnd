import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthShellProps {
  active: "login" | "register";
  title: string;
  subtitle: string;
  children: ReactNode;
}

const CURRENCIES = [
  { code: "COP", flag: "🇨🇴" },
  { code: "USD", flag: "🇺🇸" },
  { code: "EUR", flag: "🇪🇺" },
];

export function AuthShell({ active, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-md animate-rise rounded-2xl border border-white/10 bg-surface p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet font-bold text-white">
            N
          </div>
          <span className="text-lg font-bold text-text">
            Nomad<span className="text-primary">Wallet</span>
          </span>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-text">{title}</h1>
        <p className="mb-6 text-sm text-muted">{subtitle}</p>

        <div className="mb-6 flex border-b border-white/10">
          <Link
            to="/login"
            className={`flex-1 border-b-2 pb-3 text-center text-sm font-medium transition-colors ${
              active === "login" ? "border-primary text-primary" : "border-transparent text-muted hover:text-text"
            }`}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className={`flex-1 border-b-2 pb-3 text-center text-sm font-medium transition-colors ${
              active === "register" ? "border-primary text-primary" : "border-transparent text-muted hover:text-text"
            }`}
          >
            Crear cuenta
          </Link>
        </div>

        {children}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs text-muted">Maneja tus monedas favoritas:</span>
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <span
              key={c.code}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-surface px-3 py-1 text-xs text-muted"
            >
              <span>{c.flag}</span>
              {c.code}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}