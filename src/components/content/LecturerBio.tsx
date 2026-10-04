"use client";

import { useId, useState } from "react";

import { pl } from "@/i18n/pl";

const collapsedClass = "line-clamp-7";

export interface LecturerBioProps {
  bio: string;
  collapsible: boolean;
  /** Lecturer display name — makes the toggle's accessible name unique on the page. */
  name: string;
}

export function LecturerBio({ bio, collapsible, name }: LecturerBioProps) {
  const [expanded, setExpanded] = useState(false);
  const bioId = useId();
  const shouldClamp = collapsible && !expanded;
  const toggleLabel = (expanded ? pl.lecturers.collapseBioLabel : pl.lecturers.expandBioLabel).replace(
    "{name}",
    name,
  );

  return (
    <div>
      <p
        id={bioId}
        className={[
          "text-size-body leading-body text-text-secondary max-w-measure-prose",
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
          aria-controls={bioId}
          aria-label={toggleLabel}
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
