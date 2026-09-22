# Plan 03 — Strony ofertowe

Status: zamknięty 2026-09-17
Gałąź: feat/03-oferta
Makiety: `design/Akademia Ikony - kierunki wizualne.dc.html` — `#1a-oferta` (kurs desktop), `#3b` (kurs mobile), `#2a-warsztaty` (hub), `#3a-plener` (plener, stan zamknięty), `#2a-zamowienie` (ikony na zamówienie); wzór FactsBox wykładów: `#2a-wyklady` (strona `/wyklady` w etapie 4)

## Cel i zakres

Jeden szablon strony ofertowej (`OfferPage`) obsługujący cztery `kind` z `OfferFacts`; hub `/warsztaty` z `OfferCard`; komponenty `FactsBox` (oba stany naboru), `SemesterProgram`, `StepList`. Treść wyłącznie z `content/offers/*.mdx` przez warstwę `src/content/offers.ts`; renderer MDX (`@next/mdx`). W zakresie: `/warsztaty`, `/warsztaty/kurs-roczny-i-trzyletni`, `/warsztaty/letnia-szkola-swiatla`, `/ikony/na-zamowienie` oraz plik `content/offers/wyklady.mdx` pod gotowy szablon (trasa `/wyklady` nadal placeholder do etapu 4). Poza zakresem: pełna strona `/wyklady`, analityka (K-15, etap 10), JSON-LD `Course` (etap 10).

## Decyzje podjęte w sesji planistycznej

