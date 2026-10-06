/**
 * Layout pattern measurement for the visual review (plan 10/R, V1) and the RF-13 / RF-14 checks.
 *
 * When to run:
 *   - V1, against staging:  npx tsx scripts/visual-measure.ts --base https://<staging>
 *   - after RF-13 / RF-14, to re-measure section gaps and typography against the V1 targets
 *     (same command, `--base http://localhost:3000` for a local `build && start`).
 *
 * Collects computed styles per route × width: content column, gaps above section headings (H2),
 * H1–H3 / text typography, paragraph gaps, gold accent bars, colours and font sizes outside the tokens.
 * Optional passes: `--only axe` (axe-core from node_modules, 390 / 1440) and `--only cls`.
 * Raw data goes to `.visual/measure/` (git-ignored); `summary.json` holds the dominant patterns.
 *
 * Flags: --base <url> (default http://localhost:3000) --widths 390,1440,1600 --routes /a,/b
 *        --only measure|axe|cls
 */
import fs from "node:fs/promises";
import path from "node:path";

import { chromium, type Browser, type Page } from "playwright";

interface RouteConfig {
  path: string;
}

interface TextRecord {
  tag: string;
  cls: string;
  ctx: string;
  text: string;
  family: string;
  size: number;
  lineHeight: number;
  weight: string;
  color: string;
  letterSpacing: string;
  marginTop: number;
  marginBottom: number;
  width: number;
  measureEm: number;
}

interface GapRecord {
  marker: string;
  text: string;
  gap: number;
  first: boolean;
  chain: string[];
}

interface ParagraphGap {
  ctx: string;
  gap: number;
  marginTop: number;
  marginBottom: number;
}

interface BarRecord {
  ctx: string;
  side: string;
  width: number;
  color: string;
  kind: "border" | "pseudo" | "element";
}

interface OffTokenRecord {
  prop: string;
  value: string;
  count: number;
  sample: string;
  inDesign: boolean;
}

interface PageMeasure {
  route: string;
  width: number;
  docHeight: number;
  layout: { mainLeft: number; mainWidth: number; contentLeft: number; contentWidth: number; headerBottom: number; footerTop: number };
  topGap: number;
  bottomGap: number;
  sectionGaps: GapRecord[];
  blockGaps: GapRecord[];
  text: TextRecord[];
  paragraphGaps: ParagraphGap[];
  bars: BarRecord[];
  offTokenColors: OffTokenRecord[];
  offTokenSizes: OffTokenRecord[];
}

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, ".visual", "measure");
const CONCURRENCY = 4;
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
const CLS_ROUTES = ["/", "/ikony", "/ikony/na-zamowienie"];

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function routeSlug(route: string): string {
  return route === "/" ? "home" : route.slice(1).replace(/\//g, "__");
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function runPool<T>(items: T[], worker: (item: T) => Promise<void>): Promise<void> {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item !== undefined) {
          await worker(item);
        }
      }
    }),
  );
}

async function openPage(browser: Browser, width: number): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  // tsx injects `__name` into functions passed to page.evaluate; define it in the page.
  await context.addInitScript("window.__name = (fn) => fn;");
  const page = await context.newPage();
  return { page, close: () => context.close() };
}

/** Scrolls through the page so lazy content loads, then waits for images and fonts. */
async function settlePage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let y = 0;
    while (y < document.documentElement.scrollHeight) {
      window.scrollTo(0, y);
      await sleep(60);
      y += window.innerHeight;
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
  });
  await page.waitForTimeout(150);
}

/** Custom property names declared in globals.css (token definitions only, not component literals). */
async function readTokenNames(): Promise<string[]> {
  const css = await fs.readFile(path.join(ROOT, "src", "app", "globals.css"), "utf8");
  return [...new Set(Array.from(css.matchAll(/(--[a-z0-9-]+)\s*:/gi), (match) => match[1]))];
}

