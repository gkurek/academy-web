# Plan pracy z Claude Code — Akademia Ikony

> **Wersja:** 0.2 · **Data:** 2026-09-11
> **Status:** żywy dokument. Jedyne miejsce, w którym śledzony jest postęp fazy implementacji. Aktualizowany po każdym checkpoincie.
> **Dokumenty powiązane:** `brief-claude-code.md` (wymagania techniczne, model treści, fakty stałe), `design/README` (handoff z Claude Design).
> **Miejsce w repo:** `docs/plan-claude-code.md`. Plany pod-etapów: `docs/plans/0N-nazwa.md`.

Stan wejściowy: makiety w Claude Design zatwierdzone i zhandoffowane, repo `academy-web` założone w stacku z briefu, `CLAUDE.md` do uzupełnienia o protokół z §1.

---

## 1. Jak pracujemy

### 1.1 Rytm pod-etapu

Każdy pod-etap ma trzy części, zawsze w tej kolejności:

1. **Sesja planistyczna** — rozmowa o szczegółach danej części aplikacji. Claude Code czyta `CLAUDE.md`, `docs/brief-claude-code.md`, `design/README` i odpowiednie makiety, zadaje pytania, proponuje podział na kawałki. Nie pisze kodu. Wynik: plik `docs/plans/0N-nazwa.md` według szablonu z załącznika A. Plan zatwierdzam ja; dopiero wtedy zaczyna się implementacja.
2. **Implementacja w kawałkach** — plan dzieli pracę na 2–5 kawałków. Jeden kawałek = jedna spójna zmiana, którą da się zbudować i obejrzeć (`npm run build` + `npm run lint` przechodzą, strona lub komponent renderuje się). Po każdym kawałku Claude Code zatrzymuje się i składa meldunek (§1.2). Bez mojego „OK” nie rusza dalej.
3. **Zamknięcie pod-etapu** — odhaczam kryteria ukończenia (DoD) z planu, wpisuję decyzje do rejestru (§4), aktualizuję tabelę w §2.

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
- Kawałki jednego pod-etapu można robić w jednej sesji; jeśli sesja się wydłuża lub kontekst robi się ciężki — `/clear` i start od promptu wznowienia (załącznik B) z podaniem numeru ostatniego zaliczonego checkpointu. Plan i ten dokument mają wystarczyć do wznowienia bez opowiadania historii.
- Jeden pod-etap = jedna gałąź / jeden PR (`feat/0N-nazwa`). Merge po zamknięciu pod-etapu. Commity wykonuję ja po każdym „OK” (format `0N/K: short description`, po angielsku); Claude Code nie commituje.

### 1.4 Treść w czasie budowy

Strony budujemy na przykładowych treściach i zdjęciach z makiet Claude Design. Żeby migracja na końcu była podmianą, a nie przeróbką, obowiązuje od pod-etapu 1:

- Strony czytają wyłącznie z warstwy `src/content/*` (typy z briefu §4). Żadnych treści redakcyjnych hardkodowanych w JSX — nawet „tymczasowo”.
- Przykładowe dane leżą w `content/` w tym samym formacie, jaki wyprodukuje migracja (MDX + JSON). Każdy plik makietowy ma w nazwie lub polu oznaczenie `sample` (np. `content/news/sample-01.mdx`, `"sample": true`), żeby w pod-etapie 8 dało się je usunąć mechanicznie.
- Fakty stałe z briefu §8 (maile, telefon, daty, nazwa, adres) wpisujemy od razu jako prawdziwe — one nie są makietowe.
- Lista treści makietowych do wymiany (§5) rośnie w każdym pod-etapie: kto dodaje treść `sample`, dopisuje ją do §5.

---

## 2. Pod-etapy i postęp

Statusy: ⬜ nie zaczęty · 🟡 plan w przygotowaniu · 🔵 plan zatwierdzony · 🟠 w implementacji (N/M) · ✅ zamknięty

| #   | Pod-etap                                       | Plik planu                       | Status               | Zakończono |
| --- | ---------------------------------------------- | -------------------------------- | -------------------- | ---------- |
| 1   | Szkielet, design system, warstwa treści        | `docs/plans/01-skeleton.md`      | ✅ zamknięty         | 2026-09-12 |
| 2   | Strona główna                                  | `docs/plans/02-homepage.md` | ✅ zamknięty         | 2026-09-12 |
| 3   | Strony ofertowe                                | `docs/plans/03-oferta.md`        | ✅ zamknięty         | 2026-09-17 |
| 4   | Wykłady                                        | `docs/plans/04-wyklady.md`       | ✅ zamknięty         | 2026-09-18 |
| 4b  | Korekty po przeglądzie stagingu               | `docs/plans/04b-review-fixes.md` | ✅ zamknięty         | 2026-09-19 |
| 5   | Galeria ikon (+ korekty 05b)                   | `docs/plans/05-galeria.md`, `docs/plans/05b-review-fixes.md` | ✅ zamknięty         | 2026-09-20 |
| 6   | Strony pozostałe                               | `docs/plans/06-pozostale.md`     | ⬜                   | —          |
| 7   | Wykończenie: SEO, dane strukturalne, analityka | `docs/plans/07-wykonczenie.md`   | ⬜                   | —          |
| 8   | Migracja treści z WordPressa                   | `docs/plans/08-migracja.md`      | ⬜                   | —          |
| 9   | Wdrożenie                                      | `docs/plans/09-wdrozenie.md`     | ⬜                   | —          |

Kolejność jest wiążąca dla 1 → 2 → 3 (szablon ofertowy i `FactsBox` są potrzebne dalej). Pod-etapy 4, 5, 6 można przestawiać. 7 wymaga wszystkich stron. 8 przed 9.

---

## 3. Opis pod-etapów

Dla każdego: cel, zakres, kryteria ukończenia (DoD), proponowany podział na kawałki (do zweryfikowania w sesji planistycznej) i pytania, które sesja planistyczna musi rozstrzygnąć.

### Pod-etap 1 — Szkielet, design system, warstwa treści

**Cel:** wszystko, co jest wspólne dla każdej strony, plus fundament pod treść.

**Zakres:**

- tokeny z `design/README` (kolory z rolami, skala typograficzna, odstępy, radius 0, brak cieni) w jednym miejscu; fonty przez `next/font` (EB Garamond, IBM Plex Sans; `latin` + `latin-ext`);
- komponenty: `Header` (z podtytułem „Studium Ikonograficzne św. Andrzeja Apostoła”), `Footer` z pełną mapą strony, `SectionNav`, `Breadcrumb`, menu mobilne z akordeonem sekcji; menu desktop — płaska lista 6 linków, bez dropdownu;
- `app/layout.tsx`, `src/i18n/pl.ts` ze stringami UI, stany fokusu (obrys 2 px `#e8c765`, odstęp 2 px), `prefers-reduced-motion`;
- `src/content/types.ts` skopiowany z briefu §4 bez zmian nazw pól; `src/content/` jako warstwa odczytu (funkcje typu `getOffer(kind)`, `getNews()`) czytająca z `content/`; `SiteSettings` z faktami stałymi z briefu §8;
- `content/` z pierwszymi plikami `sample` w zakresie potrzebnym do szkieletu (settings, `upcoming`);
- puste trasy dla całej architektury z briefu §3 (żeby `SectionNav` i mapa strony w stopce nie prowadziły do 404).

