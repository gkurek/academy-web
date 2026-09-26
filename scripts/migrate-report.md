# WordPress migration report

Log per chunk (`docs/plans/09-migration.md`).

## EJK — otwarte

_(pozycje dopisywane w kolejnych kawałkach)_

- **Adres zgłoszeń na kurs roczny/trzyletni:** WP `/zapisy-na-warsztaty` podaje `sekretariat.ikony22@gmail.com`, WP `/warsztaty-roczne` i brief §8 — `akademiaikony@gmail.com`. Na stronie: `akademiaikony@gmail.com` (decyzja 2026-09-26); potwierdzić z EJK.

## Zamrożenia — kawałek 1 (static)

| Plik / pole | Decyzja | Data |
| --- | --- | --- |
| `content/pages/kontakt.mdx` (akapit pod mapą / kontaktem) | **zostaw** — jeden akapit o zakrystii + tel.; bez akapitu WP o KŚT | 2026-09-26 |
| `content/pages/polityka-prywatnosci.json` | **zostaw** — wersja redakcyjna (Administrator, „na rzecz”, „Masz prawo…”, bez `studiumikony@gmail.com` w treści; `contactEmail`: `akademiaikony@gmail.com`) | 2026-09-26 |
| `content/settings.json` | **zostaw** — kontakt (2 maile, §8), `mapEmbedUrl`, `upcoming`, ekosystem; WP kontakt nie nadpisuje | 2026-09-26 |
| `content/pages/o-akademii.json` + `o-akademii.mdx` | **zostaw** (tekst etapu 6); **bez podpinania** mediów z WP — ścieżki `/media/workshop/` bez zmian; pliki w `public/media/import/static/o-akademii/` tylko artefakt fetchu | 2026-09-26 |
| `content/pages/pracownia.json` + `pracownia.mdx` | **zostaw** — treść etapu 6 bez zmian; bez podpinania `public/media/import/static/pracownia/` | 2026-09-26 |
| `public/media/import/static/{o-akademii,pracownia}/` (20 plików) | **zostaw** w repo — niepodpięte do JSON; niepełny fetch „O nas” (4/10 `<img>` — tylko linki w `<a href=uploads>`); na później / EJK | 2026-09-26 |

**Kawałek 1 — zamknięty** 2026-09-26 (gate OK; build/lint OK).

## Zamrożenia — kawałek 2 (offers)

| Plik / pole | Decyzja | Data |
| --- | --- | --- |
| `content/testimonials.json` — Adam, Iza, Maciej (pierwsze 3 `items`, hub `/warsztaty` „Głosy uczestników”) | **WP** — tekst ręcznie z WP; role „warsztatów”; Hania usunięta z huba | 2026-09-26 |

_Uwaga:_ ten sam rekord **Maciej** jest używany na plenerze (`getPlenerTestimonials`) — do weryfikacji przy gate „Głosy z pleneru”._

## Zamrożenia — kawałek 1 v2 (rdzeń redakcyjny, `docs/plans/09-migration-v2.md`)

Źródło: `docs/plans/09-migration-source.md`. Metoda: nowa redakcja, akceptacja wizualna na localhost.

| Plik / pole | Decyzja | Data |
| --- | --- | --- |
| `content/offers/kurs-roczny-i-trzyletni.mdx` — `lead`, `leadSecondary`, `leadExtra` („Rok albo trzy lata”), sekcja MDX „Dalsza droga” | **nowa redakcja** z source (warsztaty-roczne, zapisy-na-warsztaty, pracownia „Co nas wyróżnia”); `sample` zdjęty; adres zgłoszeń `akademiaikony@gmail.com` (source ma też `sekretariat.ikony22@gmail.com` — patrz EJK) | 2026-09-26 |

| `content/offers/letnia-szkola-swiatla.mdx` — `lead`, `leadSecondary`, `leadExtra` („Tydzień na plenerze”), `facts.audience`, sekcja MDX „Po co ten tydzień” | **nowa redakcja** z source (warsztaty-wakacyjne, zapisy-na-warsztaty); odbiorcy: osoby z pierwszym doświadczeniem, decyzja w rozmowie (bez „bez wymogu doświadczenia”); `sample` zdjęty | 2026-09-26 |
| `content/offers/letnia-szkola-swiatla.mdx` — „Rytm dnia” | **zostaw** (makieta; zaakceptowany przez klientkę) — usunięta etykieta „[do potwierdzenia z EJK]” | 2026-09-26 |
| `content/offers/letnia-szkola-swiatla.mdx` — `whereWeWere` | **mix** — lista z source (Warszawa, Święta Lipka, Supraśl, Przemyśl, Litwa, Gruzja) + miejscowości z makiety (Wesoła, Wilno, Tbilisi); lata `[do uzupełnienia]` — patrz TODO niżej | 2026-09-26 |

| `src/i18n/pl.ts` → `workshopsHub.lead`, `leadSecondary` (nowe pole), `cards.*.excerpt`, bullet pleneru | **nowa redakcja** z source (`/warsztaty`: praca malarza ikon, EJK); plener lipiec–wrzesień, odbiorcy jak na stronie pleneru | 2026-09-26 |

