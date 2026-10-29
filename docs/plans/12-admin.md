# Plan 12 — Panel admin v1

Status: zatwierdzony 2026-10-29; implementacja po zamknięciu etapu 11 (Access na `/admin/*` wymaga domeny na Cloudflare — 11f)
Gałąź: `feat/12-admin`
Makiety: do powstania w kawałku 12-0 (Claude Design → `design/`)

## Cel i zakres

Panel `/admin` dla EJK pod `https://www.akademiaikony.pl/admin`, za logowaniem. v1: **analityka** (wykresy z PostHoga + porównanie ze starą stroną), **oferta Letniej Szkoły Światła** (dane sezonu), **Aktualności** (nowe wpisy wg formatek, edycja, szkice, zdjęcia we wpisie). Panel jest rozbudowywany stopniowo.
**Nie wchodzi:** biblioteka mediów (v2), kurs, sezon wykładów i wystawa doroczna (v1.1), przełącznik słupki ↔ area (backlog), edycja leadów i treści stron ofert, podgląd na osobnym środowisku (preview URL).

## Decyzje podjęte w sesji planistycznej (2026-10-29)

Pełne brzmienie w `docs/plan-claude-code.md` §4.

- **K-165 — architektura:** to samo repo, osobna aplikacja Next.js w `admin/` i osobny Worker na ścieżce `/admin/*` domeny strony. Powód: osobny limit 3 MiB i osobne wdrożenia, strona publiczna bez zmian; jedno źródło typów (`src/content/types.ts`), jedna dokumentacja. Osobne repo odrzucone (rozjazd modelu współdzielonego, trudny podgląd, podwójne CI).
- **K-166 — źródło treści = git:** zapis z panelu to commit do `main` → build → strona po ok. 1–3 min. Strona dalej statyczna (11b), `src/content/*` bez zmian. **D1** tylko na szkice wpisów i dzienne sumy analityki. Zastępuje założenie briefu §2 („SQLite/Postgres + Auth.js”). Koszty przyjęte: pełny build na każdą publikację, token GitHuba jako sekret Workera.
- **K-167 — logowanie:** Cloudflare Access (kod jednorazowy na e-mail), 2 konta: EJK i właściciel. Adresy wpisywane w panelu Access, nie w repo.
- **K-168 — Analityka:** PostHog Query API (HogQL), klucz osobisty tylko do odczytu (`phx_…`, sekret Workera). Wykresy: odwiedziny i unikalni (słupki, 1 słupek = dzień, przełącznik dzień / tydzień / miesiąc — agregacja w zapytaniu), najczęstsze strony, źródła wejść, kliknięcia CTA (`enroll_click`, `email_click`, `phone_click`) per oferta, urządzenia; wybór okresu 7 / 30 / 90 dni / rok; link „Otwórz w PostHog”. Bez lejków, nagrań, porównań okresów PostHoga. **Porównanie ze starą stroną:** CSV z WP Statistics (eksport w 11f) → dane panelu; seria „Stara strona” na wykresie odwiedzin (ten sam miesiąc rok wcześniej) i najczęstsze strony ze starymi adresami przepisanymi przez mapę 301; na wykresie adnotacja, że metryki nie są 1:1 (trend, nie wartość). **Retencja PostHog Free = 1 rok (K-07)** → panel zapisuje dzienne sumy w D1 (cron Workera), wykresy dłuższe niż rok czytają z D1.
- **K-169 — biblioteka wykresów:** Chart.js + `react-chartjs-2` — kryterium właściciela: popularność i dokumentacja (npm 2026-10: Recharts ~64 mln/tydz., w dużej części pośrednio przez shadcn/ui, słabsza dokumentacja; Chart.js ~17 mln, najlepsza dokumentacja; ECharts ~9 mln). Ładowany tylko w panelu. `chartjs-plugin-zoom` — opcjonalnie, za zgodą.
- **K-170 — Oferty v1 = tylko LSŚ:** edycja danych sezonu (`facts`: sezon, termin, miejsce, odbiorcy, cena, zapisy — start, zasady, temat maila, ręczne „zapisy otwarte”, daty ISO dla „Najbliższe”) i listy „Gdzie byliśmy” (`whereWeWere`, K-126). Leady i treść strony stałe — poza panelem. Dane sezonu LSŚ przeniesione z frontmattera MDX (obiekt JS) do pliku JSON obok; typy bez zmian. Rytm zmian: `docs/wpisy-cykliczne-plan-redakcja-ejk.md` (III — zapisy, VIII–IX — „Gdzie byliśmy”).
- **K-171 — Aktualności v1:** formatki = istniejące układy `wydarzenie` / `galeria` / `program` (K-153) + `kind`; formularz pokazuje pola właściwe dla układu (pola i reguły: `docs/wpisy-cykliczne-aktualnosci-ejk.md`); treść w prostym edytorze (nagłówki, pogrubienie, linki, listy) zapisującym MDX; bez nowych typów i układów. „Zapisz szkic” → D1 (bez builda); podgląd w panelu komponentami strony; „Opublikuj” → commit; edycja i ukrycie istniejącego wpisu tą samą drogą.
- **K-172 — zdjęcia we wpisach (bez biblioteki):** wgrywanie w formularzu wpisu; przeglądarka zmniejsza do rozmiaru źródłowego; `alt` wymagany; limit 20 zdjęć na wpis (większe relacje — przez repo); szkic trzyma zdjęcia w D1; publikacja commituje je razem z MDX do `public/media/news/<slug>/`; warianty WebP robi istniejący pipeline 11b (`images:variants`). **Biblioteka mediów → v2** (R2 + D1, kategorie, filtry, import istniejących zdjęć — ustalenia z sesji w „Backlog”).
- **K-173 — makiety:** ekrany panelu projektowane w Claude Design przed implementacją (12-0); do rozważenia jasne tło (panel roboczy, nie strona publiczna). Tokeny strony (fonty, kolory akcentu) jako punkt wyjścia; zakazy z `CLAUDE.md` (cienie, zaokrąglenia, 13 px) obowiązują także panel, chyba że makieta i właściciel zdecydują inaczej.

