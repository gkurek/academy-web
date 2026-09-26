# Plan 07b — Przegląd i korekty Aktualności (stan końcowy)

Status: zamknięty 2026-09-22 (etap 7 zamknięty)
Gałąź: feat/07-news

Dokument opisuje **stan docelowy** listy `/aktualnosci` po przeglądzie stagingu i korektach — nie proces, którym do niego doszliśmy. Rejestr decyzji K-59…K-75 (kontynuacja numeracji `docs/plan-claude-code.md` §4).

## Cel i zakres

Długie archiwum (58+ wpisów, docelowo więcej po migracji) czyta się jak kronika: czytelne karty, równy rytm, jedna spójna nawigacja po latach dostępna w każdym miejscu listy, zajawki napisane dla ludzi, a nie wycięte z treści.

W zakresie: karta wpisu (`NewsCard`), wyróżniony wpis, etykiety typu, formatowanie dat, zapasowe generowanie zajawek, nawigacja po latach (sticky pasek), zwinięte archiwum (rozstrzygnięcie K-06), porządki w danych `sample`, ręczne zajawki 15 najnowszych wpisów, spójne tytuły wpisów wykładowych.

Poza zakresem: **funkcja strony Aktualności — zapowiedzi vs kronika (K-69, otwarte)**, strona wpisu `/aktualnosci/[slug]` (poza formatem dat), `/ikony/wystawa` i `editions.json` (etap 8), pełna migracja WP (etap 9), filtry kategorii (K-52 — świadomie brak), JSON-LD (etap 10).

## Rejestr decyzji

| # | Decyzja | Finalny wybór |
|---|---|---|
| K-59 | Karta wpisu — układ i klikalność | Układ z makiety (kolumna daty, tytuł + zajawka, „Czytaj →”); cała karta klikalna jednym linkiem; „Czytaj” jako element wizualny, nie drugi link |
| K-60 | Wysokość karty | Bez sztywnej wysokości; limit linii: tytuł 2, zajawka 3 |
| K-61 | Etykiety typu (`kind`) | `aktualnosc` → „Z Akademii”, `wyjazd` → „Wyjazd studyjny”, pozostałe (Wykłady, Warsztaty, Plener, Wystawa, Oprowadzanie, Spotkanie) bez zmian |
| K-62 | Obrazy na liście i wyróżniony wpis | Lista bez miniatur; jeden wyróżniony wpis ze zdjęciem nad listą (pole `featured`); znacznik „Galeria · N zdjęć” w metadanych wpisów z galerią |
| K-63 | Zajawki — reguły | Ręczny `excerpt` ma pierwszeństwo; zapasowa zajawka oczyszczona z markdownu, pełne zdania do ~180 znaków; przy zrzucie programu lub zbyt krótkim wyniku — brak zajawki |
| K-64 | Format dat | Na liście: pełna data z rokiem, bez zakresu `dateEnd`. We wpisie i w wyróżnionym: zakresy skrócone z rokiem (`formatDateRange`), poprawny dopełniacz miesiąca |
| K-65 | Nawigacja po latach | Jedna nawigacja: sticky pasek lat, bez nagłówków sekcji lat i bez linku „↑ Lata”; kotwica roku na pierwszej karcie danego roku; scroll-spy po kartach, pomija kotwice ukryte w zwiniętym archiwum |
| K-66 | Długość listy (rozstrzyga K-06) | Bez paginacji; lata do 2018 włącznie zwinięte za przyciskiem „Pokaż archiwum” (`NEWS_ARCHIVE_UNTIL_YEAR = 2018`) |
| K-67 | Porządki w danych `sample` | Tytuły, duplikaty, daty wydarzeń, wpisy KŚT oznaczone do przeniesienia w etapie 8 |
| K-68 | Ręczne zajawki | 15 najnowszych wpisów, zajawki zatwierdzone pojedynczo |
| K-69 | Funkcja strony Aktualności | **Otwarte** — zapowiedzi vs kronika; wraca w przeglądzie całości serwisu |
| K-70 | Lista bez grup lat | *(treść scalona w K-65)* |
| K-71 | Link „↑ Lata”| *(usunięty; treść scalona w K-65)* |
| K-72 | Poprawka dopełniacza w zakresach dat | *(reguła listy scalona w K-64; techniczny fix niżej przy K-64)* |
| K-73 | Wyróżniony wpis — etykieta i czas życia | Etykieta „Wyróżnione” nad blokiem; opcjonalne `featuredUntil` wygaszające wyróżnienie przy buildzie |
| K-74 | Wysokość paska lat | Desktop ~85 px (etykieta i lata w jednym wierszu, 1920 px); mobile ~121 px (etykieta nad paskiem, 390 px) |
| K-75 | Tytuły wpisów wykładowych | Jeden wzór: „Temat — wykłady RRRR/RRRR” |

