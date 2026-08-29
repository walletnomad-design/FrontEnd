import { apiRequest } from "./httpClient";
import type { BalancesResponse, TransactionsResponse, Wallet } from "../types";

const USE_MOCK = true;
const MOCK_DELAY_MS = 400;

export async function getWallet(): Promise<Wallet> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    return { id: 1, userId: 1 };
  }
  return apiRequest<Wallet>("/api/wallet");
}

export async function getBalances(): Promise<BalancesResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    return {
      balances: [
        { currency: "USD", amount: 1000 },
        { currency: "EUR", amount: 500 },
        { currency: "COP", amount: 2000000 },
      ],
    };
  }
  return apiRequest<BalancesResponse>("/api/balances");
}

export async function getTransactions(): Promise<TransactionsResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    return { transactions: [] };
  }
  return apiRequest<TransactionsResponse>("/api/transactions");
}