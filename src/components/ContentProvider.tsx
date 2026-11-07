"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { SiteContent } from "@/data/site";
import { CONTENT_COLLECTION, CONTENT_DOC, mergeContent, parseContentJson } from "@/lib/content";

const ContentContext = createContext<SiteContent | null>(null);

export function useContent(): SiteContent {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

export default function ContentProvider({
  initial,
  children,
}: {
  initial: SiteContent;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(initial);

  // Live updates: re-render instantly when the admin publishes
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        const [{ getFirebaseApp, isFirebaseConfigured }, { doc, getFirestore, onSnapshot }] = await Promise.all([
          import("@/lib/firebase"),
          import("firebase/firestore"),
        ]);
        if (cancelled || !isFirebaseConfigured) return;
        unsub = onSnapshot(
          doc(getFirestore(getFirebaseApp()), CONTENT_COLLECTION, CONTENT_DOC),
          (snap) => {
            const parsed = parseContentJson(snap.get("json"));
            if (parsed) setContent(mergeContent(parsed));
          },
          () => {} // stay on server-rendered content if the listener fails
        );
      } catch {}
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  // Ctrl + Shift + A opens the admin panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        window.location.href = "/admin";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}