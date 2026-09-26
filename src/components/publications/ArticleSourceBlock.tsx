import Image from "next/image";

import { ExternalLink } from "@/components/core/ExternalLink";
import { TextLink } from "@/components/core/TextLink";
import {
  formatArticleAuthors,
  type LoadedArticle,
} from "@/content/articles";
import type { PublicationFrontmatter } from "@/content/publications";
import { formatPublicationPrice } from "@/content/publications";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { pluralize } from "@/i18n/pluralize";
import { buildMailtoHref } from "@/lib/mailto";
import { formatDateRange } from "@/lib/formatDateRange";

export interface ArticleSourceBlockProps {
  article: LoadedArticle;
  publication?: PublicationFrontmatter;
  variant: "meta" | "footer";
}

export function ArticleSourceBlock({ article, publication, variant }: ArticleSourceBlockProps) {
  if (variant === "meta") {
    return <ArticleSourceMeta article={article} publication={publication} />;
  }

  if (article.source.kind === "album" && publication) {
    return <AlbumBackref publication={publication} />;
  }

  if (article.source.kind === "media") {
    return <PressFooter article={article} />;
  }

  return null;
}

function ArticleSourceMeta({
  article,
  publication,
}: {
  article: LoadedArticle;
  publication?: PublicationFrontmatter;
}) {
  const authors = formatArticleAuthors(article.authors);

  return (
    <div className="publication-article-meta-block">
      <p className="publication-article-meta-line">
        {authors} · {article.year}
      </p>
      {article.source.kind === "album" && publication ? (
        <p className="publication-article-meta-source">
          {pl.publications.sourceAlbumMeta}{" "}
          <em className="publication-album-short-title">{publication.shortTitle}</em>
        </p>
      ) : null}
      {article.source.kind === "media" ? (
        <p className="publication-article-meta-source">
          {pl.publications.sourcePressFirstPrint
            .replace("{title}", article.title)
            .replace(
              "{date}",
              formatDateRange(article.source.date, undefined, { withYear: true }),
            )}
        </p>
      ) : null}
    </div>
  );
}

function AlbumBackref({ publication }: { publication: PublicationFrontmatter }) {
  const settings = getSiteSettings();
  const secretariatEmail = settings.emails.find((email) => email.label.includes("sekretariat"))
    ?.address ?? settings.emails[1]?.address ?? settings.emails[0].address;
  const mailtoHref = buildMailtoHref(secretariatEmail, pl.publications.mailtoSubject);
  const priceLabel = formatPublicationPrice(publication.price);
  const pageWord = pluralize(publication.pages, ["strona", "strony", "stron"]);
  const factsLine = pl.publications.articleSourceAlbumFacts
    .replace("{pages}", String(publication.pages))
    .replace("{pageWord}", pageWord)
    .replace("{format}", publication.format)
    .replace("{price}", priceLabel ?? "");

  return (
    <aside className="publication-album-backref">
      <div className="publication-album-backref-cover">
        <Image
          src={publication.cover.src}
          alt={publication.cover.alt}
          width={publication.cover.width}
          height={publication.cover.height}
          className="publication-album-backref-image"
        />
      </div>
      <div className="publication-album-backref-body">
        <p className="publication-album-backref-heading">{pl.publications.articleSourceHeading}</p>
        <p className="publication-album-backref-text">
          {pl.publications.articleSourceAlbumSentence.replace("{title}", publication.title)}
        </p>
        <p className="publication-album-backref-facts">{factsLine}</p>
        <div className="publication-album-backref-links">
          <TextLink href={`/publikacje/${publication.slug}`}>
            {pl.publications.articleSourceViewAlbum}
          </TextLink>
          <TextLink href={mailtoHref}>{pl.publications.articleSourceOrder}</TextLink>
        </div>
      </div>
    </aside>
  );
}

function PressFooter({ article }: { article: LoadedArticle }) {
  const { source } = article;
  if (source.kind !== "media" || !source.url) {
    return null;
  }

  return (
    <aside className="publication-press-note">
      <ExternalLink href={source.url} className="publication-press-note-link">
        {pl.publications.articlePressReadPublisher}
      </ExternalLink>
    </aside>
  );
}
