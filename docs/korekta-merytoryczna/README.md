# Korekta merytoryczna przed etapem 9

Listy do uzupełnienia przez właściciela repo + EJK (K-08 / §5 planu).
Wypełniacie **tylko kolumny PISANE WIELKIMI LITERAMI** — pozostałe to stan obecny, do porównania.
Kolumny zostawione puste = „bez zmian”. Nie usuwajcie wierszy ani nie zmieniajcie kolumny `slug`
(to klucz, po którym wczytam poprawki do `content/`).

Format: CSV, separator **średnik**, kodowanie UTF-8 z BOM — otwiera się poprawnie w Excelu
i w Arkuszach Google (Plik → Importuj) bez kombinowania z polskimi znakami.

## `galeria-ikony.csv` — 52 prace

Kolumna `zdjecie_url_WP` to bezpośredni link do zdjęcia na starej stronie — otwórzcie go,
żeby zobaczyć, o którą ikonę chodzi. Wiersze **oznaczone w kolumnie `do_poprawy` są na górze**
(18 pozycji), reszta to weryfikacja przeglądowa.

Co blokuje etap 9:

| Ile | Co | Kolumna do wypełnienia |
| --- | --- | --- |
| 5 | prace bez wymiarów — UI pokazuje „Wymiary: do weryfikacji”, liczb nie wyświetla | `WYMIARY_cm` |
| 10 | prace uczniów bez nazwiska — UI pokazuje „Praca z warsztatów Akademii” | `AUTOR_POPRAWIONY` |
| 1 | `do-uzupelnienia-tytul-ikony` — tytuł tymczasowy „Trójca Święta”, do potwierdzenia ze zdjęciem; **zmiana tytułu pociągnie zmianę sluga i adresu** | `TYTUL_POPRAWIONY` + `UWAGI` |
| 4 | artefakty importu WP: `NIE OPŁAKUJ MNIE MATKO` (CAPS), `Święty Albert  Chmielowski` (podwójna spacja), `Madonna Advocata` i `Matka Boża Advokata` (dwie pisownie tego samego wezwania — ujednolicić) | `TYTUL_POPRAWIONY` |
| 47 | pozostałe wymiary — przepisane z podpisów WP, nie weryfikowane | `WYMIARY_cm` tylko gdy błędne |

Osobno, poza CSV, potrzebne są dwie zgody:

- **publikacja nazwisk uczniów** w galerii (lista + lightbox) — potwierdzenie właściciela;
- **technika**: dziś wszystkie prace mają domyślne „tempera jajowa na desce lipowej”. Jeśli
  dla którejś jest inaczej, wpiszcie w `TECHNIKA_jesli_inna`. Jeśli sama domyślna jest zła —
  napiszcie to raz w `UWAGI` pierwszego wiersza, zmienię globalnie.

## `wykladowcy.csv` — 17 osób

Nazwiska, tytuły i afiliacje pochodzą z WP i nie były weryfikowane. **2 osoby nie mają bio** —
tych tekstów nie napiszę za Was (zakaz generowania treści za klienta), więc albo dostarczacie
bio, albo decydujemy, że karta zostaje bez opisu.

## Czego tu jeszcze nie ma

Pozycje z §5 planu, które zależą od migracji WP i pojawią się dopiero po etapie 9:
podpisy ikon w relacjach Aktualności, weryfikacja ~20 plakatów (wydarzenie + rok),
zgoda R. Rumina na komentarz przy ikonie Serca Jezusa, korekta zdania o Trójcy Świętej,
ISBN i spis treści albumu.

Gdy oddacie pliki, wczytuję poprawki po `slug` i raportuję, co się zmieniło.
