# Plan 10/RF — Poprawki po review (techniczne; wizualne dopisze V4)

Status: **zatwierdzony** 2026-10-04 (projekt R5; decyzje D1–D9 potwierdzone przez właściciela w wersji domyślnej) · następny: **RF-1** · paczki wizualne dopisze V4  
Gałąź: `feat/10-review` (RV-8; merge do `main` niezależnie od k8 na `feat/10-finishing`)  
Staging: https://academy-web-lovat.vercel.app/ — weryfikacja każdej paczki po deployu  
Makiety: tokeny `design/README`, odczyt wartości `docs/design-mockup-guide.md` — tylko w paczkach „po V1”  
Źródło: `docs/review/05-tech-synthesis.md` (pozycje S-01…S-34, uproszczenia A1–A5, decyzje D1–D9)

## Cel i zakres

Wdrożyć poprawki techniczne z bloku R (R1–R5) w paczkach, które da się zbudować, obejrzeć i cofnąć osobno. Wchodzi: wszystko z `05-tech-synthesis.md` §3 poza S-31 (D1 — edycja `CLAUDE.md` przez właściciela) i częściami przekazanymi do V1 / V4 / C1. Nie wchodzi: treść (`content/` tylko tam, gdzie paczka jawnie to zaznacza i po k8), SEO / OG / JSON-LD (k9), Lighthouse (k10), zmiany w `design/`, nowe zależności poza D2.

**Zasady dla każdej paczki:**

- jeden checkpoint = jedna paczka; meldunek wg `CLAUDE.md`; „OK” przed następną;
- paczka nie zmienia wyglądu, chyba że jej opis mówi inaczej („zmiana widoczna: …”); zrzuty 390 / 1440 przed i po dla tras z zakresu;
- przed każdą paczką `npm run build` + `npm run lint` jako punkt odniesienia; po — bez regresji;
- bez wartości arbitralnych Tailwind, bez tekstu UI w JSX, bez zmiany nazw pól w `src/content/types.ts` (`CLAUDE.md`);
- komunikat commita `10/RF-N: <short description>` (RV-8); w sesji cloud commit i push po „OK” (K-120).

## Decyzje podjęte w sesji planistycznej

Odpowiedzi z `05-tech-synthesis.md` §5 — **potwierdzone przez właściciela 2026-10-04 w wersji domyślnej** (wiążące dla paczek RF):

| ID | Decyzja (domyślna) | Paczka |
| --- | --- | --- |
| **D1** | Cień hero zostaje; wyjątek dopisany do `CLAUDE.md` przez właściciela; komentarz `globals.css:565` poprawiony w RF-10 | RF-10 (komentarz) |
| **D2** | `tsx`, `@types/mdx` → `devDependencies`; `@types/node` → `^22`; skrypty npm `content:index`, `check:states`, `check:media`, `check:content`; `prebuild` = **check** (nie generowanie) | RF-6, RF-3 |
| **D3** | A4 ograniczone do ról typograficznych i prozy, po V1; `globals.css` podzielony bez zmiany selektorów | RF-14 |
| **D4** | Minimalne `metadata.title` dla wszystkich tras teraz; OG / `description` w k9 | RF-8 |
| **D5** | Stan zapisów liczony z dat; kurs po 24.09 = „zamknięte” z istniejącym copy `kurs.closed`; `enrollmentOpen` tylko jako override „otwórz” | RF-2 |
| **D6** | `exampleSlugs` usunięte z loadera (MDX bez zmian); `MapEmbed` + `OnlineAside` → `MapBlock` | RF-7 |
| **D7** | `.publication-excerpt*` i `publications.originHeading` usunięte | RF-7 |
| **D8** | Filtr galerii: `history.replaceState` | RF-4 |
| **D9** | `existsSync` usunięte z renderu; `check:media` przy buildzie | RF-3 |

## Pliki i komponenty

Zbiorczo — szczegóły w paczkach.

| Obszar | Pliki | Paczki |
| --- | --- | --- |
| Dane | `src/content/*.ts`, `src/lib/isoDate.ts` (nowy), `src/lib/redirects.ts`, `src/config/` | RF-2, RF-3, RF-5, RF-7 |
| Nawigacja i powłoka | `src/navigation.ts`, `src/components/layout/SectionPageShell.tsx`, `src/components/navigation/*`, `src/app/**/page.tsx`, `not-found.tsx` | RF-1, RF-8 |
| Galeria i lightbox | `src/components/gallery/*`, `src/components/lightbox/*`, `src/components/home/FeaturedIconsGallery.tsx`, `src/app/ikony/page.tsx` | RF-4 |
| Wykłady | `src/components/content/SeasonAccordion.tsx`, `LectureList.tsx`, `src/components/lectures/*` | RF-9 |
| Style | `src/app/globals.css` (podział na pliki w RF-14), `mdx-components.tsx` | RF-1, RF-10, RF-13, RF-14 |
| Teksty UI | `src/i18n/pl.ts` | RF-2, RF-7, RF-11, RF-12 |
| Narzędzia | `package.json`, `knip.json` (nowy), `scripts/`, `archive/wp-fetch-static/` | RF-6 |
| Treść (po k8) | `content/pages/home.json`, `content/pages/workshops-hub.json` (nowe), `content/exhibition/page.mdx`, `content/settings.json` | RF-12 |

## Kolejność i zależności

```
RF-1 ─┐
RF-2 ─┼─ RF-3 ─ RF-4 ─ RF-5* ─ RF-6 ─ RF-7 ─ RF-8 ─ RF-9 ─ RF-10 ─ RF-11 ─ RF-12** ─ V1 ─ RF-13 ─ RF-14
      │
      └ * RF-5 po zamknięciu T-R1, T-R2 (dane wykładowców) — może przesunąć się za RF-6…RF-11
        ** RF-12 po k8 / merge feat/10-finishing (dotyka content/)
```

