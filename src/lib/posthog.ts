import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: "https://us.i.posthog.com",
    autocapture: false,
    capture_pageview: false, // we fire these manually on route changes
    capture_pageleave: true,
    persistence: "localStorage",
  });
}

export { posthog, POSTHOG_KEY };
