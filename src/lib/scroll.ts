/** True when the visitor asked for reduced motion; browser-only. */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll behavior that respects `prefers-reduced-motion`; browser-only. */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth";
}

/** Scrolls the element with the given id to the top of the viewport; returns false when it is missing. */
export function scrollToId(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) {
    return false;
  }

  element.scrollIntoView({ block: "start", behavior: scrollBehavior() });
  return true;
}
