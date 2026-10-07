# Review 10/R — R5: synteza techniczna

Data: 2026-10-04 · gałąź `feat/10-review` (HEAD `0aba37f`) · model: Fable 5.1 · świeża sesja (RV-5)  
Wejście: `00-scope.md` (wyłączenia §1, narzędzia §3), `01-data.md` (21), `02-components.md` (29), `03-routes.md` (11), `04-cross-cutting.md` (21) — **82 zgłoszenia**, plus sekcje „Punkty przekazane” i „Do weryfikacji” każdej fazy.  
Metoda: scalenie i deduplikacja po wspólnej przyczynie w kodzie; wyrywkowa weryfikacja w kodzie twierdzeń, od których zależy scalenie (lista w §2); bez `docs/archive/` (RV-6).  
Wynik: **34 scalone pozycje** (S-01…S-34), 5 uproszczeń architektonicznych (A1–A5), 9 decyzji właściciela (D1–D9), 6 pozycji do backlogu treści T. Projekt paczek poprawek: `docs/archive/plans/10-review-fixes.md`.

Review **niczego nie poprawia** — ten plik ustala priorytety i podział na paczki.

---

## 1. Podsumowanie

| Źródło | Zgłoszeń | Po scaleniu |
| --- | --- | --- |
| R1 — dane | 21 | w 13 pozycjach S |
| R2 — komponenty | 29 | w 19 pozycjach S |
| R3 — trasy | 11 | w 7 pozycjach S (R3-02 skorygowane) |
| R4 — przekrojowe | 21 | w 14 pozycjach S |
| R0 — narzędzia | knip 37 eksportów, jscpd 29 klonów, axe 4 naruszenia | knip → S-25; jscpd TSX → S-04, S-19, S-20, S-26; jscpd CSS → S-28, S-29; axe → S-06, S-07 |
| **Razem** | **82** | **34** (6 bug · 12 ryzyko · 12 niespójność/upraszczanie · 2 decyzja · 2 drobiazg) |

Priorytet w kolejności: bugi → ryzyka → upraszczanie → drobiazgi. W obrębie klasy — najpierw pozycje widoczne na stagingu, potem uśpione.

Koszt scalonej pozycji: S (≤ pół dnia), M (1–2 dni), L (> 2 dni albo wymaga decyzji kierunkowej). Koszt paczki RF w `10-review-fixes.md` sumuje pozycje.

---

## 2. Korekty i ustalenia R5

Sprawdzone w kodzie na `0aba37f` przed scaleniem:

| Co | Wynik | Skutek |
| --- | --- | --- |
| **R3-02** (kolizje slugów album ↔ artykuł) | Korekta R4 potwierdzona: `validatePublicationSlugCollisions(...)` w `src/content/publications.ts:32–35` przerywa build. | Pierwsza połowa R3-02 **nie zachodzi**. Zostaje druga: `src/app/publikacje/[slug]/page.tsx` czyta `articleModules` z pominięciem `getArticles()` → scalone w S-08. |
| **B4** (wartości arbitralne w `mdx-components.tsx`) | `grep -E '\-\[|\[&' mdx-components.tsx` → 0 trafień. | **B4 rozwiązane**, bez nowego ID. Do odhaczenia w `10-finishing.md` (backlog fali 2). |
| Wartości arbitralne w `src/` | 4 pliki, 5 wystąpień: `TocCollapse.tsx:73`, `StepList.tsx:34`, `OfferFigure.tsx:18`, `SeasonAccordion.tsx:122` ×2 — zgodnie z R2-15 + R4-14. | S-22 kompletne. |
| **R1-16** cykl `lectures` ↔ `lecturers` | `lectures.ts:18` importuje z `lecturers.ts`; `lecturers.ts:3` importuje `getTotalSeasonCount` z `lectures.ts`. | Potwierdzone; S-14. |
| **R1-01 / R2-05** | `types.ts:51` `enrollmentOpen: boolean`; `FactsBox.tsx:73, 76, 146` czyta wyłącznie to pole; `FactsBox.tsx:1` `"use client"` przy jedynym hooku `useId`. Copy dla stanu zamkniętego kursu **istnieje** (`pl.factsBox.ctaByKind.kurs.closed`: „Zapytaj o miejsce mailem”, „Nabór na ten sezon jest zamknięty…”). | S-01; decyzja D5 nie wymaga nowego copy. |
| **R2-02** | `HeaderMobileMenu.tsx:181–191` przycisk w pasku, `:195–201` `role="dialog" aria-modal` tylko na szufladzie. | Potwierdzone; S-05. |
| **R1-05** | `CURRENT_SEASON_SLUG = "2026-2027"` w `lectures.ts:21` i `exhibition.ts:20`. | Potwierdzone; S-13. |
| **R1-07 / R3-11** | `revalidate` tylko w `src/app/page.tsx:11` i `ikony/wystawy/page.tsx:7`; `dynamicParams` — 0 wystąpień. | Potwierdzone; S-10. |
| **R4-03** | `package.json`: brak `tsx`, `@types/mdx`; `@types/node ^20`; `migrate:wp` jako jedyny skrypt poza Next; `archive/wp-fetch-static/` — 20 plików śledzonych w git. | Potwierdzone; S-09. |
| **R4-09** | `Hero.tsx:45` ma `shadow-hero-image-m md:shadow-hero-image`. Katalog `design/` jest w `.gitignore` (`/design`), więc cytowane przez R4 wiersze `design/README.md:58` i `:153` **nie są weryfikowalne w checkoucie** — pochodzą z lokalnej kopii właściciela. | D1 zostaje decyzją właściciela; rozbieżność między §„Zasady” a §3 README do potwierdzenia przez właściciela (pytanie, nie domysł). |
| **R3 „bez zgłoszenia”** — `/ikony/[slug]` | Decyzja zakresowa, brief §3 „opcjonalnie w v1”. | Zostaje w C1, nie w RF. |