| `content/testimonials.json` | **mix** — cytat „Iza, uczestniczka warsztatów” (makieta, nie z WP) usunięty; na hubie zastąpiony cytatem **Artura** (z WP, strona plenerów; rekord zdublowany — na plenerze zostaje z `scope: "plener"`); cytaty plenerowe potwierdzone jako WP; `sample` zdjęty | 2026-09-26 |
| `content/pages/kontakt.mdx` | **zostaw** — przegląd końcowy bez zmian (zamrożenie z kawałka 1 static) | 2026-09-26 |
| `content/pages/o-akademii.*`, `content/pages/pracownia.*` | **zostaw** — decyzja właściciela: treść wystarczająca, source nie wnosi zmian | 2026-09-26 |

**Kawałek 1 v2 — zamknięty** 2026-09-26 (akceptacja wizualna per strona; build/lint OK).

## WP zamknięte — kawałek 1 v2

Treść z poniższych URL-i uznajemy za zmigrowaną (konspekt w `docs/plans/09-migration-source.md`) — bez ponownego fetchu:

- `/strona-glowna`
- `/strona-glowna/celem-dzialalnosci-akademii-ikony-…`
- `/strona-glowna/pracownia`
- `/warsztaty`
- `/warsztaty/zapisy-na-warsztaty`
- `/warsztaty/warsztaty-roczne`
- `/warsztaty/warsztaty-wakacyjne`
- `/wyklady/zapisy-na-wyklady` — w source brak osobnej sekcji; tekst proceduralny wykładów pokryty przez `/wyklady#zapisy` (stan etapu 4); do sprawdzenia przy kawałku 2, jeśli pojawi się rozbieżność

## TODO — kawałek 2 v2 (aktualności)

- [ ] **Plener — „Gdzie byliśmy”:** cross-check każdej pozycji `whereWeWere` z wpisami aktualności (`kind: 'plener'`) po migracji news; uzupełnić lata, wykreślić miejsca bez udokumentowanego pleneru.

## Do etapu 10 — uwagi z kawałka 1 v2

- [ ] **Kurs — „Dalsza droga”:** prawa kolumna pusta obok sekcji; rozważyć osobny przycisk CTA (np. zgłoszenie na kurs doskonalący / konsultację) albo zdjęcie po prawej.
- [ ] **Kurs — cytat „Piotr, uczestnik”** we frontmatterze: brak źródła w `09-migration-source.md`; potwierdzić pochodzenie lub wymienić.
- [ ] **Linki w MDX ofert** (`mailto:`, `tel:`) nie mają stylu inline — w treści ofert kontakt jest zwykłym tekstem; rozważyć styl `a` w `mdx-components.tsx`.

## Kawałek 1 — static — 2026-09-26

- o-akademii: WP slug "celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-ale-i-pomoc-w-doswiadczaniu-ikony", modified 2026-01-04, html 8308 chars
- pracownia: WP slug "pracownia", modified 2026-01-04, html 18847 chars
- kontakt: WP slug "kontakt", modified 2026-09-08, html 832 chars
- polityka-prywatnosci: WP slug "polityka-prywatnosci", modified 2026-01-04, html 4507 chars
- [dry-run] would write \content\pages\kontakt.mdx (142 chars)
- settings.json: no WP-driven changes
- [dry-run] would write polityka-prywatnosci.json (fingerprint 421d08945605)
- o-akademii: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- pracownia: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- o-akademii: 4 linked upload(s), 4 ready (dry-run)
- pracownia: 16 linked upload(s), 16 ready (dry-run)
- sample flags on o-akademii.json / pracownia.json: left unchanged until gate (plan kawałek 1)

## Kawałek 1 — static — 2026-09-26

- o-akademii: WP slug "celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-ale-i-pomoc-w-doswiadczaniu-ikony", modified 2026-01-04, html 8308 chars
- pracownia: WP slug "pracownia", modified 2026-01-04, html 18847 chars
- kontakt: WP slug "kontakt", modified 2026-09-08, html 832 chars
- polityka-prywatnosci: WP slug "polityka-prywatnosci", modified 2026-01-04, html 4507 chars
- wrote \content\pages\kontakt.mdx
- settings.json: no WP-driven changes
- wrote content/pages/polityka-prywatnosci.json
- o-akademii: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- pracownia: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- o-akademii: 4 linked upload(s), 4 ready (disk)
- pracownia: 16 linked upload(s), 16 ready (disk)
- sample flags on o-akademii.json / pracownia.json: left unchanged until gate (plan kawałek 1)

## Kawałek 1 — static — 2026-09-26

- o-akademii: WP slug "celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-ale-i-pomoc-w-doswiadczaniu-ikony", modified 2026-01-04, html 8308 chars
- pracownia: WP slug "pracownia", modified 2026-01-04, html 18847 chars
- kontakt: WP slug "kontakt", modified 2026-09-08, html 832 chars
- polityka-prywatnosci: WP slug "polityka-prywatnosci", modified 2026-01-04, html 4507 chars
- wrote \content\pages\kontakt.mdx
- settings.json: no WP-driven changes
- wrote content/pages/polityka-prywatnosci.json
- o-akademii: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- pracownia: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review
- o-akademii: 4 linked upload(s), 4 ready (disk)
- pracownia: 16 linked upload(s), 16 ready (disk)
- sample flags on o-akademii.json / pracownia.json: left unchanged until gate (plan kawałek 1)
