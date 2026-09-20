# Plan 05b — Korekty galerii po przeglądzie stagingu

Status: zamknięty 2026-09-20
Gałąź: `feat/05-gallery` (kontynuacja przed merge'em; w pierwotnej wersji planu błędnie `feat/05-galeria`)
Makiety: brak nowych. Plan **świadomie odchodzi od makiety `#2a-ikony` i od części decyzji planu 05** w punktach wymienionych w „Decyzje" — każde odstępstwo ma numer K (kontynuacja rejestru od K-40) i po zatwierdzeniu trafia do `docs/plan-claude-code.md` §4. Hierarchia dokumentów z `CLAUDE.md` bez zmian (plan pod-etapu > brief > makieta).

Źródło: przegląd `https://academy-web-git-feat-05-gallery-greg-d8fb.vercel.app/ikony` na 1920×917 (desktop) i 390 px (mobile — iframe w Chrome, **nie** fizyczny iOS); wszystkie kombinacje filtrów (`?autor=` × `?temat=`, w tym nieistniejący slug), lightbox desktop i mobile (klik, klawiatura, Esc, powrót fokusu, scroll pod dialogiem). Porównanie z obecną galerią `https://www.akademiaikony.pl/ikona/galeria/` (analiza HTML i pomiary w przeglądarce 2026-09-19 — lista prac, podpisy, struktura sekcji, układ i proporcje zdjęć; układ zweryfikowany: to **nie** masonry, tylko wyrównane rzędy — patrz K-40).

> Nazwy plików w tym planie pochodzą z planu 05, nie z repo. Sesja planistyczna w Claude Code ma je zweryfikować i poprawić tabelę „Pliki i komponenty" przed „zapisz plan".

## Cel i zakres

Doprowadzić `/ikony` do stanu, w którym można ją pokazać EJK i uczniom, zanim migracja ~52 prac z WordPressa (pod-etap 8) zwielokrotni obecne problemy. W zakresie: bugi układu i lightboxa, które plan 05 oznaczył jako zrobione; układ siatki; kolejność i atrybucja prac (EJK → uczniowie); logika filtrów; nagłówek galerii; lightbox (rozmiar obrazu, mobile); treść `sample` i mikrocopy. Poza zakresem: `/ikony/[slug]` (K-04), paginacja, opis dzieła w lightboxie, pełna migracja WP, analityka (K-15), JSON-LD, design stopki (K-36 — tu tylko bug poziomego przewijania), wydajność obrazów poza tym, co wynika z K-45.

## Decyzje do podjęcia przed startem

Wszystkie decyzje podjęto 2026-09-19; kolumna „Blokuje" zostaje jako informacja, których kawałków dotyczą. Kawałek 1 nie zależy od żadnej decyzji i może ruszyć od razu.

| #    | Decyzja                                           | Rekomendacja                                             | Blokuje       | Decyzja (2026-09-19) |
| ---- | ------------------------------------------------- | -------------------------------------------------------- | ------------- | -------------------- |
| K-40 | Układ siatki galerii (masonry vs grid)            | Wyrównane rzędy (Flickr / FooGallery)                    | Kawałek 3     | **B** (2026-09-20); wcześniej A warunkowo — po ocenie wizualnej → B |
| K-41 | Kolejność: sekcje EJK → uczniowie                 | Tak — dwie sekcje z H2 w widoku domyślnym                 | Kawałek 3     | Tak; kolejność z `order`; sztywny podział |
| K-42 | Podpisy i atrybucja autorów                       | Trzy poziomy: siatka / sekcja / lightbox                 | Kawałki 3, 4  | Tak; wymiar tylko w lightboxie |
| K-43 | Logika filtrów                                    | „Wszystkie" w temacie, wybór jednokrotny, walidacja tagów | Kawałek 2     | Tak, **ze zmianą: filtr autora usunięty z UI** (sztywny podział na sekcje); taksonomia jak w rekomendacji |
| K-44 | Nagłówek galerii — układ, mobile                  | Jednokolumnowy H1 + filtr; mobile: poziomy pasek chipów    | Kawałek 2     | Tak |
| K-45 | Lightbox — rozmiar obrazu i układ mobile          | `max-height` od okna, sticky nawigacja mobile; zmienia K-39 | Kawałek 4  | Tak; swipe tak; „Zapytaj o podobną ikonę" tylko przy pracach EJK |
| K-46 | Zajawka „Ikony na zamówienie"              | Zdjęcie zajawki do wymiany albo brak zdjęcia             | Kawałek 5     | Tak; CTA jako przycisk |
| K-47 | Treść `sample` galerii                            | ~15 prawdziwych prac z WP zamiast 4 zdjęć × 14 wpisów    | Kawałki 3, 5  | **A** |

Zależność: K-40 można rozstrzygnąć już teraz — proporcje realnych prac zostały zmierzone (patrz K-40); K-47 A jest potrzebne dopiero do oceny wizualnej. Jeśli K-47 zostanie przyjęte, Kawałek 5 (treść) idzie **przed** Kawałkiem 3 (siatka).

### K-40 — układ siatki galerii *(decyzja; zmienia K-31 dla galerii)*

Stan: kafel o stałej wysokości 300 px (`--gallery-grid-h`) z `object-contain` na `--surface-tile`. Kolor kafla `#1F1913` na tle `#18130F` jest praktycznie niewidoczny, więc ikony „pływają": każda ma inną szerokość (Antoni wąski, Mandylion szeroki), lewe krawędzie obrazów nie tworzą linii. Na mobile kafel ma 160×300 px — ikona 3:4 zajmuje ~213 px wysokości, reszta to puste pasy u góry i u dołu. **Obecna strona WP nie używa masonry** (weryfikacja 2026-09-19, pomiary w przeglądarce). To wtyczka FooGallery w układzie *Justified* (`foogallery-justified`; `rowHeight: 240`, `maxRowHeight: 350`, `margins: 10`, `align: center`, `lastRow: smart`) — wyrównane rzędy jak we Flickr, czyli opcja B poniżej. Wszystkie prace w rzędzie mają tę samą wysokość, szerokość wynika z proporcji zdjęcia, kolejność czytania idzie rzędami, pustych pasów brak. Kontener treści ma tylko 704 px (obok paska bocznego): 3–4 ikony w rzędzie, rzędy 240–316 px. Tytuły to nakładka widoczna dopiero po najechaniu (`opacity: 0`) — na dotyku nie widać ich wcale. Mobile (390 px): jedna kolumna, ikony 263×350 wyśrodkowane w 312 px, obie galerie razem ~16 750 px wysokości — to nie jest wzorzec, dwie kolumny z tego planu są lepsze.

Proporcje **zdjęć** (z atrybutów miniatur, potwierdzone na 6 oryginałach) są bardziej jednolite, niż zakładano: 52 prace, mediana 0,75 (3:4); 38 w przedziale 0,65–0,80, 5 w 0,80–1,0, 8 węższych niż 0,65 (skrajnie 0,46 — Archanioł Gabriel, 515×1119) i jedna pozioma (Boże Narodzenie, 1,21). Wymiary z **podpisów** (25×30, 30×40, 52×36, 30×33, 25×15…) nie odpowiadają proporcjom zdjęć: „Ukrzyżowanie, 52×36" to zdjęcie pionowe 972×1296, „Matka Boża Eleusa, 30×25" — pionowe 1923×2560; 13 z 47 podpisów z wymiarem rozjeżdża się ze zdjęciem o ponad 0,15, a kolejność osi bywa niespójna. Wniosek: układ projektujemy pod zdjęcia w większości pionowe ~3:4 z kilkoma odstępstwami; proporcji nie wolno brać z podpisów.

- **Opcja A (rekomendowana) — „półka":** siatka o stałej szerokości kolumn (4 desktop / 3 tablet / 2 mobile), ramka każdej pracy z `aspect-ratio` równym proporcji pliku, **przyciętym do przedziału 5:8 … 4:3** (`clamp`), obraz `object-fit: contain` + `object-position: bottom`, rząd wyrównany do dołu (`align-items: end`). Ikony stoją na wspólnej linii jak na półce, podpisy tworzą równy rząd. Kolejność czytania rzędami zostaje — potrzebna dla K-41, lightboxa (poprzednia/następna = sąsiad wizualny) i kolejności Tab. Bez JS. Na realnych danych: co najmniej 44 z 52 prac wypełnia ramkę bez pustych pasów; tylko ~8 najwęższych (0,46–0,64) dostaje wąskie pasy po bokach, a żadna praca nie rozpycha rzędu (najwyższa ramka = 1,6 × szerokość kolumny).
- Opcja B — wyrównane rzędy (Flickr / Google Photos; **tak działa dziś WP**): stała wysokość rzędu, zmienna szerokość kafli, rzędy wypełniają szerokość. Najbardziej „galeryjne", zachowuje kolejność i ciągłość z obecną stroną. Wymaga `width`/`height` każdego obrazu w danych i JS do łamania rzędów (lub CSS: `flex-grow` i `flex-basis` proporcjonalne do proporcji zdjęcia — bez JS, ale trzeba obsłużyć ostatni rząd i `max-width` kafla, żeby samotna praca nie rozciągnęła się na cały rząd; WP robi to przez `maxRowHeight` i `lastRow: smart`). Podpisy pod wąskimi ikonami łamią się w 3 linie. Na realnych danych (większość ~3:4) rzędy i tak wyjdą podobnej wysokości, więc B daje niewiele ponad A, a dokłada zmienną liczbę ikon w rzędzie (4 lub 5) i logikę ostatniego rzędu. Wybrać, jeśli EJK zależy na wyglądzie „jak na starej stronie".
- Opcja C — masonry: **nie jest tym, co ma WP** (wcześniejsze „jak WP" było błędne). Kolumny CSS albo JS „do najkrótszej kolumny". Kolejność czyta się kolumnami, nie rzędami: granica sekcji EJK/uczniowie (K-41) się rozmywa, strzałka „następna" w lightboxie prowadzi do ikony, która wizualnie nie stoi obok, fokus klawiatury skacze, każda zmiana filtra tasuje układ inaczej. Masonry pomaga przy zróżnicowanych proporcjach, a tu większość zdjęć to ~3:4 — zysk żaden. Odrzucone.
- Opcja D — obecny grid, tylko poprawki: kafel wyraźnie jaśniejszy od tła (świadome passe-partout), `object-position: bottom`, proporcja kafla 3:4 zamiast stałych 300 px (na mobile liczona od szerokości). Najtańsza; nie usuwa pustych pasów, ale czyni je celowymi. Na realnych danych i tak wystarcza dla ~38 prac w przedziale 0,65–0,80; różnica względem A to tylko stała proporcja 3:4 zamiast proporcji z pliku — skoro `width`/`height` i tak trafiają do danych (Skutek niżej), A kosztuje tyle samo, więc D zostaje planem awaryjnym.

**Decyzja (2026-09-19): opcja A** — jako wybór warunkowy. Po Kawałku 3 układ oceniamy wizualnie na realnych pracach (K-47 A), na zrzutach 1920 / 1024 / 390 px; jeśli wygląda źle (np. za dużo pasów przy wąskich pracach, nierówny rytm rzędów), przechodzimy na opcję B.

**Decyzja końcowa (2026-09-20): opcja B** — wyrównane rzędy (algorytm FooGallery w `justifyGalleryRows.ts`, `object-cover` w kaflu, parametry zbliżone do WP: `rowHeight` 240 / `maxRowHeight` 350, desktop 300 / 400, max 4 kafle w rzędzie, `lastRow: smart`). Opcja A (półka) i tymczasowy przełącznik A/B (`GalleryLayoutContext`, `GalleryLayoutToggle`, stringi `layoutToggle` w `pl.ts`) **usunięte z kodu** — jeden układ produkcyjny.

Pod-decyzja (zatwierdzona): czy „Wybrane ikony" na home przechodzą na ten sam układ (spójność `IconGrid`), czy zostają przy K-31 — zostają przy K-31: to 4 kafle w jednym rzędzie, problem poszarpania jest tam mały; zmiana tylko w wariancie galerii.

Skutek: wymiary obrazu (`width`/`height`) w `IconWork` stają się obowiązkowe (CLS; ramka bierze z nich `aspect-ratio`) i pochodzą **z pliku, nie z podpisu WP**; nie mylić z `dimensions` (wymiar pracy w cm, do wyświetlenia — tylko zweryfikowany, patrz K-47). `sizes` w `next/image` wg liczby kolumn (4/3/2).

### K-41 — kolejność: najpierw EJK, potem uczniowie *(decyzja; doprecyzowuje D-02)*

Stan: widok domyślny („Wszyscy", D-02) miesza prace EJK i uczniów w jednej siatce. Obecna strona WP ma dwie sekcje z nagłówkami: „Ikony pisane ręką Elżbiety Jackowskiej-Kurek" (23 prace), potem „Ikony uczniów" (29 prac) ze zbiorczą listą 21 nazwisk.

- **Rekomendacja — dwie sekcje w widoku domyślnym:** H2 „Ikony Elżbiety Jackowskiej-Kurek" i H2 „Ikony uczniów" (bez licznika w nagłówku). Hierarchia zgodna z D-02 (EJK na pierwszym planie, uczniowie jako owoc warsztatów); podpis w siatce nie musi nieść informacji „kto" (patrz K-42). Podział jest sztywny (nie filtr): filtr tematu działa w obu sekcjach naraz, a sekcja bez wyników znika razem z nagłówkiem. Zbiorczy licznik z rozbiciem na autorów („14 prac — 8 …, 6 …") usunięty z UI.
- Alternatywa B — odrzucona: linki-kotwice w nagłówku zamiast filtra autora (`?autor=` wycofane; nawigacja między sekcjami przez scroll).
- Alternatywa C: jedna siatka, sortowanie EJK → uczniowie, bez nagłówków. Granica między grupami niewidoczna; nie rozwiązuje problemu atrybucji.

**Decyzja (2026-09-19):** rekomendacja (dwie sekcje EJK → uczniowie) w połączeniu z alternatywą B jak wyżej. Pod-decyzja (zatwierdzona): kolejność w obrębie sekcji — `order` z danych (ręczna kuracja); odrzucone: rok malejąco (brak roku przy większości prac) i alfabetycznie.

Skutek: `docs/plan-claude-code.md` — dopisek do D-02 („obie sekcje, EJK pierwsza, sztywny podział"); K-05 zmienione (patrz K-43). Sekcje powstają z danych: jeśli po starcie strony autorskiej EJK prace EJK zostaną usunięte z galerii Akademii (D-02), sekcja EJK znika sama, bez zmian w kodzie. Pytanie „domyślny filtr: uczniowie czy wszyscy" z briefu (D-02) przestaje dotyczyć galerii — zostaje tylko pytanie o zakres prac EJK.

### K-42 — podpisy i atrybucja autorów *(decyzja)*

Stan: podpisy niespójne na trzech poziomach. Siatka desktop: EJK „Tytuł, wymiar", uczniowie „Tytuł, pisana ręką …" bez wymiaru i z błędną odmianą („pisana ręką uczestnik", „…uczestniczka"; poprawnie tylko raz „uczestniczki"). Siatka mobile: sam tytuł — bez filtra nie da się odróżnić EJK od uczniów. Lightbox: pole autora pokazuje samo „uczestniczki" / „uczestniczka" / „uczestnik", a uczniowie nagle mają wymiary. Na stronie WP 19 z 29 prac uczniów ma nazwisko w podpisie („pisany ręką Justyny Suchenek"), 10 nie ma (prace od 2021); zbiorcza lista 21 nazwisk jest dodatkiem, nie zamiennikiem — nie da się z niej ustalić, kto napisał którą pracę.

- **Rekomendacja — trzy poziomy:**
  1. **Siatka:** identyczny format dla wszystkich prac — sam tytuł (pod-decyzja o wymiarze niżej). Bez nazwisk; „kto" niesie sekcja (K-41).
  2. **Sekcja uczniów:** zbiorcza lista nazwisk **generowana z danych** (`authorName` z `icons.json`, unikalne, alfabetycznie po nazwisku) — bez osobnego wstępu; nie ręczny string, żeby nie rozjechał się z pracami.
  3. **Lightbox:** zawsze pełny autor. EJK → „Elżbieta Jackowska-Kurek"; uczeń z nazwiskiem → imię i nazwisko; bez nazwiska → neutralne „Praca z warsztatów Akademii" (unika rodzaju gramatycznego i zmyślania).
- Alternatywa: nazwisko jako druga linia podpisu w siatce (jak WP). Daje atrybucję bez otwierania lightboxa, ale podpisy mają różną wysokość (z nazwiskiem / bez), a nazwiska długie („Joanny Sierpińskiej-Kruś") łamią się pod wąskimi ikonami. Odradzam.

**Decyzja (2026-09-19):** trzy poziomy zgodnie z rekomendacją. Pod-decyzja (zatwierdzona): wymiar w siatce — **nie**, tylko w lightboxie. Wymiar mają nie wszystkie prace (na WP ~10 bez wymiaru), a podpis w siatce ma być równy. Alternatywa: tytuł + wymiar, gdy znany — podpisy nierówne.

Skutek dla danych: `IconWork` → `authorName?: string` (tylko uczniowie), `dimensions?` opcjonalne; szablony podpisów w `pl.gallery` (bez odmiany rzeczowników w kodzie — neutralny fallback).

### K-43 — logika filtrów *(decyzja)*

Stan:
- Autor ma chip „Wszyscy", temat nie ma „Wszystkie"; filtr tematu zdejmuje się tylko ponownym kliknięciem aktywnego chipa — nieodkrywalne, zwłaszcza dla odbiorcy 65+.
- Aktywny chip ma tylko kolor — brak `aria-current` / `aria-pressed`.
- Suma tematów = 12 z 14 prac: dwie prace bez tagów znikają przy każdym filtrze tematu (przy migracji problem urośnie).
- `?temat=nieistnieje` → „0 prac…", żaden chip tematu aktywny, brak komunikatu i resetu.
- „Święci" obok „Święta" — dwa prawie identyczne słowa o innym znaczeniu.
- Tagi `sample` nie pokrywają realnych prac: na WP 6 prac to archaniołowie, 3 to Trójca Święta — nie pasują do żadnej obecnej kategorii.

**Decyzja (2026-09-19): rekomendacja ze zmianą — filtr autora znika z UI.** Podział EJK / uczniowie jest sztywny (sekcje z K-41, jak na WP), a nie filtrowany. W UI zostaje jeden filtr — temat. `?autor=` (K-05) wycofane. Pod-decyzja o taksonomii tematów zatwierdzona (niżej).

Rekomendacja — pakiet, w wersji po zmianie:

1. Chip „Wszystkie" jako pierwszy w rzędzie tematu: zawsze dokładnie jeden aktywny chip, „Wszystkie" = brak parametru w URL. Kliknięcie aktywnego chipa zostaje jako skrót (reset do „Wszystkie"), ale nie jako jedyna droga.
2. **Wybór jednokrotny.** Filtr tematu działa w obu sekcjach naraz (K-41).
3. „Wszystkie" = brak filtra (pokazuje także prace bez tagu), nie suma tagów. Walidacja w warstwie treści przy buildzie: każda praca ma ≥ 1 tag, inaczej build się wywraca z listą slugów. Analogicznie każdy temat z taksonomii ma ≥ 1 pracę — chip bez prac nie ma prawa się pojawić.
4. Nieznany slug w `?temat=` → ignorowany i usuwany z URL (`router.replace`), widok jak bez filtra. Dawne `?autor=` — ignorowane i usuwane z URL (jak nieznany `temat`).
5. Stan pusty **nie jest potrzebny** (wniosek z decyzji): chipy powstają tylko dla tematów z ≥ 1 pracą (pkt 3), a sekcja bez wyników znika razem z nagłówkiem (K-41); zamiast komunikatu — walidacja buildu.
6. `aria-current="true"` na aktywnym chipie (chipy są linkami — nie `aria-pressed`); grupa z `aria-label` („Filtruj według tematu").

- Alternatywa dla 2 — wybór wielokrotny w temacie (OR w temacie, `?temat=a,b`). Przy 4–6 kategoriach zysk znikomy; wizualnie identyczne chipy działałyby raz jak radio, raz jak checkbox. Jeśli kiedyś — zaznaczenie wszystkich tematów musi automatycznie przełączyć na „Wszystkie" i wyczyścić parametr. Odradzam w v1.
- Odrzucone: filtr autora jako drugi rząd chipów (wersja pierwotna tego pakietu) — zastąpiony sztywnym podziałem na sekcje (K-41).

Pod-decyzja — taksonomia tematów, do ustalenia na realnych 52 pracach z WP (nie na `sample`). Rekomendacja: **Chrystus · Matka Boża · Aniołowie · Święci · Sceny i święta** (Przemienienie, Boże Narodzenie, Zstąpienie Ducha, Trójca/Gościnność Abrahama, Ukrzyżowanie). „Sceny i święta" usuwa kolizję „Święci"/„Święta". Alternatywa: tag awaryjny „Inne" zamiast walidacji — odradzam, staje się workiem na wszystko.

Kolejność chipów tematu: wg taksonomii (stała lista w danych), nie alfabetycznie — zmiana względem planu 05 („sort alfabetyczny").

### K-44 — nagłówek galerii: pustka po prawej, filtry na mobile *(decyzja)*

Stan: desktop — cały nagłówek (SectionNav, H1, filtry) wyrównany do lewej; blok ~450 px wysokości zajmuje lewą połowę kontenera 1280 px, prawa połowa pusta, a pod spodem siatka na pełną szerokość. Na stronach tekstowych to działa, na galerii wygląda na niedokończone. Mobile (390 px): chipy zawijają się nierówno (EJK i „Uczniowie" w osobnych wierszach), pierwsza ikona zaczyna się na ~810 px — przy ekranie 844 px strona galerii nie pokazuje przy wejściu żadnej ikony.

**Decyzja (2026-09-19):** nagłówek **jednokolumnowy** na wszystkich szerokościach (H1, pod nim filtr tematu); bez układu dwukolumnowego od 1024 px. Mobile — poziomy pasek chipów (rekomendacja poniżej).

Desktop:

- Opcja A — dwukolumnowy od 1024 px (H1 / filtr w prawej kolumnie): **nie wdrożona**.
- **Stan końcowy (opcja B):** wszystko po lewej — H1, pod spodem filtr tematu; chipy zawijane od `md`. Najbliższa makiecie `#2a-ikony`.
- Opcja C — karta „Ikony na zamówienie" w prawej kolumnie. Odradzam: potrójny komunikat (zajawka na dole + karta obok nagłówka) i obraz obok nagłówka konkuruje z ikonami w siatce (brief: interfejs eksponuje ikony, nie rywalizuje z nimi).
- Odrzucone z góry: dekoracyjna ikona „żeby coś było".

Mobile (niezależnie od wariantu desktop):

- **Rekomendacja:** chipy tematu w poziomym pasku przewijanym (`overflow-x: auto`, etykieta „Temat" nad paskiem, nie obok), z widocznym ucięciem ostatniego chipa jako sygnałem przewijania. Cel: pierwszy rząd ikon widoczny przy 390×844 bez przewijania.
- Alternatywa: przycisk „Filtruj" otwierający panel. Oszczędza najwięcej miejsca, ale ukrywa filtry za kliknięciem — sprzeczne z duchem brief §4.1 (nawigacja nieukryta). Odradzam.
- Alternatywa: zawijanie jak dziś, ale etykieta nad chipami i równe odstępy. Tanio, nie rozwiązuje foldu.

Uwaga: poziome przewijanie chipów to wyjątek od zasady z K-23 (SectionNav bez poziomego scrolla) — filtry to nie nawigacja, ale wpisać jako świadome odstępstwo.

### K-45 — lightbox: rozmiar obrazu i układ mobile *(decyzja; zmienia K-39)*

Stan desktop: obraz ma na sztywno 460 px wysokości przy oknie 917 px (345×460 wyświetlane, naturalne 460×613 z `next/image`) — ikona zajmuje połowę ekranu, detalu nie widać. Strzałki cienkie, blisko treści, giną w ciemności; licznik „2 z 14" drobny, w rogu ekranu. Kolumna metadanych to trzy krótkie linie (tytuł, autor, wymiar) — bez roku, techniki i opisu wygląda na niedokończoną. Kliknięcie w tło nie zamyka dialogu.

Stan mobile (390 px): obraz na pełną szerokość, przy wysokich ikonach 390×693 px; tytuł zaczyna się na ~790 px, przyciski Poprzednia/Następna na ~960 px — pod zgięciem. Użytkownik widzi tylko obraz i „Zamknij". Brak obsługi swipe (w dialogu tylko `onClick`).

Działa poprawnie: Esc, strzałki klawiatury, zapętlenie 14 → 1, powrót fokusu na kliknięty kafel (przy kliknięciu myszą/klawiaturą).

Rekomendacja desktop:

1. Obraz `max-height: min(80vh, …)`, szerokość z proporcji; źródło obrazu odpowiednio większe — to zmienia K-39: albo `sizes` liczone od wysokości okna (np. `(min-width: 768px) 60vw`), albo `imageLarge` w `IconWork` już teraz (rekomendacja: `sizes`, `imageLarge` dopiero przy migracji oryginałów).
2. Strzałki przy krawędziach okna (nie przy treści), cel 48×48 z widocznym tłem (np. `--surface-card` 80%), kontrast ikony ≥ 3:1.
3. Licznik przeniesiony do kolumny metadanych, nad tytuł, w roli meta (`--accent-text`).
4. Metadane: sekcja autora zgodnie z K-42; rok i technika wyświetlane, gdy są w danych (pole istnieje w `IconWork`); link „Zapytaj o podobną ikonę" jako ostatni element z odstępem — **tylko przy pracach EJK** (decyzja 2026-09-19); przy pracach uczniów bez linku.
5. Klik w tło (`::backdrop`) zamyka dialog.

Rekomendacja mobile:

1. Obraz `max-height: ~60svh`, wyśrodkowany.
2. Pod obrazem tytuł i autor (pierwsze dwie linie widoczne bez przewijania).
3. Pasek Poprzednia / licznik / Następna przypięty do dołu dialogu (`position: sticky; bottom: 0`), cele 48 px.
4. Swipe — pod-decyzja: rekomendacja **tak** (prosty `pointerdown`/`pointerup` z progiem 50 px, bez biblioteki); alternatywa: bez swipe w v1, sama przypięta nawigacja wystarcza.

**Decyzja (2026-09-19): rekomendacja zatwierdzona** (desktop i mobile), swipe — **tak**; link „Zapytaj o podobną ikonę" tylko przy pracach EJK. Poprzednia/Następna: jedna sekwencja w kolejności wizualnej (EJK → uczniowie), zgodna z aktywnym filtrem tematu, z zapętleniem (założenie wynikające z układu sekcji — do zmiany, jeśli sekwencja ma kończyć się na granicy sekcji).

Alternatywa (całość): obraz na pełny ekran z nakładką metadanych chowaną tapnięciem (wzorzec aplikacji zdjęć). Maksymalny obraz, ale ukryte metadane i niejasny gest dla 65+. Odradzam.

### K-46 — zajawka „Ikony na zamówienie" *(decyzja, treść)*

Stan: zajawka na dole strony miała zdjęcie pracowni (zielona cerata, paleta, ucięta ikona, słabe światło) — najsłabszy obraz na stronie, ustawiony przy CTA sprzedażowym. CTA to mały link tekstowy.

- **Rekomendacja — zdjęcie zajawki:** gotowa ikona EJK spoza siatki (np. detal złocenia) albo ujęcie pracy w toku z bliska, bez tła stołu. Do wyboru z `design/uploads/` lub z WP; jeśli nic nie pasuje — zajawka bez zdjęcia (H2 + zdanie + przycisk) do czasu sesji zdjęciowej.
- Alternatywa: zostawić zdjęcie, przyciemnić i przyciąć do detalu dłoni i ikony. Tańsze, efekt niepewny.

**Decyzja (2026-09-19):** rekomendacje zatwierdzone (zdjęcie zajawki do wymiany albo zajawka bez zdjęcia). Pod-decyzja (zatwierdzona): CTA zajawki jako przycisk (jak `FactsBox`) zamiast linku tekstowego — to jedyne CTA sprzedażowe na stronie.

### K-47 — treść `sample` galerii *(decyzja; zmienia plan 05 „tylko 4 zdjęcia")*

Stan: 14 wpisów na 4 zdjęciach, z tytułami, które nie pasują do obrazów:
- „Chrystus Oblubieniec" pokazuje zdjęcie Mandylionu;
- „Św. Antoni z Dzieciątkiem" pokazuje Antoniego Pustelnika (Antoni z Dzieciątkiem to Antoni Padewski);
- „Transfiguracja" to ten sam obraz co „Przemienienie";
- „Przemnienienie C" (literówka) i „Mandylion B" wyglądają jak robocze etykiety;
- alt „Ikona z pracowni", „Ikona napisana na warsztatach" — generyczne.

Wymiary (40×30, 60×45, 35×28, 40×55) wyświetlane jak fakty i powtarzane między różnymi pracami — DoD planu 05 („brak zmyślonych cm") spełnione tylko w danych, nie w UI. Plan 05 (ryzyka) zapowiadał `[do uzupełnienia: …]` — na stronie ich nie ma. EJK zauważy to w pierwszych sekundach.

- **Opcja A (rekomendowana):** ~15 prawdziwych prac z WP jako `sample` — np. 8 EJK + 7 uczniów (w tym 2–3 bez nazwiska, żeby przetestować fallback K-42), oryginały z `/wp-content/uploads/YYYY/MM/`, tytuły, autorzy i wymiary z podpisów WP (poprawione literówki: „Madylion", „Mgdaleny", „Advokata"). Daje realne proporcje do oceny K-40, realne nazwiska do K-42 i realne tematy do K-43. Zestaw musi zawierać skrajne zdjęcia z WP (Archanioł Gabriel 0,46, Boże Narodzenie 1,21, 1–2 prace ~0,56) obok typowych ~3:4. Wymiary z podpisów WP importować jako niezweryfikowane (rozjeżdżają się ze zdjęciami, niespójna kolejność osi — patrz K-40) i wyświetlać dopiero po potwierdzeniu przez EJK. To wyciąg z pod-etapu 8, nie pełna migracja; oznaczone `sample` w `docs/plan-claude-code.md` §5.
- Opcja B: zostać przy 4 zdjęciach, ale tytuły ściśle zgodne z obrazem (duplikaty tytułów dopuszczalne — „Mandylion" ×3), bez wymiarów w UI (flaga `dimensionsVerified: false` → wymiar niewyświetlany). Uczciwe, ale K-40 i K-43 oceniane na nierealnych danych.
- Opcja C: jak B, z widocznymi znacznikami `[do uzupełnienia]` w podpisach. Szczere na stagingu, ale psuje przegląd wizualny.

**Decyzja (2026-09-19): opcja A** — ~15 prac z WP jako `sample`, z zestawem ze skrajnymi zdjęciami i wymiarami z podpisów oznaczonymi jako niezweryfikowane (patrz wyżej).

Uwaga do briefu: brief v2 §2.2 podaje „~38 ikon Elżbiety + ~28 ikon uczniów"; na stronie WP jest 23 + 29 (3 prace EJK bez podpisu). Zaktualizować liczby w briefie i szacunek w planie migracji.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność w tym pod-etapie |
| ---- | ----------- | --------------------------------- |
| `content/icons.json` | zmiana | K-47: prawdziwe prace (A) lub poprawione tytuły (B); `authorName`, `width`/`height`, tagi wg taksonomii K-43 |
| `public/media/sample/icons/*` | zmiana | K-47 A: oryginały z WP; K-46: zdjęcie zajawki |
| `src/content/icons.ts` | zmiana | Typ `IconWork` (`authorName?`, `width`, `height`, `dimensions?`); walidacja tagów przy buildzie; grupowanie w sekcje; normalizacja nieznanych slugów; lista nazwisk uczniów z danych |
| `src/components/gallery/GalleryPage.tsx` | zmiana | Nagłówek jednokolumnowy (K-44); sekcje K-41; usunięcie filtra autora i zbiorczego licznika |
| `src/components/gallery/GallerySection.tsx` | nowy | H2 z `id`, lista nazwisk (sekcja uczniów), siatka |
| `src/components/gallery/GalleryFilters.tsx` | zmiana | Tylko filtr tematu: „Wszystkie", `aria-current`, `aria-label` grupy, pasek przewijany na mobile |
| `src/components/core/FilterChip.tsx` | zmiana | `aria-current` dla stanu aktywnego |
| `src/components/gallery/IconGrid.tsx` | zmiana | Wariant galerii: układ K-40 B (`GalleryJustifiedGrid`); podpis wg K-42; pierwszy rząd bez `loading="lazy"`; home bez zmian (K-31) |
| `src/components/gallery/justifyGalleryRows.ts` | nowy | Algorytm wyrównanych rzędów (FooGallery) — K-40 B |
| `src/components/gallery/GalleryLayoutContext.tsx` | usunięty | Tymczasowy kontekst A/B (2026-09-20) |
| `src/components/gallery/GalleryLayoutToggle.tsx` | usunięty | Przycisk porównania układów (2026-09-20) |
| `src/components/gallery/Lightbox.tsx` | zmiana | K-45: rozmiar obrazu, strzałki, licznik w metadanych, klik w tło, scroll lock, sticky nawigacja mobile, swipe; link „Zapytaj o podobną ikonę" tylko przy pracach EJK |
| `src/components/gallery/GalleryOrderTeaser.tsx` | zmiana | Odstępy sekcji (`--section-gap`); CTA jako przycisk; zdjęcie wg K-46 |
| `src/components/navigation/Footer.tsx` | zmiana | Bug: poziome przewijanie na wąskim ekranie (tylko naprawa — design stopki zostaje w K-36) |
| `src/i18n/pl.ts` | zmiana | Nagłówki sekcji; fallback autora; etykieta grupy filtra tematu |
| `src/app/globals.css` | zmiana | Kolor kafla (jeśli K-40 D), style lightboxa, `html:has(dialog[open])` scroll lock |
| `docs/plans/05-galeria.md` | zmiana | Korekta tabeli „Postęp" i DoD (punkty oznaczone ✅, które nie działały — patrz Ryzyka) |
| `docs/brief-claude-code.md`, `docs/plan-claude-code.md` | zmiana | Rejestr K-40…K-47; K-05 zmienione (`?autor=` wycofane); dopisek do D-02; liczby prac w briefie; §5 `sample` |

## Kawałki

### Kawałek 1 — Bugi (bez decyzji, można zacząć od razu)

Zakres:

- **Zajawka „Ikony na zamówienie":** margines górny i dolny sekcji = 0 px — ostatni podpis siatki stoi tuż nad linią zajawki, zdjęcie dotyka linii stopki. → `--section-gap` góra i dół.
- **Scroll lock w lightboxie:** przy otwartym dialogu kółko myszy przewija stronę pod spodem (pomiar: `scrollY` 295 → 795). `showModal()` tego nie blokuje → `overflow: hidden` na `html` na czas otwarcia (`html:has(dialog[open])` lub klasa ustawiana w efekcie). Plan 05, Kawałek 3 miał to jako kryterium „gotowe".
- **Klik w tło zamyka lightbox** (`click` na `dialog`, gdy `event.target === dialog`).
- **Nieznany slug** w `?temat=` → ignorowany, usuwany z URL (`?autor=` znika w Kawałku 2 razem z filtrem autora; stan pusty po K-43 nieosiągalny — pominięty).
- **`aria-current`** na aktywnym chipie.
- **Pierwszy rząd siatki bez `loading="lazy"`** (dziś ikony nad foldem mają `lazy` i przy wejściu widać puste ciemne kafle).
- **Stopka mobile:** treść szersza niż okno (pomiar: `scrollWidth` 435 px przy `clientWidth` 373 px) → poziome przewijanie całej strony. Naprawa zawijania linków w kolumnach (`min-width: 0`, `overflow-wrap`).

Kryterium „gotowe": każdy punkt potwierdzony pomiarem lub zrzutem w meldunku (wartość przed → po); scroll lock sprawdzony realnym przewinięciem, nie tylko odczytem stylu; build/lint OK.

### Kawałek 2 — Filtry i nagłówek (K-43, K-44)

Zakres: usunięcie filtra autora i `?autor=` (K-43; do Kawałka 3 galeria jest przejściowo jedną siatką bez podziału na sekcje); „Wszystkie" w temacie; wybór jednokrotny; kolejność chipów z taksonomii; walidacja tagów i tematów przy buildzie; nagłówek jednokolumnowy i filtr mobile wg K-44; `aria-label` grupy filtra.

Kryterium „gotowe": zrzuty 1920, 1440, 1024 i 390 px; przy 390×844 pierwszy rząd ikon widoczny bez przewijania (pomiar `getBoundingClientRect().top` pierwszego obrazu < 844); każdy temat w meldunku (tabela temat → liczba prac EJK / uczniów); suma prac po tematach ≥ liczba prac (każda praca ma tag); build wywraca się na pracy bez tagu (test).

### Kawałek 3 — Siatka, sekcje, podpisy w siatce (K-40, K-41, K-42 pkt 1–2)

Zakres: układ siatki wg K-40; sekcje EJK → uczniowie z H2; lista nazwisk uczniów generowana z danych; jednolity podpis w siatce; usunięcie zbiorczego licznika; `width`/`height` obrazów (brak CLS).

Kryterium „gotowe": zrzuty desktop i 390 px przed/po; na realnych proporcjach (K-47 A, w tym Archanioł Gabriel 0,46 i Boże Narodzenie 1,21) rzędy wypełniają szerokość kontenera, wysokość rzędu spójna w obrębie rzędu; kolejność Tab = kolejność wizualna rzędami; „Wybrane ikony" na home bez regresji (zrzut); CLS = 0 przy ładowaniu siatki; meldunek zawiera ocenę K-40 (A vs B) — **domknięte na B (2026-09-20)**.

### Kawałek 4 — Lightbox (K-45, K-42 pkt 3)

Zakres: rozmiar obrazu i `sizes`; strzałki i licznik; metadane (autor wg K-42, rok, technika gdy są; „Zapytaj o podobną ikonę" tylko przy pracach EJK); mobile — obraz `max-height`, tytuł i autor nad zgięciem, sticky nawigacja; swipe (zatwierdzony); `prefers-reduced-motion` bez zmian.

Kryterium „gotowe": desktop 1920×917 — obraz ≥ 70% wysokości okna (pomiar); mobile 390×844 — tytuł, autor i przyciski Poprzednia/Następna widoczne bez przewijania dla najwyższej ikony w danych (pomiar); Esc, strzałki, klik w tło, powrót fokusu — sprawdzone ręcznie w przeglądarce. Test na fizycznym iOS Safari — **pod-etap 7** (K-38).

### Kawałek 5 — Treść: `sample`, zajawka (K-46, K-47)

Zakres: `icons.json` wg K-47; alty zgodne z tytułami („Ikona: Mandylion"); zdjęcie i CTA zajawki; poprawione literówki z WP; wpis do §5 `docs/plan-claude-code.md`.

Kryterium „gotowe": każdy tytuł zgodny z tym, co przedstawia zdjęcie (lista w meldunku: slug → tytuł → plik); żaden niezweryfikowany wymiar nie jest wyświetlany w UI (wymiary z podpisów WP dopiero po potwierdzeniu przez EJK — patrz K-40 i K-47); grep po „Przemnienienie", „Madylion", „Advokata", „Mgdaleny" pusty. Jeśli K-47 A — kawałek wykonany **przed** Kawałkiem 3.

### Kawałek 6 — Przegląd wizualny i zamknięcie

Zakres: przegląd całej `/ikony` oczami użytkownika (nie tylko build/lint): zrzuty 1920, 1440, 1024 (tablet), 390 px — nagłówek, każda sekcja, zajawka, stopka, lightbox (desktop + mobile, najwyższa i najszersza ikona); audyt a11y ręczny (formalny Lighthouse — pod-etap 7); korekta `docs/plans/05-galeria.md`; rejestr K-40…K-47.

Kryterium „gotowe": DoD pod-etapu spełnione; meldunek ze zrzutami i listą odstępstw od makiety `#2a-ikony`.

## Dane sample dodawane w tym pod-etapie

- K-47 A: ~15 prac z WP (oryginały, tytuły, autorzy, wymiary z podpisów) → `docs/plan-claude-code.md` §5, oznaczone jako wyciąg z migracji (pod-etap 8 nie importuje ich ponownie).
- K-47 B: brak nowych plików; poprawione tytuły i `dimensionsVerified: false` w `icons.json`.
- K-46: nowe zdjęcie zajawki (lub brak zdjęcia) → §5.
- Lista nazwisk uczniów — nie jest osobną treścią; generowana z `authorName`.

## Kryteria ukończenia pod-etapu

- [x] wszystkie punkty Kawałka 1 potwierdzone pomiarem; scroll lock sprawdzony realnym przewinięciem
- [x] sztywny podział: sekcja EJK, potem sekcja uczniów; brak filtra autora i `?autor=` (K-41, K-43)
- [x] podpisy w siatce w jednym formacie; pełny autor w lightboxie; lista nazwisk uczniów z danych (K-42)
- [x] filtr tematu z chipem „Wszystkie”, wybór jednokrotny, `aria-current`; każda praca ma tag, każdy temat ≥ 1 pracę (walidacja buildu); nieznany slug obsłużony (K-43)
- [x] 390×844: pierwszy rząd ikon nad zgięciem (y = 643); w lightboxie tytuł, autor i nawigacja bez przewijania (K-44, K-45). Uwaga: przy 390×664 (Safari z paskami) pierwsza ikona zaczyna się na y = 643, czyli tuż przy zgięciu
- [x] desktop: obraz w lightboxie ≥ 70% wysokości okna (K-45) — 80% dla wszystkich 21 prac
- [x] żaden tytuł niezgodny ze zdjęciem; żaden niezweryfikowany wymiar w UI (K-47)
- [x] lightbox na fizycznym iOS Safari — **przeniesione do pod-etapu 7** (K-38)
- [x] brak poziomego przewijania strony przy 360 i 390 px (także 768, 1024, 1440, 1920)
- [x] Lighthouse dostępność na `/ikony` (mobile) ≥ 95 — **przeniesione do pod-etapu 7** (raport Lighthouse dla 5 tras, w tym galeria); w 05b zastąpione audytem ręcznym (kontrast min. 6,04:1, zero nienazwanych kontrolek, poprawne nagłówki i landmarki, obrys fokusu 2 px `#e8c765`)
- [x] zrzuty 1920 / 1440 / 1024 / 768 / 390 / 360 px (pełna strona) oraz lightbox 1920 / 1024 / 768 / 390 dla najwyższej i najszerszej ikony — pliki poza repo (katalog tymczasowy sesji)
- [x] K-40…K-47 w `docs/plan-claude-code.md` §4; K-05 zmienione (`?autor=` wycofane), D-02 doprecyzowane; `05-galeria.md` skorygowany; liczby prac w briefach zaktualizowane

## Odstępstwa od makiety `#2a-ikony` (stan po Kawałku 6)

| Makieta / plan 05 | Implementacja | Numer |
| ----------------- | ------------- | ----- |
| Jedna siatka, kafel 300 px, `object-contain` na `--surface-tile` | Wyrównane rzędy (K-40 B): stała wysokość rzędu, zmienna szerokość kafli (`justifyGalleryRows`, `object-cover`); jak WP FooGallery | K-40 |
| Filtry autor + temat, licznik z rozbiciem na autorów | Filtr tylko tematu; dwie sekcje EJK → uczniowie z H2 (bez licznika) | K-41, K-43 |
| Podpisy z wymiarem i „pisana ręką …” | Sam tytuł w siatce; autor w lightboxie; lista nazwisk uczniów w sekcji | K-42 |
| Chipy zawijane na mobile | Mobile — poziomy pasek chipów (odstępstwo od K-23); od `md` chipy zawijane pod H1 | K-44 |
| Lightbox: obraz 460 px, strzałki przy treści, licznik w rogu | Obraz 80vh / 60svh, strzałki przy krawędziach okna, licznik w metadanych, sticky pasek + swipe na mobile, układ desktopowy od 1024 px | K-45 |
| Zajawka ze zdjęciem i linkiem tekstowym | Bez zdjęcia, przycisk | K-46 |
| Dane: 4 zdjęcia × 14 wpisów | 21 prac z WP | K-47 |

## Ustalenia z przeglądu (Kawałek 6)

- **Zamknięte bez zmian w kodzie:** przegląd 1920 / 1440 / 1024 / 768 / 390 / 360 px, lightbox (najwyższa ikona 0,46 i najszersza 1,21) na 1920 / 1024 / 768 / 390 px, fokus klawiaturą (65 przystanków, obrys `solid 2px #e8c765`, offset 2 px), fokus w dialogu nie trafia na stronę pod spodem.
- **K-40 (2026-09-20):** po ocenie na 21 pracach z WP wybrano opcję **B** (wyrównane rzędy). Usunięto układ A (półka), `GalleryLayoutContext`, `GalleryLayoutToggle` i stringi `layoutToggle` — jeden układ produkcyjny w `IconGrid`.
- **Otwarte:** brak (formalny Lighthouse i test iOS Safari lightboxa — pod-etap 7).
- **Poza zakresem 05b — zgłoszone:** (1) `Header` na 768 px łamie „O Akademii” na dwie linie; (2) „Zapytaj o podobną ikonę” w lightboxie 23 px (< 24 px z WCAG 2.5.8; przycisk 44 px zmieniłby design); (3) w `@theme` brak mapowania `space-1`, `space-8`, `space-9` — klasy `mb-space-1` w `Footer.tsx` nic nie robią.
## Ryzyka i pytania otwarte

- **Kryteria „gotowe" bez przeglądu wizualnego.** Plan 05 ma wszystkie kawałki ✅ i DoD odhaczone na podstawie build/lint i Lighthouse a11y 100, a na stagingu: scroll pod lightboxem nie jest zablokowany (Kawałek 3), zajawka nie ma odstępów (Kawałek 2 — „zgodne z `#2a-ikony` co do teasera"), wymiary niezweryfikowane są widoczne (DoD). Wniosek procesowy: każdy kawałek z UI ma w kryterium „gotowe" zrzuty desktop + 390 px i sprawdzenie zachowania w przeglądarce, nie tylko odczyt stylu.
- **Ocena układu na nierealnych danych.** 4 zdjęcia o podobnych proporcjach nie pokażą problemów K-40 (skrajne zdjęcia z WP: Archanioł Gabriel 0,46, Boże Narodzenie 1,21; „52×36" i „25×15" to wymiary z podpisów, nie proporcje zdjęć) ani K-43 (archaniołowie, Trójca). Stąd rekomendacja K-47 A.
- **Zgoda na nazwiska uczniów.** Nazwiska są już publiczne na WP, ale przy nowej stronie warto potwierdzić z Akademią, czy lista i podpisy w lightboxie mogą zostać (zwłaszcza prace bez nazwiska na WP — nie dopisywać nazwisk z innych źródeł).
- **Poziomy pasek chipów na mobile (K-44)** — gest przewijania w poziomie bywa nieodkrywalny dla 65+; ucięty ostatni chip jako sygnał jest obowiązkowy. Test z jedną osobą z grupy docelowej, jeśli możliwy.
- **Zmiana K-39** zwiększa wagę obrazów w lightboxie — weryfikacja wydajności nadal w pod-etapie 7.
- **Nieobejrzane:** fizyczny iOS lightbox (→ pod-etap 7), Android, tablet 768–1023 px, stany hover i fokus kafli (nie weryfikowano wizualnie), powiększenie przeglądarki 125–150%, `/ikony/na-zamowienie`.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| ------- | ------ | ------------------- |
| 1 — Bugi | ✅ | zmierzone przed → po (headless Edge, 1920×917 i 390/360 px); `pt` pod linią zajawki = `space-7`, kliknięcie w tło: desktop |
| 2 — Filtry i nagłówek | ✅ | K-44 jednokolumnowy; slug `swieta` → `sceny-i-swieta` |
| 3 — Siatka, sekcje, podpisy | ✅ | K-40 **B** (2026-09-20); półka i toggle A/B usunięte |
| 4 — Lightbox | ✅ | układ desktopowy od `lg` (1024 px); obraz o jawnej szerokości z proporcji; test iOS Safari → pod-etap 7 |
| 5 — Treść | ✅ | 52 prace z WP; wymiary „do weryfikacji”; zajawka bez zdjęcia; nazwiska uczniów do poprawy przez właściciela |
| 6 — Przegląd i zamknięcie | ✅ | formalny Lighthouse i test iOS Safari → pod-etap 7; poza zakresem: `Header` łamie „O Akademii” na 768 px |

**Pod-etap 05b zamknięty (OK użytkownika, 2026-09-20).**

## Załącznik — pomiary wyjściowe (staging, 2026-09-19)

Desktop 1920×917, kontener treści 1280 px (x ≈ 320…1600).

| Miejsce | Pomiar |
| ------- | ------ |
| Tło / kafel | `#18130F` / `#1F1913` (`--surface-tile`) — różnica praktycznie niewidoczna |
| Kafel siatki desktop | 276×300, `object-fit: contain`; ikony pionowe ~225 px szerokości |
| Kafel siatki mobile | 160×300 (2 kolumny); pierwsza ikona od y ≈ 810 przy oknie 844 |
| Podpis w siatce | EB Garamond 16,5 px, `#A2917C` (kontrast ~6:1 — OK) |
| Lead | IBM Plex Sans 19,5 / 31,2, `#C7B8A2`, maks. 680 px |
| Chipy filtrów | 48 px wysokości; aktywny: tło `#C9A227`, tekst `#18130F`; brak `aria-current` / `aria-pressed` |
| Licznik | „14 prac — 8 Elżbiety Jackowskiej-Kurek, 6 uczestników warsztatów"; przy filtrze: „1 prac — 0 …, 1 …" |
| Filtry tematu | Chrystus 3 · Matka Boża 3 · Święci 3 · Święta 3 = 12 z 14 (2 prace bez tagu) |
| `?temat=nieistnieje` | „0 prac …", brak komunikatu, od razu zajawka |
| Zajawka | `margin-top: 0`, `padding-top: 0`; zdjęcie 571×321 dotyka linii stopki |
| Obrazy nad foldem | `loading="lazy"` — puste kafle przy pierwszym renderze |
| Lightbox desktop | obraz 345×460 (naturalny 460×613, `sizes: (min-width: 768px) 460px, 100vw`); strzałki 48×48; licznik w lewym górnym rogu okna |
| Lightbox — scroll | przy otwartym dialogu `scrollY` 295 → 795 po przewinięciu kółkiem; `overflow` na `html`/`body`: `visible` |
| Lightbox — tło | brak zamykania kliknięciem w `::backdrop` |
| Lightbox mobile | obraz 390×693 (Antoni); tytuł y ≈ 789, Poprzednia/Następna y ≈ 957 przy oknie 720; brak swipe |
| Lightbox — autor uczniów | „uczestniczki", „uczestniczka", „uczestnik" (samo słowo w polu autora) |
| Stopka mobile | `scrollWidth` 435 px przy `clientWidth` 373 px — poziome przewijanie strony |
| WP — galeria | 23 prace EJK (3 bez podpisu) + 29 prac uczniów (19 z nazwiskiem w podpisie, 10 bez); lista 21 nazwisk; 6 prac to archaniołowie, 3 to Trójca Święta |
| WP — układ galerii | FooGallery *Justified*: `rowHeight` 240, `maxRowHeight` 350, `margins` 10, `align` center, `lastRow` smart; kontener 704 px (z paskiem bocznym): 3–4 ikony w rzędzie, rzędy 240–316 px; mobile 390 px: 1 kolumna, ikony 263×350, galerie 7796 + 8958 px; tytuły — nakładka na hover (`opacity: 0`) |
| WP — proporcje zdjęć | 52 prace: min 0,46 · mediana 0,75 · maks 1,21; < 0,65: 8, 0,65–0,80: 38, 0,80–1,0: 5, > 1,0: 1; podpis z wymiarem rozjeżdża się ze zdjęciem (> 0,15) w 13 z 47 przypadków |
