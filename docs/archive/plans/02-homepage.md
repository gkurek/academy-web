# Plan 02 — Strona główna

Status: zamknięty 2026-09-12
Gałąź: feat/02-homepage
Makiety: design/Akademia Ikony - kierunki wizualne.dc.html — #1a (desktop, linie 1695–1820), #3b (mobile, linie 480–590)

## Cel i zakres

Pierwsza pełna strona serwisu — strona główna. Ustala rytm sekcji i wzorzec czytania treści z `content/` przez `src/content/*`. W zakresie: Hero, sekcja „Najbliższe” (SiteSettings.upcoming), trzy filary, Testimonial (cytat EJK), „Wybrane ikony” (IconGrid, 4 wpisy sample). Poza zakresem (świadomie, po weryfikacji z makietą — patrz K-13): MapBlock i sekcja kontakt na stronie głównej — te trafiają do etapu 8 (/kontakt). Poza zakresem też: analityka/zdarzenia (K-15, etap 10), Lightbox i /ikony/[slug] (etap 5).

## Decyzje podjęte w sesji planistycznej

- K-13: Homepage bez MapBlock/kontaktu — rozbieżność opis etapu vs makieta rozstrzygnięta na korzyść makiety; kontakt zostaje w stopce.
- K-14: Testimonial to jedna sekcja (cytat + podpis EJK), bez portretu/bio/linku, identyczna na desktop i mobile — uproszczenie względem wariantu mobile makiety i względem `Testimonial.prompt.md`.
- K-15: Brak atrybutów/zdarzeń analitycznych w etapie 2 — całość do etapu 10.
- Tytuły sample w `content/icons.json`: nazwy kanoniczne z podpisów makiety (Matka Boża Znaku, Przemienienie, Mandylion, Św. Antoni), autor „ejk” poza Św. Antonim („student”).
- Sekcje „Najbliższe” i „trzy filary” nie mają nazw w design/README — lokalne komponenty (`UpcomingHighlights`, `Pillars`), nazwy angielskie.
- K-16 (po Kawałku 1): `SiteSettings.upcoming` rozszerzone o pole `linkLabel` — osobny `TextLink` per kafel („Jak się zapisać”/„Program sezonu”/„Wystawy”), zgodnie z makietą; zmiana w `types.ts`, `content/settings.json` i `UpcomingHighlights.tsx` (decyzja użytkownika, nie cały kafel jako `<Link>`).

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| --- | --- | --- |
| `src/app/page.tsx` | zmiana | Kolejność sekcji: Hero → Najbliższe → filary → Testimonial → Wybrane ikony; `Header`/`Footer` bezpośrednio (K-02 z etapu 1) |
| `src/components/content/Hero.tsx` | nowy | Wg `design/components/content/Hero.jsx` — H1+lead+ikona (`Image` z typów)+dwa CTA jako children |
| `src/components/home/UpcomingHighlights.tsx` | nowy | Sekcja „Najbliższe” — 3 kafle z `SiteSettings.upcoming`, każdy z `TextLink` (`linkLabel`) |
| `src/components/home/Pillars.tsx` | nowy | Sekcja „trzy filary” (Warsztaty/Wykłady/Ikony); nagłówki jako `<h2>` (a11y) |
| `src/components/content/Testimonial.tsx` | nowy | Cytat EJK — `quote`+`author` wg K-14 |
| `src/components/home/FeaturedIcons.tsx` | nowy | Sekcja „Wybrane ikony” — nagłówek, link/przycisk „Cała galeria”, `IconGrid` |
| `src/components/gallery/IconGrid.tsx` | nowy | Siatka 4 kolumny (desktop), height 290px/200px mobile, bez interakcji; opcjonalny `mobileCount` |
| `src/components/core/TextLink.tsx` | nowy | Link złotą linią (`border-bottom`) — „Najbliższe”, filary, „Cała galeria” (desktop) |
| `src/content/icons.ts` | nowy | Warstwa odczytu: `getIconWorks()` z `content/icons.json` |
| `content/icons.json` | nowy, `sample` | 4 wpisy `IconWork` |
| `content/settings.json` | zmiana | `upcoming`: 2 wpisy z brief §8 + 1 placeholder; pole `linkLabel` na każdym wpisie |
| `src/content/types.ts` | zmiana | `upcoming`: dodane `linkLabel: string` (K-16) |
| `public/media/sample/icons/*` | nowe (kopie) | `chrystus.jpg` (Hero) + 4 ikony galerii z `design/assets/icons/` |
| `public/media/sample/photos/*` | nowe (kopie) | 3 zdjęcia filarów: `pracownia`, `wyklad`, `wystawa` (`wystawa-stala` usunięte po poprawce Hero) |
| `src/i18n/pl.ts` | zmiana | Sekcja `home`: copy Hero/filarów/testimonialu, aria-labels, nagłówki sekcji |
| `src/app/globals.css` | zmiana | Tokeny strony głównej (Hero, kafle, filary, testimonial, siatka ikon) |
| `src/components/core/Button.tsx` | zmiana | Naprawa obrysu wariantu `secondary` (konflikt `border-transparent`) |

