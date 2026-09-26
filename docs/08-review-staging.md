# Przegląd etapu 08 na stagingu — ocena merytoryczna i techniczna

> **Archiwum (ewaluacja E08-11).** Opisuje staging i `/ikony/wystawa` sprzed etapu **08b** (2026-09-22). Stan docelowy wystawy, kontaktu, publikacji i pozostałych tras z przeglądu: [`docs/plans/08b-review-fixes.md`](plans/08b-review-fixes.md). Rejestr rozstrzygnięć docs vs kod: ten plan §10.

Status: materiał wejściowy do `08b-review-fixes.md` (zamknięty po 08b — nie aktualizować jako plan docelowy)
Data: 2026-09-22
Staging: `https://academy-lbylothvg-greg-d8fb.vercel.app/`
Zakres: trasy etapu 08 — `/kontakt`, `/ikony/wystawa`, `/publikacje` (+ album i 3 warianty artykułu), `/polityka-prywatnosci`, 404, sekcja „Gdzie byliśmy” na LSŚ, kafel „Najbliższe” i filar „Ikony” na home.

Pominięte: brakujące materiały (`[do uzupełnienia]`, `[przykład]`), chyba że problem jest strukturalny.

Metoda (część techniczna): przegląd wygenerowanego HTML, drzewa dostępności, zachowania lightboxa z klawiatury, nagłówków HTTP, zasobów sieciowych i overflow przy 390 px. Bez dostępu do repo — nie oceniano kodu źródłowego, typów, walidacji przy buildzie, konwencji ani wyniku `build`/`lint`.

---

## Część I — ocena merytoryczna i stylistyczna

### A. Merytoryka — do rozstrzygnięcia z EJK lub w planie

**A1. Wystawa: stała czy sezonowa?**
Serwis mówi o niej na trzy sposoby: „stała wystawa” (lead `/ikony/wystawa`, filar „Ikony” na home), „co roku nowy zestaw ikon” / „edycje” oraz „czynna w godzinach otwarcia kościoła”. Kafel na home 22 września twierdzi, że edycja 2026 jest czynna. Tymczasem wpisy w Aktualnościach pokazują wystawy trwające ok. 5 tygodni (2016: 17.06–24.07; 2018: 15.06–22.07; w 2015 był finisaż). `getExhibitionState()` zna tylko `zapowiedz` i `biezaca` — brak stanu „po finisażu”.
→ Potwierdzić z EJK. Jeśli sezonowa: trzeci stan (np. `zakonczona` z komunikatem „Kolejna edycja: czerwiec 2027”) i usunięcie słowa „stała”.

**A2. `editions.json` jest sprzeczny z Aktualnościami.**
- 2019: edycja „Świętych obcowanie” (czerwiec) vs wpis news „Ikona okno duszy”, 5–26.10.2019.
- 2017 i 2018: edycje bez tytułu, a news podaje „Ikona – korzenie i owoce wiary”.
- „Ikona – korzenie i owoce wiary” to jednocześnie H1 edycji 2026, tytuł edycji 2017/2018 i część tytułu sezonu wykładów 2026/27.
→ Rozdzielić w modelu stałe hasło wystawy od opcjonalnego podtytułu edycji; zweryfikować tytuły i daty edycji.

**A3. Wpisy KŚT nadal są w Aktualnościach.**
07b (K-67) wskazało 9 wpisów „do przeniesienia w etapie 8”, a plan 08 wyłączył zmiany w `content/news/` — obietnica zawisła bez decyzji. Skutek: „Zobacz też” na stronie albumu „Ikona dziś” podpina wpis o wystawie „Ikona dziś” z 2015 (fałszywe skojarzenie po tytule).
→ Zdecydować: przeniesienie + przekierowanie albo pozostawienie wpisów z linkiem karta edycji ↔ relacja w Aktualnościach.

**A4. Oprowadzania.**
Nagłówek „Terminy edycji 2026” stoi nad tematami z 2017 (Serce Jezusa, Trójca Święta, emalia). We wrześniu terminy i tak byłyby przeszłe.
→ Logika czasu jak w A1: przed wystawą „Terminy”, po niej „Oprowadzania w edycji 2026”.

