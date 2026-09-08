import { useEffect, useState, type ReactNode } from "react";
import * as walletApi from "../services/walletApi";
import { formatAmount } from "../utils/currency";
import type { Transaction, ExchangeOperationType } from "../types";

const TYPE_LABEL: Record<ExchangeOperationType, string> = {
  buy: "Comprar",
  sell: "Vender",
  exchange: "Intercambiar",
};

function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

function ArrowsExchangeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 12h13m0 0-4-4m4 4-4 4M17 20H4m0 0 4-4m-4 4 4 4" transform="scale(0.85) translate(2,0)" />
    </svg>
  );
}

type TypeStyle = {
  icon: ReactNode;
  color: string;
  bg: string;
};

const TYPE_STYLE: Record<ExchangeOperationType, TypeStyle> = {
  buy: { icon: <ArrowUpIcon />, color: "text-green-400", bg: "bg-green-400/10" },
  sell: { icon: <ArrowDownIcon />, color: "text-red-400", bg: "bg-red-400/10" },
  exchange: { icon: <ArrowsExchangeIcon />, color: "text-amber-400", bg: "bg-amber-400/10" },
};

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/5 p-4">
      <div className="skeleton h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
      <div className="skeleton h-4 w-20 rounded" />
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const style = TYPE_STYLE[tx.type];
  const date = new Date(tx.createdAt).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/5 p-4 transition-colors hover:bg-white/[0.03]">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.color}`}>
        {style.icon}
      </span>

      <div className="flex-1">
        <p className="text-sm font-medium text-text">{TYPE_LABEL[tx.type]}</p>
        <p className="text-xs text-muted">{date}</p>
      </div>

      <div className="text-right">
        <p className={`font-mono text-sm font-semibold ${style.color}`}>
          {formatAmount(tx.fromAmount, tx.fromCurrency)} → {formatAmount(tx.toAmount, tx.toCurrency)}
        </p>
        {tx.status === "failed" && <span className="text-xs text-red-400">Falló</span>}
      </div>
    </div>
  );
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await walletApi.getTransactions();
        if (!cancelled) {
          const sorted = [...res.transactions].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setTransactions(sorted);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudo cargar el historial");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-text animate-rise">Historial</h1>
      <p className="mb-6 text-muted animate-rise">Todas tus operaciones, más recientes primero</p>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <TransactionRowSkeleton />
          <TransactionRowSkeleton />
          <TransactionRowSkeleton />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {!isLoading && !error && transactions && transactions.length === 0 && (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-8 text-center text-sm text-muted">
          Todavía no hiciste ninguna operación.
        </div>
      )}

      {!isLoading && !error && transactions && transactions.length > 0 && (
        <div className="flex flex-col gap-3">
          {transactions.map((tx, i) => (
            <div key={tx.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <TransactionRow tx={tx} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}