Najpierw bugi (RF-1, RF-2, RF-4) i paczki bez zmian wizualnych; RF-13 i RF-14 **po V1** (RV-7: pomiar przed wartościami docelowymi). RF-3 przed RF-4, bo walidacje przy buildzie wyłapią błędy wprowadzane w kolejnych refaktorach.

## Kawałki

### RF-1 — Dostępność: dialog menu, linki w tekście, landmarki, fokus

**Pozycje:** S-05, S-06, S-07, S-21 + R2-29 (z S-33). **Źródła:** R2-02, R2-09, R2-03, R2-04, R2-10, R4-15, R2-29; axe z R0 §3.6.  
**Zakres (pliki):** `src/components/navigation/HeaderMobileMenu.tsx`, `src/components/text/TocSidebar.tsx`, `TocCollapse.tsx`, `src/components/offers/OfferLeadExtra.tsx`, `src/components/exhibition/ExhibitionFactsPanel.tsx`, `ExhibitionToursSection.tsx` (tylko `aside.exhibition-cta-block`), `src/components/publications/PublicationMetricsBox.tsx`, `src/components/content/LecturerCard.tsx`, `src/app/globals.css` (reguła fokusu `:806–810` + usunięcie 14 reguł z R4-15), `src/components/home/Pillars.tsx`, `content/LecturerBio.tsx`, `gallery/galleryJustifiedShared.tsx` (klasy `focus-visible:*`).  
**Co:** pasek z × i szuflada w jednym kontenerze `role="dialog"` (pułapka obejmuje ×), `inert` na `main` i stopce przy otwartym menu; `aria-current="page"` w szufladzie, `"location"` w TOC; linki miejsc LSŚ przez `TextLink`; panele faktów w sekcjach jako `div`, nagłówek panelu wystawy `h3`; reguła fokusu rozszerzona o `summary`, `[tabindex]:not([tabindex="-1"])`; placeholder zdjęcia wykładowcy bez podwójnego odczytu.  
**Zmiana widoczna:** tylko obrys fokusu na `summary` (zgodny z `CLAUDE.md`); linki miejsc LSŚ zyskują kreskę (jak na `/ikony/wystawy`).  
**Gotowe:** axe (ten sam zestaw tagów co R0) na `/warsztaty/letnia-szkola-swiatla`, `/ikony/wystawy`, `/publikacje/ikona-dzis` → **0 naruszeń**; na 390 px: Tab po otwarciu menu dochodzi do × i nie wychodzi z dialogu, `Escape` zamyka, fokus wraca na przycisk; Tab na `/pracownia` (390) pokazuje złoty obrys na „Spis treści”; `grep -c 'focus-visible' src/app/globals.css` spada o 14.  
**Weryfikacja:** build + lint; staging 390 / 1440 (axe, klawiatura); zrzuty przed/po `/warsztaty/letnia-szkola-swiatla`, `/ikony/wystawy`.  
**Koszt:** S. **Commit:** `10/RF-1: fix mobile menu dialog, text links, landmarks and focus rules`

### RF-2 — Daty, sezon i stan zapisów (A1)

**Pozycje:** S-01, S-10, S-12, S-13. **Źródła:** R1-01, R2-05, R4-01, R1-07, R3-11, R1-08, R1-05, R1-06, R1-15, R1-21. **Decyzja:** D5.  
**Zakres (pliki):** nowy `src/lib/isoDate.ts`; `src/content/upcoming.ts`, `offers.ts`, `settings.ts`, `lectures.ts`, `exhibition.ts`, `news.ts` (konwencja „dzisiaj”), `src/lib/polishMonth.ts`, `formatDateRange.ts`, `src/lib/redirects.ts` + przeniesienie `docs/redirects.json` → `content/redirects.json` (albo `src/config/`); `src/components/content/FactsBox.tsx` (prop `enrollment: "open" | "closed"`, bez `"use client"`, kontakt jako linki); `src/i18n/pl.ts` (szablony `{date}`, `{season}` zamiast literałów dat; `phoneTel` zostaje do RF-12); `src/app/aktualnosci/[slug]/page.tsx`, `src/app/publikacje/[slug]/page.tsx` (`revalidate`, `dynamicParams`); `content/lectures/archive.json` **nie** — sezon jako stała eksportowana z `lectures.ts`, `exhibition.ts` ją importuje (bez dotykania `content/`).  
**Co:** `todayInWarsaw()` i porównania stringów `YYYY-MM-DD` wszędzie; `assertIsoDate`, `addDays` w jednym miejscu; `getEnrollmentState(offer, today)` w warstwie danych jako jedyne źródło (daty ISO; `enrollmentOpen: true` tylko wymusza „otwarte”, `false` nic nie zmienia — do opisania w komentarzu `types.ts`, bez zmiany nazwy pola); wernisaż bez jawnej daty → stan „termin wkrótce”, heurystyka z `note` tylko jako ostrzeżenie w `check:states`; jeden `CURRENT_SEASON_SLUG`; walidacja sezonu przez `getSeason()`; `pl.ts` bez dat sezonu literałem.  
**Zmiana widoczna:** `/warsztaty/kurs-roczny-i-trzyletni` pokazuje stan **zamknięty** (CTA „Zapytaj o miejsce mailem” + nota) — zgodnie z D5 i z „Najbliższe” na `/`.  
**Gotowe:** `/` i oferta kursu pokazują ten sam stan zapisów; `grep -n "2026" src/i18n/pl.ts` zwraca tylko `© {year}` / szablony; `npx tsx scripts/check-upcoming-states.ts` i `check-exhibition-states.ts` przechodzą; build pokazuje `/aktualnosci/[slug]` z `revalidate 1d`; `curl -I` nieznanego slugu daje 404 bez `X-Vercel-Cache: MISS` na funkcji (po deployu); jeden `CURRENT_SEASON_SLUG` w `src/`.  
**Weryfikacja:** build + lint; staging `/`, `/warsztaty/kurs-roczny-i-trzyletni`, `/ikony/wystawy`, jeden wpis `wydarzenie` na 390 / 1440.  
**Koszt:** M. **Commit:** `10/RF-2: single source for dates, season and enrollment state`