### K-59 — karta wpisu

1. Układ. Desktop (od `md`): trzy kolumny — lewa: data + etykieta typu (K-61); środkowa: tytuł, zajawka; prawa: „Czytaj →” wyrównane do góry. Mobile: jedna kolumna — wiersz metadanych (data · etykieta), tytuł, zajawka, „Czytaj →” pod zajawką, wyrównane do lewej.
2. Jeden link na kartę: `<a>` w tytule rozciągnięty na całą kartę (`::after { position: absolute; inset: 0 }`, karta `position: relative`). „Czytaj →” to `<span aria-hidden="true">` wewnątrz karty — nie osobny `<a>` (bez podwójnych przystanków tabulatora i bez powtórzeń „Czytaj, link” w czytniku ekranu).
3. Stany: hover i `:focus-within` na całej karcie (tło o krok jaśniejsze + podkreślenie „Czytaj”); widoczny fokus zgodnie z `CLAUDE.md`.
4. Typografia: tytuł ~22–24 px desktop / ~20 px mobile, waga 400; zajawka w kolorze drugorzędnym tekstu; data w kolorze akcentu (K-27: złoto = metadane) — w praktyce data w Plex, rola etykiety (nie Garamondem, jak w makiecie — to łamałoby K-26).

### K-60 — wysokość karty

Bez stałej wysokości w px (przy powiększeniu tekstu treść byłaby ucinana lub nachodziła na siebie). Równy rytm daje limit linii:

- tytuł: `line-clamp: 2`;
- zajawka: `line-clamp: 3`;
- pełny tytuł zawsze dostępny (link ma pełny tekst; `line-clamp` tylko wizualnie).

Karta bez zajawki (K-63) jest po prostu niższa — to akceptowane.

### K-61 — etykiety typu

| `kind` | Etykieta |
|---|---|
| `aktualnosc` | Z Akademii |
| `wyjazd` | Wyjazd studyjny |
| pozostałe | Wykłady · Warsztaty · Plener · Wystawa · Oprowadzanie · Spotkanie (bez zmian) |

Wygląd: Plex, rola etykiety, kolor drugorzędny (nie złoty — złoto na etykiecie wyglądałoby jak link albo filtr, a filtrów nie ma, K-52). Położenie: desktop — pod datą w lewej kolumnie; mobile — w wierszu metadanych po dacie, rozdzielone „·”. Dostępność: data i etykieta w jednym elemencie, czytane razem.

### K-62 — obrazy na liście i wyróżniony wpis (z K-73)

