# Plan 02 — Strona główna

Status: zatwierdzony 2026-09-12
Gałąź: feat/02-homepage
Makiety: design/Akademia Ikony - kierunki wizualne.dc.html — #1a (desktop, linie 1695–1820), #3b (mobile, linie 480–590)

## Cel i zakres

Pierwsza pełna strona serwisu — strona główna. Ustala rytm sekcji i wzorzec czytania treści z `content/` przez `src/content/*`. W zakresie: Hero, sekcja „Najbliższe” (SiteSettings.upcoming), trzy filary, Testimonial (cytat EJK), „Wybrane ikony” (IconGrid, 4 wpisy sample). Poza zakresem (świadomie, po weryfikacji z makietą — patrz K-13): MapBlock i sekcja kontakt na stronie głównej — te trafiają do pod-etapu 6 (/kontakt). Poza zakresem też: analityka/zdarzenia (K-15, pod-etap 7), Lightbox i /ikony/[slug] (pod-etap 5).

## Decyzje podjęte w sesji planistycznej

- K-13: Homepage bez MapBlock/kontaktu — rozbieżność opis pod-etapu vs makieta rozstrzygnięta na korzyść makiety; kontakt zostaje w stopce.
- K-14: Testimonial to jedna sekcja (cytat + podpis EJK), bez portretu/bio/linku, identyczna na desktop i mobile — uproszczenie względem wariantu mobile makiety i względem `Testimonial.prompt.md`.
- K-15: Brak atrybutów/zdarzeń analitycznych w pod-etapie 2 — całość do pod-etapu 7.
- Tytuły sample w `content/icons.json`: nazwy kanoniczne z podpisów makiety (Matka Boża Znaku, Przemienienie, Mandylion, Św. Antoni), autor „ejk” poza Św. Antonim („student”).
- Sekcje „Najbliższe” i „trzy filary” nie mają nazw w design/README — lokalne komponenty (`UpcomingHighlights`, `Pillars`), nazwy angielskie.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| --- | --- | --- |
| `src/app/page.tsx` | zmiana | Rzeczywista treść strony głównej zamiast `PagePlaceholder`; montuje `Header`/`Footer` bezpośrednio (K-02 z pod-etapu 1) |
| `src/components/content/Hero.tsx` | nowy | Wg `design/components/content/Hero.jsx` — H1+lead+obraz+dwa CTA jako children |
| `src/components/home/UpcomingHighlights.tsx` | nowy | Sekcja „Najbliższe” — 3 kafle z `SiteSettings.upcoming` |
| `src/components/home/Pillars.tsx` | nowy | Sekcja „trzy filary” (Warsztaty/Wykłady/Ikony) |
| `src/components/content/Testimonial.tsx` | nowy | Cytat EJK — `quote`+`author` wg K-14 |
| `src/components/gallery/IconGrid.tsx` | nowy | Siatka „Wybrane ikony” — 4 kolumny, height≈280–290px, bez interakcji |
| `src/content/icons.ts` | nowy | Warstwa odczytu: `getIconWorks()` z `content/icons.json` |
| `content/icons.json` | nowy, `sample` | 4 wpisy `IconWork` |
| `content/settings.json` | zmiana | `upcoming`: realna treść zamiast 2 placeholderów `[przykład]` |
| `public/media/sample/icons/*`, `public/media/sample/photos/*` | nowe (kopie) | Kopia 1:1 `design/assets/{icons,photos}` — zaległość z pod-etapu 1 |
| `src/i18n/pl.ts` | zmiana | Dopisanie sekcji `home` (nagłówki sekcji, aria-labels) |

## Kawałki

### Kawałek 1 — Hero + Najbliższe + trzy filary

Zakres: `src/app/page.tsx`, `Hero.tsx`, `UpcomingHighlights.tsx`, `Pillars.tsx`, rozszerzenie `pl.ts`, aktualizacja `content/settings.json` (`upcoming`) treścią z makiety (weryfikacja dat/tytułów względem brief §8 tam, gdzie to możliwe — bez zgadywania niepotwierdzonych faktów).
Kryterium „gotowe”: `/` renderuje się z `Header`+`Footer`, trzy sekcje zgodne z makietą na 390px i desktop, `npm run build`+`npm run lint` przechodzą.

### Kawałek 2 — Testimonial + Wybrane ikony + dane sample

Zakres: kopiowanie `design/assets/{icons,photos}` → `public/media/sample/`, `content/icons.json` (4 wpisy), `src/content/icons.ts`, `Testimonial.tsx` (K-14), `IconGrid.tsx` osadzony pod filarami.
Kryterium „gotowe”: sekcje renderują się z realnych plików w `public/media/sample` przez `next/image` z podanymi wymiarami, build/lint OK, obejrzane na 390px i desktop.

### Kawałek 3 — Dopracowanie mobile i finalizacja

Zakres: pełny przegląd strony na 390px (wysokość hero ~60% ekranu, odstępy wg skali z `design/README`), nawigacja klawiaturą po wszystkich linkach/CTA z widocznym fokusem, uzupełnienie brakujących stringów `pl.ts`, weryfikacja braku tekstu redakcyjnego w JSX.
Kryterium „gotowe”: DoD pod-etapu spełnione w całości, build/lint OK.

## Dane sample dodawane w tym pod-etapie

- `content/icons.json` — 4 wpisy `IconWork`: Matka Boża Znaku (40×30 cm, ejk), Przemienienie (60×45 cm, ejk), Mandylion (35×28 cm, ejk), Św. Antoni (autor: student, wymiary niepodane) → do `docs/plan-claude-code.md` §5.
- `public/media/sample/icons/*`, `public/media/sample/photos/*` — kopie 1:1 z `design/assets/` (uzupełnienie zaległości z pod-etapu 1) → do §5.
- `content/settings.json` (`upcoming`) — zamiana placeholderów na treść z makiety → już wpisane w §5 z pod-etapu 1, tu odhaczyć.

## Kryteria ukończenia pod-etapu

- [ ] zgodność z makietą desktop i mobile (bez MapBlock/kontaktu — K-13; Testimonial bez portretu — K-14)
- [ ] wszystkie treści z `content/` lub `pl.ts`; brak tekstu redakcyjnego w JSX
- [ ] CTA „Warsztaty”/„Wykłady” prowadzą do `/warsztaty` i `/wyklady`
- [ ] Lighthouse mobile na tej stronie: dostępność ≥ 95

## Ryzyka i pytania otwarte

- Wysokość obrazu Hero na mobile nie jest jawnie zakodowana w makiecie (placeholder `{{ heroStyleMobile }}`) — wartość dobrana samodzielnie w kawałku 1, do zgłoszenia w checkpoincie.
- Treść „Najbliższe” z makiety (data/tytuł wykładu inauguracyjnego) może nie być w pełni potwierdzona w brief §8 — jeśli nie, zostawić placeholder zamiast zgadywać, zgodnie z zasadą z `CLAUDE.md`.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| --- | --- | --- |
