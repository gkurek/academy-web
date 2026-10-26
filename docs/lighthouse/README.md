# Lighthouse — etap 10 / k10 (10b)

Data: 2026-10-26 · środowisko: **local prod build** (`next start -p 3005`, Windows, Chrome headless, `npx lighthouse`, jeden przebieg na trasę i tryb) · kategorie: Performance, Accessibility, Best Practices.

Kategoria SEO pominięta celowo: poza produkcją strona ma `noindex` (`SITE_ENV`), więc wynik byłby nieistotny.

Progi DoD etapu 10: a11y ≥ 95, wydajność ≥ 90 (mobile).

## Wyniki

| Trasa | Tryb | Perf | A11y | BP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | **87** ✗ | 100 | 100 | 4,0 s | 30 ms | 0 |
| `/` | desktop | 100 | 100 | 100 | 0,8 s | 0 ms | 0 |
| `/warsztaty/kurs-roczny-i-trzyletni` | mobile | 91 | 100 | 100 | 3,5 s | 20 ms | 0 |
| `/warsztaty/kurs-roczny-i-trzyletni` | desktop | 100 | 100 | 100 | 0,7 s | 0 ms | 0 |
| `/wyklady` | mobile | 91 | 100 | 100 | 3,5 s | 40 ms | 0 |
| `/wyklady` | desktop | 100 | 100 | 100 | 0,7 s | 0 ms | 0 |
| `/ikony` | mobile | **85** ✗ | 100 | 100 | 4,4 s | 40 ms | 0 |
| `/ikony` | desktop | 99 | 100 | 100 | 0,9 s | 0 ms | 0 |
| `/aktualnosci` | mobile | 90 | 100 | 100 | 3,6 s | 30 ms | 0 |
| `/aktualnosci` | desktop | 100 | 100 | 100 | 0,7 s | 0 ms | 0 |

Raporty (tylko na dysku, poza repo — `.gitignore`; w repo zostaje ten README): `<trasa>-<mobile|desktop>.report.html` (podgląd) i `.report.json` (dane); trasy: `home`, `kurs`, `wyklady`, `ikony`, `aktualnosci`.

## Wnioski

- **A11y 100 i Best Practices 100 na wszystkich trasach**, CLS 0 (`/aktualnosci` desktop 0,002) — progi a11y spełnione z zapasem.
- **Desktop ≥ 99 wszędzie.** Mobile: trzy trasy na progu lub tuż nad (90–91), dwie pod nim: `/` (87) i `/ikony` (85).
- Różnica między pomiarem „zaobserwowanym” a symulowanym jest duża: LCP zmierzony bez throttlingu to ~150 ms, symulowany Lighthouse’a (wolne 4G, 4× wolniejszy CPU) to 3,5–4,4 s. Wynik mobile jest więc ograniczony przez **sieć w symulacji**, nie przez pracę CPU (TBT 20–40 ms).
- Wspólne dla wszystkich tras: dwa blokujące arkusze CSS (21 + 1,5 KB, ~350 ms w symulacji), cztery preładowane pliki fontów (~220 KB; największy to EB Garamond `latin-ext` 111 KB — potrzebny dla polskich znaków), jeden chunk JS 70 KB z ~40 % nieużywanego kodu i polyfillami (13 KB `legacy-javascript`).
- `/ikony`: element LCP to pierwsza miniatura (`loading="eager"`, ale bez `fetchpriority=high`) — opóźnienie startu 1,0 s + pobranie 1,5 s w symulacji.
- `/`: element LCP to akapit lead (czeka na font); obrazy kafli „Najbliższe” `wystawa.jpg` mogłyby być lżejsze o ~59 KB (q90 — świadoma decyzja 8c).

## Zastrzeżenia

- Pomiar lokalny nie obejmuje hostingu (TTFB, kompresji, nagłówków cache, CDN). **Ostateczny pomiar wydajności — etap 11, na docelowym hostingu** (K-09). Opcjonalny pomiar na stagingu dopisać do tego pliku jako osobną tabelę.
- Jeden przebieg na konfigurację; wyniki Lighthouse wahają się o kilka punktów między przebiegami.

## Pozostałe trasy (poza DoD)

Te same ustawienia (local prod build, 2026-10-26). Pliki: `<nazwa>-<mobile|desktop>.report.*`.