**A5. Autorzy albumu vs lista wykładowców.**
- „ks. Henryk Paprocki” i „ks. prof. Henryk Paprocki” w jednym spisie; na `/wyklady/wykladowcy` „Ks. dr Henryk Paprocki”. W „Autorach tekstów” Paprocki występuje dwa razy.
- „ks. prof. Józef Naumowicz” vs „Ks. prof. dr hab. Józef Naumowicz”.
- „ks. Marek Szymuła” i „ks. prof. Maciej Biskup” oznaczeni jako „wykładowca”, a nie ma ich na liście wykładowców (linki prowadzą donikąd — zob. T1.2).
→ Tytuły i stopnie z jednego źródła (dane wykładowcy przez referencję w `toc`).

**A6. Polityka prywatności — treść rozjechana z nagłówkami.**
- TOC „Administrator danych” bez takiego nagłówka; akapit o administratorze stoi pod „Jakie dane zbieramy”.
- „Jakie dane zbieramy” nie mówi, jakie dane (imię, e-mail, telefon).
- Lista podstaw prawnych (art. 6 ust. 1) bez zdania wprowadzającego; niespójny zapis „lit. a” / „lit. b)”.
- Pozostałość szablonu: „interesy realizowane przez Finansującego oraz Partnerów”.
- „Cookies”: „Plausible / Umami” (narzędzie niewybrane) i twierdzenie o braku ciasteczek, podczas gdy mapa Google na `/kontakt` ustawia ciasteczka podmiotów trzecich.
- Niejasne źródło daty „Ostatnia aktualizacja: 4 stycznia 2026”.
→ Strukturę poprawić od razu; kwestie prawne wypisać dla EJK / fundacji.

### B. Nawigacja i wzorce

**B1. Breadcrumb vs SectionNav.**

| Wzorzec | Trasy |
|---|---|
| SectionNav | O Akademii, Pracownia, Warsztaty/\*, Wykłady/\*, Ikony/\* (w tym wystawa) |
| Breadcrumb | `/kontakt`, `/publikacje`, `/publikacje/[slug]`, `/aktualnosci/[slug]` |
| nic | `/aktualnosci`, `/polityka-prywatnosci`, 404 |

`/kontakt` i `/publikacje` to strony pierwszego poziomu (jak `/aktualnosci`), a tylko one mają okruszek „Strona główna › X”, który przesuwa H1 względem reszty serwisu. Plan 06 zakładał Breadcrumb w `TextPageShell`, a polityka go nie ma.
→ Reguła do zapisania jako decyzja: sekcja z rodzeństwem → SectionNav; strona drugiego poziomu bez SectionNav (wpis, album, artykuł) → Breadcrumb; strona pierwszego poziomu → nic. W praktyce: usunąć okruszek z `/kontakt` i `/publikacje`.

**B2. Trzy nazwy tej samej rzeczy.**
Kafel home „Wystawa ikon · edycja 2026”, SectionNav „Wystawa”, H1 „Ikona – korzenie i owoce wiary”, „Zobacz też” na publikacjach „Wystawa ikon w kościele”.
→ Eyebrow nad H1 („Wystawa ikon · Kościół Środowisk Twórczych”), jedno nazewnictwo w linkach, rozstrzygnięcie A2.

**B3. Publikacje prawie niewidoczne.**
Prowadzi do nich tylko stopka. Album jest sprzedawany na wykładach.
→ Linki zwrotne z `/wyklady` (przy „W skrócie”) i z `/o-akademii` („Nasza historia”).

**B4. Drobiazgi.**
- 404: „Kontakt” dwa razy; „Mapa strony” przy 6 pozycjach obiecuje za dużo → „Działy serwisu”.
- Filar „Ikony” na home ma CTA tylko „Galeria” → „Galeria i wystawa” (pozostałe filary mają dwa cele).

### C. Copy i styl

**C1. Notatki projektowe widoczne w UI** (do usunięcia, to nie braki materiałów):
- „Kliknięcie otwiera powiększenie” — wystawa, hub, album (3×);
- „Album ma format 23 × 23 cm — pojedyncza strona jest kwadratem, rozkładówka ma proporcje 2:1”;
- legenda spisu „Pozycje z ciemniejszym tłem, złotą krechą z lewej…”; „Pełny spis liczy 12 tekstów” dubluje przycisk.

