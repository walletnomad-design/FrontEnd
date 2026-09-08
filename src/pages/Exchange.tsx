import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ExchangeForm } from "../components/ExchangeForm";
import { formatAmount } from "../utils/currency";
import type { ExchangeOperationType, ExchangeResult } from "../types";

const VALID_TYPES: ExchangeOperationType[] = ["buy", "sell", "exchange"];

export function Exchange() {
  const [searchParams] = useSearchParams();
  const [lastResult, setLastResult] = useState<ExchangeResult | null>(null);

  const typeParam = searchParams.get("type");
  const initialType: ExchangeOperationType = VALID_TYPES.includes(typeParam as ExchangeOperationType)
    ? (typeParam as ExchangeOperationType)
    : "exchange";

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-text animate-rise">Intercambiar</h1>
      <p className="mb-6 text-muted animate-rise">Comprá, vendé o convertí entre monedas</p>

      <ExchangeForm initialType={initialType} onSuccess={setLastResult} />

      {lastResult && (
        <div className="mt-6 animate-rise rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-400">
          ✓ Operación completada: {formatAmount(lastResult.fromAmount, lastResult.fromCurrency)} →{" "}
          {formatAmount(lastResult.toAmount, lastResult.toCurrency)}
        </div>
      )}
    </main>
  );
}