Żadne zgłoszenie z R1–R4 nie okazało się błędne poza już skorygowanym R3-02. Nie dodaję nowych zgłoszeń.

---

## 3. Scalone pozycje

Legenda kolumn: **Klasa** = waga po scaleniu; **Źródła** = ID z R1–R4 (+ R0 tam, gdzie narzędzie wskazało); **Zależy od** = pozycja, która musi być wcześniej albo decyzja D-x; **RF** = paczka w `10-review-fixes.md`.

### 3.1 Bugi

| ID | Klasa | Pozycja | Źródła | Koszt | Zależy od | RF |
| --- | --- | --- | --- | --- | --- | --- |
| **S-01** | bug | **Stan zapisów liczony z dat, jedno źródło faktów sezonu.** FactsBox czyta ręczne `enrollmentOpen`, „Najbliższe” liczy z ISO — na stagingu kurs „otwarty” po 24.09; te same daty i sezon wpisane literałem w `pl.ts` (po 5 wystąpień w HTML). Kierunek: funkcja `getEnrollmentState(offer, today)` w warstwie danych, `FactsBox` dostaje gotowy stan, `enrollmentOpen` najwyżej jako override; `pl.ts` z szablonami `{date}` / `{season}` wypełnianymi z `content/`; `FactsBox` bez `"use client"`; wiersz kontaktu „Na zamówienie” jako `mailto:` / `tel:`. | R1-01, R2-05, R4-01 | M | D5; razem z S-13 (A1) | RF-2 |
| **S-02** | bug | **Dwa rejestry wykładowców, trzy kolejności pierwszeństwa** (Szymuła / Szymula na stagingu). Kierunek: jedna funkcja `resolveLecturer(slug)` z jednym pierwszeństwem + walidacja równości pól wspólnych przy buildzie; docelowo jeden rejestr. Poprawka 5 rozjechanych wpisów = treść → T-R2. | R1-02 | M | T-R2 (dane) | RF-5 |
| **S-03** | bug | **Cichy fallback slugu wykładowcy** gubi polskie znaki („Krzysztof Sokolowski”). Kierunek: nieznany slug = błąd buildu; brakujący wpis = treść → T-R1. | R1-03 | S | T-R1 (dane) | RF-5 |
| **S-04** | bug | **Galeria „justified” renderowana dopiero w kliencie** (0 `<img>` w SSR, CLS 0,22 / 0,33 na `/ikony`, pusta bez JS) + martwy wariant `preview`, zdublowany podpis kafla, 9 eksportów `JUSTIFIED_*` + `/ikony` jedyną trasą dynamiczną przez `searchParams` (`no-store`, RSC przy każdym filtrze). Kierunek (A3): jeden `JustifiedGrid` liczący rzędy na serwerze (`flex-grow` = proporcja, jak `NewsGallery`), `IconGrid` jako adapter; filtr w kliencie na danych ze strony (`useSearchParams` w `Suspense`, `history.replaceState`), trasa statyczna. | R2-01, R2-19, R3-04; R0 jscpd `GalleryIconGrid` ↔ `FeaturedIconsGallery` | L | D8 (historia filtra) | RF-4 |
| **S-05** | bug | **Przycisk × menu mobilnego poza `aria-modal`** (klawiaturą nieosiągalny, `main` bez `inert`) + aktywna pozycja w szufladzie i TOC tylko kolorem. Kierunek: pasek i szuflada w jednym kontenerze dialogu albo bez `aria-modal` z × w cyklu Tab; `inert` na treści; `aria-current="page"` w menu, `"location"` w TOC. | R2-02, R2-09 | S | — | RF-1 |
| **S-06** | bug | **Linki miejsc LSŚ bez `TextLink`** — jedyne naruszenie axe `serious` (3 węzły). Kierunek: `TextLink`; jeden komponent listy miejsc dla LSŚ i wystaw (wspólny typ z S-15). | R2-03; R0 axe `link-in-text-block` | S | — | RF-1 |

### 3.2 Ryzyka

