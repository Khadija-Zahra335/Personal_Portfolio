"use client";

import { motion } from "motion/react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import { useContent } from "@/components/ContentProvider";

function AvailabilityDot() {
  return (
    <span className="relative inline-block size-6 shrink-0">
      {/* expanding radar ring */}
      <span className="absolute left-1/2 top-1/2 size-full rounded-full bg-green-dot opacity-50 animate-radar" />
      {/* solid glowing core */}
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-dot shadow-[0_0_20px_rgba(49,238,51,0.5)]" />
    </span>
  );
}

function ResumeButton() {
  const { about } = useContent();

  return (
    <a
      href={about.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-tgc px-6 py-3 font-semibold text-text-secondary transition-colors hover:text-text"
    >
      Download Resume
      {/* Arrow swap: the visible arrow slides up and out, a twin slides in from below */}
      <span className="relative size-5 overflow-hidden">
        <ArrowUpRight className="absolute inset-0 size-5 transition-all duration-500 group-hover:-translate-y-full group-hover:opacity-0" />
        <ArrowUpRight className="absolute inset-0 size-5 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
      </span>
    </a>
  );
}

function Visual() {
  const { about } = useContent();

  return (
    <div className="relative flex items-center justify-center">
      {/* Main circle (stands in for the portrait) */}
      <div className="relative grid size-60 place-items-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-fgc via-bgc to-tgc shadow-2xl md:size-96">
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-highlight)_1px,transparent_1px)] bg-size-[22px_22px] opacity-20" />
        <div className="absolute inset-6 rounded-full border border-dashed border-highlight/25 md:inset-10" />
        <div className="absolute inset-14 rounded-full border border-highlight/15 md:inset-24" />
        <GraduationCap className="relative size-20 text-highlight/90 drop-shadow-xl md:size-32" strokeWidth={1.25} />
      </div>

      {/* Overlapping highlight circle */}
      <div className="-ml-16 flex size-36 shrink-0 flex-col items-center justify-center gap-1 rounded-full border-4 border-bgc bg-highlight text-center text-bgc md:-ml-24 md:size-56 md:gap-2 md:border-[5px]">
        <span className="text-2xl font-bold leading-none md:text-4xl">{about.badgeCircle.top}</span>
        <span className="whitespace-pre-line text-xs font-medium leading-tight md:text-base">
          {about.badgeCircle.bottom}
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const { about, experienceStrip } = useContent();

  return (
    <section id="about" className="container-site relative scroll-mt-16 px-5 py-10 md:py-16 xl:px-0">
      <div className="flex flex-col-reverse items-center gap-10 text-center lg:flex-row lg:text-left">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-1 flex-col items-center lg:items-start"
        >
          <SectionBadge className="mb-4">{about.badge}</SectionBadge>

          <h2 className="text-gradient mb-3 max-w-2xl text-3xl font-semibold leading-9 md:text-5xl md:leading-[1.25]">
            {about.title}
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">{about.text}</p>

          <div className="my-6 flex justify-center gap-8 lg:justify-start">
            {about.stats.map((s, i) => (
              <div key={`${i}-${s.label}`} className="flex flex-col items-center gap-1 text-highlight">
                <span className="text-3xl font-bold md:text-4xl">{s.value}</span>
                <span className="text-center text-xs leading-tight md:text-sm">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-2">
            <AvailabilityDot />
            <span>{about.availability}</span>
          </div>

          <ResumeButton />
        </motion.div>

        {/* Right: visual */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-1 items-center justify-center"
        >
          <Visual />
        </motion.div>
      </div>

      {/* Experience strip */}
      <motion.div
        id="experience"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-6 grid scroll-mt-32 grid-cols-1 divide-y divide-border rounded-2xl md:mt-14 md:grid-cols-4 md:divide-x md:divide-y-0 md:py-5"
      >
        {experienceStrip.map((item, i) => (
          <div
            key={`${i}-${item.role}`}
            className="flex flex-row items-center justify-between gap-3 px-2 py-5 text-left md:flex-col md:justify-start md:p-0 md:px-3 md:text-center"
          >
            <div>
              <p className="font-semibold">{item.role}</p>
              <div className="flex text-xs text-text-turnery md:justify-center lg:text-sm">
                <span>{item.org}</span>
                <span className="mx-1">·</span>
                <span>{item.type}</span>
              </div>
            </div>
            <p className="shrink-0 text-sm text-text-secondary md:mt-1">{item.period}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}