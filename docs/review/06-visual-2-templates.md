# Review 10/R — V2: spójność w obrębie szablonu

Data: 2026-10-05 · gałąź `feat/10-review`, HEAD `cabdd02` (`src/` = `1428105`, jak w V1) · model: Opus 5.5 · świeża sesja (RV-6)  
Staging: https://academy-68rb8ldp7-greg-d8fb.vercel.app/ (ten sam co V1).  
Wejście: `docs/review/06-visual-1-measure.md` (§3, §4, §7), `design/README` §1–§4, `README-o-akademii-pracownia.md`, `README-publikacje.md`, `README-wpis-aktualnosci*.md`, `README-wystawa-aktualnosci.md`; wyłączenia z `docs/review/00-scope.md` §1.  
Review **niczego nie poprawia**. Wartości docelowe odstępów nie są tu ustalane (RF-13a) — zgłaszam tylko, które strony jednego szablonu się rozjeżdżają.

Wagi: `bug` · `ryzyko` · `niespójność` · `upraszczanie` · `drobiazg`. Koszt: S / M / L.

---

## 1. Metoda

- **Liczby:** dane V1 (`.visual/measure/pages/*-{390,1440,1600}.json`, `summary.json`) + **nowy pomiar 768 i 1024** tym samym skryptem: `npx tsx scripts/visual-measure.ts --base <staging> --widths 768,1024 --only measure` → `.visual/measure/pages/*-{768,1024}.json`, `summary-768-1024.json` (V1 `summary.json` zachowany bez zmian).
- **Dodatkowe sondy (Playwright, jednorazowe, poza repo):** odstęp H2 → pierwsza treść pod nim (390 / 1440); `scrollWidth` przy 768 / 820 / 900 / 1024 / 1100 na 21 trasach + artykuł z albumu.
- **Zrzuty:** baseline `.visual/baseline/shots` (390 / 1440 / 1920) + nowe pełne zrzuty 768 (kurs, zamówienie, `/wyklady`, `/o-akademii`, `/pracownia`, `/kontakt`, album, wpis, `/ikony/wystawy`, `/publikacje`) i 1440 (dwa artykuły spoza listy tras: `piekno-ikony-perspektywa-i-swiatlo` — z albumu, `ikona-przejmujaca-delikatnosc` — z mediów).
- **Uzasadnienie w makiecie:** różnica, którą wprost opisuje handoff (`design/README-*.md`), trafia do §6, nie do zgłoszeń.

## 2. Zestawienie grup (liczby: 390 · 1440 = 1600, px)

### 2.1 Ofertowe — kurs, LSŚ, zamówienie (kontekst: hub `/warsztaty`, `/wyklady` z tym samym `FactsBox`)

| Cecha | Kurs | LSŚ | Zamówienie | Uwagi |
| --- | --- | --- | --- | --- |
| Góra treści | 34 · 34 | 36 · 34 | 34 · 34 | zgodne |
| Eyebrow nad H1 | „Warsztaty · sezon 2026/2027” (Garamond 16,5, złoto) | „Plener 2027” | **brak** | V2-02 |
| Lead → pierwsza sekcja | 30 · 30 | 30 · 30 | 30 · 30 | zgodne (V1-10) |
| Drugi akapit wstępu (390) | **17,5 / 1,7** | **17,5 / 1,7** | **17,5 / 1,7** | proza sekcji na 390: 16,5 / 1,6 — V2-04 |
| Podtytuły w sekcjach (H3) | 21 (wstęp) i **26** („Dalsza droga”) | 21 | — (drugie **H2** zamiast H3) | V2-05, V2-06 |
| Odstęp nad sekcjami pełnej szerokości | 54 · 52 · 52 | 54 · 56 · **96** | **38** · 54 · 52 · 55 | 52–56 vs 96 → V1-03 / V1-04; 38 → V2-06 |
| H2 → treść | 14 (proza) / 8 (zdanie wstępu) / 20 (zapis) | 14 / 8 | 14 / 8 / **28** (galeria) | role spójne |
| `FactsBox` — stopka kontaktu | „lub 601 734 705” | „e-mail · telefon” | „lub 601 734 705” **+** wiersz „Kontakt” z e-mailem i telefonem | V2-03 |
| Zakończenie strony | sekcja „Jak się zapisać” (złoty włos u góry) + cytat z portretem | siatka opinii (bez sekcji zapisu) | pas „Gotowe ikony” do stopki | V2-01 |
| Dół do stopki | 26 (V1: 82 z `pb-space-9`) | 58 · 122 | 0 | V1-11 |
| 768 | jedna kolumna, `FactsBox` pod wstępem | j.w. | j.w. | zgodne; kolumna boczna od 1024 |

