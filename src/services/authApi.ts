import { apiRequest, setAuthToken } from "./httpClient";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types";

// 🔧 Cambiar a false cuando P3 tenga /api/auth/register y /api/auth/login reales.
const USE_MOCK = true;

const MOCK_DELAY_MS = 500;

function mockAuthResponse(email: string): AuthResponse {
  return {
    token: "mock-jwt-token",
    user: { id: 1, email },
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    const res = mockAuthResponse(payload.email);
    setAuthToken(res.token);
    return res;
  }

  const res = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  setAuthToken(res.token);
  return res;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    const res = mockAuthResponse(payload.email);
    setAuthToken(res.token);
    return res;
  }

  const res = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
  setAuthToken(res.token);
  return res;
}

export function logout(): void {
  setAuthToken(null);
}