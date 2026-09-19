# Plan 04 — Wykłady

Status: zamknięty 2026-09-18
Gałąź: feat/04-wyklady
Makiety: `design/Akademia Ikony - kierunki wizualne.dc.html` — `#2a-wyklady` (hub bieżącego sezonu + sekcja archiwum: lead i link „Pełne archiwum”); `#3a-wykladowcy` (SectionNav, lead — layout kart wykładowców wg obecnej strony WP, nie kafelki bez zdjęć z makiety)

## Cel i zakres

Trzy trasy sekcji Wykłady: hub `/wyklady` (program bieżącego sezonu, FactsBox, sekcja archiwum: lead z `archive.json` + link „Pełne archiwum”), `/wyklady/archiwum` (pełna lista sezonów w `SeasonAccordion`), `/wyklady/wykladowcy` (wykładowcy ze zdjęciem i bio jak na akademiaikony.pl). Komponenty `LectureList`, `SeasonAccordion`, `LecturerCard`; warstwa `src/content/lectures.ts` + `src/content/lecturers.ts`; dane w `content/lectures/*.json` i `content/lecturers.json`. Hub to **osobny** `LecturesHubPage` — nie `OfferPage`; `content/offers/wyklady.mdx` zostaje źródłem **FactsBox** (zapisy, „W skrócie”). Poza zakresem: emisja JSON-LD `Event` (K-17 → pod-etap 7), analityka (K-15), migracja pełnych 16 sezonów (pod-etap 8).

## Decyzje podjęte w sesji planistycznej

- **K-17:** JSON-LD `Event` — w pod-etapie 4 **dane gotowe** (daty ISO w `Lecture.date`, lokalizacja w warstwie treści); **emisja** `<script type="application/ld+json">` dopiero w pod-etapie 7.
- **K-18:** Hub `/wyklady` — **dedykowany** `LecturesHubPage` wg `#2a-wyklady` (H1 = `cycleTitle`, eyebrow sezonu, `LectureList`, sekcja archiwum: lead + link „Pełne archiwum”); `wyklady.mdx` **nie** renderowany przez `OfferPage`.
- **K-19:** `/wyklady/wykladowcy` — layout **jak obecna strona WP** (wiersz: zdjęcie + imię/nazwisko + bio), nie siatka `#3a-wykladowcy` bez zdjęć; świadome odstępstwo od makiety, zgodne z treścią klienta.
- **K-21:** `lecturerSlugs` — join z `lecturer-directory.json` (etykiety w programie) i `lecturers.json` (profile na `/wykladowcy`); brak wpisu w obu → heurystyka ze sluga (bez linku). Rozszerzenia `types.ts`: `affiliationFull`, `introSecondary`, `LecturerDirectoryEntry`.
- **K-22:** Przygotowanie danych — **osobna konwersacja** przed Kawałkiem 1 (krok po kroku); **pełny pakiet**: `2026-2027.json`, 2–3 sezony archiwum `sample`, wykładowcy z WP + pobranie zdjęć do `public/media/`.
- **Archiwum — stan domyślny:** na `/wyklady/archiwum` wszystkie sezony **zwinięte** przy wejściu na stronę; użytkownik rozwija wybrany sezon ręcznie.



## Pliki i komponenty


