# Review 10/R — V1: pomiar wzorców

Data: 2026-10-05 · gałąź `feat/10-review`, HEAD `1428105` (RF-5; blok RF-0…RF-12 zamknięty) · model: Opus 5.5 · świeża sesja (RV-6)  
Staging (pomiar): https://academy-68rb8ldp7-greg-d8fb.vercel.app/ — zawiera RF-12 i RF-5; stary staging `academy-web-lovat` (`bb7b0cb`) tylko jako źródło starego baseline'u.  
Wejście: `docs/review/04-cross-cutting.md` (R4-04…R4-08, R4-10, tabele 1–3 jako hipotezy), `design/README` §1–§3, `design/README-wpis-aktualnosci*.md`, `docs/archive/plans/10-review-fixes.md` (RF-13, RF-14).  
Review **niczego nie poprawia**. Wartości docelowe w §6 to **propozycja do decyzji właściciela** — nie są wpisane do `10-review-fixes.md`.

Wagi: `bug` · `ryzyko` · `niespójność` · `upraszczanie` · `drobiazg`. Koszt: S / M / L.

---

## 1. Metoda

- **Narzędzie:** `scripts/visual-measure.ts` (nowy; Playwright i `axe-core` już w `node_modules`, bez nowych zależności). Uruchomienie: `npx tsx scripts/visual-measure.ts --base <url>` (`--only measure|axe|cls`). Dane surowe: `.visual/measure/pages/<trasa>-<szerokość>.json`, `summary.json`, `axe.json`, `cls.json` (poza repo).
- **Zakres:** 21 tras z `scripts/visual-check.routes.json` × 390 / 1440 / 1600 = 63 pomiary; okno 900 px wysokości, `reducedMotion`, DPR 1; strona przewinięta do końca przed pomiarem (lazy loading, fonty).
- **Co liczy skrypt** (wyliczone style i prostokąty, nie odczyt z kodu):
  - kolumna treści (`main` minus padding), góra treści (od `main` do pierwszej widocznej treści), dół (od ostatniej treści do stopki serwisu);
  - **odstęp nad sekcją** = od dołu najniższej widocznej treści powyżej (dowolna kolumna; bez kolumn `sticky`) do górnej krawędzi pierwszej widocznej treści sekcji (tekst, obraz, panel z tłem, złota linia z pseudoelementu). Dwie miary: nad każdą `section` najwyższego poziomu (rytm sekcji — tabela §3) i nad każdym `h2` (łapie też podsekcje bez `section`);
  - typografia `h1–h3`, `p`, `li`, `blockquote`, `figcaption` w `main`: krój, rozmiar, interlinia, kolor, marginesy, szerokość i miara w em;
  - odstęp akapitów `p + p`; złote belki ≥ 2 px (`border-*`, pseudoelement, element z tłem);
  - kolory (`color` z tekstem, `background-color`, `border-color`) i rozmiary pisma na całym `body` porównane ze zbiorem rozwiązanych tokenów `globals.css` i z paletą `design/README` §1.
- **Uwaga do liczb:** odstęp mierzony między **pudełkami linii**, więc zawiera pół-interlinię sąsiednich wierszy (zwykle +2…6 px względem wartości CSS). Kolumna „przyczyna w kodzie” podaje wartość CSS.
- **Nie mierzone:** 768–1023 px (próg pośredni `--section-gap` 60 px — z kodu, nie z pomiaru); stany interaktywne (menu, lightbox, rozwinięte akordeony i archiwum Aktualności); `dt` / `span` (typografia tylko dla elementów z listy wyżej).

## 2. Baseline i kryteria techniczne (pomiar na nowym stagingu)

