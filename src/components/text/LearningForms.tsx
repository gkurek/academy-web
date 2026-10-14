import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import type { LearningFormRow } from "@/content/types";
import { buildMailtoHref } from "@/lib/mailto";
import { pl } from "@/i18n/pl";

export interface LearningFormsProps {
  rows: LearningFormRow[];
  contact: {
    email: string;
    subject: string;
  };
}

export function LearningForms({ rows, contact }: LearningFormsProps) {
  const mailtoHref = buildMailtoHref(contact.email, contact.subject);

  return (
    <div className="learning-forms">
      <ul className="learning-forms-list list-none m-0 p-0">
        {rows.map((row) => (
          <li key={row.title} className="learning-forms-item">
            <p className="learning-forms-title">{row.title}</p>
            <p className="learning-forms-description">{row.description}</p>
            {row.link ? (
              <p className="learning-forms-link">
                <TextLink href={row.link.href} className="tap-target-nav inline-flex items-center">
                  {row.link.label}
                </TextLink>
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {/* Applies to every form of teaching above — fine print, deliberately low-key. */}
      <p className="text-size-caption leading-body text-text-tertiary max-w-measure-prose mt-space-4">
        {pl.workshop.legalNote}
      </p>

      <div className="learning-forms-contact">
        <Button href={mailtoHref} variant="secondary" size="lg" className="learning-forms-mailto">
          {pl.workshop.contactMailtoLabel}
        </Button>
      </div>
    </div>
  );
}
