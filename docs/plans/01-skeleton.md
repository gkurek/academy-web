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
(strona główna, oferta, wykłady, galeria itd. — pod-etapy 2–6), dropdown w menu głównym (patrz
decyzje niżej), custom strona 404 (pod-etap 6).

## Decyzje podjęte w sesji planistycznej

- K-01: Tailwind, tokeny jako zmienne w `globals.css` — decyzja sprzed sesji, potwierdzona.
- Źródło pozycji `SectionNav`/menu/stopki: jeden plik `src/navigation.ts` (konfiguracja per sekcja),
  nie propsy per strona — jedno miejsce prawdy dla architektury informacji.
- K-02: aktywna pozycja nawigacji przekazywana z serwera (prop `active` z segmentu trasy), nie
  `usePathname` — `Header`/`SectionNav` zostają Server Components, zgodnie z propsami z makiety.
- Obrazy z makiet: kopia 1:1 `design/assets/{icons,photos}` → `public/media/sample/`, bez zmiany
  nazw — przygotowanie pod pod-etap 2+, w tym pod-etapie nieużywane w UI.
- Dropdown w menu głównym (desktop): **nie budujemy**. Brief-claude-code.md §3 wspomina go jako
  opcjonalny, ale nic w `design/` (component code, prompt.md, ani makieta stanów interaktywnych) go
  nie pokazuje — menu to płaskie 6 linków, drugi poziom wyłącznie przez `SectionNav` na hubie.
  Odstępstwo od brief §3 na korzyść makiety.
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
| `src/app/layout.tsx` | zmiana | `next/font` (EB Garamond, IBM Plex Sans; `latin`+`latin-ext`), `lang="pl"`, `Header`/`Footer` w layoucie |
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
| `src/components/PagePlaceholder.tsx` | nowy | Wspólny szkielet trasy-zaślepki |
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
`SectionNav.tsx`, `Breadcrumb.tsx`, `PagePlaceholder.tsx`, ~13 `page.tsx` tras statycznych z brief §3.
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

- [ ] każda statyczna trasa z brief §3 istnieje i renderuje layout z nagłówkiem i stopką (dynamiczne
      `[slug]` i custom 404 poza zakresem — patrz decyzje);
- [ ] `SectionNav` i menu mobilne działają na 390 px, nawigacja klawiaturą z widocznym fokusem;
- [ ] brak `#8d7d69` i brak 13 px w kodzie (`grep -rn "8d7d69\|13px" src/`);
- [ ] `types.ts` zgodny z brief §4, warstwa `src/content/*` używana przez layout (`SiteSettings`).

## Ryzyka i pytania otwarte

- Rozbieżność etykiet `SectionNav` dla Wykładów (brief vs. makieta) — rozstrzygnięta hierarchią
  dokumentów, patrz „Decyzje” wyżej; tylko do odnotowania, nie wymaga dalszej decyzji.
- Zakres tras-zaślepek celowo nie obejmuje tras dynamicznych `[slug]` (brak jeszcze slugów do
  wylinkowania) ani custom 404 (jawnie pod-etap 6) — jeśli to założenie okaże się błędne w trakcie
  implementacji, przerwać i zgłosić przed kontynuacją.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
|---|---|---|
| 1 — Tokeny, fonty, layout, pl.ts, Button | nie zaczęty | — |
| 2 — Warstwa treści i nawigacji | nie zaczęty | — |
| 3 — Header (desktop + mobile) | nie zaczęty | — |
| 4 — Footer, Breadcrumb, SectionNav, trasy-zaślepki | nie zaczęty | — |
