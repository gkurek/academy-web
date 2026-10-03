# Plan 10 / kawałek 3 — Aktualności (rola, wpisy cykliczne, szablon wpisu)

Status: **k3e ✅ 2026-10-03** — k3a–k3d + k3e (układ K3 v2.1, K-133, lead F11); kawałek 3 zamknięty implementacyjnie  
Etap: `docs/plans/10-finishing.md` (kawałek 3, zadania A1–A6)  
Gałąź: `feat/10-finishing`  
Makiety odniesienia (stan przed redesignem): `design/Akademia Ikony - Wystawa i Aktualności.dc.html` — 7e/7f (lista), 7g (C1 wpis z plakatem i galerią), 7i (C2 krótki wpis). Nowa makieta szablonu wpisu (zastępuje 7g–7j): `design/Akademia Ikony - Wpis Aktualności.dc.html` (płótno, ekrany 1a–8f) + `design/WpisAktualnosci.dc.html` (komponent szkieletu) + `design/README-wpis-aktualnosci.md` (handoff, tabela tokenów `--prose-*`). Odczyt wartości: `docs/design-mockup-guide.md`.

## Cel

1. Zamknąć **K-69** (rola Aktualności vs „Najbliższe” na stronie głównej).
2. Zaproponować EJK **cykliczne wpisy** wynikające z rytmu roku Akademii (podstawa przyszłych formatek CMS).
3. **Redesign szablonu pojedynczego wpisu** `/aktualnosci/[slug]`: jeden szkielet + warianty układu (`layout`).
4. Techniczne A2 (featured bez `featuredUntil`), A3 (animacja scrollu do roku), A6 (regresja helperów wystaw).

**Nie wchodzi:** zmiany listy `/aktualnosci` poza A2/A3; kafle „Najbliższe” (kawałek 4, H2); typografia „prose” poza Aktualnościami; CMS aktualności (osobny projekt); redakcja treści EJK (gate K-122, kawałek 8 tam, gdzie to treść).

## Decyzje sesji discovery (2026-10-03)

