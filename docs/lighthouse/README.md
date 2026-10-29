# Lighthouse — podsumowanie pomiarów (etapy 10–11)

Jeden plik zamiast katalogów z pomiarami: 2026-10-29 surowe raporty (~560 MB, poza repo) i README cząstkowe (`after-11b/`, `after-11b-3/`, `after-11b-4/`, `after-11c-no-analytics/`) usunięte. Odwołania do tych katalogów w Postępie planu 11 to historia — liczby są niżej i w git (`git log -- docs/lighthouse`).

**Metoda (od 11b):** produkcyjny `workers.dev` (Cloudflare Workers Free), Lighthouse 13.5, okno Chrome widoczne, świeża instancja na każdy przebieg. Mobile w presecie domyślnym (symulowane wolne 4G), 3 przebiegi, bierzemy medianę. Desktop z `--preset=desktop`. Kategorie Performance / Accessibility / Best Practices. SEO pomijamy, bo poza produkcją strona ma `noindex`. Kryterium K-163 dla mobile: Perf ≥ 90 i LCP ≤ 2,5 s.

## Wynik końcowy (11b-4 + analityka, 2026-10-28) — odebrany przez właściciela

| Trasa | Perf M | LCP M | Element LCP |
| --- | --- | --- | --- |
| `/` | 95 | 2,6 s ✗ | tekst lead |
| `/aktualnosci` | 89 ✗ | 3,5 s ✗ | — (tekst po `load`) |
| `/publikacje/ikona-dzis` | 96 | 2,4 s | okładka |
| `/wyklady/archiwum` | 96 | 2,4 s | tekst lead |
| `/ikony` | 95 | 2,5 s ✗ (2,51) | 1. miniatura |
| `/kontakt` | 96 | 2,6 s ✗ | link w tekście |
| `/warsztaty/kurs-roczny-i-trzyletni` | 97 | 2,1 s | tekst lead |
| `/warsztaty/letnia-szkola-swiatla` | 98 | 2,1 s | tekst lead |
| `/o-akademii` | 95 | 2,4 s | zdjęcie hero |
| `/polityka-prywatnosci` | 96 | 2,1 s | akapit |
| `/pracownia` | 97 | 2,1 s | tekst lead |
| `/publikacje` | 96 | 2,6 s ✗ | okładka |
| `/warsztaty` | 98 | 2,3 s | zdjęcie ramki |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` | 98 | 2,1 s | akapit |
| `/wyklady/wykladowcy` | 98 | 2,4 s | tekst lead |
| `/wyklady` | 98 | 2,1 s | akapit |
| `/ikony/wystawy` | 97 | 2,4 s | tekst lead |

- **K-163 mobile: 12/17 tras.** Właściciel przyjął wynik z tym odstępstwem 2026-10-28.
- **Desktop:** Perf 100 i LCP ≤ 0,6 s na wszystkich trasach. A11y 100, poza `/kontakt` i `/o-akademii` (96: reguła `link-in-text-block`; wzorzec podkreślenia K-135 zostaje świadomie). BP 100, CLS 0.
- **Workers Logs w oknie pomiaru:** 0 błędów. TTFB mobile 50–130 ms.

## Droga do wyniku (mobile, zakres po 17 trasach)

| Etap | Perf M | LCP M | Spełnia K-163 | Co zmieniono |
| --- | --- | --- | --- | --- |
| 10b (lokalnie, `next start`) | 85–92 | 3,3–4,4 s | — | stan wyjściowy |
| przed 11b (`workers.dev`) | 89–95 | 2,9–3,7 s | 0/17 | — |
| 11b-2 | 89,5–95 | 2,6–3,6 s | 0/17 | `_headers` (cache), LCP eager + `fetchPriority`, statyczne WebP w buildzie |
| 11b-3 | 87–94 | 2,9–3,7 s | 0/17 | cache statyczny OpenNext (koniec 503 / limitu CPU) |
| **11b-4** | **89–98** | **2,1–3,5 s** | **12/17** | własne podzbiory fontów: 220 → 69 KB, 2 preloady |

## Wnioski

1. **Mobile ogranicza sieć symulacji, nie obrazy ani CPU.** Przed LCP przeglądarka pobiera HTML, CSS, fonty i JS. Dopóki fonty ważyły 220 KB, ta podłoga wynosiła ok. 3 s nawet na stronie bez obrazów. Własne podzbiory fontów dały najwięcej: −0,6 do −0,9 s na każdej trasie.
2. **Obrazy:** przekształcanie w locie (`/_next/image`, bez cache) zastąpiły warianty WebP generowane w buildzie, z długim cache. Obrazy LCP mają `eager` i `fetchPriority="high"`. Na desktopie pierwszy ekran ładuje się < 1 s.
3. **Stabilność:** OpenNext bez incremental cache renderował każde żądanie od nowa i przekraczał limit 10 ms CPU, co dawało 142 × 503. Cache statyczny usunął ten problem. Daty na stronach odświeża dobowy rebuild (11d).
4. **Koszt analityki** (porównanie z PostHogiem i bez, 5 tras): +80–115 ms TBT i −1 do −6 pkt Perf. LCP pogarsza się tylko na `/aktualnosci` (3,5 vs 2,9 s), bo SDK trafia w okno przed późnym LCP tekstu. Właściciel zaakceptował ten koszt.
5. **Próby bez efektu (nie wracać):** `experimental.inlineCss` pogorszył wynik, a `fetchPriority` przed 11b nic nie zmienił. Po odbiorze odrzucone zostały: późniejszy init PostHoga, dalsze cięcie JS i pomiar headless.
6. **Pomiar:** wyniki wahają się o kilka punktów. Przy trasach blisko progu robić 3 przebiegi i brać medianę, z oknem Chrome na pierwszym planie.

## Do zrobienia

- **11f — końcowy Lighthouse na domenie produkcyjnej.** Ta sama metoda, 17 tras. Wynik dopisać tutaj jako nową tabelę i porównać z tabelą końcową wyżej. Surowe raporty zapisywać w `docs/lighthouse/` (ignorowane przez `.gitignore`) i usunąć po spisaniu wyników.

```bash
npx lighthouse https://www.akademiaikony.pl/ --only-categories=performance,accessibility,best-practices \
  --output=json --output=html --output-path=docs/lighthouse/home-mobile-1 --quiet
```

Pliki: `home` `/`, `aktualnosci`, `album` = `/publikacje/ikona-dzis`, `archiwum`, `ikony`, `kontakt`, `kurs`, `lss`, `o-akademii`, `polityka`, `pracownia`, `publikacje`, `warsztaty`, `wpis-galeria` = `/aktualnosci/wernisaz-albumu-ikona-dzis`, `wykladowcy`, `wyklady`, `wystawy` = `/ikony/wystawy`. Desktop: dodać `--preset=desktop`.
