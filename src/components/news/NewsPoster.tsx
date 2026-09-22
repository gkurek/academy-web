import { existsSync } from "node:fs";
import { join } from "node:path";

import Image from "next/image";

import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface NewsPosterProps {
  poster?: ContentImage;
}

function posterFileExists(src: string): boolean {
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function NewsPoster({ poster }: NewsPosterProps) {
  if (!poster) {
    return null;
  }

  const hasFile = posterFileExists(poster.src);

  return (
    <aside className="news-poster" aria-label={poster.alt}>
      {hasFile ? (
        <Image
          src={poster.src}
          alt={poster.alt}
          width={poster.width}
          height={poster.height}
          sizes="(min-width: 768px) 240px, 100vw"
          className="news-poster-image"
        />
      ) : (
        <div className="news-poster-placeholder">
          <p className="news-poster-placeholder-text">{pl.news.posterPlaceholder}</p>
        </div>
      )}
    </aside>
  );
}
