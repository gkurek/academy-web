import type { ReactNode } from "react";

type AdminPageProps = {
  heading: string;
  /** Links or buttons on the heading line (e.g. „Otwórz w PostHog”). */
  actions?: ReactNode;
  children?: ReactNode;
};

// Page body under the shell (mockup PanelAnalityka <main>): H1 + section content.
export function AdminPage({ heading, actions, children }: AdminPageProps) {
  return (
    <main className="grid gap-main-gap px-pad pt-main-top pb-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="m-0 font-serif text-h1 leading-logo font-normal text-heading">{heading}</h1>
        {actions}
      </div>
      {children}
    </main>
  );
}
