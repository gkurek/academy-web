export function newsPrefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scrolls a year section into view; respects scroll-margin on the year anchor (K-66, k3 A3). */
export function scrollNewsYearIntoView(year: string): void {
  const element = document.getElementById(year);
  if (!element) {
    return;
  }

  element.scrollIntoView({
    block: "start",
    behavior: newsPrefersReducedMotion() ? "auto" : "smooth",
  });
}

/** Moves focus to the entry title link for a year anchor on the news list. */
export function focusNewsYearCardTitle(year: string): void {
  const item = document.getElementById(year);
  const link = item?.querySelector<HTMLElement>(".news-card-title-link");
  link?.focus({ preventScroll: true });
}

/** Waits for layout after archive expand or hash scroll before focusing. */
export function focusNewsYearCardTitleAfterLayout(year: string): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      focusNewsYearCardTitle(year);
    });
  });
}
