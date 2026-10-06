# Review 10/R — RF-13a: decyzja o skali odstępów sekcji i belce

Data: 2026-10-05 · gałąź `feat/10-review`, HEAD `f87f1ee` · sesja doradcza (RV-9), archiwum dozwolone (RV-6 dotyczyło R1–R4)  
Wejście: V1 §3–§6, V2 §4–§8, V3 §4–§5, `design/README` §3 i „Karty i kafle”, `README-o-akademii-pracownia` pkt 7, archiwum (K-27, K-29, K-99).  
Decyzję podejmuje właściciel (RV-6). Kod produkcyjny bez zmian; przełącznik tylko wstrzykiwany lokalnie.

---

## 1. Kryteria oceny (spisane przed oglądaniem zrzutów)

| # | Kryterium | Jak sprawdzam | Próg „dobrze” |
| --- | --- | --- | --- |
| K1 | **Rytm** — strona ma powtarzalny krok między sekcjami i wyraźną hierarchię odstępów | odstęp sekcji vs odstęp „nagłówek → treść” (10–26) vs akapity (14–20) | ≤ 2 wartości odstępu sekcji na stronę i szerokość; każdy szczebel ≥ ok. 1,5× niższego |
| K2 | **Czytelność granic sekcji** bez linii — widać, gdzie kończy się temat | zrzuty: czy granica sekcji odróżnia się od przerw wewnątrz sekcji (bloki 26–34, karty, siatki) | odstęp sekcji ≥ ok. 2× największej przerwy wewnątrz sekcji |
| K3 | **Długość stron** — odbiorca 65+ przewija; puste pola wydłużają drogę do treści | `scrollHeight` 4 tras × wariant | mobile: ≤ +5 % względem dziś; desktop: bez pustych ekranów (viewport bez treści) |
| K4 | **Zgodność z makietą i skalą** | `design/README` §3 (56–64 / 30–34, siatka 4…56), `README-o-akademii-pracownia` pkt 7 (96 / 60), K-29 | wartość z siatki tokenów; odstępstwo od makiety nazwane i uzasadnione |
| K5 | **Mobile (390)** — kolumna 335 px, gęstszy tekst, krótszy ekran | zrzuty 390 | granica sekcji czytelna (≥ ok. 1,3× przerw wewnętrznych 20–26), odstęp ≤ ok. 1/12 wysokości ekranu (≈ 70 px) |
| K6 | **Szerokie okna** (argument K-29: 426 px powietrza po bokach przy 1920) | zrzuty 1440, proporcja odstępu do marginesów | sekcje nie „sklejają się” przy szerokich marginesach; nie rozpadają się na wyspy |
| K7 | **Odporność na puste pasy** (V3 §5) — odstęp dolicza się do pustki z nierównych kolumn i podpisów | miejsca z V3-06, V1-02, V1-03 na trasach testowych | największa przerwa na stronie = najważniejsza granica, nie przypadek układu |

## 2. Skąd 96 px — archiwum i historia

Źródła: `git log -S "--section-gap"`, `8bdf59a`, `docs/archive/plans/04b-review-fixes.md`, `06-o-akademii.md`, `08b-review-fixes.md`, `plan-claude-code-historia.md` §4H.

| Data | Zdarzenie | Odstęp / belka |
| --- | --- | --- |
| etap 1, `0ffebf0` | szkielet tokenów z `design/README` | `--section-gap` **60** / mobile **32** (oba w zakresie §3, ale poza siatką 4…56) |
| 2026-09-19, `8bdf59a` (04b, **K-29**) | review stagingu: „przy 1920 px po bokach 426 px powietrza, a między sekcjami 34–60 px”; skala kończy się na 56 (52 i 56 to „ten sam krok”) | dodane `--space-10/11/12` (80/96/120); **`--section-gap` 96 od 1024**, mobile bez zmian; zasada linii: nagłówek, stopka, maks. jedna cezura na stronę |
| 2026-09-19 (04b, **K-27** pkt 3) | ujednolicenie belek | **„belka 2 px wszędzie”** — `FactsBox` zszedł z 3 na 2 px |
| 2026-09-19 (04b, **K-30**) | `--content-max` 1280 od 1600 | zmniejsza pustkę po bokach — argument K-29 słabnie |
| etap 6 (`da2877e`, makieta 6a/6b) | makieta `/o-akademii` · `/pracownia` powstała **po** K-29 i przepisała jego wartości (`README-o-akademii-pracownia` pkt 7: 96 / 60) | kod wdrożył 96 desktop, ale **mobile 32, nie 60** (makieta 6b: `padding: 60px 20px`) — rozjazd nigdy nie zgłoszony |
| 2026-09-25 (08b, **K-99**) | wystawy: „krecha 3 px = blok wyróżniony (informacja albo akcja), jeden na sekcję” | **3 px** dla faktów i CTA wystaw; potem publikacje też 3 px |

