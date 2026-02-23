/**
 * DivyaSandeshModal — "Divya Sandesh" (Divine Message) Sharing
 *
 * Shows a preview of a spiritual card (deity image + shlok/bhajan text)
 * and gives the user one-tap sharing options:
 *   • WhatsApp Status
 *   • Send to Contact (WhatsApp)
 *   • Copy text to clipboard
 *   • Native Web Share (fallback)
 *
 * The "deity image" is generated via a mocked AI pipeline —
 * in production swap `generateDeityImage()` for your real image-gen API call.
 *
 * Usage:
 *   <DivyaSandeshModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     type="shloka"              // "shloka" | "bhajan"
 *     title="Bhagavad Gita 2.47"
 *     sanskrit="कर्मण्येवाधिकारस्ते…"
 *     translation="You have the right to perform your duties…"
 *     deity="Krishna"
 *   />
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, MessageCircle, Copy, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DivyaSandeshType = "shloka" | "bhajan";

export interface DivyaSandeshProps {
  open:        boolean;
  onClose:     () => void;
  type:        DivyaSandeshType;
  title:       string;
  /** Sanskrit verse or bhajan title */
  sanskrit?:   string;
  /** English / vernacular translation or meaning */
  translation: string;
  deity:       string;
  /** Optional YouTube ID (for bhajans — we extract a thumbnail) */
  youtubeId?:  string;
}

// ── Mock AI image generation ─────────────────────────────────────────────────
// Replace this stub with your real AI image-gen API (e.g., Stability AI / DALL-E).
// It must resolve to a fully-formed image URL or a base64 data URL.

const DEITY_IMAGE_MAP: Record<string, string> = {
  Krishna:   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Krishna_with_flute.jpg/480px-Krishna_with_flute.jpg",
  Shiva:     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Lord_Shiva_statue.jpg/480px-Lord_Shiva_statue.jpg",
  Ganesha:   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Ganesha_Painted_by_Manaku_c1740.jpg/480px-Ganesha_Painted_by_Manaku_c1740.jpg",
  Durga:     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Goddess_Durga_by_Raja_Ravi_Varma.jpg/480px-Goddess_Durga_by_Raja_Ravi_Varma.jpg",
  Rama:      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Rama_Ravana_war.jpg/480px-Rama_Ravana_war.jpg",
  Hanuman:   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Panchamukhi_Hanuman.jpg/480px-Panchamukhi_Hanuman.jpg",
  Lakshmi:   "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Lakshmi_by_Raja_Ravi_Varma.jpg/480px-Lakshmi_by_Raja_Ravi_Varma.jpg",
  Saraswati: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Saraswati_by_Raja_Ravi_Varma.jpg/480px-Saraswati_by_Raja_Ravi_Varma.jpg",
  Vishnu:    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Vishnu_with_Lakshmi.jpg/480px-Vishnu_with_Lakshmi.jpg",
};

const DEFAULT_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Om_symbol.svg/480px-Om_symbol.svg.png";

async function generateDeityImage(deity: string, _youtubeId?: string): Promise<string> {
  // Simulate a 1-2 second "AI generation" delay
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
  // In production: call your image-gen edge function here
  return DEITY_IMAGE_MAP[deity] ?? DEFAULT_IMAGE;
}

// ── Card preview canvas helper ────────────────────────────────────────────────
// Draws the shloka / bhajan text over the deity image and returns a data URL.
// This data URL is what gets shared.

