# Plan pracy z Claude Code — Akademia Ikony

> **Wersja:** 0.6 · **Data:** 2026-09-26
> **Status:** żywy dokument. Jedyne miejsce, w którym śledzony jest postęp fazy implementacji. Aktualizowany po każdym checkpoincie.
> **Dokumenty powiązane:** `brief-claude-code.md` (wymagania techniczne, model treści, fakty stałe), `design/README` (handoff z Claude Design).
> **Miejsce w repo:** `docs/plan-claude-code.md`. Plany etapów: `docs/plans/0N-nazwa.md`.

Stan wejściowy: makiety w Claude Design zatwierdzone i zhandoffowane, repo `academy-web` założone w stacku z briefu, `CLAUDE.md` do uzupełnienia o protokół z §1.

---

## 1. Jak pracujemy

### 1.1 Rytm etapu

Każdy etap ma trzy części, zawsze w tej kolejności:

1. **Sesja planistyczna** — rozmowa o szczegółach danej części aplikacji. Claude Code czyta `CLAUDE.md`, `docs/brief-claude-code.md`, `design/README` i odpowiednie makiety, zadaje pytania, proponuje podział na kawałki. Nie pisze kodu. Wynik: plik `docs/plans/0N-nazwa.md` według szablonu z załącznika A. Plan zatwierdzam ja; dopiero wtedy zaczyna się implementacja.
2. **Implementacja w kawałkach** — plan dzieli pracę na 2–5 kawałków. Jeden kawałek = jedna spójna zmiana, którą da się zbudować i obejrzeć (`npm run build` + `npm run lint` przechodzą, strona lub komponent renderuje się). Po każdym kawałku Claude Code zatrzymuje się i składa meldunek (§1.2). Bez mojego „OK” nie rusza dalej.
3. **Zamknięcie etapu** — odhaczam kryteria ukończenia (DoD) z planu, wpisuję decyzje do rejestru (§4), aktualizuję tabelę w §2.

### 1.2 Protokół checkpointu

Po każdym kawałku meldunek w stałym formacie:

```
## Checkpoint N/M — [nazwa kawałka]
Zrobione: [pliki utworzone/zmienione, jednym zdaniem co w każdym]
Odstępstwa od planu / makiety: [co i dlaczego — albo „brak”]
Do decyzji: [pytania, jeśli są — albo „brak”]
Następny krok: [kawałek N+1 z planu, jednym zdaniem]
Build/lint: [OK / co nie przechodzi]
Czekam na OK.
```

Zasady:

- Bez „OK” (lub „OK z uwagami: …”) Claude Code nie zaczyna kolejnego kawałka.
- Odstępstwo od makiety lub tokenów zgłasza w meldunku, nie decyduje sam. Ten wymóg jest już w `CLAUDE.md`; protokół go uszczegóławia.
- Jeśli w trakcie kawałka okaże się, że plan jest błędny — przerywa, melduje, proponuje korektę planu. Nie improwizuje poza planem.
- Meldunki nie trafiają do tego dokumentu w całości; wpisuję tu tylko status i decyzje.

### 1.3 Sesje i kontekst

- Sesja planistyczna i implementacja to osobne sesje Claude Code (`/clear` między nimi). Plik planu jest przekazaniem kontekstu.
- Kawałki jednego etapu można robić w jednej sesji; jeśli sesja się wydłuża lub kontekst robi się ciężki — `/clear` i start od promptu wznowienia (załącznik B) z podaniem numeru ostatniego zaliczonego checkpointu. Plan i ten dokument mają wystarczyć do wznowienia bez opowiadania historii.
- Jeden etap = jedna gałąź / jeden PR (`feat/0N-nazwa`). Merge po zamknięciu etapu. Commity wykonuję ja po każdym „OK” (format `0N/K: short description`, po angielsku); Claude Code nie commituje.

### 1.4 Treść w czasie budowy

Strony budujemy na przykładowych treściach i zdjęciach z makiet Claude Design. Żeby migracja na końcu była podmianą, a nie przeróbką, obowiązuje od etapu 1:

- Strony czytają wyłącznie z warstwy `src/content/*` (typy z briefu §4). Żadnych treści redakcyjnych hardkodowanych w JSX — nawet „tymczasowo”.
- Przykładowe dane leżą w `content/` w tym samym formacie, jaki wyprodukuje migracja (MDX + JSON). Każdy plik makietowy ma w nazwie lub polu oznaczenie `sample` (np. `content/news/sample-01.mdx`, `"sample": true`), żeby w etapie 9 dało się je usunąć mechanicznie.
- Fakty stałe z briefu §8 (maile, telefon, daty, nazwa, adres) wpisujemy od razu jako prawdziwe — one nie są makietowe.
- Lista treści makietowych do wymiany (§5) rośnie w każdym etapie: kto dodaje treść `sample`, dopisuje ją do §5.

---

## 2. Etapy i postęp

Statusy: ⬜ nie zaczęty · 🟡 plan w przygotowaniu · 🔵 plan zatwierdzony · 🟠 w implementacji (N/M) · ✅ zamknięty

| #   | Etap                                       | Plik planu                       | Status               | Zakończono |
| --- | ---------------------------------------------- | -------------------------------- | -------------------- | ---------- |
| 1   | Szkielet, design system, warstwa treści        | `docs/plans/01-skeleton.md`      | ✅ zamknięty         | 2026-09-12 |
| 2   | Strona główna                                  | `docs/plans/02-homepage.md` | ✅ zamknięty         | 2026-09-12 |
| 3   | Strony ofertowe                                | `docs/plans/03-oferta.md`        | ✅ zamknięty         | 2026-09-17 |
| 4   | Wykłady                                        | `docs/plans/04-wyklady.md`       | ✅ zamknięty         | 2026-09-18 |
| 4b  | Korekty po przeglądzie stagingu               | `docs/plans/04b-review-fixes.md` | ✅ zamknięty         | 2026-09-19 |
| 5   | Galeria ikon (+ korekty 05b)                   | `docs/plans/05-galeria.md`, `docs/plans/05b-review-fixes.md` | ✅ zamknięty         | 2026-09-20 |
| 6   | Strony o akademii i pracownia                  | `docs/plans/06-o-akademii.md`    | ✅ zamknięty         | 2026-09-21 |
| 7   | Aktualności (+ korekty)                        | `docs/plans/07-aktualnosci.md`, `docs/plans/07b-review-fixes.md` | ✅ zamknięty         | 2026-09-22 |
| 8   | Strony pozostałe                               | `docs/plans/08-pozostale.md`     | ✅ zamknięty         | 2026-09-22 |
| 8b  | Korekty po przeglądzie etapu 08                | `docs/plans/08b-review-fixes.md` | ✅ zamknięty         | 2026-09-26 |
| 9   | Migracja treści z WordPressa                   | `docs/plans/09-migracja.md`      | ⬜                   | —          |
| 10  | Wykończenie: ewaluacja serwisu, poprawki po prezentacji, SEO, optymalizacja | `docs/plans/10-wykonczenie.md`   | ⬜                   | —          |
| 11  | Wdrożenie                                      | `docs/plans/11-wdrozenie.md`     | ⬜                   | —          |

Kolejność jest wiążąca dla 1 → 2 → 3 (szablon ofertowy i `FactsBox` są potrzebne dalej). Etapy 4, 5, 6–8 można przestawiać. **Etap 8 zamknięty 2026-09-26** (implementacja 08 + korekty 08b). 9 (migracja) wymaga wszystkich stron. 10 (ewaluacja, poprawki i wykończenie na prawdziwych danych) wymaga 9. 11 po 10.

---

## 3. Opis etapów

Dla każdego: cel, zakres, kryteria ukończenia (DoD), proponowany podział na kawałki (do zweryfikowania w sesji planistycznej) i pytania, które sesja planistyczna musi rozstrzygnąć.

### Etap 1 — Szkielet, design system, warstwa treści

**Cel:** wszystko, co jest wspólne dla każdej strony, plus fundament pod treść.

**Zakres:**

- tokeny z `design/README` (kolory z rolami, skala typograficzna, odstępy, radius 0, brak cieni) w jednym miejscu; fonty przez `next/font` (EB Garamond, IBM Plex Sans; `latin` + `latin-ext`);
- komponenty: `Header` (z podtytułem „Studium Ikonograficzne św. Andrzeja Apostoła”), `Footer` z pełną mapą strony, `SectionNav`, `Breadcrumb`, menu mobilne z akordeonem sekcji; menu desktop — płaska lista 6 linków, bez dropdownu;
- `app/layout.tsx`, `src/i18n/pl.ts` ze stringami UI, stany fokusu (obrys 2 px `#e8c765`, odstęp 2 px), `prefers-reduced-motion`;
- `src/content/types.ts` skopiowany z briefu §4 bez zmian nazw pól; `src/content/` jako warstwa odczytu (funkcje typu `getOffer(kind)`, `getNews()`) czytająca z `content/`; `SiteSettings` z faktami stałymi z briefu §8;
- `content/` z pierwszymi plikami `sample` w zakresie potrzebnym do szkieletu (settings, `upcoming`);
- puste trasy dla całej architektury z briefu §3 (żeby `SectionNav` i mapa strony w stopce nie prowadziły do 404).

**DoD:**

- [x] każda **statyczna** trasa z briefu §3 istnieje i renderuje layout z nagłówkiem i stopką (`[slug]` i custom 404 — etapy 5–8);
- [x] `SectionNav` i menu mobilne działają na 390 px, nawigacja klawiaturą z widocznym fokusem;
- [x] brak `#8d7d69` i brak 13 px w kodzie (grep);
- [x] `types.ts` zgodny z briefem §4, `SiteSettings` używane przez `Header`/`Footer` (patrz K-02, `docs/plans/01-skeleton.md`).

**Proponowane kawałki:** (1) tokeny + fonty + layout + `pl.ts`; (2) `Header`, menu mobilne; (3) `Footer`, `Breadcrumb`, `SectionNav`, trasy-zaślepki; (4) `types.ts`, warstwa `src/content/`\*, `SiteSettings`, pierwsze pliki `sample`.

**Pytania na sesję planistyczną** — rozstrzygnięte w `docs/plans/01-skeleton.md` (K-02, `src/navigation.ts`). Kopia mediów `sample` — zakres etapu 2 (`docs/plans/02-homepage.md`).

### Etap 2 — Strona główna

**Cel:** pierwsza pełna strona; ustala rytm sekcji, użycie obrazów i komponentów treściowych.

**Zakres:** `Hero` (ikona + zdanie + dwa CTA), sekcja „Najbliższe” z `SiteSettings.upcoming` (z `linkLabel` — K-16), trzy filary, „Wybrane ikony” (z `IconWork`, dane `sample`), `Testimonial` (cytat EJK, bez portretu/bio/linku — K-14). **`content/icons.json`** — utworzenie pliku z 4 wpisami `sample` na sekcję „Wybrane ikony” (zdjęcia z `design/assets/icons` → `public/media/sample/`). Poza zakresem: `MapBlock` i sekcja kontakt (K-13 — makieta ich nie zawiera na stronie głównej; pełny `MapBlock` w etapie 8 na `/kontakt`). Szczegóły Hero (wymiary mobile/desktop): `docs/plans/02-homepage.md` §„Druga poprawka”.

**DoD:**

- [x] zgodność z makietą desktop i mobile (screenshot obok makiety), z uwzględnieniem K-13/K-14;
- [x] wszystkie treści z `content/` lub `pl.ts`; brak tekstu redakcyjnego w JSX;
- [x] CTA „Warsztaty”/„Wykłady” prowadzą do hubów `/warsztaty` i `/wyklady`;
- [x] Lighthouse mobile na tej stronie: dostępność ≥ 95 (wydajność sprawdzana w etapie 10) — 100/100 mobile i desktop.

**Proponowane kawałki:** (1) `Hero` + „Najbliższe” + filary; (2) `Testimonial` + `IconGrid` w wersji „wybrane” + dane sample; (3) dopracowanie mobile i finalizacja.

**Pytania:** rozstrzygnięte w sesji planistycznej — patrz K-13, K-14, K-15 w §4.

### Etap 3 — Strony ofertowe

**Cel:** jeden szablon, cztery treści; `FactsBox` w obu stanach; `StepList`.

**Zakres:** szablon `Offer` (breadcrumb, `SectionNav`, H1, lead, `FactsBox` po prawej / na mobile pod leadem, body MDX, „Jak się zapisać”, `Testimonial`); `FactsBox` zasilany z `OfferFacts` ze stanami `enrollmentOpen: true/false` i różnymi komunikatami per `kind`; `mailto:` z dokładnymi tematami z briefu §7 i `tel:+48601734705`; hub `/warsztaty` z `OfferCard`; strony: `/warsztaty/kurs-roczny-i-trzyletni` (program 6 semestrów jako sekwencja), `/warsztaty/letnia-szkola-swiatla` (stan zamknięty domyślnie, „Rytm dnia” tylko jako `sample`), `/ikony/na-zamowienie` (`StepList` 3 kroki, „Przykłady realizacji”, nota o gotowych ikonach). Wariant `wyklady` szablonu przygotować, ale strona `/wyklady` powstaje w etapie 4.

