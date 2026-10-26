# Plan 10 — Finishing (ewaluacja, poprawki, SEO, optymalizacja)

Status: **zatwierdzony** 2026-10-03 · fala 1 ✅ 2026-10-04 · k8 ✅ (T1–T29, 8a, 8b, 8c; 2026-10-25) · C1–C2 ✅ (2026-10-25) · k9 ✅ (9a–9d; 2026-10-26) · k10 plan zatwierdzony 2026-10-26 · **następne: 10a**  
Gałąź: `feat/10-finishing`  
Makiety: tokeny `design/README`, odczyt wartości `docs/design-mockup-guide.md`. Fala 2 nie ma nowych makiet.

## Cel i zakres

Domknięcie serwisu na prawdziwych danych z etapu 9 przed wdrożeniem (etap 11). Praca w dwóch falach:

1. **Fala 1 — poprawki i refaktory** (layout, IA, komponenty, wzorce UI) — **zamknięta** 2026-10-04.
2. **Fala 2 — treść, SEO, audyty** — k8 treść i gate EJK → k9 SEO/analityka/JSON-LD → k10 audyty, ewaluacja kodu, dokumentacja.

**Poza zakresem etapu 10:** hosting, DNS, runbook (etap 11); **CMS wykładów i aktualności** (osobny projekt po etapie 11); zmiany w `design/` przez Claude Code; nowe zależności npm bez uzgodnienia; migracja WP — zamknięta na stałe, skryptów `scripts/migrate-wp/` nie uruchamiamy.

## Decyzje wiążące dla fali 2

| ID | Decyzja |
| --- | --- |
| **K-122** | Gate w czacie przed zapisem treści redakcyjnej w `content/` — pozycja po pozycji, z akceptacją właściciela; refaktory UI — zwykły checkpoint po kawałku. **Od 2026-10-16:** Claude może generować treść (copy, opisy, nowe sformułowania) — przy propozycji wyraźnie oznacza, co jest jego dopowiedzeniem, i pyta, czy jest OK. Zakaz generowania treści za klienta zniesiony. |
| **Kolejność** | k8 → k9 → k10; k10 obejmuje synchronizację dokumentów z kodem, więc idzie ostatni. Blok R (review) równolegle do k8 — RV-1, `10-review.md`. |

## Fala 1 — podsumowanie (zamknięta 2026-10-04)

Szczegóły, decyzje kawałków i checkpointy — w `docs/archive/plans/`. Decyzje rejestru — `docs/plan-claude-code.md` §4.

| Kawałek | Wynik | Decyzje | Plan |
| --- | --- | --- | --- |
| 1 — `/ikony/wystawy` | Układ K-127 (13a/14a) + korekty K1–K4; P4 Tura B R1, R2, R7, R8; „Wystawy wyjazdowe” `#wyjazdowe` | K-127, K-87 | `10-k1-exhibitions.md` |
| 2 — lightbox | G1–G3: brak flashu, cap skali, modal treści vs ikon, siatki D9, tryb single; K-38 iOS OK | — | `10-k2-lightbox.md` |
| 3 — aktualności | K-69 kierunek B; `News.layout`, bez `poster`; nowy szablon wpisu; wpisy cykliczne | K-128–K-135 | `10-k3-news.md` |
| 4 — strona główna | „Najbliższe” — 3 kafle liczone z dat + `upcomingOverrides[]`; H3 bez błędu; korekta UI kafel Wykłady 2026-10-19 (eyebrow + linie nazwisk) | K-136 | `10-k4-home.md` |
| 5 — album | Spis wg rozdziałów, skany, optymalizacja mediów | K-137, K-138 | `10-k5-album.md` |
| 6 — wykłady | Przegląd tras, a11y akordeonu, `News.lectureSeason` | K-139 | `10-k6-lectures.md` |
| 7 — reszta layoutu | I1, O1–O3, S1, stopka C1 (K-36) | — | `10-k7-layout.md` |
| — poprawka po review | Stopka **Stopka v2** (3a/3b), **K-149** — poza k7, po zamknięciu bloku R | K-149 | `design/Akademia Ikony - Stopka v2.dc.html` |

## Kawałki — fala 2

### Kawałek 8 — Treść i gate EJK

**Zakres:** backlog treści **T1–T29** w `docs/plan-claude-code.md` §5 — galeria, zamówienie, oferty, LSŚ, aktualności, wykłady, wystawy, album, O nas / pracownia, przegląd `alt`/`caption` całego serwisu. Każda pozycja przez gate K-122. **T30** (lightbox dla zdjęć inline w MDX) — §5A, v2, poza k8.

**Kawałek 8a — usunięcie sprzedaży ikon (K-151, 2026-10-14):** korekta zakresu k8 po decyzji EJK. Usunąć trasę `/ikony/na-zamowienie`, ofertę `zamowienie` i jej komponenty (`OrderExamples`, `GalleryOrderTeaser`), link zamówienia z lightboxa, pozycję w `sectionNav.ikony`, linki/wzmianki w `o-akademii.json`, `home.json`, `pracownia.json`; stringi `pl.ts`; 301 → `/ikony`; wpisy trasy w `scripts/visual-*`; brief. Model (`OfferKind`, `IconWork.available`) bez zmian. Jeden checkpoint.