### RF-3 — Wymagana treść i walidacje przy buildzie

**Pozycje:** S-08, S-15, S-11. **Źródła:** R3-01, R2-08, R1-19, R1-09, R3-02 (½), R1-14, R1-17, R1-18, R4-21, R1-04. **Decyzje:** D2 (check w `prebuild`), D9.  
**Zakres (pliki):** `src/content/offers.ts` (`requireOffer(slug: OfferSlug)`), `pages.ts` (bez `| undefined`), `publications.ts`, `articles.ts`, `news.ts`, `exhibition.ts`, `icons.ts`, `src/content/validate.ts` (nowy: `assertMdxExports`, `assertNewsSlug`, `assertIconSlug`, `assertLecturerPairing`), `src/lib/redirects.ts` (asercje duplikatów / łańcuchów), `src/lib/mediaFileExists.ts` (usunięcie) + `ExhibitionPage.tsx`, `ExhibitionFrame.tsx`; trasy: `src/app/warsztaty/*/page.tsx`, `ikony/na-zamowienie/page.tsx`, `wyklady/page.tsx`, `o-akademii/page.tsx`, `pracownia/page.tsx`, `publikacje/[slug]/page.tsx` (`generateStaticParams` przez loadery); `src/components/publications/PublicationsHubPage.tsx` (bez `return null`); nowe skrypty `scripts/check-content.ts` (manifest ↔ frontmatter, rejestr publikacji) i `scripts/check-media.ts` (pliki z `content/` istnieją w `public/`); `package.json` tylko wpis `prebuild` (reszta w RF-6 — jeśli RF-6 idzie później, `prebuild` dopisać tam).  
**Co:** brak treści wymaganej przez trasę o stałym adresie = wyjątek przy imporcie (build pada), `notFound()` tylko w `[slug]`; wszystkie odsyłacze slugów walidowane jednym helperem; `OfferLeadExtraPlace` i `ExhibitionTravelingPlace` → jeden typ (nazwy pól bez zmian); konwencja `""` = „bez prelegenta” opisana w `types.ts`; `prebuild` uruchamia `check:content` + `check:media`.  
**Zmiana widoczna:** brak.  
**Gotowe:** tymczasowa zmiana nazwy `content/offers/wyklady.mdx` → build **pada** z czytelnym komunikatem (i wraca po przywróceniu); zły `newsSlug` w teście lokalnym → build pada; `npm run build` czysty na obecnych danych (w tym parowanie slugów — jeśli istniejące dane łamią regułę, zgłosić w meldunku, nie poprawiać `content/`); knip nie widzi `mediaFileExists`.  
**Weryfikacja:** build + lint; staging: `/ikony/wystawy` bez różnic w HTML poza kolejnością atrybutów.  
**Koszt:** M. **Commit:** `10/RF-3: fail the build on missing required content and invalid references`

### RF-4 — Galeria renderowana na serwerze i jeden lightbox (A3)

**Pozycje:** S-04, S-26. **Źródła:** R2-01, R2-19, R3-04, R2-17, R2-18, R2-23, R4-19 (etykiety lightboxa). **Decyzja:** D8.  
**Zakres (pliki):** `src/components/gallery/IconGrid.tsx`, `galleryJustifiedShared.tsx`, `ContentGalleryGrid.tsx`, `GalleryIconGrid.tsx`, `GalleryPage.tsx`, `GalleryFilters.tsx`, `Lightbox.tsx`, `src/components/lightbox/ContentLightbox.tsx`, `LightboxImage.tsx`, `lightboxUtils.ts`, nowy `useLightboxIndex.ts`, `src/components/text/WorkshopLightbox.tsx` (usunięcie), `src/components/home/FeaturedIconsGallery.tsx`, `src/components/news/NewsGallery.tsx`, `NewsArticleCover.tsx`, `src/components/publications/PublicationSpreadStrip.tsx`, `src/components/text/WorkshopGallerySection.tsx`, `src/components/exhibition/ExhibitionLightboxProvider.tsx`, `src/app/ikony/page.tsx` (bez `searchParams`), `src/i18n/pl.ts` (`pl.lightbox` wspólne; 3 zestawy → 1).  
**Co:** `JustifiedGrid` liczy rzędy na serwerze z proporcji zdjęć (`flex-grow`, wysokość rzędu z tokenu, liczba kafli w rzędzie wg progu szerokości CSS, nie JS); `IconGrid` jako adapter bez `variant`; pomiar w JS tylko jako dopracowanie po hydratacji (bez zmiany liczby rzędów); filtr `?temat=` w kliencie (`useSearchParams` w `Suspense`, `replaceState`), trasa statyczna; jeden `Lightbox` z `meta` / `labels`; `useLightboxIndex(count)`; wpis Aktualności z jednym dialogiem dla okładki i galerii; `onLoad`.  
**Zmiana widoczna:** układ rzędów może różnić się o pojedyncze kafle od wersji mierzonej w JS — do zaakceptowania w meldunku ze zrzutami; galeria widoczna bez JS.  
**Gotowe:** `curl -s staging/ikony | grep -c '<img'` ≥ 52; CLS (`PerformanceObserver`, jak w R2) **< 0,1** na 390 i 1440 dla `/ikony`, `/`, `/ikony/na-zamowienie`; build pokazuje `/ikony` jako ○ static; klik w chip nie wywołuje żądania RSC (Network); deep link `/ikony?temat=…` pokazuje przefiltrowaną siatkę po hydratacji bez „mignięcia” pełnej listy dłuższego niż jedna klatka (albo zaakceptowane w meldunku); jscpd: klony `GalleryIconGrid` ↔ `FeaturedIconsGallery`, `Lightbox` ↔ `ContentLightbox`, `NewsGallery` ↔ `PublicationSpreadStrip` / `WorkshopGallerySection` znikają; klawiatura w lightboxie (Esc, strzałki, powrót fokusu) bez regresji; iOS Safari ponownie (K-38) — właściciel.  
**Weryfikacja:** build + lint; staging 390 / 1440 / 1920 (K-30) dla `/ikony`, `/`, `/ikony/na-zamowienie`, wpis z galerią, `/publikacje/ikona-dzis`; zrzuty przed/po.  
**Koszt:** L. **Commit:** `10/RF-4: render justified galleries on the server and unify the lightbox`

