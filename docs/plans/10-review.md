# Plan 10/R — Review serwisu (techniczne, wizualne, treść)

Status: **zatwierdzony** 2026-10-04 · R0 ✅ 2026-10-04 · R1 ✅ 2026-10-04 · R2 ✅ 2026-10-04 · R3 ✅ 2026-10-04 · R4 ✅ 2026-10-04 · R5 ✅ 2026-10-04 · `10-review-fixes.md` **zatwierdzony** 2026-10-04 (D1–D10) · RF-0 ✅ 2026-10-05 (Playwright, baseline) · workflow lokalny D11 · V1 ✅ · V2 ✅ 2026-10-05 · V3 ✅ 2026-10-05 · następny: **RF-13a** (V4 niezależnie)  
Gałąź: `feat/10-review` od `main` — dokumenty review i paczki poprawek; k8 zostaje na `feat/10-finishing` (merge do `main` niezależnie)  
Staging: https://academy-web-lovat.vercel.app/  
Makiety: tokeny `design/README`, odczyt wartości `docs/design-mockup-guide.md` (tylko jako punkt odniesienia w V1–V4).

## Cel i zakres

Kompleksowy przegląd tego, co jest zaimplementowane i widoczne na stagingu, w trzech oddzielnych fazach, żeby nie mieszać kontekstów:

1. **Techniczne (R0–R5)** — dobre praktyki, czysty kod, reużywalność, overengineering, możliwości uproszczenia, błędy i bugi.
2. **Wizualne (V1–V4)** — spójność layoutu, spacingu, typografii i tokenów strona po stronie i między stronami; odstępstwa od wzorców; to, co psuje czytelność.
3. **Zgodność z planem i treść (C1–C2)** — dopiero po zamknięciu backlogu treści EJK (T1–T30).

**Zasada nadrzędna:** review **zbiera zgłoszenia, niczego nie poprawia**. Poprawki idą osobnym planem (`docs/plans/10-review-fixes.md`, powstaje w R5 i po V4).

**Poza zakresem:** wszystko z listy „znane i wyłączone” z R0; SEO, analityka, JSON-LD (k9); Lighthouse jako raport DoD (k10); zmiany w `design/` i `content/`.

## Decyzje podjęte w sesji planistycznej

| ID | Decyzja |
| --- | --- |
| **RV-1** | Review jako blok R **teraz, równolegle do k8** (k8 czeka na EJK, review nie dotyka `content/`). k10 okrojony do: delta po k9 + Lighthouse + synchronizacja dokumentów. |
| **RV-2** | Wyniki w `docs/review/0N-*.md` — jeden plik na fazę; poprawki osobnym planem, nie w trakcie review. |
| **RV-3** | Jednorazowe `npx knip` i `npx jscpd` w R0 — bez dodawania do `package.json`. |
| **RV-4** | Review wizualne na stagingu (to widzi klient); po rundzie poprawek — na odświeżonym deployu. |
| **RV-5** | Model: **Opus 5.5** dla wszystkich faz **poza R5** (synteza techniczna — **Fable 5.1**). Każda faza w **świeżej sesji**. |
| **RV-6** | Ograniczanie biasu „ten sam model ocenia swój kod”: świeża sesja na fazę; w R1–R4 bez sięgania po uzasadnienia decyzji z archiwum (tylko `CLAUDE.md`, brief, kod); twarde dane z narzędzi (R0) i pomiar (V1) przed oceną okiem; ostateczny arbiter w fazie wizualnej — właściciel. |
| **RV-8** | Osobna gałąź `feat/10-review` od `main`: review i jego poprawki (`src/`) idą równolegle do k8 (`content/` na `feat/10-finishing`), więc rozdzielamy historię i merge'ujemy niezależnie. Komunikaty commitów: `10/R0: …`, `10/R5: …`, poprawki `10/RF-N: …`. |
| **RV-9** | (2026-10-05) Wartości docelowe odstępów to decyzja wizualna o dużym skutku, więc ma osobny krok **RF-13a** (Fable 5.1, doradztwo z dostępem do archiwum, przełącznik wariantów). Kolejność: V1 → V2 → V3 → **RF-13a** → RF-13; V4 niezależnie, po nim brama powrotna. Powód: decyzja ma być spójna z ustaleniami V2/V3, a RF-13 nie startuje z liczb zgadniętych z samego pomiaru. |
| **RV-7** | Kolejność: R0 → R1–R4 → R5 → *poprawki techniczne* → V1–V4 → *poprawki wizualne* → (po EJK) C1–C2. Techniczne przed wizualnym, bo refaktory wspólnych wrapperów i spacingu same usuną część niespójności wizualnych. |

