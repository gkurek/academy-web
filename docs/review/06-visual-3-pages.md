# Review 10/R — V3: strona po stronie

Data: 2026-10-05 · gałąź `feat/10-review`, HEAD `b12cb75` (`src/` = `1428105` + poprawka V2-16 w `globals.css`) · model: Opus 5.5 · świeża sesja (RV-6)  
Staging: https://academy-68rb8ldp7-greg-d8fb.vercel.app/ (ten sam co V1/V2; **bez** V2-16 — `scrollWidth` 834 przy 768 na obu adresach stagingu).  
Wejście: `docs/review/06-visual-1-measure.md` (§3, §4, §7), `docs/review/06-visual-2-templates.md` (§3, §4, §9), `docs/review/00-scope.md` §1, `docs/design-mockup-guide.md`, `design/README.md`, `README-o-akademii-pracownia.md`, `README-publikacje.md`, `README-wystawa-aktualnosci.md`.  
Review **niczego nie poprawia**. Wartości odstępów i grubość belki — RF-13a; tu tylko, gdzie rytm się psuje.

Wagi: `bug` · `ryzyko` · `niespójność` · `upraszczanie` · `drobiazg`. Koszt: S / M / L.

---

## 1. Metoda

- **Liczby najpierw.** Dane V1/V2 (`.visual/measure/pages/*-{390,768,1024,1440,1600}.json`) + nowa sonda `.visual/v3/probe.mjs` (Playwright, poza repo): 21 tras × 390 / 768 / 1024 / 1440 / 1600 → `.visual/v3/probe.json`. Sonda dzieli tekst na wiersze z prostokątów słów (`Range`), więc mierzy **miarę w znakach**, ostatni wiersz (sieroty), jednoliterowe słowa na końcu wiersza, puste pasy w `main`, różnicę wysokości kolumn obok siebie i spis przycisków (złote tło / obrys). Sondy celowane: `.visual/v3/checks*.mjs` (pasek lat, pas zamówień, kroki, „Rytm dnia”, „Dalsza droga”, rozmowa, hero, linki kontaktu).
- **Zrzuty.** Baseline `.visual/baseline/shots` ma 390 / 1440 / **1920**, więc 1600 zrobione od nowa: pełne strony Playwrightem pocięte na kafle (`.visual/v3/shots/*-{390,1600}-tN.png`, 21 tras), do tego 768 (13 tras) i 1024 (5 tras); 1440 — baseline.
- **V2-16 (`/publikacje` 768).** Poprawka jest tylko lokalnie. Lokalny serwer na :3000 (nie uruchomiony przeze mnie, nieruszany) serwował stronę bez CSS, więc poprawkę odtworzyłem na stagingu wstrzyknięciem przeniesionej reguły (`.publication-hub-album-grid` jedna kolumna < 1024) — `.visual/v3/pub-fix.mjs`.
- **Poza zakresem:** treść i placeholdery T1–T30 (m.in. kadry `[zdjęcie: …]` na `/ikony/wystawy` — T19, „Zdjęcie w przygotowaniu” u wykładowców), copy, elementy globalne (→ §6).

## 2. Kryteria (spisane przed obejrzeniem zrzutów; progi zaszyte w sondzie)

