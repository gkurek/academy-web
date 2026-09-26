# Archiwum dokumentów

> **Nie czytaj tego katalogu w normalnej sesji.** Sięgaj tu wyłącznie po rekonstrukcję
> zamkniętej decyzji — gdy potrzebujesz uzasadnienia albo pomiarów z etapu 1–8b,
> których nie ma w żywych dokumentach.
>
> Wiążący stan aktualny: `CLAUDE.md` → `docs/plan-claude-code.md` → `docs/brief-claude-code.md`.
> Przy rozbieżności między archiwum a żywym dokumentem **wygrywa żywy dokument** — archiwum
> zapisuje stan na dzień zamknięcia, nie stan docelowy.

Utworzone 2026-09-26, po zamknięciu etapu 8b, przed sesją planistyczną etapu 9.

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

Wydzielony z `docs/plan-claude-code.md` v0.6 (638 linii) przy rozcięciu na wersję żywą (350 linii)
i historyczną (383 linie). Zawiera §3H opisy etapów 1–8b, §4H **65 zamkniętych** decyzji,
§5H odhaczone pozycje treści makietowych, §6H dziennik 2026-09-11…2026-09-26, załączniki B i C.

Rejestr decyzji jest **podzielony rozłącznie**: 53 wiersze żywe dla etapów 9–11 zostały
w `docs/plan-claude-code.md` §4, pozostałe 65 jest tutaj. Numeracja `K-xx` jest globalna,
więc każdy numer leży w dokładnie jednym z dwóch plików — żaden wiersz nie jest powtórzony.
Szablon planu etapu (Załącznik A) został w żywym dokumencie, bo jest potrzebny do planów 9–11.

## Plany zamkniętych etapów — `archive/plans/`

Poprzednia ścieżka: `docs/plans/`. W `docs/plans/` zostają wyłącznie plany etapów **9, 10, 11**.

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

**Wiążąca wersja zasad migracji dawnych „Wydarzeń" to `docs/plan-claude-code.md` §3, etap 9.**
Ten plik czytaj tylko po uzasadnienie pojedynczej decyzji (np. dlaczego nie migrujemy części
merytorycznej wpisu o Sercu Jezusa) i po szczegóły źródłowe, których żywy plan nie powtarza.
