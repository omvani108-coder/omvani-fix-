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

// ── Deity sacred art palettes ─────────────────────────────────────────────────
// Each deity has a curated sacred colour palette used to generate
// a beautiful mandala/yantra canvas background — no external images needed.

interface DeityPalette {
  primary:    string;
  secondary:  string;
  accent:     string;
  symbol:     string;
  glow:       string;
  petals:     number;
}

const DEITY_PALETTES: Record<string, DeityPalette> = {
  Krishna:   { primary: "#1B3A8A", secondary: "#F97316", accent: "#FFD700", symbol: "ॐ", glow: "rgba(99,165,255,0.45)",  petals: 16 },
  Shiva:     { primary: "#2D1040", secondary: "#C084FC", accent: "#E2E8F0", symbol: "ॐ", glow: "rgba(192,132,252,0.4)", petals: 12 },
  Ganesha:   { primary: "#7C2D12", secondary: "#F97316", accent: "#FCD34D", symbol: "ॐ", glow: "rgba(251,191,36,0.4)",  petals: 8  },
  Durga:     { primary: "#7F1D1D", secondary: "#F43F5E", accent: "#FCD34D", symbol: "ॐ", glow: "rgba(244,63,94,0.4)",   petals: 10 },
  Rama:      { primary: "#14532D", secondary: "#4ADE80", accent: "#FCD34D", symbol: "ॐ", glow: "rgba(74,222,128,0.35)", petals: 12 },
  Hanuman:   { primary: "#7C2D12", secondary: "#F97316", accent: "#EF4444", symbol: "ॐ", glow: "rgba(249,115,22,0.4)",  petals: 8  },
  Lakshmi:   { primary: "#701A75", secondary: "#E879F9", accent: "#FCD34D", symbol: "ॐ", glow: "rgba(232,121,249,0.4)", petals: 16 },
  Saraswati: { primary: "#0C4A6E", secondary: "#38BDF8", accent: "#FFFFFF", symbol: "ॐ", glow: "rgba(56,189,248,0.4)",  petals: 12 },
  Vishnu:    { primary: "#0F172A", secondary: "#6366F1", accent: "#FCD34D", symbol: "ॐ", glow: "rgba(99,102,241,0.4)",  petals: 16 },
};

const DEFAULT_PALETTE: DeityPalette = {
  primary: "#1A0A00", secondary: "#F97316", accent: "#FCD34D",
  symbol: "ॐ", glow: "rgba(249,115,22,0.4)", petals: 12,
};

// ── AI-generated sacred canvas background ────────────────────────────────────
// Generates a stunning mandala/yantra art canvas using the deity's palette.
// No external image dependencies — works offline, loads instantly.

