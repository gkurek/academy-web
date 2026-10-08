# Review 10/R — R0: zakres, wyłączenia, punkt odniesienia, dane twarde

Data: 2026-10-04 (§1.1 uzupełnione 2026-10-08 względem `docs/plan-claude-code.md` §5) · gałąź `feat/10-review` (HEAD `681ac1f`, różnica do `main` = wyłącznie `docs/`) · model: Opus 5.5  
Plan: `docs/plans/10-review.md`. Ten plik **niczego nie ocenia** — zbiera wyłączenia i surowe wyniki narzędzi jako wejście dla R1–R5 i V1–V4. Pozycje §5 oznaczone ✅ **nie** są tu wyłączeniami — tylko otwarte ⬜.

---

## 1. Znane i wyłączone (nie zgłaszamy w R1–R4, V1–V4)

Zgłoszenie, które pokrywa się z pozycją poniżej, pomijamy. Jeśli review znajdzie **nowy aspekt** tej samej pozycji (np. bug w kodzie, który ją obsługuje, a nie brak treści) — zgłaszamy z odsyłaczem do numeru.

### 1.1 Backlog treści T1–T29 (`docs/plan-claude-code.md` §5, gate EJK, k8)

| Grupa | Pozycje | Co wyłączone |
| --- | --- | --- |
| Brakujące / robocze `alt`, `caption` | T14, T29 | puste lub placeholderowe `alt`/`caption` (T24 ✅ 2026-10-07) |
| `[do uzupełnienia]` i copy do redakcji | T25 | fragmenty albumu, opcjonalne sekcje (T5, T22, T28 ✅ w k8) |
| Placeholdery zdjęć | T6, T19, T21 | kadry `/ikony/wystawy` i zdjęcia dorocznych (T19), zajawka i hero „Na zamówienie” (T6), relacje doroczne (T21) |
| Dane galerii | T1 | brak/niezweryfikowane wymiary (T2–T4 ✅ 2026-10-07) |
| Powiązania wpis ↔ strona | T10, T23 | miejsca LSŚ i wystawy wyjazdowe bez relacji (tekst bez linku); T20 ✅ (K-150) |
| Fakty i treść do potwierdzenia | T13, T15, T26 | program A3, formuły cykliczne, lista tekstów (T7–T9 ✅ w k8) |

### 1.1a Po v1 — T30 (`docs/plan-claude-code.md` §5A)

| Grupa | Pozycje | Co wyłączone |
| --- | --- | --- |
| Inwentarz lightbox inline | T30 | pojedyncze zdjęcia w MDX niepodpięte pod lightbox — świadomie v2, nie gate k8 |

### 1.2 Backlog fali 2 B1–B10 (`docs/plans/10-finishing.md`)

| # | Pozycja | Status w review |
| --- | --- | --- |
| B1 | CTA „Zapisy” w nagłówku desktop (K-35) | wyłączone — k9, decyzja z analityką |
| B2 | JSON-LD `Book.hasPart` z `chapters` | wyłączone — k9 (SEO poza zakresem review) |
| B3 | `ExhibitionEvent` dla `/ikony/wystawy` | wyłączone — k9 |
| B4 | arbitralne wartości Tailwind w `mdx-components.tsx` | **znane** — nie zgłaszamy ponownie; rozstrzygnięcie w `10-review-fixes.md` (RV-1) |
| B5 | martwy kod `scripts/migrate-wp/` | **znane** — j.w.; knip potwierdza (§3.4) |
| B6 | `imageLarge` w `IconWork` (K-39) | wyłączone — tylko po Lighthouse (k10) |
| B7 | sticky `FactsBox` (K-37) | wyłączone — po prezentacji |
| B8 | filtr Aktualności po wystawach | wyłączone — po prezentacji |
| B9 | dobowy rebuild / ISR na hostingu | wyłączone — etap 11 |
| B10 | `design/README` bez makiety 13a/14a, nieaktualne tokeny stopki | wyłączone — poza repo kodu (`design/`) |

