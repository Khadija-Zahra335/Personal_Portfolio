"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useContent } from "@/components/ContentProvider";
import { profile as defaultProfile } from "@/data/site";

const LANYARD =
  "repeating-linear-gradient(45deg, var(--color-highlight) 0 6px, color-mix(in oklab, var(--color-highlight) 55%, black) 6px 12px)";

const HOLO =
  "linear-gradient(115deg, transparent 20%, rgba(255,138,244,0.2) 35%, rgba(138,247,255,0.25) 45%, rgba(255,245,154,0.2) 55%, transparent 70%)";

const BAR = "color-mix(in oklab, var(--color-text) 85%, transparent)";
const BARCODE = `repeating-linear-gradient(90deg, ${BAR} 0 2px, transparent 2px 4px, ${BAR} 4px 5px, transparent 5px 8px, ${BAR} 8px 11px, transparent 11px 12px, ${BAR} 12px 13px, transparent 13px 16px)`;

export default function HeroIdCard() {
  const { profile } = useContent();
  // Saved content from before this feature has no idCard, so fall back to site.ts
  const id = profile.idCard ?? defaultProfile.idCard;

  const cardRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse" || !cardRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 16}deg)`;
  }

  function onLeave() {
    if (cardRef.current) cardRef.current.style.transform = "";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.35, duration: 1.1, delay: 0.3 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
      className="relative mx-auto flex h-[470px] w-[300px] max-w-full justify-center [perspective:1000px]"
    >
      {/* Lanyard, fading in from above */}
      <div
        className="absolute left-1/2 top-0 h-[92px] w-3.5 -translate-x-1/2 rounded-sm [mask-image:linear-gradient(transparent,black_45%)]"
        style={{ backgroundImage: LANYARD }}
      />
      {/* Metal clip */}
      <div className="absolute left-1/2 top-[84px] z-10 h-4 w-6 -translate-x-1/2 rounded-[4px] border border-white/30 bg-gradient-to-b from-white/60 to-white/20" />

      {/* Swinging card */}
      <div className="absolute top-[92px] origin-[50%_-40px] animate-swing">
        <div
          ref={cardRef}
          className="relative w-[260px] overflow-hidden rounded-[18px] border border-white/15 bg-gradient-to-br from-fgc to-tgc px-5 pb-5 pt-4 shadow-[0_30px_50px_rgba(0,0,0,0.5)] transition-transform duration-150 ease-out [transform-style:preserve-3d]"
        >
          {/* Holographic shimmer */}
          <div
            className="pointer-events-none absolute inset-0 animate-holo mix-blend-screen"
            style={{ backgroundImage: HOLO, backgroundSize: "250% 100%" }}
          />

          {/* Punch hole */}
          <div className="mx-auto mb-4 h-2 w-12 rounded-full bg-bgc shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]" />

          <div className="flex justify-between text-[10px] uppercase tracking-[0.12em] text-text-secondary">
            <span>{id.org}</span>
            <span>{id.label}</span>
          </div>

          {/* Monogram instead of a photo */}
          <div
            className="mx-auto mb-3 mt-4 grid size-[88px] place-items-center rounded-full border-[3px] border-white/20 text-4xl font-bold text-text"
            style={{
              backgroundImage:
                "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--color-highlight) 45%, var(--color-fgc)), var(--color-tgc))",
            }}
          >
            {id.monogram}
          </div>

          <h3 className="text-center text-xl font-semibold text-text">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="mb-4 mt-0.5 text-center text-xs text-highlight">{profile.role}</p>

          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11.5px]">
            {id.rows.map((row, i) => (
              <div key={`${i}-${row.label}`} className="contents">
                <dt className="pt-0.5 text-[10px] uppercase tracking-wider text-text-turnery">{row.label}</dt>
                <dd className="text-text">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 h-8 rounded opacity-70" style={{ backgroundImage: BARCODE }} />
        </div>
      </div>
    </motion.div>
  );
}