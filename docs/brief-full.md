# Akademia Ikony – brief odświeżenia strony

> **Wersja:** 2.3 · **Data:** 2026-09-26
> **Status:** żywy dokument, aktualizowany po każdej sesji decyzyjnej. Dziennik zmian na końcu.
> **Dokumenty powiązane:** `plan-claude-code.md` (implementacja), `brief-claude-code.md` (wymagania techniczne), `ikony-ejk-master-plan.md` (strona autorska EJK, poza repo), `ekosystem-ejk.md` (dokument nadrzędny ekosystemu, poza repo).

Dokument kontekstowy dla Claude Design (makiety) i Claude Code (implementacja).
Stan analizy: wrzesień 2026, na podstawie obecnej strony [https://www.akademiaikony.pl/](https://www.akademiaikony.pl/).

---

## 1. Kim jest klient i po co ta strona

**Akademia Ikony – Studium Ikonograficzne św. Andrzeja Apostoła** działa od 2010 r. w Warszawie, od 2012 r. w Kościele Środowisk Twórczych pw. św. Andrzeja Apostoła i św. Brata Alberta Chmielowskiego na Placu Teatralnym. Jest projektem wiodącym fundacji IKONA DZIŚ (ikonadzis.org). Założycielką i prowadzącą warsztaty jest **Elżbieta Jackowska-Kurek**, malarka ikon z ponad dwudziestoletnią praktyką; sekretarzem jest **Maurycy Lubak**.

Trzy filary działalności:

1. **Warsztaty pisania ikon** – kurs roczny (przedwstępny/wstępny) i trzyletni (doskonalący), raz w tygodniu, październik–czerwiec, praca indywidualna z każdym uczestnikiem. Plus **Letnia Szkoła Światła** – tygodniowe plenery ikonowe w sierpniu/wrześniu, w trybie rekolekcyjnym.
2. **Wykłady** – cykl „Ikona – korzenie i owoce wiary”, wybrane wtorki miesiąca 18:00–20:30, październik–czerwiec, 400 zł/rok, możliwy roczny dostęp do nagrań. Prowadzą teolodzy, historycy sztuki, duchowni (UKSW, UO, dominikanie, prawosławni). 16 sezonów łącznie (od 2012/2013); bieżący 2026/2027 to szesnasty; archiwum — 15 sezonów archiwalnych.
3. **Ikony** – galeria prac Elżbiety Jackowskiej-Kurek i uczniów; w kościele trzy formy wystawy (ekspozycja codzienna, wystawa doroczna uczestników, wystawy wyjazdowe — opis na `/ikony/wystawy`, K-82…K-90); ikony na zamówienie. Archiwalne poświęcenia i wyjazdy studyjne — patrz Aktualności (K-50).
   **Cele nowej strony (w kolejności ważności):**
4. Wizerunek i prestiż – strona ma odpowiadać randze instytucji z 15-letnim dorobkiem i zapleczem akademickim.
5. Zapisy na warsztaty roczne i plener.
6. Zapisy na wykłady.
   Strona jest **pełnoprawną stroną sprzedażową** warsztatów, wykładów i plenerów. Kontekst ekosystemu (§10) nie zmienia tej hierarchii: hero, strona główna i strony ofertowe są zaprojektowane pod zapisy, a rola strony jako źródła autorytetu Elżbiety Jackowskiej-Kurek jest efektem ubocznym dobrze zrobionej strony instytucji, nie osobnym celem projektowym.

**Odbiorcy:** dorośli, głównie 35–70 lat, często bez tła artystycznego; osoby religijne szukające praktyki duchowej przez sztukę; artyści i teolodzy; osoby zamawiające ikony (parafie, osoby prywatne). Wielu wejdzie z telefonu, z linku z kościoła, plakatu lub od znajomego.

**Ton komunikacji:** spokojny, poważny, ciepły. Nie marketingowy. Język obecnej strony jest dobry i autentyczny („Kreska po kresce wspinamy się na Górę Tabor”) – zachować, tylko uporządkować. „Sprzedażowość” tej strony to klarowność (cena, termin, miejsce, sposób zapisu widoczne od razu), nie ton.

---

## 2. Audyt obecnej strony

Stack: WordPress 7.1, darmowy motyw blogowy **Nisarg** (ok. 2015), wtyczka GDPR Cookie Compliance, galeria z cache’owanymi miniaturami. Domena z `www`, HTTPS działa, `http://` przekierowuje.

### 2.1 Problemy strukturalne

| Problem                              | Szczegół                                                                                                                                                                        | Skutek                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Brak strony głównej                  | `/` to lista wpisów „Aktualności”; brak hero, brak zdania „czym jesteśmy”, brak CTA                                                                                             | Nowy użytkownik nie wie, co Akademia oferuje i co ma zrobić        |
| Sidebar blogowy na każdej podstronie | „Ostatnie wpisy” + archiwum miesięczne 2012–2026                                                                                                                                | Szum wizualny, zawęża kolumnę treści, na mobile ląduje pod treścią |
| Nawigacja przeładowana               | 7 pozycji głównych, 22 podstrony; „Strona główna” ma własne podmenu (O nas, Pracownia, Aktualności→`/`, Blog→blogspot, Polityka prywatności); Kontakt w podmenu „Strona główna” | Brak hierarchii; użytkownik nie znajduje kontaktu                  |
| Duplikaty w nawigacji                | Ikony › Wystawy **i** Wydarzenia › Wystawy ikon; Wykłady › Tematy **i** wpisy z programem jako osobne posty — **rozwiązane K-50/K-90** (2026-09-21 / 08b): dział „Wydarzenia” zlikwidowany; wystawy w KŚT → `/ikony/wystawy` (wcześniej K-51 `/ikony/wystawa`)                                                                      | Niejasne, gdzie jest aktualna informacja                           |
| Brzydkie URL-e                       | Slug „O nas” to całe zdanie: `/strona-glowna/celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-...`                              | Nieudostępnialne, słabe SEO                                        |
| Blog poza domeną                     | studiumikony.blogspot.com; galeria „ikon na sprzedaż” tylko tam; zdjęcia w „O nas” hotlinkowane z blogspot                                                                      | Rozproszenie treści, ryzyko martwych obrazków                      |
| Social media                         | Sprawdzić, czy i gdzie strona linkuje do facebook.com/akademiaikony i YouTube @akademiaikony3822                                                                                | Docelowo: stopka + dane strukturalne (§5)                          |

### 2.2 Problemy treściowe

- **Nieaktualne / sprzeczne dane**: strona główna – zapisy do 24.09.**2026**; strona „Kurs roczny” – nagłówek „2025/2026”, zapisy do 24.09.**2025**. Treść musi być zarządzana w jednym miejscu (CMS: pole `seasonLabel`, `enrollmentDeadline`).
- **Kontakt rozproszony i niespójny**: `akademiaikony@gmail.com` (warsztaty, ogólny), `sekretariat.ikony22@gmail.com` (wykłady), tel. „601 734 705” raz, „601 734705” gdzie indziej. Strona Kontakt: mapa Google **nie jest osadzona** – widać surowy link `google.com/maps/embed?...`.
- **Brak zebranych faktów praktycznych**: cena, terminy, godziny, miejsce, jak się zapisać – rozsiane po akapitach. Potrzebna sekcja „W skrócie” na każdej stronie ofertowej.
- **Galeria**: 23 ikony Elżbiety + 29 ikon uczniów (stan WP 2026-09-19; wcześniej szacowane ~38 + ~28) w dwóch sekcjach; podpisy w formacie „Tytuł, 25x30 (cm)”, część bez podpisu, jedna z podpisem „opis”, literówki („Madylion”, „Mgdaleny”, „Advokata” vs „Advocata”, „Matyaszczak” vs „Matyaszczyk”). Brak filtrów autor/temat, brak strony pojedynczej ikony.
- **Literówki w treści**: „starcjonarne”, „kreatywnośći”, „zdecydowne”, „wkłady” (zam. wykłady), „Zgłoszenia przyjmujemy do 24 września 2025.” obok „2026”.
- **Testimoniale z pleneru** (Adam, Hania, Iza, Robert, Maciej, Artur, Emilia) – wartościowe, ale wklejone jako wypunktowanie z półpauzami; zasługują na własny komponent.
- Zdjęcia głównie z 2017–2021, jedno ze strony głównej z 2017 (`Chrystus212m_n.jpg`). Potrzebna nowa sesja (wspólna dla całego ekosystemu, §10.4) lub przynajmniej selekcja najlepszych ujęć w wysokiej rozdzielczości.

### 2.3 Problemy techniczne / UX

- Widoczny tekst „Toggle navigation” i „Skip to content” (motyw bez stylowania).
- Podwójny baner cookies (panel + ustawienia) – przy analityce bez ciasteczek (§7) wystarczy prosta informacja lub nic.
- Brak `meta description`, brak Open Graph → link udostępniony na Facebooku/WhatsApp wygląda pusto.
- Miniatury galerii przez wtyczkę cache (`/wp-content/uploads/cache/.../123456.jpg`) – migracja musi pobierać **oryginały** z `/wp-content/uploads/YYYY/MM/`.
- Brak wersji językowej – na start PL only, ale struktura ma to umożliwić.
- Brak jakiejkolwiek analityki – nie wiadomo, skąd przychodzą zapisy.

### 2.4 Co jest dobre i ma zostać

- Bogata, autentyczna treść: pełny program kursu trzyletniego (semestr po semestrze), 16 sezonów wykładów z nazwiskami i tytułami, opisy pleneru, testimoniale.
- Silna, konkretna tożsamość miejsca: kościół na Placu Teatralnym, „przestrzeń wolna od barier architektonicznych”.
- Jedna wyrazista osoba prowadząca – Elżbieta Jackowska-Kurek – z dorobkiem (polichromie, ikony w świątyniach w kraju i za granicą).
- Dobre fotografie ikon (do ponownego użycia po selekcji).

---

## 3. Inwentaryzacja obecnych treści (do migracji)

Ścieżki względem `https://www.akademiaikony.pl`.

| Obecna strona                                                                            | Typ w WP     | Docelowo                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` (Aktualności)                                                                        | lista postów | Nowa strona główna + `/aktualnosci`                                                                                                                                                                      |
| `/strona-glowna/celem-dzialalnosci-...` (O nas)                                          | page         | `/o-akademii`                                                                                                                                                                                            |
| `/strona-glowna/pracownia/`                                                              | page         | `/pracownia` (osobna strona tekstowa — obszerna treść ze starego WP)                                                                                                                                     |
| `/strona-glowna/kontakt/`                                                                | page         | `/kontakt`                                                                                                                                                                                               |
| `/strona-glowna/polityka-prywatnosci/`                                                   | page         | `/polityka-prywatnosci` (stopka)                                                                                                                                                                         |
| `/warsztaty/`                                                                            | page         | `/warsztaty` (hub sekcji)                                                                                                                                                                                |
| `/warsztaty/warsztaty-roczne/`                                                           | page         | `/warsztaty/kurs-roczny-i-trzyletni`                                                                                                                                                                     |
| `/warsztaty/warsztaty-wakacyjne/`                                                        | page         | `/warsztaty/letnia-szkola-swiatla`                                                                                                                                                                       |
| `/warsztaty/zapisy-na-warsztaty/`                                                        | page         | scalić w sekcję „Jak się zapisać” na stronach kursów                                                                                                                                                     |
| `/wyklady/`                                                                              | page         | `/wyklady` (hub + bieżący sezon)                                                                                                                                                                         |
| `/wyklady/tematy/`                                                                       | page         | `/wyklady` (bieżący) + `/wyklady/archiwum`                                                                                                                                                               |
| `/wyklady/wykladowcy/`                                                                   | page         | `/wyklady/wykladowcy`                                                                                                                                                                                    |
| `/wyklady/zapisy-na-wyklady/`                                                            | page         | scalić w `/wyklady#zapisy`                                                                                                                                                                               |
| posty `wyklady-YYYY-YYYY`, `ikona-korzenie-...`                                          | post         | kolekcja `LectureSeason` (15 rekordów)                                                                                                                                                                   |
| `/ikona/`, `/ikona/galeria/`                                                             | page         | `/ikony` (galeria z filtrami)                                                                                                                                                                            |
| `/ikona/wystawy/`, `/wernisaze/`                                                         | page         | `/ikony/wystawy` (K-90)                                                                                                                                                                                  |
| `/ikona/ikony-na-zamowienie/`                                                            | page         | `/ikony/na-zamowienie` – **pełna strona ofertowa w v1, treść wymienna** (§5, §10.2)                                                                                                                      |
| `/wydarzenia/`, `/wyjazdy-studyjne/`                                                     | page         | `/aktualnosci` (K-50)                                                                                                                                                                                    |
| `/oprowadzania-kuratorskie/`                                                             | page         | `/ikony/wystawy#oprowadzania` (K-90)                                                                                                                                                                     |
| `/poswiecenia-ikon/`                                                                     | page         | wpis `/aktualnosci/[slug]` (K-77; slug w migracji)                                                                                                                                                       |
| `/publikacje/`                                                                           | page         | `/publikacje`                                                                                                                                                                                            |
| `/publikacje/artykuly/`                                                                  | page         | `/publikacje#artykuly`                                                                                                                                                                                   |
| `/publikacje/multimedia/`                                                                | page         | `/publikacje`                                                                                                                                                                                            |
| `/publikacje/plakaty/`                                                                   | page         | `/aktualnosci`                                                                                                                                                                                           |
| posty 2012–2026 (ok. 60)                                                                 | post         | `News` – zmigrować, ale w UI pokazać tylko ostatnie; reszta w archiwum                                                                                                                                   |
| studiumikony.blogspot.com                                                                | zewn.        | link w stopce. **Bez importu listy „ikon na sprzedaż” w v1** – bez panelu CMS nikt nie zaktualizuje statusu „sprzedana”; kontakt w sprawie gotowych ikon załatwia jedno zdanie na `/ikony/na-zamowienie` |

Media: wszystkie oryginały w `/wp-content/uploads/YYYY/MM/`. Podpisy ikon są w atrybucie `title` obrazka i w `<figcaption>` – parsować oba.

---

## 4. Nowa architektura informacji

```
/                          strona główna
/o-akademii                historia, misja, Elżbieta Jackowska-Kurek, zespół, miejsce
/pracownia                 pracownia ikonograficzna (osobna strona tekstowa; treść ze starego WP)
/warsztaty                 hub: dwie ścieżki
/warsztaty/kurs-roczny-i-trzyletni
/warsztaty/letnia-szkola-swiatla
/wyklady                   hub: bieżący sezon + jak się zapisać
/wyklady/archiwum          15 sezonów archiwalnych, rozwijane (bieżący 2026/2027 — szesnasty)
/wyklady/wykladowcy
/ikony                     galeria: sekcje EJK → uczniowie, filtr tematu, lightbox
/ikony/na-zamowienie       strona ofertowa (treść wymienna po starcie strony autorskiej)
/ikony/wystawy             ekspozycja codzienna, wystawa doroczna, oprowadzania, archiwum lat, wyjazdowe (K-82…K-90)
/aktualnosci               lista z typem wpisu, w tym archiwum wystaw, oprowadzań, wyjazdów, plenerów (K-50, K-52)
/aktualnosci/[slug]
/publikacje                album Akademii, artykuły (K-76)
/publikacje/[slug]         album lub artykuł
/kontakt
/polityka-prywatnosci
```

**Menu główne (max 6 pozycji):** O Akademii · Warsztaty · Wykłady · Ikony · Aktualności · Kontakt.

> **K-50 (2026-09-21):** dział „Wydarzenia” zlikwidowany jako sekcja i pozycja menu — coroczna wystawa w kościele ma stronę `/ikony/wystawy` (K-90; wcześniej K-51 `/ikony/wystawa`); archiwum (2013–2020) do Aktualności jako wpisy z `kind` (K-52).

**Stopka:** adres, maile, telefon, Aktualności, Publikacje, Blog (zewn.), fundacja IKONA DZIŚ, Facebook, YouTube, polityka prywatności, **pełna mapa strony** (wszystkie podstrony drugiego poziomu pod nagłówkami sekcji).

Zasada: **Aktualności nie są stroną główną.** Strona główna prezentuje ofertę i to, co dzieje się teraz (jeden–dwa boksy „Najbliższe”), aktualności są osobno.

### 4.1 Wzorzec nawigacji drugiego poziomu

Struktura ma dwa poziomy; każda podstrona musi być osiągalna w maksymalnie dwóch kliknięciach z dowolnego miejsca. Nawigacja nie może polegać na dropdownach otwieranych na hover (odbiorca 65+, telefon). Trzy warstwy, wszystkie obowiązkowe:

1. **Strona sekcji jako hub.** Pozycja menu prowadzi zawsze na stronę sekcji (`/warsztaty`, `/wyklady`, `/ikony`). Główną treścią huba są duże, klikalne bloki podstron (np. `/warsztaty`: Kurs roczny i trzyletni / Letnia Szkoła Światła), a nie sam opis.
2. `SectionNav` – pozioma listwa nawigacji drugiego poziomu pod nagłówkiem strony, widoczna na każdej podstronie sekcji (np. w Wykładach: _Bieżący sezon · Archiwum · Wykładowcy_). Na mobile: zwykła lista linków pod nagłówkiem, nie ukryta.
3. **Stopka z pełną mapą strony** – nawigacja ratunkowa i sygnał dla SEO.
   Menu główne (desktop): płaska lista 6 linków — **bez dropdownu** w v1; drugi poziom wyłącznie przez `SectionNav`. W menu mobilnym sekcja rozwija się akordeonem, ale nagłówek sekcji też musi być linkiem do huba.

---

## 5. Wymagania funkcjonalne – wersja 1

### Musi być

- Strona główna: hero (obraz ikony + jedno zdanie o Akademii + dwa CTA: „Warsztaty” i „Wykłady”), sekcja „Najbliższe” (sterowana z CMS: nabór, wykład, wystawa), trzy filary, wybrane ikony, cytat/testimonial, prowadząca (zdjęcie, jedno zdanie, link do „O Akademii” – **nie** bohaterka strony głównej), miejsce (kościół, dostępność), kontakt.
- Strony ofertowe (kurs, plener, wykłady, **ikony na zamówienie**) z blokiem **„W skrócie”**: kiedy, gdzie, dla kogo, koszt, jak się zapisać, termin zgłoszeń – wszystko z pól CMS, nie z tekstu. Dla zamówień pola: co można zamówić, orientacyjny czas realizacji, jak przebiega proces, kontakt.
- Strona `/ikony/na-zamowienie` ma **treść wymienną**: w v1 pełna oferta (co, proces w 3 krokach: rozmowa → zaliczka → realizacja — makieta `#2a-zamowienie`, przykłady realizacji, kontakt). Po starcie strony autorskiej EJK zostaje z niej wstęp i wyraźne odesłanie (bez 301 – strona pozostaje wartościowa lokalnie). Body strony to jedno pole MDX, więc wymiana treści nie wymaga zmian w kodzie.
- Zapisy w v1: przyciski `mailto:` z gotowym, **ujednoliconym tematem** (`Zgłoszenie – kurs roczny 2026/2027`, `Zgłoszenie – Letnia Szkoła Światła 2027`, `Zgłoszenie – wykłady 2026/2027`, `Zapytanie – ikona na zamówienie`) i telefonem. Tematy pozwalają liczyć zgłoszenia w skrzynce bez żadnego systemu. Przygotować miejsce na formularz (v2).
- Nawigacja wg §4.1: huby sekcji, `SectionNav`, stopka z mapą strony.
- Program bieżącego sezonu wykładów jako lista wydarzeń (data, tytuł(y), prowadzący), archiwum jako rozwijane sezony.
- Galeria ikon: dwie sztywne sekcje (ikony Elżbiety Jackowskiej-Kurek → ikony uczniów), filtr **tematu** przez query string (`?temat=<slug-tagu>`), bez filtra autora; lightbox. W siatce — sam tytuł; w lightboxie — pełny autor, wymiary i technika. Lista nazwisk uczniów w sekcji uczniów, generowana z danych. Podgląd wyłącznie przez lightbox (bez `/ikony/[slug]` w v1). Zakres prac EJK po starcie strony autorskiej — D-02 (§10.5).
- Aktualności: jeden strumień wpisów bez paginacji (K-06, K-66), nawigacja po latach (K-70), pojedynczy wpis.
- Kontakt: adres, osadzona mapa, dwa maile z opisem czego dotyczą, telefon, info o zakrystii.
- Responsywność mobile-first, dostępność (WCAG AA: kontrast, fokus, alt), `prefers-reduced-motion`.
- Metadane SEO + Open Graph dla każdej strony, sitemap, przekierowania 301 ze starych URL-i (tabela w §3).
- **Dane strukturalne (JSON-LD):** `Organization` (Akademia, z `parentOrganization` → Fundacja), `Person` (Elżbieta Jackowska-Kurek) z `sameAs` → ikonadzis.org, Facebook, YouTube, w przyszłości strona autorska; `Event` dla wykładów bieżącego sezonu; `Course` dla kursu i pleneru.
- **Analityka bez ciasteczek od v1** (Plausible lub Umami) ze zdarzeniami na kliknięciach CTA zapisów (`mailto:`) i telefonu. Nie wymaga banera cookies.
- Informacja o cookies tylko jeśli pojawi się narzędzie, które ich wymaga (w v1 – nie).

### Poza zakresem v1

- Formularze zapisów z backendem, płatności, sklep z ikonami, wersja EN, konta użytkowników, wyszukiwarka, import listy ikon na sprzedaż.

### Panel CMS (etap 2, po uruchomieniu strony)

- Logowanie dla 2–3 osób nietechnicznych.
- Edycja: aktualności (w tym wpisy `kind: 'wystawa' | 'oprowadzanie' | 'wyjazd' | 'plener' | 'spotkanie'`, pole `venue` na wyjazdowych), wystawy KŚT (`PermanentExhibition` + `annual.json`), „Najbliższe” na stronie głównej, pola „W skrócie” (terminy, ceny), program sezonu wykładów, galeria (upload + podpis), treść strony zamówień. (K-50/K-53, K-82…K-90)
- Podgląd przed publikacją. Bez edycji layoutu.

---

## 6. Brief dla Claude Design

### Zadanie

Zaproponować **trzy odrębne kierunki wizualne** dla strony głównej i jednej strony ofertowej (Kurs roczny i trzyletni), potem rozwinąć wybrany kierunek na pozostałe szablony.

### Warunek wstępny

Kierunek wybieramy **po** domknięciu sesji 0b i decyzji E2.2 z master planu strony autorskiej (architektura marki: nazwa, domena, relacja do Akademii i Fundacji). Bez tego kierunek dla Akademii powstaje w próżni.

### Co musi wynikać z designu

- Od pierwszego ekranu widać: to instytucja o poważnym, duchowym charakterze, z dorobkiem; nie kurs hobbystyczny, nie sklep.
- Ikony są głównym materiałem wizualnym – design ma je eksponować, nie konkurować z nimi. Ikona ma złoto, ochrę, cynober, ciemne błękity – interfejs powinien być wobec tego neutralny lub czerpać z tego wprost, ale nie „udawać” ikony.
- Hierarchia: użytkownik w 5 sekund wie, że są warsztaty i wykłady i gdzie kliknąć.
- Dużo treści tekstowej (programy semestrów, archiwum) – typografia i rytm pionowy są ważniejsze niż efekty.
- Działa na telefonie osoby 65+: duże klikalne elementy, wysoki kontrast, brak ukrytej nawigacji poza hamburgerem.
- **Rozszerzalność na rodzinę trzech serwisów.** Wybrany kierunek jest bazą systemu dla Akademii, Fundacji (w przyszłości) i strony autorskiej EJK. Wspólne: typografia, ton, złoto jako akcent, zasady dostępności. Różne: temperatura i rola – Akademia spokojna i instytucjonalna, strona autorska bardziej premium i produktowa. Przy wybranym kierunku Claude Design ma pokazać **jeden ekran testowy** „jak wyglądałaby strona autorska w tej rodzinie” (np. karta ikony), zanim zacznie się kod.

### Trzy kierunki do zaproponowania (punkt wyjścia, Claude Design może zaproponować własne)

1. **Kontemplacyjny** – ciemne tło (nie czarne; głęboka umbra lub granat), ikony jak w ciemnym wnętrzu kościoła, oszczędne złoto jako akcent, serif o wyraźnym charakterze. Ryzyko: ciężkość, czytelność długich tekstów.
2. **Galeryjny** – jasne, chłodne tło, ikony na dużych planszach, dużo powietrza, jedna rodzina kroju z mocnym kontrastem wagi. Ryzyko: chłód, „muzealność” bez ciepła wspólnoty.
3. **Warsztatowy / materiałowy** – nawiązanie do materii ikony: drewno, kreda, lewkas, pigmenty; faktura i ciepłe neutralne tła, ilustracyjne detale procesu (kreska, złocenie). Ryzyko: kicz, jeśli faktura zdominuje.

### Reguły, których Claude Design ma się trzymać

- Nie używać: karuzeli w hero, „kart” z jednakowym cieniem na wszystko, numerowanych markerów tam, gdzie treść nie jest sekwencją, wszystkich-kapitalików jako etykiet nad każdym nagłówkiem, animacji wejścia na każdej sekcji, strzałek „→” w każdym linku, stockowych zdjęć ludzi.
- Jedna rodzina kroju lub dwie wyraźnie różne. Polskie znaki muszą być kompletne w wybranym kroju (sprawdzić: ąćęłńóśźż w kursywie i boldzie).
- Program kursu trzyletniego (6 semestrów) **jest** sekwencją – tam numeracja/oś czasu jest uzasadniona. Proces zamówienia ikony też.
- Prawdziwe treści z tego dokumentu i z obecnej strony, nie lorem ipsum.
- Przygotować stany: menu mobilne (z akordeonem sekcji), `SectionNav` desktop i mobile, lightbox galerii, blok „W skrócie”, sezon rozwinięty/zwinięty w archiwum, wpis aktualności, stopka z mapą strony.

### Szablony do zaprojektowania (po wyborze kierunku)

1. Strona główna
2. Strona ofertowa (jeden szablon, **cztery** warianty treści: kurs / plener / wykłady / ikony na zamówienie)
3. Hub sekcji (Warsztaty jako wzorzec; Wykłady łączy hub z bieżącym sezonem)
4. Wykłady – bieżący sezon + archiwum
5. Galeria ikon + lightbox
6. Strona tekstowa (O Akademii, wydarzenia, publikacje)
7. Lista i wpis aktualności
8. Kontakt
9. Nagłówek/stopka + menu mobilne + `SectionNav`

---

## 7. Decyzje techniczne

- **Frontend:** Next.js (App Router), TypeScript, React Server Components; stylowanie – Tailwind z tokenami z Claude Design jako zmienne w `globals.css`.
- **Stack jako decyzja ekosystemu.** Akademia rusza pierwsza, więc jej stack de facto rozstrzyga E5 z master planu strony autorskiej. Decyzję o CMS (własny vs Payload/Sanity) podjąć raz, dla obu serwisów, najpóźniej przed etapem 2 (panel). **Repo:** osobne (nie monorepo) — wspólne typy i tokeny dla przyszłej strony EJK trzymane jako pliki do skopiowania, nie jako workspace.
- **Treść:** własny CMS. W v1 – treść jako pliki (MDX/JSON w repo) generowane migracją z WP, żeby nie blokować startu. W v2 – baza (SQLite/Postgres) + panel admina, ten sam model danych.
- **Obrazy:** `next/image`, oryginały zmigrowane z WP do storage (na start `/public` lub object storage), automatyczne formaty WebP/AVIF.
- **Hosting:** dowolny obsługujący Next.js; przekierowania 301 w `next.config.ts`.
- **Zapisy:** `mailto:` w v1; v2 – route handler + e-mail (Resend/Nodemailer) + zapis zgłoszenia w CMS.
- **Analityka:** Plausible lub Umami (bez ciasteczek) od v1, zdarzenia: klik CTA zapisów, klik telefonu, klik `mailto:`. Brak banera cookies.
- **Język:** PL; wszystkie stringi UI w jednym module (`src/i18n/pl.ts`), żeby EN była możliwa – ekosystem docelowo PL+EN.

### Model treści (TypeScript, do użycia zarówno w plikach, jak i w bazie)

```ts
type Image = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type Page = {
  slug: string;
  title: string;
  lead?: string;
  body: string; // MDX
  hero?: Image;
  seo?: { description: string; ogImage?: string };
};

type OfferFacts = {
  // blok „W skrócie”
  seasonLabel?: string; // „2026/2027”
  when?: string; // „raz w tygodniu, październik–czerwiec”
  where?: string;
  audience?: string;
  price?: string; // „400 zł / rok”
  enrollmentDeadline?: string; // ISO
  enrollmentEmail: string;
  enrollmentPhone?: string;
  enrollmentSubject: string; // ujednolicony temat mailto
  firstMeeting?: string; // ISO
  enrollmentOpen: boolean;
  leadTime?: string; // zamówienia: orientacyjny czas realizacji
};

type Offer = Page & {
  kind: "kurs" | "plener" | "wyklady" | "zamowienie";
  facts: OfferFacts;
  testimonials?: Testimonial[];
};

type Lecturer = {
  slug: string;
  name: string;
  titles?: string;
  affiliation?: string;
  bio?: string;
  photo?: Image;
};

type Lecture = {
  date: string;
  title: string;
  lecturerSlugs: string[];
  note?: string;
};

type LectureSeason = {
  slug: string;
  label: string; // „2026/2027”
  cycleTitle: string; // „Ikona – korzenie i owoce wiary. Mistyka dziś”
  intro?: string;
  lectures: Lecture[];
  gallery?: Image[];
};

// Podzbiór przyszłego `Product` ze strony autorskiej – te same nazwy pól,
// żeby współdzielenie lub przeniesienie danych było mechaniczne.
type IconWork = {
  slug: string;
  title: string; // „Chrystus Pantokrator”
  author: "ejk" | "student";
  authorName: string;
  technique?: string; // „tempera jajowa na desce, złocenie”
  size?: { w: number; h: number };
  image: Image;
  tags?: string[];
};

// K-50/K-53 (2026-09-21): typ `Event` usunięty. „Wydarzenia” to teraz wpisy
// Aktualności z `kind`; wystawy w KŚT — `PermanentExhibition` + `AnnualExhibition` niżej (K-82…K-90).
type NewsKind =
  | "aktualnosc"
  | "wyklady"
  | "warsztaty"
  | "plener"
  | "wystawa"
  | "oprowadzanie"
  | "wyjazd"
  | "spotkanie";

type News = {
  slug: string;
  title: string;
  date: string;
  dateEnd?: string;
  kind: NewsKind;
  excerpt?: string;
  body: string;
  cover?: Image;
  images?: Image[];
  poster?: Image;
  venue?: string; // wystawy wyjazdowe (K-87)
};

// K-82…K-90 (08b): trzy formy wystawy w KŚT; strona `/ikony/wystawy`. Szczegóły: `docs/archive/plans/08b-review-fixes.md`.
type PermanentExhibition = {
  title: string;
  lead: string;
  iconCount: { from: number; to: number };
  interiorPhotos: Image[];
  sample?: boolean;
};

type AnnualExhibition = {
  seasonSlug: string;
  title: string;
  vernissage?: string;
  dateEnd?: string;
  iconCount?: number;
  summary?: string;
  photos?: Image[];
  newsSlug?: string;
};

type Testimonial = { quote: string; author: string; role?: string };

type SiteSettings = {
  orgName: string;
  place: string;
  address: string;
  emails: { label: string; address: string; contactName?: string }[];
  phone: string;
  mapEmbedUrl: string;
  blogUrl: string;
  ecosystem: {
    foundationUrl: string;
    personalSiteUrl?: string; // uzupełnić po starcie strony autorskiej
    social: { facebook: string; youtube: string };
  };
  upcoming: { title: string; text: string; href: string }[]; // „Najbliższe” na stronie głównej
};
```

---

## 8. Plan migracji z WordPressa

1. Sprawdzić `https://www.akademiaikony.pl/wp-json/wp/v2/pages?per_page=100` i `/posts`. Jeśli 200 – migracja przez REST (pola: `slug`, `title.rendered`, `content.rendered`, `date`, `link`, `parent`). Jeśli 401/404 – eksport WXR z panelu WP (Narzędzia → Eksport) i parsowanie XML.
2. Pobrać media: z `content.rendered` wyciągnąć `<a href="…/uploads/YYYY/MM/x.jpg"><img title="…">` – link `href` to oryginał, `title`/`figcaption` to podpis. Ignorować `/uploads/cache/`.
3. HTML → MDX (np. `turndown` + ręczna korekta); rozbić posty „wyklady-YYYY-YYYY” regexem na `Lecture[]` (wzorzec: `DD.MM` + linie `**Tytuł,** Prowadzący`).
4. Podpisy galerii → `IconWork`: regex `^(.+?),\s*(\d+)x(\d+)\s*\(cm\)$`, wariant z „pisany/pisana ręką X” → `author: 'student'`, `authorName: X`.
5. Wygenerować tabelę przekierowań stare→nowe URL-e (§3) i zapisać w `next.config.ts`.
6. Ręczna korekta: literówki (§2.2), ujednolicenie telefonu i maili, uzupełnienie brakujących podpisów, aktualizacja dat na 2026/2027.
   Szacunkowo do ręcznej korekty: ~10 stron statycznych, 16 sezonów wykładów (parsowanie automatyczne, korekta nazwisk), ~52 podpisy ikon. Reszta (60 aktualności) – migracja bez korekty. Blogspot: nie migrować.

---

## 9. Fakty stałe (źródło prawdy dla treści)

- Nazwa: AKADEMIA IKONY – Studium Ikonograficzne św. Andrzeja Apostoła. Założona 2010, w KŚT od 2012.
- Miejsce: Kościół Środowisk Twórczych pw. św. Andrzeja Apostoła i św. Brata Alberta Chmielowskiego, Plac Teatralny, Warszawa. Rektor: ks. Grzegorz Michalczyk. Przestrzeń bez barier architektonicznych.
- Mapa Google (embed, `SiteSettings.mapEmbedUrl`): `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2442.9544621239593!2d21.00606051625467!3d52.24421077976289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471eccf307a4ec4f%3A0x8f7c429c0465b439!2zS2_Fm2Npw7PFgiBwdy4gxZt3LiBCcmF0YSBBbGJlcnRhIGkgxZt3LiBBbmRyemVqYSBBcG9zdG_FgmE!5e0!3m2!1spl!2spl!4v1506790619997` (kościół pw. św. Brata Alberta i św. Andrzeja Apostoła — ze strony kontaktowej WP).
- Organizator: fundacja IKONA DZIŚ, [www.ikonadzis.org](http://www.ikonadzis.org).
- Kontakt ogólny / warsztaty / ikony: [akademiaikony@gmail.com](mailto:akademiaikony@gmail.com), tel. 601 734 705 (Elżbieta Jackowska-Kurek).
- Wykłady / sekretariat: [sekretariat.ikony22@gmail.com](mailto:sekretariat.ikony22@gmail.com) (Maurycy Lubak).
- Blog: studiumikony.blogspot.com. Facebook: facebook.com/akademiaikony. YouTube: @akademiaikony3822.
- Warsztaty 2026/2027: zgłoszenia do 24.09.2026 mailem; rozmowa wstępna ok. 30 min; pierwsze spotkanie 6.10.2026, 18:00; zajęcia raz w tygodniu, październik–czerwiec, grupy wieczorne i dzienne; materiały na miejscu.
- Wykłady 2026/2027: „Ikona – korzenie i owoce wiary. Mistyka dziś”; wybrane wtorki 18:00–20:30; 400 zł/rok; zapisy od września 2026; terminy: 06.10, 10.11, 08.12, 19.01, 16.02, 09.03, 13.04, 11.05, 08.06, 11.06, 12.06 (wernisaż, AGAPA).
- Letnia Szkoła Światła: plenery tygodniowe sierpień/wrzesień; nabór na 2027 rusza w marcu 2027, kolejność zgłoszeń.
- Ikony na zamówienie: kontakt [akademiaikony@gmail.com](mailto:akademiaikony@gmail.com) / 601 734 705; szczegóły procesu i czas realizacji – do potwierdzenia z EJK.
- Album jubileuszowy (K-76): tytuł **„IKONA DZIŚ. AKADEMIA IKONY 2010–2025”** (zapis do potwierdzenia). Wydawca: Fundacja IKONA DZIŚ, rok **2025**. **132** strony, **23 × 23 cm**, **140 zł**. Dostępny; wysyłka pocztą; sprzedaż na wykładach w KŚT. ISBN: **do podania**. Zamówienie: `mailto:` na [sekretariat.ikony22@gmail.com](mailto:sekretariat.ikony22@gmail.com), temat `Zamówienie – album „Ikona dziś. Akademia Ikony 2010–2025”` (do potwierdzenia).
- Uwaga prawna (pełne zdanie, wielka litera): „Nauczanie w Akademii Ikony nie niesie za sobą żadnych skutków formalnych.”

---

## 10. Miejsce w ekosystemie

Strona Akademii jest jednym z trzech serwisów skupionych wokół Elżbiety Jackowskiej-Kurek. Szczegóły w `ekosystem-ejk.md` (do założenia po sesji 0b); tu tylko to, co wpływa na tę stronę.

### 10.1 Podział ról

| Serwis              | Rola                                                                                                          | Status                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| akademiaikony.pl    | Instytucja edukacyjna: warsztaty, wykłady, plenery, dorobek wspólnoty. Strona sprzedażowa oferty edukacyjnej. | odświeżenie – ten brief                         |
| ikonadzis.org       | Fundacja: misja, organizator, wartości                                                                        | bez zmian; w przyszłości dopasowanie do systemu |
| strona autorska EJK | Osoba i sprzedaż: portfolio, unikaty, ikony na zamówienie, PL+EN                                              | w planowaniu (`ikony-ejk-master-plan.md`)       |

### 10.2 Zasada „jedna strona kanoniczna, druga odsyła”

Każdy typ treści ma jednego właściciela w danym momencie; pozostałe serwisy linkują, nie kopiują. Właściciel może się zmienić w czasie – wtedy poprzednia strona kurczy się do odsyłacza, ale nie znika.

| Treść                                                            | Właściciel teraz                  | Właściciel po starcie strony autorskiej                              |
| ---------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------- |
| Warsztaty, wykłady, plenery, zapisy                              | Akademia                          | Akademia                                                             |
| Aktualności Akademii (w tym wystawy, oprowadzania, wyjazdy, plenery); wystawa roczna w dziale Ikony | Akademia                          | Akademia                                                             |
| Ikony na zamówienie – pełna oferta i proces                      | Akademia (`/ikony/na-zamowienie`) | strona autorska; na Akademii wstęp + odesłanie                       |
| Portfolio EJK (pełny katalog)                                    | Akademia (galeria)                | strona autorska; na Akademii wybór prac „prowadzącej”                |
| Album jubileuszowy i teksty z albumu                             | Akademia                          | Akademia                                                             |
| Artykuły EJK z mediów                                            | Akademia                          | do decyzji (D-06)                                                    |
| Prace uczniów                                                    | Akademia                          | Akademia                                                             |
| Bio EJK                                                          | Akademia (`/o-akademii`)          | strona autorska (kanoniczne, pełne); Akademia – wersja krótka + link |
| Misja, fundacja, sprawozdania                                    | Fundacja                          | Fundacja                                                             |

### 10.3 Lejki w obie strony

- Akademia → strona autorska: `/ikony/na-zamowienie` (po starcie), podpisy prac EJK w galerii, sekcja „prowadząca”.
- Strona autorska → Akademia: CTA „Naucz się pisać ikony” → `/warsztaty`; „Wykłady o ikonie” → `/wyklady`. Zapisać jako wymaganie w E3/E4 master planu, żeby strona autorska nie była jednokierunkowym odbiorcą ruchu.
- Fundacja → obie.
- Warstwa niewidoczna: `sameAs` w danych strukturalnych na wszystkich trzech serwisach (§5).

### 10.4 Wspólne zasoby

- **Jedna sesja zdjęciowa** dla całego ekosystemu, ze wspólną listą ujęć: ikony w wysokiej rozdzielczości (wszystkie serwisy), detale procesu (strona autorska), wnętrze kościoła i pracowni (Akademia), portret EJK (wszystkie). Zastępuje osobne sesje z §2.2 i E6.1 master planu.
- Jeden zestaw tokenów designu i typów treści (§7).
- Wspólny rejestr decyzji w `ekosystem-ejk.md`.

### 10.5 Decyzje otwarte wpływające na ten brief

| #    | Decyzja                                                                                                       | Kiedy                                       |
| ---- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| D-01 | Architektura marki: nazwa i domena strony autorskiej, relacja do Akademii i Fundacji                          | sesja 0b, przed wyborem kierunku wizualnego |
| D-02 | Zakres prac EJK w galerii Akademii po starcie strony autorskiej                                               | sesja 0b                                    |
| D-03 | CMS dla obu serwisów (własny / Payload / Sanity)                                                              | przed etapem 2 (panel)                      |
| D-04 | Monorepo vs osobne repozytoria ze współdzielonymi plikami                                                     | **Osobne repozytoria**; typy/tokeny przez kopiowanie plików (jak `brief-claude-code.md` §2) |
| D-05 | Czy ikony na zamówienie oferowane z opcją poświęcenia (wpływa na treść `/ikony/na-zamowienie`)                | sesja 0c                                    |
| D-06 | Właściciel artykułów EJK z mediów po starcie strony autorskiej (Akademia i nauczanie → Akademia; własna twórczość → strona autorska kanoniczna; teksty z albumu zawsze na Akademii) | razem z D-01/D-02 (sesja 0b) |

### 10.6 Kolejność prac

1. Sesje 0b–0d master planu, decyzje D-01, D-02, D-05 (1–2 spotkania).
2. Aktualizacja tego briefu (v2.x) i master planu; założenie `ekosystem-ejk.md`.
3. Claude Design: trzy kierunki dla Akademii + ekran testowy strony autorskiej przy wybranym kierunku.
4. Implementacja Akademii (`docs/plan-claude-code.md`, etapy 1–11). Równolegle: E1–E3 master planu – research nie blokuje kodu.
5. Design i implementacja strony autorskiej z tego samego systemu i repo.
6. Po starcie strony autorskiej: wymiana treści `/ikony/na-zamowienie`, aktualizacja `ecosystem.personalSiteUrl`, `sameAs`, galerii (D-02).

---

## Dziennik zmian

| Data       | Wersja | Zmiana                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09    | 1.0    | Pierwsza wersja: audyt, inwentaryzacja, architektura, wymagania v1, brief dla Claude Design, decyzje techniczne, migracja, fakty stałe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-09-06 | 2.0    | §1: strona jako pełnoprawna strona sprzedażowa oferty edukacyjnej. §2: social media, brak analityki. §3: `/ikony/na-zamowienie` jako pełna strona ofertowa z treścią wymienną; bez importu ikon na sprzedaż z blogspota. §4.1: wzorzec nawigacji drugiego poziomu (huby, `SectionNav`, mapa strony w stopce, dropdown tylko na klik). §5: ujednolicone tematy `mailto:`, dane strukturalne z `sameAs`, analityka bez ciasteczek od v1, prowadząca na stronie głównej bez dominacji. §6: warunek wstępny (sesja 0b), rozszerzalność na rodzinę serwisów + ekran testowy, czwarty wariant strony ofertowej, hub sekcji jako szablon. §7: stack jako decyzja ekosystemu, monorepo, `SiteSettings.ecosystem`, `IconWork` bez `forSale`, z `technique`, `OfferFacts.enrollmentSubject`. §9: FB, YT, kontakt ws. zamówień. §10 nowy: ekosystem, macierz własności treści, lejki, wspólne zasoby, decyzje otwarte, kolejność prac. |
| 2026-09-21 | 2.1    | *(Model wystawy z tego wpisu zastąpiony w 2.3 / etapie 08b — K-82…K-102, `/ikony/wystawy`, `annual.json`; poniżej zapis historyczny.)* Likwidacja działu „Wydarzenia” (K-50…K-58, patrz `plan-claude-code.md` §4). Menu główne: Aktualności zamiast Wydarzenia. Wystawa „Ikona – korzenie i owoce wiary” → własna strona `/ikony/wystawa` (K-51): stała w kościele, zestaw ikon zmienia się co roku (wernisaż ok. 17.06), nowy typ `ExhibitionEdition`. Archiwum dawnych wydarzeń (wystawy poza KŚT, oprowadzania, wyjazdy, plenery, spotkania) → Aktualności jako wpisy z `kind`; typ `Event` usunięty, `News` rozszerzony (`kind`, `dateEnd`, `images`, `poster`). Poświęcenia ikon → artykuł w Publikacji (K-55, zgoda EJK na przeniesienie i redakcję) — **zastąpione w 2.2 przez K-77** (wpis Aktualności). Wyjazdy studyjne: brak nowych, copy w czasie teraźniejszym zostaje (K-56); dawne wyjazdy → Aktualności. Historia plenerów → nowa sekcja „Gdzie byliśmy” na `/warsztaty/letnia-szkola-swiatla` (K-57). Zasady migracji archiwum WP zapisane w §3/§8 (patrz `plan-aktualizacji-dokumentow-wydarzenia.md` §5). Nowe otwarte pytania do EJK: rok początkowy edycji wystawy, materiały z wernisaży 2018–2025, obieg materiałów po wernisażu, status Gródka jako pleneru LSŚ, zgoda R. Rumina na komentarz. |
| 2026-09-22 | 2.2    | Publikacje (K-76…K-78, D-06): `/publikacje` = album jubileuszowy + artykuły, bez zakładek; typy `Publication`/`Article`; brak katalogu 2020 i materiałów medialnych o Akademii; poświęcenie → Aktualności `kind: 'plener'` (K-77); plakaty → `News.poster` / `ExhibitionEdition.poster` (K-78). Szczegóły: `docs/archive/plan-aktualizacji-dokumentow-publikacje.md`. |
| 2026-09-26 | 2.3    | Wystawy po przeglądzie 08b (K-82…K-90): trasa `/ikony/wystawy`, model `PermanentExhibition` + `AnnualExhibition` (`annual.json`), `News.venue` na wyjazdowe; przekierowania §3 na nowy adres; K-51 pozostaje w historii decyzji. Implementacja: `docs/archive/plans/08b-review-fixes.md`. **Etap 8 implementacji zamknięty** (08 + 08b) — `docs/plan-claude-code.md` §2. |