### 1.3 Celowe decyzje K-xx (`docs/plan-claude-code.md` §4) — nie są odstępstwami

| Decyzja | Czego nie zgłaszamy jako błąd |
| --- | --- |
| `CLAUDE.md` | zaokrąglenia i cienie **tylko** w `Lightbox`; foldery tras po polsku; enumy `kind` po polsku |
| K-30 | skok `--content-max` 1180 → 1280 px od 1600 px okna; tekst ciągły węższy niż siatki (`--measure-lead` / `--measure-prose`) |
| K-32 / K-37 | brak sticky `FactsBox` i CTA po scrollu na ofertach |
| K-35 | brak CTA „Zapisy” w nagłówku |
| K-42 | siatka galerii — sam tytuł; autor/wymiary/technika dopiero w lightboxie; „do weryfikacji” przy wymiarach |
| K-48 | `SectionNav` O Akademii · Pracownia |
| K-50 | brak trasy `/wydarzenia`, wydarzenia jako wpisy `NewsCard` z `kind` |
| K-69 / K-73 | Aktualności jako jeden strumień; wyróżniony wpis poza listą lat, ręczna flaga |
| K-76 | `/publikacje` bez `SectionNav` i zakładek; brak sekcji publikacji na `/` |
| K-78 | brak stron plakatów i multimediów; film nieosadzany |
| K-85 / K-136 | `revalidate = 86400` na `/` i `/ikony/wystawy`; stan liczony z dat |
| K-87 / K-127 | układ `/ikony/wystawy` (13a + 14a): miasta wyjazdowe w zdaniu, kadry 3:2 / 4:3, ekspozycja 60/40 |
| K-126 | miejsca LSŚ — sama nazwa, link tylko przy `newsSlug` |
| K-130–K-134 | szablon wpisu Aktualności: tokeny `--prose-*` tylko tam, siatka `--entry-*`, **brak breadcrumb na `/aktualnosci/[slug]`** (D-a), meta → H1 → lead, CTA tylko w zapowiedzi `wydarzenie` |
| K-132 | zdjęcia wpisu domyślnie tylko w galerii pod tekstem |
| K-135 | wzorzec `.link-underline-target` (kreska na wewnętrznym spanie, tap na zewnętrznym) |
| K-137 / K-138 | spis albumu wg rozdziałów; lightbox albumu — pełny plik `unoptimized`; `sharp` jako stała `devDependency` |
| K-139 | link sezonu z `News.lectureSeason` wyliczany w kodzie |
| D-02 / K-41 | galeria: dwie sekcje (EJK pierwsza), bez filtra autora |

### 1.4 Poza zakresem review (z planu)

SEO, metadata OG, JSON-LD, analityka (k9); Lighthouse jako raport DoD (k10); zmiany w `design/` i `content/`.

---

## 2. Punkt odniesienia

### 2.1 Staging

