"use client";

import { useContent } from "@/components/ContentProvider";

export default function Logo() {
  const { profile } = useContent();

  return (
    <a href="#home" className="flex items-center gap-2" aria-label={`${profile.firstName} ${profile.lastName} — home`}>
      <span className="grid size-8 place-items-center rounded-full border-2 border-white text-base font-semibold leading-none">
        {profile.firstName[0]}
      </span>
      <span className="text-xl font-semibold tracking-tight">{profile.firstName}</span>
    </a>
  );
}