# Plan migracji mediów — etap 9 (kawałek 3 v2)

**Nadrzędny plan:** `docs/plans/09-migration-v2.md`  
**Raport:** `scripts/migrate-report.md` (§ Media aktualności, P2–P8)  
**Gałąź:** `feat/09-migration`  
**Stan:** 2026-09-29 — **M6 zamknięte**; produkcyjne media pod `/media/{domena}/` (bez `import/` i `sample/`); fetch WP static → `archive/wp-fetch-static/` (poza `public/`).

**Cel etapu 9 (media):** ✅ osiągnięty 2026-09-29 — w `content/` i `src/` brak `/media/sample/…` i `/media/import/…`; `public/media/sample/` i `public/media/import/` usunięte; `grep -r sample content/ public/media/` oraz `rg '/media/(sample|import)' content/ src/` — puste.

**Konwencja po M6 (ujednolicenie — na koniec migracji mediów):** wszystkie pliki produkcyjne pod **`/media/{domena}/…`**. Bez segmentu `import/` i bez `sample/`. Zamknięta lista `domena` jak poniżej (ściąga § Konwencja mediów). Cross-domeny dozwolone (np. wystawa → plik z `news/{slug}/`).

**Konwencja tranzycyjna:** zakończona w **M6** (2026-09-29). Artefakt fetchu stron statycznych WP: `archive/wp-fetch-static/` — nie serwowane; patrz § Fetch static.

| Fala | Nowe pliki / rewrite |
| --- | --- |
| M1–M4 | Od razu **`/media/{domena}/…`** (np. `offers/`, `publications/`, `home/`) — mniej pracy w M6 |
| M0, M2, P2, P5 | Najpierw `import/…`, potem **M6** → płaskie domeny |
| M5 | Usunięcie `sample/` ✅ |
| **M6** | ✅ 2026-09-29 — `import/{news,icons,exhibition}` → domeny; `static` → `archive/wp-fetch-static/`; rewrite ścieżek |

Źródło plików: WP REST / `href` z HTML (**K-121**), nie miniatury `src`. Gate per pozycja tam, gdzie wybór zdjęcia nie jest oczywisty (**K-122**).

---

## Konwencja mediów — ściąga

| Domena docelowa (`/media/…`) | Treść / referencje | Na dysku (`public/media/`) | Status migracji |
| --- | --- | --- | --- |
| `news/{slug}/` | `content/news/*.mdx`, `manifest.json` | `news/` | ✅ M0 + M6 |
| `icons/` | `content/icons.json`, hero `/ikony` | `icons/` | ✅ P5 + M6 |
| `exhibition/` | `content/exhibition/` | `exhibition/` (+ reuse `news/…`) | ✅ M2 + M6 |
| `lecturers/` | `content/lecturers.json` | `lecturers/` | ✅ P2 (już zgodne z M6) |
| `workshop/` *lub* `pages/` | `content/pages/*.json` | `workshop/`; fetch WP → `archive/wp-fetch-static/` (**nie UI**) | ⬜ treść etapu 6; rename `pages/` opcjonalnie + gate EJK |
| `offers/{slug}/` | `content/offers/*.mdx` | `offers/` (3 slugi, 4 pl.) | ✅ M1 2026-09-29 |
| `publications/{slug}/` | `content/publications/*.mdx` | `publications/ikona-dzis/` (10 pl.) | ✅ M3 2026-09-29 |
| `home/` | `src/i18n/pl.ts` (filary, kafle) | `home/` (3 pl.) | ✅ M4 2026-09-29 |
| — | — | ~~`sample/`~~ | ✅ skasowany M5 |
| — | — | `archive/wp-fetch-static/{o-akademii,pracownia}/` | artefakt fetchu; podpięcie po gate EJK |

**Do zapamiętania:** szukaj **domeny treści** (news, icons, workshop…), nie „import vs workshop”.

---

## Podsumowanie

