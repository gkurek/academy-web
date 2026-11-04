import type { ReactNode } from "react";

type AdminPageProps = {
  heading: string;
  children?: ReactNode;
};

// Page body under the shell (mockup PanelAnalityka <main>): H1 + section content.
export function AdminPage({ heading, children }: AdminPageProps) {
  return (
    <main className="grid gap-main-gap px-pad pt-main-top pb-16">
      <h1 className="m-0 font-serif text-h1 leading-logo font-normal text-heading">{heading}</h1>
      {children}
    </main>
  );
}
