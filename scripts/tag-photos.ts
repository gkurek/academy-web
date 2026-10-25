/**
 * Local tagging app for the WP photo library (~/Desktop/ejk-pic-library). Serves a single page on localhost:
 * pick categories, click photos, "Zapisz" adds the categories to the selected photos. Tags are written on every
 * change to <dir>/tags.json; thumbnails are generated on demand into <dir>/_thumbs/. Photos are never modified,
 * but the lightbox can delete a photo from disk (permanently, after a confirm in the page).
 * Usage (from repo root): npx tsx scripts/tag-photos.ts [--port=4123] [dir]
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { extname, join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const PORT = Number(args.find((a) => a.startsWith("--port="))?.split("=")[1] ?? 4123);
const TARGET_DIR = args.find((a) => !a.startsWith("--")) ?? join(homedir(), "Desktop", "ejk-pic-library");
const TAGS_FILE = join(TARGET_DIR, "tags.json");
const THUMB_DIR = join(TARGET_DIR, "_thumbs");
const THUMB_SIZE = 480;
const DEFAULT_CATEGORIES = [
  "ikona – zbliżenie",
  "wystawy",
  "akademia – uczestnicy",
  "warsztaty",
  "wydarzenia",
  "inne",
];

type MetaItem = { file: string; title?: string; parent?: { title?: string } | null };
// `deleted` keeps the slot in `photos` so the indexes used by /thumb and /photo stay stable.
// `cls` comes from _scan/classification.json (scripts/classify-photos.ts); only photos in the classified categories have it.
type Cls = { width: number; height: number; rank: "A" | "B" | "C"; orientation: string; onSite: { file: string; distance: number } | null };
type Photo = { file: string; title: string; parent: string; deleted?: boolean; cls?: Cls };
// `starred`: the owner's shortlist for the slot currently being reviewed; Claude reads it to place the photo, then it is cleared.
type Tags = { categories: string[]; photos: Record<string, string[]>; starred?: string[] };

const metadata: { items: MetaItem[] } = JSON.parse(readFileSync(join(TARGET_DIR, "metadata.json"), "utf8"));
const classification: Record<string, Cls> = (() => {
  try {
    return JSON.parse(readFileSync(join(TARGET_DIR, "_scan", "classification.json"), "utf8")).photos;
  } catch {
    return {};
  }
})();
const photos: Photo[] = metadata.items
  .filter((item) => existsSync(join(TARGET_DIR, item.file)))
  .map((item) => ({ file: item.file, title: item.title ?? "", parent: item.parent?.title ?? "", cls: classification[item.file] }));
const knownFiles = new Set(photos.map((p) => p.file));

const tags: Tags = existsSync(TAGS_FILE)
  ? JSON.parse(readFileSync(TAGS_FILE, "utf8"))
  : { categories: DEFAULT_CATEGORIES, photos: {} };

// Write to a temp file first so a crash mid-write never leaves a truncated tags.json.
const saveTags = () => {
  const tmp = `${TAGS_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(tags, null, 2));
  renameSync(tmp, TAGS_FILE);
};
if (!existsSync(TAGS_FILE)) saveTags();

const setPhotoTags = (file: string, next: string[]) => {
  if (next.length) tags.photos[file] = next;
  else delete tags.photos[file];
};

const thumbPath = (file: string) => join(THUMB_DIR, `${file.replace(/\//g, "__")}.jpg`);
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};
const inflight = new Map<string, Promise<void>>();
const ensureThumb = (file: string): Promise<void> => {
  const out = thumbPath(file);
  if (existsSync(out)) return Promise.resolve();
  const pending =
    inflight.get(file) ??
    sharp(join(TARGET_DIR, file), { failOn: "none" })
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: "inside" })
      .jpeg({ quality: 75 })
      .toFile(out)
      .then(() => undefined)
      .finally(() => inflight.delete(file));
  inflight.set(file, pending);
  return pending;
};

const readBody = (req: IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

const asStrings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

type Handler = (body: Record<string, unknown>) => string | null;

// Each handler mutates `tags` and returns an error message, or null on success.
const handlers: Record<string, Handler> = {
  "/api/apply": (body) => {
    const files = asStrings(body.files).filter((f) => knownFiles.has(f));
    const cats = asStrings(body.categories).filter((c) => tags.categories.includes(c));
    if (!files.length || !cats.length) return "Brak zdjęć lub kategorii.";
    files.forEach((f) => {
      const current = tags.photos[f] ?? [];
      setPhotoTags(
        f,
        body.mode === "remove"
          ? current.filter((c) => !cats.includes(c))
          : tags.categories.filter((c) => current.includes(c) || cats.includes(c)),
      );
    });
    return null;
  },
  "/api/star": (body) => {
    if (body.clear) {
      tags.starred = [];
      return null;
    }
    const files = asStrings(body.files).filter((f) => knownFiles.has(f));
    if (!files.length) return "Brak zdjęć.";
    const current = new Set(tags.starred ?? []);
    files.forEach((f) => (body.on ? current.add(f) : current.delete(f)));
    tags.starred = [...current];
    return null;
  },
  "/api/categories/add": (body) => {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return "Pusta nazwa.";
    if (tags.categories.includes(name)) return "Taka kategoria już jest.";
    tags.categories.push(name);
    return null;
  },
  "/api/categories/delete": (body) => {
    const name = typeof body.name === "string" ? body.name : "";
    if (!tags.categories.includes(name)) return "Nie ma takiej kategorii.";
    tags.categories = tags.categories.filter((c) => c !== name);
    Object.keys(tags.photos).forEach((f) => setPhotoTags(f, tags.photos[f].filter((c) => c !== name)));
    return null;
  },
  // Permanent delete: removes the original and its thumbnail; metadata.json is left as is (missing files are skipped on start).
  "/api/photos/delete": (body) => {
    const files = asStrings(body.files).filter((f) => knownFiles.has(f));
    if (!files.length) return "Brak zdjęć do usunięcia.";
    files.forEach((f) => {
      unlinkSync(join(TARGET_DIR, f));
      if (existsSync(thumbPath(f))) unlinkSync(thumbPath(f));
      knownFiles.delete(f);
      setPhotoTags(f, []);
      photos.filter((p) => p.file === f).forEach((p) => (p.deleted = true));
    });
    return null;
  },
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  try {
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(PAGE);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/state") {
      sendJson(res, 200, { photos, tags });
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/thumb/")) {
      const photo = photos[Number(url.pathname.slice("/thumb/".length))];
      if (!photo || photo.deleted) {
        res.writeHead(404).end();
        return;
      }
      await ensureThumb(photo.file);
      res.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "max-age=86400" });
      res.end(readFileSync(thumbPath(photo.file)));
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/photo/")) {
      const photo = photos[Number(url.pathname.slice("/photo/".length))];
      if (!photo || photo.deleted) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[extname(photo.file).toLowerCase()] ?? "application/octet-stream" });
      res.end(readFileSync(join(TARGET_DIR, photo.file)));
      return;
    }
    const handler = handlers[url.pathname];
    if (req.method === "POST" && handler) {
      const error = handler((await readBody(req)) as Record<string, unknown>);
      if (error) {
        sendJson(res, 400, { error });
        return;
      }
      saveTags();
      sendJson(res, 200, { tags });
      return;
    }
    res.writeHead(404).end();
  } catch (e) {
    console.error(e);
    sendJson(res, 500, { error: String(e) });
  }
});

const PAGE = `<!doctype html>
<html lang="pl"><meta charset="utf-8"><title>Tagowanie zdjęć</title>
<style>
*{box-sizing:border-box}
body{font:15px system-ui,sans-serif;margin:0;background:#f2f0ec;color:#222}
.bar{position:sticky;top:0;z-index:2;background:#fff;border-bottom:1px solid #ccc;padding:10px 16px;display:grid;gap:8px}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.cat{display:inline-flex;border:1px solid #999;background:#fff}
.cat button{border:0;background:none;font:inherit;padding:6px 10px;cursor:pointer}
.cat .pick[aria-pressed=true]{background:#1f4e79;color:#fff}
.cat .n{display:inline-block;min-width:1.6em;margin-left:6px;padding:0 4px;background:#e4e1da;color:#222;font-size:12px;text-align:center}
.cat .del{border-left:1px solid #ccc;color:#a33}
.cat .del:hover{background:#fbe9e9}
input,select,.act{font:inherit;padding:6px 10px;border:1px solid #999;background:#fff}
.act{cursor:pointer}
.act.primary{background:#2a7a3b;border-color:#2a7a3b;color:#fff}
.act:disabled{opacity:.4;cursor:not-allowed}
.info{color:#555}
:focus-visible{outline:2px solid #e8c765;outline-offset:2px}
.grid{display:grid;grid-template-columns:repeat(8,1fr);gap:12px;padding:16px}
.tile{position:relative;border:4px solid transparent;background:#fff}
.tile .pick{display:block;width:100%;padding:0;border:0;background:none;cursor:pointer;text-align:left;font:inherit}
.tile .view{position:absolute;top:6px;left:6px;z-index:1;width:32px;height:32px;padding:0;border:0;background:rgba(0,0,0,.6);color:#fff;font-size:18px;cursor:pointer}
.tile .view:hover{background:#000}
.tile img{display:block;width:100%;aspect-ratio:1;object-fit:contain;background:#ddd}
.tile.sel{border-color:#1f4e79}
.tile.sel::after{content:"✓";position:absolute;top:6px;right:6px;width:32px;height:32px;line-height:32px;text-align:center;background:#1f4e79;color:#fff;font-size:20px}
.tile .tags{display:flex;flex-wrap:wrap;gap:4px;padding:6px;min-height:34px}
.tile .tags span{font-size:12px;padding:2px 6px;background:#e4e1da}
.tile .tags span.rank-A{background:#cfe8d3}
.tile .tags span.rank-C{background:#f3d6d6}
.tile .tags span.site{background:#f5e6b8}
.tile.starred .star{color:#e8c765}
.tile[hidden]{display:none}
.msg{color:#a33}
.dd{position:relative}
.dd summary{list-style:none;cursor:pointer;padding:6px 10px;border:1px solid #999;background:#fff}
.dd summary::after{content:" ▾"}
.dd .panel{position:absolute;top:100%;left:0;z-index:3;min-width:280px;background:#fff;border:1px solid #999;padding:8px;display:grid;gap:4px}
.dd .panel label{display:flex;gap:8px;align-items:center;padding:2px 4px;cursor:pointer}
.dd .panel label:hover{background:#f2f0ec}
.dd .panel .row{border-bottom:1px solid #ddd;padding-bottom:6px;margin-bottom:2px}
.act.danger{border-color:#a33;color:#a33}
.act.danger:hover{background:#fbe9e9}
.lb{position:fixed;inset:0;z-index:10;background:rgba(20,18,16,.94);color:#eee;display:grid;grid-template-rows:1fr auto}
.lb[hidden]{display:none}
.lb .stage{position:relative;display:flex;align-items:center;justify-content:center;min-height:0;padding:16px 64px}
.lb .stage img{max-width:100%;max-height:100%;object-fit:contain}
.lb .nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:72px;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:32px;cursor:pointer}
.lb .nav:hover{background:rgba(255,255,255,.25)}
.lb .prev{left:8px}
.lb .next{right:8px}
.lb .foot{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;padding:10px 16px;background:#111}
.lb .cap{flex:1;min-width:200px;font-size:14px}
.lb .cap small{display:block;color:#aaa}
</style>
<div class="bar">
  <div class="row" id="cats"></div>
  <div class="row">
    <form id="add" class="row"><input id="newName" placeholder="Nowa kategoria" aria-label="Nowa kategoria"><button class="act">Dodaj</button></form>
    <details class="dd" id="filterBox"><summary id="filterSummary">Pokaż</summary><div class="panel" id="filter"></div></details>
    <details class="dd" id="rankBox"><summary id="rankSummary">Ranga</summary><div class="panel" id="rankFilter"></div></details>
    <label><input type="checkbox" id="hideOnSite"> ukryj „już na stronie”</label>
    <button class="act primary" id="save" disabled>Zapisz</button>
    <button class="act" id="remove" disabled>Usuń z wybranych</button>
    <label><input type="checkbox" id="onlyStarred"> tylko z gwiazdką (<span id="starCount">0</span>)</label>
    <button class="act" id="clearStars">Wyczyść gwiazdki</button>
    <button class="act" id="clear">Odznacz zdjęcia</button>
    <button class="act danger" id="deleteSel" disabled>Usuń zaznaczone z dysku</button>
    <span class="info" id="info"></span>
    <span class="msg" id="msg"></span>
  </div>
</div>
<div class="grid" id="grid"></div>
<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Podgląd zdjęcia">
  <div class="stage">
    <img id="lbImg" alt="">
    <button class="nav prev" id="lbPrev" type="button" aria-label="Poprzednie">‹</button>
    <button class="nav next" id="lbNext" type="button" aria-label="Następne">›</button>
  </div>
  <div class="foot">
    <div class="cap" id="lbCap"></div>
    <button class="act" id="lbStar" type="button"></button>
    <button class="act" id="lbSel" type="button"></button>
    <button class="act danger" id="lbDel" type="button">Usuń z dysku</button>
    <button class="act" id="lbClose" type="button">Zamknij (Esc)</button>
  </div>
</div>
<script>
let photos = [];
let tags = { categories: [], photos: {} };
const selCats = new Set();
const selPhotos = new Set();
// Filter keys (category names, "__none" = untagged) the owner unchecked; empty set = show everything.
const hiddenKeys = new Set();
let lastIndex = null;
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, children = []) => {
  const node = Object.assign(document.createElement(tag), props);
  children.forEach((c) => node.append(c));
  return node;
};

const post = async (url, body) => {
  $("msg").textContent = "";
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) { $("msg").textContent = data.error || "Błąd zapisu."; return false; }
  tags = data.tags;
  return true;
};

const tagsOf = (i) => tags.photos[photos[i].file] || [];
// A photo is visible when it has at least one checked category (or is untagged and "bez tagu" is checked).
const isStarred = (i) => (tags.starred || []).includes(photos[i].file);
const RANKS = ["A", "B", "C"];
// Ranks the owner unchecked in the "Ranga" dropdown; empty set = show every rank.
const hiddenRanks = new Set();
const rankPasses = (i) => {
  const cls = photos[i].cls;
  // Unclassified photos are never cut by rank.
  return !cls || !hiddenRanks.has(cls.rank);
};
// Every filter except rank; the rank dropdown counts photos that pass this, so its numbers match what is on screen.
const passesOtherFilters = (i) => {
  if (photos[i].deleted) return false;
  if ($("hideOnSite").checked && photos[i].cls?.onSite) return false;
  if ($("onlyStarred").checked && !isStarred(i)) return false;
  const t = tagsOf(i);
  return t.length ? t.some((c) => !hiddenKeys.has(c)) : !hiddenKeys.has("__none");
};
const isVisible = (i) => passesOtherFilters(i) && rankPasses(i);
const clsLabels = (i) => {
  const cls = photos[i].cls;
  if (!cls) return [];
  return [
    el("span", { className: "rank-" + cls.rank, textContent: cls.rank + " · " + cls.width + "×" + cls.height }),
    el("span", { textContent: cls.orientation }),
    ...(cls.onSite ? [el("span", { className: "site", textContent: "już na stronie", title: cls.onSite.file + " (dist " + cls.onSite.distance + ")" })] : []),
  ];
};

const setFilter = (change) => {
  change();
  selPhotos.clear();
  lastIndex = null;
  render();
};
const visibleIndexes = () => photos.map((_, i) => i).filter(isVisible);

const renderCats = () => {
  selCats.forEach((c) => { if (!tags.categories.includes(c)) selCats.delete(c); });
  const counts = tags.categories.map((c) => Object.values(tags.photos).filter((t) => t.includes(c)).length);
  $("cats").replaceChildren(...tags.categories.map((c, k) => {
    const pick = el("button", { className: "pick", type: "button", onclick: () => { selCats.has(c) ? selCats.delete(c) : selCats.add(c); render(); } }, [c, el("span", { className: "n", textContent: counts[k] })]);
    pick.setAttribute("aria-pressed", String(selCats.has(c)));
    const del = el("button", { className: "del", type: "button", textContent: "×", title: "Usuń kategorię", onclick: () => deleteCat(c, counts[k]) });
    del.setAttribute("aria-label", "Usuń kategorię " + c);
    return el("span", { className: "cat" }, [pick, del]);
  }));
  hiddenKeys.forEach((key) => { if (key !== "__none" && !tags.categories.includes(key)) hiddenKeys.delete(key); });
  const untagged = photos.filter((p) => !p.deleted && !(tags.photos[p.file] || []).length).length;
  const focusedKey = document.activeElement?.dataset?.key;
  const option = (key, text) => {
    const box = el("input", { type: "checkbox", checked: !hiddenKeys.has(key), onchange: () => setFilter(() => (box.checked ? hiddenKeys.delete(key) : hiddenKeys.add(key))) });
    box.dataset.key = key;
    return el("label", {}, [box, text]);
  };
  const keys = ["__none", ...tags.categories];
  $("filter").replaceChildren(
    el("div", { className: "row" }, [
      el("button", { className: "act", type: "button", textContent: "Wszystkie", onclick: () => setFilter(() => hiddenKeys.clear()) }),
      el("button", { className: "act", type: "button", textContent: "Żadne", onclick: () => setFilter(() => keys.forEach((k) => hiddenKeys.add(k))) }),
    ]),
    option("__none", "bez tagu (" + untagged + ")"),
    ...tags.categories.map((c, k) => option(c, c + " (" + counts[k] + ")")),
  );
  // Rebuilding the panel drops focus; put it back on the same checkbox for keyboard use.
  if (focusedKey) [...$("filter").querySelectorAll("input")].find((b) => b.dataset.key === focusedKey)?.focus();
  const shown = keys.filter((k) => !hiddenKeys.has(k)).length;
  $("filterSummary").textContent = "Pokaż: " + (shown === keys.length ? "wszystkie" : shown + " z " + keys.length);
};

const renderRanks = () => {
  const focusedRank = document.activeElement?.dataset?.rank;
  const option = (rank) => {
    const count = photos.filter((p, i) => p.cls?.rank === rank && passesOtherFilters(i)).length;
    const box = el("input", { type: "checkbox", checked: !hiddenRanks.has(rank), onchange: () => setFilter(() => (box.checked ? hiddenRanks.delete(rank) : hiddenRanks.add(rank))) });
    box.dataset.rank = rank;
    return el("label", {}, [box, "ranga " + rank + " (" + count + ")"]);
  };
  $("rankFilter").replaceChildren(
    el("div", { className: "row" }, [
      el("button", { className: "act", type: "button", textContent: "Wszystkie", onclick: () => setFilter(() => hiddenRanks.clear()) }),
      el("button", { className: "act", type: "button", textContent: "Żadne", onclick: () => setFilter(() => RANKS.forEach((r) => hiddenRanks.add(r))) }),
    ]),
    ...RANKS.map(option),
  );
  if (focusedRank) [...$("rankFilter").querySelectorAll("input")].find((b) => b.dataset.rank === focusedRank)?.focus();
  const shown = RANKS.filter((r) => !hiddenRanks.has(r));
  $("rankSummary").textContent = "Ranga: " + (shown.length === RANKS.length ? "wszystkie" : shown.join(", ") || "żadna");
};

const renderGrid = () => {
  [...$("grid").children].forEach((tile) => {
    const i = Number(tile.dataset.i);
    tile.hidden = !isVisible(i);
    tile.classList.toggle("sel", selPhotos.has(i));
    tile.querySelector(".pick").setAttribute("aria-pressed", String(selPhotos.has(i)));
    tile.classList.toggle("starred", isStarred(i));
    tile.querySelector(".star").textContent = isStarred(i) ? "★" : "☆";
    tile.querySelector(".tags").replaceChildren(...tagsOf(i).map((t) => el("span", { textContent: t })), ...clsLabels(i));
  });
};

const render = () => {
  renderCats();
  renderRanks();
  renderGrid();
  const ready = selCats.size > 0 && selPhotos.size > 0;
  $("save").disabled = !ready;
  $("remove").disabled = !ready;
  $("deleteSel").disabled = selPhotos.size === 0;
  $("starCount").textContent = (tags.starred || []).length;
  $("info").textContent = "Zaznaczone: " + selPhotos.size + " zdj. · " + selCats.size + " kat. · widoczne: " + visibleIndexes().length;
  if (lbIndex !== null) renderLightbox();
};

// Lightbox: index into photos[] of the open photo, or null when closed. Arrows step through visible photos only.
let lbIndex = null;
let lbOpener = null;
const renderLightbox = () => {
  const p = photos[lbIndex];
  $("lbImg").src = "/photo/" + lbIndex;
  $("lbImg").alt = p.title || p.file;
  const meta = [p.parent, tagsOf(lbIndex).join(", ") || "bez tagu"].filter(Boolean).join(" · ");
  $("lbCap").replaceChildren(p.title || p.file, el("small", { textContent: p.file + " · " + meta }));
  $("lbSel").textContent = selPhotos.has(lbIndex) ? "Odznacz" : "Zaznacz";
  $("lbStar").textContent = isStarred(lbIndex) ? "★ W typach" : "☆ Do typów";
  const c = p.cls;
  if (c) $("lbCap").lastChild.textContent += " · " + c.rank + " " + c.width + "×" + c.height + " " + c.orientation + (c.onSite ? " · już na stronie: " + c.onSite.file : "");
  const vis = visibleIndexes();
  const pos = vis.indexOf(lbIndex);
  $("lbPrev").disabled = pos <= 0;
  $("lbNext").disabled = pos < 0 || pos >= vis.length - 1;
};
const openLightbox = (i) => {
  lbOpener = document.activeElement;
  lbIndex = i;
  $("lb").hidden = false;
  renderLightbox();
  $("lbClose").focus();
};
const closeLightbox = () => {
  lbIndex = null;
  $("lb").hidden = true;
  $("lbImg").removeAttribute("src");
  if (lbOpener && lbOpener.isConnected) lbOpener.focus();
};
const stepLightbox = (dir) => {
  const vis = visibleIndexes();
  const next = vis[vis.indexOf(lbIndex) + dir];
  if (next !== undefined) { lbIndex = next; renderLightbox(); }
};

const deletePhotos = async (indexes) => {
  const files = indexes.map((i) => photos[i].file);
  const what = files.length === 1 ? "zdjęcie „" + files[0] + "”" : files.length + " zdjęć";
  if (!confirm("Usunąć z dysku " + what + "? Tego nie da się cofnąć.")) return false;
  if (!(await post("/api/photos/delete", { files }))) return false;
  indexes.forEach((i) => {
    photos[i].deleted = true;
    selPhotos.delete(i);
    $("grid").querySelector('[data-i="' + i + '"]')?.remove();
  });
  if (indexes.includes(lastIndex)) lastIndex = null;
  return true;
};
const deleteFromLightbox = async () => {
  const i = lbIndex;
  // Pick the neighbour before deleting, while i is still in the visible list.
  const vis = visibleIndexes();
  const pos = vis.indexOf(i);
  const next = vis[pos + 1] ?? vis[pos - 1];
  if (!(await deletePhotos([i]))) return;
  // The owner may have closed or moved on while the request was in flight.
  if (lbIndex !== i) render();
  else if (next === undefined) closeLightbox();
  else lbIndex = next;
  render();
};

const clickTile = (i, shift) => {
  if (shift && lastIndex !== null) {
    const vis = visibleIndexes();
    const [a, b] = [vis.indexOf(lastIndex), vis.indexOf(i)].sort((x, y) => x - y);
    if (a >= 0) vis.slice(a, b + 1).forEach((j) => selPhotos.add(j));
  } else {
    selPhotos.has(i) ? selPhotos.delete(i) : selPhotos.add(i);
  }
  lastIndex = i;
  render();
};

const apply = async (mode) => {
  const ok = await post("/api/apply", { mode, files: [...selPhotos].map((i) => photos[i].file), categories: [...selCats] });
  if (ok) { selPhotos.clear(); lastIndex = null; }
  render();
};

const deleteCat = async (name, count) => {
  if (!confirm("Usunąć kategorię „" + name + "”?" + (count ? " Zdejmie ją z " + count + " zdjęć." : ""))) return;
  await post("/api/categories/delete", { name });
  render();
};

$("save").onclick = () => apply("add");
$("remove").onclick = () => apply("remove");
$("clear").onclick = () => { selPhotos.clear(); lastIndex = null; render(); };
// composedPath, not contains(): the panel is rebuilt during the click, so e.target may already be detached.
document.addEventListener("click", (e) => {
  [$("filterBox"), $("rankBox")].forEach((box) => { if (!e.composedPath().includes(box)) box.open = false; });
});
$("add").onsubmit = async (e) => {
  e.preventDefault();
  if (await post("/api/categories/add", { name: $("newName").value })) $("newName").value = "";
  render();
};
$("lbPrev").onclick = () => stepLightbox(-1);
$("lbNext").onclick = () => stepLightbox(1);
$("lbClose").onclick = closeLightbox;
$("lbDel").onclick = deleteFromLightbox;
const toggleStar = async (i) => { if (await post("/api/star", { files: [photos[i].file], on: !isStarred(i) })) render(); };
$("lbStar").onclick = () => toggleStar(lbIndex);
$("hideOnSite").onchange = () => setFilter(() => {});
$("onlyStarred").onchange = () => setFilter(() => {});
$("clearStars").onclick = async () => { if ((tags.starred || []).length && confirm("Wyczyścić wszystkie gwiazdki?") && (await post("/api/star", { clear: true }))) render(); };
$("lbSel").onclick = () => { selPhotos.has(lbIndex) ? selPhotos.delete(lbIndex) : selPhotos.add(lbIndex); render(); };
$("lb").onclick = (e) => { if (e.target === e.currentTarget || e.target.classList.contains("stage")) closeLightbox(); };
$("deleteSel").onclick = async () => { if (await deletePhotos([...selPhotos])) render(); };
document.addEventListener("keydown", (e) => {
  if (lbIndex !== null) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") stepLightbox(-1);
    else if (e.key === "ArrowRight") stepLightbox(1);
    return;
  }
  if (e.key !== "Escape") return;
  const open = [$("filterBox"), $("rankBox")].filter((box) => box.open);
  if (open.length) open.forEach((box) => (box.open = false));
  else $("clear").click();
});

fetch("/api/state").then((r) => r.json()).then((data) => {
  photos = data.photos;
  tags = data.tags;
  $("grid").replaceChildren(...photos.map((p, i) => {
    const pick = el("button", { className: "pick", type: "button", title: [p.file, p.title, p.parent].filter(Boolean).join(" · "), onclick: (e) => clickTile(i, e.shiftKey) },
      [el("img", { src: "/thumb/" + i + "?f=" + encodeURIComponent(p.file), loading: "lazy", alt: p.title || p.file }), el("span", { className: "tags" })]);
    const view = el("button", { className: "view", type: "button", textContent: "⤢", title: "Podgląd", onclick: () => openLightbox(i) });
    view.setAttribute("aria-label", "Podgląd: " + (p.title || p.file));
    const star = el("button", { className: "view star", type: "button", title: "Typ na slot (final selection)", onclick: () => toggleStar(i) });
    star.style.left = "44px";
    star.setAttribute("aria-label", "Typ na slot: " + (p.title || p.file));
    const tile = el("div", { className: "tile" }, [view, star, pick]);
    tile.dataset.i = i;
    return tile;
  }).filter((_, i) => !photos[i].deleted));
  render();
});
</script>
</html>`;

mkdirSync(THUMB_DIR, { recursive: true });
server.listen(PORT, "127.0.0.1", () => {
  console.log(`${photos.length} photos, ${tags.categories.length} categories, tags in ${TAGS_FILE}`);
  console.log(`Open http://localhost:${PORT}`);
});
