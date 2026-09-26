# Plan 08b — Korekty po przeglądzie etapu 08

Status: zamknięty (7/7 kawałków, 2026-09-26)
Gałąź: `feat/08b-review-fixes`
Wsad: `docs/08-review-staging.md`
Rejestr decyzji: K-82…K-118 (`docs/plan-claude-code.md` §4)
Makiety wystawy: `design/Akademia Ikony - Wystawa i Aktualności.dc.html` (ekrany **9a–9e**)

Ten dokument opisuje **stan docelowy** po korektach — nie historię kolejnych wersji.
§1–§3: wystawa (model, układ, weryfikacja makiet). §4: decyzje pozostałych punktów
przeglądu. §5: kawałki implementacji w kolejności zależności.

---

## 1. Wystawa — model treści

### Co ustaliła rozmowa z EJK (2026-09-24)

W Kościele Środowisk Twórczych są **trzy różne formy wystawy**, nie jedna „stała
wystawa z rocznymi edycjami”. W kościele nigdy nie ma pustej ściany — zmienia się
tylko to, co na niej wisi.

| Forma                                                 | Ikony                          | Kto                                                          | Rytm                                                              |
| ----------------------------------------------------- | ------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| Ekspozycja codzienna „Ikona – korzenie i owoce wiary” | 6–10, wymieniane nieregularnie | wyłącznie EJK (czasem ikony z ostatniej wystawy dorocznej)   | wrzesień – połowa czerwca                                         |
| Wystawa doroczna                                      | 40–50                          | uczestnicy Akademii + EJK, prace z danego roku akademickiego | wernisaż na ostatnim wykładzie sezonu (czerwiec) – koniec wakacji |
| Wystawy wyjazdowe                                     | różnie                         | wyłącznie EJK                                                | nieregularnie, Warszawa i poza nią                                |

Po wakacjach uczestnicy zabierają swoje ikony do domu i wraca ekspozycja codzienna.
Dotychczasowe sprzeczności („stała wystawa” + „co roku nowy zestaw” + „czynna w
godzinach otwarcia kościoła”) wynikały ze zlania tych trzech form w jeden model.

### Rejestr decyzji

| #    | Decyzja                     | Finalny wybór                                                                                                                                                                                                                                                       |
| ---- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| K-82 | Liczba bytów w modelu       | Trzy: `PermanentExhibition` (treść stała), `AnnualExhibition` (lista), wystawy wyjazdowe jako wpisy Aktualności `kind: "wystawa"`                                                                                                                                    |
| K-83 | Ekspozycja codzienna        | Nazwa ramowa „Ikona – korzenie i owoce wiary”, 6–10 ikon EJK, czynna w godzinach otwarcia kościoła; brak „przerwy wakacyjnej” w copy — w wakacje wisi wystawa doroczna                                                                                               |
| K-84 | Wystawa doroczna — dane     | `seasonSlug` → `LectureSeason` (walidacja buildu); tytuł jako **osobne pole**, nie wyliczany z tematu sezonu (EJK może zmienić retroaktywnie); `vernissage` domyślnie = data ostatniego wykładu sezonu; koniec = 31 sierpnia roku wernisażu, w copy „koniec wakacji” |
| K-85 | Stan wystawy dorocznej      | Liczony z dat jako jedno pytanie: czy wystawa właśnie wisi. Bez typu wyliczeniowego i bez nazw stanów w UI (K-94). Liczenie z dat wymusza ISR (rozstrzyga T1.5)                                                                                                       |
| K-86 | Oprowadzania kuratorskie    | Bez terminów — spontaniczne. Opis formy + „terminy ogłaszamy w Aktualnościach i na Facebooku” + `mailto` dla grup. **Bez archiwum tematów na stronie** (slot WY-33 wycofany). Pole `tours[]` z datami usunięte z typu                                                          |
| K-101 | Breadcrumb na `/ikony/wystawy` | Bez `Breadcrumb` — tylko `SectionNav` (Galeria · Wystawy · Ikony na zamówienie), desktop i mobile. Rozstrzyga B1 dla tras z rodzeństwem w dziale Ikony                                                                                                              |
| K-87 | Wystawy wyjazdowe           | Sekcja `#wyjazdowe` z listą wierszy „miejsce · rok” (tekst) + link **„Relacja”** po prawej do wpisu Aktualności (nowe pole `venue?` w `News`; wzorzec jak „Gdzie byliśmy” na LSŚ) + CTA „Chcesz zaprosić wystawę do swojego miejsca?” z `mailto`                  |
| K-88 | Tytuły wystaw dorocznych    | Tabela niżej; `editions.json` czyszczony i odbudowany (zmyślone tytuły i wernisaże 17.06 usunięte). Znamy wszystkie 15 tytułów, więc rekord bez tytułu nie wystąpi                                                                                                    |
| K-89 | Sekcja „Poprzednie wystawy” | Lista linijek rok + tytuł, wszystkie 15 rekordów; pięć najnowszych otwartych, starsze za „Wcześniejsze wystawy: 2013–2022 / Rozwiń” (zakres z min–max lat zwiniętych). Układ wiersza: K-97                                                                                                             |
| K-90 | Nazewnictwo i adres         | Trasa `/ikony/wystawy`, H1 „Wystawy ikon” — strona opisuje trzy formy wystaw. Etykieta linku **„Wystawy”** wszędzie w nawigacji: `mainNav.children` (pod „Ikony”), `sectionNav.ikony`, `footerSitemap` — jedna forma, bez „Wystawa”. Eyebrow „Ikony · Kościół Środowisk Twórczych”; słowo „stała” tylko przy ekspozycji codziennej; „Wstęp wolny” (rozstrzyga B2, C7) |
| K-91 | Dyżury uczniów              | Informacja **fałszywa** — usunąć z `content/exhibition/body.mdx`, nie zostawiać placeholdera                                                                                                                                                                         |
| K-102 | Kolejność sekcji na stronie | Stała: `#ekspozycja` → `#doroczna` → `#oprowadzania` → `#poprzednie` → `#wyjazdowe` — bez przesunięć w wakacje; rytm roku tłumaczy lead i zmienny blok faktów w `#doroczna` (K-94)                                                                                  |

