import { plainText } from "@/lib/typography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticlePage } from "@/components/news/NewsArticlePage";
import { getNews, loadNewsBySlug } from "@/content/news";

// Event phase (zapowiedź / relacja) depends on the date — rebuild daily like `/` (K-85, B9).
export const revalidate = 86400;
// Every slug is known at build time; unknown ones are a static 404.
export const dynamicParams = false;

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
    title: plainText(entry.title),
  };
}

export default async function NewsArticleRoute({ params }: NewsArticleRouteProps) {
  const { slug } = await params;
  const entry = loadNewsBySlug(slug);

  if (!entry) {
    notFound();
  }

  return <NewsArticlePage entry={entry} path={`/aktualnosci/${slug}`} />;
}
