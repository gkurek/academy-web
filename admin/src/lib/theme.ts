export type Theme = "light" | "dark";

// Only localStorage use in the project: the panel's own theme choice (plan 12, § v0.5).
export const THEME_STORAGE_KEY = "admin-theme";

// Runs in <head> before first paint, so a saved dark theme never flashes light.
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

const listeners = new Set<() => void>();

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode, policy): the choice lasts for this page only.
  }
  listeners.forEach((listener) => listener());
}
