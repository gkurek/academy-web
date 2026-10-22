# Plan 10 — Finishing (ewaluacja, poprawki, SEO, optymalizacja)

Status: **zatwierdzony** 2026-10-03 · fala 1 ✅ 2026-10-04 · **następny: kawałek 8**  
Gałąź: `feat/10-finishing`  
Makiety: tokeny `design/README`, odczyt wartości `docs/design-mockup-guide.md`. Fala 2 nie ma nowych makiet.

## Cel i zakres

Domknięcie serwisu na prawdziwych danych z etapu 9 przed wdrożeniem (etap 11). Praca w dwóch falach:

1. **Fala 1 — poprawki i refaktory** (layout, IA, komponenty, wzorce UI) — **zamknięta** 2026-10-04.
2. **Fala 2 — treść, SEO, audyty** — k8 treść i gate EJK → k9 SEO/analityka/JSON-LD → k10 audyty, ewaluacja kodu, dokumentacja.

**Poza zakresem etapu 10:** hosting, DNS, runbook (etap 11); **CMS wykładów i aktualności** (osobny projekt po etapie 11); zmiany w `design/` przez Claude Code; nowe zależności npm bez uzgodnienia; migracja WP — zamknięta na stałe, skryptów `scripts/migrate-wp/` nie uruchamiamy.

## Decyzje wiążące dla fali 2

| ID | Decyzja |
| --- | --- |
| **K-122** | Gate w czacie przed zapisem treści redakcyjnej w `content/` — pozycja po pozycji, z akceptacją właściciela; refaktory UI — zwykły checkpoint po kawałku. **Od 2026-10-16:** Claude może generować treść (copy, opisy, nowe sformułowania) — przy propozycji wyraźnie oznacza, co jest jego dopowiedzeniem, i pyta, czy jest OK. Zakaz generowania treści za klienta zniesiony. |
| **Kolejność** | k8 → k9 → k10; k10 obejmuje synchronizację dokumentów z kodem, więc idzie ostatni. Blok R (review) równolegle do k8 — RV-1, `10-review.md`. |

## Fala 1 — podsumowanie (zamknięta 2026-10-04)

Szczegóły, decyzje kawałków i checkpointy — w `docs/archive/plans/`. Decyzje rejestru — `docs/plan-claude-code.md` §4.

| Kawałek | Wynik | Decyzje | Plan |
| --- | --- | --- | --- |
| 1 — `/ikony/wystawy` | Układ K-127 (13a/14a) + korekty K1–K4; P4 Tura B R1, R2, R7, R8; „Wystawy wyjazdowe” `#wyjazdowe` | K-127, K-87 | `10-k1-exhibitions.md` |
| 2 — lightbox | G1–G3: brak flashu, cap skali, modal treści vs ikon, siatki D9, tryb single; K-38 iOS OK | — | `10-k2-lightbox.md` |
| 3 — aktualności | K-69 kierunek B; `News.layout`, bez `poster`; nowy szablon wpisu; wpisy cykliczne | K-128–K-135 | `10-k3-news.md` |
| 4 — strona główna | „Najbliższe” — 3 kafle liczone z dat + `upcomingOverrides[]`; H3 bez błędu; korekta UI kafel Wykłady 2026-10-19 (eyebrow + linie nazwisk) | K-136 | `10-k4-home.md` |
| 5 — album | Spis wg rozdziałów, skany, optymalizacja mediów | K-137, K-138 | `10-k5-album.md` |
| 6 — wykłady | Przegląd tras, a11y akordeonu, `News.lectureSeason` | K-139 | `10-k6-lectures.md` |
| 7 — reszta layoutu | I1, O1–O3, S1, stopka C1 (K-36) | — | `10-k7-layout.md` |
| — poprawka po review | Stopka **Stopka v2** (3a/3b), **K-149** — poza k7, po zamknięciu bloku R | K-149 | `design/Akademia Ikony - Stopka v2.dc.html` |

## Kawałki — fala 2

### Kawałek 8 — Treść i gate EJK

**Zakres:** backlog treści **T1–T29** w `docs/plan-claude-code.md` §5 — galeria, zamówienie, oferty, LSŚ, aktualności, wykłady, wystawy, album, O nas / pracownia, przegląd `alt`/`caption` całego serwisu. Każda pozycja przez gate K-122. **T30** (lightbox dla zdjęć inline w MDX) — §5A, v2, poza k8.

