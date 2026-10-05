import { pl } from "@/i18n/pl";

export interface MapBlockProps {
  /** Google Maps embed URL; without it, renders an empty tile with a short note. */
  embedSrc?: string;
}

export function MapBlock({ embedSrc }: MapBlockProps) {
  if (!embedSrc) {
    return (
      <div className="flex h-contact-map-m md:h-contact-map items-center justify-center bg-surface-tile px-page-margin-mobile text-center text-size-ui text-text-tertiary md:px-space-6">
        {pl.contact.mapPlaceholder}
      </div>
    );
  }

  return (
    <iframe
      src={embedSrc}
      title={pl.contact.mapTitle}
      className="block h-contact-map-m md:h-contact-map w-full border-0 bg-surface-tile"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