| # | Decyzja |
| --- | --- |
| **D1 — K-69** | **Kierunek B.** Aktualności = **jeden strumień** (zapowiedzi + kronika); bez osobnej „Kroniki”. „Co teraz” = sekcja **„Najbliższe”** na `/` (2–3 kafle); kafle prowadzą do **ofert** (wpis-zapowiedź opcjonalnie). Wyróżniony wpis na `/aktualnosci` = bieżąca zapowiedź. |
| **D2 — zapowiedzi po terminie** | **Zostają w kronice** jako ślad; po terminie CTA zastąpione spokojnym linkiem („Powiązane”, D7). |
| **D3 — wpisy cykliczne (4/rok + 1–2 rezerwy)** | **IX** „Nowy rok w Akademii {sezon}” — nabór na kurs + program wykładów **w jednym wpisie** · **III** „Z pracowni + zapisy na Letnią Szkołę Światła” · **VI** „Wystawa doroczna {rok}” (wernisaż) · **VIII/IX** „Letnia Szkoła Światła {rok}” — relacja z pleneru i poświęcenia ikon. Rezerwa: wystawa wyjazdowa/gościnna, spotkanie z gościem, Noc Muzeów / Noc Świątyń, wspomnienie. Każdy cykliczny = przyszła **formatka CMS** (ustawia `layout`, `kind`, pola). |
| **D4 — jeden wpis, dwie fazy** | Wydarzenia cykliczne (wernisaż, Nowy rok, plener) = **jeden wpis**: faza **zapowiedź** (przed datą, bez zdjęć: wiersz faktów + jedno CTA) → faza **relacja** (EJK dokłada zdjęcia + 1–3 zdania; galeria na pierwszy plan, „odbyło się…”, CTA → „Powiązane”). **Minimum = relacja** — zaproszenie na wernisaż i tak pokazują automatycznie kafel „Najbliższe” i hero `/ikony/wystawy` (daty z `annual.json` / wykładów). |
| **D5 — pole `layout` (zmiana modelu, zgoda właściciela)** | Nowe pole w `News` (`src/content/types.ts`, brief §4): `"wydarzenie" \| "galeria" \| "tekst" \| "program"` — wartości po polsku jak inne enumy (K-11). **Wybierane jawnie** (EJK w CMS); jednorazowa klasyfikacja 68 istniejących wpisów (lista do gate'u). Dwie osie rozdzielone: **układ** = pole w danych; **wpis cykliczny** = formatka CMS (nie pole). Walidacja przy buildzie + rozsądny fallback przy niespójności (np. `galeria` bez zdjęć). `kind` zostaje (etykieta typu na liście). |
| **D6 — usunięcie `News.poster`** | Pole **usunięte** z modelu (`types.ts`, brief §4, manifest, `NewsPoster`, prawa kolumna wpisu). W 41/44 wpisów `poster` = zwykłe pierwsze zdjęcie z WP → przenieść jako **pierwszy obraz `images[]`**; prawdziwe plakaty (kilka: `poster.jpg`, plakaty wykładów) → pierwszy obraz galerii z podpisem „Plakat”. Pozycja fali 2 „plakaty → `News.poster`” zmienia się na „plakaty → galeria wpisu docelowego”. Zmiana danych w `content/` → **gate K-122**. |
| **D7 — „Powiązane” zamiast `<NewsCta />`** | Spokojny blok na końcu wpisu (1–2 linki), cel domyślnie z `kind`: warsztaty → kurs, wyklady → `/wyklady`, wystawa → `/ikony/wystawy`, wyjazd → LSŚ; opcjonalne ręczne nadpisanie. Pełne CTA **tylko w fazie zapowiedzi** (`wydarzenie`). `<NewsCta />` znika z 3 archiwalnych wpisów warsztatowych (2012–2016) — gate K-122. |
| **D8 — galeria** | Klasyczna siatka + lupa (zgodnie z **D9** k2) z regułami: 1 zdjęcie = duży kadr; 2–3 = jeden rząd; 4–12 = siatka; > 12 = pierwsze 12 + „Pokaż wszystkie (N)”. Ostateczny wygląd — makieta. |
| **D9 — typografia „prose”** | Pełna swoboda (krój, waga, stopień, interlinia, miara, odstępy) — cel: **czytelnie, przejrzyście, lekko**. Styl jako nazwane tokeny (`--prose-*`), **wdrażany tylko w Aktualnościach**; reszty serwisu nie ruszamy (bez dużych refaktorów). Przeniesienie na inne strony — ewentualnie później, po obejrzeniu efektu, pojedynczo. Hipotezy do porównania w makiecie: (A) EB Garamond jako tekst bieżący ~19–20 px; (B) IBM Plex Sans 300 / jaśniejszy kolor + większa interlinia. |
| **D10 — nagłówek wpisu** | Do wyboru po makiecie: (a) tekst do góry, zdjęcia pod treścią; (b) kadr 3:2 pod leadem w kolumnie treści; (c) szeroki kadr 21:8 nad tytułem (mobile 3:2, margines jak tekst — K4 z k1). Hipoteza: (b) dla relacji, (a) dla zapowiedzi/tekstów. |
| **D11 — featured (A2)** | Bez `featuredUntil` (zmienia K-73) — wyróżnienie trwa do ręcznego zdjęcia flagi. **Potwierdzone 2026-10-03:** (1) `featuredUntil` **usunięte całkowicie** (`types.ts`, brief §4, `news.ts`, `generate-news-sample.ts`, frontmatter naboru) — pole techniczne, **bez gate'u K-122**; (2) wymóg `cover` u wyróżnionego **zostaje** (błąd builda); (3) wyróżniony **nadal wykluczony** z listy lat (K-62 p.4); (4) z naboru 2026/2027 **zdjąć `featured`** (zgłoszenia zamknięte 24.09) — `/aktualnosci` bez wyróżnienia do następnej zapowiedzi (= stan dzisiejszego builda). |

## Diagnoza obecnego szablonu (staging `academy-web-lovat.vercel.app`, 1440 px, 2026-10-03)

- Tekst: IBM Plex Sans 17,5 px / 29,75 px, waga 400, `rgb(236 226 211)` na `rgb(24 19 15)` — ciężki („puchnie” na ciemnym).
- Odstęp akapitów **20 px < interlinia** → akapity się zlewają („ściana tekstu”).
- Listy 16,5 px (mniejsze niż akapity); H2 w MDX 34 px + `mt` 52 px — za ciężkie dla krótkich wpisów.
- Prawa kolumna 240 px (`poster`): np. Wilno — kolumna 354 px przy 933 px tekstu → 579 px pustki; obraz to zwykłe zdjęcie, nie plakat.
- Galeria doklejona po treści; brak leadu i `venue` w nagłówku.
- Na marginesie (→ k10): `mdx-components` używa wartości arbitralnych Tailwind (`[&:has(>em:only-child)]…`) — wbrew konwencji repo.

## Dane — kształt archiwum (68 wpisów)

| Układ (propozycja klasyfikacji) | Przykłady | Kształt |
| --- | --- | --- |
| `wydarzenie` | nabór 2026/2027, 15× „wykłady {sezon}”, „Zapisy” 2017, wystawy doroczne (2018, 2025, 2026) | ogłoszenie 20–120 słów lub relacja z datą wydarzenia |
| `galeria` | wystawy 2013–2019, Lipka, Noc Muzeów, „W pracowni” 2016, wyjazdy, „Plakaty z wydarzeń” | 10–100 słów, 1–46 zdjęć — większość archiwum (~35–40) |
| `tekst` | Wilno 2013, „Ikona dziś” 2015, Mielnik 2017, oprowadzania 2017 (Trójca), poświęcenie 2017, warsztaty 2017 | 180–450 słów, kilka zdjęć |
| `program` | „Śladami…” 2014, „Program Akademii 2015/2016”, spotkania A3 | wstęp + lista dat/tytułów/prowadzących |

Tempo: 2014–2019 gęsto; 2020–2024 po 1 wpisie rocznie (tylko wykłady); 2025: 2; 2026: 4. Pełna klasyfikacja per slug — w k3b (lista do gate'u).

## Podkawałki

| # | Zakres | Zależy od makiety? |
| --- | --- | --- |
| **k3a — technika** | A2 (featured bez `featuredUntil`, D11), A3 (płynny scroll do roku po kliku w pasek lat, `prefers-reduced-motion` — wzorzec `ExhibitionHashScroll`), A6 (regresja `getExhibitionUpcomingHighlight` / `getExhibitionNowNext` na `/` i linków wpisów → `/ikony/wystawy`; uwaga: stan liczony od daty **builda**) | nie |
| **k3b — model i dane** | `layout` w `News` + walidacja + fallback (D5); usunięcie `poster` i migracja obrazów do `images[]` (D6); klasyfikacja 68 wpisów; `<NewsCta />` → „Powiązane” w danych (D7); brief §4, manifest, `generate-news-index.ts` — **gate K-122** na listę zmian w `content/` | częściowo (nazwy wariantów — nie; pola „Powiązane” — po makiecie) |
| **k3c — szablon wpisu** | implementacja makiety: styl „prose” (tokeny `--prose-*` w `globals.css`), nagłówek (D10), warianty `wydarzenie` (2 fazy) / `galeria` / `tekst` / `program`, galeria (D8), „Powiązane”, mobile 390 + desktop 1440 + ≥ 1600 | **tak** |
| **k3d — dokumentacja** | §4 (K-69, K-73, nowe K), brief §4, propozycja wpisów cyklicznych dla EJK (D3 — opis formuły każdego wpisu: pola, co dostarcza EJK, układ) | nie |

Kolejność proponowana: ~~ocena makiety~~ (✅ 2026-10-03) → k3a → k3b → k3c → k3d.

## Plan implementacji (zatwierdzony 2026-10-03)

Implementacja w nowej sesji. Rytm wg `CLAUDE.md`: jeden kawałek → checkpoint → „OK”. Każdy kawałek: `npm run build` + `npm run lint`, obejrzenie 390 / 1440 (k3c także 1600 i 1920), klawiatura tam, gdzie interakcja; bez commitów (sesja lokalna). Na start sesji przeczytać: ten plik, `CLAUDE.md`, przy k3c — `docs/design-mockup-guide.md` i `design/README-wpis-aktualnosci.md`.

### k3a — technika (checkpoint 1/4)

**A2 — featured bez `featuredUntil` (D11)**
1. `src/content/types.ts` — usunąć `featuredUntil` z `News`; `docs/brief-claude-code.md` §4 — usunąć wiersz `featuredUntil` (komentarz przy `featured`: „wyróżnienie do ręcznego zdjęcia flagi; wymaga `cover`; max 1”).
2. `src/content/news.ts` — usunąć `featuredUntil` z `NewsFrontmatter`, `getBuildDateIso()` (jeśli nieużywane gdzie indziej) i warunek daty w `isFeaturedActive` (zostaje `Boolean(entry.featured)` — albo inline); w `validateFeaturedEntries` usunąć sprawdzenie „featuredUntil bez featured”. Max 1 i wymóg `cover` — bez zmian.
3. `scripts/generate-news-sample.ts` — usunąć pole z typu i z wpisu przykładowego (l. ~83, ~423); `scripts/generate-news-index.ts` — sprawdzić, czy nie przenosi pola do manifestu.
4. `content/news/nabor-kursu-2026-2027.mdx` — usunąć `featured` i `featuredUntil` z frontmattera; jeśli manifest (`content/news/manifest.json`) je zawiera — zregenerować skryptem, nie edytować ręcznie.
5. Sprawdzić: `/aktualnosci` renderuje się bez bloku wyróżnienia; nabór widoczny w roku 2026; `grep featuredUntil` w `src/`, `scripts/`, `content/`, briefie = 0 (archiwum pomijamy).

**A3 — płynny scroll do roku**
1. `src/components/news/YearNavClient.tsx` — w `handleYearClick` (gałąź „rok już w DOM”): `preventDefault`, `history.pushState(null, "", "#rok")`, `element.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" })`, potem `focusNewsYearCardTitleAfterLayout(year)` (focus ma już `preventScroll: true`). Wzorzec: `ExhibitionHashScroll`.
2. Gałąź archiwum (zwinięte lata): po zdarzeniu `NEWS_ARCHIVE_EXPAND_EVENT` przewinięcie też płynne — sprawdzić w `NewsArchive*.tsx`, kto dziś przewija, i użyć tego samego helpera; bez podwójnego skoku.
3. Offset: cel ma `scroll-margin-top: calc(var(--year-nav-scroll-offset) + var(--year-nav-scroll-gap))` (`globals.css` ~2154) — `scrollIntoView` go respektuje; nie dodawać ręcznych przesunięć.
4. Nie psuć: `NewsListScrollRestore` / `pinNewsListYear` (powrót z wpisu do roku), `hashchange` → fokus, aktywny rok w pasku (`useYearActiveId`). Reduced motion: `globals.css` ~4046 już wymusza `scroll-behavior: auto` — sprawdzić w DevTools (emulacja) skok natychmiastowy.
5. Opcjonalnie wydzielić `prefersReducedMotion()` do wspólnego helpera — **tylko jeśli** dotyka się i tak obu plików; inaczej zostawić (bez porządków przy okazji).

**A6 — regresja helperów wystaw**
1. Skrypt `scripts/check-exhibition-states.ts` (uruchamiany `npx tsx`, bez nowych zależności): wywołuje `getExhibitionUpcomingHighlight(now)` i `getExhibitionNowNext(now)` dla dat: przed wernisażem, w dniu wernisażu, w trakcie wystawy dorocznej, dzień po końcu, dziś; wypisuje tabelę stanów i rzuca błąd przy niespójności (np. kafel „biezaca”, a hero `now.section !== "doroczna"`).
2. Ten sam skrypt: zbiera linki `/ikony/wystawy#…` z `content/news/*.mdx` i `src/` (dziś: 9× bez kotwicy, `#doroczna` ×1, `#wyjazdowe` ×2) i sprawdza kotwice względem `pl.exhibition.page.toc` (id sekcji).
3. Jeśli `@/` alias nie działa pod `tsx` — importy względne w skrypcie; jeśli helper czyta pliki przez `fs` z cwd — uruchamiać z katalogu repo.
4. Ręcznie: `/` (kafel „Najbliższe” wystawy — dziś zgodnie z datą) i dwa wpisy z linkiem do `/ikony/wystawy` (kotwica trafia w sekcję).
5. Zapisać w meldunku, że stan liczony jest od daty **builda** (rebuild cykliczny → etap 11).

### k3b — model i dane (checkpoint 2/4, **gate K-122** przed zapisem w `content/`)

1. **Najpierw lista do gate'u** (bez zmian w `content/`): tabela 68 slugów → `layout` (wg tabeli „Dane — kształt archiwum”), co dzieje się z `poster` (→ pierwszy obraz `images[]`; prawdziwe plakaty → podpis „Plakat”), które wpisy tracą `<NewsCta />`, które dostają ręczne „Powiązane”. Przekazać właścicielowi; czekać na OK.
2. Model (`types.ts` + brief §4): `layout: "wydarzenie" | "galeria" | "tekst" | "program"` (wymagane); usunąć `poster`; dodać pola z E7 po decyzji: `facts?: { label: string; value: string }[]` (wiersz faktów zapowiedzi), ręczne nadpisanie „Powiązanych” (np. `related?: { label: string; href: string }[]`); mechanizm wyjątku od E5 (lead = `excerpt`) — np. `hideLead?: boolean`. Znaczenie `date` / `dateEnd` dla fazy `wydarzenie` — ustalić z właścicielem przed zapisem (README §7 p. 2). **Nazwy nowych pól — do potwierdzenia na starcie k3b.**
3. Walidacja w `src/content/news.ts` przy buildzie: brak/nieznany `layout` → błąd; `galeria` bez zdjęć → fallback `tekst` + ostrzeżenie w logu builda; `facts` tylko przy `wydarzenie`.
4. Po gate: migracja frontmatterów (skrypt jednorazowy w `scripts/`, nie ręcznie), usunięcie `NewsPoster` i prawej kolumny, regeneracja `manifest.json` przez `generate-news-index.ts`, aktualizacja `scripts/migrate-report.md` (pozycja fali 2 „plakaty → galeria wpisu docelowego”).
5. Program (E7 p. 3): komponent MDX (np. `NewsProgram` z listą pozycji jako props w treści wpisu) — **bez** pola w modelu.

### k3c — szablon wpisu (checkpoint 3/4)

1. Tokeny `--prose-*` w `globals.css` wg README §2 kolumna A (+ wartości szablonu z tabeli „Pozostałe nowe wartości”); nowy kolor `#e6dac7` jako token. Klasy prose tylko w Aktualnościach (D9). Usunąć z `mdx-components` wartości arbitralne Tailwind tam, gdzie zastępuje je prose (diagnoza p. ostatni).
2. Szkielet `NewsArticlePage`: meta (rodzaj · data · miejsce) → H1 → lead (`excerpt`, miara prose — E5, E6) → [fakty] → prose → [program] → [CTA tylko w fazie zapowiedzi] → galeria → „Powiązane” → poprzedni/następny + „Wszystkie aktualności”. **Jedna kolejność dla wszystkich układów (E3)**; nagłówek (a) (E2). Breadcrumb: Aktualności › {rok} (link do kotwicy roku).
3. Faza `wydarzenie`: zapowiedź (CTA) vs relacja (data minęła + zdjęcia; fakty „Odbyło się”, „Powiązane”); data minęła, brak zdjęć → bez CTA, z „Powiązanymi” (README §7 p. 8).
4. `NewsGallery` wg reguł README §4 (0 / 1 / 2–3 / 4–12 / > 12 + „Pokaż wszystkie (N)” z fokusem na 13. miniaturze); kwadraty w siatce, także plakat (E4); `aria-label` „Powiększ zdjęcie {n} z {N}” (E8); istniejący `Lightbox` z podpisem. Kolumny: 4 (`galeria`, `wydarzenie`), 3 (`tekst`, w kolumnie 760 px), 2 mobile.
5. „Powiązane”: cel domyślny z `kind` (README §5), nadpisanie z danych; usunięcie `NewsCta`.
6. **Szerokość ≥ 1600:** zbudować wariant (1) lewa oś i (2) kolumna wyśrodkowana; zrzuty 1440 / 1600 / 1920 dla Wilna i naboru → wybór właściciela; drugi wariant usunąć po wyborze.
7. Stringi UI (etykiety faktów, „Powiązane”, „Pokaż wszystkie (N)”, „Zdjęcia”, aria) → `src/i18n/pl.ts`.

### k3d — dokumentacja (checkpoint 4/4)

`docs/plan-claude-code.md` §4: K-69 (kierunek B), K-73 (zmienione: bez `featuredUntil`), nowe K dla E1–E6 i `layout`; brief §4 zgodny z modelem po k3b; propozycja wpisów cyklicznych dla EJK (D3: formuła, pola, co dostarcza EJK, `layout`) jako osobny dokument do przekazania; tabela postępu w `10-finishing.md`.

## Ocena makiety (2026-10-03)

Oglądane przez lokalny serwer (1a–1d w skali 1:1, 2a, 3a, 3b, 6a); 7a–7l i stany 8a–8f — z kodu komponentu i README. Zgodność z zakazami `CLAUDE.md`: OK (brak 13 px, `#8d7d69`, zaokrągleń/cieni poza lightboxem; Plex Mono tylko w placeholderach; nagłówki 400; fokus 2 px `#e8c765` / offset 2 px). Kolory z istniejących tokenów; jedyny nowy: `--prose-color: #e6dac7`. Copy naboru = `content/news/nabor-kursu-2026-2027.mdx` + brief §8.

| # | Wybór / decyzja |
| --- | --- |
| **E1 — typografia (D9)** | **Hipoteza A**: EB Garamond 400, 20/32 px (mobile 19/30,4), `#e6dac7`, miara 600 px (~63 zn./wiersz; mobile ~39), odstęp bloków 40 px przez `gap`. Tokeny `--prose-*` wg tabeli README §2 kolumna A; kolumna B odrzucona. |
| **E2 — nagłówek (D10)** | **(a) dla wszystkich układów** — tekst do góry, zdjęcia pod treścią; (b) i (c) odrzucone (kadrują plakat w pionie). |
| **E3 — relacja: kolejność** | **Jedna kolejność bloków dla wszystkich układów: tekst → galeria.** Odstępstwo od makiety (3a/3b mają galerię nad tekstem) — 12 kwadratów spychało 1–3 zdania relacji o ~1200 px desktop / ~1600 px mobile. Doprecyzowuje D4: „galeria na pierwszy plan” = galeria jako główna treść relacji, nie nad tekstem. |
| **E4 — plakat w siatce** | W siatce 4–12 plakat kadrowany do kwadratu jak każde zdjęcie; w całości w lightboxie (podpis „Plakat”). 1 i 2–3 zdjęcia — proporcja źródła. |
| **E5 — lead = `excerpt`** | **Z zasady `excerpt` wyświetlany jako lead** na stronie wpisu; powtórzenie pierwszego zdania treści jest zamierzone (lista pokazuje początek wpisu → wpis go kontynuuje). Wyjątki dopuszczalne — mechanizm wyjątku (np. flaga ukrycia leadu) do ustalenia w k3b. Treści nie przycinamy, żeby usunąć powtórzenie (makieta tak zrobiła z Wilnem — nie wdrażamy). |
| **E6 — miara leadu** | Lead w mierze prose (600 px), nie w kolumnie 760 px — jedna prawa krawędź tekstu. Drobna korekta w kodzie, bez poprawki makiety. |
| **E7 — model ponad D5–D7 (do k3b, zgłoszone)** | (1) Wiersz faktów zapowiedzi potrzebuje danych — propozycja README `facts?: {label, value}[]`; (2) znaczenie `date` (data wpisu vs wydarzenia) i `dateEnd` dla fazy; (3) **program bez zmiany modelu** — komponent MDX z listą pozycji w treści wpisu. |
| **E8 — drobne** | `aria-label` miniatury = „Powiększ zdjęcie {n} z {N}” (README), nie alt; etykiety `kind` w `design/README` ≠ brief (wg briefu); placeholdery `[data wpisu]`, `[tytuł poprzedniego wpisu]` to luki danych, nie copy. |

**Otwarte — szerokość ≥ 1600 px** (*zastąpione 2026-10-03 przez § „Runda 2 makiety” — problem dotyczy całego desktopu, nie tylko ≥ 1600*): makieta zakłada kontener 1180 (pole 1068 px). Od 1600 px `--content-max` = 1280 (pole 1168 px), więc pusta przestrzeń na prawo od tekstu rośnie: 1440 → 654 px (45%), 1600 → 784 px (49%), 1920 → 944 px (49%). **Decyzja (2026-10-03):** bez rundy Claude Design; w k3c zbudować (1) kolumnę przy lewej krawędzi (oś logo/breadcrumbu) i (2) całą kolumnę wpisu wyśrodkowaną w kontenerze, porównać na zrzutach 1440 / 1600 / 1920 (Wilno `tekst`, nabór `wydarzenie`) — wybór właściciela na żywym kodzie. Jeśli oba słabe → zamówić (3) prawą kolumnę (fakty + „Powiązane”) od ~1280 px.

### Lista kontrolna oceny (wykonana)

Wejście: ten plik + nowa makieta w `design/` (+ README handoffu). Sprawdzić:

1. Hipotezy typograficzne A/B — czytelność na ciemnym tle (390 i 1440), kontrast WCAG AA, odstęp akapitów > 1 linia, miara ~60–70 znaków; rekomendacja jednej.
2. Czy tokeny `--prose-*` są nazwane i kompletne (bez wartości „z ręki”); zgodność z zakazami `CLAUDE.md` (13 px, `#8d7d69`, zaokrąglenia/cienie, IBM Plex Mono tylko placeholdery, nagłówki 400, fokus `#e8c765`).
3. Nagłówki (a)/(b)/(c) — wybór per wariant.
4. `wydarzenie` — czy obie fazy to **ten sam szkielet** (zmiana stanu, nie osobny szablon); wiersz faktów; jedno CTA.
5. `galeria` — reguły 1 / 2–3 / 4–12 / > 12 + „Pokaż wszystkie (N)”; zgodność z D9 k2 (klasyczny grid + lupa) i istniejącym lightboxem (wariant treści, D3 k2).
6. `program` — lista dat/tytułów/prowadzących; czy da się zbudować z MDX bez nowego modelu (lista w MDX → komponent) czy wymaga danych strukturalnych.
7. „Powiązane” — forma, gdzie stoi, ile linków.
8. Stany: fokus, wpis bez zdjęć, bez leadu, długi tytuł (~110 znaków).
9. Copy z makiety ≠ treść klienta — nowe zdania → `[do uzupełnienia]` / gate EJK.
10. Co z makiety wymaga zmian w modelu ponad D5–D7 (zgłosić, nie wdrażać).

Wynik sesji: lista poprawek do makiety (prompt korekcyjny do Claude Design) **albo** akceptacja + wybory (typografia, nagłówki) zapisane w tym pliku.

## Runda 2 makiety — układ desktop (2026-10-03)

**Diagnoza (ewaluacja po wdrożeniu, staging + lokalnie, 1440 / 1886):** wdrożenie jest wierne makiecie 1a (Wilno porównane 1:1), więc problem leży w makiecie, nie w kodzie.

- **Lewa oś (1a):** kolumna 760 px z tekstem 600 px w polu 1068 / 1168 px → 45–50% pustki po prawej; dwie prawe krawędzie (tekst 600, H1 / linie / nawigacja 760) — linie „urywają się”.
- **Kolumna wyśrodkowana 600 px** (wdrożona próbnie, patrz niżej): spójna oś, ale wąski pasek (~30% ekranu przy ~1900–2100 px), bez związku z osiami nagłówka (logo / menu); krótkie wpisy = prawie pusta strona.
- **Ocena właściciela:** słabo na każdej szerokości desktopowej; „w miarę OK” dopiero przy ~900 px okna → de facto działa tylko mobile.
- Poszerzanie kolumny tekstu odrzucone (miara ~65 znaków ma zostać).
- Dodatkowo: **lead powtarza pierwsze zdanie** w większości archiwalnych wpisów (E5) — czyta się jak zacięcie; przekazane do rundy 2.

**Decyzja (właściciel, 2026-10-03):** od razu runda 2 w Claude Design — układ desktopowy wypełniający kontener (kierunki K1 tekst + prawa kolumna jak oferty / `FactsBox`, K2 lewa kolumna metadanych jak `NewsCard`, opcjonalnie K3); mobile bez zmian; bez tymczasowego skalowania typografii (wariant „A” odrzucony jako praca do wyrzucenia). Prompt: **`docs/plans/10-k3-news-mockup-v2-prompt.md`**.

**Co zostaje z rundy 1 (nie do ponownego projektowania):** E1 typografia prose (ew. skalowanie ≥ 1600 jako opcja makiety), reguły galerii D8, „Powiązane” D7, fazy `wydarzenie` (E7), model D5/D6, aria E8. **Do rewizji przez rundę 2:** E2 (nagłówek), E3 (kolejność bloków — tylko jeśli siatka tego wymaga), E5/E6 (lead).

**Stan kodu na start rundy 2:**
- Zacommitowane (`10/k3: implement news article redesign (k3a-k3d)`): k3a–k3d + poprawki prose (MDX overrides, listy, miara 600 px, ujemne marginesy nagłówków).
- **Niezacommitowane (próba, decyzja właściciela czy commitować):** jedna wyśrodkowana kolumna 600 px (`.news-article-col` z `margin-inline: auto`, breadcrumb w kolumnie, `--news-gallery-narrow: 760px`, `margin-block` w nagłówku i faktach), usunięty `newsArticleWideAlign.ts` i reguły ≥ 1600. Runda 2 i tak zastąpi siatkę wpisu.

### Ocena makiety v2 — lista kontrolna (nowa sesja)

Wejście: ten plik (D1–D11, E1–E8, ta sekcja), prompt v2, `design/Akademia Ikony - Wpis Aktualności v2.dc.html` + `design/README-wpis-aktualnosci-v2.md`, `docs/design-mockup-guide.md` (lokalny serwer, nie `file://`).

1. **Kompozycja na 1280 / 1440 / 1920:** czy treść wypełnia pole kontenera i opiera się o osie nagłówka (lewa = logo/breadcrumb, prawa = koniec menu); procent pustki na najgorszym przypadku (`wyklady-20132014`, 2 zdania, 0 zdjęć).
2. **Miara tekstu** 60–75 znaków; jedna prawa krawędź w obrębie kolumny treści (bez „urwanych” linii).
3. **Jeden szkielet** dla 4 układów; galeria `galeria` / `wydarzenie` / `tekst` — gdzie i jak szeroko; reguły D8 bez zmian.
4. **Kolumna boczna:** zawartość, gdy brak `facts`, zdjęć i „Powiązanych”; czy nie powstaje pusta szyna.
5. **Breakpointy** 768–1023, 1024–1279, 1280–1599, ≥ 1600 — opisane tokenami; mobile 390 = stan obecny.
6. **Zgodność z wzorcami serwisu** (oferty + `FactsBox`, `TocSidebar`, `NewsCard`) i z zakazami `CLAUDE.md` (13 px, `#8d7d69`, zaokrąglenia/cienie, Plex Mono, nagłówki 400, fokus).
7. **Lead (E5):** proponowane traktowanie powtórzenia; czy wymaga zmiany modelu / danych (gate K-122).
8. **Zmiany modelu** ponad D5–D7 — zgłosić, nie wdrażać.
9. **Copy** — nowe zdania → `[do uzupełnienia]`.
10. Wynik: wybór kierunku + lista korekt **albo** prompt korekcyjny; potem plan implementacji „k3e — układ desktop” w tym pliku (bez kodu przed „zapisz plan”).

*Wynik rundy 2: przyjęty kierunek **K3** (tekst 600 px na osi logo + prawa kolumna, kadr wizytówki), K2 odrzucony; dwa problemy (pusta kolumna w najgorszym przypadku, pusta szyna przy długim tekście) + błąd plakatu w naszym prompcie → runda 2.1, prompt `docs/plans/10-k3-news-mockup-v2-1-prompt.md`.*

## Ocena makiety v2.1 (2026-10-03)

Wejście: `design/Akademia Ikony - Wpis Aktualności v2.dc.html` (ekrany 1a–7b, nadpisuje rundę 2), `design/WpisAktualnosci2.dc.html` (szkielet K3), `design/README-wpis-aktualnosci-v2.md` § „Runda 2.1” (+ § „Runda 2” jako archiwum decyzji: tokeny siatki §2). Oglądane przez lokalny serwer: 1a, 2c (3 pozycje sticky), 3c (koniec galerii 46), 3e (Nabór); pozostałe z kodu komponentu i README.

**Werdykt: akceptacja — kierunek K3 z korektami 2.1 jest gotowy do wdrożenia.** Wszystkie punkty K-a–K-f z promptu zrealizowane; najgorszy przypadek (1a) ma po prawej „Powiązane” + nawigację (~330 px) na wysokości tekstu — kolumna nie wygląda na pustą; długi tekst (2c) ma sticky „Powiązane + nawigacja” obok całego tekstu i zatrzymuje się przed galerią / stopką; Nabór (3e) mieści fakty + CTA w pierwszym ekranie. Zakazy `CLAUDE.md`: OK (brak 13 px, `#8d7d69`, `border-radius`, `box-shadow`; wagi 400, 500 tylko w przycisku i `<strong>` jak dziś; kolory z istniejących tokenów; fokus 2 px `#e8c765`). Mobile 390 i tablet 768–1023 bez zmian (5a).

| # | Wybór / decyzja |
| --- | --- |
| **F1 — szkielet desktop (≥ 1024)** | K3 wg README v2 §2 + § Runda 2.1: `grid-template-columns: var(--entry-main) minmax(0,1fr)`; H1 i linia nagłówka przez całe pole; tekst 600 px na osi logo; prawa kolumna do osi menu (400 px przy 1440 = `--offer-sidebar-w`). Zastępuje E2/E6 w części „szerokości” (kolumna 760 px i niezacommitowana próba „wyśrodkowana kolumna 600 px” znikają). |
| **F2 — obszary siatki** | Desktop: `"head head" "main top" "main cta" "main rail" "mgal rail" "gal gal" "gend gend"`. **Odstępstwo od README:** osobny obszar `cta` pod `top` (README ma CTA wewnątrz karty faktów) — dzięki temu CTA to jeden element DOM, który na mobile stoi **pod tekstem** (jak dziś, README v2 §2 „CTA pod tekstem”), a na desktopie wizualnie domyka kartę faktów (to samo tło, bez linii). < 1024: jedna kolumna w kolejności DOM `head → top → main → cta → mgal → gal → rail` (= stan dzisiejszy); `gend` niewidoczny. |
| **F3 — K-a nawigacja w kolumnie** | `rail` = jeden wrapper (`<aside>` „Powiązane” + `<nav>` poprzedni/następny + „Wszystkie aktualności”). Wiersz nawigacji = jeden link: strzałka po lewej (← / →) · etykieta (Plex 14,5 `#a2917c`) nad tytułem sąsiedniego wpisu (Plex 16 `#ece2d3`), `min-height: 48px`; najnowszy wpis bez „Następny”. **Tytuły pełne, bez `line-clamp`** (README §2.1 p. 2 — tytuły ≤ ~110 zn., przy 264 px 4–5 wierszy; akceptowalne). Na mobile ten sam blok (nowy wygląd wierszy także na mobile — jedna implementacja; dziś „‹ Poprzedni wpis” bez tytułu). |
| **F4 — K-b sticky** | `position: sticky; top: var(--entry-sticky-top)` (32 px) na wewnętrznym bloku `rail`, tylko `@media (min-width: 1024px) and (min-height: 720px)`; bez JS. Wyłączenie przy `related.length > 3` — klasa z szablonu. |
| **F5 — K-c koniec galerii** | Pod galerią pełnej szerokości (`gend`): włos + „Wszystkie aktualności” na osi logo; bez dublowania poprzedni/następny. Renderowany tylko ≥ 1024 i **zawsze, gdy obszar `gal` istnieje** (≥ 1 zdjęcie poza kadrem; bez progu „> 4” — F-pytanie 3 ✅). |
| **F6 — K-d nagłówek** | Breadcrumb tylko „Aktualności” (bez roku — powrót do roku zapewnia `pinNewsListYear` + „wstecz”; `getNewsArticleYear` do usunięcia, jeśli nieużywane). Nad H1: rodzaj (Plex 15 `#e8c765`); pod H1: `date[–dateEnd] · venue` (Plex 17 `#c7b8a2`); lead pod nim. **Ten sam nagłówek na wszystkich szerokościach, także mobile (5b)** — F-pytanie 1 ✅. |
| **F7 — K-e linie w kolumnie** | Pierwszy blok prawej kolumny bez linii górnej (CSS `:first-child` w obrębie kolumny, nie warunek w JSX); kolejne: włos `rgba(236,226,211,.14)` + `--entry-rail-pad` / `--entry-rail-gap`; nawigację od „Powiązanych” oddziela włos. Złota linia nad „Powiązane” — tylko mobile. Karta faktów: własna krecha 3 px `#c9a227`, bez dodatkowej linii. |
| **F8 — K-f kadr wizytówki** | Pierwsze zdjęcie w proporcji źródła (`images[0].width/height`), `width: min(100%, var(--entry-card-max-h) × ratio)`, `--entry-card-max-h: 560px`, wyrównany do lewej; poziom = pełna szerokość kolumny, pion = limit wysokości. Klik → lightbox od zdjęcia 1 (lightbox liczy wszystkie). Tylko ≥ 1024; na mobile zdjęcie 1 zostaje w galerii (stan dzisiejszy). Brak plakatów jako przypadku projektowego (zgodnie z D6). |
| **F9 — galeria względem kadru** | ≥ 1024 galeria pokazuje zdjęcia **2…N** (reguły D8 liczone dla N−1), < 1024 — **1…N** (reguły dla N). Implementacja bez JS: jedna lista miniatur, pierwsza ukryta ≥ 1024; wariant siatki (1 / 2–3 / 4–12 / > 12) liczony po stronie serwera dla obu liczb i podany jako dwie klasy-modyfikatory (mobile / `lg`). „Pokaż wszystkie (N)” — N = wszystkie zdjęcia; fokus po rozwinięciu na pierwszej nowo odsłoniętej miniaturze w danym breakpoincie. Wpis z 1 zdjęciem: desktop — tylko kadr, bez `gal` i bez `gend`. |
| **F10 — Powiązane obok CTA (README §2.1 p. 3)** | **Zostaje reguła D7 / stan kodu:** w fazie `zapowiedz` „Powiązane” ukryte (CTA prowadzi w to samo miejsce) — 3e w makiecie pokazuje je z CTA, nie wdrażamy. Kolumna Naboru: fakty + CTA → nawigacja. |
| **F11 — lead (README §4)** | **Potwierdzone (F-pytanie 2 ✅):** automatyczne ukrywanie leadu, gdy `excerpt` jest początkiem treści (porównanie po normalizacji: bez znaczników, białych znaków, cudzysłowów, wielkości liter); `hideLead` zostaje jako ręczne nadpisanie. Zmiana w kodzie, nie w `content/` → bez gate'u K-122. Zastępuje E5 („powtórzenie zamierzone”) — właściciel zgłosił je jako błąd (§ Runda 2). |
| **F12 — poza zakresem k3e** | Domyślne „Powiązane” dla rodzajów bez mapowania (README v2 §5) — osobna decyzja; dziś wpisy bez mapowania mają w kolumnie samą nawigację (bez pustej szyny, F7 działa). Opcja prose 21 px ≥ 1600 — odrzucona (20 px wszędzie). Tablet 768–1023: bez zmian (prose 19/30,4 jak mobile). |

## Zdjęcia — galeria i kolumna (2026-10-03, **K-132**)

| # | Decyzja |
| --- | --- |
| **G1 — domyślnie** | Wszystkie zdjęcia (`images[]`) — plakat, relacja, dowolne — **wyłącznie w galerii pod tekstem** (reguły D8). Prawa kolumna desktop **bez** zdjęcia (tylko fakty + CTA, „Powiązane”, nawigacja). |
| **G2 — wyjątek ręczny** | Pole `columnImageIndex` (liczba, indeks 0…N−1 w `images[]`): wskazane zdjęcie w **prawej kolumnie** nad nawigacją (obszar `top`, komponent `NewsArticleCover`), tylko ≥1024 px; w galerii na desktopie **ukryte** (bez duplikatu); na mobile **w galerii** z resztą. Brak pola = brak zdjęcia w kolumnie. |
| **G3 — archiwum** | Żaden z 68 wpisów nie ma `columnImageIndex` do czasu decyzji EJK; ustawienia per slug → gate K-122 przy zapisie w `content/`. |

*Uwaga:* F8/F9 w § „Ocena makiety v2.1” opisywały automatyczny kadr z `images[0]` — **wycofane** na rzecz G1–G2.

**Do zgłoszenia, nie blokuje:** `--entry-sticky-top` 32 px ≠ istniejące `--text-page-toc-sticky-top` 20 px (`TocSidebar`) — przyjmujemy wartość makiety jako osobny token (inna kompozycja: kolumna przy tekście, nie spis treści). Header serwisu nie jest sticky (sprawdzone) → offset bez wysokości headera.

### F-pytania — ✅ wszystkie potwierdzone przez właściciela 2026-10-03 („wszystkie na tak”)

1. **Nagłówek na mobile:** ✅ 5b — nowy (rodzaj → H1 → data · miejsce, breadcrumb bez roku) na wszystkich szerokościach; jeden DOM nagłówka.
2. **Lead:** ✅ automatyczne ukrywanie przy powtórzeniu (F11).
3. **`gend` pod galerią:** ✅ zawsze, gdy obszar `gal` istnieje (bez progu „> 4 zdjęć”).

## Plan k3e — układ desktop wpisu (do implementacji)

Rytm wg `CLAUDE.md`: jeden kawałek → checkpoint → „OK”. Na start sesji przeczytać: ten plik (D1–D11, E1–E8, F1–F12), `CLAUDE.md`, `docs/design-mockup-guide.md`, `design/README-wpis-aktualnosci-v2.md` (§ Runda 2.1 + §2 tokeny). Wartości stylu odczytywać z `design/WpisAktualnosci2.dc.html` przez lokalny serwer, nie zgadywać. Bez commitów (sesja lokalna). Każdy kawałek: `npm run build` + `npm run lint`, obejrzenie **390 / 1024 / 1280 / 1440 / 1920** na wpisach testowych, klawiatura (Tab przez nagłówek → tekst → kolumna → galeria → `gend`).

**Wpisy testowe:** `wyklady-20132014` (najgorszy przypadek), `wystawa-ikon-w-wilnie` (`tekst`, pion, długi tekst), `noc-swiatyn-2019` (16:9, 2 zdjęcia), `ikona-piekno-zanurzone-w-tajemnicy` (`galeria`, 46 zdjęć — koniec galerii, „Pokaż wszystkie”), `wystawa-ikona-korzenie-i-owoce-wiary-2018` (`wydarzenie` w fazie relacji, 25 zdjęć), `nabor-kursu-2026-2027` (`wydarzenie`, fakty + CTA), `program-na-rok-20152016-zapraszamy-serdecznie` (`program`).

**Punkt wyjścia:** working tree z niezacommitowaną próbą „wyśrodkowana kolumna 600 px” — k3e ją zastępuje (nie przywracać `newsArticleWideAlign.ts`); `--news-article-col`, `--news-gallery-narrow` i reguły `.news-article-col` usunąć tam, gdzie siatka K3 je zastępuje.

### k3e-1 — siatka, nagłówek, kolumna z nawigacją (checkpoint 1/3) — F1, F2, F3, F6, F7, F5

1. `globals.css`: tokeny siatki `--entry-*` z README v2 §2 (`--entry-main` = `var(--prose-measure)`, `--entry-gap` 48 / 68 / 88, `--entry-head-pad` 34, `--entry-head-rule-gap` 40) i z § Runda 2.1 (`--entry-crumb-gap`, `--entry-kind-gap`, `--entry-byline-gap`, `--entry-byline-size`, `--entry-lead-gap`, `--entry-rail-gap`, `--entry-rail-pad`, `--entry-top-rail-gap`, `--entry-nav-row-gap`, `--entry-gend-gap`); prawa kolumna = `minmax(0,1fr)` (wychodzi 264 / 400 / 480). Breakpointy: 1024 (siatka), 1600 (`--content-max` 1280 i `--entry-gap` 88). Bez wartości arbitralnych Tailwind.
2. `NewsArticlePage.tsx`: `<article>` jako siatka z obszarami F2; kolejność DOM: breadcrumb + nagłówek (`head`) → `top` (na razie tylko fakty) → prose (`main`) → CTA (`cta`) → galeria `tekst` (`mgal`) → galeria `galeria`/`wydarzenie` (`gal`) → `rail` → `gend`. Puste obszary nie renderują się wcale (warunek w JSX), a odstępy między obszarami robić **marginesami / paddingiem bloków, nie `row-gap`** — inaczej puste wiersze siatki (`top`, `cta`, `mgal`, `gal`) dodają podwójne odstępy. Nagłówek F6 (5b, wszystkie szerokości): breadcrumb bez roku, rodzaj nad H1, `NewsDateMeta` + `venue` pod H1, lead.
3. Wydzielić nawigację do `src/components/news/NewsArticleNav.tsx` (jeden plik = jeden komponent): wiersze F3 z tytułami sąsiadów, `aria-label` jak dziś (`pl.news.previousEntryAria` / `nextEntryAria`), „Wszystkie aktualności”. `NewsRelated` + `NewsArticleNav` w jednym wrapperze `rail`.
4. Linie F7 (`:first-child`), złota linia „Powiązane” tylko < 1024; `gend` (F5) — `TextLink` „Wszystkie aktualności”, ukryty < 1024.
5. Galeria `galeria`/`wydarzenie` w `gal` przez całe pole (4 kolumny), `tekst` w `mgal` (3 kolumny, nagłówek „Zdjęcia”) — reguły D8 bez zmian; kadr wizytówki jeszcze nie (k3e-2), więc galeria liczy N.
6. Sprawdzić: 1a (Wykłady 2013/2014 — „Powiązane” na wysokości pierwszego wiersza tekstu, bez podwójnej linii), 1e 1280, 4a 1024 (tytuły nawigacji 3–4 wiersze), mobile 390 = stan dzisiejszy poza F3 (wiersze z tytułami) i F6 (nowy nagłówek 5b).

### k3e-2 — kadr wizytówki, karta faktów, sticky (checkpoint 2/3) — F4, F8, F9, F10

1. `src/components/news/NewsArticleCover.tsx`: `next/image` z `images[0]` (wymiary z danych), `width: min(100%, calc(var(--entry-card-max-h) * var(--ratio)))`, `aspect-ratio` — `--ratio` przez `style` (zmienna CSS z danych, nie klasa arbitralna); przycisk lupy → istniejący `Lightbox` od indeksu 0; `aria-label` wg E8; ukryty < 1024.
2. `NewsGallery`: F9 — dwa warianty siatki (N / N−1) jako klasy, pierwsza miniatura ukryta ≥ 1024, limit 12 + „Pokaż wszystkie (N)” i fokus po rozwinięciu w obu breakpointach; lightbox nadal ze wszystkimi zdjęciami.
3. Karta faktów ≥ 1024 w `top` (wygląd `FactsBox`: tło `#231b14`, krecha 3 px `#c9a227`, padding 26/28, etykieta Plex 14,5, wartość Garamond 21) + `NewsEventCta` w `cta` jako przycisk na pełną szerokość karty (to samo tło); < 1024 — wiersz faktów i CTA pod tekstem jak dziś. Tokeny karty — sprawdzić, czy istniejące tokeny `FactsBox` pokrywają wartości; brakujące dopisać jako `--entry-*`.
4. F10: bez zmian w logice `showRelated` (zapowiedź → bez „Powiązanych”).
5. Sticky F4: wrapper `rail` `align-self: stretch` przez wiersze `main` + `mgal`; blok wewnętrzny sticky tylko `(min-width: 1024px) and (min-height: 720px)`; klasa wyłączająca przy `related.length > 3`.
6. Sprawdzić: Wilno 1440 × 900 w 3 pozycjach (góra / środek / koniec — blok nie wchodzi na galerię ani stopkę), 1024 × 700 (statycznie), Noc Świątyń (kadr 16:9 + galeria 1 zdjęcie desktop / 2 mobile), 46 zdjęć (koniec galerii + `gend`), Nabór (kolumna dłuższa niż tekst, bez sticky-efektu).

### k3e-3 — lead, porządki, dokumentacja (checkpoint 3/3) — F11

1. F11: w `src/content/news.ts` helper `shouldShowLead(entry)` (normalizacja: bez znaczników MDX/HTML, białych znaków, cudzysłowów typograficznych, wielkości liter; lead ukryty, gdy znormalizowany `excerpt` jest prefiksem znormalizowanej treści) — źródło treści: istniejące pole `bodyText` z manifestu (oczyszczony MDX, K-63), bez renderowania i bez nowego pola; uwaga: gdy `excerpt` nie jest ustawiony, `getExcerpt` sam bierze go z `bodyText` → taki lead zawsze się powtarza i ma być ukryty. `hideLead` wygrywa. Lista wpisów, w których lead znika / zostaje — w meldunku.
2. Usunąć martwy CSS i tokeny po rundzie 1/próbie (`--news-article-col`, `--news-gallery-narrow`, `.news-article-col`, stary `.news-article-nav-*`, `--news-article-nav-pt*`, jeśli nieużywane) — tylko to, co k3e zastąpiło.
3. Dokumentacja: `docs/plan-claude-code.md` §4 — nowe K dla F1–F11 (układ desktop K3, nawigacja w kolumnie, sticky, kadr wizytówki, lead) z odwołaniem, że zastępują część K-131 (E2/E5/E6); dziennik; tabela postępu w `10-finishing.md`; ten plik — postęp. Brief §4 — bez zmian modelu (F-decyzje nie dodają pól).

**Ryzyka k3e:** (1) `next/image` kadru i pierwszej miniatury to dwa obrazy tego samego pliku — sprawdzić `sizes` i brak podwójnego pobrania pełnej rozdzielczości na mobile (kadr ukryty `display:none` nadal może się pobrać → `loading="lazy"` albo `sizes` z `0px` poniżej 1024); (2) sticky w siatce wymaga, by żaden przodek nie miał `overflow` ≠ `visible` — sprawdzone 2026-10-03: layout i `SectionPageShell` bez `overflow` (`overflow-x: hidden` w `globals.css` dotyczy tylko lightboxa), sticky `TocSidebar` już działa w tym samym szkielecie; (3) zmiana liczby widocznych zdjęć między breakpointami (F9) może zmylić „Pokaż wszystkie” przy zmianie szerokości okna — akceptowalne, stan rozwinięcia wspólny.

## Ryzyka i pytania otwarte

- **Faza zapowiedź → relacja** zależy od daty builda (strona statyczna); przy dodaniu zdjęć rebuild i tak następuje — cykliczny rebuild → etap 11.
- **Łączenie naboru i wykładów (D3, IX)** zmienia formułę przyszłych wpisów wykładowych; 15 archiwalnych „wykłady {sezon}” zostaje jako kronika. Dotyka otwartych pytań 1–3 w `scripts/migrate-report.md` (§ wykłady) i przyszłego CMS wykładów → potwierdzić w k6.
- **Blok wyróżnionej zapowiedzi** na `/aktualnosci` nie był w zamówieniu makiety — ewentualnie druga runda Claude Design.
- **Filtr fotorelacji** (`/aktualnosci?…` z `/ikony/wystawy`) — nierozstrzygnięty; propozycja: odłożyć (fala 2) albo wykorzystać `layout`/`kind` po k3b.
- **Propozycja wpisów cyklicznych dla EJK** — do przekazania EJK (forma: dokument / mail) — k3d / k8.

## Postęp

| Krok | Status | Uwagi |
| --- | --- | --- |
| Discovery (K-69, wpisy cykliczne, model, kierunek szablonu) | ✅ 2026-10-03 | D1–D11 |
| Prompt do Claude Design | ✅ 2026-10-03 | przekazany przez właściciela, nie w repo |
| Ocena makiety | ✅ 2026-10-03 | E1–E8; kierunek przyjęty bez rundy korekcyjnej; otwarte: szerokość ≥ 1600 |
| Plan implementacji k3a–k3d + D11 potwierdzone | ✅ 2026-10-03 | sekcja „Plan implementacji” |
| k3a — technika | ✅ 2026-10-03 | A2, A3, A6; skrypt `scripts/check-exhibition-states.ts` |
| k3b — model i dane | ✅ 2026-10-03 | gate K-122 OK; `migrate-news-k122.ts` |
| k3c — szablon wpisu | ✅ 2026-10-03 | prose, galeria D8, Powiązane, fazy `wydarzenie`, wariant ≥1600 |
| k3d — dokumentacja | ✅ 2026-10-03 | §4 (K-73, K-129–K-131), brief §4, `docs/wpisy-cykliczne-aktualnosci-ejk.md`, postęp w `10-finishing.md` |
| k3c — poprawki po ewaluacji | ✅ 2026-10-03 | prose nie działało (klasy Tailwind z `mdx-components` wygrywały z `@layer components`) → `newsMdxComponents`; listy z `<strong>`/`<a>` (grid → `::before` absolutny); `--prose-measure` 600px (było 30em = 3 różne krawędzie); `--prose-h2/h3-after` ujemne wg README §2; tokeny `--prose-fact-size`, `--prose-related-link-size`; usunięty martwy CSS plakatu/`news-cta` i `NewsCta.tsx` |
| Runda 2 makiety — układ desktop | ✅ 2026-10-03 | K3 przyjęty, K2 odrzucony → runda 2.1 (prompt `10-k3-news-mockup-v2-1-prompt.md`) |
| Runda 2.1 makiety — korekta K3 | ✅ 2026-10-03 | akceptacja; F1–F12 (§ „Ocena makiety v2.1”); F-pytania 1–3 ✅ (wszystkie „tak”); plan k3e gotowy |
| k3e-1 — siatka, nagłówek, kolumna z nawigacją | ✅ 2026-10-03 | siatka K3, nagłówek 5b, `NewsArticleNav`, `gend`, galeria `mgal`/`gal` |
| k3e-2 — kadr wizytówki, karta faktów, sticky | ✅ 2026-10-03 | `NewsArticleCover`, F9 galeria, karta faktów + CTA ≥1024, sticky rail |
| k3e-3 — lead, porządki, dokumentacja | ✅ 2026-10-03 | F11 `shouldShowLead`, martwe tokeny nav-pt, K-133, `getNewsArticleYear` usunięte |
| k3c — kolumna wpisu (próba, niezacommitowana) | ⚠️ odrzucone jako docelowe 2026-10-03 | decyzja właściciela (próba): **jedna wyśrodkowana kolumna** = `--prose-measure` (600 px) dla breadcrumbu, nagłówka, leadu, prose, faktów, CTA, „Powiązanych” i nawigacji, na wszystkich szerokościach; galeria `galeria`/`wydarzenie` pełna szerokość kontenera, `tekst` 760 px (`--news-gallery-narrow`), obie wyśrodkowane. Odrzucone: warianty `start`/`center` (`newsArticleWideAlign.ts` usunięty) i kolumna 760 px z tekstem 600 px (dwie prawe krawędzie). Odstępstwo od makiety 1a (lewa oś). |

## Checkpoint 3/4 — k3c (2026-10-03)

**Zrobione:** tokeny `--prose-*` i styl wpisu w `globals.css`; `NewsArticlePage` (meta · data · miejsce, lead, fakty, kolejność E3: tekst → galeria, breadcrumb › rok); `NewsGallery` (1 / 2–3 / 4–12 / >12, lupa, lightbox); `NewsFacts`, `NewsRelated`, `NewsEventCta`; fazy `wydarzenie` (`getNewsEventPhase` — koniec: `dateEnd ?? date`); wyrównanie ≥1600: `newsArticleWideAlign.ts` (`start` \| `center`); stringi w `pl.ts`; `NewsCta` usunięty z `mdx-components`.

**Odstępstwa od planu / makiety:** brak — E3 (galeria pod tekstem) i E2 (nagłówek a) jak w ocenie makiety.

**Do decyzji:** E7 — przyjęta robocza reguła fazy: `dateEnd ?? date` = koniec wydarzenia (dzień po = po terminie); `date` w meta bez zmiany semantyki w danych. Wybór wariantu szerokości ≥1600 px na żywym kodzie (`NEWS_ARTICLE_WIDE_ALIGN`). Brak `facts` w frontmatter — wiersz faktów się nie renderuje (EJK / CMS).

**Następny krok:** k3d — dokumentacja (§4, brief §4, propozycja wpisów cyklicznych).

**Build/lint:** OK.

**Czekam na OK.**

## Checkpoint 4/4 — k3d (2026-10-03)

**Zrobione:** `docs/plan-claude-code.md` §4 — doprecyzowanie K-73, K-78, K-129, K-130, nowe **K-131** (E1–E8); §2/§3/§5 i dziennik; `docs/brief-claude-code.md` §4 — komentarz fazy wydarzenia (K-131); **`docs/wpisy-cykliczne-aktualnosci-ejk.md`** (formuły wpisów IX / III / VI / VIII–IX + rezerwy, pola CMS); `docs/plans/10-finishing.md` — A4 ✅, postęp kawałka 3 ✅, fala 2 plakaty.

**Odstępstwa od planu / makiety:** brak.

**Do decyzji:** wybór `NEWS_ARTICLE_WIDE_ALIGN` (`start` \| `center`) na stagingu (otwarte od k3c); ewentualna finalna akceptacja dokumentu cyklicznych przez EJK (treść redakcyjna, nie kod).

**Następny krok:** etap 10 **kawałek 4** — strona główna (`10-finishing.md`, H2 „Najbliższe” po K-69).

**Build/lint:** bez zmian w kodzie aplikacji (tylko docs).

**Czekam na OK.**

## Checkpoint 2/4 — k3b (2026-10-03)

**Zrobione:** model `layout`, `facts`, `related`, `hideLead`; usunięcie `poster` (`types.ts`, brief §4, `news.ts` walidacja + `getEffectiveNewsLayout`); migracja 68 MDX (`scripts/migrate-news-k122.ts`), regeneracja `manifest.json` + registry; usunięcie `NewsPoster` i kolumny plakatu w `NewsArticlePage`; `generate-news-index.ts` / `generate-news-sample.ts`; `migrate-report.md` (plakaty → galeria).

**Build/lint:** OK. `npx tsx scripts/check-exhibition-states.ts`.

**Zamknięte:** OK właściciela 2026-10-03 (bez commitu — sesja lokalna).

**Następny krok:** k3c — szablon wpisu (prose, galeria, Powiązane, fazy `wydarzenie`).

## Checkpoint 1/4 — k3a (2026-10-03)

**Zrobione:** A2 (`featuredUntil` usunięte; nabór bez `featured`; manifest zregenerowany) · A3 (płynny scroll do roku + archiwum; `scrollNewsYearIntoView` w `focusNewsYearCardTitle.ts`) · A6 (`scripts/check-exhibition-states.ts`). Pliki: `types.ts`, `news.ts`, `brief` §4, `nabor-kursu-2026-2027.mdx`, `generate-news-sample.ts`, `YearNavClient.tsx`, `NewsArchiveShell.tsx`.

**Build/lint:** OK. Regresja wystaw: `npx tsx scripts/check-exhibition-states.ts`.

**Następny krok:** k3b — **najpierw** tabela 68 slugów (`layout`, migracja `poster`, `<NewsCta />` → „Powiązane”) do gate'u K-122; **bez** zapisu w `content/` do OK właściciela. Na starcie k3b potwierdzić nazwy pól z E7 (`facts`, `related`, `hideLead`).

## Wznowienie — prompt startowy (nowa konwersacja, implementacja k3e)

```
Kontynuuję etap 10, kawałek 3 (Aktualności) na gałęzi feat/10-finishing — implementacja k3e (układ desktop wpisu, makieta v2.1).

Przeczytaj: CLAUDE.md, docs/plans/10-k3-news.md (D1–D11, E1–E8, § „Ocena makiety v2.1” F1–F12 — F-pytania potwierdzone, § „Plan k3e”), docs/design-mockup-guide.md, design/README-wpis-aktualnosci-v2.md (§ Runda 2.1 + §2 tokeny).
Wartości stylu: design/WpisAktualnosci2.dc.html przez lokalny serwer (nie file://).

Stan: k3a–k3d ✅; working tree ma niezacommitowaną próbę „wyśrodkowana kolumna 600 px” — k3e ją zastępuje.

Zacznij od k3e-1. Jeden kawałek → checkpoint → czekasz na OK. Bez commitów (sesja lokalna).
```