Wnioski:

1. **96 px to decyzja K-29, nie makieta bazowa.** Powód był konkretny (okno 1920, `content-max` 1180, sekcje 34–60) i częściowo zniknął po K-30. Makieta 6a nie jest niezależnym źródłem — powtarza K-29.
2. **K-29 nigdy nie objął całego serwisu.** Dotyczył tylko miejsc z tokenem `--section-gap` (strony tekstowe, `/ikony`, siatka opinii). Oferty (`mt-space-8` = 52), `/` (`py-space-8`), wystawy (64), publikacje (34) zostały przy swoich wartościach — stąd trzy skupiska z V1.
3. **Belka ma dwie sprzeczne decyzje:** K-27 (2 px wszędzie, 04b) i K-99 (3 px z nadanym znaczeniem, 08b — późniejsza). `design/README` mówi 3 px, makieta 6a — 2 px dla `MilestoneRow`. Dziś: 2 px w 7 komponentach, 3 px w 4.
4. **Przeoczone:** (a) mobile 60 z makiety 6b nie wdrożony (kod 32) — nikt tego nie zgłosił, a pomiar V1 pokazuje, że 30–34 na mobile działa; (b) K-29 dodał regułę linii (nagłówek, stopka, maks. jedna cezura) — V3 §5 pkt 2 pokazuje, że reguła się rozjechała (`/ikony/wystawy`, kurs, `/`); (c) wewnętrzne odstępy `/o-akademii` są skrojone pod 96 (siatka deklaracji 48 px, makieta 6a ma `gap: 56px` w blokach) — przy mniejszym odstępie sekcji trzeba je zmniejszyć, inaczej granica sekcji ginie (§4, K2).

## 3. Przełącznik i zrzuty

**Przełącznik** — wstrzykiwany CSS, `src/` bez zmian (nic do usuwania w repo): `.visual/rf13a/gap-switch.css` (atrybut `<html data-gap>`), skrypty `shots.mjs`, `compare.mjs`, `live-snippet.js` (wklejany w konsolę — przyciski now / tight / 56 / 64 / 96 w rogu ekranu). Wszystko w `.visual/` (poza repo).

| Wariant | Desktop | Mobile | Źródło |
| --- | --- | --- | --- |
| `now` | dziś: 52–56 / 96 / 64 / 34 (zależnie od szablonu) | 30–34, oferty 52 | staging |
| `tight` | 34 | 26 | dolna granica: tyle mają dziś publikacje i listy |
| `56` | 56 | 34 | `design/README` §3 dół zakresu, propozycja V1 §6.1 |
| `64` | 64 | 34 | `design/README` §3 góra zakresu |
| `96` | 96 | 60 | K-29 + makieta 6a/6b |

Każdy wariant: jeden próg 768 (znika stopień 60 px przy 768–1023); obejmuje `--section-gap`, oferty (`mt-space-8` sekcji i H2 MDX), sekcje `/` (`py`, cytat, dół hero). Nie obejmuje poprawek układu (podpis galerii V1-02, `pb` siatki opinii V1-11) — to RF-13 niezależnie od wartości.

**Zrzuty:** `.visual/rf13a/shots/<trasa>-<szer>-<wariant>.png` (36 pełnych stron), zestawienia `.visual/rf13a/cmp-*.png`.

