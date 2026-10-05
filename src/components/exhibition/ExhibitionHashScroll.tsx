"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

import { pl } from "@/i18n/pl";
import { scrollToId } from "@/lib/scroll";

const sectionIds = pl.exhibition.page.toc.map((item) => item.id);

function isExhibitionSectionId(id: string): boolean {
  return sectionIds.some((sectionId) => sectionId === id);
}

function hashToSectionId(hash: string): string | undefined {
  const id = hash.replace(/^#/, "");
  return isExhibitionSectionId(id) ? id : undefined;
}

export interface ExhibitionHashScrollProps {
  children: ReactNode;
}

export function ExhibitionHashScroll({ children }: ExhibitionHashScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runInitialScroll = () => {
      const id = hashToSectionId(window.location.hash);
      if (id) {
        scrollToId(id);
      }
    };

    const frame = window.requestAnimationFrame(runInitialScroll);

    const handleHashChange = () => {
      const id = hashToSectionId(window.location.hash);
      if (id) {
        scrollToId(id);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleAnchorClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a[href^='#']");
    if (!anchor || !rootRef.current?.contains(anchor)) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href) {
      return;
    }

    const id = hashToSectionId(href);
    if (!id) {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", href);
    scrollToId(id);
  };

  return (
    <div ref={rootRef} className="contents" onClick={handleAnchorClick}>
      {children}
    </div>
  );
}
