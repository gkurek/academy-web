import type { ComponentType } from "react";

import type { Article, ArticleSource, Author } from "@/content/types";
import { assertLecturerSlugExists, getAuthorDisplayName } from "@/content/authors";
import { articleModules } from "@/content/articles-registry";
import { getPublicationBySlug } from "@/content/publications";
import { pl } from "@/i18n/pl";

export type ArticleFrontmatter = Article;

export type LoadedArticle = ArticleFrontmatter & {
  Content: ComponentType;
};

const articleEntries = Object.values(articleModules).map((module) => module.frontmatter);

articleEntries.forEach((article) => {
  article.authors.forEach((author) => {
    assertLecturerSlugExists(author, `Article "${article.slug}"`);
  });
});

function compareByYearDesc(a: ArticleFrontmatter, b: ArticleFrontmatter): number {
  return b.year - a.year;
}

export function getArticles(): ArticleFrontmatter[] {
  return [...articleEntries].sort(compareByYearDesc);
}

export function loadArticleBySlug(slug: string): LoadedArticle | undefined {
  const articleModule = articleModules[slug];
  if (!articleModule) {
    return undefined;
  }

  const { source } = articleModule.frontmatter;
  if (source.kind === "album") {
    const publication = getPublicationBySlug(source.publicationSlug);
    if (!publication) {
      throw new Error(
        `Article "${slug}" references missing publication "${source.publicationSlug}"`,
      );
    }
  }

  return {
    ...articleModule.frontmatter,
    Content: articleModule.Content,
  };
}

export function formatArticleAuthors(authors: Author[]): string {
  return authors.map((author) => getAuthorDisplayName(author)).join(", ");
}

/**
 * Source line of an article in lists. An album source keeps the album title apart so the
 * view can set it in italics without parsing the finished string.
 */
export type ArticleSourceLabel =
  | { kind: "text"; text: string }
  | { kind: "album"; before: string; title: string; after: string };

export function describeArticleSource(source: ArticleSource): ArticleSourceLabel {
  if (source.kind === "album") {
    const publication = getPublicationBySlug(source.publicationSlug);
    const title = publication?.shortTitle ?? publication?.title ?? pl.publications.albumFallback;
    const [before, after = ""] = pl.publications.sourceFromAlbum.split("{title}");
    return {
      kind: "album",
      before,
      title,
      after: after.replace("{year}", String(publication?.year ?? "")),
    };
  }

  const year = source.date.slice(0, 4);
  return {
    kind: "text",
    text: pl.publications.sourceFromMedia
      .replace("{outlet}", source.outlet)
      .replace("{year}", year),
  };
}
