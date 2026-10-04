# Prompt do Claude Design — wpis Aktualności, runda 2.1 (korekta K3)

Status: **gotowy do wysłania** 2026-10-03 · zamawia: właściciel · ocena wyniku: nowa sesja wg `docs/plans/10-k3-news.md`.
Załączyć do rozmowy z Claude Design: `design/Akademia Ikony - Wpis Aktualności v2.dc.html`, `design/WpisAktualnosci2.dc.html`, `design/README-wpis-aktualnosci-v2.md`, `design/README.md` (tokeny systemu), zrzut ekranu 1a z zaznaczoną podwójną linią.

---

## Prompt (do skopiowania)

Akademia Ikony — szablon wpisu `/aktualnosci/[slug]`, **runda 2.1: korekta kierunku K3**.

### 1. Ocena rundy 2

Przyjmujemy **K3** (tekst 600 px na osi logo + prawa kolumna, kadr wizytówki) jako bazę. Siatka, tokeny `--entry-*`, galeria pod tekstem na pełną szerokość pola, H1 przez całe pole — zostają. K2 odrzucony, zgodnie z Twoją rekomendacją.

Dwa problemy zostają:

- **Najgorszy przypadek (1a)** — 2 zdania, 0 zdjęć, brak faktów. W prawej kolumnie jest tylko „Powiązane” i jeden link, czyli ok. 400 px prawie pustej kolumny. Takich wpisów jest w archiwum najwięcej (np. 2020–2024 to wyłącznie takie ogłoszenia).
- **Długi tekst (2c, Wilno)** — kadr i „Powiązane” kończą się na pierwszym ekranie. Obok dalszych ok. 1000 px tekstu zostaje pusta szyna.

Poprawki niżej dotyczą **wyłącznie desktopu (≥ 1024 px)**. **Mobile 390 i tablet 768–1023 zostają dokładnie jak dziś** (stan wdrożony: jedna kolumna, kolejność tekst → galeria, nawigacja na dole). Nie projektuj ich od nowa. Pokaż je tylko jako potwierdzenie, że nic się nie zmieniło.

### 2. Korekty

**K-a — nawigacja w prawej kolumnie (desktop).**
Blok „Poprzedni wpis / Następny wpis / Wszystkie aktualności” na desktopie przechodzi z dolnego pasa (`end`) do prawej kolumny, pod „Powiązane”. Kolejność w kolumnie: kadr wizytówki (jeśli są zdjęcia) → karta faktów z CTA (jeśli są) → „Powiązane” → nawigacja.

- To **ten sam element DOM**, przeniesiony innym obszarem siatki (grid areas). Bez duplikatu i bez JS. Poniżej 1024 px element wraca na dół, jak dziś.
- Zaprojektuj nawigację w szerokości kolumny: 264 px przy 1024, 400 px przy 1440, 480 px przy 1920. Pokaż dwa wiersze jeden pod drugim (poprzedni, następny), z tytułami do ok. 80 znaków.
- Dolny pas `end` na desktopie znika. Jeśli coś ma zostać na samym dole (patrz K-c), opisz to.

**K-b — sticky dolnej części kolumny (desktop).**
Część „Powiązane + nawigacja” ma `position: sticky` (bez JS), offset jako nazwany token. Kadr wizytówki i karta faktów przewijają się normalnie.

- Pokaż Wilno 1440 w trzech pozycjach przewinięcia: góra strony, środek tekstu, koniec tekstu.
- Sticky kończy się razem z obszarem tekstu (`main` / `mgal`), nie nachodzi na galerię pełnej szerokości ani na stopkę.
- Jeśli blok jest wyższy niż okno (np. 1024 × 700), zachowanie ma być bezpieczne. Opisz regułę, np. sticky tylko od wysokości okna X.

**K-c — koniec długiej galerii.**
W układzie `galeria` / `wydarzenie` siatka zdjęć idzie pod tekstem przez całe pole, a więc poniżej końca prawej kolumny. Po 46 zdjęciach (3c, „Pokaż wszystkie (46)”) czytelnik nie ma dalszej drogi, bo nawigacja została u góry w kolumnie. Zaproponuj rozwiązanie i uzasadnij je. Np.: minimalny link „Wszystkie aktualności” pod galerią albo sticky sięgający także obok galerii (wtedy galeria nie na pełną szerokość). **Nie dubluj** całego bloku poprzedni/następny.

**K-d — nagłówek wpisu (desktop).**
Dziś breadcrumb „Aktualności › 2013” i zaraz pod nim meta „Wykłady · data” to dwie drobne linie tego samego kalibru jedna pod drugą. Rok pada dwa razy, a całość czyta się jak jeden pogubiony blok metadanych. Zmiana:

