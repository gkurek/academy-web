# Prompt do Claude Design — wpis Aktualności, runda 2 (układ desktop)

Status: **gotowy do wysłania** 2026-10-03 · zamawia: właściciel · ocena wyniku: nowa sesja wg `docs/plans/10-k3-news.md` § „Runda 2 makiety”.
Załączyć do rozmowy z Claude Design: `design/Akademia Ikony - Wpis Aktualności.dc.html`, `design/WpisAktualnosci.dc.html`, `design/README-wpis-aktualnosci.md`, `design/README.md` (tokeny systemu), zrzuty obecnego wdrożenia (1440 / 1920, wpisy z listy w p. 6).

---

## Prompt (do skopiowania)

Akademia Ikony — szablon pojedynczego wpisu `/aktualnosci/[slug]`, **runda 2: układ na desktopie**.

### 1. Co się stało

Twoja makieta „Wpis Aktualności” (ekrany 1a–8f, komponent `WpisAktualnosci`, README `README-wpis-aktualnosci.md`) została wdrożona wiernie: typografia A (EB Garamond 20/32, `#e6dac7`, miara 600 px), nagłówek (a), kolejność tekst → galeria, galeria wg reguł 0 / 1 / 2–3 / 4–12 / > 12, „Powiązane”, fazy `wydarzenie`. **Na mobile (390) działa dobrze i zostaje bez zmian.**

**Na desktopie układ jest nie do przyjęcia.** Ocena właściciela: wygląda jak błąd albo bardzo słaby projekt na każdej szerokości desktopowej; „w miarę OK” robi się dopiero przy ok. 900 px okna, a takiej szerokości nikt na desktopie nie używa — de facto działa tylko mobile. Sprawdzone warianty:

- **Lewa oś (makieta 1a):** kolumna 760 px (H1, linie, nawigacja) z tekstem 600 px w kontenerze 1068 px (1440) / 1168 px (≥ 1600). Pustka na prawo od tekstu: 1440 → ok. 45%, 1920 → ok. 50% szerokości pola. Dwie różne prawe krawędzie (600 tekst, 760 linie i tytuł) — linie poziome „urywają się” w przypadkowym miejscu.
- **Kolumna wyśrodkowana 600 px** (wszystko w jednej osi): spójna, ale to wąski pasek pośrodku (~30% ekranu przy 1920+), bez związku z osiami nagłówka (logo przy lewej krawędzi kontenera, menu przy prawej). Na krótkich wpisach strona jest w większości pusta.
- **Nie chcemy** po prostu poszerzać kolumny tekstu: 600 px przy 20 px Garamondzie ≈ 65 znaków — wiersz ma zostać czytelny (60–75 znaków).

Wniosek: problemem nie jest typografia, tylko **brak kompozycji na szerokość kontenera**. Potrzebny układ, który wypełnia kontener treścią (nie pustką) i opiera się o osie nagłówka, przy zachowaniu miary tekstu.

### 2. Cel

Zaprojektuj układ desktopowy wpisu (od 1024 px wzwyż), który:

1. wykorzystuje szerokość kontenera (1068 px pola przy 1180; 1168 px przy ≥ 1600) — lewa krawędź treści na osi logo/breadcrumbu, prawa na osi prawej krawędzi menu;
2. zachowuje miarę tekstu bieżącego ok. 60–75 znaków;
3. dobrze wygląda **także na najgorszym przypadku** — krótki wpis bez zdjęć (2 zdania) — i na najbogatszym (46 zdjęć);
4. jest **jednym szkieletem** dla wszystkich układów (`wydarzenie` / `galeria` / `tekst` / `program`) — warianty różnią się zawartością, nie siatką;
5. jest spójny z resztą serwisu.

### 3. Wzorce, które już są w serwisie (preferuj spójność)

- **Strony ofert** (`/warsztaty/...`): tekst + prawa kolumna `FactsBox` 400 px (`--grid-template-columns-offer-main: 1fr 400px`) z faktami (termin, miejsce, koszt) i CTA.
- **Strony tekstowe z `TocSidebar`**: lewa kolumna spisu treści + tekst.
- **`/ikony/wystawy`**: hero z kolumną faktów (`--exhibition-facts-w`).
- **Lista `/aktualnosci`** (`NewsCard`): kolumna daty po lewej, treść, „Czytaj” po prawej.

### 4. Kierunki do pokazania (minimum 2, zestawione obok siebie)

- **K1 — tekst + prawa kolumna** (jak oferty): lewa kolumna treści (meta, H1, lead, prose, galeria `tekst`), prawa ~300–400 px: fakty (rodzaj, data, miejsce, `facts[]`), „Powiązane”, poprzedni/następny, ewentualnie pierwsze zdjęcie / plakat jako kadr wizytówki. Galeria `galeria`/`wydarzenie` — pod spodem na pełną szerokość pola czy w kolumnie treści? Zdecyduj i uzasadnij.
- **K2 — lewa kolumna metadanych + tekst** (jak lista `NewsCard`): wąska kolumna daty / rodzaju / miejsca na osi logo, tekst obok; prawa strona — zdjęcie(-a) lub nic. Pokaż, czy przy krótkim wpisie nie zostaje ta sama pustka.
- **K3 (opcjonalnie) — Twoja propozycja**, jeśli widzisz lepszą kompozycję (np. obraz jako pełnoprawny element pierwszego ekranu dla wpisów z zdjęciami).