### 2.2 Listy — `/aktualnosci`, `/wyklady` (program), `/wyklady/archiwum`, `/wyklady/wykladowcy`, `/publikacje`

| Cecha | Aktualności | Program wykładów | Archiwum | Wykładowcy | Publikacje (artykuły) |
| --- | --- | --- | --- | --- | --- |
| Góra treści | 22 | 34 (SectionNav) | 36 | 36 | **42** (V1-12) |
| Lead → lista | 31 | 32 (przez FactsBox) | 29 | 29 | 29 (album) / 34 |
| Tytuł pozycji | H3 **22 / 20**, `#ece2d3` | H3 **18,5 / 18**, `#f0e6d5` | rok + tytuł w wierszu akordeonu | H2 **28 / 24**, `#f3ead9` | H3 **25 / 21**, interlinia 1,25 / 1,3, `#ece2d3` |
| Meta pozycji | data w lewej kolumnie (złoto), rodzaj pod spodem | data w lewej kolumnie (Garamond, złoto) | rok w wierszu (złoto) | afiliacja pod nazwiskiem (Garamond 17,5, złoto) | źródło · rok **nad** tytułem (Plex 15, złoto) |
| Opis | 16,5 / **1,6 → 1,7** (≥ 768) | — | — | 16,5 / **1,6** | 16,5 / **1,7** |
| Akcja w wierszu | „Czytaj” w prawej kolumnie | link nazwiska | „rozwiń” | „Rozwiń notę” | tytuł jako podkreślony link |
| Wiersze | kafle + włos | `gap:1px` na złocie | `gap:1px` na złocie | kafle + włos | kafle + włos |
| Stan pusty | `NewsArchive` → `null` | lista pusta, lead „0 spotkań” | — | — | H2 + lead + pusta `ul` |

### 2.3 Szczegóły — wpis Aktualności, artykuł, album

| Cecha | Wpis | Artykuł | Album |
| --- | --- | --- | --- |
| Nawigacja nad H1 | brak (K-134) | breadcrumb 3-stopniowy | breadcrumb 3-stopniowy |
| H1 | 44 / 32, mb 24 | 48 / 38, mb 14 | 48 / 38, mb 20 |
| Pod H1 | lead Garamond 24 / 21 | włos złoty · autor · rok · źródło · włos neutralny | lead 19,5 / 17,5 |
| Proza | Garamond 20 / 19, akapity 40 / 38 | Plex 17,5 / 16,5, akapity 20 | „O albumie”: Plex **19,5** (rozmiar leadu) / 16,5 — V2-13 |
| Panel „W skrócie” | fakty w kolumnie (tylko zapowiedź) | — | `PublicationMetricsBox`: etykieta **z lewej**, nagłówek **22 na obu szerokościach**, belka 3 px — V2-12 |
| Zakończenie | rail: „Powiązane” + „Następny wpis” + „Wszystkie aktualności” | z albumu: karta „Źródło tekstu” (okładka, 2 linki); **z mediów bez `url`: nic** | wiersz „Wszystkie publikacje · Terminy wykładów” (bez etykiety) | 
| Dół do stopki | 66 (390) | 62 · 64 | 25 |
| 768 | jedna kolumna, rail na końcu | jedna kolumna | **dwie kolumny od 768: okładka ok. 170 px obok panelu 420 px** — V2-19 |

### 2.4 Galerie — `/ikony`, `/ikony/wystawy`

| Cecha | `/ikony` | `/ikony/wystawy` |
| --- | --- | --- |
| Góra treści | 36 | 36 |
| Nad H1 | — | eyebrow Plex 14,5 wersalikami (WY-01, makieta) |
| H2 sekcji | 26 / 34 | 26 / 34 |
| H2 → treść | 26 (galeria) / 20 | 22 (proza) / 20 |
| Odstęp sekcji 390 · 768 · ≥ 1024 | 32 · 60 · 96 (uczniowie: 54 · 96 · **132**) | 28–32 · 64 · 64 |
| Zakończenie | pas zapowiedzi zamówień ze złotym CTA | „Zobacz też” + 2 linki |
| 768 | jedna kolumna | **dwie kolumny od 768: panel 360 px, tekst ok. 225 px, lead 19,5 px ≈ 22 znaki w wierszu** — V2-19 |

