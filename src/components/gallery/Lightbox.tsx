"use client";

import { TextLink } from "@/components/core/TextLink";
import { LightboxDialogShell } from "@/components/lightbox/LightboxDialogShell";
import { LightboxImage } from "@/components/lightbox/LightboxImage";
import { useLightboxDialog } from "@/components/lightbox/useLightboxDialog";
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

function LightboxMeta({ item, className }: { item: IconWork; className?: string }) {
  const entries = formatLightboxMeta(item);

  return (
    <div className={["leading-loose", className].filter(Boolean).join(" ")}>
      {entries.map((entry, entryIndex) => (
        <div key={`field-${entryIndex}`} className="block">
          <span className="text-size-caption text-text-tertiary">{entry.label}</span>
          <span className="block text-size-body text-text-secondary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Lightbox({ item, index, total, onPrev, onNext, onClose }: LightboxProps) {
  const isOpen = item !== null && index !== null;
  const labels = pl.gallery.lightbox;
  const positionLabel = index !== null
    ? labels.position
        .replace("{index}", String(index + 1))
        .replace("{total}", String(total))
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
      ariaLabel={isOpen && item ? item.title : undefined}
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
        item ? (
          <LightboxImage
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
          />
        ) : null
      }
      meta={
        item ? (
          <div className="px-page-margin-mobile pt-space-5 pb-space-5 lg:min-w-0 lg:p-0">
            <p className="mb-space-3 hidden text-size-ui text-accent-text lg:block">{positionLabel}</p>
            <h2 className="mb-space-7 font-serif text-size-role-card-title leading-heading text-text-h1 lg:mb-space-8 lg:text-size-role-section-h2">
              {item.title}
            </h2>
            <LightboxMeta item={item} className="mb-space-4 lg:mb-space-5" />
            {item.author === "ejk" ? (
              <TextLink
                href="/ikony/na-zamowienie"
                className="inline-flex min-h-tap-min-mobile-header items-center text-size-body"
              >
                {labels.orderLink}
              </TextLink>
            ) : null}
          </div>
        ) : null
      }
    />
  );
}
