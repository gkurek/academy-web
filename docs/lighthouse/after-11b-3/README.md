# Lighthouse — etap 11 / 11b-3 (po cache statycznym OpenNext)

Pomiar: 2026-10-28, **18:40–19:03 CET** · produkcja `https://akademiaikony.grzegorz-tomasz-kurek.workers.dev` po wdrożeniu 11b-3 (`staticAssetsIncrementalCache` + `enableCacheInterception`, `populateCache local`, bez `revalidate`, kafle „Wybrane ikony" bez eager) · Lighthouse 13.5.0 · Chrome widoczny, świeża instancja na przebieg, przebiegi sekwencyjne, 3 s przerwy · Performance/Accessibility/Best Practices · mobile = preset domyślny (3 ważne przebiegi, mediana), desktop = `--preset=desktop` (1 przebieg). Skrypt: scratchpad sesji, poza repo.

Kolumny „po 11b-2" = mediana z poprawnych przebiegów w `after-11b/`. Podfazy LCP (`lcp-breakdown-insight`, mediana, ms, wartości **obserwowane**, nie symulowane): TTFB / opóźnienie ładowania / czas ładowania / opóźnienie renderu (– = brak fazy dla elementu tekstowego). Fonty/JS przed LCP = suma `transferSize` żądań, które skończyły się przed obserwowanym LCP (mediana).

## Brama wdrożenia (krok 1)

Wszystkie 17 tras: dokument 200 + `x-opennext-cache: HIT`, wariant `RSC: 1` 200 + `HIT`.

- `/`: 200 HIT; RSC 200 HIT
- `/aktualnosci`: 200 HIT; RSC 200 HIT
- `/publikacje/ikona-dzis`: 200 HIT; RSC 200 HIT
- `/wyklady/archiwum`: 200 HIT; RSC 200 HIT
- `/ikony`: 200 HIT; RSC 200 HIT
- `/kontakt`: 200 HIT; RSC 200 HIT
- `/warsztaty/kurs-roczny-i-trzyletni`: 200 HIT; RSC 200 HIT
- `/warsztaty/letnia-szkola-swiatla`: 200 HIT; RSC 200 HIT
- `/o-akademii`: 200 HIT; RSC 200 HIT
- `/polityka-prywatnosci`: 200 HIT; RSC 200 HIT
- `/pracownia`: 200 HIT; RSC 200 HIT
- `/publikacje`: 200 HIT; RSC 200 HIT
- `/warsztaty`: 200 HIT; RSC 200 HIT
- `/aktualnosci/wernisaz-albumu-ikona-dzis`: 200 HIT; RSC 200 HIT
- `/wyklady/wykladowcy`: 200 HIT; RSC 200 HIT
- `/wyklady`: 200 HIT; RSC 200 HIT
- `/ikony/wystawy`: 200 HIT; RSC 200 HIT

## K-163 (mobile: Perf ≥ 90 i LCP ≤ 2,5 s)

- Spełnia: **0 / 17** tras.
- Najlepsza LCP: `/aktualnosci/wernisaz-albumu-ikona-dzis` (2.9 s, Perf 94). Najgorsza LCP: `/aktualnosci` (3.7 s, Perf 87).
- Desktop: Perf min 100, LCP max 0.7 s.

## Mobile

| Trasa (plik) | Przebiegi OK | Perf (med.) | LCP | FCP | TBT | CLS | TTFB | Element LCP | Podfazy LCP | Fonty / JS przed LCP | Perf po 11b-2 | LCP po 11b-2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (home) | 3/3 | 91 | 3.3 s | 1.7 s | 131 ms | 0.000 | 81 ms | `p.text-size-lead-m` | 154 / – / – / 1196 | 220 KB / 159 KB | 89.5 | 3.6 s |
| `/aktualnosci` (aktualnosci) | 3/3 | 87 | 3.7 s | 2.0 s | 91 ms | 0.000 | 95 ms | `` | – / – / – / – | 220 KB / 157 KB | 91 | 3.4 s |
| `/publikacje/ikona-dzis` (album) | 3/3 | 91 | 3.3 s | 1.7 s | 97 ms | 0.000 | 76 ms | `img.publication-album-cover-image` | 134 / 21 / 101 / 1060 | 220 KB / 158 KB | 91 | 3.4 s |
| `/wyklady/archiwum` (archiwum) | 3/3 | 93 | 3.2 s | 1.3 s | 68 ms | 0.000 | 104 ms | `p.text-size-lead-m` | 177 / – / – / 1160 | 220 KB / 159 KB | 93 | 3.1 s |
| `/ikony` (ikony) | 3/3 | 91 | 3.3 s | 1.7 s | 54 ms | 0.000 | 90 ms | `img.justified-grid-image` | 151 / 22 / 94 / 1061 | 220 KB / 164 KB | 90 | 3.5 s |
| `/kontakt` (kontakt) | 3/3 | 91 | 3.3 s | 1.6 s | 66 ms | 0.000 | 67 ms | `span.link-underline-target` | 132 / – / – / 1171 | 220 KB / 154 KB | 92 | 3.3 s |
| `/warsztaty/kurs-roczny-i-trzyletni` (kurs) | 3/3 | 93 | 3.0 s | 1.1 s | 121 ms | 0.000 | 69 ms | `p.text-size-lead-m` | 136 / – / – / 1181 | 220 KB / 155 KB | 95 | 2.6 s |
| `/warsztaty/letnia-szkola-swiatla` (lss) | 3/3 | 94 | 3.0 s | 0.9 s | 119 ms | 0.000 | 66 ms | `p.text-size-lead-m` | 126 / – / – / 1193 | 220 KB / 155 KB | 92.5 | 3.0 s |
| `/o-akademii` (o-akademii) | 3/3 | 91 | 3.2 s | 1.7 s | 99 ms | 0.000 | 56 ms | `img.about-hero-image` | 130 / 22 / 66 / 1093 | 220 KB / 155 KB | 90 | 3.2 s |
| `/polityka-prywatnosci` (polityka) | 3/3 | 94 | 3.0 s | 0.9 s | 68 ms | 0.000 | 54 ms | `p` | 114 / – / – / 1195 | 220 KB / 155 KB | 92 | 3.1 s |
| `/pracownia` (pracownia) | 3/3 | 92 | 3.0 s | 1.7 s | 106 ms | 0.000 | 67 ms | `p.max-w-measure-lead` | 141 / – / – / 1162 | 220 KB / 158 KB | 92 | 3.0 s |
| `/publikacje` (publikacje) | 3/3 | 91 | 3.3 s | 0.9 s | 130 ms | 0.000 | 76 ms | `img.publication-hub-cover-image` | 139 / 18 / 48 / 1118 | 220 KB / 157 KB | 92 | 3.3 s |
| `/warsztaty` (warsztaty) | 3/3 | 92 | 3.1 s | 1.0 s | 131 ms | 0.000 | 58 ms | `img.exhibition-frame-image` | 124 / 16 / 57 / 1098 | 220 KB / 159 KB | 92.5 | 3.2 s |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` (wpis-galeria) | 3/3 | 94 | 2.9 s | 1.6 s | 133 ms | 0.000 | 91 ms | `p` | 154 / – / – / 1176 | 220 KB / 158 KB | 93 | 3.0 s |
| `/wyklady/wykladowcy` (wykladowcy) | 3/3 | 90 | 3.2 s | 1.9 s | 115 ms | 0.000 | 73 ms | `p.text-size-lead-m` | 144 / – / – / 1159 | 220 KB / 155 KB | 93 | 3.2 s |
| `/wyklady` (wyklady) | 3/3 | 94 | 3.0 s | 0.9 s | 98 ms | 0.000 | 101 ms | `p.body-copy` | 153 / – / – / 1167 | 220 KB / 154 KB | – | – |
| `/ikony/wystawy` (wystawy) | 3/3 | 91 | 3.2 s | 1.1 s | 141 ms | 0.000 | 74 ms | `p.exhibition-hero-grid__lead` | 134 / – / – / 1192 | 220 KB / 158 KB | 93 | 2.9 s |

## Desktop (1 przebieg)

| Trasa (plik) | Przebiegi OK | Perf | LCP | FCP | TBT | CLS | TTFB | A11y / BP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (home) | 1/1 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 61 ms | 100 / 100 |
| `/aktualnosci` (aktualnosci) | 1/1 | 100 | 0.7 s | 0.3 s | 0 ms | 0.002 | 92 ms | 100 / 100 |
| `/publikacje/ikona-dzis` (album) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 60 ms | 100 / 100 |
| `/wyklady/archiwum` (archiwum) | 1/1 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 67 ms | 100 / 100 |
| `/ikony` (ikony) | 1/1 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 66 ms | 100 / 100 |
| `/kontakt` (kontakt) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 56 ms | 96 / 100 |
| `/warsztaty/kurs-roczny-i-trzyletni` (kurs) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 66 ms | 100 / 100 |
| `/warsztaty/letnia-szkola-swiatla` (lss) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 114 ms | 100 / 100 |
| `/o-akademii` (o-akademii) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 53 ms | 96 / 100 |
| `/polityka-prywatnosci` (polityka) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 57 ms | 100 / 100 |
| `/pracownia` (pracownia) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 71 ms | 100 / 100 |
| `/publikacje` (publikacje) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 481 ms | 100 / 100 |
| `/warsztaty` (warsztaty) | 1/1 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 86 ms | 100 / 100 |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` (wpis-galeria) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 37 ms | 100 / 100 |
| `/wyklady/wykladowcy` (wykladowcy) | 1/1 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 120 ms | 100 / 100 |
| `/wyklady` (wyklady) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 258 ms | 100 / 100 |
| `/ikony/wystawy` (wystawy) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 65 ms | 100 / 100 |

## Próby z błędem

Wszystkich prób: 68 (planowo 102 mobile + 17 desktop = 119). Prób z błędem: **0**.
Brak — każdy przebieg zakończył się poprawnie w pierwszej próbie.

## Workers Logs (produkcja, okno pomiaru)

Źródło: Cloudflare dashboard → Workers & Pages → akademiaikony → Production → Observability → Events, zakres „Last 1 hour" (18:09–19:04 CET, obejmuje cały pomiar 18:40–19:03 CET). Odczyt: 2026-10-28 ok. 19:05 CET.

- **0 błędów** (licznik „Errors" = 0; 2 581 zdarzeń `Success`). Brak „Worker exceeded CPU time limit" — poprzednio 142 nieudane żądania (573 wpisy error).
- **0 ostrzeżeń `waitUntil`** (wyszukiwanie tekstu „waitUntil" w tym zakresie: „No events found").
- Zdarzenia to same wpisy `info` `GET …` (dokumenty i prefetchy `?_rsc=`).
- Kartę Chrome otwartą do odczytu zamknięto.
