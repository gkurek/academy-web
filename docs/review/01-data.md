# Review 10/R — R1: warstwa danych

Data: 2026-10-04 · gałąź `feat/10-review` (HEAD `681ac1f`) · model: Opus 5.5 · świeża sesja (RV-5, RV-6)  
Zakres: `src/content/*` (19 plików), `src/lib/*` (5), `src/config/news.ts`, `src/content/types.ts`. Wejście: `docs/review/00-scope.md` (wyłączenia §1, knip / jscpd §3.4–3.5).  
Metoda: lektura całości kodu; jednorazowy skrypt w Node (tylko odczyt, w scratchpadzie, poza repo) na `content/*.json` i `content/news/manifest.json`; sprawdzenie trzech podejrzeń na stagingu (`/`, `/warsztaty/kurs-roczny-i-trzyletni`, `/wyklady/archiwum`).  
Review **niczego nie poprawia** — propozycje to kierunki dla `10-review-fixes.md` (R5).

Wagi: `bug` · `ryzyko` · `niespójność` · `upraszczanie` · `drobiazg`. Koszt: S / M / L.

---

## Podsumowanie

| Waga | Liczba | ID |
| --- | --- | --- |
| bug | 3 | R1-01, R1-02, R1-03 |
| ryzyko | 7 | R1-04, R1-05, R1-07, R1-08, R1-09, R1-16, R1-17 |
| niespójność | 4 | R1-06, R1-11, R1-14, R1-18 |
| upraszczanie | 5 | R1-10, R1-12, R1-13, R1-15, R1-19 |
| drobiazg | 2 | R1-20, R1-21 |

Razem 21 zgłoszeń.

