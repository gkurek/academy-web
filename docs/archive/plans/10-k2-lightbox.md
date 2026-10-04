# Plan 10 / kawałek 2 — Lightbox global (G1–G3)

Status: **zamknięty** 2026-10-03 (kroki 2.1–2.6)  
Etap: `docs/plans/10-finishing.md` (kawałek 2, zadania G1–G3)  
Gałąź: `feat/10-finishing`  
Wzorzec siatki: `/ikony` — `IconGrid` `variant="gallery"` + `justifyGalleryRows` (FooGallery, K-40). Wzorzec modala ikon: `src/components/gallery/Lightbox.tsx`. Rdzeń wspólny: `src/components/lightbox/*`.

## Cel

Naprawa wyświetlania obrazu w modalu (miganie przy prev/next, upscale małych plików), ujednolicenie **siatek** i **modala treściowego** na trasach z klikalnymi zdjęciami, zachowanie osobnego modala **galerii ikon** (`/ikony` + „Wybrane ikony” na `/`). Escape, regresje, notatka **K-38** (iOS Safari). **Nie wchodzi:** inwentarz pojedynczych zdjęć inline w MDX (podpięcie strona po stronie) — **kawałek 8**; metadane galerii ikon z EJK (`size`, `authorName`, technika) — §5 / k8; ewentualne `imageLarge` (K-39) — tylko jeśli cap skali okaże się niewystarczający.

## Decyzje sesji planistycznej (2026-10-03)

| # | Decyzja |
| --- | --- |
| **D1 — G1.1 miganie** | Przy next/prev we **wszystkich** lightboxach przez chwilę miga poprzedni kadr. Naprawa w **rdzeniu** (`LightboxImage` lub warstwa nad `next/image`): zidentyfikować przyczynę (podmiana `src` bez remountu / cache) i usunąć flash. |
| **D2 — G1.2 skala** | Obraz w modalu: **nie powiększać ponad wymiary źródła** (`width`/`height` z treści); **zawsze mieścić** w limitach viewportu z tokenów (`--lightbox-image-max-h-m` / `--lightbox-image-max-h`, proporcje). Wyświetlany rozmiar = `min(intrinsic, fit-to-viewport)` z zachowaniem proporcji — dobrze na mobile i desktop; bez nowych tokenów px. |
| **D3 — G2 modal (dwa warianty)** | **Wariant ikon:** `/ikony` i sekcja **„Wybrane ikony”** na `/` — bez zmiany układu modala: desktop obraz + panel meta (`Lightbox.tsx`, K-42); mobile jak dziś. **Wariant treści:** aktualności, pracownia, wystawy doroczne, publikacje itd. — **zdjęcie wyśrodkowane, podpis pod zdjęciem** (bez `lg:flex-row` z panelu bocznym); licznik „n z m” pod zdjęciem gdy `photos.length > 1`. |
| **D4 — G2.3 jeden slajd** | Gdy zestaw ma **jeden** obraz: **bez licznika**, **bez strzałek** (desktop i mobile), tylko zamknięcie (X). Dotyczy każdego miejsca już podpiętego pod lightbox z jednoelementową tablicą — nie listy inline MDX (k8). |
| **D5 — G2 siatki** | Wszystkie **galerie wielu zdjęć** pod lightboxem: ten sam layout co `/ikony` — justified rows, `object-cover`, **hover: przyciemnienie + lupa** (jak `GalleryTileHoverOverlay`). Obowiązuje: **Wybrane ikony** (`FeaturedIcons`), galerie w **aktualnościach**, **pracownia** (`WorkshopGallerySection`), **publikacje** (`PublicationSpreadStrip`), **kafle doroczne** wystawy (`ExhibitionAnnualTiles` gdy `photos[]`). Kafle doroczne **zastępują** sztywny rząd 4×4:3 z k1 (K-127) w warstwie siatki — hero/ekspozycja K-127 bez zmian. |
| **D6 — Wybrane ikony** | Pełny paritet z `/ikony`: justified + klik → **`Lightbox`** (nie `WorkshopLightbox`). Realizacja w **k2**; kawałek 4 (H1) — tylko otoczka sekcji (np. marginesy nagłówka), nie ponowna implementacja siatki. |
| **D7 — G2.4 inline MDX** | Lista stron / zdjęć pojedynczych w treści MDX do podpięcia lightboxa — **fala 2, kawałek 8**, uzgodnienie z EJK. W k2: API trybu single + wspólny klikalny kafel gotowe pod przyszłe podpięcia. |
| **D8 — G3** | Escape (dialog `onCancel` + spójny stan React), regresja klawiatury i galerii `/ikony`; **K-38** — test na fizycznym iOS Safari przez właściciela repo (wpis w planie: OK lub uzasadniony fallback overlay). |
| **D9 — G2 siatki (korekta)** | **Justified + lupa:** `/ikony`, **Wybrane ikony** (`/`), **wystawy doroczne** (`ExhibitionAnnualTiles` gdy `photos[]`). **Klasyczny grid** (2×/4×, 4:3): **pracownia**, **aktualności** (`PhotoGrid`) — z **hover + lupa** (`GalleryTileHoverOverlay`). **Publikacje** — grid rozkładówek 2:1 bez justified (jak przed k2.3). |