**Kawałek 8b — menu mobilne (2026-10-22):** przegląd 375 px (`/`, `/o-akademii`, `/warsztaty`, `/wyklady`, `/ikony`, `/aktualnosci`): strony mają 6–11 ekranów, nagłówek nie jest sticky, więc hamburger znika po pierwszym przewinięciu. Zakres:

1. **Pływający przycisk menu** (mobile, `< lg`) — kwadrat 56 px, tło akcentu jak `Button` primary, ciemna ikona hamburgera, bez napisu (etykieta `aria-label` z `pl.ts`), obrys zamiast cienia; prawy dolny róg z marginesem strony + `env(safe-area-inset-bottom)` (klasa w CSS, nie wartość arbitralna). Widoczny dopiero, gdy pasek nagłówka wyjdzie z ekranu (`IntersectionObserver`) — nigdy dwa hamburgery naraz; ukryty przy otwartym menu; `prefers-reduced-motion` bez animacji. Na mobile dolny odstęp strony, żeby przycisk nie zasłaniał końca stopki.
2. **Szuflada menu na pełny ekran z własnym paskiem** (logo + zamknij) — dziś `top` = wysokość paska nagłówka, co zakłada widoczny nagłówek. Focus trap, Esc, `inert` tła bez zmian; po zamknięciu fokus wraca na przycisk, który otworzył menu.
3. **Bez duplikatów** — usunąć przycisk „Kontakt” i „Aktualności” z dolnego rzędu; zostają „Zapisy na warsztaty” i rząd Publikacje · Blog.
4. **Cały wiersz sekcji rozwija akordeon** (zamiast etykieta = link, chevron = toggle); pierwsza pozycja listy to hub sekcji z `sectionNav[0]` (Przegląd / Bieżący sezon / Galeria / O Akademii) — `mainNav.children` = pełne `sectionNav`, komentarz o wyjątku Ikony do usunięcia.
5. **O Akademii z akordeonem** — O Akademii, Pracownia.
6. **Bieżąca podstrona w akordeonie złota** (`text-accent-text`, jak aktywna sekcja).

Kolizja: `YearNav` na `/aktualnosci` jest sticky `top: 0`, `z-index: 20` — przycisk na dole jej nie dotyka; z-index przycisku powyżej 20, szuflady powyżej przycisku; lightbox to natywny `<dialog>` (top layer), bez konfliktu. **Wariant zapasowy (1B):** jeśli pływający przycisk się nie sprawdzi — nagłówek sticky chowany przy scrollu w dół, kompaktowy bez podtytułu; wtedy `YearNav` dostaje `top` = wysokość nagłówka, a `--year-nav-scroll-offset` sumę obu wysokości. Pliki: `HeaderMobileMenu.tsx`, `navigation.ts`, `pl.ts`, `tokens.css` (rozmiar przycisku, jeśli brak tokenu). Bez nowych zależności. Jeden checkpoint.

**Kawałek 8c — spójność UX (2026-10-25):** decyzje właściciela do `docs/archive/plans/10-ux-consistency-review.md` — pkt 1–6, 12, 13 przyjęte, pkt 7–10 bez zmian, pkt 11 bez zmian w kodzie (pas opinii na `/` = świadomy akcent). Zakres:

1. **Wysokość przycisków** — `FactsBox`: CTA i telefon `size="md"` → `lg` (64 px / 17,5 px jak reszta).
2. **Szerokość przycisków** — od `md`: w karcie/ramce pełna szerokość, w treści szerokość tekstu; mobile bez zmian (pełna szerokość). Zmiana tylko `OfferCard` (`md:w-auto` → `block`); pozostałe miejsca już zgodne.
3. **Aktywny filtr Galerii** — `FilterChip`: złoty obrys i złoty tekst zamiast wypełnienia; pogrubienie zostaje.
4. **Złote linki z podkreśleniem** (`link-underline-target--border`): „Czytaj” w `NewsCard`, „Czytaj dalej” w `NewsFeatured`, linki filarów w `Pillars`, `LecturesGalleryLink`. Bez zmian: nawigacja, stopka, wartości kontaktowe (`OnlineAside`), szary link w podpisach zdjęć.
5. **Etykieta nad H1 na Wystawach** — Garamond na złoto jak w ofertach (`font-serif text-size-body text-accent-text`); etykiety sekcji (doroczna, codzienna) bez zmian.
6. **Akcent kart** — reguła: belka u góry dla kart informacyjnych i kart cytatów w siatce (`OfferQuote`, `OfferQuoteGrid` bez zmian); belka z lewej tylko dla cytatu w toku tekstu (`AboutQuote`). Zmiana: `/kontakt` „Wejście od strony zakrystii” — lewa → góra. Bez zmian: karta spisu albumu (makieta v2), aktywny sezon w `SeasonAccordion`, krótkie kreski kolumn w O Akademii.
7. **H2 „Najbliższe” na `/`** — `role-row-title` → `role-section-h2` (34 / 26 px).

