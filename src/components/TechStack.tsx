"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { useContent } from "@/components/ContentProvider";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "item"; name: string; desc: string }
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "error"; text: string }
  | { kind: "success"; text: string };

/** "AI / LLM Engineering" -> "ai", "Tools & Platforms" -> "tools" */
const toKey = (title: string) => title.split(/[\s/&]+/)[0].toLowerCase();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The terminal keeps its own dark look on every palette; only the accent follows the theme
const C = {
  bg: "#071a21",
  bar: "#0d252e",
  text: "#e6edf3",
  dim: "#8b98a5",
  prompt: "#28c840",
  error: "#ff7b72",
};

export default function TechStack() {
  const { techSection, techStack, profile } = useContent();

  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [reduced, setReduced] = useState(false);

  const runId = useRef(0);
  const started = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = techStack.map((c) => ({ key: toKey(c.title), ...c }));

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Keep the latest output in view
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  /** Turns a command into output lines. Returns null for "clear". */
  const execute = useCallback(
    (raw: string): { out: Line[]; key?: string } | null => {
      const cmd = raw.trim().toLowerCase();
      const arg = cmd.replace(/^khadija\s+--stack\s*/, "").replace(/^khadija\s*/, "").trim();

      if (cmd === "clear") return null;

      if (cmd === "help" || cmd === "khadija" || cmd === "khadija --help" || arg === "") {
        return {
          out: [
            { kind: "text", text: "Available commands:" },
            ...categories.map((c) => ({ kind: "item" as const, name: c.key, desc: c.title })),
            { kind: "item", name: "all", desc: "Everything at once" },
            { kind: "item", name: "whoami", desc: "Who's behind this terminal" },
            { kind: "item", name: "clear", desc: "Clear the screen" },
          ],
        };
      }

      if (arg === "ls") {
        return {
          out: categories.map((c) => ({
            kind: "item" as const,
            name: c.key + "/",
            desc: `${c.items.length} tools`,
          })),
        };
      }

      if (arg === "whoami") {
        return {
          out: [
            { kind: "success", text: `${profile.firstName} ${profile.lastName}` },
            { kind: "text", text: profile.role },
          ],
        };
      }

      if (arg === "all") {
        const out: Line[] = [];
        categories.forEach((c) => {
          out.push({ kind: "heading", text: `# ${c.title}` });
          c.items.forEach((it) => out.push({ kind: "item", name: it.name, desc: it.desc }));
        });
        const total = categories.reduce((n, c) => n + c.items.length, 0);
        out.push({ kind: "success", text: `${total} tools loaded.` });
        return { out, key: "all" };
      }

      const match = categories.find((c) => c.key === arg);
      if (match) {
        return {
          out: [
            ...match.items.map((it) => ({ kind: "item" as const, name: it.name, desc: it.desc })),
            { kind: "success", text: `${match.items.length} tools loaded.` },
          ],
          key: match.key,
        };
      }

      return { out: [{ kind: "error", text: `command not found: ${arg}. Type "help" to see what you can run.` }] };
    },
    [categories, profile]
  );

  /** Types the command (optionally), then prints its output line by line */
  const run = useCallback(
    async (command: string, opts: { typed?: boolean; fresh?: boolean } = {}) => {
      const { typed = true, fresh = true } = opts;
      const id = ++runId.current;
      const alive = () => runId.current === id;

      if (fresh) setLines([]);

      if (typed && !reduced) {
        for (let i = 1; i <= command.length; i++) {
          if (!alive()) return;
          setTyping(command.slice(0, i));
          await sleep(40);
        }
        await sleep(180);
      }
      if (!alive()) return;
      setTyping("");

      const result = execute(command);
      if (result === null) {
        setLines([]);
        setActive(null);
        return;
      }

      setLines((l) => [...l, { kind: "cmd", text: command }]);
      if (result.key) setActive(result.key);

      for (const line of result.out) {
        if (!alive()) return;
        setLines((l) => [...l, line]);
        if (!reduced) await sleep(line.kind === "item" ? 110 : 60);
      }
    },
    [execute, reduced]
  );

  // Auto-run the first category when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || categories.length === 0) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          run(`khadija --stack ${categories[0].key}`);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [categories, run]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    setInput("");
    run(cmd, { typed: false, fresh: false });
  }

  const tabs = [...categories.map((c) => c.key), "all"];

  return (
    <section id="skills" className="container-site relative scroll-mt-16 px-5 py-10 md:py-16 xl:px-0">
      <SectionHeading badge={techSection.badge} title={techSection.title} subtitle={techSection.subtitle} />

      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
className="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 font-mono shadow-[0_30px_60px_rgba(0,0,0,0.45)] md:mt-10 md:rounded-3xl"        style={{ backgroundColor: C.bg }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Window bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: C.bar }}>
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="mx-auto pr-10 text-xs" style={{ color: C.dim }}>
            {profile.firstName.toLowerCase()}@portfolio: ~
          </span>
        </div>

        {/* Tabs */}
        <div role="tablist" className="flex flex-wrap gap-1 px-3 pt-3" style={{ backgroundColor: C.bar }}>
          {tabs.map((key) => {
            const selected = active === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={(e) => {
                  e.stopPropagation();
                  run(`khadija --stack ${key}`);
                }}
                className="cursor-pointer rounded-t-lg border border-b-0 px-3 py-1.5 text-xs transition-colors md:text-sm"
                style={{
                  color: selected ? "var(--color-highlight)" : C.dim,
                  borderColor: selected ? "rgba(255,255,255,0.1)" : "transparent",
                  backgroundColor: selected ? C.bg : "transparent",
                }}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Output */}
        <div
          ref={bodyRef}
          aria-live="polite"
className="h-[400px] overflow-y-auto px-5 py-5 text-[13px] leading-7 md:h-[460px] md:px-8 md:py-6 md:text-[15px] md:leading-8 lg:h-[500px] lg:px-10"          style={{ color: C.text }}
        >
          {lines.map((line, i) => {
            switch (line.kind) {
              case "cmd":
                return (
                  <div key={i} className={i > 0 ? "mt-3" : ""}>
                    <span style={{ color: C.prompt }}>$</span> {line.text}
                  </div>
                );
              case "heading":
                return (
                  <div key={i} className="mt-3 font-semibold" style={{ color: "var(--color-highlight)" }}>
                    {line.text}
                  </div>
                );
              case "item":
                return (
                  <div key={i} className="grid grid-cols-[auto_1fr] gap-x-3 md:grid-cols-[auto_14rem_1fr] md:gap-x-4">
                    <span style={{ color: "var(--color-highlight)" }}>✔</span>
                    <span className="font-semibold">{line.name}</span>
                    <span className="col-start-2 md:col-start-3" style={{ color: C.dim }}>
                      {line.desc}
                    </span>
                  </div>
                );
              case "success":
                return (
                  <div key={i} style={{ color: "var(--color-highlight)" }}>
                    {line.text}
                  </div>
                );
              case "error":
                return (
                  <div key={i} style={{ color: C.error }}>
                    {line.text}
                  </div>
                );
              default:
                return (
                  <div key={i} style={{ color: C.dim }}>
                    {line.text}
                  </div>
                );
            }
          })}

          {/* Typing line or live prompt */}
          {typing ? (
            <div className={lines.length ? "mt-3" : ""}>
              <span style={{ color: C.prompt }}>$</span> {typing}
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-caret" style={{ backgroundColor: "var(--color-highlight)" }} />
            </div>
          ) : (
            <form onSubmit={onSubmit} className={`flex items-center gap-2 ${lines.length ? "mt-3" : ""}`}>
              <label htmlFor="terminal-input" style={{ color: C.prompt }}>
                $
              </label>
              <input
                ref={inputRef}
                id="terminal-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='type "help"'
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none placeholder:opacity-40"
                style={{ color: C.text, caretColor: "var(--color-highlight)" }}
              />
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}