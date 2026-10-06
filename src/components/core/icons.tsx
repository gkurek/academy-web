export interface IconProps {
  /** Rendered width and height in px. */
  size?: number;
  className?: string;
}

/** Chevron down (collapsed) / up (expanded) — accordion, TOC and menu toggles. */
export function ChevronIcon({
  expanded,
  size = 24,
  className,
}: IconProps & { expanded: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {expanded ? <path d="M5 15 L12 8 L19 15" /> : <path d="M5 9 L12 16 L19 9" />}
    </svg>
  );
}

/** Chevron pointing left (prev) / right (next) — sideways scroll controls. */
export function ChevronSideIcon({
  direction,
  size = 24,
  className,
}: IconProps & { direction: "prev" | "next" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {direction === "prev" ? <path d="M15 5 L8 12 L15 19" /> : <path d="M9 5 L16 12 L9 19" />}
    </svg>
  );
}

/** Magnifier shown over enlargeable photos. */
export function ZoomIcon({ size = 28, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="10.5" cy="10.5" r="5.75" />
      <path d="M15 15 L20 20" />
    </svg>
  );
}