| ID | Klasa | Pozycja | Źródła | Koszt | Zależy od | RF |
| --- | --- | --- | --- | --- | --- | --- |
| **S-07** | ryzyko | **Panele faktów jako `aside` w regionach** — 3 naruszenia axe `moderate` (`/ikony/wystawy`, `/publikacje/ikona-dzis`); nagłówek panelu wystawy to `<p>`. Kierunek: `div` zamiast `aside` wewnątrz `section`, nagłówek `h3`. Bez zmian wizualnych. | R2-04; R0 axe `landmark-*` | S | — | RF-1 |
| **S-08** | ryzyko | **Brak treści wymaganej przez trasę = cichy 404 albo pusta strona** (oferty ze stałym slugiem, `/wyklady`, hub publikacji `null`, martwe gałęzie `notFound()` po `getAboutPage` / `getWorkshopPage`) + **manifest i rejestr wpisów generowane ręcznym skryptem poza buildem** + trasa publikacji czyta `articleModules` z pominięciem `getArticles()`. Kierunek: `requireOffer(slug: OfferSlug)` i analogi rzucające przy buildzie; `notFound()` tylko w `[slug]`; `| undefined` zdjęte; check manifest ↔ frontmatter (gdzie — D2); `generateStaticParams` przez loadery. | R3-01, R2-08, R1-19, R1-09, R3-02 (druga połowa) | M | D2 (gdzie ma być check) | RF-3 |
| **S-09** | ryzyko | **`scripts/` miesza narzędzia stałe z jednorazowymi migracjami nadpisującymi treść**; `tsx` niezadeklarowane; `@types/mdx` tranzytywnie; `@types/node ^20` przy Node 22; brak skryptów npm dla generatorów i kontroli; knip bez konfiguracji (19 fałszywych „martwych plików”). Kierunek: zostaje 5 skryptów (`generate-news-index`, `generate-publications-index`, `check-upcoming-states`, `check-exhibition-states`, `optimize-album-media`), reszta usunięta razem z B5; `knip.json`; `devDependencies` i skrypty npm — D2. | R4-03, B5; R0 knip §3.4 | S | D2 | RF-6 |
| **S-10** | ryzyko | **`/aktualnosci/[slug]` liczy fazę `wydarzenie` z daty buildu bez `revalidate`**; obie trasy `[slug]` bez `dynamicParams = false` (nieznany slug = render na żądanie). Kierunek: `export const revalidate = 86400` literałem z odsyłaczem do K-85; `dynamicParams = false`. Dopisać trasę do listy B9 (etap 11). | R1-07, R3-11 | S | — | RF-2 |
| **S-11** | ryzyko | **`existsSync` w renderze trasy ISR** (`/ikony/wystawy`) — na Vercel `public/` nie musi być w FS funkcji; po T19 zdjęcia mogą znikać po rewalidacji. Kierunek: zaufać danym i usunąć sprawdzanie, istnienie plików sprawdzać skryptem kontrolnym przy buildzie — D9. | R1-04 | M | D9 | RF-3 |
| **S-12** | ryzyko | **Data wernisażu zgadywana** z `note` wykładu albo ostatniego wykładu sezonu; `dateEnd` domyślnie `RRRR-08-31`. Kierunek: bez jawnej daty — stan „termin wkrótce”, heurystyka tylko jako walidacja ostrzegająca. | R1-08 | S | — | RF-2 |
| **S-13** | ryzyko | **Sezon w czterech miejscach, trzy konwencje „dzisiaj”, trzy mechanizmy nazw miesięcy, walidator ISO ×2, konfiguracja w `docs/`.** Kierunek (A1): `src/lib/isoDate.ts` (`assertIsoDate`, `addDays`, `todayInWarsaw`, porównania stringów `YYYY-MM-DD`); `currentSeason` w jednym miejscu (`archive.json` albo stała eksportowana z `lectures.ts`) + walidacja sezonu przez `getSeason()`; rejestr sezonów generowany jak `news-registry.ts`; `redirects.json` poza `docs/` (`content/` albo `src/config/`). | R1-05, R1-06, R1-15, R1-21 | M | — | RF-2 |
| **S-14** | ryzyko | **Odwrócona warstwa i cykl importów**: `offers.ts` importuje typy z komponentu; `lectures` ↔ `lecturers`; kontekst React + 3 Client Components tylko po to, żeby podać `semesters` / `steps` do MDX; `"use client"` na panelu wystawy dla `useId`; `YearNav` jako przelotka. Kierunek: typy do `src/content`; `getTotalSeasonCount` wywoływane w `lectures.ts`; mapa `components` budowana na serwerze w `OfferPage`; zdjąć `"use client"`; scalić `YearNav`. | R1-16, R2-21 | S | — | RF-7 |
| **S-15** | ryzyko | **Walidacje przy imporcie nierówne**: eksporty MDX rzutowane `as unknown as`; `newsSlug` w LSŚ i `relatedNewsSlug` albumu bez sprawdzenia; brakujący slug wyróżnionej ikony cicho zmniejsza galerię; ISO tylko dla warsztatów; parowanie tytułów ze slugami toleruje niezgodność, `""` jako niejawna konwencja; loader przekierowań bez asercji. Kierunek: `assertMdxExports`, `assertNewsSlug`, `assertIconSlug`, walidacja ISO dla wszystkich ofert, reguła „liczba slugów = liczba tytułów albo 1” z opisem konwencji w `types.ts`, asercja duplikatów/łańcuchów w `loadPermanentRedirects`. `OfferLeadExtraPlace` = `ExhibitionTravelingPlace` → jeden typ. | R1-14, R1-17, R1-18, R4-21 | S | — | RF-3 |
| **S-16** | ryzyko | **Akordeon archiwum serializuje całe sezony do klienta** (331 KB HTML, 107 KB skryptów) + przyciski sezonów poza hierarchią nagłówków; `defaultExpandedSlug` i gałąź `placeholder` martwe. Kierunek: panele renderowane na serwerze (`LectureList` jako `children`), do klienta tylko `slug` / `label` / `cycleTitle`; przycisk w `h2` (APG); usunąć martwy prop. | R2-07 | M | — | RF-9 |
| **S-17** | ryzyko | **Fakty z briefu §8 w dwóch źródłach**: telefon w `pl.ts` 10× literałem + `phoneTel` obok `settings.phone`; e-mail sekretariatu wybierany po fragmencie etykiety z fallbackami w 3 miejscach; literał adresu w `ExhibitionPage`. Kierunek: `getPhoneHref()`, `getEnrollmentEmail()`, `getSecretariatEmail()` w `settings.ts` (wybór po stałym kluczu); `pl.ts` z szablonem `{phone}`. | R2-06, R4-19 (część telefon/e-mail) | S | — | RF-12 |
| **S-18** | ryzyko | **Treść redakcyjna w `pl.ts`** (hero `/` z obrazem, filary z `href`, cytat EJK, cały hub warsztatów, copy `/ikony/wystawy`) wbrew „treści wyłącznie w `content/`”; skrypt migracyjny traktuje `pl.ts` jak plik treści. Kierunek: `content/pages/home.json`, `content/pages/workshops-hub.json`, copy wystaw do `content/exhibition/page.mdx`; loadery z walidacją; `href` filarów z `navigation.ts`; karty huba z danych ofert. **Dotyka `content/`** → po k8. | R4-02 (+ część R3-07: karty huba) | M | po k8 / merge `feat/10-finishing`; S-01 | RF-12 |