| Pozycja | Wynik |
| --- | --- |
| Stary baseline | `.visual/baseline` → `.visual/baseline-bb7b0cb` (zachowany) |
| Nowy baseline | `check:visual --save-baseline` z nowego stagingu: 63 przechwycenia, smoke 11/11 |
| Staging vs nowy baseline | **PASS 147 · EXPECTED 0 · FAIL 0 · smoke FAIL 0** |
| axe-core 4.13.0 (z `node_modules`), tagi jak R0, 21 tras × 390 / 1440 | **0 naruszeń** (42 przebiegi). R0 miało 4 (LSŚ `link-in-text-block`, `/ikony/wystawy` i `/publikacje/ikona-dzis` landmarki) — usunięte w RF-1. *Incomplete:* `color-contrast` 31–41 węzłów na trasę (pseudoelementy, jak w R0), `link-in-text-block` LSŚ 3 / `/ikony/wystawy` 4 / `/ikony/na-zamowienie` 1, `frame-tested` `/kontakt` (iframe mapy) |
| CLS (największe okno sesji; po załadowaniu i po przewinięciu) | `/`, `/ikony`, `/ikony/na-zamowienie` × 390 / 1440: **0,0000** (0 przesunięć) |
| `/ikony` statyczna | odpowiedź `x-nextjs-prerender: 1`, `x-vercel-cache: HIT` — prerenderowana (pośrednio; build nie był oglądany) |

## 3. Wzorce dominujące

1440 i 1600 dają **identyczne** odstępy i typografię na wszystkich trasach; różni się tylko szerokość kolumny (1068 → 1168) i miara bloków bez `max-width` (V1-20).

| Miara | 390 | 1440 / 1600 | Udział | `design/README` |
| --- | --- | --- | --- | --- |
| Kolumna treści | 335 | 1068 / 1168 | 20/21 tras (`/`: 375 / 1180 / 1280 — sekcje bez powłoki) | margines 56 / 20, kolumna do 1180 |
| Odstęp sekcji | **30–34** (28 z 52 przejść, 9 tras) | **brak jednego wzorca** — trzy skupiska: 94–98 (14 przejść, 5 tras), 48–56 (11, 5 tras), 28–38 (19, 8 tras) | — | 56–64 desktop, 30–34 mobile |
| Dół strony (do stopki) | 26 | 26 | 11/21 | — |
| H1 | 38 / 1,12 | 48 / 1,12 | 18/21 (wpis 32/44 i `/` 56 — z makiet) | 48 / 38, interlinia 1,1–1,2 |
| H2 sekcji | 26 / 1,2 | 34 / 1,2 | 14 tras | 34 / 26–28 |
| Tekst ciągły (proza) | 16,5 / 1,6 | 17,5 / 1,7, miara 640 px = 36,6 em | strony tekstowe, oferty, artykuł, 404 | 16,5–17,5; 1,55–1,75; 34–36 em |
| Odstęp akapitów prozy (Plex) | 20 | 20 | 5 tras (14 px na 3 ofertach) | — |
| Złota belka panelu | 2 px | 2 px | 7 komponentów / 6 tras (3 px: 4 komponenty / 2 trasy) | **3 px** („Karty i kafle”) |
| Kolory spoza tokenów | 0 | 0 | 63/63 | — |
| Kolory spoza palety §1 | `#e6dac7` (proza wpisu) | j.w. | tylko wpisy | z `README-wpis-aktualnosci.md` (`--prose-color`) |
| Rozmiary pisma spoza tokenów | 0 | 0 | 63/63 | (poza skalą §2 — V1-14…V1-16) |

## 4. Odstępstwa od wzorca

Wartości: zmierzone 390 · 1440 = 1600 (px). „Wzorzec” = dominanta z §3, a gdzie jej brak (odstęp sekcji desktop) — zakres `design/README` §3.

### 4.1 Odstępy sekcji (wejście RF-13)

