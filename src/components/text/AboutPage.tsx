import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import { AboutQuote } from "@/components/text/AboutQuote";
import { ActivityList } from "@/components/text/ActivityList";
import { MissionDeclarations } from "@/components/text/MissionDeclarations";
import { MilestoneRow } from "@/components/text/MilestoneRow";
import { PersonProfile } from "@/components/text/PersonProfile";
import { TextPageSection, TextPageShell } from "@/components/text/TextPageShell";
import type { LoadedAboutPage } from "@/content/pages";
import type { Image as ContentImage, TextPageLink } from "@/content/types";
import { mainNav, sectionNav } from "@/navigation";

const slug = "o-akademii";
const mainNavActive = mainNav.find((item) => item.href === `/${slug}`)!.label;
const sectionActive = sectionNav["o-akademii"].find((link) => link.href === `/${slug}`)!.label;

export interface AboutPageProps {
  page: LoadedAboutPage;
}

function TextLinkRow({ links }: { links: TextPageLink[] }) {
  return (
    <div className="about-link-row">
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
          <h1 className="about-hero-title">{title}</h1>
          <p className="about-hero-lead">{lead}</p>
        </div>
        <figure className="about-hero-figure">
          <Image
            src={image.src}
            alt={image.alt}
            width={560}
            height={420}
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

function AboutClosing({ page }: { page: LoadedAboutPage }) {
  const { foundation, legal, startLinks } = page;

  return (
    <footer className="about-closing mt-section-gap-mobile md:mt-section-gap">
      <p className="about-closing-foundation">
        {foundation.beforeLink}
        <TextLink href={foundation.linkHref} external>
          {foundation.linkLabel}
        </TextLink>
        {foundation.afterLink}
      </p>
      <p className="about-closing-legal">{legal}</p>
      <div className="about-closing-start">
        <span className="about-closing-start-intro">{startLinks.intro}</span>
        {startLinks.links.map((link) => (
          <TextLink key={link.href} href={link.href}>
            {link.label}
          </TextLink>
        ))}
      </div>
    </footer>
  );
}

export function AboutPage({ page }: AboutPageProps) {
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

  return (
    <TextPageShell
      title={title}
      lead={lead}
      active={mainNavActive}
      section="o-akademii"
      sectionActive={sectionActive}
      hideHeader
    >
      <AboutHero title={title} lead={lead ?? ""} image={hero} />

      <TextPageSection id="misja" heading={mission.heading}>
        <MissionDeclarations items={mission.declarations} />
      </TextPageSection>

      <TextPageSection id="dla-kogo" heading={audience.heading}>
        <div className="text-page-mdx">
          {audienceParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </TextPageSection>

      <section
        id="prowadzaca"
        className="about-person-section mt-section-gap-mobile scroll-mt-space-6 md:mt-section-gap"
      >
        <h2 className="about-person-heading font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2">
          {person.heading}
        </h2>
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
        <div className="text-page-mdx mt-space-5">
          <p>{historyParagraph}</p>
        </div>
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

      <section
        id="pracownia-i-miejsce"
        className="about-workshop-band surface-card-bleed mt-section-gap-mobile scroll-mt-space-6 md:mt-section-gap"
      >
        <div className="about-workshop-band-inner">
          <h2 className="about-workshop-heading font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2">
            {workshop.heading}
          </h2>
          <div className="text-page-mdx">
            <p>{workshopParagraph}</p>
          </div>
          <p className="about-workshop-accessibility">{workshop.accessibility}</p>
          <TextLinkRow links={workshop.links} />
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
        </div>
      </section>

      <AboutClosing page={page} />
    </TextPageShell>
  );
}
