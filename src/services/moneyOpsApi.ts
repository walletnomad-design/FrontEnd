import { apiRequest } from "./httpClient";
import type { DepositPayload, TransferPayload, MoneyOpApiResponse, Transaction } from "../types";

export async function deposit(payload: DepositPayload): Promise<Transaction> {
  const res = await apiRequest<MoneyOpApiResponse>("/api/deposits", {
    method: "POST",
    body: payload,
  });
  return res.transaction;
}

export async function transfer(payload: TransferPayload): Promise<Transaction> {
  const res = await apiRequest<MoneyOpApiResponse>("/api/transfers", {
    method: "POST",
    body: payload,
  });
  return res.transaction;
}