| ID | Waga | Trasa | Zmierzone 390 · 1440 | Wzorzec | Przyczyna w kodzie | Koszt |
| --- | --- | --- | --- | --- | --- | --- |
| **V1-01** | niespójność | `/o-akademii` (7 sekcji), `/pracownia` (4) | 29–37 · **93–98** | 56–64 | `--section-gap: 96px` od 1024 px (`globals.css:1138`; bazowo 60 — `:111`); `TextPageSection.tsx:14`, `AboutPage.tsx:97, 135`, `.workshop-section` (`globals.css:1685–1690`) | S |
| **V1-02** | niespójność | `/ikony` | 32 · 96 (zajawka zamówień); **54 · 132** (sekcja uczniów) | 30–34 · 56–64 | `--section-gap` (`GalleryIconGrid.tsx:61`, `GalleryOrderTeaser.tsx:14`) **plus** `pb-space-5 md:pb-space-7` podpisu ostatniego rzędu galerii (`JustifiedGrid.tsx:50`) — 96 + 34 + pół-interlinia | S |
| **V1-03** | niespójność | `/warsztaty`, `/warsztaty/letnia-szkola-swiatla` (siatka opinii) | 30 / **50** (LSŚ) · 94 | j.w. | `OfferQuoteGrid.tsx:23` (`mt`+`pb` `section-gap`); na LSŚ owinięte w `mt-space-8` (`OfferPage.tsx:175`) — marginesy się zapadają, więc na 390 wygrywa 52 | S |
| **V1-04** | niespójność | oferty: kurs, LSŚ, `/ikony/na-zamowienie`; `/wyklady` (archiwum) | **50–56** · 50–56 | 30–34 · 56–64 | `mt-space-8` (52) bez wariantu mobile: `OfferPage.tsx:76`, `OrderExamples.tsx:13`, H2 w `SemesterProgram.tsx:22` i `StepList.tsx:20`; `--lectures-archive-section-pt: 56px` (`globals.css:231`) — na mobile ten sam odstęp co na desktopie | S |
| **V1-05** | niespójność | `/warsztaty` (lead → karty) | 48–50 · 48–49 | j.w. | `pb-offer-hub-lead-pb` (44) w `WorkshopsHubPage.tsx:46` — własny token zamiast skali | S |
| **V1-06** | niespójność | `/publikacje`, `/publikacje/ikona-dzis` | 32–37 · **32–37** | 56–64 desktop | `--publication-section-gap-m: 34px` (`globals.css:423`) w `:4266, :4333, :4355` bez wartości desktopowej; token desktopowy 64 usunięty w RF-10 jako nieużyty (R4-05 bez zmiany na stagingu) | S |
| **V1-07** | niespójność | `/polityka-prywatnosci` (6 sekcji) | 18–26 · **26–28** | 30–34 · 56–64 | `.privacy-policy-section` `--space-6` (`globals.css:1256`) na obu szerokościach | S |
| **V1-08** | niespójność | `/ikony/wystawy` (4 sekcje) | 28–32 · **62–64** | 56–64 (w zakresie, ale inne niż reszta) | `--exhibition-section-gap(-m)` 64 / 30 (`globals.css:402–403`, `:3615`, `:3930`) | S |
| **V1-09** | drobiazg | `/` (sekcje bez powłoki) | 32–34 · 50–61 | 56–64 | `py-space-7 md:py-space-8` na każdej sekcji (`Pillars.tsx:17`, `FeaturedIcons.tsx:16`); złote linie `rule-gold-t/-b` dzielą 52 + 52 na dwa odstępy po 52 — najbliżej makiety ze wszystkich szablonów | S |
| **V1-10** | niespójność | `/aktualnosci` (lead → wyróżniony), `/wyklady` (FactsBox → program), oferty (lead → pierwsza sekcja) | 27–32 · **28–32** | 56–64 desktop | marginesy elementów, nie skala sekcji: lead `mb-space-6` (26), `mb-space-7` (34, `LecturesHubPage.tsx:35`), `mt-space-6` (26, oferty) — kandydaci na wariant „ciasny” (§6.1) | S |

Korekty względem R4 tabela 1: `/` — widoczny odstęp 50–52, nie „52 + 52” (linie dzielą paddingi); `/wyklady` — program 32, archiwum 54 (nie „34 + 56”: `mb-space-7` działa między siatką FactsBox a programem, `pt` 56 — między programem a archiwum); `/ikony` sekcja uczniów — **132** przez podpis galerii (nowe); `/aktualnosci` grupy lat — w liście głównej brak odstępu grup (lista `hairline-stack`), `--news-year-group-gap` działa tylko w zwiniętym archiwum (`globals.css:2168, 2384`) — nie zmierzone.

### 4.2 Góra i dół strony

