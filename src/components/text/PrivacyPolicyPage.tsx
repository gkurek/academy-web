import { TextLink } from "@/components/core/TextLink";
import { TextPageShell } from "@/components/text/TextPageShell";
import type { LoadedPrivacyPolicyPage } from "@/content/pages";
import type { PrivacyPolicySection, TocItem } from "@/content/types";
import { pl } from "@/i18n/pl";
import { formatDateRange } from "@/lib/formatDateRange";

export interface PrivacyPolicyPageProps {
  page: LoadedPrivacyPolicyPage;
}

function sectionHeading(toc: TocItem[], id: string): string {
  return toc.find((item) => item.id === id)?.label ?? "";
}

function PrivacyPolicySectionBlock({
  section,
  toc,
}: {
  section: PrivacyPolicySection;
  toc: TocItem[];
}) {
  return (
    <section id={section.id} className="privacy-policy-section scroll-mt-space-6">
      <h2 className="privacy-policy-section-heading">{sectionHeading(toc, section.id)}</h2>
      <div className="text-page-mdx">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        {section.list ? (
          <ul className="mb-space-4 list-disc pl-space-6 text-size-body leading-body text-text-body">
            {section.list.map((item) => (
              <li key={item.slice(0, 48)} className="mb-space-2">{item}</li>
            ))}
          </ul>
        ) : null}
        {section.paragraphsAfterList?.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function PrivacyPolicyPage({ page }: PrivacyPolicyPageProps) {
  const { title, lead, toc, sections, lastUpdated, contactEmail } = page;
  const lastUpdatedLabel = formatDateRange(lastUpdated, undefined, { withYear: true });

  return (
    <TextPageShell title={title} lead={lead} toc={toc}>
      <div className="privacy-policy-content">
        {sections.map((section) => (
          <PrivacyPolicySectionBlock key={section.id} section={section} toc={toc ?? []} />
        ))}

        <section id="kontakt-w-sprawie-danych" className="privacy-policy-section scroll-mt-space-6">
          <h2 className="privacy-policy-section-heading">
            {sectionHeading(toc ?? [], "kontakt-w-sprawie-danych")}
          </h2>
          <p className="privacy-policy-contact text-size-body leading-body text-text-secondary md:text-size-body-lg md:leading-prose">
            <TextLink href={`mailto:${contactEmail}`}>{contactEmail}</TextLink>
          </p>
        </section>

        <p className="privacy-policy-updated">
          {pl.privacy.lastUpdatedLabel}{" "}
          <time dateTime={lastUpdated}>{lastUpdatedLabel}</time>
        </p>
      </div>
    </TextPageShell>
  );
}
