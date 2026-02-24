import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  activeConversationId: string | null;
}

// ─── Relative time helper ─────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── Sidebar component ───────────────────────────────────────────────────────

export default function ConversationSidebar({
  isOpen,
  onClose,
  onNewChat,
  onSelectConversation,
  activeConversationId,
}: ConversationSidebarProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !user) return;

    let cancelled = false;
    setLoading(true);

    supabase
      .from("conversations")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to load conversations:", error);
        } else {
          setConversations(data ?? []);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isOpen, user]);

  if (!user) return null;

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    // Auto-close on mobile
    if (window.innerWidth < 768) onClose();
  };

  // ─── Sidebar content ─────────────────────────────────────────────────────

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 h-16 border-b border-border">
        <span className="font-serif font-bold text-sm text-foreground">History</span>
        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat button */}
      <div className="shrink-0 px-3 pt-3 pb-2">
        <Button
          variant="hero"
          size="sm"
          className="w-full gap-2"
          onClick={() => {
            onNewChat();
            if (window.innerWidth < 768) onClose();
          }}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-1" style={{ scrollbarWidth: "thin" }}>
        {loading ? (
          <div className="space-y-2 px-1 pt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 px-3 py-3">
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <span className="text-3xl mb-2 opacity-30" aria-hidden="true">ॐ</span>
            <p className="text-xs font-sans text-muted-foreground">
              No past conversations yet
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150 group ${
                    isActive
                      ? "bg-saffron/10 border-l-2 border-saffron"
                      : "hover:bg-muted border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <MessageSquare
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        isActive ? "text-saffron" : "text-muted-foreground/50"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-sans leading-snug truncate ${
                          isActive ? "text-saffron font-medium" : "text-foreground"
                        }`}
                      >
                        {conv.title}
                      </p>
                      <p className="text-[10px] font-sans text-muted-foreground/60 mt-0.5">
                        {relativeTime(conv.updated_at)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible when open */}
      <div
        className={`hidden md:block shrink-0 h-full transition-all duration-300 overflow-hidden ${
          isOpen ? "w-[260px]" : "w-0"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 left-0 w-[280px] z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