### 3.3 Niespójności i upraszczanie

| ID | Klasa | Pozycja | Źródła | Koszt | Zależy od | RF |
| --- | --- | --- | --- | --- | --- | --- |
| **S-19** | niespójność | **Stan nawigacji ustalany na trzy sposoby**, 24× `find(…)!.label`, `aria-current="page"` na sekcji nadrzędnej (staging), `pl.header.newsLink` jako klucz, `active="Publikacje"` martwy; `navigation.ts` z listami zapisanymi dwa razy i stopką po indeksie; link nawigacji z podkreśleniem składany 3×, link TOC 2×. Kierunek (A2): `resolveNav(path)` → `{ active, section, sectionActive }`; `SectionPageShell` przyjmuje `path`; `aria-current="page"` tylko przy `href === path`, inaczej `"true"`; `mainNav[].children` z `sectionNav`, stopka po `href`, „Publikacje” jako `NavLink`; `NavUnderlineLink`, `TocLink`. Dolny rząd szuflady (podwójne Aktualności / Kontakt) — decyzja wizualna w V4, tu tylko etykiety z `navigation.ts`. | R2-12, R3-03, R3-08, R4-11, R4-12, R2-20; R0 jscpd `Header` ↔ `SectionNav` | M | — | RF-8 |
| **S-20** | niespójność | **Powłoka stron w trzech miejscach** (`/`, 404, `/warsztaty` składają się same; 404 kopiuje klasy `main`); trzy trasy ofert powtarzają 13 linii i sloty wynikające z danych; 6 powłok powtarza nieskuteczne `mx-auto max-w-content-max`; `ReadyIconsNote` ujemnym marginesem kasuje padding powłoki, `GalleryOrderTeaser` pożycza klasy wystawy. Kierunek: `WorkshopsHubPage` w `components/`; `SectionPageShell` z wariantem `flush` i slotem „pasek przy stopce”; 404 przez powłokę; `OfferPage` sam renderuje `OfferLeadExtra` / `OfferLeadIntro` / `OfferQuote` z danych; wewnętrzne `max-w` usunięte. Klasa `cta-band` dla teasera — po V1 (S-30). | R3-05, R3-07, R3-09, R2-16; R0 jscpd kurs ↔ LSŚ | S | S-19 (ten sam refaktor sygnatur) | RF-8 |
| **S-21** | niespójność | **Fokus**: `summary` bez obrysu z `CLAUDE.md` (domyślny pierścień przeglądarki na stagingu); 14 reguł `:focus-visible` w `globals.css` identycznych z globalną + 3 zestawy klas w komponentach. Kierunek: reguła globalna rozszerzona o `summary` i `[tabindex]:not([tabindex="-1"])`; 14 reguł i 3 zestawy usunięte; `.news-archive-toggle:focus-visible` zostaje. | R2-10, R4-15 | S | — | RF-1 |
| **S-22** | niespójność | **5 wartości arbitralnych Tailwind** w 4 komponentach. Kierunek: tokeny `--grid-template-columns-season-head(-lg)`, `--grid-template-columns-step-row`; klasa `.bleed-x-mobile`; marker `summary` regułą w `base`. Kryterium: `grep -E '\-\[|\[&' src/` = 0. | R2-15, R4-14 | S | — | RF-10 |
| **S-23** | niespójność | **Tekst UI po polsku w komponentach**; `ArticleList` parsuje z powrotem napis z `pl.ts`. Kierunek: literały i formy liczebników do `pl.ts`; etykieta składana z danych. | R2-14 | S | — | RF-11 |
| **S-24** | niespójność | **„Jeden plik = jeden komponent” złamane**: 2 komponenty w `ExhibitionToursSection.tsx` (CRLF, pusta linia po każdej), `TextPageSection` w `TextPageShell.tsx`, `MapBlock` z README istnieje tylko jako martwy kod obok `MapEmbed` / `OnlineAside`; `PersonProfile.tsx` CRLF; nieaktualny komentarz w `Breadcrumb`. Kierunek: rozdzielić pliki, LF, `MapBlock` użyć na `/kontakt` albo usunąć (zgodność nazwy z README — D6), komentarz poprawić. Breadcrumb na publikacjach vs README → C1. | R2-13 | S | — | RF-7 |
| **S-25** | upraszczanie | **Martwy kod i zbędne eksporty** potwierdzone w kodzie: 8 funkcji do usunięcia i 8 do zdjęcia `export` w `src/content/*` (z polskimi literałami poza `pl.ts` w `getLectureEventData`, `getAnnualOpenPeriodLabel`); `PagePlaceholder.tsx`, `PreviewGrid`, eksporty i typy komponentów; 15 martwych klas CSS (ok. 61 linii); 19 nieużywanych kluczy `pl.ts` + 2 używane tylko w martwym kodzie; martwa trasa `src/app/ikony/wystawa/` (308 z konfiguracji); `exampleSlugs` ładowane, nierenderowane. Fałszywe alarmy knip (zostają): `toWarsawIsoDate`, `UPCOMING_SLOTS`, `sharp`. | R1-12, R2-22, R4-17, R4-18, R3-06, R1-13; R0 knip | S | D6 (`exampleSlugs`), D7 (`.publication-excerpt*`, `originHeading` vs T25) | RF-7 |
| **S-26** | upraszczanie | **Stan lightboxa napisany 7×**, dwa komponenty lightboxa różne tylko slotem `meta`, `WorkshopLightbox` używany poza warsztatami, 3 zestawy etykiet w `pl.ts`, na wpisie dwa dialogi dla tej samej listy; `onLoadingComplete` przestarzałe. Kierunek: `useLightboxIndex(count)`; jeden `Lightbox` (nazwa z README) z `meta` / `labels`; `pl.lightbox` wspólne; `onLoad`. | R2-17, R2-18, R2-23, R4-19 (etykiety lightboxa); R0 jscpd `Lightbox` ↔ `ContentLightbox`, `NewsGallery` ↔ `PublicationSpreadStrip` ↔ `WorkshopGallerySection` | M | — | RF-4 |
| **S-27** | upraszczanie | **Model omijany**: `NewsFrontmatter` powtarza pola `News`, loadery wpisują `body: ""`, `Offer.testimonials` nigdy nieustawiane; `manifest.json` czytany w 3 modułach z własnym rzutowaniem, `upcoming.ts` z własnym filtrowaniem. Kierunek: typy loaderów z `Omit<News, "body">` itd. (bez zmiany nazw pól); `getNews()` / `hasNewsSlug()` jako jedyny czytnik. | R1-10, R1-11 | M | — | RF-7 |
| **S-28** | upraszczanie | **Tokeny CSS**: 14 nieużywanych w `:root`, 29 mapowań `@theme` bez klasy (łańcuchy aliasów do pustki), `leading-*` / `shadow-*` zdefiniowane dwa razy, te same wartości pod różnymi nazwami, nieaktualne komentarze; 7 klonów „pełnoszerokie tło / linia” (`.surface-*-bleed`, `.rule-*`) i `.hairline-grid-2/3`. Kierunek: usunąć / scalić wg tabeli 3 w `04-cross-cutting.md`; `.bleed` z `--bleed-bg`, `.rule-full`, `--hairline-cols`. **Bez zmian wizualnych** — weryfikacja zrzutami przed/po. | R4-13, R4-16; R0 jscpd CSS | M | — | RF-10 |
| **S-29** | niespójność | **Dwa systemy stylowania ról typograficznych i prozy** (A4): brak `PageHeading` z README, H2 sekcji 21× w TSX + 3 klasy CSS, tytuł strony 8× + 4 klasy; akapit MDX stylowany z trzech warstw (narzędzie wygrywa z `@layer components` — `margin: 0` nie działa), Aktualności obchodzą to osobnym `newsMdxComponents`; `MdxImage` martwy z domyślnymi wymiarami; kolor H3 z MDX inny niż H2. Kierunek: `PageHeading` (`page` / `section` / `sub`), 3–4 klasy ról (`.eyebrow`, `.caption-serif`), `Prose` z wariantami i `mdx-components.tsx` bez odstępów na blokach; klasy semantyczne tylko dla układu; `globals.css` podzielone na pliki per dziedzina bez zmiany selektorów. **Po V1** (pomiar pokaże, które rozjazdy są widoczne). | R2-11, R4-06, R4-07, R4-20; R0 jscpd CSS (ok. 13 klonów ról) | L | D3; po V1 | RF-14 |
| **S-30** | niespójność | **Odstęp między sekcjami z 10+ mechanizmów (26–96 px)**, `--section-gap` 96 px poza README (56–64), token desktopowy publikacji nigdy nieużyty (34 px na desktopie), złota belka 2 vs 3 px, 25 rozmiarów pisma i odstępy spoza siatki literałem (A5). Kierunek: jedna skala `--section-gap` (desktop / mobile, jeden próg) + wariant „ciasny”, wrapper `PageSection`; `--accent-bar` jako jeden token; tokeny komponentów przez `var(--space-*)` / `--leading-*` / `--measure-*`. **Wartości ustala V1 z właścicielem.** | R4-04, R4-05, R4-08, R4-10 | M | po V1 | RF-13 |

