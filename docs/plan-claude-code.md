# Plan pracy z Claude Code — Akademia Ikony

> **Wersja:** 0.9 · **Data:** 2026-10-04
> **Status:** żywy dokument. Jedyne miejsce, w którym śledzony jest postęp fazy implementacji. Aktualizowany po każdym checkpoincie.
> **Zakres:** etap **10 — fala 2** (k8–k10) i etap **11**. Etapy 1–9 i kawałki 1–7 etapu 10 są zamknięte — opisy, decyzje bez skutków dla dalszej pracy, odhaczone pozycje treści i dziennik do 2026-10-01: `docs/archive/plan-claude-code-historia.md`.
> **Dokumenty powiązane:** `brief-claude-code.md` (wymagania techniczne, model treści, fakty stałe), `design/README` (handoff z Claude Design), `docs/archive/README.md` (co i dlaczego wylądowało w archiwum).
> **Miejsce w repo:** `docs/plan-claude-code.md`. Plany etapów: `docs/plans/10-finishing.md`, `docs/plans/11-wdrozenie.md` (jeszcze nie powstał).

**Migracja z WordPressa jest zamknięta na stałe (etap 9, 2026-10-01).** Nie wracamy do niej i nie uruchamiamy ponownie skryptów `scripts/migrate-wp/`; raport migracji leży w `docs/archive/migrate-report.md`.

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
- Kawałki jednego etapu można robić w jednej sesji; jeśli sesja się wydłuża lub kontekst robi się ciężki — `/clear` i start od promptu wznowienia (wzór: `docs/archive/plan-claude-code-historia.md`, załącznik B) z podaniem numeru ostatniego zaliczonego checkpointu. Plan i ten dokument mają wystarczyć do wznowienia bez opowiadania historii.
- Jeden etap = jedna gałąź / jeden PR (`feat/0N-nazwa`). Merge po zamknięciu etapu. Commity wykonuję ja po każdym „OK” (format `0N/K: short description`, po angielsku); Claude Code nie commituje.

### 1.4 Treść

- Strony czytają wyłącznie z warstwy `src/content/*` (typy z briefu §4). Żadnych treści redakcyjnych hardkodowanych w JSX — nawet „tymczasowo”.
- Po migracji (etap 9) w `content/` są prawdziwe dane. Nowa treść redakcyjna przechodzi gate K-122 w czacie; brakująca treść to `[do uzupełnienia: …]` + wiersz w §5, nie wymyślony tekst.
- Fakty stałe z briefu §8 (maile, telefon, daty, nazwa, adres) wpisujemy dosłownie.

---

## 2. Etapy i postęp

Statusy: ⬜ nie zaczęty · 🟡 plan w przygotowaniu · 🔵 plan zatwierdzony · 🟠 w implementacji (N/M) · ✅ zamknięty

| #   | Etap                                                                        | Plik planu                                                                       | Status       | Zakończono |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------ | ---------- |
| 1–9 | Budowa serwisu (1–8b) i migracja z WordPressa (9)                          | `docs/archive/plans/0N-*.md` — spis w `docs/archive/README.md`                   | ✅ zamknięte | 2026-10-01 |
| 10  | Wykończenie: ewaluacja serwisu, poprawki po prezentacji, SEO, optymalizacja | `docs/plans/10-finishing.md`                                                     | 🟠 fala 1 ✅ (k1–k7); **następny: k8** treść EJK | —          |
| 11  | Wdrożenie                                                                   | `docs/plans/11-wdrozenie.md`                                                     | ⬜           | —          |

11 zaczyna się po zamknięciu 10.

---

## 3. Opis etapów

Dla każdego: cel, zakres, kryteria ukończenia (DoD) i pytania otwarte. Opisy etapów 1–9: `docs/archive/plan-claude-code-historia.md` §3H, §3I.

### Etap 10 — Wykończenie: ewaluacja serwisu, poprawki, SEO i optymalizacja

**Cel:** przejść przez cały serwis na prawdziwych danych z etapu 9 — od przeglądu z klientem po techniczne domknięcie przed wdrożeniem.

**Stan:** fala 1 (k1–k7: wystawy, lightbox, aktualności, strona główna, album, wykłady, reszta layoutu) zamknięta 2026-10-04 — plany kawałków w `docs/archive/plans/10-k*.md`. Zostaje **fala 2**: k8 treść EJK → k9 SEO/analityka → k10 audyty i dokumentacja. Kawałki, backlog i postęp: **`docs/plans/10-finishing.md`**.

**Zakres fali 2:**

1. **Treść i gate EJK (k8)** — pozycje z §5; gate K-122 w czacie przed zapisem treści redakcyjnej w `content/`.
2. **SEO, dane strukturalne, analityka (k9)** — `generateMetadata` + Open Graph (domyślny + per strona); `sitemap.ts`, `robots.ts`; JSON-LD: `Organization`, `Person` (EJK), `Event` (bieżący sezon), `Course` (kurs, plener), `Book` (album — K-76), `Article` (artykuły; `isPartOf` → `Book` dla tekstów z albumu); rozważyć `ExhibitionEvent` dla `/ikony/wystawy`; Plausible lub Umami bez ciasteczek — zdarzenia na CTA zapisów, `mailto:`, `tel:` (K-07, K-15); aktualizacja polityki prywatności (K-119).
3. **Ewaluacja techniczna i audyty (k10)** — **ocena istniejącego kodu** (`src/`, `src/content/*`, komponenty): over-engineering, prostota, reużywalność, zgodność z konwencjami repo (`CLAUDE.md`, brief §7), typowanie strict, podział Server/Client, duplikacje. **Audyty produktowe:** Lighthouse (a11y ≥ 95, wydajność ≥ 90 mobile) na 5 trasach, raporty w `docs/lighthouse/`; kontrast, fokus i stany z ekranu „Komponenty”.
4. **Przegląd tras i poprawki po prezentacji** — każda trasa na desktopie i mobile (390 px); uwagi klienta po prezentacji (m.in. K-37); każda większa zmiana przez korektę planu etapu.
5. **Dokumentacja** — §4–§5 tego planu i brief zsynchronizowane ze stanem kodu; bez zmian w `design/` i bez nowych zależności bez uzgodnienia.

