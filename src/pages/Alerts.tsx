import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { CreateAlertForm } from "../components/CreateAlertForm";
import { AlertCard } from "../components/AlertCard";
import * as alertsApi from "../services/alertsApi";
import type { RateAlert, RateAlertEvaluation } from "../types";

export function Alerts() {
  const [alerts, setAlerts] = useState<RateAlert[] | null>(null);
  const [evaluations, setEvaluations] = useState<RateAlertEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadAlerts = async () => {
    try {
      const list = await alertsApi.getAlerts();
      setAlerts(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las alertas");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadAlerts().finally(() => setIsLoading(false));
  }, []);

  const handleCreated = (alert: RateAlert) => {
    setAlerts((prev) => (prev ? [alert, ...prev] : [alert]));
    setShowCreate(false);
  };

  const handleEvaluateAll = async () => {
    setIsEvaluating(true);
    setError(null);
    try {
      const results = await alertsApi.evaluateAllAlerts();
      setEvaluations(results);
      // Las que cumplieron la condición pasan a "Disparada" del lado del backend;
      // refrescamos la lista para reflejar el nuevo estado.
      await loadAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron evaluar las alertas");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReactivate = async (alert: RateAlert) => {
    setBusyId(alert.id);
    setError(null);
    try {
      const updated = await alertsApi.reactivateAlert(alert.id);
      setAlerts((prev) => (prev ? prev.map((a) => (a.id === updated.id ? updated : a)) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reactivar la alerta");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (alert: RateAlert) => {
    if (!window.confirm(`¿Eliminar la alerta ${alert.fromCurrency} → ${alert.toCurrency}?`)) {
      return;
    }
    setBusyId(alert.id);
    setError(null);
    try {
      await alertsApi.deleteAlert(alert.id);
      setAlerts((prev) => (prev ? prev.filter((a) => a.id !== alert.id) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la alerta");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-rise">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-text">Alertas de tasa</h1>
          <p className="text-muted">Enterate cuando una cotización llegue al valor que te interesa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleEvaluateAll} isLoading={isEvaluating}>
            Evaluar alertas
          </Button>
          <Button onClick={() => setShowCreate(true)}>+ Nueva alerta</Button>
        </div>
      </div>

      {isLoading && <Loader label="Cargando tus alertas..." />}

      <ErrorMessage message={error} />

      {!isLoading && alerts && alerts.length === 0 && (
        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-8 text-center text-sm text-muted">
          Todavía no creaste ninguna alerta de tasa.
        </div>
      )}

      {!isLoading && alerts && alerts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {alerts.map((alert) => {
            const evaluation = evaluations.find((e) => e.alertId === alert.id);
            return (
              <AlertCard
                key={alert.id}
                alert={alert}
                currentRate={evaluation?.currentRate}
                isBusy={busyId === alert.id}
                onReactivate={() => handleReactivate(alert)}
                onDelete={() => handleDelete(alert)}
              />
            );
          })}
        </div>
      )}

      {showCreate && (
        <Modal title="Nueva alerta de tasa" onClose={() => setShowCreate(false)}>
          <CreateAlertForm onSuccess={handleCreated} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}
    </main>
  );
}