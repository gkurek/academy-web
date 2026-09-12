# Plan 01 — Szkielet, design system, warstwa treści

Status: zatwierdzony 2026-09-12
Gałąź: feat/01-skeleton
Makiety: `design/README.md`, `design/tokens/*.css`, `design/components/navigation/*`
(`Header`, `Footer`, `SectionNav`, `Breadcrumb`), `design/components/core/Button.jsx`,
`design/Akademia Ikony - kierunki wizualne.dc.html` (sekcje „Nawigacja”, „Menu mobilne — 390 px”,
„Komponenty — stany interaktywne”).

## Cel i zakres

Fundament pod całą resztę serwisu: tokeny designu i fonty w Tailwind, layout aplikacji,
`Header`/`Footer`/`SectionNav`/`Breadcrumb`, warstwa odczytu treści `src/content/*` i puste trasy
dla całej architektury informacji z brief §3 — żeby żaden link z nagłówka, `SectionNav` czy stopki
nie prowadził do 404 w kolejnych pod-etapach. Poza zakresem: treść i układ konkretnych stron
(strona główna, oferta, wykłady, galeria itd. — pod-etapy 2–6), custom strona 404 (pod-etap 6).

## Decyzje podjęte w sesji planistycznej

- Źródło pozycji `SectionNav`/menu/stopki: jeden plik `src/navigation.ts` (konfiguracja per sekcja),
  nie propsy per strona — jedno miejsce prawdy dla architektury informacji.
- K-02: aktywna pozycja nawigacji przekazywana z serwera (prop `active` z segmentu trasy), nie
  `usePathname` — `Header`/`SectionNav` zostają Server Components, zgodnie z propsami z makiety.
  Rozwinięcie K-02 (rozstrzygnięte w Kawałku 3): `Header`/`Footer` **nie** trafiają do root
  `layout.tsx` — jeden wspólny layout nie może przekazać różnego `active` per trasa bez
  `usePathname`. Montują się w `PagePlaceholder` (i docelowo w layoutach/stronach realnej treści),
  każda strona jawnie podaje swój `active`. `layout.tsx` odpowiada tylko za `next/font`+`lang`.
- Obrazy z makiet: kopia 1:1 `design/assets/{icons,photos}` → `public/media/sample/`, bez zmiany
  nazw — przygotowanie pod pod-etap 2+, w tym pod-etapie nieużywane w UI.
- Menu główne (desktop): płaska lista 6 linków, bez dropdownu — drugi poziom wyłącznie przez
  `SectionNav` na stronach sekcji (zgodnie z makietą i brief-claude-code.md §3).
- Menu mobilne: implementujemy **pełną makietę** („Menu mobilne — 390 px”), nie uproszczony stub z
  `Header.jsx`. Akordeon dla sekcji z podpozycjami (Warsztaty, Wykłady, Ikony — osobny
  przycisk-chevron z `aria-expanded`, nagłówek sekcji zawsze też linkiem do huba), płaskie linki dla
  sekcji bez podpozycji (O Akademii, Wydarzenia, Kontakt), blok CTA na dole szuflady (przycisk
  główny „Zapisy na warsztaty”, przycisk drugorzędny „Kontakt · 601 734 705”, linia
  „Aktualności · Publikacje · Blog”).
- Struktura katalogów: `src/app/` (przeniesione z `app/`), alias `@/* → ./src/*` w `tsconfig.json`
  — ustalone poza tą sesją, zweryfikowane jako spójne. `src/content/types.ts` → `@/content/types`,
  `src/i18n/pl.ts` → `@/i18n/pl`.
- Trasy-zaślepki: wspólny komponent `PagePlaceholder` (Header + SectionNav-lub-Breadcrumb-lub-nic +
  H1 z `src/navigation.ts` + tekst „Treść w przygotowaniu” z `pl.ts` + Footer). Zakres ograniczony do
  tras **statycznych** linkowanych z Header/SectionNav/stopki; dynamiczne `[slug]`
  (`/ikony/[slug]`, `/aktualnosci/[slug]`) i custom 404 poza zakresem tego pod-etapu.
- Nazwy plików planu i inne nazwy plików/branchy: po angielsku (`01-skeleton.md`,
  `feat/01-skeleton`) mimo że treść dokumentów jest po polsku — rozszerzenie decyzji K-11 z kodu na
  nazwy plików.

