const RATES = [
  "USD/EUR 0.92", "USD/COP 4,023.50", "EUR/COP 4,370.15",
  "EUR/USD 1.09", "COP/USD 0.00025", "USD/EUR 0.92",
];

function TickerRow({ reverse = false }: { reverse?: boolean }) {
  // Se duplica el contenido para que el loop sea perfectamente continuo
  // (cuando la primera mitad sale de pantalla, la segunda ya está entrando).
  const items = [...RATES, ...RATES];

  return (
    <div
      className={`flex shrink-0 gap-12 whitespace-nowrap font-mono text-6xl font-semibold text-slate ${
        reverse ? "animate-ticker-reverse" : "animate-ticker"
      }`}
    >
      {items.map((rate, i) => (
        <span key={i}>{rate}</span>
      ))}
    </div>
  );
}

export function TickerBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy"
    >
      {/* Resplandor ambiental centrado */}
      <div className="animate-glow absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber blur-[120px]" />

      {/* Cintas de cotizaciones, muy tenues, en distintas alturas */}
      <div className="absolute inset-0 flex flex-col justify-between py-24 opacity-[0.07]">
        <TickerRow />
        <TickerRow reverse />
        <TickerRow />
      </div>
    </div>
  );
}