# Review 10/R — V4: elementy globalne i stany

Data: 2026-10-05 · gałąź `feat/10-review`, HEAD `a4bf408` (`src/` = `1428105` + poprawka V2-16 w `globals.css`) · model: Opus 5.5 · świeża sesja (RV-6; sesja wznowiona po przerwaniu — kryteria §2 bez zmian)  
Staging: https://academy-68rb8ldp7-greg-d8fb.vercel.app/ (ten sam co V1–V3; różni się od lokalnego kodu tylko poprawką V2-16 na `/publikacje`, poza zakresem V4).  
Wejście: `06-visual-3-pages.md` §6, `06-visual-2-templates.md` §9, `06-visual-1-measure.md` §7, `06-visual-5-spacing-decision.md` §6, `design/README.md` §2–§4 („Stany”, „Animacja”, „Dostępność”), `design/Akademia Ikony - Stopka.dc.html` (notatki makiety).  
Review **niczego nie poprawia**. Wagi: `bug` · `ryzyko` · `niespójność` · `upraszczanie` · `drobiazg`. Koszt: S / M / L.

---

## 1. Metoda

- **Liczby najpierw** (Playwright na stagingu, skrypty poza repo w `.visual/v4/`):
  - `focus.mjs` + `focus-analyze.mjs` — przejście Tab przez 21 tras × 390 / 1440 (`focus.json`): wyliczony obrys, przycięcie przez `overflow` przodka, wysokość celu;
  - `layout.mjs`, `hdrbp.mjs` — Header / `SectionNav` / stopka na 390 / 768 / 1024 / 1440 / 1600 (`layout.json`, `shots/`);
  - `menu.mjs`, `menu2.mjs` — menu mobilne 360 × 640, 390 × 667, 390 × 844 (pułapka fokusu, Esc, `inert`, blokada przewijania);
  - `hover.mjs` — 259 elementów klikalnych na 18 trasach przy 1440: prostokąt przed / po najechaniu, różnica stylów elementu, potomków i `::before` / `::after`, `transition-*` (`hover-1440.json`, `hover-summary.txt`);
  - `lightbox.mjs` — 7 tras × 390 / 1440: otwarcie z klawiatury, fokus początkowy, cykl Tab, strzałki, Esc i powrót fokusu, pola przycisków, axe w stanie otwartym, zrzuty (`lightbox.json`);
  - `accordion.mjs` — `SeasonAccordion`, „Rozwiń notę”, `TocCollapse`: `aria-expanded` / `aria-controls`, Enter / Space, hash, axe po rozwinięciu (`accordion.json`);
  - `misc.mjs`, `toc.mjs`, `clip.mjs` — scroll-spy `TocSidebar`, pasek lat i filtry na 390, nieznane slugi i `?temat=bzdura`, `Breadcrumb`, stopka, axe w menu i na 404, `prefers-reduced-motion` (`reduce` vs `no-preference`).
- **Zrzuty dopiero po pomiarze** — `shots/` (header, stopka, menu, lightbox, akordeony, filtry, pasek lat, TOC, 404).
- **Kontrola makiet:** w `design/*.dc.html` nie ma żadnej deklaracji `transition` ani `scale` — stany z makiety są statyczne (sprawdzone `grep`).
- **Poza zakresem:** treść i placeholdery T1–T30 (np. `aria-label` lightboxa „[do uzupełnienia: podpis zdjęcia]” we wpisie, brak zdjęć na `/ikony/wystawy` — T19), pozycje R0 „znane i wyłączone”.

## 2. Kryteria (spisane przed obejrzeniem czegokolwiek)

Źródło: `CLAUDE.md` (fokus 2 px `#e8c765`, offset 2 px; `prefers-reduced-motion`; brak cieni i zaokrągleń poza `Lightbox`), `design/README` §2 (podpis ≥ 14 px, ≥ 15 px na mobile), §3 (pole klikalne 48 × 48 px w lightboxie, 44 px w headerze mobilnym), §4 (`Breadcrumb` tylko na wpisie; `SectionNav` na mobile to zawijana lista; stany), akapit „Stany” i „Animacja” (hover: kolor, **bez przesunięć**, przejście koloru ≤ 150 ms; żadnych wejść i odsłonięć).

