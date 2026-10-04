"use client";

import Image from "next/image";
import { useCallback, useState, type CSSProperties } from "react";

import { WorkshopLightbox } from "@/components/text/WorkshopLightbox";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = images.length;
  const ratio = image.width / image.height;

  const handleOpen = useCallback(() => {
    setOpenIndex(lightboxIndex);
  }, [lightboxIndex]);

  const handleClose = useCallback(() => {
    setOpenIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setOpenIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current - 1 + total) % total;
    });
  }, [total]);

  const handleNext = useCallback(() => {
    setOpenIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current + 1) % total;
    });
  }, [total]);

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
        onClick={handleOpen}
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
      <WorkshopLightbox
        photos={images}
        index={openIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
      />
    </div>
  );
}
