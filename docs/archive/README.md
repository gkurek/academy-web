# Archiwum dokumentów

> **Nie czytaj tego katalogu w normalnej sesji.** Sięgaj tu wyłącznie po rekonstrukcję
> zamkniętej decyzji — gdy potrzebujesz uzasadnienia albo pomiarów z etapów 1–9
> lub z zamkniętych kawałków etapu 10, których nie ma w żywych dokumentach.
>
> Wiążący stan aktualny: `CLAUDE.md` → `docs/plan-claude-code.md` → `docs/brief-claude-code.md`.
> Przy rozbieżności między archiwum a żywym dokumentem **wygrywa żywy dokument** — archiwum
> zapisuje stan na dzień zamknięcia, nie stan docelowy.

Utworzone 2026-09-26, po zamknięciu etapu 8b. Uzupełnione 2026-10-02 (plany etapu 9)
i 2026-10-04 (plany kawałków 10/k1–k7, raport migracji — porządki przed k8).

**Ścieżki wewnątrz archiwum nie są przepisywane.** Pliki tutaj cytują dawne adresy
(`docs/plans/0N-*.md`, `docs/copy-o-akademii-pracownia.md`) — 79 takich odwołań. Dziś prowadzą
do `docs/archive/...`, wystarczy dopisać `archive/`. Zostawione świadomie: przepisanie oznaczałoby
edycję treści zamkniętej, a obietnica „bajt w bajt" jest warta więcej niż klikalność linku
w dokumencie, którego w normalnej sesji nie czytamy. Odwołania do plików, które zniknęły w trakcie
budowy (`content/exhibition/editions.json`, `content/offers/wyklady.mdx` w dawnym kształcie),
zostają jako zapis stanu z dnia zamknięcia.
Pliki zostały **przeniesione** (`git mv`), nie skopiowane — nie istnieje ich druga, „odchudzona"
wersja w `docs/`. Treść jest bajt w bajt taka, jak w dniu zamknięcia.

## Zapis historyczny planu głównego — `plan-claude-code-historia.md`

Wydzielony z `docs/plan-claude-code.md` v0.6 przy rozcięciu na wersję żywą i historyczną (2026-09-26),
uzupełniony w v0.9 (2026-10-04). Zawiera §3H opisy etapów 1–8b, §3I opis etapu 9, §4H zamknięte
decyzje (95 wierszy), §5H odhaczone pozycje treści, §6H dziennik do 2026-10-01 + szczegółowe kroki
fali 1 etapu 10, załączniki B (prompty) i C.

Rejestr decyzji jest **podzielony rozłącznie** między §4H a `docs/plan-claude-code.md` §4.
Numeracja `K-xx` jest globalna, więc każdy numer leży w dokładnie jednym z dwóch plików —
żaden wiersz nie jest powtórzony. Szablon planu etapu (Załącznik A) został w żywym dokumencie.

## Raport migracji — `migrate-report.md`

Dawniej `scripts/migrate-report.md`; przeniesiony 2026-10-04. Log operacyjny etapu 9: gate'y P0–P8,
zamrożenia, media M0–M6, DoD #3–#8, backlog wystaw dorocznych R1–R9. **Migracja jest zamknięta na stałe**
— skryptów `scripts/migrate-wp/` nie uruchamiamy ponownie (`report.ts` nadal wskazuje starą ścieżkę;
decyzja o martwym kodzie — etap 10, k10, B5). Otwarte pozycje dla EJK przepisane do
`docs/plan-claude-code.md` §5 (T1–T30).

## Plany zamkniętych etapów i kawałków — `archive/plans/`

Poprzednia ścieżka: `docs/plans/`. W `docs/plans/` zostają wyłącznie plany otwarte (dziś: 10, 11).

