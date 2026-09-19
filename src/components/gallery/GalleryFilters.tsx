"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { FilterChip } from "@/components/core/FilterChip";
import type { IconAuthorFilter, IconFilters } from "@/content/icons";
import { getIconTagLabel } from "@/content/icons";
import { pl } from "@/i18n/pl";

export interface GalleryFiltersProps {
  tags: string[];
  filters: IconFilters;
}

function buildGalleryUrl(filters: IconFilters): string {
  const params = new URLSearchParams();
  if (filters.author) {
    params.set("autor", filters.author);
  }
  if (filters.tag) {
    params.set("temat", filters.tag);
  }
  const query = params.toString();
  return query ? `/ikony?${query}` : "/ikony";
}

function navigate(
  event: MouseEvent<HTMLAnchorElement>,
  router: ReturnType<typeof useRouter>,
  nextFilters: IconFilters
) {
  event.preventDefault();
  router.replace(buildGalleryUrl(nextFilters), { scroll: false });
}

export function GalleryFilters({ tags, filters }: GalleryFiltersProps) {
  const router = useRouter();

  const toggleTag = (tag: string) => {
    const nextTag = filters.tag === tag ? undefined : tag;
    router.replace(buildGalleryUrl({ ...filters, tag: nextTag }), { scroll: false });
  };

  const authorOptions: { value?: IconAuthorFilter; label: string }[] = [
    { label: pl.gallery.filters.authorAll },
    { value: "ejk", label: pl.gallery.filters.authorEjk },
    { value: "uczniowie", label: pl.gallery.filters.authorStudents },
  ];

  return (
    <div className="flex flex-col gap-space-4 pb-space-5 mb-space-5 border-b border-line-gold">
      <div className="flex flex-wrap items-center gap-space-3">
        <span className="text-size-nav text-text-tertiary">{pl.gallery.filters.authorLabel}</span>
        {authorOptions.map((option) => {
          const active = option.value === undefined
            ? filters.author === undefined
            : filters.author === option.value;
          const nextFilters: IconFilters = { ...filters, author: option.value };

          return (
            <FilterChip
              key={option.label}
              href={buildGalleryUrl(nextFilters)}
              active={active}
              onClick={(event) => navigate(event, router, nextFilters)}
            >
              {option.label}
            </FilterChip>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-space-3">
        <span className="text-size-nav text-text-tertiary">{pl.gallery.filters.themeLabel}</span>
        {tags.map((tag) => {
          const active = filters.tag === tag;
          const nextFilters: IconFilters = {
            ...filters,
            tag: active ? undefined : tag,
          };

          return (
            <FilterChip
              key={tag}
              href={buildGalleryUrl(nextFilters)}
              active={active}
              onClick={(event) => {
                event.preventDefault();
                toggleTag(tag);
              }}
            >
              {getIconTagLabel(tag)}
            </FilterChip>
          );
        })}
      </div>
    </div>
  );
}
