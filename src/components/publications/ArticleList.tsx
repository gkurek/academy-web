import Link from "next/link";

import {
  formatArticleAuthors,
  formatArticleSourceLabel,
  type ArticleFrontmatter,
} from "@/content/articles";
import { pl } from "@/i18n/pl";

export interface ArticleListProps {
  articles: ArticleFrontmatter[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <ul className="publication-article-list">
      {articles.map((article) => (
        <li key={article.slug} className="publication-article-item">
          <p className="publication-article-source">
            <ArticleSourceLabel sourceLabel={formatArticleSourceLabel(article.source)} />
          </p>
          <h3 className="publication-article-list-title">
            <Link href={`/publikacje/${article.slug}`} className="publication-article-list-title-link">
              {article.title}
            </Link>
          </h3>
          <p className="publication-article-excerpt">{article.excerpt}</p>
          <p className="publication-article-authors">
            {formatArticleAuthors(article.authors)}
            {article.sample ? (
              <>
                {" · "}
                <span className="publication-sample-tag">{pl.publications.sampleTag}</span>
              </>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
}

function ArticleSourceLabel({ sourceLabel }: { sourceLabel: string }) {
  const albumPrefix = "Z albumu ";
  if (sourceLabel.startsWith(albumPrefix)) {
    const rest = sourceLabel.slice(albumPrefix.length);
    const separatorIndex = rest.lastIndexOf(" · ");
    const title = separatorIndex >= 0 ? rest.slice(0, separatorIndex) : rest;
    const year = separatorIndex >= 0 ? rest.slice(separatorIndex + 3) : "";

    return (
      <>
        {albumPrefix}
        <em className="publication-album-short-title">{title}</em>
        {year ? ` · ${year}` : null}
      </>
    );
  }

  return sourceLabel;
}
