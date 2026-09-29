# Plan 09 v2 — Migracja treści z WordPressa (redakcja + skrypt)

Status: **w implementacji** (2026-09-28) — kawałki **1 v2** i **2 v2** zamknięte; **3 v2** w toku (strony WP **P0–P8** ✅; **media aktualności** ✅). Następny zakres k3: pozostałe **media** (static, oferty, publikacje, wystawy), globalny **`grep sample`**, zamknięcie kryteriów kawałka 3 (inwentaryzacja, plan mediów reszty, kawałki 4+). Refactor wystaw dorocznych (P4 Tura B, R1–R9) — **po migracji**. v2 zastępuje **implementację kawałków** z `docs/plans/09-migration.md`; decyzje **K-08**, **K-121**, **K-122** nadal obowiązują.  
Gałąź: `feat/09-migration`  
Makiety: brak (etap wyłącznie treści; UI bez zmian). Trasy i model treści: `docs/brief-claude-code.md` §3–§5.

**Poprzednik:** `docs/plans/09-migration.md` (7 kawałków, masowy import static/offers) — **nie realizujemy** kawałków 2–7 starego planu. Rdzeń skryptu i gate static z kawałka 1 starego planu są **już zrobione** i wchodzą w zakres v2 kawałka 1 jako stan wyjściowy.

## Cel i zakres

Zastąpić redakcyjne `sample` tam, gdzie mamy docelowe copy, używając warstwy `src/content/*` — **bez zmian komponentów i layoutu**, chyba że build wymusi minimalną poprawkę (zgłosić w checkpoincie).

**Dlaczego v2:** treść na WP jest rozproszona, tematycznie nachodząca i pojawia się poza właściwymi sekcjami. Dla stron „rdzeniowych” (o akademii, pracownia, warsztaty, oferty, kontakt) **nie** robimy masowego HTML→MDX ze skryptu — właściciel repo konsoliduje źródła w jednym pliku, a migracja to **redakcja i wzbogacenie** treści już w repo.

**W zakresie v2:**

| Obszar | Metoda |
| --- | --- |
| Strony rdzeniowe + kontakt | Ręczne źródło `docs/plans/09-migration-source.md` → gate → zapis w `content/` |
| Wykłady + aktualności | `scripts/migrate-wp.ts` (`--only=lectures`, `--only=news`) + gate pozycja po pozycji (**K-122**) |
| Reszta WP | Inwentaryzacja i decyzje (kawałek 3); wykonanie w kolejnych kawałkach etapu 9 lub świadome odłożenie |
| `sample` | Usuwanie **per plik**, gdy copy w danym zakresie jest docelowe (nie czekamy na cały etap, jeśli kawałek to domyka) |
| Raport | `scripts/migrate-report.md` — zamrożenia, zamknięte URL-e WP, EJK |

**Poza zakresem v2 (bez zmian względem starego planu):** SEO/metadata/sitemap (etap 10), hosting/DNS (etap 11), nowe zależności npm bez zgody, redesign, import blogspot (link w stopce), migracja hubu `/wydarzenia/`. **Media** (podpinanie obrazów, `public/media/import/`, zamiana `/media/sample/` w ofertach) — **nie** w kawałkach 1–2; planowanie w kawałku 3.

**Źródło WP:** `https://www.akademiaikony.pl` (**K-08**, **K-121**). Po zamknięciu kawałka 1 lub 2 wymienione URL-e WP uznajemy za **zmigrowane** — bez ponownego fetchu pod te treści.

## Stan wyjściowy (już zrobione — stary kawałek 1 + fragmenty warsztatów)

Nie powtarzamy gate ani masowego zapisu dla:

| Element | Stan | Raport |
| --- | --- | --- |
| Szkielet `migrate-wp` (CLI, `--dry-run`, `--only`, `--force`, helpery) | ✅ | `migrate-report.md` |
| `content/pages/kontakt.mdx` | ✅ zamrożony (**zostaw**) | zamrożenia static |
| `content/pages/polityka-prywatnosci.json` | ✅ zamrożony | zamrożenia static |
| `content/settings.json` | ✅ zamrożony | zamrożenia static |
| Fetch mediów `public/media/import/static/{o-akademii,pracownia}/` | ✅ artefakt; **niepodpięty** | EJK / kawałek 3 (media) |
| `content/testimonials.json` — Adam, Iza, Maciej (hub `/warsztaty`) | ✅ tekst z WP ręcznie | zamrożenia offers (stary plan) |
| Plan zajęć semestrów (kurs 3-letni) — `<SemesterProgram />` | ✅ zmigrowany poza `migration-source.md` | — |