Pliki: `FactsBox.tsx`, `OfferCard.tsx`, `FilterChip.tsx`, `NewsCard.tsx`, `NewsFeatured.tsx`, `Pillars.tsx`, `LecturesGalleryLink.tsx`, `ExhibitionPage.tsx`, `UpcomingHighlights.tsx`, `contact.css`, `exhibition.css`, `news.css`. Bez nowych tokenów i zależności. Weryfikacja 390 / 1440 px, build + lint. Jeden checkpoint.

**Kryterium „gotowe”:** każda pozycja T1–T29 zamknięta albo świadomie odłożona (z adnotacją w §5); T30 nie blokuje zamknięcia k8; brak `[do uzupełnienia]` widocznego na produkcji poza uzgodnionymi wyjątkami; build + lint OK.

### Kawałek 9 — SEO, analityka, JSON-LD

**Zakres:** `docs/plan-claude-code.md` §3 etap 10, pkt 2 — metadata + OG, `sitemap.ts`, `robots.ts`, JSON-LD (`Organization`, `Person`, `Event` — K-17, `Course`, `Book`/`Article` — K-76), analityka bez ciasteczek (K-07, K-15), aktualizacja polityki prywatności (K-119). Plus pozycje z backlogu niżej oznaczone k9.

**Plan zatwierdzony 2026-10-26** (sesja planistyczna). Wszystko, co zależy od hostingu, wyłączone — patrz „Poza k9”.

**Stan wyjściowy:** `<title>` przez `navTitle()` (K-143) na wszystkich trasach; brak `description`, `metadataBase`, OG, canonical, `sitemap.ts`, `robots.ts`, JSON-LD. `Page.seo?: { description; ogImage? }` w modelu, nieużywane w `content/`. `<Breadcrumb>` widoczny tylko na albumie i artykułach (`/publikacje/[slug]`).

**Decyzje k9**

| ID | Decyzja |
| --- | --- |
| **K-155** | Host kanoniczny `https://www.akademiaikony.pl` — jak na obecnym WP (`rel=canonical` z `www`, 301 z wersji bez `www`). Przekierowanie na nowym hostingu — etap 11. |
| **K-156** | Obraz OG = **zdjęcie** (wariant B), nie obraz generowany `next/og`. Kadr 1200×630. Strony z własnym zdjęciem biorą je; wpisy, artykuły, album — `cover`. Kadry wybrane przez właściciela 2026-10-26 — tabela niżej. |
| **K-157** | JSON-LD: **bez** `FAQPage` (Google od 2023 nie pokazuje FAQ poza stronami rządowymi i medycznymi). `Person` — **tylko EJK**. `ExhibitionEvent` — tylko wystawa doroczna z datą `vernissage` w `annual.json` (dziś „Mistyka dziś”, 2027-06-12); wystawa stała bez. `Event` wykładów: `location` z `settings.json`, `offers` z `price` w `content/offers/wyklady.mdx` (400 zł / rok — cena za sezon). `Course` (kurs, LSŚ) **bez ceny** — cen kursu i pleneru nie podajemy na stronie. |
| **K-158** | `BreadcrumbList` na **wszystkich podstronach** (bez strony głównej), także tam, gdzie nie ma widocznego `<Breadcrumb>`; etykiety z `navigation.ts`. Zysk kosmetyczny (ścieżka w wynikach Google na desktopie), nie pozycja. |

**Kadry OG (K-156)** — źródła w `public/media/`; „kadr” = `object-position` przy przycięciu do 1200×630:

| Strona | Zdjęcie | Kadr |
| --- | --- | --- |
| `/` i domyślny (strony bez zdjęcia: Pracownia, Publikacje, Aktualności, polityka, 404) | `home/warsztaty.jpg` | środek |
| `/o-akademii` | `workshop/hero.jpg` | **dół** (50% 100% — mniej twarzy, więcej ikony) |
| `/warsztaty` | `workshop/hub-hero.jpg` | środek |
| `/warsztaty/kurs-roczny-i-trzyletni` | `offers/kurs-roczny-i-trzyletni/pracownia.jpg` | środek |
| `/warsztaty/letnia-szkola-swiatla` | `offers/letnia-szkola-swiatla/pracownia.jpg` (1260×504 — lekkie powiększenie) | środek |
| `/wyklady`, `/wyklady/archiwum`, `/wyklady/wykladowcy` | `home/wyklad.jpg` | środek |
| `/ikony` | `exhibition/permanent-three-icons.jpg` | środek |
| `/ikony/wystawy` | `exhibition/hero.jpg` | środek |
| `/kontakt` | `contact/kosciol-srodowisk-tworczych.jpg` | **góra** (50% 20%) |

Kadry przygotować jako pliki 1200×630 (np. `public/media/og/*.jpg`, skrypt `tsx` z `sharp` z zależności Next — bez nowej zależności) albo przez `opengraph-image.tsx` z obrazem źródłowym — wybór w 9a, zgłoszony w checkpoincie.

**Kawałki**