## Pliki i komponenty

Orientacyjnie — szczegóły w checkpointach.

| Plik | Nowy/zmiana | Odpowiedzialność |
| --- | --- | --- |
| `admin/` (`package.json`, `next.config.ts` z `basePath: "/admin"`, `wrangler.jsonc`, `open-next.config.ts`, `src/app/…`) | nowy | aplikacja panelu, osobny Worker |
| `admin/src/lib/github.ts` | nowy | 12c: commit wielu plików jednym commitem (Git Data API) |
| `admin/src/lib/posthog.ts`, `admin/src/lib/analyticsStore.ts` | nowy | 12b: zapytania HogQL, dzienne sumy w D1 |
| `admin/migrations/*.sql` | nowy | D1: szkice, dzienne sumy, dane WP |
| `scripts/import-wp-statistics.ts` | nowy | 12b: CSV z WP Statistics → dane panelu (mapa 301 dla adresów) |
| `content/offers/letnia-szkola-swiatla.season.json` (nazwa do potwierdzenia w 12c) | nowy | 12c: dane sezonu LSŚ |
| `content/offers/letnia-szkola-swiatla.mdx`, `src/content/offers.ts` | zmiana | 12c: frontmatter bez danych sezonu; loader scala JSON |
| `docs/brief-claude-code.md` §2 | zmiana | linia „Treść (v2)” → K-166 / K-167 (zrobione przy zapisie planu) |
| `docs/admin-ejk.md`, `docs/runbook.md` | nowy / zmiana | 12f |

## Kawałki

Kolejność: 12-0 → 12a → 12b → 12c → 12d → 12e → 12f. Checkpoint po każdym.

### Kawałek 12-0 — Makiety

Zakres: prompt do Claude Design (przygotowuje Claude, wzór: `docs/archive/plans/10-k3-news-mockup-v2-prompt.md`) — ekrany: powłoka panelu (nawigacja zakładek, nagłówek, wylogowanie), Analityka (desktop + mobile), Oferty → LSŚ, Aktualności — lista, formularz w 3 układach z podglądem, wgrywanie zdjęć z `alt`; stany: pusty, błąd, zapisywanie, „publikacja w toku (~2 min)”. Wariant jasnego tła. Makiety tworzy i wgrywa do `design/` właściciel.
Kryterium „gotowe”: makiety zatwierdzone przez właściciela i zapisane w `design/` (z README).

