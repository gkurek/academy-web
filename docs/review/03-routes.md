# Review 10/R — R3: trasy

Data: 2026-10-04 · gałąź `feat/10-review` (HEAD `681ac1f`) · model: Opus 5.5 · świeża sesja (RV-5, RV-6)  
Zakres: `src/app/**` — 21 plików `page.tsx` / `layout.tsx` / `not-found.tsx` (597 linii), plus komponenty stron i powłoki, które trasy składają (`SectionPageShell`, `TextPageShell`, `*Page.tsx`) — wyłącznie w zakresie tego, **jak** trasa je składa. Wejście: `docs/review/00-scope.md` (wyłączenia §1, wyniki narzędzi §3), sekcje „Do weryfikacji” w `01-data.md` i `02-components.md`.  
Metoda: lektura wszystkich tras i powłok; `grep` po repo; na stagingu (bez zmian w repo): kody HTTP, nagłówki cache i TTFB przez `curl`, `<title>` 19 tras, `aria-current` w HTML z serwera, w przeglądarce — żądania RSC przy zmianie filtra na `/ikony`.  
Review **niczego nie poprawia** — propozycje to kierunki dla `10-review-fixes.md` (R5).

Wagi: `bug` · `ryzyko` · `niespójność` · `upraszczanie` · `drobiazg`. Koszt: S / M / L.

---

## Podsumowanie

| Waga | Liczba | ID |
| --- | --- | --- |
| bug | 0 | — |
| ryzyko | 2 | R3-01, R3-02 |
| niespójność | 4 | R3-03, R3-07, R3-08, R3-10 |
| upraszczanie | 3 | R3-04, R3-05, R3-06 |
| drobiazg | 2 | R3-09, R3-11 |

Razem 11 zgłoszeń. Bugów nie znalazłem — trasy są cienkie, a błędy, które widać na stronach, mają źródło w danych (R1) albo komponentach (R2).

Mocne strony warstwy (żeby R5 nie „naprawiało” rzeczy działających): trasy dynamiczne mają `generateStaticParams` i spójne `notFound()` dla nieznanego slugu (staging: `/aktualnosci/nie-istnieje` i `/publikacje/nie-istnieje` → 404); `params` / `searchParams` jako `Promise` zgodnie z Next 16; jedno źródło szablonu tytułu w `layout.tsx` (`%s · Akademia Ikony`); fonty przez `next/font` z `latin-ext`; skip link w layoucie; żadna trasa nie ma hardkodowanej polskiej etykiety w JSX — tytuły i etykiety idą z `pl.ts` albo `navigation.ts`; przekierowania 301 z `docs/redirects.json` działają (staging: `/ikony/wystawa` → **308**).

---

## Punkty przekazane z R0–R2 — rozstrzygnięcia

| Skąd | Punkt | Wynik R3 | Gdzie |
| --- | --- | --- | --- |
| R1-07 | `/aktualnosci/[slug]` bez `revalidate` | **Potwierdzone.** Spis tras zależnych od „dzisiaj” jest kompletny: `/` (`UpcomingHighlights`), `/ikony/wystawy` (`getExhibitionNowNext`) — obie z `revalidate = 86400` — i `/aktualnosci/[slug]` (`NewsArticlePage.tsx:56`, `getNewsEventPhase`) — **bez**. Pozostałe trasy (w tym `/aktualnosci`, `/wyklady`, oferty) nie liczą nic z daty. Kierunek: `export const revalidate = 86400` na `/aktualnosci/[slug]`, jak K-85. Wartość musi zostać literałem w pliku trasy (Next wymaga statycznie analizowalnej konfiguracji segmentu), więc wspólna stała odpada — wystarczy komentarz z odsyłaczem do K-85. | odsyłacz do R1-07, bez nowego ID |
| R1-19 | sprawdzanie `undefined` po `getAboutPage` / `getWorkshopPage` | **Potwierdzone:** `src/app/o-akademii/page.tsx:8–10`, `src/app/pracownia/page.tsx:8–10` — martwe gałęzie `notFound()`. Szerszy wzorzec (wymagana treść → cichy 404) | R3-01 |
| R2-12 | jedna konwencja `active` / `section` / `sectionActive`, helper `navLabel` | **Rozstrzygnięte:** stan nawigacji wyprowadzany z adresu trasy jedną funkcją w `navigation.ts`. Nowy aspekt: `aria-current="page"` na linku sekcji nadrzędnej (staging) | R3-03 |
| R2-08 | `notFound()` zamiast `null` w hubie publikacji | **Rozstrzygnięte inaczej niż w R2:** ani `null`, ani `notFound()` — album to treść wymagana, jego brak ma przerwać build (stopka zawsze linkuje do `/publikacje`, więc 404 byłby zepsutym linkiem w każdej stopce) | R3-01 |
| R2 „Do weryfikacji” | `/ikony` dynamiczna, `router.replace` przy filtrach | **Potwierdzone pomiarem** | R3-04 |
| R0 §4 | klon jscpd kurs ↔ LSŚ `page.tsx` | potwierdzony, obejmuje też `/ikony/na-zamowienie` | R3-05 |
| R0 §4 | `/ikony/wystawa` | plik trasy jest martwy — przekierowanie z konfiguracji działa wcześniej | R3-06 |
| R0 §4 | brak `/ikony/[slug]` | **Bez zgłoszenia.** Brief §3: „opcjonalnie w v1”. Od strony tras: pojedyncza ikona nie ma adresu, lightbox nie jest linkowalny. Decyzja zakresowa → C1. | C1 |

