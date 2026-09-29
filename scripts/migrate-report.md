# WordPress migration report

Log per chunk (`docs/plans/09-migration-v2.md`; CLI: `docs/plans/09-migration.md`).

## Decyzje P0 — strony WP (`09-migration-wp-pages.md`)

Zatwierdzone przez właściciela repo **2026-09-27**. Bez implementacji treści poza wpisami wynikającymi z decyzji.

| # | Slug / temat | Decyzja |
| --- | --- | --- |
| 12 | `tematy` | **301** `/wyklady/tematy/` → `/wyklady` (program tylko w `content/lectures/*.json` + hub). |
| 25 | `plakaty` | Wpis zbiorczy `kind: aktualnosc` (galeria plakatów WP; tytuł z latami przy gate). **301** `/publikacje/plakaty/` → ten wpis po utworzeniu; do czasu wpisu → `/aktualnosci` (P1). **Etap 10:** rozłożyć plakaty na większe wpisy (`poster` itd.) i usunąć wpis zbiorczy, gdy zbędny. Realizacja wpisu: **fala mediów** (po **P6** ✅). |
| 28 | `konsultacje-i-lekcje-indywidualne` | Kotwica `#konsultacje` przy sekcji w `kurs-roczny-i-trzyletni.mdx`. **301** → `/warsztaty/kurs-roczny-i-trzyletni#konsultacje`. |
| — | Backlog post `podsumowanie-2019` | **✅ zamknięty** 2026-09-27: **#1** → P4 Tura A; **#2–#8** → wpisy news (P4 Tura C); **#9** (akapit 2020 / film) → **skip** — treść rozplanowana poza rollupem WP (bez osobnego news z tego akapitu). |

**P0 — zamknięty** 2026-09-27.

## P1 — redirecty hubów

**Zamknięty** 2026-09-27 (OK właściciela na listę 31 wpisów w `docs/redirects.json`). `next.config.ts` bez zmian — `loadPermanentRedirects()` przy buildzie.

