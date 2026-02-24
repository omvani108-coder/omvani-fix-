import { useState, useCallback, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, SYSTEM_PROMPT, ScriptureRef, dbRowToMessage } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const conversationIdRef = useRef<string | null>(null);

  // Keep isLoadingRef in sync so sendMessage always reads the latest value
  const setLoadingState = (val: boolean) => {
    isLoadingRef.current = val;
    setIsLoading(val);
  };

  const { language } = useLanguage();
  const { user } = useAuth();

  // Keep ref in sync so sendMessage always reads latest messages
  const setMessagesAndRef = (updater: (prev: Message[]) => Message[]) => {
    setMessages((prev) => {
      const next = updater(prev);
      messagesRef.current = next;
      return next;
    });
  };

  // ── Load most recent conversation on mount (logged-in users only) ──────────
  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        // Get the most recent conversation for this user
        const { data: conv, error: convErr } = await supabase
          .from("conversations")
          .select("id")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (convErr) throw convErr;
        if (!conv) return; // No previous conversations

        conversationIdRef.current = conv.id;

        // Load all messages for this conversation
        const { data: rows, error: msgErr } = await supabase
          .from("chat_messages")
          .select("id, role, content, created_at, source_references")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: true });

        if (msgErr) throw msgErr;
        if (!rows || rows.length === 0) return;

        setMessagesAndRef(() => rows.map(dbRowToMessage));
      } catch (err) {
        console.error("Failed to load chat history:", err);
        // Silent fail — guest-like experience if DB unavailable
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── Ensure a conversation row exists, create one if not ────────────────────
  const ensureConversation = async (firstMessage: string): Promise<string | null> => {
    if (!user) return null;

    // Reuse existing conversation from this session
    if (conversationIdRef.current) return conversationIdRef.current;

    // Title = first 60 chars of first message
    const title = firstMessage.length > 60
      ? firstMessage.slice(0, 60) + "…"
      : firstMessage;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create conversation:", error);
      return null;
    }

    conversationIdRef.current = data.id;
    return data.id;
  };

  // ── Save a single message to the DB ────────────────────────────────────────
  const saveMessage = async (
    conversationId: string,
    role: "user" | "assistant",
    content: string,
    refs?: ScriptureRef[]
  ) => {
    if (!user) return;

    const sourceRefs = refs && refs.length > 0
      ? refs.map((r) => ({ text: r.text }))
      : null;

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role,
      content,
      source_references: sourceRefs,
    });

    if (error) {
      console.error("Failed to save message:", error);
    }
  };

  // ── Update conversation updated_at so it stays "most recent" ──────────────
  const touchConversation = async (conversationId: string) => {
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  };

  // ── Main send function ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoadingRef.current) return;

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
    setLoadingState(true);
    abortRef.current = new AbortController();

    // Ensure we have a conversation in the DB before saving anything
    const conversationId = await ensureConversation(content.trim());

    // Save the user message immediately
    if (conversationId) {
      await saveMessage(conversationId, "user", content.trim());
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

      // Build history from ref (excludes the streaming placeholder)
      const history = messagesRef.current
        .filter((m) => !m.isStreaming && m.content)
        .map((m) => ({ role: m.role, content: m.content }));

      const languageInstruction =
        language === "hi"
          ? "\n\nIMPORTANT: The user has selected Hindi. You MUST respond entirely in Hindi (Devanagari script)."
          : language === "ta"
          ? "\n\nIMPORTANT: The user has selected Tamil. You MUST respond entirely in Tamil script (\u0ba4\u0bae\u0bbf\u0bb4\u0bcd). Do not use English except for proper nouns like scripture names."
          : "";

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

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Edge function streams raw text chunks — just concatenate
          accumulated += decoder.decode(value, { stream: true });

          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiPlaceholderId
                ? { ...m, content: accumulated, isStreaming: true }
                : m
            )
          );
        }
        // Flush any remaining bytes
        accumulated += decoder.decode();
      }

      // Finalise the message in state
      const { clean, refs } = parseRefs(accumulated.trim());
      setMessagesAndRef((prev) =>
        prev.map((m) =>
          m.id === aiPlaceholderId
            ? { ...m, content: clean, refs, isStreaming: false }
            : m
        )
      );

      // Save the completed AI response to DB
      if (conversationId) {
        await saveMessage(conversationId, "assistant", clean, refs);
        await touchConversation(conversationId);
      }

    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Chat error:", err);
      toast.error("Could not reach the guru. Please try again.");
      setMessagesAndRef((prev) =>
        prev.filter((m) => m.id !== aiPlaceholderId)
      );
    } finally {
      setLoadingState(false);
      abortRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, user]);

  // ── Clear chat (delete from DB + reset state) ───────────────────────────────
  const clearChat = useCallback(async () => {
    abortRef.current?.abort();
    setMessagesAndRef(() => []);
    setLoadingState(false);

    // Delete the conversation from DB (cascade deletes messages too)
    if (user && conversationIdRef.current) {
      await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationIdRef.current);
    }

    conversationIdRef.current = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { messages, isLoading, isLoadingHistory, sendMessage, clearChat };
}
