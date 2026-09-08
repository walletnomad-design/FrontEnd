import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { ExchangeForm } from "../components/ExchangeForm";
import { formatAmount } from "../utils/currency";
import type { ExchangeResult } from "../types";

export function Exchange() {
  const [lastResult, setLastResult] = useState<ExchangeResult | null>(null);

  return (
    <div>
      <Navbar />

      <main className="mx-auto max-w-md px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold text-bone animate-rise">Intercambiar</h1>
        <p className="mb-6 text-slate animate-rise">Comprá, vendé o convertí entre monedas</p>

        <ExchangeForm onSuccess={setLastResult} />

        {lastResult && (
          <div className="mt-6 animate-rise rounded-lg border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint">
            ✓ Operación completada: {formatAmount(lastResult.fromAmount, lastResult.fromCurrency)} →{" "}
            {formatAmount(lastResult.toAmount, lastResult.toCurrency)}
          </div>
        )}
      </main>
    </div>
  );
}