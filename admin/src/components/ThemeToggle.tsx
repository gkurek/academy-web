"use client";

import { useSyncExternalStore } from "react";

import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { pl } from "@/i18n/pl";
import { applyTheme, readTheme, subscribeTheme, type Theme } from "@/lib/theme";

const serverTheme = (): Theme => "light";

// One toggle button: moon in light, sun in dark. The glyph follows `data-theme` through CSS,
// so it is right from first paint; `aria-pressed` catches up right after hydration.
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={pl.header.themeToggle}
      onClick={() => applyTheme(dark ? "light" : "dark")}
      className="grid size-tap cursor-pointer place-items-center text-body hover:text-gold"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );
}