### 3.4 Pozycje do decyzji (bez kierunku technicznego)

| ID | Klasa | Pozycja | Źródła | Koszt | Zależy od | RF |
| --- | --- | --- | --- | --- | --- | --- |
| **S-31** | decyzja | **Cień zdjęcia hero vs `CLAUDE.md`** („cienie poza `Lightbox` zakazane”); README lokalny ma dwa sprzeczne zapisy (§Zasady vs §3), niemożliwe do sprawdzenia w repo. | R4-09 | S | D1 | RF-10 (jeśli usunąć) / `CLAUDE.md` (jeśli zostaje) |
| **S-32** | decyzja | **12 z 19 tras z domyślnym `<title>`** — WCAG 2.4.2 i nierozróżnialne karty; tytuły z różnych źródeł, `metadata` raz nad, raz pod komponentem. | R3-10 | S | D4 | RF-8 (minimalne tytuły) / k9 (OG, opisy) |

### 3.5 Drobiazgi

| ID | Klasa | Pozycja | Źródła | Koszt | Zależy od | RF |
| --- | --- | --- | --- | --- | --- | --- |
| **S-33** | drobiazg | Komponenty: `NewsDateMeta` dwie identyczne gałęzie; stałe `id` w komponentach wstawianych z MDX (`useId`); 3 kopie `scrollIntoView` z `prefers-reduced-motion` i glify SVG kopiowane (lupa ×2, chevron ×3) → `src/lib/scroll.ts`, `core/icons.tsx`; hero „O Akademii” z wymiarami na sztywno; klucze z prefiksu akapitu; `href` opcjonalny z `"#"` w `Button` / `FilterChip`; placeholder zdjęcia `role="img"` czytany dwa razy. | R2-24, R2-25, R2-26, R2-27, R2-28, R2-29 | S | — | RF-11 (R2-29 → RF-1) |
| **S-34** | drobiazg | Dane: komentarz „until k3c”; `getNews()` sortuje przy każdym wywołaniu; „zł” poza `pl.ts`; `slice(0, 3)` bez nazwy. | R1-20 | S | — | RF-7 |

