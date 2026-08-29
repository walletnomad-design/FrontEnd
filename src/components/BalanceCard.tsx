import type { Balance } from "../types";
import { formatAmount, CURRENCY_SYMBOL } from "../utils/currency";

interface BalanceCardProps {
  balance: Balance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4 shadow-sm">
      <span className="text-xs font-medium uppercase text-gray-500">
        {CURRENCY_SYMBOL[balance.currency]} · {balance.currency}
      </span>
      <span className="text-2xl font-bold text-gray-900">
        {formatAmount(balance.amount, balance.currency)}
      </span>
    </div>
  );
}