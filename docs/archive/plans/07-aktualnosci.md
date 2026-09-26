# Plan 07 — Aktualności

Status: zamknięty 2026-09-22 (5/5 kawałków + korekty 07b i 07c)
Gałąź: feat/07-news
Makiety: `design/Akademia Ikony - Wystawa i Aktualności.dc.html` — ekrany **7e–7j** (lista + wpisy); handoff: `design/README-wystawa-aktualnosci.md` §1 sloty AK-* / WP-*. Ekrany 7a–7d (`/ikony/wystawa`) — **etap 8**.

## Cel i zakres

Jeden strumień wpisów z etykietą typu (`kind`), lista chronologiczna z paskiem lat na `/aktualnosci` i pojedynczy artykuł na `/aktualnosci/[slug]` z `Breadcrumb`, body MDX, galerią (`images`), plakatem (`poster`) i opcjonalnym blokiem CTA w treści. Archiwum dawnego działu „Wydarzenia” trafia tu jako wpisy `sample` (generator z WP, K-50, K-52). **Pełna aktualizacja nawigacji** (K-50): menu, stopka, `SectionNav` Ikony z „Wystawa”, usunięcie `/wydarzenia` — przeniesione z etapu 8 (D-07-02). Poza zakresem: strona `/ikony/wystawa` (treść — etap 8; w kawałku 4 tylko zaślepka trasy, żeby linki z nawigacji nie prowadziły do 404); filtry kategorii (K-52); miniatury na liście w pierwszej iteracji (przegląd w kawałku 5, D-07-03); migracja prawdziwych danych (etap 9).

## Decyzje podjęte w sesji planistycznej

- **K-06:** **Wszystkie lata na jednej stronie**; `YearNav` (reuse `SectionNav`) = kotwice scroll do **pojedynczych lat** (D-07-11); **bez** paginacji, **bez** ukrywania starszych wpisów, **bez** przycisku „Pokaż starsze lata”.
- **D-07-02:** Pełna aktualizacja nawigacji w etapie 7 — `mainNav` „Aktualności” zamiast „Wydarzenia”, stopka, `sectionNav.ikony`: Galeria · Wystawa · Ikony na zamówienie; usunięcie `sectionNav.wydarzenia` i trasy `/wydarzenia`.
- **D-07-03:** `NewsCard` **bez miniatury** w v1 — **zostaje** (kawałek 5); rekomendacja na przyszłość: miniatura z `cover` → `poster` → pierwsze `images` (pole `cover` w typie gotowe, generator na razie nie wypełnia).
- **D-07-04:** Blok CTA (makieta C2, WP-14) — komponent MDX w body, np. `<NewsCta href="…" label="…" />`; bez nowego pola w `types.ts`.
- **D-07-05:** Generator **`scripts/generate-news-sample.ts`**: pełny zestaw z WP (aktualności + przekształcone wydarzenia wg zasad migracji z planu §3 etapu 9); `"sample": true`; obrazy w `public/media/sample/news/`.
- **D-07-06:** Prev/next po `date` **malejąco** (jak lista): etykiety **„Poprzedni”** / **„Następny”** (chevrony ‹ ›); brak linku na skraju listy zamiast pętli.
- **D-07-11:** `YearNav` — **jeden link na każdy rok z wpisami**, bez grupowania zakresów (np. bez „2020–2024”); tylko lata obecne w danych, malejąco.
- **D-07-07:** `Breadcrumb` — separator **`›`** (globalnie w komponencie).
- **D-07-08:** Lead listy (`AK-02`) w **`pl.ts`**, nie w `content/`.
- **D-07-09:** Linki OA-55 i OA-63 na `/o-akademii` — etykieta **„Aktualności”**, href `/aktualnosci` (korekta w `content/pages/o-akademii.json`).
- **D-07-10:** Grupowanie latami — rok z pola **`date`** (data początkowa), nawet gdy jest `dateEnd` w innym roku kalendarzowym.
- **Ustalenia:** komponent listy = **`NewsCard`** (brief §7; handoff mówi `NewsEntry` — nie używamy tej nazwy w kodzie); `types.ts`: rozszerzony `News` + usunięty `Event` (K-53); galeria wpisu — reuse wzorca `PhotoGrid` + lightbox (jak `/pracownia`).

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| ---- | ----------- | ---------------- |
| `src/content/types.ts` | zmiana | `NewsKind`, rozszerzony `News` (`kind`, `dateEnd?`, `images?`, `poster?`); usunięcie `Event` |
| `src/content/news.ts` | nowy | `getNews()`, `getNewsBySlug()`, `getNewsGroupedByYear()`, sąsiedzi prev/next, mapowanie etykiet `kind` |
| `scripts/generate-news-sample.ts` | nowy | Import WP → `content/news/*.mdx` + media; reguły K-50 / plan etapu 9 §3 |
| `content/news/*.mdx` | nowe | Wpisy `sample` z frontmatter zgodnym z `News` |
| `public/media/sample/news/*` | nowe | Obrazy z generatora |
| `src/components/news/NewsCard.tsx` | nowy | Karta wpisu na liście: etykieta typu + data (jedna linia), tytuł (link H3), excerpt; **bez miniatury** (D-07-03) |
| `src/components/news/YearHeading.tsx` | nowy | H2 roku + złoty włos (makieta AK-2{rok}) |
| `src/components/news/YearNav.tsx` | nowy | Reuse `SectionNav` — kotwice do lat (D-07-11: pojedyncze lata, bez zakresów); etykieta „Przejdź do roku” z `pl.ts` |
| `src/components/news/NewsListPage.tsx` | nowy | H1, lead, `YearNav`, grupy `YearHeading` + `NewsCard` |
| `src/components/news/NewsArticlePage.tsx` | nowy | Składanie wpisu: meta, H1, body MDX, poster, galeria, prev/next |
| `src/components/news/NewsCta.tsx` | nowy | Blok CTA (WP-14): złota kreska, tekst, przycisk, kontakt |
| `src/components/news/NewsPoster.tsx` | nowy | Plakat w kolumnie (C1); placeholder gdy brak pliku |
| `src/components/news/NewsGallery.tsx` | nowy, Client | Miniatury + lightbox (reuse logiki `PhotoGrid`/`WorkshopLightbox` lub wspólny wrapper) |
| `src/components/navigation/Breadcrumb.tsx` | zmiana | Separator `›` |
| `src/navigation.ts` | zmiana | K-50: Aktualności, Ikony + Wystawa, bez wydarzenia; `SectionKey` bez `wydarzenia` |
| `src/components/navigation/Header.tsx` | zmiana | Menu z `navigation.ts` (jeśli hardcode — sync) |
| `src/components/navigation/HeaderMobileMenu.tsx` | zmiana | Aktualności płaski link; Ikony: Galeria · Wystawa · Na zamówienie |
| `src/components/navigation/Footer.tsx` | zmiana | Mapa strony wg K-50 |
| `content/pages/o-akademii.json` | zmiana | OA-55, OA-63 → `/aktualnosci`, etykieta „Aktualności” |
| `src/app/aktualnosci/page.tsx` | zmiana | `NewsListPage` |
| `src/app/aktualnosci/[slug]/page.tsx` | nowy | `NewsArticlePage` + `generateStaticParams` |
| `src/app/ikony/wystawa/page.tsx` | nowy | Zaślepka `PagePlaceholder` do etapu 8 |
| `src/app/wydarzenia/page.tsx` | usunięcie | Trasa nie powstaje (K-50) |
| `src/i18n/pl.ts` | zmiana | `news.*`: lead, etykiety `kind`, „Poprzedni/Następny” (D-07-06), galeria, YearNav |
| `mdx-components.tsx` | zmiana | Mapa: `<NewsCta />` dla wpisów aktualności |
| `src/app/globals.css` | zmiana | Style listy, karty, wpisu, CTA, galerii (tokeny z makiet 7e–7j) |

