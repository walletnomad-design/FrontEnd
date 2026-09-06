import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { AuthShell } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { validateRegisterForm, type RegisterFormErrors } from "../utils/validators";

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

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Register() {
  const { register, logout, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateRegisterForm(firstName, lastName, dni, email, password, confirmPassword);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await register({ firstName, lastName, dni, email, password });
      logout();
      navigate("/login", { state: { justRegistered: true } });
    } catch {
      // El error ya se muestra vía AuthContext.error
    }
  };

  return (
    <AuthShell active="register" title="Crea tu cuenta 🚀" subtitle="Únete a NomadWallet y toma el control de tus finanzas globales.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Nombre"
              icon={<UserIcon />}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={formErrors.firstName}
              autoComplete="given-name"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Apellido"
              icon={<UserIcon />}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={formErrors.lastName}
              autoComplete="family-name"
            />
          </div>
        </div>

        <Input
          label="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
          error={formErrors.dni}
          inputMode="numeric"
          maxLength={9}
        />

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

        <Input
          label="Contraseña"
          type="password"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password}
          autoComplete="new-password"
          placeholder="Crea una contraseña segura"
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          icon={<LockIcon />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={formErrors.confirmPassword}
          autoComplete="new-password"
          placeholder="Confirma tu contraseña"
        />

        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="mt-0.5 text-primary">
            <ShieldIcon />
          </span>
          <div>
            <p className="text-sm font-medium text-text">Tu seguridad es nuestra prioridad</p>
            <p className="text-xs text-muted">Usamos encriptación para proteger tu información.</p>
          </div>
        </div>

        <ErrorMessage message={error} />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Crear cuenta
        </Button>
      </form>
    </AuthShell>
  );
}