### Model treści

```ts
// content/exhibition/page.mdx — frontmatter
type PermanentExhibition = {
  title: string; // "Ikona – korzenie i owoce wiary"
  lead: string;
  iconCount: { from: number; to: number }; // 6–10
  interiorPhotos: Image[];
};

// content/exhibition/annual.json — najnowsza pierwsza
type AnnualExhibition = {
  seasonSlug: string; // "2026-2027" → LectureSeason; błąd buildu, gdy nie istnieje
  title: string; // K-84: osobne pole, np. "Mistyka dziś"
  vernissage?: string; // domyślnie data ostatniego wykładu sezonu
  dateEnd?: string; // domyślnie 31 sierpnia roku wernisażu
  iconCount?: number; // 40–50
  summary?: string;
  photos?: Image[];
  newsSlug?: string;
};
```

Stan to jedna funkcja, nie typ: „czy ta wystawa wisi teraz” (`vernissage ≤ dziś ≤ dateEnd`).
Blok archiwalny bierze najnowszą wystawę **zakończoną**, nie najnowszy rekord (K-96).

Rok wystawy wyliczany z `seasonSlug` (drugi rok sezonu) — pole `year` znika jako klucz. To usuwa obecne przesunięcie o rok: `editions.json` ma edycję „2026” z tematem sezonu 2026/2027, choć ten sezon kończy się wernisażem 12 czerwca 2027 (`content/lectures/2026-2027.json`, ostatni wpis: EJK, „Piękno w ikonach · Wernisaż wystawy ikon”, `note: "wernisaż, AGAPA"`).

### Tytuły wystaw dorocznych (K-88)

Rok = rok wernisażu; sezon = cykl wykładów, który wystawa zamyka.

| **Rok** | **Sezon** | **Tytuł**                                                   |
| ------- | --------- | ----------------------------------------------------------- |
| 2027    | 2026/2027 | Mistyka dziś                                                |
| 2026    | 2025/2026 | Mądrość Boża                                                |
| 2025    | 2024/2025 | Piękno Boga, piękno człowieka                               |
| 2024    | 2023/2024 | Przyjaźń z Bogiem                                           |
| 2023    | 2022/2023 | Piękno zanurzone w Tajemnicy                                |
| 2022    | 2021/2022 | Światłość prawdziwa                                         |
| 2021    | 2020/2021 | O Bożej obecności                                           |
| 2020    | 2019/2020 | O Duchu Świętym                                             |
| 2019    | 2018/2019 | O świętości                                                 |
| 2018    | 2017/2018 | O świętości _(powtórzenie celowe — potwierdzone przez EJK)_ |
| 2017    | 2016/2017 | Ikona – niebo na ziemi                                      |
| 2016    | 2015/2016 | Ikona dziś                                                  |
| 2015    | 2014/2015 | Obraz i kult                                                |
| 2014    | 2013/2014 | Ikona – miejsce spotkania                                   |
| 2013    | 2012/2013 | Świat ikony                                                 |

Myślniki w tytułach: półpauza ze spacjami (–), zgodnie z C9.

### Struktura strony `/ikony/wystawy`

Jedna trasa z kotwicami — przekierowania z briefu §5 (`/ikona/wystawy/`, `/wernisaze/`, `/oprowadzania-kuratorskie/`) celują w nią wszystkie.

1. Nagłówek — eyebrow, H1 „Wystawy ikon”, lead opisujący rytm roku (raz, nie powtarzany w sekcjach).
2. `#ekspozycja` — „Ikona – korzenie i owoce wiary”: tekst z `body.mdx` (bez akapitu o dyżurach, K-91) i fakty w szynie, pod spodem dwa szerokie kadry wnętrza.
3. `#doroczna` — tekst i fakty w szynie ze zmiennym pierwszym wierszem (K-94), pod spodem rząd 4 kadrów.
4. `#oprowadzania` — opis, zdanie o terminach w Aktualnościach i na Facebooku (K-86), po prawej blok CTA; bez archiwum tematów.
5. `#poprzednie` — 15 wystaw dorocznych, `<h3>` z `id="wystawa-2019"` (rozstrzyga T2.1), układ wiersza z K-97.
6. `#wyjazdowe` — jedno zdjęcie, lista „miejsce · rok” + „Relacja” i CTA (K-87, K-100).

### Konsekwencje poza stroną wystawy

- Kafel „Najbliższe” na home: wystawa jest kandydatem, gdy wernisaż jest przed nami albo wystawa wisi; poza tym oddaje miejsce naborowi albo wykładowi.
- `revalidate` na `/` i `/ikony/wystawy` (T1.5).
- Filar „Ikony” na home: drugie CTA „Galeria i wystawa” (B4).
- Wpisy Aktualności o wystawach w KŚT linkują do konkretnej wystawy dorocznej przez `id` sekcji (część A3); wpisy z wystaw wyjazdowych dostają `venue`.
- `pl.exhibition` w `src/i18n/pl.ts` przepisane: znika „Bieżąca edycja”, „Nowa edycja”, „Terminy edycji {year}”, „darmowy”, `posterCaption`, `posterPlaceholder`.
- `navigation.ts`: label „Wystawy” i trasa `/ikony/wystawy` w `mainNav.children`, `sectionNav.ikony` i `footerSitemap` — ta sama etykieta we wszystkich trzech miejscach (K-90); `active` jest przekazywany labelem. Tabela przekierowań w briefie §5 celuje w nowy adres.

