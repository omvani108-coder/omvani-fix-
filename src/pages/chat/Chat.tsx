import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, BookOpen, RotateCcw, Mic, MicOff, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useChat } from "./useChat";
import { SUGGESTED_QUESTIONS, Message, ScriptureRef } from "./types";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ConversationSidebar from "@/components/ConversationSidebar";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

// ─── Scripture Reference Badge ────────────────────────────────────────────────

function RefBadge({ scriptureRef }: { scriptureRef: ScriptureRef }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-semibold tracking-wide text-saffron bg-saffron/10 border border-saffron/20 px-2.5 py-1 rounded-full">
      <BookOpen className="w-3 h-3" aria-hidden="true" />
      {scriptureRef.text}
    </span>
  );
}

// ─── Streaming cursor ─────────────────────────────────────────────────────────

function StreamCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block w-0.5 h-4 bg-saffron ml-0.5 align-middle"
      aria-hidden="true"
    />
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar — AI side only */}
      {!isUser && (
        <div
          aria-hidden="true"
          className="shrink-0 w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center text-sm mr-3 mt-1 shadow-sacred"
        >
          ॐ
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className={`relative px-5 py-4 rounded-2xl text-sm font-sans leading-relaxed shadow-sm ${
            isUser
              ? "bg-saffron/90 text-white rounded-br-sm"
              : "bg-card border border-border text-foreground rounded-bl-sm"
          }`}
        >
          {/* Subtle grain texture on AI bubbles */}
          {!isUser && (
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl rounded-bl-sm opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          )}

          {/* Render content — split by newlines for paragraph spacing */}
          {message.content
            ? message.content.split("\n").map((line, i) =>
                line.trim() === "" ? (
                  <div key={i} className="h-2" />
                ) : (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                    {line}
                  </p>
                )
              )
            : null}

          {/* Streaming cursor */}
          {message.isStreaming && <StreamCursor />}
        </div>

        {/* Scripture reference badges */}
        {message.refs && message.refs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-1.5 px-1"
            aria-label="Scripture references"
          >
            {message.refs.map((ref, i) => (
              <RefBadge key={i} scriptureRef={ref} />
            ))}
          </motion.div>
        )}

        {/* Timestamp */}
        <time
          dateTime={message.timestamp.toISOString()}
          className="text-[10px] text-muted-foreground/50 font-sans px-1"
        >
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      </div>

      {/* Avatar — user side */}
      {isUser && (
        <div
          aria-hidden="true"
          className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground ml-3 mt-1"
        >
          🙏
        </div>
      )}
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center h-full px-4 text-center"
    >
      {/* Sacred Om symbol */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-full bg-sacred-gradient flex items-center justify-center text-4xl shadow-sacred mb-6"
        aria-hidden="true"
      >
        ॐ
      </motion.div>

      <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
        Ask the Guru
      </h2>
      <p className="text-muted-foreground font-sans text-sm max-w-sm mb-10 leading-relaxed">
        Seek wisdom from the Bhagavad Gita, Vedas & Puranas. Every answer is rooted in authentic scripture.
      </p>

      {/* Suggested questions */}
      <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <motion.button
            key={q}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(q)}
            className="text-left px-4 py-3 rounded-xl bg-card border border-border hover:border-saffron/50 hover:bg-saffron/5 focus-visible:ring-2 focus-visible:ring-saffron transition-all duration-200 text-sm font-sans text-foreground/80 group"
          >
            <span className="text-saffron mr-2 group-hover:mr-3 transition-all" aria-hidden="true">✦</span>
            {q}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Voice Mic Button ─────────────────────────────────────────────────────────

function VoiceMicButton({
  isListening,
  isSupported,
  onToggle,
}: {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isListening ? "Stop recording" : "Start voice input"}
      aria-pressed={isListening}
      className={`
        relative shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
        font-serif text-base transition-all duration-200 focus-visible:ring-2
        focus-visible:ring-saffron active:scale-95
        ${isListening
          ? "bg-red-500 text-white shadow-lg"
          : "border border-border bg-card text-saffron hover:border-saffron/50 hover:bg-saffron/5"
        }
      `}
    >
      {/* Pulsing ring when listening */}
      {isListening && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl ring-2 ring-red-400 animate-ping opacity-60"
        />
      )}
      <span aria-hidden="true" className="leading-none">ॐ</span>
    </button>
  );
}

