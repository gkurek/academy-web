"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { pl } from "@/i18n/pl";
import { adminTabs } from "@/navigation";

// Section tabs (mockup PanelShell): active = gold text + 1px `act` line; wraps on mobile.
export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label={pl.tabs.ariaLabel}
      className="flex flex-wrap gap-x-tab-gap border-b border-line px-pad text-tab"
    >
      {adminTabs.map((tab) => {
        const current = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={current ? "page" : undefined}
            className={`flex min-h-tab items-center no-underline hover:text-gold focus-visible:-outline-offset-2 ${current ? "text-gold" : "text-secondary"}`}
          >
            <span className={`border-b pb-0.75 ${current ? "border-active" : "border-transparent"}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
