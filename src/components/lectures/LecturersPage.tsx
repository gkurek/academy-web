import { LecturerCard } from "@/components/content/LecturerCard";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { Lecturer } from "@/content/types";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface LecturersPageProps {
  lecturers: Lecturer[];
  intro: string;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

export function LecturersPage({ lecturers, intro, path }: LecturersPageProps) {
  return (
    <SectionPageShell path={path}>
      <PageHeading level="page" className="mb-space-5">
        {pl.lecturers.heading}
      </PageHeading>
      <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-6">
        {intro}
      </p>

      <div className="hairline-stack">
        {lecturers.map((lecturer) => (
          <LecturerCard key={lecturer.slug} lecturer={lecturer} />
        ))}
      </div>
    </SectionPageShell>
  );
}
