import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./Button";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-slate/15 bg-navy/70 px-6 py-4 backdrop-blur-md">
      <span className="font-mono text-lg font-semibold tracking-wide text-bone">
        NomadWallet
      </span>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate">{user?.email}</span>
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      )}
    </nav>
  );
}