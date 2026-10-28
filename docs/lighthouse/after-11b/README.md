# Lighthouse — etap 11 / 11b, po zmianach

Data: 2026-10-27 · środowisko: **produkcja** `https://akademiaikony.grzegorz-tomasz-kurek.workers.dev` (Cloudflare Workers, Free) po zmergowaniu PR #29 (nagłówki cache, eager LCP, statyczne WebP w `/media-webp/`) · Lighthouse 13.5.0 · Chrome widoczny (nie headless) · **3 przebiegi na trasę i tryb**, sekwencyjnie · kategorie: Performance, Accessibility, Best Practices · mobile = domyślny preset (symulowane wolne 4G), desktop = `--preset=desktop`.

Wartości = **mediana** z poprawnych przebiegów. „Przed” = pojedynczy przebieg z `before-11b/`. Raporty: `<nazwa>-<mobile|desktop>-<1|2|3>.report.{html,json}`.

## K-163 (mobile: Perf ≥ 90 i LCP ≤ 2,5 s)

- Spełnia: **0 / 17** tras.
- Najgorsze 3 (wg Perf): `/` (Perf 89.5, LCP 3.6 s); `/ikony` (Perf 90, LCP 3.5 s); `/o-akademii` (Perf 90, LCP 3.2 s).
- Desktop, trasy z LCP ≥ 1 s: brak.

## Mobile

| Trasa (plik) | Przebiegi OK | Perf (med.) | LCP | FCP | TBT | CLS | TTFB | Element LCP | Perf przed | LCP przed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (home) | 2/3 | 89.5 | 3.6 s | 0.9 s | 81 ms | 0.000 | 86 ms | `p.text-size-lead-m` | 90 | 3.7 s |
| `/aktualnosci` (aktualnosci) | 2/3 | 91 | 3.4 s | 1.3 s | 88 ms | 0.000 | 367 ms | `` | 89 | 3.7 s |
| `/publikacje/ikona-dzis` (album) | 1/3 | 91 | 3.4 s | 1.1 s | 133 ms | 0.000 | 161 ms | `img.publication-album-cover-image` | 93 | 3.2 s |
| `/wyklady/archiwum` (archiwum) | 3/3 | 93 | 3.1 s | 1.3 s | 39 ms | 0.000 | 636 ms | `p.text-size-lead-m` | 93 | 3.2 s |
| `/ikony` (ikony) | 3/3 | 90 | 3.5 s | 1.1 s | 95 ms | 0.000 | 117 ms | `img.justified-grid-image` | 90 | 3.6 s |
| `/kontakt` (kontakt) | 3/3 | 92 | 3.3 s | 0.9 s | 75 ms | 0.000 | 84 ms | `span.link-underline-target` | 94 | 3.0 s |
| `/warsztaty/kurs-roczny-i-trzyletni` (kurs) | 1/3 | 95 | 2.6 s | 1.1 s | 142 ms | 0.000 | 1468 ms | `p.text-size-lead-m` | 94 | 3.0 s |
| `/warsztaty/letnia-szkola-swiatla` (lss) | 2/3 | 92.5 | 3.0 s | 1.3 s | 108 ms | 0.000 | 88 ms | `p.text-size-lead-m` | 94 | 3.1 s |
| `/o-akademii` (o-akademii) | 2/3 | 90 | 3.2 s | 1.4 s | 144 ms | 0.000 | 117 ms | `img.about-hero-image` | 93 | 3.2 s |
| `/polityka-prywatnosci` (polityka) | 1/3 | 92 | 3.1 s | 1.6 s | 79 ms | 0.000 | 161 ms | `p` | 95 | 2.9 s |
| `/pracownia` (pracownia) | 3/3 | 92 | 3.0 s | 1.1 s | 113 ms | 0.000 | 723 ms | `p.max-w-measure-lead` | 94 | 3.0 s |
| `/publikacje` (publikacje) | 3/3 | 92 | 3.3 s | 0.9 s | 115 ms | 0.000 | 480 ms | `img.publication-hub-cover-image` | 93 | 3.2 s |
| `/warsztaty` (warsztaty) | 2/3 | 92.5 | 3.2 s | 1.3 s | 49 ms | 0.000 | 179 ms | `img.exhibition-frame-image` | 93 | 3.2 s |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` (wpis-galeria) | 3/3 | 93 | 3.0 s | 0.9 s | 133 ms | 0.000 | 118 ms | `p` | 95 | 2.9 s |
| `/wyklady/wykladowcy` (wykladowcy) | 1/3 | 93 | 3.2 s | 1.2 s | 39 ms | 0.000 | 567 ms | `p.text-size-lead-m` | – | – |
| `/wyklady` (wyklady) | 0/3 | – | – | – | – | – | – | `` | 94 | 3.0 s |
| `/ikony/wystawy` (wystawy) | 3/3 | 93 | 2.9 s | 1.1 s | 126 ms | 0.000 | 598 ms | `p.exhibition-hero-grid__lead` | 92 | 3.1 s |

## Desktop

| Trasa (plik) | Przebiegi OK | Perf (med.) | LCP | FCP | TBT | CLS | TTFB | Element LCP | Perf przed | LCP przed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (home) | 3/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 689 ms | `img.block` | 99 | 0.8 s |
| `/aktualnosci` (aktualnosci) | 3/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.002 | 164 ms | `img.news-featured-image` | 100 | 0.7 s |
| `/publikacje/ikona-dzis` (album) | 3/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 334 ms | `img.publication-album-cover-image` | 100 | 0.6 s |
| `/wyklady/archiwum` (archiwum) | 3/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 153 ms | `p.text-size-lead-m` | – | – |
| `/ikony` (ikony) | 3/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 95 ms | `img.justified-grid-image` | 97 | 1.2 s |
| `/kontakt` (kontakt) | 1/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 587 ms | `img.block` | 100 | 0.6 s |
| `/warsztaty/kurs-roczny-i-trzyletni` (kurs) | 2/3 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 298 ms | `p.text-size-lead-m` | 100 | 0.7 s |
| `/warsztaty/letnia-szkola-swiatla` (lss) | 3/3 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 528 ms | `p.body-copy` | 100 | 0.6 s |
| `/o-akademii` (o-akademii) | 1/3 | 100 | 0.6 s | 0.3 s | 2 ms | 0.000 | 630 ms | `img.about-hero-image` | 100 | 0.7 s |
| `/polityka-prywatnosci` (polityka) | 2/3 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 497 ms | `p` | 100 | 0.6 s |
| `/pracownia` (pracownia) | 3/3 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 120 ms | `p.max-w-measure-lead` | 100 | 0.6 s |
| `/publikacje` (publikacje) | 3/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 432 ms | `img.publication-hub-cover-image` | 100 | 0.6 s |
| `/warsztaty` (warsztaty) | 2/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 126 ms | `img.exhibition-frame-image` | 100 | 0.7 s |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` (wpis-galeria) | 3/3 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 107 ms | `img.news-article-cover-image` | – | – |
| `/wyklady/wykladowcy` (wykladowcy) | 3/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 138 ms | `p#_R_187jav5ubvb_` | 100 | 0.7 s |
| `/wyklady` (wyklady) | 2/3 | 100 | 0.6 s | 0.3 s | 0 ms | 0.000 | 694 ms | `p.text-size-lead-m` | 100 | 0.6 s |
| `/ikony/wystawy` (wystawy) | 1/3 | 100 | 0.7 s | 0.3 s | 0 ms | 0.000 | 102 ms | `img.exhibition-frame-image` | 100 | 0.8 s |

