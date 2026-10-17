"use client";

import { Lightbox } from "@/components/lightbox/Lightbox";
import { useLightboxIndex } from "@/components/lightbox/useLightboxIndex";
import type { Image as ContentImage } from "@/content/types";

export interface LecturesGalleryLinkProps {
  label: string;
  photos: ContentImage[];
}

/** Text-link look-alike button that opens the standard lightbox over the lectures photo gallery. */
export function LecturesGalleryLink({ label, photos }: LecturesGalleryLinkProps) {
  const lightbox = useLightboxIndex(photos.length);

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="text-link text-accent-text no-underline hover:text-accent-hover tap-target-below-lg cursor-pointer shrink-0"
        onClick={() => lightbox.open(0)}
      >
        <span className="link-underline-target link-underline-target--border">{label}</span>
      </button>
      <Lightbox
        photos={photos}
        index={lightbox.index}
        onPrev={lightbox.prev}
        onNext={lightbox.next}
        onClose={lightbox.close}
      />
    </>
  );
}
