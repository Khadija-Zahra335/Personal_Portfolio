"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { Download, ExternalLink, Loader2, LogOut, RotateCcw, Save } from "lucide-react";
import { getFirebaseApp } from "@/lib/firebase";
import { CONTENT_COLLECTION, CONTENT_DOC, mergeContent, parseContentJson } from "@/lib/content";
import { defaultContent, type SiteContent } from "@/data/site";
import JsonField from "./JsonField";
import { humanize, setIn, type Path } from "./utils";

const TABS: { label: string; keys: (keyof SiteContent)[] }[] = [
  { label: "Hero & Profile", keys: ["profile", "heroChips", "navLinks"] },
  { label: "Projects", keys: ["projectsSection", "projects"] },
  { label: "About", keys: ["about", "experienceStrip"] },
  { label: "Tech Stack", keys: ["techSection", "techStack"] },
  { label: "Education", keys: ["educationSection", "academics", "certifications"] },
  { label: "Contact & Footer", keys: ["contactSection", "footer"] },
];

const MAX_BYTES = 1_000_000; // Firestore document limit

type Status = { type: "idle" | "saving" | "ok" | "error"; msg?: string };

function RawJson({ content, onApply }: { content: SiteContent; onApply: (c: SiteContent) => void }) {
  const [text, setText] = useState(() => JSON.stringify(content, null, 2));
  const [err, setErr] = useState("");

  const download = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-text-turnery">
        Advanced: edit everything as JSON, or paste a backup. Click Apply, then Save &amp; Publish.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="min-h-[60vh] w-full rounded-lg border border-border/60 bg-tgc/60 p-3 font-mono text-xs focus:border-highlight focus:outline-none"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="cursor-pointer rounded-full bg-tgc px-5 py-2 text-sm hover:bg-tgc/80"
          onClick={() => {
            const parsed = parseContentJson(text);
            if (!parsed) return setErr("Invalid JSON.");
            setErr("");
            onApply(mergeContent(parsed));
          }}
        >
          Apply
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:bg-white/5"
        >
          <Download className="size-4" /> Download backup
        </button>
        {err && <span className="text-sm text-red-300">{err}</span>}
      </div>
    </div>
  );
}

export default function Editor({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const db = useMemo(() => getFirestore(getFirebaseApp()), []);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState("");
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  // Load current content
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, CONTENT_COLLECTION, CONTENT_DOC));
        const merged = mergeContent(parseContentJson(snap.get("json")));
        setContent(merged);
        setSaved(snap.exists() ? JSON.stringify(merged) : "");
      } catch {
        setContent(defaultContent);
        setStatus({ type: "error", msg: "Couldn't load saved content. Showing defaults." });
      }
    })();
  }, [db]);

  const json = content ? JSON.stringify(content) : "";
  const dirty = content !== null && json !== saved;
  const bytes = useMemo(() => new Blob([json]).size, [json]);

  async function save() {
    if (!content) return;
    if (bytes > MAX_BYTES) {
      setStatus({ type: "error", msg: "Content is over 1 MB — remove or replace some uploaded images." });
      return;
    }
    setStatus({ type: "saving" });
    try {
      await setDoc(doc(db, CONTENT_COLLECTION, CONTENT_DOC), {
        json,
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
      setSaved(json);
      setStatus({ type: "ok", msg: "Published! The site updates live." });
    } catch (err) {
      const code = String((err as { code?: string }).code ?? "");
      setStatus({
        type: "error",
        msg: code.includes("permission") ? "Permission denied — check the Firestore rules." : "Save failed. Try again.",
      });
    }
  }

  // Ctrl/Cmd + S to save, warn on unsaved changes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  });

  const update = (path: Path, value: unknown) =>
    setContent((c) => (c ? (setIn(c, path, value) as SiteContent) : c));

  const resetTab = () => {
    if (!content || tab >= TABS.length) return;
    if (!confirm(`Reset "${TABS[tab].label}" to the default content from site.ts?`)) return;
    const next = { ...content } as Record<string, unknown>;
    for (const k of TABS[tab].keys) next[k] = defaultContent[k];
    setContent(next as SiteContent);
  };

  if (!content) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-8 animate-spin text-highlight" />
      </div>
    );
  }

  const pct = Math.min(100, Math.round((bytes / MAX_BYTES) * 100));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      {/* Top bar */}
      <header className="sticky top-4 z-20 mb-6 rounded-2xl border border-highlight/10 bg-fgc/70 p-4 backdrop-blur-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Portfolio Admin</h1>
            <p className="text-xs text-text-turnery">Signed in as {user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5"
            >
              <ExternalLink className="size-4" /> View site
            </a>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || status.type === "saving"}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-highlight px-5 py-2 text-sm font-semibold text-tgc transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status.type === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save &amp; Publish
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="cursor-pointer rounded-full p-2 hover:bg-white/10"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className={dirty ? "text-highlight" : "text-text-turnery"}>
            {dirty ? "● Unsaved changes" : "All changes published"}
            {status.msg && (
              <span className={`ml-3 ${status.type === "error" ? "text-red-300" : "text-highlight"}`}>{status.msg}</span>
            )}
          </span>
          <span className="flex items-center gap-2 text-text-turnery">
            Storage {Math.round(bytes / 1024)} KB / 1 MB
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-tgc">
              <span
                className={`block h-full ${pct > 85 ? "bg-red-400" : "bg-highlight"}`}
                style={{ width: `${pct}%` }}
              />
            </span>
          </span>
        </div>

        {/* Tabs */}
        <nav className="mt-4 flex gap-1 overflow-x-auto">
          {[...TABS.map((t) => t.label), "JSON"].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setTab(i)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition ${
                tab === i ? "bg-tgc text-text" : "text-text-secondary hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Body */}
      {tab < TABS.length ? (
        <div className="flex flex-col gap-6">
          {TABS[tab].keys.map((key) => (
            <section key={key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
              <h2 className="mb-4 text-base font-semibold text-highlight">{humanize(key)}</h2>
              <JsonField value={content[key]} path={[key]} onChange={update} />
            </section>
          ))}
          <button
            type="button"
            onClick={resetTab}
            className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm text-text-turnery hover:text-text"
          >
            <RotateCcw className="size-4" /> Reset this tab to defaults
          </button>
        </div>
      ) : (
        <RawJson key={saved} content={content} onApply={setContent} />
      )}
    </div>
  );
}