"use client";

import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { useContent } from "@/components/ContentProvider";

export default function Footer() {
  const { about, footer, navLinks, profile } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-bgc via-tgc to-tgc px-6 pb-4 pt-10 md:px-12 md:pt-16">
      <div className="container-site grid grid-cols-1 gap-10 text-center sm:text-left md:grid-cols-3 md:gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-text-turnery">{footer.tagline}</p>

          <div className="mb-5 mt-4 flex gap-4 text-text-turnery">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition hover:scale-105 hover:text-text">
              <GithubIcon className="size-5" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition hover:scale-105 hover:text-text">
              <LinkedinIcon className="size-5" />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="transition hover:scale-105 hover:text-text">
              <Mail className="size-5" />
            </a>
          </div>

          {/* Arrow-swap CTA */}
          <a
            href="#contact"
            className="group relative w-fit rounded-lg bg-gradient-to-b from-bgc via-bgc/90 to-bgc/70 py-3 pl-6 pr-14 font-medium shadow-md"
          >
            📩 Get In Touch
            <span className="absolute right-4 top-1/2 size-5 -translate-y-1/2 overflow-hidden">
              <ArrowUpRight className="absolute inset-0 size-5 transition-all duration-500 group-hover:-translate-y-full group-hover:opacity-0" />
              <ArrowUpRight className="absolute inset-0 size-5 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
            </span>
          </a>
        </div>

        {/* Explore */}
        <div className="flex w-full flex-col gap-3 sm:w-fit md:mx-auto">
          <h4 className="text-lg font-semibold">Explore</h4>
          <ul className="flex flex-row flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm sm:justify-start md:flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-text-secondary transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Currently */}
        <div className="flex flex-col items-center gap-3 sm:items-start md:items-end md:text-right">
          <h4 className="text-lg font-semibold">{footer.currentlyTitle}</h4>
          <p className="max-w-xs text-sm text-text-turnery">{footer.currently}</p>
          <a
            href={about.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            <FileText className="size-4" />
            View Resume
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 h-px w-full max-w-[var(--container-site)] bg-gradient-to-r from-border/20 via-border to-border/20 sm:mt-12" />
      <p className="p-4 text-center text-xs text-text">
        © {year} {profile.firstName} {profile.lastName}. Designed & built with Next.js & Tailwind CSS.
      </p>
    </footer>
  );
}