| # | Domena | Ścieżki w treści | Pliki na dysku | Status |
| --- | --- | --- | --- | --- |
| 1 | Aktualności | `content/news/*.mdx`, `manifest.json` | `news/` (~50 slugów, 67 wpisów MDX) | ✅ M0 + M6 |
| 2 | Galeria `/ikony` | `content/icons.json` | `icons/` (53 pl.) | ✅ P5 + M6 |
| 3 | Wykładowcy | `lecturers.json`, katalog | `lecturers/` (17 pl.) | ✅ P2 |
| 4 | Wystawy codzienne + doroczne | `content/exhibition/page.mdx`, `annual.json`, `ExhibitionTravelingSection` | `exhibition/` (2 pl. S4) + cross-ref `news/`; doroczne kafle bez `photos` → `[przykład]` | ✅ M2 + M6 |
| 5 | Strony O Akademii / Pracownia | `content/pages/*.json` → `/media/workshop/` | `archive/wp-fetch-static/` (20 pl., **niepodpięte**) | ⬜ Artefakt fetchu; podpięcie po gate EJK |
| 6 | Oferty warsztatów + zamówienie | 3× `content/offers/*.mdx` | `offers/` (4 pl.) | ✅ **M1** 2026-09-29 |
| 7 | *(wchodzi w #6)* | hero `zamowienie.mdx` | ten sam plik co M1 | ✅ ścieżka; **treść zdjęcia** → etap 10 / EJK (§ P3) |
| 8 | Publikacje (album) | `content/publications/ikona-dzis.mdx` | `publications/ikona-dzis/` (10 pl.) | ✅ **M3** 2026-09-29 |
| 9 | Strona główna (filar) | `src/i18n/pl.ts` | `home/` (3 pl.) | ✅ **M4** 2026-09-29 |
| 10 | Porządki `sample/` + `import/` | — | brak `sample/` i `import/` w `public/media/` | ✅ **M5** + **M6** 2026-09-29 |

---

## ✅ Zmigrowane

### M0 — Aktualności (2026-09-28)

| Element | Szczegóły |
| --- | --- |
| Weryfikacja | Gate pozycja po pozycji — właściciel repo; stan: ten plik § M0 + `migrate-report.md` § Media aktualności |
| Treść | Brak `/media/sample/news/`; ścieżki `/media/news/{slug}/…` (po **M6**; wcześniej przez `import/news/`) |
| Pliki | `public/media/news/{slug}/`; nazwy: `1.jpg`…, `poster.jpg`, `cover.jpg` lub nazwy WP tam, gdzie gate tak ustalił |
| Skrypt | `npx tsx scripts/promote-news-media-from-sample.ts` + `generateNewsManifest()` |
| Build / lint | OK po zamknięciu |

**Otwarte (treść, nie ścieżki plików):** program + skan plakatu `spotkania-sladami-najpiekniejszych-ikon-swiata`; masowe `alt`; backlog plakatów WP (P0 #25) → etap 10.

### Galeria ikon (P5, 2026-09-27)

- 52 prace + `chrystus.jpg` (hero) w `public/media/icons/`.
- `content/icons.json` — `/media/icons/…`; `sample` zdjęty z JSON (P5 + M6).

### Wykładowcy (P2, 2026-09-27)

- `public/media/lecturers/*` — bez `/media/sample/`.

### M2 — Wystawy (2026-09-29)

| Element | Szczegóły |
| --- | --- |
| `page.mdx` | `interiorPhotos`: `/media/news/…-2018/2.jpg` + `/media/exhibition/20250613_194453-scaled.jpg`; brak `sample` |
| `annual.json` | Usunięte wszystkie `photos[]` — sekcja doroczna: 4 sloty `[przykład]`; zdjęcia sezonów **ręcznie** później |
| `ExhibitionTravelingSection` | Kadr z `interiorPhotos[0]` (prop z `ExhibitionPage`) |
| `exhibition/` | `20250613_194453-scaled.jpg` (podpięte); `502585831_…_n.jpg` z posta S4 — **na dysku, bez referencji w treści** |
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
| Dysk | Usunięty `public/media/sample/` (kopie produkcyjne w `news/`, `offers/`, `publications/`, `home`, `icons/`) |
| DoD | `rg sample content/ public/media/` — pusty |
| Skrypty | `promote-*-from-sample.ts` i `generate-news-sample.ts` — historyczne; ponowny zapis wymagałby odtworzenia `sample/` z gita |

### Fetch static (stary kawałek 1 — artefakt)

- `archive/wp-fetch-static/o-akademii/` (4 pl.), `pracownia/` (16 pl.) — **nie** podpięte do `content/pages/` (zamrożenie: treść etapu 6 + `/media/workshop/`).

### M6 — Ujednolicenie ścieżek (2026-09-29)

| Element | Szczegóły |
| --- | --- |
| Dysk | `git mv`: `import/news` → `news`, `import/icons` → `icons`, `import/exhibition` → `exhibition`; `import/static` → `archive/wp-fetch-static/`; brak `public/media/import/` |
| Treść | Rewrite `/media/import/{news,icons,exhibition}/` → `/media/{domena}/` w `content/`, `src/i18n/pl.ts` |
| Skrypty | `promote-news-media-from-sample.ts`, `wp-gallery-manifest.json`, `fetch-wp-gallery-sample.mjs`, `migrate-wp/domains/static.ts` |
| Weryfikacja | `rg '/media/(sample|import)' content/ src/` — pusty; build/lint OK |
| Poza zakresem | `workshop/` → `pages/`; 301 ze starych URL obrazów — ✅ redirecty M6 w DoD #3 |

---

## Fale mediów (zamknięte)

Wszystkie fale **M0–M6** zamknięte 2026-09-29. Poniżej skrót historyczny.

### M1 — Oferty warsztatów + hero zamówienia ✅ 2026-09-29

Zamknięte — patrz § M1 powyżej. Źródło plików na razie promocja z `sample/photos/`; docelowe kadry z WP — gate opcjonalnie etap 10.

### M3 — Publikacje (album *Ikona dziś*) ✅ 2026-09-29

Zamknięte — patrz § M3 powyżej. Tylko album `ikona-dzis`; pozostałe tytuły w hubie bez galerii w MDX.

### M4 — Strona główna (`pl.ts`) ✅ 2026-09-29

Zamknięte — patrz § M4 powyżej.

### M5 — Porządki `public/media/sample/` ✅ 2026-09-29

Zamknięte — patrz § M5 powyżej.

### M6 — Ujednolicenie ścieżek `/media/{domena}/` ✅ 2026-09-29

Zamknięte — patrz § M6 powyżej. **301** ze `/media/import/…` — ✅ DoD etapu 9 #3 (2026-09-30), `docs/redirects.json` (wildcards `:path*`).

---

## Mapowanie: gdzie szukać referencji

Pełna tabela domen: § **Konwencja mediów — ściąga**. Skrót:

```text
content/news/          → ✅ news/
content/icons.json     → ✅ icons/
content/exhibition/    → ✅ exhibition/ + cross-ref news/
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
| Kontrola mediów (DoD) | `rg '/media/(sample|import)' content/ src/`; `rg sample content/ public/media/` |

Skrypty `promote-*-from-sample.ts` — historyczne (wymagałyby odtworzenia `sample/` z gita). Fetch galerii: `fetch-wp-gallery-sample.mjs` → `public/media/icons/`. Fetch static WP: `migrate-wp/domains/static.ts` → `archive/wp-fetch-static/`.

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
| M6 Ujednolicenie `/media/{domena}/` | ✅ | 2026-09-29 |

**Etap 9:** zamknięty 2026-10-01 (DoD 8/8 w `09-migration-v2.md`). Media produkcyjne — ścieżki zamknięte (M0–M6). Otwarte kadry/`alt` → etap 10 (`docs/plan-claude-code.md` §5).

---

## Powiązania

- `docs/plan-claude-code.md` §5 — wiersze otwarte (hero zamówienie — kadrowanie, publikacje — `alt`, filary home — kadry EJK).
- `docs/plans/09-migration-wp-pages.md` — P5/P6/P8 odwołania do planu mediów.
- Gate S4 — 2 zdjęcia z posta `ikona-korzenie-i-owoce-wiary-2` → wystawy, nie news.
