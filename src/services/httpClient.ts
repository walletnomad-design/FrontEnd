import { ApiError, type ApiErrorBody } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const TOKEN_KEY = "nomadwallet_token";

// El token se restaura de localStorage apenas se carga este módulo,
// antes de que cualquier componente pida datos protegidos.
let authToken: string | null = (() => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
})();

export function setAuthToken(token: string | null): void {
  authToken = token;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Si localStorage no esta disponible (modo privado, etc.), seguimos
    // funcionando en memoria nomas, sin persistencia entre recargas.
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
}

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