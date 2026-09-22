import type { ComponentType } from "react";

import type { Author, Image, Publication } from "@/content/types";
import { articleModules } from "@/content/articles-registry";
import { publicationModules } from "@/content/publications-registry";
import { validatePublicationSlugCollisions } from "@/content/publication-slugs";
import * as ikonaDzisBody from "../../content/publications/ikona-dzis-body.mdx";

export type PublicationExcerpt = {
  quote: string;
  author: string;
  title: string;
};

export type PublicationFrontmatter = Publication & {
  lead: string;
  hubDescription: string;
  shortTitle: string;
  relatedNewsSlug?: string;
};

export type LoadedPublication = PublicationFrontmatter & {
  aboutParagraphs: string[];
  excerpts: PublicationExcerpt[];
  Content: ComponentType;
};

export type PublicationAuthorGroups = {
  lecturers: Author[];
  participants: Author[];
};

type PublicationBodyExports = {
  aboutParagraphs: string[];
  excerpts: PublicationExcerpt[];
};

const bodyBySlug: Record<string, PublicationBodyExports> = {
  "ikona-dzis": ikonaDzisBody as unknown as PublicationBodyExports,
};

const publicationEntries = Object.values(publicationModules).map((module) => module.frontmatter);

validatePublicationSlugCollisions(
  publicationEntries.map((entry) => entry.slug),
  Object.keys(articleModules),
);

function validatePublicationToc(publication: PublicationFrontmatter): void {
  publication.toc.forEach((item) => {
    if (item.articleSlug && !articleModules[item.articleSlug]) {
      throw new Error(
        `Publication "${publication.slug}" toc references missing article "${item.articleSlug}"`,
      );
    }
  });
}

publicationEntries.forEach(validatePublicationToc);

Object.values(articleModules).forEach((module) => {
  const { source, slug, title } = module.frontmatter;
  if (source.kind !== "album") {
    return;
  }

  const publication = publicationModules[source.publicationSlug]?.frontmatter;
  if (!publication) {
    throw new Error(`Article "${slug}" references missing publication "${source.publicationSlug}"`);
  }

  const inToc = publication.toc.some((item) => item.articleSlug === slug);
  if (!inToc) {
    console.warn(
      `Article "${slug}" (${title}) has album source but no matching toc[].articleSlug in "${source.publicationSlug}"`,
    );
  }
});

export function getPublications(): PublicationFrontmatter[] {
  return publicationEntries;
}

export function getPublicationBySlug(slug: string): PublicationFrontmatter | undefined {
  return publicationModules[slug]?.frontmatter;
}

export function loadPublicationBySlug(slug: string): LoadedPublication | undefined {
  const publicationModule = publicationModules[slug];
  if (!publicationModule) {
    return undefined;
  }

  const body = bodyBySlug[slug];
  if (!body) {
    throw new Error(`Missing body exports for publication "${slug}"`);
  }

  return {
    ...publicationModule.frontmatter,
    aboutParagraphs: body.aboutParagraphs,
    excerpts: body.excerpts,
    Content: publicationModule.Content,
  };
}

export function getPublicationAuthorGroups(publication: Publication): PublicationAuthorGroups {
  const lecturers = new Map<string, Author>();
  const participants = new Map<string, Author>();

  publication.toc.forEach((item) => {
    const bucket = item.author.lecturerSlug ? lecturers : participants;
    bucket.set(item.author.name, item.author);
  });

  return {
    lecturers: [...lecturers.values()],
    participants: [...participants.values()],
  };
}

export function formatPublicationPrice(price?: number): string | undefined {
  if (price === undefined) {
    return undefined;
  }

  return `${price} zł`;
}

export function getHubSpreadPreview(spreads: Image[], limit = 4): Image[] {
  return spreads.slice(0, limit);
}
