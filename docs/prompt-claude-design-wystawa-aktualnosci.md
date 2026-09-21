# Akademia Ikony — makiety po likwidacji działu „Wydarzenia”

## Kontekst

Pracujemy dalej w istniejącym systemie wizualnym Akademii Ikony (makiety „Akademia Ikony – kierunki wizualne” oraz „Akademia Ikony – O Akademii i Pracownia”). **Nie zmieniaj kierunku wizualnego, tokenów, typografii ani komponentów bazowych.** Używaj istniejących: `Header`, menu mobilnego (akordeon), `SectionNav`, `Breadcrumb`, `TextLink`, `Button`, kafli „Najbliższe”, `IconGrid`/lightboxa galerii, szablonu strony tekstowej, stopki z mapą strony.

Zasady systemu, które obowiązują bez wyjątku:
- nagłówki zawsze wagą 400;
- Garamond nie mniejszy niż 16,5 px; drobne etykiety i metadane w Plex;
- złoty akcent tylko przez token tekstu akcentowego;
- odbiorca 35–70+ lat, często na telefonie: duże cele kliknięcia, bez hover-dropdownów, wysoki kontrast;
- desktop 1440 px oraz mobile 390 px dla każdego nowego ekranu.

Treść pisz po polsku. Używaj faktów podanych niżej; wszystko, czego nie ma w tym briefie, oznacz jako `[do uzupełnienia]` albo `[przykład]` — **bez loremu i bez zmyślonych dat, liczb i nazwisk**.

## Co się zmieniło (decyzje)

1. **Dział „Wydarzenia” znika** z menu i jako sekcja. Nowe menu główne: **O Akademii · Warsztaty · Wykłady · Ikony · Aktualności · Kontakt.**
2. **Wystawa dostaje własną stronę w dziale Ikony:** `/ikony/wystawa`. `SectionNav` Ikony: **Galeria · Wystawa · Ikony na zamówienie.**
   Wystawa „Ikona – korzenie i owoce wiary” jest w Kościele Środowisk Twórczych **na stałe**, a zestaw ikon **zmienia się co roku**. Nowa edycja otwiera się wernisażem na koniec roku akademickiego, w okolicach wspomnienia św. Brata Alberta (17 czerwca). Wystawę można oglądać w godzinach otwarcia kościoła. Wystawie towarzyszą oprowadzania kuratorskie Elżbiety Jackowskiej-Kurek.
3. **Aktualności przejmują archiwum dawnych wydarzeń.** Jeden strumień wpisów, każdy z małą etykietą typu: Wykłady · Warsztaty · Plener · Wystawa · Oprowadzanie · Wyjazd studyjny · Spotkanie · Aktualność. **Bez filtrów kategorii.** Wpisy pogrupowane latami (od najnowszego).
4. **Poświęcenia ikon** stają się w przyszłości artykułem w Publikacjach — **Publikacji teraz nie projektujemy.**
5. **Historia plenerów** trafia na stronę Letniej Szkoły Światła jako sekcja „Gdzie byliśmy”.
6. **Wyjazdy studyjne** nie mają osobnej strony; dawne wyjazdy to wpisy w Aktualnościach. Tekst na O Akademii o wyjazdach zostaje bez zmian.

Najważniejsza zasada projektowa: **strona musi dobrze wyglądać przy rzadkich aktualizacjach.** Nowa treść pojawia się kilka razy w roku. Nic nie może wyglądać na puste, porzucone ani „czekające na wpisy”.

---

## Ekrany do zaprojektowania (nowe)

### A. `/ikony/wystawa` — desktop i mobile

Kolejność sekcji:

