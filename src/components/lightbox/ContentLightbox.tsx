"use client";

import type { ReactNode } from "react";

import {
  LightboxDialogShell,
  type LightboxControlLabels,
} from "@/components/lightbox/LightboxDialogShell";
import { LightboxImage } from "@/components/lightbox/LightboxImage";
import { useLightboxDialog } from "@/components/lightbox/useLightboxDialog";
import type { Image as ContentImage } from "@/content/types";

export interface ContentLightboxProps {
  photos: ContentImage[];
  index: number | null;
  labels: LightboxControlLabels;
  dialogClassName?: string;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  renderExtra?: (photo: ContentImage) => ReactNode;
}

export function ContentLightbox({
  photos,
  index,
  labels,
  dialogClassName,
  onPrev,
  onNext,
  onClose,
  renderExtra,
}: ContentLightboxProps) {
  const photo = index !== null ? photos[index] : null;
  const isOpen = photo !== null && index !== null;
  const slideCount = photos.length;
  const showNavigation = slideCount > 1;
  const positionLabel = index !== null
    ? labels.position
        .replace("{index}", String(index + 1))
        .replace("{total}", String(slideCount))
    : "";

  const {
    dialogRef,
    handleDialogClick,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  } = useLightboxDialog({
    isOpen,
    onClose,
    onPrev,
    onNext,
    enableNavigation: showNavigation,
  });

  const shellClassName = ["lightbox-dialog--content", dialogClassName].filter(Boolean).join(" ");

  return (
    <LightboxDialogShell
      dialogRef={dialogRef}
      isOpen={isOpen}
      ariaLabel={isOpen && photo ? photo.alt : undefined}
      dialogClassName={shellClassName}
      layoutVariant="content"
      showNavigation={showNavigation}
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
          <div className="lightbox-content-meta px-page-margin-mobile pt-space-5 pb-space-5 lg:px-0 lg:pb-space-6">
            {showNavigation ? (
              <p className="mb-space-3 text-size-ui text-accent-text">{positionLabel}</p>
            ) : null}
            {photo.caption ? (
              <p className="font-serif text-size-body leading-loose text-text-secondary">{photo.caption}</p>
            ) : null}
            {renderExtra ? renderExtra(photo) : null}
          </div>
        ) : null
      }
    />
  );
}