1. Lista **bez miniatur**.
2. **Wyróżniony wpis** nad listą: zdjęcie po lewej, po prawej etykieta „Wyróżnione” (`pl.news.featuredLabel`), data, tytuł, zajawka, „Czytaj dalej”. Źródło: pole `featured?: boolean` w `News` (walidacja przy buildzie: maksymalnie jeden wpis z `featured: true`; wpis wyróżniony musi mieć `cover`). Brak wyróżnionego → brak bloku, bez placeholdera.
3. **`featuredUntil?: string` (YYYY-MM-DD)** w `News`: po tej dacie wpis przy buildzie traci wyróżnienie i wraca na listę na swoje miejsce; walidacja — `featuredUntil` tylko przy `featured: true`. Wygaszanie działa od najbliższego builda (strona jest statyczna); codzienny rebuild poza zakresem — pytanie do etapu 11.
4. Wpis wyróżniony **nie powtarza się** na liście pod spodem.
5. Kolejność na stronie: H1 → lead → etykieta + wyróżniony wpis → pasek lat (K-65) → lista → przycisk archiwum → archiwum.
6. Wpis z galerią (`images.length > 0`) dostaje w metadanych znacznik „Galeria · N zdjęć” (string z odmianą: 1 zdjęcie / 2–4 zdjęcia / 5+ zdjęć — `Intl.PluralRules('pl')`, nie ręczne `if`). Wpis z samym plakatem — bez znacznika.
7. Mobile: zdjęcie wyróżnionego wpisu nad tekstem, proporcja stała, `next/image` z `sizes`.
8. Hierarchia nagłówków: H1 strony → etykieta wyróżnionego (`<p>`, nie nagłówek) → h2 tytułu wpisu wyróżnionego → h3 tytuły na liście.

### K-63 — zajawki: reguły

Funkcja `getExcerpt(news)` (warstwa treści, nie komponent):

1. `news.excerpt` jeśli jest — bez zmian.
2. W przeciwnym razie zajawka zapasowa: usunąć markdown (linki → sam tekst, `* _ # > \``), zwinąć białe znaki, wziąć **pełne zdania** do ~180 znaków; nigdy nie ucinać w środku słowa.
3. Jeśli wynik ma < 40 znaków albo > 50% liter wielkich, albo zaczyna się od wzorca daty programu (`\d{1,2}\.\d{1,2}`) → **brak zajawki** (karta bez zajawki jest lepsza niż zrzut programu).
4. Bez pętli `for` — `split`/`reduce`/`filter`.

### K-64 — format dat

1. **Na liście (`NewsCard`):** wyświetlana jest wyłącznie data wpisu — pole `date` z rokiem, np. „25 sierpnia 2026”. Bez `dateEnd` i bez zakresów wydarzenia. `sr-only` w metadanych karty niesie tylko etykietę typu („, Wykłady”) — rok jest już w widocznej dacie.
2. **We wpisie pojedynczym i w wyróżnionym:** zakresy skrócone z rokiem, `formatDateRange(date, dateEnd?, { withYear })` w `src/lib/`, `Intl.DateTimeFormat('pl-PL')`:
   - ten sam miesiąc: „5–26 października 2019”;
   - ten sam rok: „15 czerwca – 22 lipca 2018”;
   - różne lata: „13 grudnia 2015 – 16 stycznia 2016”.
3. Półpauza bez spacji w zakresie dni, ze spacjami między pełnymi datami (typografia polska). Element `<time dateTime>` dla daty początkowej (i końcowej, jeśli jest).
4. Poprawny dopełniacz miesiąca w zakresach: pełna data formatowana przez `formatToParts`, nie sklejanie mianownika miesiąca z dniem:

   ```ts
   const dayMonthYear = new Intl.DateTimeFormat('pl-PL', {
     day: 'numeric',
     month: 'long',
     year: 'numeric',
   });

   const partsOf = (d: Date) =>
     dayMonthYear
       .formatToParts(d)
       .reduce<Record<string, string>>(
         (acc, { type, value }) => ({ ...acc, [type]: value }),
         {},
       );

   // ten sam miesiąc: `${start.day}–${end.day} ${end.month} ${end.year}` → „5–26 października 2019”
   ```

   Daty z frontmatter jako `YYYY-MM-DD` — bez przesunięcia dnia przez strefę czasową.

### K-65 — nawigacja po latach

Jedna nawigacja po latach — sticky pasek; żadnych nagłówków sekcji lat i żadnego dodatkowego linku powrotu.

