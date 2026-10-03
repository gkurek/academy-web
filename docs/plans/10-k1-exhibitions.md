# Plan 10 / kawałek 1 — `/ikony/wystawy` (K-127)

Status: **zatwierdzony** 2026-10-03  
Etap: `docs/plans/10-finishing.md` (kawałek 1, zadania W0–W5)  
Gałąź: `feat/10-finishing`  
Makieta: `design/Akademia Ikony - Wystawy warianty.dc.html` — **13a** (1440 / 1920) + **14a** (390). Odczyt wartości: `docs/design-mockup-guide.md` (lokalny serwer, nie `file://`). **Odstępstwa od makiety (produkt):** korekty **K1–K4** poniżej — m.in. **K4:** kadry `wide` na mobile w kolumnie treści (nie edge-to-edge jak w opisie 14a).

## Cel

Przebudowa `/ikony/wystawy` do układu K-127 na placeholderach zamiast zdjęć, z uproszczeniem modelu wystaw (P4 Tura B: R1, R2, R7, R8) i naprawą kotwic w Aktualnościach. **Nie wchodzi:** wybór zdjęć z EJK, redakcja copy z EJK, nowe wpisy news (R5, R6, R9) — kawałek 8.

## Decyzje sesji planistycznej (2026-10-03)

| # | Decyzja |
| --- | --- |
| **D1** | Sekcja **„Wystawy wyjazdowe”**, kotwica **`#wyjazdowe`** (K-127; „Wystawy specjalne” z raportu migracji odrzucone na k1). Miasta z **ręcznej listy** `travelingPlaces: { place, newsSlug? }[]` we frontmatterze `content/exhibition/page.mdx` (wzorzec K-126), wszystkie z makiety, w jej kolejności: **Święta Lipka** → `miedzynarodowe-warsztaty-oraz-wystawa-ikon-z-pracowni-akademii-ikony-w-swietej-lipce-19-27-sierpnia-2017`; **Wilno** → `wystawa-ikon-w-wilnie`; **Supraśl** — bez linku; **Świdnica** → `wystawa-ikon-w-swidnicy-czynna-w-dniach-4-07-25-08-2014-zapraszamy`; **Tbilisi** — bez linku. Kryterium listy nie wynika z `News.venue`. **Otwarte z EJK:** zakres „wyjazdowe / gościnne” (`10-finishing.md` § Ryzyka). |
| **D2** | Kafle dorocznej czytają **`AnnualExhibition.photos`** (wybór kuratorowany, dosłownie K-127). Zdjęcia relacji w news to osobny zbiór — nie duplikat (R2 zamknięte tą interpretacją). Punkt 4 Tury B („zdjęcia z news”) odrzucony. |
| **D3** | Kotwice `#wystawa-{rok}` znikają (K-89). Link powrotny w `NewsArticlePage` → **`/ikony/wystawy#doroczna`**. Z 7 wpisów `content/news/*.mdx` **usuwamy zdanie** „Więcej o wystawie doroczej {rok} na stronie Wystawy ikon” (gate K-122). `#wyjazdowe` w `ikona-okno-ku-wiecznosci-2.mdx` zostaje (kotwica istnieje). `#oprowadzania` zostaje (cel 301). |
| **D4** | **Na całej stronie same placeholdery, zero zdjęć** — kadr **wide** pod hero i zamykający (desktop **21:8**, mobile **3:2**, D8); 4 kafle doroczne **4:3**; ekspozycja codzienna — **dwa** kadry (K3). Opisy w `pl.ts` (np. `· 21:8` = kadr docelowy na desktopie). Kafle-placeholdery **nie są przyciskami**; lightbox gdy `photos[]`. |
| **D5** | `PermanentExhibition`: **usunięte** `interiorPhotos`; opcjonalne `heroImage?`, `permanentImage?`, **`permanentImage2?`**, `closingImage?` + `travelingPlaces` (D1). `AnnualExhibition`: **usunięte** `summary` (R8). Brief §4 aktualizowany. |
| **D6** | Copy: **lead pod H1 — z makiety**; **tekst wystawy dorocznej — z makiety** (3 akapity + link „Fotorelacje…”), fragmenty zależne od roku z danych (niżej); **ekspozycja codzienna — bez zmian**, 4 akapity z `content/exhibition/body.mdx`. Redakcja z EJK — kawałek 8. |
| **D7** | **Oprowadzania** i **Wystawy wyjazdowe** — copy w całości z makiety (łącznie z „dobieramy ikony do wnętrza i pomagamy je zawiesić” i „Każdy wyjazd ma swoją relację w Aktualnościach”); redakcja z EJK — kawałek 8. Zdanie z miastami składane z `travelingPlaces`. |
| **D8** | `FactsBox` ekspozycji **bez wiersza „Oprowadzania”**; wiersz **„Gdzie” w obu** ramkach, wartość **`pl.exhibition.facts.whereValue`** („Kościół Środowisk Twórczych w Warszawie” — odstępstwo od pełnego adresu w `settings.json`). Na mobile (< `md`) kadry **`aspect="wide"` (hero + zamykający)** → **3:2** w UI (`--exhibition-aspect-standard`), **w kolumnie treści** (margines jak reszta strony — **K4**, nie full-bleed z 14a). Kolejność na mobile jak 14a (doroczna: tekst → `FactsBox` → kafle; ekspozycja: tekst → `FactsBox` → kadry). Ramka doroczna: przycisk **„Program i terminy wykładów”** → `/wyklady`. Ekspozycja codzienna: **bez** linku „Dojazd i kontakt” w `FactsBox`. |

