"use client";

import { TocCollapse } from "@/components/text/TocCollapse";
import { TocSidebar } from "@/components/text/TocSidebar";
import { useTocActiveId } from "@/components/text/useTocActiveId";
import type { TocItem } from "@/content/types";

export interface TextPageTocNavProps {
  items: TocItem[];
  variant: "sidebar" | "collapse";
}

/** Desktop sticky sidebar or mobile collapse — shares one scroll-spy active id per page. */
export function TextPageTocNav({ items, variant }: TextPageTocNavProps) {
  const activeId = useTocActiveId(items);

  if (variant === "sidebar") {
    return <TocSidebar items={items} activeId={activeId} />;
  }

  return <TocCollapse items={items} activeId={activeId} />;
}
