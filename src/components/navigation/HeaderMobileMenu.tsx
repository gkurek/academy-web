"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronIcon } from "@/components/core/icons";
import { pl } from "@/i18n/pl";
import { mobileNav, navAriaCurrent } from "@/navigation";

export interface HeaderMobileMenuProps {
  /** Route path — `aria-current="page"` on the link to it. */
  path?: string;
  /** Href of the main nav item to highlight gold (resolveNav). */
  activeHref?: string;
  /** Href of the current SectionNav item — highlighted gold in the open accordion. */
  sectionActiveHref?: string;
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

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled"));
}

const barClass =
  "flex items-center justify-between gap-space-4 bg-surface-page px-page-margin-mobile py-space-5";
const logoClass = "flex min-h-tap-min-mobile-header flex-col justify-center font-serif leading-tight";
const barButtonClass =
  "flex h-tap-min-mobile-header w-tap-min-mobile-header flex-none items-center justify-center border border-border-button text-text-body";

export function HeaderMobileMenu({ path, activeHref, sectionActiveHref }: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // The floating button shows once the header bar has scrolled out of view.
  const [isBarVisible, setIsBarVisible] = useState(true);
  const drawerId = useId();
  const headerBarRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    // The accordion state stays as is while the drawer fades out; openMenu resets it.
    setIsOpen(false);
    openerRef.current?.focus();
  }, []);

  const openMenu = useCallback(
    (opener: HTMLButtonElement) => {
      openerRef.current = opener;
      setIsOpen(true);
      // Only the current section opens, so its link to the current page is visible.
      setExpandedSection(mobileNav.find((item) => item.children && item.href === activeHref)?.label ?? null);
    },
    [activeHref],
  );

  useEffect(() => {
    const headerBar = headerBarRef.current;
    if (!headerBar) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => setIsBarVisible(entry.isIntersecting));
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

  // The page behind the open menu is inert, so the dialog is the only reachable content.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const background = Array.from(document.querySelectorAll("#main-content, footer:not(main footer)"));
    background.forEach((element) => element.setAttribute("inert", ""));
    return () => background.forEach((element) => element.removeAttribute("inert"));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const drawer = drawerRef.current;
    if (!drawer) {
      return undefined;
    }

    getFocusableElements(drawer)[0]?.focus();

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
      <div ref={headerBarRef} className={barClass}>
        <Link href="/" className={logoClass}>
          <div className="text-size-logo-m text-text-h2">{pl.meta.orgShortName}</div>
          <div className="text-size-caption-m text-text-tertiary">{pl.meta.orgSubtitle}</div>
        </Link>
        <button
          type="button"
          onClick={(event) => openMenu(event.currentTarget)}
          aria-expanded={isOpen}
          aria-controls={drawerId}
          aria-label={pl.header.menuToggleLabel}
          className={barButtonClass}
        >
          <MenuIcon open={false} />
        </button>
      </div>

      <button
        type="button"
        onClick={(event) => openMenu(event.currentTarget)}
        aria-expanded={isOpen}
        aria-controls={drawerId}
        aria-label={pl.header.menuToggleLabel}
        data-visible={!isBarVisible}
        className="menu-fab"
      >
        <MenuIcon open={false} />
      </button>

      <div
        ref={drawerRef}
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label={pl.header.menuToggleLabel}
        data-open={isOpen}
        inert={!isOpen}
        className="menu-drawer fixed inset-0 z-50 overflow-y-auto bg-surface-page"
      >
        <div className={barClass}>
          <Link href="/" onClick={closeMenu} className={logoClass}>
            <div className="text-size-logo-m text-text-h2">{pl.meta.orgShortName}</div>
            <div className="text-size-caption-m text-text-tertiary">{pl.meta.orgSubtitle}</div>
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            aria-label={pl.header.menuCloseLabel}
            className={barButtonClass}
          >
            <MenuIcon open />
          </button>
        </div>

        <nav className="grid">
          {mobileNav.map((item) => {
            // Publikacje is outside mainNav, so resolveNav gives it no activeHref — match the path.
            const isActive =
              item.href === activeHref || path === item.href || Boolean(path?.startsWith(`${item.href}/`));

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={navAriaCurrent(item.href, activeHref, path)}
                  className={
                    "border-b border-line-neutral px-page-margin-mobile py-space-5 text-size-h3-m " +
                    (isActive ? "text-accent-text" : "text-text-list-title")
                  }
                >
                  {item.label}
                </Link>
              );
            }

            const expanded = expandedSection === item.label;
            // Built from the href slug: an IDREF must not contain spaces (labels do).
            const sectionId = `${drawerId}-${item.href.replace(/\//g, "")}`;

            return (
              <div key={item.label} className="border-b border-line-neutral">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expanded ? null : item.label)}
                  aria-expanded={expanded}
                  aria-controls={sectionId}
                  className={
                    "flex w-full cursor-pointer items-center justify-between px-page-margin-mobile py-space-5 text-left text-size-h3-m " +
                    (isActive ? "text-accent-text" : "text-text-list-title")
                  }
                >
                  {item.label}
                  <ChevronIcon expanded={expanded} className="flex-none text-text-tertiary" />
                </button>
                {expanded && (
                  <div id={sectionId} className="pb-space-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={closeMenu}
                        aria-current={navAriaCurrent(child.href, sectionActiveHref, path)}
                        className={
                          "block py-space-4 pr-page-margin-mobile pl-menu-indent text-size-ui-m " +
                          (child.href === sectionActiveHref ? "text-accent-text" : "text-text-secondary")
                        }
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

      </div>
    </>
  );
}
