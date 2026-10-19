import type { ReactNode } from "react";

export interface ContactRowProps {
  label: string;
  children: ReactNode;
}

/** One hairline row of the /kontakt details list — small label left, values right (stacked below lg). */
export function ContactRow({ label, children }: ContactRowProps) {
  return (
    <div className="contact-row">
      <div className="contact-row-label">{label}</div>
      <div className="contact-row-values">{children}</div>
    </div>
  );
}