## Format zgłoszenia (wspólny dla wszystkich faz)

| Pole | Treść |
| --- | --- |
| ID | `R1-03`, `V2-11` itd. |
| Waga | `bug` · `ryzyko` · `niespójność` · `upraszczanie` · `drobiazg` |
| Miejsce | `plik:linia` albo trasa + szerokość (390 / 1440 / 1600) |
| Opis | co jest nie tak, jednym–dwoma zdaniami |
| Propozycja | kierunek poprawki |
| Koszt | S / M / L |
| Przyczyna w kodzie | (V1–V4) wskazanie miejsca w kodzie, jeśli widoczne |

Zgłoszenia trafiające na listę „znane i wyłączone” z R0 — nie zgłaszamy.

## Pliki

| Plik | Nowy/zmiana | Odpowiedzialność |
| --- | --- | --- |
| `docs/review/00-scope.md` | nowy | zakres, wyłączenia, punkt odniesienia, wyniki narzędzi |
| `docs/review/01-data.md` … `04-cross-cutting.md` | nowe | zgłoszenia R1–R4 |
| `docs/review/05-tech-synthesis.md` | nowy | R5: scalone, zdeduplikowane, priorytety, paczki poprawek |
| `docs/review/06-visual-*.md` | nowe | zgłoszenia V1–V4 |
| `docs/review/07-plan-content.md` | nowy | C1–C2 |
| `docs/plans/10-review-fixes.md` | nowy (R5) | plan poprawek wg szablonu Załącznik A |

## Kawałki

### R0 — Zakres i dane twarde (Opus 5.5)

Zakres:
- **Znane i wyłączone:** T1–T30 (`docs/plan-claude-code.md` §5) — m.in. brakujące `alt`/`caption`, `[do uzupełnienia]`, placeholdery zdjęć wystaw (T19), copy z makiet do redakcji EJK (T22); B1–B10 (`10-finishing.md`); celowe decyzje K-xx z §4 (np. zaokrąglenia tylko w `Lightbox`, układ wystaw K-127).
- **Punkt odniesienia:** commit/deploy stagingu; lista tras z briefu §3 pogrupowana w szablony (ofertowe, listy, szczegóły, galerie, statyczne); szerokości 390 / 1440 / ≥ 1600 (K-30).
- **Narzędzia:** `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npx knip`, `npx jscpd src`, axe na stagingu (przez przeglądarkę) — surowe wyniki streszczone w `00-scope.md`, bez oceny.

Gotowe: `docs/review/00-scope.md` zaakceptowany.

### R1 — Warstwa danych (Opus 5.5)

Zakres: `src/content/*`, `src/lib`, `src/content/types.ts`, `src/config`.
Na co patrzę: poprawność (daty, sezony, sortowanie, „Najbliższe” K-136, stan wystawy, slugi, `notFound`), przypadki brzegowe (puste dane, brak pól opcjonalnych), duplikacja loaderów, typowanie strict, zbędne abstrakcje.
Gotowe: `docs/review/01-data.md`.

### R2 — Komponenty (Opus 5.5)

Zakres: `src/components/**`.
Na co patrzę: API propsów, duplikaty (karty, nagłówki sekcji, gridy, wrappery), podział Server/Client, fokus / klawiatura / ARIA w kodzie, `next/image` z wymiarami, nadmiarowe warstwy, nazwy zgodne z `design/README`.
Gotowe: `docs/review/02-components.md`.

### R3 — Trasy (Opus 5.5)