| Plik                                                                       | Nowy/zmiana    | Odpowiedzialność                                                                                                                                 |
| -------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/lectures/2026-2027.json`                                          | nowy           | Bieżący sezon: `cycleTitle`, `intro`, `lectures[]` — daty ISO z brief §8; tytuły i prowadzący z WP (`/wyklady/tematy/`)                        |
| `content/lectures/sample-2025-2026.json` (+ opcj. `sample-2024-2025.json`) | nowy, `sample` | Archiwum sample (nazwa pliku + pole `"sample": true` w JSON)                                                                                     |
| `content/lecturers.json`                                                   | nowy           | Wpisy `Lecturer` (bio, `titles`, `affiliation` / `affiliationFull`, `photo`) — treść z WP                                                        |
| `content/lecturer-directory.json`                                          | nowy           | Lekki rejestr nazw i skrótów afiliacji do `LectureList` (goście spoza pełnych profili)                                                           |
| `content/offers/wyklady.mdx`                                               | zmiana         | Uzupełnienie `facts`; ewentualnie lead — FactsBox bez zmiany kontraktu z pod-etapu 3                                                             |
| `public/media/lecturers/*`                                                 | nowe           | Zdjęcia wykładowców pobrane z WP / blogspot (oryginały, wymiary w JSON)                                                                          |
| `src/content/types.ts`                                                     | zmiana         | `affiliationFull` na `Lecturer`, `introSecondary` na `LectureSeason`, typ `LecturerDirectoryEntry`                                               |
| `src/content/lectures.ts`                                                  | nowy           | `getCurrentSeason()`, `getArchiveSeasons()`, `getSeason(slug)`, format dat PL, join `lecturerSlugs` → nazwy (directory + lecturers)              |
| `src/content/lecturer-directory.ts`                                        | nowy           | `getLecturerDirectoryEntry(slug)` — lookup etykiet prowadzących w programie                                                                      |
| `src/content/lecturers.ts`                                                 | nowy           | `getLecturers()`, `getLecturer(slug)`, lookup profili na stronie wykładowców                                                                     |
| `src/components/content/LectureList.tsx`                                   | nowy           | Program sezonu: data (serif, złoto) + tytuł + etykieta wykładowcy (bez prefiksu „prowadzenie")                                                    |
| `src/components/content/SeasonAccordion.tsx`                               | nowy, Client   | Archiwum sezonów; Enter/Space, `aria-expanded`, chevron SVG; treść rozwiniętego sezonu w DOM                                                     |
| `src/components/content/LecturerCard.tsx`                                  | nowy           | Wiersz zdjęcie + H3 + `affiliationFull` + bio (layout WP)                                                                                        |
| `src/components/lectures/LecturesHubPage.tsx`                              | nowy           | Shell: eyebrow, H1, lead, FactsBox (desktop/mobile jak oferta, `id="zapisy"`), `LectureList`, sekcja archiwum (lead + link „Pełne archiwum”)     |
| `src/components/lectures/LecturesArchivePage.tsx`                          | nowy           | Pełne archiwum: nagłówek, lead z `archive.json` (15 sezonów archiwalnych), `SeasonAccordion` (domyślnie wszystkie zwinięte)                     |
| `src/components/lectures/LecturersPage.tsx`                                | nowy           | Lead + siatka `LecturerCard` (archiwum wyłącznie przez `SectionNav`, bez kafelka CTA)                                                            |
| `src/app/wyklady/page.tsx`                                                 | zmiana         | `LecturesHubPage` + dane z warstwy treści                                                                                                        |
| `src/app/wyklady/archiwum/page.tsx`                                        | zmiana         | `LecturesArchivePage`                                                                                                                            |
| `src/app/wyklady/wykladowcy/page.tsx`                                      | zmiana         | `LecturersPage`                                                                                                                                  |
| `src/i18n/pl.ts`                                                           | zmiana         | Sekcja `lectures` / `lecturers`: nagłówki sekcji, etykiety UI akordeonu („rozwiń”/„zwiń”), linki archiwum — **bez** liczby sezonów hardkodowanej |
| `src/app/globals.css`                                                      | zmiana         | Tokeny layoutu `LectureList`, `SeasonAccordion`, `LecturerCard`, hub wykładów                                                                    |




## Kawałki



### Krok 0 — Przygotowanie danych *(osobna sesja, przed kodem)*

Zakres: osobna konwersacja — krok po kroku: utworzenie plików JSON, przeniesienie bio wykładowców z WP (`/wyklady/wykladowcy/`), pobranie zdjęć, wpisanie terminów 2026/2027 z brief §8; intro archiwum z liczbą sezonów (16 łącznie, 15 archiwalnych); `"sample": true` na plikach archiwum.

Kryterium „gotowe”: pliki w repo zgodne ze schematem `LectureSeason` / `Lecturer`; build nie wymagany; użytkownik potwierdza gotowość do implementacji.

### Kawałek 1 — Warstwa treści + `LectureList` + hub `/wyklady`

Zakres: `src/content/lectures.ts`, `src/content/lecturers.ts`; `LectureList`, `LecturesHubPage`; trasa `/wyklady` (eyebrow, H1 = `cycleTitle`, lead z `intro`, FactsBox z `getOffer("wyklady")`, program bieżącego sezonu); `pl.lectures`; tokeny CSS.

Kryterium „gotowe”: `/wyklady` zgodne z `#2a-wyklady` (desktop + 390px); daty bieżącego sezonu z brief §8; FactsBox `kind: wyklady` + temat mailto z brief §7; build/lint OK; nawigacja klawiaturą na linkach/CTA.

### Kawałek 2 — `SeasonAccordion` + archiwum

Zakres: `SeasonAccordion` (Client Component); `LecturesArchivePage`; trasa `/wyklady/archiwum` (wszystkie sezony archiwalne, domyślnie zwinięte); link „Pełne archiwum” z huba (sekcja archiwum na hubie bez akordeonu).

Kryterium „gotowe”: akordeon — Enter/Space, widoczny fokus, `aria-expanded`; treść rozwiniętego sezonu w DOM (progressive enhancement); build/lint OK; mobile + desktop.

### Kawałek 3 — Wykładowcy

Zakres: `LecturerCard`, `LecturersPage`; trasa `/wyklady/wykladowcy` — karty ze zdjęciami (layout WP); `id` na slug dla ewentualnych kotwic `#slug`. Bez kafelka CTA do archiwum — nawigacja przez `SectionNav`.

Kryterium „gotowe”: strona renderuje wszystkich wykładowców z `content/lecturers.json`; zdjęcia przez `next/image`; DoD pod-etapu spełnione; build/lint OK.

## Dane sample dodawane w tym pod-etapie

- `content/lectures/2026-2027.json` — daty z brief §8; tytuły i prowadzący z WP → plan §5
- `content/lectures/sample-2025-2026.json` (+ opcj. `sample-2024-2025.json`) — `"sample": true` → plan §5
- `content/lecturers.json` — bio z WP (treść redakcyjna, nie generowana) → plan §5
- `content/lecturer-directory.json` — etykiety prowadzących do programów sezonów (szerszy zbiór niż profile) → plan §5
- `public/media/lecturers/*` — zdjęcia z WP/blogspot → plan §5
- Liczba sezonów (16 łącznie, 15 archiwalnych) — w `intro` archiwum (`archive.json`), nie w `pl.ts` → plan §5
- `content/lecturers-page.json` — lead strony wykładowców (tekst z makiety `#3a`, `{totalSeasons}` z `archive.json`) → plan §5



## Backlog — wykładowcy (później, poza pod-etapem 4)

- Dodać więcej wykładowców (pełna lista gości z archiwum sezonów).
- Przyciąć / ujednolicić proporcje niektórych zdjęć wykładowców.
- Ustawić wykładowców w kolejności alfabetycznej (obecnie kolejność z WP / importu).
- **Layout strony:** wrócić do wersji z makiety `#3a-wykladowcy`, zmodyfikowanej — siatka z miejscem na zdjęcie i bio (nie kafelki bez zdjęć z makiety). Obecny layout wierszowy (WP) jest **tymczasowy** (K-19 v1).


## Ryzyka i pytania otwarte

- **Odstępstwo makieta vs WP (wykładowcy):** K-19 — layout ze zdjęciami, nie kafelki `#3a`.
- **Brak osobnej makiety mobile wykładów:** responsywność wg wzorców z pod-etapów 2–3 + `#2a-wyklady` desktop.
- **Źródła zdjęć wykładowców:** mix `wp-content/uploads` i blogspot — w kroku 0 logować URL-e, które wymagają ręcznego pobrania; unikać `/cache/`.
- **Archiwum sample vs 16 sezonów:** na v1 wystarczą 2–3 pliki `sample`; reszta (15 archiwalnych + bieżący) w migracji WP (pod-etap 8).
- **Goście spoza rejestru wykładowców:** w archiwum mogą występować slugi bez wpisu w `lecturer-directory.json` / `lecturers.json` — K-21 (etykieta ze sluga, bez linku).



## Postęp


| Kawałek                        | Status | Uwagi z checkpointu                                                                                                                                    |
| ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0 — Przygotowanie danych       | ✅      | 2026-2027 + 2 sample sezony, lecturers.json, zdjęcia, archive.json, wyklady.mdx                                                                        |
| 1 — LectureList + hub          | ✅      | warstwa treści, LectureList, LecturesHubPage, /wyklady, pl.lectures, tokeny CSS                                                                        |
| 2 — SeasonAccordion + archiwum | ✅      | SeasonAccordion, LecturesArchivePage, /wyklady/archiwum; poprawki UI: cursor-pointer, border-b na przycisku rozwiniętym |
| 3 — Wykładowcy                 | ✅      | LecturerCard, LecturersPage, /wyklady/wykladowcy, lead z makiety (#3a), pl.lecturers, tokeny CSS                                                         |


