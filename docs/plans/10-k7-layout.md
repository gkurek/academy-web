# Plan 10 / kawałek 7 — Pozostały layout fali 1 (`/ikony`, oferty, `/o-akademii`)

Status: **zatwierdzony** 2026-10-04 (sesja planistyczna 2026-10-04)  
Etap: `docs/plans/10-finishing.md` (kawałek 7, zadania I1, O1–O4, S1, S2, C1)  
Gałąź: `feat/10-finishing`  
Kontekst: `scripts/migrate-report.md` § „Do etapu 10 — uwagi z DoD #8” i § „uwagi z kawałka 1 v2”; `docs/plan-claude-code.md` §4 (K-35, K-36, K-37, K-46), §5.

## Cel

Domknięcie drobnych poprawek layoutu i a11y z przeglądu tras po migracji (DoD #8), których nie objęły kawałki 1–6. Bez nowej makiety.

## Diagnoza (stan na 2026-10-04)

| # | Problem / stan |
| --- | --- |
| I1 | `/ikony` — wszystkie 52 ikony mają `alt` („Ikona: …”), więc przycisk miniatury w `IconGrid.tsx` ma nazwę z obrazka; pusty `button` w DoD #8 to najpewniej artefakt snapshotu. Brak spójnego `aria-label` jak w `ContentGalleryGrid` („Powiększ…: {tytuł}”). |
| O2 | `OfferPage.tsx` renderuje `FactsBox` dwukrotnie (`lg:hidden` + `hidden lg:block`) — dwa `h2` w DOM na każdej ofercie (widoczne w snapshotach LSS). |
| O3 | `mdx-components.tsx` nie mapuje `a`; w `content/offers/*` maile i telefony są zwykłym tekstem. |
| O1 | Kurs — sekcja MDX „Dalsza droga”: pusta prawa kolumna, powtórzenia maila, sekcja „Staże”, „Konsultacje…” jako surowy `<h3>` (poza stylem MDX). `#konsultacje` jest celem 301 (`docs/redirects.json:135`). |
| S1 | `/o-akademii` — „Wybrane realizacje” (`PersonProfile`, `works` w `o-akademii.json`): 6× `[DO UZUPEŁNIENIA]`. |
| S2 | Zajawka „Ikony na zamówienie” działa bez zdjęcia (K-46); brakuje tylko zdjęcia z sesji. |
| C1 | Stopka (K-36) — ✅ poprawiona i zamknięta 2026-10-04. |

## Decyzje sesji planistycznej (2026-10-04)

| # | Decyzja |
| --- | --- |
| **LY1 — „Dalsza droga” (O1)** | Tekst skrócony i zatwierdzony w czacie (gate K-122 ✅, treść niżej): usunięte „Staże”, zdanie „Zgłoszenia do końca sierpnia na adres…”, „Kontakt: …”, zdanie o pracy we wspólnocie; „Konsultacje i zajęcia indywidualne” jako zwykły `h3` w stylu MDX **z zachowaną kotwicą `#konsultacje`** (cel 301). Prawa kolumna: zdjęcie `public/media/workshop/gallery-painting-christ.jpg` + mały blok CTA „Kursy doskonalące i konsultacje indywidualne” + przycisk „Zapytaj”. |
| **LY2 — Temat `mailto:` CTA** | `Zapytanie – kursy doskonalące i konsultacje` na `akademiaikony@gmail.com` — nowy fakt, dopisać do `docs/brief-claude-code.md` §7 (lista tematów `mailto:`). |
| **LY3 — Duplikat w `semesters`** | Powtórzony blok „Nauczanie indywidualne” w frontmatterze kursu — **zostaje bez zmian** (decyzja właściciela). |
| **LY4 — „Wybrane realizacje” (S1)** | **Usunięcie całej sekcji** — EJK jej nie chce. UI w `PersonProfile`, dane `works` / `worksTitle` w `o-akademii.json`, martwy CSS. Pola w `src/content/types.ts` zostają jako **opcjonalne** (`works?`, `worksTitle?` — model współdzielony). §5 planu żywego: pozycja zamknięta jako „wycofane — EJK nie chce sekcji”. |
| **LY5 — Linki w MDX (O3)** | Zakres zamiany tekstu na linki: **tylko `content/offers/*`**. Styl `a` w `mdx-components.tsx` jak `TextLink`. |
| **LY6 — Przeniesione** | **S2** → k8 (zdjęcie z sesji); **K-35** → k9 (po analityce); **K-37** → uwagi po prezentacji z klientem (odłożone). |

### Zatwierdzony tekst „Dalsza droga” (LY1)

```mdx
## Dalsza droga

Nauczanie doskonalące może trwać tak długo, jak ktoś go potrzebuje — w rytmie roku albo na warsztatach wakacyjnych. Przekazujemy całą wiedzę potrzebną do samodzielnego pisania ikon na wzór dawnych mistrzów: nie kształcimy odtwórców, lecz twórców dawnego kunsztu.

### Kursy doskonalące i mistrzowskie

Dla tych, którzy chcą rozwijać umiejętności zdobyte wcześniej. Temat i termin lekcji ustalamy wspólnie — na przykład suchy pędzel i pław, sankir czy różne sposoby wyświetlania.

### Konsultacje i zajęcia indywidualne

W ciągu roku, w uzgodnionym terminie — także przy ikonie zaczętej samodzielnie.

### Kursy tematyczne i warsztaty rodzinne

Gruntowanie, szkicowanie, złocenie, kaligrafia i zabezpieczanie ikon oraz rodzinne warsztaty otwarte. Terminy ogłaszamy na bieżąco uczestnikom Akademii.
```

## Plan implementacji

### 7a — a11y (I1, O2) — checkpoint 1/4

- `IconGrid.tsx` — `aria-label` przycisku miniatury wg wzorca `ContentGalleryGrid` (string w `pl.ts`).
- `OfferPage.tsx` — jedna instancja `FactsBox`; położenie mobile/desktop przez grid/CSS (bez duplikatu w DOM). Dotyczy wszystkich ofert.

**Gotowe:** jeden `h2` `FactsBox` w drzewie a11y na każdej ofercie; kolejność czytania i fokusu sensowna na 390 px i desktopie; miniatury `/ikony` mają nazwy „Powiększ…: {tytuł}”.

### 7b — linki w MDX ofert (O3) — checkpoint 2/4

- `mdx-components.tsx` — mapowanie `a` (styl `TextLink`, widoczny fokus); `h3` przyjmuje `id` (potrzebne w 7c).
- `content/offers/*` (bez „Dalszej drogi” — w 7c) — maile → `mailto:`, telefony → `tel:+48601734705`; **diff w czacie → OK → zapis** (K-122).

**Gotowe:** linki w treści ofert wyglądają jak linki i mają fokus; żadnych zmian treści poza zaakceptowanym diffem.

### 7c — „Dalsza droga” (O1) — checkpoint 3/4

- `content/offers/kurs-roczny-i-trzyletni.mdx` — tekst LY1; `#konsultacje` zachowane.
- Prawa kolumna: zdjęcie + blok CTA (copy w `pl.ts`, `mailto:` z tematem LY2) — komponent MDX wg istniejących wzorców ofert (`OfferFigure` / `Button`).
- `docs/brief-claude-code.md` §7 — nowy temat `mailto:`.

**Gotowe:** 390 px / 1440 px / ≥ 1600 px; `/warsztaty/kurs-roczny-i-trzyletni#konsultacje` przewija do nagłówka; przycisk „Zapytaj” otwiera mail z właściwym tematem.

### 7d — O nas (S1) — checkpoint 4/4

- `PersonProfile.tsx` — usunięcie listy realizacji; `content/pages/o-akademii.json` — usunięcie `works` / `worksTitle`; `src/content/types.ts` — pola opcjonalne; `globals.css` — usunięcie `.person-profile-works*`.
- `docs/plan-claude-code.md` §5 — pozycja „Wybrane realizacje” zamknięta (wycofane).

**Gotowe:** `/o-akademii` bez sekcji, bez pustych odstępów; build + lint OK.

## Kryterium „gotowe” k7

Build + lint OK; `/ikony`, `/warsztaty/*`, `/o-akademii` obejrzane na 390 px i desktopie; jeden `h2` `FactsBox` na ofertach; `#konsultacje` działa; linki `mailto:`/`tel:` w ofertach stylowane z fokusem; zmiany w `content/` tylko w zakresie zaakceptowanym w czacie.

## Postęp

| Kawałek | Status | Uwagi |
| --- | --- | --- |
| C1 — stopka | ✅ | 2026-10-04, K-36 — zamknięta przed sesją planistyczną |
| 7a — a11y | ✅ | 2026-10-04 — `IconGrid` `aria-label` „Powiększ ikonę: {tytuł}” (`pl.gallery.lightbox.openIcon`); `OfferPage` jedna instancja `FactsBox`; dodatkowo (decyzja w czacie) `LecturesHubPage` (`/wyklady`) — jedna instancja, na mobile pod `introSecondary` |
| 7b — linki MDX | ✅ | 2026-10-04 — `MdxLink` (nowy plik) wpięty tylko w `OfferPage` przez `components` (nie globalnie — `a` objęłoby aktualności, `/kontakt`, artykuły); `mdx-components.tsx`: `h3` → `MdxHeading3` z `id` + `scroll-mt`, eksport `Heading3` dla kotwic z MDX; `offers.ts`: `Content: ComponentType<MDXProps>`. Treść: zero zmian — jedyne maile/telefon w ofertach są w „Dalszej drodze” (usuwa je 7c). |
| 7c — Dalsza droga | ✅ | 2026-10-04 — tekst LY1 w `OfferSideCta` (nowy komponent MDX: grid jak nagłówek oferty, prawa kolumna = zdjęcie 4:5 + blok CTA w stylu `FactsBox`, `Button` secondary „Zapytaj”); `<Heading3 id="konsultacje">`; temat LY2 w brief §7 |
| 7d — O nas | ✅ | 2026-10-04 — sekcja „Wybrane realizacje” usunięta (`PersonProfile`, `o-akademii.json`, CSS `.person-profile-work*`); `works?`/`worksTitle?` opcjonalne w `types.ts`; §5 zamknięte (wycofane). Usunięty nieużywany token `--person-works-max`. |
