import { plainText } from "@/lib/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/core/JsonLd";
import { ArticlePage } from "@/components/publications/ArticlePage";
import { PublicationAlbumPage } from "@/components/publications/PublicationAlbumPage";
import { getArticles, loadArticleBySlug } from "@/content/articles";
import { getArticleAlbum, getPublications, loadPublicationBySlug } from "@/content/publications";
import { getDefaultOgImage } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { articleNode, bookNode } from "@/lib/structured-data/publications";

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
  const path = `/publikacje/${slug}`;
  const publication = loadPublicationBySlug(slug);

  if (publication) {
    return pageMetadata({
      path,
      title: plainText(publication.title),
      description: plainText(publication.lead),
      image: publication.cover,
    });
  }

  const article = loadArticleBySlug(slug);
  if (!article) {
    return {};
  }

  // Album texts share the album cover (K-156); media articles have no image of their own.
  const album = getArticleAlbum(article);

  return pageMetadata({
    path,
    title: plainText(article.title),
    description: plainText(article.excerpt),
    image: album?.cover ?? getDefaultOgImage(),
  });
}

export default async function PublicationSlugRoute({ params }: PublicationSlugRouteProps) {
  const { slug } = await params;
  const path = `/publikacje/${slug}`;
  const publication = loadPublicationBySlug(slug);

  if (publication) {
    return (
      <>
        <JsonLd data={bookNode(publication)} />
        <PublicationAlbumPage publication={publication} path={path} />
      </>
    );
  }

  const article = loadArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLd data={articleNode(article, getArticleAlbum(article))} />
      <ArticlePage article={article} path={path} />
    </>
  );
}
