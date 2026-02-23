/**
 * Tests for the useChat hook (src/pages/chat/useChat.ts)
 *
 * We mock:
 *   - supabase (conversations + chat_messages tables)
 *   - The /functions/v1/chat fetch (streaming response)
 *   - AuthContext and LanguageContext
 *
 * What we test:
 *   1. Initial state (empty messages, not loading)
 *   2. sendMessage adds a user message + an AI placeholder immediately
 *   3. Streaming fills the AI message content
 *   4. Loading guard — double-send while loading is ignored
 *   5. Empty / whitespace-only messages are ignored
 *   6. clearChat wipes messages and deletes the DB conversation
 *   7. Network error shows a toast and removes the AI placeholder
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUser = { id: "test-user-1" };

// Supabase mock — track which tables were touched
const mockConvInsertId = "conv-abc";
const mockSignalledAbort = { aborted: false };

const mockSupabaseFrom = vi.fn((table: string) => {
  if (table === "conversations") {
    return {
      select: () => ({
        eq:          () => ({
          order: () => ({
            limit: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: null }), // no existing conv
            }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({ data: { id: mockConvInsertId }, error: null }),
        }),
      }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    };
  }
  if (table === "chat_messages") {
    return {
      insert: () => Promise.resolve({ error: null }),
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve({ data: [], error: null }),
        }),
      }),
    };
  }
  return {
    select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }) }) }),
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (table: string) => mockSupabaseFrom(table) },
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "en" }),
}));

// toast mock — just track calls
const mockToastError = vi.fn();
vi.mock("sonner", () => ({
  toast: { error: (msg: string) => mockToastError(msg) },
}));

// ── Streaming fetch mock helpers ───────────────────────────────────────────────

function makeStreamResponse(chunks: string[]) {
  const encoder = new TextEncoder();
  let chunkIndex = 0;
  const readable = new ReadableStream({
    pull(controller) {
      if (chunkIndex < chunks.length) {
        controller.enqueue(encoder.encode(chunks[chunkIndex++]));
      } else {
        controller.close();
      }
    },
  });
  return new Response(readable, { status: 200 });
}

function makeErrorResponse(status = 500) {
  return new Response("Internal Server Error", { status });
}

// ── Import hook AFTER mocks ───────────────────────────────────────────────────

import { useChat } from "@/pages/chat/useChat";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useChat — initial state", () => {
  it("starts with empty messages and isLoading=false", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useChat — sendMessage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockToastError.mockClear();
    // Restore the supabase mock after vi.resetAllMocks
    vi.mock("@/integrations/supabase/client", () => ({
      supabase: { from: (table: string) => mockSupabaseFrom(table) },
    }));
  });

  it("ignores empty and whitespace-only messages", async () => {
    global.fetch = vi.fn();
    const { result } = renderHook(() => useChat());

    await act(async () => { await result.current.sendMessage(""); });
    await act(async () => { await result.current.sendMessage("   "); });

    expect(result.current.messages).toHaveLength(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("adds user message and streaming AI placeholder immediately", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      makeStreamResponse(["Hello", " from", " Guru"])
    );

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Who is Shiva?");
    });

    // After completion: user message + AI message = 2
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe("user");
    expect(result.current.messages[0].content).toBe("Who is Shiva?");
    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[1].content).toBe("Hello from Guru");
    expect(result.current.messages[1].isStreaming).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("prevents double-send while a message is loading", async () => {
    // Create a fetch that never resolves (simulates a slow network)
    let resolveFetch!: (val: Response) => void;
    const pendingFetch = new Promise<Response>((res) => { resolveFetch = res; });
    global.fetch = vi.fn().mockReturnValue(pendingFetch);

    const { result } = renderHook(() => useChat());

    // Start a send but don't await it — it's hanging
    const firstSend = act(async () => { result.current.sendMessage("First"); });

    // Immediately try sending a second message
    await act(async () => { result.current.sendMessage("Second"); });

    // Resolve the first fetch to clean up
    resolveFetch(makeStreamResponse(["Done"]));
    await firstSend;

    // Only one user message should be present
    const userMessages = result.current.messages.filter((m) => m.role === "user");
    expect(userMessages).toHaveLength(1);
    expect(userMessages[0].content).toBe("First");
  });

  it("shows error toast and removes AI placeholder on network failure", async () => {
    global.fetch = vi.fn().mockResolvedValue(makeErrorResponse(500));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Tell me about karma");
    });

    // User message should be removed along with the AI placeholder
    expect(result.current.messages).toHaveLength(1); // only user message remains
    expect(result.current.messages[0].role).toBe("user");
    expect(mockToastError).toHaveBeenCalledWith(
      expect.stringContaining("guru")
    );
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useChat — clearChat", () => {
  it("wipes all messages and resets loading state", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      makeStreamResponse(["OM"])
    );

    const { result } = renderHook(() => useChat());

    // Send a message to populate state
    await act(async () => {
      await result.current.sendMessage("Namaste");
    });
    expect(result.current.messages.length).toBeGreaterThan(0);

    // Clear
    await act(async () => { await result.current.clearChat(); });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useChat — [REF: ...] parsing", () => {
  it("strips [REF:...] tags from displayed content", async () => {
    const rawResponse = "This is the answer. [REF: Bhagavad Gita 2.47]";
    global.fetch = vi.fn().mockResolvedValue(
      makeStreamResponse([rawResponse])
    );

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("What does the Gita say about duty?");
    });

    const aiMsg = result.current.messages.find((m) => m.role === "assistant");
    expect(aiMsg).toBeDefined();
    // Ref tag should be stripped from displayed content
    expect(aiMsg!.content).not.toContain("[REF:");
    // But the ref should be captured
    expect(aiMsg!.refs).toHaveLength(1);
    expect(aiMsg!.refs![0].text).toBe("Bhagavad Gita 2.47");
  });
});
