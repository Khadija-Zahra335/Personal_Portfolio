"use client";

import { motion } from "motion/react";
import { Award, ExternalLink, GraduationCap } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useContent } from "@/components/ContentProvider";
import type { EduItem } from "@/data/site";

function TwoToneTag({ tag }: { tag: [string, string] }) {
  return (
    <div className="mt-3 flex w-fit items-center overflow-hidden rounded-sm text-sm tracking-wide">
      <span className="bg-tgc px-1.5 py-px">{tag[0]}</span>
      <span className="bg-highlight px-1.5 py-px text-tgc">{tag[1]}</span>
    </div>
  );
}

function EduCard({ item, index }: { item: EduItem; index: number }) {
  const Wrapper = item.url ? motion.a : motion.div;
  return (
    <Wrapper
      {...(item.url ? { href: item.url, target: "_blank", rel: "noopener noreferrer" } : {})}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 2) * 0.08 }}
      className="group relative rounded-xl border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-lg transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Grade / link icon pinned top-right so it only shares the row with the title */}
      {item.grade ? (
        <span className="absolute right-6 top-5 text-3xl font-bold text-highlight md:text-4xl">{item.grade}</span>
      ) : item.url ? (
        <ExternalLink className="absolute right-6 top-6 size-5 text-text-turnery transition group-hover:text-text" />
      ) : null}

      <h3 className={`text-lg font-semibold text-white md:text-xl ${item.grade ? "pr-24" : item.url ? "pr-8" : ""}`}>
        {item.title}
      </h3>
      <p className="mt-1 whitespace-nowrap text-text-secondary">{item.org}</p>
      {item.period && <p className="mt-1 text-sm text-text-turnery">{item.period}</p>}
      {item.tag && item.tag[0] && <TwoToneTag tag={item.tag} />}
    </Wrapper>
  );
}

function GroupLabel({ icon: Icon, children }: { icon: typeof Award; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-b from-tgc to-tgc/15 p-1.5 text-text-turnery">
        <Icon className="size-full" />
      </span>
      <h3 className="text-lg font-semibold md:text-xl">{children}</h3>
      <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

export default function Education() {
  const { academics, certifications, educationSection } = useContent();

  return (
    <section id="education" className="container-site relative scroll-mt-16 px-5 py-10 md:py-16 xl:px-0">
      <SectionHeading
        badge={educationSection.badge}
        title={educationSection.title}
        subtitle={educationSection.subtitle}
      />

      <div className="mt-6 md:mt-10">
        <GroupLabel icon={GraduationCap}>Academic</GroupLabel>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {academics.map((item, i) => (
            <EduCard key={`${i}-${item.title}`} item={item} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-10 md:mt-14">
        <GroupLabel icon={Award}>Certifications & Achievements</GroupLabel>
        <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
          {certifications.map((item, i) => (
            <EduCard key={`${i}-${item.title}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}