Wysokość strony (`scrollHeight`, px; w nawiasie zmiana względem `now`):

| Trasa | 1440 now | tight | 56 | 64 | 96 | 390 now | tight | 56 | 96 (60) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 2912 | 2778 (−4,6 %) | 2932 (+0,7 %) | 2988 (+2,6 %) | 3212 (+10,3 %) | 5796 | 5712 | 5760 (−0,6 %) | 5916 (+2,1 %) |
| `/o-akademii` | 5308 | 4874 (−8,2 %) | 5028 (−5,3 %) | 5084 (−4,2 %) | 5308 (0) | 8802 | 8760 | 8816 (+0,2 %) | 8998 (+2,2 %) |
| LSŚ | 3713 | 3571 (−3,8 %) | 3641 (−1,9 %) | 3673 (−1,1 %) | 3801 (+2,4 %) | 7220 | 7144 | 7168 (−0,7 %) | 7272 (+0,7 %) |
| `/ikony` | 7302 | 7178 | 7222 (−1,1 %) | 7238 | 7302 (0) | 24169 | 24157 | 24173 | 24225 |

## 4. Ocena wariantów

Obserwacje ze zrzutów (1440 i 390):

- **`/`** — dzisiejsze 52 ≈ wariant 56; strona wygląda tak samo. Przy 96 pas cytatu rozdyma się do ok. 300 px między włosami, a „Najbliższe” odjeżdża od hero — sekcje rozpadają się na wyspy.
- **`/o-akademii`** — jedyna trasa, na której 96 „pasuje”, bo wnętrze sekcji jest luźne (siatka deklaracji 48 px, kolumna H2 280 px). Przy 56 granica „Czemu służymy” → „Dla kogo jesteśmy” jest tylko o ok. 8 px większa niż przerwa między rzędami deklaracji — czytelna dzięki kolumnie H2, ale nie dzięki odstępowi. Przy `tight` granica ginie.
- **LSŚ** — sekcje są krótkie (1–2 akapity). 56 / 64 dają równy rytm i kończą „dziurę” przed „Głosami z pleneru” (V1-03 — największa przerwa przestaje być przypadkowa). 96 rozciąga każdą krótką sekcję w osobną wyspę.
- **`/ikony`** — zajawka zamówień ma złoty włos u góry, więc granica jest czytelna przy każdym wariancie; przy 56 nadal widać dodatkowe ~34 px z podpisu galerii (V1-02 — do poprawki w RF-13, niezależnie).
- **390** — `now` (32) i `56` (34) praktycznie nieodróżnialne. `tight` (26) = przerwy wewnątrz sekcji (akapity 20, deklaracje 26) → granica ginie (K2/K5 ✗). 60 z makiety 6b czytelne, ale +2 % długości na stronach tekstowych bez zysku na ofertach.

| Kryterium | tight 34/26 | **56/34** | 64/34 | 96/60 |
| --- | --- | --- | --- | --- |
| K1 rytm | ✓ | ✓ | ✓ | ✓ (ale tylko jeśli wszystko 96) |
| K2 granice | ✗ (`/o-akademii`, 390) | ✓ pod warunkiem zmniejszenia wewnętrznych 48 → 34 na `/o-akademii` | ✓ (ten sam warunek, margines większy) | ✓ |
| K3 długość | ✓ najkrótsze | ✓ (−5 % … +1 %) | ✓ | ✗ `/` +10 % desktop; mobile +2 % |
| K4 makieta / skala | ✗ poniżej §3 | ✓ §3 i siatka tokenów (`--space-9`) | ✓ §3, ale **64 nie ma w siatce** (nowy token) | ✗ §3; ✓ 6a/6b i K-29 |
| K5 mobile | ✗ | ✓ | ✓ | ~ (dłużej, czytelnie) |
| K6 szerokie okna | ✗ | ✓ (przy `content-max` 1280, K-30) | ✓ | ✓ |
| K7 puste pasy | ✓ | ✓ najmniej wzmacnia V3-06 | ✓ | ✗ dodaje się do pustek (kurs: 96 + 207 px) |

