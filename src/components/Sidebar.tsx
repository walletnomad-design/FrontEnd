import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";


interface NavItem {
  label: string;
  to?: string;
  icon: ReactNode;
  phase: 1 | 2 | 3;
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  home: "M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10",
  deposit: "M12 4v12m0 0 4-4m-4 4-4-4M4 20h16",
  transfer: "M4 12h13m0 0-4-4m4 4-4 4M20 6H7m0 0 4 4m-4-4 4-4",
  exchange: "M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3",
  history: "M12 8v4l3 2M4 12a8 8 0 1 1 3 6.3M4 12v5m0-5H9",
  users: "M17 20a4 4 0 0 0-10 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 20a4 4 0 0 0-3-3.87M18 8a3 3 0 0 1 0 5.9",
  card: "M2 7h20M2 7v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7M2 7l1-2h18l1 2M6 15h4",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z",
  help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
};

const NAV_ITEMS: NavItem[] = [
  { label: "Resumen", to: "/dashboard", icon: <Icon d={ICONS.home} />, phase: 1 },
  { label: "Comprar", to: "/exchange?type=buy", icon: <Icon d={ICONS.deposit} />, phase: 1 },
  { label: "Vender", to: "/exchange?type=sell", icon: <Icon d={ICONS.transfer} />, phase: 1 },
  { label: "Intercambiar", to: "/exchange?type=exchange", icon: <Icon d={ICONS.exchange} />, phase: 1 },
  { label: "Historial", to: "/transactions", icon: <Icon d={ICONS.history} />, phase: 1 },
  { label: "Metas", to: "/goals", icon: <Icon d={ICONS.card} />, phase: 2 },
  { label: "Alertas de tasa", to: "/alerts", icon: <Icon d={ICONS.help} />, phase: 2 },
  { label: "Destinatarios", icon: <Icon d={ICONS.users} />, phase: 3 },
  { label: "Tarjetas", icon: <Icon d={ICONS.card} />, phase: 3 },
  { label: "Ajustes", to: "/settings", icon: <Icon d={ICONS.settings} />, phase: 3 },
  { label: "Ayuda", to: "/help", icon: <Icon d={ICONS.help} />, phase: 3 },
];

export function Sidebar() {
  const location = useLocation();
  const currentPath = `${location.pathname}${location.search}`;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-surface px-3 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet font-bold text-white">
          N
        </div>
        <span className="text-lg font-bold text-text">
          Nomad<span className="text-primary">Wallet</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isDisabled = item.phase === 3 || !item.to;

          if (isDisabled) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-muted/50"
                title="Próximamente"
              >
                <span className="flex items-center gap-3 text-sm">
                  {item.icon}
                  {item.label}
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-muted/70">
                  Pronto
                </span>
              </div>
            );
          }

          const isActive = item.to === currentPath;

          return (
            <NavLink
              key={item.label}
              to={item.to!}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-violet/10 text-text"
                  : "text-muted hover:bg-white/5 hover:text-text"
              }`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}