**DoD:**

- [x] każda **statyczna** trasa z briefu §3 istnieje i renderuje layout z nagłówkiem i stopką (`[slug]` i custom 404 — pod-etapy 5–6);
- [x] `SectionNav` i menu mobilne działają na 390 px, nawigacja klawiaturą z widocznym fokusem;
- [x] brak `#8d7d69` i brak 13 px w kodzie (grep);
- [x] `types.ts` zgodny z briefem §4, `SiteSettings` używane przez `Header`/`Footer` (patrz K-02, `docs/plans/01-skeleton.md`).

**Proponowane kawałki:** (1) tokeny + fonty + layout + `pl.ts`; (2) `Header`, menu mobilne; (3) `Footer`, `Breadcrumb`, `SectionNav`, trasy-zaślepki; (4) `types.ts`, warstwa `src/content/`\*, `SiteSettings`, pierwsze pliki `sample`.

**Pytania na sesję planistyczną** — rozstrzygnięte w `docs/plans/01-skeleton.md` (K-02, `src/navigation.ts`). Kopia mediów `sample` — zakres pod-etapu 2 (`docs/plans/02-homepage.md`).

### Pod-etap 2 — Strona główna

**Cel:** pierwsza pełna strona; ustala rytm sekcji, użycie obrazów i komponentów treściowych.

**Zakres:** `Hero` (ikona + zdanie + dwa CTA), sekcja „Najbliższe” z `SiteSettings.upcoming` (z `linkLabel` — K-16), trzy filary, „Wybrane ikony” (z `IconWork`, dane `sample`), `Testimonial` (cytat EJK, bez portretu/bio/linku — K-14). **`content/icons.json`** — utworzenie pliku z 4 wpisami `sample` na sekcję „Wybrane ikony” (zdjęcia z `design/assets/icons` → `public/media/sample/`). Poza zakresem: `MapBlock` i sekcja kontakt (K-13 — makieta ich nie zawiera na stronie głównej; pełny `MapBlock` w pod-etapie 6 na `/kontakt`). Szczegóły Hero (wymiary mobile/desktop): `docs/plans/02-homepage.md` §„Druga poprawka”.

**DoD:**

- [x] zgodność z makietą desktop i mobile (screenshot obok makiety), z uwzględnieniem K-13/K-14;
- [x] wszystkie treści z `content/` lub `pl.ts`; brak tekstu redakcyjnego w JSX;
- [x] CTA „Warsztaty”/„Wykłady” prowadzą do hubów `/warsztaty` i `/wyklady`;
- [x] Lighthouse mobile na tej stronie: dostępność ≥ 95 (wydajność sprawdzana w pod-etapie 7) — 100/100 mobile i desktop.

**Proponowane kawałki:** (1) `Hero` + „Najbliższe” + filary; (2) `Testimonial` + `IconGrid` w wersji „wybrane” + dane sample; (3) dopracowanie mobile i finalizacja.

**Pytania:** rozstrzygnięte w sesji planistycznej — patrz K-13, K-14, K-15 w §4.

### Pod-etap 3 — Strony ofertowe

**Cel:** jeden szablon, cztery treści; `FactsBox` w obu stanach; `StepList`.

**Zakres:** szablon `Offer` (breadcrumb, `SectionNav`, H1, lead, `FactsBox` po prawej / na mobile pod leadem, body MDX, „Jak się zapisać”, `Testimonial`); `FactsBox` zasilany z `OfferFacts` ze stanami `enrollmentOpen: true/false` i różnymi komunikatami per `kind`; `mailto:` z dokładnymi tematami z briefu §7 i `tel:+48601734705`; hub `/warsztaty` z `OfferCard`; strony: `/warsztaty/kurs-roczny-i-trzyletni` (program 6 semestrów jako sekwencja), `/warsztaty/letnia-szkola-swiatla` (stan zamknięty domyślnie, „Rytm dnia” tylko jako `sample`), `/ikony/na-zamowienie` (`StepList` 3 kroki, „Przykłady realizacji”, nota o gotowych ikonach). Wariant `wyklady` szablonu przygotować, ale strona `/wyklady` powstaje w pod-etapie 4.

**DoD:**

- [x] `FactsBox` renderuje oba stany z jednego komponentu, sterowane wyłącznie danymi;
- [x] tematy `mailto:` identyczne ze stringami z briefu §7 (test: kliknięcie na telefonie otwiera klienta z tematem);
- [x] cztery `content/offers/*.mdx` z `facts` zgodnymi z `OfferFacts`; wartości niepotwierdzone (czas realizacji zamówień) jako puste pola, nie zmyślone;
- [x] `StepList` używa numeracji, reszta strony nie.

**Proponowane kawałki:** (1) `FactsBox` + szablon `Offer` + hub `/warsztaty`; (2) kurs + plener; (3) `/ikony/na-zamowienie` + `StepList`.

**Pytania:** rozstrzygnięte w sesji planistycznej — patrz K-03 w §4.

### Pod-etap 4 — Wykłady

**Zakres:** `/wyklady` jako hub + bieżący sezon (`LectureList`: data, tytuł, prowadzący) + „Jak się zapisać” (`FactsBox` w wariancie `wyklady`, `id="zapisy"`) + sekcja archiwum (lead + link „Pełne archiwum”, bez akordeonu na hubie); `/wyklady/archiwum` z `SeasonAccordion` (15 sezonów archiwalnych, domyślnie zwinięte; bieżący 2026/2027 — szesnasty, na hubie); `/wyklady/wykladowcy` z `LecturerCard`. Dane: `content/lectures/<season>.json` — na razie 2–3 sezony `sample` w docelowym schemacie, żeby akordeon miał co pokazywać.

**DoD:**

- [x] `SeasonAccordion` dostępny z klawiatury (Enter/Space, fokus, `aria-expanded`), działa bez JS w sensownym stopniu (treść w DOM);
- [x] liczba sezonów (16 łącznie, 15 archiwalnych) wpisana w `content/lectures/archive.json`, nie hardkodowana w kodzie;
- [x] terminy 2026/2027 z briefu §8 wpisane jako prawdziwe dane bieżącego sezonu; tytuły i prowadzący z WP.

**Proponowane kawałki:** (1) `LectureList` + hub; (2) `SeasonAccordion` + archiwum; (3) wykładowcy.