| # | Kryterium | Próg zgłoszenia | Źródło |
| --- | --- | --- | --- |
| K1 | Miara tekstu ciągłego (≥ 3 wiersze) | < 30 zn./wiersz na 390, < 40 od 768; > 85 zn. | `design/README` „miara 34–36 em” ≈ 65–75 zn. |
| K2 | Łamanie nagłówków | H1 > 3 wiersze (desktop) / > 4 (390); jednowyrazowy ostatni wiersz H1–H3 i cytatów | — |
| K3 | Sieroty | jednoliterowe a / i / o / u / w / z na końcu wiersza; ostatni wiersz akapitu = 1 krótkie słowo | polska typografia |
| K4 | Puste pasy | pionowy pas bez treści ≥ 70 px (390) / ≥ 110 px (≥ 768); kolumny obok siebie z różnicą dołów treści > 150 px | — |
| K5 | Hierarchia | rola wyżej = większa i jaśniejsza (H1 > H2 > tytuł > tekst > etykieta); data / etykieta nie dominuje nad tytułem | `design/README` §1–§2 |
| K6 | Hierarchia CTA | ≤ 1 przycisk główny (złote tło) w jednym ekranie; etykieta przycisku w jednym wierszu | „złoto rzadko i zawsze coś znaczy” |
| K7 | Rytm pionowy | odstęp nad nagłówkiem > pod nim; ta sama rola w obrębie strony — ten sam odstęp (±6) | opis, bez wartości (RF-13a) |
| K8 | Długość strony | > 15 ekranów (900 px) na 390, jeśli wynika z układu, a nie z ilości treści | sygnał, nie norma |
| K9 | Spójność w obrębie strony | ta sama rola tekstu = ten sam kolor i krój; bloki na linii kolumny treści | — |

## 3. Karta tras

Ekrany = wysokość dokumentu / 900 px. „—” = bez nowych zgłoszeń (V1/V2 nadal obowiązują).

| Trasa | Ekrany 390 · 1440 | Ocena | Zgłoszenia |
| --- | --- | --- | --- |
| `/` | 6,4 · 3,2 | 390 i ≥ 1440 czytelne; 768–1023 ściśnięte (hero, filary, „Najbliższe”) | V3-03, V3-04, V3-20 |
| `/warsztaty` | 5,7 · 2,6 | ≥ 1440 dobrze; 768 — cytaty po 13–14 znaków | V3-01 |
| `/warsztaty/kurs-roczny-i-trzyletni` | 10,2 · 5,0 | program semestrów wąski na 390 / 768; pusty pas przy „Dalsza droga”; dwa kolory prozy | V3-05, V3-06, V3-07 |
| `/warsztaty/letnia-szkola-swiatla` | 8,0 · 4,1 | kolizja w „Rytmie dnia”; dwa kolory prozy | V3-02, V3-07 |
| `/ikony/na-zamowienie` | 6,0 · 3,1 | pas „Gotowe ikony” poza linią kolumny; kroki krzywo przy 1600 | V3-08, V3-09 |
| `/wyklady` | 6,9 · 3,8 | data wykładu dominuje nad tytułem | V3-18 |
| `/wyklady/archiwum` | 4,4 · 2,2 | czytelne | — |
| `/wyklady/wykladowcy` | **22,9** · 11,1 | długa na mobile, bez spisu nazwisk | V3-17 |
| `/aktualnosci` | 9,3 · 5,2 | pasek lat: „2012” sam w drugim wierszu przy 1440 | V3-12 |
| wpisy Aktualności (2) | 2,8 · 1,2 | czytelne | — |
| `/publikacje` | 6,2 · 3,0 | po V2-16: czytelne; okładka 641 px przy 768 | V3-24 |
| `/publikacje/ikona-dzis` | 8,6 · 4,9 | spis treści: zakres stron nad wstępem, nie nad rozdziałem | V3-23 |
| `/publikacje/cisza-ikony` | 4,2 · 2,4 | czytelne (zamknięcie — V2-10) | — |
| `/ikony` | **26,9** · 8,1 | galeria w jednej kolumnie na 390 | V3-16 |
| `/ikony/wystawy` | 8,4 · 4,7 | dwa złote CTA; panel hero rozciągnięty przy 768 | V3-10, V3-11 |
| `/o-akademii` | 9,8 · 5,9 | 1024–1279 ściśnięte (hero, deklaracje); zakończenie bez wyjścia | V3-13, V3-14 |
| `/pracownia` | 11,4 · 7,1 | rozmowa na 390: 27–29 znaków | V3-15 |
| `/kontakt` | 3,4 · 1,5 | dane kontaktowe nie wyglądają na linki | V3-22 |
| `/polityka-prywatnosci` | 5,2 · 3,0 | listy szersze niż akapity | V3-21 |
| 404 | 2,5 · 1,1 | → V4 | — |
| przekrojowo | — | jednoliterowe spójniki na końcu wiersza (dwie konwencje); nagłówki bez wyrównania wierszy | V3-19, V3-20 |