## 5. Rekomendacja

| Parametr | Rekomendacja | Odrzucone |
| --- | --- | --- |
| `--section-gap` desktop | **56 px** (`--space-9`) | 64 — poza siatką tokenów, różnica wobec 56 ledwo widoczna; 96 — wyspy na krótkich sekcjach, +10 % `/`, sprzeczne z `design/README` §3; `tight` — granice giną |
| `--section-gap` mobile | **34 px** (`--space-7`) | 32 (dziś) — poza siatką; 60 (makieta 6b) — dłużej bez zysku |
| Próg | **jeden: 768** | 1024 (dziś dla `--section-gap`) — trzeci stopień bez uzasadnienia |
| Wariant „ciasny” | **34 / 26** (`--space-7` / `--space-6`) — podsekcje jednego tematu, „lead → pierwsza sekcja”, polityka, kontakt | 26 / 20 — zlewa się z akapitami |
| „Nagłówek sekcji → treść” (V2-14) | **20 / 14** (`--space-5` / `--space-4`) jednym tokenem | 26 / 18 (`/pracownia`) — za blisko odstępu „ciasnego” |
| Wnętrze sekcji `/o-akademii` | siatka deklaracji 48 → **34** (warunek K2 przy 56) | zostawić 48 — granica sekcji ≈ przerwa wewnętrzna |
| Dół strony | **26 z powłoki**; ostatnia sekcja bez własnego `pb`; pas zamykający z tłem dochodzi do stopki (dół 0) | `pb` per komponent (dziś 26 / 63 / 82 / 122) |
| Puste pasy (V3 §5) | odstęp liczony od niższej krawędzi wyższej kolumny; nierówności kolumn poprawiać układem (V3-06, V1-02), nie odstępem | kompensowanie mniejszym odstępem per strona |
| Linie | reguła K-29 utrzymana: złoty włos tylko nagłówek, stopka i maks. jedna cezura na stronę (pas / cytat); poza tym sam odstęp | — |
| `--accent-bar` | **3 px wszędzie** (jeden token; także `MilestoneRow`) — `design/README` „Karty i kafle” + późniejsza K-99 | 2 px wszędzie (K-27, mniej zmian: 4 vs 7 miejsc) — sprzeczne z README; dwie role 3 / 2 — różnicy 1 px odbiorca nie odczyta jako znaczenia |

Uzasadnienie w jednym zdaniu: 56 / 34 to wartość, przy której większość serwisu (oferty, `/`, wystawy) już dziś wygląda dobrze, jest w siatce tokenów i w makiecie bazowej; jedyna strona skrojona pod 96 (`/o-akademii`) wymaga jednej korekty wnętrza, a nie odwrotnie — podnoszenia całego serwisu do 96.

**Ocena na żywo:** właściciel — `live-snippet.js` w konsoli na lokalnym `next dev`, przewijanie tras testowych przy 390 / 1440. Zrzuty pierwszej rundy (`shots/`, `cmp-*.png`) zostały na dysku; zestawienia drugiej rundy w §5.1.

### 5.1 Druga runda przełącznika (pytanie 2–3)

Po decyzji o 56 / 34 przełącznik zastąpiono wariantami pytania 2 (wszystkie na bazie 56 / 34): A — ciasny 34 / 26 + nagłówek 20 / 14; B — ciasny 34 / 26, nagłówek per szablon; C — bez ciasnego, nagłówek 20 / 14; D — ciasny 26 / 20, nagłówek 14 / 10; potem E / F — A z odstępem 80 / 96 na parze `/o-akademii` · `/pracownia` (desktop). Trasy: polityka, `/aktualnosci`, `/wyklady`, `/pracownia`, LSŚ (390 / 1440), `/o-akademii` · `/pracownia` (1440). Zrzuty `.visual/rf13a/q2/`, zestawienia `.visual/rf13a/q2-cmp-*.png`. Wysokość 1440: `/o-akademii` now 5308 / A 5014 / E 5196 / F 5308; `/pracownia` 6384 / 6216 / 6312 / 6376.

