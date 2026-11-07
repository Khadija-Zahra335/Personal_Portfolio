"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import HeroIdCard from "@/components/HeroIdCard";
import { useContent } from "@/components/ContentProvider";

export default function Hero() {
  const { profile } = useContent();

  return (
    <section
      id="home"
      className="container-site relative flex min-h-[68dvh] scroll-mt-16 flex-col justify-center px-5 py-10 md:py-16 xl:px-0"
    >
      <div className="grid w-full items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex w-full flex-col items-center text-center md:items-start md:text-left"
        >
          <SectionBadge className="mb-6">{profile.role}</SectionBadge>

          <div className="flex items-center gap-3 md:gap-5">
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl md:leading-[1.15]">
              <span className="text-text">{profile.firstName}</span>{" "}
              <span className="text-text-turnery">{profile.lastName}</span>
            </h1>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile"
              className="shrink-0 rounded-full border border-white/15 bg-tgc p-2 transition hover:scale-105 lg:p-3"
            >
              <ArrowUpRight className="size-5" />
            </a>
          </div>

          <p className="mt-4 max-w-xl leading-relaxed text-text-secondary md:mt-6 md:text-lg">{profile.intro}</p>

          <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-4 md:mt-8 md:justify-start">
            <a
              href="#projects"
              className="rounded-full bg-gradient-to-b from-highlight/30 to-fgc/70 px-6 py-3 font-medium shadow-md transition hover:brightness-110"
            >
              View My Work
            </a>
            <motion.a
              href="#contact"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full border border-highlight/40 px-6 py-3 font-medium shadow-md transition-colors hover:bg-white/5"
            >
              📩 Get In Touch
            </motion.a>
          </div>
        </motion.div>

        {/* Right: ID card */}
        <div className="flex justify-center lg:justify-end">
          <HeroIdCard />
        </div>
      </div>
    </section>
  );
}