Mocne strony warstwy, żeby R5 nie „naprawiało” rzeczy działających: walidacja przy imporcie modułu (featured, layout, `columnImageIndex`, taksonomia ikon, spis albumu, nakładanie się override'ów) przerywa build przy złych danych. `manifest.json` jest dziś zgodny z MDX (69/69 slugów, 0 rozjazdów `date`/`kind`/`layout`). Nie ma duplikatów slugów ikon, dat w sezonach wykładów ani nieposortowanych sezonów.

---

## Zgłoszenia

### Bugi

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R1-01** | bug | `src/content/types.ts:51` (`enrollmentOpen`), `src/components/content/FactsBox.tsx:73,146`; dane `content/offers/kurs-roczny-i-trzyletni.mdx:28,34` | Stan zapisów ma **dwa niezależne źródła**: ręczny `enrollmentOpen: boolean` (FactsBox) i daty ISO `enrollmentClose` / `registrationClose` (`upcoming.ts`). **Na stagingu 2026-10-04:** oferta kursu pokazuje „Zgłoszenia: Do 24 września 2026” i główne CTA „Napisz zgłoszenie”, a strona główna w „Najbliższe” liczy z dat, że zapisy są zamknięte („Kurs rusza 6 października”). | Wyliczać stan otwarty / zamknięty z dat ISO jedną funkcją, wspólną dla FactsBox i `upcoming.ts`; `enrollmentOpen` zostawić najwyżej jako ręczny override. Alternatywa minimum: ostrzeżenie przy buildzie, gdy `enrollmentOpen: true`, a `enrollmentClose` jest w przeszłości. | M |
| **R1-02** | bug | `src/content/lectures.ts:113–127` (najpierw katalog, potem profil), `src/content/upcoming.ts:267–269` (najpierw profil, potem katalog), `src/content/authors.ts:18–27` (tylko profil) | Dwa rejestry wykładowców (`lecturers.json` — 26 osób, `lecturer-directory.json` — 32, część wspólna 21). Trzy miejsca czytają je w **różnej kolejności pierwszeństwa**. W 5 wspólnych slugach dane się różnią: `marek-szymula` „Szymuła” / „Szymula”, `dariusz-klejnowski-rozycki` „ks. prof. dr hab. / UO” / „dr hab. / prof. UO”, `ewa-kocoj`, `maciej-biskup`, `irina-tatarova` (afiliacja). **Na stagingu** `/wyklady/archiwum` pokazuje „Ks. dr Marek Szymula”, a profil i „Najbliższe” — „Szymuła”. | Jeden rejestr (profil = nadzbiór pól, katalog jako pola opcjonalne) albo jedna funkcja `resolveLecturer(slug)` z jednym pierwszeństwem. Do tego walidacja przy buildzie, że pola wspólne w obu plikach są równe. Poprawka samych danych to treść (`content/`) — do backlogu T. | M |
| **R1-03** | bug | `src/content/lectures.ts:97–102, 117–120` (`slugToDisplayName`) | Slug spoza obu rejestrów jest po cichu zamieniany na nazwisko z wielkiej litery: **traci polskie znaki i tytuły**. **Na stagingu** `/wyklady/archiwum` (2017/2018 — 10 kwietnia, 2021/2022 — 15 marca) pokazuje „Krzysztof Sokolowski”. Nie pokrywa tego T18 (dotyczy sezonów 2012–2014). | Nieznany slug = błąd albo ostrzeżenie przy buildzie, nie cichy fallback. Brakujący wpis w rejestrze to treść → do backlogu T. | S |

### Ryzyka

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R1-04** | ryzyko | `src/lib/mediaFileExists.ts:7–13`; wywołania `src/components/exhibition/ExhibitionPage.tsx:94–109`, `ExhibitionFrame.tsx:35` | `existsSync(process.cwd()/public/…)` w czasie renderu, na trasie z ISR (`/ikony/wystawy`, `revalidate = 86400`). Na Vercel katalog `public/` jest serwowany przez CDN i nie ma gwarancji, że trafi do systemu plików funkcji. Po pierwszej rewalidacji zdjęcia mogą znikać i wracać placeholdery. **Dziś niewidoczne**, bo kadry to i tak placeholdery (T19). | Rozstrzygać obecność pliku przy buildzie (skrypt albo flaga w danych) zamiast `fs` w renderze; albo ufać danym i usunąć sprawdzanie. Weryfikacja na stagingu ≥ 24 h po deployu z prawdziwymi zdjęciami T19. | M |
| **R1-05** | ryzyko | `src/content/lectures.ts:21` i `:1–42`, `src/content/exhibition.ts:20, 30–45`, `content/lectures/archive.json` (`lastSeason`) | Bieżący sezon jest zapisany w **czterech miejscach**: `CURRENT_SEASON_SLUG` dwa razy (lectures, exhibition), `archive.json.lastSeason` (musi być = bieżący − 1) i statyczna lista 15 importów JSON z mapą `seasonModules`. Zmiana sezonu wymaga skoordynowanych edycji kodu i treści. `isKnownLectureSeasonSlug` w exhibition sprawdza zakres lat zamiast `getSeason()`, więc przepuszcza sezon bez pliku. Gałąź `buildPlaceholderSeason` jest dziś martwa (wszystkie sezony 2012–2025 mają pliki). | Jedno źródło (np. `currentSeason` w `archive.json` albo wyliczanie z `lastSeason + 1`), stała eksportowana z `lectures.ts`; rejestr sezonów generowany skryptem jak `news-registry.ts`; w exhibition walidacja przez `getSeason()`. | M |
| **R1-07** | ryzyko | `src/content/news.ts:383–407` (`getNewsEventPhase`); `src/app/aktualnosci/[slug]/page.tsx` (SSG, bez `revalidate`) | Faza „zapowiedź” wpisu `wydarzenie` (z CTA, K-134) jest liczona z daty buildu, a trasa nie rewaliduje. Zapowiedź zostaje z CTA po terminie aż do następnego deployu. Dziś żaden wpis nie jest w tej fazie. **Nowy aspekt B9** (B9 = mechanizm rebuildu na hostingu): spis tras zależnych od daty — `/`, `/ikony/wystawy` (mają `revalidate`) i `/aktualnosci/[slug]` (nie ma). | W `10-review-fixes.md` dopisać `/aktualnosci/[slug]` do listy tras dla B9 albo dać tam `revalidate` jak na `/`. | S |
| **R1-08** | ryzyko | `src/content/exhibition.ts:151–180` | Gdy brak jawnego `vernissage`, datę **zgaduje się**: z wykładu, którego `note` zawiera „wernisaż”, a jak takiego nie ma — z ostatniego wykładu sezonu. `dateEnd` domyślnie `RRRR-08-31`. Te wartości trafiają do „Najbliższe” i hero `/ikony/wystawy`. Dziś najnowsza wystawa ma jawne `vernissage`, więc problem jest uśpiony. | Bez jawnej daty nie pokazywać daty (stan „termin wkrótce”) zgodnie z zasadą „wartości niepotwierdzonych nie zgaduj”; heurystykę z `note` usunąć albo ograniczyć do walidacji. | S |
| **R1-09** | ryzyko | `scripts/generate-news-index.ts` → `content/news/manifest.json` + `src/content/news-registry.ts`; `src/content/news.ts:53, 73, 106` | Lista Aktualności czyta `manifest.json`, a strona wpisu — frontmatter z MDX (`news-registry.ts`). Oba pliki powstają ręcznym skryptem, który **nie jest częścią `build`**. Walidacje (`featured`, `layout`, `columnImageIndex`, `lectureSeason`) działają tylko na manifeście. Edycja frontmattera bez uruchomienia skryptu rozjedzie listę i wpis bez błędu. Dziś rozjazd = 0. | Generowanie w `prebuild` albo check przy buildzie (porównanie manifestu z frontmatterem). Wymaga zmiany `package.json` → do decyzji właściciela. | S |
| **R1-16** | ryzyko | `src/content/offers.ts:4` (import typów z `@/components/content/OfferContentContext`); `src/content/lectures.ts:18` ↔ `src/content/lecturers.ts:3` | Odwrócona warstwa: dane zależą od komponentu. Do tego cykl importów `lectures` ↔ `lecturers` — dziś działa, bo na poziomie modułu nie ma wywołań, ale pierwsze wywołanie przy imporcie (np. nowa walidacja) da `undefined`. | Typy `SemesterItem` / `StepItem` przenieść do `types.ts` albo `offers.ts`; `getTotalSeasonCount` wywoływać w `lectures.ts` albo przekazywać parametrem, żeby przerwać cykl. | S |
| **R1-17** | ryzyko | `src/content/exhibition.ts:24`, `src/content/publications.ts:26–28`, `src/content/pages.ts:15–22` | Nazwane eksporty MDX (`descriptionParagraphs`, `aboutParagraphs`, `audienceParagraphs`, `curriculumParagraphs`…) są rzutowane `as unknown as …` bez sprawdzenia. Literówka albo zmiana nazwy eksportu w `content/` da `undefined` dopiero w komponencie — błąd w renderze, nie przy imporcie. | Mały helper `assertMdxExports(module, keys, context)` wołany przy imporcie, jak pozostałe walidacje. | S |

### Niespójności

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R1-06** | niespójność | `src/content/news.ts:383–386` (`toISOString` = UTC), `src/content/upcoming.ts:75–85` (`Europe/Warsaw`, porównanie stringów), `src/content/exhibition.ts:182–213` (`new Date(iso)` = UTC 00:00 + `setHours` w strefie hosta) | Trzy konwencje „dzisiaj” i porównywania dat. Na hoście w UTC przejścia stanów w exhibition i news są przesunięte o 1–2 h względem Warszawy, a `/` (upcoming) i `/ikony/wystawy` (exhibition) mogą w dzień graniczny pokazać różne stany tej samej wystawy. | Jedna funkcja `todayInWarsaw()` w `src/lib` (już jest jako `toWarsawIsoDate`) i porównania stringów `YYYY-MM-DD` wszędzie; bez obiektów `Date` w logice stanów. | S |
| **R1-11** | niespójność | `src/content/news.ts:11–33` vs `types.ts:133–153`; `body: ""` w `news.ts:299`, `offers.ts:97`, `pages.ts:47, 57, 69`; `types.ts:58` | Model z `types.ts` jest częściowo omijany: `NewsFrontmatter` powtarza ręcznie pola `News` (sam `News` nie ma użyć — knip), loadery wpisują pusty `body: ""` tylko po to, żeby spełnić `Page.body`, a `Offer.testimonials` nie jest nigdy ustawiane (cytat idzie osobnym `quote`). Dwa opisy tego samego kształtu mogą się rozjechać. | Wyprowadzać typy loaderów z modelu (`Omit<News, "body"> & { sample?, bodyText? }`, analogicznie dla `Page`) — **bez zmiany nazw pól** (CLAUDE.md). `body: ""` zastąpić `Omit`. | M |
| **R1-14** | niespójność | `src/content/exhibition.ts:61, 81` (walidowane) vs `src/content/offers.ts:10–18` / `OfferLeadExtra.tsx:23` (`whereWeWere[].newsSlug`), `src/content/publications.ts:14` (`relatedNewsSlug`), `src/content/icons.ts:40–49` (`FEATURED_ICON_SLUGS`), `src/content/offers.ts:157–162` (ISO tylko dla warsztatów) | Odsyłacze między treściami są walidowane nierówno: `newsSlug` miejsc wyjazdowych wystawy — tak; ten sam kształt w LSŚ (`whereWeWere`) i `relatedNewsSlug` albumu — nie (zły slug = link do 404). Brakujący slug wyróżnionej ikony po cichu zmniejsza galerię na `/`. Daty ISO w faktach walidowane tylko dla kursu i LSŚ. | Wspólne `assertNewsSlug(slug, context)` i `assertIconSlug`, wołane przy imporcie; walidacja ISO dla wszystkich ofert. `OfferLeadExtraPlace` i `ExhibitionTravelingPlace` to ten sam kształt — jeden typ. | S |
| **R1-18** | niespójność | `src/content/lectures.ts:136–160` (`pairTitlesWithLecturers`), `src/content/upcoming.ts:274–277` | Parowanie tytułów („ · ”) ze slugami po cichu toleruje niezgodność: nadmiarowe slugi gubi, a przy braku powtarza ostatni slug. Pusty string `""` w `lecturerSlugs` działa jako niejawna konwencja „bez prelegenta” (9 wieczorów wernisażowych 2016–2024). `upcoming.ts` filtruje `""`, a parowanie polega na jego obecności. | Jawna reguła z walidacją: liczba slugów = liczba tytułów albo dokładnie 1; konwencję „bez prelegenta” opisać w typie (`(string \| null)[]` albo komentarz w `types.ts`). | S |

### Upraszczanie

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R1-10** | upraszczanie | `src/content/news.ts:53`, `src/content/upcoming.ts:67–73, 113–120`, `src/content/exhibition.ts:47–49` | `manifest.json` jest importowany w trzech modułach, każdy z własnym rzutowaniem typu. `upcoming.ts` ma własny typ wpisu i własne filtrowanie z sortowaniem zamiast API z `news.ts`. | Jeden czytnik w `news.ts` (`getNews()`, `hasNewsSlug()`); upcoming i exhibition korzystają z niego. | S |
| **R1-12** | upraszczanie | knip (`00-scope.md` §3.4), zweryfikowane w kodzie | Martwe albo zbędnie eksportowane symbole warstwy danych. **Do usunięcia** (zero użyć w `src/` i `scripts/`): `formatNewsListDate` i `formatNewsDate` (`news.ts:263–270`, identyczne ciała), `getLectureEventData` (`lectures.ts:316–331`, z polskim adresem zahardkodowanym w kodzie, który powtarza `settings.json`), `getAnnualOpenPeriodLabel` (`exhibition.ts:274–285`, polskie literały „do ”, „Czerwiec – 31 sierpnia” poza `pl.ts`), `getAnnualIconCountLabel`, `getOffers`, `getArticleBySlug`, `getAnnualExhibitionByNewsSlug`. **Tylko zdjąć `export`** (używane wewnątrz modułu): `formatLecturerLabel`, `formatLecturerTitles`, `getAnnualExhibitions`, `FEATURED_ICON_SLUGS`, `ICON_THEMES`, `getIconWorksBySlugs`, `isNewsEventEnded`, `resolveUpcomingSlot`. **Fałszywe alarmy knip — zostawić:** `toWarsawIsoDate`, `UPCOMING_SLOTS` (importuje je `scripts/check-upcoming-states.ts`). | Usunąć / zdjąć `export` wg listy; przy R4 (scripts) potwierdzić wejścia ręczne. | S |
| **R1-13** | upraszczanie | `src/content/offers.ts:41, 50, 95`; dane `content/offers/zamowienie.mdx:48` | `exampleSlugs` jest ładowane do `LoadedOffer`, ale **nic go nie renderuje** (zero użyć w `src/components` i `src/app`). Pole martwe w kodzie, a w treści wygląda na funkcję. | Usunąć z loadera albo podpiąć pod widok zgodnie z planem — do decyzji, czy przykłady na „Na zamówienie” są w zakresie. | S |
| **R1-15** | upraszczanie | `src/content/offers.ts:127–144` ↔ `src/content/settings.ts:4–24` (klon jscpd); `src/content/lectures.ts:44–57`, `src/lib/polishMonth.ts:1–14`, `src/lib/formatDateRange.ts:20–24`; `upcoming.ts:87–90` (`addDays`) | Walidator daty ISO powtórzony dwa razy. Nazwy miesięcy w trzech mechanizmach: dopełniacz ręcznie, miejscownik ręcznie, `Intl` w formatowaniu zakresu. Arytmetyka dat lokalnie w upcoming. | `src/lib/isoDate.ts`: `assertIsoDate`, `addDays`, `todayInWarsaw` (R1-06); `formatLectureDate` przez `Intl` (`day: "numeric", month: "long"` daje dopełniacz po polsku). Miejscownik zostaje ręczny (`Intl` go nie daje). | S |
| **R1-19** | upraszczanie | `src/content/pages.ts:44, 54`; `src/content/publications.ts:145–147`; `src/lib/formatDateRange.ts:116–124` | Drobne zbędne warstwy: `getAboutPage` / `getWorkshopPage` typowane `\| undefined`, choć zawsze zwracają obiekt (wywołujący muszą sprawdzać); `getHubSpreadPreview` = `slice`; w `formatDateRange` dwie gałęzie zwracają to samo (separator jest zawsze ustawiony, gdy jest `endLabel`). | Zdjąć `\| undefined`; inline `slice`; jedna instrukcja `return`. | S |

### Drobiazgi

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **R1-20** | drobiazg | `src/content/news.ts:87–89`, `:273–275, 360–371`; `src/content/publications.ts:142`; `src/content/testimonials.ts:11` | Nieaktualne ostrzeżenie „until k3c”. `getNews()` przy każdym wywołaniu sortuje i liczy zajawki (`getNewsNeighbors` na każdej z 69 stron — koszt pomijalny, ale łatwo zapamiętać wynik w stałej modułu). Literał „zł” poza `pl.ts`. Magiczne `slice(0, 3)` przy opiniach. | Usunąć komentarz z k3c; posortowaną listę policzyć raz na poziomie modułu; „zł” do `pl.ts`; `3` jako nazwana stała. | S |
| **R1-21** | drobiazg | `src/lib/redirects.ts:21`; `src/config/news.ts` | Konfiguracja runtime (przekierowania 301 dla `next.config.ts`) leży w `docs/redirects.json` — w katalogu dokumentacji. `src/config/` zawiera jedną stałą. | Rozważyć przeniesienie `redirects.json` poza `docs/` (np. `content/` albo `src/config/`); przy okazji jedno miejsce na stałe konfiguracyjne (sezon z R1-05, `NEWS_ARCHIVE_UNTIL_YEAR`). `next.config.ts` bez zmian (CLAUDE.md). | S |

---

## Do weryfikacji w kolejnych fazach

- **R2:** `FactsBox` jako konsument R1-01; serializacja całych sezonów archiwum do payloadu RSC na `/wyklady/archiwum` (w HTML widać JSON wykładów — akordeon jako Client Component); `OfferLeadExtra` (R1-14).
- **R3:** `/aktualnosci/[slug]` bez `revalidate` (R1-07); wywołania `getAboutPage` / `getWorkshopPage` ze sprawdzaniem `undefined` (R1-19).
- **R4:** wejścia `scripts/` dla knip (R1-12 — `check-upcoming-states.ts`, `check-exhibition-states.ts` importują `src/content/*`); `prebuild` (R1-09).
- **Backlog treści (właściciel / EJK, nie review):** brakujący wpis `krzysztof-sokolowski` w rejestrze (R1-03); ujednolicenie 5 wpisów między `lecturers.json` i `lecturer-directory.json` (R1-02); decyzja, czy zapisy na kurs po 24 września mają być „otwarte” (R1-01).
