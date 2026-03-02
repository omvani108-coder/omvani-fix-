/**
 * OmVani — Icon & OG Image Generator
 *
 * Run: npx ts-node scripts/generate-icons.js
 * OR:  node scripts/generate-icons.js  (after installing `canvas`)
 *
 * This generates:
 *   public/icons/icon-192.png
 *   public/icons/icon-512.png
 *   public/icons/icon-512-maskable.png
 *   public/og-cover.jpg
 *
 * Requires: npm install canvas
 *
 * For production, replace these with professionally designed assets.
 */

const fs = require("fs");
const path = require("path");

let createCanvas;
try {
  ({ createCanvas } = require("canvas"));
} catch {
  console.log("⚠️  'canvas' package not installed.");
  console.log("   Run: npm install --save-dev canvas");
  console.log("   Then re-run this script.");
  console.log("");
  console.log("   For now, using the SVG icon as fallback.");
  process.exit(0);
}

function drawIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#e07b20");
  grad.addColorStop(1, "#d4a537");

  if (maskable) {
    // Maskable icons need the full rectangle filled
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  } else {
    // Regular icon with rounded corners
    const r = size * 0.2;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, r);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // OM symbol
  ctx.fillStyle = "white";
  ctx.font = `bold ${size * 0.52}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = size * 0.03;
  ctx.fillText("\u0950", size / 2, size / 2 + size * 0.04);

  return canvas.toBuffer("image/png");
}

function drawOGCover() {
  const w = 1200, h = 630;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");

  // Dark temple background
  ctx.fillStyle = "#1a0a00";
  ctx.fillRect(0, 0, w, h);

  // Saffron-gold gradient overlay
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "rgba(224, 123, 32, 0.15)");
  grad.addColorStop(1, "rgba(212, 165, 55, 0.1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // OM symbol (large, faded)
  ctx.fillStyle = "rgba(224, 123, 32, 0.08)";
  ctx.font = "bold 400px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("\u0950", w / 2, h / 2);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px serif";
  ctx.textAlign = "center";
  ctx.fillText("\u0950Vani", w / 2, h / 2 - 40);

  // Subtitle
  ctx.fillStyle = "rgba(212, 165, 55, 0.9)";
  ctx.font = "32px sans-serif";
  ctx.fillText("AI Spiritual Companion", w / 2, h / 2 + 30);

  // Tagline
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "22px sans-serif";
  ctx.fillText("Ancient wisdom meets modern AI", w / 2, h / 2 + 80);

  return canvas.toBuffer("image/jpeg", { quality: 0.9 });
}

// Generate
const iconsDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, "icon-192.png"), drawIcon(192));
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), drawIcon(512));
fs.writeFileSync(path.join(iconsDir, "icon-512-maskable.png"), drawIcon(512, true));
fs.writeFileSync(path.join(__dirname, "..", "public", "og-cover.jpg"), drawOGCover());

console.log("✅ Generated:");
console.log("   public/icons/icon-192.png");
console.log("   public/icons/icon-512.png");
console.log("   public/icons/icon-512-maskable.png");
console.log("   public/og-cover.jpg");