| ID | Waga | Trasa | Zmierzone 390 · 1440 | Wzorzec | Przyczyna w kodzie | Koszt |
| --- | --- | --- | --- | --- | --- | --- |
| **V1-11** | niespójność | `/warsztaty`, `/warsztaty/letnia-szkola-swiatla` | 58 · **122** | 26 | `pb-section-gap` siatki opinii (`OfferQuoteGrid.tsx:23`) + `main pb` 26 | S |
| | | `/warsztaty/kurs-roczny-i-trzyletni` | 82 · 82 | 26 | `pb-space-9` (56) bloku naboru (`OfferPage.tsx:76`) + 26 | |
| | | `/` | 34 · 88 | — (bez powłoki) | `py-space-8` sekcji + `pb-space-7` podpisu galerii (`JustifiedGrid.tsx:50`) | |
| | | `/aktualnosci` | 63 · 63 | 26 | `.news-archive-toggle` `mb` 26 + `main pb` 26 + pole klikalne | |
| | | `/publikacje/cisza-ikony` | 62 · 64 | 26 | `.publication-article-body` `mb` 34 + 26 | |
| | | `/nie-ma-takiej-strony` | 38 · 38 | 26 | ostatni link mapy strony (pole klikalne) | |
| | | `/o-akademii`, `/ikony/na-zamowienie` | 0 · 0 | 26 | pas z tłem (`surface-card-bleed` / `surface-tile-bleed`) dochodzi do stopki — wygląda na zamierzone, do potwierdzenia | |
| **V1-12** | drobiazg | `/publikacje`, `/publikacje/ikona-dzis` | H1 o 20 px niżej niż na `/kontakt`, `/polityka-prywatnosci`, 404 (41 vs 21 od góry `main`) | jedna góra treści | `.publication-page-header { margin-top: var(--space-5) }` (`globals.css:4064`) | S |

Wpisy Aktualności na ≥ 1024: dół nie jest miarodajny (kolumna `sticky` wyłączona z pomiaru) — na 390: 66.

### 4.3 Złote belki (wejście RF-13, `--accent-bar`)

| ID | Waga | Trasa | 2 px | 3 px | Przyczyna w kodzie | Koszt |
| --- | --- | --- | --- | --- | --- | --- |
| **V1-13** | niespójność | wszystkie szerokości | FactsBox (`/warsztaty/kurs-…`, LSŚ, `/ikony/na-zamowienie`, `/wyklady`), cytaty ofert (`/warsztaty`, LSŚ), `.exhibition-cta-block` (`/ikony/wystawy`), `.about-quote` (lewa), `.mission-declarations-bar`, `.milestone-row-bar` (`/o-akademii`) | `.exhibition-facts`, `.exhibition-now-next` (`/ikony/wystawy`), `.publication-metrics`, `.publication-toc-item-linked` (lewa; `/publikacje/ikona-dzis`) | 2 px: `--offer-facts-top` / `--offer-quote-top` (`globals.css:180, 191`; też `.exhibition-cta-block` `:3860`), literał `:1574`, elementy belek `/o-akademii`; 3 px: literały `:3688, :3712, :4366, :4474` | S |

**Korekta R4-08:** `design/README` **podaje** grubość — „złota krecha 3 px u góry (FactsBox, EventCard) albo z lewej (LectureList…)” (sekcja „Karty i kafle”); `README-wpis-aktualnosci-v2.md` (K-e) powtarza „krechę 3 px `#c9a227` (FactsBox)”. Większość komponentów (2 px) jest więc niezgodna z makietą, mniejszość (3 px) zgodna.

### 4.4 Typografia (wejście RF-14)