**Nie wchodzi do `09-migration-source.md`:** głosy uczestników (powyżej), program semestrów, zamrożona treść kontaktu / polityki / settings.

## Decyzje z sesji planistycznej (v2)

| ID | Decyzja |
| --- | --- |
| **K-08** | Kanoniczny host: `https://www.akademiaikony.pl`; redirecty w `docs/redirects.json` (uzupełnienie po zamknięciu kawałków — kawałek 3+). |
| **K-121** | REST API jako źródło; WXR rezerwa. |
| **K-122** | Gate w czacie przed zapisem; zamrożenia w `migrate-report.md`; `--force` nie zastępuje gate. |
| **K-123** | Treści rdzeniowe warsztatów i „O nas” **nie** z masowego `--only=static` / `--only=offers` — źródło redakcyjne: `docs/plans/09-migration-source.md`; cel: **ulepszenie** treści w repo, nie kopia 1:1 z WP. Skrypt dla tych stron: tylko pomocniczy fetch / raport, bez nadpisywania zamrożonych plików. |

## Pliki i skrypty

| Plik | Odpowiedzialność |
| ---- | ---------------- |
| `docs/plans/09-migration-source.md` | Surowy konspekt treści z WP (wypełnia właściciel repo); **nie** trafia na produkcję |
| `docs/plans/09-migration-v2.md` | Ten plan |
| `docs/plans/09-migration-media.md` | Plan mediów: stan + fale M0–M5 (news ✅, reszta ⬜) |
| `scripts/migrate-wp.ts` | Kawałek 2: `lectures`, `news`; opcjonalnie inwentaryzacja WP w kawałku 3 |
| `scripts/migrate-report.md` | Zamrożenia, zamknięte URL-e WP, EJK, konflikty |
| `content/pages/*`, `content/offers/*`, `src/i18n/pl.ts` (hub warsztatów) | Kawałek 1 — docelowe copy |
| `content/lectures/*`, `content/news/*` | Kawałek 2 |
| `docs/redirects.json`, `next.config.ts` | Po decyzjach z kawałku 3 (lub osobny kawałek wykonawczy) |

**Domeny CLI używane w v2:** `lectures`, `news` (+ ewentualnie suchy przebieg listy stron/postów w kawałku 3). **`static` / `offers`:** bez masowego zapisu body do `content/` (**K-123**).

## Rytm pracy

1. **Trzy kawałki v2** na gałęzi `feat/09-migration`; checkpoint po każdym (`CLAUDE.md`, `docs/plan-claude-code.md` §1.2).
2. **Kawałek 1:** właściciel uzupełnia `09-migration-source.md` → agent mapuje sekcje na pliki → gate **strona po stronie** (lub sekcja po sekcji) → zapis → **usunięcie `sample`** na dotkniętych plikach → wpis „URL-e WP zamknięte” w raporcie.
3. **Kawałek 2:** skrypt (`--dry-run` najpierw) → gate pozycja po pozycji (**K-122**) → zapis → `sample` zastąpione prawdziwymi wpisami / flagi usunięte → zamknięcie URL-i WP z zakresu wykładów/aktualności.
4. **Kawałek 3:** lista pozostałych stron/postów WP → tabela decyzji (migrować w 9 / odłożyć do 10 / pominąć) → **plan mediów** i pozostałych domen (galeria, publikacje, wystawy, redirecty, globalne `grep sample`).
5. Etap **10:** korekty EJK, SEO, długie teksty pod layout.

Implementacja agenta: `.cursor/skills/start-code/SKILL.md` §5 (etap 9).

## Polityka `sample`

- **Zasada:** gdy treść w pliku (lub zestawie powiązanym, np. manifest wpisu) jest **docelowa po gate**, usuwamy `"sample": true` / `sample:` w frontmatter oraz — w kawałku 2 — pliki `content/news/sample-*.mdx` zastępujemy wpisami zmigrowanymi (i aktualizujemy `manifest.json`).
- **Per kawałek:** w checkpoincie wymieniamy listę plików, z których `sample` zniknął, oraz wiersze zaktualizowane w `docs/plan-claude-code.md` §5.
- **Wyjątek — media:** usunięcie `sample` z ofert **nie wymaga** w v2 kawałku 1 podmiany ścieżek `/media/sample/…` w MDX — to kawałek 3 (media). Flaga `sample` na ofercie schodzi, gdy **tekst** (frontmatter + body) jest docelowy.
- **Cel etapu 9 (globalny):** `grep -r sample content/ public/media/` pusty — realizowany po wykonaniu decyzji z kawałku 3, niekoniecznie po samym kawałku 1.

