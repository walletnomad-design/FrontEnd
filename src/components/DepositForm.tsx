import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import * as moneyOpsApi from "../services/moneyOpsApi";
import type { Currency, Transaction } from "../types";

const CURRENCIES: Currency[] = ["USD", "EUR", "COP"];

interface DepositFormProps {
  onSuccess: (tx: Transaction) => void;
}

export function DepositForm({ onSuccess }: DepositFormProps) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericAmount = Number(amount);
  const hasValidAmount = amount.trim() !== "" && numericAmount > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasValidAmount) {
      setError("Ingresá un monto válido, mayor a cero");
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await moneyOpsApi.deposit({ currency, amount: numericAmount });
      setAmount("");
      onSuccess(tx);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el depósito");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Moneda
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-text outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c} className="bg-surface">
              {c}
            </option>
          ))}
        </select>
      </div>

      <Input
        label={`Monto a depositar en ${currency}`}
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        autoFocus
      />

      <ErrorMessage message={error} />

      <Button type="submit" isLoading={isSubmitting} disabled={!hasValidAmount}>
        Depositar
      </Button>
    </form>
  );
}