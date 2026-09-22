import Link from "next/link";

import { TextLink } from "@/components/core/TextLink";
import { Footer } from "@/components/navigation/Footer";
import { Header } from "@/components/navigation/Header";
import { pl } from "@/i18n/pl";
import { mainNav } from "@/navigation";

export default function NotFound() {
  const contactItem = mainNav.find((item) => item.href === "/kontakt");

  return (
    <>
      <Header />
      <main className="flex-1 px-page-margin-mobile py-space-6 md:px-page-margin">
        <div className="mx-auto w-full max-w-content-max">
          <h1 className="mb-space-5 font-serif text-size-h1-m leading-tight text-text-h1 md:text-size-h1">
            {pl.notFound.title}
          </h1>

          <p className="mb-space-6 max-w-measure-prose text-size-body leading-body text-text-secondary md:text-size-body-lg md:leading-prose">
            {pl.notFound.lead}
          </p>

          <div className="mb-space-8 flex flex-col gap-space-3 sm:flex-row sm:flex-wrap sm:gap-space-6">
            <TextLink href="/">{pl.notFound.homeLink}</TextLink>
            {contactItem ? (
              <TextLink href={contactItem.href}>{contactItem.label}</TextLink>
            ) : null}
          </div>

          <nav aria-label={pl.notFound.sitemapAriaLabel}>
            <h2 className="mb-space-4 font-serif text-size-role-section-h2-m leading-heading text-text-h2 md:text-size-role-section-h2">
              {pl.notFound.sitemapHeading}
            </h2>
            <ul className="grid grid-cols-1 gap-space-3 sm:grid-cols-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link-underline tap-target-nav text-size-body text-text-body hover:text-text-list-title"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
