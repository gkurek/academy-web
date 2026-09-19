"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

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

function NavButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "flex flex-none items-center justify-center border-0 bg-transparent p-0",
        "h-tap-min w-tap-min cursor-pointer text-text-body",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      className="flex h-lightbox-mobile-nav-h w-full items-center justify-center gap-space-3 border border-border-button bg-transparent text-size-ui-m text-text-body cursor-pointer font-sans"
    >
      {children}
    </button>
  );
}

function LightboxMeta({ item, className }: { item: IconWork; className?: string }) {
  const lines = formatLightboxMeta(item);

  return (
    <div className={["text-size-body leading-loose text-text-secondary", className].filter(Boolean).join(" ")}>
      {lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="block">
          {line}
        </span>
      ))}
    </div>
  );
}

export function Lightbox({ item, index, total, onPrev, onNext, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
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

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      aria-label={isOpen && item ? item.title : undefined}
      aria-hidden={!isOpen}
    >
      {item && index !== null ? (
        <div className="min-h-screen w-full bg-surface-lightbox text-text-body font-sans">
          <div className="hidden md:flex relative min-h-screen items-center justify-center">
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-space-6 py-space-5 text-size-ui text-text-tertiary">
              <span>{positionLabel}</span>
              <NavButton label={pl.gallery.lightbox.closeAria} onClick={onClose} className="-m-space-3">
                <CloseIcon />
              </NavButton>
            </div>

            <div className="flex items-center gap-space-7 px-space-6">
              <NavButton label={pl.gallery.lightbox.previousAria} onClick={onPrev}>
                <LightboxArrow direction="prev" />
              </NavButton>

              <div className="flex items-center gap-space-7">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  sizes="(min-width: 768px) 460px, 100vw"
                  className="block max-h-lightbox-image w-auto shadow-lightbox"
                  priority
                />
                <div className="w-lightbox-meta shrink-0">
                  <h2 className="font-serif text-size-role-section-h2 leading-heading text-text-h1 mb-space-3">
                    {item.title}
                  </h2>
                  <LightboxMeta item={item} className="mb-space-5" />
                  <TextLink href="/ikony/na-zamowienie" className="text-size-body">
                    {pl.gallery.lightbox.orderLink}
                  </TextLink>
                </div>
              </div>

              <NavButton label={pl.gallery.lightbox.nextAria} onClick={onNext}>
                <LightboxArrow direction="next" />
              </NavButton>
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex items-center justify-between px-page-margin-mobile py-space-4">
              <span className="text-size-body text-text-tertiary">{positionLabel}</span>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-space-2 border-0 bg-transparent p-0 text-size-body text-text-body cursor-pointer min-h-tap-min min-w-tap-min"
              >
                {pl.gallery.lightbox.close}
                <CloseIcon />
              </button>
            </div>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              sizes="100vw"
              className="block w-full h-auto"
              priority
            />
            <div className="px-page-margin-mobile pt-space-5 pb-space-2">
              <h2 className="font-serif text-size-role-card-title leading-heading text-text-h1 mb-space-2">
                {item.title}
              </h2>
              <LightboxMeta item={item} className="mb-space-4" />
              <TextLink href="/ikony/na-zamowienie" className="text-size-body">
                {pl.gallery.lightbox.orderLink}
              </TextLink>
            </div>
            <div className="grid grid-cols-2 gap-lightbox-mobile-nav-gap px-page-margin-mobile pt-space-5 pb-space-6">
              <MobileNavButton onClick={onPrev}>
                <LightboxArrow direction="prev" />
                {pl.gallery.lightbox.previous}
              </MobileNavButton>
              <MobileNavButton onClick={onNext}>
                {pl.gallery.lightbox.next}
                <LightboxArrow direction="next" />
              </MobileNavButton>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