Przy każdym kierunku: co z H1 (szerokość, czy przechodzi nad kolumnami), gdzie lead, gdzie breadcrumb, co na kolumnie bocznej, gdy wpis nie ma faktów ani zdjęć.

### 5. Ograniczenia (stałe)

- **Tokeny i system z `design/README.md`** — kolory, kroje, header, stopka, breadcrumb bez zmian. Nowe wartości tylko jako nazwane tokeny w tabeli README.
- **Typografia prose (E1) zostaje:** EB Garamond 400, 20/32 (mobile 19/30,4), `#e6dac7`, odstęp bloków 40 px przez `gap`, lead 24 px. Możesz zaproponować **skalowanie na ≥ 1600** (np. 21–22 px i proporcjonalnie miara), jeśli kompozycja tego potrzebuje — jako osobna, opisana opcja.
- **Zakazane:** rozmiar 13 px; kolor `#8d7d69`; zaokrąglenia i cienie poza lightboxem; IBM Plex Mono poza placeholderami; nagłówki inne niż 400. Fokus: obrys 2 px `#e8c765`, odstęp 2 px.
- **Mobile 390 — bez zmian** (obecna jedna kolumna). Pokaż jeden ekran mobile tylko jako potwierdzenie, że nowy układ zwija się do obecnego.
- **Breakpointy do opisania:** 768–1023 (tablet), 1024–1279, 1280–1599 (kontener 1180), ≥ 1600 (kontener 1280). Najważniejsze: 1440 i 1920.
- **Bez sticky / JS**, chyba że uzasadnisz (wtedy z `prefers-reduced-motion`).
- **Bez nowego copy.** Treść z prawdziwych wpisów (p. 6); brakujące rzeczy jako `[do uzupełnienia: …]`. Etykiety UI („Powiązane”, „Zdjęcia”, „Poprzedni”, „Następny”, „Wszystkie aktualności”, „Pokaż wszystkie (N)”) jak w rundzie 1.

### 6. Model danych (bez zmian, chyba że uzasadnisz)

`title`, `date`, `dateEnd?`, `kind` (Warsztaty / Wykłady / Wystawa / Wyjazd studyjny / Z Akademii / …), `venue?`, `excerpt` (= lead; `hideLead?`), `layout` (`wydarzenie` | `galeria` | `tekst` | `program`), `facts?: {label, value}[]`, `related?: {label, href}[]` (domyślnie z `kind`), `images?: {src, alt, width, height, caption?}[]`, treść MDX (akapity, H2, H3, listy, cytat, linki), tytuły poprzedniego/następnego wpisu. Nowe pole tylko z uzasadnieniem i jako propozycja do akceptacji.

**Realia archiwum (68 wpisów):** większość 10–100 słów; 2020–2024 po jednym 2-zdaniowym ogłoszeniu wykładów bez zdjęć; galerie 1–46 zdjęć; `facts[]` dziś puste we wszystkich wpisach (pole nowe). **Lead powtarza pierwsze zdanie treści** w większości archiwalnych wpisów (excerpt powstał z początku tekstu) — czyta się jak zacięcie; zaproponuj traktowanie (np. lead domyślnie ukryty w archiwum / inna rola leadu w nowym układzie).

### 7. Ekrany do pokazania (desktop 1440 i 1920; 1280 dla K1 i K2)

1. **Wykłady 2013/2014** (`wyklady-20132014`) — 2 zdania, 0 zdjęć, `layout: wydarzenie` po terminie, „Powiązane” → Wykłady. **Najgorszy przypadek — obowiązkowo.**
2. **Wystawa ikon w Wilnie** (`wystawa-ikon-w-wilnie`) — `tekst`, ~400 słów, 7 zdjęć (pierwsze to plakat).
3. **Noc Świątyń 2019** (`noc-swiatyn-2019`) — `galeria`, 2 akapity, 2 zdjęcia (pierwsze to plakat).
4. **„Ikona – piękno zanurzone w Tajemnicy”** (`ikona-piekno-zanurzone-w-tajemnicy`) — `galeria`, 46 zdjęć (> 12 → „Pokaż wszystkie (46)”).
5. **Nabór 2026/2027** (`nabor-kursu-2026-2027`) — `wydarzenie`, faza **zapowiedź**: fakty (np. Pierwsze spotkanie · Gdzie · Zgłoszenia) + jedno CTA.
6. **Program Akademii 2015/2016** (`program-na-rok-20152016-zapraszamy-serdecznie`) — `program`, lista 5 pozycji z pogrubionymi nazwami.
7. Jeden ekran mobile 390 (dowolny z powyższych) — potwierdzenie zwinięcia.
8. Stany: fokus na linkach i miniaturach; wpis bez leadu; tytuł ~110 znaków.

### 8. Oddaj

- Plik `design/Akademia Ikony - Wpis Aktualności v2.dc.html` (płótno z kierunkami obok siebie) + zaktualizowany komponent szkieletu.
- `design/README-wpis-aktualnosci-v2.md`: rekomendacja jednego kierunku z uzasadnieniem; siatka (kolumny, odstępy, breakpointy) jako **nazwane tokeny**; co się zmienia względem rundy 1 (E2 nagłówek, E3 kolejność, E6 miara leadu — jeśli w ogóle); propozycja dla leadu; lista miejsc niejasnych.