## 4. Zgłoszenia

Kolejność: najpierw punkty z V2 §9, potem trasy w kolejności z `visual-check.routes.json`, na końcu przekrojowe.

| ID | Waga | Miejsce | Opis | Propozycja | Koszt | Przyczyna w kodzie |
| --- | --- | --- | --- | --- | --- | --- |
| **V3-01** | bug | `/warsztaty`, 768–1023 | Siatka „Głosy uczestników” przechodzi w 3 kolumny już od 768: tekst cytatu ma **139 px**, czyli **13–14 znaków w wierszu** i 12–18 wierszy kursywy 20 px; karty różnią się wysokością o 186 px. Przy 1024: 224 px, 25–27 zn. Czytać się tego nie da. (LSŚ ma w tym miejscu 2 kolumny — 28–31 zn.) | 3 kolumny od 1024; 768–1023 — jedna kolumna albo 2 jak na LSŚ. | S | `OfferQuoteGrid.tsx:18` (`md:grid-cols-3`) |
| **V3-02** | bug | `/warsztaty/letnia-szkola-swiatla` „Rytm dnia”, ≥ 768 | Etykieta „przedpołudnie” (Garamond 24) ma 157 px w kolumnie 140 px — wchodzi w odstęp 28 px i do opisu zostaje **11 px** („przedpołudniePraca przy desce…”). Pozostałe etykiety mają 49–126 px, więc wiersz z najdłuższą wygląda na sklejony. | Kolumna etykiet z treści (`max-content` / `minmax(auto, …)`), nie stała 140 px. | S | `globals.css:211` (`--offer-day-rhythm-time-col: 140px`), `:1193`; rozmiar etykiety `:1200` (`--size-h2-sm`) |
| **V3-03** | niespójność | `/`, 768–1023 | Hero przechodzi w dwie kolumny od 768, tekst ma 300 px (1024: 341): H1 56 px w **4 wierszach** (1024: 3), lead 28 zn./wiersz, a etykiety przycisków łamią się na **3 wiersze** („Warsztaty / pisania / ikon”, 1024: 2). Na 390 i ≥ 1440 hero jest dobre. | Dwie kolumny hero od 1024 (spójnie z progiem kolumny bocznej V2-17); etykiety przycisków bez łamania (`white-space: nowrap`). | S | `Hero.tsx:16` (`md:grid md:grid-cols-hero`); przyciski `Button` bez `nowrap` |
| **V3-04** | niespójność | `/`, 768–1023 | Filary i „Najbliższe” w 3 kolumnach od 768: opis filaru **187 px, 18–20 zn./wiersz**, 8–9 wierszy (1024: 272 px, 30–33 zn.); tytuły „Najbliższe” do 5 wierszy. „Wybrane ikony” przy 768 układają się 3 + 1 (ostatnia ikona sama, wyśrodkowana). | 3 kolumny od 1024; 768 — jedna kolumna (filar: zdjęcie obok tekstu) albo 2. | S | `Pillars.tsx:18` (`md:grid-cols-3`), `.hairline-grid-3` od 768 (`globals.css:904–907`, `UpcomingHighlights.tsx:18`) |
| **V3-05** | niespójność | kurs, 390 i 768–1023 | Program semestrów: numer semestru to stała kolumna obok treści, a lista ma jeszcze wcięcie — na 390 punkty listy mają **221 px (16–27 zn.)**, a przy 768 siatka przechodzi w dwie kolumny i zostaje **191 px (15–23 zn.)**, np. „podsumowanie-korekta / indywidualna / długoterminowa”. Program zajmuje ok. 3 ekrany na 390. | < 768 numer nad tytułem semestru (bez kolumny); dwie kolumny od 1024. | S | `SemesterProgram.tsx:29, 33–37` (`flex` + `w-offer-semester-num-width-m`), `.hairline-grid-2` od 768 (`globals.css:904–907`) |
| **V3-06** | niespójność | kurs „Dalsza droga”, ≥ 1024 (V2 §9) | Prawa kolumna (zdjęcie + karta „Zapytaj”) jest wyższa niż tekst o **58 / 147 / 207 px** przy 1024 / 1440 / 1600 — pusty pas pod tekstem rośnie z oknem, bo tekst się skraca, a zdjęcie w karcie ma portretowe 3:4. Razem z odstępem sekcji daje największą przerwę na stronie przed „Jak się zapisać”. | Kadr zdjęcia karty poziomy (jak `OfferFigure`) albo zdjęcie poza kartą; sprawdzić z makietą 3b. | S | `OfferSideCta.tsx:37, 47` (`aspect-lecturer-photo` w karcie bocznej) |
| **V3-07** | niespójność | kurs, LSŚ, wszystkie szerokości | Proza sekcji ma na jednej stronie dwa kolory: sekcje wstępu z komponentu („Rok albo trzy lata”, „Tydzień na plenerze”) — `#c7b8a2`, sekcje z MDX („Po co ten tydzień”, „Dalsza droga”, „Rytm dnia” — wstęp) — `#ece2d3`. Przy przewijaniu tekst raz „gaśnie”, raz „się zapala”, choć to ta sama rola. | Jeden kolor prozy sekcji (tekst główny — jak MDX i strony tekstowe); `--text-secondary` tylko dla leadu i opisów. | S | `OfferLeadExtra.tsx:46` (`text-text-secondary`) vs `mdx-components.tsx:53` (`text-text-body`) |
| **V3-08** | niespójność | `/ikony/na-zamowienie`, wszystkie szerokości | Pas „Gotowe ikony – zapytaj mailem” jest wcięty względem kolumny treści o **56 px** (≥ 768) / **20 px** (390): nagłówek pasa zaczyna się na x = 265 przy H1 na 209 (1600). Jedyny blok strony poza linią kolumny — wygląda na przesunięty. | W pasie `surface-tile-bleed` bez dodatkowego `px-page-margin` (tło i tak wychodzi poza kolumnę). | S | `ReadyIconsNote.tsx:12` (`surface-tile-bleed px-page-margin-mobile md:px-page-margin`) |
| **V3-09** | drobiazg | `/ikony/na-zamowienie` „Jak przebiega zamówienie”, 1600 | Tytuł kroku 2 stoi o 13 px niżej niż kroków 1 i 3 (krótszy opis → siatka kafla rozkłada nadmiar wysokości na wiersze). Przy 1024 / 1440 równo — zależy od łamania opisów. | `align-content: start` na kaflu kroku. | S | `StepList.tsx:33` (`grid … lg:grid-cols-1 … lg:items-start`, bez `content-start`) |
| **V3-10** | niespójność | `/ikony/wystawy`, ≥ 768 (V2 §9) | Trzy przyciski na stronie, w tym **dwa złote** w odległości ok. 300 px (1600: „Zapytaj o oprowadzanie” y 2963, „Napisz do nas” y 3259; 768: 340 px) — przy 1440 / 1600 w jednym ekranie, równorzędne. CTA oprowadzań stoi przy prawej krawędzi (x 1117–1377), poza kolumną tekstu i bez wyrównania do nagłówka. Sekcja „Oprowadzania” jako jedyna jest dodatkowo obramowana włosami. | Jeden przycisk główny na stronie (który — decyzja właściciela), drugi obrysowy albo link w zdaniu; CTA oprowadzań pod tekstem. Uwaga do C1: `README-wystawa-aktualnosci` opisuje `ExhibitionFacts` „bez przycisku”, a na stagingu panel ma obrysowy „Program i terminy wykładów”. | S | `ExhibitionToursSection.tsx:36` i `ExhibitionTravelingSection.tsx:55` (`variant="primary"`), `ExhibitionPage.tsx:169` |
| **V3-11** | niespójność | `/ikony/wystawy`, 768–1023 (nowy aspekt V2-17) | Poza miarą 20–25 zn. (V2-17): panel „Teraz w kościele / Następnie” jest rozciągnięty do wysokości lewej kolumny — przy 768 **pusty kafel ok. 400 px** pod treścią panelu; panel „W skrócie” wystawy dorocznej kończy się ok. 660 px przed końcem tekstu obok. | Razem z V2-17 (kolumna boczna od 1024); niezależnie panel hero `align-self: start`. | S | `globals.css:3949–3955` (`.exhibition-hero-grid` `align-items: stretch` w `@media 768`) |
| **V3-12** | drobiazg | `/aktualnosci` pasek „Przejdź do roku”, ≥ 768 (V2 §9) | Od 768 pasek się zawija: 768 — 8 + 7 lat, 1024 — 11 + 4, **1440 — 14 + 1** („2012” sam w drugim wierszu), 1600 — jeden wiersz. Na 390 jeden przewijany wiersz. Ten sam element ma trzy postacie zależnie od szerokości. | Jeden wzorzec: przewijany wiersz na wszystkich szerokościach (jak 390) albo etykieta nad linkami + mniejszy odstęp, tak by 15 lat mieściło się w wierszu od 1024. | S | `globals.css:2399–2404` (`.year-nav-links { flex-wrap: wrap }` w `@media 768`), odstęp `--space-6` |
| **V3-13** | niespójność | `/o-akademii`, 1024–1279 | Obraz hero ma stałe 560 px od 1024, więc tekst dostaje **281 px**: H1 48 px w 3 wierszach, lead 19,5 px w **13 wierszach po 26 zn.**; „Czemu służymy” (kolumna nagłówków 280 + dwie kolumny deklaracji) daje 253 px — **23–28 zn./wiersz**. Przy 1440 tekst hero ma 452 px i jest dobrze. | Obraz hero w proporcji kolumny (np. `1fr 1fr`) albo dwie kolumny od 1280; deklaracje w jednej kolumnie poniżej 1280. | S | `globals.css:347` (`--about-hero-image-w: 560px`), `:1341–1344`; `.mission-declarations` 2 kolumny od 768 (`:1363–1366`, `:1392–1395`) |
| **V3-14** | drobiazg | `/o-akademii`, wszystkie szerokości (V2 §9) | Strona kończy się zdjęciami w pasie „Pracownia i miejsce”; jedyne wyjścia („Pracownia · Kontakt”) stoją między tekstem a zdjęciami, nie na końcu. Na całej stronie 0 przycisków — czytelnik dochodzi do stopki bez następnego kroku. Brak OA-80…OA-82 → C1 (V2). | Wiersz wyjść po zdjęciach jako zamknięcie strony — razem z decyzją o OA-80…OA-82. | S | `AboutPage.tsx` (pas `surface-card-bleed`, kolejność linków i `PhotoGrid`) |
| **V3-15** | niespójność | `/pracownia` rozmowa, 390 | Kolumna inicjałów (ML / EJK, 52 px + odstęp) obok każdej wymiany zostawia odpowiedziom **263 px przy kolumnie 335 — 27–29 zn./wiersz**, 9–12 wierszy na odpowiedź. Najwęższa proza w serwisie na mobile. | < 768 inicjały nad pytaniem, odpowiedź na pełną szerokość. | S | `globals.css:387` (`--interview-initial-col: var(--space-8)`), `:1984–1990` (`.interview-exchange`) |
| **V3-16** | ryzyko | `/ikony`, 390 | Galeria w jednej kolumnie (ikona w polu o stałej wysokości, ok. 260 px szerokości z 335) — strona ma **26,9 ekranu** (768: 10; 1440: 8,1), zajawka zamówień stoi 22,5 tys. px niżej. Długość rośnie z każdą dodaną ikoną. | 2 kolumny na mobile (jak `PhotoGrid` w makiecie 6c) albo niższy wiersz. Decyzja właściciela — w kodzie układ opisany jako „WP mobile” (K-40 B). | M | `JustifiedGrid.tsx:38–42`, `globals.css:1835–1846` |
| **V3-17** | ryzyko | `/wyklady/wykladowcy`, 390 | **22,9 ekranu** (768: 13,5); profil zajmuje ok. 690 px, z czego portret 240 × 300 nad nazwiskiem. Brak spisu nazwisk — do osoby z końca listy trzeba przewinąć ok. 20 ekranów. | < 768 mniejszy portret obok nazwiska (np. 96 px) albo spis nazwisk z kotwicami nad listą. | M | `LecturerBio.tsx` (portret 240 px nad tekstem na mobile) |
| **V3-18** | niespójność | `/wyklady` program sezonu, wszystkie szerokości | Data (Garamond 22, złoto) jest większa i jaśniejsza niż tytuł wykładu (18,5, `#f0e6d5`) — wzrok trafia w datę, tytuł czyta się jak podpis. Rozmiar tytułu zgłosiły V1-15 / V2-07; V3 dodaje **odwróconą hierarchię data > tytuł**. | Przy ustalaniu roli „tytuł w liście” (V2-07): tytuł ≥ data. | S | `globals.css:233` (`--lecture-date-size: 22px`), `:84` (`--role-list-title: 18.5px`) |
| **V3-19** | niespójność | przekrojowo (wszystkie trasy poza `/o-akademii`, `/pracownia`) | Jednoliterowe spójniki i przyimki (a, i, o, u, w, z) zostają na końcu wiersza: 1440 — 2–5 na stronę, `/aktualnosci` 390 — 18, `/wyklady/wykladowcy` — 36 (1440) / 97 (390). Na `/o-akademii` i `/pracownia` — 0, bo treść ma ręczne ` ` w JSON. Dwie konwencje w jednym serwisie. | Jedna funkcja w warstwie renderowania treści (MDX / JSON → tekst) wstawiająca twardą spację po jednoliterowych słowach; ręczne ` ` w treści stają się zbędne (treść poza zakresem — tylko mechanizm). | M | brak mechanizmu w `src/`; ręczne ` ` tylko w `content/pages/o-akademii.{json,mdx}` i `pracownia.{json,mdx}` (31 / 4 / 41 / 2); `body { text-wrap: pretty }` (`globals.css:736`) tego nie obejmuje |
| **V3-20** | drobiazg | przekrojowo | Jednowyrazowy ostatni wiersz w dużym stopniu: H1 `/o-akademii` przy 1600 („ikony”), cytat na `/` przy 390 („Tabor.”” — 38 px kursywą), tytuł karty „Kursy doskonalące i konsultacje / indywidualne” (kurs, 390 i 1024–1600). `text-wrap: pretty` z `body` nie wyrównuje krótkich bloków. | `text-wrap: balance` dla H1–H3, cytatów i tytułów kart. | S | `globals.css:736` (globalnie tylko `pretty`); `balance` tylko `.news-article-title` (`:2519`) |
| **V3-21** | drobiazg | `/polityka-prywatnosci`, ≥ 1024 | Listy są szersze niż akapity: `li` 694 px (**88 zn./wiersz**) przy akapitach 640 px — lista podstaw prawnych wychodzi poza miarę prozy. | `max-w-measure-prose` także dla list. | S | `PrivacyPolicyPage.tsx:33` (`ul` bez `max-w`); to samo w `mdx-components.tsx:56–60` |
| **V3-22** | niespójność | `/kontakt`, wszystkie szerokości | Główne dane strony — e-maile i telefon w panelach — to linki bez wyglądu linku (kolor tytułu `#f0e6d5`, bez podkreślenia), a „zadzwoń pod numer 601 734 705” w akapicie adresu to link `tel:` w kolorze tekstu. Wszędzie indziej te same dane są złotym podkreślonym linkiem (stopka, `FactsBox`, pas zamówień). Najważniejsza akcja strony nie wygląda na klikalną. | Wzorzec `TextLink` (ew. większy wariant) dla danych kontaktowych i linku w akapicie; stany hover / fokus → V4. | S | `.contact-email-line` (`globals.css:3456–3466`), `ContactPage.tsx` |
| **V3-23** | drobiazg | `/publikacje/ikona-dzis` spis treści, wszystkie szerokości | Etykieta „Str. 6–51” stoi nad wstępem („Piętnasta rocznica”), a tytuł rozdziału „Piękno Boga, piękno człowieka”, którego dotyczy zakres, dopiero pod wstępem — zakres czyta się jako zakres wstępu. Pozostałe rozdziały: etykieta → tytuł → pozycje. | Wstęp przed etykietą albo etykieta bezpośrednio nad tytułem rozdziału. | S | `PublicationTocList.tsx:50–57` (kolejność `pages` → `intro` → tytuł) |
| **V3-24** | drobiazg | `/publikacje`, 768–1023 po V2-16 (symulacja) | Przepełnienie usunięte (`scrollWidth` = okno przy 768 / 820 / 900), opis albumu 4 wiersze po ok. 62 zn. — czytelne. Kadr okładki zajmuje teraz całą kolumnę (**641 × 641 px**), więc pierwszy ekran po leadzie to sama okładka z pasami `contain` (PU-43). | Kadr okładki maks. 440 px (jak na desktopie) poniżej 1024. | S | `.publication-hub-cover-frame` (`globals.css:4110`); poprawka V2-16 `:4683–4689` |