### Braki do potwierdzenia

- Liczby ikon w poszczególnych latach — potwierdzone tylko 44 (2019).
- Zdjęcie z wystawy wyjazdowej w rozpoznawalnym wnętrzu — do wskazania przez EJK (K-100).

---

## 2. Strona wystawy — układ docelowy

Cała strona stoi na jednym wzorze sekcji, wziętym ze stron oferty: nagłówek, potem
tekst z faktami w szynie po prawej, potem zdjęcia na pełną szerokość. Wcześniejsze
podejścia — trzy stany sekcji `#doroczna` z nadtytułami „Przed wystawą · Na wystawie
· Po wystawie”, dwułamówka ze zdjęciami po prawej, fakty rozciągnięte na całą
szerokość — zostały odrzucone i nie wracają.

| #     | Decyzja                        | Stan docelowy                                                                                                                                                                                                                                                                                                          |
| ----- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| K-92  | Jeden wzór sekcji              | `#ekspozycja` i `#doroczna` mają identyczną budowę: nagłówek, rząd „tekst \| fakty w szynie”, pod nim zdjęcia na pełną szerokość (2 szerokie kadry wnętrza / 4 kadry z wystawy). Nagłówek „Jak wygląda wystawa” usunięty — tekst idzie wprost pod H2 sekcji, więc pierwsze zdanie musi mówić, czym jest ekspozycja     |
| K-93  | Fakty w szynie `FactsBox`      | Geometria ze stron oferty: szyna 400 px (`--offer-sidebar-w`), przerwa 52 px, padding 32/30, etykieta nad wartością, nagłówek bloku `sr-only` (`pl.exhibition.facts.srHeading`), link na dole bloku w miejscu CTA. Kolumna tekstu wychodzi 616 px ≈ 35em. Ekspozycja: Gdzie · Kiedy · Wstęp · Na ekspozycji + „Dojazd i kontakt”. Doroczna: wiersze z K-94. Mobile: tekst → fakty → zdjęcia. Przy implementacji uwaga na T3.2 (`useId`, nie stałe `id`) |
| K-94  | Stan w bloku faktów, nie w pasku | Paska na pełną szerokość nie ma — dwa bloki ze złotą krechą jeden pod drugim czytały się jak dwa początki sekcji. Zmienny jest jeden wiersz bloku faktów i link na dole, dokładnie jak `enrollmentOpen` w `FactsBox`. Domyślnie: „Najbliższy wernisaż · 12 czerwca 2027”, „Czynna · czerwiec – 31 sierpnia”, „Wstęp · Wolny”, „Na wystawie · 40–50 ikon uczestników Akademii i EJK” + link „Program wykładów”. Gdy wystawa wisi: „Teraz w kościele · „Mistyka dziś””, „Czynna · do 31 sierpnia 2027” + link „Relacja z wernisażu {rok}”. Żadnych etykiet stanu ani nadtytułów |
| K-95  | Strona vs. wpis w Aktualnościach | Strona trzyma fakty i rytm, wpis trzyma relację i pełną galerię. Na stronie jedno zdanie: „Z każdej wystawy piszemy relację w Aktualnościach – tam są zdjęcia i opis.” Linki nazwane wprost: „Relacja z wernisażu {rok}”. Wpis `kind: "wystawa"` dostaje link powrotny na `#wystawa-{rok}`. Znika galeria-dublet i pięć `<dialog>` w DOM (T3.4) |
| K-96  | Blok archiwalny                | Pokazuje ostatnią **zakończoną** wystawę: podpis „Ostatnia wystawa: 2026, „Mądrość Boża”” (Garamond ~19 px, `--text-secondary`, bez wersalików — wersaliki Plex są zarezerwowane dla eyebrow sekcji), maks. 4 kadry, link do relacji. Gdy wystawa właśnie wisi, zdjęcia pod paskiem są z niej i bloku archiwalnego nie ma |
| K-97  | Wiersz w „Poprzednich wystawach” | Linkiem do relacji jest **tytuł wystawy** (jak tytuł w `NewsEntry`); cały kafel wiersza może być klikalny jako rozszerzenie hit-area (rok i tło → ta sama relacja), „Zdjęcia” zachowuje własny cel. Po prawej jedno stałe „Zdjęcia” (desktop). **Mobile:** tytuł i „Zdjęcia” jeden pod drugim; zwinięcie „Wcześniejsze: 2013–2021” (skrócony label). Rok obok tytułu zostaje tekstem (Garamond 21 px, `tabular-nums`). Wiersz bez relacji ma tytuł bez linku i nie jest klikalny; wiersz bez zdjęć ma pustą prawą krawędź — bez komunikatu o braku |
| K-98  | Plakat usunięty z modelu       | Pole `poster` wypada z `AnnualExhibition`, komponent `ExhibitionPoster.tsx` znika, stringi `posterCaption` / `posterPlaceholder` wypadają z `pl.ts`. Slot na plakat zostaje wyłącznie we wpisie Aktualności (WP-07)                                                                                                       |
| K-99  | Znaczenie złotej krechy 3 px   | Krecha oznacza „blok wyróżniony — informacja albo akcja”, jeden na sekcję. Mają ją: fakty ekspozycji, fakty wystawy dorocznej, CTA oprowadzań, CTA wystaw wyjazdowych. Nie ma jej blok archiwalny, rzędy zdjęć ani wiersze listy. **Padding** bloków z krechą: 32 px poziomo, 30 px u góry (jak `FactsBox`, K-93) — dotyczy też CTA w `#oprowadzania` i `#wyjazdowe` |
| K-100 | Zdjęcie w „Wystawach wyjazdowych” | Sekcja `#wyjazdowe` dostaje jedno zdjęcie wystawy w rozpoznawalnym wnętrzu (kościół, galeria poza Warszawą) — **statyczne**, bez lightboxa (dekoracyjne). Materiał do wskazania przez EJK — w makiecie kadr z dotychczasowej puli jako `[przykład]`                                                                               |

