# 08 — Delta kodu po k9 (10a)

Data: 2026-10-26 · zakres: kod dodany w commicie `d9b6768` (`10/9`) — `src/lib/metadata.ts`, `src/lib/structured-data/*`, `src/lib/analytics.ts`, `src/lib/siteEnv.ts`, `src/components/core/JsonLd.tsx`, `src/content/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` oraz miejsca użycia (`layout.tsx`, `SectionPageShell`, `generateMetadata` tras, `Button`, `TextLink`, `Footer`).

## Dane twarde (jednorazowo, bez zapisu do `package.json` — RV-3)

| Narzędzie | Wynik |
| --- | --- |
| `tsc --noEmit` | 0 błędów |
| `npm run lint` | 0 uwag |
| `knip` | k9: 2 zbędne eksporty (naprawione, niżej). Reszta — poza k9, bez zmian (niżej) |
| `jscpd src` (min. 8 linii) | TSX 0 klonów, TS 0 klonów; CSS 2 klony po 9 linii (`about.css`, `news-list.css`) — poza k9 |

## Ocena

Kod k9 jest mały (~540 linii), płaski i zgodny z konwencjami: bez pętli `for`, komentarze po angielsku, stringi w `pl.ts`, bez wartości arbitralnych, `JsonLd` i `pageMetadata` jako jedyne punkty emisji, Server Components (brak `"use client"` w nowym kodzie). Brak over-engineeringu: `JsonLdNode = Record<string, unknown>` jest świadomie luźny (walidacja zewnętrzna), `requireSeo` rzuca przy braku `description` zamiast po cichu zwracać pusty.

## Poprawione w 10a

1. `ORGANIZATION_ID` (`structured-data/site.ts`) — eksport nieużywany poza plikiem → `const`.
2. `ClickEvent` (`analytics.ts`) — eksport typu nieużywany poza plikiem → `type` bez `export`.

## Zostaje bez zmian (świadomie)

1. `getPageSeo(path)` jest wołane dwa razy na stronach z JSON-LD (`/wyklady`, kurs, LSŚ, `/ikony/wystawy`: raz w `metadata`, raz w treści). Tanie, wynik deterministyczny, dwa miejsca w pliku — wyciąganie do stałej zmieniłoby sygnaturę `metadata` na stronach bez zysku.
2. `layout.tsx` buduje `defaultOgImages` ręcznie, a `pageMetadata` robi to samo dla tras — to ten sam kształt w dwóch miejscach, ale layout nie ma `path`/`title`, więc współdzielenie wymagałoby dodatkowego helpera dla 3 linii.
3. `scripts/generate-og-images.ts` — knip widzi go jako nieużywany plik; to skrypt ręczny (`npx tsx scripts/generate-og-images.ts`), jak pozostałe jednorazowe (`classify-photos`, `tag-photos`, …). Bez wpisu w `package.json`, bo uruchamiany tylko przy zmianie kadrów.

## Poza k9 (do wiadomości, nie ruszane — „bez porządków przy okazji”)

- knip: `ENROLLMENT_FALLBACK_CLOSE_MONTH_DAY` (`content/enrollment.ts`), `ActiveOfferKind` (`content/offers.ts`), `ParagraphSegment` (`content/pages.ts`) — eksporty używane tylko lokalnie; 5 skryptów jednorazowych poza `package.json`.
- jscpd CSS: `about.css` [32–40 ↔ 350–358], `news-list.css` [7–15 ↔ 24–32].

## Do sprawdzenia w następnych kawałkach

- Walidacja JSON-LD (validator.schema.org, Rich Results) — etap 11, na publicznym adresie.
- `SITE_ENV=production` — bez niej `noindex` zostaje (etap 11, discovery).
