import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { validateRegisterForm, type RegisterFormErrors } from "../utils/validators";

export function Register() {
  const { register, logout, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateRegisterForm(firstName, lastName, dni, email, password);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await register({ firstName, lastName, dni, email, password });
      // No dejamos al usuario logueado automaticamente despues de registrarse:
      // cerramos la sesion recien creada y lo mandamos a Login a que ingrese el mismo.
      logout();
      navigate("/login", { state: { justRegistered: true } });
    } catch {
      // El error ya se muestra vía AuthContext.error
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-16 animate-rise">
      <h1 className="text-2xl font-bold text-bone">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={formErrors.firstName}
              autoComplete="given-name"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Apellido"
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
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password}
          autoComplete="new-password"
        />
        <p className="-mt-2 text-xs text-slate">Mínimo 8 caracteres, con letras y números.</p>

        <ErrorMessage message={error} />

        <Button type="submit" isLoading={isLoading}>
          Registrarme
        </Button>
      </form>

      <p className="text-sm text-slate">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-medium text-amber hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}