## Kawałki

### Kawałek 1 — Hero + Najbliższe + trzy filary

Zakres: `src/app/page.tsx`, `Hero.tsx`, `UpcomingHighlights.tsx`, `Pillars.tsx`, rozszerzenie `pl.ts`, aktualizacja `content/settings.json` (`upcoming`) treścią z makiety (weryfikacja dat/tytułów względem brief §8 tam, gdzie to możliwe — bez zgadywania niepotwierdzonych faktów).
Kryterium „gotowe”: `/` renderuje się z `Header`+`Footer`, trzy sekcje zgodne z makietą na 390px i desktop, `npm run build`+`npm run lint` przechodzą.

### Kawałek 2 — Testimonial + Wybrane ikony + dane sample

Zakres: kopiowanie 4 ikon galerii z `design/assets/icons/` → `public/media/sample/icons/`, `content/icons.json` (4 wpisy), `src/content/icons.ts`, `Testimonial.tsx` (K-14), `IconGrid.tsx` + `FeaturedIcons.tsx` (po `Testimonial`, przed stopką).
Kryterium „gotowe”: sekcje renderują się z realnych plików w `public/media/sample` przez `next/image` z podanymi wymiarami, build/lint OK, obejrzane na 390px i desktop.

### Kawałek 3 — Dopracowanie mobile i finalizacja

Zakres: pełny przegląd strony na 390px i desktop (Hero: 62% szerokości mobile / 760px wysokości desktop — patrz „Druga poprawka”), odstępy wg skali z `design/README`, nawigacja klawiaturą po wszystkich linkach/CTA z widocznym fokusem, uzupełnienie brakujących stringów `pl.ts`, weryfikacja braku tekstu redakcyjnego w JSX.
Kryterium „gotowe”: DoD etapu spełnione w całości, build/lint OK.

## Dane sample dodawane w tym etapie

- `content/icons.json` — 4 wpisy `IconWork`: Matka Boża Znaku (40×30 cm, ejk), Przemienienie (60×45 cm, ejk), Mandylion (35×28 cm, ejk), Św. Antoni (autor: student, wymiary niepodane) → do `docs/plan-claude-code.md` §5.
- `public/media/sample/icons/*` — 5 plików: `chrystus.jpg` (Hero) + 4 ikony galerii; kopie 1:1 z `design/assets/icons/` → do §5.
- `public/media/sample/photos/*` — 3 pliki filarów (`pracownia`, `wyklad`, `wystawa`); kopie z `design/assets/photos/` → do §5.
- `content/settings.json` (`upcoming`) — 2 wpisy z brief §8 + 1 placeholder `[przykład]`; `linkLabel` na każdym wpisie → wpisane w §5.

## Kryteria ukończenia etapu

- [x] zgodność z makietą desktop i mobile (bez MapBlock/kontaktu — K-13; Testimonial bez portretu — K-14)
- [x] wszystkie treści redakcyjne z `content/` lub `pl.ts`; w JSX wyłącznie szablony formatowania w `IconGrid.formatCaption` (`pisana ręką`, `cm` — nie copy redakcyjne; do rozważenia przeniesienia w etapie 5)
- [x] CTA „Warsztaty”/„Wykłady” prowadzą do `/warsztaty` i `/wyklady`
- [x] Lighthouse mobile na tej stronie: dostępność ≥ 95 — **100/100** (i 100/100 desktop) po poprawce `heading-order` w Kawałku 3