Kotwica `#konsultacje` w `content/offers/kurs-roczny-i-trzyletni.mdx` (P0 #28). `/publikacje/plakaty` → zaktualizować po wpisie zbiorczym plakatów (P0 #25; po P6 ✅).

## P3 — Zamówienie (#18)

**Zamknięty** 2026-09-27 (gate K-122; OK właściciela na copy i układ).

| Pole | Wartość |
| --- | --- |
| WP | `https://www.akademiaikony.pl/ikona/ikony-na-zamowienie/` (modified 2025-02-03) |
| Plik | `content/offers/zamowienie.mdx` — `leadIntro` (lewa kolumna pod leadami), `src/components/offers/OfferLeadIntro.tsx`, `src/app/ikony/na-zamowienie/page.tsx` (`leadExtraSlot`) |
| Decyzja | **mix** — leady z repo; treść WP zredagowana w `leadIntro` + `facts` + kroki; bez galerii 5× DSC z WP (`exampleSlugs` bez zmian) |
| `sample` | zdjęty z frontmatter oferty |
| **Hero (etap 10)** | `OfferFigure` → `/media/sample/photos/pisanie-ikony-pracownia.jpg` — **do weryfikacji / podmiany** (uploads WP 2017 lub sesja); nie blokuje zamknięcia P3 |
| **301** | `/ikona/ikony-na-zamowienie` — `docs/redirects.json` (P1) |

**Zamrożenie:** copy oferty (`lead`, `leadIntro`, `facts`, kroki) — **zostaw**; bez ponownego fetchu strony WP pod body.

## P4 — Wystawy (#16–17 + post S4)

**Zamknięty** 2026-09-27 — Tura A ✅; Tura C ✅ (`podsumowanie-2019` #1–#9); Tura B **odłożona do po zakończenia migracji etapu 9** (refactor `/ikony/wystawy`, R1–R9).

| Pole | Wartość |
| --- | --- |
| WP strony | `https://www.akademiaikony.pl/ikona/wystawy/`, `https://www.akademiaikony.pl/wernisaze/` (301 P1) |
| WP post S4 | `https://www.akademiaikony.pl/ikona-korzenie-i-owoce-wiary-2/` — copy → `body.mdx` / wystawy; **media:** 2. zdjęcie `interiorPhotos` → `import/exhibition/20250613_194453-scaled.jpg` (WP uploads 2025/06); 1. zdjęcie nadal sample (2018) |
| WP backlog | `podsumowanie-2019` — **zamknięty** (#1 Tura A; #2–#8 news; #9 skip — plan poza postem) |
| Pliki | `content/exhibition/page.mdx`, `body.mdx`, `annual.json` (bez refaktoru listy dorocznej w P4) |
| `sample` | **zostaje** na `page.mdx` + `annual.json` do planu mediów / refactoru |
| Tura A | **gate OK** — wariant 2 copy w `body.mdx`; `page.mdx` `lead` (pole niewidoczne w UI); bez zdania o oprowadzeniach w body |
| Kod | usunięte `AnnualExhibition.iconCount` (`types.ts`, `annual.json`, `exhibition.ts`) — liczba ikon na dorocznej **nie** w danych |

### Backlog — refactor wystaw dorocznych (`/ikony/wystawy` + Aktualności)

**Decyzja właściciela 2026-09-27:** Tura B (refactor layoutu dorocznych, `annual.json`, R1–R9) — **po migracji** (etap 9 zamknięty → osobna faza / etap 10), nie blokuje zamknięcia P4.

**Docelowy model (skrót):**

1. Każda wystawa doroczna (rok kończący sezon) ma **własny wpis** w `/aktualnosci` (`kind: wystawa`, relacja do roku / kotwicy).
2. Na `/ikony/wystawy` **usuwamy tytuły edycji** z listy dorocznej — zostają **tylko lata** (linki do wpisów aktualności).
3. UI: mały box z nagłówkiem w stylu „Zobacz edycje z poprzednich lat” + **lista linków z latami w 4 rzędach** (grid).
4. Sekcja „Wystawa doroczna” (bieżąca) — bez rozbudowy tytułów w `annual.json` w obecnym układzie; po refactorze źródłem copy/zdjęć jest **news**, nie `annual.json`.
5. Brak wpisu news dla danego roku → **utworzyć** (EJK: zdjęcia z roku). Gdy brak materiału: tytuł **`Wystawa doroczna [rok]`**, standardowa zajawka + wariacja standardowego body + galeria.
6. **`annual.json`:** po refactorze prawdopodobnie uproszczenie (rok → `newsSlug`); tytuły / `summary` / daty w JSON — dopiero przy implementacji layoutu.

**Problemy / luki do zamknięcia przy refactorze:**

| # | Problem | Stan dziś |
| --- | --- | --- |
| R1 | `ExhibitionPreviousSection` pokazuje **„{rok}, „{title}””** + opcjonalnie „Zdjęcia” | Wymaga layoutu **tylko lata** + link do news |
| R2 | `annual.json` duplikuje **tytuły** i część **zdjęć** obok news | Po refactorze: canonical w news; JSON minimalny |
| R3 | **2022/2023** — tytuł w JSON ≠ wykłady („Widzieć niewidzialnego”) | Naprawa przy refactorze / audycie news |
| R4 | **2015/2016** — brak `newsSlug`; **2014/2015** — `wystawa-ikona-dzis` vs tytuł „Obraz i kult” | Audyt 1:1 rok ↔ wpis |
| R5 | **D20/D21** — placeholdery relacji (`wystawa-piekno-boga…`, `wystawa-madrosc-boza…`) | Uzupełnić treść lub szablon standardowy |
| R6 | Lata **2012–2024** bez relacji news — lista lat na `/wystawy` wymaga **wpisów** (szablon + EJK foto) | Inwentaryzacja per rok wernisażu |
| R7 | Kotwice `#wystawa-{rok}` vs linki tylko do `/aktualnosci/[slug]` | Ustalić przy refactorze (K-103) |
| R8 | `AnnualExhibition.summary` — pole martwe w UI | Usunąć lub wykorzystać dopiero po decyzji layoutu |
| R9 | `sample` w `annual.json` / zdjęcia doroczne | Plan mediów + EJK |

**Tura C (P4):** ✅ zamknięta 2026-09-27 — wpisy **#2–#8** (tabela); **#9** odhaczone (skip WP).

### P4 — Tura C — gate `podsumowanie-2019` (#2–#9)

Źródło treści: https://www.akademiaikony.pl/podsumowanie-2019/ (bez ponownego importu masowego — akapit per wiersz przy gate). **Nie** tworzyć wpisów bez OK właściciela per wiersz.

| Wiersz | Proponowany slug | `kind` | Tytuł (propozycja) | Uwagi gate |
| --- | --- | --- | --- | --- |
| #2 | `wystawa-praga-del-arte-2019` | `wystawa` | Wystawa w galerii Praga del ARTE, 2019 | **gate OK** 2026-09-27; media `import/news/wystawa-praga-del-arte-2019/1.jpg` (WP 6.jpg) |
| #3 | `ikona-piekno-zanurzone-w-tajemnicy` | `wystawa` | (ten sam wpis) | **gate OK** 2026-09-27 — merge Bażantarni 2019; nie osobny slug |
| #4 | `wystawa-ikona-okno-ku-wiecznosci-2019` | `wystawa` | Wystawa „Ikona – okno ku wieczności”, wrzesień 2019 | **gate OK** 2026-09-27; media `import/news/wystawa-ikona-okno-ku-wiecznosci-2019/1.jpg` (WP 22.jpg) |
| #5 | `wystawa-ikona-drabina-do-nieba-2019` | `wystawa` | Wystawa „Ikona – drabina do nieba”, listopad 2019 | **gate OK** 2026-09-27; media `import/.../1.png` (WP 16.png; korekta z 23.jpg) |
| #6 | `wystawa-ikona-nadzieja-i-oczekiwanie-2019` | `wystawa` | Wystawa „Ikona – nadzieja i oczekiwanie”, grudzień 2019 | **gate OK** 2026-09-27; media `import/.../1.jpg` (WP 17.jpg) |
| #7 | `wystawa-galeria-wiezy-ken-2019` | `wystawa` | Wystawa w Galerii Wieży, kościół Wniebowstąpienia | **gate OK** 2026-09-27; media `import/.../1–3.jpg` (WP 19–21.jpg) |
| #8 | `wystawa-ikona-bozego-narodzenia-kst-2019` | `wystawa` | Wystawa ikony Bożego Narodzenia, KŚT 2019/2020 | **gate OK** 2026-09-27; media `import/.../1.jpg` (WP 18.jpg) |
| #9 | — | — | Akapit 2020 w poście (KŚT, Lipka, sanktuarium, „Światłość w ciszy”, film YT) | **✅ skip** 2026-09-27 — rozplanowane poza rollupem; **brak** news z tego akapitu; film bez embedu (K-78) |

**Szablon body (gdy brak relacji):** wariacja standardowa + link do `/ikony/wystawy`; galeria po dostarczeniu zdjęć EJK.

**Status:** ✅ **#2–#9** zamknięte 2026-09-27 (implementacja news #2–#8; #9 skip).

## P5 — Galeria (#15)

**P5 — zamknięty** 2026-09-27 (gate K-122; OK właściciela — zdjęcia zweryfikowane, tytuły → etap 10).

| Pole | Wartość |
| --- | --- |
| WP | `https://www.akademiaikony.pl/ikona/galeria/` (page) |
| Plik | `content/icons.json` (52 prace: 23 EJK + 29 uczniów), `scripts/wp-gallery-manifest.json` |
| Weryfikacja | 52 figury HTML = manifest = `icons.json` (kolejność jak WP); `wpUrl` bez rozjazdów |
| Media | `public/media/import/icons/*` (53 pliki, w tym `chrystus.jpg` — hero); ścieżki `/media/import/icons/{slug}.jpg` |
| `sample` | **zdjęty** z `content/icons.json`; przeniesienie z `public/media/sample/icons/` → `import/icons/` 2026-09-27 |
| **301** | `/ikona/galeria` — `docs/redirects.json` (P1) |

**Zamrożenie:** metadane i kolejność galerii — **zostaw**; bez ponownego fetchu strony WP. Korekta tytułów, wymiarów, placeholder `do-uzupelnienia-tytul-ikony` — **etap 10** (`docs/plan-claude-code.md` §5).

## P6 — Publikacje (#23–24)

**Zamknięty** 2026-09-27 (gate K-122; tura 1 + tura 2).

| Pole | Wartość |
| --- | --- |
| WP #23 | `https://www.akademiaikony.pl/publikacje/` |
| WP #24 | `https://www.akademiaikony.pl/publikacje/artykuly/` |
| Pliki | `content/publications/ikona-dzis.mdx`, `ikona-dzis-body.mdx`; `content/articles/*.mdx` (4 slugi); `src/i18n/pl.ts` (`articlesLead`) |
| Album | `sample` zdjęty; ISBN `978-83-978648-0-1`, `pages: 176`; media okładka/rozkładówki nadal `/media/sample/publications/` |
| Artykuły (zestaw v1) | `pietnasta-rocznica`, `piekno-ikony-perspektywa-i-swiatlo` (album); `cisza-ikony`, `ikona-przejmujaca-delikatnosc` (media / blogspot) — **gate OK** właściciela |
| `toc` | `articleSlug` dla 3 pozycji online (`pietnasta-rocznica`, `ikona-przejmujaca-delikatnosc`, `piekno-ikony-perspektywa-i-swiatlo`); pozostałe pozycje bez artykułu — etap 10 / EJK |
| Zakup z WP #24 | już w UI albumu (`mailto:` → `settings.json` sekretariat); lead sekcji artykułów bez duplikacji maila |
| **301** | `/publikacje/artykuly/` — `docs/redirects.json` (P1) |
| **EJK / etap 10** | import okładki/rozkładówek, `alt`, placeholdery w `toc` i `ikona-dzis-body.mdx`; **prawa** do publikacji online tekstów z albumu (zwł. uczestnicy) — nadal otwarte w §5 |

**Zamrożenie (nie fetchować ponownie):** strony WP `publikacje`, `artykuly` — copy i mapowanie artykułów wg gate P6.

## P2 — Wykładowcy (#13)

**Zamknięty** 2026-09-27 (gate K-122; weryfikacja właściciela repo — treść już w repo).

| Pole | Wartość |
| --- | --- |
| WP | `https://www.akademiaikony.pl/wyklady/wykladowcy/` (page) |
| Pliki | `content/lecturers.json`, `content/lecturer-directory.json`, `content/lecturers-page.json` |
| Media | `public/media/lecturers/*` (bez `/media/sample/`) |
| `sample` | brak w plikach wykładowców i sezonach `content/lectures/*` |
| **301** | `/wyklady/wykladowcy/` — już w `docs/redirects.json` (P1) |

**Zamrożenie:** lista profili, bio i zdjęcia — **zostaw**; bez ponownego fetchu HTML→MDX.

## P7 — Poświęcenia (#27)

**Zamknięty** 2026-09-27 (gate K-122).

| Pole | Wartość |
| --- | --- |
| WP | `https://www.akademiaikony.pl/poswiecenia-ikon/` (page, nie post) |
| Plik | `content/news/poswiecenia-ikon.mdx` |
| `kind` | `aktualnosc` (decyzja właściciela: relacja z obrzędu na końcu pleneru; link do wpisu warsztatów Lipka 2017 — odchylenie od K-77 `plener`) |
| Media | `public/media/import/news/poswiecenia-ikon/1.jpg` … `6.jpg` |
| **301** | `docs/redirects.json` → `/aktualnosci/poswiecenia-ikon` |

**EJK:** `alt` galerii (6 zdj.); akapit o znaczeniu poświęcenia w kościele — placeholder w body (porównanie do chrztu/sakramentów).

## P8 — Strona główna (#22)

**Zamknięty** 2026-09-27 (gate K-122; weryfikacja właściciela — **bez zmian treści**).

| Pole | Wartość |
| --- | --- |
| WP | `https://www.akademiaikony.pl/strona-glowna/` (page) |
| Trasa | `/` — `src/app/page.tsx` + `src/i18n/pl.ts` (`home`) + `content/settings.json` (`upcoming`) + `src/content/icons.ts` (`FEATURED_ICON_SLUGS`) |
| Decyzja | **zostaw** — copy Hero, Najbliższe, filary, testimonial i wybór 4 ikon uznane za docelowe; stary akapit WP nie mapowany (treść rozłożona w k1 i hubach) |
| `sample` | brak na `icons.json` (P5); brak flagi na home |
| **301** | `/strona-glowna` → `/` — `docs/redirects.json` (P8) |
| **Etap 10 / EJK** | zdjęcia filarów (`/media/sample/photos/*` w `pl.home.pillars`); ewent. korekta kafli `upcoming` po terminach naboru — przegląd z EJK |

**Zamrożenie:** `pl.ts` → `home`, `settings.json` → `upcoming`, `FEATURED_ICON_SLUGS` — **zostaw**; bez ponownego fetchu WP pod home.

## EJK — otwarte

_(pozycje dopisywane w kolejnych kawałkach)_

- **`/ikony/na-zamowienie` — zdjęcie hero (P3, etap 10):** `OfferFigure` nadal wskazuje `/media/sample/photos/pisanie-ikony-pracownia.jpg`; rozstrzygnięcie: import z WP (DSC06987 itd.) lub nowa sesja — patrz § P3.
- **Adres zgłoszeń na kurs roczny/trzyletni:** WP `/zapisy-na-warsztaty` podaje `sekretariat.ikony22@gmail.com`, WP `/warsztaty-roczne` i brief §8 — `akademiaikony@gmail.com`. Na stronie: `akademiaikony@gmail.com` (decyzja 2026-09-26); potwierdzić z EJK.
- **Aktualności `spotkania-sladami-najpiekniejszych-ikon-swiata` (gate A3, 2026-09-27):** (1) **uzupełnić program** w `content/news/spotkania-sladami-najpiekniejszych-ikon-swiata.mdx` — lista w repo jest niepełna względem plakatu z WP; (2) **dodać skan plakatu** z harmonogramem (osobny plik w `import/news/…`) — zdjęcie **ze spotkania** jest już w wpisie (`poster` + `images` + galeria). Po edycji: `generateNewsManifest()`. Media wpisu: ✅ `import/news/` (2026-09-28).

## Zamrożenia — kawałek 1 (static)

| Plik / pole | Decyzja | Data |
| --- | --- | --- |
| `content/pages/kontakt.mdx` (akapit pod mapą / kontaktem) | **zostaw** — jeden akapit o zakrystii + tel.; bez akapitu WP o KŚT | 2026-09-26 |
| `content/pages/polityka-prywatnosci.json` | **zostaw** — wersja redakcyjna (Administrator, „na rzecz”, „Masz prawo…”, bez `studiumikony@gmail.com` w treści; `contactEmail`: `akademiaikony@gmail.com`) | 2026-09-26 |
| `content/settings.json` | **zostaw** — kontakt (2 maile, §8), `mapEmbedUrl`, `upcoming`, ekosystem; WP kontakt nie nadpisuje | 2026-09-26 |
| `content/pages/o-akademii.json` + `o-akademii.mdx` | **zostaw** (tekst etapu 6); **bez podpinania** mediów z WP — ścieżki `/media/workshop/` bez zmian; pliki w `public/media/import/static/o-akademii/` tylko artefakt fetchu | 2026-09-26 |
| `content/pages/pracownia.json` + `pracownia.mdx` | **zostaw** — treść etapu 6 bez zmian; bez podpinania `public/media/import/static/pracownia/` | 2026-09-26 |
| `public/media/import/static/{o-akademii,pracownia}/` (20 plików) | **zostaw** w repo — niepodpięte do JSON; niepełny fetch „O nas” (4/10 `<img>` — tylko linki w `<a href=uploads>`); na później / EJK | 2026-09-26 |

**Kawałek 1 — zamknięty** 2026-09-26 (gate OK; build/lint OK).

## Zamrożenia — kawałek 2 (offers)

| Plik / pole | Decyzja | Data |
| --- | --- | --- |
| `content/testimonials.json` — Adam, Iza, Maciej (pierwsze 3 `items`, hub `/warsztaty` „Głosy uczestników”) | **WP** — tekst ręcznie z WP; role „warsztatów”; Hania usunięta z huba | 2026-09-26 |

_Uwaga:_ ten sam rekord **Maciej** jest używany na plenerze (`getPlenerTestimonials`) — do weryfikacji przy gate „Głosy z pleneru”._

## Zamrożenia — kawałek 1 v2 (rdzeń redakcyjny, `docs/plans/09-migration-v2.md`)

Źródło: `docs/plans/09-migration-source.md`. Metoda: nowa redakcja, akceptacja wizualna na localhost.

| Plik / pole | Decyzja | Data |
| --- | --- | --- |
| `content/offers/kurs-roczny-i-trzyletni.mdx` — `lead`, `leadSecondary`, `leadExtra` („Rok albo trzy lata”), sekcja MDX „Dalsza droga” | **nowa redakcja** z source (warsztaty-roczne, zapisy-na-warsztaty, pracownia „Co nas wyróżnia”); `sample` zdjęty; adres zgłoszeń `akademiaikony@gmail.com` (source ma też `sekretariat.ikony22@gmail.com` — patrz EJK) | 2026-09-26 |

| `content/offers/letnia-szkola-swiatla.mdx` — `lead`, `leadSecondary`, `leadExtra` („Tydzień na plenerze”), `facts.audience`, sekcja MDX „Po co ten tydzień” | **nowa redakcja** z source (warsztaty-wakacyjne, zapisy-na-warsztaty); odbiorcy: osoby z pierwszym doświadczeniem, decyzja w rozmowie (bez „bez wymogu doświadczenia”); `sample` zdjęty | 2026-09-26 |
| `content/offers/letnia-szkola-swiatla.mdx` — „Rytm dnia” | **zostaw** (makieta; zaakceptowany przez klientkę) — usunięta etykieta „[do potwierdzenia z EJK]” | 2026-09-26 |
| `content/offers/letnia-szkola-swiatla.mdx` — `whereWeWere` | **mix** — lista z source (Warszawa, Święta Lipka, Supraśl, Przemyśl, Litwa, Gruzja) + miejscowości z makiety (Wesoła, Wilno, Tbilisi); lata `[do uzupełnienia]` — patrz TODO niżej | 2026-09-26 |

| `src/i18n/pl.ts` → `workshopsHub.lead`, `leadSecondary` (nowe pole), `cards.*.excerpt`, bullet pleneru | **nowa redakcja** z source (`/warsztaty`: praca malarza ikon, EJK); plener lipiec–wrzesień, odbiorcy jak na stronie pleneru | 2026-09-26 |

| `content/testimonials.json` | **mix** — cytat „Iza, uczestniczka warsztatów” (makieta, nie z WP) usunięty; na hubie zastąpiony cytatem **Artura** (z WP, strona plenerów; rekord zdublowany — na plenerze zostaje z `scope: "plener"`); cytaty plenerowe potwierdzone jako WP; `sample` zdjęty | 2026-09-26 |
| `content/pages/kontakt.mdx` | **zostaw** — przegląd końcowy bez zmian (zamrożenie z kawałka 1 static) | 2026-09-26 |
| `content/pages/o-akademii.*`, `content/pages/pracownia.*` | **zostaw** — decyzja właściciela: treść wystarczająca, source nie wnosi zmian | 2026-09-26 |

**Kawałek 1 v2 — zamknięty** 2026-09-26 (akceptacja wizualna per strona; build/lint OK).

## WP zamknięte — kawałek 1 v2

Treść z poniższych URL-i uznajemy za zmigrowaną (konspekt w `docs/plans/09-migration-source.md`) — bez ponownego fetchu:

- `/strona-glowna`
- `/strona-glowna/celem-dzialalnosci-akademii-ikony-…`
- `/strona-glowna/pracownia`
- `/warsztaty`
- `/warsztaty/zapisy-na-warsztaty`
- `/warsztaty/warsztaty-roczne`
- `/warsztaty/warsztaty-wakacyjne`
- `/wyklady/zapisy-na-wyklady` — w source brak osobnej sekcji; tekst proceduralny wykładów pokryty przez `/wyklady#zapisy` (stan etapu 4); do sprawdzenia przy kawałku 2, jeśli pojawi się rozbieżność

## Zamrożenia — kawałek 2 v2 (wykłady, gate K-122)

**Archiwum wykładów (15 sezonów, 2012/2013–2025/2026):** zamrożone — brak `sample` w plikach sezonów archiwalnych; bieżący sezon `2026-2027` poza tym gate.

| Sezon | Plik | Decyzja | Data |
| --- | --- | --- | --- |
| 2025/2026 | `content/lectures/2025-2026.json` | **gate OK** — „Mądrość Boża”; program po migracji; wernisaż 13.06 w tytule + `note` | 2026-09-26 |
| 2024/2025 | `content/lectures/2024-2025.json` | **gate OK** — „Piękno Boga, piękno człowieka”; program po migracji; wernisaż 14.06 w tytule + `note` | 2026-09-26 |
| 2023/2024 | `content/lectures/2023-2024.json` | **gate OK** — tytuł cyklu (bez caps), wykładowcy paź–cze; katalog: Judyta Pudełko PDDM | 2026-09-26 |
| 2022/2023 | `content/lectures/2022-2023.json` | **gate OK** — tytuł cyklu (bez caps); 13.12 wystawa + EJK | 2026-09-26 |
| 2021/2022 | `content/lectures/2021-2022.json` | **gate OK** — tytuł cyklu (bez caps); 14.12 przedświąteczna wystawa + EJK; katalog: Barbara, Dorota | 2026-09-26 |
| 2020/2021 | `content/lectures/2020-2021.json` | **gate OK** — „O Bożej obecności”; Szechina; dopisany 16.02; katalog: Irina Tatarova | 2026-09-26 |
| 2019/2020 | `content/lectures/2019-2020.json` | **gate OK** — „O Duchu Świętym”; dopisany 8.10 Duch Paraklet | 2026-09-26 |
| 2018/2019 | `content/lectures/2018-2019.json` | **gate OK** — tytuł cyklu, pełny program (26 wykładów), wernisaż 14.06; katalog: Barbara UKSW, Ewa Siuzdak | 2026-09-26 |
| 2017/2018 | `content/lectures/2017-2018.json` | **gate OK** — tytuł cyklu; wykładowcy z tytułów; wernisaż 15.06; 19.12 „Nieustanne…” — slug tylko EJK; katalog: Maria Osuchowska-Marcelleti, Ewa Kocój | 2026-09-26 |
| 2016/2017 | `content/lectures/2016-2017.json` | **gate OK** — tytuł bez cudzysłowu/dat; cykle: Śladami…, Modlitwa i warsztat, Andrzej 29.11; katalog: Bodziony, Murza | 2026-09-26 |
| 2015/2016 | `content/lectures/2015-2016.json` | **gate OK** (ponowne zamrożenie) — tytuł „Ikona dziś”; wykładowcy z tytułów; 14.06 Paprocki; 17.05 „XX wieku” | 2026-09-26 |
| 2014/2015 | `content/lectures/2014-2015.json` | **gate OK** — „Obraz i kult”; program 9 wieczorów (gate EJK); bez `note` inauguracja/wernisaż | 2026-09-26 |
| 2013/2014 | `content/lectures/2013-2014.json` | **gate OK** — „Ikona – miejsce spotkania”; 9 wieczorów; 24.10 bez „Inauguracja”; katalog: Sulikowska-Gąska | 2026-09-26 |
| 2012/2013 | `content/lectures/2012-2013.json` | **gate OK** — „Świat ikony”; 9 wieczorów; Paprocki + Nikolski (teologia / sztuka); intro z podziałem wykładów | 2026-09-26 |

## Zamrożenia — kawałek 2 v2 (aktualności)

**Decyzja techniczna (2026-09-27, faza 0):** **(B)** pipeline gate = edycja MDX + ten raport; re-sync z WP przez `npx tsx scripts/generate-news-sample.ts` tylko świadomie (nadpisuje `sample-*` i czyści `public/media/sample/news/`). `migrate-wp --only=news` pozostaje stub do **fazy 5** (wspólny moduł + `--dry-run` bez zapisu, respekt zamrożeń). Reguły transformacji: `scripts/generate-news-sample.ts` (nagłówek) + `docs/plan-claude-code.md` §3 etap 9 (K-50…K-58).

**Zakres gate (zamknięty 2026-09-27):** 61 postów WP + wpisy z hubów / annual (D20, D21 bez postów WP). **Stan:** brak plików `sample-*.mdx`; `manifest.json` — `"sample": true` = 0. Liczniki `kind` (docelowe): wystawa 24, wyklady 16, warsztaty 9, aktualnosc 4, oprowadzanie 2, plener 2, spotkanie 2, wyjazd 2. Pełna lista slugów: `manifest.json`.

### Formuła wpisów `kind: wyklady` (partia A — decyzja 2026-09-27, korekta)

**Stan migracji (etap 9):** treść news **nie** czyta `content/lectures/*.json` w runtime. Temat przewodni bierzemy z `cycleTitle` w JSON (gate); **nie** wklejamy `intro` / programu z hubu do MDX.

| Pole | Zasada |
| --- | --- |
| `title` | Tytuł cyklu + sezon (`cycleTitle` + `label`) |
| `excerpt` | Jedna z wariacji (dopasować do sezonu / tonu ogłoszenia), temat = `cycleTitle`: „Zapraszamy do zapoznania się z programem wykładów na nadchodzący rok akademicki. W tym roku tematem przewodnim będzie …”; „Ogłaszamy program wykładów na nadchodzący rok akademicki. …”; „Rozpoczynamy nowy sezon wykładów. …”; „Zapraszamy na kolejny rok wykładów w Akademii Ikony. W tym roku tematem przewodnim będzie …” (starsze sezony częściej ostatnia) |
| Body | **Ten sam tekst co `excerpt`** + akapit: „Zajrzyj na stronę [Wykłady](…), aby zobaczyć program tego sezonu.” — **nic więcej** |
| Link w akapicie | **Bieżący** sezon (`2026-2027`): `/wyklady`. **Archiwalny** (2012/2013–2025/2026): `/wyklady/archiwum` |
| Mapowanie slug → `cycleTitle` | `swiat-ikony-wyklady-rok-20122013` → `2012-2013`; `wyklady-20132014` → `2013-2014`; …; `ikona-korzenie-i-owoce-wiary-mistyka-dzis-wyklady-2026-2027` → `2026-2027` |

**Do refaktoryzacji (przyszły CMS EJK — etap 10+ / osobny projekt):** docelowo jeden formularz „nowy sezon wykładów”: submit aktualizuje `content/lectures/<bieżący>.json`, przenosi poprzedni sezon do archiwum, **generuje** wpis `/aktualnosci` i ewentualnie aktualizuje hub. Dziś duplikacja intro (JSON + MDX) jest świadoma i zamrożona przy gate.

**Otwarte (rozstrzygnąć przed CMS):**

1. **Bieżący vs przeszły sezon w aktualnościach** — czy po zakończeniu sezonu body wpisu news **zostaje** (kronika zapowiedzi), czy **jest przepisywane** (np. tylko link do archiwum)?
2. **Głębokie linki** — kotwice na `/wyklady/archiwum` per `season.slug` (np. `#2012-2013`) + automatyczne wstawianie w akapicie „zobacz program”; vs pełny program z powrotem w MDX dla sezonów archiwalnych.
3. **Single source of truth** — komponent news czytający `getSeason(slug)` vs generator przy submit CMS (preferowane przy formularzu).

**WP pominięte / poza manifestem (nie gate’ować jako osobne wpisy):** `podsumowanie-2019` (→ 3 split-y), `ikona-korzenie-i-owoce-wiary-2` (→ `annual.json`), posty scalone w `oprowadzania-po-wystawie-2017`, hub `/wydarzenia/`.

**WP skip (A3, duplikat):** post `sladami-najpiekniejszych-ikon-swiata` — treść zduplikowana w `spotkania-sladami-najpiekniejszych-ikon-swiata` — **bez** osobnego wpisu news; **301:** `docs/redirects.json` → `/aktualnosci/sladami-…` i `/sladami-najpiekniejszych-ikon-swiata` → `/aktualnosci/spotkania-sladami-…` (2026-09-27).

| Slug | kind | Decyzja gate | Data | Uwagi / EJK |
| --- | --- | --- | --- | --- |
| `plener-swietej-lipki-2019` | plener | **gate OK** (S1) | 2026-09-27 | split z `podsumowanie-2019`; media sample do kawałka 3 |
| `noc-swiatyn-2019` | wystawa | **gate OK** (S1) | 2026-09-27 | poprawiony link Noc Świątyń w body |
| `ikona-okno-duszy-2019` | wystawa | **gate OK** (S1) | 2026-09-27 | inauguracja wykładów w body; program → `wyklady-2019-2020` |
| `oprowadzania-po-wystawie-2017` | oprowadzanie | **gate OK** (S2) | 2026-09-27 | merge 3 postów WP; galeria 2+2 (Serce/Trójca/emaliowane); body Trójcy bez śmieci FooGallery |
| `wystawa-ikona-korzenie-i-owoce-wiary-oprowadzania-kuratorskie` | oprowadzanie | **gate OK** (S3) | 2026-09-27 | harmonogram 2017-06-21; bez obietnicy WP; link do `oprowadzania-po-wystawie-2017`; media sample → kawałek 3 |
| `nabor-kursu-2026-2027` | warsztaty | **gate OK** (S5) | 2026-09-27 | syntetyk; `featured` + `featuredUntil` 2026-09-24; cover sample; CTA → oferta kursu; `buildNabor2026Entry` zsynchronizowany |
| `swiat-ikony-wyklady-rok-20122013` | wyklady | **gate OK** (A1) | 2026-09-27 | formuła zajawki (temat „Świat ikony”) + link → `/wyklady/archiwum` |
| `wyklady-20132014` | wyklady | **gate OK** (A2) | 2026-09-27 | formuła zajawki (temat „Ikona – miejsce spotkania”) + link → `/wyklady/archiwum` |
| `wyklady-20142015` | wyklady | **gate OK** (A4) | 2026-09-27 | formuła zajawki (temat „Obraz i kult”); plakat sample → kawałek 3 |
| `wyklady-20152016-2` | wyklady | **gate OK** (A5) | 2026-09-27 | formuła zajawki (temat „Ikona dziś”) + link → `/wyklady/archiwum` |
| `wyklady-20162017` | wyklady | **gate OK** (A6) | 2026-09-27 | formuła zajawki (temat „Ikona – niebo na ziemi”); plakat sample → kawałek 3 |
| `wyklady-20172018` | wyklady | **gate OK** (A7) | 2026-09-27 | formuła zajawki (temat „O świętości”; `cycleTitle` szerszy w JSON) + link → `/wyklady/archiwum` |
| `wyklady-20182019` | wyklady | **gate OK** (A8) | 2026-09-27 | zajawka jak w `2018-2019.json` `intro` (bez zmian) + link → `/wyklady/archiwum` |
| `wyklady-2019-2020` | wyklady | **gate OK** (A9) | 2026-09-27 | zajawka z `2019-2020.json` `intro` + link → `/wyklady/archiwum` |
| `wyklady-2020-2021` | wyklady | **gate OK** (A10) | 2026-09-27 | zajawka: formuła + temat z `cycleTitle` (JSON `intro` niepełne) + link → `/wyklady/archiwum` |
| `wyklady-2021-2022` | wyklady | **gate OK** (A11) | 2026-09-27 | zajawka: formuła + temat „Światłość prawdziwa” z `cycleTitle` + link → `/wyklady/archiwum` |
| `wyklady-2022-2023` | wyklady | **gate OK** (A12) | 2026-09-27 | tytuł news krótki („Widzieć Niewidzialnego”); temat z `cycleTitle`; link → `/wyklady/archiwum` |
| `spotkania-sladami-najpiekniejszych-ikon-swiata` | spotkanie | **gate OK** (A3) | 2026-09-27 | cykl gościnny Sanktuarium Łaskawej; `kind` spotkanie (nie wyklady); program częściowy + placeholder; **EJK:** reszta programu + plakat (§ EJK) |
| `przyjazn-z-bogiem-bojazn-boza-wolnosc-czlowieka-wyklady-2023-2024` | wyklady | **gate OK** (A13) | 2026-09-27 | zajawka jak sample WP; temat z `cycleTitle` + link → `/wyklady/archiwum` |
| `piekno-boga-piekno-czlowieka-wyklady-2024-2025` | wyklady | **gate OK** (A14) | 2026-09-27 | zajawka jak sample; link → `/wyklady/archiwum` |
| `ikona-korzenie-i-owoce-wiary-madrosc-boza-wyklady-2025-2026` | wyklady | **gate OK** (A15) | 2026-09-27 | zajawka „Mądrość Boża”; link → `/wyklady/archiwum` |
| `ikona-korzenie-i-owoce-wiary-mistyka-dzis-wyklady-2026-2027` | wyklady | **gate OK** (A16) | 2026-09-27 | zajawka „Mistyka dziś”; link → `/wyklady` (bieżący sezon) |

| `miedzynarodowe-warsztaty-oraz-wystawa-ikon-z-pracowni-akademii-ikony-w-swietej-lipce-19-27-sierpnia-2017` | warsztaty | **gate OK** (B1) | 2026-09-27 | intro (daty, wystawa, link swlipka) + relacja z sample (Krajewski, EJK itd.); media sample → kawałek 3 |
| `sesja-ikonowa-modlitwa-psalmami-i-wystawa-ikon-w-swietej-lipce-2016` | wyjazd | **gate OK** (B2) | 2026-09-27 | gate w partii B; `kind` wyjazd; tytuł bez „Sesja ikonowa”; 11 zdj. z WP (Blogspot); scalenie treści Lipka z `tworcze-lato-2016` (bez Warszawy); **EJK:** `alt` galerii |

**WP skip (B3):** `tworcze-lato-2016` — https://www.akademiaikony.pl/tworcze-lato-2016/ — duplikat Lipki 2016; fragmenty (wykłady „Świat ikony”, warsztaty, poświęcenie) → wpis kanoniczny powyżej; warsztaty warszawskie 4–10 VII pominięte; **301:** `docs/redirects.json` → `/aktualnosci/tworcze-lato-2016` i `/tworcze-lato-2016` (2026-09-27).

| `wakacyjne-warsztaty-ikonograficzne-w-warszawie` | warsztaty | **gate OK** (B4) | 2026-09-27 | opis z WP (bez Word/„LIPIEC, WRZESIEŃ”); bez maila; link → letnia szkoła; 8 zdj. 2014; **EJK:** `alt` |
| `warsztaty-pisania-ikon-w-kosciele-srodowisk-tworczych-w-warszawie` | warsztaty | **gate OK** (B5) | 2026-09-27 | zapowiedź KŚT 2017; bez harmonogramu wykładów (→ archiwum); CTA → kurs roczny; rozważania o ikonie jak WP |
| `warsztaty-pisania-ikon` | warsztaty | **gate OK** (B6) | 2026-09-27 | tytuł/zajawka „Zapraszamy…”; opis 2012/13; bez maila WP; `<NewsCta />` → kurs (refakt. etap 10) |
| `warsztaty-w-kosciele-srodowisk-tworczych-pp-sw-andrzeja-apostola-i-sw-brata-alberta-w-warszawie-plac-teatralny-20` | warsztaty | **gate OK** (B7) | 2026-09-27 | model kursu podst./dosk.; bez terminu września 2016; slug jak WP; `<NewsCta />` → kurs |
| `warsztaty-w-lipcu` | warsztaty | **gate OK** (B8) | 2026-09-27 | lipiec 2015 KŚT + 15 VII Osuchowska; bez ceny/kontaktu; 3 zdj. WP; bez CTA; **EJK:** `alt` |
| `nasze-pisanie-ikon` | aktualnosc | **gate OK** (C1) | 2026-09-27 | zapisy VI 2017; galeria 12 zdj.; bez maila WP; link → `/warsztaty`, kurs; bez CTA; **EJK:** `alt` galerii |
| `pracujemy` | aktualnosc | **gate OK** (C2) | 2026-09-27 | tytuł „W pracowni Akademii Ikony — grudzień 2016”; fotorelacja WP (10 zdj. Blogspot); bez CTA; **EJK:** `alt` galerii |
| `program-na-rok-20152016-zapraszamy-serdecznie` | aktualnosc | **gate OK** (C3) | 2026-09-27 | kronika sezonu 2015/2016 (lista formacji); bez zapisów/maila/tel. WP; link → archiwum wykładów, `/warsztaty` |
| `tejemnice-ikony` | aktualnosc | **gate OK** (C4) | 2026-09-27 | tytuł „Tajemnice…”; opis archiwalny; 6 zdj. (WP uploads + Blogspot); bez spotkania info X 2015; link → `/warsztaty`, `/kontakt`; **EJK:** `alt` galerii |
| `wakacyjne-wyjazdy-studyjne-grodek` | plener | **gate OK** (E1) | 2026-09-27 | `kind: plener` (decyzja 2026-09-27); wstęp VIII 2017 + opis cerkwi z WP; 7 zdj. uploads 1024px; link → Letnia Szkoła Światła; **EJK:** `alt`; por. TODO plener vs wyjazd |
| `wakacyjne-wyjazdy-studyjne-mielnik-nad-bugiem` | wyjazd | **gate OK** (F1) | 2026-09-27 | para z Gródkiem (VIII 2017); opis Mielnika + podpis fot.; 10 zdj.; link → Letnia Szkoła Światła; **EJK:** `alt` |
| `wyjazd-studyjny-sladami-ikon-prof-jerzego-nowosielskiego` | wyjazd | **gate OK** (F2) | 2026-09-27 | 16 VII 2017 Klimaka + Wesoła; relacja WP bez FooGallery; 4 zdj.; **EJK:** `alt` |
| `spotkania-z-grzegorzem-zinkiewiczem` | spotkanie | **gate OK** (F3) | 2026-09-27 | bio + galeria 11 zdj.; caption na porcie Grzegorza; **EJK:** `alt` reszty |
| `spotkanie-z-michalem-ploskim` | spotkanie | **gate OK** (F4) | 2026-09-27 | wykład 26 IV 2016 KŚT; 3 zdj. Blogspot; link YouTube (K-78); **EJK:** `alt` galerii |

| `dnia-17-lipca-wspomnienie-sw-andrieja-rublowa` | wystawa | **gate OK** (D1) | 2026-09-27 | finisaż „Ikona dziś” 2015 KŚT; 4 zdj. Blogspot; link → `/ikony/wystawy#wystawa-2015`; **EJK:** `alt` galerii |

| `ekumeniczna-droga-krzyzowa-w-warszawie` | aktualnosc | **gate OK** (D2) | 2026-09-27 | Droga Krzyżowa 31 III 2017 KŚT; `kind` aktualnosc (nie wystawa); foto Blogspot + plakat PNG; **EJK:** `alt` |

| `ikona-dzis-3` | aktualnosc | **gate OK** (D3) | 2026-09-27 | tytuł „Jeden dzień z życia Akademii Ikony”; dzień wystawy „Ikona dziś” 2015 (warsztaty, oprowadzania); 7 zdj.; link → `#wystawa-2015`; **EJK:** `alt` |

| `ikona-okno-ku-wiecznosci-2` | wystawa | **gate OK** (D4) | 2026-09-27 | Izabelin XII 2013–I 2014; `venue: Izabelin` → `#wyjazdowe` (K-87); 2 zdj.; **EJK:** `alt` |

| `ikona-okno-ku-wiecznosci` | wystawa | **gate OK** (D5) | 2026-09-27 | wystawa autorska EJK, KŚT V–VI 2014; fotorelacja wernisażu; `venue: Warszawa` → `#wyjazdowe` (tymczasowo K-87); link → D4; **EJK:** `alt` |

| `ikona-piekno-zanurzone-w-tajemnicy` | wystawa | **gate OK** (D6); **korekta P4 Tura C #3** 2026-09-27 | Bażantarni 24–26 VIII **2019** (nie 2013); scalone z `podsumowanie-2019`; +4 zdj. import; `alt` Chomczyk + Bażantarni |

| `ikonografia-patronow-pielgrzymow` | spotkanie | **gate OK** (D7) | 2026-09-27 | prelekcja Kazimierczaka 10 XI 2015; cykl „Śladami…”; `kind` spotkanie; `date` 2015-11-10; 1 zdj.; **EJK:** `alt` |

| `jestesmy-pielgrzymami` | spotkanie | **gate OK** (D8) | 2026-09-27 | Kazimierczak 8 IV 2014, kaplica Peradze; skrócony wstęp; `date` 2014-04-08; 1 zdj. WP uploads; link → cykl „Śladami…”; **EJK:** `alt` |

| `noc-muzeow-2014` | aktualnosc | **gate OK** (D9) | 2026-09-27 | Noc Muzeów, Muzeum Ikon 2014; `kind` aktualnosc; 3 zdj.; `alt` Zdjęcia Aleksandra Kurek |

| `sesja-ikonowa-w-swietej-lipce` | plener | **gate OK** (D10) | 2026-09-27 | Lipka IX 2015; `kind` plener; 19 zdj.; body redakcja; link → Letnia Szkoła; **EJK:** `alt` |

| `wystawa-ikon-w-kosciele-bl-wladyslawa-z-gielniowa-patrona-warszwy` | wystawa | **gate OK** (D11) | 2026-09-27 | Okno ku wieczności 22 VI 2014 bł. Władysław; `venue: Warszawa`; 5 zdj.; link → D5; **EJK:** `alt` |

| `wystawa-ikon-w-kosciele-srodowisk-tworczych-warszawa-plac-teatralny-20` | wystawa | **gate OK** (D12) | 2026-09-27 | Doroczna 2016 „niebo na ziemi”; `venue: Warszawa`; 6 zdj.; link `#wystawa-2016`; **EJK:** `alt` |

| `wystawa-ikon-w-swidnicy-czynna-w-dniach-4-07-25-08-2014-zapraszamy` | wystawa | **gate OK** (D13) | 2026-09-27 | Wyjazdowa Świdnica; 1 zdj. (featured WP media 813); **EJK:** `alt` |

| `wystawa-ikon-w-wilnie` | wystawa | **gate OK** (D14) | 2026-09-27 | Wilno X 2013 „Ikona i jej konteksty”; `venue: Wilno`; 7 zdj.; body redakcja; **EJK:** `alt` |

| `wystawa-ikona-dzis` | wystawa | **gate OK** (D15) | 2026-09-27 | Doroczna 2015 KŚT; `venue: Warszawa`; 9 zdj. (featured + 8 WP); link `#wystawa-2015`; **EJK:** `alt` |

| `wystawa-ikona-korzenie-i-owoce-wiary-2018` | wystawa | **gate OK** (D16) | 2026-09-27 | Doroczna 2018 KŚT; `venue: Warszawa`; 24 zdj. + poster featured (1536); body z WP; **EJK:** `alt` |

| `wystawa-ikona-piekno-zanurzone-w-tajemnicy` | wystawa | **gate OK** (D17) | 2026-09-27 | Powsin XII 2015–I 2016; `venue: Powsin`; 9 zdj. + poster (810); **EJK:** `alt` |

| `wystawa-ikona-sztuka-i-modlitwa` | wystawa | **gate OK** (D18) | 2026-09-27 | Katedra Floriańska III niedziela LP 2018; `venue: Warszawa`; 9 zdj. + poster (1484); **EJK:** `alt` |

| `wystawa-w-kosciele-pw-sw-andrzeja-apostola` | wystawa | **gate OK** (D19) | 2026-09-27 | Chłodna 9, 30 XI 2013; `date` wydarzenia; `venue: Warszawa`; 8 zdj. z WP; **EJK:** `alt` |

| `wystawa-piekno-boga-piekno-czlowieka-2025` | wystawa | **gate OK** (D20) | 2026-09-27 | Doroczna 2025 KŚT; brak posta WP; placeholdery treści; `#wystawa-2025` |

| `wystawa-madrosc-boza-2026` | wystawa | **gate OK** (D21) | 2026-09-27 | Doroczna 2026 KŚT; brak posta WP; placeholdery treści; `#wystawa-2026` |

**Partia D (wystawa) — gate OK** 2026-09-27: D1–D21; D2–D3, D7–D10 → plener/spotkanie/aktualnosc; **0** sample `kind: wystawa` w news.

**Partia F (wyjazd + spotkanie) — zamknięta** 2026-09-27: F1–F4 (+ wcześniej A3 `spotkania-sladami…`, B2 Lipka 2016 `wyjazd`).

**Partia C (aktualność) — zamknięta** 2026-09-27: C1–C4 (4/4).

**Partia E (plener) — zamknięta** 2026-09-27: `plener-swietej-lipki-2019` (S1) + E1 Gródek (2/2).

**Partia B (warsztaty) — zamknięta** 2026-09-27: B1, B4–B8 zamrożone; B2 → `kind: wyjazd`; B3 `tworcze-lato-2016` skip + 301; `nabor-kursu-2026-2027` (S5).

**Partia A — zamknięta** 2026-09-27 (**16/16**).

**WP skip (S1):** post `podsumowanie-2019` — nie jako jeden wpis news; rollup **zamknięty** (splity S1 + P4 Tura A/C, wiersz #9 skip).

**WP skip (S2):** posty scalone w `oprowadzania-po-wystawie-2017` (nie osobne wpisy news): `ikona-serca-jezusa`, `ikona-trojcy-swietej`, `ikony-emaliowane`. Osobno (S3): `wystawa-ikona-korzenie-i-owoce-wiary-oprowadzania-kuratorskie`.

**WP skip (S4):** post `ikona-korzenie-i-owoce-wiary-2` — **gate OK** 2026-09-27: bez wpisu `/aktualnosci`; copy → `/ikony/wystawy`. **Media:** `page.mdx` `interiorPhotos[1]` — `import/exhibition/20250613_194453-scaled.jpg` (WP 2025-06); `[0]` sample do fali mediów.

### Backlog — treść z `podsumowanie-2019` poza 3 splitami

Źródło: rollup WP „Podsumowanie roku 2019 i 2020 – wystawy” (2020-02-19). **Backlog zamknięty** 2026-09-27 — tabela archiwalna (rozstrzygnięcia P4 / skip #9).

| # | Daty | Wydarzenie (z WP) | Propozycja docelowa |
| --- | --- | --- | --- |
| 1 | 14 VI – 21 VII 2019 | Wystawa KŚT „Ikona – korzenie i owoce wiary”, podtytuł „Świętych obcowanie”; **długi opis aranżacji** (nawa, msza, dyżury, oprowadzania, R. Rumin / św. Rita) | **P4 Tura A ✅** — redakcja w `content/exhibition/body.mdx` (nie news); doroczna 2019 → backlog refactor R6 |
| 2 | 1 VIII – 31 VIII 2019 | Wystawa EJK, galeria „Praga del ARTE”, ul. Brzeska 20 | **P4 Tura C ✅** — `wystawa-praga-del-arte-2019.mdx`, `kind: wystawa`, `venue: Warszawa` |
| 3 | 24–26 VIII 2019 | Wystawa w kościele bł. Władysława, ul. Przy Bażantarni 3 | **P4 Tura C ✅** — scalone z `ikona-piekno-zanurzone-w-tajemnicy` (daty 2019, +4 zdj. WP) |
| 4 | 1 IX – 20 IX 2019 | Wystawa „Ikona – okno ku wieczności” w KŚT (2019); start cyklu comiesięcznych + zapowiedź wykładów | **P4 Tura C ✅** — `wystawa-ikona-okno-ku-wiecznosci-2019.mdx`; +1 zdj. import |
| 5 | 1 XI – 30 XI 2019 | Wystawa „Ikona – drabina do nieba”; wykłady 19 XI (Wojnarowski, Batorski) | **P4 Tura C ✅** — `wystawa-ikona-drabina-do-nieba-2019.mdx`; +1 zdj. import |
| 6 | 1 XII – 15 XII 2019 | „Ikona – nadzieja i oczekiwanie”; warsztaty otwarte, kiermasz | **P4 Tura C ✅** — `wystawa-ikona-nadzieja-i-oczekiwanie-2019.mdx`; +1 zdj. import |
| 7 | 15 XII 2019 – 5 I 2020 | Galeria Wieży, kościół Wniebowstąpienia, ul. KEN 102 | **P4 Tura C ✅** — `wystawa-galeria-wiezy-ken-2019.mdx`; +3 zdj. import |
| 8 | 21 XII 2019 – 6 I 2020 | Wystawa ikony Bożego Narodzenia (KŚT) | **P4 Tura C ✅** — `wystawa-ikona-bozego-narodzenia-kst-2019.mdx`; +1 zdj. import |
| 9 | 2020 (bez kalendarium w poście) | Comiesięczne wystawy KŚT; Sanktuarium MB Jedności Chrześcijan; Muzeum w Świętej Lipce; motyw „Światłość w ciszy”; film YouTube | **✅ skip** 2026-09-27 — treść rozplanowana poza rollupem; nie migrować jako news z tego akapitu |

**Pokryte gdzie indziej (nie duplikować bez potrzeby):** split S1 (#3 Lipka → `plener-swietej-lipki-2019`, #6 Noc → `noc-swiatyn-2019`, #7 Okno duszy → `ikona-okno-duszy-2019`); program wykładów → `wyklady-2019-2020` / `wyklady-2020-2021`.

**Partie gate (K-122):** A wyklady (16) ✅ → B warsztaty (9) ✅ → C aktualnosc (4) ✅ → D wystawa (24, D1–D21) ✅ → E plener ✅ → F wyjazd/spotkanie ✅ → G oprowadzanie (2 zamrożone w S2/S3). **Faza 1:** S1–S5 ✅.

**Kawałek 2 v2 (aktualności + wykłady) — gate zamknięty** 2026-09-27 (build/lint OK po D21).

## WP zamknięte — kawałek 2 v2

Treść z poniższych domen uznajemy za zmigrowaną — **bez ponownego fetchu** pod te wpisy (wyjątki: świadome pominięcia w tabeli zamrożeń / skip powyżej):

| Domena | Stan |
| --- | --- |
| Posty WP → `content/news/*.mdx` | ✅ gate partie A–F + D (szczegóły w tabeli slugów poniżej) |
| `sample-*.mdx` | ✅ usunięte |
| `content/news/manifest.json` | ✅ wygenerowany; brak `"sample": true` |
| `content/lectures/*.json` | ✅ sezony 2012/2013–2025/2026 + bieżący poza archiwalnym gate |
| Bez postu WP | `wystawa-piekno-boga-piekno-czlowieka-2025`, `wystawa-madrosc-boza-2026` — placeholdery treści, linki `#wystawa-2025` / `#wystawa-2026` |

**Handoff → kawałek 3 v2:** media poza aktualnościami (`public/media/sample/` poza skopiowanymi plikami news, `import/static/`, hero ofert, okładka/rozkładówki publikacji), pozostałe `grep sample` w `content/`, `content/exhibition/` (P4 Tura B). Strony WP P0–P8 — **zamknięte** (`migrate-report.md` § P0–P8); `docs/redirects.json` — uzupełniać przy kolejnych 301; wdrożenie w `next.config.ts` — osobny krok etapu 9/11.

## Media aktualności — zamknięte (2026-09-28)

| Element | Stan |
| --- | --- |
| Weryfikacja mediów (aktualności) | ✅ `docs/plans/09-migration-media.md` § M0 — przegląd zakończony przez właściciela repo |
| Ścieżki w treści | ✅ `content/news/*.mdx` + `manifest.json` — wyłącznie `/media/import/news/…` (brak `/media/sample/news/`) |
| Pliki | ✅ `public/media/import/news/{slug}/` (kopie z `public/media/sample/news/`; nazewnictwo: `1.jpg`…, `poster.jpg`, `cover.jpg` lub oryginalne nazwy WP tam, gdzie gate tak ustalił) |
| Skrypt | `npx tsx scripts/promote-news-media-from-sample.ts` (jednorazowo) + `generateNewsManifest()` |
| Build / lint | ✅ po zamknięciu |

**Otwarte (treść / etap 10, nie blokuje mediów):** EJK — program + skan plakatu `spotkania-sladami-najpiekniejszych-ikon-swiata`; masowe `alt`; plakaty (~20) w `News.poster`.

## TODO — kawałek 2 v2 (aktualności, po zamknięciu gate)

- [ ] **`kind: plener` vs `kind: wyjazd` (przed zamknięciem etapu 9):** uporządkować model i treść — dziś dwa osobne `NewsKind` (`pl.ts`: „Plener” / „Wyjazd studyjny”); heurystyka importu: `wakacyjne-wyjazdy-*` → zwykle `wyjazd`, wyjątek `…-grodek` → `plener` (`generate-news-sample.ts`). **Decyzja gate E1 (2026-09-27):** `wakacyjne-wyjazdy-studyjne-grodek` zostaje **`plener`**. Do rozstrzygnięcia przed końcem migracji: czy scalić / zrefaktoryzować oba kindy (filtry `/aktualnosci`, etykiety, mapowanie slugów, spójność z ofertą Letnia Szkoła Światła vs wyjazdy studyjne — np. Lipka 2016 `wyjazd` vs Lipka 2019 `plener`); ewent. jeden kind + podtyp lub jedna etykieta UI — **nie** blokować gate E/F; wykonać przed sekcją raportu „WP zamknięte — kawałek 2 v2” i DoD etapu 9.
- [ ] **Plener — „Gdzie byliśmy”:** cross-check każdej pozycji `whereWeWere` z wpisami aktualności (`kind: 'plener'`) po migracji news; uzupełnić lata, wykreślić miejsca bez udokumentowanego pleneru.
- [x] **Backlog `podsumowanie-2019` (P0 + P4, 2026-09-27):** #1 → P4 Tura A; #2–#8 → news Tura C; #9 → skip (plan poza postem).
- [ ] **Plakaty WP (P0 #25):** wpis zbiorczy + etap 10 — rozłożyć na wpisy docelowe i skasować zbiorczy.
- [ ] **0.2A:** `generate-news-sample.ts --dry-run` (lub `domains/news.ts`) — diff do raportu, zero nadpisywania po zamrożeniu.

## Do etapu 10 — uwagi z kawałka 2 v2 (aktualności)

- [ ] **`/ikony/wystawy` — sekcja „Wystawy wyjazdowe” → „Wystawy specjalne” (po zakończonej migracji etapu 9):** nagłówek, lead, anchor (`#wyjazdowe` → np. `#specjalne`), copy w `pl.ts` i nawigacji strony wystaw; logika listy obejmuje **wyjazdowe/gościnne** oraz **krótkie wystawy specjalne w KŚT** (np. autorska EJK „Okno ku wieczności” 2014), które nie są ekspozycją codzienną ani doroczną. Dziś K-87: `getTravelingExhibitions()` = `kind: wystawa` + `venue` (m.in. Izabelin, Warszawa 2014); po refaktorze — nazwa sekcji i ewent. kryterium / etykiety listy (Warszawa vs miejscowość wyjazdowa).
- [ ] **Wpis `kind: warsztaty` z `<NewsCta />` w MDX** (np. B5, B6, `nabor-kursu-2026-2027`): po zakończonej migracji — refaktoryzacja układu CTA w aktualnościach; obecny blok wizualnie nie wypada (makieta C2 vs archiwalny kontekst). Ustalić wspólny wzorzec (copy przed CTA, jedna oferta docelowa, ewent. bez CTA w starych wpisach).
- [ ] **`oprowadzania-po-wystawie-2017`:** cytat metryczki Roberta Rumina w body — potwierdzić zgodę na publikację (plan §3 etap 9).
- [ ] **`oprowadzania-po-wystawie-2017`:** zdanie o „jedynym kanonicznym przedstawieniu” Trójcy Świętej — korekta merytoryczna EJK.

## Do etapu 10 — uwagi z kawałka 1 v2

- [ ] **Kurs — „Dalsza droga”:** prawa kolumna pusta obok sekcji; rozważyć osobny przycisk CTA (np. zgłoszenie na kurs doskonalący / konsultację) albo zdjęcie po prawej.
- [ ] **Kurs — cytat „Piotr, uczestnik”** we frontmatterze: brak źródła w `09-migration-source.md`; potwierdzić pochodzenie lub wymienić.
- [ ] **Linki w MDX ofert** (`mailto:`, `tel:`) nie mają stylu inline — w treści ofert kontakt jest zwykłym tekstem; rozważyć styl `a` w `mdx-components.tsx`.

## Kawałek 1 — static — 2026-09-26

- o-akademii: WP slug "celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-ale-i-pomoc-w-doswiadczaniu-ikony", modified 2026-01-04, html 8308 chars
- pracownia: WP slug "pracownia", modified 2026-01-04, html 18847 chars
- kontakt: WP slug "kontakt", modified 2026-09-08, html 832 chars
- polityka-prywatnosci: WP slug "polityka-prywatnosci", modified 2026-01-04, html 4507 chars
- [dry-run] would write \content\pages\kontakt.mdx (142 chars)
- settings.json: no WP-driven changes
- [dry-run] would write polityka-prywatnosci.json (fingerprint 421d08945605)
- o-akademii: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- pracownia: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- o-akademii: 4 linked upload(s), 4 ready (dry-run)
- pracownia: 16 linked upload(s), 16 ready (dry-run)
- sample flags on o-akademii.json / pracownia.json: left unchanged until gate (plan kawałek 1)

## Kawałek 1 — static — 2026-09-26

- o-akademii: WP slug "celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-ale-i-pomoc-w-doswiadczaniu-ikony", modified 2026-01-04, html 8308 chars
- pracownia: WP slug "pracownia", modified 2026-01-04, html 18847 chars
- kontakt: WP slug "kontakt", modified 2026-09-08, html 832 chars
- polityka-prywatnosci: WP slug "polityka-prywatnosci", modified 2026-01-04, html 4507 chars
- wrote \content\pages\kontakt.mdx
- settings.json: no WP-driven changes
- wrote content/pages/polityka-prywatnosci.json
- o-akademii: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- pracownia: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- o-akademii: 4 linked upload(s), 4 ready (disk)
- pracownia: 16 linked upload(s), 16 ready (disk)
- sample flags on o-akademii.json / pracownia.json: left unchanged until gate (plan kawałek 1)

## Kawałek 1 — static — 2026-09-26

- o-akademii: WP slug "celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-ale-i-pomoc-w-doswiadczaniu-ikony", modified 2026-01-04, html 8308 chars
- pracownia: WP slug "pracownia", modified 2026-01-04, html 18847 chars
- kontakt: WP slug "kontakt", modified 2026-09-08, html 832 chars
- polityka-prywatnosci: WP slug "polityka-prywatnosci", modified 2026-01-04, html 4507 chars
- wrote \content\pages\kontakt.mdx
- settings.json: no WP-driven changes
- wrote content/pages/polityka-prywatnosci.json
- o-akademii: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- pracownia: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- o-akademii: 4 linked upload(s), 4 ready (disk)
- pracownia: 16 linked upload(s), 16 ready (disk)
- sample flags on o-akademii.json / pracownia.json: left unchanged until gate (plan kawałek 1)

## Kawałek 2 v2 — lectures — 2026-09-26

- Fetched 17 WP posts in category wyklady
- ⚠️ 2012-2013 2013-06-20: unresolved lecturer "ikona w liturgii." (EJK / gate)
- 2012-2013: 8 lectures from swiat-ikony-wyklady-rok-20122013 → content/lectures/2012-2013.json
- ⚠️ 2013-2014 2013-10-24: unresolved lecturer "godz. 17.00</b></b></p>" (EJK / gate)
- ⚠️ 2013-2014 2013-10-24: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-10-24: unresolved lecturer "ks. dr Aleksander Jacyniak SJ</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-10-24: unresolved lecturer "mgr Witali Michalczuk</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-10-24: unresolved lecturer "godz. 17.30</b></div>" (EJK / gate)
- ⚠️ 2013-2014 2013-10-24: unresolved lecturer "ks. Grzegorz Michalczyk</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "godz. 17.30</b></div>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "ks. Grzegorz Michalczyk</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "mgr Witali Michalczuk</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "godz. 17.30</b></div>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "mgr Łukasz Leonkiewicz</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "godz. 17.30 </b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "dr Jerzy Kazimierczak</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "godz. 17.30</b></div>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "mgr Łukasz Leonkiewicz</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "godz. 17.30 </b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "dr Jerzy Kazimierczak</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "godz. 17.30 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "godz. 17.30 </b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "dr Jerzy Kazimierczak</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "godz. 17.30 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "godz 17.30 </b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "ks. dr Artur Aleksiejuk.</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "godz. 17.30 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "godz 17.30 </b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "ks. dr Artur Aleksiejuk.</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "godz. 17.30 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "dr Ewa Kocój</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "godz 17.30 </b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "ks. dr Artur Aleksiejuk.</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "godz. 17.30 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "dr Ewa Kocój</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "godz. 17.30</b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "pisarze ascetyczni ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "godz. 17.30 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "dr Ewa Kocój</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "ks. dr Piotr Nikolski</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "godz. 17.30</b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "pisarze ascetyczni ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "dr Aleksandra Sulikowska- Gąska</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "godz 17.00 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "godz. 17.30</b></b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "pisarze ascetyczni ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "dr Aleksandra Sulikowska- Gąska</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "godz 17.00 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "ks. dr Artur Aleksiejuk</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-06-12: unresolved lecturer "godz 17.00 </b></div>" (EJK / gate)
- ⚠️ 2013-2014 2014-06-12: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-06-12: unresolved lecturer "ks. dr Henryk Paprocki</li>" (EJK / gate)
- ⚠️ 2013-2014 2014-06-12: unresolved lecturer "ks. dr Artur Aleksiejuk</li>" (EJK / gate)
- 2013-2014: 9 lectures from wyklady-20132014 → content/lectures/2013-2014.json
- ⚠️ No season slug for WP post "spotkania-sladami-najpiekniejszych-ikon-swiata" — skipped
- ⚠️ 2014-2015 2014-10-23: unresolved lecturer "</span></i></div>" (EJK / gate)
- ⚠️ 2014-2015 2014-10-23: unresolved lecturer "</span></b><i><span style="font-size: 10.0pt; mso-bidi-font-size: 12.0pt; mso-fareast-language: PL;">mgr Witali Michalczuk</span></i></div>" (EJK / gate)
- ⚠️ 2014-2015 2014-12-18: unresolved lecturer "ks Grzegorz Michalczyk" (EJK / gate)
- ⚠️ 2014-2015 2015-01-22: unresolved lecturer "ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2014-2015 2015-03-19: unresolved lecturer "</span></b><i><span style="font-size: 10.0pt; mso-bidi-font-family: ArialMT; mso-bidi-font-size: 13.0pt; mso-fareast-font-family: ArialMT; mso-fareast-language: PL;">dr hab. Ewa Kocój</span></i></div>" (EJK / gate)
- ⚠️ 2014-2015 2015-03-19: unresolved lecturer "</span></b><i><span style="font-size: 10.0pt; mso-bidi-font-family: ArialMT; mso-bidi-font-size: 13.0pt; mso-fareast-font-family: ArialMT; mso-fareast-language: PL;">dr hab. Ewa Kocój</span></i></div>" (EJK / gate)
- ⚠️ 2014-2015 2015-04-16: unresolved lecturer "które chcą uczestniczyć wyłącznie w części teoterychnej Akademii Ikony. Zgłoszenia i pytania: sekretariat.ikony22@gmail.com." (EJK / gate)
- 2014-2015: 6 lectures from wyklady-20142015 → content/lectures/2014-2015.json
- ⚠️ No season slug for WP post "wyklady-20152016-2" — skipped
- ⚠️ 2016-2017 2017-06-16: unresolved lecturer "sans-serif; font-size: 12.8px; text-align: center;">Spotkania moderuje <em>Elżbieta Jackowska-Kurek</em></div>" (EJK / gate)
- ⚠️ 2016-2017 2017-06-16: unresolved lecturer "</div>" (EJK / gate)
- ⚠️ 2016-2017 2017-06-16: unresolved lecturer "</div>" (EJK / gate)
- 2016-2017: 2 lectures from wyklady-20162017 → content/lectures/2016-2017.json
- ⚠️ 2017-2018 2017-10-24: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz." (EJK / gate)
- ⚠️ 2017-2018 2017-11-14: unresolved lecturer "ks Roman Batorski." (EJK / gate)
- ⚠️ 2017-2018 2017-12-19: unresolved lecturer "Elżbieta Jackowska-Kurek i Maria Osuchowska-Marcelleti." (EJK / gate)
- ⚠️ 2017-2018 2018-01-16: unresolved lecturer "ks. dr Piotr Nikolski." (EJK / gate)
- ⚠️ 2017-2018 2018-02-27: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz." (EJK / gate)
- ⚠️ 2017-2018 2018-03-13: unresolved lecturer "ks. dr Henryk Paprocki." (EJK / gate)
- ⚠️ 2017-2018 2018-04-10: unresolved lecturer "Krzysztof Sokołowski." (EJK / gate)
- ⚠️ 2017-2018 2018-04-17: unresolved lecturer "ks. dr Artur Aleksiejuk." (EJK / gate)
- ⚠️ 2017-2018 2018-05-15: unresolved lecturer "ks. prof. Józef Naumowicz." (EJK / gate)
- ⚠️ 2017-2018 2018-05-22: unresolved lecturer "dr Irina Tatarowa." (EJK / gate)
- ⚠️ 2017-2018 2018-06-15: unresolved lecturer "moderuje Elżbieta Jackowska-Kurek" (EJK / gate)
- 2017-2018: 24 lectures from wyklady-20172018 → content/lectures/2017-2018.json
- ⚠️ 2018-2019 2018-10-16: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2018-2019 2018-11-27: unresolved lecturer "ks. prof Józef Naumowicz" (EJK / gate)
- ⚠️ 2018-2019 2018-12-11: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2018-2019 2019-01-22: unresolved lecturer "ks. dr Henryk Paprocki" (EJK / gate)
- ⚠️ 2018-2019 2019-02-12: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2018-2019 2019-03-19: unresolved lecturer "dr Justyna Spruth" (EJK / gate)
- ⚠️ 2018-2019 2019-04-30: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2018-2019 2019-05-14: unresolved lecturer "ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2018-2019 2019-05-21: unresolved lecturer "ks. dr Artur Aleksiejuk" (EJK / gate)
- ⚠️ 2018-2019 2019-06-11: unresolved lecturer "dr hah. Barbara Strzałkowska prof UKSW" (EJK / gate)
- ⚠️ 2018-2019 2019-06-14: unresolved lecturer "moderuje Elżbieta Jackowska-Kurek" (EJK / gate)
- 2018-2019: 25 lectures from wyklady-20182019 → content/lectures/2018-2019.json
- ⚠️ 2019-2020 2019-12-10: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2019-2020 2020-01-21: unresolved lecturer "ks. dr Henryk Paprocki" (EJK / gate)
- ⚠️ 2019-2020 2020-02-18: unresolved lecturer "ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2019-2020 2020-04-28: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2019-2020 2020-06-19: unresolved lecturer "moderuje Elżbieta Jackowska-Kurek" (EJK / gate)
- 2019-2020: 10 lectures from wyklady-2019-2020 → content/lectures/2019-2020.json
- ⚠️ No season slug for WP post "podsumowanie-2019" — skipped
- ⚠️ 2020-2021 2020-10-27: unresolved lecturer "ks. prof dr hab. Józef Naumowicz" (EJK / gate)
- ⚠️ 2020-2021 2020-11-17: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz" (EJK / gate)
- ⚠️ 2020-2021 2021-01-19: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2020-2021 2021-04-13: unresolved lecturer "ks. diakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2020-2021 2021-06-18: unresolved lecturer "nie tylko osoby piszące ikony. Zajęcia odbywają się w wybrane wtorki każdego miesiąca w godz. 18.00 – 20.30 w Kościele Środowisk Twórczych pw. św. św. Brata Alberta i Andrzeja Apostoła na Placu Teatralnym w Warszawie." (EJK / gate)
- 2020-2021: 11 lectures from wyklady-2020-2021 → content/lectures/2020-2021.json
- ⚠️ 2021-2022 2021-11-16: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz" (EJK / gate)
- ⚠️ 2021-2022 2021-12-14: unresolved lecturer "kiermasz świąteczny" (EJK / gate)
- ⚠️ 2021-2022 2022-03-15: unresolved lecturer "Krzysztof Sokolovski" (EJK / gate)
- ⚠️ 2021-2022 2022-04-19: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz" (EJK / gate)
- ⚠️ 2021-2022 2022-05-17: unresolved lecturer "dr Dorota Walczak" (EJK / gate)
- ⚠️ 2021-2022 2022-06-17: unresolved lecturer "nie tylko osoby piszące ikony. Zajęcia odbywają się w wybrane wtorki każdego miesiąca w godz. 18.00 – 20.30 w Kościele Środowisk Twórczych pw. św. św. Brata Alberta i Andrzeja Apostoła na Placu Teatralnym w Warszawie." (EJK / gate)
- 2021-2022: 10 lectures from wyklady-2021-2022 → content/lectures/2021-2022.json
- ⚠️ 2022-2023 2022-10-11: unresolved lecturer "s. dr hab. Judyta Pudełko PDDM" (EJK / gate)
- ⚠️ 2022-2023 2022-12-13: unresolved lecturer "kiermasz świąteczny" (EJK / gate)
- ⚠️ 2022-2023 2023-01-17: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz" (EJK / gate)
- ⚠️ 2022-2023 2023-04-18: unresolved lecturer "prof. UJ" (EJK / gate)
- ⚠️ 2022-2023 2023-05-16: unresolved lecturer "ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2022-2023 2023-06-17: unresolved lecturer "zgłosić się można pisząc do końca października na adres: sekretariat.ikony22@gmail.com" (EJK / gate)
- 2022-2023: 10 lectures from wyklady-2022-2023 → content/lectures/2022-2023.json
- ⚠️ 2023-2024 2023-10-10: unresolved lecturer "s. dr hab. Judyta Pudełko PDDM" (EJK / gate)
- ⚠️ 2023-2024 2023-11-14: unresolved lecturer "ks. protodiakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2023-2024 2023-12-12: unresolved lecturer "ks. dr Marek Wojnarowski" (EJK / gate)
- ⚠️ 2023-2024 2024-01-23: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz" (EJK / gate)
- ⚠️ 2023-2024 2024-02-13: unresolved lecturer "ks. protodiakon dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2023-2024 2024-03-12: unresolved lecturer "ks. dr Marek Wojnarowski" (EJK / gate)
- ⚠️ 2023-2024 2024-04-16: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz" (EJK / gate)
- ⚠️ 2023-2024 2024-05-14: unresolved lecturer "ks. dr Aleksander Jacyniak SJ" (EJK / gate)
- ⚠️ 2023-2024 2024-06-14: unresolved lecturer "ks. prof. dr hab. Dariusz Klejnowski-Różycki;" (EJK / gate)
- ⚠️ 2023-2024 2024-06-15: unresolved lecturer "Elżbieta Jackowska-Kurek; Wernisaż wystawy ikon Spotkania odbywają się w godz. 18.00-" (EJK / gate)
- 2023-2024: 12 lectures from przyjazn-z-bogiem-bojazn-boza-wolnosc-czlowieka-wyklady-2023-2024 → content/lectures/2023-2024.json
- Skip 2024-2025 (already in repo)
- Skip 2025-2026 (already in repo)
- Skip 2026-2027 (already in repo)

## Kawałek 2 v2 — lectures — 2026-09-26

- Fetched 17 WP posts in category wyklady
- 2012-2013: 8 lectures from swiat-ikony-wyklady-rok-20122013 → content/lectures/2012-2013.json
- ⚠️ 2013-2014 2013-10-24: unresolved lecturer "ks. dr Henryk Paprocki - Chrześcijański Wschód i Zachód, próba definicji, ks. dr Aleksander Jacyniak SJ - Rzeczywistość ikony. Ikona a sztuka starożytna, mgr Witali Michalczuk" (EJK / gate)
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "ks. Grzegorz Michalczyk - Rzeczywistość ikony. Sztuka współczesna w świetle ikony, mgr Witali Michalczuk" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "ks. dr Henryk Paprocki - Święta Góra Atos, mgr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2013-2014 2014-01-23: unresolved lecturer "dr Jerzy Kazimierczak - Tradycja hezychastyczna w Bizancjum i jej wspołczesna interpretacja, ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2013-2014 2014-02-27: unresolved lecturer "ks. dr Henryk Paprocki - Teologia Imienia Bożego, ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2013-2014 2014-03-27: unresolved lecturer "ks. dr Artur Aleksiejuk. - Założenia i podstawy prawosławnej tradycji ascetycznej, ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2013-2014 2014-04-24: unresolved lecturer "dr Ewa Kocój - Świadomość ikonograficzna w dziejach Kościoła Wschodniego, ks. dr Piotr Nikolski" (EJK / gate)
- ⚠️ 2013-2014 2014-05-22: unresolved lecturer "dr Aleksandra Sulikowska- Gąska" (EJK / gate)
- ⚠️ 2013-2014 2014-06-12: unresolved lecturer "ks. dr Henryk Paprocki - Teologia Światła, ks. dr Henryk Paprocki - Dogmat i moralność, ks. dr Artur Aleksiejuk" (EJK / gate)
- 2013-2014: 9 lectures from wyklady-20132014 → content/lectures/2013-2014.json
- ⚠️ No season slug for WP post "spotkania-sladami-najpiekniejszych-ikon-swiata" — skipped
- ⚠️ 2014-2015 2014-10-23: unresolved lecturer "ks. dr Henryk Paprocki, Muzyka i hymnografia jako element obrazu liturgicznego, mgr Witali Michalczuk 27. 11.2014. Kult w świetle antropologii chrześcijańskiej, ks. dr Piotr Nikolski Człowiek kultu. Modyfikacje antropologiczne w przestrzeni kultu, mgr Witali Michalczuk" (EJK / gate)
- ⚠️ 2014-2015 2014-12-18: unresolved lecturer "ks. dr Henryk Paprocki Obraz Matki Bożej wyłaniający się z Ewangelii, ks Grzegorz Michalczyk" (EJK / gate)
- ⚠️ 2014-2015 2015-02-19: unresolved lecturer "ks. dr Piotr Nikolski Rola przewodnictwa duchowego dla jednostki i społeczeństwa, dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2014-2015 2015-03-19: unresolved lecturer "dr hab. Ewa Kocój Sacrum i ikona. Ikony cudami słynące w tradycji prawosławia, dr hab. Ewa Kocój" (EJK / gate)
- ⚠️ 2014-2015 2015-04-16: unresolved lecturer "ks. dr Piotr Nikolski Ikona w przestrzeni sakralnej. Ikona i fresk, ks dr Henryk Paprocki 21.05 Liturgia w kontekście Paschalnym, ks Grzegorz Michalczyk Eksperymenty z przestrzenią sakralną w XX w., mgr Witali Michalczuk 11.06 Zakończenie. Ikony objawione, ks dr Henryk Paprocki, “ Ikonowy performance”. Obrazowość liturgii i ikony. mgr Witali Michalczuk WERNISAŻ WYSTAWY IKON. Spotkania moderuje Elżbieta Jackowska-Kurek Na spotkania zapraszamy nie tylko uczestników warsztatów pisania ikon, zapraszamy na nie również osoby, które chcą uczestniczyć wyłącznie w części teoterychnej Akademii Ikony. Zgłoszenia i pytania: sekretariat.ikony22@gmail.com" (EJK / gate)
- 2014-2015: 6 lectures from wyklady-20142015 → content/lectures/2014-2015.json
- ⚠️ 2015-2016 2016-06-14: unresolved lecturer "ks. dr Henryk Paprocki Spotkania seminaryjne odbywają się w Kościele Środowisk Twórczych św. św. Andrzeja Apostoła i Alberta Chmielowskiego na Placu Teatralnym w Warszawie, moderuje Elżbieta Jackowska-Kurek" (EJK / gate)
- 2015-2016: 9 lectures from wyklady-20152016-2 → content/lectures/2015-2016.json
- ⚠️ 2016-2017: no lectures parsed from https://www.akademiaikony.pl/wyklady-20162017/ — EJK
- 2016-2017: 0 lectures from wyklady-20162017 → content/lectures/2016-2017.json
- 2017-2018: 24 lectures from wyklady-20172018 → content/lectures/2017-2018.json
- ⚠️ 2018-2019 2018-11-27: unresolved lecturer "ks. prof Józef Naumowicz" (EJK / gate)
- ⚠️ 2018-2019 2019-03-19: unresolved lecturer "dr Justyna Spruth" (EJK / gate)
- ⚠️ 2018-2019 2019-03-26: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz 09.04 . Nowe oblicza. Ikonografia świętych XX wieku , dr Irina Tatarova" (EJK / gate)
- ⚠️ 2018-2019 2019-06-11: unresolved lecturer "dr hah. Barbara Strzałkowska prof UKSW" (EJK / gate)
- 2018-2019: 25 lectures from wyklady-20182019 → content/lectures/2018-2019.json
- 2019-2020: 10 lectures from wyklady-2019-2020 → content/lectures/2019-2020.json
- ⚠️ No season slug for WP post "podsumowanie-2019" — skipped
- ⚠️ 2020-2021 2020-10-13: unresolved lecturer "…, ks. Grzegorz Michalczyk" (EJK / gate)
- ⚠️ 2020-2021 2020-10-27: unresolved lecturer "ks. prof dr hab. Józef Naumowicz" (EJK / gate)
- 2020-2021: 10 lectures from wyklady-2020-2021 → content/lectures/2020-2021.json
- ⚠️ 2021-2022 2021-12-14: unresolved lecturer "kiermasz świąteczny" (EJK / gate)
- 2021-2022: 10 lectures from wyklady-2021-2022 → content/lectures/2021-2022.json
- ⚠️ 2022-2023 2022-12-13: unresolved lecturer "– oprowadzanie, kiermasz świąteczny" (EJK / gate)
- 2022-2023: 10 lectures from wyklady-2022-2023 → content/lectures/2022-2023.json
- ⚠️ 2023-2024 2024-02-13: unresolved lecturer "ks. dr Aleksander Jacyniak SJ;" (EJK / gate)
- ⚠️ 2023-2024 2024-03-12: unresolved lecturer "s. dr hab. Judyta Pudełko PDDM;" (EJK / gate)
- 2023-2024: 11 lectures from przyjazn-z-bogiem-bojazn-boza-wolnosc-czlowieka-wyklady-2023-2024 → content/lectures/2023-2024.json
- Skip 2024-2025 (already in repo)
- Skip 2025-2026 (already in repo)
- Skip 2026-2027 (already in repo)

## Kawałek 2 v2 — lectures — 2026-09-26

- Fetched 17 WP posts in category wyklady
- 2012-2013: 8 lectures from swiat-ikony-wyklady-rok-20122013 → content/lectures/2012-2013.json
- ⚠️ 2013-2014 2013-11-21: unresolved lecturer "mgr Witali Michalczuk" (EJK / gate)
- ⚠️ 2013-2014 2013-12-19: unresolved lecturer "mgr Łukasz Leonkiewicz" (EJK / gate)
- 2013-2014: 5 lectures from wyklady-20132014 → content/lectures/2013-2014.json
- ⚠️ No season slug for WP post "spotkania-sladami-najpiekniejszych-ikon-swiata" — skipped
- ⚠️ 2014-2015 2014-10-23: unresolved lecturer "ks. dr Henryk Paprocki, Muzyka i hymnografia jako element obrazu liturgicznego, mgr Witali Michalczuk 27. 11.2014. Kult w świetle antropologii chrześcijańskiej, ks. dr Piotr Nikolski Człowiek kultu. Modyfikacje antropologiczne w przestrzeni kultu, mgr Witali Michalczuk" (EJK / gate)
- ⚠️ 2014-2015 2014-12-18: unresolved lecturer "ks. dr Henryk Paprocki Obraz Matki Bożej wyłaniający się z Ewangelii, ks Grzegorz Michalczyk" (EJK / gate)
- ⚠️ 2014-2015 2015-02-19: unresolved lecturer "ks. dr Piotr Nikolski Rola przewodnictwa duchowego dla jednostki i społeczeństwa, dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2014-2015 2015-03-19: unresolved lecturer "dr hab. Ewa Kocój Sacrum i ikona. Ikony cudami słynące w tradycji prawosławia, dr hab. Ewa Kocój" (EJK / gate)
- ⚠️ 2014-2015 2015-04-16: unresolved lecturer "ks. dr Piotr Nikolski Ikona w przestrzeni sakralnej. Ikona i fresk, ks dr Henryk Paprocki 21.05 Liturgia w kontekście Paschalnym, ks Grzegorz Michalczyk Eksperymenty z przestrzenią sakralną w XX w., mgr Witali Michalczuk 11.06 Zakończenie. Ikony objawione, ks dr Henryk Paprocki, “ Ikonowy performance”. Obrazowość liturgii i ikony. mgr Witali Michalczuk WERNISAŻ WYSTAWY IKON. Spotkania moderuje Elżbieta Jackowska-Kurek Na spotkania zapraszamy nie tylko uczestników warsztatów pisania ikon, zapraszamy na nie również osoby, które chcą uczestniczyć wyłącznie w części teoterychnej Akademii Ikony. Zgłoszenia i pytania: sekretariat.ikony22@gmail.com" (EJK / gate)
- 2014-2015: 6 lectures from wyklady-20142015 → content/lectures/2014-2015.json
- ⚠️ 2015-2016 2016-06-14: unresolved lecturer "ks. dr Henryk Paprocki Spotkania seminaryjne odbywają się w Kościele Środowisk Twórczych św. św. Andrzeja Apostoła i Alberta Chmielowskiego na Placu Teatralnym w Warszawie, moderuje Elżbieta Jackowska-Kurek" (EJK / gate)
- 2015-2016: 9 lectures from wyklady-20152016-2 → content/lectures/2015-2016.json
- 2016-2017: 9 lectures from wyklady-20162017 → content/lectures/2016-2017.json
- 2017-2018: 24 lectures from wyklady-20172018 → content/lectures/2017-2018.json
- ⚠️ 2018-2019 2018-11-27: unresolved lecturer "ks. prof Józef Naumowicz" (EJK / gate)
- ⚠️ 2018-2019 2019-03-26: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz 09.04 . Nowe oblicza. Ikonografia świętych XX wieku , dr Irina Tatarova" (EJK / gate)
- ⚠️ 2018-2019 2019-06-11: unresolved lecturer "dr hah. Barbara Strzałkowska prof UKSW" (EJK / gate)
- 2018-2019: 25 lectures from wyklady-20182019 → content/lectures/2018-2019.json
- 2019-2020: 10 lectures from wyklady-2019-2020 → content/lectures/2019-2020.json
- ⚠️ No season slug for WP post "podsumowanie-2019" — skipped
- ⚠️ 2020-2021 2020-10-13: unresolved lecturer "…, ks. Grzegorz Michalczyk" (EJK / gate)
- ⚠️ 2020-2021 2020-10-27: unresolved lecturer "ks. prof dr hab. Józef Naumowicz" (EJK / gate)
- 2020-2021: 10 lectures from wyklady-2020-2021 → content/lectures/2020-2021.json
- ⚠️ 2021-2022 2021-12-14: unresolved lecturer "kiermasz świąteczny" (EJK / gate)
- 2021-2022: 10 lectures from wyklady-2021-2022 → content/lectures/2021-2022.json
- ⚠️ 2022-2023 2022-12-13: unresolved lecturer "– oprowadzanie, kiermasz świąteczny" (EJK / gate)
- 2022-2023: 10 lectures from wyklady-2022-2023 → content/lectures/2022-2023.json
- ⚠️ 2023-2024 2024-02-13: unresolved lecturer "ks. dr Aleksander Jacyniak SJ;" (EJK / gate)
- ⚠️ 2023-2024 2024-03-12: unresolved lecturer "s. dr hab. Judyta Pudełko PDDM;" (EJK / gate)
- 2023-2024: 11 lectures from przyjazn-z-bogiem-bojazn-boza-wolnosc-czlowieka-wyklady-2023-2024 → content/lectures/2023-2024.json
- Skip 2024-2025 (already in repo)
- Skip 2025-2026 (already in repo)
- Skip 2026-2027 (already in repo)

## Kawałek 2 v2 — lectures — 2026-09-26

- Fetched 17 WP posts in category wyklady
- 2012-2013: 8 lectures from swiat-ikony-wyklady-rok-20122013 → content/lectures/2012-2013.json
- 2013-2014: 5 lectures from wyklady-20132014 → content/lectures/2013-2014.json
- ⚠️ No season slug for WP post "spotkania-sladami-najpiekniejszych-ikon-swiata" — skipped
- ⚠️ 2014-2015 2014-10-23: unresolved lecturer "ks. dr Henryk Paprocki, Muzyka i hymnografia jako element obrazu liturgicznego, mgr Witali Michalczuk 27. 11.2014. Kult w świetle antropologii chrześcijańskiej, ks. dr Piotr Nikolski Człowiek kultu. Modyfikacje antropologiczne w przestrzeni kultu, mgr Witali Michalczuk" (EJK / gate)
- ⚠️ 2014-2015 2014-12-18: unresolved lecturer "ks. dr Henryk Paprocki Obraz Matki Bożej wyłaniający się z Ewangelii, ks Grzegorz Michalczyk" (EJK / gate)
- ⚠️ 2014-2015 2015-02-19: unresolved lecturer "ks. dr Piotr Nikolski Rola przewodnictwa duchowego dla jednostki i społeczeństwa, dr Łukasz Leonkiewicz" (EJK / gate)
- ⚠️ 2014-2015 2015-03-19: unresolved lecturer "dr hab. Ewa Kocój Sacrum i ikona. Ikony cudami słynące w tradycji prawosławia, dr hab. Ewa Kocój" (EJK / gate)
- ⚠️ 2014-2015 2015-04-16: unresolved lecturer "ks. dr Piotr Nikolski Ikona w przestrzeni sakralnej. Ikona i fresk, ks dr Henryk Paprocki 21.05 Liturgia w kontekście Paschalnym, ks Grzegorz Michalczyk Eksperymenty z przestrzenią sakralną w XX w., mgr Witali Michalczuk 11.06 Zakończenie. Ikony objawione, ks dr Henryk Paprocki, “ Ikonowy performance”. Obrazowość liturgii i ikony. mgr Witali Michalczuk WERNISAŻ WYSTAWY IKON. Spotkania moderuje Elżbieta Jackowska-Kurek Na spotkania zapraszamy nie tylko uczestników warsztatów pisania ikon, zapraszamy na nie również osoby, które chcą uczestniczyć wyłącznie w części teoterychnej Akademii Ikony. Zgłoszenia i pytania: sekretariat.ikony22@gmail.com" (EJK / gate)
- 2014-2015: 6 lectures from wyklady-20142015 → content/lectures/2014-2015.json
- ⚠️ 2015-2016 2016-06-14: unresolved lecturer "ks. dr Henryk Paprocki Spotkania seminaryjne odbywają się w Kościele Środowisk Twórczych św. św. Andrzeja Apostoła i Alberta Chmielowskiego na Placu Teatralnym w Warszawie, moderuje Elżbieta Jackowska-Kurek" (EJK / gate)
- 2015-2016: 9 lectures from wyklady-20152016-2 → content/lectures/2015-2016.json
- 2016-2017: 9 lectures from wyklady-20162017 → content/lectures/2016-2017.json
- 2017-2018: 24 lectures from wyklady-20172018 → content/lectures/2017-2018.json
- ⚠️ 2018-2019 2019-03-26: unresolved lecturer "ks. prof. dr hab. Józef Naumowicz 09.04 . Nowe oblicza. Ikonografia świętych XX wieku , dr Irina Tatarova" (EJK / gate)
- ⚠️ 2018-2019 2019-06-11: unresolved lecturer "dr hah. Barbara Strzałkowska prof UKSW" (EJK / gate)
- 2018-2019: 25 lectures from wyklady-20182019 → content/lectures/2018-2019.json
- 2019-2020: 10 lectures from wyklady-2019-2020 → content/lectures/2019-2020.json
- ⚠️ No season slug for WP post "podsumowanie-2019" — skipped
- ⚠️ 2020-2021 2020-10-13: unresolved lecturer "…, ks. Grzegorz Michalczyk" (EJK / gate)
- 2020-2021: 10 lectures from wyklady-2020-2021 → content/lectures/2020-2021.json
- ⚠️ 2021-2022 2021-12-14: unresolved lecturer "kiermasz świąteczny" (EJK / gate)
- 2021-2022: 10 lectures from wyklady-2021-2022 → content/lectures/2021-2022.json
- ⚠️ 2022-2023 2022-12-13: unresolved lecturer "– oprowadzanie, kiermasz świąteczny" (EJK / gate)
- 2022-2023: 10 lectures from wyklady-2022-2023 → content/lectures/2022-2023.json
- ⚠️ 2023-2024 2024-02-13: unresolved lecturer "ks. dr Aleksander Jacyniak SJ;" (EJK / gate)
- ⚠️ 2023-2024 2024-03-12: unresolved lecturer "s. dr hab. Judyta Pudełko PDDM;" (EJK / gate)
- 2023-2024: 11 lectures from przyjazn-z-bogiem-bojazn-boza-wolnosc-czlowieka-wyklady-2023-2024 → content/lectures/2023-2024.json
- Skip 2024-2025 (already in repo)
- Skip 2025-2026 (already in repo)
- Skip 2026-2027 (already in repo)
