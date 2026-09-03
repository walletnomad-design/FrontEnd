import { apiRequest, setAuthToken } from "./httpClient";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types";

const USE_MOCK = false;

const MOCK_DELAY_MS = 500;

function mockAuthResponse(email: string, firstName = "Usuario", lastName = "Mock", dni = "00000000"): AuthResponse {
  return {
    token: "mock-jwt-token",
    user: { id: 1, email, firstName, lastName, dni },
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    const res = mockAuthResponse(payload.email, payload.firstName, payload.lastName, payload.dni);
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