| # | Kryterium | Próg zgłoszenia |
| --- | --- | --- |
| G1 | **Czytelność i hierarchia** komponentu globalnego | element główny (nazwa / logo / aktywna sekcja) ma przewagę nad drugorzędnym; nic nie łamie się „w pół słowa” ani w nieoczekiwany wiersz |
| G2 | **Fokus** | każdy element dostępny z klawiatury ma obrys `2px solid #e8c765`, offset 2 px (wyliczony styl), obrys nie jest przycięty przez `overflow` przodka ani przez krawędź ekranu; kolejność Tab zgodna z kolejnością wizualną |
| G3 | **Klawiatura** | komponenty interaktywne obsługują Tab / Shift+Tab / Enter / Space / Esc / strzałki zgodnie ze wzorcem (APG), pułapka fokusu tylko w dialogu, fokus wraca tam, skąd wyszedł |
| G4 | **Cele dotyku** | ≥ 44 px wysokości (header i menu mobilne), ≥ 48 × 48 px (lightbox, ikony) — liczone po polu klikalnym, nie po tekście |
| G5 | **Hover** | element klikalny ma widoczną zmianę (kolor / tło / obrys / podkreślenie), **bez zmiany rozmiaru lub położenia** (≤ 0,5 px), czas ≤ 150 ms; przejście wieloetapowe (sekwencja) > 150 ms zgłaszam |
| G6 | **Spójność stanów między komponentami** | ta sama rola (link w tekście, link nawigacji, przycisk, chip, akordeon) ma ten sam hover i fokus wszędzie; różnice tylko tam, gdzie makieta je przewiduje |
| G7 | **`prefers-reduced-motion`** | przy `reduce` brak przejść i przewijania animowanego; przy `no-preference` brak animacji innych niż przejście koloru ≤ 150 ms |
| G8 | **Stany puste i 404** | brak danych ≠ pusty nagłówek; nieznany adres → 404 z powłoką i wyjściem; filtr bez wyników ma komunikat |
| G9 | **Mobile (390)** | brak poziomego przewijania strony; sygnał przewijalnego rzędu; menu mieści się w oknie i nie zdubluje pozycji; długość stopki ≤ 1,5 ekranu (sygnał) |
| G10 | **Rozmiar podpisu** | `text-size-caption` (14,5 px) na 390 poniżej minimum 15 px — odsyłam do V1-14, nie zgłaszam drugi raz |
| G11 | **Dostępność nazw / ról** | `aria-current`, `aria-expanded`, `aria-controls`, `aria-label` odpowiadają stanowi; axe 0 naruszeń w stanach otwartych (menu, lightbox, akordeon) |

Metoda: pomiar (Playwright: wyliczone style, `getBoundingClientRect`, symulacja Tab / hover) → dopiero potem zrzuty i ocena okiem.

## 3. Karta komponentów