**DoD:**

- [x] `FactsBox` renderuje oba stany z jednego komponentu, sterowane wyłącznie danymi;
- [x] tematy `mailto:` identyczne ze stringami z briefu §7 (test: kliknięcie na telefonie otwiera klienta z tematem);
- [x] cztery `content/offers/*.mdx` z `facts` zgodnymi z `OfferFacts`; wartości niepotwierdzone (czas realizacji zamówień) jako puste pola, nie zmyślone;
- [x] `StepList` używa numeracji, reszta strony nie.

**Proponowane kawałki:** (1) `FactsBox` + szablon `Offer` + hub `/warsztaty`; (2) kurs + plener; (3) `/ikony/na-zamowienie` + `StepList`.

**Pytania:** rozstrzygnięte w sesji planistycznej — patrz K-03 w §4.

### Etap 4 — Wykłady

**Zakres:** `/wyklady` jako hub + bieżący sezon (`LectureList`: data, tytuł, prowadzący) + „Jak się zapisać” (`FactsBox` w wariancie `wyklady`, `id="zapisy"`) + sekcja archiwum (lead + link „Pełne archiwum”, bez akordeonu na hubie); `/wyklady/archiwum` z `SeasonAccordion` (15 sezonów archiwalnych, domyślnie zwinięte; bieżący 2026/2027 — szesnasty, na hubie); `/wyklady/wykladowcy` z `LecturerCard`. Dane: `content/lectures/<season>.json` — na razie 2–3 sezony `sample` w docelowym schemacie, żeby akordeon miał co pokazywać.

**DoD:**

- [x] `SeasonAccordion` dostępny z klawiatury (Enter/Space, fokus, `aria-expanded`), działa bez JS w sensownym stopniu (treść w DOM);
- [x] liczba sezonów (16 łącznie, 15 archiwalnych) wpisana w `content/lectures/archive.json`, nie hardkodowana w kodzie;
- [x] terminy 2026/2027 z briefu §8 wpisane jako prawdziwe dane bieżącego sezonu; tytuły i prowadzący z WP.

**Proponowane kawałki:** (1) `LectureList` + hub; (2) `SeasonAccordion` + archiwum; (3) wykładowcy.

**Pytania:** rozstrzygnięte w sesji planistycznej — patrz K-17…K-22 w §4 i `docs/plans/04-wyklady.md`. Przed Kawałkiem 1: osobna sesja przygotowania danych (K-22).

### Etap 4b — Korekty po przeglądzie stagingu

**Cel:** doprowadzić skeleton, home, ofertę i wykłady do spójnego systemu przed etapem 5 (galeria dziedziczy te same komponenty).

**Zakres:** bugi układu, skala typografii i role kolorów, stopka/`SectionNav`, rytm pionowy i szerokość kontenera, home (hero, Najbliższe, filary). Poza zakresem: sticky `FactsBox`, `ClosingCta`, stany czasu w `LectureList` (K-34), CTA „Zapisy" w nagłowku desktop (K-35). Szczegóły: `docs/plans/04b-review-fixes.md`.

**DoD:** wszystkie checkboxy w planie 04b odhaczone (CTA po scrollu — N/A, świadoma decyzja D-1); Lighthouse a11y 100/100 na 4 trasach; rejestr K-23…K-35 w §4.

### Etap 5 — Galeria ikon

**Cel:** `/ikony` gotowa do pokazania EJK i uczniom na pełnym zestawie prac z WP (`sample`), przed formalną migracją w etapie 9.

**Zakres:** `SectionNav`, H1, filtr **tematu** (`?temat=`, K-43), dwie sztywne sekcje EJK → uczniowie (K-41), `IconGrid` z układem wyrównanych rzędów (K-40 B), `Lightbox` desktop i mobile (K-38, K-45), zajawka „Ikony na zamówienie” (K-46). Podpisy: siatka — tytuł; sekcja uczniów — lista nazwisk; lightbox — autor, wymiary, technika (K-42). **`content/icons.json`** — 52 prace z WP (23 EJK + 29 uczniów), oryginały w `public/media/sample/icons/` (K-47). Poza zakresem: `/ikony/[slug]` (K-04), filtr autora, paginacja, opis dzieła w lightboxie, test lightboxa na fizycznym iOS Safari i formalny Lighthouse a11y (→ etap 10, K-38).