**Kawałek 8a — usunięcie sprzedaży ikon (K-151, 2026-10-14):** korekta zakresu k8 po decyzji EJK. Usunąć trasę `/ikony/na-zamowienie`, ofertę `zamowienie` i jej komponenty (`OrderExamples`, `GalleryOrderTeaser`), link zamówienia z lightboxa, pozycję w `sectionNav.ikony`, linki/wzmianki w `o-akademii.json`, `home.json`, `pracownia.json`; stringi `pl.ts`; 301 → `/ikony`; wpisy trasy w `scripts/visual-*`; brief. Model (`OfferKind`, `IconWork.available`) bez zmian. Jeden checkpoint.

**Kawałek 8b — menu mobilne (2026-10-22):** przegląd 375 px (`/`, `/o-akademii`, `/warsztaty`, `/wyklady`, `/ikony`, `/aktualnosci`): strony mają 6–11 ekranów, nagłówek nie jest sticky, więc hamburger znika po pierwszym przewinięciu. Zakres:

1. **Pływający przycisk menu** (mobile, `< lg`) — kwadrat 56 px, tło akcentu jak `Button` primary, ciemna ikona hamburgera, bez napisu (etykieta `aria-label` z `pl.ts`), obrys zamiast cienia; prawy dolny róg z marginesem strony + `env(safe-area-inset-bottom)` (klasa w CSS, nie wartość arbitralna). Widoczny dopiero, gdy pasek nagłówka wyjdzie z ekranu (`IntersectionObserver`) — nigdy dwa hamburgery naraz; ukryty przy otwartym menu; `prefers-reduced-motion` bez animacji. Na mobile dolny odstęp strony, żeby przycisk nie zasłaniał końca stopki.
2. **Szuflada menu na pełny ekran z własnym paskiem** (logo + zamknij) — dziś `top` = wysokość paska nagłówka, co zakłada widoczny nagłówek. Focus trap, Esc, `inert` tła bez zmian; po zamknięciu fokus wraca na przycisk, który otworzył menu.
3. **Bez duplikatów** — usunąć przycisk „Kontakt” i „Aktualności” z dolnego rzędu; zostają „Zapisy na warsztaty” i rząd Publikacje · Blog.
4. **Cały wiersz sekcji rozwija akordeon** (zamiast etykieta = link, chevron = toggle); pierwsza pozycja listy to hub sekcji z `sectionNav[0]` (Przegląd / Bieżący sezon / Galeria / O Akademii) — `mainNav.children` = pełne `sectionNav`, komentarz o wyjątku Ikony do usunięcia.
5. **O Akademii z akordeonem** — O Akademii, Pracownia.
6. **Bieżąca podstrona w akordeonie złota** (`text-accent-text`, jak aktywna sekcja).

Kolizja: `YearNav` na `/aktualnosci` jest sticky `top: 0`, `z-index: 20` — przycisk na dole jej nie dotyka; z-index przycisku powyżej 20, szuflady powyżej przycisku; lightbox to natywny `<dialog>` (top layer), bez konfliktu. **Wariant zapasowy (1B):** jeśli pływający przycisk się nie sprawdzi — nagłówek sticky chowany przy scrollu w dół, kompaktowy bez podtytułu; wtedy `YearNav` dostaje `top` = wysokość nagłówka, a `--year-nav-scroll-offset` sumę obu wysokości. Pliki: `HeaderMobileMenu.tsx`, `navigation.ts`, `pl.ts`, `tokens.css` (rozmiar przycisku, jeśli brak tokenu). Bez nowych zależności. Jeden checkpoint.

**Kryterium „gotowe”:** każda pozycja T1–T29 zamknięta albo świadomie odłożona (z adnotacją w §5); T30 nie blokuje zamknięcia k8; brak `[do uzupełnienia]` widocznego na produkcji poza uzgodnionymi wyjątkami; build + lint OK.

### Kawałek 9 — SEO, analityka, JSON-LD

**Zakres:** `docs/plan-claude-code.md` §3 etap 10, pkt 2 — metadata + OG, `sitemap.ts`, `robots.ts`, JSON-LD (`Organization`, `Person`, `Event` — K-17, `Course`, `Book`/`Article` — K-76), analityka bez ciasteczek (K-07, K-15), aktualizacja polityki prywatności (K-119). Plus pozycje z backlogu niżej oznaczone k9.