/** Production palette from design/README §1 (retired shades and canvas chrome excluded). */
async function readDesignPalette(): Promise<string[]> {
  const readme = await fs.readFile(path.join(ROOT, "design", "README.md"), "utf8");
  const section = readme.split("## 1. Kolory")[1]?.split("## 2.")[0] ?? "";
  return section
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .flatMap((line) => Array.from(line.matchAll(/#[0-9a-f]{6}\b|rgba\([^)]*\)/gi), (match) => match[0]))
    .flatMap((value) => {
      // Ranges such as rgba(0,0,0,.45–.7) list both ends.
      const range = value.match(/^rgba\(([^)]*),\s*([.\d]+)[–-]([.\d]+)\)$/);
      return range ? [`rgba(${range[1]},${range[2]})`, `rgba(${range[1]},${range[3]})`] : [value];
    });
}

/** Runs in the page: collects every measurement for one route × width. */
function measureInPage({ tokenNames, palette }: { tokenNames: string[]; palette: string[] }) {
  const round = (value: number) => Math.round(value * 10) / 10;
  const px = (value: string) => parseFloat(value) || 0;
  const main = document.querySelector("main");
  if (!main) {
    throw new Error("no main");
  }
  // Site header / footer, not the <header> / <footer> of a hero or a quote inside main.
  const header = Array.from(document.querySelectorAll("header")).find((element) => !main.contains(element));
  const footer = Array.from(document.querySelectorAll("footer")).find((element) => !main.contains(element));

  const probe = document.createElement("div");
  probe.style.position = "absolute";
  document.body.appendChild(probe);
  const normalizeColor = (value: string) => {
    probe.style.color = "";
    probe.style.color = value;
    if (!probe.style.color) {
      return null;
    }
    const parts = getComputedStyle(probe).color.match(/[\d.]+/g)?.map(Number) ?? [];
    const [r, g, b, a = 1] = parts;
    return `${r},${g},${b},${Math.round(a * 100) / 100}`;
  };
  const rootStyle = getComputedStyle(document.documentElement);
  const tokenValues = tokenNames.map((name) => rootStyle.getPropertyValue(name).trim()).filter(Boolean);
  const tokenColors = new Set(tokenValues.filter((value) => !/^-?[\d.]+(px|rem|em|%)?$/.test(value)).map(normalizeColor).filter(Boolean));
  const tokenLengths = new Set(
    tokenValues
      .filter((value) => /^-?[\d.]+(px|rem)$/.test(value))
      .map((value) => round(value.endsWith("rem") ? parseFloat(value) * 16 : parseFloat(value))),
  );
  const designColors = new Set(palette.map(normalizeColor).filter(Boolean));

  const isVisible = (element: Element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width * rect.height >= 4 && style.visibility !== "hidden" && style.display !== "none";
  };
  const classOf = (element: Element) => {
    const cls = typeof element.className === "string" ? element.className.trim() : "";
    return `${element.tagName.toLowerCase()}${cls ? `.${cls.split(/\s+/).join(".")}` : ""}`.slice(0, 160);
  };
  const ctxOf = (element: Element) => {
    const chain: string[] = [];
    let current: Element | null = element;
    while (current && current !== main && chain.length < 3) {
      chain.unshift(classOf(current).slice(0, 70));
      current = current.parentElement;
    }
    return chain.join(" > ");
  };
  const scrollY = window.scrollY;
  const rectOf = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + scrollY, bottom: rect.bottom + scrollY, left: rect.left, right: rect.right };
  };

  // Visual boxes in main: text runs, replaced elements, panels with a background or border.
  const visualBoxes: { node: Node; top: number; bottom: number; left: number; right: number }[] = [];
  // Sticky columns (TocSidebar) sit beside the sections and do not end them.
  const inSticky = (node: Node) => {
    let current = node instanceof Element ? node : node.parentElement;
    while (current && current !== main) {
      if (getComputedStyle(current).position === "sticky") {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  };
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  let textNode = walker.nextNode();
  while (textNode) {
    const parent = textNode.parentElement;
    if (parent && textNode.textContent?.trim() && isVisible(parent) && !inSticky(textNode)) {
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const rect = range.getBoundingClientRect();
      if (rect.width * rect.height >= 4) {
        visualBoxes.push({ node: textNode, top: rect.top + scrollY, bottom: rect.bottom + scrollY, left: rect.left, right: rect.right });
      }
    }
    textNode = walker.nextNode();
  }
  const hasBackground = (style: CSSStyleDeclaration) =>
    (style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent") || style.backgroundImage !== "none";
  // A panel: own background or horizontal border, or a full-bleed background drawn by ::before / ::after.
  const isPanel = (element: Element) => {
    const style = getComputedStyle(element);
    const border = ["top", "bottom"].some((side) => px(style.getPropertyValue(`border-${side}-width`)) > 0);
    const bleed = ["::before", "::after"].some((pseudo) => {
      const pseudoStyle = getComputedStyle(element, pseudo);
      // Full-bleed band (tall) or a structural hairline rule (wide and thin).
      const rule = ["top", "bottom"].some((side) => px(pseudoStyle.getPropertyValue(`border-${side}-width`)) > 0);
      return pseudoStyle.content !== "none" && ((hasBackground(pseudoStyle) && px(pseudoStyle.height) > 8) || ((hasBackground(pseudoStyle) || rule) && px(pseudoStyle.width) >= 100));
    });
    return hasBackground(style) || border || bleed;
  };
  Array.from(main.querySelectorAll("*"))
    .filter((element) => isVisible(element) && !inSticky(element) && (element.matches("img, svg, iframe, video, picture, canvas, hr") || isPanel(element)))
    .forEach((element) => visualBoxes.push({ node: element, ...rectOf(element) }));

  const mainRect = rectOf(main);
  const mainStyle = getComputedStyle(main);
  const contentLeft = mainRect.left + px(mainStyle.paddingLeft);
  const contentWidth = mainRect.right - mainRect.left - px(mainStyle.paddingLeft) - px(mainStyle.paddingRight);

  const precedes = (node: Node, target: Element) =>
    !target.contains(node) && !!(node.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);

  /** Non-zero margin-top / padding-top from the marker up to the level that has a previous sibling. */
  const mechanism = (marker: Element) => {
    const chain: string[] = [];
    let level: Element | null = marker;
    while (level && level !== main) {
      const style = getComputedStyle(level);
      const parts = [
        px(style.marginTop) ? `mt ${style.marginTop}` : "",
        level !== marker && px(style.paddingTop) ? `pt ${style.paddingTop}` : "",
      ].filter(Boolean);
      if (parts.length > 0) {
        chain.push(`${classOf(level).slice(0, 90)} [${parts.join(", ")}]`);
      }
      const sibling = level.previousElementSibling;
      if (sibling && isVisible(sibling)) {
        const siblingStyle = getComputedStyle(sibling);
        const tail = [
          px(siblingStyle.marginBottom) ? `mb ${siblingStyle.marginBottom}` : "",
          px(siblingStyle.paddingBottom) ? `pb ${siblingStyle.paddingBottom}` : "",
        ].filter(Boolean);
        if (tail.length > 0) {
          chain.push(`prev ${classOf(sibling).slice(0, 90)} [${tail.join(", ")}]`);
        }
        break;
      }
      level = level.parentElement;
      if (level && level !== main) {
        const parentStyle = getComputedStyle(level);
        if (px(parentStyle.rowGap) && /flex|grid/.test(parentStyle.display)) {
          chain.push(`${classOf(level).slice(0, 90)} [gap ${parentStyle.rowGap}]`);
        }
      }
    }
    return chain;
  };
  /** Distance from the bottom of the content above (any column) to `top`. */
  const gapAbove = (marker: Element, top: number) => {
    const above = visualBoxes.filter((box) => precedes(box.node, marker) && box.bottom <= top + 1);
    const prevBottom = above.length > 0 ? Math.max(...above.map((box) => box.bottom)) : mainRect.top;
    return { gap: round(top - prevBottom), first: above.length === 0 };
  };

  // Gap above each H2: the outermost panel around it (if any) is the visual start of the section.
  const sectionGaps = Array.from(main.querySelectorAll("h2"))
    .filter(isVisible)
    .map((heading) => {
      let marker: Element = heading;
      let current = heading.parentElement;
      while (current && current !== main) {
        if (isPanel(current) && rectOf(current).top < rectOf(marker).top + 1) {
          marker = current;
        }
        current = current.parentElement;
      }
      return {
        marker: marker === heading ? "h2" : `panel ${classOf(marker).slice(0, 60)}`,
        text: (heading.textContent ?? "").trim().slice(0, 50),
        ...gapAbove(marker, rectOf(marker).top),
        chain: mechanism(marker),
      };
    });

  // Gap above each top-level <section> (not nested in another one), measured from its first visible content
  // (eyebrow, heading, panel or image) — the section rhythm independent of headings.
  const blockGaps = Array.from(main.querySelectorAll("section"))
    .filter((section) => isVisible(section) && !section.parentElement?.closest("section") && !inSticky(section))
    .map((section) => {
      const inside = visualBoxes.filter((box) => section.contains(box.node));
      const top = isPanel(section) ? rectOf(section).top : inside.length > 0 ? Math.min(...inside.map((box) => box.top)) : rectOf(section).top;
      const heading = section.querySelector("h2, h3, p");
      return {
        marker: classOf(section).slice(0, 80),
        text: (heading?.textContent ?? "").trim().slice(0, 50),
        ...gapAbove(section, top),
        chain: mechanism(section),
      };
    });

  const allBoxesBottom = visualBoxes.length > 0 ? Math.max(...visualBoxes.map((box) => box.bottom)) : mainRect.bottom;
  const allBoxesTop = visualBoxes.length > 0 ? Math.min(...visualBoxes.map((box) => box.top)) : mainRect.top;
  const footerTop = footer ? rectOf(footer).top : document.documentElement.scrollHeight;

  const text = Array.from(main.querySelectorAll("h1, h2, h3, p, blockquote, figcaption, li"))
    .filter((element) => isVisible(element) && (element.textContent ?? "").trim().length > 0)
    .filter((element) => element.tagName !== "LI" || !element.querySelector("p, h2, h3"))
    .map((element) => {
      const style = getComputedStyle(element);
      const size = px(style.fontSize);
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        cls: classOf(element),
        ctx: ctxOf(element),
        text: (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40),
        family: style.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
        size: round(size),
        lineHeight: style.lineHeight === "normal" ? 0 : round(px(style.lineHeight) / size * 100) / 100,
        weight: style.fontWeight,
        color: style.color,
        letterSpacing: style.letterSpacing,
        marginTop: round(px(style.marginTop)),
        marginBottom: round(px(style.marginBottom)),
        width: round(rect.width),
        measureEm: round(rect.width / size),
      };
    });

  const paragraphGaps = Array.from(main.querySelectorAll("p"))
    .filter((element) => isVisible(element) && element.previousElementSibling?.tagName === "P" && isVisible(element.previousElementSibling))
    .map((element) => {
      const previous = element.previousElementSibling as Element;
      const style = getComputedStyle(element);
      return {
        ctx: ctxOf(element.parentElement ?? element),
        gap: round(rectOf(element).top - rectOf(previous).bottom),
        marginTop: round(px(style.marginTop)),
        marginBottom: round(px(getComputedStyle(previous).marginBottom)),
      };
    });

  const isGold = (color: string) => {
    const [r, g, b, a = 1] = color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
    return a > 0.5 && r > 150 && g > 110 && b < 130 && r - b > 80;
  };
  const bars = Array.from(document.body.querySelectorAll("*"))
    .filter(isVisible)
    .flatMap((element) => {
      const style = getComputedStyle(element);
      const borders = ["top", "left", "bottom", "right"]
        .filter((side) => px(style.getPropertyValue(`border-${side}-width`)) >= 2 && isGold(style.getPropertyValue(`border-${side}-color`)))
        .map((side) => ({
          ctx: ctxOf(element),
          side,
          width: px(style.getPropertyValue(`border-${side}-width`)),
          color: style.getPropertyValue(`border-${side}-color`),
          kind: "border" as const,
        }));
      // Bars drawn as a pseudo-element or as their own thin element with a gold background (≥ 2 px: 1 px are link underlines).
      const pseudos = ["::before", "::after"].flatMap((pseudo) => {
        const pseudoStyle = getComputedStyle(element, pseudo);
        const thin = Math.min(px(pseudoStyle.height) || 999, px(pseudoStyle.width) || 999);
        return pseudoStyle.content !== "none" && isGold(pseudoStyle.backgroundColor) && thin >= 2 && thin <= 4
          ? [{ ctx: `${ctxOf(element)}${pseudo}`, side: px(pseudoStyle.height) <= 4 ? "horizontal" : "vertical", width: thin, color: pseudoStyle.backgroundColor, kind: "pseudo" as const }]
          : [];
      });
      const rect = element.getBoundingClientRect();
      const thinSide = Math.min(rect.width, rect.height);
      const own =
        isGold(style.backgroundColor) && thinSide >= 2 && thinSide <= 4
          ? [{ ctx: ctxOf(element), side: rect.height <= 4 ? "horizontal" : "vertical", width: round(thinSide), color: style.backgroundColor, kind: "element" as const }]
          : [];
      return [...borders, ...pseudos, ...own];
    });

  // Colours and font sizes outside the token set, over the whole body.
  const colorHits = new Map<string, { count: number; sample: string; inDesign: boolean }>();
  const sizeHits = new Map<string, { count: number; sample: string; inDesign: boolean }>();
  const addHit = (map: typeof colorHits, key: string, sample: string, inDesign: boolean) => {
    const hit = map.get(key);
    map.set(key, hit ? { ...hit, count: hit.count + 1 } : { count: 1, sample, inDesign });
  };
  Array.from(document.body.querySelectorAll("*"))
    .filter(isVisible)
    .forEach((element) => {
      const style = getComputedStyle(element);
      const hasText = Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      const colorProps = [
        hasText ? ["color", style.color] : null,
        style.backgroundColor !== "rgba(0, 0, 0, 0)" ? ["background-color", style.backgroundColor] : null,
        ...["top", "right", "bottom", "left"].map((side) =>
          px(style.getPropertyValue(`border-${side}-width`)) > 0 ? ["border-color", style.getPropertyValue(`border-${side}-color`)] : null,
        ),
      ].filter((entry): entry is string[] => entry !== null);
      colorProps.forEach(([prop, value]) => {
        const normalized = normalizeColor(value);
        if (normalized && !tokenColors.has(normalized)) {
          addHit(colorHits, `${prop}|${value}`, ctxOf(element), designColors.has(normalized));
        }
      });
      if (hasText) {
        const size = round(px(style.fontSize));
        if (!tokenLengths.has(size)) {
          addHit(sizeHits, `font-size|${size}px`, ctxOf(element), false);
        }
      }
    });
  probe.remove();
  const toRecords = (map: typeof colorHits) =>
    Array.from(map.entries()).map(([key, hit]) => {
      const [prop, value] = key.split("|");
      return { prop, value, ...hit };
    });

  return {
    docHeight: document.documentElement.scrollHeight,
    layout: {
      mainLeft: round(mainRect.left),
      mainWidth: round(mainRect.right - mainRect.left),
      contentLeft: round(contentLeft),
      contentWidth: round(contentWidth),
      headerBottom: header ? round(rectOf(header).bottom) : 0,
      footerTop: round(footerTop),
    },
    topGap: round(allBoxesTop - mainRect.top),
    bottomGap: round(footerTop - allBoxesBottom),
    sectionGaps,
    blockGaps,
    text,
    paragraphGaps,
    bars,
    offTokenColors: toRecords(colorHits),
    offTokenSizes: toRecords(sizeHits),
  };
}

async function measureRoute(browser: Browser, base: string, route: string, width: number, args: { tokenNames: string[]; palette: string[] }): Promise<PageMeasure> {
  const { page, close } = await openPage(browser, width);
  try {
    await page.goto(new URL(route, base).toString(), { waitUntil: "networkidle" });
    await settlePage(page);
    const result = await page.evaluate(measureInPage, args);
    return { route, width, ...result };
  } finally {
    await close();
  }
}

/** Most frequent value, counted once per page so that long pages do not dominate. */
function dominant(values: { page: string; value: string }[]): { value: string; pages: number; total: number } {
  const pagesByValue = values.reduce<Map<string, Set<string>>>((map, { page, value }) => {
    map.set(value, (map.get(value) ?? new Set()).add(page));
    return map;
  }, new Map());
  const total = new Set(values.map((entry) => entry.page)).size;
  const [value, pages] = [...pagesByValue.entries()].sort((a, b) => b[1].size - a[1].size)[0] ?? ["", new Set()];
  return { value, pages: pages.size, total };
}

function summarize(measures: PageMeasure[], widths: number[]) {
  return widths.map((width) => {
    const atWidth = measures.filter((measure) => measure.width === width);
    const roleValues = (tag: string, pick: (record: TextRecord) => string) =>
      atWidth.flatMap((measure) => measure.text.filter((record) => record.tag === tag).map((record) => ({ page: measure.route, value: pick(record) })));
    const distribution = (values: { page: string; value: string }[]) =>
      Object.fromEntries(
        [...values.reduce<Map<string, Set<string>>>((map, { page, value }) => map.set(value, (map.get(value) ?? new Set()).add(page)), new Map()).entries()]
          .sort((a, b) => b[1].size - a[1].size)
          .map(([value, pages]) => [value, [...pages]]),
      );
    const gapValues = atWidth.flatMap((measure) =>
      measure.sectionGaps.filter((gap) => !gap.first).map((gap) => ({ page: measure.route, value: String(Math.round(gap.gap)) })),
    );
    const typography = ["h1", "h2", "h3", "p"].map((tag) => ({
      tag,
      size: dominant(roleValues(tag, (record) => String(record.size))),
      sizeDistribution: distribution(roleValues(tag, (record) => String(record.size))),
      lineHeight: dominant(roleValues(tag, (record) => String(record.lineHeight))),
      lineHeightDistribution: distribution(roleValues(tag, (record) => String(record.lineHeight))),
      family: dominant(roleValues(tag, (record) => record.family)),
      color: distribution(roleValues(tag, (record) => record.color)),
    }));
    return {
      width,
      contentWidth: distribution(atWidth.map((measure) => ({ page: measure.route, value: String(measure.layout.contentWidth) }))),
      topGap: distribution(atWidth.map((measure) => ({ page: measure.route, value: String(Math.round(measure.topGap)) }))),
      bottomGap: distribution(atWidth.map((measure) => ({ page: measure.route, value: String(Math.round(measure.bottomGap)) }))),
      sectionGap: { dominant: dominant(gapValues), distribution: distribution(gapValues) },
      blockGap: distribution(
        atWidth.flatMap((measure) => measure.blockGaps.filter((gap) => !gap.first).map((gap) => ({ page: measure.route, value: String(Math.round(gap.gap)) }))),
      ),
      paragraphGap: distribution(atWidth.flatMap((measure) => measure.paragraphGaps.map((gap) => ({ page: measure.route, value: String(Math.round(gap.gap)) })))),
      bars: distribution(atWidth.flatMap((measure) => measure.bars.map((bar) => ({ page: measure.route, value: `${bar.width}px ${bar.side} (${bar.kind})` })))),
      typography,
    };
  });
}

async function runAxe(browser: Browser, base: string, routes: RouteConfig[]): Promise<void> {
  const axeSource = await fs.readFile(require.resolve("axe-core/axe.min.js"), "utf8");
  const jobs = routes.flatMap((route) => [390, 1440].map((width) => ({ route: route.path, width })));
  const results: unknown[] = [];
  await runPool(jobs, async ({ route, width }) => {
    const { page, close } = await openPage(browser, width);
    try {
      await page.goto(new URL(route, base).toString(), { waitUntil: "networkidle" });
      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(async (tags) => {
        const axe = (window as unknown as { axe: { run: (context: Document, options: unknown) => Promise<{ violations: { id: string; impact: string; nodes: { target: string[] }[] }[]; incomplete: { id: string; nodes: unknown[] }[] }> } }).axe;
        const output = await axe.run(document, { runOnly: { type: "tag", values: tags } });
        return {
          violations: output.violations.map((rule) => ({ id: rule.id, impact: rule.impact, nodes: rule.nodes.length, targets: rule.nodes.slice(0, 4).map((node) => node.target.join(" ")) })),
          incomplete: output.incomplete.map((rule) => ({ id: rule.id, nodes: rule.nodes.length })),
        };
      }, AXE_TAGS);
      results.push({ route, width, ...result });
    } finally {
      await close();
    }
  });
  await writeJson(path.join(OUT_DIR, "axe.json"), results);
  console.log(`axe: ${results.length} runs → ${path.join(OUT_DIR, "axe.json")}`);
}

async function runCls(browser: Browser, base: string): Promise<void> {
  const jobs = CLS_ROUTES.flatMap((route) => [390, 1440].map((width) => ({ route, width })));
  const results: unknown[] = [];
  await runPool(jobs, async ({ route, width }) => {
    const { page, close } = await openPage(browser, width);
    try {
      await page.addInitScript(() => {
        const shifts: { value: number; time: number }[] = [];
        (window as unknown as { __shifts: typeof shifts }).__shifts = shifts;
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!shift.hadRecentInput) {
              shifts.push({ value: shift.value, time: shift.startTime });
            }
          });
        }).observe({ type: "layout-shift", buffered: true });
      });
      const response = await page.goto(new URL(route, base).toString(), { waitUntil: "networkidle" });
      await page.waitForTimeout(3000);
      const loadShifts = await page.evaluate(() => [...(window as unknown as { __shifts: { value: number; time: number }[] }).__shifts]);
      await settlePage(page);
      await page.waitForTimeout(1000);
      const allShifts = await page.evaluate(() => [...(window as unknown as { __shifts: { value: number; time: number }[] }).__shifts]);
      // CLS = largest session window (gap < 1 s, window ≤ 5 s).
      const cls = (shifts: { value: number; time: number }[]) =>
        shifts.reduce<{ best: number; current: number; start: number; last: number }>(
          (acc, shift) => {
            const sameWindow = shift.time - acc.last < 1000 && shift.time - acc.start < 5000;
            const current = sameWindow ? acc.current + shift.value : shift.value;
            const start = sameWindow ? acc.start : shift.time;
            return { best: Math.max(acc.best, current), current, start, last: shift.time };
          },
          { best: 0, current: 0, start: -Infinity, last: -Infinity },
        ).best;
      const headers = response?.headers() ?? {};
      results.push({
        route,
        width,
        clsLoad: Math.round(cls(loadShifts) * 10000) / 10000,
        clsWithScroll: Math.round(cls(allShifts) * 10000) / 10000,
        shifts: allShifts.length,
        cache: { "x-vercel-cache": headers["x-vercel-cache"], "x-nextjs-prerender": headers["x-nextjs-prerender"], "cache-control": headers["cache-control"], age: headers.age },
      });
    } finally {
      await close();
    }
  });
  await writeJson(path.join(OUT_DIR, "cls.json"), results);
  console.log(`cls: ${results.length} runs → ${path.join(OUT_DIR, "cls.json")}`);
}

