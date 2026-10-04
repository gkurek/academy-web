# Plan 10 / kawałek 5 — Album (`/publikacje/ikona-dzis`)

Status: **zamknięty** 2026-10-04 (k5a–k5d ✅; plan zatwierdzony w sesji planistycznej 2026-10-04)  
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
| **AL8 — Skany w tej fali** | Skany (okładka, rozkładówki, spis) dostarcza właściciel w fali 1 — checkpoint **k5c**; batch optymalizacji i miniaturek — **k5d** (po komplecie plików w `public/`). |

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

### k5c — skany albumu (checkpoint 3/4)

- Właściciel dostarcza pliki **bezpośrednio** do `public/media/publications/ikona-dzis/` (nie przez czat — załączniki w czacie bywają przeskalowane / JPEG mimo `.png`).
- Pliki: skan okładki (23 × 23 cm, kadr kwadratowy), rozkładówki (2:1), rozkładówka ze spisem treści.
- `ikona-dzis.mdx` — `cover` i `spreads[]` z prawdziwymi `width`/`height` (np. `scripts/readImageSize.ts`), rozkładówka spisu pierwsza (AL7), podpisy (`caption`) ze stronami powiązanymi z zakresami rozdziałów; opcjonalnie `thumbSrc` / `thumbWidth` / `thumbHeight` per rozkładówka (siatka); `alt` — gate K-122.
- Usunięcie `coverScanNote` / `coverScanNoteShort` z `pl.ts`, `PublicationAlbumPage`, `PublicationsHubPage` (AL5) — gdy okładka docelowa.
- Weryfikacja kadrowania okładki i siatki rozkładówek + lightbox na 390 px i desktopie (pełny plik z `/media/`, bez `_next/image`); `/publikacje` (podgląd 4 rozkładówek). **Siatka:** proporcje kadru z `thumbWidth`/`thumbHeight` (skany ~1585×866 px, nie sztywne 2:1); złota obwódka na `.publication-spread-frame` — token `--publication-spread-aspect` jako fallback.
- **Kryterium:** wszystkie sloty `cover` + `spreads[]` podpięte do plików właściciela; build + lint OK.

### k5d — optymalizacja mediów albumu (checkpoint 4/4, ostatni)

Po komplecie plików z k5c — batch, nie przy każdym pojedynczym wrzuceniu (wyjątek: ręczny `-thumb` przy pierwszych testach jak `-02`).

| Krok | Działanie |
| --- | --- |
| 1 | **Weryfikacja formatu** — sygnatura pliku (PNG / JPEG); odrzucić pliki pośrednie z czatu. |
| 2 | **Wymiary w treści** — `width`/`height` w `ikona-dzis.mdx` = rzeczywiste px oryginału (`readImageSizeFromFile`). |
| 3 | **Miniaturki siatki** — dla każdej rozkładówki `spread-NN-thumb.png` (preset: szer. **800 px**, proporcje 2:1, `fit inside`); wpisy `thumbSrc` + wymiary thumb w frontmatter. Siatka = thumb; lightbox = pełny `spread-NN`. |
| 4 | **Kompresja oryginałów (gate wizualny)** — rozkładówki z **tekstem** (spis): PNG, ewent. `oxipng` / ostrożny `pngquant`; głównie **ikony / foto**: rozważyć JPG q90–92 albo lekki PNG — **porównanie lightbox vs plik lokalny** przed zamknięciem. Docelowo typ. **~300–600 KB** na full spread przy ~1500 px szer.; bez upscalingu. |
| 5 | **Skrypt** — `scripts/` (tsx): generacja thumb + opcjonalnie raport rozmiarów przed/po; narzędzie resize: **sharp** (propozycja z uzasadnieniem w meldunku, jeśli stała zależność) lub jednorazowo `sharp-cli` jak przy `-02`. |
| 6 | **Lightbox** — domyślnie bez zmian: `unoptimized` dla `/media/` (ostrość tekstu). WebP/AVIF przez `_next/image` w lightboxie **tylko** po świadomej decyzji i teście ostrości (poza domyślnym k5d). |
| 7 | **Domknięcie** — aktualizacja `docs/plan-claude-code.md` §5 (placeholdery albumu), Postęp w `10-finishing.md`. |

- **Kryterium:** definicja „gotowe” z `CLAUDE.md`; siatka nie pobiera full ~1 MB; lightbox czytelny jak plik lokalny; build + lint OK.

#### Wynik k5d (2026-10-04, K-138)

Decyzje właściciela przed startem (wartości domyślne z czatu): **(1)** `sharp` jako stała `devDependency` (`^0.35.5`, ta sama kopia co w Next — `npm ls sharp`: *deduped*), **(2)** okładka w tym samym batchu, **(3)** zdjęciowe rozkładówki → JPG q90, spis treści → PNG.

