# Plan — strony WordPress (etap 9, po kawałkach 1–2 v2)

Status: **zatwierdzony do realizacji** (2026-09-27) — handoff do nowej sesji.  
Gałąź: `feat/09-migration`  
Nadrzędny plan: `docs/plans/09-migration-v2.md` (kawałek **3 v2** — ten dokument zawęża zakres do **29 stron `/pages`** i decyzji właściciela; media i `grep sample` są **osobnym** wątkiem w tym samym kawałku 3, ale **nie** w pierwszych pod-kawałkach poniżej, chyba że decyzja strony tego wymaga).

## Kontekst dla nowej sesji

**Zamknięte (nie fetchować ponownie pod te domeny):**

- Kawałek **1 v2:** rdzeń redakcyjny — URL-e w `scripts/migrate-report.md` § „WP zamknięte — kawałek 1 v2”.
- Kawałek **2 v2:** wszystkie **61 postów** WP + wykłady — `scripts/migrate-report.md` § „WP zamknięte — kawałek 2 v2”; `content/news/` bez `sample-*.mdx`; `content/lectures/` 2012/2013–2026/2027.

**Źródło WP:** `https://www.akademiaikony.pl` (REST, **K-121**). Gate przed zapisem: **K-122**. Treści rdzeniowe warsztatów/O nas **nie** z masowego `--only=static` (**K-123**).

**Ten dokument:** wyłącznie **strony** (`wp/v2/pages`, 29 rekordów, stan API 2026-09-27). Posty są rozstrzygnięte; wyjątki treści z postów powiązane ze stronami (np. `ikona-korzenie-i-owoce-wiary-2` → wystawy) są w tabelach poniżej.

## Hierarchia WP (parent → dzieci)

```
strona-glowna (0)
├── celem-dzialalnosci… (= O nas)
├── pracownia
├── kontakt
├── polityka-prywatnosci
└── aktualnosci

ikona (291)
├── galeria
├── wystawy
└── ikony-na-zamowienie

warsztaty (313)
├── warsztaty-roczne
├── warsztaty-wakacyjne
└── zapisy-na-warsztaty

wyklady (314)
├── tematy
├── wykladowcy
└── zapisy-na-wyklady

publikacje (2862)
├── artykuly
├── plakaty
└── multimedia

(root): blog, konsultacje…, oprowadzania-kuratorskie, poswiecenia-ikon,
         wernisaze, wydarzenia, wyjazdy-studyjne, warsztaty, wyklady, publikacje
```

## Inwentaryzacja — wszystkie 29 stron

Legenda **Status:**  
`ZAMKNIĘTE` — treść uznana za zmigrowaną (k1/k2 lub świadomy „zostaw”).  
`HUB` — na WP był opis/hub; na nowej stronie treść jest w innych plikach — wystarczy redirect + ewent. weryfikacja luk.  
`DECYZJA` — wymaga decyzji właściciela przed implementacją.  
`WYKONANIE` — decyzja wiążąca z briefem/planem już jest; zostało mapowanie + gate + zapis.  
`POMIŃ` — świadomie bez migracji treści.