1. **Pasek lat sticky** pod nagłówkiem strony (nagłówek serwisu nie jest sticky — pasek przykleja się do `top: 0`). Tło pełne (token tła strony), dolna linia oddzielająca od listy.
2. Widoczna etykieta „Przejdź do roku” (Plex, rola etykiety) przed listą lat na desktopie; na mobile etykieta nad paskiem.
3. Mobile: **jeden rząd** z przewijaniem poziomym (`overflow-x: auto`, ucięty ostatni element jako sygnał przewijania, bez widocznego paska przewijania). Aktywny rok automatycznie przewijany do widoku w pasku (`scrollIntoView({ inline: 'nearest' })`, z `prefers-reduced-motion`).
4. **Lista to jedna `<ol>` kart** w kolejności malejącej daty, bez grupowania wizualnego latami — rok jest w dacie karty (K-64) i w pasku lat. Wszystkie separatory jednakowej grubości.
5. **Kotwica roku na pierwszej karcie roku:** `id="RRRR"` i `data-year-start="RRRR"` na `<li>` pierwszego wpisu danego roku. `scroll-margin-top` = zmienna CSS wysokości paska + odstęp (ustawiana raz, nie liczona z JS).
6. **Scroll-spy:** `IntersectionObserver` na kartach z `data-year-start`; aktywny rok = rok ostatniej widocznej karty-startu roku, która przekroczyła górną krawędź (pod paskiem); kolor akcentu + podkreślenie, `aria-current="true"` (linki, nie przyciski). Kotwice w zwiniętym archiwum (`hidden`) **pomijane** — inaczej scroll-spy wskazywałby błędny rok. Komponent kliencki możliwie mały; lista lat i karty renderowane na serwerze.
7. **Fokus po skoku z paska:** na link tytułu w pierwszej karcie roku (nie na `<li>` / `<article>`), z zachowaniem `prefers-reduced-motion`.
8. Cele dotyku w pasku ≥ 44 px (K-23).

### K-66 — zwinięte archiwum, rozstrzygnięcie K-06

**K-06: bez paginacji.** Grupowanie latami (w pasku i w kotwicach kart, K-65) + zwinięte archiwum zastępuje paginację.

1. Rozwinięte zawsze: lata od 2019 do bieżącego. Zwinięte: 2012–2018, za stałą `NEWS_ARCHIVE_UNTIL_YEAR = 2018` (nie liczoną automatycznie). Po korektach dat wydarzeń (K-67) archiwum 2012–2018 liczy **47 wpisów** (rozwinięta część 2019–2026: 11 wpisów) — więcej niż wstępny szacunek 36, bo część wpisów zmieniła rok po korekcie z daty publikacji na datę wydarzenia.
2. Pod ostatnim wpisem rozwiniętej części przycisk „Pokaż archiwum 2012–2018 (47 wpisów)” (liczba i zakres z danych). Po rozwinięciu przycisk znika.
3. Treść archiwum **renderowana na serwerze i obecna w DOM** (ukryta atrybutem `hidden` / `<details>`), żeby była indeksowana i działało „Znajdź na stronie” po rozwinięciu.
4. Lata z archiwum zostają w pasku lat. Kliknięcie roku z archiwum rozwija archiwum i przewija do pierwszej karty roku. Wejście z adresem `#2015` — archiwum rozwija się samo przy ładowaniu.
5. Bez JS: archiwum rozwinięte (progresywne ulepszanie — zwijanie dopiero po hydratacji albo `<details open>` zamykane skryptem).
6. Fokus po rozwinięciu przyciskiem: na link tytułu pierwszej karty archiwum (`tabIndex={-1}` tam, gdzie potrzebne).

### K-67 — porządki w danych `sample`

Dotyczy `content/news/*`. Te same reguły obowiązują przy migracji etapu 9 (`docs/plan-claude-code.md` §3, etap 9).

