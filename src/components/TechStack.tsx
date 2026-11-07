"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BrainCircuit, CodeXml, Database, Monitor, Server, Wrench } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useContent } from "@/components/ContentProvider";
import type { TechItem } from "@/data/site";

const CATEGORY_ICONS = {
  monitor: Monitor,
  server: Server,
  database: Database,
  brain: BrainCircuit,
  code: CodeXml,
  wrench: Wrench,
} as const;

function initials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Logo tile. Falls back to initials if there's no icon or it fails to load. */
function TechLogo({ item }: { item: TechItem }) {
  const [failed, setFailed] = useState(false);
  const src = item.icon
    ? `https://cdn.simpleicons.org/${item.icon}${item.color ? `/${item.color}` : ""}`
    : null;

  return (
    <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-md bg-bgc p-1.5">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-contain"
        />
      ) : (
        <span className="text-[11px] font-semibold text-highlight">{initials(item.name)}</span>
      )}
    </div>
  );
}

export default function TechStack() {
  const { techSection, techStack } = useContent();

  return (
    <section id="skills" className="container-site relative scroll-mt-16 px-5 py-10 md:py-16 xl:px-0">
      <SectionHeading badge={techSection.badge} title={techSection.title} subtitle={techSection.subtitle} />

      <div className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2 lg:gap-10">
        {techStack.map((category, i) => {
          const Icon = CATEGORY_ICONS[category.icon] ?? Wrench;
          return (
            <motion.div
              key={`${i}-${category.title}`}
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 2) * 0.1 }}
              className="overflow-hidden rounded-2xl bg-fgc shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              {/* top accent strip */}
              <div className="h-2.5 w-full bg-gradient-to-r from-tgc via-bgc to-tgc" />

              <div className="flex flex-col gap-6 p-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold leading-tight">{category.title}</h3>
                  <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-b from-tgc to-tgc/15 p-1.5 text-text-turnery">
                    <Icon className="size-full" />
                  </div>
                </div>

                <ul>
                  {category.items.map((item, idx) => (
                    <li
                      key={`${idx}-${item.name}`}
                      className={`flex items-center gap-4 py-2.5 ${
                        idx < category.items.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <TechLogo item={item} />
                      <div>
                        <h4 className="text-base font-medium">{item.name}</h4>
                        <p className="text-sm text-text-secondary">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}