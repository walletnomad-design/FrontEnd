import { formatAmount } from "../utils/currency";
import type { Goal } from "../types";

interface GoalProgressProps {
  goal: Goal;
  marks?: number[];
}

export function GoalProgress({ goal, marks = [25, 50, 75] }: GoalProgressProps) {
  const pct = Math.min(100, Math.round(goal.progress));

  return (
    <div className="relative isolate mt-6 overflow-hidden rounded-xl border border-white/10 bg-surface p-5">
      <div
        className="pointer-events-none absolute -inset-4 -z-10 animate-spin-slow rounded-xl opacity-60 blur-2xl"
        style={{
          background:
            "conic-gradient(from 180deg, transparent 0deg, rgba(99,102,241,0.25) 60deg, transparent 130deg, transparent 220deg, rgba(139,92,246,0.2) 300deg, transparent 360deg)",
        }}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">{goal.name}</h2>
        {goal.completed && (
          <span className="rounded-full bg-green-400/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-green-400">
            Completada
          </span>
        )}
      </div>

      <div className="mt-3 flex justify-between text-xs text-muted">
        <span>
          <b className="font-mono text-text">{formatAmount(goal.currentAmount, goal.currency)}</b> ahorrado
        </span>
        <span>meta {formatAmount(goal.targetAmount, goal.currency)}</span>
      </div>

      <div className="relative mt-5 h-3 rounded-full border border-white/5 bg-white/5">
        <div
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary-dark via-primary to-violet shadow-[0_0_16px_rgba(99,102,241,0.35)] transition-[width] duration-1000 ease-[var(--ease-board)]"
          style={{ width: `${pct}%` }}
        >
          <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:220%_100%]" />
        </div>

        <div className="pointer-events-none absolute inset-0">
          {marks.map((m) => (
            <i key={m} className="absolute top-0 h-full w-px bg-white/10" style={{ left: `${m}%` }} />
          ))}
        </div>

        <span
          className="pointer-events-none absolute -top-6 -translate-x-1/2 whitespace-nowrap rounded-md border border-primary/40 bg-surface px-1.5 py-0.5 font-mono text-[0.68rem] font-bold text-primary"
          style={{ left: `${pct}%` }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}