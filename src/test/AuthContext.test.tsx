/**
 * Tests for AuthContext (AuthProvider + useAuth)
 *
 * We mock supabase.auth so tests never touch the network.
 * Core things we verify:
 *   1. Initial loading state is true, then resolves
 *   2. User/session populated correctly on sign-in event
 *   3. User/session cleared on sign-out event
 *   4. getPostLoginPath routes correctly based on onboarding_complete
 *   5. signOut calls supabase.auth.signOut()
 */

import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// ── Supabase auth mock ────────────────────────────────────────────────────────

// vi.hoisted ensures these are initialised before vi.mock factory runs (which is hoisted)
const { mockUnsubscribe, mockSignOut } = vi.hoisted(() => ({
  mockUnsubscribe: vi.fn(),
  mockSignOut:     vi.fn().mockResolvedValue({}),
}));

// We capture the auth-state listener so we can fire it manually in tests
let capturedListener: ((event: string, session: unknown) => void) | null = null;

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
        capturedListener = cb;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      },
      signOut: mockSignOut,
    },
  },
}));

// ── Helper component that reads from the context ───────────────────────────────

function AuthConsumer({ onRender }: { onRender: (ctx: ReturnType<typeof useAuth>) => void }) {
  const ctx = useAuth();
  useEffect(() => { onRender(ctx); });
  return (
    <div>
      <span data-testid="loading">{String(ctx.loading)}</span>
      <span data-testid="user">{ctx.user?.id ?? "null"}</span>
      <span data-testid="session">{ctx.session ? "yes" : "null"}</span>
    </div>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AuthContext — initial state", () => {
  beforeEach(() => {
    capturedListener = null;
    mockUnsubscribe.mockClear();
  });

  it("starts in loading=true state before auth resolves", () => {
    // Don't fire the listener — AuthProvider is still waiting
    render(
      <AuthProvider>
        <AuthConsumer onRender={() => {}} />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("sets loading=false and user=null when auth fires with no session", async () => {
    render(
      <AuthProvider>
        <AuthConsumer onRender={() => {}} />
      </AuthProvider>
    );

    // Simulate Supabase firing immediately with null (no session)
    act(() => { capturedListener?.("INITIAL_SESSION", null); });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("null");
    });
  });

  it("populates user and session when auth fires SIGNED_IN", async () => {
    render(
      <AuthProvider>
        <AuthConsumer onRender={() => {}} />
      </AuthProvider>
    );

    const fakeSession = {
      user: { id: "abc-123", user_metadata: { onboarding_complete: true } },
    };

    act(() => { capturedListener?.("SIGNED_IN", fakeSession); });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("abc-123");
      expect(screen.getByTestId("session").textContent).toBe("yes");
    });
  });

  it("clears user and session on SIGNED_OUT event", async () => {
    render(
      <AuthProvider>
        <AuthConsumer onRender={() => {}} />
      </AuthProvider>
    );

    // First, sign in
    act(() => {
      capturedListener?.("SIGNED_IN", {
        user: { id: "abc-123", user_metadata: {} },
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("abc-123");
    });

    // Then, sign out
    act(() => { capturedListener?.("SIGNED_OUT", null); });
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("null");
      expect(screen.getByTestId("session").textContent).toBe("null");
    });
  });

  it("unsubscribes from auth listener on unmount", () => {
    const { unmount } = render(
      <AuthProvider>
        <AuthConsumer onRender={() => {}} />
      </AuthProvider>
    );

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});

describe("AuthContext — getPostLoginPath", () => {
  beforeEach(() => { capturedListener = null; });

  it("routes to /chat when onboarding_complete is true", async () => {
    let capturedPath = "";
    function PathConsumer() {
      const { getPostLoginPath, user } = useAuth();
      useEffect(() => {
        if (user) capturedPath = getPostLoginPath(user);
      }, [user, getPostLoginPath]);
      return null;
    }

    render(
      <AuthProvider>
        <PathConsumer />
      </AuthProvider>
    );

    act(() => {
      capturedListener?.("SIGNED_IN", {
        user: { id: "u1", user_metadata: { onboarding_complete: true } },
      });
    });

    await waitFor(() => {
      expect(capturedPath).toBe("/chat");
    });
  });

  it("routes to /onboarding when onboarding_complete is false/missing", async () => {
    let capturedPath = "";
    function PathConsumer() {
      const { getPostLoginPath, user } = useAuth();
      useEffect(() => {
        if (user) capturedPath = getPostLoginPath(user);
      }, [user, getPostLoginPath]);
      return null;
    }

    render(
      <AuthProvider>
        <PathConsumer />
      </AuthProvider>
    );

    act(() => {
      capturedListener?.("SIGNED_IN", {
        user: { id: "u2", user_metadata: {} },
      });
    });

    await waitFor(() => {
      expect(capturedPath).toBe("/onboarding");
    });
  });
});

describe("AuthContext — signOut", () => {
  beforeEach(() => {
    capturedListener = null;
    mockSignOut.mockClear();
  });

  it("calls supabase.auth.signOut when signOut is called", async () => {
    function SignOutTrigger() {
      const { signOut } = useAuth();
      useEffect(() => {
        // Fire signOut as soon as the component mounts
        signOut();
      }, []);
      return null;
    }

    render(
      <AuthProvider>
        <SignOutTrigger />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});