## Ryzyka i pytania otwarte

- ~~Wysokość obrazu Hero na mobile~~ — **rozwiązane** w „Druga poprawka”: `width: 62%` (nie stała wysokość ani ~60% viewportu).
- ~~Treść „Najbliższe” (wykład inauguracyjny)~~ — **rozwiązane**: data/tytuł potwierdzone w brief §8 (6.10.2026); trzeci kafel pozostaje placeholder.
- Hamburger mobilny (`HeaderMobileMenu.tsx`, etap 1): Enter/Space nie zadziałały w automatycznym teście klawiatury Kawałka 3 — do ręcznej weryfikacji w realnej przeglądarce przed wdrożeniem; jeśli błąd, naprawa w etapie 1, nie tutaj.

## Odstępstwa od planu / makiety (z checkpointów)

Kawałek 1:
- Kopia `design/assets/photos/{pracownia,wyklad,wystawa,wystawa-stala}.jpg` → `public/media/sample/photos/` wykonana już w tym kawałku, nie w Kawałku 2 jak zapisano w planie — Hero i Pillars potrzebują zdjęć już tutaj (plan to przewidywał tylko dla Kawałka 2 razem z `icons/`). `design/assets/icons/*` nadal nieskopiowane, zgodnie z planem, do Kawałka 2.
- Hero image dobrany samodzielnie: `wystawa-stala.jpg` (makieta ma nierozwiązany placeholder `{{ heroSrc }}`/`{{ heroAlt }}`/`{{ heroCaption }}`). Bez podpisu pod zdjęciem — `heroCaption` też jest placeholderem bez treści, nie zgadywałem.
- `Hero.tsx`: sygnatura props inna niż `design/components/content/Hero.jsx` — przyjmuje `image: Image` (typ z `content/types.ts`) zamiast `image: string`/`imageAlt: string`, bez propsów `mobile` i `aside` (niepotrzebne na stronie głównej, warianty responsywne przez klasy Tailwind zamiast gałęzi `mobile` — spójne z `Header`/`HeaderMobileMenu` z etapu 1).
- Dodany `src/components/core/TextLink.tsx` — nie było w tabeli plików Kawałka 1, ale potrzebny do linków w „Najbliższe” i filarach (złota linia, `border-bottom`). To zapowiedziany w `docs/plan-claude-code.md` §3 prymityw (jak `Button`), tylko jeszcze niezbudowany.
- „Najbliższe” (stan pośredni, **zastąpiony K-16**): pierwotnie cały kafel jako `<Link>` bez osobnego tekstu linku — użytkownik dodał `linkLabel` do modelu i `TextLink` per kafel; to jest **stan finalny**.
- `content/settings.json` → `upcoming`: dwa pierwsze wpisy to fakty potwierdzone w brief §8 (nabór do 24.09.2026, pierwszy wykład 6.10.2026 18:00 — cykl „Ikona – korzenie i owoce wiary. Mistyka dziś”). Trzeci wpis („Wystawa stała”) pozostaje `sample`/placeholder w nawiasach — nie ma potwierdzenia w brief §8, że taka wystawa istnieje; zostawiony, żeby zachować 3-kolumnowy układ z makiety. **Rozstrzygnięte K-58 (2026-09-21):** wystawa istnieje realnie (potwierdzone przez EJK), kafel przestaje być `[przykład]` i linkuje do `/ikony/wystawa` — zmiana w kodzie w etapie 8.
- Pillars: nagłówki H3 wyrenderowane wagą 400, nie 500 jak dosłownie w tej instancji makiety — `design/README` §Fundamenty wizualne: „Nagłówki zawsze wagą 400 – nigdy pogrubione” jest ogólną regułą systemu, instancja w `.dc.html` (500) potraktowana jako drobna niespójność makiety, nie jako wyjątek.
- Copy Hero/Pillars (nagłówki, leady, akapity filarów) trzymane w `pl.ts` pod `pl.home`, nie tylko „nagłówki sekcji i aria-labels” jak dosłownie opisano w tabeli plików planu — brief §4 nie ma osobnego typu treści dla strony głównej, więc cała redakcyjna treść tej strony (poza `upcoming` z `SiteSettings`) trafia do `pl.ts`, zgodnie z ogólną zasadą „stringi UI w pl.ts, nie w JSX”.
- Naprawiony pre-istniejący błąd w `src/components/core/Button.tsx` (z etapu 1): klasa bazowa `border-transparent` konkurowała z `border-border-button` wariantu `secondary` o tę samą właściwość CSS — w skompilowanym Tailwindzie wygrywała zawsze `border-transparent` (kolejność w wygenerowanym arkuszu, nie w stringu klas), więc przycisk drugorzędny renderował się bez widocznego obrysu. Zauważone dopiero teraz, bo to pierwszy realny podgląd w przeglądarce (`Wykłady 2026/2027` w Hero). Naprawa: `border-transparent` przeniesione do `variantClasses.primary`, usunięte z klas wspólnych.
- Dodane tokeny w `globals.css` wprost z literalnych wartości makiety strony głównej (nie z generycznego `Hero.jsx`, bo instancja home ma większe wymiary — patrz `--size-h1-home` już istniejące w kawałku 1): `--spacing-hero-pt/pb(-m)`, `--spacing-hero-image-h(-m)`, `--grid-template-columns-hero` (`1fr 420px`), `--spacing-tile-py/px(-m)`, `--spacing-hairline-gap`, `--spacing-pillars-gap`, `--spacing-pillar-image-h(-m)`, `--spacing-measure`, `--text-size-lead-m`, `--text-size-h2-sm`, `--text-size-h2-m`, `--shadow-hero-image` (jako klasa Tailwind), oraz `--leading-tight/heading/body/loose` jako klasy `leading-*` (wcześniej zdefiniowane tylko jako gołe zmienne CSS używane w stylu `body`, ale NIE zmapowane na klasy Tailwind — `Footer.tsx` z etapu 1 już używał klas `leading-tight`/`leading-loose`/`leading-body`, które więc dotąd błędnie renderowały się z domyślnymi wartościami Tailwind (1.25/2) zamiast tokenów (1.12/1.75/1.6); to mapowanie naprawia też te trzy klasy w `Footer.tsx` bez zmiany jego kodu).

