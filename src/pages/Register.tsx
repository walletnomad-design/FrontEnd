import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm, type LoginFormErrors } from "../utils/validators";

export function Register() {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validateLoginForm(email, password);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await register({ email, password });
      navigate("/dashboard");
    } catch {
      // El error ya queda guardado en AuthContext.error y se muestra abajo.
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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

        <ErrorMessage message={error} />

        <Button type="submit" isLoading={isLoading}>
          Registrarme
        </Button>
      </form>

      <p className="text-sm text-gray-600">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}