### 2.5 Statyczne — `/o-akademii`, `/pracownia`, `/kontakt`, `/polityka-prywatnosci`

| Cecha | O Akademii | Pracownia | Kontakt | Polityka |
| --- | --- | --- | --- | --- |
| Układ | kolumna nagłówków H2 280 px (6a) | `TocSidebar` + kolumna (6c) | siatka 2 kolumn od 1024 | `TocSidebar` + kolumna |
| Lead | 19,5 / **1,7** | 19,5 / 1,6 | — | 19,5 / 1,6 |
| H2 | 26 / 34 | 26 / 34 | 26 / 34 („Adres”) + **21 / 26** (panele) | 26 / 34 |
| H2 → treść | 20 · (kolumna boczna) | **18 / 14 / 16 / 16 · 26 / 18 / 22 / 22** | 10 · 10 | 10 · 10 |
| Odstęp sekcji 390 · 768 · ≥ 1024 | 29–32 · 57–62 · 93–98 | 30–37 · 58–62 · 94–98 | — | 18–26 · 18–28 · 26–28 |
| Dół | 0 (pas `--surface-card`) | 28 | 26 | 26 |

## 3. Zgłoszenia

| ID | Waga | Miejsce | Opis | Propozycja | Koszt | Przyczyna w kodzie |
| --- | --- | --- | --- | --- | --- | --- |
| **V2-01** | niespójność | oferty, 390 / 1440 | Trzy różne zakończenia jednego szablonu: kurs — sekcja „Jak się zapisać” (włos złoty, `pt` 34, `pb` 56) z cytatem z portretem; LSŚ — siatka opinii z `pb-section-gap` i bez sekcji zapisu; zamówienie — pas z tłem do stopki. Kolejność bloków końcowych i dół strony (26 / 122 / 0) zależą od tego, która gałąź się wyrenderuje, nie od reguły szablonu. | Ustalić jedną kolejność końca oferty (np. zapis / zapytanie → opinie → pas zamykający) i jeden dół (V1-11); czy LSŚ ma mieć sekcję zapisu przy zamkniętym naborze — decyzja właściciela (copy byłoby treścią EJK, nie generujemy). | M | `OfferPage.tsx:113–119` (`enrollmentQuoteSlot` / `trailingQuoteSlot` — cytat wędruje zależnie od `enrollmentByKind`), `:171–172`; `EnrollmentSection` `pb-space-9`; `OfferQuoteGrid.tsx:23` |
| **V2-02** | drobiazg | `/ikony/na-zamowienie` vs kurs / LSŚ, 1440 | Zamówienie jako jedyna oferta nie ma eyebrow nad H1, więc H1 stoi o ok. 38 px wyżej niż na kursie i LSŚ (wiersz eyebrow + `mb` 12), a górna krawędź `FactsBox` wyrównuje się raz do eyebrow, raz do H1. | Ujednolicić: eyebrow we wszystkich ofertach (etykieta stała, np. nazwa sekcji — copy do akceptacji) albo w żadnej. | S | eyebrow warunkowy w `OfferPage.tsx` (pole sezonu / planu w danych oferty) |
| **V2-03** | niespójność | `FactsBox` na ofertach i `/wyklady`, ≥ 768 | Stopka kontaktu pod CTA ma trzy postacie: „lub 601 734 705” (kurs, `/wyklady`), „e-mail · telefon” (LSŚ), a na zamówieniu dodatkowo wiersz „Kontakt” z e-mailem i telefonem — telefon powtórzony w jednym panelu. | Jedna stopka kontaktu dla wszystkich wariantów (np. zawsze „lub telefon”); wiersz „Kontakt” w zamówieniu albo usunąć, albo zrezygnować ze stopki. Linki w wierszu — R2-05 / S-01. | S | `FactsBox.tsx:63–72` (`getDesktopContactLine`, gałąź `contactClosedPlener`), `:99–109`, `:136–139` |
| **V2-04** | niespójność | kurs, LSŚ, zamówienie, `/warsztaty`, `/wyklady`, 390 | Drugi akapit wstępu ma na mobile rozmiar desktopowy **17,5 / 1,7**, a proza sekcji pod nim — 16,5 / 1,6. Na tej samej stronie akapit wstępu jest większy niż tekst sekcji i niż lead innych szablonów na 390 (17,5 / 1,6). | Wariant mobilny jak w sekcjach: `text-size-body md:text-size-body-lg leading-body md:leading-prose`. | S | `OfferPage.tsx:95, 142`, `OfferLeadIntro.tsx:24`, `LecturesHubPage.tsx:52`, `WorkshopsHubPage.tsx:53` (`text-size-body-lg leading-prose` bez `-m`) |
| **V2-05** | niespójność | kurs (`Dalsza droga`) vs kurs / LSŚ (wstęp), 1440 | Podtytuł wewnątrz sekcji ma na jednej stronie dwa rozmiary: 21 (`role-row-title`, „Kurs roczny — przedwstępny”, LSŚ „Dla kogo”) i 26 (`text-size-h3` z MDX, „Kursy doskonalące…”). Ta sama rola, różnica 5 px. Doprecyzowuje V1-15. | Jedna rola „podtytuł w sekcji” dla H3 z MDX i z komponentów (21 / 19 — w skali §2). | S | `mdx-components.tsx:17` (`text-size-h3`) vs `OfferLeadExtra.tsx:43` (`role-row-title`) |
| **V2-06** | drobiazg | `/ikony/na-zamowienie`, 390 / 1440 | We wstępie zamówienia stoją dwa H2 („Dla kogo…”, „Technika i warunki…”) z odstępem 38; kurs i LSŚ w tym miejscu mają H2 + H3. Kolejne sekcje zamówienia mają 52–54, więc w jednej stronie są dwa odstępy „sekcja → sekcja” (38 i 54). | Zdecydować, czy „Technika i warunki” to sekcja (odstęp sekcji) czy podsekcja wstępu (H3 jak w kursie). | S | sekcje wstępu oferty — `prev section [mb 34px]` (pomiar) w `OfferPage.tsx`; nagłówki z `content/offers/zamowienie.mdx` |
| **V2-07** | niespójność | listy, 390 / 1440 | Rola „tytuł w liście” ma w trzech listach trzy rozmiary, dwie interlinie i dwa kolory: Aktualności 22 / 20 `#ece2d3`, artykuły 25 / 21 (1,25 / 1,3) `#ece2d3`, program wykładów 18,5 / 18 `#f0e6d5`. Pojedyncze wartości zgłosiło V1 (V1-15 — 18,5, V1-16 — interlinia, V1-17 — kolor); V2 dodaje, że to **jedna rola** w jednym szablonie. Wykładowcy (28 / 24) to rola karty — patrz §4. | Jedna rola `list-title` (rozmiar w zakresie 21–25 / 18–21, interlinia 1,2, `#f0e6d5`) dla `.news-card-title`, `.publication-article-list-title`, tytułu w `LectureList`; wyróżniony wpis (`.news-featured-title`, 24 / 22) jako jej większy wariant. | S | `globals.css:2327` (`.news-card-title`), `:4297` (`.publication-article-list-title`), `:84` (`--role-list-title: 18.5px`) |
| **V2-08** | drobiazg | listy i opisy, 390 / 1440 | Opis pozycji (16,5) ma dwie interlinie: 1,6 (bio wykładowców, zajawki Aktualności na mobile) i 1,7 (zajawki Aktualności ≥ 768, artykuły, opisy form Pracowni, opis albumu na hubie). Rozstrzyga V1-21: bio to rola „opis”, nie proza. | Rola „opis” 16,5 / 1,6 na obu szerokościach. | S | `globals.css:2432–2434, 2470–2472` (`leading-prose` ≥ 768), `.publication-article-excerpt`, `:1727–1731` (`.learning-forms-description`), `.publication-hub-description` |
| **V2-09** | ryzyko | `/publikacje`, `/wyklady` | Brak wspólnej reguły stanu pustego list: `NewsArchive`, `SemesterProgram`, `StepList` znikają (`null`), a `ArticleList` i program sezonu zostawiają H2 + lead („0 spotkań w sezonie”) nad pustą listą. Dziś niewidoczne (dane są). Pusty hub publikacji — R2-08 / S-08. | Reguła z makiety (PU-95): sekcja bez danych nie renderuje się wcale (brak H2, brak odstępu) — dla listy artykułów i programu sezonu. | S | `PublicationsHubPage.tsx:112–123`, `ArticleList.tsx:15–17`; `LecturesHubPage.tsx:61–71` |
| **V2-10** | niespójność | artykuły z mediów (`/publikacje/cisza-ikony`, `/publikacje/ikona-przejmujaca-delikatnosc`), wszystkie szerokości | Artykuł z mediów bez `source.url` kończy się ostatnim akapitem — bez notki o pierwodruku na końcu (PU-B2), bez powrotu do listy; artykuł z albumu ma kartę „Źródło tekstu”, album — wiersz linków, wpis — rail. Jedyna strona szczegółów bez zamknięcia. | Notka końcowa zawsze (zdanie o pierwodruku; link ↗ tylko przy `url`) + link „Wszystkie publikacje” jak na albumie. | S | `ArticleSourceBlock.tsx:114–115` (`!source.url` → `null`) |
| **V2-11** | drobiazg | `/publikacje`, album, `/ikony/wystawy` | Wiersz linków zamykających ma raz etykietę „Zobacz też” (hub publikacji, wystawy), raz nie (album: „Wszystkie publikacje · Terminy wykładów”), a na `/o-akademii` dwa wiersze `TextLink` bez etykiety. W makiecie albumu „Zobacz też” to `NewsCard` z plakatem (PU-97/98). | Jeden wzorzec wiersza zamykającego (etykieta zawsze albo nigdy); karta z plakatem — do C1. | S | `.publication-see-also` (`PublicationsHubPage.tsx:125–131`, `PublicationAlbumPage.tsx`) |
| **V2-12** | niespójność | album vs oferty / wystawy, 1440 | Panel „W skrócie” albumu: etykiety z lewej (siatka 2 kolumn), nagłówek **22 px także na desktopie**, belka 3 px. Ten sam panel na ofertach i wystawach: etykieta nad wartością, nagłówek 24, belka 2 / 3 px (V1-13). `README-publikacje` PU-44 opisuje go jako `FactsBox` „pełny wzorzec”. | Nagłówek panelu z wariantem desktopowym (`role-box-title` 24 / 22); układ etykiet — jak `FactsBox` albo potwierdzić z makietą 8c i zostawić. | S | `globals.css:4370–4376` (`.publication-metrics-heading` — tylko `--role-box-title-m`), `PublicationMetricsBox.tsx` |
| **V2-13** | drobiazg | `/publikacje`, album, 390 → ≥ 768 | W publikacjach opis albumu, leady sekcji i akapity „O albumie” mają na mobile rozmiar tekstu (16,5), a od 768 — rozmiar leadu (19,5): skok o 3 px i zmiana roli. W ofertach i wykładach zdanie pod H2 sekcji zostaje tekstem (16,5) na obu szerokościach, a proza ma 17,5. | Lead sekcji = tekst 16,5; „O albumie” = proza (16,5 / 17,5); rozmiar leadu tylko dla leadu strony. | S | `globals.css:4600–4605` (`.publication-page-lead`, `.publication-section-lead`, `.publication-hub-description`, `.publication-about-paragraph` → `--size-lead` w `@media 768`) |
| **V2-14** | niespójność | statyczne + artykuł, 390 / 1440 | Odstęp H2 → pierwsza treść w szablonie tekstowym: 10 (polityka, kontakt), 14 (artykuł), 20 (`/o-akademii`), a na `/pracownia` **cztery wartości w jednej stronie** (18 / 14 / 16 / 16 na 390; 26 / 18 / 22 / 22 na 1440). Ta sama klasa strony powinna mieć jeden odstęp nagłówka. | Jeden token „nagłówek sekcji → treść” (wartość — RF-13a, §7). | S | `.privacy-policy-section-heading` (`globals.css:1264, 1274`), `OnlineAside.tsx:17, 29` i `ContactPage.tsx:54` (`mb-space-3`), `--workshop-section-heading-mb(-m)` 26 / 18 (`:364–367`, `:1694–1705`), `.interview-section > .workshop-section-heading` (`:1770`), MDX `h2` `mb-space-4` (`mdx-components.tsx:47`) |
| **V2-15** | drobiazg | `/o-akademii`, ≥ 768 | Lead hero ma interlinię 1,7; lead każdej innej strony (Pracownia, polityka, listy, oferty) — 1,6. | `leading-body` jak pozostałe leady. | S | `globals.css:1350–1353` (`.about-hero-lead` `--leading-prose`) |
| **V2-16** | bug · **naprawione 2026-10-05** (decyzja właściciela: od razu, poza paczkami RF) | `/publikacje`, 768–ok. 860 | Poziomy scroll: `scrollWidth` 834 przy oknie 768 i 820. Sekcja albumu przechodzi w dwie kolumny już od 768 przy stałej okładce 440 px — na tekst zostaje ok. 150 px (opis po 1–2 słowa w wierszu), a tabela danych z kolumną etykiet 170 px wystaje poza ekran („Dostępny” ucięte). Od 900 bez przepełnienia. | Przełączać siatkę albumu i wierszy danych od 1024 (`lg`) albo dać okładce `minmax`. | S | `globals.css:4594` (`@media 768`), `:4611–4613` (`--publication-hub-cover` 440 + `--space-8`), `:4616–4618` (`--publication-hub-facts-label-col` 170) |
| **V2-17** | niespójność | `/ikony/wystawy`, album, 768–1023 | Układ „treść + panel boczny o stałej szerokości” włącza się od 768 na wystawach (panel 360 px → tekst ok. 225 px, H1 w dwóch wierszach, lead 19,5 px ≈ 22 znaki w wierszu) i w albumie (okładka ok. 170 px obok panelu 420 px), a od 1024 — na ofertach (`FactsBox`), wpisie (rail), `/kontakt`, `/pracownia` i polityce (TOC), `/o-akademii` (kolumna H2). W grupie galerii: `/ikony` jedna kolumna, `/ikony/wystawy` dwie. | Jeden próg dla kolumny bocznej w całym serwisie: 1024. | S | `globals.css:3887` (`@media 768`) → `:3950, 4021, 4026, 4058` (`--exhibition-facts-w` 360); `:4641` (`--publication-metrics-w` 420) |

