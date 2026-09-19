# Plan 05 — Galeria ikon

Status: zatwierdzony 2026-09-19
Gałąź: feat/05-galeria
Makiety: `design/Akademia Ikony - kierunki wizualne.dc.html` — `#2a-ikony` (galeria z filtrami); lightbox desktop + `390 px` (podtytuły „Ikony — lightbox”); handoff: `design/components/gallery/IconGrid.*`, `Lightbox.*`, `design/ui_kits/witryna/GalleryScreen.jsx`

## Cel i zakres

Strona `/ikony`: `SectionNav`, H1 + lead, filtry (autor + temat), licznik prac, interaktywny `IconGrid` z `Lightbox` (desktop i mobile), zajawka „Ikony na zamówienie” na dole. Rozbudowa `content/icons.json` do pełniejszego zestawu `sample`; warstwa `src/content/icons.ts` z filtrowaniem. Komponenty `FilterChip`, `Lightbox`; rozszerzenie `IconGrid` (klik → lightbox, wariant galerii). Poza zakresem: `/ikony/[slug]` (K-04), paginacja „Pokaż kolejne 24” (odłożona do pod-etapu 7/8), opis dzieła w lightboxie, migracja WP (~65 ikon), analityka (K-15), JSON-LD, `deesis.jpg` i `chrystus.jpg` w galerii (`chrystus` wyłącznie w Hero).

## Decyzje podjęte w sesji planistycznej

- **D-02 (skutek):** Domyślny filtr autora — **Wszyscy** (brak `?autor=`); założenie do zmiany po starcie strony autorskiej EJK.
- **K-04:** `/ikony/[slug]` **poza v1** — podgląd wyłącznie przez lightbox.
- **K-05:** Filtry przez **query string** (`?autor=…&temat=…`), bez przeładowania strony; wartości po polsku (`ejk`, `uczniowie`; slug tagu np. `matka-bozy`).
- **K-38:** `Lightbox` na **natywnym `<dialog>`** + `showModal()`; Esc przez `cancel`; fallback do własnego overlay tylko jeśli test Safari/iOS wykaże problem.
- **K-39:** Obrazy — **jeden `src`** per ikona; większe `sizes` w lightboxie (`(min-width: 768px) 460px, 100vw`); weryfikacja wydajności w **pod-etapie 7**, ewentualne `imageLarge` w `IconWork`.
- **Paginacja:** **Brak w v1** — cała przefiltrowana lista w DOM; świadome odstępstwo od makiety (`#2a-ikony`).
- **Lightbox — treść:** Tylko metadane z `IconWork` (tytuł, autor, wymiary, rok, technika) + link „Zapytaj o podobną ikonę” → `/ikony/na-zamowienie`; **bez akapitu opisu**.
- **Filtry tematu:** Chipy **dynamicznie** z unikalnych `tags` w `icons.json` (sort alfabetyczny); brak `?temat=` = wszystkie tematy; ikony bez `tags` widoczne tylko bez filtra tematu.
- **Zdjęcia sample:** Tylko **4 pliki** — `matka-boza-znaku`, `przemienienie`, `mandylion`, `sw-antoni`; **bez** `deesis` i **bez** `chrystus` (Hero).
- **Kadrowanie (K-31):** `object-contain` na `--surface-tile` — świadome odstępstwo od makiety (`object-fit: cover`).
- **Wysokość kafla galerii:** token `--gallery-grid-h: 300px` (makieta), osobno od home `--icon-grid-h: 290px`.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| ---- | ----------- | ---------------- |
| `content/icons.json` | zmiana | ~12–16 wpisów `sample`; rotacja 4 dozwolonych zdjęć; `tags`, autorzy, wymiary niezweryfikowane bez zmyślania |
| `public/media/sample/icons/*` | bez zmian | Tylko istniejące 4 pliki galerii (+ `chrystus` poza galerią, w `Hero`) |
| `public/media/sample/gallery-order-teaser.jpg` | nowy | Kopia `design/uploads/17499269_1795742993979565_3521800425715942409_n.jpg` — zajawka zamówienia |
| `src/content/icons.ts` | zmiana | `getIconWorks()`, `filterIconWorks()`, `getIconTags()`, `getIconCounts()`; mapowanie query → filtr |
| `src/components/core/FilterChip.tsx` | nowy | Chip filtra (stany z `design/components/core/FilterChip.jsx`) |
| `src/components/gallery/IconGrid.tsx` | zmiana | Wariant galerii: klikalne kafle, `onSelect`, podpisy desktop/mobile; home bez regresji (`mobileCount`, bez lightboxa) |
| `src/components/gallery/Lightbox.tsx` | nowy, Client | `<dialog>`, desktop + mobile, nawigacja SVG 48×48, klawiatura, focus trap |
| `src/components/gallery/GalleryFilters.tsx` | nowy, Client | Autor + temat; sync z `useSearchParams` / `router.replace` |
| `src/components/gallery/GalleryPage.tsx` | nowy | Shell: lead, filtry, licznik, siatka, lightbox, teaser zamówienia |
| `src/components/gallery/GalleryOrderTeaser.tsx` | nowy | Blok „Ikony na zamówienie” z makiety `#2a-ikony` (obraz + H2 + lead + link) |
| `src/app/ikony/page.tsx` | zmiana | `GalleryPage` zamiast `PagePlaceholder` |
| `src/i18n/pl.ts` | zmiana | Sekcja `gallery`: nagłówki, filtry, licznik, lightbox, podpisy (`formatCaption`), teaser |
| `src/app/globals.css` | zmiana | `--gallery-grid-h`, style lightbox (`dialog::backdrop`, `--shadow-lightbox`) |

