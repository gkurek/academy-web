# Plan migracji mediów — etap 9 (kawałek 3 v2)

**Nadrzędny plan:** `docs/plans/09-migration-v2.md`  
**Raport:** `scripts/migrate-report.md` (§ Media aktualności, P2–P8)  
**Gałąź:** `feat/09-migration`  
**Stan:** 2026-09-29 — **M5 zamknięte** (`public/media/sample/` usunięty); **DoD sample ✅**; następna fala: **M6** (ujednolicenie `import/` → domeny).

**Cel etapu 9 (media):** w `content/` i `src/` brak ścieżek `/media/sample/…`; katalog `public/media/sample/` usunięty lub pusty; `grep -r sample content/ public/media/` bez wyników (DoD całego etapu 9).

**Konwencja po M6 (ujednolicenie — na koniec migracji mediów):** wszystkie pliki produkcyjne pod **`/media/{domena}/…`**. Bez segmentu `import/` i bez `sample/`. Zamknięta lista `domena` jak poniżej (ściąga § Konwencja mediów). Cross-domeny dozwolone (np. wystawa → plik z `news/{slug}/`).

**Konwencja tranzycyjna (do M6):** `import/{domena}/` (news, ikony, wystawy), `lecturers/`, `workshop/`, plus domeny już płaskie: `offers/`, `publications/`, `home/`. **`import/static/`** — artefakt fetchu; patrz § Fetch static. Katalog **`sample/` — usunięty (M5).**

| Fala | Nowe pliki / rewrite |
| --- | --- |
| M1–M4 | Od razu **`/media/{domena}/…`** (np. `offers/`, `publications/`, `home/`) — mniej pracy w M6 |
| M0, M2, P2, P5 (zamknięte) | Zostają w `import/…` / `workshop/` / `lecturers/` do **M6** |
| M5 | Usunięcie `sample/`; bez rename `import/` |
| **M6** | Przeniesienie `public/media/import/*` → `public/media/{domena}/`; masowy rewrite `content/` + `src/` + skrypty; decyzja o `import/static/` i ewent. `workshop/` → `pages/` **po gate EJK** |

Źródło plików: WP REST / `href` z HTML (**K-121**), nie miniatury `src`. Gate per pozycja tam, gdzie wybór zdjęcia nie jest oczywisty (**K-122**).

---

## Konwencja mediów — ściąga

| Domena docelowa (`/media/…`) | Treść / referencje | Na dysku **dziś** (M0–M5) | Status migracji |
| --- | --- | --- | --- |
| `news/{slug}/` | `content/news/*.mdx`, `manifest.json` | `import/news/` | ✅ M0 |
| `icons/` | `content/icons.json`, hero `/ikony` | `import/icons/` | ✅ P5 |
| `exhibition/` | `content/exhibition/` | `import/exhibition/` (+ reuse `import/news/…`) | ✅ M2 |
| `lecturers/` | `content/lecturers.json` | `lecturers/` | ✅ P2 (już zgodne z M6) |
| `workshop/` *lub* `pages/` | `content/pages/*.json` | `workshop/`; fetch WP → `import/static/` (**nie UI**) | ⬜ treść etapu 6; rename `pages/` opcjonalnie w M6 + gate |
| `offers/{slug}/` | `content/offers/*.mdx` | `offers/` (3 slugi, 4 pl.) | ✅ M1 2026-09-29 |
| `publications/{slug}/` | `content/publications/*.mdx` | `publications/ikona-dzis/` (10 pl.) | ✅ M3 2026-09-29 |
| `home/` | `src/i18n/pl.ts` (filary, kafle) | `home/` (3 pl.) | ✅ M4 2026-09-29 |
| — | — | ~~`sample/`~~ | ✅ skasowany M5 |
| — | — | `import/static/{o-akademii,pracownia}/` | artefakt; M6: archiwum poza `public/` lub podpięcie po gate |

**Do zapamiętania:** szukaj **domeny treści** (news, icons, workshop…), nie „import vs workshop”.

---

## Podsumowanie

