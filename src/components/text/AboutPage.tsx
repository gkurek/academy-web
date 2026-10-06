import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import { AboutQuote } from "@/components/text/AboutQuote";
import { ActivityList } from "@/components/text/ActivityList";
import { MissionDeclarations } from "@/components/text/MissionDeclarations";
import { MilestoneRow } from "@/components/text/MilestoneRow";
import { PersonProfile } from "@/components/text/PersonProfile";
import { TextPageSection } from "@/components/text/TextPageSection";
import { TextPageShell } from "@/components/text/TextPageShell";
import { pl } from "@/i18n/pl";
import type { LoadedAboutPage } from "@/content/pages";
import type { Image as ContentImage, TextPageLink } from "@/content/types";
import { PageHeading } from "@/components/core/PageHeading";

import { Prose } from "@/components/core/Prose";
export interface AboutPageProps {
  page: LoadedAboutPage;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

function TextLinkRow({ links, label }: { links: TextPageLink[]; label?: string }) {
  return (
    <div className="about-link-row">
      {label ? <span className="about-link-row-label">{label}</span> : null}
      {links.map((link) => (
        <TextLink key={link.href} href={link.href}>
          {link.label}
        </TextLink>
      ))}
    </div>
  );
}

function AboutHero({ title, lead, image }: { title: string; lead: string; image: ContentImage }) {
  return (
    <header className="about-hero mb-space-6">
      <div className="about-hero-grid">
        <div className="about-hero-copy">
          <PageHeading level="page" className="mb-space-5">{title}</PageHeading>
          <p className="about-hero-lead">{lead}</p>
        </div>
        <figure className="about-hero-figure">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="about-hero-image"
            sizes="(max-width: 1023px) 100vw, 560px"
            priority
          />
          {image.caption ? <figcaption className="about-hero-caption">{image.caption}</figcaption> : null}
        </figure>
      </div>
    </header>
  );
}

export function AboutPage({ page, path }: AboutPageProps) {
  const {
    title,
    lead,
    hero,
    mission,
    audience,
    audienceParagraphs,
    person,
    approach,
    history,
    historyParagraph,
    activities,
    workshop,
    workshopParagraph,
  } = page;

  const workshopBand = (
    <section
      id="pracownia-i-miejsce"
      className="about-workshop-band surface-card-bleed mt-section-gap-loose scroll-mt-space-6"
    >
      <div className="about-workshop-band-inner">
        <PageHeading level="section" className="mb-space-6">
          {workshop.heading}
        </PageHeading>
        <Prose variant="text">
          <p>{workshopParagraph}</p>
        </Prose>
        <p className="about-workshop-accessibility">{workshop.accessibility}</p>
        <div className="about-workshop-photos">
          {workshop.photos.map((photo) => (
            <figure key={photo.src} className="about-workshop-photo">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="about-workshop-photo-image"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              {photo.caption ? (
                <figcaption className="about-workshop-photo-caption">{photo.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
        <TextLinkRow links={workshop.links} label={pl.textPage.seeAlsoLabel} />
      </div>
    </section>
  );

  return (
    <TextPageShell
      title={title}
      lead={lead}
      path={path}
      hideHeader
      footerBand={workshopBand}
    >
      <AboutHero title={title} lead={lead ?? ""} image={hero} />

      <TextPageSection id="misja" heading={mission.heading}>
        <MissionDeclarations items={mission.declarations} />
      </TextPageSection>

      <TextPageSection id="dla-kogo" heading={audience.heading}>
        <Prose variant="text">
          {audienceParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Prose>
      </TextPageSection>

      <section
        id="prowadzaca"
        className="about-person-section mt-section-gap-loose scroll-mt-space-6"
      >
        <PageHeading level="section">
          {person.heading}
        </PageHeading>
        <PersonProfile profile={person.profile} />
      </section>

      <TextPageSection id="podejscie" heading={approach.heading}>
        <AboutQuote quote={approach.quote} author={person.profile.name} />
        <p className="about-approach-comment">{approach.comment}</p>
        <p className="mt-space-5">
          <TextLink href={approach.readMore.href}>{approach.readMore.label}</TextLink>
        </p>
      </TextPageSection>

      <TextPageSection id="historia" heading={history.heading}>
        <MilestoneRow items={history.milestones} />
        <Prose variant="text" className="mt-space-5">
          <p>{historyParagraph}</p>
        </Prose>
        <div className="mt-space-5">
          <TextLinkRow links={history.links} />
        </div>
      </TextPageSection>

      <TextPageSection id="dzialania" heading={activities.heading}>
        <p className="about-section-lead">{activities.lead}</p>
        <div className="mt-space-5">
          <ActivityList items={activities.items} />
        </div>
        <div className="mt-space-5">
          <TextLinkRow links={activities.links} />
        </div>
      </TextPageSection>

    </TextPageShell>
  );
}