| ID | Waga | Trasa · szerokość | Zmierzone | Wzorzec | Przyczyna w kodzie | Koszt |
| --- | --- | --- | --- | --- | --- | --- |
| **V1-14** | niespójność | 390: `/ikony/wystawy` (eyebrow sekcji i hero, etykieta „teraz / dalej”, placeholder), `/polityka-prywatnosci` (data aktualizacji), oferty i `/wyklady` (notka FactsBox, notka pod naborem), `/wyklady/wykladowcy` (placeholder zdjęcia), wpis (nagłówek „Powiązane”) | **14,5 px** | mobile min. **15 px** (`design/README` §2) | `text-size-caption` (14,5) bez wariantu `-m` mimo tokenu `--size-caption-m: 15px` (`globals.css:94`): `ExhibitionPage.tsx:107, 143, 195`, `FactsBox.tsx:154`, `OfferPage.tsx:100`; klasy `.privacy-policy-updated` (`:1284`), `.exhibition-now-next-label` (`:3726`), `.exhibition-media-placeholder-text` (`:3845`), `.lecturer-photo-placeholder-text` (`:2808`), `.news-article-related-heading` (`:2781`). Ta sama klasa na `dt` w `FactsBox.tsx:132–144`, `ExhibitionFactsPanel.tsx:21`, `Breadcrumb.tsx:20`, `TocSidebar.tsx:16` (nie mierzone) | S |
| **V1-15** | niespójność | 1440: `/pracownia` (`.interview-part-title`), `/publikacje/ikona-dzis` (`.publication-toc-chapter-title`), kurs (`text-size-h3`), `/kontakt` (H2 kolumn `text-size-h3`), `/publikacje` (`.publication-hub-album-title`, H2) | **26** | H3 21–25 | token `--size-h3: 26px` (`globals.css:68`) — sam poza skalą §2; klasy `:1971, :4444, :4144`. Na `/kontakt` i `/publikacje` H2 ma rozmiar H3 (26), a nie H2 sekcji (34) | S |
| | | 1440: `/wyklady` (tytuł wykładu w programie) | **18,5** | H3 / tytuł w liście 21–25 | `--role-list-title: 18.5px` (`globals.css:84`) — do sprawdzenia z makietą `LectureList` | |
| | | 390 · 1440: karty (`/`, `/warsztaty`, `/wyklady/wykladowcy`), `.person-profile-name`, `.about-quote-text` | 24 · 28 | między H3 (25) a H2 (34) | `--role-card-title(-m)` 28 / 24 (`:78–79`) — rola karty bez odpowiednika w §2; zgłaszam jako lukę skali, nie błąd | |
| **V1-16** | niespójność | 390 · 1440 | nagłówki: **1,25** (`.interview-part-title`, `.publication-article-list-title` desktop), **1,3** (`.publication-article-list-title` mobile); Garamond poza nagłówkami: 1 (`.milestone-row-value`), 1,3 (`.activity-list-name`, `.learning-forms-title`), 1,35 (cytat `/`, `.mission-declarations-highlight`, `.publication-hub-imprint`), 1,4 (`.interview-question`, `.publication-toc-title` Plex), 1,45 (`.about-quote-text`) | nagłówki 1,1–1,2; tekst 1,55–1,75 | literały `line-height` w `@layer components` (R4-10: 20 wystąpień) — klasy jak w kolumnie „zmierzone” (`globals.css:1494, 1534, 1719, 1971, 2018, 1376, 4152, 1578, 4297`) | S |
| **V1-17** | niespójność | `/aktualnosci` (H2 wyróżnionego, H3 kart), `/publikacje` (H3 listy artykułów) | `#ece2d3` (kolor tekstu) | H2–H3 `#f3ead9`, tytuły w listach `#f0e6d5` | `.news-featured-title` (`:2217`), `.news-card-title` (`:2327`), `.publication-article-list-title` (`:4297`); pozostałe H3 list (`/wyklady`, oferty) mają `#f0e6d5`. R4-20 (kolor H3 z MDX) — na mierzonych trasach brak H3 z MDX, niezweryfikowane | S |
| **V1-18** | drobiazg | wpis Aktualności | H2 „Powiązane” = Plex 14,5 / 1,6, `#a2917c` (styl etykiety) | H2 26 / 34 | `.news-article-related-heading` (`:2781`) — zgodne z makietą wpisu (etykieta bloku w kolumnie)? do potwierdzenia w V2 | S |
| **V1-19** | niespójność | `/o-akademii`, `/pracownia`, `/polityka-prywatnosci`, `/publikacje/cisza-ikony` vs oferty (LSŚ `.offer-mdx`, kolumna naboru kursu, sekcje `/ikony/na-zamowienie`) vs wpis | odstęp `p + p`: **20** vs **14** vs **38 / 40** | jedna wartość na wariant prozy | 20: `.text-page-mdx` (`mt` 20, R4-06); 14: `mb-space-4` z `mdx-components.tsx` i klasy w sekcjach ofert; 38 / 40: `--prose-gap(-m)` (`globals.css:264–265`) — proza wpisu z `README-wpis-aktualnosci.md` (hipoteza A: Garamond 20 / 19, odstęp 40), osobny wariant. Pozostałe 8 / 10 px to listy i meta (nie proza) | M |
| **V1-20** | niespójność | `/ikony/wystawy` (`.exhibition-section-copy`, 6 wierszy) | 652 px = 37,3 em · **752 px = 43 em** przy 1600 | 34–36 em (proza 640 px = 36,6 em) | `.exhibition-section-copy` bez `max-width` (`globals.css:3657`) — miara rośnie z oknem. To samo (bez `max-width`) przy krótkich dziś tekstach: `.publication-article-excerpt` 1016 / 1116 px (1 wiersz, 108 znaków — ryzyko przy dłuższym leadzie), `text-size-lecturer-affiliation` 744 / 844, `.person-profile-role`, `.learning-forms-link` | S |
| **V1-21** | drobiazg | `/wyklady/wykladowcy` (bio), `/pracownia` (opisy form), `/publikacje` (opisy, zajawki) | 16,5 / 1,6 i 16,5 / **1,7** | proza 17,5 / 1,7 lub opis 16,5 / 1,6 | bio wykładowców (tekst ciągły) w roli „opis” 16,5; para 16,5 + 1,7 łączy dwie role (`.learning-forms-description`, `.publication-hub-description`) — do oceny w V2, w zakresie §2 | S |

