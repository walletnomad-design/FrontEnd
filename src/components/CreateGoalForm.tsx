import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import * as goalsApi from "../services/goalsApi";
import type { Currency, Goal } from "../types";

const CURRENCIES: Currency[] = ["USD", "EUR", "COP"];

interface CreateGoalFormProps {
  onSuccess: (goal: Goal) => void;
  onCancel: () => void;
}

export function CreateGoalForm({ onSuccess, onCancel }: CreateGoalFormProps) {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [targetAmount, setTargetAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericTarget = Number(targetAmount);
  const hasValidTarget = targetAmount.trim() !== "" && numericTarget > 0;
  const hasValidName = name.trim().length >= 2;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasValidName) {
      setError("Ingresá un nombre para la meta (mínimo 2 caracteres)");
      return;
    }
    if (!hasValidTarget) {
      setError("Ingresá un monto objetivo válido, mayor a cero");
      return;
    }

    setIsSubmitting(true);
    try {
      const goal = await goalsApi.createGoal({
        name: name.trim(),
        currency,
        targetAmount: numericTarget,
      });
      onSuccess(goal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la meta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Nombre de la meta"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Viaje a Bariloche"
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
        label={`Monto objetivo en ${currency}`}
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        placeholder="0.00"
      />

      <ErrorMessage message={error} />

      <div className="mt-1 flex gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!hasValidName || !hasValidTarget}
          className="flex-1"
        >
          Crear meta
        </Button>
      </div>
    </form>
  );
}