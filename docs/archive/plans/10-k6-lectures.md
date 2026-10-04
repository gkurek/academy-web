# Plan 10 / kawałek 6 — Wykłady (`/wyklady`, `/wyklady/archiwum`, `/wyklady/wykladowcy`)

Status: **zamknięty** 2026-10-04 (6a–6c ✅; plan zatwierdzony w sesji planistycznej 2026-10-04)  
Etap: `docs/plans/10-finishing.md` (kawałek 6, zadania L1, L2)  
Gałąź: `feat/10-finishing`  
Kontekst: otwarte p. 1–3 w `scripts/migrate-report.md` § „Formuła wpisów `kind: wyklady`”; `docs/plans/10-k3-news.md` D3 (wpis IX „Nowy rok w Akademii”) i § Ryzyka (potwierdzić w k6). Bez CMS wykładów (osobny projekt).

## Cel

Przegląd trzech tras wykładów na prawdziwych danych (poza DoD #8 etapu 9) i poprawki układu/nawigacji wg obecnego układu z etapu 4 (bez nowej makiety). Domknięcie powiązania wpisów `kind: wyklady` ↔ hub/archiwum tak, żeby zmiana sezonu nie psuła linków.

## Diagnoza (stan na 2026-10-04)

| # | Problem / stan |
| --- | --- |
| 1 | **P. 2 (głębokie linki) — w praktyce zrobione w k3b:** 15 archiwalnych wpisów linkuje (body + `related`) do `/wyklady/archiwum#season-RRRR-RRRR`; `SeasonAccordion` otwiera i przewija sezon z hasha. Do weryfikacji w przeglądarce. |
| 2 | **P. 1 — wpis bieżącego sezonu** (`…mistyka-dzis-wyklady-2026-2027`) linkuje do `/wyklady`; po zmianie sezonu link pokaże program 2027/2028. |
| 3 | **P. 3 — duplikacja intro** JSON (`content/lectures/*.json`) + MDX (świadoma, zamrożona przy gate etapu 9). |
| 4 | `content/lectures/archive.json` — `intro` z liczbami na sztywno („15 sezonów”, „szesnasty”) + pola `archivalSeasonCount`, `totalSeasonCount`, `firstSeason`, `lastSeason` — ręczna aktualizacja przy każdej zmianie sezonu. |
| 5 | Hub, archiwum i wykładowcy nie były oglądane po migracji (DoD #8) — lista usterek nieznana (→ 6a). |

## Decyzje sesji planistycznej (2026-10-04)

| # | Decyzja |
| --- | --- |
| **LK1 — Link sezonu w wpisie (p. 1)** | Nowe **opcjonalne** pole wpisu `lectureSeason?: string` (slug sezonu, np. `"2026-2027"`) w `News` (`src/content/types.ts`, brief §4 — zmiana addytywna). Szablon wylicza cel linku: sezon bieżący → `/wyklady`, archiwalny → `/wyklady/archiwum#season-{slug}`. Walidacja build: slug istnieje w `content/lectures/`. Uzupełnienie 16 wpisów — **gate K-122**. Nowa decyzja K-1xx w `docs/plan-claude-code.md` §4. Dokładny kształt (link w body vs „Powiązane”) — w 6c, w meldunku. |
| **LK2 — Single source of truth (p. 3)** | **Odłożone do projektu CMS** — adnotacja w `scripts/migrate-report.md`; duplikacja intro JSON + MDX zostaje zamrożona. |
| **LK3 — D3 a wykłady** | Przyszłe sezony **bez osobnego wpisu** „wykłady {sezon}” — program jako sekcja wpisu IX „Nowy rok w Akademii {sezon}” (D3). 16 istniejących wpisów zostaje jako kronika; wpis 2026/2027 **nie** jest scalany z `nabor-kursu-2026-2027`. Zapis w `migrate-report.md` i `docs/wpisy-cykliczne-aktualnosci-ejk.md` (jeśli wymaga korekty). |
| **LK5 — Liczba sezonów (po 6a)** | Brief §3 i `archive.json`: 15 archiwalnych + bieżący szesnasty; dane: **14** archiwalnych (2012/2013–2025/2026) + bieżący = piętnasty. W 6c liczby wyliczane z danych; „Szesnasty sezon” w `intro` `2026-2027.json` → `[do uzupełnienia]` (gate) i pytanie do EJK (czy brakuje sezonu, np. 2011/2012). Brief §3 — korekta po odpowiedzi EJK. |
| **LK6 — Do EJK (k8)** | 2017/2018 i 2018/2019 mają ten sam `cycleTitle` („Ikona – korzenie i owoce wiary. O świętości”) — weryfikacja razem z R3; bez zmian w k6. |
| **LK4 — Układ** | **Obecny układ z etapu 4** — bez nowej makiety Claude Design; poprawki L1 tylko z zaakceptowanej listy 6a. |

## Plan implementacji

### 6a — przegląd (checkpoint 1/3, bez zmian w kodzie)

- `/wyklady`, `/wyklady/archiwum`, `/wyklady/wykladowcy` — zrzuty 390 / 1440 / ≥ 1600 px.
- Nawigacja: aktywne pozycje `Header` / `SectionNav`, linki hub ↔ archiwum ↔ wykładowcy, breadcrumb (jeśli jest).
- Kotwice: `/wyklady/archiwum#season-…` z wpisów news (otwarcie + przewinięcie, nagłówek nie zasłania sezonu); `/wyklady#zapisy`.
- a11y: drzewo nagłówków (duplikaty `h2`), fokus i klawiatura w `SeasonAccordion`.
- **Wynik:** lista usterek L1 (problem → proponowana poprawka) do akceptacji w czacie. Jeśli lista pusta — 6b wypada.

### 6b — poprawki L1 (checkpoint 2/3)

- Tylko pozycje zaakceptowane z listy 6a.
- **Kryterium:** definicja „gotowe” z `CLAUDE.md`; 390 px + desktop; klawiatura w akordeonie.

### 6c — L2: powiązanie news ↔ hub (checkpoint 3/3, **gate K-122** przed zapisem w `content/`)

- `src/content/types.ts`, brief §4 — `lectureSeason?` (LK1).
- `src/content/lectures.ts` / `src/content/news.ts` — helper celu linku sezonu + walidacja slugów.
- Szablon wpisu (`NewsArticlePage` / „Powiązane”) — link wyliczany z `lectureSeason`.
- `content/news/*` (16 wpisów `kind: wyklady`) — `lectureSeason`, usunięcie linków na sztywno tam, gdzie zastąpi je wyliczenie (gate).
- `content/lectures/archive.json` + `getArchiveIntro` — liczby sezonów wyliczane z danych (diagnoza #4); copy intro z placeholderami — gate.
- `scripts/migrate-report.md` — p. 1–3 zamknięte (LK1, LK2, p. 2 = stan z k3b), LK3.
- **Kryterium:** build + lint OK; symulacja zmiany sezonu (np. tymczasowo inny bieżący sezon w skrypcie/teście) daje poprawne linki; brak linków do nieistniejących kotwic `#season-…`.

## Postęp

| Kawałek | Status | Uwagi |
| --- | --- | --- |
| 6a — przegląd | ✅ | 2026-10-04 — 375 / 1440 / 1680; lista L1 #1–#5 → akceptacja: #1, #4, #5 → 6b; #3 → 6c; **#2 odrzucone** (puste ramki zdjęć wykładowców zostają) |
| 6b — poprawki L1 | ✅ | 2026-10-04 — `SeasonAccordion`: jedno wcięcie na mobile (`md:pl-tile-px`), `scroll-mt-space-6` sezonu; `LecturerBio`: nazwa dostępna z nazwiskiem + `aria-controls` (`pl.lecturers.expandBioLabel` / `collapseBioLabel`) |
| 6c — L2 | ✅ | 2026-10-04 — K-139; gate K-122 OK (G1–G5): `News.lectureSeason` (15 wpisów, `related` usunięte z 14), `<LectureSeasonLink />` we wpisie 2026/2027, `getLectureSeasonHref` + walidacja, `archive.json` bez liczników + `hubIntro`, `getTotalSeasonCount` z danych (15), intro 2026/2027 → `[do uzupełnienia]` (LK5); symulacja: archiwalne sezony → renderowane kotwice archiwum. Procedura zmiany sezonu — `migrate-report.md` |

**Kawałek 6 zamknięty 2026-10-04.**
