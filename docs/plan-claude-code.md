# Plan pracy z Claude Code — Akademia Ikony

> **Wersja:** 0.7 · **Data:** 2026-09-26
> **Status:** żywy dokument. Jedyne miejsce, w którym śledzony jest postęp fazy implementacji. Aktualizowany po każdym checkpoincie.
> **Zakres:** etapy **9, 10, 11**. Etapy 1–8b są zamknięte — ich opisy, pełny rejestr decyzji, odhaczone pozycje treści i dziennik do 2026-09-26: `docs/archive/plan-claude-code-historia.md`.
> **Dokumenty powiązane:** `brief-claude-code.md` (wymagania techniczne, model treści, fakty stałe), `design/README` (handoff z Claude Design), `docs/archive/README.md` (co i dlaczego wylądowało w archiwum).
> **Miejsce w repo:** `docs/plan-claude-code.md`. Plany etapów: `docs/plans/0N-nazwa.md`.

Stan wejściowy etapu 9: wszystkie trasy z briefu §3 zbudowane na treściach `sample`, etap 8b zamknięty 2026-09-26. Do zrobienia: migracja treści z WordPressa (9), wykończenie na prawdziwych danych (10), wdrożenie (11).

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
| 1   | Szkielet, design system, warstwa treści        | `docs/archive/plans/01-skeleton.md`      | ✅ zamknięty         | 2026-09-12 |
| 2   | Strona główna                                  | `docs/archive/plans/02-homepage.md` | ✅ zamknięty         | 2026-09-12 |
| 3   | Strony ofertowe                                | `docs/archive/plans/03-oferta.md`        | ✅ zamknięty         | 2026-09-17 |
| 4   | Wykłady                                        | `docs/archive/plans/04-wyklady.md`       | ✅ zamknięty         | 2026-09-18 |
| 4b  | Korekty po przeglądzie stagingu               | `docs/archive/plans/04b-review-fixes.md` | ✅ zamknięty         | 2026-09-19 |
| 5   | Galeria ikon (+ korekty 05b)                   | `docs/archive/plans/05-galeria.md`, `docs/archive/plans/05b-review-fixes.md` | ✅ zamknięty         | 2026-09-20 |
| 6   | Strony o akademii i pracownia                  | `docs/archive/plans/06-o-akademii.md`    | ✅ zamknięty         | 2026-09-21 |
| 7   | Aktualności (+ korekty)                        | `docs/archive/plans/07-aktualnosci.md`, `docs/archive/plans/07b-review-fixes.md` | ✅ zamknięty         | 2026-09-22 |
| 8   | Strony pozostałe                               | `docs/archive/plans/08-pozostale.md`     | ✅ zamknięty         | 2026-09-22 |
| 8b  | Korekty po przeglądzie etapu 08                | `docs/archive/plans/08b-review-fixes.md` | ✅ zamknięty         | 2026-09-26 |
| 9   | Migracja treści z WordPressa                   | `docs/plans/09-migracja.md`      | ⬜                   | —          |
| 10  | Wykończenie: ewaluacja serwisu, poprawki po prezentacji, SEO, optymalizacja | `docs/plans/10-wykonczenie.md`   | ⬜                   | —          |
| 11  | Wdrożenie                                      | `docs/plans/11-wdrozenie.md`     | ⬜                   | —          |

Kolejność jest wiążąca dla 1 → 2 → 3 (szablon ofertowy i `FactsBox` są potrzebne dalej). Etapy 4, 5, 6–8 można przestawiać. **Etap 8 zamknięty 2026-09-26** (implementacja 08 + korekty 08b). 9 (migracja) wymaga wszystkich stron. 10 (ewaluacja, poprawki i wykończenie na prawdziwych danych) wymaga 9. 11 po 10.

---
---

## 3. Opis etapów

Dla każdego: cel, zakres, kryteria ukończenia (DoD), proponowany podział na kawałki (do zweryfikowania w sesji planistycznej) i pytania, które sesja planistyczna musi rozstrzygnąć.
### Etap 9 — Migracja treści z WordPressa

**Cel:** zastąpić wszystkie dane `sample` prawdziwymi, bez dotykania komponentów.

