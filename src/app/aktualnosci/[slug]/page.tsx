import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticlePage } from "@/components/news/NewsArticlePage";
import { getNews, loadNewsBySlug } from "@/content/news";
import { pl } from "@/i18n/pl";

type NewsArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getNews().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: NewsArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = loadNewsBySlug(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
  };
}

export default async function NewsArticleRoute({ params }: NewsArticleRouteProps) {
  const { slug } = await params;
  const entry = loadNewsBySlug(slug);

  if (!entry) {
    notFound();
  }

  return <NewsArticlePage entry={entry} active={pl.header.newsLink} />;
}
