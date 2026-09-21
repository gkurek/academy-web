"use client";

import { LightboxDialogShell } from "@/components/lightbox/LightboxDialogShell";
import { LightboxImage } from "@/components/lightbox/LightboxImage";
import { useLightboxDialog } from "@/components/lightbox/useLightboxDialog";
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
  const photo = index !== null ? photos[index] : null;
  const isOpen = photo !== null && index !== null;
  const labels = pl.workshop.lightbox;
  const positionLabel = index !== null
    ? labels.position
        .replace("{index}", String(index + 1))
        .replace("{total}", String(photos.length))
    : "";

  const {
    dialogRef,
    handleDialogClick,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  } = useLightboxDialog({ isOpen, onClose, onPrev, onNext });

  return (
    <LightboxDialogShell
      dialogRef={dialogRef}
      isOpen={isOpen}
      ariaLabel={isOpen && photo ? photo.alt : undefined}
      dialogClassName="workshop-lightbox-dialog"
      labels={labels}
      positionLabel={positionLabel}
      onClose={onClose}
      onPrev={onPrev}
      onNext={onNext}
      onDialogClick={handleDialogClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      image={
        photo ? (
          <LightboxImage
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
          />
        ) : null
      }
      meta={
        photo ? (
          <div className="workshop-lightbox-meta px-page-margin-mobile pt-space-5 pb-space-5 lg:min-w-0 lg:p-0">
            <p className="mb-space-3 text-size-ui text-accent-text lg:mb-space-4">{positionLabel}</p>
            {photo.caption ? (
              <p className="font-serif text-size-body leading-loose text-text-secondary">{photo.caption}</p>
            ) : null}
          </div>
        ) : null
      }
    />
  );
}
