# Plan 10 — Finishing (ewaluacja, poprawki, SEO, optymalizacja)

Status: **zatwierdzony** 2026-10-03 · fala 1 ✅ 2026-10-04 · **następny: kawałek 8**  
Gałąź: `feat/10-finishing`  
Makiety: tokeny `design/README`, odczyt wartości `docs/design-mockup-guide.md`. Fala 2 nie ma nowych makiet.

## Cel i zakres

Domknięcie serwisu na prawdziwych danych z etapu 9 przed wdrożeniem (etap 11). Praca w dwóch falach:

1. **Fala 1 — poprawki i refaktory** (layout, IA, komponenty, wzorce UI) — **zamknięta** 2026-10-04.
2. **Fala 2 — treść, SEO, audyty** — k8 treść i gate EJK → k9 SEO/analityka/JSON-LD → k10 audyty, ewaluacja kodu, dokumentacja.

**Poza zakresem etapu 10:** hosting, DNS, runbook (etap 11); **CMS wykładów i aktualności** (osobny projekt po etapie 11); zmiany w `design/` przez Claude Code; nowe zależności npm bez uzgodnienia; migracja WP — zamknięta na stałe, skryptów `scripts/migrate-wp/` nie uruchamiamy.

## Decyzje wiążące dla fali 2

| ID | Decyzja |
| --- | --- |
| **K-122** | Gate w czacie przed zapisem treści redakcyjnej w `content/` — pozycja po pozycji, z akceptacją właściciela; refaktory UI — zwykły checkpoint po kawałku. |
| **Treść z makiet** | Copy z Claude Design ≠ treść klienta — nowe twierdzenia → `[do uzupełnienia]` albo gate EJK (lista: `docs/plan-claude-code.md` §5, m.in. T22). |
| **Kolejność** | k8 → k9 → k10; k10 obejmuje synchronizację dokumentów z kodem, więc idzie ostatni. Blok R (review) równolegle do k8 — RV-1, `10-review.md`. |

## Fala 1 — podsumowanie (zamknięta 2026-10-04)

Szczegóły, decyzje kawałków i checkpointy — w `docs/archive/plans/`. Decyzje rejestru — `docs/plan-claude-code.md` §4.

| Kawałek | Wynik | Decyzje | Plan |
| --- | --- | --- | --- |
| 1 — `/ikony/wystawy` | Układ K-127 (13a/14a) + korekty K1–K4; P4 Tura B R1, R2, R7, R8; „Wystawy wyjazdowe” `#wyjazdowe` | K-127, K-87 | `10-k1-exhibitions.md` |
| 2 — lightbox | G1–G3: brak flashu, cap skali, modal treści vs ikon, siatki D9, tryb single; K-38 iOS OK | — | `10-k2-lightbox.md` |
| 3 — aktualności | K-69 kierunek B; `News.layout`, bez `poster`; nowy szablon wpisu; wpisy cykliczne | K-128–K-135 | `10-k3-news.md` |
| 4 — strona główna | „Najbliższe” — 3 kafle liczone z dat + `upcomingOverrides[]`; H3 bez błędu | K-136 | `10-k4-home.md` |
| 5 — album | Spis wg rozdziałów, skany, optymalizacja mediów | K-137, K-138 | `10-k5-album.md` |
| 6 — wykłady | Przegląd tras, a11y akordeonu, `News.lectureSeason` | K-139 | `10-k6-lectures.md` |
| 7 — reszta layoutu | I1, O1–O3, S1, stopka C1 (K-36) | — | `10-k7-layout.md` |
| — poprawka po review | Stopka **Stopka v2** (3a/3b), **K-149** — poza k7, po zamknięciu bloku R | K-149 | `design/Akademia Ikony - Stopka v2.dc.html` |

## Kawałki — fala 2

### Kawałek 8 — Treść i gate EJK

**Zakres:** backlog treści **T1–T30** w `docs/plan-claude-code.md` §5 — galeria, zamówienie, oferty, LSŚ, aktualności, wykłady, wystawy, album, O nas / pracownia, przegląd `alt`/`caption` całego serwisu, inwentarz zdjęć inline do lightboxa. Każda pozycja przez gate K-122.

**Kryterium „gotowe”:** każda pozycja T1–T30 zamknięta albo świadomie odłożona (z adnotacją w §5); brak `[do uzupełnienia]` widocznego na produkcji poza uzgodnionymi wyjątkami; build + lint OK.

### Kawałek 9 — SEO, analityka, JSON-LD

**Zakres:** `docs/plan-claude-code.md` §3 etap 10, pkt 2 — metadata + OG, `sitemap.ts`, `robots.ts`, JSON-LD (`Organization`, `Person`, `Event` — K-17, `Course`, `Book`/`Article` — K-76), analityka bez ciasteczek (K-07, K-15), aktualizacja polityki prywatności (K-119). Plus pozycje z backlogu niżej oznaczone k9.

### Blok R — Review serwisu (równolegle do k8)

**Zakres:** review techniczne (R0–R5), wizualne (V1–V4) i — po EJK — zgodności z planem i treści (C1–C2); poprawki osobnym planem `docs/archive/plans/10-review-fixes.md`. Plan, decyzje RV-1…RV-7 i postęp: **`docs/plans/10-review.md`**. Przejmuje z k10 ewaluację kodu i przegląd tras (RV-1).

### Kawałek 10 — Audyty, dokumentacja