**C2. Odmiana liczebników:** „44 ikon” → „44 ikony”; „132 stron” → „132 strony” (hub, blok źródła artykułu). Zob. T1.3.

**C3. Blok źródła artykułu.**
- „Poniżej publikujemy go za zgodą redakcji” / „Poniżej zamieszczamy zajawkę” — blok stoi pod tekstem.
- „ukazał się pierwotnie w [medium]” / „Przeczytaj w [medium]” wymusza odmianę tytułu → forma bez odmiany: „Pierwodruk: «Tytuł», 15 marca 2023”, „Czytaj w serwisie wydawcy ↗”.
- „Pierwodruk:” w nagłówku i to samo zdanie w stopce powtarzają informację.

**C4. Metryczka albumu.** Hub „Objętość” vs podstrona „Liczba stron”; hub „Dostępny, wysyłka pocztą” vs „Dostępny”; eyebrow „Wydawnictwo Akademii”, a wydawcą jest Fundacja; tytuł albumu w metadanych artykułów bez cudzysłowu / kursywy.

**C5. Nazwa fundacji.** „fundacja IKONA DZIŚ” (stopka, część polityki) vs „Fundacja IKONA DZIŚ” (kontakt, publikacje, reszta polityki) → jedna forma, rekomendacja: wielka litera. Na `/kontakt` zdanie „Fundacja IKONA DZIŚ — ikonadzis.org Akademia Ikony jest jej projektem wiodącym.” to zbitka bez interpunkcji.

**C6. Kontakt.**
- Adres „Plac Teatralny, Warszawa” bez numeru i kodu (w danych news „Plac Teatralny 20”) → pełny adres po weryfikacji.
- „prosimy zadzwonić pod numer podany wyżej” → numer wprost jako `tel:`.
- „na zajęcia i do sal warsztatowych” — tautologia; dopytać, czy to samo wejście na wykłady.
- Linki zewnętrzne niespójne: „Blog — studiumikony.blogspot.com” (kontakt) vs „Blog ↗” (stopka); Facebook / YouTube bez adresu i strzałki.

**C7. Strona wystawy.**
- „Wstęp: darmowy” → „Wstęp wolny”; wartości w tabeli od wielkiej litery.
- „Bieżąca edycja: 2026” + „Nowa edycja: Wernisaż w czerwcu…” + H2 „Bieżąca edycja 2026” — dublowanie i niejasność → „Kolejna edycja: czerwiec 2027” (łączy się z A1).
- „Co roku… nowy zestaw ikon” dwa razy (lead i „Poprzednie edycje”).
- Wariant „linijka” z K-54 nie działa: każda edycja, także bez zdjęć, renderuje się jako karta z 3 placeholderami; 2025, 2018, 2017 mają rok i „Zobacz zdjęcia” bez tytułu.

**C8. LSŚ, „Gdzie byliśmy”.**
„odbywała się m.in. w: Świętej Lipce… na Litwie” — składniowo niespójne (w/na); miejscowości zmieszane z krajami → mianownik bez przyimka („Święta Lipka (Warmia) · 2019”), konkretne miejsca zamiast „Gruzja”, „Litwa”. Sekcja lepiej pasuje przy „Głosach z pleneru” niż przed „Rytmem dnia”.

**C9. Myślniki.** Copy doc: półpauza ze spacjami (–). Nowe teksty etapu 08 używają pauzy (—); na LSŚ obie formy obok siebie. Pauza em była wyjątkiem tylko dla tytułów wykładowych (K-75) → przejrzeć nowe wpisy `pl.ts` i MDX.

**C10. Ton.** Serwis mówi na „ty” („Zadzwoń”, „daj znać”, „Masz prawo”), kontakt — „prosimy zadzwonić”. Etykieta „uczestnik” w spisie albumu → odmiana według osoby albo forma neutralna („z warsztatów”).

---

## Część II — ocena techniczna

### Co działa dobrze

