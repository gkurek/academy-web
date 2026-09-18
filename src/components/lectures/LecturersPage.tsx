import { LecturerCard } from "@/components/content/LecturerCard";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { Lecturer } from "@/content/types";
import { pl } from "@/i18n/pl";
import type { SectionKey } from "@/navigation";

export interface LecturersPageProps {
  lecturers: Lecturer[];
  intro: string;
  section: SectionKey;
  sectionActive: string;
  active: string;
}

export function LecturersPage({ lecturers, intro, section, sectionActive, active }: LecturersPageProps) {
  return (
    <SectionPageShell active={active} section={section} sectionActive={sectionActive}>
      <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
        {pl.lecturers.heading}
      </h1>
      <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary mb-space-6">
        {intro}
      </p>

      <div className="grid gap-hairline-gap bg-line-gold">
        {lecturers.map((lecturer) => (
          <LecturerCard key={lecturer.slug} lecturer={lecturer} />
        ))}
      </div>
    </SectionPageShell>
  );
}