Drobne, bez numeru decyzji:

- Myślniki: półpauza ze spacjami (–) w całej sekcji, także w zdaniu o relacjach (C9).
- Akapity w jednej sekcji mają ten sam kolor i wagę — żadnych przypadkowych wyróżnień pojedynczych słów ani jaśniejszego ostatniego akapitu.
- Podpisy pod zdjęciami przykładowymi mają `[przykład]` — wszystkie, nie tylko część.
- Pasek „Na tej stronie” używa nazw nagłówków, w tym „Poprzednie wystawy doroczne”.
- Caption „kliknięcie otwiera powiększenie” nie wraca (C1); każda miniatura to osobny przycisk z `aria-label` (T2.2).

---

## 3. Weryfikacja makiet (tura 9)

Porównanie `design/Akademia Ikony - Wystawa i Aktualności.dc.html` (ekrany **9a–9e**, autoritative) z tym planem. Ekrany 8a–8l w pliku = historia.

| # | Temat | Decyzja | Status |
| --- | --- | --- | --- |
| 1 | Archiwum tematów oprowadzań (WY-33) | Brak w UI — tylko Aktualności + mailto (K-86) | ✓ 2026-09-25 |
| 2 | Breadcrumb | Bez breadcrumb — tylko SectionNav (K-101) | ✓ 2026-09-25 |
| 3 | „Wystawy” w nawigacji | „Wystawy” w mainNav, SectionNav i stopce — jedna etykieta (K-90) | ✓ 2026-09-25 |
| 4 | Link „Relacja” przy wystawach wyjazdowych | Tekst „miejsce · rok” + osobna kolumna „Relacja” (K-87) | ✓ 2026-09-25 |
| 5 | „…i na Facebooku” w copy oprowadzań | Zostaje w copy WY-32 (K-86) | ✓ 2026-09-25 |
| 6 | Kolejność sekcji w wakacje | Stała kolejność sekcji (K-102) | ✓ 2026-09-25 |
| 7 | Cały wiersz listy „Poprzednie” klikalny | OK — rozszerzenie linku tytułu (K-97) | ✓ 2026-09-25 |
| 8 | Układ mobile listy poprzednich | Różnice mobile z makiety 9b (K-97) | ✓ 2026-09-25 |
| 9 | Padding bloków CTA vs `FactsBox` | Wyrównane 30/32 px (K-99) | ✓ 2026-09-25 |
| 10 | Zdjęcie w `#wyjazdowe` bez lightboxa | Statyczne, dekoracyjne (K-100) | ✓ 2026-09-25 |
| 11 | Synchronizacja `README-wystawa-aktualnosci.md` z turą 9 | Pełna synchronizacja pod K-82–K-102 | ✓ 2026-09-25 |

---

## 4. Pozostałe punkty przeglądu — decyzje

Mapowanie punktów z `docs/08-review-staging.md` na decyzje. Punkty wystawy (A1, A2,
A4, B2, C7, T1.5, T2.1, T2.2, T3.4) rozstrzygnięte w §1–§2 (K-82…K-102).