- Wszystkie nowe trasy prerenderowane statycznie; 404 zwraca status 404 z `noindex`.
- Brak poziomego scrolla przy 390 px na wszystkich nowych trasach.
- Jedno H1 na stronę, bez przeskoków w hierarchii nagłówków; obrazy z `alt`, sensowne `sizes`. Wystawa: ok. 290 kB obrazów, 156 kB JS.
- Lightbox edycji: natywny `<dialog>` z `aria-modal` i etykietą, fokus na „Zamknij”, strzałki przełączają zdjęcia, licznik w `aria-live="polite"`, Esc zamyka, fokus wraca na przycisk otwierający, blokada przewijania.
- `tel:+48601734705` poprawny; linki zewnętrzne z `noopener`; iframe mapy z `title` i `loading="lazy"`.
- Konsola czysta — brak błędów hydracji i aplikacji.

### T1 — błędy do poprawy

**T1.1. `mailto:` koduje spacje jako `+` (cały serwis).**
Dotyczy kursu, LSŚ, wykładów, ikon na zamówienie i albumu (hub + podstrona), np. `?subject=Zg%C5%82oszenie+%E2%80%93+kurs+roczny…`. To kodowanie formularzy (`URLSearchParams`); w `mailto:` znak `+` jest literałem (RFC 6068) — Apple Mail i Outlook pokażą „Zgłoszenie+–+kurs+roczny+2026/2027”. Błąd sprzed etapu 08, ale etap 08 go powielił, a to główna ścieżka konwersji.

```ts
export const buildMailto = (email: string, subject?: string): string =>
  subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
```

Po zmianie: test na telefonie (iOS Mail, Gmail app).

**T1.2. Martwe kotwice wykładowców.**
`/wyklady/wykladowcy#marek-szymula` i `#maciej-biskup` — brak takich `id`. Autorzy w `toc` nie są walidowani (w przeciwieństwie do slugów artykułów).
→ `toc[].author` jako referencja do slugu wykładowcy, tytuły i stopnie z danych wykładowcy, błąd buildu przy nieistniejącym slugu. Rozwiązuje też duplikat Paprockiego (deduplikacja po slugu).

**T1.3. Odmiana liczebników bez `Intl.PluralRules`.**
„44 ikon”, „132 stron” (3 miejsca). Mechanizm istnieje od 07b (`Galeria · N zdjęć`).
→ Wspólny helper `pluralize(n, forms)` w `src/i18n/`, użyty wszędzie przy liczbie z rzeczownikiem.

**T1.4. Brak kotwicy `#artykuly` na hubie.**
Brief §3: `/publikacje/artykuly/` → `/publikacje#artykuly`; sekcja ma `id="publication-articles-heading"`.
→ Dodać `id="artykuly"` teraz, przed etapem przekierowań.

**T1.5. Stan wystawy liczony w czasie builda.**
`getExhibitionState()` na stronach prerenderowanych (`x-nextjs-prerender: 1`) — kafel home i strona wystawy zmieniają stan dopiero po deployu. Problem jak `featuredUntil` (07b), tu poważniejszy, bo daty są znane z góry.
→ `revalidate` (ISR, np. raz na dobę) na `/` i `/ikony/wystawa` albo zaplanowany rebuild. Decyzja w 08b, razem z modelem stanów (A1).

### T2 — dostępność i semantyka

**T2.1. Lista poprzednich edycji bez nagłówków.**
Rok w `<span>`, tytuł w `<div>`; brak nawigacji po edycjach nagłówkami.
→ `<h3>` z rokiem i tytułem, `id="wystawa-2019"` (wzór `wystawa-{rok}`, K-97; linkowanie z Aktualności, A3).

**T2.2. Przyciski i miniatury edycji.**
- Cztery identyczne „Zobacz zdjęcia” → `aria-label="Zobacz zdjęcia z edycji 2025 (3)"` + `aria-haspopup="dialog"`.
- Miniatury `aria-hidden`, nieklikalne → każda jako przycisk otwierający lightbox na swoim indeksie (jak w bieżącej edycji: „Powiększ zdjęcie: …”).