### Blok R — Review serwisu (równolegle do k8)

**Zakres:** review techniczne (R0–R5), wizualne (V1–V4) i — po EJK — zgodności z planem i treści (C1–C2); poprawki osobnym planem `docs/archive/plans/10-review-fixes.md`. Plan, decyzje RV-1…RV-7 i postęp: **`docs/plans/10-review.md`**. Przejmuje z k10 ewaluację kodu i przegląd tras (RV-1).

### Kawałek 10 — Audyty, dokumentacja

**Zakres (okrojony przez RV-1):** ewaluacja kodu dodanego w k9 (delta po bloku R); Lighthouse dla 5 tras (`docs/lighthouse/`); synchronizacja dokumentów; przygotowanie testu 301 na stagingu (wykonanie — etap 11). Plus pozycje z backlogu niżej oznaczone k10 — B4 i B5 wchodzą jako wyłączenia do R0 i rozstrzygnięcie w `docs/archive/plans/10-review-fixes.md`.

## Backlog fali 2 — poza treścią

Pozycje techniczne i decyzje przeniesione z kawałków fali 1. Treść EJK — `docs/plan-claude-code.md` §5.

| # | Kawałek | Pozycja | Źródło |
| --- | --- | --- | --- |
| B1 | k9 | CTA „Zapisy” w nagłówku desktop — decyzja z danymi analityki (K-35) | `10-k7-layout.md` LY6 |
| B2 | k9 | JSON-LD `Book`: `hasPart` może korzystać z `Publication.chapters` (K-137) | `10-k5-album.md` § Ryzyka |
| B3 | k9 | Rozważyć `ExhibitionEvent` dla `/ikony/wystawy` | §3 etap 10 |
| B4 ✅ | k10 | `mdx-components.tsx` używa wartości arbitralnych Tailwind (`[&:has(>em:only-child)]…`) — wbrew konwencji repo. **Zamknięte:** w `mdx-components.tsx` jest 0 wartości arbitralnych (R4, status B4); `10/RF-6` | `10-k3-news.md` § Diagnoza |
| B5 ✅ | k10 | `scripts/migrate-wp/` — martwy kod po zamkniętej migracji (`report.ts` wskazuje na przeniesiony `scripts/migrate-report.md`); zdecydować: usunąć czy zostawić jako zapis. **Zamknięte:** usunięte w `10/RF-6` razem z 13 skryptami jednorazowymi i `archive/wp-fetch-static/`; historia w git | porządki 2026-10-04 |
| B6 | k10 | `imageLarge` w `IconWork` (K-39) — tylko jeśli Lighthouse lub przegląd pokaże, że cap skali nie wystarcza | `10-k2-lightbox.md` |
| B7 | po prezentacji | Sticky `FactsBox` na stronach ofertowych (K-37) | `10-k7-layout.md` LY6 |
| B8 | po prezentacji | Filtr Aktualności po wystawach dla linku „Fotorelacje z poprzednich wystaw dorocznych” (dziś `/aktualnosci` bez filtra) | `10-k3-news.md` § Ryzyka |
| B9 | etap 11 | Dobowy rebuild albo ISR na hostingu — warunek poprawnych kafli „Najbliższe” i stanu wystawy (K-136 N9, K-85) | `10-k4-home.md` N9 |
| B10 | właściciel / Claude Design | `design/README` nie opisuje makiety wystaw 13a/14a; **`design/README` — opis stopki nadal niezsynchronizowany** (w kodzie: **K-149** / Stopka v2; góra `#1a140f`, legal `#120e0b`) | `10-k1-exhibitions.md`, `10-k7-layout.md` |

## Dane sample w tym etapie

Brak nowych plików `sample`. Placeholdery `[do uzupełnienia]` — wiersz w `docs/plan-claude-code.md` §5.

## Kryteria ukończenia etapu (DoD)

Z `docs/plan-claude-code.md` §3, etap 10:

