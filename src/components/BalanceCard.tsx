import { useEffect, useState } from "react";
import type { Balance } from "../types";
import { formatAmount } from "../utils/currency";

interface BalanceCardProps {
  balance: Balance;
}

const CURRENCY_ACCENT: Record<Balance["currency"], string> = {
  USD: "bg-mint",
  EUR: "bg-amber",
  COP: "bg-slate",
};

export function BalanceCard({ balance }: BalanceCardProps) {
  // Dispara la animación de "flip" cada vez que cambia el monto
  // (útil cuando en el futuro los balances se actualicen en vivo).
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    setFlipKey((k) => k + 1);
  }, [balance.amount]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate/15 bg-navy-card p-5 transition-all duration-300 ease-[var(--ease-board)] hover:-translate-y-0.5 hover:border-slate/30 hover:bg-navy-card-hover">
      {/* Barra de acento lateral, color distinto por moneda */}
      <span
        className={`absolute left-0 top-0 h-full w-1 ${CURRENCY_ACCENT[balance.currency]}`}
      />

      <div className="flex items-center justify-between">
        <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs font-semibold tracking-widest text-slate">
          {balance.currency}
        </span>
      </div>

      {/* Línea divisoria que simula el pliegue del panel split-flap */}
      <div className="relative mt-3">
        <span
          key={flipKey}
          className="block font-mono text-3xl font-semibold tabular-nums text-bone animate-rise"
        >
          {formatAmount(balance.amount, balance.currency)}
        </span>
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-navy/60" />
      </div>
    </div>
  );
}