| # | Przegląd | Decyzja | Finalny wybór |
| --- | --- | --- | --- |
| K-103 | A3 — wpisy KŚT w Aktualnościach | Pozostają w Aktualnościach; nie przenosimy, nie usuwamy | Relacje **dorocznych** wystaw: link dwukierunkowy strona `#wystawa-{rok}` ↔ wpis `kind: "wystawa"`. Wpisy oprowadzań, finisaży i dni jednorazowych — bez zmiany miejsca, bez linku do strony wystawy |
| K-104 | B1 — Breadcrumb vs SectionNav | Reguła nawigacji | **SectionNav** — sekcja z rodzeństwem (O Akademii, Pracownia, Warsztaty/\*, Wykłady/\*, Ikony/\*). **Breadcrumb** — drugi poziom bez SectionNav (wpis Aktualności, album, artykuł). **Nic** — strona pierwszego poziomu (`/aktualnosci`, `/kontakt`, `/publikacje`, `/polityka-prywatnosci`, 404). **Usunąć** `Breadcrumb` z `/kontakt` i `/publikacje` |
| K-105 | T1.1 — `mailto:` i `+` | Kodowanie tematu | `encodeURIComponent(subject)` zamiast `URLSearchParams` w `buildMailtoHref` |
| K-106 | T1.2 / A5 — autorzy albumu | Jedno źródło prawdy | `lecturerSlug` w `toc` i `Article.authors` walidowany przy buildzie (błąd, gdy slug nie istnieje w rejestrze wykładowców). Wyświetlana nazwa i tytuły z danych wykładowcy, nie z pola `name` w treści. Lista „Autorzy tekstów" deduplikowana po slugu. Autor bez `lecturerSlug` — tekst, bez linku |
| K-107 | T1.3 / C2 — odmiana liczebników | Helper | `pluralize(n, forms)` w `src/i18n/`; użyty wszędzie przy liczbie + rzeczownik (hub publikacji, blok źródła artykułu, wystawa, galeria) |
| K-108 | T1.4 — kotwica `#artykuly` | Przekierowanie z brief §5 | `id="artykuly"` na sekcji artykułów hubu (obok lub zamiast `publication-articles-heading`) |
| K-109 | T3.3 — „Zobacz też" na albumie | Powiązanie jawne | Sekcja zostaje; `relatedNewsSlug` opcjonalne — bez wartości sekcja nie renderuje karty (stan sample do decyzji EJK). Hub `/publikacje`: link „Zobacz też" do `/ikony/wystawy` (K-90) |
| K-110 | B3 — publikacje niewidoczne | Linki zwrotne | Link do `/publikacje` w `FactsBox` wykładów (wiersz lub CTA pod „W skrócie") i w sekcji „Nasza historia" na `/o-akademii` |
| K-111 | B4 / T2.4 — 404 | Copy i landmarki | Usunąć duplikat „Kontakt" z mapy ratunkowej. `aria-label` nawigacji ratunkowej: „Działy serwisu" (nie „Mapa ratunkowa"). Nagłówek: `aria-label="Menu główne"` na `<nav>` menu |
| K-112 | T2.4 — skip link | Cały serwis | „Przejdź do treści" w `layout.tsx`; widoczny przy fokusie; cel `#main-content` |
| K-113 | T2.7 — linki zewnętrzne | Jeden komponent | `ExternalLink`: `rel="noopener noreferrer"`, opcjonalna ↗, `sr-only` „(otwiera się w nowej karcie)". Zastępuje rozproszone `<a target="_blank">` w kontakcie, stopce, artykułach, polityce |
| K-114 | T4 — szablon tytułu | Warto teraz | `title: { template: '%s · Akademia Ikony', default: '…' }` w root `layout.tsx`; `generateMetadata` na wystawie, kontakcie, publikacjach, polityce, 404. `description` / canonical / OG / sitemap — etap 10 |
| K-115 | A6 / T2.5 — polityka prywatności | Struktura vs treść prawna | **Kod:** H2 zgodne z TOC (`Administrator danych`, `Jakie dane zbieramy` z listą: imię, e-mail, telefon); zdanie wprowadzające przed podstawami prawnymi; spójny zapis „lit. a)"; usunąć szablon „Finansującego/Partnerów"; cookies — bez „Plausible/Umami", wzmianka o mapie Google. **Dla EJK/fundacji:** data `lastUpdated`, treść RODO — lista pytań w meldunku, bez wymyślania |
| K-116 | C5 — nazwa fundacji | Jedna forma | „Fundacja IKONA DZIŚ" (wielka F) w stopce, kontakcie, publikacjach, polityce. Zdanie na `/kontakt` z interpunkcją: „Fundacja IKONA DZIŚ — ikonadzis.org. Akademia Ikony jest jej projektem wiodącym." |
| K-117 | C6 / T2.6 — kontakt | Adres i mapa | Pełny adres z brief §8 po weryfikacji (`Plac Teatralny 20, 00-950 Warszawa`). Numer telefonu wprost jako `tel:` zamiast „podany wyżej". Linki pod mapą: „Otwórz w Mapach Google" / „Wyznacz trasę". Kotwica `#dojazd` na sekcji adresu i mapy. `<address>` na danych kontaktowych (kontakt + stopka) |
| K-118 | C8 — LSŚ „Gdzie byliśmy" | Format i miejsce | Wiersze: „Miejsce (region) · rok" bez przyimków w/na; konkretne miejsca zamiast samych krajów. Sekcja **pod** „Głosami z pleneru", nie przed „Rytmem dnia" |
| — | C1 | Notatki projektowe | Usunąć z UI: „Kliknięcie otwiera powiększenie" (3×), nota o formacie albumu, legenda spisu TOC, „Pełny spis liczy 12 tekstów" |
| — | C3 | Blok źródła artykułu | „Pierwodruk: «Tytuł», data"; „Czytaj w serwisie wydawcy ↗"; bez powtórzenia w nagłówku i stopce |
| — | C4 | Metryczka albumu | Spójne etykiety hub ↔ podstrona („Liczba stron", „Dostępny"); eyebrow „Fundacja IKONA DZIŚ"; tytuł albumu w liście artykułów w cudzysłowie |
| — | C9 | Myślniki | Półpauza ze spacjami (–) w nowych stringach `pl.ts` i MDX etapu 08; wyjątek: tytuły wykładowe (K-75, pauza em) |
| — | C10 | Ton kontaktu | „ty" jak reszta serwisu: „Zadzwoń" zamiast „prosimy zadzwonić". Spis albumu: „z warsztatów" zamiast „uczestnik" |
| — | T3.1 | Typografia kontakt/publikacje | Etykiety maili kontakt ≥ 16,5 px (Garamond) lub Plex 14,5 px; tytuł albumu w liście artykułów ≥ 16,5 px |
| — | T3.2 | `FactsBox` duplikat `id` | `useId()` dla `aria-labelledby` (LSŚ, Ikony na zamówienie, nowa wystawa) |
| — | T2.3 | Spis albumu | `<ol>`; `aria-expanded` / `aria-controls` na „Pokaż pełny spis"; wszystkie pozycje w DOM SSR |
| — | B4 | Filar Ikony | Drugie CTA „Galeria i wystawa" (K-90, konsekwencja z §1) |

### Profile wykładowców — uzupełnienie (K-106)

Dodać minimalne profile dla slugów używanych w albumie/artykułach, ale
brakujących na `/wyklady/wykladowcy`:

| Slug | Źródło nazwy |
| --- | --- |
| `marek-szymula` | `lecturer-directory.json` |
| `maciej-biskup` | `lecturer-directory.json` |

Bez bio i zdjęcia w v1 — tylko imię, tytuły, kotwica `#slug` działa.

### Braki do potwierdzenia (poza kodem)

- Adres KŚT — numer i kod (K-117).
- Treść prawna polityki — EJK / fundacja (K-115).
- `relatedNewsSlug` albumu — EJK (K-108).
- Zdjęcie wystawy wyjazdowej (K-100).
- Liczby ikon per rok w `annual.json` (§1).

---

## 5. Kawałki implementacji

Kolejność: zależności techniczne i priorytet z przeglądu (błędy widoczne → wystawa
→ reszta tras etapu 08 → dostępność globalna).

### Kawałek 1 — Infrastruktura serwisowa

**Zakres:** T1.1, T1.3, C1, B1, T1.4, T2.7, T3.2 (część).

| Plik | Zmiana |
| --- | --- |
| `src/lib/mailto.ts` | `encodeURIComponent` (K-105) |
| `src/i18n/pluralize.ts` | nowy helper (K-107) |
| `src/i18n/pl.ts` | usunięcie notatek C1; stringi skip link, ExternalLink |
| `src/components/core/ExternalLink.tsx` | nowy (K-113) |
| `src/components/content/FactsBox.tsx` | `useId()` (K-113, T3.2) |
| `src/components/contact/ContactPage.tsx` | bez `Breadcrumb` (K-104) |
| `src/components/publications/PublicationsHubPage.tsx` | bez `Breadcrumb`; `id="artykuly"` (K-104, K-108) |
| `src/app/layout.tsx` | skip link + `#main-content` (K-112) |
| `src/components/navigation/Header.tsx` | `aria-label` menu (K-111) |
| Komponenty z C1 | usunięcie captionów „Kliknięcie otwiera…" (wystawa, hub, album) |

**Kryterium „gotowe":** `npm run build` + `lint`; test `mailto:` — temat bez `+` w
query; grep po „Kliknięcie otwiera" pusty; `/kontakt` i `/publikacje` bez okruszka;
skip link widoczny przy Tab; FactsBox bez zduplikowanych `id` na LSŚ.

---

### Kawałek 2 — Wystawa: model treści

**Zakres:** §1, A1–A2, A4; fundament pod kawałek 3.

| Plik | Zmiana |
| --- | --- |
| `src/content/types.ts` | `PermanentExhibition`, `AnnualExhibition`; usunięcie `ExhibitionEdition`, `tours`, `poster`; `venue?` w `News` (K-82…K-88, K-98) |
| `content/exhibition/page.mdx` | frontmatter `PermanentExhibition` |
| `content/exhibition/annual.json` | 15 rekordów z tabeli K-88 |
| `content/exhibition/body.mdx` | bez dyżurów (K-91) |
| `content/exhibition/editions.json` | **usunięty** |
| `src/content/exhibition.ts` | odczyt nowego modelu; `isAnnualExhibitionActive()`; walidacja `seasonSlug` |
| `src/i18n/pl.ts` | przygotowanie kluczy `exhibition.*` (bez starego copy) |

**Kryterium „gotowe":** build failuje na zły `seasonSlug`; `annual.json` ma 15 tytułów
z K-88; brak `editions.json` i `tours[]`.

---

### Kawałek 3 — Wystawa: strona, home, nawigacja

**Zakres:** §2, B2, B4 (filar), C7, C9 (wystawa), T1.5, T2.1, T2.2, T3.4, T4 (wystawa).

| Plik | Zmiana |
| --- | --- |
| `src/app/ikony/wystawy/page.tsx` | nowa trasa; `revalidate` ISR (K-85, T1.5) |
| `src/app/ikony/wystawa/` | usunięty lub redirect (etap 9 — na razie nowa trasa + aktualizacja linków w kodzie) |
| `src/components/exhibition/*` | przebudowa wg K-92…K-100; jeden `Lightbox` (T3.4); `<h3 id="wystawa-{rok}">` (T2.1) |
| `src/navigation.ts` | „Wystawy", `/ikony/wystawy` (K-90) |
| `src/components/home/UpcomingHighlights.tsx` | logika kafela z dat (K-85) |
| `src/app/page.tsx` | `revalidate` (T1.5) |
| `src/i18n/pl.ts` | `pl.exhibition` przepisane; filar „Galeria i wystawa" (B4) |
| `generateMetadata` | tytuł strony wystawy (K-114, część) |

**Kryterium „gotowe":** `/ikony/wystawy` zgodna z makietą 9a–9e (desktop + 390 px);
sekcje w kolejności K-102; brak pięciu `<dialog>`; kafel home reaguje na daty po ISR;
nawigacja „Wystawy" spójna.

**Odstępstwo od planu 08:** stara trasa `/ikony/wystawa` — linki wewnętrzne na
`/ikony/wystawy`; przekierowanie 301 w etapie 9.

---

### Kawałek 4 — Aktualności ↔ wystawa

**Zakres:** A3 (K-103), K-95, K-87.

| Plik | Zmiana |
| --- | --- |
| `content/news/*.mdx` | `newsSlug` w `annual.json`; `venue` na wyjazdowych; linki w treści do `#wystawa-{rok}` tam, gdzie relacja doroczna |
| `src/components/news/NewsArticlePage.tsx` | link powrotny „Wystawa {rok}" → `/ikony/wystawy#wystawa-{rok}` dla `kind: "wystawa"` z dopasowanym rokiem |
| `src/content/exhibition.ts` | lista wyjazdowych z `News` (`venue` + rok) |

**Kryterium „gotowe":** relacja 2025/2026 ma link obustronny; oprowadzania 2017 bez
linku do strony wystawy; sekcja `#wyjazdowe` z listą i „Relacja".

---

### Kawałek 5 — Publikacje i autorzy

**Zakres:** T1.2, A5, T2.3, T3.3, C3, C4, C10 (spis), T3.1 (część), B3 (część).

| Plik | Zmiana |
| --- | --- |
| `content/lecturers.json` | wpisy minimalne `marek-szymula`, `maciej-biskup` (K-106; ewaluacja E08-08) |
| `content/publications/ikona-dzis.mdx` | `relatedNewsSlug` usunięte; `toc` — nazwy z rejestru |
| `src/content/publications.ts` | walidacja `lecturerSlug` w `toc` |
| `src/components/publications/PublicationTocList.tsx` | `<ol>`, aria expand, SSR 12 pozycji (T2.3) |
| `src/components/publications/PublicationAlbumPage.tsx` | autorzy z rejestru, deduplikacja (K-106); sekcja related warunkowa (K-108) |
| `src/components/publications/ArticleSourceBlock.tsx` | copy C3 |
| `src/components/publications/PublicationsHubPage.tsx` | metryczka C4; pluralize C2; link wystawy |
| `src/app/wyklady/page.tsx` lub `FactsBox` | link do `/publikacje` (K-110) |

**Kryterium „gotowe":** brak martwych kotwic wykładowców; Paprocki raz na liście
autorów; album bez karty „Zobacz też" dopóki brak `relatedNewsSlug`; spis `<ol>` z
aria.

---

### Kawałek 6 — Kontakt, LSŚ, 404

**Zakres:** C6, C8, C10, T2.6, B4, K-116 (kontakt), C5 (stopka).

| Plik | Zmiana |
| --- | --- |
| `content/settings.json` | pełny adres (po weryfikacji) |
| `src/components/contact/ContactPage.tsx` | copy C10; `tel:`; `#dojazd`; map links; `<address>`; ExternalLink |
| `src/components/contact/MapBlock.tsx` | linki Google Maps |
| `content/offers/letnia-szkola-swiatla.mdx` | sekcja „Gdzie byliśmy" (`whereWeWere`) — format K-118 |
| `src/app/not-found.tsx` | B4, K-111 |
| `src/components/navigation/Footer.tsx` | Fundacja IKONA DZIŚ; `<address>`; ExternalLink |
| `src/i18n/pl.ts` | stringi kontakt, 404, LSŚ |

**Kryterium „gotowe":** „Dojazd i kontakt" z wystawy → `/kontakt#dojazd`; 404 bez
duplikatu Kontakt; LSŚ sekcja pod Głosami z pleneru.

---

### Kawałek 7 — Polityka, metadane, copy pass

**Zakres:** A6, T2.5, K-114, C5, C9, B3 (o-akademii), T3.1 (reszta).

| Plik | Zmiana |
| --- | --- |
| `content/pages/polityka-prywatnosci.json` | struktura sekcji K-115 |
| `src/components/text/PrivacyPolicyPage.tsx` | H2 zgodne z TOC (T2.5) |
| `src/app/layout.tsx` | `title.template` (K-114) |
| `generateMetadata` | kontakt, publikacje, polityka, 404 |
| `src/components/text/AboutPage.tsx` | link `/publikacje` w historii (K-110) |
| `src/i18n/pl.ts` + wybrane MDX | audyt myślników C9 |
| `docs/plan-claude-code.md` §4 | wpis K-82…K-118 |

**Kryterium „gotowe":** TOC polityki trafia w H2; tytuły kart przeglądarki
„Kontakt · Akademia Ikony" itd.; lista pytań prawnych dla EJK w meldunku.

---

## 6. Mapowanie przeglądu → kawałek

| Punkt | Kawałek |
| --- | --- |
| A1, A2, A4, B2, C7, C9 (wystawa) | 2, 3 |
| A3 | 4 |
| A5 | 5 |
| A6 | 7 |
| B1 | 1 |
| B3 | 5, 7 |
| B4 | 3, 6 |
| C1 | 1 |
| C2 | 1, 5 |
| C3, C4, C10 (spis) | 5 |
| C5 | 6, 7 |
| C6 | 6 |
| C8 | 6 |
| C9 (reszta) | 7 |
| C10 (kontakt) | 6 |
| T1.1 | 1 |
| T1.2 | 5 |
| T1.3 | 1 |
| T1.4 | 1 |
| T1.5 | 3 |
| T2.1, T2.2, T3.4 | 3 |
| T2.3 | 5 |
| T2.4 | 1, 6 |
| T2.5 | 7 |
| T2.6 | 6 |
| T2.7 | 1, 6 |
| T3.1 | 5, 7 |
| T3.2 | 1, 3 |
| T3.3 | 5 |
| T4 | 3, 7 |

Punkty **pominięte** (materiały, nie struktura): `[do uzupełnienia]`, `[przykład]`
— bez zmian, chyba że blokują build.

---

## 7. Kryteria ukończenia etapu 08b

- [x] Wszystkie 7 kawałków zaliczone (checkpointy + OK)
- [x] `npm run build` i `npm run lint` OK
- [x] Decyzje K-82…K-118 w `docs/plan-claude-code.md` §4
- [x] Przegląd wizualny: `/ikony/wystawy`, `/kontakt`, `/publikacje`, `/polityka-prywatnosci`, 404, home — desktop + 390 px
- [x] `mailto:` przetestowany (temat bez `+`)
- [x] Brak notatek projektowych C1 w UI
- [ ] Lista pytań prawnych polityki przekazana (K-115) — poza repo / do EJK (E08-05: bez pliku w docs)

---

## 8. Ryzyka i pytania otwarte

- **ISR wystawy:** `revalidate: 86400` — stan zmienia się do 24 h po dacie; akceptowalne (jak `featuredUntil`). Alternatywa: krótszy interwał — decyzja przy implementacji kawałka 3.
- **Stara trasa `/ikony/wystawa`:** linki zewnętrzne i WP mogą wskazywać stary URL — 301 w etapie 9.
- **Profile Szymuła/Biskup:** minimalne — EJK może uzupełnić bio później (etap 9/10).
- **Polityka:** struktura w kodzie; treść prawna wymaga fundacji — nie generujemy. EJK potwierdziła strukturę i zakres danych (2026-09-26); sekcja kontaktu — tylko e-mail; po wdrożeniu analityki (etap 10) — aktualizacja cookies/RODO.
- **K-69** (funkcja Aktualności) — poza 08b; otwarte do przeglądu całości.

---

## 9. Postęp

| Kawałek | Status | Uwagi z checkpointu |
| --- | --- | --- |
| 1 — Infrastruktura serwisowa | ✅ | build + lint OK; mailto bez `+`; C1 wyczyszczone |
| 2 — Wystawa: model treści | ✅ | 15 rekordów K-88; walidacja seasonSlug; adapter UI do chunk 3 |
| 3 — Wystawa: strona, home, nawigacja | ✅ | `/ikony/wystawy` pod makietę 9a–9e; ISR; jeden lightbox; nawigacja „Wystawy”; build + lint OK |
| 4 — Aktualności ↔ wystawa | ✅ | `venue` + `getTravelingExhibitions`; link zwrotny w `NewsArticlePage`; `newsSlug` 2025/2026; build + lint OK |
| 5 — Publikacje i autorzy | ✅ | profile Szymuła/Biskup; walidacja slugów; spis `<ol>` + aria; C3/C4; link publikacje w FactsBox wykładów; build + lint OK |
| 6 — Kontakt, LSŚ, 404 | ✅ | adres 20/00-950; #dojazd; map links; ExternalLink; LSŚ Gdzie byliśmy po cytatach; 404 bez duplikatu Kontakt; build + lint OK |
| 7 — Polityka, metadane, copy pass | ✅ | K-114 title template; K-115 struktura polityki; K-110 link Publikacje w historii; T3.1 etykiety maili kontakt; rejestr K-82…K-118; build + lint OK |

---

## 10. Ewaluacja merytoryczna etapu 08 (2026-09-26)

Kontynuacja: tabela punktów **E08-06…E08-14** (pierwsza sesja ewaluacji w Cursor). Metoda: porównanie docs (`08b-review-fixes.md`, `08-review-staging.md`, `08-pozostale.md`, `plan-claude-code.md`, `brief-full.md`) z kodem; rozstrzyganie po jednym punkcie (opcje → rekomendacja → decyzja).

| ID | Decyzja |
| --- | --- |
| E08-01 | **A** — `#wyjazdowe`: `getTravelingExhibitions()` tylko `kind === "wystawa"` + `venue` (K-87). Święta Lipka (warsztaty + wystawa) — bez dual-tag; ewent. `kind: wystawa` w migracji WP (etap 9). |
| E08-02 | **A** — `annual.json` / `newsSlug`: bez zmian w repo; mapowanie relacji KŚT ↔ sezony w **etapie 9** z checklistą EJK (K-88). |
| E08-03 | **A** — kotwice `#wystawa-{rok}` w MDX: bez zmian; razem z E08-02 w etapie 9. |
| E08-04 | **A** — zsynchronizowany status zamknięcia i §7 tego planu. |
| E08-05 | **B** — lista pytań prawnych K-115 **poza repo** (mail/notatka do EJK); bez `docs/privacy-policy-questions-ejk.md`. |
| E08-06 | **B** — K-116 = UI + dokumenty formalne (OK). W narracji (`o-akademii.json`, bio w `lecturers.json`, archiwum news) zostaje odmiana „fundacji IKONA DZIŚ” jak w `brief-full.md`; bez edycji treści. |
| E08-07 | **A** — zgodne z K-103 (wpisy KŚT w Aktualnościach + link przy `newsSlug`); nie bug — porządki w etapie 9. |
| E08-08 | **A** — profile K-106 w `content/lecturers.json`; plan kawałka 5 zsynchronizowany (nie osobne pliki). |
| E08-09 | **A** — `redirect` `/ikony/wystawa` → `/ikony/wystawy` zgodny z 08b; 301 w `next.config` → etap 9. |
| E08-10 | **A** — `08-pozostale.md` jako archiwum planu 08; baner + 08b wystarczą, bez zmian DoD w środku. |
| E08-11 | **A** — baner archiwum na `08-review-staging.md`; stan docelowy → ten plan (08b). |
| E08-12 | **A** — braki sample/EJK (K-100, liczby ikon, RODO, lista plenerów) — oczekiwane; już w §1/§4 08b; etap 9/10. |
| E08-13 | **B** — nota przy wierszu 2.1 changelogu `brief-full.md` (historia ≠ stan bieżący; 2.3 / 08b). |
| E08-14 | **A** — `content/lecturers.json` śledzony w git; punkt zamknięty. |

**Kod z ewaluacji:** `src/content/news.ts` — filtr wyjazdowych (E08-01).

**Ewaluacja E08-01…E08-14:** zamknięta (2026-09-26).
