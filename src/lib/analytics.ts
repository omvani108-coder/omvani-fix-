import { posthog, POSTHOG_KEY } from "@/lib/posthog";

function track(event: string, properties?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

export const trackChatMessage = () => track("chat_message_sent");

export const trackScriptureRead = (scriptureId: string) =>
  track("scripture_read", { scripture_id: scriptureId });

export const trackBhajanPlay = (bhajanId: string) =>
  track("bhajan_play", { bhajan_id: bhajanId });

export const trackPujaComplete = (pujaName: string) =>
  track("puja_complete", { puja_name: pujaName });

export const trackDeityIdentify = () => track("deity_identify");

export const trackSubscriptionChange = (plan: string) =>
  track("subscription_change", { plan });