function generateSacredCanvas(deity: string, size: number = 1080): string {
  const palette = DEITY_PALETTES[deity] ?? DEFAULT_PALETTE;
  const canvas  = document.createElement("canvas");
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;

  // ── Deep background gradient ──────────────────────────────────────────────
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.75);
  bgGrad.addColorStop(0,   shadeHex(palette.primary, 40));
  bgGrad.addColorStop(0.5, palette.primary);
  bgGrad.addColorStop(1,   shadeHex(palette.primary, -30));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // ── Outer glow halo ───────────────────────────────────────────────────────
  const halo = ctx.createRadialGradient(cx, cy, size * 0.1, cx, cy, size * 0.55);
  halo.addColorStop(0,   palette.glow);
  halo.addColorStop(0.6, palette.glow.replace("0.4", "0.12").replace("0.35", "0.08").replace("0.45", "0.15"));
  halo.addColorStop(1,   "transparent");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  // ── Lotus petals (outer ring) ──────────────────────────────────────────────
  const outerR  = size * 0.38;
  const petalW  = (Math.PI * 2) / palette.petals;
  ctx.save();
  for (let i = 0; i < palette.petals; i++) {
    const angle = i * petalW - Math.PI / 2;
    const px = cx + outerR * Math.cos(angle);
    const py = cy + outerR * Math.sin(angle);
    ctx.beginPath();
    ctx.ellipse(px, py, outerR * 0.18, outerR * 0.32, angle + Math.PI / 2, 0, Math.PI * 2);
    const petalGrad = ctx.createRadialGradient(px, py, 0, px, py, outerR * 0.3);
    petalGrad.addColorStop(0, hexToRgba(palette.secondary, 0.55));
    petalGrad.addColorStop(1, hexToRgba(palette.secondary, 0.08));
    ctx.fillStyle = petalGrad;
    ctx.fill();
    ctx.strokeStyle = hexToRgba(palette.accent, 0.3);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // ── Inner lotus petals ────────────────────────────────────────────────────
  const innerR = size * 0.21;
  const innerPetals = Math.max(8, Math.floor(palette.petals / 2));
  for (let i = 0; i < innerPetals; i++) {
    const angle = i * (Math.PI * 2 / innerPetals) - Math.PI / 2;
    const px = cx + innerR * Math.cos(angle);
    const py = cy + innerR * Math.sin(angle);
    ctx.beginPath();
    ctx.ellipse(px, py, innerR * 0.2, innerR * 0.38, angle + Math.PI / 2, 0, Math.PI * 2);
    const ipGrad = ctx.createRadialGradient(px, py, 0, px, py, innerR * 0.35);
    ipGrad.addColorStop(0, hexToRgba(palette.accent, 0.45));
    ipGrad.addColorStop(1, hexToRgba(palette.accent, 0.05));
    ctx.fillStyle = ipGrad;
    ctx.fill();
  }

  // ── Geometric rings ───────────────────────────────────────────────────────
  [0.42, 0.32, 0.22, 0.13].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, size * r, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(palette.accent, [0.35, 0.25, 0.4, 0.2][i]);
    ctx.lineWidth   = [2.5, 1.5, 2, 1][i];
    ctx.stroke();
  });

  // ── Star of triangles (yantra) ────────────────────────────────────────────
  const triR = size * 0.16;
  ctx.save();
  for (let t = 0; t < 2; t++) {
    ctx.beginPath();
    for (let j = 0; j < 3; j++) {
      const a = (j * Math.PI * 2) / 3 + (t === 0 ? -Math.PI / 2 : Math.PI / 6);
      const tx = cx + triR * Math.cos(a);
      const ty = cy + triR * Math.sin(a);
      j === 0 ? ctx.moveTo(tx, ty) : ctx.lineTo(tx, ty);
    }
    ctx.closePath();
    ctx.strokeStyle = hexToRgba(palette.accent, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = hexToRgba(t === 0 ? palette.secondary : palette.accent, 0.08);
    ctx.fill();
  }
  ctx.restore();

  // ── Dot mandala ring ──────────────────────────────────────────────────────
  const dotRing = size * 0.36;
  const dotCount = palette.petals * 2;
  for (let d = 0; d < dotCount; d++) {
    const a = (d / dotCount) * Math.PI * 2;
    const dx = cx + dotRing * Math.cos(a);
    const dy = cy + dotRing * Math.sin(a);
    ctx.beginPath();
    ctx.arc(dx, dy, d % 2 === 0 ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(palette.accent, d % 2 === 0 ? 0.7 : 0.4);
    ctx.fill();
  }

  // ── Central OM symbol ─────────────────────────────────────────────────────
  const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.1);
  centerGlow.addColorStop(0, hexToRgba(palette.accent, 0.4));
  centerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = centerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.font      = `bold ${size * 0.11}px serif`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor  = palette.glow;
  ctx.shadowBlur   = size * 0.04;
  ctx.fillText("ॐ", cx, cy);
  ctx.shadowBlur   = 0;

  // ── Subtle noise texture overlay ──────────────────────────────────────────
  ctx.globalAlpha = 0.04;
  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      if (Math.random() > 0.5) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }
  ctx.globalAlpha = 1;

  return canvas.toDataURL("image/jpeg", 0.94);
}

// ── Colour helpers ────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function shadeHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ── Image generation entry point ──────────────────────────────────────────────

async function generateDeityImage(deity: string, _youtubeId?: string): Promise<string> {
  // Tiny artificial delay so the "Generating…" state shows briefly
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));
  return generateSacredCanvas(deity);
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
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border shadow-sacred bg-[#0D0A07]">
      {/* Sacred mandala background art */}
      {imageUrl && !isLoading && (
        <img
          src={imageUrl}
          alt={`Sacred art for ${title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Vignette overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      {/* Saffron gold border bars */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, #FF6B00, #FFD700, #FF6B00)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, #FF6B00, #FFD700, #FF6B00)" }}
      />

      {/* Text content — sits over the mandala art */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center gap-2.5">
        <p
          className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase"
          style={{ color: "#FFD700", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
        >
          {title}
        </p>
        {sanskrit && (
          <p
            className="font-serif text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.96)", textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}
          >
            {sanskrit}
          </p>
        )}
        {sanskrit && (
          <div className="w-12 h-px" style={{ background: "linear-gradient(90deg,transparent,#FFD700,transparent)" }} />
        )}
        <p
          className="font-sans text-xs leading-relaxed max-w-[200px]"
          style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
        >
          {translation}
        </p>
        <p
          className="font-serif text-[9px] mt-1"
          style={{ color: "rgba(255,200,80,0.75)", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
        >
          ॐVani · Your Spiritual Companion
        </p>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0D0A07] flex flex-col items-center justify-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full border-2 border-saffron/30 animate-ping" />
            <div className="absolute w-12 h-12 rounded-full border border-saffron/50 animate-pulse" />
            <span className="text-3xl font-serif text-saffron animate-pulse">ॐ</span>
          </div>
          <p className="text-white/70 font-sans text-[11px] tracking-[0.2em] uppercase">Crafting Sacred Art…</p>
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
      const shareData: ShareData = { title: `ॐVani — ${title}`, text: shareText, url: "https://omvani.in" };
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
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
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