---

## 4. Uproszczenia architektoniczne

Pięć miejsc, gdzie kilka zgłoszeń ma jedną przyczynę. Każde to kierunek dla paczki RF, nie osobne zadanie.

### A1 — Jedno źródło dat i sezonu

**Przyczyna wspólna:** fakty zależne od czasu (stan zapisów, bieżący sezon, „dzisiaj”, terminy w copy) są zapisane równolegle w `content/` (ISO), w `pl.ts` (literały), w stałych kodu (`CURRENT_SEASON_SLUG` ×2, `archive.json.lastSeason`) i w ręcznej fladze `enrollmentOpen`. Każdy nowy sezon = kilka edycji bez błędu przy rozjeździe; dziś rozjazd widoczny na stagingu (S-01).  
**Kierunek:** `src/lib/isoDate.ts` jako jedyna arytmetyka dat (`todayInWarsaw`, porównania stringów); `getEnrollmentState()` w warstwie danych jako jedyny stan zapisów; jeden `currentSeason`; `pl.ts` wyłącznie z szablonami `{date}` / `{season}` wypełnianymi z danych (wzorzec już działa w `pl.home.upcoming`); trasy zależne od daty z `revalidate` (lista dla B9: `/`, `/ikony/wystawy`, `/aktualnosci/[slug]`).  
**Obejmuje:** S-01, S-10, S-12, S-13; warunek wstępny dla S-18. **Paczka:** RF-2 (S-18 → RF-12 po k8).

### A2 — Powłoka i nawigacja z `resolveNav(path)`

**Przyczyna wspólna:** stan nawigacji i powłoka strony są składane per trasa ręcznie (24× `find()!`, trzy konwencje trasa ↔ komponent, trzy miejsca z własnym `Header` + `main` + `Footer`), więc zmiana w powłoce (np. `inert` z S-05, slot z S-20, tytuł dokumentu z S-32) wymaga pamiętania o kilkunastu plikach.  
**Kierunek:** `src/navigation.ts` jako jedyny model (listy bez duplikatów, „Publikacje” jako `NavLink`) + `resolveNav(path)` → `{ active, section, sectionActive, title }`; `SectionPageShell` przyjmuje `path` i sam ustawia nawigację, `aria-current`, wariant `flush` dla `/`, slot przy stopce; konwencja: **trasa = dane + `path` + wymagana treść, komponent `*Page` = widok z propsów**; `metadata.title` z tej samej funkcji (jeśli D4 = teraz).  
**Obejmuje:** S-19, S-20, S-32; ułatwia S-05 (`inert` w jednym miejscu). **Paczka:** RF-8.

### A3 — Galeria renderowana na serwerze

**Przyczyna wspólna:** siatki „justified” liczą układ dopiero po pomiarze kontenera w przeglądarce, więc HTML z serwera jest pusty (CLS, brak treści bez JS), a `/ikony` dodatkowo jest dynamiczna tylko przez `searchParams`, co dokłada rundę do serwera przy każdym filtrze i powtórny pomiar. Lightbox obok tego jest napisany 7× w wariantach.  
**Kierunek:** rząd jako `flex` z `flex-grow` = proporcja zdjęcia i wysokością z tokenu (tak już robi `NewsGallery`), pomiar w JS najwyżej jako dopracowanie; jeden `JustifiedGrid` i jeden `Lightbox` z `useLightboxIndex`; filtr tematu w kliencie na danych już w stronie, trasa statyczna.  
**Obejmuje:** S-04, S-26. **Paczka:** RF-4. **Kryterium twarde:** CLS < 0,1 na 390 i 1440, `<img>` w SSR > 0, `/ikony` ○ w buildzie.

### A4 — Jeden system stylowania ról typograficznych

**Przyczyna wspólna:** te same role (tytuł strony, H2 sekcji, etykieta wersalikami, podpis szeryfowy, akapit prozy) są zdefiniowane równolegle jako ciągi klas Tailwind w TSX (21× H2) i jako klasy semantyczne per strona w `globals.css` (`.about-*`, `.publication-*`, `.news-*`); na tym samym elemencie narzędzie wygrywa z `@layer components`, co daje trzy rytmy akapitów (20 / 14 / 40 px) niewidoczne w kodzie komponentu.  
**Kierunek:** nie migrować hurtem. `PageHeading` (`page` / `section` / `sub`) + 3–4 klasy ról + `Prose` z wariantami; klasy semantyczne zostają dla złożonych układów, ale nie ustawiają typografii; `mdx-components.tsx` bez odstępów na blokach; `globals.css` podzielony per dziedzina `@import`em bez zmiany selektorów; zasada do `CLAUDE.md`: klasa semantyczna i narzędzie nie ustawiają tej samej właściwości na tym samym elemencie.  
**Obejmuje:** S-29 (+ S-28 jako porządek tokenów przed). **Paczka:** RF-14, **po V1** i po D3.

### A5 — Skala odstępów sekcji

**Przyczyna wspólna:** odstęp między sekcjami ustawia każdy komponent sam, 10+ mechanizmami o różnych wartościach i progach (26–96 px; `--section-gap` 1024 px, reszta 768 px), więc jedna strona oferty ma obok siebie 52 i 96 px, a publikacje na desktopie 34 px przez pominięty media query.  
**Kierunek:** jedna skala w tokenach ról (`--section-gap` desktop / mobile, jeden próg, wariant „ciasny”), wrapper `PageSection` zamiast marginesu w komponencie, `--accent-bar` jako jedna grubość belki; tokeny komponentów przez `var(--space-*)`. Wartości docelowe z V1 i makiety (56–64 / 30–34).  
**Obejmuje:** S-30, część S-20 (`cta-band`). **Paczka:** RF-13, **po V1** (RV-7).

