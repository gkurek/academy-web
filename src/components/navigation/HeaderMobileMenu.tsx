"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/core/Button";
import { ExternalLink } from "@/components/core/ExternalLink";
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

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled"));
}

export function HeaderMobileMenu({ active, phone, blogUrl }: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [headerBarHeight, setHeaderBarHeight] = useState(0);
  const drawerId = useId();
  const headerBarRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const iconsNavItem = mainNav.find((item) => item.href === "/ikony");

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setExpandedSection(null);
    menuButtonRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    setExpandedSection(iconsNavItem?.label ?? null);
  }, [iconsNavItem?.label]);

  useLayoutEffect(() => {
    const headerBar = headerBarRef.current;
    if (!headerBar) {
      return undefined;
    }

    const updateHeight = () => {
      setHeaderBarHeight(headerBar.offsetHeight);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerBar);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const drawer = drawerRef.current;
    if (!drawer) {
      return undefined;
    }

    const focusable = getFocusableElements(drawer);
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = getFocusableElements(drawer);
      if (elements.length === 0) {
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, isOpen]);

  return (
    <>
      <div
        ref={headerBarRef}
        className="relative z-50 flex items-center justify-between gap-space-4 bg-surface-page px-page-margin-mobile py-space-5"
      >
        <Link href="/" className="font-serif leading-tight">
          <div className="text-size-logo-m text-text-h2">{pl.meta.orgShortName}</div>
          <div className="text-size-caption-m text-text-tertiary">{pl.meta.orgSubtitle}</div>
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => (isOpen ? closeMenu() : openMenu())}
          aria-expanded={isOpen}
          aria-controls={drawerId}
          aria-label={pl.header.menuToggleLabel}
          className="flex h-tap-min-mobile-header w-tap-min-mobile-header flex-none items-center justify-center border border-border-button text-text-body"
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {isOpen && (
        <div
          ref={drawerRef}
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-label={pl.header.menuToggleLabel}
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-surface-page motion-safe:transition-none"
          style={{ top: headerBarHeight }}
        >
          <nav className="grid">
            {mainNav.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
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
                      onClick={closeMenu}
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
                      className="mr-space-1 flex h-tap-min w-tap-min flex-none items-center justify-center text-text-tertiary"
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
                          onClick={closeMenu}
                          className="block py-space-4 pr-page-margin-mobile pl-menu-indent text-size-ui-m text-text-secondary"
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

          <div className="px-page-margin-mobile pb-space-6 pt-space-6">
            <Button block size="lg" href="/warsztaty" className="mb-space-4" onClick={closeMenu}>
              {pl.header.primaryCta}
            </Button>
            <Button block size="lg" variant="secondary" href="/kontakt" onClick={closeMenu}>
              {pl.header.contactCta} · {phone}
            </Button>
            <div className="mt-space-6 text-size-ui text-text-tertiary">
              <Link href="/aktualnosci" onClick={closeMenu}>
                {pl.header.newsLink}
              </Link>
              {" · "}
              <Link href="/publikacje" onClick={closeMenu}>
                {pl.header.publicationsLink}
              </Link>
              {" · "}
              <ExternalLink href={blogUrl} showIcon={false} onClick={closeMenu}>
                {pl.header.blogLink}
              </ExternalLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