Zakres: `src/app/**`.
Na co patrzę: składanie stron, powtarzane „skorupy” stron, `generateStaticParams`, `revalidate`, `metadata`, spójność przekazywania danych, etykiety z `navigation.ts` zamiast hardkodów.
Gotowe: `docs/review/03-routes.md`.

### R4 — Przekrojowe (Opus 5.5)

Zakres: `globals.css` i tokeny, `src/i18n/pl.ts`, `src/navigation.ts`, `mdx-components.tsx`, `scripts/`, przekierowania, `package.json`.
Na co patrzę: wartości arbitralne, nieużywane / zdublowane tokeny, nieużywane klucze `pl.ts`, tekst w JSX, martwy kod, zakazy z `CLAUDE.md` (`#8d7d69`, 13px, cienie, IBM Plex Mono); **przyczyny niespójnego spacingu w kodzie** (paddingi per strona vs wspólny wrapper) — wejście dla V1.
Gotowe: `docs/review/04-cross-cutting.md`.

### R5 — Synteza techniczna (**Fable 5.1**)

Zakres: scalenie R1–R4 + wyniki narzędzi z R0; deduplikacja; priorytety (bugi → ryzyka → upraszczanie → drobiazgi); propozycje uproszczeń architektonicznych; podział na paczki poprawek.
Gotowe: `docs/review/05-tech-synthesis.md` + projekt `docs/plans/10-review-fixes.md` do zatwierdzenia.

### — Poprawki techniczne (wg `10-review-fixes.md`, osobne checkpointy) —

### V1 — Pomiar wzorców (Opus 5.5)

Zakres: wszystkie trasy × 390 / 1440 / 1600 na stagingu. Skrypt w przeglądarce zbiera wyliczone style: szerokości kontenerów, odstępy między sekcjami, rozmiary / fonty / interlinie H1–H3 i tekstu, kolory i rozmiary spoza tokenów.
Gotowe: `docs/review/06-visual-1-measure.md` — tabela odstępstw od dominującego wzorca.

### V2 — Spójność w obrębie szablonu (Opus 5.5)

Zakres: grupy — ofertowe (kurs, plener, LSŚ, zamówienie), listy (aktualności, wykłady + archiwum, publikacje), szczegóły (wpis, artykuł, album), galerie (ikony, wystawy), statyczne (o akademii, pracownia, kontakt, polityka). Strony jednego typu porównywane obok siebie.
Gotowe: `docs/review/06-visual-2-templates.md`.

### V3 — Strona po stronie (Opus 5.5)

Zakres: każda trasa, zrzuty 390 / 1440 / 1600: czytelność, hierarchia, niejasny układ, rytm pionowy, długość wierszy, łamanie.
Gotowe: `docs/review/06-visual-3-pages.md`.

### RF-13a — Decyzja o skali odstępów i belce (Fable 5.1) · warunek: V1–V3 zamknięte

Zakres: sesja doradcza z właścicielem, **bez kodu produkcyjnego**. Model:
1. czyta V1 §3–§6, V2, V3 oraz bazowy `design/README` §3 i `README-o-akademii-pracownia.md` pkt 7 (96 px) — źródło konfliktu 56–64 vs 96;
2. **sięga do archiwum i historii** (`docs/archive/`, `plan-claude-code-historia.md`, `git log -S` na `--section-gap`, `8bdf59a`) — tylko tu wolno (RV-6 dotyczyło R1–R4): skąd 96 px, które decyzje K-xx dotykają odstępów, czy coś ważnego przeoczyliśmy;
3. ocenia UX każdej opcji (rytm, czytelność granic sekcji, długość stron, spójność z makietą, mobile) i **rekomenduje**; właściciel decyduje (RV-6);
4. dodaje tymczasowy przełącznik wariantów `--section-gap` (56 / 64 / 96) + wariant „ciasny”; zrzuty 4 tras testowych (`/`, `/o-akademii`, `/warsztaty/letnia-szkola-swiatla`, `/ikony`) × 390 / 1440 × warianty; kryteria spisane **przed** oglądaniem; ocena także na żywo (przewijanie);
5. zapisuje decyzję (wartości, powód, odrzucone alternatywy) w `10-review-fixes.md` (warunek startu RF-13) i jako regułę w `CLAUDE.md` (propozycja do właściciela). Przełącznik usuwany po decyzji.

