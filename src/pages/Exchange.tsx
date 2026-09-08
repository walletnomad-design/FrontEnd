import { useState } from "react";
import { ExchangeForm } from "../components/ExchangeForm";
import { formatAmount } from "../utils/currency";
import type { ExchangeResult } from "../types";

export function Exchange() {
  const [lastResult, setLastResult] = useState<ExchangeResult | null>(null);

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-text animate-rise">Intercambiar</h1>
      <p className="mb-6 text-muted animate-rise">Comprá, vendé o convertí entre monedas</p>

      <ExchangeForm onSuccess={setLastResult} />

      {lastResult && (
        <div className="mt-6 animate-rise rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-400">
          ✓ Operación completada: {formatAmount(lastResult.fromAmount, lastResult.fromCurrency)} →{" "}
          {formatAmount(lastResult.toAmount, lastResult.toCurrency)}
        </div>
      )}
    </main>
  );
}