## Kawałki

### Kawałek 1 — Fundament + generator danych `sample`

Zakres: `types.ts` (`News`, usunięcie `Event`); `src/content/news.ts` (odczyt MDX, sortowanie, grupowanie po roku z `date`); `scripts/generate-news-sample.ts` — pełny import z WP (D-07-05): posty aktualności + wydarzenia wg reguł migracji (bez poświęceń → publikacje, bez hubu `/wydarzenia`, oprowadzania 2017 → jeden wpis itd.); `content/news/*.mdx` z `"sample": true`; media w `public/media/sample/news/`. Minimum 2 wpisy ręcznie zweryfikowane (Wilno 2013, nabór 2026) jeśli generator wymaga iteracji.

Kryterium „gotowe”: `getNews()` zwraca 60+ wpisów wszystkich `kind`; build przechodzi z wygenerowanymi plikami; skrypt dokumentowany w komentarzu nagłówkowym; wpisy oznaczone `sample` dopisane do §5 poniżej; `npm run lint` OK.

### Kawałek 2 — Lista `/aktualnosci`

Zakres: `NewsCard`, `YearHeading`, `YearNav`, `NewsListPage`; `/aktualnosci`; stringi w `pl.ts` (lead AK-02, etykiety `kind`, YearNav); bez miniatur (D-07-03); wszystkie lata widoczne (K-06).

Kryterium „gotowe”: zgodność z makietą 7e/7f (desktop + 390 px); H1 → H2 rok → H3 tytuł; etykieta typu i data czytane razem (a11y); `YearNav` — pojedyncze lata z wpisami, scroll do kotwic (D-07-11); brak filtrów; build/lint OK.

### Kawałek 3 — Wpis `/aktualnosci/[slug]`

Zakres: `[slug]/page.tsx`, `NewsArticlePage`, `Breadcrumb` (`›`), meta WP-01, body MDX, `NewsPoster`, `NewsGallery` + lightbox, `NewsCta` w mapie MDX; nawigacja prev/next „Poprzedni/Następny” (D-07-06); link „Wszystkie aktualności”. Przykłady: C1 (Wilno) i C2 (nabór z `<NewsCta />`).