### RF-5 — Wykładowcy: jeden rejestr i jedno pierwszeństwo

**Pozycje:** S-02, S-03. **Źródła:** R1-02, R1-03. **Warunek:** T-R1 i T-R2 zamknięte przez właściciela (dane w `content/`, na `feat/10-finishing` albo osobnym `chore/`) — inaczej build z tej paczki pada na `krzysztof-sokolowski` i 5 rozjechanych wpisach.  
**Zakres (pliki):** `src/content/lecturers.ts`, `lecturer-directory.ts`, `lectures.ts`, `upcoming.ts`, `authors.ts`; `src/content/types.ts` tylko komentarz.  
**Co:** `resolveLecturer(slug)` jako jedyna funkcja (pierwszeństwo: profil > katalog, bo profil jest nadzbiorem pól); walidacja przy imporcie: pola wspólne równe w obu plikach, slug w sezonach istnieje w rejestrze (błąd, nie fallback); `slugToDisplayName` usunięte. Docelowe scalenie plików w jeden rejestr = zmiana `content/` → osobny kawałek po k8, tu tylko kod.  
**Zmiana widoczna:** poprawne nazwiska i tytuły na `/wyklady/archiwum` (wynik danych z T-R1/T-R2).  
**Gotowe:** jedno miejsce czyta oba pliki; `grep -rn "getLecturerDirectoryEntry\|slugToDisplayName" src/` → tylko `lecturers.ts`; build pada przy slugu spoza rejestru (test lokalny na kopii).  
**Weryfikacja:** build + lint; staging `/wyklady`, `/wyklady/archiwum`, `/wyklady/wykladowcy`, `/` („Najbliższe”) — te same nazwiska wszędzie.  
**Koszt:** M. **Commit:** `10/RF-5: resolve lecturers through one function with build-time validation`

### RF-6 — `scripts/` i `package.json`

**Pozycje:** S-09 (+ B5). **Źródła:** R4-03, R1-09; knip z R0 §3.4. **Decyzja:** D2 (zgoda na `devDependencies` — `CLAUDE.md`).  
**Zakres (pliki):** `package.json` (`devDependencies`: `tsx`, `@types/mdx`, `@types/node ^22`; skrypty: `content:index`, `check:states`, `check:media`, `check:content`, `prebuild`; usunięcie `migrate:wp`), `package-lock.json`, nowy `knip.json` (`entry`: 5 skryptów; `ignoreDependencies: ["sharp"]`), usunięcie: `scripts/migrate-wp/`, `scripts/migrate-wp.ts`, `fetch-*` ×2, `generate-news-sample.ts`, `migrate-news-k122.ts`, `promote-*` ×4, `sync-*` ×2, `fix-plakaty-dimensions.ts`, `build-lecturers-from-archive.mjs`, `rebuild-redirects-json.ts`, `readImageSize.ts`, `scripts/*.json`, `archive/wp-fetch-static/`; `docs/plans/10-finishing.md` (B4 ✅, B5 ✅).  
**Co:** zostają `generate-news-index.ts`, `generate-publications-index.ts`, `check-upcoming-states.ts`, `check-exhibition-states.ts`, `optimize-album-media.ts` (K-138) + `check-content.ts`, `check-media.ts` z RF-3; nagłówek każdego z komentarzem „kiedy uruchamiać”. Historia jednorazowych skryptów zostaje w git (`docs/archive/migrate-report.md` już o tym mówi).  
**Zmiana widoczna:** brak.  
**Gotowe:** `npx knip` → 0 nieużywanych plików i 0 niezadeklarowanych zależności (pozostałe nieużywane eksporty `src/` zamyka RF-7); `npm run build` uruchamia `prebuild`; `npm ls tsx @types/mdx` pokazuje wersje przypięte.  
**Weryfikacja:** build + lint; `npx knip`; bez stagingu (brak zmian w `src/` poza skryptami).  
**Koszt:** S. **Commit:** `10/RF-6: keep only maintained scripts, declare tool deps and npm tasks`

### RF-7 — Warstwa danych: model, loadery, martwy kod, jeden plik = jeden komponent

