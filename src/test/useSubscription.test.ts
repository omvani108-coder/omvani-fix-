/**
 * Tests for useSubscription hook
 *
 * Strategy: mock Supabase and AuthContext so tests run without a real DB.
 * We verify the hook's derived logic (limits, canChat, rollback maths, etc.)
 * rather than the network layer.
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

// ── Mutable mock state ──────────────────────────────────────────────────────

const mockUser = { id: "user-123" };

let mockSubRow: Record<string, unknown> | null = null;
let mockSubErr:  Error | null = null;
let mockUsageRows: { feature: string; count: number }[] = [];
let mockUsageErr:  Error | null = null;
let mockUpsertErr: Error | null = null;

// ── AuthContext mock ────────────────────────────────────────────────────────

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

// ── Supabase mock ──────────────────────────────────────────────────────────
// The hook uses two tables:
//   subscriptions: .from().select().eq(user_id).maybeSingle()
//   usage_logs:    .from().select().eq(user_id).eq(feature).eq(date_ist) → array
//                  .from().upsert()

vi.mock("@/integrations/supabase/client", () => {
  /**
   * Chain builder: every chainable method returns `chain` itself,
   * except terminal methods which resolve the promise.
   */
  function buildSubChain() {
    const chain: Record<string, unknown> = {};
    const self = (..._args: unknown[]) => chain;
    chain.select = self;
    chain.eq = self;
    chain.order = self;
    chain.limit = self;
    chain.maybeSingle = () =>
      Promise.resolve({ data: mockSubRow, error: mockSubErr });
    return chain;
  }

  function buildUsageChain() {
    // Track eq() call depth: select → eq(user_id) → eq(date_ist) → resolve
    let eqDepth = 0;
    const chain: Record<string, unknown> = {};
    chain.select = () => { eqDepth = 0; return chain; };
    chain.eq = () => {
      eqDepth++;
      if (eqDepth >= 2) {
        // Terminal: return promise (after user_id + date_ist eq)
        return Promise.resolve({ data: mockUsageRows, error: mockUsageErr });
      }
      return chain;
    };
    chain.upsert = () => Promise.resolve({ error: mockUpsertErr });
    return chain;
  }

  return {
    supabase: {
      from: (table: string) => {
        if (table === "subscriptions") return buildSubChain();
        if (table === "usage_logs") return buildUsageChain();
        return buildSubChain(); // fallback
      },
    },
  };
});

// ── Import hook AFTER mocks ─────────────────────────────────────────────────

import { useSubscription } from "@/hooks/useSubscription";

// ── Tests ───────────────────────────────────────────────────────────────────

describe("useSubscription — plan derivation", () => {
  beforeEach(() => {
    mockSubRow    = null;
    mockSubErr    = null;
    mockUsageRows = [];
    mockUsageErr  = null;
    mockUpsertErr = null;
  });

  it("defaults to free plan when no subscription row exists", async () => {
    mockSubRow = null;

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.plan).toBe("free");
    expect(result.current.isFree).toBe(true);
    expect(result.current.isPaid).toBe(false);
  });

  it("picks up pro plan from subscription row", async () => {
    mockSubRow = {
      plan:               "pro",
      status:             "active",
      trial_ends_at:      null,
      current_period_end: new Date(Date.now() + 86_400_000).toISOString(), // tomorrow
      family_owner_id:    null,
    };

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.plan).toBe("pro");
    expect(result.current.isPro).toBe(true);
    expect(result.current.canChat).toBe(true);    // 20/day limit, 0 usage → true
    expect(result.current.canIdentify).toBe(true);
  });

  it("treats an expired subscription as free", async () => {
    mockSubRow = {
      plan:               "basic",
      status:             "active",                       // still says "active"...
      current_period_end: new Date(Date.now() - 86_400_000).toISOString(), // ...but expired yesterday
      trial_ends_at:      null,
      family_owner_id:    null,
    };

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.plan).toBe("free");
    expect(result.current.status).toBe("expired");
  });
});

