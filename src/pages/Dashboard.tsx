import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { BalanceCard } from "../components/BalanceCard";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import * as walletApi from "../services/walletApi";
import type { Balance } from "../types";
import { GoalProgress } from "../components/GoalProgress";

export function Dashboard() {
  const { user } = useAuth();

  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBalances() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await walletApi.getBalances();
        if (!cancelled) setBalances(res.balances);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar los balances");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadBalances();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold text-bone animate-rise">
          Hola, {user?.email}
        </h1>
        <p className="mb-6 text-slate animate-rise">Tu wallet</p>

        {isLoading && <Loader label="Cargando balances..." />}

        <ErrorMessage message={error} />

        {!isLoading && !error && balances && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">            {balances.map((balance, i) => (
              <div
                key={balance.currency}
                className="animate-rise"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <BalanceCard balance={balance} />
              </div>
            ))}
          </div>
        )}

        <GoalProgress
          label="Meta: Fondo de viaje"
          current={650}
          target={1000}
          currency="USD"
        />
      </main>
    </div>
  );
}