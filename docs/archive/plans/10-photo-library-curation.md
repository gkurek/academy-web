# Pula zdjęć ze starej strony WP — przesiew i wybór zdjęć na stronę

Status: **zamknięty** 2026-10-25 (plan zatwierdzony 2026-10-24, wersja przebudowana: od kategorii właściciela, nie od filtrów na całym zbiorze; zastąpił szkic z 2026-10-23). Wszystkie kroki zakończone, `_inbox/` pusty.

## Cel

Z puli ~420 zdjęć ze starej strony WP wybrać zdjęcia do brakujących i wymienianych miejsc nowej strony. Claude liczy to, co da się policzyć skryptem; właściciel robi to, co wymaga oka — w lokalnej aplikacji do tagowania.

## Stan wyjściowy

- Folder poza repo: `C:\Users\Greg\Desktop\ejk-pic-library` (układ `RRRR/MM/plik`), `metadata.json` (id, tytuł, alt, podpis, data, `parent`, wymiary kopii WP), `tags.json` (zapis aplikacji).
- Skrypty w `scripts/`: `download-wp-media.ts`, `dedupe-exact-media.ts`, `scan-near-duplicates.ts`, `tag-photos.ts` (`npx tsx scripts/tag-photos.ts` → `http://localhost:4123`).
- Kategorie nadane przez właściciela (2026-10-24, 424 zdjęcia): ikona – zbliżenie 161, wystawy 84, plakaty 47, inne 45, wykłady 35, warsztaty 42, akademia – uczestnicy 10.

## Postęp

