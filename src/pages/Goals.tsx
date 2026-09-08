import { useEffect, useState } from "react";
import { GoalProgress } from "../components/GoalProgress";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { CreateGoalForm } from "../components/CreateGoalForm";
import { ContributeForm } from "../components/ContributeForm";
import * as goalsApi from "../services/goalsApi";
import type { Goal } from "../types";

type ModalState = { type: "create" } | { type: "contribute"; goal: Goal } | null;

export function Goals() {
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const list = await goalsApi.getGoals();
        if (!cancelled) setGoals(list);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar las metas");
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

  const handleGoalCreated = (goal: Goal) => {
    setGoals((prev) => (prev ? [goal, ...prev] : [goal]));
    setModal(null);
  };

  const handleContributionAdded = (updated: Goal) => {
    setGoals((prev) => (prev ? prev.map((g) => (g.id === updated.id ? updated : g)) : prev));
    setModal(null);
  };

  const handleDelete = async (goal: Goal) => {
    if (!window.confirm(`¿Eliminar la meta "${goal.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setDeletingId(goal.id);
    setError(null);
    try {
      await goalsApi.deleteGoal(goal.id);
      setGoals((prev) => (prev ? prev.filter((g) => g.id !== goal.id) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la meta");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between animate-rise">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-text">Metas de ahorro</h1>
          <p className="text-muted">Creá metas y registrá tus aportes</p>
        </div>
        <Button onClick={() => setModal({ type: "create" })}>+ Nueva meta</Button>
      </div>

      {isLoading && <Loader label="Cargando tus metas..." />}

      <ErrorMessage message={error} />

      {!isLoading && goals && goals.length === 0 && (
        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-8 text-center text-sm text-muted">
          Todavía no creaste ninguna meta de ahorro.
        </div>
      )}

      {!isLoading && goals && goals.length > 0 && (
        <div className="flex flex-col gap-4">
          {goals.map((goal) => (
            <div key={goal.id}>
              <GoalProgress goal={goal} />
              <div className="-mt-1 flex justify-end gap-3 rounded-b-xl border border-t-0 border-white/10 bg-surface px-5 py-3">
                <button
                  type="button"
                  onClick={() => setModal({ type: "contribute", goal })}
                  disabled={goal.completed}
                  className="text-sm font-medium text-primary transition-colors hover:text-violet disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Aportar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(goal)}
                  disabled={deletingId === goal.id}
                  className="text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deletingId === goal.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal?.type === "create" && (
        <Modal title="Nueva meta de ahorro" onClose={() => setModal(null)}>
          <CreateGoalForm onSuccess={handleGoalCreated} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.type === "contribute" && (
        <Modal title={`Aportar a "${modal.goal.name}"`} onClose={() => setModal(null)}>
          <ContributeForm
            goal={modal.goal}
            onSuccess={handleContributionAdded}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </main>
  );
}