---

## Zgłoszenia

### Ryzyka

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R3-01** | ryzyko | `src/app/warsztaty/kurs-roczny-i-trzyletni/page.tsx:14–17`, `letnia-szkola-swiatla/page.tsx:16–19`, `ikony/na-zamowienie/page.tsx:15–18`, `wyklady/page.tsx:13–17` (`getOffer` ze stałym slugiem → `notFound()`); `o-akademii/page.tsx:8`, `pracownia/page.tsx:8` (R1-19); `src/components/publications/PublicationsHubPage.tsx:22–31` (R2-08); `aktualnosci/[slug]/page.tsx:12–14` (params z `manifest.json`, wpis z `news-registry.ts` — R1-09) | Trasy o **stałym** adresie traktują brak swojej treści jak nieznany slug: zmiana nazwy pliku `content/offers/*.mdx`, literówka w slugu albo rozjazd manifestu z rejestrem wpisów kończy się podczas generowania statycznego wyrenderowaniem strony 404 pod adresem z menu — build przechodzi, błąd widać dopiero na produkcji. (Zachowanie Next przy `notFound()` w prerenderze; nie sprawdzałem buildem, bo review nie zmienia kodu). Hub publikacji ma trzeci wariant: `null` i strona bez nagłówka i stopki. | Rozróżnić „nieznany slug z URL” (`notFound()` — zostaje w `[slug]`) od „brak treści wymaganej przez trasę” (wyjątek przy buildzie). Np. `requireOffer(slug: OfferSlug)` w `src/content/offers.ts` z typem slugów jako unią, rzucające błąd; to samo dla albumu w hubie publikacji. Gałęzie z R1-19 usunąć razem ze zdjęciem `\| undefined`. Dla `[slug]` wpisów — check manifest ↔ rejestr z R1-09 zamyka lukę. | S |
| **R3-02** | ryzyko | `src/app/publikacje/[slug]/page.tsx:14–19, 34–47` | Album i artykuły dzielą jedną przestrzeń slugów bez kontroli kolizji: przy tym samym slugu `generateStaticParams` zwróci duplikat, a strona po cichu pokaże album (`loadPublicationBySlug` sprawdzane pierwsze), artykuł będzie nieosiągalny. Dziś brak kolizji (1 album + 4 artykuły). Do tego trasa czyta rejestr `articleModules` wprost, z pominięciem warstwy `src/content/articles.ts` (`getArticles()`). | Asercja rozłączności slugów przy imporcie (w `articles.ts` albo `publications.ts`, jak inne walidacje R1); `generateStaticParams` przez `getPublications()` + `getArticles()`. | S |

