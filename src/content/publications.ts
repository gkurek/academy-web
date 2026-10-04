import type { ComponentType } from "react";

import type { Image, Publication } from "@/content/types";
import { assertLecturerSlugExists } from "@/content/authors";
import { articleModules } from "@/content/articles-registry";
import { publicationModules } from "@/content/publications-registry";
import { validatePublicationSlugCollisions } from "@/content/publication-slugs";
import * as ikonaDzisBody from "../../content/publications/ikona-dzis-body.mdx";

export type PublicationFrontmatter = Publication & {
  lead: string;
  hubDescription: string;
  shortTitle: string;
  relatedNewsSlug?: string;
};

export type LoadedPublication = PublicationFrontmatter & {
  aboutParagraphs: string[];
  Content: ComponentType;
};

type PublicationBodyExports = {
  aboutParagraphs: string[];
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

    if (item.author) {
      assertLecturerSlugExists(
        item.author,
        `Publication "${publication.slug}" toc entry "${item.title}"`,
      );
    }
  });
}

// AL3: every entry points at an existing chapter, chapters appear as contiguous runs in
// ascending order, and intro entries precede the chapter's regular entries.
function validatePublicationChapters(publication: PublicationFrontmatter): void {
  const { chapters, toc, slug } = publication;
  if (!chapters) {
    const stray = toc.find((item) => item.chapter !== undefined || item.intro);
    if (stray) {
      throw new Error(
        `Publication "${slug}" toc entry "${stray.title}" uses chapter/intro but publication has no chapters`,
      );
    }
    return;
  }

  toc.forEach((item, index) => {
    const context = `Publication "${slug}" toc entry "${item.title}"`;
    if (item.chapter === undefined || !chapters[item.chapter]) {
      throw new Error(`${context}: missing or unknown chapter index "${item.chapter}"`);
    }

    const previous = index > 0 ? toc[index - 1] : undefined;
    if (!previous || previous.chapter === undefined) {
      return;
    }

    if (item.chapter < previous.chapter) {
      throw new Error(`${context}: chapter ${item.chapter} is not contiguous or out of order`);
    }

    if (item.chapter === previous.chapter && item.intro && !previous.intro) {
      throw new Error(`${context}: intro entry must precede the chapter's regular entries`);
    }
  });
}

publicationEntries.forEach(validatePublicationToc);
publicationEntries.forEach(validatePublicationChapters);

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
    Content: publicationModule.Content,
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