**Rozbieżność zgłoszona, rozstrzygnięta hierarchią dokumentów z CLAUDE.md (nie własną decyzją):**
etykiety `SectionNav` dla Wykładów różnią się między brief-claude-code.md §3
(„Bieżący sezon · Archiwum · Wykładowcy”) a makietą (`SectionNav.prompt.md`, `navigation.card.html`:
„Wykłady · Archiwum · Wykładowcy”). Wg hierarchii „CLAUDE.md > plan pod-etapu > brief-claude-code.md
> brief-full.md > makieta” brief wygrywa → używamy „Bieżący sezon” jako pierwszej pozycji.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
|---|---|---|
| `src/app/globals.css` | zmiana | Tokeny z `design/tokens/*.css` jako `@theme`/CSS vars, fonty, focus-visible, `prefers-reduced-motion`, usunięcie domyślnych tokenów Geist |
| `src/app/layout.tsx` | zmiana | `next/font` (EB Garamond, IBM Plex Sans; `latin`+`latin-ext`), `lang="pl"` — bez `Header`/`Footer` (patrz `PagePlaceholder` niżej i „Decyzje” — K-02 wymaga `active` per trasa, root layout nie może tego dać bez `usePathname`) |
| `src/i18n/pl.ts` | nowy | Stringi UI: aria-labele menu/akordeonu, „Treść w przygotowaniu”, CTA w szufladzie mobilnej |
| `src/navigation.ts` | nowy | Menu główne (6 pozycji), `SectionNav` per sekcja (dosłownie z brief §3), mapa stopki |
| `src/content/types.ts` | nowy | Kopia typów z brief §4, bez zmian nazw pól |
| `src/content/settings.ts` | nowy | `getSiteSettings()` — czyta `content/settings.json` |
| `content/settings.json` | nowy (częściowo sample) | Fakty z brief §8 (prawdziwe) + `upcoming` jako sample |
| `src/components/core/Button.tsx` | nowy | Prymityw CTA (primary/secondary), potrzebny w szufladzie mobilnej |
| `src/components/navigation/Header.tsx` | nowy | Server Component: logo + podtytuł, menu desktop, wrapper mobile |
| `src/components/navigation/HeaderMobileMenu.tsx` | nowy, Client | Toggle szuflady, akordeon sekcji, stan otwarcia |
| `src/components/navigation/Footer.tsx` | nowy | Mapa strony z `src/navigation.ts` + kontakty z `SiteSettings` |
| `src/components/navigation/SectionNav.tsx` | nowy | Listwa drugiego poziomu |
| `src/components/navigation/Breadcrumb.tsx` | nowy | Tylko pod wpis aktualności (podłączony dopiero w pod-etapie 6) |
| `src/components/PagePlaceholder.tsx` | nowy | Wspólny szkielet trasy-zaślepki: montuje `Header active={...}` + `Footer` + `SectionNav`-lub-`Breadcrumb`-lub-nic + H1 — jedyne miejsce, gdzie `Header`/`Footer` się renderują (patrz „Decyzje” — K-02) |
| `src/app/**/page.tsx` (~13 tras statycznych) | nowe | Trasy z brief §3 na `PagePlaceholder` |
| `public/media/sample/**` | nowe | Kopia `design/assets/{icons,photos}` |

## Kawałki

### Kawałek 1 — Tokeny, fonty, layout, `pl.ts`, `Button`
Zakres: `globals.css` (tokeny, fonty, focus-visible, `prefers-reduced-motion`), `layout.tsx`
(`next/font`, `lang="pl"`), `src/i18n/pl.ts` (pierwszy zestaw stringów), `src/components/core/Button.tsx`.
Kryterium „gotowe”: `npm run build`/`npm run lint` przechodzą; strona główna (stub) renderuje się
nowymi fontami/tokenami; fokus widoczny (2px `#e8c765`, odstęp 2px) na linku testowym; brak `#8d7d69`
i 13px w nowym kodzie.

### Kawałek 2 — Warstwa treści i nawigacji
Zakres: `src/content/types.ts`, `src/content/settings.ts`, `content/settings.json`, `src/navigation.ts`.
Kryterium „gotowe”: typecheck/build przechodzą; brak jeszcze UI do obejrzenia — recenzja kodowa
(zgodność `types.ts` z brief §4, fakty z brief §8 wpisane dosłownie).

### Kawałek 3 — `Header` (desktop + akordeon mobilny + CTA)
Zakres: `Header.tsx`, `HeaderMobileMenu.tsx`; czyta `src/navigation.ts` i `SiteSettings`.
Kryterium „gotowe”: obejrzane na 390px i desktopie; klawiatura (Tab/Enter/Space na hamburgerze i
chevronach sekcji, `aria-expanded` poprawnie się przełącza); fokus widoczny;
`prefers-reduced-motion` respektowany, jeśli rozwijanie ma animację.

