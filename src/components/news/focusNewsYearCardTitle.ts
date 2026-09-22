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