### 4.0 Decyzje właściciela po checkpoincie (2026-10-05)

- **V3-10:** złoty zostaje „Napisz do nas” (wystawy wyjazdowe); „Zapytaj o oprowadzanie” — przycisk obrysowy pod tekstem.
- **V3-16:** galeria `/ikony` na mobile w 2 kolumnach.
- **V2-16:** wdrożyć na staging przy najbliższym deployu (przed RF-13a).

### 4.1 Potwierdzone z V1 / V2 (bez nowego ID)

| Pozycja | Co widać w V3 |
| --- | --- |
| V1-20 | `/ikony/wystawy` 1600: proza sekcji **88–95 zn./wiersz** (752 px); afiliacje wykładowców w jednym wierszu do ok. 780 px |
| V1-03 / V1-11 | LSŚ: przerwa przed „Głosy z pleneru” to najwyraźniejsza cezura strony; `/warsztaty`: 122 px pustego pola pod cytatami przed stopką |
| V2-04 | wstęp ofert na 390 — potwierdzone na zrzutach |
| V2-05 | „Dalsza droga”: H3 26 px obok 21 px w tej samej stronie — widoczne |
| V2-16 | po poprawce brak przepełnienia (symulacja, V3-24) — na stagingu nadal 834 px |
| V2-17 | `/ikony/wystawy` 768: lead 20 zn., proza 21–25 zn., H1 i H2 w dwóch wierszach (225 px); album 768: okładka 169 px obok panelu 420 |
| V2-13 | album „O albumie” w rozmiarze leadu 19,5 — widoczne jako większy tekst niż proza artykułów |