Bez odstępstw: kolumna treści (jedna szerokość na wszystkich trasach z powłoką), H1 (poza wpisem 32 / 44 i `/` 56 — obie wartości z makiet: `README-wpis-aktualnosci.md` „H1 wpisu Garamond 44 / 1,14 · 32 / 1,14”, `--size-h1-home`), krój nagłówków (EB Garamond 400 wszędzie), kolor H1 `#f6eddc` (21/21).

## 5. Korekty do wcześniejszych faz

- **R4-08:** grubość belki **jest** w `design/README` (3 px) — patrz V1-13.
- **R4 tabela 1:** wartości z §4.1 (dół tabeli) zastępują hipotezy; `--publication-section-gap` (64) już nie istnieje (RF-10).
- **R4-06:** potwierdzone 20 / 14 / 40 (V1-19).
- **R4-10:** kolory i rozmiary pisma — **0 wartości spoza tokenów** na stagingu; problemem jest skala w samych tokenach (V1-14…V1-16), nie literały w CSS.

## 6. Propozycja wartości docelowych (do decyzji właściciela)

Wartości to CSS (bez pół-interlinii). Kolumna „Skutek” = zmiana widoczna względem stagingu.

### 6.1 RF-13 — skala odstępów sekcji i belka

| Parametr | Propozycja | Alternatywa | Uzasadnienie | Skutek |
| --- | --- | --- | --- | --- |
| `--section-gap` (desktop) | **56 px** (`--space-9`) | 64 px | jedyna wartość w zakresie makiety (56–64) **i** w siatce odstępów §3 (4/8/10/14/20/26/34/52/56); najbliżej skupiska ofert i `/` (48–56) | strony tekstowe, `/ikony`, cytaty ofert −40; wystawy −8; publikacje +22; `/` i oferty +4 |
| `--section-gap-mobile` | **34 px** (`--space-7`) | 32 px (bez zmiany) | dominanta mobile 30–34; 34 jest w siatce, 32 nie | ±2 na większości tras; oferty i archiwum `/wyklady` −16…−22 (V1-04) |
| Próg | **jeden: 768 px** (`md`) | 1024 px | wszystkie pozostałe tokeny sekcji przełączają się na 768; znika stopień 60 px (768–1023) | 768–1023: 60 → 56 |
| Wariant „ciasny” `--section-gap-tight` | **34 / 26** (desktop / mobile; `--space-7` / `--space-6`) | 26 / 20 | dla podsekcji jednego tematu i przejść „lead → pierwsza sekcja”: `/polityka-prywatnosci` (V1-07), V1-10 (lead `/aktualnosci`, FactsBox → program `/wyklady`, lead ofert) | polityka +8 desktop; reszta ±2–6 |
| Zakres standardu | wszystkie `section` najwyższego poziomu: strony tekstowe, `/ikony`, oferty (`mt-space-8` → token, z wariantem mobile), wystawy, publikacje (V1-06), `/` (`py` sekcji), archiwum `/wyklady`, hub `/warsztaty` (V1-05) | — | jedna rola zamiast 10 mechanizmów (R4-04) | — |
| Dół strony | **26** (tylko powłoka); ostatnia sekcja bez własnego `pb` (`OfferQuoteGrid`, blok naboru, `.publication-article-body`, podpis galerii) | zostawić `pb` ofert | V1-11; wyjątek do decyzji: pasy z tłem dochodzące do stopki (`/o-akademii`, `/ikony/na-zamowienie`) | oferty −32…−96, artykuł −34 |
| Podpis ostatniego rzędu galerii | bez `pb` po ostatnim rzędzie | — | V1-02: +34 px do odstępu sekcji na `/ikony` i do dołu `/` | `/ikony` 132 → 56 |
| Góra treści | `.publication-page-header` bez `margin-top` | — | V1-12 | publikacje H1 −20 |
| `--accent-bar` | **3 px** — górna belka paneli i lewa kreska cytatów / spisu / list | 2 px (większość komponentów dziś) | `design/README` „Karty i kafle” i `README-wpis-aktualnosci-v2` K-e mówią 3 px (V1-13) | 7 komponentów 2 → 3 px |

