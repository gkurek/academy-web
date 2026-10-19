# Prompt do Claude Design — strona albumu `/publikacje/ikona-dzis` (układ desktop)

Status: **gotowy do wysłania** 2026-10-18 · zamawia: właściciel · ocena wyniku: nowa sesja w etapie 10.
Załączyć do rozmowy z Claude Design:

- `design/Akademia Ikony - Publikacje.dc.html` + `design/README-publikacje.md` (makieta rundy 1: PU-70/71 spis, `TocList`);
- `design/README.md` (tokeny systemu);
- zrzuty obecnego wdrożenia: `.visual/album-design/ikona-dzis-1440-full.png`, `ikona-dzis-1920-full.png`, `ikona-dzis-1440-toc-expanded.png` (spis rozwinięty);
- skan spisu z albumu: `public/media/publications/ikona-dzis/spread-01.png`.

---

## Prompt (do skopiowania)

Akademia Ikony — strona albumu `/publikacje/ikona-dzis`, **runda 2: układ desktopowy wszystkiego poniżej hero**. Mobile na razie pomijamy.

### 1. Co zostaje bez zmian

Góra strony działa i **nie ruszamy jej**: breadcrumb, H1, lead, okładka po lewej i ramka „W skrócie” po prawej (wydawca, rok, strony, format, ISBN, cena, dostępność, „Jak kupić”, CTA „Zamów album mailem”). Header i stopka też bez zmian. Projektujesz wszystko pomiędzy hero a stopką.

### 2. Co nie działa (ocena właściciela i przegląd UX)

Kolejność dziś: hero → „O albumie” → „Rozkładówki” → spis treści → „Z wernisażu albumu” → „Zobacz też”.

1. **„O albumie”**: cztery akapity (ok. 140 słów, ostatni to cytat pomysłodawczyni) w kolumnie ok. 34em przy lewej krawędzi. Po prawej zostaje pusty placek ok. 40% szerokości kontenera.
2. **Spis treści** to główny problem. Przeszedł już kilka wersji i żadna nie przekonuje:
   - **makieta PU-70**: każda pozycja jako karta. Wyszło ciężko i długo (ok. 1500 px na desktopie), a hierarchia była odwrócona: tytuł rozdziału mniejszy od tytułu tekstu. Przy każdej pozycji karta z tłem, więc wszystko wyglądało na klikalne, choć linkują tylko 3 z 12;
   - **obecnie**: trzy karty „Do przeczytania w serwisie” plus „Pełny spis treści” w zwijanym `<details>` (zwinięty). Zwijanie to niezły pomysł, ale może są lepsze;
   - **wersja rozwinięta** (zrzut `toc-expanded`): zwarty spis jak w książce. Tytuł rozdziału po lewej, „str. 6–51” przy prawej krawędzi kontenera. **Właściciel ma wątpliwość, czy duża pusta przestrzeń między tytułem a numerem stron jest OK.** Odpowiedz na to wprost: kropki prowadzące, numer przy tytule, węższa kolumna spisu czy coś innego.
3. **„Z wernisażu albumu”**: jedna karta `NewsCard` (data, rodzaj, „Galeria · 11 zdjęć”, tytuł, opis, „Czytaj”) jako osobna sekcja z H2. Sekcja z jednym elementem wygląda dziwnie. Pomysł właściciela: przenieść ją do „Zobacz też” jako kolejny link. Inne rozwiązania też mile widziane (np. zdjęcie z wernisażu jako element kompozycji).
4. **„Rozkładówki”**: siatka 3 × 3 miniatur z podpisami, otwierają lightbox. Działa, ale pierwsza miniatura to skan spisu treści, czyli dubluje sekcję spisu. Możesz to wykorzystać albo zmienić.
5. **„Zobacz też”**: linki „Wszystkie publikacje” i „Terminy wykładów” w jednym rzędzie.

### 3. Specyfika spisu treści (fakty z albumu)