**Pozycje:** S-27, S-14, S-25, S-24, S-34. **Źródła:** R1-10, R1-11, R1-16, R2-21, R1-12, R2-22, R4-17, R4-18, R3-06, R1-13, R2-13, R1-20; knip z R0. **Decyzje:** D6, D7.  
**Zakres (pliki):** `src/content/news.ts` (jedyny czytnik manifestu, typy z `Omit<News, "body">`, posortowana lista raz), `upcoming.ts`, `exhibition.ts`, `offers.ts` (bez `exampleSlugs`, typy `SemesterItem` / `StepItem` do `src/content`), `pages.ts`, `lectures.ts` ↔ `lecturers.ts` (przerwanie cyklu), `publications.ts`, `testimonials.ts`, `src/components/content/OfferContentContext.tsx` (usunięcie — mapa `components` w `OfferPage`), `SemesterProgram.tsx`, `StepList.tsx`, `src/components/exhibition/ExhibitionFactsPanel.tsx` (bez `"use client"`), `ExhibitionNowNext.tsx`, `ExhibitionToursSection.tsx` → `ExhibitionTravelingSection.tsx` + LF, `src/components/news/YearNav.tsx` (scalenie), `src/components/text/TextPageShell.tsx` → `TextPageSection.tsx`, `PersonProfile.tsx` (LF), `src/components/contact/MapBlock.tsx` (scalenie `MapEmbed` + `OnlineAside`), `ContactPage.tsx`, `src/components/navigation/Breadcrumb.tsx` (komentarz), usunięcie `src/components/PagePlaceholder.tsx`, `src/app/ikony/wystawa/`, `src/app/globals.css` (15 martwych klas, ok. 61 linii), `src/i18n/pl.ts` (21 kluczy; „zł” do `pl.ts`).  
**Co:** wg list z R1-12 / R2-22 / R4-17 / R4-18 (usunąć vs zdjąć `export`); fałszywe alarmy knip zostają (`toWarsawIsoDate`, `UPCOMING_SLOTS` — wejścia w `knip.json` z RF-6).  
**Zmiana widoczna:** brak (`MapBlock` renderuje to samo co dziś).  
**Gotowe:** `npx knip` → 0 nieużywanych eksportów i typów w `src/` (poza celowo eksportowanymi typami modelu `types.ts` — wpisać do `knip.json` `ignoreExportsUsedInFile` albo listę); `grep -rn '"use client"' src/components | wc -l` spada o ≥ 4 (FactsBox z RF-2, panel wystawy, kontekst + 2 komponenty MDX); 0 plików CRLF (`git ls-files --eol`); `madge`-podobne sprawdzenie cyklu zbędne — wystarczy, że `lecturers.ts` nie importuje `lectures.ts`; HTML tras z zakresu bez różnic poza whitespace.  
**Weryfikacja:** build + lint; knip; staging `/kontakt`, `/ikony/wystawy`, `/warsztaty/kurs-roczny-i-trzyletni`, `/aktualnosci` (390 / 1440) — zrzuty przed/po identyczne.  
**Koszt:** M. **Commit:** `10/RF-7: derive loader types from the model, drop dead code and split multi-component files`

### RF-8 — Nawigacja i powłoka z `resolveNav(path)` (A2)

**Pozycje:** S-19, S-20, S-32. **Źródła:** R2-12, R3-03, R3-08, R4-11, R4-12 (etykiety), R2-20, R3-05, R3-07, R3-09, R2-16 (slot), R3-10. **Decyzja:** D4.  
**Zakres (pliki):** `src/navigation.ts` (`resolveNav`, `navItem(href)`, `children` z `sectionNav`, „Publikacje” jako `NavLink`, `footerSitemapFlat` po `href`), `src/components/layout/SectionPageShell.tsx` (prop `path`, wariant `flush`, slot przy stopce), `src/components/navigation/Header.tsx`, `SectionNav.tsx`, `HeaderMobileMenu.tsx` (etykiety z `navigation.ts`; układ dolnego rzędu **bez zmian** — V4), nowy `NavUnderlineLink.tsx`, `TocLink.tsx`, `src/components/news/YearNavClient.tsx`, wszystkie `src/app/**/page.tsx` i `not-found.tsx` (przekazują `path`, `metadata.title` z jednego źródła, `metadata` nad komponentem), nowy `src/components/workshops/WorkshopsHubPage.tsx`, `src/components/content/OfferPage.tsx` (sam renderuje `OfferLeadExtra` / `OfferLeadIntro` / `OfferQuote` z danych), komponenty `*Page.tsx` (usunięcie propów `active` / `section` / `sectionActive` i wewnętrznych `max-w-content-max`), `src/components/offers/ReadyIconsNote.tsx` (slot zamiast `-mb-space-6`), `src/i18n/pl.ts` (`header.newsLink`, `publicationsLink`, `news.relatedDefaults` / `eventCta` etykiety → `navigation.ts`).  
**Co:** konwencja „trasa = dane + `path` + wymagana treść; `*Page` = widok z propsów”; `aria-current="page"` tylko przy `href === path`, inaczej `"true"`; tytuł dokumentu dla każdej trasy (z nawigacji albo danych, szablon `%s · Akademia Ikony` z `layout.tsx`).  
**Zmiana widoczna:** `<title>` kart przeglądarki; poza tym brak.  
**Gotowe:** `grep -rn "find(.*)!\.label" src/` → 0; `grep -rn "active=\|sectionActive=" src/app src/components` → 0; na stagingu `/warsztaty/kurs-roczny-i-trzyletni` dokładnie **jeden** `aria-current="page"` (w `SectionNav`), `/warsztaty` w nagłówku ma `aria-current="true"`; 19 tras z różnymi `<title>`; `/aktualnosci/[slug]` podkreśla Aktualności bez `pl.header.newsLink`; jscpd: klon kurs ↔ LSŚ `page.tsx` i `Header` ↔ `SectionNav` znikają; 404 i `/` renderują przez `SectionPageShell` (jeden `main#main-content` w kodzie).  
**Weryfikacja:** build + lint; staging — każda trasa 390 / 1440: zrzuty przed/po identyczne poza `<title>`; czytnik ekranu / inspekcja `aria-current` (wejście dla V4).  
**Koszt:** M. **Commit:** `10/RF-8: resolve navigation state from the route path and unify page shells`

### RF-9 — Akordeon archiwum renderowany na serwerze