## Kawałki

### Kawałek 1 — Dane sample + warstwa treści

Zakres: rozbudowa `content/icons.json` (~12–16 wpisów, tylko 4 zdjęcia); `src/content/icons.ts` (filtrowanie, tagi, liczniki); `FilterChip`; stringi i szablony podpisów w `pl.ts` (przeniesienie `formatCaption` z `IconGrid`); kopia zdjęcia zajawki do `public/media/sample/`.

Kryterium „gotowe”: `npm run build` + `lint` OK; warstwa treści i `FilterChip` renderowalne w izolacji (test przez tymczasowy import lub Kawałek 2); grep `deesis`/`chrystus` w ścieżkach galerii w `icons.json` — zero trafień.

### Kawałek 2 — Strona `/ikony` + filtry + `IconGrid`

Zakres: `GalleryPage`, `GalleryFilters`, `GalleryOrderTeaser`; rozszerzenie `IconGrid` (wariant galerii, `onSelect`); trasa `/ikony`; licznik prac; lead z linkiem do `/ikony/na-zamowienie`.

Kryterium „gotowe”: `/ikony` zgodne z `#2a-ikony` (desktop + 390px) co do układu filtrów, siatki, licznika i teasera; filtry w URL bez przeładowania; wstecz w przeglądarce cofa filtr; build/lint OK; nawigacja klawiaturą na chipach i kafelach (Enter otwiera… — lightbox w Kawałku 3, tu focus na kafel).

### Kawałek 3 — `Lightbox` desktop

Zakres: `Lightbox.tsx` (`<dialog>`); integracja z `GalleryPage` — stan indeksu, prev/next w **przefiltrowanej** liście; Esc, strzałki, zamknięcie; podpis + link do zamówienia; `sizes` większe w lightboxie (K-39).

Kryterium „gotowe”: lightbox desktop na `/ikony`; scroll zablokowany; build/lint OK.

### Kawałek 4 — `Lightbox` mobile + domknięcie

Zakres: wariant mobile 390px (nagłówek „Zamknij”, przyciski Poprzednia/Następna); `prefers-reduced-motion`; fokus wraca do klikniętego kafla po zamknięciu; przegląd home (`IconGrid` bez regresji); Lighthouse a11y na `/ikony` (mobile).

Kryterium „gotowe”: DoD pod-etapu spełnione; build/lint OK; meldunek z listą odstępstw od makiety.

## Dane sample dodawane w tym pod-etapie

- `content/icons.json` — pełniejszy zestaw galerii (~12–16 wpisów, 4 unikalne zdjęcia) → `docs/plan-claude-code.md` §5
- `public/media/sample/gallery-order-teaser.jpg` — zdjęcie zajawki zamówienia → §5
- Wymiary w podpisach — nadal niezweryfikowane (istniejący wpis §5)