1. **Nagłówek:** breadcrumb (Ikony › Wystawa), `SectionNav` Ikony z aktywną „Wystawa”, H1 „Ikona – korzenie i owoce wiary”, lead w 1–2 zdaniach: stała wystawa ikon Elżbiety Jackowskiej-Kurek i jej uczniów w Kościele Środowisk Twórczych na Placu Teatralnym; co roku nowy zestaw ikon.
2. **Blok praktyczny** (na wzór `FactsBox`/„W skrócie”, ale prostszy): Gdzie — Kościół Środowisk Twórczych pw. św. Andrzeja Apostoła i św. Brata Alberta Chmielowskiego, Plac Teatralny, Warszawa · Kiedy — w godzinach otwarcia kościoła · Wstęp — `[do uzupełnienia]` · Bieżąca edycja — 2026 · Nowa edycja — wernisaż w czerwcu. Jeden `TextLink` do Kontaktu (dojazd).
3. **Bieżąca edycja 2026:** duże zdjęcie z wernisażu, 2–3 zdania o edycji `[przykład]`, opcjonalnie temat sezonu wykładów („Mistyka dziś”), miniatury 6–8 zdjęć otwierające istniejący lightbox, plakat edycji jako mały element obok (nie hero).
4. **Jak wygląda wystawa** — krótki tekst stały z 1–2 zdjęciami wnętrza. Materiał do redakcji: ikony Chrystusa, Matki Bożej, Trójcy Świętej i ikony świąteczne stoją z przodu lewej nawy, tak by były widoczne podczas Mszy; ikony świętych przy wejściu zwrócone są, jak modlący się, w stronę ołtarza; stolik ikonografa z ćwiczeniami, paletą pigmentów i metryczkami ikon; księga pamiątkowa; dyżury uczniów. Przed ikonami można się modlić w godzinach otwarcia kościoła.
5. **Oprowadzania kuratorskie** (kotwica `#oprowadzania`): 1–2 zdania o formie (EJK opowiada o warsztacie ikonografa, wybranych ikonach i ich teologii), lista terminów bieżącej edycji: data + temat. Przykładowe tematy z poprzednich lat: „Ikona – modlitwa i sztuka”, „Ikona współczesna – analiza na przykładzie wybranych przedstawień”, „Serce Jezusa”, „Trójca Święta”, „Ikony pisane emalią komórkową”.
6. **Poprzednie edycje** — lista od najnowszej, **dwa warianty rekordu w jednej liście:**
   - edycja **ze zdjęciami** → karta: rok, tytuł/podtytuł, 3 miniatury, link „Zobacz zdjęcia”;
   - edycja **bez zdjęć** → jedna elegancka linijka: rok · podtytuł (jeśli jest) · liczba ikon (jeśli jest). Bez szarych placeholderów, bez „brak zdjęć”.
   Dane przykładowe: 2025 (ze zdjęciami), 2024 (linijka), 2023 (linijka), 2022 (linijka), 2021 (linijka), 2020 (linijka), 2019 „Świętych obcowanie”, 44 ikony (karta), 2018 (karta), 2017 (karta), 2016 „Ikona – niebo na ziemi” (linijka), 2015 „Ikona dziś” (linijka). Lista ma wyglądać jak **kronika tradycji**, nie jak luki w dokumentacji. Przy 10+ pozycjach rozważ zwinięcie starszych („Wcześniejsze edycje: 2015–2020”).
7. **Zamknięcie strony:** krótki `TextLink` do Galerii („Zobacz ikony w galerii”) i do Warsztatów („Chcesz napisać własną ikonę?”).

**Stany do pokazania (osobne ramki, wystarczy desktop dla B i C):**
- **A1:** stan domyślny — bieżąca edycja na wystawie (jak wyżej);
- **A2:** stan „zapowiedź” — maj/czerwiec, nowa edycja ogłoszona: nad bieżącą edycją pasek/boks „Wernisaż nowej edycji: {data} po Mszy o {godz.}” `[przykład]`, terminy oprowadzań nowej edycji;
- **A3:** bieżąca edycja **bez zdjęć** (np. tuż po wernisażu, zanim przyszły zdjęcia) — sekcja 3 pokazuje plakat i 2 zdania, bez pustej galerii.

### B. `/aktualnosci` — lista, desktop i mobile

- H1 „Aktualności”, lead w jednym zdaniu (co się dzieje w Akademii: wykłady, warsztaty, plenery, wystawy — i archiwum od 2012 r.).
- Brak `SectionNav` (to już nie jest sekcja z podstronami) — sprawdź, czy strona nie wygląda przez to „sieroco” na tle innych; jeśli tak, zaproponuj rozwiązanie w obrębie istniejących komponentów.
- **Grupowanie latami:** nagłówek roku, pod nim wpisy. Karta wpisu: etykieta typu (Plex, mała), data (lub zakres dat), tytuł, 1–2 zdania zajawki, opcjonalna miniatura (zdjęcie albo plakat). Karty bez obrazu muszą wyglądać równie dobrze jak z obrazem.
- Pokaż, jak lista wygląda z **realnym rytmem**: w ostatnich latach 2–4 wpisy na rok, w latach 2013–2017 więcej.
- Dane przykładowe (z archiwum; szczegóły `[przykład]` tam, gdzie ich nie podaję):
  - 2026: „Nabór na kurs roczny i trzyletni 2026/2027 — zgłoszenia do 24 września” (Warsztaty); „Wykłady 2026/2027: Ikona – korzenie i owoce wiary. Mistyka dziś — pierwszy wykład 6 października, 18:00” (Wykłady); „Nowa edycja wystawy” (Wystawa, link do `/ikony/wystawa`); „Letnia Szkoła Światła 2026” `[przykład]` (Plener);
  - 2025: „Premiera książki «Ikona dziś. Akademia Ikony 2010–2025»” `[przykład daty]` (Aktualność); wykłady 2025/2026 „Mądrość Boża” (Wykłady);
  - 2019: „Noc Świątyń — wystawa i wykład o kondycji współczesnej ikonografii”, 21 września (Wystawa); „Ikona okno duszy”, 5–26 października (Wystawa); „Warsztaty w Świętej Lipce z wystawą «Ikona – piękno zanurzone w tajemnicy»”, 3–10 sierpnia (Plener);
  - 2018: „Ikona – sztuka i modlitwa” — podziemia Bazyliki Katedralnej św. Michała Archanioła i św. Floriana, Wielki Post (Wystawa);
  - 2017: „Oprowadzania po wystawie: Serce Jezusa, Trójca Święta, ikony emaliowane” (Oprowadzanie); „Wyjazd śladami ikon prof. Jerzego Nowosielskiego” (Wyjazd studyjny); „Spotkania z Grzegorzem Zinkiewiczem” (Spotkanie);
  - 2015: „Wystawa «Ikona, piękno zanurzone w tajemnicy», plebania w Powsinie, 13.12.2015–16.01.2016” (Wystawa);
  - 2013: „Wystawa «Ikona i jej konteksty», Dom Kultury Polskiej w Wilnie, 4 października” (Wystawa).