---

## 5. Decyzje właściciela

Każda z domyślną odpowiedzią. **Właściciel potwierdził D1–D9 w wersji domyślnej (2026-10-04)** — paczki RF idą wg kolumny „Domyślna odpowiedź”; do przepisania do `docs/plan-claude-code.md` §4 przy zamknięciu bloku R.

| ID | Pytanie | Źródło | Domyślna odpowiedź | Skutek |
| --- | --- | --- | --- | --- |
| **D1** | Cień zdjęcia hero (`/`, `/o-akademii`) łamie literę `CLAUDE.md`; lokalny `design/README` ma podobno dwa sprzeczne zapisy. Zostaje czy znika? | S-31 / R4-09 | **Zostaje** — dopisać do `CLAUDE.md` wyjątek „cienie tylko w `Lightbox` i na zdjęciu `Hero`” i poprawić komentarz w `globals.css:565`; właściciel potwierdza, który zapis README jest aktualny. V1 może przywrócić pytanie, jeśli cień odstaje od makiety. | brak kodu w RF; edycja `CLAUDE.md` przez właściciela |
| **D2** | `tsx` i `@types/mdx` jako `devDependencies`; `@types/node` → 22; skrypty npm `content:index`, `check:states`; `prebuild`? | S-08, S-09 / R1-09, R4-03 | **Tak** dla zależności i skryptów npm. **`prebuild` = check, nie generowanie:** porównanie `manifest.json` ↔ frontmatter (i rejestru publikacji) przerywa build przy rozjeździe; generowanie zostaje ręczne (`npm run content:index`), żeby wersja w git była tą, którą widać w diffie. | RF-6 (zależności, skrypty), RF-3 (check) |
| **D3** | Kierunek dwóch systemów stylowania: migracja ról typograficznych do jednego zestawu (A4) w ramach RF, czy zostawić na później? | S-29 / R4-07 | **A4 w RF-14 po V1, ograniczone do ról typograficznych i prozy** (bez przepisywania układów `news-*` / `exhibition-*` na Tailwind). Podział `globals.css` na pliki — tak, bez zmiany selektorów. | RF-14 |
| **D4** | Tytuły dokumentów: minimalne `metadata.title` teraz (z `resolveNav` / danych) czy całość w k9? | S-32 / R3-10 | **Minimalne tytuły teraz** w RF-8 (koszt S, zamyka WCAG 2.4.2, `resolveNav` i tak powstaje); OG, `description`, `metadataBase` — k9. | RF-8 |
| **D5** | Stan zapisów na kurs po 24.09.2026: dane mówią „zamknięte”, flaga mówi „otwarte”. Który stan ma pokazywać staging? | S-01 / R1-01 | **Zamknięte, liczone z dat** (K-10: nabór 2026/2027 obsłużyła stara strona). FactsBox pokazuje istniejące copy `kurs.closed` („Zapytaj o miejsce mailem”, nota o liście rezerwowej). `enrollmentOpen` zostaje jako opcjonalny override tylko do ręcznego **otwarcia** poza terminem, nie odwrotnie. | RF-2 |
| **D6** | `exampleSlugs` w ofercie „Na zamówienie” — podpiąć pod widok czy usunąć z loadera? `MapBlock` — użyć na `/kontakt` czy usunąć? | S-25, S-24 / R1-13, R2-13 | **Usunąć z loadera** (pole w MDX zostaje — `content/` poza zakresem; pytanie o przykłady → T-R5). **`MapBlock`:** scalić `MapEmbed` + `OnlineAside` w `MapBlock` (nazwa z README i `CLAUDE.md`), bez zmian wizualnych. | RF-7 |
| **D7** | `.publication-excerpt*` (5 klas) i `pl.publications.originHeading` — martwe dziś, T25 może ich użyć. Usunąć czy zostawić? | S-25 / R4-17, R4-18 | **Usunąć** — historia w git; T25 odtworzy to, czego faktycznie użyje. | RF-7 |
| **D8** | Filtr `?temat=` po przebudowie: `replaceState` (jak dziś — „Wstecz” wychodzi z galerii) czy `pushState` („Wstecz” cofa filtr)? | S-04 / R3-04 | **`replaceState`** — zachowanie dzisiejsze, chipy to widok tej samej strony. | RF-4 |
| **D9** | `existsSync` w renderze `/ikony/wystawy`: usunąć i ufać danym, czy sprawdzać istnienie plików przy buildzie? | S-11 / R1-04 | **Usunąć z renderu**; istnienie plików `public/media/**` z `content/` sprawdza skrypt `check:media` (w `prebuild` razem z D2). Do czasu T19 placeholdery zostają jawnie w danych. | RF-3 |

Nie są decyzjami właściciela (rozstrzyga implementacja wg kierunku z 3.x): sposób renderu paneli akordeonu (S-16), kształt `resolveNav` (S-19), typy loaderów (S-27).

**Przekazane do faz wizualnych, nie do RF:** dolny rząd menu mobilnego z podwójnymi Aktualnościami / Kontaktem (R4-12 → V4); grubość belki 2 vs 3 px i kolor H3 w MDX (R4-08, R4-20 → V1); wartości odstępów i rozmiarów (R4-04, R4-10 → V1). **Do C1:** breadcrumb na `/publikacje/[slug]` vs README (R2-13), `/ikony/[slug]`.

---

## 6. Podział: kod vs backlog treści T

### 6.1 Do backlogu treści (właściciel / EJK — `docs/plan-claude-code.md` §5, nie RF)

Numery robocze `T-R*`; właściciel nadaje docelowe `T31+` przy wpisie do §5.

