# Plan 10 / kawałek 5 — Album (`/publikacje/ikona-dzis`)

Status: **zatwierdzony** 2026-10-04 (sesja planistyczna)  
Etap: `docs/plans/10-finishing.md` (kawałek 5, zadanie P1)  
Gałąź: `feat/10-finishing`  
Kontekst: K-76 (Publikacje: album + artykuły). Źródło struktury spisu: spis treści w drukowanym albumie (zrzut przekazany przez właściciela w czacie 2026-10-04).

## Cel

Spis treści na stronie ma odwzorowywać strukturę albumu (rozdziały z zakresami stron), a nie wyglądać jak lista artykułów — album to przede wszystkim reprodukcje ikon i życie Akademii, teksty to ok. 30% treści. Usunięcie błędnego podziału autorów na „wykładowców” i „uczestników” (wszyscy autorzy tekstów są wykładowcami). Sprzątnięcie notatek z makiety, które trafiły do copy. Na końcu podpięcie prawdziwych skanów (okładka, rozkładówki, rozkładówka ze spisem treści).

## Diagnoza (stan na 2026-10-04)

| # | Problem |
| --- | --- |
| 1 | `PublicationTocList` — płaska lista 11 pozycji z rolą autora i złotą krechą „Czytaj na stronie”; brak rozdziałów i zakresów stron — czyta się jak lista artykułów. |
| 2 | Sprutta i Dylewska są w `lecturers.json` (`justyna-sprutta`, `magdalena-dylewska`), ale w `toc` nie mają `lecturerSlug` → oznaczone „z warsztatów”, bez linku do noty. |
| 3 | Sekcja „Autorzy tekstów” dubluje spis (po korekcie wszyscy autorzy to wykładowcy z linkami w spisie). |
| 4 | „Moja droga z ikoną – wypowiedzi twórców” i „Przykłady wydarzeń – plakaty” nie mają autora w albumie; w danych wymyślony autor `[do uzupełnienia: …]` (wymóg typu `author: Author`). |
| 5 | Copy twierdzi, że album zawiera „teksty uczestników warsztatów i wykładów”: `lead`, `hubDescription` (także `/publikacje`), `aboutParagraphs[0]`. Lead stawia teksty na pierwszym miejscu, choć album to głównie ikony. |
| 6 | Notatki z makiety jako copy w produkcji: `tocLeadMobile`, `spreadsIntroMobile`, `spreadsFootnote`, `coverScanNote` / `coverScanNoteShort`. |
| 7 | Szyk tytułów: „O. dr SJ Aleksander Jacyniak” — `formatLecturerDisplayName` stawia całe `titles` przed nazwiskiem; „SJ” to postnominal. Błąd globalny (też `/wyklady/wykladowcy`). |
| 8 | Metryczka: 176 stron; spis albumu kończy się na str. 178. |
| 9 | Album: „Dr Maria Magdalena Dylewska”; nota na stronie: „dr Magdalena Dylewska”. |

## Decyzje sesji planistycznej (2026-10-04)