| Kawałek | Zakres | Pliki (orientacyjnie) |
| --- | --- | --- |
| **9a** Metadata i OG | `metadataBase` (K-155); `description` per trasa — propozycje Claude, gate K-122 w czacie przed zapisem do `content/` (`Page.seo.description`; wpisy i artykuły — `excerpt`); `openGraph` + `twitter` (`summary_large_image`), `og:locale` `pl_PL`, `og:site_name`; obrazy OG wg tabeli (K-156); `alternates.canonical` | `layout.tsx`, `page.tsx` tras, helper w `src/lib/`, `content/pages/*.json`, `pl.ts` |
| **9b** Indeksacja | `sitemap.ts` (trasy statyczne + wpisy, artykuły, album; `lastModified` z dat treści, gdzie są); `robots.ts` — indeksacja tylko przy zmiennej env oznaczającej produkcję, każde inne środowisko `Disallow: /` + `noindex` | `src/app/sitemap.ts`, `src/app/robots.ts` |
| **9c** JSON-LD | `Organization` (layout); `Person` EJK; `Event` — wykłady bieżącego sezonu (K-17); `ExhibitionEvent`; `Course` kurs i LSŚ; `Book` z `hasPart` z `Publication.chapters` (B2, K-137); `Article` z `isPartOf` → `Book`; `BreadcrumbList` (K-158). Jeden komponent emisji `<script type="application/ld+json">`. Walidacja: validator.schema.org + Rich Results Test (dev przez tunel albo wklejony HTML) | `src/lib/structured-data/*`, komponent `JsonLd` |
| **9d** Pod analitykę | Konwencja zdarzeń K-15: atrybuty `data-event` (nazwy zdarzeń + parametry) na CTA zapisów, `mailto:`, `tel:` — **bez skryptu analityki**, tak by podpięcie narzędzia w etapie 11 było jednym plikiem; konwencja opisana w briefie §7 / `CLAUDE.md`. Polityka prywatności: poprawka zdania o „osadzonej mapie Google Maps” — na `/kontakt` jest tylko link (gate K-122) | `Button`, `OfferSideCta`, `ContactRow`, `Footer`, `MdxLink`, `content/pages/polityka-prywatnosci.json` |

Kolejność 9a → 9b → 9c → 9d; checkpoint po każdym. Weryfikacja: build + lint; podgląd tagów (`curl` HTML), Facebook Sharing Debugger i walidator schema.org dopiero na stagingu (etap 11) — w k9 walidacja HTML lokalnie.

**Poza k9 (zależne od hostingu → etap 11):** ustawienie `SITE_ENV=production` w środowisku buildu produkcji (9b); wybór narzędzia analitycznego (K-07, zawieszone), jego skrypt i akapit o analityce w polityce (K-119); DoD „zdarzenia widoczne w panelu”; B1 / K-35 (CTA w nagłówku — po danych z analityki); weryfikacja Search Console (TXT w DNS) i wysłanie `sitemap.xml`; 301 z wersji bez `www`; testy OG i Rich Results na publicznym adresie.

### Blok R — Review serwisu (równolegle do k8)

**Zakres:** review techniczne (R0–R5), wizualne (V1–V4) i — po EJK — zgodności z planem i treści (C1–C2); poprawki osobnym planem `docs/archive/plans/10-review-fixes.md`. Plan, decyzje RV-1…RV-7 i postęp: **`docs/plans/10-review.md`**. Przejmuje z k10 ewaluację kodu i przegląd tras (RV-1).

### Kawałek 10 — Audyty, dokumentacja

**Zakres (okrojony przez RV-1):** ewaluacja kodu dodanego w k9 (delta po bloku R); Lighthouse dla 5 tras (`docs/lighthouse/`); synchronizacja dokumentów; przygotowanie testu 301 na stagingu (wykonanie — etap 11). Plus pozycje z backlogu niżej oznaczone k10 — B4 i B5 wchodzą jako wyłączenia do R0 i rozstrzygnięcie w `docs/archive/plans/10-review-fixes.md`.

**Plan zatwierdzony 2026-10-26** (sesja planistyczna). Decyzje:

| ID | Decyzja |
| --- | --- |
| **K10-1** | Lighthouse przez jednorazowe `npx lighthouse` — bez wpisu w `package.json`. |
| **K10-2** | Pomiar mobile **i** desktop dla 5 tras: `/`, `/warsztaty/kurs-roczny-i-trzyletni`, `/wyklady`, `/ikony`, `/aktualnosci`; na buildzie produkcyjnym (`prod-preview`, `next start -p 3005`). Progi DoD: a11y ≥ 95, wydajność ≥ 90 mobile. |
| **K10-3** | Trasa poniżej progu → poprawki w k10 (10c), nie odkładamy do etapu 11. |
| **K10-4** | `scripts/check-redirects.ts` powstaje w k10 (lista starych URL-i z briefu §5, status + cel); lokalnie uruchamiany w 10d, na stagingu — etap 11. |

**Kawałki** (checkpoint po każdym):