### 3.1 Decyzje właściciela po checkpoincie (2026-10-05)

- **V2-16 — naprawione od razu.** `.publication-hub-album-grid` (okładka 440 px + tekst) przeniesione z `@media 768` do nowego `@media 1024` w `globals.css`; wiersze danych (`170px + 1fr`) zostają od 768, bo w jednej kolumnie (641 px) się mieszczą. Weryfikacja na lokalnym `next start`: `scrollWidth` ≤ szerokość okna przy 390 / 768 / 820 / 900 / 1023 / 1024 / 1440 / 1600; od 1024 dwie kolumny (440 + 405 px przy 1024). `build` i `lint` OK. Na stagingu po najbliższym deployu.
- **V2-01 — wyjaśnienie, otwarte.** Sekcja „Jak się zapisać” istnieje tylko na `/warsztaty/kurs-roczny-i-trzyletni` (na końcu, nad stopką). Renderuje ją `EnrollmentSection` wyłącznie dla rodzajów oferty z wpisem w `pl.offers.enrollmentByKind` — dziś jest tam tylko `kurs`, więc LSŚ i zamówienie jej nie mają (`OfferPage.tsx:49–52, 113–119, 171–172`). Decyzja o LSŚ czeka na właściciela.

## 4. Punkty z V1 §7 — rozstrzygnięcia

