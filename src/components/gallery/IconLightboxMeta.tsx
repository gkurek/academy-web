import type { IconWork } from "@/content/types";
import { formatLightboxMeta } from "@/i18n/formatLightboxMeta";

export interface IconLightboxMetaProps {
  item: IconWork;
  positionLabel: string;
}

export function IconLightboxMeta({ item, positionLabel }: IconLightboxMetaProps) {
  const entries = formatLightboxMeta(item);

  return (
    <div className="px-page-margin-mobile pt-space-5 pb-space-5 lg:min-w-0 lg:p-0">
      <p className="mb-space-3 hidden text-size-ui text-accent-text lg:block">{positionLabel}</p>
      <h2 className="mb-space-7 font-serif text-size-role-card-title leading-heading text-text-h1 lg:mb-space-8 lg:text-size-role-section-h2">
        {item.title}
      </h2>
      <div className="leading-loose">
        {entries.map((entry, entryIndex) => (
          <div key={`field-${entryIndex}`} className="block">
            <span className="text-size-caption text-text-tertiary">{entry.label}</span>
            <span className="block text-size-body text-text-secondary">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