| # | Domena | Ścieżki w treści | Pliki na dysku | Status |
| --- | --- | --- | --- | --- |
| 1 | Aktualności | `content/news/*.mdx`, `manifest.json` | `import/news/` (~50 slugów, 67 wpisów MDX) | ✅ **Zamknięte** 2026-09-28 |
| 2 | Galeria `/ikony` | `content/icons.json` | `import/icons/` (53 pl.) | ✅ 2026-09-27 (P5) |
| 3 | Wykładowcy | `lecturers.json`, katalog | `lecturers/` (17 pl.) | ✅ 2026-09-27 (P2) |
| 4 | Wystawy codzienne + doroczne | `content/exhibition/page.mdx`, `annual.json`, `ExhibitionTravelingSection` | `import/exhibition/` (2 pl. S4); doroczne kafle bez `photos` → `[przykład]` | ✅ **Zamknięte** 2026-09-29 (M2) |
| 5 | Strony O Akademii / Pracownia | `content/pages/*.json` → `/media/workshop/` | `import/static/` (20 pl., **niepodpięte**) | ⬜ Artefakt fetchu; **bez podpinania** bez gate (zamrożenie k1) |
| 6 | Oferty warsztatów + zamówienie | 3× `content/offers/*.mdx` | `offers/` (4 pl.) | ✅ **M1** 2026-09-29 |
| 7 | *(wchodzi w #6)* | hero `zamowienie.mdx` | ten sam plik co M1 | ✅ ścieżka; **treść zdjęcia** → etap 10 / EJK (§ P3) |
| 8 | Publikacje (album) | `content/publications/ikona-dzis.mdx` | `publications/ikona-dzis/` (10 pl.) | ✅ **M3** 2026-09-29 |
| 9 | Strona główna (filar) | `src/i18n/pl.ts` | `home/` (3 pl.) | ✅ **M4** 2026-09-29 |
| 10 | Porządki `sample/` | — | katalog usunięty | ✅ **M5** 2026-09-29; **M6** → rename `import/` |

---

## ✅ Zmigrowane

### M0 — Aktualności (2026-09-28)

| Element | Szczegóły |
| --- | --- |
| Weryfikacja | Gate pozycja po pozycji — właściciel repo; stan: ten plik § M0 + `migrate-report.md` § Media aktualności |
| Treść | Brak `/media/sample/news/` w `content/news/` i `manifest.json` — wyłącznie `/media/import/news/{slug}/…` |
| Pliki | Kopia do `public/media/import/news/`; nazwy: `1.jpg`…, `poster.jpg`, `cover.jpg` lub nazwy WP tam, gdzie gate tak ustalił |
| Skrypt | `npx tsx scripts/promote-news-media-from-sample.ts` + `generateNewsManifest()` |
| Build / lint | OK po zamknięciu |

**Otwarte (treść, nie ścieżki plików):** program + skan plakatu `spotkania-sladami-najpiekniejszych-ikon-swiata`; masowe `alt`; backlog plakatów WP (P0 #25) → etap 10.

### Galeria ikon (P5, 2026-09-27)

- 52 prace + `chrystus.jpg` (hero) w `public/media/import/icons/`.
- `content/icons.json` — same `/media/import/icons/…`; `sample` zdjęty z JSON.

### Wykładowcy (P2, 2026-09-27)

- `public/media/lecturers/*` — bez `/media/sample/`.

### M2 — Wystawy (2026-09-29)

| Element | Szczegóły |
| --- | --- |
| `page.mdx` | `interiorPhotos`: `import/news/…-2018/2.jpg` + `import/exhibition/20250613_194453-scaled.jpg`; brak `sample` |
| `annual.json` | Usunięte wszystkie `photos[]` — sekcja doroczna: 4 sloty `[przykład]`; zdjęcia sezonów **ręcznie** później |
| `ExhibitionTravelingSection` | Kadr z `interiorPhotos[0]` (prop z `ExhibitionPage`) |
| `import/exhibition/` | `20250613_194453-scaled.jpg` (podpięte); `502585831_…_n.jpg` z posta S4 — **na dysku, bez referencji w treści** |
| Weryfikacja | Brak `/media/sample` w `content/exhibition/` i `src/components/exhibition/`; build/lint OK |

### M1 — Oferty (2026-09-29)

| Element | Szczegóły |
| --- | --- |
| Pliki | `public/media/offers/{kurs-roczny-i-trzyletni,letnia-szkola-swiatla,zamowienie}/` — promocja z `sample/photos/` (te same kadry co makieta) |
| Treść | Brak `/media/sample/photos/` w `content/offers/` — wyłącznie `/media/offers/{slug}/…` |
| Skrypt | `npx tsx scripts/promote-offers-media-from-sample.ts` |
| Build / lint | OK |

**Otwarte (nie M1):** wybór / podmiana kadru hero zamówienia z WP lub sesji — etap 10, `migrate-report.md` § P3 (EJK).

### M3 — Publikacje (2026-09-29)

| Element | Szczegóły |
| --- | --- |
| Plik | `content/publications/ikona-dzis.mdx` — `cover` + 9× `spreads` |
| Pliki | `public/media/publications/ikona-dzis/` — promocja z `sample/publications/` (cover + spread-01…09) |
| Treść | Brak `/media/sample/publications/` w frontmatter |
| Skrypt | `npx tsx scripts/promote-publications-media-from-sample.ts` |
| Build / lint | OK |

**Otwarte (treść):** `alt` / caption rozkładek — placeholdery `[do uzupełnienia]` → etap 10. Inne publikacje bez albumu w MDX — bez zmian.

### M4 — Strona główna (2026-09-29)

| Element | Szczegóły |
| --- | --- |
| Pliki | `public/media/home/` — `pracownia.jpg`, `wyklad.jpg`, `wystawa.jpg` (promocja z dawnego `sample/photos/`) |
| Treść | `src/i18n/pl.ts` — `home.pillars` (3×) + `workshopsHub.cardImages` (2×) → `/media/home/…` |
| Skrypt | `npx tsx scripts/promote-home-media-from-sample.ts` |
| Build / lint | OK |

**Otwarte (P8 / etap 10):** docelowe kadry filarów z WP lub sesji (EJK) — podmiana plików w `home/`, nie blokowało M4.

### M5 — Usunięcie `sample/` (2026-09-29)

| Element | Szczegóły |
| --- | --- |
| Weryfikacja | `rg '/media/sample' content/ src/` — pusty przed kasacją |
| Dysk | Usunięty `public/media/sample/` (news, photos, publications — kopie produkcyjne w `import/news`, `offers`, `publications`, `home`) |
| DoD | `rg sample content/ public/media/` — pusty |
| Skrypty | `promote-*-from-sample.ts` i `generate-news-sample.ts` — historyczne; ponowny zapis wymagałby odtworzenia `sample/` z gita |

### Fetch static (stary kawałek 1 — artefakt)

- `public/media/import/static/o-akademii/` (4 pl.), `pracownia/` (16 pl.) — **nie** podpięte do `content/pages/` (zamrożenie: treść etapu 6 + `/media/workshop/`).

---

## ⬜ Do migracji (fale proponowane)

Kolejność: najpierw ścieżki widoczne na produkcie, potem sprzątanie `public/media/sample/`.

### M1 — Oferty warsztatów + hero zamówienia ✅ 2026-09-29

Zamknięte — patrz § M1 powyżej. Źródło plików na razie promocja z `sample/photos/`; docelowe kadry z WP — gate opcjonalnie etap 10.

### M3 — Publikacje (album *Ikona dziś*) ✅ 2026-09-29

Zamknięte — patrz § M3 powyżej. Tylko album `ikona-dzis`; pozostałe tytuły w hubie bez galerii w MDX.

### M4 — Strona główna (`pl.ts`) ✅ 2026-09-29

Zamknięte — patrz § M4 powyżej.

### M5 — Porządki `public/media/sample/` ✅ 2026-09-29

Zamknięte — patrz § M5 powyżej.

### M6 — Ujednolicenie ścieżek `/media/{domena}/` (po M5)

**Cel:** jedna reguła URL; w `public/media/` tylko foldery domen z § Konwencja mediów — ściąga.

1. Przenieść katalogi: `import/news` → `news`, `import/icons` → `icons`, `import/exhibition` → `exhibition` (git mv / skrypt).
2. Masowy rewrite ścieżek w `content/`, `src/`, `scripts/` (`/media/import/news/` → `/media/news/` itd.).
3. **`import/static/`:** skasować, przenieść do archiwum (np. poza `public/`) albo — **tylko po gate** — pliki do `workshop/` / `pages/` + aktualizacja `content/pages/*.json`.
4. Opcjonalnie: rename `workshop/` → `pages/` — **tylko z decyzją EJK** (medio stron O Akademii / Pracownia), nie mechanicznie.
5. Weryfikacja: `rg '/media/(sample|import)' content/ src/` — pusty; `npm run build`, `npm run lint`.
6. Jeśli produkcja już indeksuje stare URL obrazów: 301 w `docs/redirects.json` / `next.config.ts` (osobny krok — uzgodnić przy wdrożeniu).

**Kryterium gotowe:** wszystkie referencje zgodne ze ściągą; brak `public/media/import/` i `public/media/sample/`.

---

## Mapowanie: gdzie szukać referencji

Pełna tabela domen: § **Konwencja mediów — ściąga**. Skrót:

```text
content/news/          → ✅ import/news (→ news/ w M6)
content/icons.json     → ✅ import/icons (→ icons/ w M6)
content/exhibition/    → ✅ import (bez sample)
content/offers/        → ✅ offers/ (M1)
content/publications/  → ✅ publications/ikona-dzis (M3)
content/pages/         → workshop/ (świadomy wybór etapu 6)
src/i18n/pl.ts         → ✅ home/ (M4)
src/components/exhibition/  → ✅ bez sample
```

---

## Skrypty i komendy

| Cel | Komenda |
| --- | --- |
| Promocja home (M4) | `npx tsx scripts/promote-home-media-from-sample.ts` |
| Promocja publikacji (M3) | `npx tsx scripts/promote-publications-media-from-sample.ts` |
| Promocja ofert (M1) | `npx tsx scripts/promote-offers-media-from-sample.ts` |
| Promocja news (zrobione) | `npx tsx scripts/promote-news-media-from-sample.ts` |
| Manifest aktualności | wywołanie `generateNewsManifest()` z pipeline treści / skryptu news |
| Fetch WP (pomocniczy) | `npx tsx scripts/migrate-wp.ts --dry-run` (bez masowego static/offers — **K-123**) |
| Weryfikacja | `npm run build`, `npm run lint` |
| Kontrola sample (DoD) | `rg '/media/sample' content/ src/`; `rg sample content/ public/media/` |

Nowe skrypty (M1–M3): **propozycja** — helper kopiujący z WP uploads lub z `sample/` do `public/media/{domena}/` + rewrite ścieżek w JSON/MDX; **gate przed zapisem**; bez nowych zależności npm bez zgody. Skrypt rename `import/` → płaskie domeny — **M6**.

---

## Postęp

| Fala | Status | Data |
| --- | --- | --- |
| M0 Aktualności | ✅ | 2026-09-28 |
| Galeria + wykładowcy | ✅ | 2026-09-27 |
| M1 Oferty | ✅ | 2026-09-29 |
| M2 Wystawy | ✅ | 2026-09-29 |
| M3 Publikacje | ✅ | 2026-09-29 |
| M4 Home (`pl.ts`) | ✅ | 2026-09-29 |
| M5 Usunięcie `sample/` | ✅ | 2026-09-29 |
| M6 Ujednolicenie `/media/{domena}/` | ⬜ | po M5 |

**Następny krok (rekomendacja):** **M6** — przeniesienie `import/*` na płaskie domeny + rewrite (§ M6).

---

## Powiązania

- `docs/plan-claude-code.md` §5 — wiersze sample dot. mediów (hero zamówienie, publikacje, filary home).
- `docs/plans/09-migration-wp-pages.md` — P5/P6/P8 odwołania do planu mediów.
- Gate S4 — 2 zdjęcia z posta `ikona-korzenie-i-owoce-wiary-2` → wystawy, nie news.
