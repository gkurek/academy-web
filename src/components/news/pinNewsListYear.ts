/** Pins the news list year in the current history entry before opening an article. */
export function pinNewsListYear(year: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}#${year}`);
}