## Pliki (orientacyjnie)

| Plik | Zmiana | Co |
| --- | --- | --- |
| `src/components/lightbox/LightboxImage.tsx` | zmiana | D1, D2 |
| `src/components/lightbox/lightboxUtils.ts` | zmiana | D2 — helper fit/cap |
| `src/components/lightbox/LightboxDialogShell.tsx` | zmiana | wariant layoutu (`icons` \| `content`), D4 — ukrycie nav przy 1 slajdzie |
| `src/components/lightbox/useLightboxDialog.ts` | ewent. | D1/D3 — Escape jeśli luka |
| `src/components/gallery/Lightbox.tsx` | ewent. | przekazanie wariantu `icons`, D4 |
| `src/components/text/WorkshopLightbox.tsx` | refaktor | wariant `content`, D3–D4; jeden shell |
| `src/components/text/PhotoGrid.tsx` | zastąpienie / refaktor | D5 — justified + overlay lub delegacja do wspólnej siatki |
| `src/components/gallery/IconGrid.tsx` | refaktor | wyciągnięcie współdzielonej justified siatki dla `ContentImage` (caption pod kaflem) |
| `src/components/gallery/justifyGalleryRows.ts` | bez zmian lub reuse | D5 |
| `src/components/news/NewsGallery.tsx` | zmiana | D5 |
| `src/components/text/WorkshopGallerySection.tsx` | zmiana | D5 |
| `src/components/publications/PublicationSpreadStrip.tsx` | refaktor | D5 siatka + D3 modal treściowy (bez duplikatu shell) |
| `src/components/exhibition/ExhibitionAnnualTiles.tsx` | przebudowa | D5 justified + overlay; lightbox przez provider |
| `src/components/exhibition/ExhibitionLightboxProvider.tsx` | ewent. | spójność z `ContentLightbox` |
| `src/components/home/FeaturedIcons.tsx` | zmiana | D6 — Client + `Lightbox` + `variant="gallery"` |
| `src/app/globals.css` | zmiana | wariant `.lightbox-dialog--content`, siatki; usunięcie martwych `.photo-grid-*` jeśli zastąpione |
| `docs/plans/10-finishing.md`, `docs/plan-claude-code.md` | zmiana | postęp, dziennik |
| `docs/plans/10-k1-exhibitions.md` | dopisek | D4 k1 vs D5 k2 (kafle doroczne) |

## Kroki (meldunek po każdym, wg `CLAUDE.md`)

### 2.1 — Rdzeń obrazu (G1)

`LightboxImage` + `lightboxUtils`: naprawa migania (D1); cap skali (D2). Regresja: `/ikony` lightbox prev/next, jeden wpis z galerią news, pracownia.  
**Gotowe:** build + lint OK; brak flashu na szybkim next/prev; małe zdjęcia pracowni nie są rozciągane do rozmycia; duże ikony nadal sensownie wypełniają modal.

### 2.2 — Modal treściowy + tryb single (G2 modal)