### Checklist `sample` — kawałek 1 (docelowe copy)

| Zasób | Plik(e) | Uwagi |
| --- | --- | --- |
| O Akademii | `content/pages/o-akademii.json` | JSON + MDX po redakcji |
| Pracownia | `content/pages/pracownia.json` | j.w. |
| Hub warsztatów | `src/i18n/pl.ts` → `workshopsHub` | lead/karty tylko jeśli zmienione w gate; oferty z `content/offers` |
| Kurs roczny i trzyletni | `content/offers/kurs-roczny-i-trzyletni.mdx` | program semestrów już OK; body/frontmatter z source |
| Letnia Szkoła Światła | `content/offers/letnia-szkola-swiatla.mdx` | j.w. |
| Głosy uczestników | `content/testimonials.json` | treść już z WP; **sample** zdjąć po zamknięciu gate huba |
| Kontakt | `content/pages/kontakt.mdx` | brak flagi `sample`; potwierdzenie w gate bez zmian merytorycznych |

Oferta `zamowienie` i inne trasy **poza** piątką stron — poza kawałkiem 1 (kawałek 3).

## Kawałki

### Kawałek 1 — Rdzeń redakcyjny (static + oferty warsztatów + kontakt)

**Metoda:** `docs/plans/09-migration-source.md` + gate; **bez** masowego `--only=offers` / zapisu body static ze skryptu.

**Źródła WP (konspekt w `migration-source.md` — po zamknięciu kawałka **nie wracamy**):**

- `/strona-glowna`
- `/strona-glowna/celem-dzialalnosci-akademii-ikony-…` (cele / „O nas” na WP)
- `/strona-glowna/pracownia`
- `/warsztaty`
- `/zapisy-na-warsztaty`
- `/warsztaty-roczne`
- `/warsztaty-wakacyjne`
- `/zapisy-na-wyklady` (tekst proceduralny — mapować tam, gdzie trafi: oferta, CTA, ewent. `pl.ts`; nie duplikować na `/wyklady` bez gate)

**Trasy docelowe (ulepszenie treści w repo):**

| Trasa | Główne pliki |
| --- | --- |
| `/o-akademii` | `content/pages/o-akademii.json`, `o-akademii.mdx` |
| `/pracownia` | `content/pages/pracownia.json`, `pracownia.mdx` |
| `/warsztaty` | `src/i18n/pl.ts` (`workshopsHub`), karty z ofert + `testimonials.json` |
| `/warsztaty/kurs-roczny-i-trzyletni` | `content/offers/kurs-roczny-i-trzyletni.mdx` |
| `/warsztaty/letnia-szkola-swiatla` | `content/offers/letnia-szkola-swiatla.mdx` |
| `/kontakt` | `content/pages/kontakt.mdx` — weryfikacja końcowa; bez rewizji zamrożonej treści bez decyzji |

**Zakres prac agenta:** mapowanie sekcji source → pliki; propozycje MDX/JSON; zachowanie `OfferFacts` i pól naboru z frontmatter; brak wymyślania faktów spoza source i brief §8; placeholdery `[do uzupełnienia: …]` zamiast zgadywania.

**Gate:** jedna trasa (lub logiczna sekcja) na turę — **source / u nas / propozycja** → decyzja: **zostaw** / **mix** / **nowa redakcja** → zapis → zamrożenie w raporcie.

**Kryterium „gotowe”:**

- [x] `09-migration-source.md` wypełniony przez właściciela repo
- [x] Wszystkie sześć tras przejrzane w gate; zamrożenia dopisane
- [x] `sample` usunięty z pozycji checklisty powyżej (media sample w ofertach mogą zostać)
- [x] Sekcja raportu: **„WP zamknięte — kawałek 1 v2”** z listą 8 URL-i WP
- [x] `npm run build`, `npm run lint`; przegląd 390 px + desktop na sześciu trasach

### Kawałek 2 — Wykłady + aktualności (skrypt)

