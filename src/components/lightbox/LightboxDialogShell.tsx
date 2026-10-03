"use client";

import type { MouseEvent, PointerEvent, ReactNode, RefObject } from "react";

import {
  LightboxArrow,
  LightboxCloseIcon,
  LightboxIconButton,
  LightboxMobileNavButton,
} from "@/components/lightbox/LightboxControls";

export type LightboxControlLabels = {
  close: string;
  closeAria: string;
  previous: string;
  previousAria: string;
  next: string;
  nextAria: string;
  position: string;
};

export type LightboxLayoutVariant = "icons" | "content";

export interface LightboxDialogShellProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  ariaLabel?: string;
  dialogClassName?: string;
  layoutVariant?: LightboxLayoutVariant;
  /** When false, hides prev/next and the mobile nav bar (D4 — single slide). */
  showNavigation?: boolean;
  labels: LightboxControlLabels;
  positionLabel: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDialogClick: (event: MouseEvent<HTMLDialogElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: () => void;
  image: ReactNode;
  meta: ReactNode;
}

export function LightboxDialogShell({
  dialogRef,
  isOpen,
  ariaLabel,
  dialogClassName,
  layoutVariant = "icons",
  showNavigation = true,
  labels,
  positionLabel,
  onClose,
  onPrev,
  onNext,
  onDialogClick,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  image,
  meta,
}: LightboxDialogShellProps) {
  const dialogClasses = ["lightbox-dialog", dialogClassName].filter(Boolean).join(" ");
  const isContentLayout = layoutVariant === "content";

  return (
    <dialog
      ref={dialogRef}
      className={dialogClasses}
      onClick={onDialogClick}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      aria-label={ariaLabel}
      aria-hidden={!isOpen}
    >
      {isOpen ? (
        <div
          data-lightbox-dismiss
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className="relative flex min-h-full flex-col bg-surface-lightbox font-sans text-text-body lg:items-center lg:justify-center lg:px-space-11"
        >
          <div
            data-lightbox-dismiss
            className="flex justify-end px-page-margin-mobile py-space-3 lg:absolute lg:inset-x-0 lg:top-0 lg:px-space-6 lg:py-space-5"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={labels.closeAria}
              className="flex h-tap-min cursor-pointer items-center justify-center gap-space-2 border-0 bg-surface-card/80 px-space-4 text-size-body text-text-body hover:bg-surface-card lg:w-tap-min lg:px-0"
            >
              <span className="lg:hidden">{labels.close}</span>
              <LightboxCloseIcon />
            </button>
          </div>

          {showNavigation ? (
            <div className="absolute left-space-5 top-1/2 hidden -translate-y-1/2 lg:block">
              <LightboxIconButton label={labels.previousAria} onClick={onPrev}>
                <LightboxArrow direction="prev" />
              </LightboxIconButton>
            </div>
          ) : null}

          {isContentLayout ? (
            <div className="flex flex-1 touch-pan-y flex-col items-center justify-center px-page-margin-mobile lg:flex-none lg:px-0">
              <div className="flex w-full justify-center">{image}</div>
              <div aria-live="polite" className="w-full">{meta}</div>
            </div>
          ) : (
            <div className="flex flex-1 touch-pan-y flex-col lg:flex-none lg:flex-row lg:items-center lg:gap-space-7">
              <div className="flex justify-center px-page-margin-mobile lg:min-w-0 lg:px-0">{image}</div>
              <div aria-live="polite">{meta}</div>
            </div>
          )}

          {showNavigation ? (
            <div className="absolute right-space-5 top-1/2 hidden -translate-y-1/2 lg:block">
              <LightboxIconButton label={labels.nextAria} onClick={onNext}>
                <LightboxArrow direction="next" />
              </LightboxIconButton>
            </div>
          ) : null}

          {showNavigation ? (
            <div className="sticky bottom-0 z-10 flex items-center gap-lightbox-mobile-nav-gap border-t border-line-neutral bg-surface-lightbox px-page-margin-mobile py-space-3 lg:hidden">
              <LightboxMobileNavButton onClick={onPrev}>
                <LightboxArrow direction="prev" />
                {labels.previous}
              </LightboxMobileNavButton>
              {isContentLayout ? (
                <span className="flex-1" aria-hidden="true" />
              ) : (
                <span className="flex-none text-size-ui-m text-accent-text">{positionLabel}</span>
              )}
              <LightboxMobileNavButton onClick={onNext}>
                {labels.next}
                <LightboxArrow direction="next" />
              </LightboxMobileNavButton>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
