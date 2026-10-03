"use client";

import { ContentLightbox } from "@/components/lightbox/ContentLightbox";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface WorkshopLightboxProps {
  photos: ContentImage[];
  index: number | null;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function WorkshopLightbox({
  photos,
  index,
  onPrev,
  onNext,
  onClose,
}: WorkshopLightboxProps) {
  return (
    <ContentLightbox
      photos={photos}
      index={index}
      labels={pl.workshop.lightbox}
      dialogClassName="workshop-lightbox-dialog"
      onPrev={onPrev}
      onNext={onNext}
      onClose={onClose}
    />
  );
}