- [x] **Pobranie** (2026-10-23) — 497 oryginałów.
- [x] **Identyczne duplikaty** (SHA-256) — usunięto 6.
- [x] **Prawie-duplikaty** (dHash, próg 10/64, ręczny przegląd) — usunięto 49. Razem 497 → 442. Grupy „zostają razem” w `_scan/keep-both.json`.
- [x] **Aplikacja do tagowania** — kafle, kategorie, filtr „Pokaż”, zapis do `tags.json`.
- [x] **Mapa slotów** (2026-10-24) — sekcja niżej.
- [x] **Porządki w `public/media/offers/`** (2026-10-24) — usunięto `uczestnik-grzegorz.jpg`; `pracownia-podporka.jpg` i `uczestnicy.jpg` (kurs i LSŚ, identyczne) usunięte jako duplikaty zdjęć z biblioteki (2022/07/10986879_… 2048×1536; 2017/07/DSC06604 1920×1080); `plener-przy-ikonach.jpg` (1400×704, bez odpowiednika w bibliotece) przeniesiony do `ejk-pic-library/_from-site/`. Zdjęcie z `_from-site/` nie jest w `metadata.json`, więc aplikacja go nie pokazuje.
- [x] **Etykiety placeholderów wystawy** (2026-10-24) — w `src/i18n/pl.ts` (`exhibition.frames`) zostało samo `[zdjęcie · proporcja]`.
- [x] **Placeholdery zdjęć usunięte z kodu** (2026-10-25) — po podmianie żaden nie był już wyświetlany. `ExhibitionFrame` wymaga zdjęcia (zostaje tylko kadr szeroki), `ExhibitionAnnualTiles` pokazuje tyle kafli, ile zdjęć (≤ 4), `OfferFigure` i `OfferSideCta` bez wariantu zastępczego; brak zdjęcia = kadr się nie renderuje. Usunięte: etykiety `exhibition.frames`, `offers.figurePlaceholders`, `offers.sideCta.photoPlaceholders`, style `.exhibition-media-placeholder*` / `.exhibition-frame-placeholder` / `--standard` / `--square` / `--tile-pair-lead`, tokeny `--offer-side-photo-aspect`, `--offer-figure-h(-m)`, `--exhibition-aspect-square`. Zostaje zastępcze zdjęcie wykładowcy (`LecturerCard`, wykładowca bez zdjęcia).
- [x] **Zdjęcie Kontaktu w `content/`** (2026-10-25) — ścieżka, `alt` i wymiary z `ContactPhoto` / `pl.contact.photo` przeniesione do `content/pages/kontakt.json` (walidacja `assertImage`); w `src/` nie ma już ścieżek `/media/…` poza przekierowaniami.
- [x] **Nowe zdjęcia z `_inbox/`** (2026-10-24) — 97 wklejonych: 16 duplikatów usuniętych (12 identycznych SHA-256 z biblioteką lub między sobą, 4 prawie-identyczne tej samej rozdzielczości), 79 przeniesionych do `2026/10/` i dopisanych do `metadata.json` (`status: "local"`, bez podpisów; kopia `metadata.before-inbox.json`). 2 pozostałe rozstrzygnięte przez właściciela — `_inbox/` pusty (2026-10-25).
- [x] **Krok 2 — przegląd „inne”** (właściciel) — zamknięty 2026-10-25.
- [x] **Krok 3 — klasyfikacja techniczna** (2026-10-24, Claude) — zawężona do 3 kategorii: wystawy, warsztaty, akademia – uczestnicy. `scripts/classify-photos.ts` → `_scan/classification.json`; flagi i gwiazdka w `tag-photos.ts` (od 2026-10-24: typ na slot, patrz Krok 5). Flaga „już na stronie” liczy się bez `public/media/news/**` (dHash ≤ 8/64). Rozmycie/ciemne pominięte (dotyczyło ikon). Progi A/B/C (długi/krótki bok): warsztaty 1600/900 · 960/540; wystawy 1400/700 · 960/600; uczestnicy 1600/900 · 960/600. Wynik: warsztaty 54 (A13 B25 C16, na stronie 16); wystawy 109 (A42 B43 C24, na stronie 2); uczestnicy 18 (A13 B0 C5, na stronie 2).
- [x] **Krok 4 — liczenie i decyzja o dalszych filtrach** — zamknięty 2026-10-25 (bez dalszych filtrów).
- [x] **Krok 5 — wybór na konkretne miejsca** (właściciel, aplikacja). Potwierdzone 2026-10-24 (3 sloty, pliki zoptymalizowane mozjpeg q85, `alt` zatwierdzone K-122, podpis tylko w O Akademii — bez zmian):
  - Warsztaty – hero: `2026/10/514953350_…_n.jpg` → `public/media/workshop/hub-hero.jpg`, kadr 21:8 2048×780 (nowa ścieżka, bo `home/pracownia.jpg` dzieli news „Nowy rok w Akademii”).
  - O Akademii – hero: dawne zdjęcie hubu `home/pracownia.jpg` (zielony stół) → `public/media/workshop/hero.jpg`, kadr 4:3 720×540; poprzedni plik w `_scan/originals/workshop-hero.jpg`.
  - Kurs roczny – zdjęcie pod „Jak wygląda nauka” (dawny placeholder `kursPracownia`): `2022/07/10986879_…_o.jpg` → `public/media/offers/kurs-roczny-i-trzyletni/pracownia.jpg`, kadr ≈2,5:1 2048×819; `OfferFigure` ze zdjęciem bez stałej wysokości (`w-full h-auto`).
  - Letnia Szkoła Światła – zdjęcie boczne „Święta Lipka, 2023” (potwierdzone 2026-10-24): `2026/10/20230804_132335.jpg` (krucyfiks w oknie) → `public/media/offers/letnia-szkola-swiatla/krucyfiks.jpg`, cały kadr pionowy, przycięty tylko lekko od góry, 1200×1496; `OfferSidePhoto` bez ramki 4:3 (naturalne proporcje, prop `imagePosition` usunięty). Poprzednie zdjęcie (`uczestnicy-z-ikonami.jpg`) w `_scan/originals/lss-uczestnicy-z-ikonami.jpg`. `alt` zatwierdzony (K-122): „Krucyfiks na sztaludze w oknie z widokiem na łąki i rzekę”.
  - Wystawy ikon – hero (potwierdzone 2026-10-24): `2026/10/485762970_…_n.jpg` (zwiedzający przed ikonami na sztalugach) → `public/media/exhibition/hero.jpg` (nowa ścieżka — slot był placeholderem), kadr 21:8 2048×780 przycięty od y=90, żeby nie ucinać ikon od góry; podpięte w `content/exhibition/page.mdx` jako `heroImage`. `alt` zatwierdzony (K-122): „Zwiedzający oglądają ikony ustawione na sztalugach podczas wystawy”.
  - Wystawy ikon – wystawa doroczna, 4 kafle 4:3 (potwierdzone 2026-10-24), w kolejności: `2017/09/10407074_…_n.jpg` → `annual-boy-at-easels.jpg` (960×720); `2025/06/448770846_…_n.jpg` (pion, przycięty do 4:3 od y=170) → `annual-opening-speech.jpg` (1536×1152); `2026/10/DSC08795.JPG` → `annual-icons-on-table.jpg` (1600×1200); `2026/10/2023-wernisaz-doroczny-3.jpg` → `annual-easels.jpg` (1600×1200). Wszystkie w `public/media/exhibition/`, mozjpeg q85, dłuższy bok ≤ 1600. Podpięte w `content/exhibition/page.mdx` jako `annualImages` (nowe opcjonalne pole `PermanentExhibition`), wyświetlane, dopóki ostatnia wystawa doroczna nie ma własnych `photos`; kafle otwierają lightbox (tylko te cztery). Złota obwódka zdjęta ze zdjęć w ramkach wystawy (zostaje na placeholderach). `alt` zatwierdzone (K-122): „Chłopiec ogląda ikony na sztalugach z czerwonym tłem”; „Elżbieta Jackowska-Kurek przemawia podczas wernisażu wystawy dorocznej”; „Ikony uczestników Akademii rozłożone na stole z czerwonym obrusem”; „Ikony uczestników ustawione na sztalugach podczas wystawy dorocznej”.
  - Wystawy ikon – galeria w #doroczna (2026-10-24): 21 zdjęć z gwiazdką (kolejność `starred`) → `public/media/exhibition/annual-gallery-01…21.jpg`, mozjpeg q85, dłuższy bok ≤ 1600, bez kadrowania; podpięte jako `annualGallery` (nowe opcjonalne pole `PermanentExhibition`). Usunięte po przeglądzie: `annual-gallery-01`, `-06`, `-14` (numery 5, 10, 18 w liczniku lightboxa), potem `-11` (trzy duże ikony na stojakach); numeracja plików ma luki. Jedna lista w lightboxie: 4 kafle + 17 zdjęć galerii (21); kafle otwierają ją od swojego numeru. Link „Zobacz więcej zdjęć” (`ExhibitionGalleryLink`) usunięty 2026-10-25 — do galerii wchodzi się wyłącznie klikając widoczny kafel; to samo w #wyjazdowe. `alt` zatwierdzone (K-122, 2026-10-24) — w `page.mdx`; osoby wskazane przez właściciela: Elżbieta Jackowska-Kurek (gallery-05, -10, -15, -21), ks. Grzegorz Michalczyk (gallery-10).
  - Wystawy ikon – ekspozycja codzienna (potwierdzone 2026-10-24): para ramek 2:1 + 4:3 zastąpiona dwoma zdjęciami w naturalnych proporcjach, w jednym rzędzie przy każdej szerokości (kolumny `fr` z proporcji zdjęć → równa wysokość; `--permanent-photo-cols`). `2021/08/DSC_0161-3.jpg` (przycięte tylko z sufitu i podłogi) → `permanent-three-icons.jpg` 1600×886, `alt` jak wcześniej w galerii (zatwierdzony); `2017/09/DSC01694.jpg` (bez kadrowania) → `permanent-icons-on-easels.jpg` 1600×900, `alt` zatwierdzony (K-122, 2026-10-25). mozjpeg q85. Bez lightboxa i bez złotej obwódki. Wpis `annual-gallery-11` (to samo zdjęcie co duże) wcześniej usunięty z galerii.
