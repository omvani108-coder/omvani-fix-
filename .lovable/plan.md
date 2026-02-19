
## Voice Input Feature for Chat Page

### Overview
Add a voice recording button (styled as "ॐ") to the chat input bar that uses the Web Speech API (`SpeechRecognition`) to transcribe spoken words into the text input box — with full Hindi & English support, recording state feedback, and a graceful fallback toast for unsupported browsers.

---

### What Will Be Built

**A `useVoiceInput` hook** (`src/hooks/useVoiceInput.ts`)  
Encapsulates all Web Speech API logic:
- Detects browser support and returns `isSupported: false` if unavailable
- Tracks `isListening` state (toggled by start/stop)
- Feeds the `lang` prop from the current app language (`en-US` / `hi-IN`)
- Calls an `onTranscript(text)` callback when a result arrives
- Calls `onError()` when recognition fails (e.g., no-mic permission)
- Cleans up automatically on unmount

**A `VoiceMicButton` component** (inline in `Chat.tsx`)  
- Renders an "ॐ" symbol inside a rounded button (matching the existing Om avatar aesthetic)
- **Default state**: saffron/ghost style matching the send button family
- **Listening state**: red background + pulsing ring animation (`animate-pulse`) + "Listening…" label appears above the input bar
- On click: starts or stops recognition
- If not supported: calls a `sonner` toast with the unsupported message

**Integration into `Chat.tsx` input bar**  
- `VoiceMicButton` sits beside the `textarea` and `send` button
- On transcript → `setInput(prev => prev + transcript)` (appends in case user already typed something) then focuses textarea
- The "Listening…" indicator appears as a small animated badge above the input footer (same area as the disclaimer text)

---

### Handling Build Errors (in the same edit)

The existing build has **5 TypeScript errors** that need fixing alongside the voice feature:

1. **`src/pages/Profile.tsx` (lines 14-21)** — locally-defined `fadeUp` variant has `ease: "easeOut"` typed as `string`, but framer-motion v12 requires it as a specific `Easing` type. Fix: import and use `fadeUp` from `src/lib/animations.ts` (which already has the correct typing via `type Variants`), then delete the local inline definition.

2. **`src/pages/PujaTracker.tsx` (line 115, 123)** — references `PUJA_ITEMS` which doesn't exist; the array is named `PUJA_ITEM_BASE`. The file imports `fadeUp` from `src/lib/animations.ts`. Looking at the code, `PUJA_ITEMS` is used inside `DayCell` but was likely renamed. Fix: create a derived `PUJA_ITEMS` constant from `PUJA_ITEM_BASE` joined with translated names, or simply replace the two references with `PUJA_ITEM_BASE`.

3. **`src/pages/chat/Chat.tsx` (line 27)** — `"steps(1)"` is not a valid framer-motion `Easing`. Fix: change to the numeric `steps(1, end)` framer-motion format or use `"step-end"` which is a valid CSS easing string, or replace with a simple keyframes approach using Tailwind's `animate-pulse`.

---

### Technical Details

**Web Speech API Setup**
```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = language === "hi" ? "hi-IN" : "en-US";
```

**Language Mapping**
| App Language | SpeechRecognition lang |
|---|---|
| `en` | `en-US` |
| `hi` | `hi-IN` |

**Button Visual States**

| State | Appearance |
|---|---|
| Idle | Outlined saffron "ॐ" button |
| Listening | Red background + pulsing ring + "Listening…" badge |
| Unsupported | Toast: "Voice input not supported on this browser" |

---

### Files Changed

| File | Change |
|---|---|
| `src/hooks/useVoiceInput.ts` | New hook — Web Speech API logic |
| `src/pages/chat/Chat.tsx` | Add `VoiceMicButton`, integrate hook, fix `"steps(1)"` easing error |
| `src/pages/Profile.tsx` | Fix `fadeUp` TS error — import from `src/lib/animations` |
| `src/pages/PujaTracker.tsx` | Fix `PUJA_ITEMS` reference error |

No new dependencies are needed. The Web Speech API is a native browser API.
