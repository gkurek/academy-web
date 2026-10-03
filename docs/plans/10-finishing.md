# Plan 10 — Finishing (ewaluacja, poprawki, SEO, optymalizacja)

Status: **zatwierdzony** 2026-10-03  
Gałąź: `feat/10-finishing` (od `main` po merge etapu 9 — PR #11 — i archiwizacji planów 09 — PR #12)  
Makiety: **K-127** — `design/Akademia Ikony - Wystawy warianty.dc.html` (13a desktop, 14a mobile); dalsze ekrany — Claude Design w trakcie fali 1 (home, aktualności, album, wykłady). Tokeny: `design/README`, `docs/design-mockup-guide.md`.

## Cel i zakres

Domknięcie serwisu na prawdziwych danych z etapu 9 przed wdrożeniem (etap 11). Praca w **dwóch falach**:

1. **Fala 1 — poprawki i refaktory** (layout, IA, komponenty, wzorce UI). **Bez** pełnej produkcji treści EJK, **bez** SEO/analityki/Lighthouse jako osobnego pierwszego priorytetu. Kolejność wiążąca — **zaczynamy od `/ikony/wystawy`**.
2. **Fala 2 — reszta** — uzupełnienia treści, brakujące dane, weryfikacje z EJK, pełna ewaluacja tras, audyty (Lighthouse, schema.org), metadata/sitemap/robots/JSON-LD, analityka (K-07), test 301 na stagingu, dokumentacja operacyjna.

**Poza zakresem etapu 10:** hosting, DNS, pełny runbook wdrożenia (etap 11); **CMS wykładów** (osobny projekt po etapach 9–11); zmiany w `design/` przez Claude Code; nowe zależności npm bez uzgodnienia; `next.config.ts` redirecty — już w etapie 9 (ew. korekta po uzgodnieniu).

**Źródła backlogu:** `scripts/migrate-report.md` (§ Do etapu 10, § EJK, P4 Tura B R1–R9, DoD #8), `docs/plan-claude-code.md` §3–§5, §4 (K-69, K-35–K-37, K-39, K-76, K-127, …).

## Decyzje podjęte w sesji planistycznej

| ID | Decyzja |
| --- | --- |
| **Kolejność fali 1** | Najpierw **poprawki i refaktory**, potem treść/EJK i audyty techniczne produktowe (SEO, Lighthouse itd.). |
| **Start implementacji** | **Kawałek 1 = `/ikony/wystawy`** (K-127 + model danych wystaw / P4 Tura B tam, gdzie wciąż wiążące). |
| **K-127** | Wiążący układ strony wystaw (2026-10-02); szczegóły i uwagi do makiety: `docs/plan-claude-code.md` §3, etap 10. |
| **P4 Tura B** | Refactor dorocznych i relacji z Aktualnościami (`scripts/migrate-report.md` § P4, R1–R9). **K-127 jest nowszy i wygrywa:** punkty 2–3 „docelowego modelu” Tury B (lista samych lat, box „Zobacz edycje z poprzednich lat” w 4 rzędach) są **nieaktualne** — K-89 usuwa listę edycji całkowicie; punkt 4 („źródłem zdjęć jest news, nie `annual.json`”) stoi w sprzeczności z K-127 („~10 zdjęć z `AnnualExhibition.photos`”) — rozstrzygnąć w kawałku 1. **Kawałek 1:** R1 (usunięcie sekcji), R2, R7, R8 + audyt R3–R4 (lista do gate'u). **Fala 2 (kawałek 8):** R5, R6, R9 i punkty 1/5 Tury B (wpisy news per rok, zdjęcia EJK) — to treść, nie layout. |
| **Nazwa sekcji wyjazdowych** | W raporcie (§ „Do etapu 10 — uwagi z kawałka 2 v2”): „Wystawy specjalne”, `#specjalne`, z krótkimi wystawami w KŚT; w K-127 (nowszy, 2026-10-02): „Wystawy wyjazdowe” + miasta w zdaniu (K-87). **Rozstrzygnąć przy kawałku 1** (copy `pl.ts`, anchor, kryterium listy) — jedna nazwa w produkcie. Stan danych: z miast makiety tylko **Wilno** i **Świdnica** mają wpis `kind: wystawa`; **Święta Lipka, Supraśl, Tbilisi** to miejsca plenerów LSŚ (K-57, K-126) bez wpisu o wystawie; `venue: "Warszawa"` mają też doroczne w KŚT, stąd „Warszawa · 2019 Relacja” ×N z DoD #8. |
| **Treść z makiety** | Copy z Claude Design ≠ treść klienta — nowe twierdzenia → `[do uzupełnienia]` lub gate EJK (`docs/plan-claude-code.md` §3). |
| **K-122** | Gate w czacie przed zapisem treści redakcyjnej w `content/` (definicja: `docs/archive/plans/09-migration-v2.md`; rozszerzona tu z migracji na cały etap 10); refaktory UI — checkpoint po kawałku. |
| **Kotwice `#wystawa-{rok}`** | K-89 usuwa sekcję, która je nosiła. Linkują do nich: `NewsArticlePage` (link powrotny przy wpisach dorocznych, K-103) i 7 wpisów w `content/news/*.mdx` (+ `#wyjazdowe` w `ikona-okno-ku-wiecznosci-2.mdx`). Redirecty 301 (`docs/redirects.json`) używają tylko `#oprowadzania` — tę kotwicę zachowujemy. Rozwiązanie (R7) — w kawałku 1. |
| **Aktualności k3 — discovery ✅** | 2026-10-03 — **`docs/plans/10-k3-news.md`** (D1–D11). **K-69 zamknięte: kierunek B** (jeden strumień; „co teraz” w „Najbliższe” na `/`). 4 wpisy cykliczne/rok (IX, III, VI, VIII/IX), jeden wpis = dwie fazy (zapowiedź → relacja). Nowe pole `News.layout` (`wydarzenie` / `galeria` / `tekst` / `program`); **usunięcie `News.poster`**; „Powiązane” zamiast `<NewsCta />` w archiwach; styl „prose” tylko w Aktualnościach. Makieta szablonu wpisu zamówiona w Claude Design. |
| **Lightbox k2 (G1–G3) ✅** | Zamknięty 2026-10-03 — **`docs/plans/10-k2-lightbox.md`**. G1–G3 zrealizowane; siatki wg **D9** (justified: `/ikony`, `/`, wystawy doroczne; klasyczny grid + lupa: pracownia/aktualności; publikacje — grid 2:1). **K-38** iOS Safari — test OK 2026-10-03. Inline MDX → **k8**. |

## Pliki i komponenty (orientacyjnie)

| Obszar | Pliki (przewidywane) |
| --- | --- |
| Wystawy | `src/app/ikony/wystawy/*`, `src/components/exhibition/*`, `src/content/exhibition.ts`, `src/content/news.ts` (`getTravelingExhibitions`), `src/components/news/NewsArticlePage.tsx` (link `#wystawa-{rok}`), `content/exhibition/*` (w tym `annual.json`), `src/i18n/pl.ts` (`exhibition`), `src/app/globals.css` (`.exhibition-*`) |
| Lightbox | `src/components/lightbox/*`, `WorkshopLightbox`, `ExhibitionLightboxProvider`, galeria `IconGrid` |
| Aktualności | `src/components/news/*`, `src/content/news.ts`, `content/news/*` |
| Home | `FeaturedIcons`, `UpcomingHighlights`, `Pillars`, `content/settings.json` |
| Publikacje | szablon albumu, `content/publications/*` |
| Wykłady | `src/app/wyklady/*`, wpisy `kind: wyklady` |
| Global | `Footer`, `Header`, `FactsBox`, `mdx-components.tsx` |

## Kawałki (fala 1)

### Kawałek 1 — `/ikony/wystawy` (K-127 + dane wystaw)

**Zakres:**

- Implementacja układu **K-127** (hero, stany K-85, kadry wide 21:8 desktop / 3:2 mobile w kolumnie treści, wystawa doroczna + kafle 4:3 + lightbox, ekspozycja codzienna K3, oprowadzania, wyjazdowe, kadr zamykający). Korekty **K1–K4** → `10-k1-exhibitions.md`.
- **P4 Tura B** (zakres wg tabeli decyzji wyżej): usunięcie `ExhibitionPreviousSection` (R1, K-89); uproszczenie `annual.json` (R2, R8 — martwe `summary`); kotwice `#wystawa-{rok}` (R7); audyt R3–R4 jako lista do gate'u. R5, R6, R9 → kawałek 8.
- Poprawki z DoD #8: **zduplikowane `h2`** FactsBox; **empty state** slotów `[przykład]` (bez wypełniania mediów EJK w tym kawałku).
- Uwagi z §3 planu żywego: adres w `FactsBox` z `settings.json`; `FactsBox` ekspozycji (wiersz „Oprowadzania”, „Gdzie”); link fotorelacji → `/aktualnosci`; mobile 21:8 / kolejność sekcji — wg oceny przy kodzie.
- **Nie wymaga** pełnego uzupełnienia zdjęć dorocznych ani wszystkich wpisów news 2012–2024 (R6) — ale UI musi sensownie obsłużyć brak relacji / brak zdjęć.

**Kryterium „gotowe”:** build + lint OK; strona na 390px, 1440px i ≥1600px (K-30) zgodna z K-127 w zakresie layoutu; brak zduplikowanych `h2` w drzewie a11y na tej trasie; regresja lightboxa na kafelach dorocznych; żaden link w repo nie celuje w nieistniejącą kotwicę `/ikony/wystawy#…`; `#oprowadzania` działa (cel 301); decyzja zapisana: nazwa sekcji wyjazdowej + anchor. Szczegółowy plan: **`docs/plans/10-k1-exhibitions.md`**.

### Kawałek 2 — Lightbox global (G1–G3) ✅

**Zakres:** **G1** — miganie poprzedniego kadru przy prev/next; skala obrazu (`min(intrinsic, viewport)`). **G2** — modal treściowy vs ikon; siatki i hover wg **D9** w `10-k2-lightbox.md`; **Wybrane ikony** — lightbox ikon. **G3** — Escape, regresje desktop; **K-38** iOS Safari — test OK 2026-10-03. Inline MDX → **k8**.

**Kryterium „gotowe”:** spełnione 2026-10-03. Szczegóły: **`docs/plans/10-k2-lightbox.md`**.

### Kawałek 3 — Aktualności (lista + pojedynczy wpis + IA)

**Zakres:** **K-69** (zapowiedź vs kronika, cykl roku, format przyszłych wpisów); **featured** zawsze na górze, **bez** `featuredUntil` (**zmienia K-73** — wpis do §4 planu żywego przy kawałku 3); refaktor szablonu **pojedynczego wpisu** (typografia, linki, layout bez cover); animacja scrollu do roku; wzorzec **`<NewsCta />`** w archiwalnych wpisach warsztatowych; **regresja helperów wystaw** współdzielonych ze stroną główną (przeniesione z k1 § Ryzyka).

**Kryterium „gotowe”:** decyzje K-69 zapisane w §4 lub w tym planie; reguły featured w kodzie i walidacji; szablon wpisu czytelny na mobile/desktop; reduced-motion respektowane.

**Po discovery (2026-10-03):** zakres rozszerzony o redesign szablonu wpisu wg nowej makiety, pole `layout`, usunięcie `poster`, „Powiązane”; podział na **k3a** technika (A2, A3, A6) · **k3b** model i dane (gate K-122) · **k3c** szablon wpisu (po makiecie) · **k3d** dokumentacja. Szczegóły: **`docs/plans/10-k3-news.md`**.

### Kawałek 4 — Strona główna

**Zakres:** **Wybrane ikony** — otoczka sekcji (H1: marginesy nagłówka, bez bocznych pasków); siatka justified + lightbox ikon → **kawałek 2** (D6). **Najbliższe** — IA (kafle vs aktualności) po K-69; hydratacja `Pillars` / `OfferLeadExtra` (DoD #8).

**Kryterium „gotowe”:** makieta lub zatwierdzenie właściciela na układ; brak overlay hydratacji w typowym `next dev` (lub udokumentowana znana przyczyna).

### Kawałek 5 — Album (`/publikacje` — podstrona albumu)

**Zakres:** TOC, usunięcie zbędnego spisu uczestników, przeniesienie autorów (P1, K-76 layout).

**Kryterium „gotowe”:** układ zgodny z uzgodnioną makietą; build OK.

### Kawałek 6 — Wykłady (krótki refaktor)

**Zakres:** hub + archiwum + spójność nawigacji (trasy nieobjęte DoD #8); powiązanie news `kind: wyklady` ↔ hub (otwarte p. 1–3 w `migrate-report.md` — kotwice sezonu, ewent. czytanie JSON w szablonie); **bez** pełnego CMS.

**Kryterium „gotowe”:** decyzje 1–3 zamknięte lub świadomie odłożone z wpisem w planie; hub/archiwum przejrzane na mobile/desktop.

### Kawałek 7 — Pozostały layout fali 1

**Zakres:** `/ikony` a11y miniatur (I1); oferty — „Dalsza droga”, duplikat `h2` LSS, style linków MDX (O1–O3); `/o-akademii` placeholder realizacji (S1); teaser zamówienia (S2); stopka K-36; opcjonalnie K-35, K-37 po gate.

**Kryterium „gotowe”:** checklista pozycji z § „Fala 1 — zadania” dla tych tras odhaczona lub przeniesiona do fali 2 z uzasadnieniem.

## Kawałki (fala 2)

### Kawałek 8 — Treść i gate EJK

**Zakres:** pozycje z § „Fala 2 — reszta” poniżej; gate K-122; aktualizacja `docs/plan-claude-code.md` §5 tam, gdzie zamyka się treść.

### Kawałek 9 — SEO, analityka, JSON-LD

**Zakres:** `docs/plan-claude-code.md` §3 etap 10 pkt 4; K-07, K-15, K-17, K-76 (Book/Article); polityka — analityka (K-119).

### Kawałek 10 — Audyty, ewaluacja tras, dokumentacja

**Zakres:** Lighthouse (`docs/lighthouse/`), przegląd wszystkich tras briefu §3; ewaluacja kodu (over-engineering); synchronizacja dokumentów; przygotowanie pod test 301 (staging → etap 11).

## Fala 1 — lista zadań (poprawki i refaktory)

Legenda: **P** poprawka · **R** refaktor · **IA** decyzja produktowa + Design.

### Globalnie

| ID | Typ | Zadanie | Status |
| --- | --- | --- | --- |
| G1 | P | Flash przy prev/next; cap skali (bez upscale ponad źródło) — `10-k2-lightbox.md` D1–D2 | ✅ |
| G2 | R | Siatki (D9), lupa, modal treści vs ikon, single-slide, Wybrane ikony — `10-k2-lightbox.md` D3–D7, D9 | ✅ |
| G3 | P | Escape, regresje desktop; iOS Safari (K-38) — test OK 2026-10-03 | ✅ |

### `/ikony/wystawy` (kawałek 1) — **W0–W5 ✅** (2026-10-03; szczegóły `10-k1-exhibitions.md`)

| ID | Typ | Zadanie | Status |
| --- | --- | --- | --- |
| W0 | R | Układ **K-127** (13a/14a + korekty **K1–K4**, odstępstwa od 14a → `10-k1-exhibitions.md`) | ✅ |
| W1 | R | P4 **Tura B** R1, R2, R7, R8 + audyt R3–R4 (R5, R6, R9 → k8) | ✅ (R3–R4 → gate k8) |
| W2 | IA+R | Sekcja wyjazdowa: K-87 vs „Wystawy specjalne” (k2) — nazwa, anchor, lista | ✅ |
| W3 | P | Zduplikowane `h2` „Informacje praktyczne” → `ExhibitionFactsPanel`, „W skrócie” | ✅ |
| W4 | R | Empty state slotów / brak zdjęć (`annual.json` bez `photos[]`) | ✅ |
| W5 | P | Kotwice w `NewsArticlePage` i `content/news/*` (R7) + smooth scroll | ✅ |

### `/` — strona główna (kawałek 4)

| ID | Typ | Zadanie |
| --- | --- | --- |
| H1 | R | Wybrane ikony — **otoczka** sekcji (bez bocznych pasków); siatka + lightbox → **k2 ✅** (k4 tylko marginesy/nagłówek) |
| H2 | IA+R | Sekcja „Najbliższe” — rola i źródło danych |
| H3 | P | Hydratacja `Pillars`, `OfferLeadExtra` |

### `/aktualnosci` (kawałek 3)

| ID | Typ | Zadanie | Status |
| --- | --- | --- | --- |
| A1 | IA | K-69 — zapowiedź vs kronika, cykl roku, format wpisów | ✅ discovery (D1–D11) |
| A2 | R | Featured na górze, bez `featuredUntil` | ✅ k3a |
| A3 | R | Animacja scrollu do roku (`prefers-reduced-motion`) | ✅ k3a |
| A4 | R | Szablon pojedynczego wpisu (typografia, linki, brak cover) | ✅ k3c + **k3e** (układ K3 v2.1, K-133, lead F11) |
| A5 | R | Wzorzec `<NewsCta />` w archiwalnych wpisach warsztatowych | ✅ k3b (K-122; CTA/Powiązane w k3c) |
| A6 | P | Regresja `getExhibitionUpcomingHighlight` / `getExhibitionNowNext` na `/` i linkach wpisów → `/ikony/wystawy` (wspólne helpery z k1) | ✅ k3a (`scripts/check-exhibition-states.ts`) |

### `/ikony` (kawałek 7)

| ID | Typ | Zadanie |
| --- | --- | --- |
| I1 | P | a11y — nazwy przycisków miniatur w siatce |

### `/publikacje` — album (kawałek 5)

| ID | Typ | Zadanie |
| --- | --- | --- |
| P1 | R | TOC, uczestnicy, umiejscowienie autorów |

### `/wyklady` (kawałek 6)

| ID | Typ | Zadanie |
| --- | --- | --- |
| L1 | R | Hub, archiwum, wykładowcy — layout i nawigacja |
| L2 | IA+R | News `kind: wyklady` ↔ hub (raport: otwarte 1–3) |

### Oferty, O nas, chrome (kawałek 7)

| ID | Typ | Zadanie |
| --- | --- | --- |
| O1 | R | Kurs — „Dalsza droga”, pusta kolumna |
| O2 | P | LSS — zduplikowane `h2` FactsBox |
| O3 | P | Style `mailto:` / `tel:` w MDX ofert |
| O4 | IA | K-37 sticky FactsBox; K-35 CTA w headerze (opcjonalnie) |
| S1 | R | O nas — układ „Wybrane realizacje” przy placeholderach |
| S2 | R | Teaser zamówienia bez zdjęcia (K-46) |
| C1 | R | Stopka — polish K-36 |

## Fala 2 — reszta (treść, weryfikacje, audyty)

Skrót klas — szczegóły w `docs/plan-claude-code.md` §5, `scripts/migrate-report.md` § EJK.

| Klasa | Przykłady |
| --- | --- |
| Galeria — dane | tytuły, `size`, `authorName`, technika, zgoda na nazwiska, wstęp uczniów |
| Aktualności — treść | `alt`, Trójca 2017, poświęcenia, program A3, plakaty → `images[]` wpisów (K-129) |
| Publikacje — treść | fragmenty, rozkładówki, „Jak powstał”, alt okładki |
| O nas / pracownia | realizacje, bio, rozmowa, portret; `archive/wp-fetch-static/` |
| Oferty — treść | hero zamówienia, cytat Piotra, e-mail sekretariat |
| LSŚ | Supraśl, Przemyśl, Wilno, Tbilisi — wpisy + `newsSlug` |
| Wystawy — media | zdjęcia doroczne (`AnnualExhibition.photos`) i kadry strony (`heroImage`, `permanentImage`, `permanentImage2`, `closingImage`) — w k1 placeholdery; szablony news per rok (po W0–W1) |
| Aktualności / MDX — inline | pojedyncze zdjęcia w treści do podpięcia lightboxa — inwentarz stron z EJK (**k8**, `10-k2-lightbox.md` D7) |
| Wystawy — copy | redakcja z EJK tekstów przyjętych z makiety K-127 (lead, doroczna, oprowadzania, wyjazdowe); zakres „wyjazdowe / gościnne” i lista miast |
| Wykłady — dane | unresolved lecturers w JSON 2012–2014 |
| SEO i analityka | metadata, sitemap, robots, JSON-LD, K-07 |
| Deploy-prep | Lighthouse, pełna checklista tras, test 301 staging |
| CMS wykładów | osobny projekt |

## Dane sample w tym etapie

Brak nowych plików `sample`. Ewentualne placeholdery `[do uzupełnienia]` z makiety — wpis do §5 planu żywego przy gate EJK.

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

- **K-69** — zamknięte 2026-10-03 (kierunek B, `10-k3-news.md` D1); H2 (k4) projektuje „Najbliższe” jako „co teraz” z kaflami do ofert.
- **R6 / brakujące newsy doroczne** — rozstrzygnięte: fala 2 (kawałek 8, treść EJK); kawałek 1 musi tylko sensownie obsłużyć brak relacji.
- **Wystawy wyjazdowe / gościnne — do przegadania z EJK:** zakres sekcji i brakujące wpisy (Supraśl, Tbilisi bez `newsSlug` w k1) — **kawałek 8**; w produkcie: „Wystawy wyjazdowe”, `#wyjazdowe`, lista ręczna w `page.mdx`.
- **K-07** Plausible vs Umami — fala 2.
- **Link fotorelacji** — filtr aktualności po wystawach (§3 etap 10) — osobna decyzja w kawałku 1 lub 3.
- **Prezentacja z klientem** — termin i staging (po kawałku 1 lub po fali 1).

## Postęp

| Kawałek | Status | Uwagi |
| --- | --- | --- |
| 1 — wystawy | ✅ | `10-k1-exhibitions.md` 1.1–1.4; W0–W5; korekty **K1–K4** (m.in. K4 margines wide mobile) |
| 2 — lightbox | ✅ | `10-k2-lightbox.md` zamknięty (G1–G3, D9); K-38 iOS OK 2026-10-03 |
| 3 — aktualności | ✅ | k3a–k3e 2026-10-03 (K-133, makieta v2.1); cykliczne → `docs/wpisy-cykliczne-aktualnosci-ejk.md` |
| 4 — home | ⬜ | |
| 5 — album | ⬜ | |
| 6 — wykłady | ⬜ | |
| 7 — reszta layoutu | ⬜ | |
| 8 — treść EJK | ⬜ | fala 2 |
| 9 — SEO / analityka | ⬜ | fala 2 |
| 10 — audyty / docs | ⬜ | fala 2 |