- [x] **Krok 6 — przeniesienie do projektu** — zamknięty 2026-10-25 (commit `6f49b79`).

## Mapa slotów (kolejność: uzupełnić → wymiana → ewentualna wymiana → OK)

| Strona / miejsce | Stan | Potrzeba | Kategoria |
|---|---|---|---|
| Kurs roczny – hero | **zamknięte** 2026-10-24 (`pracownia.jpg`, 2048×819) | – | warsztaty |
| Kurs roczny – „Dalsza droga” | **zamknięte** 2026-10-24 (`dalsza-droga.jpg`, 1024×768) | `alt` zatwierdzony (K-122, 2026-10-25) | warsztaty |
| Letnia Szkoła Światła – hero | **zamknięte** 2026-10-24 (`pracownia.jpg`, 1260×504) | `alt` zatwierdzony (K-122, 2026-10-25) | warsztaty |
| Letnia Szkoła Światła – zdjęcie boczne „Święta Lipka” | **zamknięte** 2026-10-24 (`krucyfiks.jpg`, 1200×1496) | – | – |
| Wystawa – hero (pierwsze zdjęcie na górze, 21:8 desktop / 3:2 mobile) | **zamknięte** 2026-10-24 (`exhibition/hero.jpg`, 2048×780) | – | wystawy |
| Wystawa – wystawa doroczna (4 zdjęcia, 4:3) | **zamknięte** 2026-10-24 (`exhibition/annual-*.jpg`, 4 × 4:3) | – | wystawy |
| Wystawa – ekspozycja codzienna (2 zdjęcia w jednym rzędzie) | **zamknięte** 2026-10-24 (`exhibition/permanent-three-icons.jpg` 1600×886 + `permanent-icons-on-easels.jpg` 1600×900) | `alt` drugiego zatwierdzony (K-122, 2026-10-25) | wystawy |
| Wystawa – wystawy wyjazdowe (4 kafle 4:3 + galeria 5 zdjęć; ramka 21:8 usunięta) | **zamknięte** 2026-10-25 (`exhibition/traveling-01…09.jpg`, gwiazdki 5, 1, 4, 6 na kaflach, reszta w kolejności `starred` w galerii) | `alt` zatwierdzony (K-122, 2026-10-25) i wpisany w `page.mdx`; pliki już mozjpeg q85, bez zmian | wystawy |
| Warsztaty – hub | **zamknięte** 2026-10-24 (`workshop/hub-hero.jpg`, 2048×780) | – | warsztaty |
| Home – filar „wykłady” (1440×810) | **zamknięte** 2026-10-25 (decyzja właściciela) | – | wykłady |
| O Akademii – `workshop-boards`, `workshop-finished-icon` (800×600) | **zamknięte** 2026-10-25 (decyzja właściciela) | – | warsztaty |
| ~~Letnia Szkoła Światła – `grupa-w-swiatyni`~~ | nie ma takiego slotu: plik `public/media/offers/letnia-szkola-swiatla/grupa-w-swiatyni.png` (526×610) dodany w 10/k8, nigdy niepodpięty; 2026-10-24 przeniesiony do `ejk-pic-library/_from-site/` | – | – |
| Home – hero, filar „warsztaty”, filar „wystawa” (1000×714) | OK | – | – |
| O Akademii – hero | **zamknięte** 2026-10-24 (`workshop/hero.jpg`, 720×540, dawne zdjęcie hubu) | – | – |
| O Akademii – portret EJK (768×1024) | OK | – | – |

