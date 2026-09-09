import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NGlyph } from "./Logo";

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function getInitials(firstName?: string, lastName?: string): string {
  const a = firstName?.[0] ?? "";
  const b = lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-4 lg:justify-end lg:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Abrir menú"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet shadow-[0_0_16px_-4px_rgba(99,102,241,0.6)] lg:hidden"
      >
        <NGlyph size={18} />
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled
          className="relative rounded-full p-2 text-muted/50 cursor-not-allowed"
          aria-label="Notificaciones (próximamente)"
          title="Próximamente"
        >
          <BellIcon />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-white/5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet text-sm font-semibold text-white">
              {getInitials(user?.firstName, user?.lastName)}
            </span>
            <span className="hidden text-sm font-medium text-text sm:inline">{user?.firstName}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-44 animate-rise rounded-lg border border-white/10 bg-surface py-1 shadow-xl">
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-muted hover:bg-white/5 hover:text-text"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}