## Poprawki po pierwszym meldunku (przed OK)

Użytkownik zgłosił trzy błędy po obejrzeniu w przeglądarce:

1. **Zły obraz w Hero** — użyłem zdjęcia z `design/assets/photos/` (wystawa), a `docs/plan-claude-code.md` §3 wprost mówi „Hero (**ikona** + zdanie + dwa CTA)” — powinna być ikona z `design/assets/icons/`. Poprawka: `chrystus.jpg` (Chrystus Pantokrator, Synaj, VI w.) skopiowany do `public/media/sample/icons/`, `wystawa-stala.jpg` usunięty z `public/media/sample/photos/` (był potrzebny tylko dla błędnego wyboru).
2. **Proporcje obrazu w Hero** — `chrystus.jpg` to portret 360×682 (bardzo wysoki), a ja wymusiłem `object-fit: cover` w kwadratowym boksie 420×420, co obcinało aureolę i dłonie. Poprawka: `Hero.tsx` renderuje teraz obraz w naturalnych proporcjach (`object-contain`, wysokość ograniczona tokenem `--spacing-hero-image-h(-m)`, szerokość automatyczna) — cała ikona widoczna, nieprzycięta. Dodany podpis pod zdjęciem przez pole `Image.caption` (już istniejące w `content/types.ts`, nie wymagało zmiany typu).
3. **Rozmiar H1** — realny błąd: klasa `text-size-h1-home` użyta w `Hero.tsx` nie miała odpowiadającego wpisu w `@theme inline` w `globals.css` (tylko `text-size-h1` i `text-size-h1-m` były zmapowane). Tailwind cicho pomija nieznane klasy, więc H1 na desktopie renderował się domyślnym rozmiarem przeglądarki zamiast 56px — stąd zbyt mały nagłówek względem leadu. Poprawka: dodany brakujący wpis `--text-size-h1-home: var(--size-h1-home);`.