**`--only=lectures`** then **`--only=news`** (osobne przebiegi lub jeden checkpoint — wg ustaleń w sesji).

**Zakres wykłady:** posty `wyklady-YYYY-YYYY` → `content/lectures/<season>.json` (brief §5 krok 4); niejednoznaczne prowadzący → EJK w raporcie.

**Zakres aktualności:** posty → `content/news/*.mdx` + `manifest.json`; mapowanie kategoria → `kind` jak w `scripts/generate-news-sample.ts`; **reguły dawnych „Wydarzeń”** — pełny opis: `docs/plan-claude-code.md` §3 etap 9 (K-50…K-58). Plakaty (K-78, K-98) → EJK. Hub `/wydarzenia/` — nie migrować.

**Partia A (`kind: wyklady`, 16 wpisów):** zajawka = wariacja ogłoszenia programu + temat z `cycleTitle` w JSON; body = ten sam tekst + „Zajrzyj na stronę Wykłady…” → `/wyklady` (bieżący) lub `/wyklady/archiwum` (archiwalne). Bez `intro`/programu z hubu w MDX. Szczegóły + CMS EJK: `scripts/migrate-report.md` § formuła wyklady.

**Gate:** **K-122** — brak masowego nadpisywania po pierwszym `--dry-run` bez przeglądu; zamrożenia per plik/sezon/wpis.

**Po zamknięciu uznajemy za zmigrowane (nie fetchować ponownie pod te domeny):** archiwum i bieżący sezon wykładów na WP oraz wszystkie posty objęte mapowaniem aktualności (z wyjątkiem świadomie pominiętych wpisów zapisanych w raporcie).

**Kryterium „gotowe”:**

- [x] `/wyklady`, `/wyklady/archiwum` na danych po gate (archiwum 15 sezonów 2012/2013–2025/2026 + bieżący 2026/2027)
- [x] Strumień `/aktualnosci` na wpisach po gate; brak `sample-*.mdx`; `manifest.json` bez `"sample": true` (2026-09-27)
- [x] `sample` zdjęty z `content/lectures/*` i z wpisów news po gate
- [x] Sekcja raportu: **„WP zamknięte — kawałek 2 v2”** (`scripts/migrate-report.md`)
- [x] `npm run build`, `npm run lint` (po gate D21, 2026-09-27)

### Kawałek 3 — Inwentaryzacja reszty WP + media + dalsze kawałki

**Strony WP (29):** szczegółowy plan wykonawczy i handoff → `docs/plans/09-migration-wp-pages.md` (pod-kawałki P0–P8, prompt startowy na końcu pliku).

**Zakres:**

1. **Lista** wszystkich stron i postów WP **nieobjętych** kawałkami 1–2 (REST lub eksport do raportu): slug, tytuł, propozycja trasy docelowej / brak / etap 10. *(Strony: tabela w `09-migration-wp-pages.md`.)*
2. **Decyzja właściciela** per pozycja (w czacie lub tabeli w raporcie): migrować w etapie 9 (nowy kawałek 4+), odłożyć, pominąć.
3. **Plan mediów:** `public/media/import/static/*`, `/media/sample/` w ofertach i stronach, galeria, plakaty — bez wykonania importu w tym kawałku, chyba że decyzja wskaże konkretny mini-zakres. **Z gate S4 (2026-09-27):** post WP `ikona-korzenie-i-owoce-wiary-2` (nie migrowany do aktualności) zawiera **2 dobre zdjęcia** — uwzględnić przy imporcie pod `/ikony/wystawy` / `annual.json` (nie pod news).
4. **Redirecty:** propozycja wpisów do `docs/redirects.json` dla URL-i zamkniętych w kawałkach 1–2 (+ znanych slugów z brief §5).
5. **Pozostałe `sample`:** tabela „co zostaje” z `docs/plan-claude-code.md` §5 po kawałkach 1–2 (galeria, publikacje, wystawy, strona główna, `zamowienie`, itd.).

**Media aktualności (podzakres k3):**

- [x] Weryfikacja pozycja po pozycji — `docs/plans/09-migration-media.md` § M0 (2026-09-28, właściciel repo)
- [x] Zdjęcia wpisów news: `/media/sample/news/` → `public/media/import/news/{slug}/`, ścieżki w `content/news/*.mdx` + `manifest.json` (skrypt: `scripts/promote-news-media-from-sample.ts`; potem `generateNewsManifest()`)
- [x] `npm run build`, `npm run lint` po podmianie ścieżek

