import { TextLink } from "@/components/core/TextLink";
import type { ExhibitionEdition } from "@/content/types";
import { formatDateRange } from "@/lib/formatDateRange";
import { pl } from "@/i18n/pl";

export interface ExhibitionPreviewBannerProps {
  edition: ExhibitionEdition;
}

export function ExhibitionPreviewBanner({ edition }: ExhibitionPreviewBannerProps) {
  const { previewBanner } = pl.exhibition;
  const dateLabel = edition.vernissage
    ? formatDateRange(edition.vernissage, undefined, { withYear: true })
    : previewBanner.dateFallback;

  const announcement = previewBanner.announcement.replace("{date}", dateLabel);
  const newsHref = edition.newsSlug ? `/aktualnosci/${edition.newsSlug}` : "/aktualnosci";

  return (
    <div className="exhibition-preview-banner bg-surface-card border-t-offer-facts-top border-accent px-offer-facts-x py-offer-facts-y">
      <div className="exhibition-preview-banner-inner">
        <div>
          <p className="text-size-caption text-accent-text mb-space-2">{previewBanner.label}</p>
          <p className="text-size-body-lg leading-body text-text-list-title">{announcement}</p>
        </div>
        <TextLink href={newsHref} className="exhibition-preview-banner-link shrink-0">
          {previewBanner.newsLink}
        </TextLink>
      </div>
    </div>
  );
}