**Zakres (okrojony przez RV-1):** ewaluacja kodu dodanego w k9 (delta po bloku R); Lighthouse dla 5 tras (`docs/lighthouse/`); synchronizacja dokumentów; przygotowanie testu 301 na stagingu (wykonanie — etap 11). Plus pozycje z backlogu niżej oznaczone k10 — B4 i B5 wchodzą jako wyłączenia do R0 i rozstrzygnięcie w `docs/archive/plans/10-review-fixes.md`.

## Backlog fali 2 — poza treścią

Pozycje techniczne i decyzje przeniesione z kawałków fali 1. Treść EJK — `docs/plan-claude-code.md` §5.

| # | Kawałek | Pozycja | Źródło |
| --- | --- | --- | --- |
| B1 | k9 | CTA „Zapisy” w nagłówku desktop — decyzja z danymi analityki (K-35) | `10-k7-layout.md` LY6 |
| B2 | k9 | JSON-LD `Book`: `hasPart` może korzystać z `Publication.chapters` (K-137) | `10-k5-album.md` § Ryzyka |
| B3 | k9 | Rozważyć `ExhibitionEvent` dla `/ikony/wystawy` | §3 etap 10 |
| B4 ✅ | k10 | `mdx-components.tsx` używa wartości arbitralnych Tailwind (`[&:has(>em:only-child)]…`) — wbrew konwencji repo. **Zamknięte:** w `mdx-components.tsx` jest 0 wartości arbitralnych (R4, status B4); `10/RF-6` | `10-k3-news.md` § Diagnoza |
| B5 ✅ | k10 | `scripts/migrate-wp/` — martwy kod po zamkniętej migracji (`report.ts` wskazuje na przeniesiony `scripts/migrate-report.md`); zdecydować: usunąć czy zostawić jako zapis. **Zamknięte:** usunięte w `10/RF-6` razem z 13 skryptami jednorazowymi i `archive/wp-fetch-static/`; historia w git | porządki 2026-10-04 |
| B6 | k10 | `imageLarge` w `IconWork` (K-39) — tylko jeśli Lighthouse lub przegląd pokaże, że cap skali nie wystarcza | `10-k2-lightbox.md` |
| B7 | po prezentacji | Sticky `FactsBox` na stronach ofertowych (K-37) | `10-k7-layout.md` LY6 |
| B8 | po prezentacji | Filtr Aktualności po wystawach dla linku „Fotorelacje z poprzednich wystaw dorocznych” (dziś `/aktualnosci` bez filtra) | `10-k3-news.md` § Ryzyka |
| B9 | etap 11 | Dobowy rebuild albo ISR na hostingu — warunek poprawnych kafli „Najbliższe” i stanu wystawy (K-136 N9, K-85) | `10-k4-home.md` N9 |
| B10 | właściciel / Claude Design | `design/README` nie opisuje makiety wystaw 13a/14a; **`design/README` — opis stopki nadal niezsynchronizowany** (w kodzie: **K-149** / Stopka v2; góra `#1a140f`, legal `#120e0b`) | `10-k1-exhibitions.md`, `10-k7-layout.md` |

## Dane sample w tym etapie

Brak nowych plików `sample`. Placeholdery `[do uzupełnienia]` — wiersz w `docs/plan-claude-code.md` §5.

## Kryteria ukończenia etapu (DoD)

Z `docs/plan-claude-code.md` §3, etap 10:

- [ ] przegląd wszystkich tras z briefu §3 odhaczony; lista poprawek po prezentacji zamknięta lub świadomie przeniesiona do wdrożenia;
- [ ] walidator schema.org bez błędów dla czterech typów; podgląd OG sprawdzony dla strony głównej i jednej ofertowej;
- [ ] zdarzenia analityczne widoczne w panelu narzędzia w środowisku testowym;
- [ ] przegląd kodu zakończony: usunięte lub uzasadnione miejsca over-engineered; brak oczywistych duplikacji i naruszeń konwencji repo;
- [ ] raport Lighthouse dla 5 tras (główna, kurs, wykłady, galeria `/ikony`, aktualności) w `docs/lighthouse/`;
- [x] lightbox `/ikony` na iOS Safari (K-38) — test OK 2026-10-03;
- [ ] `npm run build` i `npm run lint` bez regresji; dokumentacja zsynchronizowana z kodem i decyzjami etapu.

## Ryzyka i pytania otwarte

- **K-07** Plausible vs Umami — rozstrzygnąć na starcie k9 (wpływa na politykę prywatności, K-119).
- **Prezentacja z klientem** — termin i staging; od niej zależą B7, B8 i część DoD #1.
- **Tempo k8** — zależy od odpowiedzi EJK; pozycje bez odpowiedzi odkładamy z adnotacją w §5, nie blokują k9.

## Postęp

| Kawałek | Status | Uwagi |
| --- | --- | --- |
| 1–7 — fala 1 | ✅ | 2026-10-03 … 2026-10-04; tabela „Fala 1 — podsumowanie” wyżej |
| Stopka v2 (K-149) | ✅ | 2026-10-07; mapa stopki + `sectionNav.kontakt` (/kontakt · /polityka-prywatnosci); poza k7, po przeglądzie makiety Claude Design |
| 8 — treść EJK | ⬜ | backlog T1–T30 (`docs/plan-claude-code.md` §5) |
| R — review serwisu | ✅ część techniczna i wizualna 2026-10-06 | R0–R5, RF-0…RF-20, V1–V4 zamknięte; zostaje C1–C2 po k8; postęp w `10-review.md`, `docs/archive/plans/10-review-fixes.md` |
| 9 — SEO / analityka | ⬜ | |
| 10 — audyty / docs | ⬜ | okrojony przez RV-1 |
