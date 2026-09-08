import type { RateAlert } from "../types";

const CONDITION_LABEL: Record<RateAlert["condition"], string> = {
  gte: "suba hasta",
  lte: "baje hasta",
};

interface AlertCardProps {
  alert: RateAlert;
  onEvaluate: () => void;
  onReactivate: () => void;
  onDelete: () => void;
  isBusy: boolean;
}

export function AlertCard({ alert, onEvaluate, onReactivate, onDelete, isBusy }: AlertCardProps) {
  const isTriggered = alert.status === "triggered";

  return (
    <div className="rounded-xl border border-white/10 bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">
          {alert.fromCurrency} → {alert.toCurrency}
        </h2>
        <span
          className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
            isTriggered ? "bg-amber-400/10 text-amber-400" : "bg-green-400/10 text-green-400"
          }`}
        >
          {isTriggered ? "Disparada" : "Activa"}
        </span>
      </div>

      <p className="mt-3 text-xs text-muted">
        Avisa cuando {CONDITION_LABEL[alert.condition]}{" "}
        <b className="font-mono text-text">{alert.threshold}</b>
      </p>

      <div className="mt-5 flex justify-end gap-3">
        {isTriggered ? (
          <button
            type="button"
            onClick={onReactivate}
            disabled={isBusy}
            className="text-sm font-medium text-primary transition-colors hover:text-violet disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reactivar
          </button>
        ) : (
          <button
            type="button"
            onClick={onEvaluate}
            disabled={isBusy}
            className="text-sm font-medium text-primary transition-colors hover:text-violet disabled:cursor-not-allowed disabled:opacity-40"
          >
            Evaluar ahora
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          disabled={isBusy}
          className="text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}