Brama powrotna: po V4 krótkie sprawdzenie, czy V4 nie zmienia założeń; jeśli tak — decyzję otwieramy ponownie przed RF-13. Po RF-13 wartość można korygować jednym tokenem.
Gotowe: `docs/review/06-visual-5-spacing-decision.md` (analiza, kryteria, zrzuty, rekomendacja, decyzja właściciela).

### V4 — Elementy globalne i stany (Opus 5.5)

Zakres: `Header`, menu mobile, `SectionNav`, `Breadcrumb`, `Footer`, `Lightbox`, akordeony; fokus, hover, stany puste, 404.
Gotowe: `docs/review/06-visual-4-global.md` + uzupełnienie `10-review-fixes.md` o paczki wizualne.

### — Poprawki wizualne —

### C1 — Zgodność z planem (Opus 5.5) · warunek: T1–T30 zamknięte lub świadomie odłożone

Zakres: trasy i funkcje vs brief §3–§4 i decyzje K-xx w §4.

### C2 — Merytoryka treści (Opus 5.5) · warunek jak C1

Zakres: spójność copy i terminologii, fakty z briefu §8; ostateczna decyzja — właściciel i EJK.
Gotowe C1–C2: `docs/review/07-plan-content.md`.

## Dane sample dodawane w tym etapie

Brak — review nie dotyka `content/`.

## Kryteria ukończenia