## 6. Decyzja właściciela (2026-10-05)

| # | Pytanie | Decyzja | Odrzucone |
| --- | --- | --- | --- |
| 1 | Odstęp sekcji | **56 / 34**, jeden próg 768 (rekomendacja) | 64 / 34, 96 / 60, dwa poziomy 96 / 56 |
| 2 | Ciasny i nagłówek → treść | **ciasny 34 / 26, nagłówek → treść 20 / 14** (wariant A) — **z wyjątkiem dla O Akademii: na desktopie więcej przestrzeni, bliżej dzisiejszego** | B (nagłówek per szablon), C (bez ciasnego), D (26 / 20 i 14 / 10) |
| 3 | Wyjątek O Akademii | **80 px desktop (`--space-10`) dla pary `/o-akademii` · `/pracownia`** (K-48), mobile 34; wnętrze `/o-akademii` zostaje 48 (bez korekty 48 → 34 z pyt. 1) | 96 dla obu (dziś), 80 lub 96 tylko dla `/o-akademii` |
| 4 | Dół strony | **26 px z powłoki**; ostatnia sekcja bez własnego `pb`; pas zamykający z tłem dochodzi do stopki (dół 0) | dół = odstęp sekcji; pasy też 26; bez zmian |
| 5 | Belka | **`--accent-bar` 3 px wszędzie** (jeden token, także `MilestoneRow`, deklaracje, lewa kreska cytatu) | 2 px wszędzie (K-27), dwie role 3 / 2, odłożenie do V4 |

Skala odstępów sekcji po decyzji — **trzy role, jeden próg 768:**

| Token | Desktop (≥ 768) | Mobile | Gdzie |
| --- | --- | --- | --- |
| `--section-gap` | 56 (`--space-9`) | 34 (`--space-7`) | wszystkie sekcje najwyższego poziomu |
| `--section-gap-loose` | 80 (`--space-10`) | 34 | tylko para `/o-akademii` · `/pracownia` |
| `--section-gap-tight` | 34 (`--space-7`) | 26 (`--space-6`) | „lead → pierwsza sekcja”, podsekcje jednego tematu, polityka, kontakt |
| `--heading-gap` (nagłówek sekcji → treść) | 20 (`--space-5`) | 14 (`--space-4`) | wszystkie H2 sekcji |
| dół strony | 26 (powłoka) / 0 (pas z tłem) | j.w. | — |
| `--accent-bar` | 3 px | 3 px | wszystkie złote belki paneli i lewe kreski |

Uwaga: wyjątek 80 px to świadome odstępstwo od `design/README` §3 (56–64), uzasadnione luźnym wnętrzem stron skrojonych pod makietę 6a. Makieta 6a / 6b (96 / 60) i K-29 (96 od 1024) przestają obowiązywać w części odstępu sekcji.

**Brama powrotna:** po V4 sprawdzić, czy założenia trzymają (RV-9); jeśli nie — otworzyć przed RF-13.

### 6.1 Propozycja reguły do `CLAUDE.md` (do wpisania przez właściciela)

> - Odstępy sekcji tylko z trzech tokenów: `--section-gap` (56 / 34), `--section-gap-tight` (34 / 26), `--section-gap-loose` (80 / 34, wyłącznie `/o-akademii` · `/pracownia`); nagłówek sekcji → treść `--heading-gap` (20 / 14); jeden próg 768. Komponent nie dodaje własnego `pb` / `mb` na końcu sekcji ani strony — dół strony daje powłoka (26), pas z tłem dochodzi do stopki. Złota belka wyłącznie `--accent-bar` (3 px). Nowa wartość odstępu = decyzja właściciela, nie nowy token komponentu.

### 6.2 Przełącznik

Usunięty po decyzji (`.visual/rf13a/gap-switch.css`, `live-snippet.js`). `src/` nie był zmieniany. Zrzuty i skrypty `shots.mjs` / `compare.mjs` zostają w `.visual/rf13a/` (poza repo) jako materiał porównawczy dla RF-13.