### Kawałek 12a — Szkielet

Zakres: aplikacja `admin/` (Next.js, ta sama wersja co strona, OpenNext), osobny projekt Workers Builds (`admin/` jako katalog główny); **watch paths**: strona ignoruje `admin/**`, panel buduje się przy `admin/**` i `src/content/**`; routing `www.akademiaikony.pl/admin*` → Worker panelu (sprawdzić pierwszeństwo względem Custom Domain strony — ryzyko niżej); Cloudflare Access na `/admin*` (K-167); D1 podpięte; powłoka panelu wg makiety; import typów ze `src/content/types.ts`.
Kryterium „gotowe”: `/admin` na podglądzie i na domenie wymaga logowania Access; po zalogowaniu powłoka z pustymi zakładkami; strona publiczna — build, wielkość Workera i wyniki bez zmian; build i lint obu aplikacji OK.

### Kawałek 12b — Analityka

Zakres: K-168, K-169 — klucz `phx_…` (tylko odczyt) jako sekret Workera; zapytania HogQL po stronie serwera z filtrem `$host` produkcji; 5 wykresów + wybór okresu + przełącznik dzień / tydzień / miesiąc; cron dzienny zapisujący sumy do D1; `scripts/import-wp-statistics.ts` (CSV z 11f → D1, stare adresy przez mapę 301); seria „Stara strona” i adnotacja o metodzie liczenia.
Kryterium „gotowe”: wykresy na prawdziwych danych produkcji; seria „Stara strona” widoczna na wykresie odwiedzin; klucz nie trafia do przeglądarki; czytelne na 390 px i desktopie; nawigacja klawiaturą po kontrolkach.

### Kawałek 12c — Oferty: Letnia Szkoła Światła

Zakres: K-170 — dane sezonu LSŚ i `whereWeWere` z frontmattera do JSON (strona renderuje się identycznie — `check:visual`); serwis commitów (`admin/src/lib/github.ts`, token z dostępem tylko do tego repo); formularz z walidacją (`zod`), podpowiedzi formatu dat; „Zapisz” → commit → informacja o czasie publikacji.
Kryterium „gotowe”: zmiana terminu / zapisów w panelu → po buildzie widoczna na `/warsztaty/letnia-szkola-swiatla` i w „Najbliższe”; błędne dane zatrzymane w formularzu, nie w buildzie; commit z czytelnym komunikatem.

### Kawałek 12d — Aktualności

Zakres: K-171 — lista wpisów (filtr po roku i `kind`, szkice osobno); formularz wpisu zależny od układu; edytor treści (wybór biblioteki w tym kawałku, za zgodą — K-164); szkice w D1; podgląd komponentami strony; publikacja, edycja, ukrycie istniejącego wpisu; walidacja zgodna z `check:content`.
Kryterium „gotowe”: nowy wpis każdego układu od szkicu do publikacji bez dotykania repo; edycja istniejącego wpisu nie psuje MDX (porównanie diffu); build strony przechodzi po publikacji.

### Kawałek 12e — Zdjęcia we wpisach

Zakres: K-172 — wgrywanie w formularzu, zmniejszanie w przeglądarce, wymagany `alt`, opcjonalny podpis, kolejność, `columnImageIndex` i `cover` gdzie dotyczy; limit 20; zdjęcia szkicu w D1; publikacja commituje MDX + pliki.
Kryterium „gotowe”: relacja z galerią (np. 12 zdjęć z telefonu) opublikowana z panelu; warianty WebP z 11b generują się w buildzie; wpis bez `alt` nie przejdzie.

### Kawałek 12f — Domknięcie

Zakres: krótka instrukcja dla EJK (`docs/admin-ejk.md`: logowanie, wpis, LSŚ, analityka); runbook (`docs/runbook.md` — panel, sekrety, rotacja tokenów, D1); dokumenty zsynchronizowane.
Kryterium „gotowe”: instrukcja przejrzana przez właściciela; DoD etapu odhaczone.

