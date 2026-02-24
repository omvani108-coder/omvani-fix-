/**
 * Tests for useSubscription hook
 *
 * Strategy: mock Supabase and AuthContext so tests run without a real DB.
 * We verify the hook's derived logic (limits, canChat, rollback maths, etc.)
 * rather than the network layer.
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// ── Supabase mock ─────────────────────────────────────────────────────────────

const mockUser = { id: "user-123" };

// We'll control what supabase returns via these mutable objects
let mockSubRow: Record<string, unknown> | null = null;
let mockSubErr:  Error | null = null;
let mockUsageRows: { feature: string; count: number }[] = [];
let mockUsageErr:  Error | null = null;
let mockUpsertErr: Error | null = null;

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () =>
              Promise.resolve({ data: mockSubRow, error: mockSubErr }),
            // For usage_logs (two .eq chains)
            then: undefined,
          }),
          maybeSingle: () =>
            Promise.resolve({ data: mockSubRow, error: mockSubErr }),
        }),
        // usage_logs returns an array — no maybeSingle
        eq: () => ({
          eq: () =>
            Promise.resolve({ data: mockUsageRows, error: mockUsageErr }),
        }),
      }),
      upsert: () =>
        Promise.resolve({ error: mockUpsertErr }),
    }),
  },
}));

// ── AuthContext mock ──────────────────────────────────────────────────────────

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

// ── Import hook AFTER mocks are in place ─────────────────────────────────────

import { useSubscription } from "@/hooks/useSubscription";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Because the Supabase mock's .from().select().eq().eq() chain differs for
// subscriptions vs usage_logs, we need a smarter mock. Let's simplify by
// replacing the mock with a more realistic chain approach:

vi.mock("@/integrations/supabase/client", () => {
  const makeChain = (resolveWith: () => Promise<unknown>) => {
    const chain: Record<string, unknown> = {};
    const methods = ["select", "eq", "limit", "order", "maybeSingle", "upsert", "insert", "update", "single"];
    methods.forEach((m) => {
      chain[m] = (..._args: unknown[]) => {
        if (m === "maybeSingle") return resolveWith();
        if (m === "upsert")      return Promise.resolve({ error: mockUpsertErr });
        return chain;
      };
    });
    return chain;
  };

  return {
    supabase: {
      from: (table: string) => {
        if (table === "subscriptions") {
          return makeChain(() =>
            Promise.resolve({ data: mockSubRow, error: mockSubErr })
          );
        }
        if (table === "usage_logs") {
          // usage_logs fetch returns array; upsert is handled by chain.upsert
          const chain: Record<string, unknown> = {};
          chain.select = () => chain;
          chain.eq     = () => chain;
          chain.then   = undefined;
          // Final resolution — make chain thenable for awaiting
          // We simulate: supabase.from("usage_logs").select(...).eq(...).eq(...) → Promise
          chain.eq = () => ({
            eq: () => Promise.resolve({ data: mockUsageRows, error: mockUsageErr }),
          });
          chain.upsert = () => Promise.resolve({ error: mockUpsertErr });
          return chain;
        }
        return makeChain(() => Promise.resolve({ data: null, error: null }));
      },
    },
  };
});

// ─────────────────────────────────────────────────────────────────────────────

describe("useSubscription — plan derivation", () => {
  beforeEach(() => {
    // Reset to a clean "free" state before each test
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
    expect(result.current.canChat).toBe(true);    // Infinity limit
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

    // After rollback (DB failed), count should be back to 2 (not -1 or 0)
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
