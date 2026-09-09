import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import * as moneyOpsApi from "../services/moneyOpsApi";
import { formatAmount } from "../utils/currency";
import { ApiError, type Currency, type Transaction } from "../types";

const CURRENCIES: Currency[] = ["USD", "EUR", "COP"];

interface TransferFormProps {
  onSuccess: (tx: Transaction) => void;
}

export function TransferForm({ onSuccess }: TransferFormProps) {
  const [toEmail, setToEmail] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericAmount = Number(amount);
  const hasValidAmount = amount.trim() !== "" && numericAmount > 0;
  const hasValidEmail = /\S+@\S+\.\S+/.test(toEmail.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasValidEmail) {
      setError("Ingresá un email de destinatario válido");
      return;
    }
    if (!hasValidAmount) {
      setError("Ingresá un monto válido, mayor a cero");
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await moneyOpsApi.transfer({ toEmail: toEmail.trim(), currency, amount: numericAmount });
      setAmount("");
      onSuccess(tx);
    } catch (err) {
      if (err instanceof ApiError && err.code === "INSUFFICIENT_BALANCE") {
        const c = err.currency ?? currency;
        const available = err.available ?? 0;
        setError(`Saldo insuficiente. Máximo disponible: ${formatAmount(available, c)}`);
      } else {
        setError(err instanceof Error ? err.message : "No se pudo completar la transferencia");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email del destinatario"
        type="email"
        value={toEmail}
        onChange={(e) => setToEmail(e.target.value)}
        placeholder="amigo@mail.com"
        autoFocus
      />

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
        label={`Monto a transferir en ${currency}`}
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
      />

      <ErrorMessage message={error} />

      <Button type="submit" isLoading={isSubmitting} disabled={!hasValidAmount || !hasValidEmail}>
        Transferir
      </Button>
    </form>
  );
}