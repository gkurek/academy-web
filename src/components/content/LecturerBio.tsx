"use client";

import { useState } from "react";

import { pl } from "@/i18n/pl";

const collapsedClass = "line-clamp-7";

export interface LecturerBioProps {
  bio: string;
  collapsible: boolean;
}

export function LecturerBio({ bio, collapsible }: LecturerBioProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldClamp = collapsible && !expanded;

  return (
    <div>
      <p
        className={[
          "text-size-body leading-body text-text-secondary",
          shouldClamp ? collapsedClass : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {bio}
      </p>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className={[
            "pt-space-4 text-size-nav text-accent-text hover:text-accent-hover cursor-pointer",
            "border-b border-accent-veil hover:border-accent-hover",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          ].join(" ")}
        >
          {expanded ? pl.lecturers.collapseBio : pl.lecturers.expandBio}
        </button>
      ) : null}
    </div>
  );
}
