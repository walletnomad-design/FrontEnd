import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface ActionDef {
  label: string;
  to: string;
  icon: ReactNode;
  classes: string;
}

const ACTIONS: ActionDef[] = [
  {
    label: "Depositar",
    to: "/exchange?type=deposit",
    classes: "bg-primary/15 text-primary border-primary/40 hover:bg-primary/25 hover:shadow-[0_0_20px_-4px_rgba(99,102,241,0.55)]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v12m0 0 4-4m-4 4-4-4M4 20h16" />
      </svg>
    ),
  },
  {
    label: "Transferir",
    to: "/exchange?type=transfer",
    classes: "bg-violet/15 text-violet border-violet/40 hover:bg-violet/25 hover:shadow-[0_0_20px_-4px_rgba(139,92,246,0.55)]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h13m0 0-4-4m4 4-4 4M20 6H7m0 0 4 4m-4-4 4-4" />
      </svg>
    ),
  },
  {
    label: "Intercambiar",
    to: "/exchange?type=exchange",
    classes: "bg-green-400/15 text-green-400 border-green-400/40 hover:bg-green-400/25 hover:shadow-[0_0_20px_-4px_rgba(74,222,128,0.55)]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3" />
      </svg>
    ),
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {ACTIONS.map((a) => (
        <Link
          key={a.label}
          to={a.to}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${a.classes}`}
        >
          {a.icon}
          {a.label}
        </Link>
      ))}
    </div>
  );
}