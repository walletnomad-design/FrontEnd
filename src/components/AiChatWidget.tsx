import { useEffect, useRef, useState, type FormEvent } from "react";
import * as aiApi from "../services/aiApi";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const reply = await aiApi.sendMessage(text);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo consultar al asistente");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[28rem] w-80 flex-col overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl animate-rise">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-text">Nomad AI</p>
              <p className="text-xs text-muted">Preguntá sobre tus finanzas</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar"
              className="rounded-md p-1 text-muted transition-colors hover:text-text"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-xs text-muted">
                Probá preguntando "¿cuánto tengo disponible?" o "¿cómo van mis metas?"
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-primary text-white" : "bg-white/5 text-text"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isSending && <p className="text-xs text-muted">Nomad AI está escribiendo...</p>}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu consulta..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Asistente Nomad AI"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet text-xl text-white shadow-lg transition-transform hover:scale-105"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
}