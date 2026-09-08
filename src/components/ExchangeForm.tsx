import { useEffect, useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import * as exchangeApi from "../services/exchangeApi";
import { formatAmount } from "../utils/currency";
import type { Currency, ExchangeOperationType, ExchangeResult } from "../types";

const CURRENCIES: Currency[] = ["USD", "EUR", "COP"];

const OPERATION_LABELS: Record<ExchangeOperationType, string> = {
  buy: "Comprar",
  sell: "Vender",
  exchange: "Intercambiar",
};

interface ExchangeFormProps {
  onSuccess: (result: ExchangeResult) => void;
}

export function ExchangeForm({ onSuccess }: ExchangeFormProps) {
  const [type, setType] = useState<ExchangeOperationType>("exchange");
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("EUR");
  const [amount, setAmount] = useState("");

  const [rate, setRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trae la tasa cada vez que cambia la moneda de origen o destino,
  // asi el usuario ve el valor actualizado antes de confirmar la operacion.
  useEffect(() => {
    let cancelled = false;

    async function loadRate() {
      setIsLoadingRate(true);
      try {
        const res = await exchangeApi.getRates(fromCurrency);
        if (!cancelled) setRate(res.rates[toCurrency]);
      } catch {
        if (!cancelled) setRate(null);
      } finally {
        if (!cancelled) setIsLoadingRate(false);
      }
    }

    loadRate();
    return () => {
      cancelled = true;
    };
  }, [fromCurrency, toCurrency]);

  const numericAmount = Number(amount);
  const hasValidAmount = amount.trim() !== "" && numericAmount > 0;
  const estimatedTotal = hasValidAmount && rate ? numericAmount * rate : null;

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasValidAmount) {
      setError("Ingresá un monto válido, mayor a cero");
      return;
    }
    if (fromCurrency === toCurrency) {
      setError("Elegí dos monedas distintas");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await exchangeApi.exchange({
        type,
        fromCurrency,
        toCurrency,
        amount: numericAmount,
      });
      setAmount("");
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la operación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Selector de tipo de operación */}
      <div className="flex gap-2">
        {(Object.keys(OPERATION_LABELS) as ExchangeOperationType[]).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setType(op)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
              type === op
                ? "border-amber/60 bg-amber/10 text-amber"
                : "border-slate/25 text-slate hover:border-slate/40"
            }`}
          >
            {OPERATION_LABELS[op]}
          </button>
        ))}
      </div>

      {/* Moneda origen / destino */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate">
            Desde
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as Currency)}
            className="w-full rounded-lg border border-slate/25 bg-white/5 px-3.5 py-2.5 text-bone outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/20"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-navy-card">
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSwapCurrencies}
          aria-label="Invertir monedas"
          className="mb-1 rounded-lg border border-slate/25 p-2.5 text-slate transition-colors hover:border-amber/50 hover:text-amber"
        >
          ⇄
        </button>

        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate">
            Hacia
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as Currency)}
            className="w-full rounded-lg border border-slate/25 bg-white/5 px-3.5 py-2.5 text-bone outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/20"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-navy-card">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label={`Monto en ${fromCurrency}`}
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
      />

      {/* Tasa actual + equivalente estimado */}
      <div className="rounded-lg border border-slate/15 bg-white/5 px-4 py-3 text-sm">
        {isLoadingRate ? (
          <span className="text-slate">Consultando tasa...</span>
        ) : rate ? (
          <div className="flex flex-col gap-1">
            <span className="text-slate">
              1 {fromCurrency} = <span className="font-mono text-bone">{rate.toFixed(4)}</span> {toCurrency}
            </span>
            {estimatedTotal !== null && (
              <span className="text-base">
                Recibís aprox.{" "}
                <span className="font-mono font-semibold text-amber">
                  {formatAmount(estimatedTotal, toCurrency)}
                </span>
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate">No se pudo obtener la tasa</span>
        )}
      </div>

      <ErrorMessage message={error} />

      <Button type="submit" isLoading={isSubmitting} disabled={!hasValidAmount || fromCurrency === toCurrency}>
        {OPERATION_LABELS[type]}
      </Button>
    </form>
  );
}