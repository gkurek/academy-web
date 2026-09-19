# Plan 04b — Korekty po przeglądzie stagingu

Status: zamknięty 2026-09-19
Gałąź: feat/04b-review-fixes
Makiety: brak nowych. Ten pod-etap **świadomie odchodzi od makiety** w punktach wymienionych w „Decyzje" — każde odstępstwo ma numer K i po zatwierdzeniu trafia do rejestru w `docs/plan-claude-code.md` §4. Hierarchia dokumentów z `CLAUDE.md` bez zmian (plan pod-etapu > brief > makieta).

Źródło: przegląd `https://academy-web-lovat.vercel.app/` na 1920×917 (desktop) i 390 px (mobile), trasy: `/`, `/warsztaty`, `/warsztaty/kurs-roczny-i-trzyletni`, `/warsztaty/letnia-szkola-swiatla`, `/wyklady`, `/wyklady/archiwum`, `/wyklady/wykladowcy`. Nie oglądano: `/ikony/na-zamowienie` (ten sam szablon `OfferPage` — sprawdzić przy Kawałku 5).

> Nazwy plików w tym planie pochodzą z planów 01–04, nie z repo. Sesja planistyczna w Claude Code ma je zweryfikować i poprawić tabelę „Pliki i komponenty" przed „zapisz plan".

## Cel i zakres

Doprowadzić to, co już zbudowane (skeleton, home, oferta, wykłady), do jednego spójnego systemu, zanim pod-etap 5 (galeria) odziedziczy te same komponenty: `IconGrid`, skalę nagłówków, podpisy, rytm sekcji. W zakresie: bugi układu, skala typografii i role kolorów, stopka i `SectionNav`, rytm pionowy i szerokość kontenera, przepływ sprzedażowy (CTA dostępne w całym scrollu, domknięcie stron). Poza zakresem: przebudowa layoutu `/wyklady/wykladowcy` (backlog z planu 04 — tu tylko nagłówki i szerokość biogramu), treść i zdjęcia, `sizes` w `next/image` i wydajność (pod-etap 7), CTA „Zapisy" w nagłówku desktop (patrz K-35), analityka (K-15).

## Decyzje do podjęcia przed startem

Kawałek 1 nie zależy od żadnej decyzji i może ruszyć od razu. Pozostałe kawałki są zablokowane decyzjami z kolumny „Blokuje".