| Krok | Wynik |
| --- | --- |
| 1 — format | Wszystkie 19 plików z k5c to prawdziwe PNG (sygnatura `89504e47`). Kanał alfa obecny, ale w pełni nieprzezroczysty — zdejmowany (`removeAlpha`). |
| 2 — wymiary | `width`/`height` w MDX = piksele oryginałów (bez rozbieżności). |
| 3 — miniaturki | Regenerowane: szer. **800 px**, wysokość z proporcji skanu (436–440 px, ok. 1,83:1 — nie sztywne 2:1); wymiary identyczne z wpisami z k5c. Zdjęcia → JPG q82; spis → PNG z paletą. |
| 4 — kompresja | Rozkładówki 02–09 → **JPG q90, mozjpeg, chroma 4:4:4** (193–292 KB). Spis (01) → **PNG z paletą** (quality 90; 60 KB). Okładka → **JPG q90, 1600 × 1200** (z 2560 × 1920; okładka idzie przez `next/image`, maks. ok. 720 px CSS × 2 DPR). Bezstratny PNG nie mieścił się w celu (zdjęcia 540–1260 KB). |
| 4 — gate wizualny | Wycinki 1:1 oryginał / wynik (spis, rozkładówki 03 i 08 — złocenia, twarze, tekst): różnicy nie widać. |
| 5 — skrypt | `scripts/optimize-album-media.ts` — batch + raport przed/po. Uruchamiać na **oryginałach** (`npx tsx scripts/optimize-album-media.ts <folder z oryginałami>`); ponowne uruchomienie na wynikach ponownie kwantyzuje spis. |
| 6 — lightbox | Bez zmian: pełny plik z `/media/` (`unoptimized`). |
| 7 — dokumenty | `docs/plan-claude-code.md` (§3, K-138, §5, dziennik), `10-finishing.md`. |

**Rozmiary:** razem **16 138 KB → 2 539 KB**. Siatka (9 miniaturek): ok. 3,0 MB → **362 KB**. Okładka 5,5 MB → 428 KB. Pełne rozkładówki 0,4–1,5 MB → 60–292 KB.

`ikona-dzis.mdx`: `cover` → `cover.jpg` 1600 × 1200; `spread-02…09` i ich miniaturki `.png` → `.jpg`; `spread-01` zostaje `.png`.

**Pliki zastąpione:** `cover.png`, `spread-02…09.png`, `spread-02…09-thumb.png` (17 plików, ok. 13,6 MB) — **usunięte z `public/`** po OK właściciela (2026-10-04). Oryginały skanów zostają u właściciela; do ponownego batcha potrzebne poza `public/`.

**Do k8 (przegląd `alt`/caption z EJK):** `spread-08` — `alt` mówi „strony 166–167”, `caption` „Strony 146–147”; jedno z nich jest błędne.

## Ryzyka i pytania otwarte

- ~~**#8 liczba stron**~~ — 178 (gate k5a, 2026-10-04).
- ~~**#9 imię Dylewskiej**~~ — zamknięte (właściciel 2026-10-04): na stronie zostaje forma z noty wykładowcy („dr Magdalena Dylewska”), OK.
- **Model współdzielony** — AL3 jest addytywny, ale `author?` luzuje kontrakt; odnotować w §4 dla przyszłego projektu.
- JSON-LD `Book`/`Article` (k9) — `hasPart` może korzystać z `chapters`; nie w k5.

## Postęp

| Krok | Status | Uwagi |
| --- | --- | --- |
| k5a — model i dane | ✅ 2026-10-04 | gate K-122 OK; K-137; 178 stron; rozdział 6 bez pozycji; `getPublicationAuthorGroups` usuwany w k5b razem z sekcją |
| k5b — spis, porządki | ✅ 2026-10-04 | `PublicationTocList` (Server Component) + `PublicationTocItem`; po uwadze właściciela przywrócony wygląd kafli (pełna szerokość, złota krecha, „Czytaj na stronie” w prawej kolumnie) + nagłówki rozdziałów między grupami; wstęp jako kafel nad tytułem rozdziału 1; postnominal po nazwisku w kodzie (`formatLecturerDisplayName`, też etykiety wykładów) |
| k5c — skany | ✅ 2026-10-04 | **Zamknięty.** `cover.png` + `spread-01…09.png` od właściciela (folder `public/media/…`, nie czat); MDX z wymiarami (`readImageSizeFromFile`), thumb 800 px + pola w frontmatter; usunięte sample JPG i `coverScanNote`; siatka — kadr wg wymiarów thumb/full (`PublicationSpreadStrip`, `--publication-spread-aspect`); lightbox pełny PNG (`unoptimized`). `alt` / `caption` rozkładówek (placeholdery w MDX) → **k8**, wspólny przegląd zdjęć z EJK (decyzja właściciela 2026-10-04); nie blokuje **k5d**. |
| k5d — optymalizacja | ✅ 2026-10-04 | K-138; `scripts/optimize-album-media.ts` (`sharp` devDependency); JPG q90 dla zdjęć, PNG z paletą dla spisu, okładka 1600 px; 16,1 MB → 2,5 MB; siatka 362 KB; gate wizualny OK; 17 zastąpionych PNG usuniętych z `public/` (OK właściciela). **Kawałek 5 zamknięty.** |
