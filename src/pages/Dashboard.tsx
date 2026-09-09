import { useEffect, useState } from "react";
import { BalanceCard } from "../components/BalanceCard";
import { GoalProgress } from "../components/GoalProgress";
import { QuickActions } from "../components/QuickActions";
import { RecentActivity } from "../components/RecentActivity";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import * as walletApi from "../services/walletApi";
import * as goalsApi from "../services/goalsApi";
import type { Balance, Goal } from "../types";

export function Dashboard() {
  const { user } = useAuth();

  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [balancesRes, goalsList] = await Promise.all([
          walletApi.getBalances(),
          goalsApi.getGoals().catch(() => []),
        ]);
        if (!cancelled) {
          setBalances(balancesRes.balances);
          setGoals(goalsList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar los datos");
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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-text animate-rise">Hola, {user?.firstName}</h1>
      <p className="mb-6 text-muted animate-rise">Aquí tienes un resumen de tus finanzas.</p>

      {isLoading && <Loader label="Cargando tu wallet..." />}

      <ErrorMessage message={error} />

      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Columna principal */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="animate-rise">
              <QuickActions />
            </div>

            {balances && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {balances.map((balance, i) => (
                  <div key={balance.currency} className="animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
                    <BalanceCard balance={balance} />
                  </div>
                ))}
              </div>
            )}

            {goals && goals.length > 0 && (
              <div className="flex flex-col gap-4">
                {goals.map((goal) => (
                  <GoalProgress key={goal.id} goal={goal} />
                ))}
              </div>
            )}

            {goals && goals.length === 0 && (
              <div className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-6 text-center text-sm text-muted">
                Todavía no creaste ninguna meta de ahorro.
              </div>
            )}
          </div>

          {/* Columna lateral */}
          <div className="animate-rise">
            <RecentActivity />
          </div>
        </div>
      )}
    </main>
  );
}