## Przebiegi z błędem / brakiem

- home mobile #2: NO_FCP
- aktualnosci mobile #3: brak raportu
- album mobile #2: ERRORED_DOCUMENT_REQUEST
- album mobile #3: ERRORED_DOCUMENT_REQUEST
- kontakt desktop #2: brak raportu
- kontakt desktop #3: ERRORED_DOCUMENT_REQUEST
- kurs mobile #2: brak raportu
- kurs mobile #3: ERRORED_DOCUMENT_REQUEST
- kurs desktop #1: brak raportu
- lss mobile #2: ERRORED_DOCUMENT_REQUEST
- o-akademii mobile #2: brak raportu
- o-akademii desktop #1: ERRORED_DOCUMENT_REQUEST
- o-akademii desktop #3: ERRORED_DOCUMENT_REQUEST
- polityka mobile #2: ERRORED_DOCUMENT_REQUEST
- polityka mobile #3: brak raportu
- polityka desktop #3: brak raportu
- warsztaty mobile #1: ERRORED_DOCUMENT_REQUEST
- warsztaty desktop #3: brak raportu
- wykladowcy mobile #1: ERRORED_DOCUMENT_REQUEST
- wykladowcy mobile #3: brak raportu
- wyklady mobile #1: brak raportu
- wyklady mobile #2: brak raportu
- wyklady mobile #3: ERRORED_DOCUMENT_REQUEST
- wyklady desktop #2: ERRORED_DOCUMENT_REQUEST
- wystawy desktop #2: ERRORED_DOCUMENT_REQUEST
- wystawy desktop #3: brak raportu

## Workers Logs (produkcja, okno pomiaru)

Źródło: Cloudflare dashboard → Workers & Pages → akademiaikony → Observability → Events, zakres „Last 3 hours” (≈ 19:35–22:30 CET, obejmuje przebiegi Lighthouse 19:45–21:50 CET), filtr `level = error`. Odczyt: 2026-10-27 ok. 22:30 CET.

- **573 zdarzenia na poziomie `error`.** Jedyna treść błędu: **„Worker exceeded CPU time limit.”** — każde nieudane żądanie zostawia 1 wpis `GET <url>` i 3–4 wpisy z tym komunikatem.
- **142 nieudane żądania** (wpisy `GET …` z poziomem error) — to odpowiednik 503 po stronie klienta. Pomiar bazowy: 168 × 503.
- Dotyczy zarówno nawigacji dokumentów (np. `/o-akademii`, `/kontakt`, `/wyklady`), jak i prefetchy RSC (`?_rsc=`, serie po 10–15 naraz po załadowaniu strony — np. 21:57–21:58 CET po zakończeniu skryptu, więc nie wszystkie pochodzą z samych przebiegów Lighthouse).
- Poza błędami w logach jest też ostrzeżenie `waitUntil() tasks did not complete within the allowed time after invocation end and have been cancelled` (poziom warn, m.in. dla `/warsztaty`, `/ikony/wystawy`).
- Po stronie Lighthouse: 13 przebiegów z „Status code: 503” i ERRORED_DOCUMENT_REQUEST, reszta błędów to „Target closed” / NO_FCP (patrz wyżej).