**Pytania:** rozstrzygnięte w sesji planistycznej — patrz K-17…K-22 w §4 i `docs/plans/04-wyklady.md`. Przed Kawałkiem 1: osobna sesja przygotowania danych (K-22).

### Pod-etap 4b — Korekty po przeglądzie stagingu

**Cel:** doprowadzić skeleton, home, ofertę i wykłady do spójnego systemu przed pod-etapem 5 (galeria dziedziczy te same komponenty).

**Zakres:** bugi układu, skala typografii i role kolorów, stopka/`SectionNav`, rytm pionowy i szerokość kontenera, home (hero, Najbliższe, filary). Poza zakresem: sticky `FactsBox`, `ClosingCta`, stany czasu w `LectureList` (K-34), CTA „Zapisy" w nagłowku desktop (K-35). Szczegóły: `docs/plans/04b-review-fixes.md`.

**DoD:** wszystkie checkboxy w planie 04b odhaczone (CTA po scrollu — N/A, świadoma decyzja D-1); Lighthouse a11y 100/100 na 4 trasach; rejestr K-23…K-35 w §4.

### Pod-etap 5 — Galeria ikon

**Cel:** `/ikony` gotowa do pokazania EJK i uczniom na pełnym zestawie prac z WP (`sample`), przed formalną migracją w pod-etapie 8.

**Zakres:** `SectionNav`, H1, filtr **tematu** (`?temat=`, K-43), dwie sztywne sekcje EJK → uczniowie (K-41), `IconGrid` z układem wyrównanych rzędów (K-40 B), `Lightbox` desktop i mobile (K-38, K-45), zajawka „Ikony na zamówienie” (K-46). Podpisy: siatka — tytuł; sekcja uczniów — lista nazwisk; lightbox — autor, wymiary, technika (K-42). **`content/icons.json`** — 52 prace z WP (23 EJK + 29 uczniów), oryginały w `public/media/sample/icons/` (K-47). Poza zakresem: `/ikony/[slug]` (K-04), filtr autora, paginacja, opis dzieła w lightboxie, test lightboxa na fizycznym iOS Safari i formalny Lighthouse a11y (→ pod-etap 7, K-38).