### Niespójności

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R3-03** | niespójność | wzorzec `find(…)!.label`: **16×** w 10 plikach `src/app/**` + 8× w komponentach (R2-12); `sectionNav.X[0].label`: `ikony/page.tsx:5`, `warsztaty/page.tsx:10`, `wyklady/page.tsx:8`; `section` na sztywno w komponencie: `ExhibitionPage.tsx:112`, `GalleryPage.tsx:42`, a od trasy w `LecturesHubPage`, `OfferPage`…; `pl.header.newsLink` jako klucz aktywnej pozycji: `aktualnosci/page.tsx:19`, `aktualnosci/[slug]/page.tsx:37`; `active="Publikacje"` w `ArticlePage.tsx:14`, `PublicationAlbumPage.tsx:20`, `PublicationsHubPage.tsx:21`; `Header.tsx:28–33` | **Decyzja dla R2-12.** Stan nawigacji jest dziś ustalany na trzy sposoby (trasa liczy i przekazuje / komponent liczy sam / mieszanie: trasa daje `active`, komponent wpisuje `section`), zawsze przez ręczne wyszukanie etykiety po `href`. Skutki uboczne: (1) Aktualności dopasowują aktywną pozycję po etykiecie z `pl.ts`, a nie z `navigation.ts` — zmiana etykiety w `navigation.ts` po cichu zgasi podkreślenie; (2) publikacje przekazują `active="Publikacje"`, którego nie ma w `mainNav` — martwy prop; (3) **staging:** na `/warsztaty/kurs-roczny-i-trzyletni` dwa linki mają `aria-current="page"` (`/warsztaty` w nagłówku i `/warsztaty/kurs-…` w `SectionNav`), na `/aktualnosci/nabor-kursu-2026-2027` — link `/aktualnosci`. `aria-current="page"` na sekcji nadrzędnej mówi czytnikowi ekranu, że to bieżąca strona. | Jedna funkcja w `src/navigation.ts`: `resolveNav(path)` → `{ active, section, sectionActive }` — sekcja = ta z `sectionNav`, która zawiera `path`; pozycja główna = pozycja `mainNav` o `href` równym hubowi sekcji, a gdy sekcji brak — najdłuższy prefiks (`/aktualnosci/[slug]` → Aktualności, `/publikacje` → nic). `SectionPageShell` przyjmuje sam `path`; trasy podają własny adres, komponenty stron go przekazują. `Header` / `SectionNav`: `aria-current="page"` tylko przy `href === path`, w pozostałych przypadkach `"true"`. Znika 24× `find()!`, `pl.header.newsLink` jako klucz i propy `active` / `section` / `sectionActive` z ok. 15 komponentów. | M |
| **R3-07** | niespójność | `src/app/warsztaty/page.tsx:17–57`; `src/app/page.tsx:16–37`; `src/app/not-found.tsx:16–53` | Trzy trasy składają stronę same, choć reszta deleguje do komponentu `*Page` przez `SectionPageShell`: (1) `/warsztaty` ma nagłówek, lead i siatkę kart w pliku trasy, z rzutowaniem `offer.slug as keyof typeof pl.workshopsHub.cards` i cichym `return null`, gdy dla oferty brak karty w `pl.ts` (nowa oferta warsztatowa zniknie z huba bez błędu); (2) `/` i (3) 404 ręcznie powtarzają `Header` + `main#main-content` + `Footer` — w 404 klasy `main` są kopią 1:1 z `SectionPageShell.tsx:23`. Zmiana powłoki (np. `inert` z R2-02, slot z R2-16) trzeba będzie pamiętać zrobić w trzech miejscach. | `WorkshopsHubPage` w `components/` (jak `LecturesHubPage`), brak karty = błąd przy buildzie albo karta z danych oferty; `SectionPageShell` z wariantem bez paddingu `main` (np. `flush`) dla strony głównej; 404 przez `SectionPageShell`. Lista linków w 404 — patrz R2-20 (`NavUnderlineLink`). | S |
| **R3-08** | niespójność | ładuje trasa: `wyklady/*`, `aktualnosci/*`, oferty, `o-akademii`, `pracownia`, `publikacje/[slug]`, `polityka-prywatnosci`; ładuje komponent: `ExhibitionPage.tsx:39–45`, `GalleryPage.tsx:23–32` (dostaje surowe `searchParams`), `PublicationsHubPage.tsx:22–24`; mieszane: `kontakt/page.tsx:8` (trasa daje `Content`, komponent czyta `settings`) | Dwie konwencje podziału „trasa ↔ komponent strony”: w jednych trasa pobiera dane i podaje gotowe propsy, w innych komponent sam woła `src/content/*`, a trasa jest pustą przelotką. Przez to trasa nie może sama obsłużyć braku treści (R3-01 / R2-08), a komponenty stron mają różny kształt API. (`getSiteSettings()` jako dane globalne — w porządku w komponentach.) | Konwencja: trasa = dane + adres (`path` z R3-03) + `notFound` / wymagana treść; komponent `*Page` = widok z propsów. Migracja przy okazji R3-03 / R3-04, bez osobnej paczki. | S |
| **R3-10** | niespójność | `<title>` na stagingu; trasy bez `metadata`: `/`, `/o-akademii`, `/pracownia`, `/warsztaty`, oba warsztaty, `/wyklady` + 2 podstrony, `/ikony`, `/ikony/na-zamowienie`, `/aktualnosci`; `kontakt/page.tsx:5, 13–15`, `polityka-prywatnosci/page.tsx:11–13` | **12 z 19** tras ma ten sam tytuł dokumentu („AKADEMIA IKONY – Studium…”) — poza SEO to WCAG 2.4.2 (strona ma opisowy, rozróżnialny tytuł), a karty przeglądarki i historia są nieodróżnialne. Tam, gdzie tytuł jest, źródło jest różne (`pl.*.title`, etykieta z `navigation.ts`, tytuł wpisu), a eksport `metadata` raz nad, raz pod komponentem; `/kontakt` liczy etykietę tylko dla tytułu, a `ContactPage` liczy ją drugi raz. **Wejście dla k9** (generateMetadata per strona jest w zakresie k9) — zgłaszam aspekt dostępności i spójności, nie SEO. | W k9: tytuł każdej trasy z jednego źródła — dla stron z nawigacji z `resolveNav(path)` (R3-03), dla szczegółów z danych; `metadata` zawsze nad komponentem. R5 decyduje, czy minimalne tytuły wchodzą do paczek RF, czy czekają na k9. | S |

