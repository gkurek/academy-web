import type { ReactNode } from "react";

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
      className="mt-section-gap-mobile scroll-mt-space-6 md:mt-section-gap grid grid-cols-1 items-start gap-space-5 lg:grid-cols-text-page-section lg:gap-text-page-main-gap"
    >
      <h2 className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2">
        {heading}
      </h2>
      <div className="min-w-0 text-page-mdx">{children}</div>
    </section>
  );
}
