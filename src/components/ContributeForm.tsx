import { useEffect, useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import * as goalsApi from "../services/goalsApi";
import * as walletApi from "../services/walletApi";
import { formatAmount } from "../utils/currency";
import { ApiError, type Goal } from "../types";

interface ContributeFormProps {
  goal: Goal;
  onSuccess: (goal: Goal) => void;
  onCancel: () => void;
}

export function ContributeForm({ goal, onSuccess, onCancel }: ContributeFormProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    walletApi
      .getBalances()
      .then((res) => {
        if (cancelled) return;
        const match = res.balances.find((b) => b.currency === goal.currency);
        setAvailableBalance(match ? match.amount : 0);
      })
      .catch(() => {
        // Si falla, no mostramos el dato — no bloquea el aporte, el backend igual valida.
      });
    return () => {
      cancelled = true;
    };
  }, [goal.currency]);

  const numericAmount = Number(amount);
  const hasValidAmount = amount.trim() !== "" && numericAmount > 0;
  const exceedsBalance = availableBalance !== null && numericAmount > availableBalance;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasValidAmount) {
      setError("Ingresá un monto válido, mayor a cero");
      return;
    }
    if (exceedsBalance) {
      setError(`No podés aportar más de lo disponible: ${formatAmount(availableBalance!, goal.currency)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await goalsApi.addContribution(goal.id, { amount: numericAmount });
      onSuccess(updated);
    } catch (err) {
      if (err instanceof ApiError && err.code === "INSUFFICIENT_BALANCE") {
        const currency = err.currency ?? goal.currency;
        const available = err.available ?? 0;
        setError(`Saldo insuficiente. Máximo disponible: ${formatAmount(available, currency)}`);
      } else {
        setError(err instanceof Error ? err.message : "No se pudo registrar el aporte");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-muted">
        Ahorrado hasta ahora: <b className="font-mono text-text">{formatAmount(goal.currentAmount, goal.currency)}</b>{" "}
        de {formatAmount(goal.targetAmount, goal.currency)}
      </p>

      {availableBalance !== null && (
        <p className="text-xs text-muted">
          Disponible: <b className="font-mono text-text">{formatAmount(availableBalance, goal.currency)}</b>
        </p>
      )}

      <Input
        label={`Monto a aportar en ${goal.currency}`}
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

      <div className="mt-1 flex gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!hasValidAmount || exceedsBalance}
          className="flex-1"
        >
          Aportar
        </Button>
      </div>
    </form>
  );
}