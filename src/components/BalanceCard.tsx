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
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    setFlipKey((k) => k + 1);
  }, [balance.amount]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate/15 bg-navy-card p-5 transition-all duration-300 ease-[var(--ease-board)] hover:-translate-y-0.5 hover:border-slate/30 hover:bg-navy-card-hover">
      <span
        className={`absolute left-0 top-0 h-full w-1 ${CURRENCY_ACCENT[balance.currency]}`}
      />

      {/* Línea escáner: brillo diagonal que recorre la tarjeta en loop */}
      <span className="pointer-events-none absolute inset-y-0 left-[-40%] w-1/4 -skew-x-[18deg] bg-gradient-to-r from-transparent via-amber/10 to-transparent animate-scan" />

      <div className="flex items-center justify-between">
        <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-xs font-semibold tracking-widest text-slate">
          {balance.currency}
        </span>
      </div>

      <div className="relative mt-3">
        <span
          key={flipKey}
          className="block font-mono text-2xl font-semibold tabular-nums text-bone animate-rise sm:text-3xl"
        >
          {formatAmount(balance.amount, balance.currency)}
        </span>
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-navy/60" />
      </div>
    </div>
  );
}