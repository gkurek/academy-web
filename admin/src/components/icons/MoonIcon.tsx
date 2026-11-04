type MoonIconProps = {
  className?: string;
};

// Not in the mockup — drawn on the panel glyph grid (24, stroke 1.6), plan 12 § v0.5.
export function MoonIcon({ className }: MoonIconProps) {
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
      <path d="M19.5 14.2A8 8 0 1 1 9.8 4.5a6.4 6.4 0 0 0 9.7 9.7z" />
    </svg>
  );
}
