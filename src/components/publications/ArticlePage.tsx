import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { ArticleSourceBlock } from "@/components/publications/ArticleSourceBlock";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import type { LoadedArticle } from "@/content/articles";
import { getPublicationBySlug } from "@/content/publications";
import { pl } from "@/i18n/pl";
import { footerSitemap } from "@/navigation";

export interface ArticlePageProps {
  article: LoadedArticle;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const publicationsLabel = footerSitemap.find((item) => item.href === "/publikacje")!.label;
  const publication =
    article.source.kind === "album"
      ? getPublicationBySlug(article.source.publicationSlug)
      : undefined;
  const { Content } = article;

  return (
    <SectionPageShell active={publicationsLabel}>
      <article className="mx-auto w-full max-w-content-max publication-page publication-article">
        <Breadcrumb
          items={[
            { label: pl.publications.breadcrumbHome, href: "/" },
            { label: publicationsLabel, href: "/publikacje" },
            { label: article.title },
          ]}
        />

        <header className="publication-article-header">
          <h1 className="publication-article-title">{article.title}</h1>
          <ArticleSourceBlock article={article} publication={publication} variant="meta" />
        </header>

        <div className="publication-article-body text-page-mdx">
          <Content />
        </div>

        <ArticleSourceBlock article={article} publication={publication} variant="footer" />
      </article>
    </SectionPageShell>
  );
}