- **K-03:** `@next/mdx` + `@mdx-js/react` — oficjalna integracja Next.js App Router; mapa tagów i komponentów MDX w `mdx-components.tsx` (`useMDXComponents`), rozszerzana w etapach 4–6; body renderowane w `OfferPage` (wrapper `offer-mdx`).
- **Program 6 semestrów (kurs):** komponent `<SemesterProgram />` w body MDX + tablica `semesters: { title, body }[]` w frontmatter pliku kursu — **bez zmiany `types.ts`**; frontmatter parsowany w `src/content/offers.ts`.
- **FactsBox — UI vs dane:** etykiety wierszy (`Kiedy`, `Gdzie`, …) i teksty CTA per `kind × enrollmentOpen` w `pl.ts` (`factsBox`); wartości wierszy z pól `OfferFacts` w MDX; komponent buduje listę wierszy z dostępnych pól (nie każde pole na każdej ofercie).
- **FactsBox — telefon:** drugi przycisk `tel:+48601734705` tylko na mobile (≤390px); na desktop linia „lub 601 734 705” pod CTA mailto (wg makiety kursu `#1a-oferta` / `#3b`).
- **Tematy `mailto:`:** dosłownie z brief §7 / `design/README` §5 — bez parafraz; email z `OfferFacts.enrollmentEmail`.
- **Cytaty na stronach ofertowych:** osobne komponenty (`OfferQuote`, `OfferQuoteGrid`) — **nie** rozszerzamy `Testimonial.tsx` ze strony głównej (K-14); układy różnią się między kurs / plener / hub.
- **Plener domyślnie:** `enrollmentOpen: false`; sekcja „Rytm dnia” w `plener.mdx` oznaczona `sample`, do potwierdzenia EJK (plan §5).
- **`zamowienie.mdx`:** `facts.leadTime` puste — nie zgadywać (brief §8).
- **Nota prawna:** pełne zdanie z brief §8, z wielkiej litery: „Nauczanie w Akademii Ikony nie niesie za sobą żadnych skutków formalnych.” — w sekcji „Jak się zapisać”, w `pl.ts` jako stały string UI (implementacja w kawałku 2).
- **`StepList` (zamówienie):** 3 kroki (Rozmowa · Zaliczka · Realizacja) wg makiety `#2a-zamowienie` — nie 5; liczba kroków z treści `zamowienie.mdx`, komponent bez sztywnego limitu.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| --- | --- | --- |
| `next.config.ts` / `mdx-components.tsx` | zmiana / nowy | Konfiguracja `@next/mdx`; mapa tagów MDX (h2, p, img→next/image, `OfferFigure`, `SemesterProgram`, `StepList`) |
| `package.json` | zmiana | `@next/mdx`, `@mdx-js/react` (nowe zależności — K-03) |
| `src/content/offers.ts` | nowy | `getOffer(slug)`, `getOffers()` — frontmatter → `Offer`, body MDX |
| `src/components/content/FactsBox.tsx` | nowy | Blok „W skrócie”; stany `enrollmentOpen`; mailto/tel z `OfferFacts` + `pl.factsBox` |
| `src/components/content/OfferCard.tsx` | nowy | Kafel na hubie warsztatów |
| `src/components/content/OfferPage.tsx` | nowy | Szablon: Header, SectionNav, H1+lead, FactsBox (layout desktop/mobile), render body MDX (`offer-mdx` + `OfferContentProvider`), „Jak się zapisać”, slot cytatu |
| `src/components/content/SemesterProgram.tsx` | nowy | Siatka I–VI; dane z frontmatter via props/context |
| `src/components/content/StepList.tsx` | nowy | 3 kroki zamówienia (Rozmowa · Zaliczka · Realizacja); wg makiety `#2a-zamowienie` |
| `src/components/offers/OfferQuote.tsx` | nowy | Cytat kursu (karta + opcjonalne zdjęcie) — inny układ niż home `Testimonial` |
| `src/components/offers/OfferQuoteGrid.tsx` | nowy | Siatka cytatów (hub warsztaty, plener) |
| `src/app/warsztaty/page.tsx` | zmiana | Hub: lead, 2× `OfferCard`, sekcja cytatów |
| `src/app/warsztaty/kurs-roczny-i-trzyletni/page.tsx` | zmiana | `OfferPage` + `getOffer` |
| `src/app/warsztaty/letnia-szkola-swiatla/page.tsx` | zmiana | `OfferPage` + `getOffer` |
| `src/app/ikony/na-zamowienie/page.tsx` | zmiana | `OfferPage` + `StepList` + przykłady realizacji |
| `content/offers/kurs-roczny-i-trzyletni.mdx` | nowy, `sample` | `kind: kurs`, `enrollmentOpen: true`, facts z brief §8, `semesters` ×6 placeholder |
| `content/offers/plener.mdx` | nowy, `sample` | `kind: plener`, `enrollmentOpen: false`, „Rytm dnia” sample |
| `content/offers/zamowienie.mdx` | nowy, `sample` | `kind: zamowienie`, puste `leadTime`, kroki w MDX / frontmatter |
| `content/offers/wyklady.mdx` | nowy, `sample` | `kind: wyklady` — weryfikacja szablonu; strona `/wyklady` w etapie 4 |
| `content/testimonials.json` | nowy, `sample` | Cytaty uczestników z makiet (placeholder do migracji WP) |
| `src/i18n/pl.ts` | zmiana | Sekcja `factsBox`, etykiety sekcji ofertowych, nagłówki hubu |
| `src/app/globals.css` | zmiana | Tokeny layoutu ofertowego, FactsBox, OfferCard, SemesterProgram, StepList |
| `public/media/sample/photos/*`, `icons/*` | nowe (kopie) | Sloty z `design/uploads/` per makieta (patrz `docs/design-mockup-guide.md`) |

## Kawałki

### Kawałek 1 — MDX + `FactsBox` + szablon `Offer` + hub `/warsztaty`

Zakres: instalacja i konfiguracja `@next/mdx`; `mdx-components.tsx`; `src/content/offers.ts`; `FactsBox`, `OfferPage`, `OfferCard`; hub `/warsztaty` (2 kafle + `OfferQuoteGrid` z `content/testimonials.json`); `pl.factsBox`; minimalny `content/offers/wyklady.mdx` do weryfikacji szablonu (obu stanów FactsBox — np. tymczasowe podpięcie lub strona testowa w ramach implementacji, bez publicznej trasy `/wyklady`).

Kryterium „gotowe”: `/warsztaty` renderuje hub zgodnie z `#2a-warsztaty`; szablon ofertowy i `FactsBox` (open + closed) da się obejrzeć; tematy `mailto:` zgodne z brief §7; `npm run build` + `npm run lint` przechodzą; mobile 390px + desktop.

### Kawałek 2 — Kurs + plener

Zakres: `SemesterProgram`; `OfferQuote`; pełne pliki `kurs-roczny-i-trzyletni.mdx` i `plener.mdx`; trasy kursu i pleneru; kopie mediów z `design/uploads/`; sekcja „Jak się zapisać” + nota prawna §8; cytat(y) wg makiety.

