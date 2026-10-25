/**
 * Near-duplicate scan for the WP photo library (~/Desktop/ejk-pic-library). READ-ONLY for the photos:
 * computes a 64-bit dHash per image, clusters images within a Hamming distance threshold and writes
 * an HTML review page with thumbnails to <dir>/_scan/near-duplicates.html (plus thumbs and JSON).
 * Nothing is moved or deleted. Largest image (by pixels, then bytes) is marked as the one to keep.
 * Usage (from repo root): npx tsx scripts/scan-near-duplicates.ts [--threshold=10] [dir]
 */

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const THRESHOLD = Number(args.find((a) => a.startsWith("--threshold="))?.split("=")[1] ?? 10);
const TARGET_DIR = args.find((a) => !a.startsWith("--")) ?? join(homedir(), "Desktop", "ejk-pic-library");
const SCAN_DIR = join(TARGET_DIR, "_scan");
const THUMB_DIR = join(SCAN_DIR, "thumbs");
const THUMB_WIDTH = 360;
const CONCURRENCY = 8;

type MetaItem = { file: string; title?: string; caption?: string; parent?: { title?: string } | null };
type Entry = {
  file: string;
  hash: bigint;
  width: number;
  height: number;
  bytes: number;
  title: string;
  parent: string;
};

const metadata: { items: MetaItem[] } = JSON.parse(readFileSync(join(TARGET_DIR, "metadata.json"), "utf8"));

// Optional _scan/keep-both.json: arrays of files the owner decided to keep together; such clusters are hidden.
const keepBoth: string[][] = (() => {
  try {
    return JSON.parse(readFileSync(join(SCAN_DIR, "keep-both.json"), "utf8"));
  } catch {
    return [];
  }
})();

// tsconfig targets ES2017, which has no bigint literals.
const ZERO = BigInt(0);
const ONE = BigInt(1);

const popcount = (n: bigint): number => (n === ZERO ? 0 : Number(n & ONE) + popcount(n >> ONE));

// 9x8 grayscale, each bit = left pixel brighter than its right neighbour.
const dHash = async (path: string): Promise<{ hash: bigint; width: number; height: number }> => {
  const base = sharp(path, { failOn: "none" }).rotate();
  const { width = 0, height = 0 } = await sharp(await base.clone().toBuffer()).metadata();
  const px = await base
    .clone()
    .flatten({ background: "#ffffff" })
    .grayscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer();
  const hash = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return px[row * 9 + col] > px[row * 9 + col + 1] ? ONE : ZERO;
  }).reduce<bigint>((acc, bit) => (acc << ONE) | bit, ZERO);
  return { hash, width, height };
};