async function main(): Promise<void> {
  const config = JSON.parse(await fs.readFile(path.join(__dirname, "visual-check.routes.json"), "utf8")) as { routes: RouteConfig[] };
  const base = readArg("base") ?? "http://localhost:3000";
  const only = readArg("only");
  const widths = readArg("widths")?.split(",").map(Number) ?? [390, 1440, 1600];
  const routeFilter = readArg("routes")?.split(",");
  const routes = config.routes.filter((route) => !routeFilter || routeFilter.includes(route.path));

  const browser = await chromium.launch();
  try {
    if (!only || only === "measure") {
      const args = { tokenNames: await readTokenNames(), palette: await readDesignPalette() };
      const jobs = routes.flatMap((route) => widths.map((width) => ({ route: route.path, width })));
      const measures: PageMeasure[] = [];
      await runPool(jobs, async ({ route, width }) => {
        const measure = await measureRoute(browser, base, route, width, args);
        measures.push(measure);
        await writeJson(path.join(OUT_DIR, "pages", `${routeSlug(route)}-${width}.json`), measure);
      });
      await writeJson(path.join(OUT_DIR, "summary.json"), { base, measuredAt: new Date().toISOString(), widths: summarize(measures, widths) });
      console.log(`measure: ${measures.length} pages → ${OUT_DIR}`);
    }
    if (!only || only === "axe") {
      await runAxe(browser, base, routes);
    }
    if (!only || only === "cls") {
      await runCls(browser, base);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
