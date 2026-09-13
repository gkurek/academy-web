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
| 3   | Strony ofertowe                                | `docs/plans/03-oferta.md`        | ⬜                   | —          |
| 4   | Wykłady                                        | `docs/plans/04-wyklady.md`       | ⬜                   | —          |
| 5   | Galeria ikon                                   | `docs/plans/05-galeria.md`       | ⬜                   | —          |
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

**Zakres:** szablon `Offer` (breadcrumb, `SectionNav`, H1, lead, `FactsBox` po prawej / na mobile pod leadem, body MDX, „Jak się zapisać”, `Testimonial`); `FactsBox` zasilany z `OfferFacts` ze stanami `enrollmentOpen: true/false` i różnymi komunikatami per `kind`; `mailto:` z dokładnymi tematami z briefu §7 i `tel:+48601734705`; hub `/warsztaty` z `OfferCard`; strony: `/warsztaty/kurs-roczny-i-trzyletni` (program 6 semestrów jako sekwencja), `/warsztaty/letnia-szkola-swiatla` (stan zamknięty domyślnie, „Rytm dnia” tylko jako `sample`), `/ikony/na-zamowienie` (`StepList` 5 kroków, „Przykłady realizacji”, nota o gotowych ikonach). Wariant `wyklady` szablonu przygotować, ale strona `/wyklady` powstaje w pod-etapie 4.

**DoD:**

- [ ] `FactsBox` renderuje oba stany z jednego komponentu, sterowane wyłącznie danymi;
- [ ] tematy `mailto:` identyczne ze stringami z briefu §7 (test: kliknięcie na telefonie otwiera klienta z tematem);
- [ ] cztery `content/offers/*.mdx` z `facts` zgodnymi z `OfferFacts`; wartości niepotwierdzone (czas realizacji zamówień) jako puste pola, nie zmyślone;
- [ ] `StepList` używa numeracji, reszta strony nie.

**Proponowane kawałki:** (1) `FactsBox` + szablon `Offer` + hub `/warsztaty`; (2) kurs + plener; (3) `/ikony/na-zamowienie` + `StepList`.

**Pytania:** MDX — jaki renderer i jakie komponenty dostępne w body; jak reprezentować program 6 semestrów (MDX z komponentem czy JSON w frontmatter); logika komunikatów `FactsBox` dla stanu zamkniętego — tabela `kind × stan` w `pl.ts`.

### Pod-etap 4 — Wykłady

**Zakres:** `/wyklady` jako hub + bieżący sezon (`LectureList`: data, tytuł, prowadzący) + „Jak się zapisać” (`FactsBox` w wariancie `wyklady`) + zwinięte archiwum z linkiem „Pełne archiwum”; `/wyklady/archiwum` z `SeasonAccordion` (15 sezonów, jeden rozwinięty); `/wyklady/wykladowcy` z `Lecturer`. Dane: `content/lectures/<season>.json` — na razie 2–3 sezony `sample` w docelowym schemacie, żeby akordeon miał co pokazywać.

**DoD:**

- [ ] `SeasonAccordion` dostępny z klawiatury (Enter/Space, fokus, `aria-expanded`), działa bez JS w sensownym stopniu (treść w DOM);
- [ ] miejsca oznaczone `[do weryfikacji: liczba sezonów]` zaznaczone w treści `sample`, nie w kodzie;
- [ ] terminy 2026/2027 z briefu §8 wpisane jako prawdziwe dane bieżącego sezonu (tytuły wykładów puste/placeholder).

**Proponowane kawałki:** (1) `LectureList` + hub; (2) `SeasonAccordion` + archiwum; (3) wykładowcy.

**Pytania:** czy `Lecture.date` w bieżącym sezonie powinna generować `Event` JSON-LD już tu, czy dopiero w pod-etapie 7 (rekomendacja: dane gotowe tu, emisja w 7); jak łączyć `lecturerSlugs` z brakującymi wykładowcami w archiwum (nazwisko bez strony).

### Pod-etap 5 — Galeria ikon

**Zakres:** `/ikony` z `IconGrid`, filtry autor (Elżbieta / uczniowie) i temat (z `tags`), `Lightbox` desktop i mobile (strzałki ≥ 48 px, zamknięcie, klawiatura, blokada scrolla, focus trap); podpisy: tytuł, autor, wymiary, rok; zdanie o zamawianiu z linkiem do `/ikony/na-zamowienie`; zajawka „Ikony na zamówienie” na dole. `/ikony/[slug]` — decyzja w sesji planistycznej (brief: opcjonalnie w v1). **`content/icons.json`** — uzupełnienie do pełnego zestawu `sample` galerii (ten sam plik co w pod-etapie 2; wymiary z podpisów nadal niezweryfikowane).

**DoD:**

- [ ] filtry działają jako query string lub stan — ustalone w planie; bez przeładowania strony;
- [ ] `Lightbox`: Esc zamyka, strzałki klawiatury, fokus wraca do klikniętego kafla, `prefers-reduced-motion` respektowany;
- [ ] wymiary z podpisów oznaczone jako niezweryfikowane w danych `sample`.

**Proponowane kawałki:** (1) `IconGrid` + filtry; (2) `Lightbox` desktop; (3) `Lightbox` mobile + `[slug]` jeśli w zakresie.

**Pytania:** domyślny filtr (decyzja D-02 z briefu v2 — jeśli nadal otwarta, wpisać jako założenie do zmiany w `SiteSettings`); jakość obrazów w lightboxie vs. wydajność (rozmiary `sizes` dla `next/image`); czy `Lightbox` to `<dialog>` natywny.

### Pod-etap 6 — Strony pozostałe