**Pozycje:** S-16. **Źródła:** R2-07, R2-22 (`defaultExpandedSlug`), R4-18 (`lectures.placeholderMessage`).  
**Zakres (pliki):** `src/components/content/SeasonAccordion.tsx` (mały klient: `slug`, `label`, `cycleTitle`, `children`), `LectureList.tsx`, `src/components/lectures/LecturesArchivePage.tsx`, `src/content/lectures.ts` (gałąź `buildPlaceholderSeason` — usunąć, bo martwa od sezonu 2012), `src/i18n/pl.ts` (`lectures.placeholderMessage`).  
**Co:** panele renderowane na serwerze i podane jako `children`; przycisk sezonu w `h2` (APG); `#season-{slug}` nadal rozwija i przewija (K-139); prop `defaultExpandedSlug` usunięty.  
**Zmiana widoczna:** brak.  
**Gotowe:** `curl -s staging/wyklady/archiwum | wc -c` < 150 KB (dziś 331 KB), skrypty inline < 20 KB (dziś 107 KB); hierarchia nagłówków `h1 → h2 (sezon) → h3 (wykład)` bez przeskoków (axe `heading-order` po rozwinięciu — ręcznie); klawiatura: Enter / Space na sezonie, `aria-expanded` / `aria-controls` zachowane; link `/wyklady/archiwum#season-2019-2020` z wpisu Aktualności otwiera właściwy sezon.  
**Weryfikacja:** build + lint; staging 390 / 1440 `/wyklady/archiwum`, `/wyklady`; zrzuty przed/po (zamknięte i jeden rozwinięty sezon).  
**Koszt:** M. **Commit:** `10/RF-9: render season accordion panels on the server`

### RF-10 — Tokeny i CSS bez zmian wizualnych

**Pozycje:** S-28, S-22 (+ komentarz z D1). **Źródła:** R4-13, R4-16, R2-15, R4-14, R4-09 (komentarz); jscpd CSS z R0 §3.5.  
**Zakres (pliki):** `src/app/globals.css` (tabela 3 z `04-cross-cutting.md`: 14 tokenów `:root`, 29 mapowań `@theme`, duplikaty `leading-*` / `shadow-*`, aliasy o tej samej wartości; `.bleed` / `.rule-full` / `--hairline-cols`; nowe tokeny siatek `--grid-template-columns-season-head(-lg)`, `--grid-template-columns-step-row`; `.bleed-x-mobile`; `summary` marker w `base`; komentarze `:175–178`, `:497`, `:525–528`, `:565`), komponenty używające `.surface-*-bleed` / `.rule-*` (ok. 15), `src/components/content/OfferFigure.tsx`, `SeasonAccordion.tsx`, `StepList.tsx`, `src/components/text/TocCollapse.tsx`.  
**Co:** wg R4-13 / R4-16 / R4-14; przed scaleniem `leading-*` / `shadow-*` sprawdzić zachowanie Tailwind v4 (`@theme inline` vs `@theme`) na jednym tokenie.  
**Zmiana widoczna:** brak — kryterium twarde.  
**Gotowe:** `grep -rE '\-\[|\[&' src/` → 0; zrzuty 390 / 1440 wszystkich 19 tras przed/po **identyczne** (porównanie pikselowe albo diff wyliczonych stylów skryptem z R4); `npx jscpd src/app/globals.css` → ≤ 15 klonów (z 22; reszta to role typograficzne — RF-14); liczba tokenów `:root` i mapowań `@theme` spada odpowiednio o ≥ 14 i ≥ 29.  
**Weryfikacja:** build + lint; staging wszystkie trasy 390 / 1440 (skrypt porównujący wyliczone style, jak w R4).  
**Koszt:** M. **Commit:** `10/RF-10: remove unused tokens, unify bleed and rule utilities, replace arbitrary values`

### RF-11 — Teksty UI w komponentach i drobiazgi

**Pozycje:** S-23, S-33 (bez R2-23 → RF-4, R2-29 → RF-1). **Źródła:** R2-14, R2-24, R2-25, R2-26, R2-27, R2-28.  
**Zakres (pliki):** `src/components/publications/ArticleList.tsx` (etykieta z danych, nie parsowanie), `ArticleSourceBlock.tsx`, `PublicationsHubPage.tsx`, `src/components/exhibition/ExhibitionTravelingSection.tsx` (` i `), `src/components/content/SemesterProgram.tsx`, `OfferPage.tsx` (sekcja naboru warunkowo z danych), `src/i18n/pl.ts` (literały, formy liczebników), `src/components/news/NewsDateMeta.tsx`, komponenty z `useId` zamiast stałych `id` (lista R2-25), nowy `src/lib/scroll.ts`, nowy `src/components/core/icons.tsx` (lupa, chevron — glify z `design/README`), `src/components/text/AboutPage.tsx` (wymiary z danych, klucze), `PersonProfile.tsx`, `WorkshopPage.tsx`, `PrivacyPolicyPage.tsx`, `src/components/core/Button.tsx`, `FilterChip.tsx` (`href` wymagany).  
**Zmiana widoczna:** brak.  
**Gotowe:** `grep -rnE '"[A-ZŻŹĆŃÓŁĄŚĘ][a-ząęółśżźćń]+ ' src/components --include=*.tsx` bez trafień poza `pl.ts` (ręczna inspekcja listy); zmiana `pl.publications.sourceFromAlbum` nie psuje kursywy tytułu; jeden egzemplarz chevrona i lupy w kodzie; dwa `<OfferSideCta>` na jednej stronie testowej → różne `id`.  
**Weryfikacja:** build + lint; staging `/publikacje`, `/publikacje/cisza-ikony`, `/o-akademii`, oferty (390 / 1440) — zrzuty identyczne.  
**Koszt:** S. **Commit:** `10/RF-11: move UI strings to pl.ts, share scroll and icon helpers, tidy component details`

### RF-12 — Fakty z briefu §8 i treść redakcyjna poza `pl.ts` · **po k8**