**Założenia wejściowe z pod-etapu 4b** (szczegóły w `docs/plans/04b-review-fixes.md` §„Założenia wejściowe dla planu 05"):
- typografia podpisów: Garamond min. 16,5 px, meta `--accent-text` (K-26);
- layout strony: `--content-max: 1280px` od 1600 px (K-30); H2 sekcji wg tabeli ról K-25;
- siatka galerii: wyrównane rzędy, `object-cover`, `justifyGalleryRows` (K-40 B) — **nie** K-31 (`object-contain` zostaje na home „Wybrane ikony”).

**DoD:** wszystkie checkboxy w `docs/plans/05-galeria.md` i `docs/plans/05b-review-fixes.md` odhaczone; rejestr K-38…K-47 w §4; build/lint OK. Pozostałe po 05b: weryfikacja merytoryczna treści `sample` (§5) i testy przeniesione do pod-etapu 7.

**Kawałki:** plan 05 (4/4) + korekty 05b (6/6) — szczegóły w plikach planów pod-etapu; decyzje w rejestrze §4 (K-38…K-47).

### Pod-etap 6 — Strony pozostałe

**Zakres:** `/kontakt` (adres, osadzona mapa, dwa maile z opisem, telefon, zakrystia, „Akademia w sieci”); `/o-akademii` i `/pracownia` na szablonie strony tekstowej z `TocSidebar`; `/aktualnosci` z `NewsCard` i paginacją + `/aktualnosci/[slug]`; `/wydarzenia` z `EventCard`, kategorie w `SectionNav` (linki z query string `?kategoria=`, wartości jak `Event.category`: `wystawa`, `poswiecenie`, `oprowadzanie`, `wyjazd`); `/publikacje` na szablonie tekstowym z zakładkami; `/polityka-prywatnosci`; strona 404 w stylu projektu.

**DoD:**

- [ ] szablon strony tekstowej użyty na co najmniej trzech trasach bez rozgałęzień w kodzie;
- [ ] paginacja aktualności działa z 60+ wpisami (wygenerować dane `sample` skryptem, nie ręcznie);
- [ ] wszystkie trasy z briefu §3 mają realną treść lub `sample` — koniec zaślepek.

**Proponowane kawałki:** (1) szablon tekstowy + `TocSidebar` + O Akademii + polityka + 404; (2) kontakt + wydarzenia; (3) aktualności lista + wpis; (4) publikacje.

**Pytania:** jak `TocSidebar` zbiera nagłówki z MDX (plugin `rehype` czy własny parser); paginacja — trasa `/aktualnosci/strona/2` czy query string (konsekwencje SEO).

### Pod-etap 7 — Wykończenie: SEO, dane strukturalne, analityka

**Zakres:** `generateMetadata` + Open Graph dla każdej trasy (obraz OG domyślny + per strona); `sitemap.ts`, `robots.ts`; JSON-LD: `Organization` (z `parentOrganization`), `Person` (EJK, `sameAs`), `Event` dla bieżącego sezonu, `Course` dla kursu i pleneru; Plausible lub Umami bez ciasteczek ze zdarzeniami na CTA zapisów, `mailto:`, `tel:`; przegląd Lighthouse (dostępność ≥ 95, wydajność ≥ 90 mobile) i naprawa blokad; przegląd kontrastu i fokusu na wszystkich stanach z ekranu „Komponenty”; **test lightboxa galerii na fizycznym iOS Safari** (`/ikony`: `showModal()`, scroll lock, sticky pasek nawigacji, swipe — przeniesione z DoD pod-etapu 5b, K-38); **korekta danych galerii z EJK** — brakujące `size` (5 prac), weryfikacja pozostałych wymiarów, poprawka sluga/tytułu `do-uzupelnienia-tytul-ikony`, jakość tytułów (§5); **uzupełnienie brakujących `authorName` uczniów** (10 prac) i **zgoda Akademii na publikację nazwisk**; **przegląd techniki w lightboxie** — domyślna wartość vs pole `technique` per praca (§5); **dopracowanie designu stopki** (`Footer`) — układ desktop i mobile, rozkład kolumn, social, pasek dolny (K-36; w 04b wdrożono wariant B funkcjonalny, bez finalnego polishu); **ponowne rozważenie sticky `FactsBox`** (K-37; odrzucone w 04b po prototypie — patrz `docs/plans/04b-review-fixes.md` K-32).

**DoD:**

- [ ] walidator schema.org bez błędów dla czterech typów;
- [ ] podgląd linku (OG) sprawdzony narzędziem debugującym dla strony głównej i jednej ofertowej;
- [ ] zdarzenia analityczne widoczne w panelu narzędzia w środowisku testowym;
- [ ] raport Lighthouse dla 5 tras (główna, kurs, wykłady, **galeria `/ikony`** — a11y ≥ 95 mobile, przeniesione z DoD 05b, audyt ręczny w 05b jako zamiennik tymczasowy, aktualności) w `docs/lighthouse/`;
- [ ] lightbox `/ikony` sprawdzony na fizycznym iOS Safari (K-38; przeniesione z 05b).

**Proponowane kawałki:** (1) metadata + OG + sitemap + robots; (2) JSON-LD; (3) analityka; (4) Lighthouse i poprawki.

**Pytania:** Plausible czy Umami (hosting, koszt, self-hosting); czy `Event` JSON-LD wymaga lokalizacji/oferty ceny; domena kanoniczna (z `www` czy bez — wpływa na 301 w pod-etapie 8).

### Pod-etap 8 — Migracja treści z WordPressa

**Cel:** zastąpić wszystkie dane `sample` prawdziwymi, bez dotykania komponentów.

**Zakres:** sprawdzenie REST API vs WXR; skrypt `scripts/migrate-wp.ts` wg briefu §5 (pages/posts → MDX, oryginały obrazów z `href` nie z `src`, wykłady → `LectureSeason`, galeria → `IconWork`, `docs/redirects.json`); raport `scripts/migrate-report.md`; ręczna korekta (literówki, nazwiska, podpisy ikon, daty 2025 → archiwum lub aktualizacja); usunięcie wszystkich plików i wpisów `sample`; weryfikacja listy z §5; 301 w `next.config.ts`.

**DoD:**

- [ ] `grep -r sample content/ public/media/` pusty;
- [ ] każda pozycja z §5 odhaczona;
- [ ] raport migracji przejrzany, niejasne przypadki rozstrzygnięte lub zgłoszone EJK;
- [ ] wszystkie daty w `content/` sprawdzone pod kątem 2025/2026;
- [ ] build z prawdziwymi danymi przechodzi, strony obejrzane ponownie na mobile (długie prawdziwe teksty mogą złamać układ, którego `sample` nie testowało).

**Proponowane kawałki:** (1) skrypt: pobieranie + HTML→MDX + obrazy; (2) skrypt: wykłady + galeria + redirecty + raport; (3) korekta ręczna i usunięcie `sample`; (4) przegląd wizualny na prawdziwych danych.

**Pytania:** dostęp do REST API lub eksportu WXR (sprawdzić przed sesją planistyczną, nie w jej trakcie); kto robi korektę merytoryczną nazwisk i podpisów (EJK / sekretariat) i w jakim formacie dostają listę.

### Pod-etap 9 — Wdrożenie

**Zakres:** hosting, zmienne środowiskowe, domena i certyfikat, test 301 ze starych URL-i (w tym długi slug „O nas”), test `mailto:` i `tel:` na telefonie (iOS i Android), zgłoszenie sitemap w Google Search Console, monitoring (uptime, błędy), procedura publikacji zmian treści do czasu panelu CMS.

**DoD:**

- [ ] lista starych URL-i z briefu §5 przetestowana skryptem (status + cel);
- [ ] GSC potwierdza sitemap;
- [ ] `docs/runbook.md`: jak wdrożyć, jak zmienić treść, gdzie są logi.

**Pytania:** wybór hostingu; kiedy przełączać DNS (poza sezonem zapisów — termin 24.09.2026 jest blisko, patrz §4).

---

## 4. Rejestr decyzji

| #    | Decyzja                                            | Pod-etap | Wybór                                                                                       | Data       |
| ---- | -------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- | ---------- |
| K-02 | Źródło aktywnej pozycji nawigacji (klient/serwer)  | 1        | **Prop `active` ze strony/serwera**, nie `usePathname`; `Header`/`Footer` montują się w `PagePlaceholder` (i docelowo w stronach), nie w root `layout.tsx` — patrz `docs/plans/01-skeleton.md` | 2026-09-12 |
| K-03 | Renderer MDX i zestaw komponentów w body           | 3        | **`@next/mdx` + `@mdx-js/react`**, mapa tagów w `mdx-components.tsx`, body w `OfferPage` (wrapper `offer-mdx`); program kursu: `<SemesterProgram />` + `semesters[]` w frontmatter (bez zmiany `types.ts`); FactsBox: etykiety + CTA per `kind × enrollmentOpen` w `pl.ts`, tel. jako drugi przycisk tylko mobile — patrz `docs/plans/03-oferta.md` | 2026-09-17 |
| K-04 | `/ikony/[slug]` w v1                               | 5        | **Poza v1** — podgląd tylko przez lightbox; trasa `[slug]` nie w tym pod-etapie — patrz `docs/plans/05-galeria.md` | 2026-09-19 |
| K-05 | Filtry galerii: query string vs stan               | 5        | **Query string** (`?temat=<slug-tagu>`), bez przeładowania; domyślnie wszystkie tematy. **`?autor=` wycofane w 05b (K-43)** — podział EJK / uczniowie jest sztywny (sekcje, K-41) — patrz `docs/plans/05-galeria.md`, `docs/plans/05b-review-fixes.md` | 2026-09-19 |
| K-06 | Paginacja aktualności: trasa vs query              | 6        | —                                                                                           | —          |
| K-07 | Plausible vs Umami                                 | 7        | —                                                                                           | —          |
| K-08 | Domena kanoniczna (www / bez)                      | 7        | —                                                                                           | —          |
| K-09 | Hosting                                            | 9        | —                                                                                           | —          |
| K-10 | Termin przełączenia DNS względem naboru 24.09.2026 | 9        | **Nabór 2026/2027 obsługuje stara strona**; wdrożenie bez presji terminu                    | 2026-09-11 |
| K-11 | Język komentarzy, commitów i PR                    | —        | **Angielski** (treść dla użytkownika po polsku)                                             | 2026-09-11 |
| K-12 | Kto commituje                                      | —        | **Wyłącznie właściciel repo**, po „OK” dla kawałka; Claude Code nie używa `git commit/push` | 2026-09-11 |
| K-13 | MapBlock/kontakt na stronie głównej                | 2        | **Usunięte z zakresu** — makieta (#1a/#3b) nie ma tych sekcji na home; kontakt zostaje w stopce, pełny `MapBlock` w pod-etapie 6 na `/kontakt` | 2026-09-12 |
| K-14 | Testimonial vs blok „Prowadząca” na stronie głównej | 2        | **Jedna sekcja** — cytat + podpis Elżbiety Jackowskiej-Kurek, bez portretu/bio/linku, identycznie na desktop i mobile; świadome uproszczenie względem wariantu mobile makiety i `Testimonial.prompt.md` | 2026-09-12 |
| K-15 | Konwencja zdarzeń analitycznych (`data-event` itp.) | 2        | **Nie dodajemy w pod-etapie 2** — konwencja i podłączenie w całości w pod-etapie 7 | 2026-09-12 |
| K-16 | `linkLabel` w `SiteSettings.upcoming`            | 2        | **Dodane pole** — osobny `TextLink` per kafel „Najbliższe” (np. „Jak się zapisać”), zgodnie z makietą; `types.ts`, `content/settings.json`, `UpcomingHighlights.tsx` | 2026-09-12 |
| K-17 | JSON-LD `Event` dla wykładów                     | 4        | **Dane w pod-etapie 4**, emisja `<script type="application/ld+json">` w pod-etapie 7 — patrz `docs/plans/04-wyklady.md` | 2026-09-17 |
| K-18 | Layout huba `/wyklady`                             | 4        | **Osobny `LecturesHubPage`**, nie `OfferPage`; `wyklady.mdx` tylko pod FactsBox | 2026-09-17 |
| K-19 | Layout `/wyklady/wykladowcy`                       | 4        | **Zdjęcie + bio jak WP** (akademiaikony.pl), nie kafelki `#3a-wykladowcy` bez zdjęć | 2026-09-17 |
| K-20 | Podgląd archiwum na hubie                          | 4        | **Lead + link „Pełne archiwum”** (bez `SeasonAccordion` na hubie); pełne archiwum na `/wyklady/archiwum` | 2026-09-18 |
| K-21 | `lecturerSlugs` bez wpisu w rejestrze              | 4        | Join → `lecturer-directory.json` + `lecturers.json`; brak wpisu → heurystyka ze sluga, bez linku; rozszerzenia `types.ts`: `affiliationFull`, `introSecondary`, `LecturerDirectoryEntry` | 2026-09-17 |
| K-22 | Przygotowanie danych przed implementacją           | 4        | **Osobna konwersacja** (krok po kroku); pełny pakiet: `2026-2027.json`, 2–3 archiwum `sample`, wykładowcy z WP + zdjęcia | 2026-09-17 |
| K-23 | Pierwsza pozycja `SectionNav` (04b)              | 4b       | **Hub nazwany treścią, nie sekcją** — Warsztaty: „Przegląd"; Wykłady bez zmian; Ikony: „Galeria"; mobile: zawijanie, tap ≥ 44 px | 2026-09-19 |
| K-24 | Układ stopki (04b)                                 | 4b       | **Wariant B** — 4 kolumny desktop, huby jako linki, `/pracownia` + brakujące pozycje, etykiety kontaktu Plex tertiary, tap 44 px; polish układu → pod-etap 7 (K-36) | 2026-09-19 |
| K-25 | Skala H2/H3 i tekst (04b)                          | 4b       | **Jedna tabela ról** w `globals.css`, waga 400, tag HTML wg kolejności w dokumencie; `--size-nav` 16 px; tap menu/SectionNav ≥ 44 px | 2026-09-19 |
| K-26 | Minimalny rozmiar EB Garamond (04b)                | 4b       | **Min. 16,5 px**; mniejsze etykiety → Plex 14,5 px; wyjątek logo: podtytuł 15 px desktop; dopisek w `brief-claude-code.md` §7 | 2026-09-19 |
| K-27 | Role kolorów i detale spójności (04b)               | 4b       | Złoto = metadane (`--accent-text`); belka 2 px; `SeasonAccordion` role kolorów + stan otwarty; nadtytuły sezonu na ofertach; full-bleed kafli Najbliższe mobile — świadomy wyjątek (makieta `#3b`) | 2026-09-19 |
| K-28 | Szerokość linii (04b)                              | 4b       | **`--measure-lead` 680 px**, **`--measure-prose` 640 px** na leadach, body MDX i biogramach | 2026-09-19 |
| K-29 | Skala odstępów i rytm desktop (04b)                | 4b       | **Tokeny `--space-10/11/12`, `--section-gap` 96 px od 1024 px, cytat home 120 px góra/dół.** Świadome odstępstwo: dolna linia cytatu (`rule-gold-b`) **zostaje** — cezura między cytatem a „Wybrane ikony"; pierwotna rekomendacja usunięcia odrzucona po review | 2026-09-19 |
| K-30 | `content-max` na szerokich ekranach (04b)          | 4b       | **`--content-max: 1280px` od 1600 px**; tekst trzyma K-28; siatki korzystają z szerszego kontenera | 2026-09-19 |
| K-31 | Kadrowanie ikon w `IconGrid` (04b)                 | 4b       | **`object-contain`** na `--surface-tile`, stała wysokość boksu; reguła wejściowa pod-etapu 5 | 2026-09-19 |
| K-32 | Sticky `FactsBox` + `ClosingCta` (04b)             | 4b       | **Odrzucono** — layout bez zmian. **Świadoma decyzja D-1:** brak CTA po scrollu; zapis tylko w `FactsBox` w nagłówku; powrót w pod-etapie 7 (K-37) | 2026-09-19 |
| K-33 | Hero home — rozmiar obrazu i fold (04b)            | 4b       | **Częściowo** — H2 „Najbliższe", filary → huby; `ClosingCta` home odrzucony (K-32). Hero: rekomendacja review `min(760px, 68vh)` **nie wdrożona** — **opcja A (2026-09-19):** zostaje `min(920px, 76vh)`, kolumna obrazu max 500 px, mobile 72%, siatka md+ (`--hero-text-min: 300px`). Kafle „Najbliższe" nad foldem przy 1920×917 **nie są wymagane** (priorytet: czytelność ikony). Patrz `docs/plans/04b-review-fixes.md` K-33 pkt 1 | 2026-09-19 |
| K-34 | Stan czasu w `LectureList` (04b)                   | 4b       | **Odłożone** — bez zmian; obliczanie po stronie serwera + `revalidate`; powrót po pod-etapie 7 | 2026-09-19 |
| K-35 | CTA „Zapisy" w nagłowku desktop (04b)              | 4b       | **Poza 04b** — wrócić w pod-etapie 7 z danymi analityki | 2026-09-19 |
| K-36 | Design stopki — dopracowanie układu                | 7        | **W pod-etapie 7** — po pełnym zestawie stron i przeglądzie Lighthouse; w 04b wdrożono wariant B funkcjonalny (huby jako linki, mapa kompletna, tap targety 44 px, mobile 2 kolumny); polish: rozkład kolumn desktop/mobile, social, pasek dolny — patrz `docs/plans/04b-review-fixes.md` K-24 | 2026-09-19 |
| K-37 | Sticky `FactsBox` na stronach ofertowych           | 7        | **Ponowne rozważenie w pod-etapie 7** — odrzucone w 04b (K-32) po prototypie; warunek `min-height: 880px`, dwukolumnowy layout przez całą stronę; opcjonalnie `ClosingCta` — patrz `docs/plans/04b-review-fixes.md` K-32 | 2026-09-19 |
| K-38 | `Lightbox` — implementacja modalna                 | 5        | **Natywny `<dialog>` + `showModal()`**; fallback do własnego overlay tylko po negatywnym teście Safari/iOS (test fizyczny iOS — **pod-etap 7**); patrz `docs/plans/05-galeria.md` | 2026-09-19 |
| K-39 | Obrazy w lightboxie vs. siatka                     | 5        | **Jeden `src`**, większe `sizes` w lightboxie (rozmiar obrazu zmieniony w K-45); weryfikacja w pod-etapie 7, ewentualne `imageLarge` w `IconWork` — patrz `docs/plans/05-galeria.md` | 2026-09-19 |
| K-40 | Układ siatki galerii (05b; zmienia K-31 dla galerii) | 5b | **Opcja B — wyrównane rzędy** (FooGallery / `justifyGalleryRows.ts`): stała wysokość rzędu, zmienna szerokość kafli, `object-cover`, `lastRow: smart`; desktop `rowHeight` 300 / `maxRowHeight` 400, max 4 kafle w rzędzie. Opcja A (półka) odrzucona po ocenie wizualnej na pełnym zestawie WP (52 prace, 2026-09-20); tymczasowy toggle A/B usunięty. „Wybrane ikony” na home zostają przy K-31 — patrz `docs/plans/05b-review-fixes.md` | 2026-09-20 |
| K-41 | Kolejność: EJK → uczniowie (05b) | 5b | **Dwie sztywne sekcje** z H2 (bez licznika w nagłówku); kolejność w sekcji = kolejność w `icons.json`; sekcja pusta pod filtrem tematu znika razem z nagłówkiem. Doprecyzowuje D-02 | 2026-09-19 |
| K-42 | Podpisy i atrybucja autorów (05b) | 5b | **Trzy poziomy:** siatka — sam tytuł; sekcja uczniów — lista nazwisk generowana z danych (bez osobnego wstępu); lightbox — pełny autor lub „Praca z warsztatów Akademii”, wymiary („do weryfikacji”), technika (domyślna lub z danych). `authorName?` opcjonalne w `IconWork`; bez pola `year` w `IconWork` | 2026-09-20 |
| K-43 | Logika filtrów (05b) | 5b | **Jeden filtr — temat:** „Wszystkie”, wybór jednokrotny, `aria-current`, grupa z `aria-label`. **Filtr autora i `?autor=` wycofane** (parametr usuwany z URL). Taksonomia: Chrystus · Matka Boża · Aniołowie · Święci · Sceny i święta (stała lista, kolejność chipów z niej); walidacja przy buildzie (każda praca ≥ 1 tag, każdy temat ≥ 1 praca, tag spoza taksonomii); nieznany `?temat=` usuwany z URL | 2026-09-19 |
| K-44 | Nagłówek galerii (05b) | 5b | **Jednokolumnowy** na wszystkich szerokościach (H1, pod nim filtr tematu); mobile: poziomy pasek chipów z uciętym ostatnim chipem (świadome odstępstwo od K-23 — filtr to nie nawigacja). Bez układu dwukolumnowego od 1024 px | 2026-09-19 |
| K-45 | Lightbox — rozmiar obrazu i układ (05b; zmienia K-39) | 5b | Obraz o wysokości 80vh (desktop) / 60svh (mobile) i jawnej szerokości z proporcji; strzałki 48×48 przy krawędziach okna; licznik w kolumnie metadanych; mobile: sticky pasek Poprzednia / licznik / Następna + swipe (próg 50 px); układ desktopowy od `lg` (1024 px), nie `md`; „Zapytaj o podobną ikonę” tylko przy pracach EJK; klik w tło zamyka (tylko desktop); jedno drzewo, jeden `<Image>` | 2026-09-19 |
| K-46 | Zajawka „Ikony na zamówienie” (05b) | 5b | Zajawka **bez zdjęcia** do sesji zdjęciowej; CTA jako przycisk | 2026-09-19 |
| K-47 | Treść `sample` galerii (05b) | 5b | **Pełny zestaw WP** — 52 prace (23 EJK + 29 uczniów), oryginały w `public/media/sample/icons/`, wszystkie `sample: true`; tytuły zgodne ze zdjęciami WP. Wymiary z podpisów WP w danych (`size` — 47 z 52; bez `size`: 3 EJK + 2 uczniów), UI pokazuje „Wymiary: do weryfikacji” (bez nowego pola). Z makiety wypadły „Św. Antoni” i „Przemienienie” (brak w galerii WP); dawny „Mandylion” to Chrystus Pantokrator, „Matka Boża Znaku” to Krzew Gorejący | 2026-09-20 |

Decyzje spoza kodu (D-01…D-05 z briefu v2) pozostają w dokumentach ekosystemu; tu wpisujemy tylko ich skutki dla implementacji. **D-02 (domyślny filtr galerii):** galeria pokazuje **obie sekcje, EJK pierwsza, sztywny podział** (K-41), bez filtra autora; pytanie o zakres prac EJK po starcie strony autorskiej zostaje otwarte — skutek w K-05 / K-41 / `docs/plans/05b-review-fixes.md` (2026-09-19).

---

## 5. Treści makietowe do wymiany przed wdrożeniem

Lista rośnie w każdym pod-etapie. Odhaczana w pod-etapie 8.

| Treść                                  | Gdzie (plik `sample`)                              | Dodano w | Zastąpić czym                                     | ✔   |
| -------------------------------------- | -------------------------------------------------- | -------- | ------------------------------------------------- | --- |
| Cytaty uczestników (Adam, Hania, Iza…) | `content/offers/*`, `content/testimonials.json`    | 3        | cytaty z obecnej strony, dosłownie                | ⬜  |
| Wpisy aktualności `[przykład]`         | `content/news/sample-*.mdx`                        | 6        | migracja WP                                       | ⬜  |
| „Rytm dnia” w Letniej Szkole Światła   | `content/offers/plener.mdx`                        | 3        | potwierdzenie z EJK albo usunięcie sekcji         | ⬜  |
| Tytuł wykładu inauguracyjnego          | `content/lectures/2026-2027.json`                  | 4        | program od sekretariatu (pobrany z WP `/wyklady/tematy/`) | ✅  |
| Wymiary ikon `[z podpisu WP]` (`size`) — 5 prac bez `size` (`do-uzupelnienia-tytul-ikony`, `chrystus-milosierny`, `chrystus-eucharystyczny-na-krzyzu`, `jezus-chrystus`, `matka-boza-pompejanska`); pozostałe 47 — do weryfikacji | `content/icons.json` | 2, 5 (05b/5) | uzupełnienie i potwierdzenie przez EJK, pod-etap 7; do tego czasu UI pokazuje „Wymiary: do weryfikacji” (`pl.gallery.lightbox.sizeUnverified`), liczb nie wyświetla | ⬜  |
| Slug placeholder `do-uzupelnienia-tytul-ikony` (tytuł tymczasowy „Trójca Święta” — do weryfikacji ze zdjęciem) | `content/icons.json` | 5 (import WP) | poprawka tytułu i sluga przez EJK, pod-etap 7 | ⬜ |
| Jakość tytułów galerii — artefakty WP (CAPS, podwójne spacje, „Advokata" vs „Advocata", interpunkcja) | `content/icons.json` (`title`) | 5 (import WP) | korekta merytoryczna przez EJK, pod-etap 7 | ⬜ |
| Zestaw sample galerii — 52 prace z WP (23 EJK + 29 uczniów), oryginały w `public/media/sample/icons/`, kolejność ręczna | `content/icons.json`, `public/media/sample/icons/*` | 5 (05b/5, zastępuje 14 wpisów na 4 zdjęciach) | migracja WP (pod-etap 8) — dane już z WP; weryfikacja i korekta merytoryczna, nie ponowny import | ⬜ |
| 10 prac uczniów bez `authorName` (fallback „Praca z warsztatów Akademii” w lightboxie) | `content/icons.json` | 7 | uzupełnienie przez Akademię | ⬜ |
| Zgoda Akademii na publikację nazwisk uczniów w galerii (lista + lightbox) | `content/icons.json` (`authorName`) | 7 | potwierdzenie przez właściciela | ⬜ |
| Technika w lightboxie — domyślna „tempera jajowa na desce lipowej” (`pl.gallery.lightbox.techniqueDefault`) dla wszystkich prac; brak pola `technique` w `icons.json` | `src/i18n/formatLightboxMeta.ts`, `content/icons.json` | 5 (K-42) | przegląd i ewentualna korekta per praca lub zmiana domyślnej — EJK, pod-etap 7 | ⬜ |
| Wstęp do sekcji uczniów `[do uzupełnienia]`, etykieta „Autorzy prac:” | `src/i18n/pl.ts` (`gallery.sections`) | 5 (05b/3, 05b/5) | tekst od Akademii | ⬜ |
| Zajawka „Ikony na zamówienie” bez zdjęcia (K-46) — do sesji zdjęciowej | `src/components/gallery/GalleryOrderTeaser.tsx` | 5 (Kawałek 1), zmiana w 05b/5 | zdjęcie z sesji zdjęciowej | ⬜ |
| Czas realizacji ikony na zamówienie    | `content/offers/zamowienie.mdx` (`facts.leadTime`) | 3        | potwierdzenie z EJK                               | ⬜  |
| Liczba sezonów (16 łącznie)            | `content/lectures/archive.json`                    | 4        | potwierdzone: bieżący 2026/2027 = szesnasty       | ✅  |
| Zdjęcia z makiet                       | `public/media/sample/`                             | 2        | oryginały z `/wp-content/uploads/` lub nowa sesja | ⬜  |
| Sezony archiwum `sample` (2–3)         | `content/lectures/sample-*.json`                   | 4        | 16 sezonów z migracji (15 archiwalnych + bieżący) | ✅  |
| Wykładowcy — bio i zdjęcia z WP | `content/lecturers.json`, `public/media/lecturers/` | 4     | weryfikacja / migracja WP (pod-etap 8)            | ✅  |
| „Najbliższe” na stronie głównej — 2/3 wpisy zastąpione realną treścią z brief §8 (nabór 2026/2027, pierwszy wykład 6.10.2026); trzeci wpis („Wystawa stała”) pozostaje `[przykład]` — niepotwierdzone w brief §8 | `content/settings.json` (`upcoming`) | 1, uzupełnione w 2 | potwierdzenie z Akademią, czy taka wystawa istnieje | ⬜ |
| „Wybrane ikony” na stronie głównej i „Przykłady realizacji” w `/ikony/na-zamowienie` — 4 prace z galerii (Krzew Gorejący, Pantokrator, Archanioł Michał, Trójca Święta) | `FEATURED_ICON_SLUGS` w `src/content/icons.ts`, `exampleSlugs` w `content/offers/zamowienie.mdx` | 2, zmiana w 05b/5 | wybór redakcyjny EJK z prac galerii | ⬜ |

---

## 6. Dziennik

| Data       | Wpis                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-11 | v0.1 — utworzenie planu; kolejność: migracja WP przeniesiona na koniec (pod-etap 8), strony budowane na treściach z makiet.                                           |
| 2026-09-11 | v0.2 — decyzje K-10 (nabór na starej stronie), K-11 (angielski w kodzie), K-12 (commity ręczne). Załącznik C zastąpiony finalnym `CLAUDE.md` w repo. |
| 2026-09-12 | Pod-etap 1 zamknięty (4/4 kawałki, OK użytkownika). K-02 rozstrzygnięte. Sample „Najbliższe” dodane do §5. **Gap:** kopia `design/assets/{icons,photos}` → `public/media/sample/` z decyzji planistycznej pod-etapu 1 nie trafiła do żadnego kawałka — nie wykonana; użytkownik zdecydował odłożyć do pod-etapu 2 (zdjęcia i tak potrzebne dopiero tam). |
| 2026-09-12 | Sesja planistyczna pod-etapu 2 zakończona, plan zatwierdzony (`docs/plans/02-homepage.md`). W trakcie sesji zweryfikowano opis pod-etapu bezpośrednio w pliku makiety — dwie rozbieżności wobec pierwotnego opisu: K-13 (brak MapBlock/kontaktu na stronie głównej w makiecie) i K-14 (Testimonial i „Prowadząca” to w makiecie jedna sekcja, nie dwie; dodatkowo świadomie uproszczona — bez portretu na żadnym breakpoincie). K-15: konwencja zdarzeń analitycznych odłożona w całości do pod-etapu 7. |
| 2026-09-12 | Pod-etap 2, Kawałek 1 zrobiony (czeka na OK): Hero + Najbliższe + trzy filary. Przy okazji naprawiony pre-istniejący błąd w `Button.tsx` (wariant `secondary` renderował się bez obrysu) i domapowane tokeny `leading-*` na klasy Tailwind (`Footer.tsx` z pod-etapu 1 już ich używał, ale bez mapowania renderowały się z domyślnymi wartościami Tailwind). Szczegóły odstępstw: `docs/plans/02-homepage.md` §„Odstępstwa”. |
| 2026-09-12 | Pod-etap 2, Kawałki 2–3 zrobione (czekają na OK). Kawałek 2: Testimonial + Wybrane ikony + `content/icons.json`. Kawałek 3: pełny audyt klawiatury i Lighthouse — znaleziony i naprawiony realny błąd dostępności (`heading-order` w `Pillars.tsx`, brak `<h2>` przed `<h3>`), Lighthouse accessibility 0.98→1.0 (mobile i desktop). Powstał `docs/design-mockup-guide.md` po dwóch złych zgadnięciach przy odczycie `.dc.html` (zły folder obrazu, nierozwiązany placeholder rozmiaru) — referencja dodana do `CLAUDE.md`. Szczegóły: `docs/plans/02-homepage.md`. |
| 2026-09-12 | **Pod-etap 2 zamknięty** (OK użytkownika). DoD spełnione w całości (Lighthouse a11y 100/100 mobile+desktop). Otwarta uwaga do sprawdzenia przed wdrożeniem: klawisze Enter/Space na hamburgerze mobilnym (`HeaderMobileMenu.tsx`, kod z pod-etapu 1) nie zadziałały w automatycznym teście klawiatury tej sesji — podejrzenie ograniczenia narzędzia testowego, nie potwierdzony błąd; wymaga sprawdzenia w realnej przeglądarce/na telefonie. |
| 2026-09-13 | Synchronizacja dokumentacji po audycie planów 01/02: `01-skeleton.md` — status `zamknięty`, usunięcie kopii mediów z zakresu pod-etapu 1 (zawsze był to zakres 02); hamburger Enter/Space potwierdzony w przeglądarce. `plan-claude-code.md` — K-16 w §4, §3 pod-etapu 2 bez błędnego „60% hero”. `brief-claude-code.md` §4 — `linkLabel` w `upcoming`. |
| 2026-09-17 | Sesja planistyczna pod-etapu 3 zakończona, plan zatwierdzony (`docs/plans/03-oferta.md`). K-03 rozstrzygnięte: `@next/mdx`, `SemesterProgram` + frontmatter, FactsBox UI w `pl.ts`. |
| 2026-09-17 | **Pod-etap 3 zamknięty** (3/3 kawałki + cleanup, merge PR #3). DoD spełnione: `FactsBox` (open/closed), 4× `content/offers/*.mdx`, tematy `mailto:` z brief §7, `StepList`, hub `/warsztaty`, trasy kurs/plener/zamówienie; `wyklady.mdx` pod szablon (trasa `/wyklady` w pod-etapie 4). Build/lint OK. |
| 2026-09-17 | Sesja planistyczna pod-etapu 4 zakończona, plan zatwierdzony (`docs/plans/04-wyklady.md`). K-17…K-22: JSON-LD dane tu / emisja w 7; osobny `LecturesHubPage`; wykładowcy layout WP; archiwum hub 3 sezony (najnowszy rozwinięty); join `lecturerSlugs`; pełny pakiet danych w osobnej sesji przed Kawałkiem 1. |
| 2026-09-18 | **Pod-etap 4 zamknięty** (4/4 kawałki + ewaluacja merytoryczna). DoD spełnione: `/wyklady`, `/wyklady/archiwum`, `/wyklady/wykladowcy`; `LectureList`, `SeasonAccordion`, `LecturerCard`; warstwa `lectures.ts` / `lecturers.ts`; dane sample + `lecturer-directory.json`. Korekty po ewaluacji: K-20 → lead + link (bez akordeonu na hubie); `#zapisy`; `enrollmentDeadline` jako tekst; dokumentacja typów i K-21. Build/lint OK. |
| 2026-09-19 | Pod-etap 4b — K-33 hero: **opcja A** (zostaje `min(920px, 76vh)` i siatka md+; kafle „Najbliższe" nad foldem przy 1920×917 nie są wymagane). Rejestr §4: K-33. Szczegóły i pomiary: `docs/plans/04b-review-fixes.md` K-33 pkt 1, załącznik. |
| 2026-09-19 | **Pod-etap 4b zamknięty** (8/8 kawałków zamykających, OK użytkownika). DoD spełnione; Lighthouse a11y 100/100 na 4 trasach; rejestr K-23…K-35 w §4; brief §3 (SectionNav „Przegląd") + K-26 (Garamond min. 16,5 px); `/pracownia` zaślepka; D-1: brak CTA po scrollu (K-32/K-37). Gałąź: `feat/04b-review-fixes`. |
| 2026-09-19 | Sesja planistyczna pod-etapu 5 zakończona, plan zatwierdzony (`docs/plans/05-galeria.md`). K-04, K-05, K-38, K-39; D-02 → wszyscy autorzy; filtry query string; lightbox bez opisu i bez `[slug]`; paginacja odłożona; tagi dynamiczne z `icons.json`; sample tylko 4 zdjęcia (bez `chrystus`/`deesis`). |
| 2026-09-20 | Galeria `/ikony`: K-40 **B** (wyrównane rzędy) jako jedyny układ; usunięto półkę (A), `GalleryLayoutContext`, `GalleryLayoutToggle` i stringi `layoutToggle`. Rejestr §4: K-40. Szczegóły: `docs/plans/05b-review-fixes.md` K-40. |
| 2026-09-20 | **Pod-etap 5 zamknięty** (05: 4/4 + 05b: 6/6, OK użytkownika). DoD spełnione: `/ikony` z filtrami tematu, sekcjami EJK → uczniowie, siatką wyrównanych rzędów, lightboxem desktop/mobile; 52 prace sample z WP; rejestr K-38…K-47 w §4. Formalny Lighthouse a11y i test iOS Safari — pod-etap 7. Gałąź: `feat/05-gallery`. |

---

## Załącznik A — szablon pliku planu pod-etapu (`docs/plans/0N-nazwa.md`)

```md
# Plan 0N — [nazwa pod-etapu]

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

## Dane sample dodawane w tym pod-etapie

[lista → do przepisania do docs/plan-claude-code.md §5]

## Kryteria ukończenia pod-etapu

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
Zaczynamy pod-etap 0N — [nazwa] z docs/plan-claude-code.md. Przeczytaj CLAUDE.md, docs/brief-claude-code.md, design/README oraz makiety: [lista]. Nie pisz kodu.
Zadanie tej sesji: przygotować docs/plans/0N-nazwa.md według szablonu z załącznika A w docs/plan-claude-code.md.
Zacznij od pytań z sekcji „Pytania na sesję planistyczną” dla tego pod-etapu i od własnych wątpliwości — zadawaj je po jednym, czekaj na odpowiedź. Zaproponuj podział na 2–5 kawałków; każdy kawałek musi dać się zbudować i obejrzeć osobno. Wypisz, jakie dane sample dodasz i jak je oznaczysz.
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

- Praca idzie pod-etapami; każdy ma plan w docs/plans/0N-nazwa.md. Bez zatwierdzonego planu nie piszesz kodu w danym pod-etapie.
- Implementujesz jeden kawałek z planu naraz. Po każdym kawałku zatrzymujesz się i składasz meldunek:
  ## Checkpoint N/M — [nazwa]
  Zrobione: / Odstępstwa od planu lub makiety: / Do decyzji: / Następny krok: / Build/lint: / Czekam na OK.
- Kolejny kawałek zaczynasz dopiero po „OK” użytkownika. „OK z uwagami” = najpierw uwagi, potem kawałek.
- Jeśli plan okazuje się błędny w trakcie — przerywasz, meldujesz, proponujesz korektę planu. Nie improwizujesz poza planem.
- Treści redakcyjne wyłącznie w content/ przez warstwę src/content/\*; nigdy w JSX. Dane przykładowe oznaczasz `sample` i dopisujesz do docs/plan-claude-code.md §5.
- Aktualizujesz sekcję „Postęp” w pliku planu po każdym checkpoincie.
```