| Komponent | Wynik pomiaru (skrót) | Ocena | Zgłoszenia |
| --- | --- | --- | --- |
| `Header` desktop | 84 px od ok. 960 px; przy 768–950: sygnatura w 2 + 2 wierszach, „O Akademii” w dwóch, header **125 px** | ≥ 960 dobrze; 768–950 rozsypany | V4-01 |
| `Header` mobile | hamburger 44 × 44, logo-link **37 px** wysokości | dobrze poza celem logo | V4-10 |
| Menu mobilne | pułapka fokusu, Esc z powrotem fokusu, `inert` na `main` / stopce, blokada przewijania — działają; axe 0; zawsze rozwinięte „Ikony”; nie mieści się w 844 px (ok. 80 px przewinięcia do drugiego CTA); dolny wiersz linków 22 px | działa, stan początkowy i dół do poprawy | V4-04, V4-05 |
| `SectionNav` | ta sama pozycja (y 110, wys. 58) na wszystkich trasach z sekcją i szerokościach (poza 768 — przesunięta przez V4-01); na 390 zawija się (kurs: 2 wiersze) — zgodnie z `design/README` §4; linki 44 px | dobrze | — |
| `Breadcrumb` | tylko album i artykuły (`/publikacje/*`), nie na wpisie — zgodne z nowszymi makietami (V2 §6, K-130; zgodność z `design/README` §4 → C1, S-24); linki 24 px, bez hovera; 14,5 px (V1-14) | działa | V4-09, V4-10 |
| `Footer` | 390: 1504 px = **1,78 ekranu** (makieta „Stopka” sama zakłada 2,11 — zgodne); wiersze mapy 44 px; „Fundacja IKONA DZIŚ” 22 px, „GK” 19 px; przy 768 e-mail / telefon 25 px, „Polityka prywatności” 19 px | zgodna z makietą, drobne cele | V4-10 |
| `Lightbox` | 6 tras z galerią (na `/ikony/wystawy` brak — T19): Enter otwiera, fokus na „Zamknij”, Tab w dialogu, strzałki, Esc + powrót fokusu na kafel — **wszędzie OK**; axe 0; desktop strzałki 48 × 48, mobile 104–138 × 56; tło 85 % krycia (strona prześwituje na mobile); CTA ikony 44 px | działa; mobile do poprawy | V4-06, V4-10 |
| `SeasonAccordion` | `aria-expanded` / `aria-controls` OK, Enter / Space, fokus zostaje; jeden otwarty naraz; `#season-…` rozwija i przewija (trigger 27 px od góry); axe 0; hash nie nadąża za kliknięciem | działa | V4-12 |
| „Rozwiń notę” | `aria-expanded` / `aria-controls` OK, klawiatura OK, przycisk **41 px** | działa | V4-10 |
| Archiwum Aktualności | przycisk „Pokaż archiwum…” 335 × 44, po Enter fokus na pierwszy tytuł archiwum (obrys złoty) — wzorzec „pokaż więcej”, przycisk znika (bez `aria-expanded` — poprawnie) | dobrze | — |
| `TocCollapse` (390) | `summary` 48 px, Enter / Space, obrys OK | dobrze | — |
| `TocSidebar` (≥ 1024) | sticky `top: 20`, linki 44 px, `aria-current="location"`; scroll-spy przy przewijaniu OK; skok na górę strony zostawia aktywną ostatnią pozycję (`/pracownia`) | drobny błąd stanu | V4-11 |
| Pasek lat `/aktualnosci` (390) | sticky, linki 40 × 44, auto-przewijanie do aktywnego roku działa; po powrocie na górę „2026” przy x = 0; fokus z klawiatury nie odsłania częściowo ukrytego roku | do poprawy | V4-02, V4-03 |
| Filtry `/ikony` (390) | przewijany rząd, sygnał = ucięty chip (bez maski — zgodnie z K-44), chipy 48 px; **fokus z klawiatury nie przewija rzędu** — „Święta” w 84 % poza ekranem | bug | V4-02 |
| Fokus (21 tras × 2) | 0 odstępstw od `2px solid #e8c765 / 2px` po ustabilizowaniu; obrys „wjeżdża” 150 ms; `iframe` mapy bez obrysu | prawie wzorcowo | V4-08, V4-13 |
| Hover (259 elementów, 1440) | **0 przesunięć** (≤ 0,5 px); czasy 150 ms; ale: podkreślenie nawigacji rośnie od środka (`scaleX`), obrys przycisku drugorzędnego rysowany w dwóch etapach (300 ms); 5 typów linków bez żadnej zmiany | niespójność z „Animacja” | V4-07, V4-09 |
| `prefers-reduced-motion` | globalna reguła zeruje `transition-duration` i `scroll-behavior`; `scrollBehavior()` w JS respektuje; **`transition-delay` 150 ms zostaje** (przycisk drugorzędny) | prawie | V4-07 |
| Stany puste | `?temat=bzdura` → kanoniczny `/ikony`, „Wszystkie”, 52 ikony (brak pustego wyniku — filtr nie może dać zera); listy bez danych → V2-09 | dobrze | — |
| 404 | 6 nieznanych slugów (`/aktualnosci/…`, `/publikacje/…`, `/ikony/…`, `/wyklady/…`, `/warsztaty/…`, adres główny) → **status 404**, powłoka, H1, 7 wyjść; axe 0; `/ikony/wystawa` → 308 na `/ikony/wystawy` (R3) | dobrze | (cel „Strona główna” — V4-10) |

## 4. Zgłoszenia

