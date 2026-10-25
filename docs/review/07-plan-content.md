# 10/R — C1: zgodność z planem (brief §3–§8, decyzje K-xx)

Data: 2026-10-25 · Punkt odniesienia: `feat/10-finishing` @ `41861ef` (= staging po merge PR #25) · Zakres: trasy, nawigacja, przekierowania, CTA/`mailto:`, fakty §8. Review zbiera zgłoszenia, niczego nie poprawia. C2 (merytoryka copy) — osobna sekcja poniżej, jeszcze nie zrobiona.

## Zgodne (bez uwag)

- Wszystkie trasy z briefu §3 istnieją w `src/app/`; `/ikony/[slug]` oznaczone w briefie „opcjonalnie w v1" — nie powstało (zgodne), `/ikony/wystawa` ma 301 → `/ikony/wystawy` (`src/config/redirects.json`); plik trasy martwy z R0 już usunięty.
- Brak `/wydarzenia` (K-50): 301 → `/aktualnosci`, `/wyjazdy-studyjne` → `/aktualnosci`.
- `/ikony/na-zamowienie` i `/ikona/ikony-na-zamowienie` → `/ikony` (K-151).
- Redirecty: 109 wpisów, walidowane przy buildzie (źródła unikalne, brak łańcuchów). Pokrywają wszystkie wiersze tabeli §5 poza C1-03.
- Fakty §8 zgodne: nazwa, maile (`akademiaikony@gmail.com`, `sekretariat.ikony22@gmail.com`), telefon `601 734 705` → `tel:+48601734705`, blog, Facebook, YouTube, fundacja `ikonadzis.org`.
- Tematy `mailto:` zgodne dosłownie: kurs, LSŚ, wykłady, „Zapytanie – kursy doskonalące i konsultacje", album.
- `FactsBox`: wszystkie trzy oferty mają `enrollmentOpen: false` (po 24.09 — poprawnie), terminy kursu i wykładów zgodne z §8.

## Zgłoszenia

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **C1-01** | niespójność | `src/i18n/pl.ts:136-167` vs brief §7 | Brief (2026-10-08) wymaga etykiety „Powiadom mnie o **naborze**" i tematów `Powiadomienie o naborze – kurs roczny` / `… – Letnia Szkoła Światła`. Kod ma „Powiadom mnie o **zapisach**" i `Powiadomienie o zapisach – …`; wykłady mają trzeci wariant (`Powiadomienie o zapisach – wykłady`), którego brief nie zna (tam: „Zapytaj o miejsce mailem"). | Rozstrzygnąć, co obowiązuje: dostosować kod do briefu albo brief do kodu (decyzja właściciela — to string `mailto:` z §7 „nie parafrazować"). | S |
| **C1-02** | niespójność | `content/settings.json:4` vs brief §8, stopka | Adres: `settings.json` = „ul. Senatorska 18B", brief §8 i stopka = „Plac Teatralny" (rozbieżność znana z 8-checkpointu, nierozstrzygnięta). Wchodzi do `Organization` JSON-LD w k9. | Potwierdzić z EJK poprawny adres przed k9; ujednolicić w jednym polu. | S |
| **C1-03** | drobiazg | brief §5 vs `redirects.json` | Brief wymienia pliki `docs/redirects.json` (kroki 6 i skrypt migracji); realnie `src/config/redirects.json`. Nie ma też wiersza `/ikona/` ani `/ikona/galeria/` z końcowym `/` — działa przez normalizację Next, ale nie jest testowane. | Poprawić ścieżkę w briefie; test 301 skryptem w etapie 11 (i tak w DoD). | S |
| **C1-04** | ryzyko | brief §3 / `docs/plan-claude-code.md` DoD etapu 10 | Brief §6 wymaga JSON-LD, OG, sitemap, analityki „od v1" — nic z tego nie ma (k9). 12/19 tras ma domyślny `<title>` (R3). Nie bug, ale blokuje wdrożenie. **Aktualizacja:** 16 z 17 tras `page.tsx` ma już `metadata`/`generateMetadata` (brak tylko `/`); OG, JSON-LD, sitemap, robots i analityka nadal nie istnieją. | k9. | L |
| **C1-05** | niespójność | brief §6 „Kontakt" vs `ContactPage` | Brief opisuje m.in. „blok Akademia w sieci w `OnlineAside`" i wejście od zakrystii — zgodne; ale brief §3 nadal wymienia `MapBlock` jako komponent (§7), a mapa Google została usunięta 2026-10-17. | Potwierdzone: komponentu `MapBlock` nie ma w `src/` (tylko wzmianka w `tokens.css`). Usunąć z listy nazw w §7 briefu i z komentarza w tokenach. | S |
| **C1-06** | do potwierdzenia | brief §6 Aktualności vs kod | Brief: „bez filtrów kategorii", jedna lista z nawigacją po latach — zgodne. Wyróżniony wpis `nowy-rok-w-akademii-2026-2027` ma `featured: true` zgodnie z K-73 (max 1) — OK; wymaga ręcznego zdjęcia flagi po sezonie. | Brak działań; wpis do listy kontrolnej etapu 11/runbook. | S |

## Niezweryfikowane w C1 (wymagają oglądu na stagingu / właściciela)

- Zgodność `SectionNav` per sekcja z briefem §3 w menu mobilnym i stopce (8b zmienił model — mobilne menu odwzorowuje stopkę, brief mówi „akordeon per sekcja" — zgodne co do sensu).
- Liczba i terminy wykładów w `content/lectures/2026-2027.json` vs §8 (11 terminów) — do policzenia w C2 razem z copy.
- Poprawność `getEnrollmentState` w dniu zmiany stanu (K-144) — logika sprawdzona w R1; dziś wszystko poprawnie „zamknięte".

## Decyzje właściciela (2026-10-25)

- **C1-01 ✅** — obowiązuje „zapisy" (kod bez zmian); brief poprawiony: §3 pola `enrollment*`, §6 `FactsBox`, §7 tematy `mailto:` (`Powiadomienie o zapisach – kurs roczny / Letnia Szkoła Światła / wykłady`), §8 LSŚ. Słowo „nabór" usunięte z briefu; zostaje tylko w historycznych wpisach `docs/plan-claude-code.md` (K-10, dziennik).
- **C1-02 ✅** — adres: **ul. Senatorska 18B, Warszawa**. `content/settings.json` bez zmian; brief §8 poprawiony (było: Plac Teatralny). Historyczne wpisy Aktualności z „Plac Teatralny 20" nie są ruszane.

## Wniosek C1

Funkcjonalnie serwis spełnia brief §3–§6 poza elementami k9 (SEO/JSON-LD/analityka). Do decyzji właściciela przed k9: **C1-01** (nazewnictwo „nabór/zapisy" w `mailto:`) i **C1-02** (adres w `settings.json`).

---

# C2 — merytoryka treści

Data: 2026-10-25 · Zakres: fakty §8 vs `content/` i `pl.ts`, terminologia, placeholdery. Treści nie zmieniam (K-122); ostateczna decyzja — właściciel i EJK.

## Zgodne

- Wykłady 2026/2027: 11 terminów dokładnie jak w §8 (06.10, 10.11, 08.12, 19.01, 16.02, 09.03, 13.04, 11.05, 08.06, 11.06, 12.06 = wernisaż, agapa); cena „400 zł / rok"; tytuł cyklu „Ikona – korzenie i owoce wiary. Mistyka dziś".
- Uwaga prawna z §8 dosłownie w `pl.ts:40` i w FAQ `/warsztaty`.
- Pusty slug `""` w ostatnim wykładzie (12.06) jest obsługiwany świadomie (`lectures.ts` filtruje) — nie błąd.
- Terminologia „album": w UI, `pl.ts` i `content/publications` brak „książka"/„katalog".
- Rektor, miejsce, kontakty, organizator — zgodne z §8.

## Zgłoszenia

| ID | Waga | Miejsce | Opis | Propozycja | Koszt |
| --- | --- | --- | --- | --- | --- |
| **C2-01** | niespójność | brief §8 vs `content/publications/ikona-dzis.mdx:6-12` | Dane albumu: brief = **132 s., 23 × 23 cm, ISBN „do podania", tytuł wielkimi literami z kropką**; treść = **178 s., 22 × 21 cm, ISBN 978-83-978648-0-1**, tytuł „Ikona dziś. Akademia Ikony 2010–2025" (cena 140 zł zgodna). Brief przestarzały względem treści (zakładam, że treść jest nowsza i prawidłowa). | Potwierdzić z EJK liczby (strony, format, ISBN) i zaktualizować brief §8 oraz zapis tytułu na „zapis potwierdzony". Wejdzie do JSON-LD `Book` (k9). | S |
| **C2-02** | drobiazg | `content/news/wernisaz-albumu-ikona-dzis.mdx:112` | „Album to **katalog** ikon…" — brief §7: nie używać „katalog". | Zmienić na „zbiór"/„zestawienie" (propozycja Claude, wymaga OK — K-122). | S |
| **C2-03** | niespójność | `content/publications/ikona-dzis.mdx` (7× `alt`) | `alt` rozkładówek 2–7 i 9: „[rozkładówka N — do uzupełnienia]" — trafia do publicznego HTML. Złamanie reguły „alt obowiązkowy" (treściowo). | Opisy do napisania (po zobaczeniu rozkładówek); propozycja Claude → OK. | M |
| **C2-04** | drobiazg | `content/offers/wyklady.mdx:19-21` | Martwa treść „## [do uzupełnienia: treść szablonu wykładów] / publiczna trasa powstanie w etapie 4" — nie renderowana (strona nie używa `Content`), ale to pozostałość po szkielecie. | Usunąć treść pliku (zostawić frontmatter). | S |
| **C2-05** | ryzyko | `content/exhibition/page.mdx:77`, `src/i18n/pl.ts:218,225` | Placeholdery „[do uzupełnienia…]" jako fallbacki (termin wernisażu, tytuł cyklu, afiliacja) — wyświetlą się publicznie, gdy brakuje danych; dziś dane są, więc nie widać. | Zostawić jako zabezpieczenie albo zamienić na brak sekcji (decyzja). | S |
| **C2-06** | do potwierdzenia | brief §8 „Wykłady… zapisy do końca września 2026" | Zapisy już zamknięte, a strona w `FactsBox` pokazuje „do końca września 2026" jako termin przeszły — spójne z `enrollmentOpen: false`, ale tekst „Zapisy… do końca września" w intro/FAQ warto sprawdzić pod kątem czasu przeszłego. | Przegląd copy `/wyklady` przez EJK. | S |

## Decyzje właściciela (2026-10-25)

- **C2-01 ✅** — wartości z treści potwierdzone (178 s., 22 × 21 cm, ISBN 978-83-978648-0-1, tytuł „Ikona dziś. Akademia Ikony 2010–2025"); brief §3 (przykład formatu), §7 i §8 zaktualizowane.
- **C2-02 ✅** — decyzja właściciela: „Album to katalog ikon…" zostaje (wyjątek od reguły „album, nie katalog"); wyjątek zapisany w briefie §7.
- **C2-04 ✅** — usunięta martwa treść z `content/offers/wyklady.mdx`.
- **C2-03 ✅** — 7 `alt` rozkładówek albumu (2–7, 9) napisanych na podstawie obejrzanych rozkładówek; w publicznym HTML nie ma już „[do uzupełnienia]".
- **C2-05 ✅** — fallbacki „[do uzupełnienia…]" zostają jako zabezpieczenie (dane są kompletne).
- **C2-06 ✅** — sprawdzone: jedyne „do końca września 2026" to wiersz terminu w `FactsBox` przy zamkniętych zapisach — OK, bez zmian.
- **C1–C2 zamknięte 2026-10-25.**

## Wniosek C2

Treść jest spójna z §8 w częściach kluczowych (terminy, ceny, kontakty, uwaga prawna). Główne otwarte: **C2-01** (liczby albumu — brief kontra treść), **C2-03** (7 placeholderów `alt` w publicznym HTML). Pozostałe to drobiazgi.