**DoD:**

- [ ] przegląd wszystkich tras z briefu §3 odhaczony; lista poprawek po prezentacji zamknięta lub świadomie przeniesiona do wdrożenia;
- [ ] walidator schema.org bez błędów dla czterech typów; podgląd OG sprawdzony dla strony głównej i jednej ofertowej;
- [ ] zdarzenia analityczne widoczne w panelu narzędzia w środowisku testowym;
- [ ] przegląd kodu zakończony: usunięte lub uzasadnione miejsca over-engineered; brak oczywistych duplikacji i naruszeń konwencji repo;
- [ ] raport Lighthouse dla 5 tras (główna, kurs, wykłady, galeria `/ikony`, aktualności) w `docs/lighthouse/`;
- [x] lightbox `/ikony` sprawdzony na iOS Safari (K-38) — test OK 2026-10-03;
- [ ] `npm run build` i `npm run lint` bez regresji; dokumentacja zsynchronizowana z kodem i decyzjami etapu.

**Pytania:** Plausible czy Umami (hosting, koszt, self-hosting). Czy `Event` JSON-LD wymaga lokalizacji/oferty ceny. Termin i forma prezentacji z klientem (staging, lista tras, kto zbiera uwagi).

### Etap 11 — Wdrożenie

**Zakres:** hosting, zmienne środowiskowe, domena i certyfikat, test 301 ze starych URL-i (w tym długi slug „O nas”), test `mailto:` i `tel:` na telefonie (iOS i Android), zgłoszenie sitemap w Google Search Console, monitoring (uptime, błędy), procedura publikacji zmian treści do czasu panelu CMS.

**DoD:**

- [ ] lista starych URL-i z briefu §5 przetestowana skryptem (status + cel);
- [ ] GSC potwierdza sitemap;
- [ ] `docs/runbook.md`: jak wdrożyć, jak zmienić treść, gdzie są logi.

**Warunek z etapu 10 (K-136, N9):** kafle „Najbliższe” na `/` i stan wystawy na `/ikony/wystawy` liczą się z daty builda / rewalidacji (`revalidate = 86400`). Hosting musi zapewnić działające ISR albo dobowy rebuild — inaczej kafle utkną na dacie wdrożenia.

**Pytania:** wybór hostingu (K-09). Termin przełączenia DNS bez presji — nabór 2026/2027 obsłużyła stara strona (K-10).

---

## 4. Rejestr decyzji

Tu są **wyłącznie decyzje żywe**: otwarte, wiążące dla dalszej pracy (fala 2 etapu 10, etap 11),
konwencje cytowane w `CLAUDE.md` oraz decyzje podjęte w etapie 10 (zapis etapu do jego zamknięcia).

**Pozostałe wiersze (zamknięte, zastąpione albo bez skutków dla dalszej pracy): `docs/archive/plan-claude-code-historia.md` §4H.**
Podział jest rozłączny — numeracja `K-xx` jest globalna, więc każdy numer leży w dokładnie
jednym z dwóch miejsc. Wiersz tutaj może odsyłać do numeru z archiwum (np. „zastępuje K-58”) —
wtedy szukaj go w §4H.