Zweryfikowane ponownie w przeglądarce na 375px i desktopie (screenshoty) — H1 wyraźnie większy od leadu, cała ikona widoczna z podpisem, zgodne ze zrzutem od użytkownika.

## Druga poprawka — realne wymiary obrazu Hero z rozwiązanego DOM makiety

Mój `heroStyleDesktop`/`heroStyleMobile` w kroku wyżej nadal był zgadywaniem (420px wysokości desktop, kontener wysokości mobile) — plik `.dc.html` otwarty wprost w moim narzędziu przeglądarki renderuje się ze statycznym snapshotem, w którym `{{ heroStyleDesktop }}`/`{{ heroStyleMobile }}` zostają dosłownymi, nierozwiązanymi placeholderami (potwierdzone: `<img src="{{ heroSrc }}" style="{{ heroStyleDesktop }}">`, realny rozmiar ~98×20px). Użytkownik otworzył ten sam plik we własnej przeglądarce (gdzie skrypt rozwiązujący `{{ }}` faktycznie się wykonuje) i wkleił rozwiązany HTML. Realne wartości:

- Desktop: `height: 760px; width: auto; max-width: 100%; object-fit: contain; margin: 0 auto` (nie 420px jak zgadłem), cień `0 30px 70px rgba(0,0,0,.55)` (bez zmian).
- Mobile: `width: 62%; height: auto; margin: 0 auto`, osobny (lżejszy) cień `0 20px 50px rgba(0,0,0,.5)` — nie stała wysokość 260px jak zgadłem, tylko procent szerokości.
- Źródło: `uploads/Chrystus212m_n.jpg` — ten sam obraz co `design/assets/icons/chrystus.jpg`, tylko oryginalna nazwa WP.
- Dodatkowo: w realnym DOM `<img>` na mobile jest **nieopakowanym rodzeństwem** karty (bez marginesu strony), więc 62% liczy się względem pełnej szerokości 390px, nie względem kolumny już pomniejszonej o padding tekstu. Przebudowałem `Hero.tsx`: padding boczny na mobile jest teraz na bloku tekstowym, nie na całej sekcji, żeby obraz liczył proporcję względem pełnej szerokości — zweryfikowane przez `getBoundingClientRect()`: 232.5px przy 375px viewportu = dokładnie 62%.

Nowe/zmienione tokeny w `globals.css`: `--hero-image-h: 760px` (było 420), `--hero-image-w-m: 62%` (zamiast stałej wysokości mobile), `--shadow-hero-image-m` (nowy, osobny cień mobile). Zweryfikowane `getBoundingClientRect()` na desktopie (1280px): obraz 401×760px — zgodne co do piksela.

## Kawałek 2 — realizacja

Zakres: `Testimonial.tsx` (K-14 — cytat + podpis EJK, bez portretu, identyczne na obu breakpointach), `IconGrid.tsx` (siatka bez interakcji/lightboxa — to dopiero etap 5), `FeaturedIcons.tsx` (nowy, `home/` — nagłówek „Wybrane ikony” + link/przycisk „Cała galeria” + `IconGrid`, nienazwany w planie ale potrzebny do złożenia nagłówka z siatką), `content/icons.json` (4 wpisy `IconWork`, `sample: true`), `src/content/icons.ts` (`getIconWorks()`), kopia `design/assets/icons/{matka-boza-znaku,przemienienie,mandylion,sw-antoni}.jpg` → `public/media/sample/icons/` (zweryfikowana bajtowo przeciw `design/uploads/{5,11,DSC02962JPG,zz-6}` — identyczne, zgodnie z `docs/design-mockup-guide.md`).