| # | Slug WP | Tytuł WP | Status | Trasa docelowa (brief §3 / §5) | Pliki w repo | Uwagi / następny krok |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `celem-dzialalnosci-akademii-ikony-…` | O nas | ZAMKNIĘTE | `/o-akademii` | `content/pages/o-akademii.*` | Zamrożenie „zostaw” k1 v2; media import niepodpięte → plan mediów |
| 2 | `pracownia` | Pracownia | ZAMKNIĘTE | `/pracownia` | `content/pages/pracownia.*` | j.w. |
| 3 | `kontakt` | Kontakt | ZAMKNIĘTE | `/kontakt` | `content/pages/kontakt.mdx` | |
| 4 | `polityka-prywatnosci` | Polityka | ZAMKNIĘTE | `/polityka-prywatnosci` | `content/pages/polityka-prywatnosci.json` | |
| 5 | `warsztaty` | Warsztaty | ZAMKNIĘTE | `/warsztaty` | `pl.ts` + oferty | Hub k1 v2 |
| 6 | `warsztaty-roczne` | Kurs roczny… | ZAMKNIĘTE | `/warsztaty/kurs-roczny-i-trzyletni` | `content/offers/kurs-roczny-i-trzyletni.mdx` | |
| 7 | `warsztaty-wakacyjne` | Letnia Szkoła… | ZAMKNIĘTE | `/warsztaty/letnia-szkola-swiatla` | `content/offers/letnia-szkola-swiatla.mdx` | |
| 8 | `zapisy-na-warsztaty` | Zapisy | ZAMKNIĘTE | CTA na ofertach | oferty + source | |
| 9 | `aktualnosci` | Aktualności | ZAMKNIĘTE | `/aktualnosci` | `content/news/*` | Strona WP = lista; treść w postach (k2) |
| 10 | `wyklady` | Wykłady | HUB | `/wyklady` | `content/lectures/2026-2027.json`, hub UI | Porównać intro WP vs hub; brak osobnego `page` w `content/` — OK jeśli program w JSON |
| 11 | `zapisy-na-wyklady` | Zapisy na wykłady | HUB | `/wyklady#zapisy` | sekcja na `/wyklady` | Weryfikacja vs WP (migrate-report k1: sprawdzone przy k2) |
| 12 | `tematy` | Tematy i terminy | HUB | `/wyklady` + `/wyklady/archiwum` | `content/lectures/*.json` | **DECYZJA:** czy na WP jest coś poza programem w JSON — jeśli nie, tylko **301** |
| 13 | `wykladowcy` | Wykładowcy | ZAMKNIĘTE | `/wyklady/wykladowcy` | `content/lecturers.json`, `lecturer-directory.json`, `lecturers-page.json` | P2 v2 — gate OK 2026-09-27; bez `sample` |
| 14 | `ikona` | Ikony | HUB | `/ikony` | hub + `icons.json` | Redirect `/ikona/` → `/ikony`; treść = galeria + podstrony |
| 15 | `galeria` | Galeria ikon | ZAMKNIĘTE | `/ikony` | `content/icons.json` | **P5 ✅** 2026-09-27 — 52 prace, kolejność WP; `sample` zdjęty; media `public/media/import/icons/`; tytuły/wymiary → etap 10 |
| 16 | `wystawy` | Wystawy | WYKONANIE | `/ikony/wystawy` | `exhibition/page.mdx`, `annual.json` | HTML WP + post `ikona-korzenie-i-owoce-wiary-2` (2 zdj.) + doroczne w news — **gate strona po stronie** |
| 17 | `wernisaze` | Wystawy ikon | HUB | `/ikony/wystawy` | j.w. | Stary hub; treść rozbita na wystawy + aktualności — **301**, bez duplikacji body |
| 18 | `ikony-na-zamowienie` | Zamówienia | ZAMKNIĘTE | `/ikony/na-zamowienie` | `content/offers/zamowienie.mdx`, `OfferLeadIntro` | P3 v2 ✅ 2026-09-27; copy + `leadIntro`; bez `sample`; **hero** sample → etap 10 |
| 19 | `oprowadzania-kuratorskie` | Oprowadzania | HUB | `/ikony/wystawy#oprowadzania` | news S2/S3 | Treść w `oprowadzania-po-wystawie-2017` + wpis kuratorski — **301** |
| 20 | `wyjazdy-studyjne` | Wyjazdy studyjne | HUB | `/aktualnosci` | news (plener/wyjazd) | **301** (K-50); ewent. lead na hubie wystaw — etap 10 |
| 21 | `wydarzenia` | Wydarzenia | POMIŃ / 301 | `/aktualnosci` | — | Hub nie migrować (K-50); **redirect obowiązkowy** |
| 22 | `strona-glowna` | Strona główna | WYKONANIE | `/` | `src/app/page.tsx` + `settings.json` + `icons.ts` | Brak `content/pages/home`; porównać WP z `upcoming` i **FEATURED_ICON_SLUGS** — decyzja redakcyjna home |
| 23 | `publikacje` | Publikacje | WYKONANIE | `/publikacje` | `content/publications/ikona-dzis.mdx` | Hub albumu; **`sample: true`**; ISBN/okładka EJK (część etap 8/10) |
| 24 | `artykuly` | Artykuły | WYKONANIE | `/publikacje#artykuly` | `content/articles/*.mdx` (4) | **DECYZJA:** które teksty z WP `artykuly` → które slugi; prawa do tekstów (§5 planu) |
| 25 | `plakaty` | Plakaty | DECYZJA | brak strony (K-78) | `News.poster` w news | ~20 plakatów — przypisanie do wpisów po weryfikacji EJK; nie migrować jako strona |
| 26 | `multimedia` | Multimedia | POMIŃ | `/publikacje` (K-78) | — | Film nie osadzany; **301**; ewent. link w artykule/albumie — EJK |
| 27 | `poswiecenia-ikon` | Poświęcenia | WYKONANIE | `/aktualnosci/[slug]` | **brak wpisu** | **K-77:** nowy wpis `kind: plener`, 6 zdj., redakcja EJK; **301** `/poswiecenia-ikon/` |
| 28 | `konsultacje-i-lekcje-indywidualne` | Konsultacje… | DECYZJA | brak w brief §3 | — | **Właściciel:** (A) redirect `/kontakt` lub `/warsztaty`, (B) akapit w ofercie kursu, (C) pominąć z 301 na `/kontakt` |
| 29 | `blog` | Blog | POMIŃ | Blogspot w stopce | `settings.json` `blogUrl` | Nie migrować |