**Zakres:** sprawdzenie REST API vs WXR; skrypt `scripts/migrate-wp.ts` wg briefu §5 (pages/posts → MDX, oryginały obrazów z `href` nie z `src`, wykłady → `LectureSeason`, galeria → `IconWork`, `docs/redirects.json`); raport `scripts/migrate-report.md`; ręczna korekta (literówki, nazwiska, podpisy ikon, daty 2025 → archiwum lub aktualizacja); usunięcie wszystkich plików i wpisów `sample`; weryfikacja listy z §5; 301 w `next.config.ts`.

**Zasady migracji dawnego działu „Wydarzenia” (K-50…K-58, 2026-09-21 — patrz `docs/archive/plan-aktualizacji-dokumentow-wydarzenia.md` §5 dla pełnego uzasadnienia):**

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

**Pytania:** **K-69 (otwarte)** — szczegóły `docs/archive/plans/07b-review-fixes.md`. Plausible czy Umami (hosting, koszt, self-hosting). Czy `Event` JSON-LD wymaga lokalizacji/oferty ceny. Termin i forma prezentacji z klientem (staging, lista tras, kto zbiera uwagi).

### Etap 11 — Wdrożenie

**Zakres:** hosting, zmienne środowiskowe, domena i certyfikat, test 301 ze starych URL-i (w tym długi slug „O nas”), test `mailto:` i `tel:` na telefonie (iOS i Android), zgłoszenie sitemap w Google Search Console, monitoring (uptime, błędy), procedura publikacji zmian treści do czasu panelu CMS.

**DoD:**

- [ ] lista starych URL-i z briefu §5 przetestowana skryptem (status + cel);
- [ ] GSC potwierdza sitemap;
- [ ] `docs/runbook.md`: jak wdrożyć, jak zmienić treść, gdzie są logi.

**Pytania:** wybór hostingu; kiedy przełączać DNS (poza sezonem zapisów — termin 24.09.2026 jest blisko, patrz §4).
---

## 4. Rejestr decyzji

Tu są **wyłącznie decyzje żywe dla etapów 9–11** — 53 z 118 wierszy. Kryterium przyjęcia:
decyzja jest otwarta, jej kolumna „Etap" wskazuje 9/10/11, powołuje się na nią §3 tego
dokumentu, §5, `CLAUDE.md` albo `brief-claude-code.md`, **albo** powołuje się na nią inny
wiersz z tej tabeli (domknięcie tranzytywne — żaden wiersz tutaj nie odsyła do numeru,
którego tu nie ma).

**Pozostałe 65 wierszy (zamknięte w etapach 1–8b): `docs/archive/plan-claude-code-historia.md` §4H.**
Podział jest rozłączny — numeracja `K-xx` jest globalna, więc każdy numer cytowany gdziekolwiek
w repo leży w dokładnie jednym z dwóch miejsc: tutaj, jeśli ma skutki dla etapów 9–11, inaczej
w archiwum. Nie ma wiersza powtórzonego w obu plikach.