### Kawałek 4 — `Footer`, `Breadcrumb`, `SectionNav`, trasy-zaślepki
Zakres: `Footer.tsx` (mapa strony z `src/navigation.ts` + kontakty z `SiteSettings`),
`SectionNav.tsx`, `Breadcrumb.tsx`, `PagePlaceholder.tsx`, 15 `page.tsx` tras statycznych z brief §3
(strona główna + 14 — poprawione z pierwotnego szacunku „~13”, patrz „Odstępstwa”).
Kryterium „gotowe”: każda statyczna trasa z brief §3 (poza `[slug]` i 404) renderuje
Header+Footer+H1; żaden link z Header/SectionNav/stopki nie daje 404; `npm run build`/`npm run lint`
przechodzą.

## Dane sample dodawane w tym pod-etapie

| Treść | Gdzie (plik `sample`) | Zastąpić czym |
|---|---|---|
| `upcoming` w `SiteSettings` (2 przykładowe wpisy „Najbliższe”) | `content/settings.json` (pole `upcoming`) | prawdziwa treść „Najbliższe” w pod-etapie 2 |
| Zdjęcia z makiet (kopia `design/assets/icons`, `design/assets/photos`) | `public/media/sample/` | oryginały z migracji WP lub nowa sesja zdjęciowa |

*(Reszta `content/settings.json` — nazwa, adres, maile, telefon, linki ekosystemu — to fakty prawdziwe
z brief §8, nie dane `sample`.)*

Do przepisania do `docs/plan-claude-code.md` §5 po zamknięciu pod-etapu.

## Kryteria ukończenia pod-etapu

- [x] każda statyczna trasa z brief §3 istnieje i renderuje layout z nagłówkiem i stopką (dynamiczne
      `[slug]` i custom 404 poza zakresem — patrz decyzje); zweryfikowane: 15/15 tras zwraca 200,
      `Header`+`Footer`+H1 obecne w SSR-HTML.
- [x] `SectionNav` i menu mobilne działają na 390 px, nawigacja klawiaturą z widocznym fokusem —
      zweryfikowane tylko przez SSR-HTML/CSS (klasy, `aria-expanded`/`aria-current` poprawne w
      znacznikach), **nie** klikane/mierzone w realnej przeglądarce w tej sesji; użytkownik
      zaakceptował checkpointy 3 i 4 mimo tego zastrzeżenia (2026-09-12).
- [x] brak `#8d7d69` i brak 13 px w kodzie (`grep -rn "8d7d69\|13px" src/`).
- [x] `types.ts` zgodny z brief §4; `SiteSettings` używana przez `Header`/`Footer` (nie przez
      `layout.tsx` — patrz rozwinięcie K-02 w „Decyzje”, ten zapis kryterium jest z tego samego
      pierwotnego założenia co poprawiony wiersz `layout.tsx` w „Pliki i komponenty”).

## Ryzyka i pytania otwarte

- Rozbieżność etykiet `SectionNav` dla Wykładów (brief vs. makieta) — rozstrzygnięta hierarchią
  dokumentów, patrz „Decyzje” wyżej; tylko do odnotowania, nie wymaga dalszej decyzji.
- Zakres tras-zaślepek celowo nie obejmuje tras dynamicznych `[slug]` (brak jeszcze slugów do
  wylinkowania) ani custom 404 (jawnie pod-etap 6) — jeśli to założenie okaże się błędne w trakcie
  implementacji, przerwać i zgłosić przed kontynuacją.

## Odstępstwa od planu / makiety (z checkpointów)

Kawałek 1:
- `Button`, wariant `lg`: użyty istniejący token `--size-body-lg` (17,5px) zamiast literalnej
  wartości 17px z `design/components/core/Button.jsx` — rozbieżność między makietą (Button.jsx) a
  tabelą skali w `design/README` (17,5px); zaakceptowane przez użytkownika (17,5px).
- `Button`: fokus/hover zrealizowany klasami Tailwind (`hover:`, `aria-disabled:`) zamiast
  `React.useState` z prototypu `Button.jsx` — ten sam efekt wizualny, zero JS, komponent zostaje
  Server Component. Prop `style` (CSSProperties) z `Button.d.ts` zamieniony na `className`.
- `globals.css`: pełny zestaw tokenów skopiowany do `:root`, ale `@theme inline` mapuje na klasy
  Tailwind tylko te tokeny, których już używa kod tego pod-etapu (kolory w całości; rozmiary
  typografii i spacing dobierane wg potrzeby, reszta skali dopisywana w kawałkach, które jej
  faktycznie użyją — Header/Footer/itd.).

