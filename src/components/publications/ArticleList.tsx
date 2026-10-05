import Link from "next/link";

import {
  formatArticleAuthors,
  describeArticleSource,
  type ArticleFrontmatter,
  type ArticleSourceLabel,
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
            <ArticleSourceText label={describeArticleSource(article.source)} />
          </p>
          <h3 className="list-title publication-article-list-title">
            <Link href={`/publikacje/${article.slug}`} className="publication-article-list-title-link">
              <span className="link-underline-target link-underline-target--border">{article.title}</span>
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

function ArticleSourceText({ label }: { label: ArticleSourceLabel }) {
  if (label.kind === "text") {
    return label.text;
  }

  return (
    <>
      {label.before}
      <span className="publication-album-short-title">«{label.title}»</span>
      {label.after}
    </>
  );
}
