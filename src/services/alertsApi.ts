import { apiRequest } from "./httpClient";
import type {
  RateAlertsResponse,
  RateAlertApiResponse,
  CreateRateAlertPayload,
  RateAlert,
} from "../types";

export async function getAlerts(): Promise<RateAlert[]> {
  const res = await apiRequest<RateAlertsResponse>("/api/rate-alerts");
  return res.alerts;
}

export async function createAlert(payload: CreateRateAlertPayload): Promise<RateAlert> {
  const res = await apiRequest<RateAlertApiResponse>("/api/rate-alerts", {
    method: "POST",
    body: payload,
  });
  return res.alert;
}

export async function evaluateAlert(alertId: number): Promise<RateAlert> {
  const res = await apiRequest<RateAlertApiResponse>(`/api/rate-alerts/${alertId}/evaluate`, {
    method: "POST",
  });
  return res.alert;
}

export async function reactivateAlert(alertId: number): Promise<RateAlert> {
  const res = await apiRequest<RateAlertApiResponse>(`/api/rate-alerts/${alertId}/reactivate`, {
    method: "POST",
  });
  return res.alert;
}

export async function deleteAlert(alertId: number): Promise<void> {
  await apiRequest<void>(`/api/rate-alerts/${alertId}`, { method: "DELETE" });
}