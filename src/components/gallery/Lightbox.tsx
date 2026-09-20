"use client";

import Image from "next/image";
import { useEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";

import { TextLink } from "@/components/core/TextLink";
import type { IconWork } from "@/content/types";
import { formatLightboxMeta } from "@/i18n/formatLightboxMeta";
import { pl } from "@/i18n/pl";

export interface LightboxProps {
  item: IconWork | null;
  index: number | null;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

/** Horizontal travel (px) of a touch that counts as a swipe. */
const SWIPE_THRESHOLD_PX = 50;

/** Desktop layout (image + meta column, arrows at the window edges) starts here; below it the
 * panel stacks with a sticky Previous / Next bar. Keep in sync with the `lg:` classes below. */
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * The image is capped by window height (80vh desktop, 60svh stacked), so its rendered width
 * follows from the photo's ratio — `sizes` says so and the browser fetches no more than needed.
 */
function getImageRatio(image: IconWork["image"]): string {
  return (image.width / image.height).toFixed(4);
}

function getImageSizes(image: IconWork["image"]): string {
  const ratio = getImageRatio(image);
  return `(min-width: 1024px) min(60vw, calc(80vh * ${ratio})), min(100vw, calc(60svh * ${ratio}))`;
}

function LightboxArrow({ direction }: { direction: "prev" | "next" }) {
  const path = direction === "prev" ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19";

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6 L18 18" />
      <path d="M18 6 L6 18" />
    </svg>
  );
}

/** 48×48 icon button on a translucent card surface — stays visible on any photo edge. */
function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-tap-min w-tap-min flex-none cursor-pointer items-center justify-center border-0 bg-surface-card/80 p-0 text-text-body hover:bg-surface-card"
    >
      {children}
    </button>
  );
}

function MobileNavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-lightbox-mobile-nav-h min-w-0 flex-1 cursor-pointer items-center justify-center gap-space-3 border border-border-button bg-transparent font-sans text-size-ui-m text-text-body"
    >
      {children}
    </button>
  );
}

function LightboxMeta({ item, className }: { item: IconWork; className?: string }) {
  const entries = formatLightboxMeta(item);

  return (
    <div className={["leading-loose", className].filter(Boolean).join(" ")}>
      {entries.map((entry, entryIndex) => {
        if (entry.kind === "line") {
          return (
            <span key={`line-${entryIndex}`} className="block text-size-body text-text-secondary">
              {entry.text}
            </span>
          );
        }

        return (
          <div key={`field-${entryIndex}`} className="block">
            <span className="text-size-caption text-text-tertiary">{entry.label}</span>
            <span className="block text-size-body text-text-secondary">{entry.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Lightbox({ item, index, total, onPrev, onNext, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const isOpen = item !== null && index !== null;
  const positionLabel = index !== null
    ? pl.gallery.lightbox.position
        .replace("{index}", String(index + 1))
        .replace("{total}", String(total))
    : "";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onPrev, onNext]);

  // The panel fills the whole dialog, so the "backdrop" is the empty surface marked with
  // data-lightbox-dismiss — desktop only; on a phone a stray tap must not close the panel.
  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget) {
      onClose();
      return;
    }
    if (target.hasAttribute("data-lightbox-dismiss") && window.matchMedia(DESKTOP_QUERY).matches) {
      onClose();
    }
  };

  // Swipe (touch only): a mostly horizontal drag of 50 px or more goes to the neighbour work.
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartRef.current =
      event.pointerType === "touch" ? { x: event.clientX, y: event.clientY } : null;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) {
      return;
    }
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        onNext();
      } else {
        onPrev();
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-dialog"
      onClick={handleDialogClick}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      aria-label={isOpen && item ? item.title : undefined}
      aria-hidden={!isOpen}
    >
      {item && index !== null ? (
        <div
          data-lightbox-dismiss
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            swipeStartRef.current = null;
          }}
          className="relative flex min-h-full flex-col bg-surface-lightbox font-sans text-text-body lg:items-center lg:justify-center lg:px-space-11"
        >
          <div
            data-lightbox-dismiss
            className="flex justify-end px-page-margin-mobile py-space-3 lg:absolute lg:inset-x-0 lg:top-0 lg:px-space-6 lg:py-space-5"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={pl.gallery.lightbox.closeAria}
              className="flex h-tap-min cursor-pointer items-center justify-center gap-space-2 border-0 bg-surface-card/80 px-space-4 text-size-body text-text-body hover:bg-surface-card lg:w-tap-min lg:px-0"
            >
              <span className="lg:hidden">{pl.gallery.lightbox.close}</span>
              <CloseIcon />
            </button>
          </div>

          <div className="absolute left-space-5 top-1/2 hidden -translate-y-1/2 lg:block">
            <IconButton label={pl.gallery.lightbox.previousAria} onClick={onPrev}>
              <LightboxArrow direction="prev" />
            </IconButton>
          </div>

          <div className="flex flex-1 touch-pan-y flex-col lg:flex-none lg:flex-row lg:items-center lg:gap-space-7">
            <div className="flex justify-center px-page-margin-mobile lg:min-w-0 lg:px-0">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                sizes={getImageSizes(item.image)}
                fetchPriority="high"
                style={{
                  // Explicit size from the window-driven height and the photo's ratio; max-w-full
                  // still wins in a narrow window and the ratio keeps the height in step.
                  width: `calc(var(--lightbox-image-h) * ${getImageRatio(item.image)})`,
                  aspectRatio: `${item.image.width} / ${item.image.height}`,
                }}
                className="block h-auto max-w-full lg:shadow-lightbox"
              />
            </div>

            <div
              aria-live="polite"
              className="px-page-margin-mobile pt-space-5 pb-space-5 lg:min-w-0 lg:p-0"
            >
              <p className="mb-space-3 hidden text-size-ui text-accent-text lg:block">
                {positionLabel}
              </p>
              <h2 className="mb-space-7 font-serif text-size-role-card-title leading-heading text-text-h1 lg:mb-space-8 lg:text-size-role-section-h2">
                {item.title}
              </h2>
              <LightboxMeta item={item} className="mb-space-4 lg:mb-space-5" />
              {item.author === "ejk" ? (
                <TextLink href="/ikony/na-zamowienie" className="text-size-body">
                  {pl.gallery.lightbox.orderLink}
                </TextLink>
              ) : null}
            </div>
          </div>

          <div className="absolute right-space-5 top-1/2 hidden -translate-y-1/2 lg:block">
            <IconButton label={pl.gallery.lightbox.nextAria} onClick={onNext}>
              <LightboxArrow direction="next" />
            </IconButton>
          </div>

          <div className="sticky bottom-0 z-10 flex items-center gap-lightbox-mobile-nav-gap border-t border-line-neutral bg-surface-lightbox px-page-margin-mobile py-space-3 lg:hidden">
            <MobileNavButton onClick={onPrev}>
              <LightboxArrow direction="prev" />
              {pl.gallery.lightbox.previous}
            </MobileNavButton>
            <span className="flex-none text-size-ui-m text-accent-text">{positionLabel}</span>
            <MobileNavButton onClick={onNext}>
              {pl.gallery.lightbox.next}
              <LightboxArrow direction="next" />
            </MobileNavButton>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
