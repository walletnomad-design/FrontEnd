import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as walletApi from "../services/walletApi";
import { useAuth } from "../context/AuthContext";
import { formatAmount } from "../utils/currency";
import type { Transaction } from "../types";

const DOT_COLOR: Record<Transaction["type"], string> = {
  buy: "bg-green-400",
  sell: "bg-red-400",
  exchange: "bg-amber-400",
  deposit: "bg-green-400",
  transfer: "bg-red-400",
};

function labelFor(tx: Transaction, currentUserId: number | undefined): string {
  switch (tx.type) {
    case "deposit":
      return "Depósito";
    case "exchange":
      return "Intercambio";
    case "buy":
      return "Comprar";
    case "sell":
      return "Vender";
    case "transfer":
      return tx.userId === currentUserId ? "Transferencia enviada" : "Transferencia recibida";
    default:
      return tx.type;
  }
}

function dotFor(tx: Transaction, currentUserId: number | undefined): string {
  if (tx.type === "transfer" && tx.userId !== currentUserId) return "bg-green-400";
  return DOT_COLOR[tx.type];
}

export function RecentActivity() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    walletApi
      .getTransactions()
      .then((res) => {
        if (cancelled) return;
        const sorted = [...res.transactions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sorted.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">Actividad reciente</h2>
        <Link to="/transactions" className="text-xs font-medium text-primary hover:text-violet">
          Ver todo
        </Link>
      </div>

      {error && <p className="text-xs text-muted">No se pudo cargar la actividad.</p>}

      {!error && transactions === null && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!error && transactions !== null && transactions.length === 0 && (
        <p className="text-xs text-muted">Todavía no hiciste ninguna operación.</p>
      )}

      {!error && transactions !== null && transactions.length > 0 && (
        <ul className="flex flex-col gap-3">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center gap-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotFor(tx, user?.id)}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-text">{labelFor(tx, user?.id)}</p>
                <p className="text-[0.7rem] text-muted">
                  {new Date(tx.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                </p>
              </div>
              <p className="shrink-0 text-right font-mono text-xs text-text">
                {formatAmount(tx.toAmount, tx.toCurrency)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}