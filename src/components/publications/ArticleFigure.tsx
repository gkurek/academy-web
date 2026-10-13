import Image from "next/image";

export interface ArticleFigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/**
 * In-text article photo — keeps the source aspect ratio (no crop, unlike OfferFigure),
 * spans the article column (`--publication-article-max`).
 */
export function ArticleFigure({ src, alt, width, height, caption }: ArticleFigureProps) {
  return (
    <figure className="article-figure">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 720px, 100vw"
        className="article-figure-image"
      />
      {caption && <figcaption className="article-figure-caption">{caption}</figcaption>}
    </figure>
  );
}