| Kawałek | Zakres | Pliki / wynik |
| --- | --- | --- |
| **10a** Delta kodu po k9 | Przegląd kodu z k9: `src/lib/metadata.ts`, `src/lib/structured-data/*`, `src/lib/analytics.ts`, `JsonLd`, `sitemap.ts`, `robots.ts`, `siteEnv.ts`, `content/seo.ts`. Kryteria: over-engineering, duplikacje, konwencje (`CLAUDE.md`, brief §7), Server/Client, strict. Jednorazowo `tsc`, `lint`, `knip`, `jscpd` (RV-3, bez zapisu do `package.json`). Drobne poprawki od razu, większe — propozycja w checkpoincie. | `docs/review/08-k9-delta.md` |
| **10b** Lighthouse | Pomiar wg K10-1/K10-2; raporty (HTML/JSON) + tabela wyników i wnioski. Rozstrzygnięcie **B6** (`imageLarge`, K-39) na podstawie wyników. | `docs/lighthouse/` (+ `README.md` z tabelą) |
| **10c** Poprawki po Lighthouse | Warunek K10-3 spełniony: mobile perf < 90 na 7 z 17 tras (`/` 87, `/ikony` 85, `/warsztaty` 87, `/publikacje` 87, album 86, `/ikony/wystawy` 89, `/o-akademii` 89). **Zakres uzgodniony 2026-10-26** — jeden pakiet wspólnych zasobów: ograniczenie blokującego CSS (2 arkusze, ~350 ms), analiza chunku JS 70 KB (~40 % nieużywane, polyfille `legacy-javascript`), `fetchpriority` na pierwszej miniaturze `/ikony`. **Bez zgody właściciela nie ruszamy:** fontów (EB Garamond `latin-ext` 111 KB jest potrzebny dla polskich znaków), jakości zdjęć (q90 z 8c), tokenów. Do rozstrzygnięcia: `text-decoration` obok kreski K-135 dla linku w akapicie (a11y 96 na `/o-akademii`, `/kontakt` — fałszywy alarm reguły `link-in-text-block`, próg ≥ 95 spełniony). **Pomiar po zmianach:** pełny, wszystkie 17 tras × mobile/desktop, do `docs/lighthouse/after-10c/`, porównanie z stanem przed (instrukcja w `docs/lighthouse/README.md`). Robiony w nowej sesji. | `docs/lighthouse/` + wg wyników 10b |
| **10d** Dokumenty, 301, discovery | (1) Synchronizacja briefu §3/§4/§7/§8, planu §2–§4 i DoD z kodem; zamknięte k8/k9 → archiwum. (2) `scripts/check-redirects.ts` (K10-4). (3) DoD etapu: punkty zależne od hostingu/publicznego adresu (walidator schema.org, podgląd OG, zdarzenia w panelu) oznaczone jako **przeniesione do etapu 11**, nie odhaczone. (4) Pozycja **„sesja discovery o hostingu”** w `docs/plan-claude-code.md` §3 etap 11: pytania K-09 (hosting), B9 (ISR / dobowy rebuild), K-07 (Plausible vs Umami), `SITE_ENV=production`, 301 z wersji bez `www` (K-155), B1/K-35 (CTA w nagłówku po danych analityki). | `docs/`, `scripts/check-redirects.ts` |

Kolejność 10a → 10b → (10c) → 10d. Kryterium „gotowe” k10: DoD etapu 10 — każdy punkt odhaczony albo świadomie przeniesiony do etapu 11 z adnotacją; build + lint OK.

## Backlog fali 2 — poza treścią

Pozycje techniczne i decyzje przeniesione z kawałków fali 1. Treść EJK — `docs/plan-claude-code.md` §5.

| # | Kawałek | Pozycja | Źródło |
| --- | --- | --- | --- |
| B1 | k9 | CTA „Zapisy” w nagłówku desktop — decyzja z danymi analityki (K-35) | `10-k7-layout.md` LY6 |
| B2 | k9 | JSON-LD `Book`: `hasPart` może korzystać z `Publication.chapters` (K-137) | `10-k5-album.md` § Ryzyka |
| B3 | k9 | Rozważyć `ExhibitionEvent` dla `/ikony/wystawy` | §3 etap 10 |
| B4 ✅ | k10 | `mdx-components.tsx` używa wartości arbitralnych Tailwind (`[&:has(>em:only-child)]…`) — wbrew konwencji repo. **Zamknięte:** w `mdx-components.tsx` jest 0 wartości arbitralnych (R4, status B4); `10/RF-6` | `10-k3-news.md` § Diagnoza |
| B5 ✅ | k10 | `scripts/migrate-wp/` — martwy kod po zamkniętej migracji (`report.ts` wskazuje na przeniesiony `scripts/migrate-report.md`); zdecydować: usunąć czy zostawić jako zapis. **Zamknięte:** usunięte w `10/RF-6` razem z 13 skryptami jednorazowymi i `archive/wp-fetch-static/`; historia w git | porządki 2026-10-04 |
| B6 | k10 | `imageLarge` w `IconWork` (K-39) — tylko jeśli Lighthouse lub przegląd pokaże, że cap skali nie wystarcza | `10-k2-lightbox.md` |
| B7 | po prezentacji | Sticky `FactsBox` na stronach ofertowych (K-37) | `10-k7-layout.md` LY6 |
| B8 | po prezentacji | Filtr Aktualności po wystawach dla linku „Fotorelacje z poprzednich wystaw dorocznych” (dziś `/aktualnosci` bez filtra) | `10-k3-news.md` § Ryzyka |
| B9 | etap 11 | Dobowy rebuild albo ISR na hostingu — warunek poprawnych kafli „Najbliższe” i stanu wystawy (K-136 N9, K-85) | `10-k4-home.md` N9 |
| B10 | właściciel / Claude Design | `design/README` nie opisuje makiety wystaw 13a/14a; **`design/README` — opis stopki nadal niezsynchronizowany** (w kodzie: **K-149** / Stopka v2; góra `#1a140f`, legal `#120e0b`) | `10-k1-exhibitions.md`, `10-k7-layout.md` |