**Założenia wejściowe z etapu 4b** (szczegóły w `docs/plans/04b-review-fixes.md` §„Założenia wejściowe dla planu 05"):
- typografia podpisów: Garamond min. 16,5 px, meta `--accent-text` (K-26);
- layout strony: `--content-max: 1280px` od 1600 px (K-30); H2 sekcji wg tabeli ról K-25;
- siatka galerii: wyrównane rzędy, `object-cover`, `justifyGalleryRows` (K-40 B) — **nie** K-31 (`object-contain` zostaje na home „Wybrane ikony”).

**DoD:** wszystkie checkboxy w `docs/plans/05-galeria.md` i `docs/plans/05b-review-fixes.md` odhaczone; rejestr K-38…K-47 w §4; build/lint OK. Pozostałe po 05b: weryfikacja merytoryczna treści `sample` (§5) i testy przeniesione do etapu 10.

**Kawałki:** plan 05 (4/4) + korekty 05b (6/6) — szczegóły w `docs/plans/05-galeria.md` i `docs/plans/05b-review-fixes.md`; decyzje w rejestrze §4 (K-38…K-47).

### Etap 6 — Strony o akademii i pracownia

**Cel:** szablon strony tekstowej z `TocSidebar` i pierwsze dwie treściowe strony informacyjne.

**Zakres:** wspólny szablon strony tekstowej (breadcrumb, H1, lead, body MDX, `TocSidebar` desktop / `TocCollapse` na mobile); `SectionNav` O Akademii · Pracownia (K-48); `/o-akademii` i `/pracownia` z treścią z `content/` (JSON + MDX, copy wg `docs/copy-o-akademii-pracownia.md`, makieta `Akademia Ikony - O Akademii i Pracownia.dc.html` 6a–6i). Poza zakresem: aktualności (etap 7), kontakt, wydarzenia, publikacje, polityka, 404 (etap 8).

**DoD:**

- [x] szablon strony tekstowej gotowy do ponownego użycia w etapie 8 bez rozgałęzień w kodzie;
- [x] `/o-akademii` i `/pracownia` renderują treść z `content/`; `toc[]` w danych strony steruje `TocSidebar`/`TocCollapse` (K-49);
- [x] zaślepki zastąpione; `SectionNav` na obu trasach.

**Kawałki (zatwierdzone):** (1) shell + TOC + SectionNav; (2) komponenty + `/o-akademii`; (3) `Interview` + `/pracownia`; (4) `PhotoGrid` + lightbox + DoD. Szczegóły: `docs/plans/06-o-akademii.md`.

**Pytania:** rozstrzygnięte w sesji planistycznej 2026-09-20 — patrz K-48, K-49 i `docs/plans/06-o-akademii.md` (D-06-01…07).

### Etap 7 — Aktualności

**Cel:** lista wpisów i pojedynczy artykuł, teraz jako jeden strumień przejmujący archiwum dawnego działu „Wydarzenia” (K-50, K-52, 2026-09-21).

**Zakres:** `/aktualnosci` z `NewsCard` i etykietą typu wpisu (`kind`), lista chronologiczna z przyklejonym paskiem lat i kotwicami (K-70); `/aktualnosci/[slug]` z `Breadcrumb`, body MDX, galerią zdjęć i plakatem (`images`, `poster`), opcjonalnym `<NewsCta />` w MDX; generator pełnego archiwum `sample` z WP; **pełna aktualizacja nawigacji K-50** (menu, stopka, `SectionNav` Ikony + Wystawy, usunięcie `/wydarzenia`, korekta OA-55/OA-63) — przeniesione z etapu 8 (D-07-02). Poza zakresem: treść wystaw (etap 8/8b; zaślepka `/ikony/wystawa` → redirect w 08b); filtry kategorii (K-52); miniatury na liście w pierwszej iteracji (przegląd w kawałku 5).

**DoD:**

- [x] wpisy wszystkich `kind` renderują się w jednym szablonie; brak filtrów kategorii;
- [x] lista chronologiczna z przyklejonym paskiem lat i kotwicami na kartach (K-70), 59 wpisów `sample` (K-06: jedna strona bez paginacji, archiwum zwinięte K-66);
- [x] `Breadcrumb` podłączony na trasie wpisu;
- [x] treść wyłącznie z `content/news/*.mdx`, zgodna z rozszerzonym typem `News` (brief §4: `kind`, `dateEnd`, `images`, `poster`);
- [x] nawigacja K-50 wdrożona (Aktualności w menu, Wystawa w Ikony, brak `/wydarzenia`).

**Kawałki (zatwierdzone):** (1) fundament + generator; (2) lista; (3) wpis `[slug]`; (4) nawigacja; (5) przegląd miniatur + DoD. Szczegóły: `docs/plans/07-aktualnosci.md`.

**Korekty:** K-59…K-75 — zamknięte 2026-09-22. Szczegóły: `docs/plans/07b-review-fixes.md`.

**Pytania:** rozstrzygnięte w sesji planistycznej 2026-09-21 — patrz K-06, D-07-01…10 i `docs/plans/07-aktualnosci.md`. **K-69 otwarte** — funkcja strony (zapowiedzi vs kronika); wraca w przeglądzie całości serwisu (etap 10). Lighthouse a11y `/aktualnosci` — etap 10 (jak 05b).

### Etap 8 — Strony pozostałe

**Status:** zamknięty (4 kawałki, `docs/plans/08-pozostale.md`, 2026-09-22). **Wystawa:** pierwsza implementacja (`/ikony/wystawa`, `ExhibitionEdition`, `editions.json`) została **zastąpiona w etapie 8b** (K-82…K-118) — patrz niżej; nie traktować opisu wystawy z `08-pozostale.md` jako aktualnego.

**Zakres (pierwotny):** `/kontakt`, wstępna strona wystawy, `/publikacje` (+ podstrony, K-76), `/polityka-prywatnosci`, 404, kafel „Najbliższe” i LSŚ „Gdzie byliśmy” (K-57), K-77. Szczegóły kawałków i checklisty — `docs/plans/08-pozostale.md`.

**DoD (pierwotny, bez wystawy po 08b):**

- [x] szablon strony tekstowej użyty na co najmniej trzech trasach bez rozgałęzień w kodzie (łącznie z etapem 6);
- [x] wszystkie trasy z briefu §3 mają realną treść lub `sample` — koniec zaślepek;
- [x] pełny `MapBlock` na `/kontakt` (K-13);
- [x] wystawa, home i LSŚ — **przebudowane w 8b** (obecnie `/ikony/wystawy`, `annual.json`; DoD wystawy → etap 8b).

**Pytania:** rozstrzygnięte w sesji 2026-09-22 (K-79…K-81, `08-pozostale.md`). Otwarte EJK / etap 9 — patrz §5 i etap 9.

### Etap 8b — Korekty po przeglądzie stagingu

**Status:** zamknięty (7 kawałków, `docs/plans/08b-review-fixes.md`, 2026-09-26). Wsad: `docs/08-review-staging.md`. Rejestr decyzji: K-82…K-118 (§4).

**Zakres:** przegląd tras etapu 8 na stagingu — model wystawy (trzy formy, `PermanentExhibition` + `AnnualExhibition[]`, wyjazdowe w `News` z `venue`), trasa `/ikony/wystawy`, układ makiety 9a–9e; powiązanie Aktualności ↔ wystawy doroczne; publikacje (autorzy z rejestru wykładowców, spis albumu); kontakt, LSŚ, 404; polityka (struktura), skip link, `ExternalLink`, `mailto:`, breadcrumb (K-104), metadane tytułu (K-114). **301** ze `/ikony/wystawa` — etap 9 (`next.config.ts`); tymczasowo `redirect()` w aplikacji.

**DoD:**

- [x] 7 kawałków zaliczonych (postęp w `08b-review-fixes.md` §9);
- [x] `npm run build` i `npm run lint` OK;
- [x] K-82…K-118 w §4;
- [x] trasy: `/ikony/wystawy`, `/kontakt`, `/publikacje`, polityka, 404, home (desktop + 390 px);
- [x] treść prawna polityki — rozstrzygnięcia K-119 (pytania K-115; bez osobnego pliku w repo, E08-05).

**Kawałki:** infrastruktura serwisowa → model wystawy → strona wystawy + home → Aktualności ↔ wystawa → publikacje → kontakt/LSŚ/404 → polityka i copy pass — kolejność w `08b-review-fixes.md` §5.

**Etap 8 w całości (08 + 08b):** ✅ zamknięty **2026-09-26**. Następny etap wiążący: **9** (migracja WP).

### Etap 9 — Migracja treści z WordPressa

**Cel:** zastąpić wszystkie dane `sample` prawdziwymi, bez dotykania komponentów.

**Zakres:** sprawdzenie REST API vs WXR; skrypt `scripts/migrate-wp.ts` wg briefu §5 (pages/posts → MDX, oryginały obrazów z `href` nie z `src`, wykłady → `LectureSeason`, galeria → `IconWork`, `docs/redirects.json`); raport `scripts/migrate-report.md`; ręczna korekta (literówki, nazwiska, podpisy ikon, daty 2025 → archiwum lub aktualizacja); usunięcie wszystkich plików i wpisów `sample`; weryfikacja listy z §5; 301 w `next.config.ts`.

**Zasady migracji dawnego działu „Wydarzenia” (K-50…K-58, 2026-09-21 — patrz `docs/plan-aktualizacji-dokumentow-wydarzenia.md` §5 dla pełnego uzasadnienia):**

- Wpis zbiorczy „IKONA – KORZENIE I OWOCE WIARY 2018…2025” → rozbić na rekordy `AnnualExhibition` w `content/exhibition/annual.json` (tytuł osobno, K-84), nie migrować tytułu z listą lat 1:1; zdjęcia 2025 przypisać do sezonu zamykającego rok 2025.
- „Podsumowanie roku 2019 i 2020 – wystawy” → akapit o aranżacji wystawy jest źródłem ekspozycji codziennej / `body.mdx` na `/ikony/wystawy` (redakcja, nie kopia); pozostałe wydarzenia z tego wpisu (Noc Świątyń, „Ikona okno duszy”, plener w Świętej Lipce) → osobne wpisy Aktualności z właściwym `kind`.
- Oprowadzania 2017 (4 wpisy) → jeden wpis `kind: 'oprowadzanie'` z krótkimi zredagowanymi opisami + 3–4 zdjęcia. **Serce Jezusa: nie migrować części merytorycznej** (niepodpisana kopia z gotquestions.org) — zachować tylko informację o oprowadzaniu, zdjęcie i komentarz R. Rumina (wyłącznie po jego zgodzie). Trójca Święta: zdanie o „jedynym kanonicznym przedstawieniu” do korekty przez EJK. Ikony emaliowane: usunąć ostatnie zdanie o dzieciach.
- Wystawy doroczne w KŚT kończące rok → rekordy w `content/exhibition/annual.json` (`seasonSlug`, `title`, `vernissage`, opcjonalnie `newsSlug` do relacji, kotwice `#wystawa-{rok}` na stronie wystaw); wystawy poza KŚT → wpisy Aktualności `kind: 'wystawa'`; wyjazdowe z polem `venue` (lista na `#wyjazdowe`, K-87).
- Wyjazdy studyjne („Wyjazd śladami ikon prof. Jerzego Nowosielskiego”, „Spotkania z Grzegorzem Zinkiewiczem”) → Aktualności `kind: 'wyjazd'` / `'spotkanie'`. „Wakacyjne wyjazdy studyjne – Gródek” → `kind: 'plener'` jeśli EJK potwierdzi plener LSŚ; miejsce trafia też do „Gdzie byliśmy” (K-57).
- Poświęcenia (tekst + 6 zdjęć) → wpis Aktualności datowany na plener (`kind: 'plener'`, K-77); redakcja z EJK; przekierowanie `/poswiecenia-ikon/` → `/aktualnosci/[slug]` (slug w migracji). Nie na `/pracownia`, nie w Publikacjach.
- Hub `/wydarzenia/` (akapit „Wydarzeniem jest dla nas coś nieprzewidywalnego…”) — **nie migrować**.
- Plakaty z `/publikacje/plakaty/` (~20 szt., K-78) — po weryfikacji EJK (wydarzenie + rok) przypisać do `News.poster` (w tym relacje wernisaży dorocznych); niezidentyfikowane lub bez pasującego wpisu — pominąć. Brak strony plakatów; pole `poster` w `AnnualExhibition` usunięte (K-98).
- Artykuły: teksty z albumu wg wyboru EJK; teksty EJK z mediów wg statusu praw do przedruku (`excerptOnly` + link do oryginału, gdy brak prawa).

**DoD:**

- [ ] `grep -r sample content/ public/media/` pusty;
- [ ] każda pozycja z §5 odhaczona;
- [ ] raport migracji przejrzany, niejasne przypadki rozstrzygnięte lub zgłoszone EJK;
- [ ] wszystkie daty w `content/` sprawdzone pod kątem 2025/2026;
- [ ] build z prawdziwymi danymi przechodzi, strony obejrzane ponownie na mobile (długie prawdziwe teksty mogą złamać układ, którego `sample` nie testowało).

**Proponowane kawałki:** (1) skrypt: pobieranie + HTML→MDX + obrazy; (2) skrypt: wykłady + galeria + redirecty + raport; (3) korekta ręczna i usunięcie `sample`; (4) przegląd wizualny na prawdziwych danych.

**Pytania:** dostęp do REST API lub eksportu WXR (sprawdzić przed sesją planistyczną, nie w jej trakcie); kto robi korektę merytoryczną nazwisk i podpisów (EJK / sekretariat) i w jakim formacie dostają listę; domena kanoniczna (z `www` czy bez — wpływa na 301 w `next.config.ts` w tym etapie).

### Etap 10 — Wykończenie: ewaluacja serwisu, poprawki, SEO i optymalizacja

**Cel:** przejść przez cały serwis na prawdziwych danych z etapu 9 — od przeglądu z klientem po techniczne domknięcie przed wdrożeniem. Etap zbiera feedback prezentacyjny, rozstrzyga otwarte decyzje produktowe, ocenia i upraszcza kod z fazy budowy oraz domyka audyty jakościowe.

**Zakres** (pięć obszarów; szczegóły kawałków — w sesji planistycznej):

1. **Ewaluacja całego serwisu** — przegląd każdej trasy na desktopie i mobile (390 px): treść, nawigacja, rytm sekcji, długie teksty po migracji, spójność z makietą i tokenami; lista usterek i propozycji zmian do zatwierdzenia z klientem; rozstrzygnięcie **K-69** (funkcja Aktualności: zapowiedzi vs kronika); przegląd, czy album potrzebuje miejsca na stronie głównej po analityce (K-76).
2. **Poprawki i zmiany funkcjonalne po prezentacji** — implementacja uzgodnionych zmian UI/UX i logiki (np. sticky `FactsBox` — K-37, CTA w nagłówku — K-35, polish stopki — K-36); korekty danych z EJK (galeria: `size`, tytuły, `authorName`, technika w lightboxie — §5); bez nowych dużych funkcji poza planem — każda większa zmiana przez korektę planu etapu.
3. **Ewaluacja techniczna** — przede wszystkim **ocena istniejącego kodu** (`src/`, `src/content/*`, komponenty): wykrywanie i usuwanie over-engineeringu, uproszczenie tam, gdzie złożoność nie wynika z wymagań; kryteria **prostoty**, **reużywalności** komponentów i zgodności z konwencjami repo (`CLAUDE.md`, brief §7); standardy jakości programowania (czytelność, typowanie strict, sensowny podział Server/Client, brak zbędnych warstw i duplikacji). Osobno **audyty produktowe:** Lighthouse (a11y ≥ 95, wydajność ≥ 90 mobile) na 5 trasach reprezentatywnych, raporty w `docs/lighthouse/`; test lightboxa `/ikony` na fizycznym iOS Safari (K-38); przegląd kontrastu, fokusu i stanów z ekranu „Komponenty”; naprawa wykrytych blokad.
4. **SEO, dane strukturalne, analityka** — `generateMetadata` + Open Graph (domyślny + per strona); `sitemap.ts`, `robots.ts`; JSON-LD: `Organization`, `Person` (EJK), `Event` (bieżący sezon), `Course` (kurs, plener), `Book` (album — K-76), `Article` (artykuły; `isPartOf` → `Book` dla tekstów z albumu); **notatka:** rozważyć `ExhibitionEvent` dla `/ikony/wystawy` (K-82…); Plausible lub Umami bez ciasteczek — zdarzenia na CTA zapisów, `mailto:`, `tel:`.
5. **Dokumentacja** — uspójnienie `docs/plan-claude-code.md` §4–§5, planów etapów i briefu ze stanem faktycznym po ewaluacji kodu i decyzjach etapu; bez zmian w `design/` i bez nowych zależności bez uzgodnienia.

**DoD:**

- [ ] przegląd wszystkich tras z briefu §3 odhaczony; lista poprawek po prezentacji zamknięta lub świadomie przeniesiona do wdrożenia;
- [ ] walidator schema.org bez błędów dla czterech typów; podgląd OG sprawdzony dla strony głównej i jednej ofertowej;
- [ ] zdarzenia analityczne widoczne w panelu narzędzia w środowisku testowym;
- [ ] przegląd kodu zakończony: usunięte lub uzasadnione miejsca over-engineered; brak oczywistych duplikacji i naruszeń konwencji repo;
- [ ] raport Lighthouse dla 5 tras (główna, kurs, wykłady, galeria `/ikony`, aktualności) w `docs/lighthouse/`; lightbox `/ikony` sprawdzony na iOS Safari (K-38);
- [ ] `npm run build` i `npm run lint` bez regresji; dokumentacja zsynchronizowana z kodem i decyzjami etapu.

**Proponowane kawałki:** (1) ewaluacja serwisu + lista poprawek po prezentacji; (2) poprawki funkcjonalne i danych (EJK, UI); (3) ewaluacja techniczna kodu + uproszczenia; (4) metadata + OG + sitemap + robots + JSON-LD + analityka; (5) Lighthouse, audyty a11y i dokumentacja.

**Pytania:** **K-69 (otwarte)** — szczegóły `docs/plans/07b-review-fixes.md`. Plausible czy Umami (hosting, koszt, self-hosting). Czy `Event` JSON-LD wymaga lokalizacji/oferty ceny. Termin i forma prezentacji z klientem (staging, lista tras, kto zbiera uwagi).

### Etap 11 — Wdrożenie

**Zakres:** hosting, zmienne środowiskowe, domena i certyfikat, test 301 ze starych URL-i (w tym długi slug „O nas”), test `mailto:` i `tel:` na telefonie (iOS i Android), zgłoszenie sitemap w Google Search Console, monitoring (uptime, błędy), procedura publikacji zmian treści do czasu panelu CMS.

**DoD:**

- [ ] lista starych URL-i z briefu §5 przetestowana skryptem (status + cel);
- [ ] GSC potwierdza sitemap;
- [ ] `docs/runbook.md`: jak wdrożyć, jak zmienić treść, gdzie są logi.

**Pytania:** wybór hostingu; kiedy przełączać DNS (poza sezonem zapisów — termin 24.09.2026 jest blisko, patrz §4).

---

## 4. Rejestr decyzji

| #    | Decyzja                                            | Etap | Wybór                                                                                       | Data       |
| ---- | -------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- | ---------- |
| K-02 | Źródło aktywnej pozycji nawigacji (klient/serwer)  | 1        | **Prop `active` ze strony/serwera**, nie `usePathname`; `Header`/`Footer` montują się w `PagePlaceholder` (i docelowo w stronach), nie w root `layout.tsx` — patrz `docs/plans/01-skeleton.md` | 2026-09-12 |
| K-03 | Renderer MDX i zestaw komponentów w body           | 3        | **`@next/mdx` + `@mdx-js/react`**, mapa tagów w `mdx-components.tsx`, body w `OfferPage` (wrapper `offer-mdx`); program kursu: `<SemesterProgram />` + `semesters[]` w frontmatter (bez zmiany `types.ts`); FactsBox: etykiety + CTA per `kind × enrollmentOpen` w `pl.ts`, tel. jako drugi przycisk tylko mobile — patrz `docs/plans/03-oferta.md` | 2026-09-17 |
| K-04 | `/ikony/[slug]` w v1                               | 5        | **Poza v1** — podgląd tylko przez lightbox; trasa `[slug]` nie w tym etapie — patrz `docs/plans/05-galeria.md` | 2026-09-19 |
| K-05 | Filtry galerii: query string vs stan               | 5        | **Query string** (`?temat=<slug-tagu>`), bez przeładowania; domyślnie wszystkie tematy. **`?autor=` wycofane w 05b (K-43)** — podział EJK / uczniowie jest sztywny (sekcje, K-41) — patrz `docs/plans/05-galeria.md`, `docs/plans/05b-review-fixes.md` | 2026-09-19 |
| K-06 | Paginacja aktualności: trasa vs query              | 7, 7b    | **Bez paginacji** — wszystkie lata na jednej stronie; `YearNav` jako kotwice scroll; lata ≤ 2018 zwinięte za przyciskiem „Pokaż archiwum” (K-66), treść w DOM; bez klasycznej paginacji — patrz `docs/plans/07-aktualnosci.md` D-07-01, `docs/plans/07b-review-fixes.md` K-66 | 2026-09-21 |
| K-07 | Plausible vs Umami                                 | 10       | —                                                                                           | —          |
| K-08 | Domena kanoniczna (www / bez)                      | 9        | —                                                                                           | —          |
| K-09 | Hosting                                            | 11       | —                                                                                           | —          |
| K-10 | Termin przełączenia DNS względem naboru 24.09.2026 | 11       | **Nabór 2026/2027 obsługuje stara strona**; wdrożenie bez presji terminu                    | 2026-09-11 |
| K-11 | Język komentarzy, commitów i PR                    | —        | **Angielski** (treść dla użytkownika po polsku)                                             | 2026-09-11 |
| K-12 | Kto commituje                                      | —        | **Wyłącznie właściciel repo**, po „OK” dla kawałka; Claude Code nie używa `git commit/push` | 2026-09-11 |
| K-13 | MapBlock/kontakt na stronie głównej                | 2        | **Usunięte z zakresu** — makieta (#1a/#3b) nie ma tych sekcji na home; kontakt zostaje w stopce, pełny `MapBlock` w etapie 8 na `/kontakt` | 2026-09-12 |
| K-14 | Testimonial vs blok „Prowadząca” na stronie głównej | 2        | **Jedna sekcja** — cytat + podpis Elżbiety Jackowskiej-Kurek, bez portretu/bio/linku, identycznie na desktop i mobile; świadome uproszczenie względem wariantu mobile makiety i `Testimonial.prompt.md` | 2026-09-12 |
| K-15 | Konwencja zdarzeń analitycznych (`data-event` itp.) | 2        | **Nie dodajemy w etapie 2** — konwencja i podłączenie w całości w etapie 10 | 2026-09-12 |
| K-16 | `linkLabel` w `SiteSettings.upcoming`            | 2        | **Dodane pole** — osobny `TextLink` per kafel „Najbliższe” (np. „Jak się zapisać”), zgodnie z makietą; `types.ts`, `content/settings.json`, `UpcomingHighlights.tsx` | 2026-09-12 |
| K-17 | JSON-LD `Event` dla wykładów                     | 4        | **Dane w etapie 4**, emisja `<script type="application/ld+json">` w etapie 10 — patrz `docs/plans/04-wyklady.md` | 2026-09-17 |
| K-18 | Layout huba `/wyklady`                             | 4        | **Osobny `LecturesHubPage`**, nie `OfferPage`; `wyklady.mdx` tylko pod FactsBox | 2026-09-17 |
| K-19 | Layout `/wyklady/wykladowcy`                       | 4        | **Zdjęcie + bio jak WP** (akademiaikony.pl), nie kafelki `#3a-wykladowcy` bez zdjęć | 2026-09-17 |
| K-20 | Podgląd archiwum na hubie                          | 4        | **Lead + link „Pełne archiwum”** (bez `SeasonAccordion` na hubie); pełne archiwum na `/wyklady/archiwum` | 2026-09-18 |
| K-21 | `lecturerSlugs` bez wpisu w rejestrze              | 4        | Join → `lecturer-directory.json` + `lecturers.json`; brak wpisu → heurystyka ze sluga, bez linku; rozszerzenia `types.ts`: `affiliationFull`, `introSecondary`, `LecturerDirectoryEntry` | 2026-09-17 |
| K-22 | Przygotowanie danych przed implementacją           | 4        | **Osobna konwersacja** (krok po kroku); pełny pakiet: `2026-2027.json`, 2–3 archiwum `sample`, wykładowcy z WP + zdjęcia | 2026-09-17 |
| K-23 | Pierwsza pozycja `SectionNav` (04b)              | 4b       | **Hub nazwany treścią, nie sekcją** — Warsztaty: „Przegląd"; Wykłady bez zmian; Ikony: „Galeria"; mobile: zawijanie, tap ≥ 44 px | 2026-09-19 |
| K-24 | Układ stopki (04b)                                 | 4b       | **Wariant B** — 4 kolumny desktop, huby jako linki, `/pracownia` + brakujące pozycje, etykiety kontaktu Plex tertiary, tap 44 px; polish układu → etap 10 (K-36) | 2026-09-19 |
| K-25 | Skala H2/H3 i tekst (04b)                          | 4b       | **Jedna tabela ról** w `globals.css`, waga 400, tag HTML wg kolejności w dokumencie; `--size-nav` 16 px; tap menu/SectionNav ≥ 44 px | 2026-09-19 |
| K-26 | Minimalny rozmiar EB Garamond (04b)                | 4b       | **Min. 16,5 px**; mniejsze etykiety → Plex 14,5 px; wyjątek logo: podtytuł 15 px desktop; dopisek w `brief-claude-code.md` §7 | 2026-09-19 |
| K-27 | Role kolorów i detale spójności (04b)               | 4b       | Złoto = metadane (`--accent-text`); belka 2 px; `SeasonAccordion` role kolorów + stan otwarty; nadtytuły sezonu na ofertach; full-bleed kafli Najbliższe mobile — świadomy wyjątek (makieta `#3b`) | 2026-09-19 |
| K-28 | Szerokość linii (04b)                              | 4b       | **`--measure-lead` 680 px**, **`--measure-prose` 640 px** na leadach, body MDX i biogramach | 2026-09-19 |
| K-29 | Skala odstępów i rytm desktop (04b)                | 4b       | **Tokeny `--space-10/11/12`, `--section-gap` 96 px od 1024 px, cytat home 120 px góra/dół.** Świadome odstępstwo: dolna linia cytatu (`rule-gold-b`) **zostaje** — cezura między cytatem a „Wybrane ikony"; pierwotna rekomendacja usunięcia odrzucona po review | 2026-09-19 |
| K-30 | `content-max` na szerokich ekranach (04b)          | 4b       | **`--content-max: 1280px` od 1600 px**; tekst trzyma K-28; siatki korzystają z szerszego kontenera | 2026-09-19 |
| K-31 | Kadrowanie ikon w `IconGrid` (04b)                 | 4b       | **`object-contain`** na `--surface-tile`, stała wysokość boksu; reguła wejściowa etapu 5 | 2026-09-19 |
| K-32 | Sticky `FactsBox` + `ClosingCta` (04b)             | 4b       | **Odrzucono** — layout bez zmian. **Świadoma decyzja D-1:** brak CTA po scrollu; zapis tylko w `FactsBox` w nagłówku; powrót w etapie 10 (K-37) | 2026-09-19 |
| K-33 | Hero home — rozmiar obrazu i fold (04b)            | 4b       | **Częściowo** — H2 „Najbliższe", filary → huby; `ClosingCta` home odrzucony (K-32). Hero: rekomendacja review `min(760px, 68vh)` **nie wdrożona** — **opcja A (2026-09-19):** zostaje `min(920px, 76vh)`, kolumna obrazu max 500 px, mobile 72%, siatka md+ (`--hero-text-min: 300px`). Kafle „Najbliższe" nad foldem przy 1920×917 **nie są wymagane** (priorytet: czytelność ikony). Patrz `docs/plans/04b-review-fixes.md` K-33 pkt 1 | 2026-09-19 |
| K-34 | Stan czasu w `LectureList` (04b)                   | 4b       | **Odłożone** — bez zmian; obliczanie po stronie serwera + `revalidate`; powrót po etapie 10 | 2026-09-19 |
| K-35 | CTA „Zapisy" w nagłowku desktop (04b)              | 4b       | **Poza 04b** — wrócić w etapie 10 z danymi analityki | 2026-09-19 |
| K-36 | Design stopki — dopracowanie układu                | 10       | **W etapie 10** — po migracji i przeglądzie Lighthouse; w 04b wdrożono wariant B funkcjonalny (huby jako linki, mapa kompletna, tap targety 44 px, mobile 2 kolumny); polish: rozkład kolumn desktop/mobile, social, pasek dolny — patrz `docs/plans/04b-review-fixes.md` K-24 | 2026-09-19 |
| K-37 | Sticky `FactsBox` na stronach ofertowych           | 10       | **Ponowne rozważenie w etapie 10** — odrzucone w 04b (K-32) po prototypie; warunek `min-height: 880px`, dwukolumnowy layout przez całą stronę; opcjonalnie `ClosingCta` — patrz `docs/plans/04b-review-fixes.md` K-32 | 2026-09-19 |
| K-38 | `Lightbox` — implementacja modalna                 | 5        | **Natywny `<dialog>` + `showModal()`**; fallback do własnego overlay tylko po negatywnym teście Safari/iOS (test fizyczny iOS — **etap 10**); patrz `docs/plans/05-galeria.md` | 2026-09-19 |
| K-39 | Obrazy w lightboxie vs. siatka                     | 5        | **Jeden `src`**, większe `sizes` w lightboxie (rozmiar obrazu zmieniony w K-45); weryfikacja w etapie 10, ewentualne `imageLarge` w `IconWork` — patrz `docs/plans/05-galeria.md` | 2026-09-19 |
| K-40 | Układ siatki galerii (05b; zmienia K-31 dla galerii) | 5b | **Opcja B — wyrównane rzędy** (FooGallery / `justifyGalleryRows.ts`): stała wysokość rzędu, zmienna szerokość kafli, `object-cover`, `lastRow: smart`; desktop `rowHeight` 300 / `maxRowHeight` 400, max 4 kafle w rzędzie. Opcja A (półka) odrzucona po ocenie wizualnej na pełnym zestawie WP (52 prace, 2026-09-20); tymczasowy toggle A/B usunięty. „Wybrane ikony” na home zostają przy K-31 — patrz `docs/plans/05b-review-fixes.md` | 2026-09-20 |
| K-41 | Kolejność: EJK → uczniowie (05b) | 5b | **Dwie sztywne sekcje** z H2 (bez licznika w nagłówku); kolejność w sekcji = kolejność w `icons.json`; sekcja pusta pod filtrem tematu znika razem z nagłówkiem. Doprecyzowuje D-02 | 2026-09-19 |
| K-42 | Podpisy i atrybucja autorów (05b) | 5b | **Trzy poziomy:** siatka — sam tytuł; sekcja uczniów — lista nazwisk generowana z danych (bez osobnego wstępu); lightbox — pełny autor lub „Praca z warsztatów Akademii”, wymiary („do weryfikacji”), technika (domyślna lub z danych). `authorName?` opcjonalne w `IconWork`; bez pola `year` w `IconWork` | 2026-09-20 |
| K-43 | Logika filtrów (05b) | 5b | **Jeden filtr — temat:** „Wszystkie”, wybór jednokrotny, `aria-current`, grupa z `aria-label`. **Filtr autora i `?autor=` wycofane** (parametr usuwany z URL). Taksonomia: Chrystus · Matka Boża · Aniołowie · Święci · Sceny i święta (stała lista, kolejność chipów z niej); walidacja przy buildzie (każda praca ≥ 1 tag, każdy temat ≥ 1 praca, tag spoza taksonomii); nieznany `?temat=` usuwany z URL | 2026-09-19 |
| K-44 | Nagłówek galerii (05b) | 5b | **Jednokolumnowy** na wszystkich szerokościach (H1, pod nim filtr tematu); mobile: poziomy pasek chipów z uciętym ostatnim chipem (świadome odstępstwo od K-23 — filtr to nie nawigacja). Bez układu dwukolumnowego od 1024 px | 2026-09-19 |
| K-45 | Lightbox — rozmiar obrazu i układ (05b; zmienia K-39) | 5b | Obraz o wysokości 80vh (desktop) / 60svh (mobile) i jawnej szerokości z proporcji; strzałki 48×48 przy krawędziach okna; licznik w kolumnie metadanych; mobile: sticky pasek Poprzednia / licznik / Następna + swipe (próg 50 px); układ desktopowy od `lg` (1024 px), nie `md`; „Zapytaj o podobną ikonę” tylko przy pracach EJK; klik w tło zamyka (tylko desktop); jedno drzewo, jeden `<Image>` | 2026-09-19 |
| K-46 | Zajawka „Ikony na zamówienie” (05b) | 5b | Zajawka **bez zdjęcia** do sesji zdjęciowej; CTA jako przycisk | 2026-09-19 |
| K-47 | Treść `sample` galerii (05b) | 5b | **Pełny zestaw WP** — 52 prace (23 EJK + 29 uczniów), oryginały w `public/media/sample/icons/`, wszystkie `sample: true`; tytuły zgodne ze zdjęciami WP. Wymiary z podpisów WP w danych (`size` — 47 z 52; bez `size`: 3 EJK + 2 uczniów), UI pokazuje „Wymiary: do weryfikacji” (bez nowego pola). Z makiety wypadły „Św. Antoni” i „Przemienienie” (brak w galerii WP); dawny „Mandylion” to Chrystus Pantokrator, „Matka Boża Znaku” to Krzew Gorejący | 2026-09-20 |
| K-48 | `SectionNav` na `/o-akademii` i `/pracownia`       | 6        | **Dodajemy** — O Akademii · Pracownia, jak makieta 6a–6d; `SectionKey` + `sectionNav` w `navigation.ts`; brief §3 uzupełniony | 2026-09-20 |
| K-49 | Źródło nagłówków `TocSidebar`                      | 6        | **Jawny `toc[]`** w danych strony (`content/pages/*.json`), nie parser MDX — wymagane dla podpozycji rozmowy (PR-25) | 2026-09-20 |
| K-50 | Dział „Wydarzenia”                                  | 7, 8     | **Likwidujemy jako sekcję i pozycję menu.** Menu główne: O Akademii · Warsztaty · Wykłady · Ikony · Aktualności · Kontakt. Trasa `/wydarzenia` nie powstaje; stare adresy przekierowane (brief §5). Uzasadnienie: jedyna żywa treść działu to coroczna wystawa; reszta to archiwum 2013–2020, a kategorie „Poświęcenia/Oprowadzania/Wyjazdy” pokazywałyby 1–3 wpisy sprzed dekady | 2026-09-21 |
| K-51 | Wystawa „Ikona – korzenie i owoce wiary”            | 8        | **Własna strona wystaw w dziale Ikony** (2026-09-21: `/ikony/wystawa`, jedna strona edycji). **Zastąpione K-82…K-90 (08b):** `/ikony/wystawy`, trzy formy wystawy, `PermanentExhibition` + `annual.json`; nawigacja „Wystawy” | 2026-09-21 |
| K-52 | Aktualności jako jeden strumień                     | 7        | **Aktualności przejmują archiwum dawnych wydarzeń.** Każdy wpis ma `kind` wyświetlany jako etykieta typu. Bez filtrów kategorii w v1. Wpisy grupowane latami; paginacja — K-06 (rozstrzygnięte 2026-09-21). **Zastąpione przez K-70:** lista chronologiczna z paskiem lat | 2026-09-21 |
| K-53 | Model treści (`Event` → `News`/`ExhibitionEdition`) | 7, 8     | **Typ `Event` usunięty.** `News` dostaje `kind`, `dateEnd?`, `images?`, `poster?`. Wystawa KŚT: w 8 — `ExhibitionEdition`; **zastąpione 08b** — `PermanentExhibition` + `AnnualExhibition`, `News.venue?` — brief §4 | 2026-09-21 |
| K-54 | Edycja wystawy bez materiału                        | 8, 8b    | **Edycja bez zdjęć = jedna linijka** na liście poprzednich (rok, tytuł), bez pustej karty. W 08b: sekcja „Poprzednie wystawy” (K-97), bez kart z placeholderami | 2026-09-21 |
| K-55 | Poświęcenia ikon                                    | 9 (+ Publikacje) | **Tekst przechodzi do Publikacji jako artykuł** („Podpisanie i poświęcenie ikony”). EJK zgodziła się na przeniesienie i redakcję (2026-09-21); do poprawy: porównanie do chrztu i sakramentów. Układ Publikacji — osobna sesja (odłożone). Wzmianka na `/ikony/na-zamowienie` zależy od D-05 (otwarte). **Zastąpione przez K-77** (poświęcenie → Aktualności, nie Publikacje). Układ Publikacji — **zastąpione przez K-76** | 2026-09-21 |
| K-56 | Wyjazdy studyjne                                    | 6, 7     | **Nie są obecnie planowane, ale nie zostały zakończone.** Copy w czasie teraźniejszym zostaje (OA-62 bez zmian, decyzja EJK). Dawne wyjazdy → Aktualności `kind: 'wyjazd'`. Brak osobnej podstrony | 2026-09-21 |
| K-57 | Historia plenerów                                   | 8        | **Nowa sekcja „Gdzie byliśmy” na `/warsztaty/letnia-szkola-swiatla`**: lista miejsc dotychczasowych plenerów (Święta Lipka, Wesoła, Supraśl, Gruzja, Litwa; Gródek do potwierdzenia). Część „wyjazdów studyjnych” z WP to w rzeczywistości plenery | 2026-09-21 |
| K-58 | Kafel „Najbliższe” na stronie głównej               | 8, 8b    | Kafel 3 wyliczany z dat wystawy dorocznej (K-85): wernisaż przed nami lub wystawa w toku; link → `/ikony/wystawy`. Filar „Ikony”: drugie CTA „Galeria i wystawa” (B4) | 2026-09-21 |
| K-59 | Karta wpisu na liście aktualności (07b)             | 7b       | Układ z makiety (kolumna daty, tytuł + zajawka, „Czytaj →”); cała karta klikalna jednym linkiem (`::after`); „Czytaj” jako element wizualny (`aria-hidden`), nie drugi link; hover/focus-within na karcie — patrz `docs/plans/07b-review-fixes.md` | 2026-09-21 |
| K-60 | Wysokość karty aktualności (07b)                    | 7b       | **Bez sztywnej wysokości**; rytm przez `line-clamp`: tytuł 2 linie, zajawka 3; karta bez zajawki jest niższa — akceptowane | 2026-09-21 |
| K-61 | Etykiety typu wpisu `kind` (07b)                    | 7b       | `aktualnosc` → „Z Akademii”, `wyjazd` → „Wyjazd studyjny”; etykieta w kolumnie daty (desktop pod datą, mobile w wierszu metadanych), kolor drugorzędny; rok dla czytnika przez `sr-only` na liście | 2026-09-21 |
| K-62 | Obrazy na liście aktualności (07b)                    | 7b       | Lista **bez miniatur**; jeden wyróżniony wpis (`featured?: boolean`, max. 1, wymaga `cover`) nad listą, nie powtarza się w grupach lat; znacznik „Galeria · N zdjęć” w metadanych karty (`Intl.PluralRules`) | 2026-09-21 |
| K-63 | Zajawki aktualności — reguły zapasowe (07b)         | 7b       | Ręczne `excerpt` ma pierwszeństwo; zapasowa zajawka: czyszczenie markdown, pełne zdania do ~180 znaków; brak zajawki gdy < 40 znaków, > 50% wielkich liter lub wzorzec daty programu — patrz `getExcerpt` w `src/content/news.ts` | 2026-09-21 |
| K-64 | Format dat aktualności (07b)                          | 7b       | `formatDateRange` / `NewsDateMeta`: na liście pełna data wpisu z rokiem, bez `dateEnd`; w artykule i wyróżnionym wpisie zakresy skrócone z rokiem i poprawnym dopełniaczem miesiąca; półpauza bez spacji w zakresie dni — patrz `docs/plans/07b-review-fixes.md` K-64 | 2026-09-21 |
| K-65 | Nawigacja po latach na liście aktualności (07b)       | 7b       | Jedna nawigacja: pasek lat sticky (`top: 0`), etykieta „Przejdź do roku”, scroll-spy po kartach (`IntersectionObserver` + `aria-current="true"`), mobile jeden rząd z przewijaniem poziomym; bez nagłówków sekcji lat i bez linku „↑ Lata”; kotwica roku na pierwszej karcie danego roku, `scroll-margin-top` z `--year-nav-scroll-offset` — patrz `docs/plans/07b-review-fixes.md` K-65 | 2026-09-21 |
| K-66 | Zwinięte archiwum aktualności (07b; rozstrzyga K-06)  | 7b       | Lata 2019+ zawsze widoczne; 2012–2018 zwinięte za „Pokaż archiwum…” (`NEWS_ARCHIVE_UNTIL_YEAR`); treść archiwum w DOM (`hidden` po hydratacji); `#rok` z archiwum rozwija i przewija; bez JS archiwum rozwinięte — patrz `docs/plans/07b-review-fixes.md` | 2026-09-21 |
| K-67 | Porządki w danych `sample` aktualności (07b)          | 7b       | Tytuły (zdaniowy zapis, bez kropki końcowej), scalenie duplikatów, daty wydarzeń zamiast publikacji, wpisy KŚT oznaczone do etapu 8 (bez usuwania), `featured` na „Nabór na kurs…” — patrz `docs/plans/07b-review-fixes.md` §„Do przeniesienia w etapie 8” | 2026-09-21 |
| K-68 | Ręczne zajawki 15 najnowszych wpisów (07b)            | 7b       | 15 najnowszych wpisów (wyróżniony wliczony); każda zajawka zatwierdzana osobno; `excerpt` w frontmatter MDX; bez powtarzania tytułu; cudzysłów polski „…” dla tematów sezonów — patrz `docs/plans/07b-review-fixes.md` | 2026-09-22 |
| K-69 | Funkcja strony Aktualności: zapowiedzi vs kronika     | 7, 10    | **Otwarte** — dwa kierunki (A: Aktualności = sprawy bieżące, archiwum jako osobna „Kronika"; B: jeden strumień jako kronika, „co teraz" na stronie głównej w „Najbliższe"); wraca w przeglądzie całości serwisu — patrz `docs/plans/07b-review-fixes.md` K-69 | 2026-09-22 |
| K-70 | Grupowanie latami (07c)                               | 7c       | **Rezygnacja.** Jedna ciągła lista; sticky pasek lat + kotwica na pierwszej karcie roku; bez nagłówka sekcji listy — patrz `docs/plans/07b-review-fixes.md` | 2026-09-22 |
| K-71 | Link „↑ Lata" (07c)                                   | 7c       | **Usunięty** (pasek sticky jest zawsze widoczny) — patrz `docs/plans/07b-review-fixes.md` | 2026-09-22 |
| K-72 | Format dat na liście (07c)                            | 7c       | **Data wpisu z rokiem** na liście (`date` bez `dateEnd`); zakresy z dopełniaczem na stronie wpisu i w wyróżnionym — patrz `docs/plans/07b-review-fixes.md` | 2026-09-22 |
| K-73 | Wyróżniony wpis — nagłówek i czas życia (07c)         | 7c       | Etykieta nad blokiem + opcjonalne `featuredUntil` (YYYY-MM-DD, tylko przy `featured: true`; po dacie wpis traci wyróżnienie przy buildzie) — patrz `docs/plans/07b-review-fixes.md` | 2026-09-22 |
| K-74 | Wysokość paska lat (07c)                              | 7c       | Desktop: etykieta i lata w jednym wierszu, **~85 px**; `.year-nav` — `padding: var(--space-5) 0`, bez `margin-bottom`; mobile **~121 px** (etykieta nad paskiem) — patrz `docs/plans/07b-review-fixes.md` | 2026-09-22 |
| K-75 | Tytuły wpisów wykładowych (07c)                       | 7c       | Jeden wzór: „Temat — wykłady RRRR/RRRR" (pauza em przed „wykłady"); 15 wpisów zaktualizowanych w `content/news`, 1 bez zmian (`wyklady-2019-2020`); archiwum 47 vs 36 — błąd szacunku K-66, przycisk poprawny — patrz `docs/plans/07b-review-fixes.md` | 2026-09-22 |
| K-76 | Publikacje: album + artykuły                          | 8, 9, 10 | `/publikacje` bez zakładek/`SectionNav`: sekcja albumu + lista artykułów; podstrona albumu i szablon artykułu z blokiem źródła; typy `Publication`/`Article`; walidacje build; blok metryczki; zakup `mailto:`; terminologia „album”; brak sekcji na home; JSON-LD `Book`/`Article`; makieta oczekiwana (`PU-*`) — patrz `docs/plan-aktualizacji-dokumentow-publikacje.md` | 2026-09-22 |
| K-77 | Poświęcenie ikon → Aktualności                        | 7, 8, 9  | Wpis Aktualności `kind: 'plener'`, 6 zdjęć, redakcja EJK; OA-62 poz. 5 usunięta; `/poswiecenia-ikon/` → wpis; nie na `/pracownia` ani Publikacjach; D-05 bez zmian — patrz `docs/plan-aktualizacji-dokumentow-publikacje.md` | 2026-09-22 |
| K-78 | Plakaty i multimedia                                  | 8, 9     | Brak stron plakatów/multimediów; plakaty → `News.poster` po weryfikacji EJK (K-98: bez `poster` w `AnnualExhibition`); film nie osadzany — patrz `docs/plan-aktualizacji-dokumentow-publikacje.md` | 2026-09-22 |
| K-79 | Rok początkowy edycji wystawy w KŚT                   | 8, 8b    | Pierwotnie **2015** w `editions.json` (D-08-01). **08b:** `annual.json` — 15 sezonów (tabela K-88, od 2012/2013); wystawy poza KŚT w Aktualnościach | 2026-09-22 |
| K-80 | Zdjęcia edycji wystawy                                | 8, 8b    | **0–5 zdjęć** na rekord gdy są; placeholdery sample; strona `/ikony/wystawy` (sekcje zdjęć K-92), nie karty per edycja jak w planie 08 — patrz D-08-02 | 2026-09-22 |
| K-81 | Procedura po wernisażu (operacyjna)                   | 8        | **Notatka w planie**, bez funkcji w serwisie: EJK/sekretariat, do ~2 tyg., minimum: data, podtytuł, 0–5 zdjęć, tematy oprowadzań — patrz D-08-03 | 2026-09-22 |
| K-82 | Model wystawy — liczba bytów                          | 8b       | Trzy formy: `PermanentExhibition`, `AnnualExhibition[]`, wyjazdowe w Aktualnościach `kind: "wystawa"` — patrz `docs/plans/08b-review-fixes.md` | 2026-09-26 |
| K-83 | Ekspozycja codzienna                                  | 8b       | „Ikona – korzenie i owoce wiary”, 6–10 ikon EJK, bez „przerwy wakacyjnej” w copy | 2026-09-26 |
| K-84 | Wystawa doroczna — pola                               | 8b       | `seasonSlug`, osobne `title`, domyślne `vernissage` / `dateEnd` | 2026-09-26 |
| K-85 | Stan wystawy dorocznej                                | 8b       | Wyliczany z dat; ISR `revalidate` na `/` i `/ikony/wystawy` | 2026-09-26 |
| K-86 | Oprowadzania kuratorskie                              | 8b       | Bez terminów i archiwum tematów; `tours[]` usunięte | 2026-09-26 |
| K-87 | Wystawy wyjazdowe na stronie                          | 8b       | `#wyjazdowe`, `venue?` w `News`, wiersze + „Relacja” | 2026-09-26 |
| K-88 | Tytuły wystaw dorocznych                              | 8b       | 15 rekordów w `annual.json` (tabela w planie 08b) | 2026-09-26 |
| K-89 | Sekcja „Poprzednie wystawy”                           | 8b       | 14 wierszy, zwijanie 2013–2021 | 2026-09-26 |
| K-90 | Trasa i nawigacja wystaw                               | 8b       | `/ikony/wystawy`, H1 „Wystawy ikon”, etykieta „Wystawy” | 2026-09-26 |
| K-91 | Dyżury uczniów                                        | 8b       | Usunięte z `body.mdx` | 2026-09-26 |
| K-92 | Wzorzec sekcji wystawy                                | 8b       | Tekst + `FactsBox` + zdjęcia na pełną szerokość | 2026-09-26 |
| K-93 | `FactsBox` na wystawie                                | 8b       | Geometria oferty, `useId`, `sr-only` nagłówek | 2026-09-26 |
| K-94 | Stan w bloku faktów                                   | 8b       | Zmienny wiersz bez paska stanu | 2026-09-26 |
| K-95 | Strona vs relacja w Aktualnościach                    | 8b       | Linki nazwane; jeden lightbox | 2026-09-26 |
| K-96 | Blok archiwalny wystawy                               | 8b       | Ostatnia zakończona edycja | 2026-09-26 |
| K-97 | Wiersz „Poprzednie wystawy”                           | 8b       | Tytuł jako link; „Zdjęcia”; mobile | 2026-09-26 |
| K-98 | Plakat w modelu wystawy                               | 8b       | Pole `poster` usunięte z `AnnualExhibition` | 2026-09-26 |
| K-99 | Złota krecha 3 px                                     | 8b       | Fakty i CTA; padding 30/32 px | 2026-09-26 |
| K-100 | Zdjęcie w `#wyjazdowe`                                | 8b       | Statyczne, bez lightboxa; materiał od EJK | 2026-09-26 |
| K-101 | Breadcrumb `/ikony/wystawy`                           | 8b       | Tylko `SectionNav` | 2026-09-26 |
| K-102 | Kolejność sekcji wystawy                              | 8b       | Stała: ekspozycja → doroczna → … → wyjazdowe | 2026-09-26 |
| K-103 | Wpisy KŚT w Aktualnościach                           | 8b       | Zostają; relacja doroczna ↔ `#wystawa-{rok}` | 2026-09-26 |
| K-104 | Breadcrumb vs SectionNav                              | 8b       | Reguła sekcji; usunięty z kontaktu i publikacji | 2026-09-26 |
| K-105 | Kodowanie `mailto:`                                   | 8b       | `encodeURIComponent(subject)` | 2026-09-26 |
| K-106 | Autorzy albumu / `lecturerSlug`                       | 8b       | Walidacja buildu; deduplikacja; profile minimalne | 2026-09-26 |
| K-107 | `pluralize(n, forms)`                                 | 8b       | Helper w `src/i18n/` | 2026-09-26 |
| K-108 | Kotwica `#artykuly`                                   | 8b       | Hub publikacji; `relatedNewsSlug` opcjonalne | 2026-09-26 |
| K-109 | „Zobacz też” na albumie                               | 8b       | Warunkowe; hub → `/ikony/wystawy` | 2026-09-26 |
| K-110 | Linki do `/publikacje`                                | 8b       | FactsBox wykładów; historia na `/o-akademii` | 2026-09-26 |
| K-111 | 404 — copy i landmarki                                | 8b       | Bez duplikatu Kontakt; `aria-label` „Działy serwisu”; menu `aria-label` | 2026-09-26 |
| K-112 | Skip link                                             | 8b       | `#main-content` w `layout.tsx` | 2026-09-26 |
| K-113 | `ExternalLink`                                        | 8b       | Jeden komponent dla linków zewnętrznych | 2026-09-26 |
| K-114 | Szablon tytułu dokumentu                              | 8b       | `title.template` `%s · Akademia Ikony`; `generateMetadata` na trasach etapu 08 | 2026-09-26 |
| K-115 | Polityka prywatności — struktura                      | 8b       | H2 = TOC; cookies bez Plausible/Umami; treść prawna — patrz **K-119** | 2026-09-26 |
| K-116 | Nazwa fundacji                                        | 8b       | „Fundacja IKONA DZIŚ” | 2026-09-26 |
| K-117 | Kontakt — adres i mapa                                | 8b       | Adres §8; `tel:`; `#dojazd`; `<address>` | 2026-09-26 |
| K-118 | LSŚ „Gdzie byliśmy”                                   | 8b       | Format miejsca · rok; sekcja pod cytatami | 2026-09-26 |
| K-119 | Polityka prywatności — treść prawna (pytania K-115)   | 8b, 10   | **Zatwierdzenie treści** (`content/pages/polityka-prywatnosci.json`): administrator Fundacja IKONA DZIŚ (dane jak w pliku) — OK; `lastUpdated` **bez zmian** (`2026-01-04`); lead — OK. Zakres danych: imię, nazwisko, e-mail, telefon — wystarczający; **bez** dopisków (faktury, PESEL, marketing) i **bez** osobnej sekcji o zdjęciach. Podstawy art. 6 ust. 1 lit. a/b/f — zatwierdzone; okres „do wygaśnięcia roszczeń” — zostaje; lista odbiorców — kompletna; brak państw trzecich i profilowania — nadal prawda. Prawa osób — wystarczające; kontakt RODO: `akademiaikony@gmail.com`; **bez** IOD w polityce. Cookies (brak marketingu/analityki; Google Maps) — OK; analityka bez cookies — **aktualizacja w etapie 10**; brak innych osadzeń do opisania. **Może obowiązywać na produkcji**; formalne zatwierdzenie dokumentu: **EJK**. Odpowiedzi: właściciel repo, 2026-09-26. | 2026-09-26 |

Decyzje spoza kodu (D-01…D-06 z briefu v2) pozostają w dokumentach ekosystemu; tu wpisujemy tylko ich skutki dla implementacji. **D-02 (domyślny filtr galerii):** galeria pokazuje **obie sekcje, EJK pierwsza, sztywny podział** (K-41), bez filtra autora; pytanie o zakres prac EJK po starcie strony autorskiej zostaje otwarte — skutek w K-05 / K-41 / `docs/plans/05b-review-fixes.md` (2026-09-19).

---

## 5. Treści makietowe do wymiany przed wdrożeniem

Lista rośnie w każdym etapie. Odhaczana w etapie 9 (migracja).

| Treść                                  | Gdzie (plik `sample`)                              | Dodano w | Zastąpić czym                                     | ✔   |
| -------------------------------------- | -------------------------------------------------- | -------- | ------------------------------------------------- | --- |
| Cytaty uczestników (Adam, Hania, Iza…) | `content/offers/*`, `content/testimonials.json`    | 3        | cytaty z obecnej strony, dosłownie                | ⬜  |
| Wpisy aktualności + archiwum wydarzeń (59 wpisów po scaleniach K-67, 8 `kind`) | `content/news/sample-*.mdx`, `public/media/sample/news/` | 7        | migracja WP (etap 9)                              | ✅  |
| „Rytm dnia” w Letniej Szkole Światła   | `content/offers/plener.mdx`                        | 3        | potwierdzenie z EJK albo usunięcie sekcji         | ⬜  |
| Tytuł wykładu inauguracyjnego          | `content/lectures/2026-2027.json`                  | 4        | program od sekretariatu (pobrany z WP `/wyklady/tematy/`) | ✅  |
| Wymiary ikon `[z podpisu WP]` (`size`) — 5 prac bez `size` (`do-uzupelnienia-tytul-ikony`, `chrystus-milosierny`, `chrystus-eucharystyczny-na-krzyzu`, `jezus-chrystus`, `matka-boza-pompejanska`); pozostałe 47 — do weryfikacji | `content/icons.json` | 2, 5 (05b/5) | uzupełnienie i potwierdzenie przez EJK, etap 10; do tego czasu UI pokazuje „Wymiary: do weryfikacji” (`pl.gallery.lightbox.sizeUnverified`), liczb nie wyświetla | ⬜  |
| Slug placeholder `do-uzupelnienia-tytul-ikony` (tytuł tymczasowy „Trójca Święta” — do weryfikacji ze zdjęciem) | `content/icons.json` | 5 (import WP) | poprawka tytułu i sluga przez EJK, etap 10 | ⬜ |
| Jakość tytułów galerii — artefakty WP (CAPS, podwójne spacje, „Advokata" vs „Advocata", interpunkcja) | `content/icons.json` (`title`) | 5 (import WP) | korekta merytoryczna przez EJK, etap 10 | ⬜ |
| Zestaw sample galerii — 52 prace z WP (23 EJK + 29 uczniów), oryginały w `public/media/sample/icons/`, kolejność ręczna | `content/icons.json`, `public/media/sample/icons/*` | 5 (05b/5, zastępuje 14 wpisów na 4 zdjęciach) | migracja WP (etap 9) — dane już z WP; weryfikacja i korekta merytoryczna, nie ponowny import | ⬜ |
| 10 prac uczniów bez `authorName` (fallback „Praca z warsztatów Akademii” w lightboxie) | `content/icons.json` | 5 | uzupełnienie przez Akademię, etap 10 | ⬜ |
| Zgoda Akademii na publikację nazwisk uczniów w galerii (lista + lightbox) | `content/icons.json` (`authorName`) | 5 | potwierdzenie przez właściciela, etap 10 | ⬜ |
| Technika w lightboxie — domyślna „tempera jajowa na desce lipowej” (`pl.gallery.lightbox.techniqueDefault`) dla wszystkich prac; brak pola `technique` w `icons.json` | `src/i18n/formatLightboxMeta.ts`, `content/icons.json` | 5 (K-42) | przegląd i ewentualna korekta per praca lub zmiana domyślnej — EJK, etap 10 | ⬜ |
| Wstęp do sekcji uczniów `[do uzupełnienia]`, etykieta „Autorzy prac:” | `src/i18n/pl.ts` (`gallery.sections`) | 5 (05b/3, 05b/5) | tekst od Akademii | ⬜ |
| Zajawka „Ikony na zamówienie” bez zdjęcia (K-46) — do sesji zdjęciowej | `src/components/gallery/GalleryOrderTeaser.tsx` | 5 (Kawałek 1), zmiana w 05b/5 | zdjęcie z sesji zdjęciowej | ⬜ |
| Czas realizacji ikony na zamówienie    | `content/offers/zamowienie.mdx` (`facts.leadTime`) | 3        | potwierdzenie z EJK                               | ⬜  |
| Liczba sezonów (16 łącznie)            | `content/lectures/archive.json`                    | 4        | potwierdzone: bieżący 2026/2027 = szesnasty       | ✅  |
| Zdjęcia z makiet                       | `public/media/sample/`                             | 2        | oryginały z `/wp-content/uploads/` lub nowa sesja | ⬜  |
| Sezony archiwum `sample` (2–3)         | `content/lectures/sample-*.json`                   | 4        | 16 sezonów z migracji (15 archiwalnych + bieżący) | ✅  |
| Wykładowcy — bio i zdjęcia z WP | `content/lecturers.json`, `public/media/lecturers/` | 4     | weryfikacja / migracja WP (etap 9)             | ✅  |
| „Najbliższe” na stronie głównej — 2/3 wpisy z brief §8; trzeci kafel wyliczany z dat wystawy dorocznej | `content/settings.json` (`upcoming`), `UpcomingHighlights`, `src/content/exhibition.ts` | 8, 8b | `getExhibitionUpcomingHighlight()` (K-58, K-85); link `/ikony/wystawy` | ✅ |
| Wystawy doroczne KŚT — 15 sezonów, tytuły K-88, `seasonSlug`, opcjonalnie `newsSlug` | `content/exhibition/annual.json` | 8b | zastępuje `editions.json`; tytuły/dat z WP + EJK; zdjęcia — uzupełnienie po wdrożeniu | ✅ |
| Ekspozycja codzienna + opis | `content/exhibition/page.mdx`, `body.mdx` | 8, 8b | redakcja; bez dyżurów uczniów (K-91) | ✅ |
| Lista miejsc „Gdzie byliśmy” (plenery LSŚ) | `content/offers/letnia-szkola-swiatla.mdx` (`whereWeWere`) | 8, 8b | format K-118; lata — EJK; **Gródek** — do potwierdzenia | ✅ |
| Treść kontaktu (zakrystia) | `content/pages/kontakt.mdx` | 8 | weryfikacja EJK | ✅ |
| Album + rozkładówki | `content/publications/`, `public/media/sample/publications/` | 8 | skany i spis treści od EJK | ✅ |
| Artykuły sample (5) | `content/articles/*.mdx` | 8 | wybór tekstów EJK (etap 9) | ✅ |
| Polityka prywatności | `content/pages/polityka-prywatnosci.json` (layout makieta 3a; treść prawna z WP) | 8 | aktualizacja prawna po wdrożeniu analityki (etap 10); `scripts/fetch-privacy-policy.ts` — podgląd surowego HTML z WP | ✅ |
| Zgoda Roberta Rumina na publikację komentarza z metryczki ikony Serca Jezusa | `content/news/*` (migracja) | 9 | zgoda EJK/R. Rumina | ⬜ |
| Korekta EJK w tekście o Trójcy Świętej (oprowadzania 2017) | `content/news/*` (migracja) | 9 | korekta EJK | ⬜ |
| Wpis o poświęceniu ikon po redakcji | `content/news/*.mdx` | 9 | wpis Aktualności `kind: 'plener'`, redakcja EJK; miejsce i data pleneru do podania (K-77) | ⬜ |
| ISBN albumu | `content/publications/*.mdx` | 8 | do podania (EJK) | ⬜ |
| Zapis tytułu albumu i tematu `mailto:` | publikacje, `pl.ts`, brief §7/§8 | 8 | do potwierdzenia | ⬜ |
| Slug albumu | `content/publications/*.mdx` | 8 | ustalenie w migracji / sesji 8 | ⬜ |
| Spis treści albumu | frontmatter `toc[]` | 8 | EJK (tytuł + autor, oznaczenie wykładowców) | ⬜ |
| Okładka + 8–12 rozkładówek | `public/media/` | 8 | EJK | ⬜ |
| 2–3 fragmenty albumu | body MDX publikacji | 8 | EJK | ⬜ |
| Tekst „Jak powstał album” (opcjonalny) | body MDX publikacji | 8 | EJK | ⬜ |
| Wybór tekstów z albumu jako artykuły | `content/articles/*.mdx` | 8/9 | EJK (rekomendacja 3–5 w całości) | ⬜ |
| Pisemne potwierdzenie praw do publikacji online tekstów z albumu | — | 8/9 | EJK (zwł. uczestnicy) | ⬜ |
| Lista tekstów EJK z mediów | `content/articles/*.mdx` | 8/9 | EJK (tytuł, medium, data, URL, status praw) | ⬜ |
| Co przedstawia zdjęcie `71496678_…_n-1.jpg` ze starej strony | — | 9 | ustalenie z EJK przed migracją | ⬜ |
| Weryfikacja plakatów (~20) | `News.poster` | 8/9 | EJK (wydarzenie + rok) | ⬜ |
| „Wybrane ikony” na stronie głównej i „Przykłady realizacji” w `/ikony/na-zamowienie` — 4 prace z galerii (Krzew Gorejący, Pantokrator, Archanioł Michał, Trójca Święta) | `FEATURED_ICON_SLUGS` w `src/content/icons.ts`, `exampleSlugs` w `content/offers/zamowienie.mdx` | 2, zmiana w 05b/5 | wybór redakcyjny EJK z prac galerii | ⬜ |
| Zdjęcia „Wybrane ikony” — 4 wpisy `sample` na stronę główną | `content/icons.json` (Kawałek 2) | 2 | migracja WP | ⬜ |
| Wybrane realizacje EJK (6× placeholder) | `content/pages/o-akademii.json` (`works`) | 6 | dane od klientki (copy doc pyt. 2) | ⬜ |
| Staż pracowni EJK w bio | `content/pages/o-akademii.json` | 6 | potwierdzenie klientki (copy doc pyt. 1) | ⬜ |
| Rozmowa — redakcja (5 nowych pytań ML, zmiany stylu) | `content/pages/pracownia.json` (`interview`) | 6 | akceptacja EJK | ⬜ |
| Portret EJK | `public/media/workshop/ejk-portret.jpg` | 6 | zdjęcie od klientki jeśli placeholder nieaktualny | ⬜ |
| Zdjęcia warsztatowe (hero, galeria 12×, pas 2×, portret) | `public/media/workshop/*` | 6 | opcjonalnie wyższa jakość / nowa sesja (etap 9 nie migruje tych stron) | ✅ |

---

## 6. Dziennik

| Data       | Wpis                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-11 | v0.1 — utworzenie planu; kolejność: migracja WP przeniesiona na koniec (etap 10), strony budowane na treściach z makiet.                                           |
| 2026-09-11 | v0.2 — decyzje K-10 (nabór na starej stronie), K-11 (angielski w kodzie), K-12 (commity ręczne). Załącznik C zastąpiony finalnym `CLAUDE.md` w repo. |
| 2026-09-12 | Etap 1 zamknięty (4/4 kawałki, OK użytkownika). K-02 rozstrzygnięte. Sample „Najbliższe” dodane do §5. **Gap:** kopia `design/assets/{icons,photos}` → `public/media/sample/` z decyzji planistycznej etapu 1 nie trafiła do żadnego kawałka — nie wykonana; użytkownik zdecydował odłożyć do etapu 2 (zdjęcia i tak potrzebne dopiero tam). |
| 2026-09-12 | Sesja planistyczna etapu 2 zakończona, plan zatwierdzony (`docs/plans/02-homepage.md`). W trakcie sesji zweryfikowano opis etapu bezpośrednio w pliku makiety — dwie rozbieżności wobec pierwotnego opisu: K-13 (brak MapBlock/kontaktu na stronie głównej w makiecie) i K-14 (Testimonial i „Prowadząca” to w makiecie jedna sekcja, nie dwie; dodatkowo świadomie uproszczona — bez portretu na żadnym breakpoincie). K-15: konwencja zdarzeń analitycznych odłożona w całości do etapu 9. |
| 2026-09-12 | Etap 2, Kawałek 1 zrobiony (czeka na OK): Hero + Najbliższe + trzy filary. Przy okazji naprawiony pre-istniejący błąd w `Button.tsx` (wariant `secondary` renderował się bez obrysu) i domapowane tokeny `leading-*` na klasy Tailwind (`Footer.tsx` z etapu 1 już ich używał, ale bez mapowania renderowały się z domyślnymi wartościami Tailwind). Szczegóły odstępstw: `docs/plans/02-homepage.md` §„Odstępstwa”. |
| 2026-09-12 | Etap 2, Kawałki 2–3 zrobione (czekają na OK). Kawałek 2: Testimonial + Wybrane ikony + `content/icons.json`. Kawałek 3: pełny audyt klawiatury i Lighthouse — znaleziony i naprawiony realny błąd dostępności (`heading-order` w `Pillars.tsx`, brak `<h2>` przed `<h3>`), Lighthouse accessibility 0.98→1.0 (mobile i desktop). Powstał `docs/design-mockup-guide.md` po dwóch złych zgadnięciach przy odczycie `.dc.html` (zły folder obrazu, nierozwiązany placeholder rozmiaru) — referencja dodana do `CLAUDE.md`. Szczegóły: `docs/plans/02-homepage.md`. |
| 2026-09-12 | **Etap 2 zamknięty** (OK użytkownika). DoD spełnione w całości (Lighthouse a11y 100/100 mobile+desktop). Otwarta uwaga do sprawdzenia przed wdrożeniem: klawisze Enter/Space na hamburgerze mobilnym (`HeaderMobileMenu.tsx`, kod z etapu 1) nie zadziałały w automatycznym teście klawiatury tej sesji — podejrzenie ograniczenia narzędzia testowego, nie potwierdzony błąd; wymaga sprawdzenia w realnej przeglądarce/na telefonie. |
| 2026-09-13 | Synchronizacja dokumentacji po audycie planów 01/02: `01-skeleton.md` — status `zamknięty`, usunięcie kopii mediów z zakresu etapu 1 (zawsze był to zakres 02); hamburger Enter/Space potwierdzony w przeglądarce. `plan-claude-code.md` — K-16 w §4, §3 etapu 2 bez błędnego „60% hero”. `brief-claude-code.md` §4 — `linkLabel` w `upcoming`. |
| 2026-09-17 | Sesja planistyczna etapu 3 zakończona, plan zatwierdzony (`docs/plans/03-oferta.md`). K-03 rozstrzygnięte: `@next/mdx`, `SemesterProgram` + frontmatter, FactsBox UI w `pl.ts`. |
| 2026-09-17 | **Etap 3 zamknięty** (3/3 kawałki + cleanup, merge PR #3). DoD spełnione: `FactsBox` (open/closed), 4× `content/offers/*.mdx`, tematy `mailto:` z brief §7, `StepList`, hub `/warsztaty`, trasy kurs/plener/zamówienie; `wyklady.mdx` pod szablon (trasa `/wyklady` w etapie 4). Build/lint OK. |
| 2026-09-17 | Sesja planistyczna etapu 4 zakończona, plan zatwierdzony (`docs/plans/04-wyklady.md`). K-17…K-22: JSON-LD dane tu / emisja w 9; osobny `LecturesHubPage`; wykładowcy layout WP; archiwum hub 3 sezony (najnowszy rozwinięty); join `lecturerSlugs`; pełny pakiet danych w osobnej sesji przed Kawałkiem 1. |
| 2026-09-18 | **Etap 4 zamknięty** (4/4 kawałki + ewaluacja merytoryczna). DoD spełnione: `/wyklady`, `/wyklady/archiwum`, `/wyklady/wykladowcy`; `LectureList`, `SeasonAccordion`, `LecturerCard`; warstwa `lectures.ts` / `lecturers.ts`; dane sample + `lecturer-directory.json`. Korekty po ewaluacji: K-20 → lead + link (bez akordeonu na hubie); `#zapisy`; `enrollmentDeadline` jako tekst; dokumentacja typów i K-21. Build/lint OK. |
| 2026-09-19 | Etap 4b — K-33 hero: **opcja A** (zostaje `min(920px, 76vh)` i siatka md+; kafle „Najbliższe" nad foldem przy 1920×917 nie są wymagane). Rejestr §4: K-33. Szczegóły i pomiary: `docs/plans/04b-review-fixes.md` K-33 pkt 1, załącznik. |
| 2026-09-19 | **Etap 4b zamknięty** (8/8 kawałków zamykających, OK użytkownika). DoD spełnione; Lighthouse a11y 100/100 na 4 trasach; rejestr K-23…K-35 w §4; brief §3 (SectionNav „Przegląd") + K-26 (Garamond min. 16,5 px); `/pracownia` zaślepka; D-1: brak CTA po scrollu (K-32/K-37). Gałąź: `feat/04b-review-fixes`. |
| 2026-09-19 | Sesja planistyczna etapu 5 zakończona, plan zatwierdzony (`docs/plans/05-galeria.md`). K-04, K-05, K-38, K-39; D-02 → wszyscy autorzy; filtry query string; lightbox bez opisu i bez `[slug]`; paginacja odłożona; tagi dynamiczne z `icons.json`; sample tylko 4 zdjęcia (bez `chrystus`/`deesis`). |
| 2026-09-20 | Galeria `/ikony`: K-40 **B** (wyrównane rzędy) jako jedyny układ; usunięto półkę (A), `GalleryLayoutContext`, `GalleryLayoutToggle` i stringi `layoutToggle`. Rejestr §4: K-40. Szczegóły: `docs/plans/05b-review-fixes.md` K-40. |
| 2026-09-20 | **Etap 5 zamknięty** (05: 4/4 + 05b: 6/6, OK użytkownika). DoD spełnione: `/ikony` z filtrami tematu, sekcjami EJK → uczniowie, siatką wyrównanych rzędów, lightboxem desktop/mobile; 52 prace sample z WP; rejestr K-38…K-47 w §4. Formalny Lighthouse a11y i test iOS Safari — etap 10 (wtedy etap 9; zamiana 2026-09-22). Gałąź: `feat/05-gallery`. |
| 2026-09-20 | v0.3 — rozbicie dawnego etapu 6 na etapy 6–8 (o akademii i pracownia · aktualności · pozostałe); wykończenie → 9, migracja → 10, wdrożenie → 11. Słownictwo ujednolicone na „etap" w całym repo. |
| 2026-09-20 | Sesja planistyczna etapu 6 zakończona, plan zatwierdzony (`docs/plans/06-o-akademii.md`). K-48 (`SectionNav` O Akademii · Pracownia), K-49 (`toc[]` jawny). Copy z `docs/copy-o-akademii-pracownia.md` od razu (nie lorem); 4 kawałki; wariant 6e bez linku autorskiego; OA-37 z placeholderami; rozmowa wdrożona z weryfikacją EJK w §5. Makieta 6a–6i zweryfikowana (render + 16 assetów OK). |
| 2026-09-21 | **Etap 6 zamknięty** (4/4 kawałki, merge PR #7). DoD spełnione: `TextPageShell`, `TocSidebar`/`TocCollapse`, `/o-akademii`, `/pracownia`; `Interview`, `PhotoGrid`, `WorkshopLightbox`; `SectionNav` O Akademii · Pracownia (K-48); `toc[]` w danych (K-49). Korekta layoutu OA w kawałku 2. Linki OA-55/OA-63 → `/aktualnosci` w etapie 7 (D-07-09). Gałąź: `feat/06-about`. Build/lint OK. |
| 2026-09-21 | v0.4 — **Likwidacja działu Wydarzenia (K-50…K-58).** Wystawa → `/ikony/wystawa`, archiwum wydarzeń → Aktualności z `kind`, poświęcenia → Publikacje, plenery → LSŚ. Odpowiedzi EJK: wystawa stała w kościele z roczną wymianą ikon; wyjazdy obecnie niezaplanowane, copy w czasie teraźniejszym zostaje; zgoda na przeniesienie i redakcję tekstu o poświęceniu. Publikacje odłożone do osobnej sesji. Szczegóły i uzasadnienie: `docs/plan-aktualizacji-dokumentow-wydarzenia.md`. Zmiany w kodzie w etapach 7 i 8 (jeszcze nie wykonane — ta sesja dotyczyła wyłącznie dokumentów). |
| 2026-09-21 | Sesja planistyczna etapu 7 zakończona, plan zatwierdzony (`docs/plans/07-aktualnosci.md`). K-06: jedna strona, YearNav bez paginacji. D-07-02: pełna nawigacja K-50 w etapie 7 (nie 8). 5 kawałków; lista bez miniatur (przegląd w kawałku 5); generator pełnego archiwum WP; `<NewsCta />` w MDX. |
| 2026-09-21 | Plan 07b Sesja 1 zamknięta (`docs/plans/07b-review-fixes.md`): karta `NewsCard` (K-59, K-60), etykiety `kind` (K-61), wyróżniony wpis `NewsFeatured` + `featured` na „Nabór na kurs…” (K-62), `getExcerpt` (K-63), `formatDateRange` (K-64). Rejestr §4: K-59…K-64. Sesja 2 (K-65, K-66, rozstrzygnięcie K-06) — następna. |
| 2026-09-21 | Plan 07b Sesja 2 zamknięta (`docs/plans/07b-review-fixes.md`): sticky `YearNav` + scroll-spy (K-65), zwinięte archiwum 2012–2018 + `NEWS_ARCHIVE_UNTIL_YEAR` (K-66), K-06 doprecyzowane. Pomiar mobile 390 px, archiwum zwinięte: **6063 px** (było ~24 300 px). Pasek lat mobile: 109 px, 1 rząd. Sesja 3 (K-67) — następna. |
| 2026-09-22 | Plan 07b Sesja 4 zamknięta (`docs/plans/07b-review-fixes.md`): ręczne zajawki 15 najnowszych wpisów (K-68). Zatwierdzone: 14; pominięty: 1 (nabór — zajawka bez zmian). Pliki: `content/news/sample-*.mdx` (14 wpisów), `content/news/manifest.json`. Build/lint OK. Rejestr §4: K-67, K-68. Lighthouse a11y `/aktualnosci` — otwarte. |
| 2026-09-22 | Przegląd `/aktualnosci` po 07b (deployment `academy-etudp0i7j`), plan 07c zatwierdzony (`docs/plans/07b-review-fixes.md`). K-69 otwarte (funkcja strony, do przeglądu całości serwisu). Rejestr §4: K-70…K-75. Znaleziony błąd odmiany miesiąca w zakresach dat (K-72). Nabór 2026/2027 wyróżniony z terminem 24.09.2026 (K-73). |
| 2026-09-22 | Plan 07c Sesja 2 (K-75) — część archiwum: przycisk „Pokaż archiwum 2012–2018 (47 wpisów)" jest **poprawny**. Liczba „36" w K-66 (`docs/plans/07b-review-fixes.md`) była błędnym szacunkiem przy pisaniu planu — w `manifest.json` od importu WP archiwum (rok kalendarzowy `date` ≤ 2018) ma **47 wpisów** (59 MDX − 1 wyróżniony na liście = 58 kart; rozwinięte 2019–2026: 11). K-67 zmniejszył archiwum z 49 do 47 (scalenie 2 duplikatów); **żaden wpis nie przeszedł granicy 2018/2019** między commitami `2bb755c` i `e65141d`. Granica `NEWS_ARCHIVE_UNTIL_YEAR` bez zmian. |
| 2026-09-22 | **Plan 07c Sesja 2 zamknięta** (K-75). Tytuły 16 wpisów `kind: wyklady` ujednolicone do wzoru „Temat — wykłady RRRR/RRRR" (15 zmian + `wyklady-2019-2020` bez zmian). Pliki: `content/news/sample-*.mdx` (15), `content/news/manifest.json`. Build/lint OK. Zrzut 1920 px: `docs/screenshots/aktualnosci-1920-k75.png`. Rejestr §4: K-75 zamknięty. |
| 2026-09-22 | **Etap 7 zamknięty** (07: 5/5 + 07b: 4/4 + 07c: 3/3). `/aktualnosci`, `/aktualnosci/[slug]`, 61 wpisów sample, nawigacja K-50, korekty listy po stagingu (07b/07c). Pomiar archiwum zwinięte: **3 222 px** desktop (1920), **5 141 px** mobile (390); pasek lat **~85 px** / **~121 px**. K-69 otwarte → etap 10. Lighthouse a11y `/aktualnosci` → etap 10. Gałąź: `feat/07-news`. Build/lint OK. |
| 2026-09-22 | **Zamiana etapów 9 i 10:** migracja WP → etap 9 (`docs/plans/09-migracja.md`), wykończenie → etap 10 (`docs/plans/10-wykonczenie.md`). Uzasadnienie: wykończenie na prawdziwych danych. K-08 → etap 9; K-07, K-15, K-17, K-36, K-37, K-38, K-39, K-69 → etap 10. |
| 2026-09-22 | Etap 10 rozszerzony: ewaluacja serwisu, poprawki po prezentacji, ewaluacja techniczna (kod: prostota, reużywalność, standardy; plus Lighthouse/a11y), SEO/schema/analityka, uspójnienie dokumentacji. |
| 2026-09-22 | **Sesja dokumentacyjna Publikacje (K-76…K-78, D-06).** Układ `/publikacje`: album jubileuszowy + artykuły, bez zakładek. Jedyne wydawnictwo: „IKONA DZIŚ. AKADEMIA IKONY 2010–2025” (tytuł i temat `mailto:` do potwierdzenia). Katalog 2020 nieistniejący; brak materiałów medialnych o Akademii. Poświęcenie → Aktualności `kind: 'plener'` (K-77, zastępuje K-55). Plakaty → `News.poster` / `ExhibitionEdition.poster` (K-78). Terminologia: „album”, nie „książka”/„katalog”. Szczegóły: `docs/plan-aktualizacji-dokumentow-publikacje.md`. Zmiany w kodzie — etapy 8–10. Sprzeczności z zamkniętymi planami (np. 07: poświęcenia → publikacje) i wpisem v0.4 o poświęceniach → Publikacje — zastąpione przez K-77; `docs/plan-aktualizacji-dokumentow-wydarzenia.md` pozostaje zapisem sesji 2026-09-21 bez przepisywania. |
| 2026-09-22 | Sesja planistyczna etapu 8 zakończona, plan zatwierdzony (`docs/plans/08-pozostale.md`). **4 kawałki** (kontakt · wystawa+home · publikacje · polityka+404). Rejestr §4: K-79…K-81. Decyzje D-08-01…10 (m.in. kafel wystawy z `editions.json`, polityka z WP, 404 z `mainNav`, makiety 7a–7d i 8a–8j). |
| 2026-09-26 | **Etap 8b zamknięty** (7/7 kawałków, `docs/plans/08b-review-fixes.md`). Wystawa przebudowana: `/ikony/wystawy`, `annual.json`, K-82…K-118. Briefy v2.3 / `brief-claude-code.md` zsynchronizowane. Master plan: sekcje etap 8 + **etap 8b**, migracja §9 bez `editions.json`. |
| 2026-09-26 | **Etap 8 zamknięty** (08: 4/4 + 08b: 7/7). Tabela §2: wiersze 8 i 8b → ✅; data domknięcia całości 2026-09-26. |
| 2026-09-26 | **K-119** — odpowiedzi na pytania prawne polityki (K-115); DoD 8b domknięty; treść `polityka-prywatnosci.json` może obowiązywać; formalnie zatwierdza EJK. |

---

## Załącznik A — szablon pliku planu etapu (`docs/plans/0N-nazwa.md`)

```md
# Plan 0N — [nazwa etapu]

Status: [plan w przygotowaniu / zatwierdzony DATA / w implementacji / zamknięty DATA]
Gałąź: feat/0N-nazwa
Makiety: design/[pliki i stany, które obowiązują]

## Cel i zakres

[2–4 zdania; co wchodzi, co wyraźnie nie wchodzi]

## Decyzje podjęte w sesji planistycznej

- K-xx: [decyzja] — [uzasadnienie w jednym zdaniu]

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| ---- | ----------- | ---------------- |

## Kawałki

### Kawałek 1 — [nazwa]

Zakres: […]
Kryterium „gotowe”: […]

### Kawałek 2 — […]

## Dane sample dodawane w tym etapie

[lista → do przepisania do docs/plan-claude-code.md §5]

## Kryteria ukończenia etapu

- [ ] […]

## Ryzyka i pytania otwarte

- […]

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| ------- | ------ | ------------------- |
```

## Załącznik B — prompty

**Sesja planistyczna:**

```
Zaczynamy etap 0N — [nazwa] z docs/plan-claude-code.md. Przeczytaj CLAUDE.md, docs/brief-claude-code.md, design/README oraz makiety: [lista]. Nie pisz kodu.
Zadanie tej sesji: przygotować docs/plans/0N-nazwa.md według szablonu z załącznika A w docs/plan-claude-code.md.
Zacznij od pytań z sekcji „Pytania na sesję planistyczną” dla tego etapu i od własnych wątpliwości — zadawaj je po jednym, czekaj na odpowiedź. Zaproponuj podział na 2–5 kawałków; każdy kawałek musi dać się zbudować i obejrzeć osobno. Wypisz, jakie dane sample dodasz i jak je oznaczysz.
Plan zapisz dopiero, gdy powiem „zapisz plan”.
```

**Start implementacji:**

```
Implementujemy docs/plans/0N-nazwa.md (zatwierdzony). Przeczytaj go, CLAUDE.md i design/README. Pracujemy na gałęzi feat/0N-nazwa.
Zrób wyłącznie Kawałek 1. Po nim zatrzymaj się i złóż meldunek w formacie z CLAUDE.md („Checkpoint”). Nie zaczynaj Kawałka 2 bez mojego OK.
```

**Wznowienie po** `/clear`**:**

```
Kontynuujemy docs/plans/0N-nazwa.md. Zaliczone checkpointy: 1–K. Przeczytaj plan, CLAUDE.md i sekcję „Postęp” w planie, sprawdź stan repo (git status, git log -5). Zrób Kawałek K+1, potem meldunek i czekaj na OK.
```

## Załącznik C — `CLAUDE.md`

Finalna treść `CLAUDE.md` żyje w katalogu głównym repo (v1 z 2026-09-11). Sekcja „Rytm pracy” w `CLAUDE.md` jest skróconą wersją §1 tego dokumentu; przy zmianie protokołu aktualizować oba miejsca.

Poprzednia wersja fragmentu (historyczna):

```md
## Rytm pracy (docs/plan-claude-code.md)

- Praca idzie etapami; każdy ma plan w docs/plans/0N-nazwa.md. Bez zatwierdzonego planu nie piszesz kodu w danym etapie.
- Implementujesz jeden kawałek z planu naraz. Po każdym kawałku zatrzymujesz się i składasz meldunek:
  ## Checkpoint N/M — [nazwa]
  Zrobione: / Odstępstwa od planu lub makiety: / Do decyzji: / Następny krok: / Build/lint: / Czekam na OK.
- Kolejny kawałek zaczynasz dopiero po „OK” użytkownika. „OK z uwagami” = najpierw uwagi, potem kawałek.
- Jeśli plan okazuje się błędny w trakcie — przerywasz, meldujesz, proponujesz korektę planu. Nie improwizujesz poza planem.
- Treści redakcyjne wyłącznie w content/ przez warstwę src/content/\*; nigdy w JSX. Dane przykładowe oznaczasz `sample` i dopisujesz do docs/plan-claude-code.md §5.
- Aktualizujesz sekcję „Postęp” w pliku planu po każdym checkpoincie.
```
