import { useState, useCallback, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Message, SYSTEM_PROMPT, ScriptureRef } from "./types";

// Parses [REF: ...] tags from the end of AI responses
function parseRefs(content: string): { clean: string; refs: ScriptureRef[] } {
  const refRegex = /\[REF:\s*([^\]]+)\]/g;
  const refs: ScriptureRef[] = [];
  let match;
  while ((match = refRegex.exec(content)) !== null) {
    refs.push({ text: match[1].trim() });
  }
  const clean = content.replace(refRegex, "").trim();
  return { clean, refs };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const { language } = useLanguage();

  // Keep ref in sync so sendMessage always reads latest messages
  const setMessagesAndRef = (updater: (prev: Message[]) => Message[]) => {
    setMessages((prev) => {
      const next = updater(prev);
      messagesRef.current = next;
      return next;
    });
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const aiPlaceholderId = generateId();
    const aiPlaceholder: Message = {
      id: aiPlaceholderId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessagesAndRef((prev) => [...prev, userMessage, aiPlaceholder]);
    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      // ✅ FIXED: use correct env variable name
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

      // Use ref so we always get latest messages (not stale closure)
      const history = messagesRef.current
        .filter((m) => !m.isStreaming && m.content)
        .map((m) => ({ role: m.role, content: m.content }));

      const languageInstruction = language === "hi"
        ? "\n\nIMPORTANT: The user has selected Hindi. You MUST respond entirely in Hindi (Devanagari script)."
        : "\n\nIMPORTANT: Respond in English.";

      const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        signal: abortRef.current.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({
          messages: [
            ...history,
            { role: "user", content: content.trim() },
          ],
          system: SYSTEM_PROMPT + languageInstruction,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "Unknown error");
        throw new Error(`Chat request failed: ${res.status} — ${errText}`);
      }

      // Stream the response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Buffer to handle split SSE frames
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            // Direct text streaming (our edge function sends plain text)
            accumulated += line + (line ? "\n" : "");
          }

          // Also try raw chunk as plain text
          const rawChunk = decoder.decode(value, { stream: true });
          if (rawChunk) {
            accumulated = accumulated || rawChunk;
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiPlaceholderId
                ? { ...m, content: accumulated.trimEnd(), isStreaming: true }
                : m
            )
          );
        }
      }

      // Finalise
      const { clean, refs } = parseRefs(accumulated.trim());
      setMessagesAndRef((prev) =>
        prev.map((m) =>
          m.id === aiPlaceholderId
            ? { ...m, content: clean, refs, isStreaming: false }
            : m
        )
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Chat error:", err);
      toast.error("Could not reach the guru. Please try again.");
      setMessagesAndRef((prev) =>
        prev.filter((m) => m.id !== aiPlaceholderId)
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [isLoading, language]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessagesAndRef(() => []);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