- [ ] przegląd wszystkich tras z briefu §3 odhaczony; lista poprawek po prezentacji zamknięta lub świadomie przeniesiona do wdrożenia;
- [ ] walidator schema.org bez błędów dla czterech typów; podgląd OG sprawdzony dla strony głównej i jednej ofertowej;
- [ ] zdarzenia analityczne widoczne w panelu narzędzia w środowisku testowym;
- [ ] przegląd kodu zakończony: usunięte lub uzasadnione miejsca over-engineered; brak oczywistych duplikacji i naruszeń konwencji repo;
- [ ] raport Lighthouse dla 5 tras (główna, kurs, wykłady, galeria `/ikony`, aktualności) w `docs/lighthouse/`;
- [x] lightbox `/ikony` na iOS Safari (K-38) — test OK 2026-10-03;
- [ ] `npm run build` i `npm run lint` bez regresji; dokumentacja zsynchronizowana z kodem i decyzjami etapu.

## Ryzyka i pytania otwarte

- **K-07** Plausible vs Umami — rozstrzygnąć na starcie k9 (wpływa na politykę prywatności, K-119).
- **Prezentacja z klientem** — termin i staging; od niej zależą B7, B8 i część DoD #1.
- **Tempo k8** — zależy od odpowiedzi EJK; pozycje bez odpowiedzi odkładamy z adnotacją w §5, nie blokują k9.

## Postęp

