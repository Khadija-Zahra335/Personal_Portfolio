"use client";

import { useContent } from "@/components/ContentProvider";

/**
 * Endless chip strip. The list is rendered twice and the track slides by -50%,
 * so the loop is seamless. Hovering pauses it; the edges fade out.
 */
export default function SkillMarquee() {
  const { heroChips } = useContent();
  const duration = `${heroChips.length * 2.5}s`;

  return (
    <div className="group mask-fade-x relative mx-auto mt-4 w-full overflow-hidden whitespace-nowrap pb-16 sm:mt-8">
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {heroChips.map((chip, i) => (
              <li
                key={`${copy}-${i}-${chip}`}
                className="mx-1.5 rounded-full border border-border px-4 py-1.5 text-sm md:text-base"
              >
                {chip}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}