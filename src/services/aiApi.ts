import { apiRequest } from "./httpClient";
import type { AiChatPayload, AiChatResponse } from "../types";

export async function sendMessage(message: string): Promise<string> {
  const res = await apiRequest<AiChatResponse>("/api/ai/chat", {
    method: "POST",
    body: { message } satisfies AiChatPayload,
  });
  return res.reply;
}