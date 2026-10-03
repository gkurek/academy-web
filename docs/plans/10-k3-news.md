# Plan 10 / kawałek 3 — Aktualności (rola, wpisy cykliczne, szablon wpisu)

Status: **discovery zamknięte** 2026-10-03 · makieta szablonu wpisu **dostarczona i oceniona** 2026-10-03 (kierunek przyjęty, bez rundy korekcyjnej — sekcja „Ocena makiety”) · implementacja **nie rozpoczęta**  
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

**Otwarte — szerokość ≥ 1600 px:** makieta zakłada kontener 1180 (pole 1068 px). Od 1600 px `--content-max` = 1280 (pole 1168 px), więc pusta przestrzeń na prawo od tekstu rośnie: 1440 → 654 px (45%), 1600 → 784 px (49%), 1920 → 944 px (49%). **Decyzja (2026-10-03):** bez rundy Claude Design; w k3c zbudować (1) kolumnę przy lewej krawędzi (oś logo/breadcrumbu) i (2) całą kolumnę wpisu wyśrodkowaną w kontenerze, porównać na zrzutach 1440 / 1600 / 1920 (Wilno `tekst`, nabór `wydarzenie`) — wybór właściciela na żywym kodzie. Jeśli oba słabe → zamówić (3) prawą kolumnę (fakty + „Powiązane”) od ~1280 px.

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
| k3a — technika | ⬜ | następna sesja — start od A2 |
| k3b — model i dane | ⬜ | gate K-122 |
| k3c — szablon wpisu | ⬜ | po akceptacji makiety |
| k3d — dokumentacja | ⬜ | |
