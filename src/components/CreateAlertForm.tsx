import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import * as alertsApi from "../services/alertsApi";
import type { AlertCondition, Currency, RateAlert } from "../types";

const CURRENCIES: Currency[] = ["USD", "EUR", "COP"];

const CONDITION_LABELS: Record<AlertCondition, string> = {
  gte: "sube hasta",
  lte: "baja hasta",
};

interface CreateAlertFormProps {
  onSuccess: (alert: RateAlert) => void;
  onCancel: () => void;
}

export function CreateAlertForm({ onSuccess, onCancel }: CreateAlertFormProps) {
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("EUR");
  const [condition, setCondition] = useState<AlertCondition>("gte");
  const [threshold, setThreshold] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericThreshold = Number(threshold);
  const hasValidThreshold = threshold.trim() !== "" && numericThreshold > 0;
  const sameCurrency = fromCurrency === toCurrency;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (sameCurrency) {
      setError("Elegí dos monedas distintas");
      return;
    }
    if (!hasValidThreshold) {
      setError("Ingresá un valor de referencia válido, mayor a cero");
      return;
    }

    setIsSubmitting(true);
    try {
      const alert = await alertsApi.createAlert({
        fromCurrency,
        toCurrency,
        threshold: numericThreshold,
        condition,
      });
      onSuccess(alert);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la alerta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Desde
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as Currency)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-text outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-surface">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Hacia
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as Currency)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-text outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-surface">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Avisame cuando la tasa...
        </label>
        <div className="flex gap-2">
          {(Object.keys(CONDITION_LABELS) as AlertCondition[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCondition(c)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                condition === c
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-white/10 text-muted hover:border-white/20"
              }`}
            >
              {CONDITION_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <Input
        label={`Valor de referencia (1 ${fromCurrency} = ? ${toCurrency})`}
        type="number"
        inputMode="decimal"
        min="0"
        step="0.0001"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        placeholder="0.0000"
      />

      <ErrorMessage message={error} />

      <div className="mt-1 flex gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={sameCurrency || !hasValidThreshold}
          className="flex-1"
        >
          Crear alerta
        </Button>
      </div>
    </form>
  );
}