"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

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

function NewsArticleCoverZoomIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15 L20 20" />
    </svg>
  );
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
            <NewsArticleCoverZoomIcon />
          </span>
        </span>
      </button>
    </div>
  );
}