| Punkt | Wynik V2 |
| --- | --- |
| **V1-15 — H2 w roli H3** | `/kontakt` „Organizator”, „Akademia w sieci” (21 / 26) to **tytuły paneli na kaflu** — ta sama rola co „W skrócie” (`role-box-title` 24 / 22), nie H2 sekcji (34) ani H3. `/publikacje` tytuł albumu (`.publication-hub-album-title`, 26 na obu szerokościach — brak wariantu desktopowego) to tytuł bloku obok okładki — rola karty (28 / 24). Nagłówki rozdziałów spisu albumu i części rozmowy (26) — podtytuły w sekcji, ta sama rola co V2-05. |
| **V1-15 — rola karty 28 / 24** | Spójna w użyciu: `OfferCard` (`/warsztaty`), filary `/`, nazwiska wykładowców, `PersonProfile`, cytat `/o-akademii` — zawsze tytuł samodzielnego bloku. Zalecenie: dopisać rolę „tytuł karty” do skali (`design/README` §2 jej nie ma), nie mapować na H3. Wykładowcy (H2 28) zostają w tej roli — to profile, nie wiersze listy (V2-07). |
| **V1-18 — „Powiązane”** | Spójne w szablonie wpisu: ten sam styl co druga etykieta raila („Następny wpis →”), zgodne z `README-wpis-aktualnosci-v2` K-a / K-e (rail = etykiety bloków). Bez zgłoszenia; zostaje tylko V1-14 (14,5 px na 390). |
| **V1-21 — bio wykładowców** | Rola „opis”, nie proza: lista profili z obcięciem do 7 wierszy. 16,5 jest właściwe; rozjazd dotyczy tylko interlinii — V2-08. |
| **V1-11 — pasy do stopki** | Dwie strony: `/o-akademii` (pas `--surface-card`, makieta 6a pkt 6 „jedna cezura”) i `/ikony/na-zamowienie` (pas `--surface-tile` ze złotym włosem u góry). Obie mają dół 0 i rozdziela je włos nad stopką — wzorzec spójny między sobą. Zalecenie: zapisać regułę „pas zamykający dochodzi do stopki, powłoka bez `pb`” zamiast traktować to jako wyjątek; niespójny jest tylko koniec ofert (V2-01). Uwaga do C1: makieta 6a ma po pasie zakończenie OA-80…OA-82 (fundacja, zastrzeżenie, „Zacznij tutaj”) — na stagingu go nie ma. |
| **768–1023 (nie mierzone w V1)** | Pomiar w tabeli niżej. Kolumna treści 641 (768) / 897 (1024). Dwa problemy układu: V2-16 (przepełnienie `/publikacje`), V2-17 (próg kolumny bocznej). Odstępy: na 768 grupy są **najbliżej siebie** (60 / 64 / 52), rozjazd 96 vs reszta pojawia się dopiero od 1024. |

