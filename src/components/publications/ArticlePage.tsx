import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { ArticleSourceBlock } from "@/components/publications/ArticleSourceBlock";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import type { LoadedArticle } from "@/content/articles";
import { getPublicationBySlug } from "@/content/publications";
import { pl } from "@/i18n/pl";
import { publicationsLink } from "@/navigation";
import { PageHeading } from "@/components/core/PageHeading";
import { Prose } from "@/components/core/Prose";

export interface ArticlePageProps {
  article: LoadedArticle;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

export function ArticlePage({ article, path }: ArticlePageProps) {
  const publication =
    article.source.kind === "album"
      ? getPublicationBySlug(article.source.publicationSlug)
      : undefined;
  const { Content } = article;

  return (
    <SectionPageShell path={path}>
      <article className="publication-page publication-article">
        <Breadcrumb
          items={[
            { label: pl.publications.breadcrumbHome, href: "/" },
            { label: publicationsLink.label, href: publicationsLink.href },
            { label: article.title },
          ]}
        />

        <header className="publication-article-header">
          <PageHeading level="page" className="mb-space-4">{article.title}</PageHeading>
          <ArticleSourceBlock article={article} publication={publication} variant="meta" />
        </header>

        <Prose variant="text" className="publication-article-body">
          <Content />
        </Prose>

        <ArticleSourceBlock article={article} publication={publication} variant="footer" />
      </article>
    </SectionPageShell>
  );
}