**Pozycje:** S-17, S-18. **Źródła:** R2-06, R4-19, R4-02 (+ R3-07 karty huba). **Warunek:** po merge `feat/10-finishing` (k8) do `main` i `main` → `feat/10-review`, bo paczka tworzy pliki w `content/` i rusza `pl.ts` w kluczach, które k8 może redagować (T5, T22).  
**Zakres (pliki):** `src/content/settings.ts` (`getPhoneHref`, `getEnrollmentEmail`, `getSecretariatEmail` — wybór po stałym kluczu w `settings.json`; jeśli klucza brak, dodać **pole** do `settings.json` z wartością z briefu §8 — gate K-122 w meldunku), nowe `content/pages/home.json`, `content/pages/workshops-hub.json`, `content/exhibition/page.mdx` (copy `pl.exhibition.*` przeniesione 1:1 — T22 nadal otwarte), nowe loadery `src/content/home.ts`, `workshops-hub.ts` z walidacją obrazów (`width` / `height`), `src/components/home/*`, `src/components/workshops/WorkshopsHubPage.tsx` (karty z danych ofert — `[pole CMS]` → `[do uzupełnienia: …]` jeśli T-R3 otwarte), `src/components/exhibition/*`, `FactsBox.tsx`, `ContactPage.tsx`, `Footer.tsx`, `Header.tsx`, `ExhibitionPage.tsx`, `ArticleSourceBlock.tsx`, `PublicationMetricsBox.tsx`, `PublicationsHubPage.tsx` (e-mail / telefon przez `settings.ts`), `src/i18n/pl.ts` (treść redakcyjna wyjęta; `phoneTel` i 10 literałów numeru → szablon `{phone}`).  
**Co:** `pl.ts` = tylko stringi UI; `href` filarów z `navigation.ts`; rok w stopce z daty buildu.  
**Zmiana widoczna:** brak (ta sama treść z innego miejsca); `[pole CMS]` zamieniony na format `[do uzupełnienia: …]` z `CLAUDE.md`.  
**Gotowe:** `grep -c "601 734 705" src/i18n/pl.ts` → 0 (wyłącznie `settings.json`); `grep -n "akademiaikony@gmail.com\|sekretariat" src/` → tylko `settings.ts`; `pl.ts` bez pól `src` / `width` / `href`; HTML tras `/`, `/warsztaty`, `/ikony/wystawy` identyczny z stanem przed (poza `[pole CMS]`).  
**Weryfikacja:** build + lint; staging `/`, `/warsztaty`, `/ikony/wystawy`, `/kontakt`, stopka (390 / 1440); zrzuty przed/po.  
**Koszt:** M. **Commit:** `10/RF-12: read site facts from settings and move editorial copy out of pl.ts`

### RF-13 — Skala odstępów sekcji (A5) · **po V1**

**Pozycje:** S-30 (+ `cta-band` z S-20). **Źródła:** R4-04, R4-05, R4-08, R4-10, R2-16 (teaser). **Warunek:** V1 zakończone, wartości docelowe (`--section-gap` desktop / mobile, próg, wariant „ciasny”, `--accent-bar`) ustalone z właścicielem i wpisane tu przed startem.  
**Zakres (pliki):** `src/app/globals.css` (tokeny ról: `--section-gap`, `--section-gap-tight`, `--accent-bar`; zastąpienie `exhibition-section-gap`, `publication-section-gap(-m)`, `news-article-sec`, `news-year-group-gap`, `lectures-archive-section-pt`; 7 literałów `3px` / `2px`; tokeny komponentów przez `var(--space-*)`, interlinie przez `--leading-*`, miary przez `--measure-*` — lista z R4-10 po filtrze V1), nowy `src/components/layout/PageSection.tsx` (albo klasa `.page-section`), komponenty sekcji na `/`, ofertach (`mt-space-8`), `/polityka-prywatnosci`, `GalleryOrderTeaser.tsx` (`cta-band`), `OfferQuoteGrid.tsx`.  
**Zmiana widoczna:** **tak, zamierzona** — odstępy sekcji wyrównane do jednej skali; każda różnica względem zrzutów „przed” musi odpowiadać tabeli wartości z V1.  
**Gotowe:** tabela 1 z `04-cross-cutting.md` zmierzona ponownie skryptem z V1: ≤ 2 wartości odstępu sekcji per szerokość (standard + ciasny) na wszystkich trasach; `grep -c "3px\|2px" src/app/globals.css` dla belek → 0 (tylko token); `--publication-section-gap` używany na desktopie; `--section-gap` bez przeskoku na 1024 (jeden próg z resztą).  
**Weryfikacja:** build + lint; staging wszystkie trasy 390 / 1440 / 1920; porównanie z V1 i makietami (`docs/design-mockup-guide.md`); właściciel jako arbiter (RV-6).  
**Koszt:** M. **Commit:** `10/RF-13: one section spacing scale and accent bar token`

### RF-14 — Role typograficzne i proza — jeden system (A4) · **po V1**

