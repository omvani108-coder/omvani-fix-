import { useState, useCallback, useRef } from "react";
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

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    // Optimistically add user message + placeholder AI message
    const aiPlaceholderId = generateId();
    const aiPlaceholder: Message = {
      id: aiPlaceholderId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);
    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
     const supabaseKey = import.meta.env.VITE_ANON_KEY as string;

      // Build conversation history for context
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

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
          system: SYSTEM_PROMPT,
        }),
      });

      if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);

      // Stream the response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          // Update the streaming message in real time
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiPlaceholderId
                ? { ...m, content: accumulated, isStreaming: true }
                : m
            )
          );
        }
      }

      // Finalise — parse out scripture refs, mark streaming done
      const { clean, refs } = parseRefs(accumulated);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiPlaceholderId
            ? { ...m, content: clean, refs, isStreaming: false }
            : m
        )
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error("Could not reach the guru. Please try again.");
      // Remove the failed placeholder
      setMessages((prev) => prev.filter((m) => m.id !== aiPlaceholderId));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
