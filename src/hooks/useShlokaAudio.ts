import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface UseShlokaAudioOptions {
  text: string;
}

interface UseShlokaAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  handleToggle: () => Promise<void>;
  stop: () => void;
}

const ELEVENLABS_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George — deep, warm male voice

export function useShlokaAudio({ text }: UseShlokaAudioOptions): UseShlokaAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const abortRef   = useRef<AbortController | null>(null);

  // Full cleanup — stops audio, cancels fetch, revokes blob URL
  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    audioRef.current?.pause();
    audioRef.current = null;

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  // Stop when the shloka text changes (user navigated)
  useEffect(() => { stop(); }, [text, stop]);

  const handleToggle = useCallback(async () => {
    if (isPlaying || isLoading) { stop(); return; }

    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

      const res = await fetch(`${supabaseUrl}/functions/v1/elevenlabs-tts`, {
        method: "POST",
        signal: abortRef.current.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({ text, voiceId: ELEVENLABS_VOICE_ID }),
      });

      if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("Audio playback failed.");
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      // AbortError = user cancelled intentionally, no toast needed
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Could not play audio. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, isLoading, stop, text]);

  return { isPlaying, isLoading, handleToggle, stop };
}