async function buildCardDataUrl(
  imageUrl: string,
  title:    string,
  sanskrit: string | undefined,
  translation: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width  = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) { reject(new Error("canvas not supported")); return; }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw & darken image
      ctx.drawImage(img, 0, 0, 1080, 1080);
      ctx.fillStyle = "rgba(0,0,0,0.52)";
      ctx.fillRect(0, 0, 1080, 1080);

      // Saffron top bar
      const grad = ctx.createLinearGradient(0, 0, 1080, 0);
      grad.addColorStop(0, "#FF8C00");
      grad.addColorStop(1, "#FFD700");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 6);
      ctx.fillRect(0, 1074, 1080, 6);

      // OM watermark
      ctx.font = "bold 72px serif";
      ctx.fillStyle = "rgba(255,165,0,0.18)";
      ctx.textAlign = "center";
      ctx.fillText("ॐ", 540, 160);

      // Title
      ctx.font = "bold 36px sans-serif";
      ctx.fillStyle = "#FFD700";
      ctx.textAlign = "center";
      ctx.fillText(title, 540, 220);

      // Sanskrit (if present)
      if (sanskrit) {
        ctx.font = "italic 32px serif";
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        const lines = wrapText(ctx, sanskrit, 900, 32);
        let y = 310;
        for (const line of lines) {
          ctx.fillText(line, 540, y);
          y += 50;
        }
        // Divider
        ctx.beginPath();
        ctx.moveTo(390, y + 10);
        ctx.lineTo(690, y + 10);
        ctx.strokeStyle = "rgba(255,165,0,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        y += 40;
        // Translation
        ctx.font = "28px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        const tLines = wrapText(ctx, translation, 900, 28);
        for (const line of tLines) {
          ctx.fillText(line, 540, y);
          y += 42;
        }
      } else {
        // Bhajan — just translation / meaning
        ctx.font = "30px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.90)";
        const tLines = wrapText(ctx, translation, 900, 30);
        let y = 340;
        for (const line of tLines) {
          ctx.fillText(line, 540, y);
          y += 46;
        }
      }

      // OmVani branding
      ctx.font = "bold 28px serif";
      ctx.fillStyle = "rgba(255,165,0,0.7)";
      ctx.fillText("ॐVani · Your Spiritual Companion", 540, 1040);

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => {
      // Fallback: generate a text-only card
      ctx.fillStyle = "#1a0a00";
      ctx.fillRect(0, 0, 1080, 1080);
      const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
      grad.addColorStop(0, "#FF8C00");
      grad.addColorStop(1, "#8B0000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 8);
      ctx.font = "bold 80px serif";
      ctx.fillStyle = "#FF8C00";
      ctx.textAlign = "center";
      ctx.fillText("ॐ", 540, 200);
      ctx.font = "bold 38px sans-serif";
      ctx.fillStyle = "#FFD700";
      ctx.fillText(title, 540, 280);
      if (sanskrit) {
        ctx.font = "italic 32px serif";
        ctx.fillStyle = "#fff";
        wrapText(ctx, sanskrit, 900, 32).forEach((l, i) => ctx.fillText(l, 540, 360 + i * 50));
      }
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = imageUrl;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, _fontSize: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ── ShareCard preview component ───────────────────────────────────────────────

interface ShareCardProps {
  imageUrl:    string;
  title:       string;
  sanskrit?:   string;
  translation: string;
  isLoading:   boolean;
}

function ShareCard({ imageUrl, title, sanskrit, translation, isLoading }: ShareCardProps) {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border shadow-sacred">
      {/* Background image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Deity background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Saffron top + bottom bars */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: "linear-gradient(90deg,#FF8C00,#FFD700)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{ background: "linear-gradient(90deg,#FF8C00,#FFD700)" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center gap-3">
        <span className="text-4xl font-serif font-bold text-saffron/30 leading-none select-none">ॐ</span>
        <p className="text-gold font-sans text-xs font-semibold tracking-widest uppercase">{title}</p>
        {sanskrit && (
          <p className="text-white/95 font-serif text-sm leading-relaxed">{sanskrit}</p>
        )}
        {sanskrit && <div className="w-10 h-px bg-saffron/40" />}
        <p className="text-white/85 font-sans text-xs leading-relaxed max-w-xs">{translation}</p>
        <p className="text-saffron/60 font-serif text-[10px] mt-2">ॐVani · Your Spiritual Companion</p>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-saffron animate-pulse" />
          <p className="text-white font-sans text-xs">Generating divine image…</p>
        </div>
      )}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export function DivyaSandeshModal({
  open, onClose, type,
  title, sanskrit, translation, deity, youtubeId,
}: DivyaSandeshProps) {
  const [imageUrl,  setImageUrl]  = useState("");
  const [cardUrl,   setCardUrl]   = useState("");   // final canvas data URL
  const [loading,   setLoading]   = useState(false);
  const [copying,   setCopying]   = useState(false);
  const [sharing,   setSharing]   = useState(false);
  const generatedRef = useRef(false);

  // Generate the deity image when modal opens
  useEffect(() => {
    if (!open || generatedRef.current) return;
    generatedRef.current = true;

    setLoading(true);
    generateDeityImage(deity, youtubeId)
      .then(async (url) => {
        setImageUrl(url);
        try {
          const dataUrl = await buildCardDataUrl(url, title, sanskrit, translation);
          setCardUrl(dataUrl);
        } catch {
          setCardUrl("");
        }
      })
      .catch(() => setImageUrl(""))
      .finally(() => setLoading(false));
  }, [open]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      generatedRef.current = false;
      setImageUrl("");
      setCardUrl("");
    }
  }, [open]);

  // Build share text
  const shareText = [
    `🙏 ${title}`,
    sanskrit ? `"${sanskrit}"` : "",
    translation,
    "\n— Shared from ॐVani · Your Spiritual Companion",
  ].filter(Boolean).join("\n");

  const whatsappUrl  = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const waContactUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard 🙏");
    } catch {
      toast.error("Could not copy text");
    } finally {
      setTimeout(() => setCopying(false), 1800);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) { toast.error("Sharing not supported on this browser"); return; }
    setSharing(true);
    try {
      const shareData: ShareData = { title: `ॐVani — ${title}`, text: shareText, url: "https://omvani.app" };
      // If we have a canvas URL, convert to Blob for richer sharing
      if (cardUrl) {
        const blob = await (await fetch(cardUrl)).blob();
        const file = new File([blob], "divine-card.jpg", { type: "image/jpeg" });
        if (navigator.canShare?.({ files: [file] })) {
          shareData.files = [file];
        }
      }
      await navigator.share(shareData);
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") {
        toast.error("Sharing failed. Try copying instead.");
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 30,  scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-sacred overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <p className="text-[10px] font-sans tracking-widest uppercase text-saffron font-semibold">
                  ✦ Divya Sandesh
                </p>
                <h2 className="font-serif font-bold text-lg text-foreground leading-tight">
                  Create Divine Status
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card preview */}
            <div className="px-5 pb-4">
              <ShareCard
                imageUrl={imageUrl}
                title={title}
                sanskrit={sanskrit}
                translation={translation}
                isLoading={loading}
              />
            </div>

            {/* Share type badge */}
            <div className="px-5 pb-3">
              <span className={`text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full ${
                type === "shloka"
                  ? "bg-saffron/15 text-saffron"
                  : "bg-lotus-pink/15 text-lotus-pink"
              }`}>
                {type === "shloka" ? "🪔 Shloka Card" : "🎵 Bhajan Card"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="px-5 pb-6 space-y-2.5">
              {/* WhatsApp Status */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#20ba58] text-white rounded-xl px-4 py-3 font-sans font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Share to WhatsApp Status
              </a>

              {/* Send to Contact */}
              <a
                href={waContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-[#128C7E] hover:bg-[#0f7265] text-white rounded-xl px-4 py-3 font-sans font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-5 h-5 opacity-80" />
                Send to a Contact
              </a>

              {/* Copy text / Native share row */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex-1 gap-2 font-sans"
                  disabled={copying}
                >
                  {copying
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Copy className="w-4 h-4" />}
                  {copying ? "Copied!" : "Copy text"}
                </Button>

                {"share" in navigator && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNativeShare}
                    disabled={sharing || loading}
                    className="flex-1 gap-2 font-sans"
                  >
                    {sharing
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Share2 className="w-4 h-4" />}
                    Share
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