1. **Tytuły:** wersaliki → zapis zdaniowy, z zachowaniem wielkich liter w nazwach i tytułach wystaw w cudzysłowie; usunięte kropki na końcu tytułów; poprawione literówki; tytuły nieinformacyjne zamienione na opisowe.
2. **Duplikaty i prawie duplikaty** scalone (np. dwa wpisy „Wystawa IKONA DZIŚ” z 2015, dwa warianty „Ikona – okno ku wieczności” z 2014, dwa wpisy „Piękno zanurzone w Tajemnicy” z 2013); przy scaleniu stary slug trafił do tabeli przekierowań (brief §5).
3. **Daty wydarzeń, nie publikacji:** gdzie treść podaje termin wydarzenia, `date` / `dateEnd` odpowiada terminowi wydarzenia, nie dacie publikacji wpisu.
4. **Wpisy KŚT** — doroczne wystawy w Kościele Środowisk Twórczych — oznaczone jako docelowo należące do `editions.json` / `/ikony/wystawa` (etap 8, K-51/K-54); pozostają w Aktualnościach do czasu etapu 8 (lista niżej, „Do przeniesienia w etapie 8”).
5. Wpis wyróżniony (K-62): `featured: true` na „Nabór na kurs roczny i trzyletni 2026/2027”, `featuredUntil: 2026-09-24` (termin zgłoszeń).

### K-68 — ręczne zajawki 15 najnowszych wpisów

15 najnowszych wpisów (licząc wpis wyróżniony) ma ręcznie zatwierdzone zajawki w `excerpt`, każda zatwierdzona osobno. Reguły treści (obowiązują też przy kolejnych ręcznych zajawkach):

1. 1–2 zdania, maks. ~180 znaków, zdanie pełne, bez wersalików (poza nazwami), bez linków i markdownu.
2. Mówi, **co to jest i co z tego wynika dla czytelnika** (termin, miejsce, dla kogo), a nie powtarza tytułu.
3. Wpisy wykładowe: temat sezonu + termin pierwszego wykładu + miejsce/godzina, jeśli są w treści.
4. **Tylko fakty z treści wpisu** — żadnych dat, liczb, nazwisk spoza treści.

### K-73 — patrz K-62

Szczegóły etykiety „Wyróżnione” i `featuredUntil` opisane w sekcji K-62 wyżej.

### K-74 — wysokość paska lat

Desktop: etykieta „Przejdź do roku” i lista lat w jednym wierszu (K-65), `.year-nav`: `padding: var(--space-5) 0`, bez `margin-bottom`; cele dotyku ≥ 44 px (K-23). Wysokość: ~85 px desktop (1920 px), ~121 px mobile (390 px, jeden rząd z przewijaniem poziomym, etykieta nad paskiem).

### K-75 — tytuły wpisów wykładowych

1. Wzór: **„Temat — wykłady RRRR/RRRR”**, np. „Mistyka dziś — wykłady 2026/2027”, „Mądrość Boża — wykłady 2025/2026”, „O Duchu Świętym — wykłady 2019/2020”. Jeden wzór dla wszystkich wpisów `kind: 'wyklady'`, w tym w archiwum.
2. Slugi bez zmian (brak nowych przekierowań).

## Do przeniesienia w etapie 8

Wpisy dorocznych wystaw w Kościele Środowisk Twórczych (KŚT) — docelowo `content/icons/editions.json` i `/ikony/wystawa` (K-51/K-54). Nie usuwane wcześniej; pozostają w Aktualnościach do czasu etapu 8.

