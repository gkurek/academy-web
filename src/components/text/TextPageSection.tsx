import type { ReactNode } from "react";
import { PageHeading } from "@/components/core/PageHeading";

import { Prose } from "@/components/core/Prose";
export interface TextPageSectionProps {
  id: string;
  heading: string;
  children: ReactNode;
}

/** Two-column section row: 280 px H2 column + prose (mockup 6a). */
export function TextPageSection({ id, heading, children }: TextPageSectionProps) {
  return (
    <section
      id={id}
      className="mt-section-gap-loose scroll-mt-space-6 grid grid-cols-1 items-start gap-heading-gap lg:grid-cols-text-page-section lg:gap-text-page-main-gap"
    >
      <PageHeading level="section">
        {heading}
      </PageHeading>
      <Prose variant="text" className="min-w-0">{children}</Prose>
    </section>
  );
}
