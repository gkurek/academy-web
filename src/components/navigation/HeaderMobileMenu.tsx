"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/core/Button";
import { pl } from "@/i18n/pl";
import { mainNav } from "@/navigation";

export interface HeaderMobileMenuProps {
  /** Label of the main nav item to highlight gold, e.g. "Wykłady". */
  active?: string;
  phone: string;
  blogUrl: string;
}

function MenuIcon({ open }: { open: boolean }) {
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
      {open ? (
        <>
          <path d="M6 6 L18 18" />
          <path d="M18 6 L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7 H20" />
          <path d="M4 12 H20" />
          <path d="M4 17 H20" />
        </>
      )}
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
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
      {expanded ? <path d="M5 15 L12 8 L19 15" /> : <path d="M5 9 L12 16 L19 9" />}
    </svg>
  );
}

export function HeaderMobileMenu({ active, phone, blogUrl }: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const drawerId = useId();

  return (
    <>
      <div className="flex items-center justify-between gap-space-4 px-page-margin-mobile py-space-5">
        <div className="font-serif leading-tight">
          <div className="text-size-logo-m text-text-h2">{pl.meta.orgShortName}</div>
          <div className="text-size-caption-m text-text-tertiary">{pl.meta.orgSubtitle}</div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls={drawerId}
          aria-label={pl.header.menuToggleLabel}
          className="flex-none w-tap-min-mobile-header h-tap-min-mobile-header flex items-center justify-center border border-border-button text-text-body"
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {isOpen && (
        <div id={drawerId}>
          <nav className="grid">
            {mainNav.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={
                      "border-b border-line-neutral px-page-margin-mobile py-space-5 text-size-h3-m " +
                      (item.label === active ? "text-accent-text" : "text-text-list-title")
                    }
                  >
                    {item.label}
                  </Link>
                );
              }

              const expanded = expandedSection === item.label;
              const sectionId = `${drawerId}-${item.label}`;

              return (
                <div key={item.label} className="border-b border-line-neutral">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={
                        "flex-1 px-page-margin-mobile py-space-5 text-size-h3-m " +
                        (item.label === active ? "text-accent-text" : "text-text-list-title")
                      }
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedSection(expanded ? null : item.label)}
                      aria-expanded={expanded}
                      aria-controls={sectionId}
                      aria-label={`${expanded ? pl.header.sectionCollapseLabel : pl.header.sectionExpandLabel} ${item.label}`}
                      className="flex-none mr-space-1 w-tap-min h-tap-min flex items-center justify-center text-text-tertiary"
                    >
                      <ChevronIcon expanded={expanded} />
                    </button>
                  </div>
                  {expanded && (
                    <div id={sectionId} className="pb-space-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block pl-menu-indent pr-page-margin-mobile py-space-4 text-size-ui-m text-text-secondary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="px-page-margin-mobile pt-space-6 pb-space-6">
            <Button block size="lg" href="/warsztaty" className="mb-space-4">
              {pl.header.primaryCta}
            </Button>
            <Button block size="lg" variant="secondary" href="/kontakt">
              {pl.header.contactCta} · {phone}
            </Button>
            <div className="mt-space-6 text-size-ui text-text-tertiary">
              <Link href="/aktualnosci">{pl.header.newsLink}</Link>
              {" · "}
              <Link href="/publikacje">{pl.header.publicationsLink}</Link>
              {" · "}
              <a href={blogUrl} rel="noopener noreferrer">
                {pl.header.blogLink}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