Kawałek 2:
- `src/navigation.ts`, `sectionNav.wydarzenia`: pięć pozycji z brief §3; kategorie jako query string
  `?kategoria=` (wartości `Event.category`), bez tras `/wydarzenia/*` — uzupełnione po decyzji
  w sesji dokumentacyjnej 2026-09-12.
- `content/settings.json`: brief §8 podaje gołe domeny/identyfikatory (`www.ikonadzis.org`,
  `studiumikony.blogspot.com`, `facebook.com/akademiaikony`, `@akademiaikony3822`) — dodany schemat
  `https://` i skonstruowany kanoniczny URL YouTube; to normalizacja formatu pod typ `string` (URL),
  nie zmiana treści faktu.
- `content/settings.json`, etykiety grup e-maili („Warsztaty i ikony”, „Wykłady i sekretariat”) —
  wzięte z `Footer.jsx` (makieta), nie z dosłownego brzmienia brief §8 („Kontakt ogólny/warsztaty/
  ikony”) — etykiety strukturalne UI, nie fakt do cytowania dosłownie.

Kawałek 3:
- **Rozstrzygnięte:** plik planu pierwotnie mówił „Header/Footer w layoucie” (root `layout.tsx`),
  co kolidowało z K-02 („active z segmentu trasy, nie usePathname”) — jeden wspólny root layout nie
  może dać różnego `active` per trasa bez `usePathname`. Zaktualizowałem plan (tabela „Pliki i
  komponenty” + rozwinięcie K-02 w „Decyzje”): `Header`/`Footer` montują się w `PagePlaceholder`
  (Kawałek 4) i docelowo w stronach/layoutach realnej treści, każda strona jawnie podaje `active`;
  `layout.tsx` zostaje przy samym `next/font`+`lang` (bez zmian w już zrobionym Kawałku 1).
- `Header`/`HeaderMobileMenu` tymczasowo zamontowane w stubie `src/app/page.tsx`
  (`<Header active="Wykłady" />`) wyłącznie do wizualnej weryfikacji tego kawałka — do usunięcia/
  zastąpienia właściwym mechanizmem w Kawałku 4.
- Dodane nowe tokeny wprost z zatwierdzonych wartości makiety (nie wymyślone): `--spacing-menu-indent`
  (36px, wcięcie podpozycji akordeonu), `--spacing-link-underline-gap` (2px, odstęp podkreślenia
  aktywnego linku), `--text-size-logo`/`--text-size-logo-subtitle`/`--text-size-logo-m` (23/14/18px,
  logo — element marki poza ogólną skalą typografii), `tracking-logo`/`tracking-logo-footer` jako
  klasy Tailwind (wartości już były w `:root` z Kawałka 1).
  Kilka wartości z makiety zaokrąglone do najbliższego istniejącego tokenu zamiast tworzenia kolejnych
  jednorazowych (różnice ≤4px): padding wiersza nagłówka mobilnego, padding bloku CTA w szufladzie,
  odstęp między przyciskami CTA.
- Pominięty `letter-spacing: .02em` podtytułu logo z `Header.jsx` — nie jest tokenem w
  `design/README`/`typography.css`, różnica ledwo zauważalna; pominięte zamiast tworzyć nowy token.
- Linia „Aktualności · Publikacje · Blog” w szufladzie mobilnej zrealizowana jako trzy działające
  linki (`/aktualnosci`, `/publikacje`, `blogUrl` zewnętrznie) — w samej makiecie to statyczny tekst
  bez linków; wybrałem linki, bo trasy są realne i nieklikalny tekst byłby regresem UX.
- Dwa CTA na dole szuflady zbudowane przez ponowne użycie `Button` (`block`, `size="lg"`) zamiast
  ręcznie stylowanych linków — akceptuje drobną różnicę względem literalnego zapisu makiety (18px
  jednolity padding/font vs. 17px/32px/17,5px z wariantu `lg` komponentu `Button`) w zamian za
  spójne użycie jednego komponentu CTA w całym serwisie.
- Etykiety `aria-label` chevronów akordeonu rozszerzone o nazwę sekcji („Rozwiń sekcję Warsztaty”
  zamiast samego „Rozwiń sekcję” z makiety) — żeby czytnik ekranu odróżniał trzy niezależne akordeony
  na tym samym ekranie.
- Wewnętrzna nawigacja przez `next/link` (nie `<a>`) poza linkiem zewnętrznym do bloga — nie było
  jawnie w planie, ale to standard Next.js App Router.
