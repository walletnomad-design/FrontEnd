import { apiRequest } from "./httpClient";
import type {
  Currency,
  RatesResponse,
  ExchangePayload,
  ExchangeResult,
  ExchangeApiResponse,
} from "../types";

const USE_MOCK = true;
const MOCK_DELAY_MS = 500;

// Tasas fijas de referencia para el mock (no son reales, solo para probar la UI
// mientras el backend no tiene POST /api/exchange todavia).
const MOCK_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  COP: 4023.5,
};

export async function getRates(from: Currency = "USD"): Promise<RatesResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const baseRate = MOCK_RATES[from];
    const rates = Object.fromEntries(
      (Object.keys(MOCK_RATES) as Currency[]).map((c) => [c, MOCK_RATES[c] / baseRate])
    ) as Record<Currency, number>;
    return { base: from, rates, source: "fallback", timestamp: new Date().toISOString() };
  }
  return apiRequest<RatesResponse>(`/api/rates?from=${from}`);
}

export async function exchange(payload: ExchangePayload): Promise<ExchangeResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    const { rates } = await getRates(payload.fromCurrency);
    const rate = rates[payload.toCurrency];
    return {
      id: Math.floor(Math.random() * 100000),
      userId: 1,
      type: payload.type,
      fromCurrency: payload.fromCurrency,
      toCurrency: payload.toCurrency,
      fromAmount: payload.amount,
      toAmount: Number((payload.amount * rate).toFixed(2)),
      rate,
      status: "completed",
      createdAt: new Date().toISOString(),
    };
  }
  const res = await apiRequest<ExchangeApiResponse>("/api/exchange", { method: "POST", body: payload });
  return res.transaction;
}