### Korekty układu po zamknięciu k1 (sesja 2026-10-03, implementacja)

| # | Zmiana |
| --- | --- |
| **K1** | Wystawa doroczna — pierwszy akapit copy: jeden `<p>`; hasło tematu wykładów z **`getLectureSeasonShortTheme(seasonSlug)`** (`LectureSeason.cycleTitle`, sufiks po „. ” gdy jest); copy bez „tytułu wystawy”. Blok **Teraz / Następnie** i kafel na `/` — nadal `AnnualExhibition.title` z `annual.json` (bez zmiany w tej sesji). |
| **K2** | Kafle doroczne: **4:3** (`--exhibition-aspect-tile`), nie 1:1. |
| **K3** | Ekspozycja codzienna: siatka **`exhibition-permanent-layout`** — wiersz 1: `FactsBox` \| eyebrow + H2 + akapity (`body.mdx`); wiersz 2: **dwa** kadry na pełną szerokość (**60% / 40%**, `3fr`/`2fr`), lewy **2:1** (`tilePairLead`) żeby wyrównać dół z prawym **4:3**; mobile: tekst → `FactsBox` → kadry **jeden pod drugim** (oba 4:3). Model: `permanentImage?`, **`permanentImage2?`**. |
| **K4** | Kadry **`wide`** (hero + zamykający): **bez full-bleed** na mobile — ten sam margines boczny co reszta strony (`SectionPageShell`). Odstępy między akapitami ekspozycji codziennej = jak w sekcji dorocznej (`exhibition-section-copy + …`). |

### Teksty zależne od roku (D6, K-85)

| Fragment makiety | Źródło |
| --- | --- |
| Zdanie o temacie przewodnim wykładów w pierwszym akapicie dorocznej | `getLectureSeasonShortTheme` dla sezonu ostatniej zakończonej / bieżąj dorocznej; rok w tekście = rok wystawy (`getAnnualExhibitionYear`) |
| „odbywa się co roku od 2013” | najmniejszy rok w `annual.json` |
| „kolejną otworzymy w czerwcu 2027” | `resolveAnnualVernissage(latest)` → miesiąc + rok; brak daty → `[do uzupełnienia: termin wernisażu]` |
| Blok „Teraz w kościele / Następnie” | stan z dat (K-85): **przed wernisażem** — Teraz: ekspozycja codzienna „{title ekspozycji}”, do połowy czerwca {rok}; Następnie: Wystawa doroczna {rok}, wernisaż {data}. **W trakcie** — Teraz: Wystawa doroczna {rok} „{title}”, do {dateEnd}; Następnie: ekspozycja codzienna od września. Linki do `#doroczna` / `#ekspozycja`. |
| „Wystawa 2026 · 10 zdjęć – zobacz wszystkie” | najnowsza `AnnualExhibition` z niepustym `photos` (rok + liczba); przy braku zdjęć podpis się nie renderuje |

## Pliki

