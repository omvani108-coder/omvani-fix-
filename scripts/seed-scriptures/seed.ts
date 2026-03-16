/**
 * seed.ts — Seed scripture data into Supabase
 *
 * Usage:
 *   npx tsx scripts/seed-scriptures/seed.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 * (or a .env file in the project root).
 */

import { createClient } from "@supabase/supabase-js";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from project root (optional — env vars can be passed directly)
try {
  const envPath = path.resolve(__dirname, "../../.env");
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
} catch {
  // .env not found — rely on env vars passed directly
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Missing env vars. Set VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Discover seed files ─────────────────────────────────────────────────────

interface SeedModule {
  scripture: Record<string, unknown>;
  chapters: Record<string, unknown>[];
  verses: Record<string, unknown>[];
}

async function loadSeedFiles(): Promise<SeedModule[]> {
  const dir = __dirname;
  const files = fs.readdirSync(dir).filter(
    (f) => /^\d{2}-/.test(f) && f.endsWith(".ts")
  );
  files.sort();

  const modules: SeedModule[] = [];
  for (const file of files) {
    const mod = await import(path.join(dir, file));
    modules.push({
      scripture: mod.scripture,
      chapters: mod.chapters,
      verses: mod.verses,
    });
  }
  return modules;
}

// ── Upsert helpers ──────────────────────────────────────────────────────────

async function upsertScripture(data: Record<string, unknown>) {
  const { error } = await supabase
    .from("scriptures")
    .upsert(data, { onConflict: "id" });
  if (error) throw new Error(`scriptures upsert failed: ${error.message}`);
}

async function upsertChapters(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  // Batch in groups of 100
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase
      .from("scripture_chapters")
      .upsert(batch, { onConflict: "id" });
    if (error) throw new Error(`scripture_chapters upsert failed: ${error.message}`);
  }
}

async function upsertVerses(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  // Batch in groups of 100
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase
      .from("scripture_verses")
      .upsert(batch, { onConflict: "id" });
    if (error) throw new Error(`scripture_verses upsert failed: ${error.message}`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Loading seed files...");
  const modules = await loadSeedFiles();
  console.log(`Found ${modules.length} scripture(s) to seed.\n`);

  let totalVerses = 0;

  for (const mod of modules) {
    const name = (mod.scripture as { name?: string }).name ?? "Unknown";
    const id = (mod.scripture as { id?: string }).id ?? "unknown";

    process.stdout.write(`  ${name} (${id})...`);

    try {
      await upsertScripture(mod.scripture);
      await upsertChapters(mod.chapters);
      await upsertVerses(mod.verses);
      totalVerses += mod.verses.length;
      console.log(
        ` ${mod.chapters.length} chapter(s), ${mod.verses.length} verse(s) ✓`
      );
    } catch (err) {
      console.log(` FAILED`);
      console.error(`    Error: ${(err as Error).message}`);
    }
  }

  console.log(`\nDone! Seeded ${totalVerses} total verses across ${modules.length} scripture(s).`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