Odstępstwa:
- `IconGrid` przyjmuje `items: IconWork[]` bezpośrednio (typ z brief §4) zamiast generycznego `IconItem[]` z `design/gallery/IconGrid.d.ts` — ta sama adaptacja co przy `Hero` w Kawałku 1 (typowany model treści zamiast luźnych stringów), oraz bez `href`/`onSelect`/`<a>`-wrappera, bo plan wprost mówi „bez interakcji” dla tego miejsca.
- Mobile „Wybrane ikony” pokazuje tylko pierwsze 2 z 4 ikon + pełnoszerokościowy przycisk „Cała galeria” (drugorzędny) — to dosłownie to, co pokazuje makieta (mobile ma tylko 2 `<figure>` w markupie), nie moja decyzja; zaimplementowane przez `mobileCount` prop w `IconGrid` (`hidden md:block` na pozycjach ≥2), nie przez cięcie danych — inne przyszłe użycia (pełna galeria etap 5) po prostu pominą ten prop.
- Podpis „Św. Antoni”: `authorName: "uczestniczki"` (dopełniacz, nie mianownik) — świadomie w tej formie, bo jedyne miejsce użycia w UI to fraza „pisana ręką ${authorName}” z makiety („pisana ręką uczestniczki”); przechowywanie już odmienionej formy zamiast budowania systemu odmiany dla jednego wpisu. Szablon `formatCaption` (`pisana ręką`, `cm`) zostaje w `IconGrid.tsx` — akceptowalne jako formatowanie, nie copy redakcyjne (patrz DoD).
- `content/icons.ts`: `iconsData as IconWork[]` — TS nie wywnioswał literalnego typu `"ejk" | "student"` z importu JSON (working import zwraca `string`), rzutowanie konieczne (ten sam wzorzec będzie potrzebny w etapie 5 przy pełnym zestawie).
- Nowe tokeny w `globals.css`, wszystkie z literalnych wartości makiety (nie zgadywane — zweryfikowane w surowym `.dc.html`, to nie były placeholdery `{{ }}`): `--measure-quote` (20em), `--leading-quote` (1.35), `--icon-grid-gap/-h/-h-m` (22px/290px/200px — kontekst tylko tej sekcji, pełna galeria w etapie 5 dostanie inną wysokość), `--text-size-h2`/`--text-size-quote-lg` (domapowanie istniejących wartości z `:root` na klasy Tailwind, wzorzec z Kawałka 1). Nagłówek „Wybrane ikony” w makiecie ma 32px desktop / 28px mobile — zaokrąglone do istniejących kroków skali 34/28 (≤2px różnicy, ten sam precedens co „Button lg” w etapie 1).

## Kawałek 3 — realizacja

Zakres: pełny przegląd 390px i desktop, systematyczny audyt klawiatury (Tab przez wszystkie ~29 elementów interaktywnych na stronie, jeden po drugim, przez `getComputedStyle().outlineStyle` po każdym kroku — nie tylko wyrywkowo), audyt Lighthouse accessibility (mobile + desktop), grep za tekstem redakcyjnym w JSX.

Znalezione i naprawione:
- **`heading-order` (Lighthouse, realny błąd):** `Pillars.tsx` renderował `<h3>` dla „Warsztaty/Wykłady/Ikony”, a przed nim w dokumencie nie było żadnego `<h2>` (Hero ma `<h1>`, „Najbliższe” nie ma nagłówka) — pierwszy `<h2>` pojawiał się dopiero w „Wybrane ikony”, czyli PO tych `<h3>`. To realny błąd dostępności (kolejność nagłówków dla czytników ekranu), nie kwestia sporna. Naprawa: `<h3>` → `<h2>` w `Pillars.tsx` (bez zmiany klas/wyglądu — rozmiar typograficzny „H3” z `design/README` to rola w skali, nie wymóg konkretnego tagu DOM). Wynik Lighthouse accessibility: 0.98 → **1.0** (mobile i desktop).

Sprawdzone, bez zastrzeżeń:
- Wszystkie ~29 elementów interaktywnych na stronie (nav, Hero CTA, „Najbliższe” ×3, filary ×3, „Cała galeria”, stopka) mają widoczny fokus 2px `#e8c765`/offset 2px w prawidłowej kolejności DOM — zweryfikowane pojedynczo, nie wyrywkowo.
- Na mobile: dokładnie jedna wersja „Cała galeria” jest obecna w drzewie fokusowalnych elementów (przycisk, nie link) — druga (link na desktop) ma `offsetParent === null`, więc nie jest osiągalna klawiaturą na mobile (brak „martwego” fokusu).
- Grep po wielkiej literze PL na początku tekstu w JSX (`src/components/home`, `content`, `gallery`, `page.tsx`) — zero trafień redakcyjnych; wyjątek: `IconGrid.formatCaption` — szablon `pisana ręką` / jednostka `cm` (patrz DoD).

