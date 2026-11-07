"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, Bot, Hammer, Pill, UtensilsCrossed, Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { GithubIcon } from "@/components/BrandIcons";
import { useContent } from "@/components/ContentProvider";
import type { Project } from "@/data/site";

const ICONS = {
  users: Users,
  bot: Bot,
  utensils: UtensilsCrossed,
  hammer: Hammer,
  pill: Pill,
} as const;

// Card backgrounds step through the theme's surface shades
const CARD_BG = ["bg-fgc", "bg-card1", "bg-card2", "bg-card3"];

const STICKY_TOP = 120; // px from the top where the first card pins
const STACK_STEP = 25;  // each next card pins this much lower, so the edges stay visible

function ProjectVisual({ project }: { project: Project }) {
  const Icon = ICONS[project.icon] ?? Users;

  if (project.image) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={project.image}
          alt={project.title}
          fill
          unoptimized={!project.image.startsWith("/")}
          sizes="(min-width: 1024px) 384px, (min-width: 768px) 288px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  // Placeholder until a screenshot is added
  return (
    <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-tgc via-bgc to-tgc">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[18px_18px] opacity-30" />
      <span className="relative grid size-16 place-items-center rounded-2xl bg-tgc/80 text-highlight shadow-xl md:size-20">
        <Icon className="size-8 md:size-10" />
      </span>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasLive = Boolean(project.liveUrl);
  const hasCode = Boolean(project.githubUrl);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ top: STICKY_TOP + index * STACK_STEP, zIndex: index + 1 }}
      className={`sticky flex min-h-96 flex-col justify-between gap-8 rounded-2xl p-6 shadow-xl md:flex-row md:gap-12 md:rounded-3xl lg:gap-20 lg:p-10 ${
        CARD_BG[index % CARD_BG.length]
      }`}
    >
      {/* Left: text */}
      <div className="flex w-full flex-1 flex-col justify-between">
        <div>
          <span className="text-sm text-text-turnery">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mb-2 mt-1 text-xl font-medium md:mb-4 md:text-3xl">{project.title}</h3>

          <div className="mb-4 flex max-w-2xl flex-col gap-3 text-text-secondary md:mb-6">
            {project.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <ul className="flex flex-wrap gap-2">
            {project.tech.map((t, i) => (
              <li key={`${i}-${t}`} className="rounded-full border border-white/15 bg-tgc/60 px-3 py-1 text-xs md:text-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>

        {(hasLive || hasCode) && (
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            {hasLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl bg-tgc px-4 py-2 text-sm transition hover:bg-tgc/80"
              >
                Live Demo
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
            {hasCode && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm transition hover:bg-white/5"
              >
                <GithubIcon className="size-4" />
                Source Code
              </a>
            )}
          </div>
        )}
      </div>

      {/* Right: visual + stats */}
      <div className="flex w-full flex-col gap-5 md:w-72 lg:w-96">
        <ProjectVisual project={project} />
        <div className="flex gap-8">
          {project.stats.map((s, i) => (
            <div key={`${i}-${s.label}`}>
              <div className="tracking-wide text-text-secondary">{s.label}</div>
              <div className="text-xl font-bold text-text md:text-3xl">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const { projects, projectsSection } = useContent();

  return (
    <section id="projects" className="container-site relative scroll-mt-16 px-5 py-10 md:py-16 xl:px-0">
      <SectionHeading
        badge={projectsSection.badge}
        title={projectsSection.title}
        subtitle={projectsSection.subtitle}
      />

      <div className="mt-6 flex w-full flex-col gap-8 md:mt-10">
        {projects.map((project, i) => (
          <ProjectCard key={`${i}-${project.title}`} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}