| Slug | Tytuł (po K-67) | Daty wydarzenia | Uwaga |
|---|---|---|---|
| `ikona-okno-ku-wiecznosci` | Wystawa „Ikona – okno ku wieczności” | 2014-05-31 – 2014-06-08 | KŚT, Plac Teatralny 20 |
| `wystawa-ikona-dzis` | Wystawa „Ikona dziś” | 2015-06-19 – 2015-07-19 | KŚT; scalony wpis (dawniej `wystawa-ikona-dzis-2`) |
| `ikona-dzis-3` | Ikona dziś — jeden dzień wystawy | 2015-07-04 | KŚT; dokumentacja jednego dnia tej samej edycji |
| `dnia-17-lipca-wspomnienie-sw-andrieja-rublowa` | Wspomnienie św. Andrieja Rubłowa — finisaż wystawy „Ikona dziś” | 2015-07-17 | KŚT; finisaż edycji 2015 |
| `wystawa-ikon-w-kosciele-srodowisk-tworczych-warszawa-plac-teatralny-20` | Wystawa „Ikona – niebo na ziemi” w Kościele Środowisk Twórczych | 2016-06-17 – 2016-07-24 | KŚT |
| `wystawa-ikona-korzenie-i-owoce-wiary-oprowadzania-kuratorskie` | Wystawa „Ikona – korzenie i owoce wiary” — oprowadzania kuratorskie | 2017-06-21 | KŚT; oprowadzania po edycji 2017 |
| `oprowadzania-po-wystawie-2017` | Oprowadzania po wystawie: Serce Jezusa, Trójca Święta, ikony emaliowane | 2017-06-25 | KŚT; oprowadzania po edycji 2017 |
| `wystawa-ikona-korzenie-i-owoce-wiary-2018` | Wystawa „Ikona – korzenie i owoce wiary” 2018 | 2018-06-15 – 2018-07-22 | KŚT |
| `ikona-okno-duszy-2019` | Wystawa „Ikona okno duszy” | 2019-10-05 – 2019-10-26 | KŚT |

## Ryzyka i pytania otwarte

- **K-69** — funkcja strony (zapowiedzi vs kronika) może w przyszłości unieważnić część tej pracy (np. wyróżniony wpis). Świadomie odłożone do przeglądu całości serwisu.
- Wygaszanie `featuredUntil` bez codziennego rebuildu działa dopiero przy następnym deployu — pytanie do etapu 11.
- Lighthouse a11y `/aktualnosci` ≥ 95 mobile — odłożone do etapu 10 (jak inne strony).

## Pliki i komponenty

Stan zweryfikowany w repo. Komponenty aktualności są w `src/components/news/` (nie w korzeniu `components/`).