Potwierdzone po zamknięciu (2026-09-13):
- **Hamburger Enter/Space** (`HeaderMobileMenu.tsx`, etap 1): automatyczny test w sesji implementacyjnej nie zadziałał (podejrzenie ograniczenia narzędzia); **potwierdzone w przeglądarce przez użytkownika** — Tab→Enter/Space otwiera szufladę, `aria-expanded` się przełącza. Wpis uzupełniający w `docs/plans/01-skeleton.md` DoD.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| --- | --- | --- |
| 1 — Hero + Najbliższe + trzy filary | zamknięte (OK użytkownika) | Zob. „Odstępstwa” i „Poprawki po pierwszym meldunku” wyżej. Otwarte pytanie o `linkLabel` w „Najbliższe” rozstrzygnięte przez użytkownika bezpośrednią zmianą `SiteSettings.upcoming` (dodane pole `linkLabel`), `content/settings.json` i `UpcomingHighlights.tsx` — zweryfikowane, build/lint OK. |
| 2 — Testimonial + Wybrane ikony + dane sample | zamknięte (OK użytkownika) | Zob. „Kawałek 2 — realizacja” wyżej. Build/lint OK, sprawdzone w przeglądarce na 375px i desktopie (screenshoty) — zgodne z makietą co do treści i układu (w tym mobile 2+przycisk). Fokus klawiaturowy zweryfikowany na `TextLink` w filarach i w „Wybrane ikony”. |
| 3 — Dopracowanie mobile i finalizacja | zamknięte (OK użytkownika) | Zob. „Kawałek 3 — realizacja” wyżej. Znaleziony i naprawiony realny błąd dostępności (`heading-order`, Lighthouse 0.98→1.0). Hamburger Enter/Space potwierdzony w przeglądarce 2026-09-13. Build/lint OK. |

**Etap 02 zamknięty (OK użytkownika, 2026-09-12).**

## Weryfikacja zgodności plan ↔ implementacja (2026-09-13)

Przegląd kodu po zamknięciu etapu — implementacja zgodna z planem i udokumentowanymi odstępstwami.

| Obszar | Status |
| --- | --- |
| Pliki z tabeli + `TextLink`, `FeaturedIcons`, `globals.css`, `Button` | ✅ |
| Kolejność sekcji na `/` | ✅ |
| K-13 (bez MapBlock/kontaktu), K-14 (Testimonial), K-15 (bez analityki), K-16 (`linkLabel`) | ✅ |
| Dane sample (`icons.json`, `settings.upcoming`, media) | ✅ |
| Hero: `chrystus.jpg`, 760px/62%, podpis, `text-size-h1-home` | ✅ |
| `npm run build` + `npm run lint` | ✅ |

Jedyna drobna luka względem dosłownego DoD: szablon podpisu w `IconGrid.tsx` (nie blokuje etapu; przeniesienie do `pl.ts` zaplanowane w etapie 5).

Dokumentacja zsynchronizowana 2026-09-13: `01-skeleton.md`, `plan-claude-code.md` §3/§4, `brief-claude-code.md` §4 (K-16, hamburger, zakres mediów).

## Korekta 04b — hero (K-33, opcja A, 2026-09-19)

Wartości z „Drugiej poprawki" (760 px desktop / 62% mobile) **zastąpione** w etapie 04b. Obowiązujące tokeny — patrz `docs/plans/04b-review-fixes.md` K-33 pkt 1 i rejestr K-33 w `docs/plan-claude-code.md` §4:

- `--hero-image-h: min(920px, 76vh)` (nie `760px` ani `min(760px, 68vh)`)
- `--hero-image-w-m: 72%` (makieta 62%)
- `--hero-text-min: 300px`, kolumna obrazu max 500 px, wyrównanie prawo/desktop

Kafle „Najbliższe" mogą zaczynać się pod foldem przy krótkim oknie (np. 1920×917) — świadoma decyzja właściciela repo.