| Trasa (plik) | Perf M | A11y | BP | LCP M | Perf D |
| --- | --- | --- | --- | --- | --- |
| `/warsztaty` (`warsztaty`) | **87** ✗ | 100 | 100 | 4,0 s | 99 |
| `/warsztaty/letnia-szkola-swiatla` (`lss`) | 91 | 100 | 100 | 3,5 s | 100 |
| `/wyklady/archiwum` (`archiwum`) | 91 | 100 | 100 | 3,5 s | 100 |
| `/wyklady/wykladowcy` (`wykladowcy`) | 91 | 100 | 100 | 3,5 s | 100 |
| `/ikony/wystawy` (`wystawy`) | **89** ✗ | 100 | 100 | 3,8 s | 100 |
| `/o-akademii` (`o-akademii`) | **89** ✗ | 96 | 100 | 3,8 s | 100 |
| `/pracownia` (`pracownia`) | 91 | 100 | 100 | 3,5 s | 100 |
| `/publikacje` (`publikacje`) | **87** ✗ | 100 | 100 | 4,1 s | 100 |
| `/kontakt` (`kontakt`) | 91 | 96 | 100 | 3,5 s | 100 |
| `/polityka-prywatnosci` (`polityka`) | 92 | 100 | 100 | 3,3 s | 100 |
| `/publikacje/ikona-dzis` (`album`) | **86** ✗ | 100 | 100 | 4,2 s | 100 |
| `/aktualnosci/wernisaz-albumu-ikona-dzis` (`wpis-galeria`) | 91 | 100 | 100 | 3,5 s | 99 |

### Wnioski z drugiej tabeli

- **Wspólny „próg” mobile to ~91 / LCP 3,5 s** — nawet strony tekstowe (polityka, wykładowcy) nie schodzą niżej. To koszt wspólnych zasobów (blokujący CSS, fonty, chunk JS), więc wspólna poprawka podniesie wszystkie trasy; strony z dużymi obrazami dokładają do tego kolejne 0,3–0,7 s.
- Pod 90 mobile: `/` 87, `/ikony` 85, `/warsztaty` 87, `/publikacje` 87, album 86, `/ikony/wystawy` 89, `/o-akademii` 89 (7 z 17 tras). Desktop: wszędzie ≥ 99. Dostępność: 96–100.
- **A11y 96 na `/o-akademii` i `/kontakt`** — reguła `link-in-text-block` (link do `ikonadzis.org` w akapicie). Link ma widoczne podkreślenie (`border` na wewnętrznym `span`, wzorzec K-135), ale audyt czyta tylko `text-decoration` linku, więc uznaje go za odróżniony samym kolorem (kontrast 1,18:1 z tekstem). Wynik spełnia próg ≥ 95; do rozstrzygnięcia w 10c, czy dodać `text-decoration` obok kreski.

## Jak powtórzyć pomiar (porównanie przed / po 10c)

Stan **przed** 10c = pliki w tym katalogu (2026-10-26; surowe raporty leżą na dysku w `docs/lighthouse/`, nie w repo — nie kasować przed porównaniem). Pomiar „po” zapisać do osobnego podkatalogu (`after-10c/`), żeby niczego nie nadpisać, i dopisać kolumnę „po” do tabel.

```bash
npm run build
npx next start -p 3005          # osobny terminal (lub preview_start „prod-preview”)
# dla każdej trasy i trybu (mobile = domyślny, desktop = --preset=desktop):
npx lighthouse http://localhost:3005/ --only-categories=performance,accessibility,best-practices \
  --output=json --output=html --output-path=docs/lighthouse/after-10c/home-mobile \
  --chrome-flags="--headless=new --no-sandbox" --quiet
```

Trasy i nazwy plików: `home` `/`, `kurs` `/warsztaty/kurs-roczny-i-trzyletni`, `wyklady` `/wyklady`, `ikony` `/ikony`, `aktualnosci` `/aktualnosci`; oraz z drugiej tabeli (`warsztaty`, `lss`, `archiwum`, `wykladowcy`, `wystawy`, `o-akademii`, `pracownia`, `publikacje`, `kontakt`, `polityka`, `album` = `/publikacje/ikona-dzis`, `wpis-galeria` = `/aktualnosci/wernisaz-albumu-ikona-dzis`). Wyniki wahają się o kilka punktów — dla tras blisko progu zrobić 3 przebiegi i podać medianę.

## 10c — wynik prób (2026-10-26)

Próby bez zmiany wyniku, **zmiany cofnięte** (brak zmian w kodzie):

- `fetchPriority="high"` na pierwszej miniaturze `/ikony`: mobile 84 / 84 / 83 (przed: 85), LCP 4,5–4,7 s — bez efektu, LCP ograniczony siecią w symulacji.
- `experimental.inlineCss: true` (zgoda właściciela na zmianę `next.config.ts`), pełny pomiar 17 tras: mobile **gorzej lub bez zmian** na większości tras (`/` 84 vs 87, `/aktualnosci` 82 vs 90, `/o-akademii` 88 vs 89, album 85 vs 86; nigdzie wyraźnie lepiej), desktop bez zmian. Inline powiększa HTML i usuwa cache CSS między trasami.
- Chunk JS / polyfille (13 KB `legacy-javascript`) pochodzą z rdzenia Next; bez zmian konfiguracji nie do usunięcia.
- `text-decoration` obok kreski K-135 — nie dodajemy (a11y 96 ≥ 95, wzorzec K-135 zostaje).

**Wniosek:** mobile 85–91 to koszt wspólnych zasobów w symulacji wolnej sieci; ostateczny pomiar — etap 11, na docelowym hostingu (kompresja, HTTP/2, cache, CDN mogą dać więcej niż zmiany w kodzie).