`LightboxDialogShell`: layout **content** (kolumna: obraz, podpis, licznik); wariant **icons** bez zmiany zachowania. `WorkshopLightbox` (+ ewent. jeden `ContentLightbox`): D3, D4. `PublicationSpreadStrip` — ten sam modal, bez osobnej wiązki shell.  
**Gotowe:** news / pracownia / publikacje — desktop i 390px; jeden slajd bez strzałek i licznika; `/ikony` i docelowy home — nadal wariant ikon (test po 2.4).

### 2.3 — Siatka justified + hover (G2 siatki)

Wspólny komponent (lub rozszerzenie `IconGrid`) dla `ContentImage[]`: justified, lupa, podpis pod kaflem gdzie dziś jest caption. Podmiana: `PhotoGrid` / `NewsGallery` / `WorkshopGallerySection`, `PublicationSpreadStrip`, `ExhibitionAnnualTiles`.  
**Gotowe:** wizualna spójność z `/ikony`; każdy kafel pod lightbox ma hover; wystawy doroczne z `photos[]` — justified zamiast sztywnego rzędu 4×4:3.

### 2.4 — Wybrane ikony (G2 + D6)

`FeaturedIcons`: `variant="gallery"`, stan lightbox jak strona galerii, ten sam `Lightbox`. Zachować reguły mobile (`mobileCount={2}`) i linki „Cała galeria”.  
**Gotowe:** `/` — klik w kafel otwiera lightbox ikon; justified + lupa; brak regresji `/ikony`.

### 2.5 — Regresje, Escape, K-38 (G3)

Checklista: Escape, strzałki, swipe, backdrop, focus; `/ikony` pełna galeria; notatka K-38 w § Postęp (OK / fallback).  
**Gotowe:** build + lint; wpis K-38; brak regresji a11y na zamknięciu modala.

### 2.6 — Dokumentacja

`10-finishing.md` — G1–G3 ✅, H1 dopisek; `10-k1-exhibitions.md` — kafle doroczne → k2; `plan-claude-code.md` — dziennik; ewent. §4 jeśli dotyczy K-38 wyniku.  
**Gotowe:** docs zsynchronizowane z kodem.

## Kryterium „gotowe” kawałka 2

`npm run build` i `npm run lint` OK; G1–G3 zamknięte wg decyzji D1–D8; reprezentatywne trasy: `/ikony`, `/`, wpis z `NewsGallery`, `/pracownia`, `/ikony/wystawy` (ze zdjęciami w `annual.json`), hub lub album publikacji; brak regresji modala ikon; K-38 odnotowany.

## Ryzyka

- **Refaktor siatki** — duży diff CSS; usuwać `.photo-grid-*` tylko gdy zero referencji.
- **FeaturedIcons** — wymaga Client Component dla lightbox; zachować RSC tam, gdzie możliwe (wrapper).
- **Wystawy bez `photos[]`** — justified/lightbox tylko gdy są zdjęcia; empty state z k1 bez zmian.
- **k5 album** — TOC/autorzy nie w k2; nie psuć `PublicationSpreadStrip` pod k5.

## Postęp

| Krok | Status | Uwagi |
| --- | --- | --- |
| 2.1 — rdzeń G1 | ✅ | D1 visibility + key; D2 `getLightboxImageDisplayStyle` |
| 2.2 — modal treści + single | ✅ | D3 shell `content`/`icons`; D4 `ContentLightbox`, publikacje |
| 2.3 — siatki justified | ✅ | justified: `/ikony`, `/`, wystawy doroczne; pracownia/news/publikacje — grid klasyczny (decyzja wizualna 2026-10-03) |
| 2.4 — Wybrane ikony | ✅ | `FeaturedIconsGallery` + `Lightbox`; `mobileCount` w gallery |
| 2.5 — G3 / K-38 | ✅ | Escape/`onCancel`, strzałki, swipe, focus — bez zmian regresji; **K-38** — test fizyczny iOS Safari **OK** 2026-10-03 (`<dialog>`, bez fallback overlay) |
| 2.6 — dokumentacja | ✅ | `10-finishing`, `10-k1`, `plan-claude-code` |