const mapLimit = async <T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> => {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    const i = next++;
    if (i >= items.length) return;
    out[i] = await fn(items[i]);
    await worker();
  };
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
};

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const main = async () => {
  mkdirSync(THUMB_DIR, { recursive: true });

  const entries: Entry[] = await mapLimit(metadata.items, CONCURRENCY, async (item) => {
    const full = join(TARGET_DIR, item.file);
    const { hash, width, height } = await dHash(full);
    return {
      file: item.file,
      hash,
      width,
      height,
      bytes: statSync(full).size,
      title: item.title ?? "",
      parent: item.parent?.title ?? "",
    };
  });

  // Union-find over pairs within threshold.
  const parent = entries.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  entries.forEach((a, i) =>
    entries.slice(i + 1).forEach((b, k) => {
      if (popcount(a.hash ^ b.hash) <= THRESHOLD) parent[find(i)] = find(i + 1 + k);
    }),
  );

  const clusters = Object.values(
    entries.reduce<Record<number, number[]>>((acc, _, i) => {
      (acc[find(i)] ??= []).push(i);
      return acc;
    }, {}),
  )
    .filter((c) => c.length > 1)
    .filter((c) => !keepBoth.some((set) => c.every((i) => set.includes(entries[i].file))))
    .map((c) =>
      [...c].sort((x, y) => entries[y].width * entries[y].height - entries[x].width * entries[x].height || entries[y].bytes - entries[x].bytes),
    )
    .sort((a, b) => b.length - a.length);

  const needThumbs = Array.from(new Set(clusters.flat()));
  const thumbName = (i: number) => `${i}.jpg`;
  await mapLimit(needThumbs, CONCURRENCY, (i) =>
    sharp(join(TARGET_DIR, entries[i].file), { failOn: "none" })
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width: THUMB_WIDTH, height: THUMB_WIDTH, fit: "inside" })
      .jpeg({ quality: 70 })
      .toFile(join(THUMB_DIR, thumbName(i))),
  );

  const card = (i: number, keep: boolean, dist: number, num: number) => {
    const e = entries[i];
    const href = `../${e.file.split("/").map(encodeURIComponent).join("/")}`;
    return `<figure class="${keep ? "keep" : ""}">
  <a href="${href}" target="_blank"><img src="thumbs/${thumbName(i)}" loading="lazy" alt=""></a>
  <figcaption>
    <b class="num">#${num}</b> <b>${keep ? "ZOSTAJE (największy)" : `dist ${dist}`}</b><br>
    ${escapeHtml(e.file)}<br>
    ${e.width}×${e.height} · ${(e.bytes / 1024).toFixed(0)} KB<br>
    ${escapeHtml(e.title)}${e.parent ? ` · ${escapeHtml(e.parent)}` : ""}
  </figcaption>
</figure>`;
  };

  const html = `<!doctype html><meta charset="utf-8"><title>Near-duplicates (threshold ${THRESHOLD})</title>
<style>
body{font:14px system-ui;margin:16px;background:#fafafa}
section{background:#fff;border:1px solid #ccc;margin:0 0 16px;padding:8px}
.row{display:flex;flex-wrap:wrap;gap:8px}
figure{margin:0;width:${THUMB_WIDTH}px;border:2px solid transparent;padding:4px}
figure.keep{border-color:#2a9d3f}
img{max-width:100%;display:block}
figcaption{font-size:12px;word-break:break-all}
h3 label{cursor:pointer}
.num{font-size:18px;background:#222;color:#fff;padding:0 6px}
.bar{position:sticky;top:0;background:#fff;border-bottom:1px solid #ccc;padding:8px 0;margin-bottom:16px;z-index:1}
section.ok{border-color:#2a9d3f;background:#f2fbf4}
</style>
<h1>Prawie-duplikaty: ${clusters.length} grup, ${clusters.reduce((n, c) => n + c.length - 1, 0)} kandydatów do usunięcia (próg ${THRESHOLD}/64)</h1>
<div class="bar">
  Zaakceptowane grupy: <b id="count">0</b> / ${clusters.length}
  <button id="all">Zaznacz wszystkie</button>
  <button id="none">Odznacz wszystkie</button>
  <button id="save">Pobierz approved-groups.json</button>
</div>
${clusters
  .map(
    (c, n) =>
      `<section id="g${n}"><h3><label><input type="checkbox" class="approve" data-group="${n}"> Zgadzam się: usuń ${c.length - 1} z grupy ${n + 1}, zostaje zielone</label></h3><div class="row">${c
        .map((i, k) => card(i, k === 0, popcount(entries[i].hash ^ entries[c[0]].hash), k + 1))
        .join("")}</div></section>`,
  )
  .join("\n")}
<script>
const groups = ${JSON.stringify(clusters.map((c) => ({ keep: entries[c[0]].file, remove: c.slice(1).map((i) => entries[i].file) })))};
const KEY = "near-dup-approved-${THRESHOLD}-${Date.now()}";
const boxes = Array.from(document.querySelectorAll(".approve"));
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
const refresh = () => {
  const on = boxes.filter((b) => b.checked).map((b) => Number(b.dataset.group));
  boxes.forEach((b) => document.getElementById("g" + b.dataset.group).classList.toggle("ok", b.checked));
  document.getElementById("count").textContent = on.length;
  try { localStorage.setItem(KEY, JSON.stringify(on)); } catch {}
};
load().forEach((n) => { if (boxes[n]) boxes[n].checked = true; });
boxes.forEach((b) => b.addEventListener("change", refresh));
document.getElementById("all").onclick = () => { boxes.forEach((b) => (b.checked = true)); refresh(); };
document.getElementById("none").onclick = () => { boxes.forEach((b) => (b.checked = false)); refresh(); };
document.getElementById("save").onclick = () => {
  const approved = boxes.filter((b) => b.checked).map((b) => groups[Number(b.dataset.group)]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(approved, null, 2)], { type: "application/json" }));
  a.download = "approved-groups.json";
  a.click();
};
refresh();
</script>`;

  writeFileSync(join(SCAN_DIR, "near-duplicates.html"), html);
  writeFileSync(
    join(SCAN_DIR, "near-duplicates.json"),
    JSON.stringify(
      clusters.map((c) => ({ keep: entries[c[0]].file, remove: c.slice(1).map((i) => entries[i].file) })),
      null,
      2,
    ),
  );
  console.log(
    `${entries.length} images, ${clusters.length} groups (threshold ${THRESHOLD}), ${clusters.reduce((n, c) => n + c.length - 1, 0)} candidates`,
  );
  console.log(`Report: ${join(SCAN_DIR, "near-duplicates.html")}`);
};

main();
