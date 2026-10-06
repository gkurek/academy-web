"use client";

import type { ReactNode } from "react";

import {
  LightboxDialogShell,
  type LightboxLayoutVariant,
} from "@/components/lightbox/LightboxDialogShell";
import { LightboxImage } from "@/components/lightbox/LightboxImage";
import { LightboxPreload } from "@/components/lightbox/LightboxPreload";
import { useLightboxDialog } from "@/components/lightbox/useLightboxDialog";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

interface LightboxMetaContext {
  photo: ContentImage;
  index: number;
  positionLabel: string;
}

export interface LightboxProps {
  photos: ContentImage[];
  index: number | null;
  /** `icons`: photo with a side panel of meta; `content` (default): centered photo and position. */
  variant?: LightboxLayoutVariant;
  /** Accessible name of the dialog; defaults to the photo's alt. */
  ariaLabel?: string;
  /** Replaces the default meta (position label) for the open photo. */
  meta?: (context: LightboxMetaContext) => ReactNode;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function Lightbox({
  photos,
  index,
  variant = "content",
  ariaLabel,
  meta,
  onPrev,
  onNext,
  onClose,
}: LightboxProps) {
  const photo = index !== null ? photos[index] ?? null : null;
  const isOpen = photo !== null && index !== null;
  const total = photos.length;
  const showNavigation = total > 1;
  const labels = pl.lightbox;
  const positionLabel =
    index !== null
      ? labels.position.replace("{index}", String(index + 1)).replace("{total}", String(total))
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

  const metaNode =
    photo !== null && index !== null ? (
      meta ? (
        meta({ photo, index, positionLabel })
      ) : (
        <div className="lightbox-content-meta px-page-margin-mobile pt-space-5 pb-space-5 lg:px-0 lg:pb-space-6">
          {showNavigation ? <p className="text-size-ui text-accent-text">{positionLabel}</p> : null}
        </div>
      )
    ) : null;

  return (
    <LightboxDialogShell
      dialogRef={dialogRef}
      isOpen={isOpen}
      ariaLabel={photo ? ariaLabel ?? photo.alt : undefined}
      dialogClassName={variant === "content" ? "lightbox-dialog--content" : undefined}
      layoutVariant={variant}
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
        photo && index !== null ? (
          <>
            <LightboxImage src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} />
            <LightboxPreload photos={photos} index={index} />
          </>
        ) : null
      }
      meta={metaNode}
    />
  );
}