**Zakres:** `/kontakt` (adres, osadzona mapa, dwa maile z opisem, telefon, zakrystia, „Akademia w sieci”); `/o-akademii` i `/pracownia` na szablonie strony tekstowej z `TocSidebar`; `/aktualnosci` z `NewsCard` i paginacją + `/aktualnosci/[slug]`; `/wydarzenia` z `EventCard`, kategorie w `SectionNav` (linki z query string `?kategoria=`, wartości jak `Event.category`: `wystawa`, `poswiecenie`, `oprowadzanie`, `wyjazd`); `/publikacje` na szablonie tekstowym z zakładkami; `/polityka-prywatnosci`; strona 404 w stylu projektu.

**DoD:**

- [ ] szablon strony tekstowej użyty na co najmniej trzech trasach bez rozgałęzień w kodzie;
- [ ] paginacja aktualności działa z 60+ wpisami (wygenerować dane `sample` skryptem, nie ręcznie);
- [ ] wszystkie trasy z briefu §3 mają realną treść lub `sample` — koniec zaślepek.

**Proponowane kawałki:** (1) szablon tekstowy + `TocSidebar` + O Akademii + polityka + 404; (2) kontakt + wydarzenia; (3) aktualności lista + wpis; (4) publikacje.

**Pytania:** jak `TocSidebar` zbiera nagłówki z MDX (plugin `rehype` czy własny parser); paginacja — trasa `/aktualnosci/strona/2` czy query string (konsekwencje SEO).

### Pod-etap 7 — Wykończenie: SEO, dane strukturalne, analityka

**Zakres:** `generateMetadata` + Open Graph dla każdej trasy (obraz OG domyślny + per strona); `sitemap.ts`, `robots.ts`; JSON-LD: `Organization` (z `parentOrganization`), `Person` (EJK, `sameAs`), `Event` dla bieżącego sezonu, `Course` dla kursu i pleneru; Plausible lub Umami bez ciasteczek ze zdarzeniami na CTA zapisów, `mailto:`, `tel:`; przegląd Lighthouse (dostępność ≥ 95, wydajność ≥ 90 mobile) i naprawa blokad; przegląd kontrastu i fokusu na wszystkich stanach z ekranu „Komponenty”.

**DoD:**

- [ ] walidator schema.org bez błędów dla czterech typów;
- [ ] podgląd linku (OG) sprawdzony narzędziem debugującym dla strony głównej i jednej ofertowej;
- [ ] zdarzenia analityczne widoczne w panelu narzędzia w środowisku testowym;
- [ ] raport Lighthouse dla 5 tras (główna, kurs, wykłady, galeria, aktualności) w `docs/lighthouse/`.

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
| K-03 | Renderer MDX i zestaw komponentów w body           | 3        | —                                                                                           | —          |
| K-04 | `/ikony/[slug]` w v1                               | 5        | —                                                                                           | —          |
| K-05 | Filtry galerii: query string vs stan               | 5        | —                                                                                           | —          |
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

Decyzje spoza kodu (D-01…D-05 z briefu v2) pozostają w dokumentach ekosystemu; tu wpisujemy tylko ich skutki dla implementacji.

---

## 5. Treści makietowe do wymiany przed wdrożeniem

Lista rośnie w każdym pod-etapie. Odhaczana w pod-etapie 8.

| Treść                                  | Gdzie (plik `sample`)                              | Dodano w | Zastąpić czym                                     | ✔   |
| -------------------------------------- | -------------------------------------------------- | -------- | ------------------------------------------------- | --- |
| Cytaty uczestników (Adam, Hania, Iza…) | `content/offers/*`, `content/testimonials.json`    | 3        | cytaty z obecnej strony, dosłownie                | ⬜  |
| Wpisy aktualności `[przykład]`         | `content/news/sample-*.mdx`                        | 6        | migracja WP                                       | ⬜  |
| „Rytm dnia” w Letniej Szkole Światła   | `content/offers/plener.mdx`                        | 3        | potwierdzenie z EJK albo usunięcie sekcji         | ⬜  |
| Tytuł wykładu inauguracyjnego          | `content/lectures/2026-2027.json`                  | 4        | program od sekretariatu                           | ⬜  |
| Wymiary ikon `[z podpisu WP]`          | `content/icons.json`                               | 2 (plik + 3–4 wpisy na stronę główną), 5 (pełny zestaw sample galerii) | migracja WP (pod-etap 8)                         | ⬜  |
| Czas realizacji ikony na zamówienie    | `content/offers/zamowienie.mdx` (`facts.leadTime`) | 3        | potwierdzenie z EJK                               | ⬜  |
| Liczba sezonów `[do weryfikacji]`      | `content/lectures/*`, `pl.ts`                      | 4        | źródło: archiwum WP                               | ⬜  |
| Zdjęcia z makiet                       | `public/media/sample/`                             | 2        | oryginały z `/wp-content/uploads/` lub nowa sesja | ⬜  |
| Sezony archiwum `sample` (2–3)         | `content/lectures/sample-*.json`                   | 4        | 15 sezonów z migracji                             | ⬜  |
| „Najbliższe” na stronie głównej — 2/3 wpisy zastąpione realną treścią z brief §8 (nabór 2026/2027, pierwszy wykład 6.10.2026); trzeci wpis („Wystawa stała”) pozostaje `[przykład]` — niepotwierdzone w brief §8 | `content/settings.json` (`upcoming`) | 1, uzupełnione w 2 | potwierdzenie z Akademią, czy taka wystawa istnieje | ⬜ |
| Zdjęcia „Wybrane ikony” — 4 wpisy `sample` na stronę główną | `content/icons.json` (Kawałek 2) | 2 | migracja WP | ⬜ |

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