**Kryterium „gotowe”:**

- [ ] Tabela inwentaryzacji w `migrate-report.md` (lub załącznik wskazany w raporcie)
- [ ] Zatwierdzony plan kawałków 4+ (nazwa, `--only`, zakres) **lub** jawne przeniesienie pozycji do etapu 10 z EJK
- [x] Plan mediów **poza aktualnościami** — `docs/plans/09-migration-media.md` (2026-09-28); wykonanie fal M1–M5 ⬜
- [ ] Checkpoint — **bez wymogu** pustego `grep sample` (to DoD całego etapu 9)

## Dane sample w tym etapie

Nowych `sample` nie dodajemy. Każde zdjęcie flagi w kawałku 1–2 aktualizuje `docs/plan-claude-code.md` §5 w meldunku checkpointu.

## Kryteria ukończenia etapu 9 (DoD — bez zmian merytorycznych)

Po **wszystkich** kawałkach wykonawczych zatwierdzonych po kawałku 3 (nie tylko po v2 1–3):

- [ ] `grep -r sample content/ public/media/` bez wyników
- [ ] Pozycje §5 odhaczone lub przeniesione do etapu 10 z wpisem EJK
- [ ] `scripts/migrate-report.md` przejrzany
- [ ] Daty w `content/` — archiwum 2025 vs bieżące 2026
- [ ] `npm run build`, `npm run lint`
- [ ] Przegląd reprezentatywnych tras (mobile + desktop)
- [ ] `docs/redirects.json` + 301 w `next.config.ts` dla zamkniętej migracji

## Ryzyka i otwarte kwestie

- **Długie MDX** po kawałku 1 — layout; naprawa tylko przy blokadzie buildu (inaczej etap 10).
- **Tekst z `/zapisy-na-wyklady`** może częściowo należeć do ofert, nie do archiwum wykładów — rozstrzyga gate przy mapowaniu source.
- **Maciej** w `testimonials.json` współdzielony z plenerem — przy gate pleneru (później) sprawdzić spójność (już w raporcie).
- **Cytat R. Rumina**, prawa do artykułów, album — kawałek 3 / EJK.
- Skrypt `migrate-wp` domen `static`/`offers` — pozostaje w repo; agent nie uruchamia masowego zapisu body pod **K-123**.

## Postęp

| Kawałek v2 | Status | Gate / uwagi |
| ---------- | ------ | ------------ |
| 1 — rdzeń redakcyjny | ✅ | 2026-09-26. `/o-akademii`, `/pracownia`, `/kontakt` — zostaw; kurs, plener, hub `/warsztaty` — nowa redakcja (akceptacja wizualna); nowe pole `leadExtra` w ofertach; `sample` zdjęty z obu ofert i `testimonials.json` (fałszywy cytat Izy → Artur); raport: zamrożenia, „WP zamknięte — kawałek 1 v2”, TODO k2 i etap 10; build/lint OK |
| 2 — wykłady + aktualności | ✅ | 2026-09-27. Wykłady: gate K-122 (15 sezonów archiwum + bieżący). Aktualności: faza 0 **B**; S1–S5 ✅; partie **A, B, C, E, F, D** (gate D1–D21) ✅; brak `sample-*.mdx`. Wyjątki: D20/D21 bez postów WP (placeholdery); backlog `podsumowanie-2019` **zamknięty** (P4 Tura C, #9 skip). Otwarte przed DoD etapu 9: `plener` vs `wyjazd`, `<NewsCta />`, `#wyjazdowe` — raport § TODO k2. |
| 3 — inwentaryzacja + media + plan dalszy | 🟡 | Plan stron WP: `09-migration-wp-pages.md` — **P0–P8 ✅** (P4 Tura B po migracji). **Media aktualności ✅** 2026-09-28 (`09-migration-media.md` § M0, `import/news/`). Następny: media poza news, `grep sample`, DoD kawałka 3 (raport, plan 4+). |

**Mapowanie ze starego planu (`09-migration.md`):**

| Stary kawałek | v2 |
| --- | --- |
| 1 static + rdzeń | Wchodzi w **kawałek 1 v2** (zrobione technicznie) + redakcja source |
| 2 offers | **Kawałek 1 v2** (redakcja) |
| 3–4 lectures/news | **Kawałek 2 v2** |
| 5–7 gallery / publications / finalize | **Kawałek 3 v2** → decyzje → kawałki 4+ |