### Upraszczanie

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R3-04** | upraszczanie | `src/app/ikony/page.tsx:7–20`; `src/components/gallery/GalleryPage.tsx:23–39`; `GalleryFilters.tsx:36–49` | `/ikony` jest jedyną trasą renderowaną na żądanie — tylko dlatego, że czyta `searchParams` (filtr `?temat=` po 5 tematach z 52 ikon). **Staging:** `Cache-Control: private, no-store`, `X-Vercel-Cache: MISS` przy każdym wejściu, TTFB 0,27–0,33 s (strony statyczne 0,12–0,20 s); każdy klik w chip = `router.replace` → nowe żądanie RSC do funkcji (24 KB, ok. 190 ms) i ponowny pomiar siatki (R2-01). Czyszczenie złego / starego parametru (`?temat=xyz`, `?autor=`) robi efekt w kliencie po renderze z kodem 200. `router.replace` nie dodaje wpisu historii — „Wstecz” po filtrowaniu wychodzi z galerii (do decyzji, czy to zamierzone). | Trasa statyczna; filtr w kliencie na danych, które i tak są w stronie: komponent z `useSearchParams` w `Suspense`, URL aktualizowany `history.replaceState` (albo `pushState`, jeśli „Wstecz” ma cofać filtr). Wtedy znika `searchParams` z trasy, `needsUrlCleanup` z propsów i rundy do serwera. Robić razem z R2-01 / R2-19 (przebudowa siatki), bo deep link `?temat=` przy renderze serwerowym pokaże najpierw całość. | M |
| **R3-05** | upraszczanie | `src/app/warsztaty/kurs-roczny-i-trzyletni/page.tsx:9–38` ↔ `letnia-szkola-swiatla/page.tsx:11–41` (klon jscpd, 13 linii) ↔ `ikony/na-zamowienie/page.tsx:10–37`; `src/components/content/OfferPage.tsx:30–40` | Trzy trasy ofert powtarzają: stały slug, dwa wyszukania etykiet nawigacji, `getOffer` + `notFound`, i składanie slotów, które wynikają **wprost z danych oferty**: `leadExtra` → `OfferLeadExtra` (kurs, LSŚ — identycznie), `leadIntro` → `OfferLeadIntro` (zamówienie), `quote` → `OfferQuote` (kurs). Właściwie specyficzne dla trasy są tylko opinie z pleneru (LSŚ) i `afterBodySlot` zamówienia. | `OfferPage` sam renderuje `OfferLeadExtra` / `OfferLeadIntro` / `OfferQuote`, gdy pole jest w danych; trasa podaje tylko slug (przez `requireOffer`, R3-01), `path` (R3-03) i ewentualny slot specyficzny. Każda trasa oferty skraca się do kilku linii, klon znika. | S |
| **R3-06** | upraszczanie | `src/app/ikony/wystawa/page.tsx:1–5`; `docs/redirects.json:124–125` | Martwa trasa: `/ikony/wystawa` jest już w przekierowaniach z konfiguracji, które Next wykonuje przed routingiem. **Staging:** `/ikony/wystawa` → **308** (z konfiguracji; `redirect()` z pliku trasy dałby 307). Plik nigdy się nie wykonuje, a w buildzie generuje zbędną stronę statyczną. | Usunąć `src/app/ikony/wystawa/`. | S |

