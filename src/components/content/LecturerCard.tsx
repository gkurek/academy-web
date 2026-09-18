import Image from "next/image";

import { LecturerBio } from "@/components/content/LecturerBio";
import type { Lecturer } from "@/content/types";
import { formatLecturerDisplayName, isLongLecturerBio } from "@/content/lecturers";
import { pl } from "@/i18n/pl";

export interface LecturerCardProps {
  lecturer: Lecturer;
}

export function LecturerCard({ lecturer }: LecturerCardProps) {
  const displayName = formatLecturerDisplayName(lecturer);
  const affiliationFull = lecturer.affiliationFull ?? pl.lecturers.affiliationPlaceholder;

  return (
    <article
      id={lecturer.slug}
      className={[
        "scroll-mt-space-6 grid grid-cols-1 md:grid-cols-lecturer-row items-start gap-x-lecturer-row-gap gap-y-space-4 md:gap-y-0",
        "px-lecturer-row-x py-lecturer-row-y bg-surface-tile",
      ].join(" ")}
    >
      {lecturer.photo ? (
        <div className="w-full md:w-lecturer-photo-col md:max-w-none max-w-lecturer-photo-col shrink-0">
          <div className="overflow-hidden border border-line-gold bg-surface-card w-full aspect-lecturer-photo">
            <Image
              src={lecturer.photo.src}
              alt={lecturer.photo.alt}
              width={lecturer.photo.width}
              height={lecturer.photo.height}
              sizes="(min-width: 768px) 240px, 100vw"
              className="w-full h-auto"
            />
          </div>
        </div>
      ) : null}

      <div className="min-w-0">
        <h3 className="font-serif text-size-h3-m md:text-size-h3 font-medium leading-heading text-text-h2 mb-lecturer-name-mb">
          {displayName}
        </h3>
        <p className="font-serif text-size-lecturer-affiliation leading-body text-accent mb-lecturer-affiliation-mb">
          {affiliationFull}
        </p>
        {lecturer.bio ? (
          <LecturerBio bio={lecturer.bio} collapsible={isLongLecturerBio(lecturer.bio)} />
        ) : null}
      </div>
    </article>
  );
}