| ID | Waga | Miejsce | Opis | Propozycja | Koszt | Przyczyna w kodzie |
| --- | --- | --- | --- | --- | --- | --- |
| **V4-01** | niespójność | `Header`, 768–ok. 950 px (V2 §9, V3 §6) | Nawigacja desktopowa włącza się od 768, gdy brakuje dla niej miejsca: sygnatura „AKADEMIA / IKONY” i podpis łamią się na 2 + 2 wiersze, „O / Akademii” w dwóch wierszach (pozostałe pozycje w jednym), header ma **125 px zamiast 84** i spycha `SectionNav` na y 151. Od ok. 960 px wszystko w jednym wierszu. Na każdej stronie przy 768 to pierwszy widok. | Wariant mobilny (hamburger) do 1024 (`lg`) — spójnie z jednym progiem kolumn (V2-17, RF-15); alternatywnie `white-space: nowrap` na linkach i sygnaturze + mniejszy `gap` od 768. | S | `Header.tsx:19` (`hidden md:flex … gap-space-6`), `:41` (`md:hidden`) |
| **V4-02** | bug | `/ikony` filtry i `/aktualnosci` pasek lat, 390 (prawdopodobnie każdy przewijany rząd < 768) | Fokus z klawiatury na częściowo ukrytej pozycji **nie przewija rzędu**: „Święta” po Tab stoi na x 360–452 przy krawędzi 375 — widać tylko lewy brzeg obrysu (84 % chipa poza ekranem), „Matka Boża” ucięta o 24 px; w pasku lat „2013” w 75 % poza ekranem, „2021” o 17 px (zrzuty `clip_*`). Użytkownik klawiatury nie widzi, na czym stoi (WCAG 2.4.11). | `scroll-padding-inline` na kontenerze przewijanym (= margines strony) i przy `focusin` `scrollIntoView({ inline: "nearest", block: "nearest" })` dla pozycji rzędu; to samo naprawia V4-03. | S | `GalleryFilters.tsx:22–29` (`chipRowClass`), `.year-nav-links` (`globals.css:2124–2138`) |
| **V4-03** | drobiazg | `/aktualnosci` pasek lat, 390 (V3 §6) | Auto-przewijanie do aktywnego roku (`scrollIntoView` „nearest”) ignoruje wewnętrzny odstęp 20 px: po przewinięciu strony w dół i powrocie na górę „2026” stoi na **x = 0** (na starcie x = 20), obrys fokusu ucięty z lewej o 4 px; aktywny rok w środku listy dosuwa się do samej prawej krawędzi (x 335–375). | Jak V4-02 (`scroll-padding-inline` na `.year-nav-links`). | S | `YearNav.tsx:53–57` |
| **V4-04** | niespójność | menu mobilne, 390 | Po otwarciu menu zawsze rozwinięta jest sekcja „Ikony”, niezależnie od strony. Na kursie rozwinięte są „Ikony”, a „Warsztaty” (bieżąca sekcja, złota) zwinięte — link bieżącej podstrony z `aria-current="page"` jest niewidoczny. W makiecie mobilnej rozwinięte są „Warsztaty” i „Ikony” — stan makiety, nie reguła zależna od strony. | Rozwinąć sekcję z `resolveNav(path).section` (brak sekcji → nic rozwiniętego); przy jednej rozwiniętej sekcji naraz to też skraca menu (V4-05). | S | `HeaderMobileMenu.tsx:74–77` (`setExpandedSection(iconsLabel)`) |
| **V4-05** | drobiazg | menu mobilne, 390 × 844 | Menu (z rozwiniętą sekcją) nie mieści się w oknie 844: drugi przycisk („Kontakt · 601 734 705”) zaczyna się na y 809 i jest ucięty, dolny wiersz „Aktualności · Publikacje · Blog” wymaga ok. 80 px przewinięcia; linki tego wiersza mają **22 px** wysokości (minimum w menu 44). Podwójne „Aktualności” / „Kontakt” — zgodne z makietą, nie zgłaszam. | Po V4-04 (jedna rozwinięta sekcja = bieżąca) sprawdzić ponownie wysokość; dolny wiersz z polem 44 px (`tap-target-nav`). | S | `HeaderMobileMenu.tsx` (dolny wiersz linków) |
| **V4-06** | niespójność | `Lightbox` mobile (< 1024), wszystkie trasy | Tło dialogu ma **85 % krycia**: na 390 przez lightbox prześwituje strona (sygnatura headera za „Zamknij”, kafle galerii za podpisem), a przyklejony pasek „Poprzednie · 1 z 52 · Następne” z tym samym tłem przepuszcza tekst meta, który pod nim przewija się („Tagi: Święta” czytelne pod paskiem). W wariancie ikony CTA „Zapytaj o podobną ikonę” jest poniżej pierwszego ekranu (y 847 przy 844), a sam `dialog` staje się przewijanym celem Tab z domyślnym obrysem przeglądarki (`auto 1px`). `design/README`: tło lightboxa `#0d0a08` matowe, przezroczystość tylko w przyciemnieniu. | Panel i pasek z tłem pełnym (`#0d0a08`), przyciemnienie zostaje na `::backdrop`; kontener przewijany z `tabindex="-1"` albo obrysem z tokenu. | S | `globals.css:32` (`--surface-lightbox: rgb(13 10 8 / .85)`), `LightboxDialogShell.tsx:85, 131`, `.lightbox-dialog` (`globals.css:776–790`) |
| **V4-07** | niespójność | wszystkie trasy, ≥ 768 (hover) | Dwie animacje poza „przejściem koloru ≤ 150 ms”: (1) podkreślenie linku nawigacji (header, `SectionNav`, pasek lat, 404) **rośnie od środka** (`scaleX` 0 → 1, 150 ms); (2) obrys przycisku drugorzędnego **rysuje się w dwóch etapach** — góra / dół, po 150 ms boki (łącznie 300 ms; przy zjeździe odwrotnie). `design/README` „Stany”: „bez przesunięć, skalowania … nic się nie rusza”; makiety nie mają żadnego `transition`. Przy `reduce` globalna reguła zeruje czas, ale **nie opóźnienie** — boki obrysu nadal pojawiają się po 150 ms. | Podkreślenie i obrys jako statyczne linie zmieniające kolor (przejście koloru ≤ 150 ms); w regule `reduce` dodać `transition-delay: 0s`. Jeśli animacje są świadomą decyzją K-xx — właściciel potwierdza i zapisujemy wyjątek od „Animacja”. | S | `globals.css:1001–1032` (`.nav-link-underline`), `:1044–1132` (`.btn-secondary-borders__*`), `:4692–4698` (reguła `reduce`) |
| **V4-08** | drobiazg | wszystkie trasy (stopka, chipy, przyciski, linki z `transition-colors`) | `transition-colors` obejmuje `outline-color`, więc po Tab obrys fokusu przez 150 ms przechodzi z koloru tekstu w złoto (pierwsza klatka: obrys beżowy / szary). Po ustabilizowaniu 0 odstępstw na 21 trasach. | Wyłączyć `outline-color` z przejścia (np. własna lista `transition-property` w tokenie przejścia albo `transition: none` dla `outline` w regule `:focus-visible`). | S | `colorTransition` w `Footer.tsx:21–25`, `FilterChip`, `Button` (Tailwind `transition-colors`); reguła fokusu `globals.css:748–754` |
| **V4-09** | drobiazg | `/` filary, `/publikacje` + album (rozkładówki, spis treści), `Breadcrumb` | Elementy klikalne **bez żadnej zmiany przy hoverze** (pomiar: 0 różnic stylu w elemencie i potomkach): filar na `/` (zdjęcie + tytuł jako jeden link), kafel rozkładówki (galerie ikon i zdjęć pokazują lupę — rozkładówki nie), tytuły rozdziałów w spisie albumu, linki `Breadcrumb`. Ta sama rola ma hover gdzie indziej (G6). Dane kontaktowe `/kontakt` — V3-22. | Tytuł filaru i tytuł rozdziału jak tytuł-link listy (kolor → złoto); lupa na kaflu rozkładówki jak w `JustifiedGrid`; `Breadcrumb` jak `TextLink` w kolorze trzeciorzędnym (hover → złoto). | S | `Pillars.tsx:21`, `.publication-spread-tile` (`globals.css:4235`), `.publication-toc-title-link` (`:4487–4496`), `Breadcrumb.tsx:26` |
| **V4-10** | niespójność | 390 (i 768–1023 — tablet dotykowy) | Cele dotyku poniżej minimum `design/README` §3 (48, w headerze 44): logo-link **37 px**; „Rozwiń notę” **41 px**; samodzielne `TextLink` (poza akapitem: „Cała galeria”, „Pełne archiwum”, „Strona główna” na 404 itd.) **22–26 px**; `Breadcrumb` 24 px; stopka: „Fundacja IKONA DZIŚ” 22 px, „GK” 19 px, a od 768 e-mail / telefon 25 px i „Polityka prywatności” 19 px (pole 44 tylko < 768; makieta „Stopka”: wszystkie wiersze mobile 44 px); CTA w lightboxie 44 px (lightbox — 48). | Klasa pola dotyku (`tap-target-nav`) dla samodzielnych linków, logo i „Rozwiń notę”; w stopce pole 44 do 1024 (`lg`), nie do 768. Linki w akapicie bez zmian. | M | `TextLink.tsx` (brak wariantu „samodzielny”), `LecturerBio.tsx` (przycisk noty), `Header.tsx` (logo), `Footer.tsx:24, 138` (`md:min-h-0`), `Breadcrumb.tsx:26` |
| **V4-11** | drobiazg | `TocSidebar` `/pracownia`, ≥ 1024 (V3 §6) | Po skoku na górę strony (Home, link „do góry”, odświeżenie z przewinięciem) aktywna zostaje ostatnia pozycja („Ze wspólnej pracy”), bo nad pierwszą sekcją żaden obserwowany element nie przecina pasa obserwacji. Przy powolnym przewijaniu stan wraca poprawnie; na `/polityka-prywatnosci` pierwsza sekcja jest blisko góry, więc problemu nie widać. | Gdy `scrollY` jest nad pierwszą sekcją — aktywna pierwsza pozycja (albo żadna). | S | `useTocActiveId.ts` (`IntersectionObserver` aktualizuje tylko przy przecięciu) |
| **V4-12** | drobiazg | `/wyklady/archiwum` | Wejście z `#season-2019-2020` rozwija i przewija sezon (K-139), ale rozwinięcie innego sezonu zostawia stary hash — w pasku adresu `#season-2019-2020`, otwarty 2023/2024, a 2019/2020 zamknięty. Skopiowany adres otwiera inny sezon niż widoczny. | Przy rozwinięciu `history.replaceState` z hashem otwartego sezonu (przy zwinięciu — bez hasha). | S | `SeasonAccordion.tsx` (obsługa kliknięcia) |
| **V4-13** | drobiazg | `/kontakt`, wszystkie szerokości | `iframe` mapy jest celem Tab bez widocznego fokusu (wyliczony obrys `none`) — jedyny taki element w serwisie (21 tras). | Obrys z tokenu na wrapperze przez `:focus-within` albo reguła `iframe:focus-visible` w warstwie `base`. | S | reguła fokusu `globals.css:748–754` (tylko `a`, `button`, `summary`, `[tabindex]`); `MapBlock` |

