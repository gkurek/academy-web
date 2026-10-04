# Plan 10 / kawałek 4 — Strona główna („Najbliższe”, hydratacja)

Status: **zatwierdzony** 2026-10-04  
Gałąź: `feat/10-finishing`  
Nadrzędny: `docs/plans/10-finishing.md` (kawałek 4, H1–H3). Kontekst: `docs/plans/10-k3-news.md` (D1 — K-69 kierunek B, D3 — rytm roku, D4 — dwie fazy wpisu).

## Zakres

- **H1** — Wybrane ikony, otoczka sekcji — **✅ zrobione przed tym planem** (2026-10-04).
- **H2** — „Najbliższe”: 3 stałe kafle liczone z dat w treści + ręczne nadpisanie z wygaśnięciem.
- **H3** — hydratacja `Pillars`, `OfferLeadExtra` (DoD #8).

**Nie wchodzi:** nowy wygląd kafla (zostaje obecny; jeśli okaże się słaby → runda Claude Design); hosting / harmonogram rebuildu (etap 11); CMS.

## Decyzje (discovery 2026-10-04)

| ID | Decyzja |
| --- | --- |
| **N1 — sloty** | Zawsze **3 kafle**, stała kolejność jak `Pillars` pod spodem: **Warsztaty · Wykłady · Ikony**. Kafel stoi nad swoim filarem. Zawsze `hairline-grid-3`. |
| **N2 — tytuły** | **Mix:** domyślnie tytuł składany z danych (data, nazwisko, tytuł wystawy) — nie tytuł wpisu ani tytuł wykładu (za długie). Ręczne nadpisanie per slot w `settings.json` wygrywa z automatem. |
| **N3 — linki** | Domyślnie strona oferty / sekcji. Do wpisu w Aktualnościach, gdy istnieje **świeży** pasujący wpis (data ≤ 30 dni, `kind` wg mapy N8) albo gdy wskazuje go nadpisanie. |
| **N4 — Ikony** | Automat z `annual.json` (istniejący `getExhibitionUpcomingHighlight` + nowy stan): przed wernisażem „Wernisaż {data}” · w trakcie dorocznej „{tytuł}, do 31 sierpnia” · reszta roku: ekspozycja codzienna + oprowadzania. Wystawy wyjazdowe / gościnne — tylko nadpisanie ręczne (brak dat w modelu). Link: `/ikony/wystawy` lub świeży wpis `kind: wystawa`. |
| **N5 — Wykłady** | Automat z `content/lectures/*.json`: najbliższy wykład (aktualny do końca dnia wykładu) — data · pierwszy wykładowca (+ drugi, jeśli mieści się bez łamania); nazwiska z `lecturers.json` po `lecturerSlugs`. Przerwa VI–IX (brak przyszłych dat): „Sezon {następny} — program we wrześniu” + „Ostatni wykład: {data}”. Nowy JSON sezonu z pierwszą datą przełącza kafel sam. Link: `/wyklady`. |
| **N6 — Warsztaty** | Kalendarz roku z pól ISO ofert (N7): III → zamknięcie zapisów LSŚ: „Letnia Szkoła Światła {rok}” · otwarcie → zamknięcie naboru: „Nabór na kurs {sezon}, zgłoszenia do …” · koniec naboru → start kursu: „Kurs rusza {data}” · X–II: **„Kurs {sezon} trwa — nabór na kolejny rok od czerwca”**. Nakładanie VI–VII: pierwszeństwo ma termin, który kończy się wcześniej. Brak daty w danych → stan bez tej daty (nie zgadujemy). |
| **N7 — model (zgoda właściciela)** | Nowe pola ISO w `OfferFacts` (`types.ts`, brief §4): kurs — `enrollmentOpen`, `enrollmentClose`, `firstMeetingDate`; LSŚ — `registrationClose`, `dateStart`, `dateEnd`. Istniejące pola tekstowe (`enrollmentDeadline`, `firstMeeting`) zostają do wyświetlania. `SiteSettings.upcoming[]` **usunięte** → `upcomingOverrides[]`: `{ slot: "warsztaty" \| "wyklady" \| "ikony", title, text, href, linkLabel, from?, until }`. |
| **N8 — mapa `kind` → slot** | kurs / warsztaty / LSŚ → Warsztaty · wykłady → Wykłady · wystawa → Ikony. Dokładne wartości enumu potwierdzić z `types.ts` w 4.2. |
| **N9 — odświeżanie** | Stan liczony od daty builda / rewalidacji; `page.tsx` ma `revalidate = 86400`. Warunek poprawnych kafli: **dobowy rebuild albo działające ISR na hostingu → etap 11**. |
| **N10 — wygląd** | Obecny wygląd kafla; zmiana tylko logiki i stałych 3 kolumn. Słabo na żywo → zamówienie wariantu w Claude Design. |

## Gate K-122 / EJK

- Wartości nowych pól ISO (daty naboru 2027/2028, LSŚ 2027) — do czasu potwierdzenia pola puste.
- Zdanie „nabór na kolejny rok od czerwca” (kafel X–II) — twierdzenie o terminie; potwierdzić z EJK.
- Usunięcie obecnych ręcznych `upcoming[]` z `settings.json` — treść, pokazać w gate.

## Kawałki

| Kawałek | Zakres | Gate K-122 |
| --- | --- | --- |
| **4.1 — model i dane** | Pola N7 w `types.ts`, brief §4, frontmatter `kurs-roczny-i-trzyletni.mdx` i `letnia-szkola-swiatla.mdx`; `upcoming[]` → `upcomingOverrides[]` w `settings.json` i `src/content/settings.ts`. Walidacja przy buildzie: brak `until` → błąd; `from > until` → błąd; dwa nakładające się nadpisania tego samego slotu → błąd; niepoprawny ISO → błąd. | **tak** (wartości dat, usunięcie `upcoming[]`) |
| **4.2 — logika** | `src/content/upcoming.ts`: resolver per slot (N4–N6), nadpisanie (N2), świeży wpis (N3, N8); stringi w `pl.ts`; `scripts/check-upcoming-states.ts` — stany wszystkich 3 slotów dla ~12 dat w roku (wzorzec `check-exhibition-states.ts`). | nie (stringi UI) — poza zdaniem z gate |
| **4.3 — UI** | `UpcomingHighlights` — zawsze 3 kafle w kolejności N1, obecny wygląd; 390 / 1440 / ≥ 1600; klawiatura (fokus linków). | nie |
| **4.4 — H3** | Hydratacja `Pillars`, `OfferLeadExtra` — brak overlay w `next dev` lub udokumentowana przyczyna. | nie |
| **4.5 — dokumentacja** | `docs/plan-claude-code.md` §4 — nowa decyzja K (N1–N10); notatka N9 do etapu 11; brief §4; postęp w `10-finishing.md`. | nie |

**Kryterium „gotowe” (całość):** build + lint OK; `check-upcoming-states` pokazuje sensowny stan każdego slotu w każdym miesiącu; na `/` zawsze 3 kafle; brak tekstu redakcyjnego w JSX; brak overlay hydratacji.

## Postęp

| Kawałek | Status | Uwagi |
| --- | --- | --- |
| H1 — Wybrane ikony, otoczka | ✅ | 2026-10-04, przed tym planem |
| Discovery H2 | ✅ | 2026-10-04 — N1–N10 |
| 4.1 — model i dane | ⬜ | |
| 4.2 — logika | ⬜ | |
| 4.3 — UI | ⬜ | |
| 4.4 — H3 hydratacja | ⬜ | |
| 4.5 — dokumentacja | ⬜ | |
