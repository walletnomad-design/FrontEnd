import { ApiError, type ApiErrorBody } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

// Guardamos el token acá para no depender de importar el AuthContext
// dentro de un archivo que no es un componente React.
let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
}

/**
 * Wrapper único de fetch. Agrega el header Authorization si hay token,
 * parsea JSON y convierte respuestas de error { error, message } en ApiError.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody: ApiErrorBody = data ?? {
      error: "UNKNOWN_ERROR",
      message: "Ocurrió un error inesperado",
    };
    throw new ApiError(errorBody);
  }

  return data as T;
}