| Plik / komponent | Rola |
|---|---|
| `src/components/news/NewsCard.tsx` | karta wpisu na liście: układ K-59, clamp K-60, etykieta K-61, data z rokiem bez zakresu K-64, znacznik galerii K-62 |
| `src/components/news/NewsDateMeta.tsx` | renderowanie daty / zakresu dat (`<time>`, `sr-only`) współdzielone przez kartę, wyróżniony wpis i stronę wpisu |
| `src/components/news/NewsEntryLink.tsx` | link „na całą kartę” (tytuł + `::after` na cały obszar) |
| `src/components/news/NewsCta.tsx` | element wizualny „Czytaj →” / „Czytaj dalej” |
| `src/components/news/NewsFeatured.tsx` | wyróżniony wpis: etykieta „Wyróżnione”, zdjęcie, `featuredUntil` (K-62, K-73) |
| `src/components/news/NewsPoster.tsx` | okładka / plakat wpisu (obraz) |
| `src/components/news/NewsGallery.tsx` | znacznik „Galeria · N zdjęć” i/lub galeria na stronie wpisu |
| `src/components/news/NewsListPage.tsx` | układ strony `/aktualnosci`: lead → wyróżniony wpis → pasek lat → lista → archiwum |
| `src/components/news/NewsYearGroups.tsx` | płaska lista `<ol>` kart z kotwicą (`id`, `data-year-start`) na pierwszej karcie każdego roku (K-65, K-70) |
| `src/components/news/YearNav.tsx` | pasek lat: renderowanie listy lat na serwerze, sticky, wysokość K-74 |
| `src/components/news/YearNavClient.tsx` + `useYearActiveId.ts` | scroll-spy (`IntersectionObserver`), pomijanie kotwic `hidden`, fokus po skoku (K-65) |
| `src/components/news/NewsArchive.tsx` / `NewsArchiveShell.tsx` | zwinięte archiwum 2012–2018, `hidden`/`<details>`, auto-rozwinięcie przy `#RRRR`, fokus po rozwinięciu (K-66) |
| `src/components/news/NewsListScrollRestore.tsx` | zachowanie pozycji przewijania listy |
| `src/components/news/NewsArticlePage.tsx` | strona pojedynczego wpisu; daty przez `formatDateRange` z rokiem (K-64) |
| `src/lib/formatDateRange.ts` | formatowanie zakresów dat, `withYear`, poprawny dopełniacz miesiąca (K-64) |
| `src/config/news.ts` | `NEWS_ARCHIVE_UNTIL_YEAR = 2018` (K-66) |
| `src/content/types.ts` | `featured?: boolean`, `featuredUntil?: string` w `News` |
| `src/content/news.ts` | `getExcerpt` (K-63), `getFeaturedNews` + wykluczenie z listy i walidacja `featured`/`featuredUntil`, `getNewsKindLabel`, grupowanie po latach dla paska i kotwic |
| `src/i18n/pl.ts` | etykiety `kind` (K-61); `featuredLabel`, `readMoreFeatured`, `showArchiveLabel`, „Galeria · N zdjęć”, „Przejdź do roku” |
| `scripts/generate-news-index.ts` | pole `featured`/`featuredUntil` w manifeście; walidacja max. jeden `featured` + wymagany `cover` |
| `content/news/*` | tytuły, duplikaty, daty wydarzeń, `featured`/`featuredUntil`, ręczne `excerpt` (K-67, K-68), tytuły wykładowe (K-75) |
| `docs/plan-claude-code.md` | §4: rejestr K-59…K-75 (K-69 otwarte); §3 etap 9: reguły z K-67; §6 dziennik |
| `docs/brief-claude-code.md` | §4: `featured`, `featuredUntil`; §5: przekierowania ze scaleń K-67 |

## Definition of Done

- [x] Cała karta klikalna, jeden przystanek tabulatora na wpis, „Czytaj” niewidoczne dla czytnika ekranu.
- [x] Brak kart ze zrzutem programu, surowym markdownem lub ucięciem w pół słowa.
- [x] Tytuł wizualnie dominuje nad zajawką.
- [x] Wyróżniony wpis nad listą z etykietą „Wyróżnione”, nie powtarza się niżej; brak `featured` → brak bloku; `featuredUntil` wygasza wyróżnienie przy buildzie (nabór: 2026-09-24).
- [x] Na liście data wpisu z rokiem, bez zakresu `dateEnd`; zakresy na stronie wpisu i w wyróżnionym — skrócone, z poprawnym dopełniaczem miesiąca.
- [x] Jedna nawigacja po latach: sticky pasek, bieżący rok wskazany (scroll-spy po kartach), bez nagłówków sekcji lat, bez „↑ Lata”; mobile jeden rząd z przewijaniem.
- [x] `#2015` otwiera archiwum i przewija do pierwszej karty roku; bez JS archiwum rozwinięte; scroll-spy pomija kotwice ukryte w zwiniętym archiwum.
- [x] Pasek lat: ~85 px desktop (1920 px), ~121 px mobile (390 px).
- [x] 15 najnowszych wpisów ma zatwierdzone ręczne zajawki.
- [x] Tytuły wszystkich wpisów wykładowych według wzoru „Temat — wykłady RRRR/RRRR”; slugi bez zmian.
- [x] Wysokość strony `/aktualnosci` przy zwiniętym archiwum: **3 222 px** desktop (1920 px), **5 141 px** mobile (390 px).
- [ ] Lighthouse a11y `/aktualnosci` ≥ 95 mobile — odłożone do etapu 10.
- [x] `npm run build` + `npm run lint` OK; rejestr K i dziennik w `docs/plan-claude-code.md` zaktualizowane.
