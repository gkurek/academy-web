import type { Article, Publication } from "@/content/types";
import { absoluteUrl, CONTEXT, type JsonLdNode } from "@/lib/structured-data/site";

function publicationPath(slug: string): string {
  return `/publikacje/${slug}`;
}

function bookId(slug: string): string {
  return `${absoluteUrl(publicationPath(slug))}#book`;
}

/** `Book` with its chapters as `hasPart` (B2, K-137); an offer only while it is on sale. */
export function bookNode(publication: Publication): JsonLdNode {
  const url = absoluteUrl(publicationPath(publication.slug));
  const onSale = publication.price !== undefined && publication.availability === "dostepny";

  return {
    "@context": CONTEXT,
    "@type": "Book",
    "@id": bookId(publication.slug),
    name: publication.title,
    url,
    image: absoluteUrl(publication.cover.src),
    inLanguage: "pl",
    datePublished: String(publication.year),
    numberOfPages: publication.pages,
    publisher: { "@type": "Organization", name: publication.publisher },
    ...(publication.isbn ? { isbn: publication.isbn } : {}),
    ...(onSale
      ? {
          offers: {
            "@type": "Offer",
            price: String(publication.price),
            priceCurrency: "PLN",
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
    ...(publication.chapters
      ? {
          hasPart: publication.chapters.map((chapter) => ({
            "@type": "Chapter",
            ...(chapter.title ? { name: chapter.title } : {}),
            pagination: chapter.pages,
          })),
        }
      : {}),
  };
}

/** `Article`; a text from the album points at its `Book` and shares its cover. */
export function articleNode(article: Article, album: Publication | undefined): JsonLdNode {
  const datePublished = article.source.kind === "media" ? article.source.date : String(article.year);

  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: absoluteUrl(publicationPath(article.slug)),
    inLanguage: "pl",
    datePublished,
    author: article.authors.map((author) => ({ "@type": "Person", name: author.name })),
    ...(album ? { isPartOf: { "@id": bookId(album.slug) }, image: absoluteUrl(album.cover.src) } : {}),
  };
}