## Dane sample w tym etapie

Brak nowych plików `sample`. Placeholdery `[do uzupełnienia]` — wiersz w `docs/plan-claude-code.md` §5.

## Kryteria ukończenia etapu (DoD)

Z `docs/plan-claude-code.md` §3, etap 10:

- [ ] przegląd wszystkich tras z briefu §3 odhaczony; lista poprawek po prezentacji zamknięta lub świadomie przeniesiona do wdrożenia;
- [ ] walidator schema.org bez błędów dla czterech typów; podgląd OG sprawdzony dla strony głównej i jednej ofertowej;
- [ ] zdarzenia analityczne widoczne w panelu narzędzia w środowisku testowym;
- [ ] przegląd kodu zakończony: usunięte lub uzasadnione miejsca over-engineered; brak oczywistych duplikacji i naruszeń konwencji repo;
- [ ] raport Lighthouse dla 5 tras (główna, kurs, wykłady, galeria `/ikony`, aktualności) w `docs/lighthouse/`;
- [x] lightbox `/ikony` na iOS Safari (K-38) — test OK 2026-10-03;
- [ ] `npm run build` i `npm run lint` bez regresji; dokumentacja zsynchronizowana z kodem i decyzjami etapu.

## Ryzyka i pytania otwarte

- **K-07** narzędzie analityczne — **zawieszone do sesji discovery o hostingu (etap 11)**; stan analizy: `docs/legacy-wp-analytics-notes.md` §5. k9 przygotowuje tylko konwencję zdarzeń (9d).
- **Prezentacja z klientem** — termin i staging; od niej zależą B7, B8 i część DoD #1.
- ~~**Tempo k8**~~ — backlog treści zamknięty 2026-10-25.
- **Przegląd UX** (`docs/archive/plans/10-ux-consistency-review.md`) — rozstrzygnięty i zrealizowany 2026-10-25 (kawałek 8c).

## Postęp