| Plik | Zmiana | Co |
| --- | --- | --- |
| `src/content/types.ts` | zmiana | D5 |
| `content/exhibition/page.mdx` | zmiana | bez `interiorPhotos`; `travelingPlaces`; kadry puste |
| `content/exhibition/annual.json` | zmiana | bez `summary` |
| `src/content/exhibition.ts` | zmiana | walidacja `travelingPlaces[].newsSlug`; helpery stanu „Teraz/Następnie”, pierwszego roku, ostatniej zakończonej, najnowszej ze zdjęciami; usunięcie `getExhibitionArchiveBlock` i martwych helperów |
| `src/content/news.ts` | zmiana | usunięcie `getTravelingExhibitions` + typu (pole `News.venue` zostaje) |
| `src/components/exhibition/ExhibitionPage.tsx` | przebudowa | układ K-127; K4 — bez bleed wrapperów na wide |
| `src/components/exhibition/ExhibitionFrame.tsx` | nowy | `wide` / `standard` / `tile` / `tilePairLead`; `wide` → 3:2 mobile, 21:8 od `md` (hero + closing w kolumnie treści, bez full-bleed) |
| `src/content/lectures.ts` | zmiana | `getLectureSeasonShortTheme` (copy dorocznej) |
| `src/components/exhibition/ExhibitionAnnualTiles.tsx` | nowy (Client) | rząd 4 kafli; placeholdery lub przyciski → lightbox (`ExhibitionLightboxProvider`) + podpis |
| `src/components/exhibition/ExhibitionHashScroll.tsx` | nowy | płynny scroll do kotwic TOC (1.3) |
| `src/components/exhibition/ExhibitionNowNext.tsx` | nowy | blok „Teraz w kościele / Następnie” |
| `ExhibitionFactsPanel.tsx` | zmiana lub usunięcie | W3; jeśli wspólny `FactsBox` pasuje — zastąpić i usunąć duplikat |
| `ExhibitionToursSection.tsx` | zmiana | pas oprowadzań; sekcja wyjazdowa ze zdaniem z miastami |
| `ExhibitionPageNav.tsx` | zmiana | kolejność: doroczna → ekspozycja → oprowadzania → wyjazdowe |
| `ExhibitionPreviousSection.tsx`, `ExhibitionPhotoGrid.tsx`, `ExhibitionPhotoPlaceholder.tsx` | usunięcie | R1; zastąpione przez `ExhibitionFrame` / `ExhibitionAnnualTiles` (jeśli nic innego ich nie używa) |
| `src/app/globals.css` | zmiana | usunięcie `.exhibition-previous-*` i martwych klas; `exhibition-permanent-layout`, kafle; K4 — odstępy akapitów ekspozycji, brak `.exhibition-frame-bleed` |
| `src/i18n/pl.ts` | zmiana | `exhibition.*` — copy z makiety (D6, D7), opisy placeholderów, etykieta „W skrócie”, usunięcie `previous` i martwych kluczy |
| `src/components/news/NewsArticlePage.tsx` | zmiana | link → `#doroczna` (D3) |
| `content/news/*.mdx` (7) | zmiana — **gate** | usunięcie zdania „Więcej o…” (D3) |
| `content/news/manifest.json` | regeneracja | `scripts/generate-news-index.ts` |
| `docs/brief-claude-code.md`, `docs/plan-claude-code.md`, `docs/plans/10-finishing.md` | zmiana | krok 1.4 |

Wpisy z D3: `dnia-17-lipca-wspomnienie-sw-andrieja-rublowa`, `ikona-dzis-3`, `wystawa-ikon-w-kosciele-srodowisk-tworczych-warszawa-plac-teatralny-20`, `wystawa-ikona-dzis`, `wystawa-ikona-korzenie-i-owoce-wiary-2018`, `wystawa-madrosc-boza-2026`, `wystawa-piekno-boga-piekno-czlowieka-2025`.

## Kroki (meldunek po każdym, wg `CLAUDE.md`)

### 1.1 — Model i warstwa treści
Typy (D5), `page.mdx`, `annual.json`, `exhibition.ts`, `news.ts`; walidacje przy buildzie; brief §4. Strona może przejściowo renderować stary układ z minimalnymi poprawkami kompilacji.  
**Gotowe:** build + lint OK; walidacja odrzuca nieznany `newsSlug` w `travelingPlaces`.

