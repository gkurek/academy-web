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
        "scroll-mt-space-6 grid grid-cols-lecturer-row-m md:grid-cols-lecturer-row items-start gap-x-space-4 md:gap-x-lecturer-row-gap gap-y-space-4 md:gap-y-0",
        "px-space-5 md:px-lecturer-row-x py-space-4 md:py-lecturer-row-y bg-surface-tile",
      ].join(" ")}
    >
      <div className="w-full md:w-lecturer-photo-col shrink-0">
        {lecturer.photo ? (
          <div className="relative overflow-hidden border border-line-gold bg-surface-card w-full aspect-lecturer-photo">
            <Image
              src={lecturer.photo.src}
              alt={lecturer.photo.alt}
              fill
              sizes="(min-width: 768px) 240px, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="lecturer-photo-placeholder"
            role="img"
            aria-label={pl.lecturers.photoPlaceholder}
          >
            <p className="lecturer-photo-placeholder-text" aria-hidden="true">{pl.lecturers.photoPlaceholder}</p>
          </div>
        )}
      </div>

      {/* Below md the wrapper dissolves: name and affiliation sit beside the portrait, the bio spans both columns. */}
      <div className="contents md:block md:min-w-0">
        <div className="min-w-0">
          <h2 className="font-serif text-size-role-card-title-m md:text-size-role-card-title leading-heading text-text-h2 mb-lecturer-name-mb">
            {displayName}
          </h2>
          <p className="font-serif text-size-lecturer-affiliation leading-body text-accent-text mb-lecturer-affiliation-mb">
            {affiliationFull}
          </p>
        </div>
        {lecturer.bio ? (
          <div className="col-span-2 md:col-span-1 min-w-0">
            <LecturerBio bio={lecturer.bio} collapsible={isLongLecturerBio(lecturer.bio)} name={displayName} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