### 4.1 Potwierdzone z V1–V3 (bez nowego ID)

| Pozycja | Co widać w V4 |
| --- | --- |
| V1-14 | `text-size-caption` 14,5 px na 390 także w `Breadcrumb`, etykiecie „Na tej stronie” (`TocSidebar` / `TocCollapse`), `dt` w panelach faktów |
| V3-22 | dane kontaktowe `/kontakt` (e-maile w panelach, `tel:` w akapicie) — **brak hovera** (pomiar: 0 różnic) i wygląd tekstu; fokus poprawny |
| V2 §9 / V3 §6 (header 768) | → V4-01 |
| V3 §6 (pasek lat, filtry, TOC) | → V4-02, V4-03, V4-11 |
| V2-09 | stany puste list — bez zmian, V4 nie dodaje nowych przypadków (filtr `/ikony` nie może dać pustego wyniku) |

### 4.2 Sprawdzone, bez zgłoszenia

- **Brak przesunięć przy hoverze** — 259 elementów, 0 zmian położenia / rozmiaru > 0,5 px.
- **Menu mobilne:** pułapka fokusu, Esc z powrotem na przycisk menu, `inert` na reszcie strony, blokada przewijania, axe 0 (R2 / RF-1 potwierdzone na stagingu).
- **Lightbox:** otwarcie z klawiatury, fokus na „Zamknij”, Tab w dialogu (wyjście tylko do paska przeglądarki — zachowanie natywnego `<dialog>`), strzałki, Esc, powrót fokusu na kafel, klik w tło zamyka (desktop), cień tylko na obrazie desktopowym, 0 zaokrągleń, axe 0 — na 6 trasach.
- **Akordeony:** `aria-expanded` / `aria-controls` zgodne ze stanem, Enter i Space, fokus zostaje na przycisku, axe 0 po rozwinięciu.
- **404:** status 404 dla nieznanych slugów wszystkich typów, powłoka, wyjścia, axe 0.
- **`prefers-reduced-motion`:** przejścia i przewijanie wyłączone (poza opóźnieniem — V4-07).
- **Stopka mobilna:** 1,78 ekranu — dłuższa niż próg sygnału G9, ale krótsza niż zakłada makieta „Stopka” (2,11 ekranu, „wszystkie wiersze 44 px”); nie zgłaszam.
- **Kolor hovera kredytu „GK”** (`--footer-credit-hover: #ff78be`) — spoza palety `design/README`, ale jako osobny token wygląda na świadomy podpis wykonawcy; odnotowuję, nie zgłaszam.