| Roboczy | Pozycja | Gdzie | Źródło | Blokuje |
| --- | --- | --- | --- | --- |
| **T-R1** | Brakujący wpis `krzysztof-sokolowski` w rejestrze wykładowców (sezony 2017/2018, 2021/2022) — poza T18 (2012–2014) | `content/lecturers.json` / `lecturer-directory.json` | R1-03 | RF-5 (build będzie błędem przy nieznanym slugu) |
| **T-R2** | Ujednolicenie 5 wpisów rozjechanych między rejestrami: `marek-szymula` (Szymuła / Szymula), `dariusz-klejnowski-rozycki` (tytuły / afiliacja), `ewa-kocoj`, `maciej-biskup`, `irina-tatarova` (afiliacja) — która wersja jest poprawna | j.w. | R1-02 | RF-5 |
| **T-R3** | Fakty LSŚ 2027 na karcie huba `/warsztaty`: miejsce, termin, koszt — dziś `[pole CMS]` widoczne na stagingu | `pl.ts` → po RF-12 `content/` | R4-01 | — (RF-12 zamienia na `[do uzupełnienia: …]`, jeśli brak odpowiedzi) |
| **T-R4** | Przyszłe wystawy: jawne `vernissage` i `dateEnd` w `annual.json` zamiast zgadywania (po RF-2 brak daty = „termin wkrótce”) | `content/exhibition/annual.json` | R1-08 | — (zasada redakcyjna) |
| **T-R5** | Czy „Na zamówienie” ma pokazywać przykłady (`exampleSlugs` w MDX dziś nieużywane)? Jeśli tak — osobny kawałek UI | `content/offers/zamowienie.mdx` | R1-13 | — |
| **T-R6** | `h3` w treści MDX zaraz po `h1` na `/aktualnosci/oprowadzania-po-wystawie-2017` (axe `heading-order`) — redakcja nagłówków wpisu | `content/news/oprowadzania-po-wystawie-2017.mdx` | R2 „Do weryfikacji” (C2) | — |

Powiązane istniejące pozycje T: T19 (zdjęcia wystaw — warunek weryfikacji S-11 na stagingu), T22 (copy wystaw — RF-12 przenosi **miejsce**, nie zmienia treści), T25 (fragmenty albumu — D7).

### 6.2 Do kodu (RF)

Wszystkie pozycje S-01…S-34 poza S-31 (D1 — `CLAUDE.md`) i częściami przekazanymi do V1 / V4 / C1 (§5). Podział na paczki, kolejność i kryteria: `docs/archive/plans/10-review-fixes.md`.

### 6.3 Zamknięte bez paczki

- **B4** — rozwiązane (0 wartości arbitralnych w `mdx-components.tsx`); odhaczyć w `10-finishing.md`.
- **R3-02 (pierwsza połowa)** — nie zachodzi (korekta R4, potwierdzona).
- **B5** — wchodzi do RF-6 razem z S-09 (nie wymaga osobnego rozstrzygnięcia: usunięcie, historia w git; `plan-claude-code.md` już mówi „nie uruchamiamy ponownie”).

---

## 7. Mapa zgłoszeń → pozycja scalona

| Zgłoszenie | S | Zgłoszenie | S | Zgłoszenie | S | Zgłoszenie | S |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1-01 | S-01 | R1-12 | S-25 | R2-02 | S-05 | R2-13 | S-24 |
| R1-02 | S-02 | R1-13 | S-25 | R2-03 | S-06 | R2-14 | S-23 |
| R1-03 | S-03 | R1-14 | S-15 | R2-04 | S-07 | R2-15 | S-22 |
| R1-04 | S-11 | R1-15 | S-13 | R2-05 | S-01 | R2-16 | S-20 |
| R1-05 | S-13 | R1-16 | S-14 | R2-06 | S-17 | R2-17 | S-26 |
| R1-06 | S-13 | R1-17 | S-15 | R2-07 | S-16 | R2-18 | S-26 |
| R1-07 | S-10 | R1-18 | S-15 | R2-08 | S-08 | R2-19 | S-04 |
| R1-08 | S-12 | R1-19 | S-08 | R2-09 | S-05 | R2-20 | S-19 |
| R1-09 | S-08 | R1-20 | S-34 | R2-10 | S-21 | R2-21 | S-14 |
| R1-10 | S-27 | R1-21 | S-13 | R2-11 | S-29 | R2-22 | S-25 |
| R1-11 | S-27 | R2-01 | S-04 | R2-12 | S-19 | R2-23 | S-26 |
| R2-24 | S-33 | R3-01 | S-08 | R3-10 | S-32 | R4-10 | S-30 |
| R2-25 | S-33 | R3-02 | S-08 (½) | R3-11 | S-10 | R4-11 | S-19 |
| R2-26 | S-33 | R3-03 | S-19 | R4-01 | S-01 | R4-12 | S-19 |
| R2-27 | S-33 | R3-04 | S-04 | R4-02 | S-18 | R4-13 | S-28 |
| R2-28 | S-33 | R3-05 | S-20 | R4-03 | S-09 | R4-14 | S-22 |
| R2-29 | S-33 | R3-06 | S-25 | R4-04 | S-30 | R4-15 | S-21 |
| R3-07 | S-20 | R3-08 | S-19 | R4-05 | S-30 | R4-16 | S-28 |
| R3-09 | S-20 | R4-06 | S-29 | R4-07 | S-29 | R4-17 | S-25 |
| R4-08 | S-30 | R4-09 | S-31 | R4-18 | S-25 | R4-19 | S-17, S-26 |
| R4-20 | S-29 | R4-21 | S-15 | | | | |

82 zgłoszenia, każde przypisane.