| # | Decyzja |
| --- | --- |
| **AL1 — Spis wg albumu** | Spis treści w HTML odwzorowuje album: **rozdział z zakresem stron** jako nagłówek grupy, teksty pod nim. Teksty dostępne na stronie — **cichy znacznik** przy tytule (link), bez złotej krechy i etykiety nad pozycją. **Bez etykiet ról.** Bez zwijania listy (≤ 6 grup) → `PublicationTocList` jako Server Component (bez `useState`, bez przycisku „Pokaż pełny spis”). |
| **AL2 — Wstęp przed rozdziałem** | „Piętnasta rocznica” (ks. Paprocki) to **wstęp przed rozdziałem 1**, nie tytuł rozdziału. Rozdział 1 (str. 6–51) = „Piękno Boga, piękno człowieka”. Wstęp renderowany jako pozycja w grupie str. 6–51, przed tytułem rozdziału (dokładna forma — przy kodzie, w meldunku). |
| **AL3 — Model** | Zmiana **addytywna** w `Publication` (`src/content/types.ts`): nowe opcjonalne `chapters?: { title?: string; pages: string }[]` (rozdział bez tytułu dopuszczalny tylko jeśli okaże się potrzebny); pozycja `toc` dostaje opcjonalne `chapter?: number` (indeks w `chapters`) i opcjonalne `intro?: boolean` (AL2) — ostateczny kształt w k5a, bez zmiany nazw istniejących pól. **`toc[].author` staje się opcjonalny.** Walidacja build: indeks rozdziału istnieje; pozycje danego rozdziału ciągłe; `articleSlug` jak dziś. Nowa decyzja K-1xx w `docs/plan-claude-code.md` §4. |
| **AL4 — Autorzy** | Sprutta i Dylewska dostają `lecturerSlug`. **Sekcja „Autorzy tekstów” usunięta**; link „Noty wykładowców” → do wstępu nad spisem. Usunięty martwy kod: `getPublicationAuthorGroups`, `PublicationAuthorGroups`, `pl.publications.roles`, `authorsHeading`, `authorsLecturers`, `authorsParticipants`, style `.publication-authors-*`. Nazwiska z not wykładowców (spójność w serwisie) — rozbieżność z albumem (#9) do wiadomości EJK. |
| **AL5 — Notatki z makiety** | `tocLeadMobile`, `spreadsIntroMobile`, `spreadsFootnote` — usunięte. `coverScanNote` / `coverScanNoteShort` zostają do k5c (znikają ze skanem okładki). |
| **AL6 — Copy albumu** | Przeredagowanie `lead`, `hubDescription`, `aboutParagraphs` (bez „tekstów uczestników”, akcent na ikony i życie Akademii) — **gate K-122** w czacie przed zapisem; bez nowych twierdzeń — braki jako `[do uzupełnienia: …]`. |
| **AL7 — Skan spisu** | Rozkładówka ze spisem treści jako **pierwsza** rozkładówka w galerii — uzupełnienie, nie zamiennik listy HTML. |
| **AL8 — Skany w tej fali** | Skany (okładka, rozkładówki, spis) dostarcza właściciel w fali 1 — **ostatni checkpoint k5 (k5c)**. |

## Plan implementacji

### k5a — model i dane (checkpoint 1/3, **gate K-122** przed zapisem w `content/`)

- `src/content/types.ts` — AL3 (pola opcjonalne, `author?`).
- `src/content/publications.ts` — walidacja rozdziałów; usunięcie `getPublicationAuthorGroups` (AL4); obsługa `author` opcjonalnego tam, gdzie `toc` jest czytany (walidacja artykułów).
- `content/publications/ikona-dzis.mdx` — `chapters` (6 grup: 6–51, 52–85, 86–105, 106–137, 138–171, 172–178), `chapter`/`intro` przy pozycjach, slugi Sprutta/Dylewska, usunięte wymyślone autory (#4).
- Copy AL6: `lead`, `hubDescription`, `content/publications/ikona-dzis-body.mdx` — propozycja w czacie → zapis po akceptacji.
- Do potwierdzenia przy gate: liczba stron (#8).
- **Kryterium:** build + lint OK (strona może jeszcze renderować płaską listę — komponent w k5b).

### k5b — spis treści, porządki strony (checkpoint 2/3)

- `PublicationTocList.tsx` — AL1/AL2: grupy rozdziałów, zakres stron, znacznik tekstu online, bez ról, Server Component; wstęp z linkiem „Noty wykładowców”.
- `PublicationAlbumPage.tsx` — usunięcie sekcji autorów (AL4), notatek AL5.
- `src/i18n/pl.ts` — nowe stringi (np. „str. {pages}”, etykieta znacznika), usunięcie martwych (AL4, AL5), nowy `tocLead`.
- `src/app/globals.css` — style `.publication-toc-*` pod grupy; usunięcie `.publication-authors-*`, `.publication-toc-expand`, `.publication-toc-item-collapsed`, `--publication-toc-read-col` jeśli zbędny.
- `src/content/lecturers.ts` — #7: postnominal zakonny („SJ” itp.) po nazwisku w `formatLecturerDisplayName` (rozwiązanie w kodzie bez zmiany danych, lub — jeśli prostsze — korekta danych przez gate; wybór w meldunku).
- **Kryterium:** definicja „gotowe” z `CLAUDE.md`; 390 px + desktop; brak zduplikowanych `h2`; linki w spisie dostępne z klawiatury; `/publikacje` (hub) bez regresji.

### k5c — skany albumu (checkpoint 3/3, ostatni)

- Właściciel dostarcza pliki: skan okładki (23 × 23 cm, kadr kwadratowy), rozkładówki (2:1), rozkładówka ze spisem treści.
- `public/media/publications/ikona-dzis/*` — podmiana plików; `ikona-dzis.mdx` — `cover` i `spreads[]` z prawdziwymi `width`/`height`, rozkładówka spisu pierwsza (AL7), podpisy ze stronami powiązanymi z zakresami rozdziałów; `alt` — gate K-122.
- Usunięcie `coverScanNote` / `coverScanNoteShort` z `pl.ts`, `PublicationAlbumPage`, `PublicationsHubPage` (AL5).
- Weryfikacja kadrowania okładki i siatki rozkładówek (D9 z k2 — grid 2:1) + lightbox na 390 px i desktopie; `/publikacje` (podgląd 4 rozkładówek).
- Aktualizacja `docs/plan-claude-code.md` §5 (zamknięte placeholdery albumu), Postęp w `10-finishing.md`.

## Ryzyka i pytania otwarte

- **#8 liczba stron** (176 vs 178) — do potwierdzenia przy gate k5a lub z EJK.
- **#9 imię Dylewskiej** — informacyjnie do EJK (k8); na stronie zostaje nota.
- **Model współdzielony** — AL3 jest addytywny, ale `author?` luzuje kontrakt; odnotować w §4 dla przyszłego projektu.
- JSON-LD `Book`/`Article` (k9) — `hasPart` może korzystać z `chapters`; nie w k5.

## Postęp

| Krok | Status | Uwagi |
| --- | --- | --- |
| k5a — model i dane | ⬜ | gate K-122 |
| k5b — spis, porządki | ⬜ | |
| k5c — skany | ⬜ | pliki od właściciela |