Uwagi:

- Proporcje i liczba zdjęć w trzech wpisach wystawy mogą się zmienić, zależnie od materiału.
- Galeria pod linkiem w sekcji wystawy dorocznej (wybór zdjęć z wernisaży itp.) — osobny kawałek, później; nie jest w tej mapie.
- Poza mapą (decyzja właściciela): Pracownia (galeria), Wykładowcy (brakujące zdjęcie dostarczy właściciel), archiwum wykładów, Wykłady (bieżący sezon) i Ikony (brak hero, więc brak luk), galeria ikon (wszystkie OK), aktualności, publikacje, album, kontakt, polityka prywatności.
- Placeholder „Dalsza droga” (kurs) przyjęty jako osobny slot obok hero — do potwierdzenia przy kroku 5.

## Krok 2 — przegląd „inne” (właściciel)

45 zdjęć bez kategorii. Właściciel przypisuje je do istniejących kategorii albo dodaje nowe. Propozycje Claude’a (do przyjęcia lub odrzucenia po obejrzeniu): **plener i miejsca**, **portrety**, **wnętrze wystawy** (ekspozycja i nawa bez ludzi). Przy okazji ocena, czy „akademia – uczestnicy” (10) nie jest sztucznie mała — część może siedzieć w „warsztaty” lub „inne”.

## Krok 3 — klasyfikacja techniczna per kategoria (Claude)

Skrypt w `scripts/`, raport w `_scan/` obok zdjęć, flagi widoczne w aplikacji. **Nic nie jest odrzucane ani kasowane.**

