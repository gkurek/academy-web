"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { ZoomIcon } from "@/components/core/icons";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface NewsArticleCoverProps {
  image: ContentImage;
  images: ContentImage[];
  lightboxIndex: number;
}

function formatEnlargeAria(index: number, total: number): string {
  return pl.news.enlargePhotoAria
    .replace("{n}", String(index + 1))
    .replace("{total}", String(total));
}

export function NewsArticleCover({ image, images, lightboxIndex }: NewsArticleCoverProps) {
  const { openPhoto } = useLightbox();
  const total = images.length;
  const ratio = image.width / image.height;

  return (
    <div
      className="news-article-cover"
      style={
        {
          "--entry-cover-ratio": String(ratio),
        } as CSSProperties
      }
    >
      <button
        type="button"
        className="news-article-cover-tile"
        onClick={() => openPhoto(images, lightboxIndex)}
        aria-label={formatEnlargeAria(lightboxIndex, total)}
      >
        <span className="news-article-cover-frame">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 30vw, 0px"
            className="news-article-cover-image"
          />
          <span className="news-article-cover-zoom" aria-hidden="true">
            <ZoomIcon size={20} />
          </span>
        </span>
      </button>
    </div>
  );
}