- 178 stron, 6 rozdziałów z zakresem stron. W druku numery stron mają **tylko rozdziały** (skan `spread-01.png`), poszczególne teksty ich nie mają.
- 12 pozycji, w tym 1 wstęp przed pierwszym rozdziałem: „Piętnasta rocznica”, ks. Henryk Paprocki. Dwie pozycje bez autora („Moja droga z ikoną – wypowiedzi twórców”), ostatni rozdział („Przykłady wydarzeń – plakaty”) bez żadnej pozycji. Rozdział „Ikona – drabina życia” ma jedną pozycję („O Drabinie Raju św. Jana Klimaka – fragmenty”, Michał Płoski).
- Najdłuższy tytuł ma ok. 105 znaków: „Kilka uwag współczesnego malarza ikon, który jest rozpięty między wschodnim i zachodnim rozumieniem sztuki”.
- **Tylko 3 teksty mają swoją stronę w serwisie** (`/publikacje/<slug>`): „Piętnasta rocznica”, „Kilka uwag…”, „Piękno ikony – perspektywa i światło”. Pozostałe są tylko w druku. Większość stron albumu to zdjęcia ikon i życia Akademii.
- Nazwiska autorów linkują do not wykładowców (`/wyklady/wykladowcy#…`).
- **Pytanie otwarte:** właściciel może sprawdzić w albumie stronę każdego tekstu i dopisać ją do danych (nowe opcjonalne pole `page` przy pozycji). Pokaż przynajmniej jeden wariant **z numerem strony przy każdym tekście**, jako placeholder `[str.]`, i oceń, czy to wyraźnie poprawia spis. Jeśli nie poprawia, napisz to wprost.

Pełna lista (rozdział · strony → pozycje):

- *(wstęp)* Piętnasta rocznica — ks. Henryk Paprocki — **na stronie**
- Piękno Boga, piękno człowieka · 6–51 → Światłe oczy serca — Elżbieta Jackowska-Kurek; Patrząc na obraz — dr Maria Magdalena Dylewska
- Ikona – oddech życia · 52–85 → Ikona a tajemnica wolności — Justyna Sprutta; Ikona – okno duszy — Elżbieta Jackowska-Kurek; Moja droga z ikoną – wypowiedzi twórców
- Ikona – kolorowa kontemplacja · 86–105 → Rola ikony w modlitwie osobistej — o. Aleksander Jacyniak SJ; Kilka uwag współczesnego malarza ikon… — Elżbieta Jackowska-Kurek — **na stronie**
- Ikona – drabina życia · 106–137 → O Drabinie Raju św. Jana Klimaka – fragmenty — Michał Płoski
- Ikona dziś · 138–171 → Piękno ikony – perspektywa i światło — Elżbieta Jackowska-Kurek — **na stronie**
- Przykłady wydarzeń – plakaty · 172–178

### 4. Cel

Zaprojektuj układ desktopowy od hero do stopki, który:

1. wypełnia kontener kompozycją, a nie pustką (1180 px przy 1280–1599, 1280 px przy ≥ 1600). Lewa krawędź treści na osi breadcrumbu, prawa na osi menu;
2. jasno odróżnia 3 teksty do przeczytania od reszty spisu. Link ma wyglądać jak link, zwykła pozycja jak zwykły tekst;
3. daje spisowi czytelną hierarchię: rozdział > tekst > autor, strony jako informacja pomocnicza;
4. rozwiązuje „O albumie” bez placka po prawej i zachowuje miarę tekstu ok. 60–75 znaków;
5. rozwiązuje „Z wernisażu” i „Zobacz też”;
6. jest spójny z resztą serwisu (pkt 6).

### 5. Wariacje — minimum 4, najlepiej 6, obok siebie na jednym płótnie

Każda wariacja to **cała strona poniżej hero** przy 1440. Dla 2 najlepszych dorzuć 1920. Poniżej kierunki do sprawdzenia. Możesz je łączyć, odrzucić lub zastąpić własnymi, byle każda wariacja była wyraźnie inna, a nie tylko w odcieniach:

- **W1 — dwie kolumny „O albumie” + spis:** opis po lewej, spis (zwarty) po prawej, w kolumnie ok. szerokości ramki „W skrócie”, pod nią. Pusta przestrzeń znika naturalnie.
- **W2 — spis jako typograficzna „strona z książki”:** wyśrodkowany lub w wąskiej kolumnie, nawiązanie do skanu (rozdział → teksty → autorzy), kropki prowadzące do stron albo strony przy tytule. Teksty online wyróżnione w samym spisie (np. znacznik, kolor), bez osobnych kart.
- **W3 — teksty online jako osobny pas:** 3 kafle w rzędzie (3 kolumny), spis pod nimi zwinięty lub w wąskiej kolumnie obok cytatu.
- **W4 — rozdziały jako siatka:** 6 rozdziałów jako 2 × 3 lub 3 × 2 bloki (tytuł, strony, pozycje), ewentualnie z miniaturą rozkładówki z danego rozdziału (zakresy stron rozkładówek: 14–15, 50–51, 74–75, 76–77, 90–91, 112–113, 146–147, 164–165).
- **W5 — rozkładówki połączone ze spisem:** rozdział + miniatura jego rozkładówki obok, czyli spis jako przewodnik po albumie. Sekcja „Rozkładówki” znika jako osobna albo zostaje tylko na pozostałe.
- **W6 — Twoja propozycja**, np. zwijanie inne niż `<details>` (tylko jeśli uzasadnisz), cytat pomysłodawczyni jako wyróżniony element (pull quote) w prawej kolumnie, zdjęcie z wernisażu jako akcent.

W każdej wariacji pokaż: kolejność sekcji, miejsce „O albumie” (i czy cytat wychodzi z prozy), traktowanie spisu (zwinięty czy nie, kolumna, strony), „Z wernisażu” (osobno, w „Zobacz też” czy inaczej), „Zobacz też”.

### 6. Wzorce, które już są w serwisie (preferuj spójność)

- **Hero albumu**: okładka + ramka faktów `--publication-metrics-w: 420px`, złota belka 3 px u góry.
- **Strony ofert**: tekst + prawa kolumna `FactsBox` 400 px.
- **Strony tekstowe z `TocSidebar`**: lewa kolumna spisu + tekst.
- **Lista `/aktualnosci` (`NewsCard`)**: kolumna daty po lewej, treść, „Czytaj” po prawej.
- **`/publikacje` (hub)**: lista artykułów (`ArticleList`): tytuł, autor, źródło, „Czytaj”.
- Karta z linkiem: `--surface-card` + złota krecha 3 px z lewej. Zwykły kafel: `--surface-tile`.

### 7. Ograniczenia (stałe)

- **Tokeny i system z `design/README.md`**: kolory, kroje (EB Garamond nagłówki, IBM Plex Sans tekst UI), header, stopka, breadcrumb bez zmian. Nowe wartości tylko jako nazwane tokeny w tabeli README.
- **Zakazane:** rozmiar 13 px; kolor `#8d7d69`; zaokrąglenia; `box-shadow`; IBM Plex Mono poza placeholderami; nagłówki inne niż 400. Fokus: obrys 2 px `#e8c765`, odstęp 2 px.
- Odstęp sekcji: `--section-gap` = 56 px na desktopie (od 768 px).
- **Bez sticky i JS**, chyba że uzasadnisz (wtedy z `prefers-reduced-motion`). `<details>` jest dozwolony.
- **Bez nowego copy redakcyjnego.** Treści jak wyżej i na zrzutach. Nowe etykiety UI (np. nagłówek sekcji tekstów online) zaproponuj w osobnej liście do akceptacji.
- **Model danych:** `chapters: {title, pages}[]`, `toc: {title, author?, articleSlug?, chapter?, intro?}[]`, `spreads: {src, alt, caption}[]`, `aboutParagraphs: string[]`, `relatedNewsSlug?` (wernisaż: data, rodzaj, tytuł, opis, okładka, 11 zdjęć). Jedyne dopuszczalne nowe pole: `toc[].page?` (pkt 3). Inne tylko z uzasadnieniem.
- Breakpointy do opisania: 1024–1279, 1280–1599, ≥ 1600. Najważniejsze 1440 i 1920. Mobile — **poza zakresem tej rundy**.

### 8. Oddaj

- Plik `design/Akademia Ikony - Album v2.dc.html`: płótno z 4–6 wariacjami obok siebie (1440) + 1920 dla dwóch najlepszych.
- `design/README-album-v2.md`:
  - rekomendacja jednej wariacji z uzasadnieniem;
  - odpowiedź na pytanie o pustą przestrzeń między tytułem a stronami;
  - ocena, czy numery stron przy tekstach (`toc[].page`) się opłacają;
  - decyzja dla „Z wernisażu”;
  - siatka (kolumny, odstępy, breakpointy) jako **nazwane tokeny**;
  - lista nowych etykiet UI;
  - lista miejsc niejasnych.