Odstęp sekcji przy 768 i 1024 (nowy pomiar, `.visual/measure/pages/*-{768,1024}.json`):

| Trasa | 390 | 768 | 1024 | 1440 | Mechanizm |
| --- | --- | --- | --- | --- | --- |
| `/o-akademii` | 29–32 | **57–62** | 93–98 | 93–98 | `--section-gap` 60 → 96 od 1024 |
| `/pracownia` | 30–37 | **58–62** | 94–98 | 94–98 | j.w. |
| `/ikony` (zamówienia / uczniowie) | 32 / 54 | **60 / 96** | 96 / 132 | 96 / 132 | j.w. + `pb` podpisu galerii (V1-02) |
| cytaty ofert (`/warsztaty`, LSŚ) | 30 / 50 | **58–60** | 94–96 | 94–96 | j.w. |
| `/ikony/wystawy` | 28–32 | 62–64 | 62–64 | 62–64 | `--exhibition-section-gap` od 768 |
| oferty (`mt-space-8`) | 36–55 | 52–56 | 52–56 | 52–56 | bez wariantu mobile (V1-04) |
| `/publikacje`, album | 32–37 | 32–37 | 32–37 | 32–37 | tylko `-m` (V1-06) |
| `/polityka-prywatnosci` | 18–26 | 18–28 | 26–28 | 26–28 | `--space-6` |
| dół `/warsztaty`, LSŚ | 58 | 86 | 122 | 122 | `pb-section-gap` siatki opinii |

