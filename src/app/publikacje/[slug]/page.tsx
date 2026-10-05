import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage } from "@/components/publications/ArticlePage";
import { PublicationAlbumPage } from "@/components/publications/PublicationAlbumPage";
import { getArticles, loadArticleBySlug } from "@/content/articles";
import { getPublications, loadPublicationBySlug } from "@/content/publications";

// Every slug is known at build time; unknown ones are a static 404.
export const dynamicParams = false;

type PublicationSlugRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const publicationSlugs = getPublications().map((publication) => ({ slug: publication.slug }));
  const articleSlugs = getArticles().map((article) => ({ slug: article.slug }));

  return [...publicationSlugs, ...articleSlugs];
}

export async function generateMetadata({ params }: PublicationSlugRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = loadPublicationBySlug(slug);
  const article = publication ? undefined : loadArticleBySlug(slug);
  const title = publication?.title ?? article?.title;

  if (!title) {
    return {};
  }

  return { title };
}

export default async function PublicationSlugRoute({ params }: PublicationSlugRouteProps) {
  const { slug } = await params;
  const path = `/publikacje/${slug}`;
  const publication = loadPublicationBySlug(slug);

  if (publication) {
    return <PublicationAlbumPage publication={publication} path={path} />;
  }

  const article = loadArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} path={path} />;
}
