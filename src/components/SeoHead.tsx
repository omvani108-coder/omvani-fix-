import { useEffect } from "react";

interface SeoHeadProps {
  title?:         string;
  description?:   string;
  canonicalPath?: string;
}

const SITE_NAME          = "OmVani";
const BASE_URL           = "https://omvani.app"; // ← update when you have your real domain
const DEFAULT_DESCRIPTION =
  "Talk to a spiritual guru anytime, in your language. 100% scripture-based answers from the Bhagavad Gita, Vedas & Puranas — powered by AI.";
const OG_IMAGE = `${BASE_URL}/og-cover.jpg`;     // ← add a 1200×630px image to /public

export function SeoHead({
  title         = SITE_NAME,
  description   = DEFAULT_DESCRIPTION,
  canonicalPath = "/",
}: SeoHeadProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const canonical = `${BASE_URL}${canonicalPath}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (selector: string, attrKey: string, attrValue: string, contentValue: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      el.setAttribute(attrKey, attrValue);
      el.setAttribute("content", contentValue);
    };

    // Standard
    setMeta('meta[name="description"]',          "name",     "description",   description);

    // Open Graph
    setMeta('meta[property="og:title"]',         "property", "og:title",      fullTitle);
    setMeta('meta[property="og:description"]',   "property", "og:description",description);
    setMeta('meta[property="og:type"]',          "property", "og:type",       "website");
    setMeta('meta[property="og:url"]',           "property", "og:url",        canonical);
    setMeta('meta[property="og:image"]',         "property", "og:image",      OG_IMAGE);
    setMeta('meta[property="og:site_name"]',     "property", "og:site_name",  SITE_NAME);

    // Twitter Card
    setMeta('meta[name="twitter:card"]',         "name", "twitter:card",        "summary_large_image");
    setMeta('meta[name="twitter:title"]',        "name", "twitter:title",       fullTitle);
    setMeta('meta[name="twitter:description"]',  "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]',        "name", "twitter:image",       OG_IMAGE);

    // Canonical link tag
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [fullTitle, description, canonical]);

  return null;
}
