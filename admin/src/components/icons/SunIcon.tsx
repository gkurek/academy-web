type SunIconProps = {
  className?: string;
};

// Not in the mockup — drawn on the panel glyph grid (24, stroke 1.6), plan 12 § v0.5.
export function SunIcon({ className }: SunIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2" />
      <path d="M12 19.5v2" />
      <path d="M2.5 12h2" />
      <path d="M19.5 12h2" />
      <path d="M5.3 5.3l1.4 1.4" />
      <path d="M17.3 17.3l1.4 1.4" />
      <path d="M5.3 18.7l1.4-1.4" />
      <path d="M17.3 6.7l1.4-1.4" />
    </svg>
  );
}
