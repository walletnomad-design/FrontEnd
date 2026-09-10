import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { AuthShell } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm, type LoginFormErrors } from "../utils/validators";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function Login() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateLoginForm(email, password);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch {
      // El error ya se muestra vía AuthContext.error
    }
  };

  return (
    <AuthShell active="login" title="Bienvenido a NomadWallet" subtitle="Inicia sesión para continuar manejando tus finanzas.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Correo electrónico"
          type="email"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          autoComplete="email"
          placeholder="ejemplo@correo.com"
        />
        <div>
          <Input
            label="Contraseña"
            type="password"
            icon={<LockIcon />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
          />
          <button
            type="button"
            className="mt-1.5 text-xs text-primary hover:underline"
            onClick={() => alert("Disponible próximamente")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <ErrorMessage message={error} />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Iniciar sesión
        </Button>
      </form>
    </AuthShell>
  );
}