describe("useSubscription — daily limits & canChat / canIdentify", () => {
  beforeEach(() => {
    mockSubRow    = null;
    mockSubErr    = null;
    mockUsageRows = [];
    mockUsageErr  = null;
    mockUpsertErr = null;
  });

  it("canChat is true on free plan when under the 3-chat limit", async () => {
    mockUsageRows = [{ feature: "chat", count: 2 }];

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.canChat).toBe(true);
    expect(result.current.chatRemaining).toBe(1);
  });

  it("canChat is false on free plan when limit is reached", async () => {
    mockUsageRows = [{ feature: "chat", count: 3 }];

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.canChat).toBe(false);
    expect(result.current.chatRemaining).toBe(0);
  });

  it("canIdentify is false on free plan when limit is reached", async () => {
    mockUsageRows = [{ feature: "identify", count: 1 }];

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.canIdentify).toBe(false);
    expect(result.current.identifyRemaining).toBe(0);
  });

  it("basic plan has 10 chat limit", async () => {
    mockSubRow = {
      plan: "basic", status: "active",
      current_period_end: new Date(Date.now() + 86_400_000).toISOString(),
      trial_ends_at: null, family_owner_id: null,
    };
    mockUsageRows = [{ feature: "chat", count: 9 }];

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.chatRemaining).toBe(1);
    expect(result.current.canChat).toBe(true);
  });

  it("pro plan has 20 chat limit", async () => {
    mockSubRow = {
      plan: "pro", status: "active",
      current_period_end: new Date(Date.now() + 86_400_000).toISOString(),
      trial_ends_at: null, family_owner_id: null,
    };
    mockUsageRows = [{ feature: "chat", count: 20 }];

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.chatRemaining).toBe(0);
    expect(result.current.canChat).toBe(false);
  });
});

describe("useSubscription — incrementUsage rollback", () => {
  beforeEach(() => {
    mockSubRow    = null;
    mockSubErr    = null;
    mockUsageRows = [{ feature: "chat", count: 2 }];
    mockUsageErr  = null;
    mockUpsertErr = null;
  });

  it("optimistically increments usage, then rolls back on DB error", async () => {
    mockUpsertErr = new Error("DB write failed");

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Starting count is 2
    expect(result.current.usage.chat).toBe(2);

    // Trigger increment — optimistic update fires immediately
    await act(async () => {
      await result.current.incrementUsage("chat");
    });

    // After rollback (DB failed), count should be back to 2
    expect(result.current.usage.chat).toBe(2);
  });

  it("increments usage permanently when DB write succeeds", async () => {
    mockUpsertErr = null; // success

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.usage.chat).toBe(2);

    await act(async () => {
      await result.current.incrementUsage("chat");
    });

    // Count should now be 3
    expect(result.current.usage.chat).toBe(3);
  });
});

describe("useSubscription — DB fetch errors", () => {
  it("falls back to free plan when subscription fetch throws", async () => {
    mockSubErr = new Error("Network error");

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Safe fallback
    expect(result.current.plan).toBe("free");
    expect(result.current.isFree).toBe(true);
  });
});

describe("useSubscription — kundli pricing", () => {
  beforeEach(() => {
    mockSubRow    = null;
    mockSubErr    = null;
    mockUsageRows = [];
    mockUsageErr  = null;
    mockUpsertErr = null;
  });

  it("kundli price is ₹79 (7900 paise) for free users", async () => {
    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.kundliPricePerAnalysis).toBe(7900);
  });

  it("kundli price is ₹79 (7900 paise) for paid users too", async () => {
    mockSubRow = {
      plan: "pro", status: "active",
      current_period_end: new Date(Date.now() + 86_400_000).toISOString(),
      trial_ends_at: null, family_owner_id: null,
    };

    const { result } = renderHook(() => useSubscription());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.kundliPricePerAnalysis).toBe(7900);
  });
});
