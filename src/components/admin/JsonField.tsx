"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { blankLike, compressImage, humanize, type Path } from "./utils";

const HINTS: Record<string, string> = {
  "projects.icon": "One of: users, bot, utensils, hammer, pill",
  "projects.image": "Upload a screenshot (16:9 works best), or paste a /path or URL",
  "techStack.icon": "One of: monitor, server, database, brain, code, wrench",
  "techStack.items.icon": "Simple Icons slug (simpleicons.org), e.g. react — empty shows initials",
  "techStack.items.color": "Optional logo color, e.g. white",
  "about.resumeUrl": "e.g. /resume/Khadija_Zahra_Resume.pdf or any URL",
  heroChips: "Emoji + label, e.g. ⚛️ React",
  "profile.linkedin": "Full URL, e.g. https://www.linkedin.com/in/...",
};

const LONG_KEYS = new Set(["intro", "text", "subtitle", "tagline", "currently", "desc", "cardHeading", "paragraphs"]);

const inputCls =
  "w-full rounded-lg border border-border/60 bg-tgc/60 px-3 py-2 text-sm text-text placeholder:text-text-turnery focus:border-highlight focus:outline-none";

function hintFor(path: Path) {
  return HINTS[path.filter((p) => typeof p === "string").join(".")];
}

function lastKey(path: Path): string {
  for (let i = path.length - 1; i >= 0; i--) if (typeof path[i] === "string") return path[i] as string;
  return "";
}

function itemTitle(v: unknown, i: number) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    const t = o.title ?? o.name ?? o.role ?? o.label ?? o.value;
    if (typeof t === "string" && t) return t;
  }
  return `Item ${i + 1}`;
}

/* ---------- Image ---------- */
function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await compressImage(file));
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-28 w-auto rounded-lg border border-border/60 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 grid size-6 cursor-pointer place-items-center rounded-full bg-tgc"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={value.startsWith("data:") ? "(uploaded image)" : value}
          readOnly={value.startsWith("data:")}
          placeholder="/projects/screenshot.png or https://..."
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-tgc px-3 text-sm hover:bg-tgc/80"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Upload
        </button>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}

/* ---------- Generic field ---------- */
export default function JsonField({
  value,
  path,
  onChange,
  label,
}: {
  value: unknown;
  path: Path;
  onChange: (path: Path, value: unknown) => void;
  label?: string;
}) {
  const key = lastKey(path);
  const hint = hintFor(path);
  const set = (v: unknown) => onChange(path, v);

  const Label = label ? (
    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-turnery">{label}</span>
  ) : null;
  const Hint = hint ? <span className="mt-1 block text-xs text-text-turnery/80">{hint}</span> : null;

  // Strings
  if (typeof value === "string") {
    if (key === "image") {
      return (
        <label className="block">
          {Label}
          <ImageField value={value} onChange={set} />
          {Hint}
        </label>
      );
    }
    const long = LONG_KEYS.has(key) || value.length > 70 || value.includes("\n");
    return (
      <label className="block">
        {Label}
        {long ? (
          <textarea className={`${inputCls} min-h-24 resize-y`} value={value} onChange={(e) => set(e.target.value)} />
        ) : (
          <input className={inputCls} value={value} onChange={(e) => set(e.target.value)} />
        )}
        {Hint}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        {Label}
        <input type="number" className={inputCls} value={value} onChange={(e) => set(Number(e.target.value))} />
        {Hint}
      </label>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} />
        {label}
      </label>
    );
  }

  // Arrays
  if (Array.isArray(value)) {
    const primitive = value.length === 0 || typeof value[0] !== "object";
    const move = (from: number, to: number) => {
      if (to < 0 || to >= value.length) return;
      const copy = [...value];
      const [it] = copy.splice(from, 1);
      copy.splice(to, 0, it);
      set(copy);
    };
    const remove = (i: number) => set(value.filter((_, idx) => idx !== i));
    const add = () => set([...value, value.length ? blankLike(value[value.length - 1]) : ""]);

    const Controls = ({ i }: { i: number }) => (
      <div className="flex shrink-0 gap-1">
        <button type="button" onClick={() => move(i, i - 1)} className="cursor-pointer rounded p-1 hover:bg-white/10" aria-label="Move up">
          <ArrowUp className="size-4" />
        </button>
        <button type="button" onClick={() => move(i, i + 1)} className="cursor-pointer rounded p-1 hover:bg-white/10" aria-label="Move down">
          <ArrowDown className="size-4" />
        </button>
        <button type="button" onClick={() => remove(i)} className="cursor-pointer rounded p-1 text-red-300 hover:bg-red-500/20" aria-label="Delete">
          <Trash2 className="size-4" />
        </button>
      </div>
    );

    return (
      <div>
        {Label}
        {Hint}
        <div className="mt-2 flex flex-col gap-2">
          {value.map((item, i) =>
            primitive ? (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <JsonField value={item} path={[...path, i]} onChange={onChange} />
                </div>
                <Controls i={i} />
              </div>
            ) : (
              <details key={i} className="group rounded-xl border border-border/50 bg-white/[0.03]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3">
                  <span className="flex items-center gap-2 font-medium">
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                    {itemTitle(item, i)}
                  </span>
                  <Controls i={i} />
                </summary>
                <div className="border-t border-border/40 p-4">
                  <JsonField value={item} path={[...path, i]} onChange={onChange} />
                </div>
              </details>
            )
          )}
        </div>
        <button
          type="button"
          onClick={add}
          className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-text-secondary hover:border-highlight hover:text-text"
        >
          <Plus className="size-4" /> Add {label ? label.replace(/s$/, "").toLowerCase() : "item"}
        </button>
      </div>
    );
  }

  // Objects
  if (value && typeof value === "object") {
    return (
      <div>
        {Label}
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => {
            const wide = typeof v === "object" || LONG_KEYS.has(k) || (typeof v === "string" && v.length > 70) || k === "image";
            return (
              <div key={k} className={wide ? "md:col-span-2" : ""}>
                <JsonField value={v} path={[...path, k]} onChange={onChange} label={humanize(k)} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}