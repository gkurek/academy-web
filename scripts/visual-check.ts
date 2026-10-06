/**
 * Visual and behavior regression check (plan 10/RF, D10/D11).
 *
 * When to run:
 *   - once, before RF-1:  npm run check:visual -- --save-baseline https://academy-web-lovat.vercel.app
 *   - after every RF package, against a local production build (`npm run build && npm run start`):
 *       npm run check:visual
 *
 * The baseline lives in `.visual/baseline/` (git-ignored) and is compared against by every package.
 * Differences that a package announces ("Zmiana widoczna") go to `scripts/visual-check.expected.json`.
 *
 * Flags: --save-baseline <url> | --head <url> (default http://localhost:3000)
 *        --widths 390,1440 --routes /a,/b --only screenshots|styles|html|smoke
 */
import fs from "node:fs/promises";
import path from "node:path";

import { chromium, type Browser, type Page } from "playwright";
import sharp from "sharp";

type Signal = "screenshot" | "styles" | "html" | "smoke";
type Verdict = "PASS" | "EXPECTED" | "FAIL";

interface RouteConfig {
  path: string;
  mask?: string[];
}

interface ExpectedEntry {
  id: string;
  route: string;
  signal: Signal;
  width?: number;
  note: string;
}

interface StyleRecord {
  key: string;
  text: string;
  style: Record<string, string>;
}

interface SmokeResult {
  name: string;
  ok: boolean;
  detail: string;
}

interface Row {
  route: string;
  width?: number;
  signal: Signal;
  verdict: Verdict;
  detail: string;
}

const ROOT = path.resolve(__dirname, "..");
const VISUAL_DIR = path.join(ROOT, ".visual");
const BASELINE_DIR = path.join(VISUAL_DIR, "baseline");
const HEAD_DIR = path.join(VISUAL_DIR, "head");
const DIFF_DIR = path.join(VISUAL_DIR, "diff");
const SHOT_THRESHOLD = 0.001; // 0.1 % of pixels
const CHANNEL_TOLERANCE = 16; // per-channel difference ignored as anti-aliasing noise
const CONCURRENCY = 4;

const STYLE_SELECTORS = ["h1", "h2", "h3", "p", "section", "main", "nav a", "button"];
const STYLE_PROPS = [
  "font-size",
  "line-height",
  "font-weight",
  "color",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "outline-width",
  "outline-style",
];

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function routeSlug(route: string): string {
  return route === "/" ? "home" : route.slice(1).replace(/\//g, "__");
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, "utf8")) as T;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

/** Runs `items` through `worker` with a fixed number of parallel workers. */
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
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  // tsx injects `__name` into functions passed to page.evaluate; define it in the page.
  await context.addInitScript("window.__name = (fn) => fn;");
  const page = await context.newPage();
  return { page, close: () => context.close() };
}

async function settlePage(page: Page): Promise<void> {
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;caret-color:transparent!important}",
  });
  // Scroll through the page so lazy images load, then wait for every image and font.
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let y = 0;
    while (y < document.documentElement.scrollHeight) {
      window.scrollTo(0, y);
      await sleep(80);
      y += window.innerHeight;
    }
    window.scrollTo(0, 0);
    // Images without a layout box (tiles hidden below a breakpoint) never load lazily — skip them.
    await Promise.all(
      Array.from(document.images)
        .filter((img) => img.getClientRects().length > 0)
        .map((img) =>
          img.complete
            ? null
            : new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              }),
        ),
    );
    await document.fonts.ready;
  });
  await page.waitForTimeout(150);
}

async function captureRoute(
  browser: Browser,
  baseUrl: string,
  route: RouteConfig,
  width: number,
  outDir: string,
  only: string | undefined,
): Promise<void> {
  const { page, close } = await openPage(browser, width);
  try {
    await page.goto(new URL(route.path, baseUrl).toString(), { waitUntil: "networkidle" });
    await settlePage(page);
    const mask = route.mask ?? [];
    if (mask.length > 0) {
      await page.addStyleTag({ content: mask.map((selector) => `${selector}{visibility:hidden!important}`).join("") });
    }
    const slug = routeSlug(route.path);
    if (!only || only === "screenshots") {
      await ensureDir(path.join(outDir, "shots"));
      await page.screenshot({ path: path.join(outDir, "shots", `${slug}-${width}.png`), fullPage: true });
    }
    if (!only || only === "styles") {
      const styles = await page.evaluate(
        ({ selectors, props, masks }) => {
          const masked = masks.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
          return selectors.flatMap((selector) =>
            Array.from(document.querySelectorAll(selector))
              .filter((element) => !masked.some((m) => m.contains(element)))
              .map((element, index) => {
                const computed = getComputedStyle(element);
                return {
                  key: `${selector}#${index}`,
                  text: (element.textContent ?? "").trim().slice(0, 30),
                  style: Object.fromEntries(props.map((prop) => [prop, computed.getPropertyValue(prop)])),
                };
              }),
          );
        },
        { selectors: STYLE_SELECTORS, props: STYLE_PROPS, masks: mask },
      );
      await writeJson(path.join(outDir, "styles", `${slug}-${width}.json`), styles);
    }
  } finally {
    await close();
  }
}

function normalizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<link[^>]*>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(&amp;|&|\?)(w|q)=\d+/g, "")
    .replace(/\/_next\/static\/[^"'\s)]+/g, "/_next/static/X")
    .replace(/_R_[a-zA-Z0-9]+_/g, "_R_")
    .replace(/\s+/g, " ")
    .replace(/></g, ">\n<")
    .replace(/ </g, "\n<");
}

async function captureHtml(baseUrl: string, route: RouteConfig, outDir: string): Promise<void> {
  const response = await fetch(new URL(route.path, baseUrl), { redirect: "follow" });
  await ensureDir(path.join(outDir, "html"));
  await fs.writeFile(path.join(outDir, "html", `${routeSlug(route.path)}.html`), normalizeHtml(await response.text()));
}

async function compareShots(baseFile: string, headFile: string, diffFile: string): Promise<{ ratio: number; detail: string }> {
  const [base, head] = await Promise.all(
    [baseFile, headFile].map((file) => sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
  );
  const width = base.info.width;
  if (head.info.width !== width) {
    return { ratio: 1, detail: `width ${width} vs ${head.info.width}` };
  }
  const commonHeight = Math.min(base.info.height, head.info.height);
  const maxHeight = Math.max(base.info.height, head.info.height);
  const pixels = width * commonHeight;
  const out = Buffer.from(head.data.subarray(0, pixels * 4));
  const differing = Array.from({ length: pixels }).reduce<number>((count, _, pixel) => {
    const offset = pixel * 4;
    const delta = [0, 1, 2].some(
      (channel) => Math.abs(base.data[offset + channel] - head.data[offset + channel]) > CHANNEL_TOLERANCE,
    );
    if (delta) {
      out[offset] = 255;
      out[offset + 1] = 0;
      out[offset + 2] = 0;
      return count + 1;
    }
    return count;
  }, 0);
  const extraPixels = width * (maxHeight - commonHeight);
  const ratio = (differing + extraPixels) / (width * maxHeight);
  if (ratio > 0) {
    await ensureDir(path.dirname(diffFile));
    await sharp(out, { raw: { width, height: commonHeight, channels: 4 } }).png().toFile(diffFile);
  }
  const heightNote = base.info.height === head.info.height ? "" : `, height ${base.info.height} vs ${head.info.height}`;
  return { ratio, detail: `${(ratio * 100).toFixed(3)} % pixels${heightNote}` };
}

function diffStyles(base: StyleRecord[], head: StyleRecord[]): string[] {
  if (base.length !== head.length) {
    return [`element count ${base.length} vs ${head.length}`];
  }
  return base.flatMap((record, index) => {
    const other = head[index];
    if (other.key !== record.key) {
      return [`${record.key} vs ${other.key}`];
    }
    return Object.keys(record.style)
      .filter((prop) => record.style[prop] !== other.style[prop])
      .map((prop) => `${record.key} "${record.text}" ${prop}: ${record.style[prop]} → ${other.style[prop]}`);
  });
}

function diffLines(base: string, head: string): string[] {
  const baseLines = base.split("\n");
  const headLines = head.split("\n");
  const baseSet = new Set(baseLines);
  const headSet = new Set(headLines);
  return [
    ...baseLines.filter((line) => !headSet.has(line)).map((line) => `- ${line.slice(0, 160)}`),
    ...headLines.filter((line) => !baseSet.has(line)).map((line) => `+ ${line.slice(0, 160)}`),
  ];
}

/** Behavior checks (plan 10/RF "Weryfikacja", point 4). Run against a single address. */
async function runSmoke(browser: Browser, baseUrl: string): Promise<SmokeResult[]> {
  const url = (route: string) => new URL(route, baseUrl).toString();
  const check = async (name: string, width: number, fn: (page: Page) => Promise<string>): Promise<SmokeResult> => {
    const { page, close } = await openPage(browser, width);
    try {
      return { name, ok: true, detail: await fn(page) };
    } catch (error) {
      return { name, ok: false, detail: error instanceof Error ? error.message.split("\n")[0] : String(error) };
    } finally {
      await close();
    }
  };
  const assert = (condition: boolean, message: string) => {
    if (!condition) {
      throw new Error(message);
    }
  };

  return [
    await check("skip link goes to #main-content", 1440, async (page) => {
      await page.goto(url("/"), { waitUntil: "networkidle" });
      await page.keyboard.press("Tab");
      const href = await page.evaluate(() => (document.activeElement as HTMLAnchorElement | null)?.getAttribute("href"));
      assert(href === "#main-content", `first Tab focuses ${href}`);
      await page.keyboard.press("Enter");
      assert(page.url().endsWith("#main-content"), "hash not set");
      assert((await page.locator("#main-content").count()) === 1, "no #main-content");
      return "ok";
    }),
    await check("mobile menu: dialog, Tab cycle, Escape, focus return", 390, async (page) => {
      await page.goto(url("/"), { waitUntil: "networkidle" });
      const toggle = page.locator('button[aria-label="Menu"]');
      await toggle.click();
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({ state: "visible" });
      const inside = () =>
        page.evaluate(() => {
          const active = document.activeElement;
          return !!active && (!!active.closest('[role="dialog"]') || active.getAttribute("aria-label") === "Menu");
        });
      const stays = await Array.from({ length: 30 }).reduce<Promise<boolean>>(async (acc) => {
        const ok = await acc;
        await page.keyboard.press("Tab");
        return ok && (await inside());
      }, Promise.resolve(true));
      assert(stays, "focus left the dialog on Tab");
      await page.keyboard.press("Escape");
      assert((await dialog.count()) === 0, "dialog still open after Escape");
      const returned = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Menu");
      assert(returned, "focus did not return to the menu button");
      return "ok";
    }),
    await check("gallery filter narrows the grid (deep link and chip)", 1440, async (page) => {
      const items = 'button[aria-label^="Powiększ ikonę"]';
      await page.goto(url("/ikony"), { waitUntil: "networkidle" });
      await page.locator(items).first().waitFor();
      const all = await page.locator(items).count();
      await page.locator('a[href="/ikony?temat=swieta"]').first().click();
      await page.waitForURL(/temat=swieta/);
      await page.waitForTimeout(500);
      const chip = await page.locator(items).count();
      assert(chip > 0 && chip < all, `chip: ${chip} of ${all}`);
      await page.goto(url("/ikony?temat=swieta"), { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const deep = await page.locator(items).count();
      assert(deep === chip, `deep link: ${deep} vs chip ${chip}`);
      return `${chip} of ${all}`;
    }),
    ...(await Promise.all(
      [
        ["/ikony", 'button[aria-label^="Powiększ ikonę"]'],
        ["/aktualnosci/ikona-dzis-3", 'button[aria-label^="Powiększ"]'],
        ["/publikacje/ikona-dzis", 'button[aria-label^="Powiększ"]'],
      ].map(([route, trigger]) =>
        check(`lightbox on ${route}: open, arrows, Escape`, 1440, async (page) => {
          await page.goto(url(route), { waitUntil: "networkidle" });
          await page.locator(trigger).first().click();
          const dialog = page.locator("dialog[open]");
          await dialog.waitFor({ state: "visible" });
          const imageSrc = () => dialog.locator("img").first().getAttribute("src");
          const first = await imageSrc();
          await page.keyboard.press("ArrowRight");
          await page.waitForTimeout(300);
          const second = await imageSrc();
          assert(first !== second, "ArrowRight did not change the image");
          await page.keyboard.press("ArrowLeft");
          await page.waitForTimeout(300);
          assert((await imageSrc()) === first, "ArrowLeft did not go back");
          await page.keyboard.press("Escape");
          assert((await page.locator("dialog[open]").count()) === 0, "dialog open after Escape");
          return "ok";
        }),
      ),
    )),
    await check("archive hash expands the season", 1440, async (page) => {
      await page.goto(url("/wyklady/archiwum#season-2019-2020"), { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      const expanded = await page.locator("#season-trigger-2019-2020").getAttribute("aria-expanded");
      assert(expanded === "true", `aria-expanded=${expanded}`);
      return "ok";
    }),
    await check("FactsBox mailto and footer tel hrefs", 1440, async (page) => {
      await page.goto(url("/warsztaty/kurs-roczny-i-trzyletni"), { waitUntil: "networkidle" });
      const mailto = await page.locator('main a[href^="mailto:"]').first().getAttribute("href");
      assert(!!mailto && /^mailto:[^@\s]+@[^@\s]+/.test(mailto), `mailto=${mailto}`);
      const tel = await page.locator('footer a[href^="tel:"]').first().getAttribute("href");
      assert(!!tel && /^tel:\+48\d{9}$/.test(tel), `tel=${tel}`);
      return `${mailto} ${tel}`;
    }),
    await check("TOC expands on /pracownia", 390, async (page) => {
      await page.goto(url("/pracownia"), { waitUntil: "networkidle" });
      const details = page.locator("details", { has: page.locator("summary", { hasText: "Na tej stronie" }) }).first();
      await details.locator("summary").click();
      assert((await details.getAttribute("open")) !== null, "details not open");
      assert((await details.locator("nav a").first().isVisible()) === true, "no visible TOC link");
      return "ok";
    }),
    await check("unknown route gives 404 with the page shell", 1440, async (page) => {
      const response = await page.goto(url("/nie-ma-takiej-strony"), { waitUntil: "networkidle" });
      assert(response?.status() === 404, `status ${response?.status()}`);
      assert((await page.locator("header, nav").count()) > 0, "no header/nav");
      assert((await page.locator("main").count()) === 1, "no main");
      return "ok";
    }),
    await check("/ikony/wystawa redirects to /ikony/wystawy", 1440, async (page) => {
      await page.goto(url("/ikony/wystawa"), { waitUntil: "networkidle" });
      assert(new URL(page.url()).pathname === "/ikony/wystawy", `landed on ${page.url()}`);
      return "ok";
    }),
  ];
}

function verdictFor(expected: ExpectedEntry[], route: string, signal: Signal, width?: number): Verdict {
  const covered = expected.some(
    (entry) =>
      entry.signal === signal &&
      (entry.route === "*" || entry.route === route) &&
      (entry.width === undefined || entry.width === width),
  );
  return covered ? "EXPECTED" : "FAIL";
}

function renderReport(head: string, rows: Row[], smoke: SmokeResult[], baselineSmoke: SmokeResult[]): string {
  const count = (verdict: Verdict) => rows.filter((row) => row.verdict === verdict).length;
  const smokeRows = smoke.map((result) => {
    const baseOk = baselineSmoke.find((item) => item.name === result.name)?.ok;
    const verdict = result.ok ? "PASS" : baseOk === false ? "BASELINE-FAIL" : "FAIL";
    return `| ${verdict} | ${result.name} | ${result.detail} |`;
  });
  const issues = rows.filter((row) => row.verdict !== "PASS");
  return [
    `# check:visual — head ${head}`,
    "",
    `PASS ${count("PASS")} · EXPECTED ${count("EXPECTED")} · FAIL ${count("FAIL")} · smoke FAIL ${smoke.filter((r) => !r.ok && baselineSmoke.find((b) => b.name === r.name)?.ok !== false).length}`,
    "",
    "## Differences",
    "",
    "| Verdict | Route | Width | Signal | Detail |",
    "| --- | --- | --- | --- | --- |",
    ...issues.map((row) => `| ${row.verdict} | ${row.route} | ${row.width ?? ""} | ${row.signal} | ${row.detail.replace(/\n/g, "<br>")} |`),
    "",
    "## Smoke",
    "",
    "| Verdict | Check | Detail |",
    "| --- | --- | --- |",
    ...smokeRows,
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  const config = await readJson<{ widths: number[]; routes: RouteConfig[] }>(path.join(__dirname, "visual-check.routes.json"));
  const only = readArg("only");
  const routeFilter = readArg("routes")?.split(",");
  const widths = readArg("widths")?.split(",").map(Number) ?? config.widths;
  const routes = config.routes.filter((route) => !routeFilter || routeFilter.includes(route.path));
  const saveBaseline = readArg("save-baseline");
  const headUrl = saveBaseline ?? readArg("head") ?? "http://localhost:3000";
  const outDir = saveBaseline ? BASELINE_DIR : HEAD_DIR;
  const jobs = routes.flatMap((route) => widths.map((width) => ({ route, width })));

  const browser = await chromium.launch();
  try {
    if (only !== "smoke") {
      await runPool(jobs, ({ route, width }) => captureRoute(browser, headUrl, route, width, outDir, only));
      if (!only || only === "html") {
        await runPool(routes, (route) => captureHtml(headUrl, route, outDir));
      }
    }
    const smoke = !only || only === "smoke" ? await runSmoke(browser, headUrl) : [];
    if (saveBaseline) {
      await writeJson(path.join(BASELINE_DIR, "smoke.json"), smoke);
      await writeJson(path.join(BASELINE_DIR, "meta.json"), { source: saveBaseline, savedAt: new Date().toISOString() });
      console.log(`Baseline saved to ${BASELINE_DIR} (${jobs.length} captures, ${smoke.length} smoke checks).`);
      smoke.filter((result) => !result.ok).forEach((result) => console.log(`  smoke FAIL in baseline: ${result.name} — ${result.detail}`));
      return;
    }

    const expected = await readJson<ExpectedEntry[]>(path.join(__dirname, "visual-check.expected.json"));
    const rows: Row[] = [];
    const push = (row: Omit<Row, "verdict"> & { ok: boolean }) =>
      rows.push({
        route: row.route,
        width: row.width,
        signal: row.signal,
        detail: row.detail,
        verdict: row.ok ? "PASS" : verdictFor(expected, row.route, row.signal, row.width),
      });

    await runPool(jobs, async ({ route, width }) => {
      const slug = routeSlug(route.path);
      if (!only || only === "screenshots") {
        const diffFile = path.join(DIFF_DIR, `${slug}-${width}.png`);
        const result = await compareShots(
          path.join(BASELINE_DIR, "shots", `${slug}-${width}.png`),
          path.join(HEAD_DIR, "shots", `${slug}-${width}.png`),
          diffFile,
        );
        push({ route: route.path, width, signal: "screenshot", ok: result.ratio <= SHOT_THRESHOLD, detail: result.detail });
      }
      if (!only || only === "styles") {
        const styleFile = `${slug}-${width}.json`;
        const [base, current] = await Promise.all([
          readJson<StyleRecord[]>(path.join(BASELINE_DIR, "styles", styleFile)),
          readJson<StyleRecord[]>(path.join(HEAD_DIR, "styles", styleFile)),
        ]);
        const differences = diffStyles(base, current);
        push({
          route: route.path,
          width,
          signal: "styles",
          ok: differences.length === 0,
          detail: `${differences.length} differences${differences.length ? `:<br>${differences.slice(0, 5).join("<br>")}` : ""}`,
        });
      }
    });
    if (!only || only === "html") {
      await Promise.all(
        routes.map(async (route) => {
          const file = `${routeSlug(route.path)}.html`;
          const [base, current] = await Promise.all([
            fs.readFile(path.join(BASELINE_DIR, "html", file), "utf8"),
            fs.readFile(path.join(HEAD_DIR, "html", file), "utf8"),
          ]);
          const differences = base === current ? [] : diffLines(base, current);
          push({
            route: route.path,
            signal: "html",
            ok: differences.length === 0,
            detail: `${differences.length} lines${differences.length ? `:<br>${differences.slice(0, 6).join("<br>")}` : ""}`,
          });
        }),
      );
    }

    const baselineSmoke = await readJson<SmokeResult[]>(path.join(BASELINE_DIR, "smoke.json")).catch(() => []);
    const sortedRows = [...rows].sort((a, b) => a.route.localeCompare(b.route) || (a.width ?? 0) - (b.width ?? 0));
    await ensureDir(VISUAL_DIR);
    await fs.writeFile(path.join(VISUAL_DIR, "report.md"), renderReport(headUrl, sortedRows, smoke, baselineSmoke));

    const fails = rows.filter((row) => row.verdict === "FAIL").length;
    const smokeFails = smoke.filter((result) => !result.ok && baselineSmoke.find((item) => item.name === result.name)?.ok !== false);
    console.log(
      `PASS ${rows.filter((r) => r.verdict === "PASS").length} · EXPECTED ${rows.filter((r) => r.verdict === "EXPECTED").length} · FAIL ${fails} · smoke FAIL ${smokeFails.length}`,
    );
    console.log(`Report: ${path.join(VISUAL_DIR, "report.md")}`);
    process.exitCode = fails + smokeFails.length > 0 ? 1 : 0;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
