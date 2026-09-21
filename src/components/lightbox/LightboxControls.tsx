import type { ReactNode } from "react";

export function LightboxArrow({ direction }: { direction: "prev" | "next" }) {
  const path = direction === "prev" ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19";

  return (
    <svg
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
      <path d={path} />
    </svg>
  );
}

export function LightboxCloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6 L18 18" />
      <path d="M18 6 L6 18" />
    </svg>
  );
}

/** 48×48 icon button on a translucent card surface — stays visible on any photo edge. */
export function LightboxIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-tap-min w-tap-min flex-none cursor-pointer items-center justify-center border-0 bg-surface-card/80 p-0 text-text-body hover:bg-surface-card"
    >
      {children}
    </button>
  );
}

export function LightboxMobileNavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-lightbox-mobile-nav-h min-w-0 flex-1 cursor-pointer items-center justify-center gap-space-3 border border-border-button bg-transparent font-sans text-size-ui-m text-text-body"
    >
      {children}
    </button>
  );
}