## 5. Brama powrotna RF-13a

**Założenia decyzji trzymają; jedno dopisanie do zakresu RF-13.** V4 nie dotyka skali odstępów sekcji: stopka jest zgodna z makietą „Stopka” i oddzielona włosem, więc reguła „dół strony 26 z powłoki, pas z tłem do stopki (0)” nie koliduje z niczym w stopce; pasy zamykające (`/o-akademii`, `/ikony/na-zamowienie`) w V4 bez nowych przypadków; `SectionNav` stoi w tym samym miejscu (y 110, wys. 58) na wszystkich trasach i szerokościach — jedyny wyjątek (y 151 przy 768) wynika z wysokości headera (V4-01), nie z odstępu, a `Breadcrumb` występuje tylko w publikacjach i nie tworzy własnego rytmu. **Lewa kreska akordeonu sezonów** to `border-l-2 border-l-accent` (2 px) na nagłówku i panelu otwartego sezonu (`SeasonAccordion.tsx:101, 133`) — złota lewa kreska w rozumieniu decyzji 5 (`--accent-bar` 3 px „wszystkie złote belki paneli i lewe kreski”), ale **nie ma jej na liście RF-13** — dopisać do zakresu, żeby po RF-13 nie została jedyna kreska 2 px. Nic z V4 nie wymaga ponownego otwarcia wartości 56 / 34 / 80 / 34 / 26 / 20 / 14 ani progu 768.