## 5. Wejście dla RF-13a

Gdzie rytm pionowy psuje się **w odbiorze** (bez wartości docelowych). Puste pasy z §4 dodają się do odstępu sekcji, więc odczuwany odstęp bywa większy niż zmierzony w V1.

1. **Puste pasy doliczane do odstępu.** Kurs „Dalsza droga” → „Jak się zapisać”: odstęp sekcji + 58 / 147 / 207 px (V3-06); `/wyklady` ≥ 1024: pod wstępem 222 px (FactsBox wyższy) + odstęp do „Program sezonu”; `/ikony/wystawy` 768: pusty kafel hero ok. 400 px (V3-11). Odstęp sekcji nie może być jedyną zmienną — przy nierównych kolumnach dochodzi przerwa z układu.
2. **Różne znaczniki granicy sekcji w jednej stronie.** `/ikony/wystawy`: „Oprowadzania” obramowane włosami z góry i z dołu, reszta sekcji bez linii. Kurs: „Jak się zapisać” jako jedyna sekcja oferty z pełnoszerokim złotym włosem. `/`: sekcje rozdzielone włosami (`rule-gold`), pozostałe szablony — samym odstępem. Decyzja o skali powinna objąć regułę „kiedy włos, kiedy sam odstęp”.
3. **Zmiana układu w środku sekwencji.** `/o-akademii`: sekcje z kolumną nagłówków 280 px, a „Prowadząca Akademię” z H2 nad pełną szerokością (makieta `PersonProfile`) — skok osi lewej; potem pas z tłem. Na 1024 (V3-13) kolumny są tak wąskie, że sekcje wydłużają się 2× i odstęp 96 px przestaje dzielić, a zaczyna „dziurawić”.
4. **Największa przerwa ≠ najważniejsza granica.** LSŚ: najdłuższa przerwa na stronie to „Rytm dnia” → „Głosy z pleneru” (V1-03), a nie wejście w program; `/ikony`: sekcja uczniów 132 px (V1-02). W odbiorze strona „pęka” w przypadkowym miejscu.
5. **Dół strony.** `/` (88), `/warsztaty` (122), kurs (82) kończą się pustym polem, `/o-akademii` i zamówienie — pasem do stopki (V1-11, V2 §4). `/o-akademii` dodatkowo kończy się bez wyjścia (V3-14) — przy decyzji o dole strony warto ustalić też, czym strona się kończy.
6. **Nagłówek → treść** (V2-14) — na `/pracownia` cztery wartości w jednej stronie widać przy przewijaniu rozmowy (włosy między wymianami + różne odstępy pod H2/H3).

