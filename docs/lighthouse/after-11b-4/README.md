# Lighthouse — etap 11 / 11b-4 (własne subsety fontów)

Pomiar: 2026-10-28, **20:00–20:28 CET** · produkcja `https://akademiaikony.grzegorz-tomasz-kurek.workers.dev` po wdrożeniu 11b-4 (PR #31: własne subsety fontów EB Garamond i IBM Plex Sans, 2 preloady) · Lighthouse 13.5.0 · Chrome widoczny, świeża instancja na przebieg, przebiegi sekwencyjne, 3 s przerwy · Performance/Accessibility/Best Practices · mobile = preset domyślny (3 ważne przebiegi, mediana), desktop = `--preset=desktop` (1 przebieg). Skrypt: scratchpad sesji, poza repo.

Kolumny „po 11b-3" = mediana z poprawnych przebiegów w `after-11b-3/`. Podfazy LCP (`lcp-breakdown-insight`, mediana, ms, wartości **obserwowane**, nie symulowane): TTFB / opóźnienie ładowania / czas ładowania / opóźnienie renderu (– = brak fazy dla elementu tekstowego). Fonty/JS przed LCP = suma `transferSize` żądań, które skończyły się przed obserwowanym LCP (mediana).

## Brama wdrożenia (krok 1)

Preload fontów w HTML `/`: dokładnie 2 (`eb_garamond_pl-s.p.….woff2`, `ibm_plex_sans_pl-s.p.….woff2`). Wszystkie 17 tras: dokument 200 + `x-opennext-cache: HIT`, wariant `RSC: 1` 200 + `HIT`.

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

- Spełnia: **12 / 17** tras (`/publikacje/ikona-dzis`, `/wyklady/archiwum`, `/warsztaty/kurs-roczny-i-trzyletni`, `/warsztaty/letnia-szkola-swiatla`, `/o-akademii`, `/polityka-prywatnosci`, `/pracownia`, `/warsztaty`, `/aktualnosci/wernisaz-albumu-ikona-dzis`, `/wyklady/wykladowcy`, `/wyklady`, `/ikony/wystawy`).
- Najlepsza LCP: `/pracownia` (2.1 s, Perf 97). Najgorsza LCP: `/aktualnosci` (3.5 s, Perf 89).
- Desktop: Perf min 100, LCP max 0.6 s.

## Mobile

| Trasa (plik) | Przebiegi OK | Perf (med.) | LCP | FCP | TBT | CLS | TTFB | Element LCP | Podfazy LCP | Fonty / JS przed LCP | Perf po 11b-3 | LCP po 11b-3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (home) | 3/3 | 95 | 2.6 s | 0.9 s | 166 ms | 0.000 | 83 ms | `p.text-size-lead-m` | 143 / – / – / 1198 | 69 KB (było 220 KB) / 160 KB | 91 | 3.3 s |
| `/aktualnosci` (aktualnosci) | 3/3 | 89 | 3.5 s | 1.9 s | 116 ms | 0.000 | 102 ms | `` | – / – / – / – | 69 KB (było 220 KB) / 263 KB | 87 | 3.7 s |
| `/publikacje/ikona-dzis` (album) | 3/3 | 96 | 2.4 s | 1.0 s | 162 ms | 0.000 | 107 ms | `img.publication-album-cover-image` | 183 / 18 / 78 / 85 | 69 KB (było 220 KB) / 158 KB | 91 | 3.3 s |
| `/wyklady/archiwum` (archiwum) | 3/3 | 96 | 2.4 s | 1.2 s | 120 ms | 0.000 | 126 ms | `p.text-size-lead-m` | 196 / – / – / 1175 | 69 KB (było 220 KB) / 159 KB | 93 | 3.2 s |
| `/ikony` (ikony) | 3/3 | 95 | 2.5 s | 1.0 s | 149 ms | 0.000 | 79 ms | `img.justified-grid-image` | 158 / 22 / 73 / 1096 | 69 KB (było 220 KB) / 164 KB | 91 | 3.3 s |
| `/kontakt` (kontakt) | 3/3 | 96 | 2.6 s | 0.9 s | 129 ms | 0.000 | 77 ms | `span.link-underline-target` | 137 / – / – / 170 | 69 KB (było 220 KB) / 155 KB | 91 | 3.3 s |
| `/warsztaty/kurs-roczny-i-trzyletni` (kurs) | 3/3 | 97 | 2.1 s | 0.9 s | 142 ms | 0.000 | 71 ms | `p.text-size-lead-m` | 126 / – / – / 185 | 69 KB (było 220 KB) / 156 KB | 93 | 3.0 s |
| `/warsztaty/letnia-szkola-swiatla` (lss) | 3/3 | 98 | 2.1 s | 0.9 s | 123 ms | 0.000 | 50 ms | `p.text-size-lead-m` | 108 / – / – / 170 | 69 KB (było 220 KB) / 156 KB | 94 | 3.0 s |
| `/o-akademii` (o-akademii) | 3/3 | 95 | 2.4 s | 1.0 s | 130 ms | 0.000 | 89 ms | `img.about-hero-image` | 146 / 25 / 92 / 65 | 69 KB (było 220 KB) / 156 KB | 91 | 3.2 s |
| `/polityka-prywatnosci` (polityka) | 3/3 | 96 | 2.1 s | 0.9 s | 181 ms | 0.000 | 118 ms | `p` | 193 / – / – / 269 | 69 KB (było 220 KB) / 156 KB | 94 | 3.0 s |
| `/pracownia` (pracownia) | 3/3 | 97 | 2.1 s | 1.0 s | 170 ms | 0.000 | 56 ms | `p.max-w-measure-lead` | 109 / – / – / 204 | 69 KB (było 220 KB) / 159 KB | 92 | 3.0 s |
| `/publikacje` (publikacje) | 3/3 | 96 | 2.6 s | 0.9 s | 138 ms | 0.000 | 65 ms | `img.publication-hub-cover-image` | 145 / 19 / 59 / 1113 | 69 KB (było 220 KB) / 158 KB | 91 | 3.3 s |
| `/warsztaty` (warsztaty) | 3/3 | 98 | 2.3 s | 1.0 s | 104 ms | 0.000 | 62 ms | `img.exhibition-frame-image` | 131 / 20 / 70 / 94 | 69 KB (było 220 KB) / 160 KB | 92 | 3.1 s |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` (wpis-galeria) | 3/3 | 98 | 2.1 s | 0.9 s | 78 ms | 0.000 | 63 ms | `p` | 117 / – / – / 151 | 69 KB (było 220 KB) / 159 KB | 94 | 2.9 s |
| `/wyklady/wykladowcy` (wykladowcy) | 3/3 | 98 | 2.4 s | 1.2 s | 69 ms | 0.000 | 70 ms | `p.text-size-lead-m` | 115 / – / – / 152 | 69 KB (było 220 KB) / 155 KB | 90 | 3.2 s |
| `/wyklady` (wyklady) | 3/3 | 98 | 2.1 s | 0.9 s | 104 ms | 0.000 | 63 ms | `p.body-copy` | 119 / – / – / 161 | 69 KB (było 220 KB) / 155 KB | 94 | 3.0 s |
| `/ikony/wystawy` (wystawy) | 3/3 | 97 | 2.4 s | 1.0 s | 106 ms | 0.000 | 79 ms | `p.exhibition-hero-grid__lead` | 134 / – / – / 166 | 69 KB (było 220 KB) / 158 KB | 91 | 3.2 s |

## Desktop (1 przebieg)

| Trasa (plik) | Przebiegi OK | Perf | LCP | FCP | TBT | CLS | TTFB | A11y / BP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (home) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 40 ms | 100 / 100 |
| `/aktualnosci` (aktualnosci) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.002 | 88 ms | 100 / 100 |
| `/publikacje/ikona-dzis` (album) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 55 ms | 100 / 100 |
| `/wyklady/archiwum` (archiwum) | 1/1 | 100 | 0.4 s | 0.3 s | 0 ms | 0.000 | 74 ms | 100 / 100 |
| `/ikony` (ikony) | 1/1 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 45 ms | 100 / 100 |
| `/kontakt` (kontakt) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 40 ms | 96 / 100 |
| `/warsztaty/kurs-roczny-i-trzyletni` (kurs) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 65 ms | 100 / 100 |
| `/warsztaty/letnia-szkola-swiatla` (lss) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 73 ms | 100 / 100 |
| `/o-akademii` (o-akademii) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 48 ms | 96 / 100 |
| `/polityka-prywatnosci` (polityka) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 87 ms | 100 / 100 |
| `/pracownia` (pracownia) | 1/1 | 100 | 0.5 s | 0.4 s | 0 ms | 0.000 | 64 ms | 100 / 100 |
| `/publikacje` (publikacje) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 80 ms | 100 / 100 |
| `/warsztaty` (warsztaty) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 60 ms | 100 / 100 |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` (wpis-galeria) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 68 ms | 100 / 100 |
| `/wyklady/wykladowcy` (wykladowcy) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 70 ms | 100 / 100 |
| `/wyklady` (wyklady) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 419 ms | 100 / 100 |
| `/ikony/wystawy` (wystawy) | 1/1 | 100 | 0.5 s | 0.3 s | 0 ms | 0.000 | 97 ms | 100 / 100 |

## Próby z błędem

Wszystkich prób: 69 (planowo 51 mobile + 17 desktop = 68). Prób z błędem: **1**.
- warsztaty mobile #3 próba 1: exit 1 odules/lighthouse/cli/run.js:210:26)     at async file:///C:/Users/Greg/AppData/Local/npm-cache/_npx/1722e863ebfd623b/node_modules/lighthouse/cli/index.js:10:1 

## Workers Logs (produkcja, okno pomiaru)

Źródło: Cloudflare dashboard → Workers & Pages → akademiaikony → Production → Observability → Events, zakres „Last 1 hour" (ok. 19:30–20:30 CET, obejmuje cały pomiar 20:00–20:28 CET). Odczyt: 2026-10-28 ok. 20:31 CET.

- **0 błędów** (licznik „Errors" = 0; 2 513 zdarzeń `Success`). Brak „Worker exceeded CPU time limit".
- **0 ostrzeżeń `waitUntil`** (wyszukiwanie „waitUntil": „No events found").
- Kartę Chrome otwartą do odczytu zamknięto.