| Pozycja | Wartość |
| --- | --- |
| URL | https://academy-web-lovat.vercel.app/ |
| Deploy produkcyjny Vercel | `bb7b0cb` (merge PR #14), 2026-10-04 18:17 UTC, stan `success` (GitHub Deployments API) |
| HEAD `feat/10-review` | `681ac1f` = `bb7b0cb` + zmiany wyłącznie w `docs/` |
| Weryfikacja treścią | staging zawiera zmiany z `054a73f` (k7f): LSŚ „Powiadom mnie o naborze” i „byliśmy m.in. w:” obecne, stary nagłówek „Gdzie byliśmy” i linki „Wyznacz trasę” na `/kontakt` nieobecne |
| Wniosek | **staging = bieżący kod `src/` i `content/`** — V1–V4 mogą pracować na stagingu |

### 2.2 Trasy (brief §3) pogrupowane w szablony

| Szablon | Trasy | Uwagi z buildu |
| --- | --- | --- |
| Strona główna | `/` | statyczna, `revalidate` 1 d |
| Huby sekcji | `/warsztaty`, `/wyklady` | `/wyklady` = hub + bieżący sezon |
| Ofertowe | `/warsztaty/kurs-roczny-i-trzyletni`, `/warsztaty/letnia-szkola-swiatla`, `/ikony/na-zamowienie` | `FactsBox` w nagłówku |
| Listy | `/aktualnosci`, `/wyklady/archiwum`, `/wyklady/wykladowcy`, `/publikacje` | — |
| Szczegóły | `/aktualnosci/[slug]` (69 ścieżek SSG), `/publikacje/[slug]` (album `ikona-dzis` + 4 artykuły) | wpis bez breadcrumb (K-134) |
| Galerie | `/ikony`, `/ikony/wystawy` | `/ikony` **dynamiczna (ƒ)** w buildzie; `/ikony/wystawy` `revalidate` 1 d |
| Statyczne | `/o-akademii`, `/pracownia`, `/kontakt`, `/polityka-prywatnosci` | `/kontakt` z `iframe` mapy |
| Systemowe | 404 (`not-found.tsx`), `/ikony/wystawa` → `redirect("/ikony/wystawy")` | `/ikony/wystawa` nie jest w briefie §3 (stara trasa, K-90) |

Brief §3 wymienia `/ikony/[slug]` („opcjonalnie w v1”) — **trasa nie istnieje** w `src/app/`. Odnotowane bez oceny.

Reprezentanci tras dynamicznych użyci w axe: `/aktualnosci/nabor-kursu-2026-2027` (zapowiedź), `/aktualnosci/ikona-korzenie-i-owoce-wiary-mistyka-dzis-wyklady-2026-2027` (wykłady), `/publikacje/ikona-dzis` (album), `/publikacje/cisza-ikony` (artykuł).

### 2.3 Szerokości

**390** (mobile) · **1440** (desktop, treść 1068 px) · **≥ 1600** — sprawdzać na **1600** i **1920** (treść 1168 px), bo od 1600 px `--content-max` = 1280 px (K-30, `src/app/globals.css:1245`).

---

## 3. Dane twarde (surowe, bez oceny)

Wszystkie narzędzia uruchomione 2026-10-04 lokalnie na `681ac1f`; `knip` i `jscpd` jednorazowo przez `npx` bez zmian w `package.json` (RV-3).

### 3.1 `npx tsc --noEmit`

Exit 0, brak błędów.

### 3.2 `npm run lint`

Exit 0, brak błędów i ostrzeżeń.

### 3.3 `npm run build`

Exit 0, Next.js 16.3.4 (Turbopack), 94 strony statyczne, brak ostrzeżeń w logu.

| Trasa | Tryb | Revalidate |
| --- | --- | --- |
| `/`, `/ikony/wystawy` | ○ static | 1 d |
| `/ikony` | **ƒ dynamic** (renderowana na żądanie) | — |
| `/aktualnosci/[slug]` (69), `/publikacje/[slug]` (5) | ● SSG | — |
| pozostałe trasy z §2.2, `/ikony/wystawa`, `/_not-found` | ○ static | — |

### 3.4 `npx knip` (bez konfiguracji, ustawienia domyślne)

Exit 1. Liczby: **20** nieużywanych plików, **1** nieużywana devDependency, **4** niezadeklarowane zależności, **37** nieużywanych eksportów, **20** nieużywanych eksportowanych typów.

- **Nieużywane pliki:** 19 skryptów w `scripts/` (uruchamiane ręcznie przez `tsx`, więc knip nie widzi punktu wejścia — m.in. `check-upcoming-states.ts`, `check-exhibition-states.ts`, `optimize-album-media.ts`, `rebuild-redirects-json.ts`, `generate-*-index.ts`, `promote-*-from-sample.ts`, `sync-*.ts/.mjs`) oraz **`src/components/PagePlaceholder.tsx`**.
- **Nieużywana devDependency:** `sharp` (K-138 — celowo stała; używana przez skrypt ręczny).
- **Niezadeklarowane:** `mdx/types` w `mdx-components.tsx`, `src/components/news/newsMdxComponents.tsx`, `src/content/news.ts`, `src/content/offers.ts` (typy z pakietu `@types/mdx`, obecnego tylko tranzytywnie).
- **Nieużywane eksporty — `scripts/migrate-wp/`** (7; pokrywa B5): `stripCacheUrl`, `extractListItems`, `resolveLecturerSlug`, `REPORT_PATH`, `WP_API_BASE`, `fetchWpPostBySlug`, `WYKLADY_CATEGORY_ID`.
- **Nieużywane eksporty — `src/`** (30):
  - komponenty: `MapBlock` (`src/components/contact/MapBlock.tsx:79`);
  - galeria: 9 stałych `JUSTIFIED_*` w `src/components/gallery/galleryJustifiedShared.tsx:8–17`;
  - lightbox / news UI: `getLightboxImageRatio` (`lightboxUtils.ts:14`), `focusNewsYearCardTitle` (`focusNewsYearCardTitle.ts:19`);
  - `src/content/*`: `getArticleBySlug` (articles:31), `getAnnualExhibitions`, `getAnnualExhibitionByNewsSlug`, `getAnnualIconCountLabel`, `getAnnualOpenPeriodLabel` (exhibition:132–274), `FEATURED_ICON_SLUGS`, `ICON_THEMES`, `getIconWorksBySlugs` (icons:5–44), `formatLecturerTitles` (lecturers:37), `formatLecturerLabel`, `getLectureEventData` (lectures:113, 316), `formatNewsListDate`, `formatNewsDate`, `isNewsEventEnded` (news:263–383), `getOffers` (offers:107), `UPCOMING_SLOTS`, `toWarsawIsoDate`, `resolveUpcomingSlot` (upcoming:17–377).
- **Nieużywane eksportowane typy** (20): `ParsedLecture` (migrate-wp), `MapBlockProps`, `ExhibitionFrameAspect`, `TravelingPlaceItem`, `ContentGalleryGridCaptionMode`, `JustifiedTile`, `LightboxLayoutVariant`, `BreadcrumbItem`, `ExhibitionNowNextSection`, `LectureTalk`, `OfferFrontmatter`, `UpcomingSource`; w `src/content/types.ts`: `Page`, `News`, `PersonWork`, `TextPageData`, `InterviewExchange`, `InterviewPart`, `ExhibitionTravelingPlace`, `PublicationChapter`.

Uwaga do interpretacji (dla R1–R4): knip zgłasza **eksport** nieużywany poza plikiem — symbol może być używany wewnątrz własnego modułu; skrypty `scripts/` wymagają osobnej weryfikacji (wejścia ręczne); typy w `types.ts` to model współdzielony (CLAUDE.md: nie zmieniać nazw pól).

### 3.5 `npx jscpd src` (ustawienia domyślne)

**29** klonów, **267** zduplikowanych linii (**1,51 %**) w 165 plikach.

| Format | Pliki | Linie | Klony | Zduplikowane linie |
| --- | --- | --- | --- | --- |
| css | 1 (`globals.css`, 4839 linii) | 4839 | 22 | 176 (3,64 %) |
| tsx | 129 | 8439 | 6 | 84 (1,00 %) |
| ts | 35 | 4437 | 1 | 7 (0,16 %) |

Klony w TS/TSX (pełna lista):

| Fragment A | Fragment B | Linie |
| --- | --- | --- |
| `src/app/warsztaty/kurs-roczny-i-trzyletni/page.tsx:26–38` | `src/app/warsztaty/letnia-szkola-swiatla/page.tsx:29–41` | 13 |
| `src/components/gallery/GalleryIconGrid.tsx:52–69` | `src/components/home/FeaturedIconsGallery.tsx:30–47` | 18 |
| `src/components/gallery/Lightbox.tsx:66–76` | `src/components/lightbox/ContentLightbox.tsx:63–73` | 11 |
| `src/components/navigation/Header.tsx:27–36` | `src/components/navigation/SectionNav.tsx:19–28` | 10 |
| `src/components/news/NewsGallery.tsx:138–153` | `src/components/publications/PublicationSpreadStrip.tsx:24–39` | 16 |
| `src/components/news/NewsGallery.tsx:138–153` | `src/components/text/WorkshopGallerySection.tsx:20–35` | 16 |
| `src/content/offers.ts:129–135` | `src/content/settings.ts:6–12` | 7 |

Klony w `src/app/globals.css` (22, pary linii): 974↔989, 1006↔1024, 1006↔1042, 1006↔1060, 1290↔3973, 1369↔1799, 1406↔4162, 1406↔4658, 1436↔1766, 1639↔1824, 1831↔2049, 1932↔1945, 2121↔2138, 2258↔2377, 2328↔2339, 2788↔3067, 3711↔4141, 3809↔4027, 4163↔4659, 4177↔4242, 4302↔4550, 4549↔4710 (każdy 6–10 linii).

### 3.6 axe-core na stagingu

Metoda: axe-core 4.10.2 (cdnjs) wstrzyknięty w ramkę tej samej domeny o szerokości 1440 i 390 px, wysokość 900 px; tagi `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`; 21 tras × 2 szerokości = 42 przebiegi, wszystkie załadowane (sprawdzone `location` i `innerWidth` ramki). Stany interaktywne (menu mobilne otwarte, lightbox, rozwinięte akordeony) **nie** były testowane.

**Naruszenia (violations)** — wyniki identyczne na 1440 i 390:

| Trasa | Reguła | Wpływ | Węzły | Cel |
| --- | --- | --- | --- | --- |
| `/warsztaty/letnia-szkola-swiatla` | `link-in-text-block` | serious | 3 | `.text-link.no-underline.text-accent-text` (linki miejsc w leadzie, K-126) |
| `/ikony/wystawy` | `landmark-complementary-is-top-level` | moderate | 3 | dwa `aside[aria-labelledby]`, `.exhibition-cta-block` |
| `/ikony/wystawy` | `landmark-unique` | moderate | 1 | `aside[aria-labelledby]` |
| `/publikacje/ikona-dzis` | `landmark-complementary-is-top-level` | moderate | 1 | `aside` |

Pozostałe 18 tras: **0 naruszeń**.

**Do ręcznej weryfikacji (incomplete):**

| Reguła | Gdzie | Węzły | Powód axe |
| --- | --- | --- | --- |
| `color-contrast` | każda trasa | 31 (390) / 33 (1440) bazowo | `pseudoContent` — tło nieustalone przez pseudoelement; bazowe węzły to stopka (`.text-size-footer-brand`, podtytuł, adres, `mailto:`, `tel:`) |
| `color-contrast` | `/o-akademii` +7, `/ikony/wystawy` +8, `/ikony/na-zamowienie` +3, `/ikony` (390) +3, `/aktualnosci` (390) +10 | ponad bazę | węzły ponad stopkę — niesklasyfikowane w R0 |
| `link-in-text-block` | `/ikony/na-zamowienie` | 1 | `.text-link.no-underline[href="mailto:akademiaikony@gmail.com"]` |
| `link-in-text-block` | `/ikony/wystawy` | 4 | — |
| `frame-tested` | `/kontakt` | 1 | `iframe` mapy Google (cross-origin, axe nie wchodzi do środka) |

---

## 4. Wejście dla kolejnych faz (bez oceny)

- R1 (dane): eksporty z `src/content/*` z §3.4; klon `offers.ts` ↔ `settings.ts`.
- R2 (komponenty): `PagePlaceholder.tsx`, `MapBlock`, stałe `JUSTIFIED_*`, klony TSX z §3.5; landmarki `aside` z §3.6.
- R3 (trasy): klon kurs ↔ LSŚ `page.tsx`; `/ikony` dynamiczna; `/ikony/wystawa`; brak `/ikony/[slug]`.
- R4 (przekrojowe): `globals.css` (4839 linii, 22 klony CSS); `mdx/types` niezadeklarowane; `scripts/` w knip; B4, B5.
- V1–V4: `color-contrast` incomplete i `link-in-text-block` z §3.6 — do pomiaru ręcznego.