Kryterium „gotowe”: zgodność z 7g–7j; treść tylko z `content/news/`; galeria klawiaturowo dostępna; „Poprzedni/Następny” poprawne na skraju listy (brak linku zamiast pętli); build/lint OK.

### Kawałek 4 — Nawigacja (K-50) + korekty linków

Zakres: `navigation.ts`, Header, HeaderMobileMenu, Footer; `sectionNav.ikony` z „Wystawa”; usunięcie wydarzenia; zaślepka `/ikony/wystawa`; usunięcie `/wydarzenia`; korekta OA-55/OA-63 w `o-akademii.json`. Mobile: Aktualności bez akordeonu; Ikony rozwinięte (makieta kierunki wizualne).

Kryterium „gotowe”: menu główne 6 pozycji jak brief §3; stopka bez „Wydarzenia”, z „Wystawa” w grupie Ikony; `/wydarzenia` nie istnieje; linki z O Akademii → `/aktualnosci`; build/lint OK.

### Kawałek 5 — Przegląd miniatur + domknięcie DoD

Zakres: decyzja D-07-03 (zostawiamy bez miniatur / wdrażamy z regułą A z sesji — do meldunku); przegląd 390 px i desktop całego etapu; odhaczenie DoD; aktualizacja postępu w tym pliku.

Kryterium „gotowe”: wszystkie checkboxy DoD poniżej; build/lint OK; meldunek z rekomendacją lub implementacją miniatur.

## Dane sample dodawane w tym etapie

→ wpis do `docs/plan-claude-code.md` §5 (już istnieje wiersz „Wpisy aktualności”; uzupełnić po generatorze):

| Treść | Gdzie | Zastąpić czym |
| ----- | ----- | ------------- |
| Wpisy aktualności + archiwum wydarzeń (59, po scaleniach K-67) | `content/news/sample-*.mdx`, `public/media/sample/news/` | migracja WP (etap 9) |
| Plakaty wystaw (brak plików z WP) | frontmatter `poster` w wybranych wpisach | archiwum WP / Publikacje (sesja) |
| Treści `[przykład]` z makiet | — | **nie kopiować**; generator bierze z WP |

## Kryteria ukończenia etapu

- [x] Wpisy wszystkich `kind` renderują się w jednym szablonie; brak filtrów kategorii
- [x] Lista chronologiczna z 59 wpisami `sample` (K-06: jedna strona, archiwum zwinięte K-66; pasek lat + kotwice na kartach K-70)
- [x] `Breadcrumb` na `/aktualnosci/[slug]` z separatorem `›`
- [x] Treść wyłącznie z `content/news/*.mdx`; typ `News` zgodny z brief §4
- [x] Nawigacja K-50: Aktualności w menu, Wystawa w Ikony, brak `/wydarzenia`
- [x] Zgodność z makietami 7e–7j (lista + oba warianty wpisu)
- [x] Build/lint OK; nawigacja klawiaturą na interakcjach (YearNav, galeria, CTA, prev/next)

## Ryzyka i pytania otwarte

- **Generator WP:** REST API może wymagać mapowania kategorii WP → `kind`; edge cases (poświęcenia, wpis zbiorczy wystawy) — reguły z planu etapu 9; meldunek z raportem skryptu.
- **Plakaty:** jeśli WP nie ma pliku — placeholder w UI (ramka jak makieta), bez blokowania buildu.
- **Link „Nowa edycja wystawy”** na liście (makieta 2026) → `/ikony/wystawa` (zaślepka do etapu 8).
- **Miniatury (D-07-03):** świadomie odłożone do kawałka 5; rekomendacja z sesji na przyszłość: `cover` → `poster` → pierwsze `images`.
- **Lighthouse iOS lightbox `/ikony`:** etap 10 (K-38), nie 7.
- **Etap 8:** treść `/ikony/wystawa` i zmiany home/LSŚ — bez zmian w zakresie nawigacji (zrobione w 07).

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| ------- | ------ | ------------------- |
| 1 — Fundament + generator | ✅ | 61 wpisów sample, 8 kind (przed scaleniami K-67; po korektach 07b — 59); raport w `scripts/generate-news-report.json` |
| 2 — Lista `/aktualnosci` | ✅ | NewsCard, YearHeading, YearNav, NewsListPage; lead + YearNav w pl.ts; style 7e/7f |
| 3 — Wpis `[slug]` | ✅ | NewsArticlePage, NewsPoster, NewsGallery, NewsCta; Breadcrumb ›; registry MDX; fix CSS w sample-tejemnice-ikony |
| 4 — Nawigacja K-50 | ✅ | navigation.ts, HeaderMobileMenu (Ikony rozwinięte), Footer, zaślepka /ikony/wystawa, usunięcie /wydarzenia, OA-55/OA-63 |
| 5 — Przegląd miniatur + DoD | ✅ | D-07-03: bez miniatur v1; przegląd 390 px + desktop; DoD odhaczone |
| korekty po stagingu | ✅ | K-59…K-75; szczegóły: `docs/plans/07b-review-fixes.md` |