| Kawałek | Status | Uwagi |
| --- | --- | --- |
| 1–7 — fala 1 | ✅ | 2026-10-03 … 2026-10-04; tabela „Fala 1 — podsumowanie” wyżej |
| Stopka v2 (K-149) | ✅ | 2026-10-07; mapa stopki + `sectionNav.kontakt` (/kontakt · /polityka-prywatnosci); poza k7, po przeglądzie makiety Claude Design |
| 8 — treść EJK | ✅ 2026-10-25 | backlog T1–T29 — **29/29 ✅** w §5 (T15, T29 2026-10-25; T23, T31 2026-10-14; T6 anulowane — K-151); **8a** (K-151) ✅ 2026-10-14, OK właściciela 2026-10-25; pula zdjęć (`docs/archive/plans/10-photo-library-curation.md`) ✅ 2026-10-25; album v2 (`docs/archive/plans/10-album-mockup-prompt.md`) ✅ — wynik Claude Design wdrożony na `/publikacje/ikona-dzis`; kurs 2026-10-17: usunięta sekcja „Jak się zapisać” (rozmowa wstępna → wiersz „Zgłoszenia” w FactsBox), placeholder zdjęcia 4:3 nad CTA w „Dalsza droga”; LSŚ 2026-10-17: przepisane copy (lead, „Jak wygląda tydzień”, „Dlaczego warto…”, ramowy „Rytm dnia”), 4 cytaty z pleneru, placeholder zdjęcia głównego, `OfferClosingCta` na końcu strony; wykłady 2026-10-17: intro sezonu — „Cykl wykładów”, „zwykle dwa wykłady” (copy akceptowane przez EJK zostaje; nagrania dostępne, pojedynczych wejść brak); FactsBox wykładów — stały wiersz „Nagrania”, przy zamkniętych zapisach CTA „Powiadom mnie o zapisach” jak w kursie; wpis aktualności 2026-10-17: kolory prose stonowane (`--prose-color` → `--text-secondary`, `--prose-lead-color` → `--text-body`, usunięty `--text-prose` `#e6dac7` — korekta K-131/E1; Garamond bez zmian); `/kontakt` 2026-10-18: układ wg makiety **1f** (desktop 7/5) / **2a** (mobile) z `design/Akademia Ikony - Kontakt.dc.html` — wiersze z linią (etykieta · wartość: dwa e-maile z osobą, osobny „Telefon”, „Adres” łamany na 3 linie + ulica), po prawej zdjęcie fasady i blok „Wejście od strony zakrystii” (złota krecha, treść z `kontakt.mdx`, uwaga o braku barier, link „Otwórz w Mapach Google”), Organizator i „Akademia w sieci” jako dwa ostatnie, cichsze wiersze lewej listy (korekta **1g**, 16 px, `text-secondary`; zastępuje pasmo pod siatką z 1f); mobile: blok wejścia przed zdjęciem na pełną szerokość. Bez nowych tokenów (istniejące `--space-*`, `--role-row-title*`, `--accent-bar`, `--mission-bar-w`, `--line-neutral`, `--surface-card`); usunięte osierocone `--contact-email-*`, `--contact-aside-offset`. Pliki: `ContactPage.tsx`, nowe `ContactRow.tsx` i `EntranceNote.tsx`, `OnlineAside.tsx` (teraz dwa `ContactRow`), `ContactPhoto.tsx`, `contact.css`, `pl.ts` (`phoneLabel`, `entranceHeading`, `mapLinkLabel` — stringi z makiety, do akceptacji K-122). Odstępstwa: podpis zdjęcia z pełnym kredytem i licencją CC BY-SA (makieta ma sam „Fot. Adrian Grycuk”); `alt` bez zmian; adres „Senatorska 18B” z `settings.json` (stopka: Plac Teatralny 20 — rozbieżność istnieje, nie ruszana); link do Map to wyszukiwanie z nazwy kościoła i adresu (brak zatwierdzonego URL w `settings.json`); kolumna etykiet 1fr/2fr zamiast 190 px; łamanie adresu po „pw.” i „i św.” w kodzie, bo `settings.place` jest jednym ciągiem; commity `10/k8` na `feat/10-finishing`; `/warsztaty` (hub) 2026-10-21: układ wg makiety **2c** z `design/Akademia Ikony - Warsztaty.dc.html` — szerokie zdjęcie pracowni pod leadem (`ExhibitionFrame` wide: 3:2 mobile / 21:8 md), karty ofert bez zdjęć jako osobne kafle w języku kart opinii (`surface-card`, złota krecha, odstęp `offer-quotes-gap`, subgrid wyrównuje wiersze), CTA z nazwą oferty, końcowy blok „Masz pytania?” z `mailto:` bez tematu, SectionNav na mobile z krótkimi etykietami (`NavLink.shortLabel`); poprawki 2026-10-21: zdjęcie bez złotej ramki, kadr 2:1 na mobile (`--workshops-hub-photo-aspect-m`), `priority` (nowy prop `ExhibitionFrame`), kropki list w kartach, CTA kart z `Button compactMobile` (jedna linia na 390 px), opis kursu skrócony o „coraz trudniejsze przedstawienia” (równa liczba linii obu opisów); nowe sekcje 2026-10-21 (copy Claude, zaakceptowane — K-122): „Ikony naszych uczniów” (4 ikony uczniów przez `FeaturedIconsGallery`, link `/ikony#uczniowie`), FAQ „Zanim zaczniesz” (7 pytań, statyczne, pod JSON-LD `FAQPage` w k9), dwa cytaty (Artur, Adam — `OfferQuoteGrid`, 2 kolumny); kolejność: karty → ikony → FAQ → cytat → „Masz pytania?”; `getWorkshopTestimonials` → `getTestimonials` + `quoteAuthors` w `workshops-hub.json`; usunięte osierocone `--offer-card-image-h`, `.offer-card-exhibition-frame`, `pl.workshopsHub.imagePlaceholder`; T30 → §5A v2 |
| 8b — menu mobilne | ✅ 2026-10-22, OK właściciela 2026-10-25 | **Korekta 2026-10-23 (`345fb98`, zastępuje pkt 3):** dolny rząd szuflady usunięty („Zapisy na warsztaty”, Blog); menu odwzorowuje mapę stopki — doszły Publikacje i akordeon Kontakt (Kontakt · Polityka prywatności); `aria-controls` bez spacji. Pkt 1–6 wdrożone: `.menu-fab` (utilities.css, tokeny `--menu-fab-size`/`--menu-fab-offset`), dolny odstęp stopki pod przycisk wycofany po przeglądzie (2026-10-22); szuflada `fixed inset-0` z własnym paskiem i `role="dialog"`, stale zamontowana (`inert` gdy zamknięta), `.menu-drawer` — fade + przesunięcie 200 ms w obie strony, bez animacji przy `prefers-reduced-motion`; cały wiersz sekcji = przycisk akordeonu; `mainNav.children` = pełne `sectionNav` (stopka Warsztatów nadal `slice(1)`); prop `sectionActiveHref` z `resolveNav`; `pl.header`: + `menuCloseLabel`, − `contactCta`, `sectionExpandLabel`, `sectionCollapseLabel`. Przycisk nie chowa się przy otwartym menu (zakrywa go szuflada; fokus wraca na niego pewnie). Przy okazji przeglądu mobile: `trojca-swieta-2017.jpg` (pierwsza ikona galerii, lightbox ładował 1,8 MB) → 1200×1600, mozjpeg q82 4:2:0, 183 KB (limit 1600 px z K-138, jakość jak miniatury K-138), wymiary w `icons.json` |
| 8c — spójność UX | ✅ 2026-10-25, OK właściciela (commit `10/8c: UX consistency…`) | pkt 1–7 wdrożone: `FactsBox` CTA i telefon `lg` + `compactMobile` (64 px; jedna linia też na 375 px); `OfferCard` CTA `block`; `FilterChip` aktywny = złoty obrys; „Czytaj” / „Czytaj dalej” w `NewsCard` / `NewsFeatured` ze stałym podkreśleniem `link-underline-target--border` (hover: kolor kreski) — `Pillars` i `LecturesGalleryLink` już je miały; etykieta nad H1 na Wystawach Garamond złoty; `.contact-entrance` belka u góry; H2 „Najbliższe” `role-section-h2`. Sprawdzone 375 / 390 / 1440 px (bez poziomego scrolla). Przy okazji: `.claude/launch.json` + konfiguracja `prod-preview` (`next start -p 3005`) — podgląd, gdy `next dev` z innej sesji zajmuje folder |
| R — review serwisu | ✅ część techniczna i wizualna 2026-10-06 | R0–R5, RF-0…RF-21, V1–V4 zamknięte, w `main` (PR #15); zostaje C1–C2 — warunek (T1–T29) spełniony 2026-10-25; postęp w `10-review.md`, `docs/archive/plans/10-review-fixes.md` |
| 9 — SEO / analityka | ✅ 2026-10-26, OK właściciela (9a–9d) | kawałki 9a–9d, decyzje K-155…K-158; analityka (K-07) → etap 11. **9a:** `pageMetadata()` w `src/lib/metadata.ts` (description, canonical, OG, Twitter `summary_large_image`, `og:locale` `pl_PL`, `og:site_name`), `metadataBase` + domyślne OG/description w `layout.tsx` (fallback dla 404); `seo: { description, ogImage? }` w pliku treści każdej trasy statycznej, odczyt przez `src/content/seo.ts`; nowe `content/pages/aktualnosci.json`, `publikacje.json` (lead przeniesiony z `pl.ts`), `ikony.json`; opisy — copy Claude, zaakceptowane (K-122) z korektą `/wyklady/wykladowcy`; obrazy OG: `scripts/generate-og-images.ts` (sharp) → `public/media/og/*.jpg` 1200×630 wg tabeli K-156; wpisy — `excerpt` + `cover` (bez okładki — domyślny), album — `lead` + `cover`, artykuły — `excerpt` + okładka albumu (teksty z mediów — domyślny). **9b:** `src/app/sitemap.ts` (97 adresów: trasy statyczne z `getStaticPagePaths()` w `seo.ts`, wpisy, album, artykuły; `lastModified` tylko z dat treści — data wpisu, jeśli minęła, i `lastUpdated` polityki; `revalidate` 1 d), `src/app/robots.ts`, `src/lib/siteEnv.ts`; indeksacja tylko przy `SITE_ENV=production` (czytane przy buildzie), w innym razie `Disallow: /` + `noindex, nofollow` z `layout.tsx`. **Etap 11: ustawić `SITE_ENV=production` na hostingu produkcyjnym — bez niej Google nie zaindeksuje strony.**. **9c:** jeden emiter `JsonLd` (`src/components/core/JsonLd.tsx`, nbsp → spacja, `<` escapowane); budowniczy w `src/lib/structured-data/` (`site`, `breadcrumbs`, `person`, `events`, `course`, `publications`); `Organization` w `layout.tsx` (z `parentOrganization` → Fundacja, `founder` → EJK, `sameAs` FB/YT/blog); `BreadcrumbList` w `SectionPageShell` na każdej podstronie (K-158; strony spoza nawigacji podają `breadcrumbTitle`); `Person` EJK na `/o-akademii`; 11 × `Event` na `/wyklady` (data bez godziny, `offers` 400 PLN, `performer`, `superEvent` cyklu); `ExhibitionEvent` „Wystawa doroczna Akademii Ikony „Mistyka dziś”” (szablon `pl.meta.annualExhibitionEventName`, decyzja właściciela) (2027-06-12 → 2027-08-31); `Course` kurs (z miejscem) i LSŚ (bez), bez ceny; `Book` z `hasPart` z `chapters` (B2) i ofertą 140 PLN; `Article` z `isPartOf` → `Book` dla tekstów z albumu; nowe `pl.meta.foundingYear`, `foundationName`; helper `getArticleAlbum()` w `publications.ts`. Walidacja: JSON poprawny w 102 plikach HTML; validator.schema.org / Rich Results — etap 11. **9d:** `src/lib/analytics.ts` (`enroll_click` / `email_click` / `phone_click`, `enrollEvent()`, `linkEvent()`); auto-zdarzenie z `href` w `Button`, `TextLink`, `a` w `mdx-components.tsx`, `Footer`; `enroll_click` jawnie w `FactsBox` i `OfferClosingCta`; 0 linków `mailto:`/`tel:` bez `data-event` w 102 plikach HTML; konwencja w brief §7 i `CLAUDE.md`; polityka: zdanie o mapie → „link do Map Google” (copy Claude, zaakceptowane K-122), `lastUpdated` 2026-10-26 |
| 10 — audyty / docs | 🔵 plan zatwierdzony 2026-10-26 | okrojony przez RV-1; kawałki 10a (delta k9) → 10b (Lighthouse) → 10c (poprawki, warunkowo) → 10d (dokumenty, 301, discovery); decyzje K10-1…K10-4; 2/4 — **10b ✅ 2026-10-26** (`docs/lighthouse/README.md`: a11y 100 i BP 100 wszędzie, desktop ≥ 99, mobile perf 85–91; pod progiem `/` 87 i `/ikony` 85 → 10c); **10a ✅ 2026-10-26** (`docs/review/08-k9-delta.md`: tsc/lint 0, jscpd TSX 0 klonów; 2 zbędne eksporty z k9 zdjęte; reszta uwag knip poza k9 bez zmian); następne: 10b |