### 1.2 — Układ strony
`ExhibitionPage` wg K-127: hero (eyebrow, H1, lead, `ExhibitionNowNext`) → `ExhibitionPageNav` → kadr wide → **Wystawa doroczna** (eyebrow sekcji, tekst \| `FactsBox`; kafle 4:3) → **Ekspozycja codzienna** (K3: `FactsBox` \| tekst; rząd 2× kadr 60/40) → **Oprowadzania** → **Wystawy wyjazdowe** → kadr zamykający wide → „Zacznij tutaj”. W3: „W skrócie” w `ExhibitionFactsPanel`.  
**Gotowe:** 390 / 1440 / 1920 (D4, D8, **K1–K4**); klawiatura; a11y `h2`; kotwice; lightbox kafli; K4 — wide w kolumnie treści na mobile, odstępy akapitów ekspozycji jak w dorocznej. Regresja `/` → k3 **A6**.

### 1.3 — Aktualności (R7)
`NewsArticlePage` → `#doroczna`; **diff 7 wpisów w czacie → OK → zapis**; regeneracja `manifest.json`; `rg "/ikony/wystawy#" src content docs/redirects.json` — tylko istniejące kotwice (`doroczna`, `ekspozycja`, `oprowadzania`, `wyjazdowe`). Płynny scroll do kotwic na `/ikony/wystawy` (`ExhibitionHashScroll`, `prefers-reduced-motion` → natychmiast).  
**Gotowe:** build + lint OK; wpis doroczny (np. 2018) pokazuje działający link powrotny; hash z nawigacji strony i z wpisów przewija płynnie (desktop).

### 1.4 — Dokumentacja
- `docs/plan-claude-code.md` §4: **K-87** — lista ręczna `travelingPlaces` (D1); **K-127** — aneks D2, D4–D8; **K-103** → `#doroczna`; dziennik.
- §5 — nowe wiersze: placeholdery kadrów i kafli (`page.mdx`, `annual.json`); copy z makiety do redakcji z EJK (`pl.ts` `exhibition`); Supraśl i Tbilisi bez relacji.
- `docs/brief-claude-code.md` §3 (trasa, kotwice), §4 (model), §5 redirectów (bez `#wystawa-{rok}`).
- `docs/plans/10-finishing.md` — postęp k1 ✅, odhaczenie W0–W5 (W1: R3–R4 → gate k8); korekty **K1–K4** i odstępstwo od 14a (K4) w §3 etap 10.
**Gotowe:** zsynchronizowano z kodem k1 (2026-10-03), w tym **K4** (2026-10-03).

## Kryterium „gotowe” kawałka 1

`npm run build` i `npm run lint` OK; układ zgodny z K-127 na 390 / 1440 / ≥ 1600 (K-30) z odstępstwami D4, D8 i korektami **K1–K4** (w tym margines wide na mobile, nie full-bleed 14a); brak zdublowanych `h2`; zero linków do nieistniejących kotwic `/ikony/wystawy#…`; brak tekstu redakcyjnego w JSX; §5 uzupełniony.

## Ryzyka

- **Brak tokenów** dla proporcji 21:8 / 3:2 / 1:1 lub stylu placeholdera — zgłoszę w meldunku 1.2 zamiast wartości arbitralnych.
- **Wspólny `FactsBox`** może nie pasować do wariantu ekspozycji (zygzak) — wtedy zostaje `ExhibitionFactsPanel` z uzasadnieniem.
- **Kafel 3 „Najbliższe” na stronie głównej** (`getExhibitionUpcomingHighlight`) — regresja w **kawałku 3** (**A6**), nie blokuje zamknięcia 1.2.

## Postęp

| Krok | Status | Uwagi |
| --- | --- | --- |
| 1.1 — model i treść | ✅ | typy D5, `travelingPlaces`, helpery, brief §4 |
| 1.2 — układ | ✅ | K-127, W0–W4, **K1–K4**; regresja `/` → k3 A6 |
| 1.3 — aktualności (R7) | ✅ | W5, `ExhibitionHashScroll`, gate 7 wpisów OK |
| 1.4 — dokumentacja | ✅ | §4/§5, brief, §3 (K4 vs 14a); **K1–K4** (2026-10-03) |
