import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { posthog, POSTHOG_KEY } from "@/lib/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const prevUserId = useRef<string | null>(null);

  // Track page views on route changes
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [location.pathname]);

  // Identify / reset user
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    const userId = user?.id ?? null;
    if (userId === prevUserId.current) return;
    prevUserId.current = userId;

    if (userId) {
      posthog.identify(userId, {
        email: user!.email,
        language: user!.user_metadata?.preferred_language,
      });
    } else {
      posthog.reset();
    }
  }, [user]);

  return <>{children}</>;
}
