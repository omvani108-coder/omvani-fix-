import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Volume2, Loader2, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/spiritual-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;
const STT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`;

const Chat = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTextChat, setShowTextChat] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  };

  const streamChat = useCallback(async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `Request failed (${resp.status})`);
    }

    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: fullResponse } : m));
              }
              return [...prev, { role: "assistant", content: fullResponse }];
            });
            scrollToBottom();
          }
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    return fullResponse;
  }, []);

  const speakText = useCallback(async (text: string) => {
    // Strip markdown/emojis for cleaner speech
    const cleanText = text.replace(/[#*_`~>🙏📿✨]/g, "").trim();
    if (!cleanText) return;

    setIsSpeaking(true);
    try {
      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: cleanText }),
      });
      if (!resp.ok) throw new Error("TTS failed");
      const audioBlob = await resp.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch (e) {
      console.error("TTS error:", e);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await streamChat(allMessages);
      // Auto-speak response if user used voice
      if (!showTextChat && response) {
        await speakText(response);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, streamChat, speakText, showTextChat, toast]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");
          formData.append("language", "en");

          const resp = await fetch(STT_URL, {
            method: "POST",
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: formData,
          });

          if (!resp.ok) throw new Error("Transcription failed");
          const data = await resp.json();
          const transcript = data.text?.trim();
          if (transcript) {
            await sendMessage(transcript);
          } else {
            toast({ title: "No speech detected", description: "Please try again.", variant: "destructive" });
            setIsLoading(false);
          }
        } catch (e: any) {
          toast({ title: "Voice error", description: e.message, variant: "destructive" });
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({ title: "Microphone access denied", description: "Please enable microphone access to use voice.", variant: "destructive" });
    }
  }, [sendMessage, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-serif font-bold text-gradient-sacred">OmVani</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTextChat(!showTextChat)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={showTextChat ? "Switch to voice" : "Switch to text"}
          >
            {showTextChat ? <Mic className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          </button>
          <button onClick={signOut} className="text-sm text-saffron hover:underline font-sans">
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showTextChat ? (
          /* Text chat mode */
          <>
            <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
              <div className="max-w-2xl mx-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-4xl mb-3">🙏</p>
                    <h2 className="text-xl font-serif font-bold text-foreground mb-2">Namaste, {user?.user_metadata?.full_name || "Seeker"}</h2>
                    <p className="text-muted-foreground font-sans text-sm">Ask me anything about dharma, karma, or life.</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm font-sans leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-card-foreground"
                      }`}
                    >
                      {msg.content}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => speakText(msg.content)}
                          className="mt-2 flex items-center gap-1 text-xs text-saffron hover:underline"
                        >
                          <Volume2 className="w-3 h-3" /> Listen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-saffron" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Text input */}
            <div className="border-t border-border p-4 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="max-w-2xl mx-auto flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about dharma, karma, or life..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" variant="hero" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* Voice mode — mic centered */
          <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            {/* Messages display in voice mode */}
            {messages.length > 0 && (
              <div className="absolute top-4 left-4 right-4 max-h-[30vh] overflow-y-auto">
                <div className="max-w-lg mx-auto">
                  <AnimatePresence>
                    {messages.slice(-2).map((msg, i) => (
                      <motion.div
                        key={`voice-${messages.length - 2 + i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-2 rounded-xl px-4 py-3 text-sm font-sans ${
                          msg.role === "user"
                            ? "bg-primary/10 text-foreground"
                            : "bg-card border border-border text-card-foreground"
                        }`}
                      >
                        {msg.content.length > 200 ? msg.content.slice(0, 200) + "..." : msg.content}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Center mic area */}
            <div className="flex flex-col items-center gap-6">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4"
                >
                  <p className="text-4xl mb-3">🙏</p>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-1">
                    Namaste, {user?.user_metadata?.full_name || "Seeker"}
                  </h2>
                  <p className="text-muted-foreground font-sans text-sm">
                    Tap the mic and ask your question
                  </p>
                </motion.div>
              )}

              {/* Status text */}
              <p className="text-sm text-muted-foreground font-sans h-5">
                {isRecording
                  ? "Listening..."
                  : isLoading
                  ? "Thinking..."
                  : isSpeaking
                  ? "Speaking..."
                  : ""}
              </p>

              {/* Mic button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : isSpeaking ? stopSpeaking : startRecording}
                disabled={isLoading}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-destructive"
                    : isSpeaking
                    ? "bg-saffron"
                    : isLoading
                    ? "bg-muted"
                    : "bg-sacred-gradient shadow-lg hover:shadow-xl hover:scale-105"
                }`}
              >
                {/* Pulse ring when recording */}
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-destructive"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {isSpeaking && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-saffron"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}

                {isLoading ? (
                  <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-8 h-8 text-accent-foreground" />
                ) : isSpeaking ? (
                  <Volume2 className="w-8 h-8 text-accent-foreground" />
                ) : (
                  <Mic className="w-8 h-8 text-accent-foreground" />
                )}
              </motion.button>

              <p className="text-xs text-muted-foreground/60 font-sans">
                {isRecording ? "Tap to stop" : isSpeaking ? "Tap to stop" : isLoading ? "Please wait..." : "Tap to speak"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