## 5. Ta sama klasa strony — ten sam odstęp?

| Grupa | Czy powinien być jeden odstęp sekcji | Dziś (≥ 1024) |
| --- | --- | --- |
| Ofertowe | **tak** — sekcje pełnej szerokości tej samej wagi | 52–56 i 96 (cytaty LSŚ), 38 (V2-06) |
| Listy | tak dla przejścia „lead → lista” i „sekcja → sekcja” na hubie `/wyklady` | 29–34; 54 (archiwum na hubie) |
| Szczegóły | tak dla sekcji albumu i H2 w artykule; proza wpisu ma własną skalę (K-130) | album 32–38; artykuł — H2 MDX 52 + `mt` |
| Galerie | **tak** — obie strony to dział Ikony z tym samym `SectionNav` | 96 / 132 vs 64 |
| Statyczne | tak dla `/o-akademii` · `/pracownia` (para K-48); polityka i kontakt mogą mieć wariant „ciasny” (krótkie sekcje jednego tematu) | 93–98 vs 26–28 |

## 6. Różnice uzasadnione makietą (nie zgłaszam)

| Różnica | Źródło |
| --- | --- |
| `/o-akademii` kolumna nagłówków 280 px vs `/pracownia` z `TocSidebar` | `README-o-akademii-pracownia` 6a / 6c, iteracja 2 |
| Jedna cezura (pas) tylko na `/o-akademii` | tamże, §3 pkt 6 |
| Wpis: meta nad H1, H1 44 / 32, proza Garamond, brak breadcrumbu | K-130–K-134, `README-wpis-aktualnosci*` |
| Artykuł: meta pod H1 między włosem złotym i neutralnym | `README-publikacje` PU-A1 / PU-B1 |
| Breadcrumb na albumie i artykule | `README-publikacje` PU-00 / PU-40 (zgodność z `design/README` §4 → C1, S-24) |
| Etykiety wersalikami w publikacjach („Fundacja IKONA DZIŚ”, „Rozkładówki”, „Str. 6–51”, „Czytaj na stronie”) i eyebrow wystaw | makieta Publikacje (`text-transform: uppercase` w etykietach), WY-01 / WY-09, K-26 |
| „rozwiń” małą literą w akordeonie | `design/components/content/SeasonAccordion.jsx` |
| Aktualności: „Czytaj” w kolumnie vs artykuły: tytuł-link, źródło nad tytułem | dwie makiety (`NewsEntry` w `README-wystawa-aktualnosci`, PU-22 w `README-publikacje`) — jeśli właściciel chce jednego wzorca wiersza listy, to decyzja projektowa, nie błąd |
| Układ `/ikony/wystawy` (panel „Teraz / Następnie”, panele faktów, kotwice sekcji) | K-87 / K-127 |
| Testimonial z portretem na kursie vs siatka opinii na LSŚ | `design/README` §4 — dwa warianty `Testimonial` (kolejność bloków → V2-01) |