## Powiązania post → strona (poza manifestem news)

| WP post / URL | Powiązana strona | Docelowy zasób | Stan |
| --- | --- | --- | --- |
| `ikona-korzenie-i-owoce-wiary-2` | `wystawy` | `content/exhibition/annual.json` + kotwice | Copy/media **nie** — gate S4 |
| `podsumowanie-2019` | `wernisaze` / wydarzenia | splity S1 + P4 (#1–#9) | **✅ zamknięte** — `migrate-report.md` § P4 Tura C |
| Duplikaty postów `149`, `wystawa-ikona-dzis-2` | — | kanoniczne news | **301** w brief §5 — dopisać do `docs/redirects.json` |

## Proponowane pod-kawałki (tylko strony + decyzje)

Realizacja **po jednym** z gate K-122; po każdym — wpis w `scripts/migrate-report.md` i aktualizacja `docs/redirects.json` (propozycja → zatwierdzenie → `next.config.ts` w osobnym mini-kroku lub na końcu).

| Pod-kawałek | Zakres | Kryterium gotowe |
| --- | --- | --- |
| **P0 — Decyzje** | Wiersze `DECYZJA` w tabeli (#12 tematy, #25 plakaty, #28 konsultacje) + backlog `podsumowanie-2019` (skrót) | Tabela „Decyzje zatwierdzone” w `migrate-report.md`; brak implementacji bez ✓ |
| **P1 — Redirecty hubów** | #14–21, #26, #29 + stare ścieżki z brief §5 dla stron | Wpisy w `docs/redirects.json` + notatka; build z `redirects` — po OK właściciela |
| **P2 — Wykładowcy** | #13 | Gate: WP HTML vs `lecturers.json`; zamrożenie; EJK tylko przy rozbieżnościach |
| **P3 — Zamówienie** | #18 | Gate: WP → `zamowienie.mdx`; zdjąć `sample` gdy copy docelowe (media może zostać sample do planu mediów) |
| **P4 — Wystawy** | #16–17 + post `ikona-korzenie…-2` | Gate: `page.mdx` + `annual.json`; bez masowego news; zdjąć `sample` gdy treść+struktura OK |
| **P5 — Galeria** | #15 | ✅ **zamknięty** 2026-09-27 — weryfikacja vs WP; `sample` zdjęty; media `import/icons/`; tytuły → etap 10 |
| **P6 — Publikacje** | #23–24 | Gate album + mapowanie artykułów WP; prawa — EJK |
| **P7 — Poświęcenia** | #27 | Nowy `content/news/*.mdx` + manifest; K-77; 301 |
| **P8 — Strona główna** | #22 | Gate: `settings.upcoming`, featured ikony, ewent. lead — bez nowego pliku `content/` jeśli wystarczy JSON/i18n |

**Kolejność rekomendowana:** P0 → P1 (szybkie domknięcie URL-i) → P7 (jeden wpis, jasna decyzja K-77) → P2 → P3 → P4 → P5 → P6 → P8.

**Poza tym dokumentem (ten sam kawałek 3 v2, osobna sesja lub późniejsze fale):** globalny plan mediów (`public/media/sample/` → import), plakaty → `poster`, pełne `grep sample`.

## Pliki i skrypty

| Plik | Rola |
| --- | --- |
| `docs/plans/09-migration-wp-pages.md` | Ten plan |
| `scripts/migrate-report.md` | Zamrożenia, decyzje P0, URL-e zamknięte per pod-kawałek |
| `docs/redirects.json` | Propozycje 301 (nie edytować `next.config.ts` bez uzgodnienia w planie 9) |
| `scripts/migrate-wp.ts` | Ewent. `--dry-run` fetch strony po slug (bez masowego body pod K-123) |
| `scripts/fetch-wp-gallery-sample.mjs` | Pomocniczy fetch `galeria` |
| `content/exhibition/*`, `content/icons.json`, `content/offers/zamowienie.mdx`, `content/publications/*`, `content/news/*` | Cele zapisu |

## Rytm (jak w `CLAUDE.md`)

Jeden pod-kawałek na turę → checkpoint → czekaj na OK. Nie commitować bez prośby (sesja lokalna).

## Postęp

| Pod-kawałek | Status | Uwagi |
| --- | --- | --- |
| P0 Decyzje | ✅ | 2026-09-27 — `migrate-report.md` § Decyzje P0 |
| P1 Redirecty hubów | ✅ | 2026-09-27 — 31 wpisów `docs/redirects.json`; OK właściciela; `/poswiecenia-ikon/` → P7 |
| P2 Wykładowcy | ✅ | 2026-09-27 — `lecturers.json` + directory + zdjęcia `/media/lecturers/`; gate właściciela; `migrate-report.md` § P2 |
| P3 Zamówienie | ✅ | 2026-09-27 — gate OK; `leadIntro` w lewej kolumnie; `sample` zdjęty; hero → etap 10 (`migrate-report.md` § P3) |
| P4 Wystawy | ✅ | 2026-09-27 — Tura A + C; Tura B **po migracji** (R1–R9); `sample` na `annual.json` + 1. foto `page.mdx`; 2. foto import |
| P5 Galeria | ✅ | 2026-09-27 — gate OK; kolejność WP; `sample` zdjęty z `icons.json`; media w `public/media/import/icons/`; tytuły → etap 10 |
| P6 Publikacje | ⬜ | |
| P7 Poświęcenia | ✅ | 2026-09-27 — `poswiecenia-ikon.mdx`, `kind: aktualnosc`, 301, media import |
| P8 Strona główna | ⬜ | |

---

## Prompt startowy (wklej w nową konwersację)

```text
Etap 9 migracji WP — gałąź feat/09-migration. Kawałki 1 v2 i 2 v2 są zamknięte (rdzeń redakcyjny, wykłady, aktualności). Kontynuujemy strony WordPress wg planu:

→ Przeczytaj: docs/plans/09-migration-wp-pages.md (pełna inwentaryzacja 29 stron, pod-kawałki P0–P8)
→ Kontekst żywy: docs/plans/09-migration-v2.md (kawałek 3), scripts/migrate-report.md, docs/plan-claude-code.md §3 etap 9
→ Zasady: CLAUDE.md, brief docs/brief-claude-code.md §3–§5, gate K-122 przed zapisem, K-123 (bez masowego static/offers ze skryptu)

Zacznij od pod-kawałka P0: przejdź tabelę inwentaryzacji i zadaj mi po jednym pytaniu o pozycje DECYZJA (#12 tematy, #25 plakaty, #28 konsultacje) oraz skrót backlogu podsumowanie-2019. Nie implementuj bez moich odpowiedzi.

Po P0 — P1 (redirecty hubów do docs/redirects.json, bez next.config.ts dopóki nie powiem OK na listę).

Źródło WP: https://www.akademiaikony.pl/wp-json/wp/v2/pages (K-121).
```