## Dane sample dodawane w tym etapie

Brak.

## Kryteria ukończenia etapu

- [ ] `/admin` dostępny tylko po logowaniu Access, dla 2 kont;
- [ ] Analityka: 5 wykresów na danych produkcji, porównanie ze starą stroną, dzienne sumy zapisywane w D1;
- [ ] LSŚ: zmiana danych sezonu z panelu widoczna na stronie i w „Najbliższe”;
- [ ] Aktualności: wpis w każdym z 3 układów utworzony, opublikowany i zedytowany z panelu, ze zdjęciami;
- [ ] strona publiczna: build, wielkość Workera, Lighthouse bez regresji;
- [ ] `npm run build` i `npm run lint` (strona i panel) przechodzą; panel obejrzany na 390 px i desktopie; nawigacja klawiaturą działa;
- [ ] instrukcja dla EJK i runbook.

## Ryzyka i pytania otwarte

- **Routing `/admin` na tej samej domenie:** w 11f strona dostaje Custom Domain (K-161); trzeba sprawdzić w dokumentacji Cloudflare, czy route `/admin*` drugiego Workera ma pierwszeństwo przed Custom Domain. Alternatywy: strona na route `www…/*` zamiast Custom Domain albo przekazanie `/admin*` ze strony do panelu przez Service Binding. Rozstrzygnięcie w 12a — zgłoszone w checkpoincie.
- **Podgląd komponentami strony:** panel importuje komponenty i style strony (`src/components`, tokeny) — ryzyko konfliktu Tailwind i wagi bundla panelu; w razie problemów podgląd uproszczony. Decyzja w 12d.
- **Edycja istniejących wpisów:** 77 wpisów to MDX z `export const frontmatter = {…}` (obiekt JS) — parser musi czytać i zapisywać ten format bez strat; wpisy z niestandardowym MDX (komponenty w treści) mogą być tylko do odczytu w panelu.
- **Budżet buildów:** każda publikacja = pełny build strony (~4 min z wariantami obrazów); limit Free 3000 min / mies. — przy kilku publikacjach tygodniowo bez ryzyka.
- **Retencja PostHog 1 rok:** dzienne sumy w D1 od startu 12b; dane sprzed 12b (od 11f) — jednorazowy import przez API w 12b, dopóki są w PostHogu.
- **Nowe zależności (za zgodą, K-164):** `chart.js`, `react-chartjs-2`, `zod`, edytor treści (12d), adapter OpenNext i `wrangler` dla `admin/`; `chartjs-plugin-zoom` opcjonalnie.
- `CLAUDE.md` wymienia w `docs/plans/` tylko plan 11 — do aktualizacji przez właściciela przy starcie etapu.

## Backlog (po v1)

- **v1.1:** kurs (dane sezonu — IX), sezon wykładów (`content/lectures/*.json`, prelegenci — IX), wystawa doroczna (`annual.json` — VI).
- **v2 — biblioteka mediów:** R2 (pliki) + D1 (metadane); optymalizacja w przeglądarce przed wysłaniem (kilka szerokości, WebP — jak 11b); kategorie wyjściowe do korekty z EJK: ikony (galeria), wystawy, plener (LSŚ), pracownia / kurs, wykłady, wydarzenia, ludzie, inne; filtry: kategoria, rok, orientacja, użyte / nieużyte, wyszukiwanie po `alt`; import ok. 580 istniejących zdjęć do indeksu bez przenoszenia plików (kategoria z folderu, `alt` z treści); serwowanie z R2 na stronie (loader `next/image`) do zaprojektowania.
- Przełącznik słupki ↔ area na wykresie odwiedzin.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| --- | --- | --- |
| 12-0 Makiety | ⬜ | |
| 12a Szkielet | ⬜ | |
| 12b Analityka | ⬜ | |
| 12c Oferty: LSŚ | ⬜ | |
| 12d Aktualności | ⬜ | |
| 12e Zdjęcia we wpisach | ⬜ | |
| 12f Domknięcie | ⬜ | |