## 6. Wejście dla poprawek wizualnych

Projekt paczek **RF-15…RF-20** dopisany w `docs/plans/10-review-fixes.md` (do zatwierdzenia). Przydział zgłoszeń V1–V4 niepokrytych przez RF-13 / RF-14:

| Paczka | Zgłoszenia |
| --- | --- |
| RF-13 (dopisanie) | lewa kreska `SeasonAccordion` → `--accent-bar` (§5) |
| RF-14 (dopisanie — role typograficzne) | V1-14, V2-04, V2-05, V2-07, V2-08, V2-13, V2-15, V3-07, V3-18 (obok V1-15…V1-21, już w źródłach RF-14) |
| RF-15 — układ ≥ 768: jeden próg kolumn | V2-17, V3-01, V3-02, V3-03, V3-04, V3-05 (768), V3-11, V3-12, V3-13, V3-24, V4-01 |
| RF-16 — mobile 390: długość i miara | V3-05 (390), V3-15, V3-16, V3-17 |
| RF-17 — fokus, klawiatura, cele dotyku | V4-02, V4-03, V4-08, V4-10, V4-11, V4-12, V4-13 |
| RF-18 — hover, menu mobilne, lightbox | V4-04, V4-05, V4-06, V4-07, V4-09, V3-22 |
| RF-19 — zakończenia stron, CTA, panele | V2-01, V2-02, V2-03, V2-06, V2-09, V2-10, V2-11, V2-12, V3-06, V3-08, V3-09, V3-10, V3-14, V3-23 |
| RF-20 — miara, łamanie, polska typografia | V1-20, V3-19, V3-20, V3-21 |

Zamknięte bez paczki: V1-18 (V2 §4), V2-16 (naprawione 2026-10-05). V1-01…V1-13 i V2-14 — RF-13; V1-15…V1-17, V1-19, V1-21 — RF-14.

## 7. Pliki pomocnicze (poza repo, `.visual/v4/`)

`focus.mjs` / `focus-analyze.mjs` / `focus.json`, `layout.mjs` / `hdrbp.mjs` / `layout.json`, `menu.mjs` / `menu2.mjs`, `hover.mjs` / `hover-1440.json` / `hover-summary.txt`, `lightbox.mjs` / `lightbox.json`, `accordion.mjs` / `accordion.json`, `misc.mjs` / `misc.json`, `toc.mjs`, `clip.mjs`, `dbg1–3.mjs`; zrzuty w `shots/` (`header-*`, `footer-*`, `menu-*`, `lb-*`, `acc-*`, `filters-*`, `yearnav-*`, `clip_*`, `toc_*`, `404-390`).