**Pozycje:** S-29. **Źródła:** R2-11, R4-06, R4-07, R4-20; jscpd CSS (klony ról). **Decyzja:** D3. **Warunek:** V1 wskazało, które rozjazdy typografii są widoczne; RF-10 i RF-13 zrobione.  
**Zakres (pliki):** nowy `src/components/core/PageHeading.tsx` (`level: "page" | "section" | "sub"`), nowy `src/components/core/Prose.tsx` (warianty `text` / `offer` / `news`) albo klasy `.prose-*`, `mdx-components.tsx` (bez odstępów i typografii na blokach; `MdxImage` usunięty albo z wymaganymi wymiarami), `src/components/news/newsMdxComponents.tsx` (scalenie z globalnym), `src/app/globals.css` → `src/app/styles/{tokens,base,utilities,news,publications,exhibition,text-pages,offers,…}.css` z `@import` (bez zmiany selektorów), usunięcie klas ról per strona (`.about-hero-title`, `.publication-page-title`, `.publication-article-title`, `.news-article-title`, `.workshop-section-heading`, `.privacy-policy-section-heading`, `.publication-section-heading`, `.about-person-heading`), 17 plików TSX z ciągiem klas H2 (21×) i 8 z H1; `CLAUDE.md` (zasada: klasa semantyczna i narzędzie nie ustawiają tej samej właściwości na tym samym elemencie — propozycja do właściciela).  
**Zmiana widoczna:** tylko tam, gdzie V1 potwierdziło rozjazd (np. akapity 20 / 14 / 40 px → jedna wartość na wariant); reszta identyczna.  
**Gotowe:** jedno miejsce definiuje każdą rolę (`grep -c "text-size-h2" src/components` → tylko `PageHeading`); akapit MDX na `/publikacje/cisza-ikony`, ofercie i `/pracownia` ma ten sam odstęp w obrębie wariantu; `npx jscpd src/app/styles` → ≤ 5 klonów; `globals.css` < 800 linii (reszta w plikach per dziedzina); V1 ponowione dla typografii = 0 odstępstw od wzorca poza K-130 (wpis).  
**Weryfikacja:** build + lint; staging wszystkie trasy 390 / 1440 / 1920; zrzuty przed/po; właściciel jako arbiter.  
**Koszt:** L. **Commit:** `10/RF-14: one set of typographic roles and a single prose system`

### — Paczki wizualne (RF-15…) — dopisze V4 —

## Dane sample dodawane w tym etapie

Brak. RF-12 tworzy `content/pages/home.json` i `workshops-hub.json` **z treści już opublikowanej** w `pl.ts` (nie `sample`); każda zmiana treści przy okazji → gate K-122, nie ta paczka.

## Kryteria ukończenia (część techniczna)

- [ ] RF-1 … RF-11 wdrożone na stagingu; każda z zielonym build + lint i meldunkiem;
- [ ] axe na 21 trasach × 2 szerokości (jak R0) → 0 naruszeń;
- [ ] CLS `/ikony` < 0,1 (390 i 1440); `/ikony` statyczna w buildzie;
- [ ] `npx knip` z `knip.json` → czysto; `npx jscpd src` → klony TSX = 0, CSS ≤ 15 (do RF-14: ≤ 5);
- [ ] `grep -rE '\-\[|\[&' src/` → 0; `find(…)!.label` → 0; `"use client"` tylko tam, gdzie jest interakcja;
- [ ] RF-12 po k8; RF-13 i RF-14 po V1 (zapis wartości docelowych w tym pliku przed startem);
- [ ] `docs/plans/10-review.md` Postęp i `10-finishing.md` backlog (B4, B5) zaktualizowane; decyzje D1–D9 z odpowiedziami właściciela przepisane do `docs/plan-claude-code.md` §4 przy zamknięciu bloku R.

## Ryzyka i pytania otwarte

- **Przecięcie z k8 na `content/`** — RF-12 czeka na merge k8; RF-5 czeka na T-R1 / T-R2. Jeśli k8 się przeciąga, RF-5 można zrobić z walidacją jako **ostrzeżeniem** (konsola przy buildzie) i podnieść do błędu po danych — do decyzji przy meldunku RF-4.
- **RF-4 zmienia liczbę kafli w rzędzie** względem pomiaru JS — ryzyko wizualne; zrzuty 390 / 1440 / 1920 w meldunku, właściciel akceptuje.
- **Zachowanie Tailwind v4 przy scalaniu `leading-*` / `shadow-*`** (RF-10) — komentarz w `globals.css` mówi o „self-collision”; sprawdzić na jednym tokenie przed hurtową zmianą; w razie problemu zostawić duplikat z komentarzem i zgłosić.
- **`prebuild` na Vercel** — `check:content` czyta `content/**/*.mdx` przez `tsx`; sprawdzić czas (budżet < 10 s) i że `tsx` z `devDependencies` jest instalowane w buildzie (Vercel instaluje dev deps domyślnie).
- **`dynamicParams = false` + `revalidate`** (RF-2) — nowy wpis bez rebuildu daje 404 do następnego deployu; dziś i tak wymaga deployu (`manifest.json` w repo), więc bez zmiany praktyki — odnotować w B9 / runbooku etapu 11.
- **Bias modelu (RV-6)** — paczki RF implementuje ta sama rodzina modeli, która pisała kod i review; właściciel ogląda każdą paczkę na stagingu, a V1 mierzy po RF-1…RF-11, nie przed.

## Postęp

| Paczka | Status | Uwagi z checkpointu |
| --- | --- | --- |
| RF-1 — a11y: dialog, linki, landmarki, fokus | ⬜ | |
| RF-2 — daty, sezon, stan zapisów (A1) | ⬜ | D5 |
| RF-3 — wymagana treść, walidacje, `prebuild` check | ⬜ | D2, D9 |
| RF-4 — galeria na serwerze, jeden lightbox (A3) | ⬜ | D8 |
| RF-5 — wykładowcy: jeden rejestr | ⬜ | po T-R1, T-R2 |
| RF-6 — `scripts/`, `package.json`, `knip.json` | ⬜ | D2; zamyka B5 |
| RF-7 — model, loadery, martwy kod, pliki | ⬜ | D6, D7 |
| RF-8 — nawigacja i powłoka (A2), tytuły | ⬜ | D4 |
| RF-9 — akordeon archiwum | ⬜ | |
| RF-10 — tokeny i CSS bez zmian wizualnych | ⬜ | D1 (komentarz) |
| RF-11 — teksty UI, drobiazgi | ⬜ | |
| RF-12 — fakty §8 i treść poza `pl.ts` | ⬜ | **po k8** |
| RF-13 — skala odstępów (A5) | ⬜ | **po V1** |
| RF-14 — role typograficzne i proza (A4) | ⬜ | **po V1**, D3 |