## 6. Wejście dla V4 (tylko odnotowane)

- **Header 768:** sygnatura w dwóch wierszach, „O Akademii” łamie się na dwie linie (V2 §9) — widać na każdym zrzucie 768.
- **`TocSidebar` `/pracownia`:** po przewinięciu w dół i powrocie na górę aktywna zostaje ostatnia pozycja („Ze wspólnej pracy”) — stan scroll-spy przy górze strony do sprawdzenia.
- **Pasek lat `/aktualnosci` 390:** po przewinięciu strony pasek przewija się w poziomie i „2026” staje przy krawędzi ekranu (x = 0) — automatyczne przewijanie do aktywnego roku.
- **Filtry `/ikony` 390:** przewijany wiersz ucina „Matka Boża” przy krawędzi — czy jest sygnał przewijania, fokus przy przewijaniu klawiaturą.
- **Linki:** dane kontaktowe `/kontakt` (V3-22) — stany hover / fokus; kotwice sekcji `/ikony/wystawy` jako białe linki bez podkreślenia.
- **Akordeony:** „Rozwiń notę” (wykładowcy), archiwum sezonów — nie otwierane w V3.
- **Lightbox, 404, menu mobilne, stopka mobilna** (ok. 2 ekrany na 390) — nie oceniane.

## 7. Pliki pomocnicze (poza repo, `.visual/v3/`)

`probe.mjs` + `analyze.mjs` (sonda i zestawienie), `probe.json` (21 tras × 5 szerokości), `shots.mjs` + `shots/` (kafle 390 / 768 / 1024 / 1600), `checks*.mjs` (sondy celowane), `pub-fix.mjs` (symulacja V2-16).