**T2.3. Spis treści albumu.**
- `<ul>` → `<ol>`.
- „Pokaż pełny spis (12)” bez `aria-expanded` / `aria-controls`.
- Dwie ukryte pozycje nie istnieją w SSR HTML → renderować wszystkie 12, ukrywać stylem lub przez `<details>`.

**T2.4. Nazwy landmarków.**
- 404: `aria-label="Mapa ratunkowa"` (nazwa decyzji z planu) → „Działy serwisu”.
- Na 404 drugi `nav` „Mapa strony” (stopka) i nawigacja nagłówka bez etykiety → nagłówek: „Menu główne” (cały serwis).
- Brak skip linka „Przejdź do treści” (cały serwis; etap 10 zakłada Lighthouse a11y ≥ 95).

**T2.5. Kotwica „Administrator danych” w polityce prowadzi do `<header>`** z H1 i leadem — znika po dodaniu właściwego H2 (A6).

**T2.6. Kontakt.**
- Dane kontaktowe bez `<address>` (kontakt i stopka).
- Brak linku „Otwórz w Mapach Google / Wyznacz trasę” pod mapą (na telefonie iframe przechwytuje przewijanie).
- „Dojazd i kontakt” z wystawy prowadzi na górę `/kontakt` → kotwica `#dojazd` na sekcji adresu i mapy.

**T2.7. Linki zewnętrzne.**
- Brak zapowiedzi nowej karty dla czytnika (`sr-only` „(otwiera się w nowej karcie)”).
- Strzałka ↗ niespójna: „Blog ↗”, „Przeczytaj w… ↗” mają; ikonadzis.org, Facebook, YouTube nie.
- Dwie wersje `rel` (`noopener noreferrer` i samo `noreferrer`) → jeden komponent `ExternalLink`.

### T3 — zgodność z systemem projektu

**T3.1. Skala typograficzna** (EB Garamond ≥ 16,5 px): etykiety maili na `/kontakt` („Warsztaty i ikony”, „Wykłady i sekretariat”) — 16 px; tytuł albumu w metadanych listy artykułów („Ikona dziś”) — 15 px → 16,5 px albo Plex 14,5 px.

**T3.2. Zduplikowane `id="facts-box-heading"`** na LSŚ i `/ikony/na-zamowienie` (`FactsBox` w DOM dwa razy: desktop + mobile). Sprzed etapu 08 → jedna instancja przestawiana CSS-em albo `useId()` dla `aria-labelledby`.

**T3.3. „Zobacz też” na albumie dobiera wpisy po tytule** (stąd „Ikona dziś” 2015) → jawne `related?: string[]` we frontmatterze albo brak sekcji.

**T3.4. Pięć `<dialog>` w DOM wystawy** (po jednym na edycję ze zdjęciami) → jeden współdzielony `Lightbox` z przekazywanym zestawem zdjęć, spójnie z galerią.

### T4 — metadane (formalnie etap 10)

- Brak szablonu tytułu: nowe trasy mają samo „Kontakt”, „Publikacje”, „Polityka prywatności”; wystawa i 404 mają domyślny tytuł serwisu. → `title: { template: '%s · Akademia Ikony', default: … }` w `layout.tsx` + `generateMetadata` na wystawie i 404 — warto teraz.
- Brak `description`, `canonical`, OG, `sitemap.xml`, `robots.txt` (404) — zgodnie z planem, etap 10.
- Brak JSON-LD — zgodnie z planem, etap 10.

---

## Proponowany priorytet do 08b

1. **Najpierw:** T1.1 (`mailto:`), T1.2, T1.3 — błędy widoczne dla użytkownika; T1.5 razem z A1–A3 — model wystawy i jej stanów; B1 — reguła nawigacji; C1–C2 — tekst techniczny w UI i odmiana.
2. **Potem:** T2.1–T2.4, T3.1, A4–A6, B2–B3, C3–C7.
3. **Porządki:** pozostałe punkty B, C, T2, T3; T4 (szablon tytułu) przy okazji.

Numeracja decyzji w 08b: K-82+ (część merytoryczna i nawigacja), osobna sekcja „Poprawki techniczne” w kolejności kawałków.