- [ ] R0–R5 zakończone, `05-tech-synthesis.md` i `10-review-fixes.md` zatwierdzone;
- [ ] poprawki techniczne gotowe lokalnie (każda paczka porównana z baseline'em z RF-0, bez deployu per paczka — D11 w `10-review-fixes.md`), potem jeden deploy na staging;
- [ ] V1–V4 zakończone, paczki wizualne w `10-review-fixes.md`;
- [ ] RF-13a: decyzja o skali odstępów i belce zapisana (po V3, z bramą powrotną po V4);
- [ ] poprawki wizualne wdrożone;
- [ ] C1–C2 zakończone (po EJK);
- [ ] build + lint bez regresji po każdej paczce poprawek.

## Ryzyka i pytania otwarte

- **Bias tej samej rodziny modeli** — ograniczany wg RV-6; pełnej niezależności nie daje. Opcjonalnie: przegląd R1–R2 narzędziem innego dostawcy albo przez człowieka.
- **Staging vs lokalny kod** — V1–V4 zakładają, że staging jest na bieżącym commicie; sprawdzić w R0.
- **Przecięcie z k8** — jeśli treść EJK zmieni układ strony (np. nowe zdjęcia T19), V3 dla tej trasy powtarzamy po k8.

## Postęp

| Kawałek | Model | Status | Uwagi z checkpointu |
| --- | --- | --- | --- |
| R0 — zakres i dane twarde | Opus 5.5 | ✅ 2026-10-04 | `docs/review/00-scope.md`; staging = `bb7b0cb` (= `src/` HEAD); tsc/lint/build OK; knip 20 plików / 37 eksportów; jscpd 1,51 %; axe: 4 naruszenia na 3 trasach; brak `/ikony/[slug]` i redirect `/ikony/wystawa` vs brief §3 → C1 |
| R1 — dane | Opus 5.5 | ✅ 2026-10-04 | `docs/review/01-data.md`: 21 zgłoszeń (3 bug, 7 ryzyko, 4 niespójność, 5 upraszczanie, 2 drobiazg); bugi potwierdzone na stagingu: `enrollmentOpen` vs daty ISO (kurs „otwarty” po 24.09), dwa rejestry wykładowców (Szymula/Szymuła), fallback slugu bez polskich znaków (Sokolowski) |
| R2 — komponenty | Opus 5.5 | ✅ 2026-10-04 | `docs/review/02-components.md`: 29 zgłoszeń (3 bug, 5 ryzyko, 8 niespójność, 6 upraszczanie, 7 drobiazg); potwierdzone na stagingu: galerie „justified” bez `<img>` w SSR i CLS `/ikony` 0,22 (1440) / 0,33 (375); przycisk × menu mobilnego poza pułapką fokusu `aria-modal`; `/wyklady/archiwum` 331 KB HTML / 107 KB skryptów (sezony serializowane do klienta); źródła axe z R0: `OfferLeadExtra` bez `TextLink`, `aside` w regionach |
| R3 — trasy | Opus 5.5 | ✅ 2026-10-04 | `docs/review/03-routes.md`: 11 zgłoszeń (0 bug, 2 ryzyko, 4 niespójność, 3 upraszczanie, 2 drobiazg); rozstrzygnięte punkty z R1/R2: R1-07 potwierdzone (3 trasy zależne od daty, tylko `/aktualnosci/[slug]` bez `revalidate`), R2-12 → `resolveNav(path)` (R3-03), R2-08 → wymagana treść = błąd buildu (R3-01); na stagingu: `aria-current="page"` na sekcji nadrzędnej, `/ikony` `no-store` + żądanie RSC na każdy filtr, `/ikony/wystawa` 308 z konfiguracji (plik trasy martwy), 12/19 tras z domyślnym `<title>` (→ k9) |
| R4 — przekrojowe | Opus 5.5 | ✅ 2026-10-04 | `docs/review/04-cross-cutting.md`: 21 zgłoszeń (0 bug, 3 ryzyko, 9 niespójność, 6 upraszczanie, 3 drobiazg); mapa 10+ mechanizmów odstępu sekcji (26–96 px) jako wejście V1; na stagingu: `--section-gap` 96 px na ≥ 1024 (poza `design/README` 56–64), sekcje publikacji 34 px na desktopie (token 64 nieużyty), złote belki paneli 2 px (oferty) vs 3 px (wystawy, publikacje), akapity MDX 20 vs 14 px (warstwy `components` vs `utilities`), menu mobilne z podwójnymi Aktualnościami / Kontaktem, `[pole CMS]` na `/warsztaty`; 43 nieużywane tokeny, 15 martwych klas, 19 nieużywanych kluczy `pl.ts`; B4 rozwiązane; korekta R3-02 (kolizje slugów są walidowane) |
| R5 — synteza | Fable 5.1 | ✅ 2026-10-04 | `docs/review/05-tech-synthesis.md`: 82 zgłoszenia → **34 pozycje S** (6 bug, 12 ryzyko, 12 niespójność/upraszczanie, 2 decyzja, 2 drobiazg), 5 uproszczeń A1–A5 (daty i sezon, `resolveNav(path)`, galeria SSR, role typograficzne, skala odstępów), 9 decyzji właściciela D1–D9 z domyślnymi odpowiedziami, 6 pozycji do backlogu T (T-R1…T-R6); korekta R3-02 potwierdzona (`publications.ts:32`), B4 zamknięte (0 wartości arbitralnych), `design/` w `.gitignore` → R4-09 do potwierdzenia przez właściciela; projekt `docs/plans/10-review-fixes.md`: **14 paczek RF-1…RF-14**, RF-12 po k8, RF-13–RF-14 po V1 (RV-7) — **zatwierdzony 2026-10-04, decyzje D1–D9 potwierdzone w wersji domyślnej** |
| Poprawki techniczne | — | ✅ RF-0…RF-12 lokalnie 2026-10-05 (RF-13, RF-14 po V1) | deploy na staging → V1 |
| V1 — pomiar | Opus 5.5 | ✅ 2026-10-05 (czeka na decyzję właściciela o wartościach §6) | `docs/review/06-visual-1-measure.md`: 21 tras × 390 / 1440 / 1600 na nowym stagingu (`1428105`), skrypt `scripts/visual-measure.ts`; nowy baseline (stary → `.visual/baseline-bb7b0cb`), staging vs baseline 0 FAIL, smoke 11/11; **21 zgłoszeń V1-01…V1-21** (odstępy sekcji desktop w trzech skupiskach 94–98 / 48–56 / 28–38 przy makiecie 56–64, mobile 30–34 zgodne poza ofertami 50–56; dół strony 0–122 przy wzorcu 26; belki 2 vs 3 px — `design/README` mówi 3 px, korekta R4-08; podpisy 14,5 px na 390 poniżej minimum 15; H3 26 px poza skalą; interlinie 1,25–1,45; akapity 20 / 14 / 40; miara wystaw rośnie z oknem); 0 kolorów i rozmiarów spoza tokenów; axe 0 naruszeń (42), CLS 0 na `/`, `/ikony`, `/ikony/na-zamowienie`; propozycja wartości RF-13 (56 / 34, próg 768, ciasny 34 / 26, `--accent-bar` 3 px) i RF-14 — **nie wpisana** do `10-review-fixes.md` |
| V2 — szablony | Opus 5.5 | ✅ 2026-10-05 | `docs/review/06-visual-2-templates.md`: 5 grup porównane w tabelach (dane V1 + nowy pomiar 768 / 1024 → `.visual/measure/pages/*-{768,1024}.json`, `summary-768-1024.json`; odstęp H2 → treść; `scrollWidth` 768–1100); **17 zgłoszeń V2-01…V2-17** (1 bug, 1 ryzyko, 9 niespójność, 6 drobiazg): **bug** — `/publikacje` poziomy scroll przy 768–ok. 860 (siatka albumu 440 + 170 px od `md`); próg kolumny bocznej 768 (wystawy, album) vs 1024 (reszta); trzy zakończenia ofert; akapit wstępu ofert 17,5 / 1,7 na 390; „tytuł w liście” 18,5 / 22 / 25; artykuł z mediów bez zamknięcia (PU-B2); H2 → treść 10–26 w szablonie tekstowym. Rozstrzygnięte z V1 §7: V1-15 (panele kontaktu = `box-title`, rola karty do skali), V1-18 (spójne, tylko V1-14), V1-21 (rola „opis”), V1-11 (pas do stopki jako reguła); korekta V1-13 (`MilestoneRow` 2 px z makiety 6a). Sekcje „Wejście dla RF-13a” i „Wejście dla V3”. **Po checkpoincie:** V2-16 naprawione od razu (`globals.css`: siatka albumu na hubie od 1024; zweryfikowane lokalnie 390–1600, build/lint OK); V2-01 — wyjaśnione, gdzie jest sekcja zapisu, decyzja o LSŚ otwarta |
| V3 — strony | Opus 5.5 | ✅ 2026-10-05 | `docs/review/06-visual-3-pages.md`: 21 tras × 390 / 768 / 1024 / 1440 / 1600 (sonda `.visual/v3/probe.mjs`: miara w znakach, sieroty, puste pasy, kolumny, CTA; zrzuty 1600 nowe — baseline ma 1920); kryteria K1–K9 przed oglądaniem; **24 zgłoszenia V3-01…V3-24** (2 bug, 2 ryzyko, 13 niespójność, 7 drobiazg): **bugi** — cytaty `/warsztaty` przy 768 po 13–14 znaków (3 kolumny od `md`), kolizja etykiety „przedpołudnie” w „Rytmie dnia” LSŚ (kolumna 140 px); 768–1279 ściśnięte `/` (H1 w 4 wierszach, przyciski w 3) i `/o-akademii` (hero 281 px); dwa kolory prozy na ofertach; pas „Gotowe ikony” wcięty o 56 px; dwa złote CTA na wystawach; data > tytuł w programie wykładów; `/ikony` 26,9 i wykładowcy 22,9 ekranu na 390; jednoliterowe spójniki — ` ` tylko w treści O Akademii / Pracowni; V2-16 sprawdzone symulacją (staging jeszcze bez poprawki). Sekcje „Wejście dla RF-13a” i „Wejście dla V4” |
| RF-13a — decyzja o odstępach | Fable 5.1 | ⬜ (po V3; przed RF-13) | doradztwo + archiwum + przełącznik wariantów; decyzja właściciela |
| V4 — globalne i stany | Opus 5.5 | ⬜ | niezależne od RF-13a; po V4 brama powrotna do decyzji |
| Poprawki wizualne | — | ⬜ | |
| C1 — zgodność z planem | Opus 5.5 | ⬜ (po EJK) | |
| C2 — treść | Opus 5.5 | ⬜ (po EJK) | |
