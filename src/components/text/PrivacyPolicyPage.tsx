import { TextLink } from "@/components/core/TextLink";
import { TextPageShell } from "@/components/text/TextPageShell";
import type { LoadedPrivacyPolicyPage } from "@/content/pages";
import type { PrivacyPolicySection, TocItem } from "@/content/types";
import { pl } from "@/i18n/pl";
import { formatDateRange } from "@/lib/formatDateRange";
import { PageHeading } from "@/components/core/PageHeading";
import { Prose } from "@/components/core/Prose";

export interface PrivacyPolicyPageProps {
  page: LoadedPrivacyPolicyPage;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
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
      <PageHeading level="section" className="mb-heading-gap">{sectionHeading(toc, section.id)}</PageHeading>
      <Prose variant="text">
        {section.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {section.list ? (
          <ul>
            {section.list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : null}
        {section.paragraphsAfterList?.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Prose>
    </section>
  );
}

export function PrivacyPolicyPage({ page, path }: PrivacyPolicyPageProps) {
  const { title, lead, toc, sections, lastUpdated, contactEmail } = page;
  const lastUpdatedLabel = formatDateRange(lastUpdated, undefined, { withYear: true });

  return (
    <TextPageShell title={title} lead={lead} toc={toc} path={path}>
      <div className="privacy-policy-content">
        {sections.map((section) => (
          <PrivacyPolicySectionBlock key={section.id} section={section} toc={toc ?? []} />
        ))}

        <section id="kontakt-w-sprawie-danych" className="privacy-policy-section scroll-mt-space-6">
          <PageHeading level="section" className="mb-heading-gap">
            {sectionHeading(toc ?? [], "kontakt-w-sprawie-danych")}
          </PageHeading>
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