### Drobiazgi

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R3-09** | drobiazg | `src/app/layout.tsx:35` vs `not-found.tsx:19`, `TextPageShell.tsx:60`, `ContactPage.tsx:20`, `ArticlePage.tsx:23`, `PublicationAlbumPage.tsx:26`, `PublicationsHubPage.tsx:44` | Layout już ogranicza szerokość do `max-w-content-max`; sześć powłok stron powtarza wewnątrz `main` (po paddingu) `mx-auto w-full max-w-content-max`, które nigdy nie zadziała — a pozostałe strony tego nie mają. Szum, który utrudni R4 / V1 ustalenie, skąd bierze się szerokość treści. | Usunąć wewnętrzne ograniczenia albo przenieść szerokość treści w jedno miejsce (`SectionPageShell`) — wspólnie z R4 (spacing powłok). | S |
| **R3-11** | drobiazg | `src/app/aktualnosci/[slug]/page.tsx`, `src/app/publikacje/[slug]/page.tsx` | Brak `export const dynamicParams = false`: nieznany slug uruchamia render na żądanie (staging: `/aktualnosci/nie-istnieje` → 404 z `X-Nextjs-Prerender: 1`, `X-Vercel-Cache: MISS`). Lista slugów jest w całości znana przy buildzie. | `dynamicParams = false` na obu trasach — 404 statyczne, bez wywołania funkcji. Przy dodaniu `revalidate` (R1-07) nadal poprawne: rewalidowane są tylko ścieżki z `generateStaticParams`. | S |

---

## Do weryfikacji w kolejnych fazach

- **R4 (przekrojowe):** treść redakcyjna w `pl.ts` zamiast `content/` — `pl.home.hero` (tytuł, lead, obraz), `pl.home.testimonial` (cytat i autor), `pl.workshopsHub.cards` (zajawki, punkty, obrazy kart) — do sprawdzenia wobec reguły `CLAUDE.md` „treści redakcyjne wyłącznie w `content/`”; `pl.header.newsLink` jako duplikat etykiety z `navigation.ts` (używany też w `HeaderMobileMenu.tsx:276`); źródło szerokości treści (R3-09).
- **R5:** R3-03 + R3-08 + R3-05 to jedna paczka „powłoka i nawigacja” (zmienia sygnatury komponentów stron, dotyka R2-12, R2-20); R3-04 razem z R2-01 / R2-19 (galeria); R3-01 razem z R1-19 / R1-09 / R2-08.
- **k9:** tytuły dokumentów (R3-10); `layout.tsx` bez `metadataBase` (OG — zakres k9).
- **V4:** po R3-03 sprawdzić czytnikiem `aria-current` w nagłówku, `SectionNav` i menu mobilnym (R2-09).
- **C1:** `/ikony/[slug]` (brief §3, „opcjonalnie w v1”).