- Nawigacja po latach przy długiej liście: zaproponuj prostą (np. listę lat jako kotwice lub „Pokaż starsze”), bez paginacji numerowanej, jeśli to możliwe — to ułatwi decyzję K-06.

### C. `/aktualnosci/[slug]` — wpis, desktop i mobile

Dwa przykłady:
- **C1:** wpis archiwalny z galerią i plakatem — „Wystawa «Ikona i jej konteksty» w Wilnie” (2013): breadcrumb, etykieta typu, data, tytuł, 2–3 akapity `[przykład]`, plakat, galeria miniatur z lightboxem, na dole „Poprzedni / następny wpis” oraz link „Wszystkie aktualności”;
- **C2:** krótki wpis bez obrazów — „Nabór na kurs roczny i trzyletni 2026/2027”: tytuł, 1 akapit, wyraźne CTA do strony kursu. Ma wyglądać kompletnie mimo krótkości.

---

## Ekrany do zaktualizowania (istniejące makiety)

1. **Nawigacja** — `Header` desktop i **menu mobilne 390 px**: „Aktualności” zamiast „Wydarzenia” (5. pozycja). W akordeonie mobilnym Aktualności to zwykły link bez rozwijania; Ikony rozwijają: Galeria · Wystawa · Ikony na zamówienie.
2. **Stopka** (mapa strony): usuń kolumnę/pozycję „Wydarzenia”; w grupie Ikony dodaj „Wystawa”; Aktualności zostają w mapie. Publikacje zostają.
3. **Strona główna (desktop + mobile):**
   - kafel 3 „Najbliższe” — realna treść zamiast `[przykład] Wystawa stała`: nadtytuł „Wystawa w kościele”, tytuł „Ikona – korzenie i owoce wiary · edycja 2026”, tekst „Czynna w godzinach otwarcia kościoła”, link „O wystawie” → `/ikony/wystawa`. Pokaż też wariant zapowiedzi: „Wernisaż {data}”;
   - filar „Ikony”: opis skrócony do galerii prac Elżbiety Jackowskiej-Kurek i uczniów, stałej wystawy w kościele i ikon na zamówienie (bez poświęceń, oprowadzań, wyjazdów).
4. **`/ikony` (galeria) i `/ikony/na-zamowienie`:** `SectionNav` z nową pozycją „Wystawa” (środkowa). Zweryfikuj, czy trzy pozycje mieszczą się na mobile w jednej linii albo zawijają się czytelnie.
5. **`/warsztaty/letnia-szkola-swiatla`:** nowa sekcja **„Gdzie byliśmy”** — lista miejsc dotychczasowych plenerów: Święta Lipka, Wesoła, Supraśl, Gruzja, Litwa, Gródek `[do potwierdzenia]`. Forma lekka (np. lista nazw z latami `[do uzupełnienia]`, opcjonalnie 2–3 zdjęcia), umieszczona po opisie pleneru, przed zapisami. Ma budować zaufanie do doświadczenia, nie konkurować z CTA. Sprawdź stan zamknięty naboru.
6. **O Akademii:** linki OA-55 i OA-63 prowadzą teraz do `/aktualnosci` (etykieta „Aktualności”, ewentualnie wariant „Z życia Akademii” do porównania). Treść listy działań (w tym „Wyjazdy studyjne” w czasie teraźniejszym) **bez zmian**.
7. **Usuń** z makiet wszelkie ekrany huba `/wydarzenia`, `EventCard` z kategoriami i `SectionNav` „Wszystkie · Wystawy · Poświęcenia · Oprowadzania · Wyjazdy studyjne”, jeśli istnieją. Zostaw krótką notkę w indeksie makiety, że zastąpiły je ekrany A–C.

---

## Oddanie pracy

- Nowe ekrany A–C w osobnym pliku makiety **„Akademia Ikony – Wystawa i Aktualności”**, z oznaczeniami slotów treści (`data-slot`), tak jak w makiecie O Akademii i Pracownia, żeby można było przygotować osobny dokument copy.
- Zmiany w istniejących ekranach — w dotychczasowych plikach, z listą zmienionych ekranów w README.
- Nowe komponenty (jeśli powstaną, np. rekord edycji w dwóch wariantach, nagłówek roku, etykieta typu wpisu) opisz w handoffie: stany, warianty, zachowanie na mobile, dostępność (kolejność nagłówków, etykieta typu czytana przez czytnik ekranu razem z datą).
- Na końcu wypisz decyzje projektowe, które wymagają mojej akceptacji, i miejsca, gdzie brief był niejasny.
