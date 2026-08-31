import { formatAmount } from "../utils/currency";
import type { Currency } from "../types";

interface GoalProgressProps {
  label: string;
  current: number;
  target: number;
  currency: Currency;
  marks?: number[];
}

export function GoalProgress({
  label,
  current,
  target,
  currency,
  marks = [25, 50, 75],
}: GoalProgressProps) {
  const pct = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="relative isolate mt-6 overflow-hidden rounded-xl border border-slate/15 bg-navy-card p-5">
      {/* Halo ámbar que gira lento detrás del panel */}
      <div
        className="pointer-events-none absolute -inset-4 -z-10 animate-spin-slow rounded-xl opacity-60 blur-2xl"
        style={{
          background:
            "conic-gradient(from 180deg, transparent 0deg, rgba(240,165,55,0.25) 60deg, transparent 130deg, transparent 220deg, rgba(240,165,55,0.2) 300deg, transparent 360deg)",
        }}
      />

            <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-bone">{label}</h2>
        <span className="rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold tracking-wide text-amber">
          Próximamente
        </span>
      </div>

      <div className="mt-3 flex justify-between text-xs text-slate">
        <span>
          <b className="font-mono text-bone">{formatAmount(current, currency)}</b> ahorrado
        </span>
        <span>meta {formatAmount(target, currency)}</span>
      </div>

      <div className="relative mt-5 h-3 rounded-full border border-white/5 bg-white/5">
        <div
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-amber-dim via-amber to-amber shadow-[0_0_16px_rgba(240,165,55,0.35)] transition-[width] duration-1000 ease-[var(--ease-board)]"
          style={{ width: `${pct}%` }}
        >
          <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:220%_100%]" />
        </div>

        {/* Hitos (marcas de referencia en la pista) */}
        <div className="pointer-events-none absolute inset-0">
          {marks.map((m) => (
            <i key={m} className="absolute top-0 h-full w-px bg-white/10" style={{ left: `${m}%` }} />
          ))}
        </div>

        {/* Etiqueta del % flotando sobre el extremo del relleno */}
        <span
          className="pointer-events-none absolute -top-6 -translate-x-1/2 whitespace-nowrap rounded-md border border-amber/40 bg-navy-card px-1.5 py-0.5 font-mono text-[0.68rem] font-bold text-amber"
          style={{ left: `${pct}%` }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}