| #    | Decyzja                                              | Rekomendacja                       | Blokuje   | Twoja decyzja                                                                                                                                                                                                                                                                                                                               |
| ---- | ---------------------------------------------------- | ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| K-23 | Pierwsza pozycja `SectionNav`                        | Nazwa treści, nie sekcji           | Kawałek 3 | **Przyjęto** — opcja A; etykieta huba warsztatów „Przegląd"; mobile: poziomy z zawijaniem, równy odstęp między rzędami, cel dotyku 44 px                                                                                                                                                                                                    |
| K-24 | Układ stopki                                         | Wariant A (przebudowa)             | Kawałek 3 | **Przyjęto** — wariant B; układ bez zmian (4 kolumny), nagłówki grup jako linki, brakujące pozycje (`/pracownia`, „Galeria", „Bieżący sezon"), etykiety kontaktu w Plex tertiary; linki min. 44 px                                                                                                                                          |
| K-25 | Skala H2/H3, waga, tekst główny                      | Jedna skala, waga 400              | Kawałek 2 | **Przyjęto** — tabela ról z §K-25; waga 400; tag HTML wg kolejności w dokumencie; `--size-nav` 16 px; cele dotyku menu/`SectionNav` ≥ 44 px (rozmiar nav w Kawałku 2, tap targety w Kawałku 3)                                                                                                                                              |
| K-26 | Minimalny rozmiar Garamonda                          | 16,5 px; mniejsze etykiety do Plex | Kawałek 2 | **Przyjęto** — Garamond min. 16,5 px; etykiety poniżej → Plex 14,5 px; wyjątek logo: podtytuł 14 → 15 px desktop (mobile: weryfikacja przy 360 px)                                                                                                                                                                                          |
| K-27 | Role kolorów i detale spójności                      | Złoto = metadane                   | Kawałek 2 | **Przyjęto** — punkty 1–5: tak; punkt 6: full-bleed mobile zostaje (makieta `#3b` lin. 508–524 — siatka bez marginesu sekcji, tło kafli edge-to-edge)                                                                                                                                                                                       |
| K-28 | Szerokość linii (lead, tekst ciągły)                 | Lead 680 px, tekst 640 px          | Kawałek 4 | **Przyjęto** — lead maks. 680 px wszędzie; tekst ciągły i biogramy maks. 640 px; tokeny `--measure-lead`, `--measure-prose`                                                                                                                                                                                                                 |
| K-29 | Skala odstępów i rytm desktop                        | Kroki 80/96/120, sekcje co 96 px   | Kawałek 4 | **Przyjęto** — `--space-10/11/12` (80/96/120 px); desktop `--section-gap: 96px`; cytat home 120 px góra/dół; linie full-width tylko nagłówek/stopka/max. jedna cezura na stronę. **Świadome odstępstwo:** dolna linia cytatu (`rule-gold-b`) zostaje — cezura między cytatem a „Wybrane ikony" (odrzucona rekomendacja usunięcia po review) |
| K-30 | `content-max` na szerokich ekranach                  | 1280 px od 1600 px                 | Kawałek 4 | **Przyjęto** — `--content-max: 1280px` od 1600 px; ostatni krok Kawałka 4, zrzut przed/po; cofnięcie jedną linią jeśli gorzej                                                                                                                                                                                                               |
| K-31 | Kadrowanie ikon w `IconGrid`                         | `contain` na powierzchni kafla     | Kawałek 4 | **Przyjęto** — `object-contain` na `--surface-tile`, stała wysokość boksu; „Wybrane ikony" teraz; założenie wejściowe planu 05                                                                                                                                                                                                              |
| K-32 | Sticky `FactsBox` + pasek zamykający                 | Oba                                | Kawałek 5 | **Odrzucono 2026-09-19** — obie opcje (sticky + `ClosingCta`); layout bez zmian. **Świadoma decyzja (D-1, 2026-09-19):** brak CTA po scrollu — zapis tylko w `FactsBox` w nagłówku; sekcja „Jak się zapisać" bez przycisku; znany gap akceptowany. Sticky + opcjonalnie `ClosingCta` → pod-etap 7 (K-37) |
| K-33 | Home: nagłówek Najbliższe, hero, zakończenie, filary | Wszystkie cztery                   | Kawałek 5 | **Częściowo 2026-09-19** — punkty 1–3 (H2 „Najbliższe", filary → huby; hero: odstępstwo `min(920px, 76vh)` + siatka md+, bez wymogu foldu); punkt 4 (`ClosingCta` home) odrzucony razem z K-32                                                                                                                                                                                        |
| K-34 | Stan czasu w `LectureList`                           | Po stronie serwera, `revalidate`   | Kawałek 5 | **Odłożone 2026-09-19** — bez zmian; powrót po implementacji K-32 i K-33                                                                                                                                                                                                                                                          |
| K-35 | CTA „Zapisy" w nagłówku desktop                      | Nie w 04b                          | —         | **Przyjęto 2026-09-19** — poza 04b; backlog pod-etap 7 |


### K-23 — pierwsza pozycja `SectionNav` *(decyzja)*

**Decyzja: przyjęto 2026-09-19** — opcja A; etykieta huba warsztatów „Przegląd"; mobile: poziomy z zawijaniem, równy odstęp między rzędami, cel dotyku 44 px.

Stan: Warsztaty powtarzają nazwę sekcji („Warsztaty · Kurs… · Letnia…"), Wykłady nie („Bieżący sezon · Archiwum · Wykładowcy"). Na `/warsztaty` słowo „Warsztaty" pada trzy razy w 170 px (menu, `SectionNav`, H1), dwa złote podkreślenia jedno nad drugim.

- **Opcja A (rekomendowana):** pierwsza pozycja to zawsze hub, nazwany tym, co na nim jest. Wykłady: bez zmian. Ikony: „Galeria · Ikony na zamówienie". Warsztaty: „Przegląd · Kurs roczny i trzyletni · Letnia Szkoła Światła".
- Opcja B: wszędzie nazwa sekcji („Wykłady · Archiwum · Wykładowcy" — jak w makiecie). Spójne, ale utrwala potrójne powtórzenie.
- Opcja C: jak A, ale na samym hubie `/warsztaty` `SectionNav` ukryty (dubluje dwie karty pod spodem). Odradzam: stałe miejsce nawigacji jest ważniejsze dla odbiorcy 65+.

Pod-decyzja: etykieta huba warsztatów — „Przegląd" (rekomendacja; neutralne, zrozumiałe) czy „Obie ścieżki" (nawiązuje do leadu, ale mniej oczywiste poza kontekstem).

Pod-decyzja mobile: `SectionNav` zostaje poziomy z zawijaniem, z równym odstępem między rzędami i celem dotyku 44 px (rekomendacja) — czy pionowa lista. Pionowa lista to 3×44 px przed każdym H1; poziome przewijanie odpada (brief §4.1: nawigacja nieukryta).

Skutek dla dokumentów: `brief-claude-code.md` §3 (etykiety Warsztaty/Ikony), `src/navigation.ts`, stopka używa tych samych etykiet.

### K-24 — układ stopki *(decyzja)*

**Decyzja: przyjęto 2026-09-19, zmieniono na wariant B 2026-09-19** — układ bez zmian (4 kolumny desktop, jedna kolumna mobile); nagłówki grup (Warsztaty, Wykłady, Ikony) jako linki do hubów; brakujące pozycje (`/pracownia`, „Galeria", „Bieżący sezon"); etykiety kontaktu w Plex tertiary zamiast złotego Garamonda; linki min. 44 px; social w pasku dolnym (jak w makiecie). **Design stopki (układ desktop/mobile, rozkład kolumn, social) — do dopracowania w pod-etapie 7** (K-36).

Stan: nagłówki grup „Warsztaty", „Wykłady", „Ikony" to `div`, nie linki → ze stopki nie da się wejść na `/warsztaty`, `/wyklady`, `/ikony`; brak `/pracownia`. Sprzeczne z brief §4.1 („pełna mapa strony"). Ten sam styl (złoty Garamond 15 px) oznacza grupy kontaktu i grupy mapy — „Warsztaty i ikony" stoi obok „Warsztaty". Górny rząd poszarpany (kolumna 3 zaczyna się zwykłym linkiem). Pasek dolny dosunięty do lewej. Mobile: linki 20–27 px wysokości przy `--tap-min: 48px`.

- **Wariant A (rekomendowany):**

```
AKADEMIA IKONY            Akademia      Warsztaty →     Wykłady →       Ikony →
adres, dostępność         O Akademii    Kurs roczny…    Bieżący sezon   Galeria
Facebook · YouTube · Blog Pracownia     Letnia Szkoła   Archiwum        Na zamówienie
                          Wydarzenia                    Wykładowcy
Kontakt →                 Aktualności
Warsztaty i ikony: mail, tel, EJK       Publikacje
Wykłady: mail, M. Lubak
──────────────────────────────────────────────────────────────────────
© 2026 · Organizator: fundacja IKONA DZIŚ               Polityka prywatności
```

  Nagłówki grup są linkami do hubów (złoty Garamond zostaje tylko dla nich). Etykiety kontaktów w Plex, kolor tertiary. Social pod marką. Pasek dolny rozłożony lewo/prawo.

- Wariant B (minimum): układ bez zmian, tylko nagłówki grup jako linki + brakujące pozycje + inny styl etykiet kontaktu. Naprawia dostępność hubów, nie naprawia poszarpanego rzędu.

Pod-decyzja mobile: mapa strony w dwóch kolumnach (Akademia + Warsztaty | Wykłady + Ikony), każdy link `min-height: 44px`, bez akordeonu (rekomendacja — stopka to nawigacja ratunkowa, ma być widoczna bez klikania i bez JS) — czy akordeon jak w szufladzie menu.

Pod-decyzja tło: `--surface-footer` (`#120e0b` na `#18130f`) jest niewidoczne. Rekomendacja: `#0d0a08` (`--umbra-1000`); alternatywa: usunąć tło, zostawić samą linię.

### K-25 — skala nagłówków i tekstu *(decyzja; odstępstwo od wartości w makiecie)*

**Decyzja: przyjęto 2026-09-19** — jedna tabela ról poniżej; waga 400; tag HTML wg kolejności nagłówków w dokumencie (nie wg rozmiaru); `--size-nav` 16 px; cele dotyku linków menu i `SectionNav` ≥ 44 px (rozmiar nav — Kawałek 2, tap targety — Kawałek 3).

Stan: H2 w czterech rozmiarach (34 / 30 / 28 / 24), waga 500 w `OfferCard` i `LecturerCard` wbrew `design/README` („nagłówki zawsze 400"), H3 semestrów 17,5 px (mniejszy optycznie niż tekst), tekst główny na stronie kursu w czterech rozmiarach (19,5 / 17 / 17,5 / 16,5; 17 px spoza skali).

Rekomendacja — jedna tabela ról:


| Rola                | Desktop    | Mobile | Gdzie                                                                                                      |
| ------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| H2 sekcji           | 34         | 26     | Wybrane ikony, Głosy uczestników, Program sezonu, **Program kursu**, **Jak się zapisać**, Archiwum sezonów |
| Tytuł karty         | 28         | 24     | filary, `OfferCard`, `LecturerCard`                                                                        |
| Tytuł boksu         | 24         | 22     | `FactsBox`                                                                                                 |
| Tytuł wiersza/kafla | 21         | 19     | semestry, kafle Najbliższe (zmiana na szeryf), kroki `StepList`                                            |
| Tytuł w liście      | 18,5       | 18     | `LectureList` (bez zmian — długie tytuły)                                                                  |
| Tekst ciągły        | 17,5 / 1,7 | 16,5   | body MDX, „Jak się zapisać"                                                                                |
| Tekst UI i kart     | 16,5 / 1,6 | 16,5   | karty, listy, `FactsBox`                                                                                   |


Waga 400 wszędzie. Tag HTML dobierany do kolejności nagłówków, nie do rozmiaru (precedens: `Pillars` w pod-etapie 2).

Do tej samej decyzji: `--size-nav` 15 → 16 px i cel kliknięcia linków menu/`SectionNav` ≥ 44 px (dziś 26–27 px).

### K-26 — minimalny rozmiar EB Garamond *(decyzja; zmiana zapisu w briefie)*

**Decyzja: przyjęto 2026-09-19** — Garamond nie schodzi poniżej 16,5 px; daty, meta i podpisy 16,5–17 px; etykiety, które muszą zostać małe → Plex 14,5 px; wyjątek marki: podtytuł logo 14 → 15 px desktop (mobile bez zmian po sprawdzeniu przy 360 px). Dopisek do `brief-claude-code.md` przy zamknięciu pod-etapu.

Stan: `brief-claude-code.md` dopuszcza 14 px desktop / 15 px mobile. Garamond ma małą wysokość x — 14–15 px wygląda jak 13 px w Plex. Dotyczy: daty w kaflach Najbliższe (15), podpisy ikon (15), etykiety grup w stopce (15), meta w `OfferCard` (15), podtytuł logo (14).

- **Rekomendacja:** Garamond nie schodzi poniżej 16,5 px. Daty, meta i podpisy → 16,5–17 px. Jeśli etykieta ma zostać mała — przechodzi do Plex 14,5 px. Wyjątek: podtytuł logo (element marki) 14 → 15 px desktop, mobile bez zmian po sprawdzeniu, czy mieści się obok hamburgera na 360 px.
- Alternatywa: zostawić rozmiary, zmienić tylko kolor na jaśniejszy. Nie rozwiązuje problemu.

Skutek: dopisek w `brief-claude-code.md` („minimum 14/15 px dotyczy Plex; Garamond min. 16,5 px").

### K-27 — role kolorów i detale spójności *(decyzja, pakiet)*

**Decyzja: przyjęto 2026-09-19** — punkty 1–5: tak. Punkt 6: full-bleed na mobile zostaje jako świadomy wyjątek — makieta `#3b` (strona główna mobile, lin. 508–524): siatka „Najbliższe" bez `padding` bocznego sekcji (tło kafli od krawędzi do krawędzi); filary i „Wybrane ikony" w tej samej makiecie mają margines 20 px.

Rekomendacja dla każdego punktu — „tak":

1. Złoto = metadane (data, rok, sezon), jasny = tytuł. `SeasonAccordion` dziś odwrotnie (rok jasny, tytuł cyklu złoty) — odwrócić.
2. Jedno złoto dla tekstu: `--accent-text` (`#e8c765`). `--accent` (`#c9a227`) tylko dla wypełnień i linii. Dziś daty na home mają `#c9a227`, w programie `#e8c765`.
3. Belka akcentowa: 2 px wszędzie (dziś `FactsBox` 3 px, cytaty 2 px).
4. Otwarty sezon w archiwum: nagłówek z `--surface-card` i złotą belką 2 px z lewej, wiersze w środku z wcięciem `--tile-px` — żeby było widać, gdzie kończy się sezon.
5. Nadtytuł sezonu na wszystkich stronach ofertowych, nie tylko na wykładach: „Warsztaty · sezon 2026/2027", „Plener 2027" — z `facts.seasonLabel` + string w `pl.ts`.
6. Kafle Najbliższe na mobile: dziś od krawędzi do krawędzi, reszta siatek kafli ma margines 20 px. Sprawdzić makietę `#3b`: jeśli full-bleed jest tam świadomy — zostaje i wpisujemy jako wyjątek; jeśli nie — margines 20 px.

### K-28 — szerokość linii *(decyzja)*

**Decyzja: przyjęto 2026-09-19** — lead maks. 680 px wszędzie; tekst ciągły i biogramy maks. 640 px; tokeny `--measure-lead`, `--measure-prose`.

Stan: lead 616 px (oferta), 741 px (hub warsztatów), 1068 px (archiwum, wykładowcy — ok. 105 znaków w linii); biogram 744 px. Token `--measure: 34em` istnieje, ale nie jest stosowany konsekwentnie.

- **Rekomendacja (przyjęta):** lead maks. 680 px wszędzie; tekst ciągły i biogramy maks. 640 px. Nowe tokeny `--measure-lead`, `--measure-prose`.
- Alternatywa (odrzucona): zostawić pełną szerokość leadu na stronach bez `FactsBox`, ograniczyć tylko biogramy.

### K-29 — skala odstępów i rytm pionowy na desktopie *(decyzja; rozszerzenie tokenów z `design/README`)*

**Decyzja: przyjęto 2026-09-19** — `--space-10/11/12` (80/96/120 px); desktop (≥ 1024 px) `--section-gap: 96px`; cytat na home 120 px góra/dół; mobile bez zmian; linie full-width tylko nagłówek, stopka i max. jedna cezura na stronę.

**Świadome odstępstwo (2026-09-19):** dolna linia cytatu na home (`rule-gold-b` w `Testimonial.tsx`) **zostaje** — po implementacji i przeglądzie linia między cytatem a „Wybrane ikony" poprawia podział sekcji. Pierwotna rekomendacja (usunąć, żeby ograniczyć liczbę linii na ~650 px scrolla) odrzucona przez właściciela repo.

Stan: skala kończy się na 56 px (`space-8` = 52 i `space-9` = 56 to praktycznie ten sam krok), `--section-gap` = 60. Przy 1920 px po bokach jest 426 px powietrza, a między sekcjami 34–60 px. Cytat na home ma 52 px paddingu.

- **Rekomendacja (przyjęta):** dodać `--space-10: 80px`, `--space-11: 96px`, `--space-12: 120px`. Desktop (≥ 1024 px): `--section-gap: 96px`; cytat na home 120 px góra/dół. Mobile bez zmian.
- Linie na całą szerokość: zostają dla nagłówka, stopki i najwyżej jednej cezury na stronę. Na home pierwotnie rekomendowano usunięcie dolnej linii cytatu (dziś trzy linie na ok. 650 px) — **odrzucone; linia zostaje** (patrz świadome odstępstwo powyżej).

### K-30 — `content-max` na szerokich ekranach *(decyzja)*

**Decyzja: przyjęto 2026-09-19** — `--content-max: 1280px` od 1600 px szerokości okna; ostatni krok Kawałka 4, zrzut przed/po w meldunku; cofnięcie jedną linią jeśli wygląda gorzej.

- **Rekomendacja (przyjęta):** `--content-max: 1280px` od 1600 px szerokości okna; tekst trzyma K-28, więc się nie wydłuża — zyskują siatki (filary, ikony, karty, przyszła galeria). Robione jako ostatni krok Kawałka 4, z osobnym zrzutem przed/po w meldunku; jeśli wygląda gorzej — cofamy jedną linią.
- Alternatywa (odrzucona): zostawić 1180 px i wrócić do tematu po galerii (pod-etap 5), która skorzysta najbardziej.

### K-31 — kadrowanie ikon w `IconGrid` *(decyzja — przed pod-etapem 5)*

**Decyzja: przyjęto 2026-09-19** — `object-contain` na tle `--surface-tile`, stała wysokość boksu; „Wybrane ikony" na home teraz; ta sama reguła jako założenie wejściowe planu 05.

Stan: boks 251×290 z `object-cover` tnie kompozycje (Przemienienie, Św. Antoni). Ikona to zamknięta kompozycja z własnym marginesem i napisami.

- **Rekomendacja (przyjęta):** `object-contain` na tle `--surface-tile`, stała wysokość boksu. Dla „Wybrane ikony" na home teraz; ta sama reguła jako założenie wejściowe planu 05.
- Alternatywa (odrzucona): proporcje kafla z obrazu (układ murarski) — ładniejsze, ale to decyzja na sesję planistyczną 05, nie tutaj.

### K-32 — sticky `FactsBox` i pasek zamykający *(decyzja; odstępstwo od makiety `#1a-oferta`)*

**Decyzja: odrzucono 2026-09-19** — obie opcje rekomendacji (sticky `FactsBox` + `ClosingCta`); layout ofertowy bez zmian. Po prototypie na stagingu: sticky odrzucone; `ClosingCta` wycofane razem ze sticky. **Świadoma decyzja D-1 (2026-09-19):** brak CTA po scrollu — zapis tylko w `FactsBox` w nagłówku strony; sekcja „Jak się zapisać" bez przycisku; znany gap akceptowany. **Sticky + opcjonalnie `ClosingCta` → ponowne rozważenie w pod-etapie 7** (K-37).

Stan: `FactsBox` ma 700–800 px, lewa kolumna obok niego ok. 300 px → ok. 490 px pustki na kursie i plenerze. Po przewinięciu boksu nie ma CTA: na `/wyklady` przez 1850 px programu aż do stopki; w „Jak się zapisać" na kursie w DOM nie ma przycisku (do potwierdzenia w kodzie).

- **Rekomendacja — oba elementy:**
  1. Desktop ≥ 1024 px: dwie kolumny przez całą stronę (`OfferPage` i `LecturesHubPage`): treść po lewej, `FactsBox` po prawej z `position: sticky; top: 24px`. Warunek: `@media (min-height: 880px)` — boks wyższy niż okno nie może być sticky, bo utnie CTA; poniżej tej wysokości zostaje statyczny. Dodatkowo zagęścić wiersze `dl` (boks ok. 640 px).
  2. Nowy komponent `ClosingCta` na końcu każdej strony ofertowej i `/wyklady`: jedno zdanie z `facts` (cena lub termin) + ten sam przycisk `mailto:` co w `FactsBox` (ten sam temat — brief §7) + telefon. Na mobile to jedyne CTA po przewinięciu boksu.
- Skutek uboczny: duże zdjęcie na kursie (dziś 1068 px) zwęża się do kolumny treści. Jeśli ma zostać szerokie — zdjęcie przed siatką dwukolumnową, pod leadem.
- Alternatywa: tylko `ClosingCta`, bez sticky. Tańsze, nie usuwa pustki obok boksu.

Do tej samej decyzji — przycisk pleneru w stanie zamkniętym: dziś całe zdanie w trzech liniach. Rekomendacja: zdanie „Nabór rusza w marcu 2027." jako tekst nad przyciskiem, przycisk „Powiadom mnie o naborze" (oba stringi w `pl.factsBox`; temat `mailto:` bez zmian).

### K-33 — strona główna *(decyzja, pakiet; częściowo zmienia K-13)*

**Decyzja: częściowo 2026-09-19** — punkty 1–3 przyjęte (H2 „Najbliższe", filary jako cała karta → huby; hero: odstępstwo `min(920px, 76vh)`, **opcja A** — bez wymogu foldu, potwierdzone 2026-09-19); punkt 4 (`ClosingCta` home) odrzucony razem z K-32.

1. **Hero:** pierwotna rekomendacja review (skrócenie sekcji): `min(760px, 68vh)` zamiast stałych 760 px — problem na stagingu: sekcja 921 px przy oknie 917 px, „Najbliższe" w całości pod foldem.
   **Decyzja wdrożeniowa (2026-09-19, opcja A — potwierdzona po ewaluacji):** zostaje **większy obraz** i obecna siatka — nie wracamy do `min(760px, 68vh)`. Tokeny: `--hero-image-h: min(920px, 76vh)`, kolumna obrazu do 500 px, wyrównanie do prawej na desktop / wyśrodkowanie na mobile, mobile 72% szerokości (makieta 62%); siatka `md+`: kolumna tekstu min. 300 px (`--hero-text-min`), kolumna obrazu kurczy się pierwsza (bez poziomego scrolla między `md` a mobile). **Kafle „Najbliższe" nad foldem przy 1920×917 nie są wymagane** — świadoma decyzja: priorytet ma czytelność ikony. Pomiar po implementacji (lokalnie, content-max 1280): sekcja hero ~861 px (wcześniej 921 px), obraz 697×368 px, H2 „Najbliższe" od y≈945 (ok. 28 px pod foldem).
2. **Nagłówek sekcji Najbliższe:** jedyna sekcja bez tytułu. Rekomendacja: widoczny H2 „Najbliższe" w rozmiarze tytułu kafla (21–24 px, nie 34) — porządkuje też kolejność nagłówków.
3. **Filary:** cała karta (zdjęcie + tytuł + opis) jako jeden cel kliknięcia. Pod-decyzja: filar „Warsztaty" prowadzi dziś do kursu, pozostałe dwa do hubów. Rekomendacja: wszystkie trzy do hubów, etykieta linku „Kurs i plener".
4. **Zakończenie strony:** `ClosingCta` w wariancie home — zdanie o miejscu (Kościół Środowisk Twórczych, Plac Teatralny; fakt z brief §8) + dwa CTA jak w hero. Bez mapy — K-13 zostaje w mocy co do `MapBlock`. Rekomendacja: tak.

### K-34 — stan czasu w programie wykładów *(decyzja; wpływa na K-09 hosting)*

**Decyzja: odłożone 2026-09-19** — bez zmian w tym pod-etapie; powrót po implementacji i obejrzeniu K-32 i K-33.

Cel: najbliższe spotkanie wyróżnione (złota belka z lewej, etykieta „najbliższy wykład"), minione przygaszone (`--text-tertiary`), przyszłe bez zmian.

- **Rekomendacja:** obliczane po stronie serwera w `LecturesHubPage`, `export const revalidate = 3600`. Zero JS, brak mignięcia. Wymaga hostingu z ISR (Vercel, dowolny Node) — wyklucza czysty eksport statyczny; dopisać do K-09.
- Alternatywa: mały komponent kliencki liczący stan po załadowaniu. Działa na każdym hostingu, ale wyróżnienie pojawia się z opóźnieniem.

Bez decyzji (zgodne z K-21): nazwisko prowadzącego w `LectureList` jest linkiem do `/wyklady/wykladowcy#slug` tylko wtedy, gdy ma profil w `lecturers.json`.

### K-35 — CTA „Zapisy" w nagłówku desktop *(decyzja)*

Szuflada mobilna ma blok CTA, desktop nie. **Rekomendacja: nie w 04b.** Przycisk musiałby wiedzieć, dokąd prowadzić poza okresem naboru; wrócić do tematu w pod-etapie 7, kiedy będą dane z analityki. Wpisać do backlogu.

## Pliki i komponenty


| Plik                                                                                      | Nowy/zmiana | Odpowiedzialność w tym pod-etapie                                                                                                                                                            |
| ----------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/globals.css`                                                                     | zmiana      | Tokeny: `--space-10…12`, `--section-gap` desktop, `--measure-lead/-prose`, skala ról z K-25, `--content-max` ≥ 1600, `--hero-image-h` jako `min()`, stała kolumna cyfr semestrów, belka 2 px |
| `src/navigation.ts`                                                                       | zmiana      | Etykiety pierwszej pozycji `SectionNav` (K-23); mapa stopki: huby jako linki, `/pracownia`, „Galeria", „Bieżący sezon"                                                                       |
| `src/i18n/pl.ts`                                                                          | zmiana      | Nowe stringi: `ClosingCta`, nadtytuły sezonu, „Najbliższe", „najbliższy wykład", przycisk pleneru, etykiety stopki                                                                           |
| `src/components/navigation/Footer.tsx`                                                    | zmiana      | Wariant B (K-24): oryginalny układ 4 kolumn, huby jako linki, etykiety kontaktu Plex, cele dotyku 44 px                                                                                      |
| `src/components/navigation/SectionNav.tsx`                                                | zmiana      | Zawijanie z równym odstępem, cel 44 px                                                                                                                                                       |
| `src/components/navigation/Header.tsx`                                                    | zmiana      | Rozmiar i cel kliknięcia linków menu                                                                                                                                                         |
| `src/components/navigation/HeaderMobileMenu.tsx`                                          | zmiana      | Szuflada jako nakładka: `position: fixed`, pełna wysokość, blokada scrolla, Esc zamyka, fokus wraca na hamburger                                                                             |
| `src/components/content/ClosingCta.tsx`                                                   | nowy        | Pasek zamykający; warianty: oferta (z `OfferFacts`) i home                                                                                                                                   |
| `src/components/content/OfferPage.tsx`                                                    | zmiana      | Dwie kolumny przez całą stronę, sticky `FactsBox`, nadtytuł sezonu, `ClosingCta`                                                                                                             |
| `src/components/content/FactsBox.tsx`                                                     | zmiana      | Gęstsze wiersze, belka 2 px, stan zamknięty: tekst + krótki przycisk                                                                                                                         |
| `src/components/content/OfferCard.tsx`                                                    | zmiana      | Tytuł 28/400                                                                                                                                                                                 |
| `src/components/content/SemesterProgram.tsx`                                              | zmiana      | Stała kolumna cyfr, tytuł 21 px; opcjonalnie etykiety „Rok pierwszy…" nad wierszami                                                                                                          |
| `src/components/offers/OfferQuoteGrid.tsx`, `src/app/warsztaty/page.tsx`                  | zmiana      | Odstęp nad „Głosy uczestników" i pod sekcją                                                                                                                                                  |
| `src/components/content/Hero.tsx`                                                         | zmiana      | Wysokość obrazu przez `min()`; świadome odstępstwa od makiety — patrz K-33 pkt 1                                                                                                                                                                |
| `src/components/home/UpcomingHighlights.tsx`                                              | zmiana      | H2 sekcji, tytuły kafli szeryfem 21 px, data `--accent-text` 16,5 px                                                                                                                         |
| `src/components/home/Pillars.tsx`                                                         | zmiana      | Cała karta klikalna; cel filaru „Warsztaty"                                                                                                                                                  |
| `src/components/content/Testimonial.tsx`                                                  | zmiana      | Padding 120 px desktop, bez dolnej linii                                                                                                                                                     |
| `src/components/home/FeaturedIcons.tsx`, `src/components/gallery/IconGrid.tsx`            | zmiana      | Interlinia H2, `object-contain`, podpisy 16,5 px                                                                                                                                             |
| `src/components/content/LectureList.tsx`                                                  | zmiana      | Stany minione/najbliższe/przyszłe, linki do wykładowców                                                                                                                                      |
| `src/components/lectures/LecturesHubPage.tsx`                                             | zmiana      | `FactsBox` pod leadem na mobile, sticky na desktop, `revalidate`, `ClosingCta`                                                                                                               |
| `src/components/content/SeasonAccordion.tsx`                                              | zmiana      | Role kolorów, stan otwarty                                                                                                                                                                   |
| `src/components/content/LecturerCard.tsx`, `LecturersPage.tsx`, `LecturesArchivePage.tsx` | zmiana      | Tag i waga nagłówka, szerokość biogramu i leadu                                                                                                                                              |
| `src/app/page.tsx`                                                                        | zmiana      | `ClosingCta` przed stopką                                                                                                                                                                    |
| `docs/brief-claude-code.md`, `docs/plan-claude-code.md`                                   | zmiana      | Synchronizacja po zamknięciu: §3 etykiety `SectionNav`, zapis o minimalnym rozmiarze tekstu, rejestr K-23…K-35, wiersz 4b w tabeli pod-etapów                                                |


## Kawałki

### Kawałek 1 — Bugi układu (bez decyzji, można zacząć od razu)

Zakres:

- `/warsztaty`: odstęp 0 px między kartami a H2 „Głosy uczestników" (karty kończą się na y = 1042, H2 zaczyna na 1041) → `--section-gap`; pod sekcją 26 px → `--section-gap`.
- „Wybrane ikony": H2 dziedziczy interlinię 1,6 z body → `leading-heading` (1,2).
- `SemesterProgram`: kolumna cyfr rzymskich o stałej szerokości (dziś I = 12 px, III = 35 px, tytuły zaczynają się na x = 478 i 501).
- Waga 500 → 400 w `OfferCard` (H2) i `LecturerCard` (H3).
- `/wyklady/wykladowcy`: H3 bezpośrednio pod H1 → tag `h2`, wygląd bez zmian (precedens `Pillars`).
- `/wyklady` mobile: `FactsBox` bezpośrednio pod leadem, przed drugim akapitem (zgodnie z planem 03).
- Sprawdzić i zgłosić w meldunku: czy sekcja „Jak się zapisać" na kursie ma przycisk CTA (w DOM stagingu go nie widać).

Kryterium „gotowe": każdy punkt potwierdzony pomiarem `getBoundingClientRect()` lub `getComputedStyle()` w meldunku (wartość przed → po); Lighthouse `heading-order` czysty na `/wyklady/wykladowcy`; build/lint OK.

### Kawałek 2 — Typografia i role kolorów (K-25, K-26, K-27)

Zakres: tokeny ról z tabeli K-25 w `globals.css` + mapowanie w `@theme inline`; podmiana klas rozmiaru w komponentach z tabeli plików; Garamond ≥ 16,5 px (daty, meta, podpisy, stopka) lub przejście etykiety do Plex; `--accent-text` dla całego złotego tekstu; belka 2 px; `SeasonAccordion` — role kolorów i stan otwarty; nadtytuł sezonu na kursie i plenerze; tekst ciągły 17,5/1,7, usunięcie 17 px spoza skali; `--size-nav` 16 px.

Kryterium „gotowe": w meldunku tabela „komponent → rozmiar/waga przed → po" z pomiarów; `grep` po wartościach spoza skali (`17px`, `30px`, `font-medium` w nagłówkach) pusty; kontrast złotego tekstu 16,5 px na `--surface-tile` ≥ 4,5:1; zrzuty home, kursu, `/wyklady`, archiwum (otwarty sezon) na 1440 px i 390 px.

### Kawałek 3 — Nawigacja: stopka, `SectionNav`, szuflada (K-23, K-24)

Zakres: `src/navigation.ts` (etykiety, mapa stopki); `Footer` desktop wg zatwierdzonego wariantu i mobile z celami 44 px; `SectionNav` — etykiety, zawijanie, cel 44 px; `Header` — cel kliknięcia linków; `HeaderMobileMenu` — nakładka z blokadą scrolla (dziś szuflada rozpycha stronę i pod nią widać `SectionNav`).

Kryterium „gotowe": każda trasa statyczna z brief §3 osiągalna ze stopki (skrypt lub ręczna lista w meldunku); wszystkie linki stopki i `SectionNav` na 390 px mają wysokość ≥ 44 px (pomiar); szuflada: Tab nie wychodzi pod nakładkę, Esc zamyka, fokus wraca na hamburger, `prefers-reduced-motion` respektowany; na `/warsztaty` nazwa sekcji nie powtarza się w `SectionNav`.

### Kawałek 4 — Rytm, szerokości, ikony (K-28, K-29, K-30, K-31)

Zakres: tokeny `--space-10…12`, `--section-gap` 96 px od 1024 px; cytat na home 120 px, bez dolnej linii; zasada linii na całą szerokość (nagłówek, stopka, maks. jedna cezura na stronę) — przegląd wszystkich `rule-*`; `--measure-lead` / `--measure-prose` na leadach, body MDX, biogramach; `IconGrid` — `object-contain`; na końcu, osobnym commitem: `--content-max: 1280px` od 1600 px.

Kryterium „gotowe": zrzuty przed/po dla home i kursu na 1920, 1440, 1280 i 390 px; żaden akapit tekstu ciągłego szerszy niż 640 px (pomiar); mobile bez zmian w rytmie (porównanie wysokości dokumentu: home 4722 px, kurs 4476 px ± zmiany z Kawałków 1–3); decyzja o `content-max` potwierdzona lub cofnięta w checkpoincie.

### Kawałek 5 — Przepływ sprzedażowy (K-33 częściowo; K-32 odrzucone; K-34 odłożone)

Zakres: home — hero `min()`, H2 Najbliższe, filary klikalne w całości → huby. **Poza zakresem (odrzucone K-32):** sticky `FactsBox`, `ClosingCta`, dwukolumnowy layout przez całą stronę, zagęszczenie boksu, skrócony przycisk pleneru. **Poza zakresem (K-34 odłożone):** stany czasu w `LectureList`, `revalidate` na `/wyklady`.

Kryterium „gotowe": hero — tokeny K-33 pkt 1 (odstępstwo `min(920px, 76vh)`), pomiar przy 1920×917 w załączniku; **kafle „Najbliższe" nad foldem nie są wymagane** (decyzja A, 2026-09-19). H2 „Najbliższe", filary → huby. **Nieaktualne po odrzuceniu K-32:** sticky CTA w scrollu, `ClosingCta`, tematy `mailto:` w `ClosingCta`. **Odłożone (K-34):** stan „najbliższy wykład". Wszystkie nowe stringi UI w `pl.ts`.

## Dane sample dodawane w tym pod-etapie

Brak nowych plików `sample`. Nowe stringi w `pl.ts` (`ClosingCta`, etykiety, nadtytuły) to UI, nie treść redakcyjna; zdanie o miejscu w `ClosingCta` na home składa się z faktów z `SiteSettings` (brief §8). Jeśli zdanie z ceną/terminem w `ClosingCta` okaże się treścią redakcyjną per oferta — pole w frontmatter `content/offers/*.mdx`, oznaczone `sample`, dopisać do `docs/plan-claude-code.md` §5.

## Kryteria ukończenia pod-etapu

- [x] wszystkie punkty Kawałka 1 potwierdzone pomiarem
- [x] jedna skala ról typograficznych w `globals.css`; brak wagi 500 w nagłówkach; brak Garamonda < 16,5 px poza logo
- [x] każda trasa statyczna osiągalna ze stopki; cele dotyku stopki i `SectionNav` ≥ 44 px na 390 px (w tym `mailto:`/`tel:` — Kawałek 6)
- [x] szuflada mobilna jako nakładka, obsługa klawiatury sprawdzona w przeglądarce (nie tylko w teście automatycznym — precedens z pod-etapu 2)
- [x] ~~CTA zapisu dostępne na końcu każdej strony ofertowej i `/wyklady`~~ **N/A** — świadoma decyzja D-1 (2026-09-19): brak CTA po scrollu; zapis tylko w `FactsBox`; powrót do tematu w pod-etapie 7 (K-37)
- [x] Lighthouse dostępność ≥ 95 na `/`, `/warsztaty/kurs-roczny-i-trzyletni`, `/wyklady`, `/wyklady/wykladowcy` (mobile) — 100/100 (Kawałek 7)
- [x] decyzje K-23…K-35 wpisane do `docs/plan-claude-code.md` §4; `brief-claude-code.md` zsynchronizowany; wiersz „4b" w tabeli pod-etapów
- [x] założenia dla planu 05 zapisane: reguła kadrowania ikon (K-31), rozmiar podpisów, `content-max`

## Założenia wejściowe dla planu 05 (z 04b)

Przenieść do sesji planistycznej `docs/plans/05-galeria.md`:

- **Kadrowanie ikon (K-31):** `object-contain` na tle `--surface-tile`, stała wysokość boksu kafla — ta sama reguła co „Wybrane ikony" na home (`IconGrid.tsx`).
- **Podpisy pod ikonami:** Garamond min. 16,5 px (K-26); meta/datowe → `--accent-text`.
- **Szerokość layoutu (K-30):** `--content-max: 1280px` od 1600 px okna — siatki galerii korzystają z szerszego kontenera; tekst ciągły nadal `--measure-prose` 640 px.
- **Skala H2 sekcji (K-25):** nagłówek sekcji galerii w roli H2 sekcji (34/26 px, waga 400).

## Ryzyka i pytania otwarte

- **Sticky `FactsBox` na niskich oknach.** Laptopy 1366×768 są częste w tej grupie odbiorców; warunek `min-height` jest obowiązkowy, nie opcjonalny. Sprawdzić też powiększenie przeglądarki 125–150% (odbiorca 65+), które zmniejsza efektywną wysokość okna.
- `**revalidate` a hosting (K-09).** Jeśli hosting ma być statyczny, K-34 przechodzi na wariant kliencki.
- **Zakres.** Pięć kawałków dotyka prawie każdego komponentu. Jeśli sesja się wydłuża — `/clear` między kawałkami 2/3 i 4/5; Kawałki 3 i 4 są od siebie niezależne i można je zamienić kolejnością.
- **Prawdziwa treść może zmienić ocenę pustki.** Dziura obok `FactsBox` jest mierzona na treściach `sample`. Sticky rozwiązuje ją niezależnie od długości treści, dlatego jest rekomendowany zamiast „poczekajmy na migrację".
- **Nieobejrzane:** `/ikony/na-zamowienie`, stany hover/fokus nowych celów kliknięcia (filary jako cała karta — fokus ma obejmować kartę, nie sam tytuł), tablet 768–1023 px (żaden przegląd dotąd go nie objął — dodać jeden zrzut na kawałek).
- **Poza zakresem, do backlogu:** CTA w nagłówku desktop (K-35); **sticky `FactsBox` (+ opcjonalnie `ClosingCta`) — ponowne rozważenie w pod-etapie 7** (K-37); **design stopki — dopracowanie w pod-etapie 7** (K-36); wspólna obróbka zdjęć w filarach (przyciemnienie, proporcje) — razem z sesją zdjęciową;

## Postęp


| Kawałek                       | Status | Uwagi z checkpointu                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Bugi układu               | ✅      | OK 2026-09-19. Odstęp kart→H2 i dół cytatów: `--section-gap` (60 px). Semestr: stała kolumna 34 px, cyfry wyrównane do lewej. Waga 400 w kartach/wykładowcach. H2 na `/wykladowcy`. FactsBox mobile pod leadem na `/wyklady`. Brak CTA w „Jak się zapisać" — zgłoszone (Kawałek 5 / `ClosingCta`).                                                                                                                                                                                          |
| 2 — Typografia i role kolorów | ✅      | OK 2026-09-19. Tokeny ról K-25 w `globals.css`; `--size-nav` 16 px; Garamond min. 16,5 px (etykiety FactsBox → Plex 14,5); `--accent-text` na całym złotym tekście; belka FactsBox 2 px; `SeasonAccordion` role kolorów + stan otwarty; nadtytuły sezonu na kursie/plenerze; tekst ciągły 17,5/1,7.                                                                                                                                                                                         |
| 3 — Nawigacja                 | ✅      | K-23: „Przegląd" w SectionNav warsztatów. K-24: stopka wariant B — 4 kolumny desktop, huby jako linki, `/pracownia` + „Galeria" + „Bieżący sezon", etykiety kontaktu Plex tertiary; social pod kontaktem (osobne linie); mobile 2 kolumny (marka+akademia+warsztaty | kontakt+wykłady+ikony); pasek dolny lewo/prawo. Design stopki → pod-etap 7 (K-36). SectionNav/Header/Footer: `tap-target-nav` 44 px. Szuflada: fixed overlay, scroll lock, Esc, focus trap, fokus wraca na hamburger. |
| 4 — Rytm, szerokości, ikony   | ✅      | OK 2026-09-19. Tokeny space-10/11/12, section-gap 96 px ≥1024, measure-lead 680 / measure-prose 640; cytat 120 px desktop; IconGrid object-contain na surface-tile; content-max 1280 px ≥1600 — zostaje. Mobile: home 4683 px, kurs 4440 px (± chunki 1–3). **Świadome odstępstwo K-29:** dolna linia cytatu (`rule-gold-b`) zostaje — cezura cytat → „Wybrane ikony".                                                                                                                      |
| 5 — Przepływ sprzedażowy      | ✅      | K-32 odrzucone (sticky + `ClosingCta` wycofane; K-37 → pod-etap 7). K-33 częściowo: H2 Najbliższe, filary → huby. **Hero opcja A** (`min(920px, 76vh)`, siatka md+; fold nie wymagany) — patrz K-33 pkt 1. K-34 odłożone. Layout ofertowy przywrócony (boks tylko w nagłówku). Build/lint OK.                                                                                                                                                                                                          |
| 6 — Zamknięcie: trasa + tap targety | ✅  | OK 2026-09-19. `/pracownia` → `PagePlaceholder`; `mailto:`/`tel:` w stopce → `tap-target-nav-block`; komentarz `--hero-image-h` → K-33 opcja A. Build/lint OK. |
| 7 — Lighthouse mobile       | ✅      | OK 2026-09-19. A11y 100/100 na `/`, `/warsztaty/kurs-roczny-i-trzyletni`, `/wyklady`, `/wyklady/wykladowcy` (mobile, dev :3000, Lighthouse CLI). |
| 8 — Dokumentacja i zamknięcie | ✅    | OK oczekuje. Rejestr K-23…K-35, brief §3 + K-26, wiersz 4b §2, DoD, założenia planu 05, D-1 zapisana. |


## Załącznik — pomiary wyjściowe (staging, 2026-09-18)

Desktop 1920×917, kontener 1180 px (treść 1068 px, x = 419…1487), margines boczny do treści 426 px.


| Miejsce                   | Pomiar                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero (home)               | sekcja 921 px; obraz 401×760; H1 56/1,12 *(staging przed 04b)*                                                                                                                  |
| Hero (home) po 04b        | przy 1920×917, content-max 1280: sekcja ~861 px; obraz 697×368 (`76vh`); H2 „Najbliższe" y≈945 — pod foldem, **akceptowane** (K-33 opcja A)                                      |
| Najbliższe                | y = 1003, kafle 355×208; data Garamond 15 `#c9a227`; tytuł Plex 18,5                                                                                                            |
| Odstępy home              | hero→Najbliższe 60; Najbliższe→filary 34; cytat: sekcja 201 px                                                                                                                  |
| H2                        | 34 (Wybrane ikony — interlinia 1,6; Głosy uczestników; Program sezonu; Archiwum sezonów) · 30/500 (`OfferCard`) · 28 (filary, Program kursu, Jak się zapisać) · 24 (`FactsBox`) |
| H3                        | 26/500 (`LecturerCard`) · 18,5 (`LectureList`) · 17,5 (semestry)                                                                                                                |
| Tekst na kursie           | 19,5 lead · 17/1,65 · 17,5/1,75 · 16,5/1,6                                                                                                                                      |
| `FactsBox`                | 400×797 (kurs), 400×703 (wykłady); belka 3 px; lewa kolumna kończy się na y ≈ 477                                                                                               |
| `/warsztaty`              | karty do y = 1042; H2 „Głosy uczestników" od y = 1041                                                                                                                           |
| `LectureList`             | 1851 px, 11 spotkań, 0 linków; data Garamond 22 `#e8c765`                                                                                                                       |
| Lead                      | 616 (oferta) · 741 (hub) · 1068 (archiwum, wykładowcy); biogram 744                                                                                                             |
| Menu / `SectionNav`       | linki 15 px / 15,5 px, wysokość 26–27 px                                                                                                                                        |
| Stopka desktop            | siatka `1.25fr 1fr 1fr 1fr`; nagłówki grup jako `div`                                                                                                                           |
| Stopka mobile (390)       | 1076 px; linki 20–27 px wysokości                                                                                                                                               |
| Wysokość dokumentu mobile | home 4722 · kurs 4476 · wykłady 5923 · archiwum 3284                                                                                                                            |