| #     | Decyzja                                               | Etap             | Wybór                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Data       |
| ----- | ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| K-07  | Plausible vs Umami                                    | 10               | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | —          |
| K-08  | Domena kanoniczna (www / bez)                         | 9                | **`https://www.akademiaikony.pl`** (ciągłość ze starym WP i backlinkami); apex/http → www przy wdrożeniu (etap 11)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 2026-09-26 |
| K-09  | Hosting                                               | 11               | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | —          |
| K-10  | Termin przełączenia DNS względem naboru 24.09.2026    | 11               | **Nabór 2026/2027 obsługuje stara strona**; wdrożenie bez presji terminu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 2026-09-11 |
| K-11  | Język komentarzy, commitów i PR                       | —                | **Angielski** (treść dla użytkownika po polsku)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 2026-09-11 |
| K-12  | Kto commituje                                         | —                | **Wyłącznie właściciel repo**, po „OK” dla kawałka; Claude Code nie używa `git commit/push`. **Aneks K-120 (2026-09-26): w sesjach cloud commituje i pushuje Claude.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 2026-09-11 |
| K-15  | Konwencja zdarzeń analitycznych (`data-event` itp.)   | 2                | **Nie dodajemy w etapie 2** — konwencja i podłączenie w całości w etapie 10                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 2026-09-12 |
| K-17  | JSON-LD `Event` dla wykładów                          | 4                | **Dane w etapie 4**, emisja `<script type="application/ld+json">` w etapie 10 — patrz `docs/archive/plans/04-wyklady.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 2026-09-17 |
| K-30  | `content-max` na szerokich ekranach (04b)             | 4b, 10           | **`--content-max: 1280px` od 1600 px okna** (poniżej 1180 px); tekst ciągły trzyma `--measure-lead` 680 / `--measure-prose` 640 px; siatki korzystają z szerszego kontenera. **Potwierdzone 2026-10-02 jako świadoma decyzja dla całego serwisu:** skok zostaje; każdy nowy lub przebudowywany układ projektujemy i sprawdzamy w obu stanach — 1440 (treść 1068 px) i ≥ 1600, np. 1920 (treść 1168 px) — tak, żeby powyżej 1600 px strona wyglądała na pełną i zbalansowaną bez polegania na marginesach bocznych. Przeniesione z archiwum §4H przy przeglądzie `/ikony/wystawy` (etap 10) — patrz `docs/archive/plans/04b-review-fixes.md` K-30 | 2026-09-19 |
| K-32  | Sticky `FactsBox` + `ClosingCta` (04b)                | 4b               | **Odrzucono** — layout bez zmian. **Świadoma decyzja D-1:** brak CTA po scrollu; zapis tylko w `FactsBox` w nagłówku; powrót w etapie 10 (K-37)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 2026-09-19 |
| K-35  | CTA „Zapisy" w nagłowku desktop (04b)                 | 4b               | **Poza 04b** — wrócić w etapie 10 z danymi analityki                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 2026-09-19 |
| K-37  | Sticky `FactsBox` na stronach ofertowych              | 10               | **Ponowne rozważenie w etapie 10** — odrzucone w 04b (K-32) po prototypie; warunek `min-height: 880px`, dwukolumnowy layout przez całą stronę; opcjonalnie `ClosingCta` — patrz `docs/archive/plans/04b-review-fixes.md` K-32                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 2026-09-19 |
| K-39  | Obrazy w lightboxie vs. siatka                        | 5                | **Jeden `src`**, większe `sizes` w lightboxie (rozmiar obrazu zmieniony w K-45); weryfikacja w etapie 10, ewentualne `imageLarge` w `IconWork` — patrz `docs/archive/plans/05-galeria.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 2026-09-19 |
| K-42  | Podpisy i atrybucja autorów (05b)                     | 5b               | **Trzy poziomy:** siatka — sam tytuł; sekcja uczniów — lista nazwisk generowana z danych (bez osobnego wstępu); lightbox — pełny autor lub „Praca z warsztatów Akademii”, wymiary („do weryfikacji”), technika (domyślna lub z danych). `authorName?` opcjonalne w `IconWork`; bez pola `year` w `IconWork`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 2026-09-20 |
| K-48  | `SectionNav` na `/o-akademii` i `/pracownia`          | 6                | **Dodajemy** — O Akademii · Pracownia, jak makieta 6a–6d; `SectionKey` + `sectionNav` w `navigation.ts`; brief §3 uzupełniony                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 2026-09-20 |
| K-50  | Dział „Wydarzenia”                                    | 7, 8             | **Likwidujemy jako sekcję i pozycję menu.** Menu główne: O Akademii · Warsztaty · Wykłady · Ikony · Aktualności · Kontakt. Trasa `/wydarzenia` nie powstaje; stare adresy przekierowane (brief §5). Uzasadnienie: jedyna żywa treść działu to coroczna wystawa; reszta to archiwum 2013–2020, a kategorie „Poświęcenia/Oprowadzania/Wyjazdy” pokazywałyby 1–3 wpisy sprzed dekady                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 2026-09-21 |
| K-57  | Historia plenerów                                     | 8, 9             | Sekcja „Gdzie byliśmy” na `/warsztaty/letnia-szkola-swiatla` (K-57). **Treść zamknięta w etapie 9 (DoD #2, K-126):** 8 miejsc — Święta Lipka, Wesoła, Gródek, Mielnik, Supraśl, Przemyśl, Wilno, Tbilisi; część „wyjazdów studyjnych” z WP to plenery LSŚ. Format wyświetlania — **K-126** (zastępuje K-118 co do „miejsce · rok”).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 2026-09-30 |
| K-69  | Funkcja strony Aktualności: zapowiedzi vs kronika     | 7, 10            | **Kierunek B (zamknięte 2026-10-03, k3 discovery):** Aktualności = jeden strumień (zapowiedzi + kronika), bez osobnej „Kroniki”; „co teraz” = „Najbliższe” na `/` (kafle → oferty); wyróżniony wpis = bieżąca zapowiedź; zapowiedzi po terminie zostają w kronice — patrz `docs/archive/plans/10-k3-news.md` D1–D2 (historia: `docs/archive/plans/07b-review-fixes.md`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 2026-10-03 |
| K-73  | Wyróżniony wpis — nagłówek i czas życia (07c)         | 7c, 10           | Etykieta nad blokiem. **Etap 10 k3 (D11, 2026-10-03):** pole `featuredUntil` **usunięte**; wyróżnienie do ręcznego zdjęcia flagi; wymóg `cover`; max 1; wyróżniony poza listą lat (K-62). Historia 07c: `docs/archive/plans/07b-review-fixes.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 2026-10-03 |
| K-76  | Publikacje: album + artykuły                          | 8, 9, 10         | `/publikacje` bez zakładek/`SectionNav`: sekcja albumu + lista artykułów; podstrona albumu i szablon artykułu z blokiem źródła; typy `Publication`/`Article`; walidacje build; blok metryczki; zakup `mailto:`; terminologia „album”; brak sekcji na home; JSON-LD `Book`/`Article`; makieta oczekiwana (`PU-*`) — patrz `docs/archive/plan-aktualizacji-dokumentow-publikacje.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 2026-09-22 |
| K-78  | Plakaty i multimedia                                  | 8, 9, 10         | Brak stron plakatów/multimediów; galeria zbiorcza `plakaty-z-wydarzen`. **Etap 10 k3 (K-129):** `News.poster` usunięte — plakaty w `images[]` wpisu docelowego (caption „Plakat”); weryfikacja EJK → fala 2. Film nie osadzany — patrz `docs/archive/plan-aktualizacji-dokumentow-publikacje.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 2026-10-03 |
| K-85  | Stan wystawy dorocznej                                | 8b               | Wyliczany z dat; ISR `revalidate` na `/` i `/ikony/wystawy`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 2026-09-26 |
| K-87  | Wystawy wyjazdowe na stronie                          | 8b, 10           | `#wyjazdowe`, sekcja „Wystawy wyjazdowe”. **K-127 (2026-10-02):** miasta w zdaniu opisu, nie wiersze z latami. **k1 (D1, 2026-10-03):** ręczna `travelingPlaces[]` w `page.mdx`; Supraśl/Tbilisi bez `newsSlug`; lista ≠ `News.venue`. Gate EJK: brakujące wpisy, zakres sekcji — k8. | 2026-09-26 |
| K-115 | Polityka prywatności — struktura                      | 8b               | H2 = TOC; cookies bez Plausible/Umami; treść prawna — patrz **K-119**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 2026-09-26 |
| K-119 | Polityka prywatności — treść prawna (pytania K-115)   | 8b, 10           | **Zatwierdzenie treści** (`content/pages/polityka-prywatnosci.json`): administrator Fundacja IKONA DZIŚ (dane jak w pliku) — OK; `lastUpdated` **bez zmian** (`2026-01-04`); lead — OK. Zakres danych: imię, nazwisko, e-mail, telefon — wystarczający; **bez** dopisków (faktury, PESEL, marketing) i **bez** osobnej sekcji o zdjęciach. Podstawy art. 6 ust. 1 lit. a/b/f — zatwierdzone; okres „do wygaśnięcia roszczeń” — zostaje; lista odbiorców — kompletna; brak państw trzecich i profilowania — nadal prawda. Prawa osób — wystarczające; kontakt RODO: `akademiaikony@gmail.com`; **bez** IOD w polityce. Cookies (brak marketingu/analityki; Google Maps) — OK; analityka bez cookies — **aktualizacja w etapie 10**; brak innych osadzeń do opisania. **Może obowiązywać na produkcji**; formalne zatwierdzenie dokumentu: **EJK**. Odpowiedzi: właściciel repo, 2026-09-26. | 2026-09-26 |
| K-120 | Kto commituje w sesjach cloud (aneks do K-12)         | —                | **W Claude Code on the web commituje i pushuje Claude** na wskazaną gałąź roboczą, po „OK” właściciela na każdy kawałek — kontener jest ulotny, praca niescommitowana przepada. Merge do `main` nadal wyłącznie właściciel repo. **W sesjach lokalnych K-12 bez zmian** — Claude nie commituje. Gałąź dla zadań nieetapowych: `chore/krotki-opis`, komunikat `docs:` / `chore:` zamiast `0N/K:`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 2026-09-26 |
| K-122 | Rytm migracji (etap 9)                            | 9                | Jedna gałąź, **7 kawałków** (`docs/archive/plans/09-migration.md`); przed zapisem w kawałku obowiązkowy **`--dry-run`**; zapis przez **`--only=`** (`static` … `finalize`); po ręcznej edycji w domenie re-run tylko z **`--force`**; gate merytoryczny właściciela; backlog EJK w `docs/archive/migrate-report.md` + §5, poprawki EJK → etap 10                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 2026-09-26 |
| K-126 | LSŚ „Gdzie byliśmy” — format listy                | 9                | W `content/offers/letnia-szkola-swiatla.mdx` → `whereWeWere[]`: `{ place, newsSlug? }`. UI: **tylko nazwa miejsca** (bez regionów, bez lat); gdy `newsSlug` — link do `/aktualnosci/{slug}`; gdy brak — sam tekst (relacja w etapie 10). Przy wielu wpisach na to samo miejsce właściciel wskazuje jeden slug (gate 2026-09-30: Lipka → `plener-swietej-lipki-2019`, Wesoła / Gródek / Mielnik → wpisy `wyjazd` z archiwum). **Zastępuje** wyświetlanie „Miejsce (region) · rok” z **K-118**; sekcja nadal pod cytatami (K-118).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 2026-09-30 |
| K-127 | `/ikony/wystawy` — nowy układ                         | 10               | Makieta **13a + 14a**. **k1 + korekty (2026-10-03):** D1–D8, **K1–K4** (`docs/archive/plans/10-k1-exhibitions.md`) — m.in. wide 3:2 mobile (w kolumnie, bez bleed), kafle 4:3, ekspozycja 2× kadr 60/40, `permanentImage2`, temat dorocznej z wykładów (`getLectureSeasonShortTheme`). Regresja `/` → k3 **A6**; R3–R4 → k8. | 2026-10-02 |
| K-128 | Wpisy cykliczne w Aktualnościach                       | 10               | 4 wpisy/rok + rezerwy (IX / III / VI / VIII–IX); jeden wpis = dwie fazy (zapowiedź → relacja). Formuły dla EJK: **`docs/wpisy-cykliczne-aktualnosci-ejk.md`**; discovery D3–D4: `docs/archive/plans/10-k3-news.md` | 2026-10-03 |
| K-129 | `News.layout` i usunięcie `News.poster`                | 10               | **Wdrożone k3b (gate K-122):** wymagane `layout: "wydarzenie" \| "galeria" \| "tekst" \| "program"`; pola `facts?`, `related?`, `hideLead?`; `poster` usunięty (migracja 68 wpisów → `images[]`). Brief §4 zsynchronizowany — `docs/archive/plans/10-k3-news.md` D5–D6 | 2026-10-03 |
| K-130 | Szablon wpisu: „Powiązane”, galeria, „prose”           | 10               | **Wdrożone k3c:** „Powiązane” (domyślnie z `kind`, nadpisanie `related[]`); `<NewsCta />` usunięty z MDX; CTA tylko w fazie zapowiedzi `wydarzenie`. Galeria D8 + lightbox; tokeny `--prose-*` tylko w Aktualnościach. Makieta: `design/README-wpis-aktualnosci.md` — `docs/archive/plans/10-k3-news.md` D7–D10 | 2026-10-03 |
| K-131 | Szablon wpisu — wybory z oceny makiety (E1–E8)         | 10               | Typografia E1 (EB Garamond, `--prose-*`, `#e6dac7`). Kolejność bloków: prose → galeria E3. Faza `wydarzenie`: `dateEnd ?? date` E7. Galeria: aria „Powiększ zdjęcie n z N” E8. **E2/E5/E6 i układ desktop rundy 1** zastąpione przez **K-133** (makieta v2.1, k3e). Historia układu: `docs/archive/plans/10-k3-news.md` § „Ocena makiety”, „Runda 2 makiety”. | 2026-10-03 |
| K-132 | Zdjęcia wpisu — galeria vs prawa kolumna               | 10               | **Domyślnie** wszystkie `images[]` tylko w galerii pod tekstem; prawa kolumna **bez** zdjęcia. Wyjątek: ręczne `columnImageIndex` (indeks w `images[]`) — podgląd w kolumnie desktop (≥1024), to zdjęcie ukryte w galerii na desktopie, na mobile w galerii jak reszta. Szczegóły: `docs/archive/plans/10-k3-news.md` § „Zdjęcia — galeria i kolumna” | 2026-10-03 |
| K-133 | Szablon wpisu — układ desktop K3 (makieta v2.1, k3e)   | 10               | Siatka F1/F2 (`--entry-*`, ≥1024): tekst 600 px na osi logo + prawa kolumna (fakty, CTA, „Powiązane”, nawigacja). Sticky rail F4; `gend` pod galerią F5; linie kolumny F7. Galeria F9 (G1–G2 / `columnImageIndex`). **Lead F11:** `shouldShowLead()`. **Nagłówek i styl rail F3/F6** — stan po k3e; szczegóły historyczne w `docs/archive/plans/10-k3-news.md` § F1–F12; **aktualny nagłówek i rail → K-134**. Makieta: `design/README-wpis-aktualnosci-v2.md`. | 2026-10-03 |
| K-134 | Szablon wpisu — poprawki k3f (D-a–D-d)                  | 10               | **D-a:** brak breadcrumb na `/aktualnosci/[slug]` (wyjątek od **K-104** dla wpisu Aktualności). **D-b:** meta `rodzaj · data` → H1 → lead; bez `venue` w nagłówku (zastępuje **F6**). **D-c:** rail „etykieta nad linkiem”, wspólne `.news-article-entry-label` / `.news-article-entry-link` (zastępuje **F3**, część **F7**). **D-d:** `.link-underline-target` — kreska przy tekście, tap na zewnątrz (`TextLink`, nav, stopka, treść). Handoff: `docs/archive/plans/10-k3-news.md` § „Decyzje właściciela — k3f”. | 2026-10-03 |
| K-135 | Podkreślenie linków — wzorzec `.link-underline-target`  | 10               | Globalnie (k3f-3, **D-d**): wewnętrzny span z kreską (`--border` lub animowany `::after` w nav); zewnętrzny element zachowuje `--tap-min` / `.tap-target-nav`. `--spacing-link-underline-gap` (2 px) bez zmian. | 2026-10-03 |
| K-136 | Strona główna — „Najbliższe”                          | 10               | Zawsze **3 kafle** w kolejności `Pillars`: Warsztaty · Wykłady · Ikony (N1). Stan liczony z dat w treści: Warsztaty z pól ISO ofert (`enrollmentOpens`, `enrollmentClose`, `firstMeetingDate`; LSŚ `registrationClose`, `dateStart`, `dateEnd`), Wykłady z `content/lectures/*.json` (najbliższy wykład, data · **wszystkie** nazwiska wieczoru; przerwa VI–IX), Ikony z `annual.json` (zapowiedź 30 dni przed wernisażem → wystawa doroczna → ekspozycja codzienna). Ręczne `SiteSettings.upcomingOverrides[]` z wymaganym `until` wygrywa z automatem (`upcoming[]` usunięte). Link do świeżego wpisu (≤ 30 dni, `kind` `warsztaty` / `wyklady` / `wystawa`). Brak daty w danych → stan bez tej daty. Resolver `src/content/upcoming.ts`, kontrola `scripts/check-upcoming-states.ts`. Odświeżanie: `revalidate = 86400` → **dobowy rebuild lub ISR na hostingu = warunek etapu 11** (N9). Szczegóły: `docs/archive/plans/10-k4-home.md` N1–N10. Zastępuje K-58 (kafel wystawy). | 2026-10-04 |
| K-137 | Album — spis treści wg rozdziałów                 | 10               | **AL3 (k5a, gate K-122):** `Publication.chapters?: { title?: string; pages: string }[]`; pozycja `toc` (`PublicationTocEntry`) dostaje `chapter?` (indeks w `chapters`) i `intro?` (tekst przed tytułem rozdziału — „Piętnasta rocznica”). **`toc[].author` opcjonalny** (pozycje bez autora w albumie) — luzuje kontrakt modelu współdzielonego. Walidacja build: indeks istnieje, rozdziały ciągłe i rosnąco, `intro` przed zwykłymi pozycjami; rozdział bez pozycji dopuszczalny („Przykłady wydarzeń – plakaty”, str. 172–178). Brief §4 zsynchronizowany. Szczegóły: `docs/archive/plans/10-k5-album.md` AL1–AL8. | 2026-10-04 |
| K-138 | Media albumu — formaty i optymalizacja             | 10               | **k5d:** `sharp` jako stała `devDependency` (ta sama wersja co w Next, *deduped*); batch `scripts/optimize-album-media.ts` uruchamiany na oryginałach skanów. Rozkładówki ze zdjęciami/ikonami → **JPG q90, 4:4:4**; rozkładówki z tekstem (spis) → **PNG z paletą**; miniaturki siatki szer. **800 px** (JPG q82 / PNG z paletą), wysokość z proporcji skanu; okładka → **JPG q90, maks. 1600 px** (idzie przez `next/image`). Bez upscalingu, kanał alfa zdejmowany. Lightbox bez zmian: pełny plik z `/media/` (`unoptimized`). Gate wizualny 1:1 przed zamianą plików. Szczegóły: `docs/archive/plans/10-k5-album.md` § „Wynik k5d”. | 2026-10-04 |
| K-139 | Wykłady ↔ Aktualności — link sezonu                | 10               | **k6c:** opcjonalne `News.lectureSeason` (slug sezonu); link do programu **wyliczany** — sezon bieżący → `/wyklady` („Wykłady”), archiwalny → `/wyklady/archiwum#season-{slug}` („Archiwum wykładów”); domyślne „Powiązane” + komponent MDX `<LectureSeasonLink season="…" />`; walidacja build (nieznany sezon = błąd). 15 wpisów `kind: wyklady` z polem, ręczne `related` usunięte. Liczby sezonów wyliczane w kodzie (`archive.json` bez liczników; copy z `{firstSeasonLabel}` / `{lastSeasonLabel}` / `{currentSeasonLabel}`; nowe `hubIntro`). Single source of truth intro (JSON + MDX) → projekt CMS. Przyszłe sezony bez osobnego wpisu — program we wpisie IX (D3). Szczegóły: `docs/archive/plans/10-k6-lectures.md` (LK1–LK6). | 2026-10-04 |

Decyzje spoza kodu (D-01…D-06 z briefu v2) pozostają w dokumentach ekosystemu; tu wpisujemy tylko ich skutki dla implementacji. **D-02 (domyślny filtr galerii):** galeria pokazuje **obie sekcje, EJK pierwsza, sztywny podział** (K-41), bez filtra autora; pytanie o zakres prac EJK po starcie strony autorskiej zostaje otwarte — skutek w K-05 / K-41 / `docs/archive/plans/05b-review-fixes.md` (2026-09-19).

---

## 5. Backlog treści — kawałek 8 (gate EJK)

Wszystko, co czeka na treść, decyzję albo materiał od EJK lub właściciela. Każda pozycja zamyka się w czacie przez gate K-122, zanim trafi do `content/`.
Pozycje zamknięte (etapy 1–9, kawałki 1–7 etapu 10): `docs/archive/plan-claude-code-historia.md` §5H. Kto dodaje treść `sample` albo `[do uzupełnienia]`, dopisuje ją tutaj.
Źródła szczegółów: `docs/archive/migrate-report.md` (§ P4 „Backlog — refactor wystaw dorocznych” R1–R9, § EJK), plany kawałków `docs/archive/plans/10-k*.md`.

| #   | Obszar      | Pozycja | Gdzie | ✔   |
| --- | ----------- | ------- | ----- | --- |
| T1  | Galeria     | Wymiary (`size`): 5 prac bez wymiaru (`trojca-swieta-2017`, `chrystus-milosierny`, `chrystus-eucharystyczny-na-krzyzu`, `jezus-chrystus`, `matka-boza-pompejanska`), 47 do weryfikacji; UI `pl.gallery.lightbox.sizeUnverified` | `content/icons.json` | ⬜ |
| T2  | Galeria     | Tytuły — artefakty WP (CAPS, podwójne spacje, „Advokata” vs „Advocata”, interpunkcja) | `content/icons.json` | ⬜ |
| T3  | Galeria     | 10 prac uczniów bez `authorName` + zgoda Akademii na publikację nazwisk uczniów (lista + lightbox) | `content/icons.json` | ⬜ |
| T4  | Galeria     | Technika: domyślna „tempera jajowa na desce lipowej” dla wszystkich prac albo pole per praca | `pl.gallery.lightbox.techniqueDefault`, `content/icons.json` | ⬜ |
| T5  | Galeria     | Wstęp do sekcji uczniów `[do uzupełnienia]`, etykieta „Autorzy prac:” | `src/i18n/pl.ts` (`gallery.sections`) | ⬜ |
| T6  | Zamówienie  | Zdjęcie do zajawki „Ikony na zamówienie” (K-46, S2) i podmiana kadru hero `/ikony/na-zamowienie` — z sesji zdjęciowej | `GalleryOrderTeaser.tsx`, `content/offers/zamowienie.mdx` | ⬜ |
| T7  | Zamówienie  | Czas realizacji — dziś „ustalamy indywidualnie”; EJK może doprecyzować | `content/offers/zamowienie.mdx` (`facts.leadTime`) | ⬜ |
| T8  | Oferty      | Kurs — cytat „Piotr, uczestnik”: brak źródła w WP; potwierdzić albo wymienić | frontmatter oferty kursu w `content/offers/` | ⬜ |
| T9  | Oferty      | Adres zgłoszeń na kurs: na stronie `akademiaikony@gmail.com`; WP miał też `sekretariat.ikony22@gmail.com` — potwierdzić | oferty, brief §8 | ⬜ |
| T10 | LSŚ         | „Gdzie byliśmy”: Supraśl, Przemyśl, Wilno, Tbilisi bez relacji — wpisy Aktualności + `newsSlug` albo zostają bez linku (K-57, K-126) | `content/offers/letnia-szkola-swiatla.mdx` | ⬜ |
| T11 | Aktualności | Oprowadzania 2017: zdanie o „jedynym kanonicznym przedstawieniu” Trójcy Świętej — korekta EJK | `content/news/oprowadzania-po-wystawie-2017.mdx` | ⬜ |
| T12 | Aktualności | Poświęcenia ikon: `alt`, akapit kościelny (porównanie do chrztu i sakramentów) | `content/news/poswiecenia-ikon.mdx` | ⬜ |
| T13 | Aktualności | Program + skan plakatu — wpis A3 | `content/news/spotkania-sladami-najpiekniejszych-ikon-swiata.mdx` | ⬜ |
| T14 | Aktualności | Plakaty (~20): `alt` i rozłożenie na `images[]` wpisów docelowych (K-78, K-129); ewentualne usunięcie wpisu zbiorczego | `content/news/plakaty-z-wydarzen.mdx` | ⬜ |
| T15 | Aktualności | Formuły wpisów cyklicznych — przekazać EJK do akceptacji (K-128) | `docs/wpisy-cykliczne-aktualnosci-ejk.md` | ⬜ |
| T16 | Wykłady     | Numer sezonu w intro 2026/2027 (`[do uzupełnienia: 15. czy 16.?]`): dane mają 14 archiwalnych + bieżący, brief §3 mówi o szesnastym; po odpowiedzi — copy + brief §3 | `content/lectures/2026-2027.json`, brief §3 | ⬜ |
| T17 | Wykłady     | `cycleTitle` 2017/2018 = 2018/2019 („Ikona – korzenie i owoce wiary. O świętości”) — weryfikacja razem z T20 (R3) | `content/lectures/*.json` | ⬜ |
| T18 | Wykłady     | Nierozpoznani wykładowcy w sezonach 2012–2014 | `content/lectures/*.json` | ⬜ |
| T19 | Wystawy     | Zdjęcia: kadry strony (`heroImage`, `permanentImage`, `permanentImage2`, `closingImage`) i zdjęcia dorocznych (`AnnualExhibition.photos`) — dziś placeholdery (R9) | `content/exhibition/page.mdx`, `annual.json` | ⬜ |
| T20 | Wystawy     | Audyt rok ↔ wpis: R3 (2022/2023 — tytuł vs wykłady), R4 (2015/2016 bez `newsSlug`; 2014/2015 `wystawa-ikona-dzis` vs „Obraz i kult”) | `content/exhibition/annual.json`, `content/news/*` | ⬜ |
| T21 | Wystawy     | Relacje doroczne: R5 (placeholdery D20/D21), R6 (lata 2012–2024 bez wpisu — szablon „Wystawa doroczna [rok]” + zdjęcia EJK) | `content/news/*` | ⬜ |
| T22 | Wystawy     | Copy przyjęte z makiety K-127 (lead, doroczna, oprowadzania, wyjazdowe — m.in. „dobieramy ikony do wnętrza…”, „każdy wyjazd ma swoją relację”) — redakcja EJK | `src/i18n/pl.ts` (`exhibition.*`) | ⬜ |
| T23 | Wystawy     | Wyjazdowe: Supraśl i Tbilisi bez relacji; zakres sekcji „wyjazdowe / gościnne” i lista miast (K-87) | `content/exhibition/page.mdx` (`travelingPlaces`) | ⬜ |
| T24 | Album       | `alt` / `caption` okładki i rozkładówek (placeholdery w MDX); `spread-08`: `alt` „166–167” vs `caption` „146–147” | `content/publications/ikona-dzis.mdx` | ⬜ |
| T25 | Album       | 2–3 fragmenty albumu, opcjonalnie „Jak powstał album”, ewentualne doprecyzowanie tytułu i tematu `mailto:` | body MDX publikacji, `pl.ts` | ⬜ |
| T26 | Publikacje  | Ewentualna rozbudowa listy tekstów EJK z mediów | `content/articles/*.mdx` | ⬜ |
| T27 | O nas       | Staż pracowni EJK w bio | `content/pages/o-akademii.json` | ⬜ |
| T28 | Pracownia   | Rozmowa — redakcja (5 nowych pytań, zmiany stylu) do akceptacji EJK; portret EJK | `content/pages/pracownia.json`, `public/media/workshop/ejk-portret.jpg` | ⬜ |
| T29 | Cały serwis | Przegląd `alt` / `caption` wszystkich zdjęć z EJK, pozycja po pozycji | `content/**` | ⬜ |
| T30 | Cały serwis | Inwentarz pojedynczych zdjęć inline w MDX do podpięcia pod lightbox (tryb single gotowy z k2, D7) | `content/**/*.mdx` | ⬜ |

---

## 6. Dziennik

Wpisy z etapów 1–9 i szczegółowy dziennik fali 1 etapu 10 (kroki kawałków): `docs/archive/plan-claude-code-historia.md` §6H.
Poniżej jeden wpis na zamknięty kawałek; nowe wpisy dopisujemy na górze.

| Data       | Wpis |
| ---------- | ---- |
| 2026-10-04 | **Porządki w dokumentach przed k8 (v0.9):** plany kawałków 10/k1–k7, prompty makiety k3 i raport migracji (dawniej `scripts/`) → `docs/archive/`; z rejestru §4 do archiwum trafiło 29 wierszy zamkniętych lub zastąpionych; przywrócone wiersze K-08, K-121, K-122, K-125, K-126 (wypadły w `179552e`); §5 przepisany na backlog treści k8 (T1–T30); dziennik etapu 9 → §6H; odzyskany opis etapu 9 (§3I). Migracja WP zamknięta na stałe — bez ponownego uruchamiania skryptów. **Następny:** k8. |
| 2026-10-04 | **k7 reszta layoutu ✅ (7a–7d):** a11y miniatur `/ikony` (I1), duplikat `h2` LSŚ (O2), linki MDX ofert (O3), „Dalsza droga” (O1), usunięte „Wybrane realizacje” na `/o-akademii` (S1); stopka K-36 (C1). S2 → k8 (T6), K-35 → k9, K-37 po prezentacji. Plan: `docs/archive/plans/10-k7-layout.md`. **Fala 1 zamknięta.** |
| 2026-10-04 | **k6 wykłady ✅ (6a–6c):** przegląd tras, a11y/mobile akordeonu, K-139 (`News.lectureSeason`, liczniki sezonów z danych). Plan: `docs/archive/plans/10-k6-lectures.md`. |
| 2026-10-04 | **k5 album ✅ (k5a–k5d):** spis wg rozdziałów (K-137), skany, optymalizacja mediów 16,1 → 2,5 MB (K-138, `sharp` jako `devDependency`). Plan: `docs/archive/plans/10-k5-album.md`. |
| 2026-10-04 | **k4 strona główna ✅ (4.1–4.5):** „Najbliższe” — 3 kafle liczone z dat (K-136); hydratacja H3 nie występuje. Warunek ISR / dobowy rebuild → etap 11. Plan: `docs/archive/plans/10-k4-home.md`. |
| 2026-10-03 | **k3 aktualności ✅ (k3a–k3f):** K-69 kierunek B, `News.layout`, usunięte `poster`, nowy szablon wpisu (K-129–K-135), wpisy cykliczne (K-128). Plan: `docs/archive/plans/10-k3-news.md`. |
| 2026-10-03 | **k2 lightbox ✅ (G1–G3):** rdzeń lightboxa, modal treści vs ikon, siatki D9; K-38 iOS Safari OK. Plan: `docs/archive/plans/10-k2-lightbox.md`. |
| 2026-10-03 | **k1 wystawy ✅ (W0–W5):** układ K-127 + korekty K1–K4, P4 Tura B (R1, R2, R7, R8). Plan: `docs/archive/plans/10-k1-exhibitions.md`. |
| 2026-10-03 | **Etap 10 — plan zatwierdzony:** `docs/plans/10-finishing.md` — fala 1 (refaktory/layout), fala 2 (treść EJK, SEO, audyty). |
| 2026-10-02 | **Etap 10 — wejście:** nowy układ `/ikony/wystawy` po czterech rundach z Claude Design → **K-127** (13a + 14a); K-30 potwierdzone dla całego serwisu (projektujemy na 1440 i ≥ 1600). |

---

## 7. Gdzie jest historia

| Szukasz | Idź do |
| --- | --- |
| Decyzji `K-xx`, której nie ma w §4 wyżej | `docs/archive/plan-claude-code-historia.md` §4H |
| Kawałków, DoD albo pytań zamkniętego etapu 1–9 | `docs/archive/plans/0N-*.md` |
| Szczegółów zamkniętego kawałka etapu 10 (decyzje D/N/AL/LK/LY, checkpointy) | `docs/archive/plans/10-k*.md` |
| Opisu zakresu etapów 1–8b / etapu 9 | `docs/archive/plan-claude-code-historia.md` §3H / §3I |
| Dziennika do 2026-10-01 i kroków fali 1 etapu 10 | `docs/archive/plan-claude-code-historia.md` §6H |
| Przebiegu migracji WP (gate'y, zamrożenia, R1–R9 wystaw) | `docs/archive/migrate-report.md` |
| Zasad migracji dawnych „Wydarzeń” | `docs/archive/plan-claude-code-historia.md` §3I; uzasadnienie: `docs/archive/plan-aktualizacji-dokumentow-wydarzenia.md` §5 (**częściowo nieaktualna terminologia** — patrz `docs/archive/README.md`) |
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