- **Weryfikacja UI:** w tej sesji (bez przeglądarki) sprawdzone tylko przez wygenerowane
  SSR-HTML i skompilowany CSS (klasy, `aria-expanded`/`aria-current` w znacznikach). Nie
  klikałem akordeonu ani nie mierzyłem 390px w realnej przeglądarce — do potwierdzenia przez
  użytkownika (`npm run dev`, DevTools 390px + Tab/Enter/Space) przed „OK”.

Kawałek 4:
- Dwie kolumny nawigacji w stopce (`Footer.jsx` ma dwa osobne, nieoznaczone `<nav>`) połączone w
  jeden `<nav aria-label="Mapa strony">` przez `display:contents`, żeby był jeden nazwany landmark
  zamiast dwóch bez etykiety — poprawka dostępności ponad literalny zapis makiety.
- Nowe tokeny wprost z `Footer.jsx`: `--grid-template-columns-footer` (`1.25fr 1fr 1fr 1fr`),
  `--spacing-footer-pt/pb/gap` (48/40/40px). Nagłówek „AKADEMIA IKONY” w stopce (spec: 19px) używa
  istniejącego `--size-lead` (19,5px) zamiast nowego tokenu — różnica 0,5px.
  Odstęp 12px między CTA w szufladzie (Kawałek 3) i inne drobne zaokrąglenia z poprzednich
  checkpointów pozostają bez zmian.
- `/wydarzenia` na razie bez podpiętego `SectionNav` w `PagePlaceholder` (hub nie zbudowany) —
  pięć pozycji jest już w `navigation.ts`; logika filtrów wejdzie w pod-etapie 6.
- Tytuły H1 tras-zaślepek sourced z `src/navigation.ts`: huby (Warsztaty/Wykłady/Ikony) — etykieta z
  `mainNav`; podstrony sekcji — etykieta z `sectionNav[sekcja]`; Aktualności/Publikacje — z
  `footerSitemap`; Polityka prywatności — z `footerLegalLink`. Wyjątek: strona główna (`/`) nie ma
  odpowiednika w `navigation.ts` (logo w `Header` nie jest linkiem/pozycją menu w makiecie) — użyty
  `pl.meta.orgShortName` zamiast wpisu z nawigacji.
- Faktyczna liczba tras statycznych: **15** (strona główna + 14), nie „~13” z planu — zaktualizowano
  nagłówek Kawałka 4 wyżej. Różnica to tylko niedoszacowanie w planie, nie zmiana zakresu.
- Stub Kawałka 1/3 w `src/app/page.tsx` (`Button`, `devStub` w `pl.ts`, tymczasowy `<Header
  active="Wykłady">`) usunięty — strona główna używa teraz `PagePlaceholder`, jak każda inna trasa.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
|---|---|---|
| 1 — Tokeny, fonty, layout, pl.ts, Button | gotowe | Pełny zestaw tokenów w `:root`, `@theme inline` mapuje tylko to, co zużywa ten kawałek (kolory w całości; rozmiary/spacing dobierane wg potrzeby). `Button` — fokus/hover przez CSS zamiast `useState` z makiety, prop `style`→`className`. Rozbieżność: `lg` używa `--size-body-lg` (17,5px) zamiast literalnych 17px z `Button.jsx` — zaakceptowane przez użytkownika. |
| 2 — Warstwa treści i nawigacji | gotowe | `types.ts` skopiowany bez zmian nazw pól. `sectionNav.wydarzenia`: pięć pozycji, filtry przez `?kategoria=` (decyzja 2026-09-12). |
| 3 — Header (desktop + mobile) | zatwierdzone (OK użytkownika) | Zob. „Odstępstwa” wyżej. Miejsce montażu `Header`/`Footer` rozstrzygnięte na `PagePlaceholder` (nie root layout) — plan zaktualizowany. Tymczasowe podpięcie w stubie strony głównej do usunięcia w Kawałku 4. Weryfikacja UI w tej sesji tylko przez SSR-HTML/CSS (bez przeglądarki) — użytkownik zaakceptował mimo to. |
| 4 — Footer, Breadcrumb, SectionNav, trasy-zaślepki | zatwierdzone (OK użytkownika) | 15 tras statycznych (nie ~13), wszystkie 200, brak 404 z linków Header/SectionNav/stopki. `Breadcrumb` zbudowany, niepodłączony (zgodnie z planem — dopiero pod-etap 06). Reszta — zob. „Odstępstwa”. |

**Pod-etap 01 zamknięty (OK użytkownika, 2026-09-12).**
