import type { Balance } from "../types";
import { formatAmount } from "../utils/currency";

interface BalanceCardProps {
  balance: Balance;
}

const CURRENCY_ACCENT: Record<Balance["currency"], string> = {
  USD: "bg-green-400",
  EUR: "bg-violet",
  COP: "bg-blue",
};

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-surface-hover">
      <span className={`absolute left-0 top-0 h-full w-1 ${CURRENCY_ACCENT[balance.currency]}`} />

      <span className="rounded-md bg-white/5 px-2 py-1 text-xs font-semibold tracking-widest text-muted">
        {balance.currency}
      </span>

      <p className="mt-3 text-2xl font-semibold tabular-nums text-text sm:text-3xl">
        {formatAmount(balance.amount, balance.currency)}
      </p>
    </div>
  );
}