## 7. Korekty do V1

- **V1-13:** `MilestoneRow` (`/o-akademii`) ma belkę **2 px z makiety** — `README-o-akademii-pracownia` §2 i §3b („nad nią belka akcentu 2 px”). W konflikcie z `design/README` „Karty i kafle” (3 px). RF-13a powinno to rozstrzygnąć jawnie (jedna grubość czy dwie role: panel 3 px / akcent faktu 2 px).
- **V1 §1 „nie mierzone 768–1023”:** zmierzone — §4 tabela; kolumna 641 / 897, próg `--section-gap` potwierdzony pomiarem (60 przy 768, 96 przy 1024).

## 8. Wejście dla RF-13a

Rozjazdy dotyczące **skali odstępów i belki** (do decyzji wartości; V2 ich nie ustala):

1. **Odstęp sekcji w grupie** (§5): galerie 96 / 132 vs 64 (V1-02, V1-08), para O Akademii · Pracownia vs reszta statycznych (V1-01, V1-07), oferty 52–56 vs 96 cytatów (V1-03, V1-04) i 38 we wstępie zamówienia (V2-06).
2. **Próg:** dziś trzy stopnie dla `--section-gap` (32 / 60 / 96) i dwa dla reszty (768). Na 768 grupy są najbliżej siebie (§4) — argument za jednym progiem 768 z V1 §6.1. Do tego jeden próg kolumny bocznej (V2-17) — osobna decyzja, ale ten sam przegląd 768–1023.
3. **Nowy token:** „nagłówek sekcji → treść” (V2-14: 10 / 14 / 18–26 / 20) — warto decydować razem ze skalą sekcji, bo oba odstępy budują rytm.
4. **Dół strony i koniec sekcji:** reguła pasa do stopki (§4, V1-11) i koniec oferty (V2-01).
5. **Belka:** 2 vs 3 px — z korektą V1-13 (§7): makieta `/o-akademii` sama używa 2 px.
6. **Wariant „ciasny”:** kandydaci z V2 — polityka, kontakt, przejście „lead → lista” w listach (29–34).

## 9. Wejście dla V3

- `/publikacje` przy 768: poza przepełnieniem (V2-16) — opis albumu po 1–2 słowa w wierszu; sprawdzić całą stronę po poprawce.
- `/ikony/wystawy` przy 768–1023: miara 22 znaków w leadzie i prozie sekcji (V2-17) — ocena czytelności.
- `/aktualnosci` przy 1440: pasek „Przejdź do roku” łamie 2012 do drugiego wiersza — długość i łamanie.
- `/ikony/wystawy`: dwa złote przyciski główne (oprowadzania, wystawy wyjazdowe) i obrysowy w faktach na jednej stronie — hierarchia CTA („złoto rzadko i zawsze coś znaczy”).
- Kurs: sekcja „Dalsza droga” — prawa kolumna (zdjęcie + karta CTA) wyższa niż tekst, pusty pas pod tekstem przy 1440.
- `/o-akademii`: brak zakończenia OA-80…OA-82 z makiety (→ też C1).
- **Do V4 (poza V2):** nagłówek przy 768 — sygnatura w dwóch wierszach, „O Akademii” łamie się na dwie linie (menu desktopowe od 768).
