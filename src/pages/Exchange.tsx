import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExchangeForm } from "../components/ExchangeForm";
import { DepositForm } from "../components/DepositForm";
import { TransferForm } from "../components/TransferForm";
import { formatAmount } from "../utils/currency";
import type { Currency, ExchangeResult, Transaction } from "../types";

type Mode = "exchange" | "deposit" | "transfer";

const VALID_MODES: Mode[] = ["exchange", "deposit", "transfer"];

const TAB_LABELS: Record<Mode, string> = {
  deposit: "Depositar",
  transfer: "Transferir",
  exchange: "Intercambiar",
};

interface LastOp {
  fromAmount: number;
  fromCurrency: Currency;
  toAmount: number;
  toCurrency: Currency;
}

function toLastOp(source: ExchangeResult | Transaction): LastOp {
  return {
    fromAmount: source.fromAmount,
    fromCurrency: source.fromCurrency,
    toAmount: source.toAmount,
    toCurrency: source.toCurrency,
  };
}

export function Exchange() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lastOp, setLastOp] = useState<LastOp | null>(null);

  const modeParam = searchParams.get("type");
  const mode: Mode = VALID_MODES.includes(modeParam as Mode) ? (modeParam as Mode) : "exchange";

  const handleTabClick = (m: Mode) => {
    setLastOp(null);
    navigate(`/exchange?type=${m}`);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-text animate-rise">Movimientos</h1>
      <p className="mb-6 text-muted animate-rise">Depositá, transferí o intercambiá entre monedas</p>

      <div className="mb-5 flex gap-2 animate-rise">
        {(Object.keys(TAB_LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleTabClick(m)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
              mode === m
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-white/10 text-muted hover:border-white/20"
            }`}
          >
            {TAB_LABELS[m]}
          </button>
        ))}
      </div>

      {mode === "exchange" && <ExchangeForm onSuccess={(r) => setLastOp(toLastOp(r))} />}
      {mode === "deposit" && <DepositForm onSuccess={(tx) => setLastOp(toLastOp(tx))} />}
      {mode === "transfer" && <TransferForm onSuccess={(tx) => setLastOp(toLastOp(tx))} />}

      {lastOp && (
        <div className="mt-6 animate-rise rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-400">
          ✓ Operación completada: {formatAmount(lastOp.fromAmount, lastOp.fromCurrency)} →{" "}
          {formatAmount(lastOp.toAmount, lastOp.toCurrency)}
        </div>
      )}
    </main>
  );
}