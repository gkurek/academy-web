import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage } from "@/components/publications/ArticlePage";
import { PublicationAlbumPage } from "@/components/publications/PublicationAlbumPage";
import { articleModules } from "@/content/articles-registry";
import { loadArticleBySlug } from "@/content/articles";
import { getPublications, loadPublicationBySlug } from "@/content/publications";

type PublicationSlugRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const publicationSlugs = getPublications().map((publication) => ({ slug: publication.slug }));
  const articleSlugs = Object.keys(articleModules).map((slug) => ({ slug }));

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
  const publication = loadPublicationBySlug(slug);

  if (publication) {
    return <PublicationAlbumPage publication={publication} />;
  }

  const article = loadArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