Kryterium „gotowe”: obie strony zgodne z `#1a-oferta` / `#3b` i `#3a-plener`; program 6 semestrów; plener w stanie zamkniętym (`enrollmentOpen: false`); build/lint OK; klawiatura + fokus na CTA mailto/tel.

### Kawałek 3 — `/ikony/na-zamowienie` + `StepList`

Zakres: `StepList`; `zamowienie.mdx`; sekcja „Przykłady realizacji” (4 ikony — reuse `content/icons.json` + ewentualnie `deesis` z uploads); nota „Gotowe ikony — zapytaj mailem”; link do `/ikony`.

Kryterium „gotowe”: strona zgodna z `#2a-zamowienie`; `StepList` z numeracją typograficzną (nie odznaki); puste `leadTime`; DoD etapu spełnione; build/lint OK.

## Dane sample dodawane w tym etapie

- `content/offers/kurs-roczny-i-trzyletni.mdx` — `sample: true`; semestry placeholder → plan §5 (cytaty)
- `content/offers/plener.mdx` — `sample: true`; „Rytm dnia” → plan §5
- `content/offers/zamowienie.mdx` — `sample: true`; puste `leadTime` → plan §5
- `content/offers/wyklady.mdx` — `sample: true`; tylko pod szablon
- `content/testimonials.json` — cytaty uczestników (Adam, Hania, Iza, Emilia, Robert, Maciej, Artur…) → plan §5
- `public/media/sample/*` — nowe kopie per slot makiety → plan §5

## Kryteria ukończenia etapu

- [x] `FactsBox` renderuje oba stany z jednego komponentu, sterowane wyłącznie danymi (`enrollmentOpen` + `pl.factsBox`)
- [x] Tematy `mailto:` identyczne ze stringami z brief §7
- [x] Cztery pliki `content/offers/*.mdx` z `facts` zgodnymi z `OfferFacts`; `leadTime` puste w zamówieniu
- [x] `StepList` używa numeracji typograficznej; reszta strony nie
- [x] Brak tekstu redakcyjnego hardkodowanego w JSX (poza notą prawną §8 jeśli w `pl.ts`)
- [x] Zgodność z makietą na 390px i desktop dla hubu + trzech stron ofertowych

## Ryzyka i pytania otwarte

- Treść semestrów i cytatów — placeholdery do migracji WP / potwierdzenia EJK; nie wymyślać copy.
- „Rytm dnia” w plenerze — sample do decyzji EJK przed wdrożeniem (plan §5).
- Koszt kursu/pleneru w makiecie jako `[pole CMS]` — w sample: „Informacja mailem lub telefonicznie” lub puste `price`, bez zgadywania kwoty.
- Miejsce pleneru 2027 — placeholder w treści, nie fakt.
- Weryfikacja makiety: serwer lokalny na `design/` przed odczytem wymiarów (`docs/design-mockup-guide.md`).

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| ------- | ------ | ------------------- |
| 1 — MDX + FactsBox + szablon + hub | ✅ | Naprawa wizualna/copy vs makieta; SectionNav hub „Warsztaty”; `enrollmentStart`/`enrollmentRule` w `OfferFacts`. Refaktor shell: `SectionPageShell` → `PagePlaceholder`, `OfferPage`, hub `/warsztaty`; spacing ujednolicony (`py-space-6` na main, bez `pt-space-7`); `active` z `navigation.ts`; audyt tokenów/komponentów OK |
| 2 — Kurs + plener | ✅ | `SemesterProgram`, `OfferQuote`, pełne MDX kurs/plener, layout OfferPage (MDX full-width, enrollment+quote 2-col), media z uploads, nota prawna §8, `OfferQuoteGrid` 2-col na plenerze |
| 3 — Na zamówienie + StepList | ✅ | `StepList`, `zamowienie.mdx`, `/ikony/na-zamowienie`, `OrderExamples`, `ReadyIconsNote`, deesis w `icons.json`, media z uploads, `FactsBox` etykiety zamówienia + wiersz Kontakt |
| — cleanup po ewaluacji technicznej | ✅ | Usunięty pośredni `MdxContent.tsx` (render w `OfferPage`); mapa tagów pozostaje w `mdx-components.tsx`; martwe stringi `pl.ts`, redundantne tokeny CSS, `formatAttribution`, `.offer-step-grid` |