**Wykluczenia (nie dodawać do galerii):** `chrystus.jpg` (Hero), `deesis.jpg`.

## Kryteria ukończenia pod-etapu

> **Korekta 2026-09-19 (05b):** statusy ✅ poniżej oparto na build/lint i Lighthouse, bez przeglądu wizualnego. Przegląd stagingu wykazał usterki w punktach oznaczonych ⚠ — naprawione w `docs/plans/05b-review-fixes.md`.

- [x] Filtry działają jako query string, bez przeładowania strony (K-05) — ⚠ `?autor=` wycofane w 05b (K-43), zostaje `?temat=`
- [x] Domyślny widok: wszyscy autorzy, wszystkie tematy (D-02) — ⚠ zastąpione dwiema sekcjami EJK → uczniowie (K-41)
- [x] `Lightbox`: Esc zamyka, strzałki klawiatury, fokus wraca do klikniętego kafla, `prefers-reduced-motion` respektowany — ⚠ scroll strony pod dialogiem nie był zablokowany, klik w tło nie zamykał (05b/1)
- [x] Wymiary z podpisów oznaczone jako niezweryfikowane w danych `sample` (brak zmyślonych cm) — ⚠ w UI wyświetlały się jak fakty; teraz „Wymiary: do weryfikacji” (05b/5)
- [x] Zajawka „Ikony na zamówienie” na dole galerii z linkiem do `/ikony/na-zamowienie` — ⚠ bez odstępów od siatki i stopki (05b/1); od 05b/5 bez zdjęcia, z przyciskiem
- [x] `IconGrid` na home bez regresji (podgląd „Wybrane ikony”, bez lightboxa)
- [x] Lighthouse dostępność na `/ikony` — cel jak w 04b (≥ 95, dążenie do 100) — ⚠ wynik nie obejmował przeglądu wizualnego; w 05b audyt ręczny (kontrast, nazwy, nagłówki, fokus), formalny Lighthouse do ponownego uruchomienia

## Odstępstwa od makiety (świadome)

| Makieta | Implementacja | Powód |
| ------- | ------------- | ----- |
| `object-fit: cover` na kafelach | `object-contain` (K-31) | Decyzja 04b |
| „Pokaż kolejne 24 prace” | Brak paginacji v1 | Zakres sample; ~52 prace po migracji → etap 7/8 |
| Akapit opisu w lightboxie | Brak | Brak pola w `IconWork` |
| Chip autora „Wydarzenia” (literówka HTML) | „Wszyscy” + EJK + Uczniowie | `GalleryScreen.jsx` / sesja planistyczna — **zastąpione w 05b:** filtr autora usunięty, sekcje EJK / uczniowie (K-41, K-43) |

Dalsze odstępstwa od makiety `#2a-ikony` wprowadzone w 05b — patrz sekcja „Odstępstwa od makiety” w `docs/plans/05b-review-fixes.md`.

## Ryzyka i pytania otwarte

- **Safari `<dialog>`:** przetestować `showModal()` i focus trap na iOS; fallback w Kawałku 3 jeśli potrzeba.
- **4 zdjęcia × 12–16 wpisów:** duplikaty wizualne w sample — akceptowalne do migracji; tytuły niepotwierdzone jako `[do uzupełnienia: …]`.
- **Tagi dynamiczne:** po migracji lista chipów może rosnąć — UI musi zawijać chipy (jak pasek filtrów w makiecie).
- **Wydajność obrazów (K-39):** audyt `sizes` i Lighthouse w pod-etapie 7; przejście na `imageLarge` jeśli mobile < 90.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| ------- | ------ | ------------------- |
| 1 — Dane + warstwa treści | ✅ | 14 wpisów sample; `getFeaturedIconWorks()` chroni home |
| 2 — `/ikony` + filtry + siatka | ✅ | `GalleryIconGrid` — stub `onSelect` pod Kawałek 3 |
| 3 — Lightbox desktop | ✅ | mobile: podgląd bez przycisków Poprzednia/Następna → Kawałek 4 |
| 4 — Lightbox mobile + domknięcie | ✅ | Lighthouse a11y mobile /ikony: 100 |

Kawałki 2–4 wymagały korekt po przeglądzie stagingu — zob. `docs/plans/05b-review-fixes.md` (Kawałki 1–6).