### 6.2 RF-14 — rozjazdy typografii do ujednolicenia

| Rozjazd | Propozycja | Alternatywa | Skutek |
| --- | --- | --- | --- |
| Odstęp akapitów prozy (V1-19) | wariant `text` i `offer`: **20 px** (`--space-5`) na obu szerokościach; wariant `news`: bez zmian **40 / 38** (makieta wpisu) | `offer` zostaje 14 (proza ofert gęstsza) | oferty +6 między akapitami |
| Podpis / etykieta na mobile (V1-14) | `text-size-caption-m` (**15 px**) < 768 we wszystkich użyciach `text-size-caption` i klas etykiet | — | +0,5 px w 9+ miejscach na 390 |
| H3 26 px (V1-15) | `--size-h3` → **25 px** (górna granica §2) albo rola `card-title` — decyzja po V2 (to głównie nagłówki kolumn / rozdziałów) | zostawić 26 i dopisać do `design/README` jako wyjątek | 5 nagłówków −1 px |
| H2 w roli H3 na `/kontakt`, `/publikacje` (V1-15) | do V2: czy to nagłówki sekcji (34) czy kolumn / bloku (rola `box-title` 24) | — | — |
| Tytuł w programie wykładów 18,5 (V1-15) | sprawdzić z makietą `LectureList` (2a / 3a) — bez zmiany do tego czasu | 21 (dolna granica §2) | — |
| Interlinie nagłówków 1,25 / 1,3 (V1-16) | **1,2** (`--leading-heading`) | — | 2 klasy |
| Interlinie Garamondu poza nagłówkami 1–1,45 (V1-16) | jedna rola pośrednia **1,35** (`--leading-display`) dla cytatów, nazw, wartości; `.milestone-row-value` (liczba 44 px, 1 wiersz) może zostać 1 | mapować na 1,2 (krótkie) / 1,55 (wielowierszowe) | 7 klas |
| Kolor tytułów w listach (V1-17) | `.news-card-title`, `.publication-article-list-title` → `#f0e6d5`; `.news-featured-title` → `#f3ead9` | — | 3 klasy, różnica jasności niewielka |
| Miara bloków bez `max-width` (V1-20) | `max-width: var(--measure-prose)` (640) dla `.exhibition-section-copy` i opisów z listy V1-20 | `--measure-lead` (680) | wystawy 652 / 752 → 640 |
| Opis vs proza (V1-21) | do V2 (bio wykładowców 16,5 vs proza 17,5) | — | — |

## 7. Do kolejnych faz

- **V2:** V1-15 (H2 w roli H3, rola karty), V1-18 („Powiązane”), V1-21 (bio wykładowców), pasy przy stopce (V1-11), próg 768–1023 (nie mierzony).
- **V4:** typografia `dt`, breadcrumb, TOC na 390 (ta sama klasa `text-size-caption` — V1-14).
- **RF-13 / RF-14 „Gotowe”:** ponowić `npx tsx scripts/visual-measure.ts --base <adres>`; kryterium RF-13 „≤ 2 wartości odstępu sekcji per szerokość” sprawdzać w `summary.json` → `blockGap` (z tolerancją pół-interlinii ±6 px).