| Kawałek | Status | Uwagi |
| --- | --- | --- |
| 1–7 — fala 1 | ✅ | 2026-10-03 … 2026-10-04; tabela „Fala 1 — podsumowanie” wyżej |
| Stopka v2 (K-149) | ✅ | 2026-10-07; mapa stopki + `sectionNav.kontakt` (/kontakt · /polityka-prywatnosci); poza k7, po przeglądzie makiety Claude Design |
| 8 — treść EJK | 🟠 w toku | backlog T1–T29 — **21/29 ✅** w §5 (T23, T31 2026-10-14; T6 anulowane — K-151); **8a** (K-151) ✅ 2026-10-14 — czeka na OK; kurs 2026-10-17: usunięta sekcja „Jak się zapisać” (rozmowa wstępna → wiersz „Zgłoszenia” w FactsBox), placeholder zdjęcia 4:3 nad CTA w „Dalsza droga”; LSŚ 2026-10-17: przepisane copy (lead, „Jak wygląda tydzień”, „Dlaczego warto…”, ramowy „Rytm dnia”), 4 cytaty z pleneru, placeholder zdjęcia głównego, `OfferClosingCta` na końcu strony; wykłady 2026-10-17: intro sezonu — „Cykl wykładów”, „zwykle dwa wykłady” (copy akceptowane przez EJK zostaje; nagrania dostępne, pojedynczych wejść brak); FactsBox wykładów — stały wiersz „Nagrania”, przy zamkniętych zapisach CTA „Powiadom mnie o zapisach” jak w kursie; wpis aktualności 2026-10-17: kolory prose stonowane (`--prose-color` → `--text-secondary`, `--prose-lead-color` → `--text-body`, usunięty `--text-prose` `#e6dac7` — korekta K-131/E1; Garamond bez zmian); `/kontakt` 2026-10-18: układ wg makiety **1f** (desktop 7/5) / **2a** (mobile) z `design/Akademia Ikony - Kontakt.dc.html` — wiersze z linią (etykieta · wartość: dwa e-maile z osobą, osobny „Telefon”, „Adres” łamany na 3 linie + ulica), po prawej zdjęcie fasady i blok „Wejście od strony zakrystii” (złota krecha, treść z `kontakt.mdx`, uwaga o braku barier, link „Otwórz w Mapach Google”), Organizator i „Akademia w sieci” jako dwa ostatnie, cichsze wiersze lewej listy (korekta **1g**, 16 px, `text-secondary`; zastępuje pasmo pod siatką z 1f); mobile: blok wejścia przed zdjęciem na pełną szerokość. Bez nowych tokenów (istniejące `--space-*`, `--role-row-title*`, `--accent-bar`, `--mission-bar-w`, `--line-neutral`, `--surface-card`); usunięte osierocone `--contact-email-*`, `--contact-aside-offset`. Pliki: `ContactPage.tsx`, nowe `ContactRow.tsx` i `EntranceNote.tsx`, `OnlineAside.tsx` (teraz dwa `ContactRow`), `ContactPhoto.tsx`, `contact.css`, `pl.ts` (`phoneLabel`, `entranceHeading`, `mapLinkLabel` — stringi z makiety, do akceptacji K-122). Odstępstwa: podpis zdjęcia z pełnym kredytem i licencją CC BY-SA (makieta ma sam „Fot. Adrian Grycuk”); `alt` bez zmian; adres „Senatorska 18B” z `settings.json` (stopka: Plac Teatralny 20 — rozbieżność istnieje, nie ruszana); link do Map to wyszukiwanie z nazwy kościoła i adresu (brak zatwierdzonego URL w `settings.json`); kolumna etykiet 1fr/2fr zamiast 190 px; łamanie adresu po „pw.” i „i św.” w kodzie, bo `settings.place` jest jednym ciągiem; commity `10/k8` na `feat/10-finishing`; `/warsztaty` (hub) 2026-10-21: układ wg makiety **2c** z `design/Akademia Ikony - Warsztaty.dc.html` — szerokie zdjęcie pracowni pod leadem (`ExhibitionFrame` wide: 3:2 mobile / 21:8 md), karty ofert bez zdjęć jako osobne kafle w języku kart opinii (`surface-card`, złota krecha, odstęp `offer-quotes-gap`, subgrid wyrównuje wiersze), CTA z nazwą oferty, końcowy blok „Masz pytania?” z `mailto:` bez tematu, SectionNav na mobile z krótkimi etykietami (`NavLink.shortLabel`); poprawki 2026-10-21: zdjęcie bez złotej ramki, kadr 2:1 na mobile (`--workshops-hub-photo-aspect-m`), `priority` (nowy prop `ExhibitionFrame`), kropki list w kartach, CTA kart z `Button compactMobile` (jedna linia na 390 px), opis kursu skrócony o „coraz trudniejsze przedstawienia” (równa liczba linii obu opisów); nowe sekcje 2026-10-21 (copy Claude, zaakceptowane — K-122): „Ikony naszych uczniów” (4 ikony uczniów przez `FeaturedIconsGallery`, link `/ikony#uczniowie`), FAQ „Zanim zaczniesz” (7 pytań, statyczne, pod JSON-LD `FAQPage` w k9), dwa cytaty (Artur, Adam — `OfferQuoteGrid`, 2 kolumny); kolejność: karty → ikony → FAQ → cytat → „Masz pytania?”; `getWorkshopTestimonials` → `getTestimonials` + `quoteAuthors` w `workshops-hub.json`; usunięte osierocone `--offer-card-image-h`, `.offer-card-exhibition-frame`, `pl.workshopsHub.imagePlaceholder`; T30 → §5A v2 |
| 8b — menu mobilne | ✅ 2026-10-22 — czeka na OK | pkt 1–6 wdrożone: `.menu-fab` (utilities.css, tokeny `--menu-fab-size`/`--menu-fab-offset`), dolny odstęp stopki pod przycisk wycofany po przeglądzie (2026-10-22); szuflada `fixed inset-0` z własnym paskiem i `role="dialog"`, stale zamontowana (`inert` gdy zamknięta), `.menu-drawer` — fade + przesunięcie 200 ms w obie strony, bez animacji przy `prefers-reduced-motion`; cały wiersz sekcji = przycisk akordeonu; `mainNav.children` = pełne `sectionNav` (stopka Warsztatów nadal `slice(1)`); prop `sectionActiveHref` z `resolveNav`; `pl.header`: + `menuCloseLabel`, − `contactCta`, `sectionExpandLabel`, `sectionCollapseLabel`. Przycisk nie chowa się przy otwartym menu (zakrywa go szuflada; fokus wraca na niego pewnie). Przy okazji przeglądu mobile: `trojca-swieta-2017.jpg` (pierwsza ikona galerii, lightbox ładował 1,8 MB) → 1200×1600, mozjpeg q82 4:2:0, 183 KB (limit 1600 px z K-138, jakość jak miniatury K-138), wymiary w `icons.json` |
| R — review serwisu | ✅ część techniczna i wizualna 2026-10-06 | R0–R5, RF-0…RF-20, V1–V4 zamknięte; zostaje C1–C2 po k8; postęp w `10-review.md`, `docs/archive/plans/10-review-fixes.md` |
| 9 — SEO / analityka | ⬜ | |
| 10 — audyty / docs | ⬜ | okrojony przez RV-1 |
