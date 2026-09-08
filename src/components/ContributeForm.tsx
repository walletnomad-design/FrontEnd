import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import * as goalsApi from "../services/goalsApi";
import { formatAmount } from "../utils/currency";
import type { Goal } from "../types";

interface ContributeFormProps {
  goal: Goal;
  onSuccess: (goal: Goal) => void;
  onCancel: () => void;
}

export function ContributeForm({ goal, onSuccess, onCancel }: ContributeFormProps) {
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
      const updated = await goalsApi.addContribution(goal.id, { amount: numericAmount });
      onSuccess(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el aporte");
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
        <Button type="submit" isLoading={isSubmitting} disabled={!hasValidAmount} className="flex-1">
          Aportar
        </Button>
      </div>
    </form>
  );
}