| #    | Decyzja                                            | Etap | Wybór                                                                                       | Data       |
| ---- | -------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- | ---------- |
| K-05 | Filtry galerii: query string vs stan               | 5        | **Query string** (`?temat=<slug-tagu>`), bez przeładowania; domyślnie wszystkie tematy. **`?autor=` wycofane w 05b (K-43)** — podział EJK / uczniowie jest sztywny (sekcje, K-41) — patrz `docs/archive/plans/05-galeria.md`, `docs/archive/plans/05b-review-fixes.md` | 2026-09-19 |
| K-06 | Paginacja aktualności: trasa vs query              | 7, 7b    | **Bez paginacji** — wszystkie lata na jednej stronie; `YearNav` jako kotwice scroll; lata ≤ 2018 zwinięte za przyciskiem „Pokaż archiwum” (K-66), treść w DOM; bez klasycznej paginacji — patrz `docs/archive/plans/07-aktualnosci.md` D-07-01, `docs/archive/plans/07b-review-fixes.md` K-66 | 2026-09-21 |
| K-07 | Plausible vs Umami                                 | 10       | —                                                                                           | —          |
| K-08 | Domena kanoniczna (www / bez)                      | 9        | —                                                                                           | —          |
| K-09 | Hosting                                            | 11       | —                                                                                           | —          |
| K-10 | Termin przełączenia DNS względem naboru 24.09.2026 | 11       | **Nabór 2026/2027 obsługuje stara strona**; wdrożenie bez presji terminu                    | 2026-09-11 |
| K-11 | Język komentarzy, commitów i PR                    | —        | **Angielski** (treść dla użytkownika po polsku)                                             | 2026-09-11 |
| K-12 | Kto commituje                                      | —        | **Wyłącznie właściciel repo**, po „OK” dla kawałka; Claude Code nie używa `git commit/push` | 2026-09-11 |
| K-15 | Konwencja zdarzeń analitycznych (`data-event` itp.) | 2        | **Nie dodajemy w etapie 2** — konwencja i podłączenie w całości w etapie 10 | 2026-09-12 |
| K-16 | `linkLabel` w `SiteSettings.upcoming`            | 2        | **Dodane pole** — osobny `TextLink` per kafel „Najbliższe” (np. „Jak się zapisać”), zgodnie z makietą; `types.ts`, `content/settings.json`, `UpcomingHighlights.tsx` | 2026-09-12 |
| K-17 | JSON-LD `Event` dla wykładów                     | 4        | **Dane w etapie 4**, emisja `<script type="application/ld+json">` w etapie 10 — patrz `docs/archive/plans/04-wyklady.md` | 2026-09-17 |
| K-23 | Pierwsza pozycja `SectionNav` (04b)              | 4b       | **Hub nazwany treścią, nie sekcją** — Warsztaty: „Przegląd"; Wykłady bez zmian; Ikony: „Galeria"; mobile: zawijanie, tap ≥ 44 px | 2026-09-19 |
| K-24 | Układ stopki (04b)                                 | 4b       | **Wariant B** — 4 kolumny desktop, huby jako linki, `/pracownia` + brakujące pozycje, etykiety kontaktu Plex tertiary, tap 44 px; polish układu → etap 10 (K-36) | 2026-09-19 |
| K-32 | Sticky `FactsBox` + `ClosingCta` (04b)             | 4b       | **Odrzucono** — layout bez zmian. **Świadoma decyzja D-1:** brak CTA po scrollu; zapis tylko w `FactsBox` w nagłówku; powrót w etapie 10 (K-37) | 2026-09-19 |
| K-35 | CTA „Zapisy" w nagłowku desktop (04b)              | 4b       | **Poza 04b** — wrócić w etapie 10 z danymi analityki | 2026-09-19 |
| K-36 | Design stopki — dopracowanie układu                | 10       | **W etapie 10** — po migracji i przeglądzie Lighthouse; w 04b wdrożono wariant B funkcjonalny (huby jako linki, mapa kompletna, tap targety 44 px, mobile 2 kolumny); polish: rozkład kolumn desktop/mobile, social, pasek dolny — patrz `docs/archive/plans/04b-review-fixes.md` K-24 | 2026-09-19 |
| K-37 | Sticky `FactsBox` na stronach ofertowych           | 10       | **Ponowne rozważenie w etapie 10** — odrzucone w 04b (K-32) po prototypie; warunek `min-height: 880px`, dwukolumnowy layout przez całą stronę; opcjonalnie `ClosingCta` — patrz `docs/archive/plans/04b-review-fixes.md` K-32 | 2026-09-19 |
| K-38 | `Lightbox` — implementacja modalna                 | 5        | **Natywny `<dialog>` + `showModal()`**; fallback do własnego overlay tylko po negatywnym teście Safari/iOS (test fizyczny iOS — **etap 10**); patrz `docs/archive/plans/05-galeria.md` | 2026-09-19 |
| K-39 | Obrazy w lightboxie vs. siatka                     | 5        | **Jeden `src`**, większe `sizes` w lightboxie (rozmiar obrazu zmieniony w K-45); weryfikacja w etapie 10, ewentualne `imageLarge` w `IconWork` — patrz `docs/archive/plans/05-galeria.md` | 2026-09-19 |
| K-41 | Kolejność: EJK → uczniowie (05b) | 5b | **Dwie sztywne sekcje** z H2 (bez licznika w nagłówku); kolejność w sekcji = kolejność w `icons.json`; sekcja pusta pod filtrem tematu znika razem z nagłówkiem. Doprecyzowuje D-02 | 2026-09-19 |
| K-42 | Podpisy i atrybucja autorów (05b) | 5b | **Trzy poziomy:** siatka — sam tytuł; sekcja uczniów — lista nazwisk generowana z danych (bez osobnego wstępu); lightbox — pełny autor lub „Praca z warsztatów Akademii”, wymiary („do weryfikacji”), technika (domyślna lub z danych). `authorName?` opcjonalne w `IconWork`; bez pola `year` w `IconWork` | 2026-09-20 |
| K-43 | Logika filtrów (05b) | 5b | **Jeden filtr — temat:** „Wszystkie”, wybór jednokrotny, `aria-current`, grupa z `aria-label`. **Filtr autora i `?autor=` wycofane** (parametr usuwany z URL). Taksonomia: Chrystus · Matka Boża · Aniołowie · Święci · Sceny i święta (stała lista, kolejność chipów z niej); walidacja przy buildzie (każda praca ≥ 1 tag, każdy temat ≥ 1 praca, tag spoza taksonomii); nieznany `?temat=` usuwany z URL | 2026-09-19 |
| K-45 | Lightbox — rozmiar obrazu i układ (05b; zmienia K-39) | 5b | Obraz o wysokości 80vh (desktop) / 60svh (mobile) i jawnej szerokości z proporcji; strzałki 48×48 przy krawędziach okna; licznik w kolumnie metadanych; mobile: sticky pasek Poprzednia / licznik / Następna + swipe (próg 50 px); układ desktopowy od `lg` (1024 px), nie `md`; „Zapytaj o podobną ikonę” tylko przy pracach EJK; klik w tło zamyka (tylko desktop); jedno drzewo, jeden `<Image>` | 2026-09-19 |
| K-46 | Zajawka „Ikony na zamówienie” (05b) | 5b | Zajawka **bez zdjęcia** do sesji zdjęciowej; CTA jako przycisk | 2026-09-19 |
| K-48 | `SectionNav` na `/o-akademii` i `/pracownia`       | 6        | **Dodajemy** — O Akademii · Pracownia, jak makieta 6a–6d; `SectionKey` + `sectionNav` w `navigation.ts`; brief §3 uzupełniony | 2026-09-20 |
| K-50 | Dział „Wydarzenia”                                  | 7, 8     | **Likwidujemy jako sekcję i pozycję menu.** Menu główne: O Akademii · Warsztaty · Wykłady · Ikony · Aktualności · Kontakt. Trasa `/wydarzenia` nie powstaje; stare adresy przekierowane (brief §5). Uzasadnienie: jedyna żywa treść działu to coroczna wystawa; reszta to archiwum 2013–2020, a kategorie „Poświęcenia/Oprowadzania/Wyjazdy” pokazywałyby 1–3 wpisy sprzed dekady | 2026-09-21 |
| K-51 | Wystawa „Ikona – korzenie i owoce wiary”            | 8        | **Własna strona wystaw w dziale Ikony** (2026-09-21: `/ikony/wystawa`, jedna strona edycji). **Zastąpione K-82…K-90 (08b):** `/ikony/wystawy`, trzy formy wystawy, `PermanentExhibition` + `annual.json`; nawigacja „Wystawy” | 2026-09-21 |
| K-52 | Aktualności jako jeden strumień                     | 7        | **Aktualności przejmują archiwum dawnych wydarzeń.** Każdy wpis ma `kind` wyświetlany jako etykieta typu. Bez filtrów kategorii w v1. Wpisy grupowane latami; paginacja — K-06 (rozstrzygnięte 2026-09-21). **Zastąpione przez K-70:** lista chronologiczna z paskiem lat | 2026-09-21 |
| K-53 | Model treści (`Event` → `News`/`ExhibitionEdition`) | 7, 8     | **Typ `Event` usunięty.** `News` dostaje `kind`, `dateEnd?`, `images?`, `poster?`. Wystawa KŚT: w 8 — `ExhibitionEdition`; **zastąpione 08b** — `PermanentExhibition` + `AnnualExhibition`, `News.venue?` — brief §4 | 2026-09-21 |
| K-54 | Edycja wystawy bez materiału                        | 8, 8b    | **Edycja bez zdjęć = jedna linijka** na liście poprzednich (rok, tytuł), bez pustej karty. W 08b: sekcja „Poprzednie wystawy” (K-97), bez kart z placeholderami | 2026-09-21 |
| K-55 | Poświęcenia ikon                                    | 9 (+ Publikacje) | **Tekst przechodzi do Publikacji jako artykuł** („Podpisanie i poświęcenie ikony”). EJK zgodziła się na przeniesienie i redakcję (2026-09-21); do poprawy: porównanie do chrztu i sakramentów. Układ Publikacji — osobna sesja (odłożone). Wzmianka na `/ikony/na-zamowienie` zależy od D-05 (otwarte). **Zastąpione przez K-77** (poświęcenie → Aktualności, nie Publikacje). Układ Publikacji — **zastąpione przez K-76** | 2026-09-21 |
| K-56 | Wyjazdy studyjne                                    | 6, 7     | **Nie są obecnie planowane, ale nie zostały zakończone.** Copy w czasie teraźniejszym zostaje (OA-62 bez zmian, decyzja EJK). Dawne wyjazdy → Aktualności `kind: 'wyjazd'`. Brak osobnej podstrony | 2026-09-21 |
| K-57 | Historia plenerów                                   | 8        | **Nowa sekcja „Gdzie byliśmy” na `/warsztaty/letnia-szkola-swiatla`**: lista miejsc dotychczasowych plenerów (Święta Lipka, Wesoła, Supraśl, Gruzja, Litwa; Gródek do potwierdzenia). Część „wyjazdów studyjnych” z WP to w rzeczywistości plenery | 2026-09-21 |
| K-58 | Kafel „Najbliższe” na stronie głównej               | 8, 8b    | Kafel 3 wyliczany z dat wystawy dorocznej (K-85): wernisaż przed nami lub wystawa w toku; link → `/ikony/wystawy`. Filar „Ikony”: drugie CTA „Galeria i wystawa” (B4) | 2026-09-21 |
| K-66 | Zwinięte archiwum aktualności (07b; rozstrzyga K-06)  | 7b       | Lata 2019+ zawsze widoczne; 2012–2018 zwinięte za „Pokaż archiwum…” (`NEWS_ARCHIVE_UNTIL_YEAR`); treść archiwum w DOM (`hidden` po hydratacji); `#rok` z archiwum rozwija i przewija; bez JS archiwum rozwinięte — patrz `docs/archive/plans/07b-review-fixes.md` | 2026-09-21 |
| K-67 | Porządki w danych `sample` aktualności (07b)          | 7b       | Tytuły (zdaniowy zapis, bez kropki końcowej), scalenie duplikatów, daty wydarzeń zamiast publikacji, wpisy KŚT oznaczone do etapu 8 (bez usuwania), `featured` na „Nabór na kurs…” — patrz `docs/archive/plans/07b-review-fixes.md` §„Do przeniesienia w etapie 8” | 2026-09-21 |
| K-69 | Funkcja strony Aktualności: zapowiedzi vs kronika     | 7, 10    | **Otwarte** — dwa kierunki (A: Aktualności = sprawy bieżące, archiwum jako osobna „Kronika"; B: jeden strumień jako kronika, „co teraz" na stronie głównej w „Najbliższe"); wraca w przeglądzie całości serwisu — patrz `docs/archive/plans/07b-review-fixes.md` K-69 | 2026-09-22 |
| K-70 | Grupowanie latami (07c)                               | 7c       | **Rezygnacja.** Jedna ciągła lista; sticky pasek lat + kotwica na pierwszej karcie roku; bez nagłówka sekcji listy — patrz `docs/archive/plans/07b-review-fixes.md` | 2026-09-22 |
| K-72 | Format dat na liście (07c)                            | 7c       | **Data wpisu z rokiem** na liście (`date` bez `dateEnd`); zakresy z dopełniaczem na stronie wpisu i w wyróżnionym — patrz `docs/archive/plans/07b-review-fixes.md` | 2026-09-22 |
| K-73 | Wyróżniony wpis — nagłówek i czas życia (07c)         | 7c       | Etykieta nad blokiem + opcjonalne `featuredUntil` (YYYY-MM-DD, tylko przy `featured: true`; po dacie wpis traci wyróżnienie przy buildzie) — patrz `docs/archive/plans/07b-review-fixes.md` | 2026-09-22 |
| K-76 | Publikacje: album + artykuły                          | 8, 9, 10 | `/publikacje` bez zakładek/`SectionNav`: sekcja albumu + lista artykułów; podstrona albumu i szablon artykułu z blokiem źródła; typy `Publication`/`Article`; walidacje build; blok metryczki; zakup `mailto:`; terminologia „album”; brak sekcji na home; JSON-LD `Book`/`Article`; makieta oczekiwana (`PU-*`) — patrz `docs/archive/plan-aktualizacji-dokumentow-publikacje.md` | 2026-09-22 |
| K-77 | Poświęcenie ikon → Aktualności                        | 7, 8, 9  | Wpis Aktualności `kind: 'plener'`, 6 zdjęć, redakcja EJK; OA-62 poz. 5 usunięta; `/poswiecenia-ikon/` → wpis; nie na `/pracownia` ani Publikacjach; D-05 bez zmian — patrz `docs/archive/plan-aktualizacji-dokumentow-publikacje.md` | 2026-09-22 |
| K-78 | Plakaty i multimedia                                  | 8, 9     | Brak stron plakatów/multimediów; plakaty → `News.poster` po weryfikacji EJK (K-98: bez `poster` w `AnnualExhibition`); film nie osadzany — patrz `docs/archive/plan-aktualizacji-dokumentow-publikacje.md` | 2026-09-22 |
| K-82 | Model wystawy — liczba bytów                          | 8b       | Trzy formy: `PermanentExhibition`, `AnnualExhibition[]`, wyjazdowe w Aktualnościach `kind: "wystawa"` — patrz `docs/archive/plans/08b-review-fixes.md` | 2026-09-26 |
| K-84 | Wystawa doroczna — pola                               | 8b       | `seasonSlug`, osobne `title`, domyślne `vernissage` / `dateEnd` | 2026-09-26 |
| K-85 | Stan wystawy dorocznej                                | 8b       | Wyliczany z dat; ISR `revalidate` na `/` i `/ikony/wystawy` | 2026-09-26 |
| K-87 | Wystawy wyjazdowe na stronie                          | 8b       | `#wyjazdowe`, `venue?` w `News`, wiersze + „Relacja” | 2026-09-26 |
| K-90 | Trasa i nawigacja wystaw                               | 8b       | `/ikony/wystawy`, H1 „Wystawy ikon”, etykieta „Wystawy” | 2026-09-26 |
| K-97 | Wiersz „Poprzednie wystawy”                           | 8b       | Tytuł jako link; „Zdjęcia”; mobile | 2026-09-26 |
| K-98 | Plakat w modelu wystawy                               | 8b       | Pole `poster` usunięte z `AnnualExhibition` | 2026-09-26 |
| K-103 | Wpisy KŚT w Aktualnościach                           | 8b       | Zostają; relacja doroczna ↔ `#wystawa-{rok}` | 2026-09-26 |
| K-115 | Polityka prywatności — struktura                      | 8b       | H2 = TOC; cookies bez Plausible/Umami; treść prawna — patrz **K-119** | 2026-09-26 |
| K-119 | Polityka prywatności — treść prawna (pytania K-115)   | 8b, 10   | **Zatwierdzenie treści** (`content/pages/polityka-prywatnosci.json`): administrator Fundacja IKONA DZIŚ (dane jak w pliku) — OK; `lastUpdated` **bez zmian** (`2026-01-04`); lead — OK. Zakres danych: imię, nazwisko, e-mail, telefon — wystarczający; **bez** dopisków (faktury, PESEL, marketing) i **bez** osobnej sekcji o zdjęciach. Podstawy art. 6 ust. 1 lit. a/b/f — zatwierdzone; okres „do wygaśnięcia roszczeń” — zostaje; lista odbiorców — kompletna; brak państw trzecich i profilowania — nadal prawda. Prawa osób — wystarczające; kontakt RODO: `akademiaikony@gmail.com`; **bez** IOD w polityce. Cookies (brak marketingu/analityki; Google Maps) — OK; analityka bez cookies — **aktualizacja w etapie 10**; brak innych osadzeń do opisania. **Może obowiązywać na produkcji**; formalne zatwierdzenie dokumentu: **EJK**. Odpowiedzi: właściciel repo, 2026-09-26. | 2026-09-26 |
| K-120 | Kto commituje w sesjach cloud (aneks do K-12)          | —        | **W Claude Code on the web commituje i pushuje Claude** na wskazaną gałąź roboczą, po „OK” właściciela na każdy kawałek — kontener jest ulotny, praca niescommitowana przepada. Merge do `main` nadal wyłącznie właściciel repo. **W sesjach lokalnych K-12 bez zmian** — Claude nie commituje. Gałąź dla zadań nieetapowych: `chore/krotki-opis`, komunikat `docs:` / `chore:` zamiast `0N/K:`. | 2026-09-26 |


Decyzje spoza kodu (D-01…D-06 z briefu v2) pozostają w dokumentach ekosystemu; tu wpisujemy tylko ich skutki dla implementacji. **D-02 (domyślny filtr galerii):** galeria pokazuje **obie sekcje, EJK pierwsza, sztywny podział** (K-41), bez filtra autora; pytanie o zakres prac EJK po starcie strony autorskiej zostaje otwarte — skutek w K-05 / K-41 / `docs/archive/plans/05b-review-fixes.md` (2026-09-19).

---

## 5. Treści makietowe do wymiany przed wdrożeniem

Lista robocza etapu 9 (migracja). Tu są **tylko pozycje otwarte** (`⬜`) — 34 z 48.
Pozycje odhaczone w etapach 1–8b: `docs/archive/plan-claude-code-historia.md` §5H.
Kto dodaje treść `sample`, dopisuje ją tutaj.

| Treść                                  | Gdzie (plik `sample`)                              | Dodano w | Zastąpić czym                                     | ✔   |
| -------------------------------------- | -------------------------------------------------- | -------- | ------------------------------------------------- | --- |
| Cytaty uczestników (Adam, Hania, Iza…) | `content/offers/*`, `content/testimonials.json`    | 3        | cytaty z obecnej strony, dosłownie                | ⬜  |
| „Rytm dnia” w Letniej Szkole Światła   | `content/offers/letnia-szkola-swiatla.mdx`          | 3        | potwierdzenie z EJK albo usunięcie sekcji         | ⬜  |
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
| Zdjęcia z makiet                       | `public/media/sample/`                             | 2        | oryginały z `/wp-content/uploads/` lub nowa sesja | ⬜  |
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

---

## 6. Dziennik

Wpisy z etapów 1–8b (2026-09-11 … 2026-09-26, 36 wpisów): `docs/archive/plan-claude-code-historia.md` §6H.
Poniżej dziennik etapów 9–11 — nowe wpisy dopisujemy tutaj.

| Data       | Wpis |
| ---------- | ---- |
| 2026-09-26 | v0.7 — **porządkowanie dokumentów przed etapem 9.** Plany etapów 1–8b, ewaluacja stagingu 08 i zamknięte sesje dokumentacyjne → `docs/archive/` (przeniesione, nie skopiowane). Z tego dokumentu wydzielone do `docs/archive/plan-claude-code-historia.md`: opisy etapów 1–8b (§3H), pełny rejestr decyzji (§4H), odhaczone pozycje treści (§5H), dziennik do 2026-09-26 (§6H), załączniki B i C. Odzyskany z historii gita `plan-aktualizacji-dokumentow-wydarzenia.md` (usunięty w `2048be9` mimo 5 żywych odwołań, w tym z §3 etapu 9). Bez zmian treści merytorycznych. |

---

## 7. Gdzie jest historia

| Szukasz | Idź do |
| --- | --- |
| Decyzji `K-xx`, której nie ma w §4 wyżej | `docs/archive/plan-claude-code-historia.md` §4H (65 wierszy zamkniętych) |
| Kawałków, DoD albo pytań zamkniętego etapu | `docs/archive/plans/0N-*.md` |
| Szczegółów implementacyjnych, na które powołuje się wiersz rejestru | plan etapu w `docs/archive/plans/` |
| Dziennika wcześniejszego niż 2026-09-26 | `docs/archive/plan-claude-code-historia.md` §6H |
| Opisu zakresu etapu 1–8b (co wchodziło, co nie) | `docs/archive/plan-claude-code-historia.md` §3H |
| Zasad migracji dawnych „Wydarzeń" — wersja wiążąca | §3 tego dokumentu, etap 9 |
| Zasad migracji dawnych „Wydarzeń" — uzasadnienie źródłowe | `docs/archive/plan-aktualizacji-dokumentow-wydarzenia.md` §5 (**częściowo nieaktualna terminologia** — patrz ostrzeżenie w `docs/archive/README.md`) |
| Copy do slotów `/o-akademii` i `/pracownia` | `docs/archive/copy-o-akademii-pracownia.md` |
| Stanu stagingu przed etapem 8b | `docs/archive/08-review-staging.md` |

Reguła: **przy rozbieżności między archiwum a tym dokumentem wygrywa ten dokument.**
Archiwum zapisuje stan na dzień zamknięcia, nie stan docelowy.

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