- Breadcrumb: tylko „Aktualności”, bez roku. Komponent `Breadcrumb` bez zmian stylu.
- Nad H1: tylko etykieta rodzaju (złota, jak dziś).
- Pod H1: data (i `dateEnd`) · miejsce, jako podpis tytułu. Lead pod nim, jak dziś.
- Odstępy jako nazwane tokeny.
- Mobile: pokaż obok siebie 390 obecny i 390 z nowym nagłówkiem — **tylko do porównania**. Domyślnie mobile zostaje bez zmian; decyzję podejmie właściciel.

**K-e — podwójna linia w prawej kolumnie (błąd, 1a).**
`aside` „Powiązane” ma zawsze `border-top`. Kiedy jest pierwszym elementem kolumny (brak kadru i faktów), powstaje druga linia 40 px pod linią nagłówka. Na zrzucie wygląda jak błąd. Reguła: pierwszy element prawej kolumny **nie ma** linii górnej, bo linia nagłówka wystarcza. Linie oddzielają tylko kolejne bloki wewnątrz kolumny. Ustal też, czy nawigację od „Powiązanych” oddziela linia, czy sam odstęp.

**K-f — bez plakatów (błąd w naszym prompcie v2).**
W prompcie rundy 2 napisaliśmy, że pierwsze zdjęcie Wilna i Nocy Świątyń to plakat. To nieprawda — to zwykłe zdjęcia. **Plakatów w archiwum jest kilka i nie projektujemy pod nie**: pole `News.poster` zostało usunięte z modelu, a nieliczne plakaty to zwykłe obrazy `images[]` (w siatce kadrowane do kwadratu jak każde zdjęcie, w całości w lightboxie). Zmiana:

- Usuń flagę `poster` / rodzaj `plakat` z komponentu i z danych makiety. Proporcje z prawdziwych plików: Wilno, zdjęcie 1 = 400 × 590 (pion), Noc Świątyń, zdjęcie 1 = 960 × 540 (16:9). Inne wpisy — przyjmij zdjęcia poziome 3:2.
- Kadr wizytówki zostaje jako „pierwsze zdjęcie w proporcji źródła”, ale pokaż go na tych proporcjach: poziome (400 × 225 przy 1440) i pionowe. Oceń, czy kadr poziomy w kolumnie 400 px wciąż ma sens, i opisz regułę dla obu przypadków (np. maks. wysokość `--entry-card-max-h`).
- Z README usuń uzasadnienia oparte na plakacie (§1 „Plakat 1:1,41 przy 400 px…”, §6 p. 2 „czy pierwsze zdjęcie to plakat”).

### 3. Bez zmian (nie ruszaj)

Typografia prose (E1), reguły galerii D8, karta faktów (wygląd FactsBox), kadr wizytówki, tokeny siatki z README v2 §2, model danych (bez nowych pól), zakazy: 13 px, `#8d7d69`, zaokrąglenia i cienie poza lightboxem, IBM Plex Mono poza placeholderami, nagłówki inne niż 400. Fokus: obrys 2 px `#e8c765`, odstęp 2 px. Bez nowego copy. Etykiety UI jak w rundzie 1.

Propozycje z README v2 §4 (automatyczne ukrywanie leadu) i §5 (domyślne „Powiązane” dla rodzajów bez mapowania) są oceniane osobno — nie rozwijaj ich w tej rundzie.

### 4. Ekrany

1. **1a / 1c / 1e** — Wykłady 2013/2014 (najgorszy przypadek), 1440 / 1920 / 1280 — z nawigacją w kolumnie i nowym nagłówkiem.
2. **2c** — Wilno 1440, trzy pozycje przewinięcia (sticky); **2f** — Wilno 1920 (kadr pionowy, K-f).
3. **3a** — Noc Świątyń 1440 (kadr poziomy 16:9, K-f).
4. **3c** — 46 zdjęć, 1440: koniec galerii (K-c).
5. **3e** — Nabór 1440: fakty + CTA + Powiązane + nawigacja — czy kolumna nie robi się za długa.
6. **4a** — Wilno 1024 (kolumna 264 px).
7. **390** — obecny vs nowy nagłówek (tylko porównanie).
8. Fokus na linkach nawigacji w kolumnie.

### 5. Oddaj

- Zaktualizowany `design/Akademia Ikony - Wpis Aktualności v2.dc.html` (ekrany powyżej; stare K1/K2 możesz usunąć) i `design/WpisAktualnosci2.dc.html`.
- `design/README-wpis-aktualnosci-v2.md`: sekcja „Runda 2.1” — obszary siatki desktop po zmianie, nowe tokeny (offset sticky, odstępy nagłówka, odstęp nawigacji), reguła linii w kolumnie, rozwiązanie K-c z uzasadnieniem, lista miejsc niejasnych.
