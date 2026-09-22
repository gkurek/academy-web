# Plan 06 — Strony o akademii i pracownia

Status: zamknięty 2026-09-21 (4/4 kawałki, merge PR #7)
Gałąź: feat/06-about
Makiety: `design/Akademia Ikony - O Akademii i Pracownia.dc.html` — ekrany 6a–6i; handoff: `design/README-o-akademii-pracownia.md`. Copy: `docs/copy-o-akademii-pracownia.md` (sloty 1:1 z `data-slot` w makiecie).

## Cel i zakres

Wspólny szablon strony tekstowej z `TocSidebar` (desktop, sticky — 6i) i `TocCollapse` (mobile — 6h/6d) oraz dwie treściowe strony: `/o-akademii` i `/pracownia`. Treść wyłącznie z `content/` (JSON + MDX); copy z `docs/copy-o-akademii-pracownia.md` — **bez loremu z makiet** (lorem zostaje tylko w `.dc.html` jako referencja layoutu). `SectionNav` dla pary O Akademii · Pracownia (K-48). Poza zakresem: aktualności (etap 7), kontakt, wydarzenia, publikacje, polityka, 404 (etap 8); migracja WP (etap 9) — te strony to nowa treść redakcyjna, nie import z WP.

## Decyzje podjęte w sesji planistycznej

- **K-48:** `SectionNav` na `/o-akademii` i `/pracownia` — **O Akademii · Pracownia**, jak makieta 6a–6d; rozszerzenie `SectionKey` i `sectionNav` w `navigation.ts` (brief §3 uzupełniony).
- **D-06-01:** Copy z `docs/copy-o-akademii-pracownia.md` **od razu** w kawałkach 2–4; lorem z makiet nigdy nie trafia do `content/`.
- **D-06-02:** Link do strony autorskiej EJK (OA-38) — **wariant 6e**, bez linku na v1 (`PersonProfile.link` opcjonalny).
- **D-06-03:** `TocSidebar` / `TocCollapse` — **jawny `toc[]`** w danych strony (nie parser MDX); wymagane dla podpozycji rozmowy (PR-25 jako H3 w spisie).
- **D-06-04:** Rozmowa (`Interview`) — **wdrażamy teraz** z copy doc (14 wymian); redakcja do weryfikacji EJK → wpis w plan §5.
- **D-06-05:** Wybrane realizacje (OA-37) — **6 wierszy z widocznymi** `[do uzupełnienia: …]` do czasu danych od klientki.
- **D-06-06:** Struktura treści — **JSON + MDX** (`content/pages/*.json` + `*.mdx`); rozmowa w JSON (lub osobny plik, jeśli rozmiar wymusi).
- **D-06-07:** **4 kawałki** (zamiast 3 z master planu) — więcej nowych komponentów niż typowa strona tekstowa.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| ---- | ----------- | ---------------- |
| `src/navigation.ts` | zmiana | `SectionKey` + `sectionNav["o-akademii"]`: O Akademii · Pracownia |
| `src/content/types.ts` | zmiana | Typy additive: `TocItem`, `MissionDeclaration`, `ActivityItem`, `MilestoneItem`, `PersonProfileData`, `Interview`, `LearningFormRow`, `TextPageData` (bez zmiany istniejących pól `Page`) |
| `src/content/pages.ts` | nowy | `getTextPage(slug)` — łączy JSON + MDX |
| `content/pages/o-akademii.json` | nowy | Metadane, `toc[]`, hero, misja, milestones, activity, person, quote, footer links |
| `content/pages/o-akademii.mdx` | nowy | Akapity płaskie (Dla kogo, Historia, Pracownia i miejsce, fundacja…) |
| `content/pages/pracownia.json` | nowy | `toc[]`, formy nauki, `interview`, `photos[]` |
| `content/pages/pracownia.mdx` | nowy | Lead + akapity „Czego się uczymy" |
| `public/media/workshop/*` | nowe | Kopie z `design/uploads/` (hero, galeria 12, pas OA-73/74); `ejk-portret.jpg` z `design/assets/photos/` |
| `src/components/text/TextPageShell.tsx` | nowy | Breadcrumb, `SectionNav`, H1, lead, layout kolumna nagłówków 280 px + treść + `TocSidebar` |
| `src/components/text/TocSidebar.tsx` | nowy | Desktop: sticky, aktywna pozycja + podpozycje (6i) |
| `src/components/text/TocCollapse.tsx` | nowy, Client | Mobile: `<details>` nad treścią (6h) |
| `src/components/text/MissionDeclarations.tsx` | nowy | OA-11…14: zdanie wyróżnione + dopowiedzenie |
| `src/components/text/PersonProfile.tsx` | nowy | Portret, bio, realizacje; `link?` opcjonalny (6e domyślnie) |
| `src/components/text/MilestoneRow.tsx` | nowy | Fakty historii (2010, 2012, 15) |
| `src/components/text/ActivityList.tsx` | nowy | OA-62, 5 pozycji |
| `src/components/text/Interview.tsx` | nowy | Rozmowa ML/EJK; `*…*` → `<em>`; kotwica `#rozmowa` |
| `src/components/text/PhotoGrid.tsx` | nowy, Client | PR-41: 4 kol. desktop, 2 mobile; opcjonalne podpisy |
| `src/components/text/WorkshopLightbox.tsx` | nowy, Client | Stan 6g — zdjęcie + podpis + nawigacja; wspólna logika z galerią jeśli etap 5 zmergowany, inaczej implementacja wg makiet |
| `src/components/text/LearningForms.tsx` | nowy | PR-11…14 + wspólny blok mailto/tel (PR-15) |
| `src/components/text/AboutPage.tsx` | nowy | Składanie sekcji `/o-akademii` |
| `src/components/text/WorkshopPage.tsx` | nowy | Składanie sekcji `/pracownia` |
| `src/app/o-akademii/page.tsx` | zmiana | `AboutPage` zamiast `PagePlaceholder` |
| `src/app/pracownia/page.tsx` | zmiana | `WorkshopPage` zamiast `PagePlaceholder` |
| `src/i18n/pl.ts` | zmiana | Etykiety UI: TOC („Na tej stronie"), lightbox, mailto pracownia |
| `src/app/globals.css` | zmiana | Tokeny layoutu strony tekstowej, `PersonProfile`, `PhotoGrid`, sticky TOC |

## Kawałki

### Kawałek 1 — Shell strony tekstowej + TOC + nawigacja sekcji

Zakres: `TextPageShell`, `TocSidebar`, `TocCollapse`, `pages.ts`, typy `TocItem`/`TextPageData`; rozszerzenie `navigation.ts` (K-48); trasa `/o-akademii` renderuje shell z minimalnymi danymi testowymi (jeden H2, krótki `toc[]`) — **bez pełnej treści**.

Kryterium „gotowe": layout dwukolumnowy zgodny z makietą (kolumna H2 280 px, `--section-gap` 96/60); `TocSidebar` sticky na desktop (sprawdzić stan 6i); `TocCollapse` na 390 px; `SectionNav` O Akademii · Pracownia z aktywną pozycją; nawigacja klawiaturą + fokus; build/lint OK.

### Kawałek 2 — Komponenty + `/o-akademii`

Zakres: `MissionDeclarations`, `PersonProfile`, `MilestoneRow`, `ActivityList`, reuse `Testimonial`; `AboutPage`; `content/pages/o-akademii.json` + `.mdx` z pełnym copy (placeholders OA-33, OA-37); media workshop (hero + pas); wariant **6e** bez OA-38.

Kryterium „gotowe": `/o-akademii` zgodne z 6a/6b; wszystkie sloty OA-xx z copy doc; cezura `--surface-card` na „Pracownia i miejsce"; linki OA-43, OA-55, OA-63, OA-75, OA-80 (`ikonadzis.org`); zdanie prawne OA-81; build/lint OK; mobile + desktop.

### Kawałek 3 — `Interview` + `/pracownia` (bez galerii)

Zakres: `Interview`, `LearningForms`; `WorkshopPage`; `content/pages/pracownia.json` + `.mdx` (formy nauki, rozmowa, TOC z H3 części); mailto temat „Zapytanie – Pracownia", `tel:+48601734705`.

Kryterium „gotowe": `/pracownia` zgodne z 6c/6d/6i (bez PhotoGrid); kotwica `#rozmowa`; 14 wymian; kursywa w odpowiedzi 2/1; `SectionNav` aktywna „Pracownia"; build/lint OK.

### Kawałek 4 — Galeria + lightbox + domknięcie

Zakres: `PhotoGrid`, `WorkshopLightbox`; 12 zdjęć PR-41; podpis zbiorczy mobile; sekcje końcowe obu stron jeśli nie w kawałkach 2–3; przegląd DoD etapu; Lighthouse a11y na obu trasach.

Kryterium „gotowe": galeria 4×3 desktop, 2 kol. mobile (6g lightbox: Esc, strzałki, fokus); wszystkie DoD etapu spełnione; build/lint OK.

## Dane sample / placeholdery dodawane w tym etapie

→ wpis do `docs/plan-claude-code.md` §5:

| Treść | Gdzie | Zastąpić czym |
| ----- | ----- | ------------- |
| Wybrane realizacje EJK (6× placeholder) | `content/pages/o-akademii.json` (`works`) | dane od klientki (pytanie 2 w copy doc) |
| Staż pracowni EJK (`[DO UZUPEŁNIENIA: liczba lat]`) | `content/pages/o-akademii.json` (bio) | potwierdzenie klientki (pytanie 1) |
| Rozmowa — 5 nowych pytań ML + zmiany redakcyjne | `content/pages/pracownia.json` (`interview`) | akceptacja EJK (copy doc §„Zmiany redakcyjne") |
| Portret EJK | `public/media/workshop/ejk-portret.jpg` | zdjęcie od klientki jeśli obecne nieaktualne |
| Zdjęcia warsztatowe | `public/media/workshop/*` | opcjonalnie wyższa jakość / nowa sesja (etap 9 nie migruje tych stron) |

## Kryteria ukończenia etapu

- [x] Szablon strony tekstowej (`TextPageShell` + TOC) gotowy do ponownego użycia w etapie 8 bez rozgałęzień
- [x] `/o-akademii` i `/pracownia` renderują treść z `content/`; `toc[]` steruje `TocSidebar`/`TocCollapse`
- [x] Zaślepki zastąpione; `SectionNav` O Akademii · Pracownia (K-48)
- [x] Zgodność z makietą 6a–6d (+ 6g lightbox, 6h TOC mobile, 6i sticky TOC) na 390 px i desktop
- [x] Brak tekstu redakcyjnego w JSX; twarde spacje z copy doc zachowane
- [x] Build/lint OK; nawigacja klawiaturą na interakcjach

## Ryzyka i pytania otwarte

- **Backlog (2026-09-21, K-50):** linki OA-55 i OA-63 — korekta → `/aktualnosci`, etykieta „Aktualności” (D-07-09) **zrobiona w etapie 7**, kawałek 4 (`docs/plans/07-aktualnosci.md`).

- **Pytania do klientki** w `docs/copy-o-akademii-pracownia.md` (9 pozycji) — nie blokują implementacji; placeholdery lub copy „jak jest" do weryfikacji.
- **Liczba 15 sezonów (OA-53):** copy zakłada bieżący 2026/2027 w liczbie — do potwierdzenia (pytanie 4); wartości 2010/2012 z briefu §8 wpisujemy jako prawdziwe.
- **Lightbox galerii ikon (etap 5):** na gałęzi `feat/06-about` może nie być — kawałek 4 implementuje `WorkshopLightbox` wg 6g; przy merge etapu 5 rozważyć współdzielenie kodu (bez scope creep w 06).
- **Stan 6f (fokus/hover):** reguły już w systemie z 04b — weryfikacja przy QA, osobny kawałek niepotrzebny.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| ------- | ------ | ------------------- |
| 1 — Shell + TOC + SectionNav | ✅ | Shell + TOC na `/o-akademii` z minimalnym `toc[]` (test harness); pełna treść w kawałku 2 bez sidebara TOC |
| 2 — Komponenty + /o-akademii | ✅ | Pełna treść OA-xx; **poprawka layoutu 2026-09-20** — siatka misji 2×2, PersonProfile poza TextPageSection, AboutQuote, belki 28 px, linki flex, pas pracowni bez kolumny 280 px; cezura na „Pracownia i miejsce"; media w `public/media/workshop/` |
| 3 — Interview + /pracownia | ✅ | `Interview`, `LearningForms`, `WorkshopPage`; `content/pages/pracownia.json` + `.mdx`; pełny `toc[]` z PR-25; 14 wymian; kotwica `#rozmowa`; bez galerii (kawałek 4) |
| 4 — Galeria + lightbox + DoD | ✅ | `PhotoGrid`, `WorkshopLightbox`, `WorkshopGallerySection`; 12 zdjęć PR-41 w `content/pages/pracownia.json`; media `public/media/workshop/gallery-*.jpg`; kotwica `#ze-wspolnej-pracy`; DoD etapu — wszystkie punkty |