- **Rozdzielczość = ranga A / B / C**, liczona z rzeczywistych wymiarów pliku (nie `wpWidth`/`wpHeight`). A — nadaje się na hero i szeroki kadr, B — na kafel i zdjęcie w treści, C — tylko miniatura/galeria. Progi ustalane osobno na slot, z rozmiaru, w jakim zdjęcie faktycznie się wyświetla; nie ma globalnego progu 1000 px (odrzuciłby dobre zdjęcia, np. `ejk-christ-face`, 960×640, sprawdzone na kaflu).
- **Gwiazdka** (zmiana 2026-10-24: zamiast „ratuj” — typ na slot, patrz Krok 5). Nie omija filtrów rangi.
- **Proporcje**: poziome / pionowe / kwadratowe, do dopasowania do slotu.
- **Flaga „już na stronie”**: porównanie hashem percepcyjnym z `public/media`, **z pominięciem `public/media/news/**`** — zdjęcia występujące tylko w aktualnościach nie są flagowane, bo mogą być użyte ponownie na stronach głównych (np. wystawa: w dużej mierze wybór najlepszych zdjęć z wpisów o poszczególnych wystawach).
- **Rozmycie / ciemne** (wariancja Laplasjanu, średnia jasność) — tylko flaga, głównie dla „ikona – zbliżenie”. Dla „plakaty” ważna jest czytelność tekstu, więc liczy się rozdzielczość.

## Krok 4 — liczenie i decyzja

Claude podaje, ile zdjęć zostaje w każdej kategorii po rangach i flagach. Dopiero wtedy decyzja, czy potrzebne są dalsze filtry, czy pula jest wystarczająco mała do wyboru. Kategorie bez slotów w mapie (plakaty, ikona – zbliżenie) traktowane jako pula zapasowa.

## Krok 5 — wybór na konkretne miejsca (właściciel)

Do aplikacji dochodzi filtr „slot” (proporcja + ranga) i podgląd w powiększeniu z wymiarami i podpisem z WP. Właściciel wybiera zdjęcie na każde miejsce z mapy. **Przepływ pracy z gwiazdką:** właściciel przegląda kategorię pod kątem jednego slotu (np. hero w warsztatach), oznacza typy gwiazdką (zapis: `tags.json` → `starred`), po czym zleca Claude’owi np. „podmień hero w warsztatach na to jedno zdjęcie z gwiazdką”. Claude czyta `starred` i **podmienia zdjęcie lokalnie, bez optymalizacji, `alt` ani podpisów** — właściciel ogląda wynik i prosi o kolejne warianty (gwiazdka 2, 3…). Gdy zobaczy wszystkie, wybiera najlepszy i potwierdza; dopiero wtedy krok 6 (optymalizacja, `alt`, podpisy przez K-122). Gwiazdki czyści właściciel („Wyczyść gwiazdki”) przed następnym slotem; gwiazdki to jeden aktywny slot naraz.

**Zasady podmiany próbnej** (ustalone 2026-10-24): zdjęcie z biblioteki (`C:\Users\Greg\Desktop\ejk-pic-library`) kopiowane pod tę samą ścieżkę w `public/media/…`, którą slot ma dziś, bez zmian w `content/` (jeśli slot nie ma jeszcze obrazu — nowa ścieżka i minimalne podpięcie, zgłoszone w meldunku). Przed pierwszą podmianą slotu oryginał zostaje zachowany do przywrócenia (kopia poza `public/`, np. `_scan/originals/`). Po każdej podmianie: wyczyścić `.next/dev/cache/images` i zweryfikować serwowany plik (CLAUDE.md, „Podmiana obrazu pod tą samą ścieżką”). Gwiazdka 1, 2, 3… = kolejność w `starred` w `tags.json`; Claude pokazuje w meldunku, który plik jest który, i podmienia na wskazany numer. Nie optymalizować, nie pisać `alt` ani podpisów przed potwierdzeniem właściciela.

## Krok 6 — przeniesienie do projektu

Na podstawie `tags.json` i wyboru: kopia i optymalizacja do `public/media/…`, podpięcie w `content/` — w ramach kawałka etapu 10. Podpisy i `alt` przechodzą przez bramkę K-122 (propozycje Claude’a zaznaczone i zatwierdzone przed zapisem).

## Decyzje

1. Rozdzielczość jako ranga A/B/C, bez odrzucania; gwiazdka „ratuj” zastąpiona gwiazdką „typ na slot”.
2. Najpierw przegląd „inne”, potem ewentualne nowe kategorie — tak.
3. Flaga „już na stronie” bez zdjęć z aktualności — tak.
4. Skrypty kroku 3 w `scripts/` w repo — tak; raport w `_scan/` — tak.
5. Progi A/B/C ustalane dopiero w kroku 3, per slot — tak.

## Otwarte

Brak (2026-10-25). „Dalsza droga” zamknięta jako osobny slot (mapa slotów); `_from-site/` — rozstrzygnięte przez właściciela przy zamknięciu.
