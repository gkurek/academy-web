# Plan 10/R — Review serwisu (techniczne, wizualne, treść)

Status: **zatwierdzony** 2026-10-04 · R0 ✅ 2026-10-04 · R1 ✅ 2026-10-04 · R2 ✅ 2026-10-04 · R3 ✅ 2026-10-04 · R4 ✅ 2026-10-04 · następny: **R5**  
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
- [ ] poprawki techniczne wdrożone na stagingu;
- [ ] V1–V4 zakończone, paczki wizualne w `10-review-fixes.md`;
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
| R5 — synteza | Fable 5.1 | ⬜ | |
| Poprawki techniczne | — | ⬜ | |
| V1 — pomiar | Opus 5.5 | ⬜ | |
| V2 — szablony | Opus 5.5 | ⬜ | |
| V3 — strony | Opus 5.5 | ⬜ | |
| V4 — globalne i stany | Opus 5.5 | ⬜ | |
| Poprawki wizualne | — | ⬜ | |
| C1 — zgodność z planem | Opus 5.5 | ⬜ (po EJK) | |
| C2 — treść | Opus 5.5 | ⬜ (po EJK) | |
