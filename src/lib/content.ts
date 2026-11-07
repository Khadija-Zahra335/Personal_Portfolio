import { defaultContent, type SiteContent } from "@/data/site";

export const CONTENT_COLLECTION = "site";
export const CONTENT_DOC = "portfolio-v2";

/** Overlay saved content on the defaults (new keys added in code still appear). */
export function mergeContent(remote: unknown): SiteContent {
  if (!remote || typeof remote !== "object") return defaultContent;
  const r = remote as Record<string, unknown>;
  const out = { ...defaultContent } as Record<string, unknown>;
  for (const key of Object.keys(defaultContent)) {
    if (r[key] !== undefined && r[key] !== null) out[key] = r[key];
  }
  return out as SiteContent;
}

export function parseContentJson(json: unknown): unknown {
  if (typeof json !== "string") return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Server-side read via Firestore REST (public read). Cached for 60s. */
export async function fetchContent(): Promise<SiteContent> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId) return defaultContent;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${CONTENT_COLLECTION}/${CONTENT_DOC}${
      apiKey ? `?key=${apiKey}` : ""
    }`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return defaultContent;
    const data = await res.json();
    return mergeContent(parseContentJson(data?.fields?.json?.stringValue));
  } catch {
    return defaultContent;
  }
}