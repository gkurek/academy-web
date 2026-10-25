# Przegląd spójności UX/UI — desktop (2026-10-19)

Status: **analiza + częściowe poprawki, do omówienia w nowej sesji.** Nie jest to zatwierdzony plan kawałków — punkty „do zrobienia” wymagają decyzji przed implementacją.

## Metoda

- Strona produkcyjna `academy-web-lovat.vercel.app`, viewport 1440×900; poprawki weryfikowane lokalnie (1440 i 390).
- Strony: główna, Warsztaty, Kurs roczny i trzyletni, Letnia Szkoła Światła, Wystawy, Wykłady, O Akademii, Kontakt; dla porównania Galeria i Aktualności.
- Pomiar skryptem: wszystkie `border-top/bottom` i pseudo-elementy `rule-*` (pozycja, szerokość, kolor), przyciski (wymiary, tło, obrys, font), nagłówki, odstęp ostatniej treści (z krawędzią kart) od linii stopki.

## Mocne strony

- Spójny szkielet: kontener 1068px, lewa krawędź x=179, H1 EB Garamond 48px, header + SectionNav + stopka identyczne.
- Ramka „W skrócie” (Kurs, LSŚ, Wykłady) — najmocniejszy wzorzec: 400px, złota belka 3px, ta sama struktura i CTA.
- Tabele/listy na cienkich liniach (program wykładów, rytm dnia, aktualności) — czytelne, dobrze skanowalne.
- Typografia (Garamond + Plex) i paleta powściągliwe, kontrast OK, długość wiersza prozy ~65–75 znaków.

## 1. Linie przez całą długość — inwentarz i reguła

| Typ | Gdzie |
|---|---|
| 100vw (`rule-gold-*`, `rule-neutral-t`) | spód headera, góra stopki (złota), stopka prawna (neutralna); w treści tylko Testimonial na stronie głównej |
| szerokość kontenera między sekcjami | Wystawy „Oprowadzania”, Galeria nad „Ikony uczniów” — **usunięte** (patrz „Zrobione”) |
| szerokość kontenera w listach (złote) | Wykłady program, LSŚ rytm dnia, Aktualności — wiersze to kafelki z tłem `surface-tile` |
| szerokość kolumny w listach (neutralne) | Kontakt, O Akademii aktywności, nawigacja kotwic na Wystawach — wiersze na tle strony |
| pas tła bez linii | O Akademii „Pracownia i miejsce” |

**Przyjęta reguła (3 poziomy):**
1. **Rama strony** — 100vw tylko header i stopka + stały odstęp przed stopką. Wyjątek: Testimonial na stronie głównej (świadomy akcent).
2. **Sekcja** — samo światło, bez linii.
3. **Wiersze list** — linia w szerokości kolumny/kontenera; złota między kafelkami z tłem, neutralna między wierszami na tle strony. Stan obecny już jest z nią zgodny (wcześniejsza uwaga o „niespójnym kolorze” była błędna).

## Zrobione (niezacommitowane, lint + build OK)

- Stały odstęp przed stopką: `main` → `pb-section-gap-loose` (80px desktop / 34px mobile; wcześniej 26px) — `SectionPageShell.tsx`, `FeaturedIcons.tsx`.
- Galeria: od `lg` ostatni rząd bez dolnego paddingu podpisu (dokładał 34px) — `JustifiedGrid.tsx`.
- Usunięte linie sekcyjne: Wystawy „Oprowadzania” (`exhibition.css`), Galeria nad „Ikony uczniów” (`GalleryIconGrid.tsx`).
- Proponowany commit: `chore: unify page-end spacing, drop section rules on exhibitions and gallery`.

Pozostałe wyjątki (świadomie zostawione): O Akademii — pas tła ma własny padding 96px i styka się ze stopką; Kontakt — karta wejścia 93px (wiersze kontaktu 80px); Galeria mobile — ostatni rząd +20px.

## Rozwiązane: błąd Aktualności (lokalnie, 2026-10-19)

`/aktualnosci` w dev chwilowo zwracał 500 (`content/pages/o-akademii.mdx:10:11 Could not parse expression with acorn`) — dev serwer złapał pośrednią wersję `o-akademii.mdx` w trakcie edycji treści O Akademii. Po zapisaniu pełnej wersji pliku Aktualności i O Akademii renderują się bez błędów (desktop i mobile), lint i build przechodzą. Bez zmian w kodzie.

## Do zrobienia — do decyzji

3. **Przyciski**
   - Jedna wysokość i font: „Powiadom mnie o zapisach” 60px/16.5px vs reszta 64px/17.5px.
   - Reguła szerokości: w karcie/ramce pełna szerokość, w treści szerokość tekstu.
   - Wystawy: ~~dwa złote przyciski główne ~300px od siebie~~ — przycisk „Zapytaj o oprowadzanie” usunięty 2026-10-25; został jeden złoty („Napisz do nas”, wyjazdowe).
   - Galeria: aktywny filtr wygląda jak przycisk główny (złote wypełnienie) — zamienić na złoty obrys lub podkreślenie.
   - Linki: trzy style (złoty z podkreśleniem z ramki / złoty bez podkreślenia „Czytaj dalej” / szary `underline` w podpisie zdjęcia) — zrównać dwa pierwsze.
4. **Etykieta nad H1 i akcenty kart**
   - Etykieta: Kurs/LSŚ/Wykłady — Garamond 16.5px złota; Wystawy — Plex 14.5px wersaliki, szara. Wybrać jeden styl.
   - Akcent kart: belka 3px u góry (karty informacyjne) vs lewa 3px (Kontakt „Wejście od strony zakrystii”, cytat O Akademii) vs krótka kreska (O Akademii). Propozycja: góra dla kart informacyjnych, lewa tylko dla cytatów.
5. **Zakończenie stron i nawigacja**
   - Stały wzorzec końca strony: oferty (Kurs, LSŚ, Wykłady) → blok CTA; strony informacyjne → „Zobacz też”. Dziś każda kończy się inaczej.
   - Aktualności bez SectionNav → H1 84px wyżej niż na innych stronach (y110 vs 194); dodać podnawigację albo stały odstęp.

Pozostałe obserwacje (niższy priorytet):
- O Akademii: nagłówek z boku tylko tu, a i tu „Prowadząca Akademię” i „Pracownia i miejsce” wracają do nagłówka nad treścią.
- Wystawy: ramka „W skrócie” 360px (nie 400) i skacze lewa/prawa.
- Opinie: dwie formy (pas wyśrodkowany na głównej vs karty na warsztatach) — spisać jako decyzję.
- H2 „Najbliższe” na głównej 21px vs standard 34px.
- Kontakt powtarza dane ze stopki tuż nad nią — rozważyć ukrycie kolumny kontaktowej stopki na `/kontakt`.
- ~~Placeholdery „[zdjęcie: …]” (Warsztaty, Kurs, LSŚ, Wystawy) — największa słabość wizualna, sprawa treści.~~ ✅ 2026-10-24/25 — zdjęcia podmienione, placeholdery usunięte z kodu (`10-photo-library-curation.md`).