// ─── DB row → Message helper (same as useChat) ───────────────────────────────

function dbRowToMessage(row: {
  id: string;
  role: string;
  content: string;
  created_at: string;
  source_references: unknown;
}): Message {
  const refs = Array.isArray(row.source_references)
    ? (row.source_references as { text: string }[]).map((r) => ({ text: r.text }))
    : [];
  return {
    id: row.id,
    role: row.role as "user" | "assistant",
    content: row.content,
    timestamp: new Date(row.created_at),
    refs: refs.length > 0 ? refs : undefined,
  };
}

// ─── Main Chat Page ───────────────────────────────────────────────────────────

export default function Chat() {
  const { messages, isLoading, isLoadingHistory, sendMessage, clearChat } = useChat();
  const { user } = useAuth();
  const { t } = useTranslations();
  const { language } = useLanguage();
  const { canChat, chatWarning, chatRemaining, incrementUsage } = useSubscription();
  const [input, setInput] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Historical conversation viewing state
  const [viewingConvId, setViewingConvId] = useState<string | null>(null);
  const [historicalMessages, setHistoricalMessages] = useState<Message[]>([]);
  const [loadingHistorical, setLoadingHistorical] = useState(false);

  // Determine which messages to display
  const isViewingHistory = viewingConvId !== null;
  const displayMessages = isViewingHistory ? historicalMessages : messages;
  const displayLoading = isViewingHistory ? loadingHistorical : isLoadingHistory;

  // Voice input
  const { isSupported: voiceSupported, isListening, toggle: toggleVoice } = useVoiceInput({
    language,
    onTranscript: (text) => {
      setInput((prev) => (prev ? prev + " " + text : text));
      textareaRef.current?.focus();
    },
    onError: () => {
      toast.error("Microphone access denied or an error occurred.");
    },
  });

  const handleVoiceClick = () => {
    if (!voiceSupported) {
      toast.error("Voice input not supported on this browser");
      return;
    }
    toggleVoice();
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  // Load a historical conversation's messages
  const loadConversation = useCallback(async (convId: string) => {
    setLoadingHistorical(true);
    setViewingConvId(convId);
    try {
      const { data: rows, error } = await supabase
        .from("chat_messages")
        .select("id, role, content, created_at, source_references")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setHistoricalMessages(rows ? rows.map(dbRowToMessage) : []);
    } catch (err) {
      console.error("Failed to load conversation:", err);
      toast.error("Could not load conversation");
      setViewingConvId(null);
    } finally {
      setLoadingHistorical(false);
    }
  }, []);

  const handleNewChat = () => {
    setViewingConvId(null);
    setHistoricalMessages([]);
    clearChat();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    // Paywall: check if user can still chat
    if (!canChat) {
      setUpgradeOpen(true);
      return;
    }
    // If viewing history, switch back to live chat mode before sending
    if (isViewingHistory) {
      setViewingConvId(null);
      setHistoricalMessages([]);
      clearChat();
    }
    const text = input;
    setInput("");
    await sendMessage(text);
    // Increment usage counter after successful send
    await incrementUsage("chat");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggest = (q: string) => {
    setInput(q);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex h-screen bg-background">
      <SeoHead title="Chat with ॐVani" description="Ask your spiritual questions and receive scripture-based guidance from the Bhagavad Gita, Vedas and Puranas." canonicalPath="/chat" />

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger="chat"
        remaining={chatRemaining}
      />

      {/* ── Conversation Sidebar ──────────────────────────────────────────── */}
      {user && (
        <ConversationSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectConversation={loadConversation}
          activeConversationId={viewingConvId}
        />
      )}

      {/* ── Main chat column ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <header className="shrink-0 flex items-center justify-between px-4 md:px-6 h-16 border-b border-border bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            {/* Sidebar toggle */}
            {user && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Close history" : "Open history"}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="w-4.5 h-4.5" aria-hidden="true" />
                ) : (
                  <PanelLeftOpen className="w-4.5 h-4.5" aria-hidden="true" />
                )}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div aria-hidden="true" className="w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center text-sm shadow-sacred">
                ॐ
              </div>
              <span className="font-serif font-bold text-lg text-gradient-sacred">ॐVani</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 text-center">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-sans text-muted-foreground ml-1.5">Guru is present</span>
          </div>

          <button
            onClick={handleNewChat}
            disabled={displayMessages.length === 0 && !isViewingHistory}
            aria-label="New conversation"
            className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            New
          </button>
        </header>

        {/* ── Messages area ────────────────────────────────────────────────── */}
        <main
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6"
          aria-label="Conversation"
          aria-live="polite"
          aria-atomic="false"
        >
          <div className="max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {displayLoading ? (
                /* Loading history skeleton */
                <motion.div
                  key="loading-history"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[60vh] flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-sacred-gradient flex items-center justify-center text-xl shadow-sacred">
                    ॐ
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                        className="w-1.5 h-1.5 rounded-full bg-saffron/60"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-sans text-muted-foreground">Restoring your conversation…</p>
                </motion.div>
              ) : displayMessages.length === 0 ? (
                <motion.div
                  key="empty"
                  className="h-full min-h-[60vh] flex items-center justify-center"
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <EmptyState onSelect={handleSuggest} />
                </motion.div>
              ) : (
                <motion.div
                  key={isViewingHistory ? `hist-${viewingConvId}` : "messages"}
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Historical viewing banner */}
                  {isViewingHistory && (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-saffron/5 border border-saffron/20 text-xs font-sans text-saffron">
                      <BookOpen className="w-3.5 h-3.5" />
                      Viewing past conversation
                    </div>
                  )}

                  {displayMessages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}

                  {/* Thinking indicator — shows while waiting for first chunk */}
                  {!isViewingHistory && isLoading && messages[messages.length - 1]?.isStreaming && messages[messages.length - 1]?.content === "" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <div aria-hidden="true" className="w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center text-sm shadow-sacred">
                        ॐ
                      </div>
                      <div className="flex items-center gap-1.5 px-4 py-3 bg-card border border-border rounded-2xl rounded-bl-sm">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                            className="w-1.5 h-1.5 rounded-full bg-saffron/60"
                            aria-hidden="true"
                          />
                        ))}
                        <span className="sr-only">Guru is thinking…</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={bottomRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ── Input bar ────────────────────────────────────────────────────── */}
        <footer className="shrink-0 px-4 md:px-6 py-4 border-t border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-2xl mx-auto">
            {/* Soft limit warning */}
            {chatWarning && canChat && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
              >
                <span className="text-xs font-sans text-amber-700 dark:text-amber-400">
                  {chatRemaining === 1
                    ? "1 free chat remaining today"
                    : `${chatRemaining} free chats remaining today`}
                </span>
                <button
                  onClick={() => setUpgradeOpen(true)}
                  className="text-xs font-sans font-semibold text-amber-700 dark:text-amber-400 underline ml-3"
                >
                  Upgrade
                </button>
              </motion.div>
            )}

            {/* Listening indicator */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 mb-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                <span className="text-xs font-sans text-red-500 font-medium">Listening…</span>
              </motion.div>
            )}

            {/* Disclaimer */}
            {!isListening && (
              <p className="text-[10px] text-muted-foreground/50 font-sans text-center mb-3">
                ॐVani draws from authentic scriptures. Not a substitute for a living guru.
              </p>
            )}

            {/* Input row */}
            <div className="flex items-end gap-2 bg-card border border-border rounded-2xl px-4 py-3 focus-within:border-saffron/50 transition-colors duration-200 shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isViewingHistory ? "Type to start a new conversation…" : t.chat.placeholder}
                aria-label="Your question"
                rows={1}
                className="flex-1 bg-transparent resize-none text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed max-h-40"
                style={{ scrollbarWidth: "none" }}
              />

              {/* Voice mic button */}
              <VoiceMicButton
                isListening={isListening}
                isSupported={voiceSupported}
                onToggle={handleVoiceClick}
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="shrink-0 w-9 h-9 rounded-xl bg-sacred-gradient flex items-center justify-center text-accent-foreground shadow-sacred hover:opacity-90 focus-visible:ring-2 focus-visible:ring-saffron disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <p className="text-[10px] text-muted-foreground/40 font-sans text-center mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