| Plik | Etap | Zamknięty |
| --- | --- | --- |
| `01-skeleton.md` | 1 — szkielet, design system, warstwa treści | 2026-09-12 |
| `02-homepage.md` | 2 — strona główna | 2026-09-12 |
| `03-oferta.md` | 3 — strony ofertowe | 2026-09-17 |
| `04-wyklady.md` | 4 — wykłady | 2026-09-18 |
| `04b-review-fixes.md` | 4b — korekty po przeglądzie stagingu | 2026-09-19 |
| `05-galeria.md` | 5 — galeria ikon | 2026-09-20 |
| `05b-review-fixes.md` | 5b — korekty galerii | 2026-09-20 |
| `06-o-akademii.md` | 6 — o akademii i pracownia | 2026-09-21 |
| `07-aktualnosci.md` | 7 — aktualności | 2026-09-22 |
| `07b-review-fixes.md` | 7b/7c — korekty aktualności | 2026-09-22 |
| `08-pozostale.md` | 8 — strony pozostałe | 2026-09-26 |
| `08b-review-fixes.md` | 8b — przebudowa wystawy, korekty | 2026-09-26 |
| `09-migration-v2.md` | 9 — migracja WP, plan nadrzędny (kawałki v2 1–3, DoD 8/8) | 2026-10-01 |
| `09-migration.md` | 9 — CLI migracji (`--dry-run`, `--only`, `--force`; K-122) | 2026-10-01 |
| `09-migration-wp-pages.md` | 9 — inwentaryzacja stron WP (P0–P8) | 2026-10-01 |
| `09-migration-media.md` | 9 — media (M0–M6) | 2026-10-01 |
| `09-migration-source.md` | 9 — zrzut treści źródłowych stron WP (copy do gate'ów) | 2026-10-01 |
| `10-k1-exhibitions.md` | 10/k1 — `/ikony/wystawy` (K-127, K1–K4) | 2026-10-03 |
| `10-k2-lightbox.md` | 10/k2 — lightbox (G1–G3, D1–D9) | 2026-10-03 |
| `10-k3-news.md` | 10/k3 — aktualności (D1–D11, E1–E8, F1–F12, k3f D-a–D-d) | 2026-10-03 |
| `10-k3-news-mockup-v2-prompt.md`, `10-k3-news-mockup-v2-1-prompt.md` | 10/k3 — prompty do Claude Design (runda 2 i 2.1) | 2026-10-03 |
| `10-k4-home.md` | 10/k4 — strona główna (N1–N10) | 2026-10-04 |
| `10-k5-album.md` | 10/k5 — album (AL1–AL8) | 2026-10-04 |
| `10-k6-lectures.md` | 10/k6 — wykłady (LK1–LK6) | 2026-10-04 |
| `10-k7-layout.md` | 10/k7 — reszta layoutu (LY1–LY6) | 2026-10-04 |

## Dokumenty sesji zamkniętych

| Plik | Co to jest | Data | Uwaga |
| --- | --- | --- | --- |
| `08-review-staging.md` | Ewaluacja stagingu E08-11 — materiał wejściowy do 08b | 2026-09-22 | Opisuje stan **sprzed** 08b, w tym trasę `/ikony/wystawa`, która dziś nie istnieje (jest `/ikony/wystawy`). Stan docelowy: `archive/plans/08b-review-fixes.md`. |
| `plan-aktualizacji-dokumentow-publikacje.md` | Sesja dokumentacyjna Publikacje (K-76…K-78, D-06) | 2026-09-22 | Zamknięta; kod wykonany w etapach 8/8b. |
| `plan-aktualizacji-dokumentow-wydarzenia.md` | Sesja dokumentacyjna likwidacji działu „Wydarzenia" (K-50…K-58) | 2026-09-21 | **Odzyskany z historii gita** (usunięty omyłkowo w `2048be9`, mimo 5 żywych odwołań). Patrz ostrzeżenie niżej. |
| `copy-o-akademii-pracownia.md` | Copy do slotów makiety `/o-akademii` i `/pracownia` | 2026-09-20 | Wdrożone w etapie 6 do `content/pages/{o-akademii,pracownia}.json`. Nadal źródło dla otwartych pozycji §5 („copy doc pyt. 1/2"). |

### Ostrzeżenie: `plan-aktualizacji-dokumentow-wydarzenia.md` jest częściowo nieaktualny

Plik jest promptem sesji z 2026-09-21 i zachowuje terminologię z tamtego dnia. Zmieniło się:

- `ExhibitionEdition` / `content/exhibition/editions.json` → **`AnnualExhibition` / `annual.json`**, trasa `/ikony/wystawa` → **`/ikony/wystawy`** (etap 8b, K-82…K-98);
- poświęcenia ikon: „materiał artykułu (K-55)" → **wpis Aktualności `kind: 'plener'` (K-77)**;
- „etap 10" w §5 oznacza migrację WP, która po zamianie etapów z 2026-09-22 jest **etapem 9**;
- plakaty: „bez decyzji" → rozstrzygnięte jako `News.poster` (K-78), pole `poster` w `AnnualExhibition` usunięte (K-98).

**Wiążąca wersja zasad migracji dawnych „Wydarzeń" to `docs/archive/plan-claude-code-historia.md` §3I (etap 9 zamknięty).**
Ten plik czytaj tylko po uzasadnienie pojedynczej decyzji (np. dlaczego nie migrujemy części
merytorycznej wpisu o Sercu Jezusa) i po szczegóły źródłowe, których żywy plan nie powtarza.
