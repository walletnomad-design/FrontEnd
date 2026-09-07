import { apiRequest } from "./httpClient";
import type {
  GoalsResponse,
  GoalApiResponse,
  CreateGoalPayload,
  AddContributionPayload,
  Goal,
} from "../types";

export async function getGoals(): Promise<Goal[]> {
  const res = await apiRequest<GoalsResponse>("/api/goals");
  return res.goals;
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
  const res = await apiRequest<GoalApiResponse>("/api/goals", {
    method: "POST",
    body: payload,
  });
  return res.goal;
}

export async function addContribution(goalId: number, payload: AddContributionPayload): Promise<Goal> {
  const res = await apiRequest<GoalApiResponse>(`/api/goals/${goalId}/contributions`, {
    method: "POST",
    body: payload,
  });
  return res.goal;
}

export async function deleteGoal(goalId: number): Promise<void> {
  await apiRequest<void>(`/api/goals/${goalId}`, { method: "DELETE" });
}