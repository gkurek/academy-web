# Plan 11 — Wdrożenie

Status: zatwierdzony 2026-10-26
Gałąź: `feat/11-going-live` (od `main` @ `0155659`, po merge etapu 10 — PR #27); punkt wyjścia konfiguracji — `chore/cloudflare-spike` (`8181923`), nie mergowany w obecnej postaci
Makiety: brak (etap bez zmian wizualnych)

## Cel i zakres

Uruchomienie serwisu na Cloudflare Workers pod `https://www.akademiaikony.pl`: konfiguracja hostingu w repo, naprawa wolnego ładowania obrazów (warunek startu), analityka bez ciasteczek, dobowy rebuild, monitoring, testy na podglądzie, przełączenie DNS i runbook. **Nie wchodzi:** panel CMS (przyszły etap), podniesienie Next (chyba że wymusi je 11b), import danych z WP Statistics (K-07 — tylko archiwum CSV), CTA w nagłówku (B1/K-35 — po danych z analityki, po starcie).

## Decyzje podjęte w sesji planistycznej (discovery, 2026-10-26)

Pełne brzmienie w `docs/plan-claude-code.md` §4.

- **K-09:** hosting = Cloudflare Workers (plan Free) + OpenNext (`@opennextjs/cloudflare`) — spełnia koszt 0 zł i CI/CD jak na Vercelu; próba na `chore/cloudflare-spike` przeszła (build, Worker 1,45 MiB z 3 MiB, 301 218/218, obrazy).
- **K-159 (B9):** dobowy rebuild przez cron GitHub Actions → deploy hook Cloudflare, **bez ISR** — treść zmienia się tylko commitem, data raz na dobę; ISR wymagałby R2, kolejki i cache tagów.
- **K-160:** DNS — nameservery domeny na Cloudflare (Free), strefa z rekordami pocztowymi Cyberfolks (MX, SPF, DKIM, DMARC) przepisanymi 1:1; przełączenie nameserverów dopiero w dniu startu; 301 apex/`http` → `https://www` przez Redirect Rule (K-08, K-155). Rejestr domeny i poczta zostają na Cyberfolks.
- **K-161:** przepływ wdrożeń — Workers Builds: `main` → produkcja, każda inna gałąź → Worker Preview. Ochrona przed indeksacją (korekta 2026-10-26): podglądy gałęzi za Cloudflare Access; produkcyjny `workers.dev` do 11f publiczny z `noindex` (`SITE_ENV` nieustawione) = staging dla testów 11e; w 11f `SITE_ENV=production` tylko w zmiennych buildu Production (Previews Base ma osobne) i `workers_dev: false`.
- **K-162:** monitoring — Workers Logs (błędy, retencja 3 dni) + UptimeRobot Free (dostępność co 5 min, alert mailem do właściciela); bez Sentry i skryptów po stronie przeglądarki.
- **K-163:** wydajność ładowania obrazów — kryteria odbioru 11b (poniżej); mierzone na hostingu przy zimnym cache, nie lokalnie.
- **K-164:** zależności — `@opennextjs/cloudflare` (dependency) i `wrangler` (devDependency). Aktualizacja w 11a (krytyczne CVE w Next 16.3.4): Next 16.4.3, React 19.3.1, adapter 1.20.13, TypeScript 6.0, `npm audit` = 0 — szczegóły w `docs/plan-claude-code.md` §4.
- **K-07** (analityka, zamknięte w 11-0, 2026-10-26): PostHog Cloud EU, tryb bez ciasteczek, `posthog-js` z npm; od startu na domenie managed reverse proxy PostHoga na neutralnej subdomenie.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| --- | --- | --- |
| `wrangler.jsonc`, `open-next.config.ts` | nowy (z gałęzi spike, po przeglądzie) | konfiguracja Workera i adaptera |
| `package.json`, `package-lock.json`, `.gitignore` | zmiana | zależności K-164, skrypty buildu/podglądu Cloudflare, katalogi buildu OpenNext |
| `.github/workflows/daily-rebuild.yml` | nowy | cron → deploy hook (K-159); URL hooka jako sekret repo |
| komponenty obrazów (`Hero`, `ExhibitionFrame`, `JustifiedGrid` i inne) + ewentualny skrypt w `scripts/` | zmiana / nowy | wg diagnozy 11b |
| `src/instrumentation-client.ts` | nowy | 11c-1: odroczony init PostHog (D1) |
| `src/lib/analytics.ts` (+ `posthog-js` w `package.json`), `content/pages/polityka-prywatnosci.json` | zmiana | 11c (K-07); akapit polityki — copy do akceptacji (K-122) |
| `docs/lighthouse/` | zmiana | pomiary na hostingu (przed / po 11b, końcowy na produkcji) |
| `docs/runbook.md` | nowy | 11g |

## Kawałki

Kolejność: 11-0 → 11a → 11b → 11c → 11d → 11e → 11f → 11g. Checkpoint po każdym.

### Kawałek 11-0 — Sesja K-07: analityka

Zakres: sesja decyzyjna, bez kodu. Wybór narzędzia przy hostingu Cloudflare (bez serwera Node/Postgres → Umami self-hosted i Matomo odpadają). Kandydaci: PostHog Cloud EU, Cloudflare Web Analytics, GoatCounter; Plausible Cloud (~9 USD/mies.) ponad budżet. Do sprawdzenia w oficjalnej dokumentacji: API (przyszła zakładka w CMS), zdarzenia własne (`enroll_click`, `email_click`, `phone_click`), retencja, tryb bez ciasteczek, waga skryptu. Punkt wyjścia: `docs/legacy-wp-analytics-notes.md` §5.
Kryterium „gotowe”: K-07 zamknięte w `docs/plan-claude-code.md` §4; zakres 11c doprecyzowany w tym planie.

### Kawałek 11a — Cloudflare w repo

Zakres: przeniesienie konfiguracji z `chore/cloudflare-spike` (`8181923`; ten sam commit z poprawionym opisem jako lokalny `badda46`) z przeglądem (`wrangler.jsonc` — m.in. komentarze „Spike”, binding `IMAGES`; `open-next.config.ts`, skrypty `cf:*`, `.gitignore`); zależności K-164; Workers Builds podpięte do repo wg K-161 (build `npm run cf:build`, deploy `npm run cf:deploy`, Preview command `npx wrangler preview`, `NODE_VERSION=22.20.0`, bez `SITE_ENV`); Cloudflare Access (one-click) na Preview URLs; deploy hook do ręcznego buildu.
Kryterium „gotowe”: `npm run build` i `npm run lint` OK; build na Cloudflare przechodzi; podgląd gałęzi działa i wymaga logowania Access; produkcyjny `workers.dev` publiczny z `noindex` i `Disallow: /` (indeksacja dopiero w 11f).

### Kawałek 11b — Wydajność ładowania obrazów

Zakres: problem kompleksowy, nie tylko hero — obrazy na całym serwisie pojawiają się z opóźnieniem (~1 s pustego pola; tak samo na Vercelu i Cloudflare). (1) **Pomiar na `workers.dev` przy zimnym cache:** Lighthouse mobile + desktop dla 17 tras, trace DevTools — LCP, FCP, TTFB, kaskada żądań obrazów, czasy `/_next/image` (dziś 140–370 ms, bez `Cache-Control`) vs statyczny `/media` (~80 ms, HIT). (2) **Diagnoza:** przekształcanie przy każdym żądaniu (spike kieruje `next/image` przez binding Cloudflare Images — sprawdzić też jego limit przekształceń w planie Free) i brak cache; `loading="lazy"` tuż pod pierwszym ekranem; `sizes` i wybierany wariant; kolejność ładowania (CSS, fonty, obrazy). (3) **Poprawka** wg diagnozy — kierunek wyjściowy: obrazy przygotowane w buildzie (statyczne WebP w wariantach szerokości, długi cache CDN) zamiast przekształcania w locie; zmiany fontów, jakości zdjęć (q90, 8c) i tokenów tylko za zgodą. (4) Pełny pomiar ponownie, tabela przed/po w `docs/lighthouse/`.
Kryterium „gotowe” (K-163), na `workers.dev`, zimny cache:
- zwykłe łącze (desktop, bez throttlingu): wszystkie obrazy na pierwszym ekranie widoczne **< 1 s**;
- Lighthouse mobile: **perf ≥ 90 i LCP ≤ 2,5 s** na wszystkich 17 trasach;
- obrazy poniżej pierwszego ekranu bez pustego pola przy normalnym przewijaniu.

**Lekcja z etapu 10 (10b/10c):** pomiar lokalny (`localhost`, rozgrzany cache obrazów, LCP zmierzony ~150 ms) nie pokazał problemu; symulowany LCP mobile 3,5–4,7 s był realnym sygnałem, błędnie uznanym za koszt symulacji. Od teraz wydajność mierzymy na hostingu.

### Kawałek 11c — Analityka

Zakres: PostHog Cloud EU (K-07), plan doprecyzowany 2026-10-27. Mechanizm sprawdzony w oficjalnej dokumentacji ([cookieless tracking](https://posthog.com/docs/privacy/cookieless-tracking)): w panelu *Settings > Project > Web analytics > Enable cookieless tracking*; identyfikator liczony na serwerze PostHoga jako `hash(team_id, daily_salt, ip_address, user_agent, hostname)`, sól zmieniana codziennie i kasowana po przetworzeniu dnia; w przeglądarce nic nie zostaje. Ograniczenia — K-07.

**Decyzje (2026-10-27):**
- **D1 — ładowanie odroczone:** `posthog-js` importowany dynamicznie po `load` / w czasie bezczynności, żeby nie dokładać się do LCP; kliknięcie w pierwszej chwili po wejściu może przepaść — akceptowane.
- **D2 — jeden projekt PostHog:** klucz w Production i Previews Base; ruch testowy odfiltrowany po `$host` (host wchodzi do hasha). Bez klucza (lokalnie) nic się nie wysyła.
- **D3 — kolejność:** 11c-1 i 11c-3 równolegle z domykaniem 11b; 11c-4 po 11b.
- **D4 — polityka:** zdanie o braku przekazywania do państw trzecich zostaje; nowy akapit wskazuje serwery w UE (Frankfurt). Copy do akceptacji (K-122), formalne zatwierdzenie EJK (K-119).
- **D5 — konfiguracja:** `NEXT_PUBLIC_POSTHOG_KEY` i `NEXT_PUBLIC_POSTHOG_HOST` jako **zmienne buildu** Workers Builds (*Settings → Build → Variables and secrets*, osobno Production i Previews Base) — Next wkleja `NEXT_PUBLIC_*` do bundla w buildzie, zmienne runtime z `wrangler.jsonc` tam nie trafią. Token projektu (`phc_…`) jest publiczny z założenia (tylko wysyłka). Host: na podglądzie `https://eu.i.posthog.com`, w 11f subdomena proxy (tylko Production). Test lokalny — właściciel sam w `.env.local`. Klucz osobisty API (`phx_…`, sekret) poza 11c.

**11c-1 — Kod.** `posthog-js` jako dependency (zgoda K-07/K-164); init w `instrumentation-client.ts`: `cookieless_mode: "always"`, `person_profiles: "never"`, `api_host` ze zmiennej, odsłony także przy nawigacji klienta; wyłączone autocapture, nagrania sesji, ankiety, feature flags. Jeden delegowany nasłuchiwacz `data-event` / `data-event-*` w `src/lib/analytics.ts` (brief §7) — bez zmian w komponentach.
Gotowe: build i lint OK; lokalnie bez klucza zero żądań do PostHoga.

**11c-2 — Panel i weryfikacja.** Właściciel: projekt PostHog Cloud EU, przełącznik cookieless, zmienne D5 w Workers Builds. **Panel ustawiony 2026-10-28:** osobna organizacja PostHog „Akademia Ikony” (dane administratora — Fundacja IKONA DZIŚ — oddzielone od organizacji „web trooper” właściciela; Free = 1 projekt na organizację), projekt `akademiaikony.pl` (ID 324762, EU Cloud, strefa czasowa `Europe/Warsaw` — dzienne sumy zgodne z polskim dniem); Web analytics: cookieless tracking ✅, domeny `https://www.akademiaikony.pl` i `https://akademiaikony.grzegorz-tomasz-kurek.workers.dev` (tę usunąć po 11f), web vitals autocapture wyłączone (opcja RUM do rozważenia w 11c-4, rozszerzenie w bundlu, nie z CDN); autocapture, heatmaps, session replay, surveys wyłączone; Privacy: *Discard client IP data* włączone (przy cookieless bez efektu, zabezpieczenie na wypadek wyłączenia trybu); zmienne D5 w Production i Previews Base. **Zweryfikowane przez Claude 2026-10-28** (API PostHoga i panel Cloudflare): ustawienia projektu zgodne z powyższym; obie zmienne typu *Variable* w obu zakładkach, `NEXT_PUBLIC_POSTHOG_KEY` = token projektu 324762, `NEXT_PUBLIC_POSTHOG_HOST` = `https://eu.i.posthog.com`. Test na podglądzie **z wyłączonym adblockiem** (do 11f ruch idzie wprost do `eu.i.posthog.com`; proxy w 11f).
Gotowe: odsłony oraz `enroll_click`, `email_click`, `phone_click` (z parametrami) widoczne w panelu; brak ciasteczek, `localStorage` i `sessionStorage`.

**11c-3 — Polityka prywatności.** Akapit o analityce w sekcji „Cookies” `content/pages/polityka-prywatnosci.json`, `lastUpdated`.
Gotowe: copy zaakceptowane przez właściciela.

**11c-4 — Pomiar (po 11b).** Lighthouse na hostingu z analityką i bez, porównanie z bazą po 11b w `docs/lighthouse/`.
Gotowe: kryteria K-163 nadal spełnione.

### Kawałek 11d — Rebuild i monitoring

Zakres: `.github/workflows/daily-rebuild.yml` (cron ok. 3:00 czasu polskiego → deploy hook; URL hooka w sekretach repo) — K-159; Workers Logs włączone; UptimeRobot Free z alertem mailowym (na `workers.dev`, po 11f na domenie) — K-162.
Kryterium „gotowe”: jeden przebieg crona zakończony nowym wdrożeniem; kafle „Najbliższe” i stan wystawy liczą się z daty rebuildu; test alertu UptimeRobot.

### Kawałek 11e — Testy na podglądzie

Zakres: testy na produkcyjnym `workers.dev` (publiczny, `noindex`; podglądy gałęzi są za Access i zewnętrzne testery do nich nie wejdą) — `npx tsx scripts/check-redirects.ts <workers.dev>` (218 przypadków); validator.schema.org i Rich Results Test (Organization, Person, Event, ExhibitionEvent, Course, Book, Article, BreadcrumbList); podgląd OG (Facebook Sharing Debugger) — główna i jedna ofertowa; `mailto:` i `tel:` na iOS i Androidzie.
Kryterium „gotowe”: wszystkie testy bez błędów, wyniki zapisane w planie (Postęp).

### Kawałek 11f — DNS i przełączenie

Zakres: przed wyłączeniem starej strony — eksport `wp_statistics_summary_totals` do CSV (archiwum pod przyszły wspólny wykres, K-07); strefa na Cloudflare przygotowana przed startem (eksport rekordów z Cyberfolks, rekordy pocztowe 1:1, weryfikacja); Redirect Rule apex/`http` → `https://www` (tylko apex i `www` — nie obejmuje subdomeny proxy analityki); managed reverse proxy PostHoga: CNAME na neutralnej subdomenie (szara chmurka, CAA jeśli są: `letsencrypt.org`, `pki.goog`, `ssl.com`), `api_host` przełączony na nią; Custom Domain `www.akademiaikony.pl` dla Workera; `SITE_ENV=production` w zmiennych buildu zakładki Production (nie Previews Base) i `workers_dev: false` w `wrangler.jsonc` (K-161); w dniu startu — zmiana nameserverów u rejestratora (wykonuje właściciel), test poczty (wysyłka i odbiór), test 301 na domenie, TXT Search Console, wysłanie `sitemap.xml`; końcowy Lighthouse na produkcji; po starcie — odpięcie projektu Vercel (Git integration) i aktualizacja `README.md` § deploy. Termin — decyzja właściciela (K-10).
Kryterium „gotowe”: domena serwuje nowy serwis po HTTPS; poczta działa; `check-redirects.ts` na domenie OK; GSC potwierdza sitemap; robots bez `Disallow: /`.

### Kawałek 11g — Runbook

Zakres: `docs/runbook.md` — jak wdrożyć (push, podgląd, produkcja, deploy hook), jak zmienić treść do czasu panelu CMS, gdzie są logi (Workers Logs, UptimeRobot, analityka), jak cofnąć wdrożenie (rollback w Workers), dobowy rebuild.
Kryterium „gotowe”: runbook przejrzany przez właściciela; dokumenty zsynchronizowane (brief, `docs/plan-claude-code.md`).

## Dane sample dodawane w tym etapie

Brak.

## Kryteria ukończenia etapu

- [ ] K-07 zamknięte; zdarzenia analityczne widoczne w panelu (przeniesione z etapu 10);
- [ ] kryteria wydajności K-163 spełnione na hostingu (przeniesione z etapu 10: mobile perf ≥ 90);
- [ ] lista starych URL-i z briefu §5 przetestowana na podglądzie i na domenie (`check-redirects.ts`);
- [ ] walidator schema.org i Rich Results bez błędów; podgląd OG sprawdzony (przeniesione z etapu 10);
- [ ] `mailto:` i `tel:` sprawdzone na iOS i Androidzie;
- [ ] dobowy rebuild działa; monitoring z alertem działa;
- [ ] domena na nowym serwisie, poczta działa, GSC potwierdza sitemap;
- [ ] `docs/runbook.md`: jak wdrożyć, jak zmienić treść, gdzie są logi;
- [ ] `npm run build` i `npm run lint` bez regresji.

## Ryzyka i pytania otwarte

- **Wersja adaptera:** `@opennextjs/cloudflare` przypięty dokładnie (1.20.13, Next 16.4.3 — podniesione w 11a z powodu CVE); kolejne aktualizacje razem z Next, zgodnie z zakresem `peerDependencies` adaptera.
- **Limity planu Free:** Worker 3 MiB (dziś 1,45 MiB gzip), czas CPU na żądanie — sprawdzić w 11b, jeśli obrazy zostaną przekształcane w Workerze.
- **Poczta przy przełączeniu DNS:** błąd w rekordach MX/SPF/DKIM zatrzyma pocztę Akademii — rekordy weryfikowane przed zmianą nameserverów, zmiana w dniu z możliwością szybkiego cofnięcia.
- **Termin startu** — bez presji (K-10); ustala właściciel.
- **Dwa wdrożenia z `main` do czasu 11f:** Vercel (Git integration) wdraża `main` jak dotąd; Workers Builds też buduje `main`, ale do 11a kończy się błędem (brak konfiguracji w `main`, pierwszy raz przy merge PR #27) — czerwony check nie blokuje merge'ów, `workers.dev` serwuje dalej wersję ze spike'a.
- **B1 / K-35** (CTA „Zapisy” w nagłówku) — po zebraniu danych z analityki, poza etapem 11.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| --- | --- | --- |
| 11-0 Sesja K-07 | ✅ | 2026-10-26: PostHog Cloud EU bez ciasteczek; proxy w 11f, eksport CSV WP Statistics w 11f; Umami (Cloud bez API, self-hosted za dużo utrzymania), GoatCounter (jedna osoba) i CF Web Analytics (brak zdarzeń) odrzucone |
| 11a Cloudflare w repo | ✅ | 2026-10-26: konfiguracja w repo (`wrangler.jsonc` z Workers Logs, `open-next.config.ts`, skrypty `cf:*`); aktualizacja zależności (K-164: Next 16.4.3, React 19.3.1, adapter 1.20.13, TS 6.0, `npm audit` = 0); `.open-next`/`.wrangler` w ignorach ESLint; build, lint, `cf:build` OK; panel Workers Builds ustawiony i zweryfikowany (Production i Previews Base: `npm run cf:build`, `NODE_VERSION`; hook `manual-build` → `main`; Access na podglądach — 302 do logowania, produkcja 200); build podglądu `feat/11-going-live` na Cloudflare OK po dodaniu bloku `previews` w `wrangler.jsonc` (`wrangler preview` nie dziedziczy bindingów; `WORKER_SELF_REFERENCE` celowo pominięty); produkcyjny `workers.dev`: `Disallow: /`; pierwszy build produkcji z nową konfiguracją (`main`) przeszedł 2026-10-26; produkcyjny `workers.dev`: 200, `robots.txt` `Disallow: /`, meta `noindex, nofollow` |
| 11b Wydajność obrazów | 🟡 | 2026-10-27: **pomiar bazowy zrobiony** (produkcyjny `workers.dev`, Lighthouse 13.5, raporty w `docs/lighthouse/before-11b/`: 31 ważnych przebiegów z 34; brak mobile `/wyklady/wykladowcy`; desktop `/wyklady/archiwum` i `/aktualnosci/wernisaz-albumu-ikona-dzis` = **503 z Workera** — sprawdzić w Workers Logs). Mobile: perf 89–95 (`/aktualnosci` 89 — pod progiem), **LCP 2,9–3,7 s — żadna trasa nie spełnia ≤ 2,5 s** (najgorzej `/` 3,7 s, `/aktualnosci` 3,7 s, `/ikony` 3,6 s); TTFB 76–199 ms (wpis z galerią 551 ms). Desktop: perf 97–100, LCP 0,6–1,2 s (`/ikony` 1,2 s). **Diagnoza (zaakceptowana 2026-10-27):** (1) **podłoga LCP mobile 2,9 s nie pochodzi z obrazów** — `/polityka-prywatnosci` bez żadnego obrazu ma 2,89 s; obrazy dokładają +0,1–0,8 s. Na symulowanym 4G (~200 KB/s, zimna wizyta na każdej trasie) przed LCP idą HTML 11 KB, CSS 24 KB, **4 preloadowane fonty 222 KB** (EB Garamond 112 + 44, IBM Plex 40 + 26) i ~170 KB JS. Fonty ważą tylko przy pierwszej wizycie w domenie (potem cache / nawigacja klienta), ale kryterium K-163 mierzy właśnie zimną wizytę — bez zmiany fontów LCP ≤ 2,5 s na mobile raczej nieosiągalne (**do decyzji: fonty albo korekta kryterium**). (2) **Brak cache:** `/_next/image` bez `Cache-Control` i bez `cf-cache-status` — przekształcanie (Cloudflare Images) przy każdym żądaniu, 140–350 ms vs `/media` 80–100 ms; to jest przyczyna opóźnionych obrazów na każdej stronie. Także hashowane `/_next/static/*` (fonty, CSS, JS) mają `max-age=0, must-revalidate`. 579 obrazów źródłowych × szerokości × 2 jakości — ryzyko limitu przekształceń planu Free (niesprawdzone w panelu). (3) **LCP z `loading="lazy"` na desktopie:** `/aktualnosci` (featured), `/kontakt`, `/ikony/wystawy` (hero `ExhibitionFrame` bez `priority`); preloady obrazów bez `fetchpriority=high`, na `/` i `/ikony` po 4 preloady konkurujące o łącze. (4) Nadmiar bajtów (drugorzędny): miniatury rozkładówek na `/publikacje` i albumie jako surowe JPEG 800 px (`tileUnoptimized`) przy 253–343 px; hero `/warsztaty`, `/ikony/wystawy` z `sizes="100vw"` → w=1920 przy 1069 px. (5) **Pomiar:** w wielu przebiegach malowanie ~1 s po `load` (losowo; okno Chrome w tle?) — symulacja wlicza wtedy więcej żądań; kolejne pomiary z widocznym oknem, 3 przebiegi na trasę, mediana. **Kolejność poprawek:** `public/_headers` (`immutable` dla `/_next/static/*`, długi cache `/media/*`) → warianty WebP w buildzie → LCP bez lazy, `fetchPriority="high"`, jedyny preload obrazu → fonty (za zgodą) → pomiar końcowy. **Decyzje 2026-10-27:** warianty generowane w buildzie (`prebuild`, katalog w `.gitignore`, nie w repo; prototyp: 1857 plików, 88 MB, 35 s lokalnie na 16 rdzeniach, szac. 3–5 min na Workers Builds 2 vCPU — zmierzyć na pierwszym buildzie), globalny loader `images.loaderFile` w `next.config.ts` (zgoda właściciela), 4 szerokości 384/640/1080/1920 przycięte do szerokości źródła, q90 tylko dla 3 zdjęć `Pillars`; limity Free: 3000 min buildu/mies., 20 000 plików na wersję Workera. **11b-1 ✅ (2026-10-27):** `public/_headers` (`/_next/static/*` `immutable` na rok, `/media/*` 1 dzień — sprawdzone na `cf:preview`); obrazy LCP `loading="eager"` + `fetchPriority="high"` zamiast przestarzałego `priority` (`Hero`, `AboutPage`, `PublicationAlbumPage`, `PublicationsHubPage`) i dodane tam, gdzie były lazy (`NewsFeatured`, `ContactPhoto`, hero `ExhibitionPage` przez `ExhibitionFrame priority`); `ExhibitionFrame` `sizes` wg zmierzonej szerokości ramki (desktop 1350 px: w=1080 zamiast 1920). Pozostawione na 11b-2: kafle eager z preloadem na `/` i `/warsztaty` (10/RF-21 — obejście wolnych obrazów, wrócić po wariantach statycznych). **11b-2 ✅ lokalnie (2026-10-27):** `scripts/generate-image-variants.ts` (`npm run images:variants`, w `predev` i `prebuild`) → `public/media-webp/` (w `.gitignore`): 579 źródeł → 2328 plików WebP, 114 MB (szerokość ponad źródło zapisana w rozmiarze źródła, bo loader jej nie zna), pełny przebieg 40,6 s / 16 rdzeni, **95,6 s przy 2 rdzeniach** (≈ Workers Builds), ponowny 0,2 s; `src/lib/imageVariants.ts` (szerokości, jakości, ścieżka wariantu — wspólne dla skryptu, loadera i `next.config.ts`), `src/lib/imageLoader.ts` (`images.loader: "custom"`); `deviceSizes` 640/1080/1920, `imageSizes` 384; `Pillars` z `HIGH_IMAGE_QUALITY`; miniatury rozkładówek bez `unoptimized`; binding Cloudflare Images usunięty z `wrangler.jsonc`; `/media-webp/*` w `_headers` (1 dzień). Assets Workera: 2956 plików (limit 20 000). Sprawdzone na `cf:preview`: 505 adresów obrazów z 17 tras → 200, zero `/_next/image`; lightbox nadal oryginały z `/media`. Build podglądu na Workers Builds 3 min 54 s (warianty 104,6 s; `public/media-webp/` poza cache buildu — generowane przy każdym buildzie). **Pomiar po 11b-2 (2026-10-27, `docs/lighthouse/after-11b/`, 3 przebiegi, mediana):** mobile 0/17 tras spełnia K-163 — perf 89,5–95, LCP 2,6–3,6 s (bez zmian vs baza); desktop perf 100, LCP 0,6–0,7 s na wszystkich trasach. **Blokada startu:** 142 nieudane żądania „Worker exceeded CPU time limit” (dokumenty i prefetche RSC) — przyczyna: OpenNext bez incremental cache renderował każdą stronę przy każdym żądaniu (limit Free 10 ms CPU). Podłoga LCP mobile: ~600 KB przed LCP na `/` (fonty 222 KB, JS ~160 KB, CSS 24 KB, kafle eager); na 7 trasach LCP to tekst czekający na font. **11b-3 lokalnie (2026-10-28):** `open-next.config.ts` → `staticAssetsIncrementalCache` + `enableCacheInterception` (strony prerenderowane z assetów, tylko odczyt); `cf:build` + `populateCache local` (Workers Builds dla podglądów wdraża przez `wrangler preview`, który cache nie wypełnia); usunięte `revalidate = 86400` z 6 plików (`/`, aktualności, wystawy, kurs, LSŚ, sitemap — data odświeżana dobowym rebuildem 11d, K-159; do czasu 11d i na Vercelu strony z datą nie odświeżają się same); RF-21: kafle „Wybrane ikony” na `/` bez eager (sekcja na dole strony; kafle `/ikony` i zdjęcie `/warsztaty` to LCP — zostają). Sprawdzone na `cf:preview`: `/`, `/wyklady/archiwum`, `/o-akademii`, wpis, sitemap, RSC → `x-opennext-cache: HIT`; nawigacja klienta bez błędów. **Pomiar po 11b-3 (2026-10-28, `docs/lighthouse/after-11b-3/`, mobile 3 ważne przebiegi, desktop 1):** wszystkie 17 tras 200 + `x-opennext-cache: HIT` (także RSC); **Workers Logs: 0 błędów** (poprzednio 142 × CPU limit), 0 ostrzeżeń `waitUntil`; 68/68 przebiegów bez błędu; TTFB mobile 54–104 ms. Mobile perf 87–94 (`/aktualnosci` 87), **LCP 2,9–3,7 s — 0/17**; desktop perf 100, LCP ≤ 0,7 s. Przed LCP na każdej trasie: fonty 220 KB + JS ~155 KB + CSS 24 KB + HTML 11 KB → podłoga ~3 s w symulacji wolnego 4G. Anomalia pomiaru: zasoby gotowe po ~0,2 s, pierwsze malowanie ~1,3 s (prawdopodobnie okno Chrome nie na pierwszym planie; na symulowany LCP prawie bez wpływu). **11b-4 lokalnie (2026-10-28, zgoda właściciela):** fonty z `next/font/google` (latin + latin-ext, 4 pliki, 222 KB) → `next/font/local` z własnymi podzbiorami (łacina podstawowa, Latin-1, polskie litery, typografia, greckie litery z treści; EB Garamond `wght` 400–600, IBM Plex Sans `wght` 400–700 bez osi `wdth`): `src/app/fonts/eb-garamond-pl.woff2` 38,6 KB + `ibm-plex-sans-pl.woff2` 30,9 KB = **70 KB, 2 preloady**; źródło, zestaw znaków i komenda regeneracji w `src/app/fonts/README.md`, licencje OFL obok; fonttools tylko jednorazowo (venv poza repo). Sprawdzone: wszystkie znaki z wygenerowanego HTML są w podzbiorach (poza ἰ w Plex — jak dotąd fallback), na `cf:preview` oba fonty `loaded`, polskie znaki OK na 375 px i desktopie. `/aktualnosci`: węższe `sizes` bez efektu (ekran Lighthouse 412 px × DPR 1,75 → i tak wariant 1080) — bez zmian. Do zrobienia: pomiar po 11b-4; jeśli LCP nadal > 2,5 s — korekta K-163 |
| 11c Analityka | ⬜ | 2026-10-27: plan doprecyzowany — kawałki 11c-1…11c-4, decyzje D1–D5. 2026-10-28: panel PostHog i zmienne Workers Builds ustawione i zweryfikowane (szczegóły w 11c-2). **11c-1 ✅ lokalnie (2026-10-28):** `posthog-js` ^1.441.2; `src/instrumentation-client.ts` — init po `load` + `requestIdleCallback` (fallback `setTimeout` dla Safari), dynamiczny import SDK (osobny chunk ~316 KB nieskompresowany, poza HTML), `cookieless_mode: "always"`, `persistence: "memory"`, `person_profiles: "never"`, `capture_pageview: "history_change"`; wyłączone autocapture, rageclick, dead clicks, heatmapy, wyjątki, `capture_performance`, nagrania, ankiety, product tours, conversations, web experiments, flagi (`advanced_disable_flags`), ładowanie z CDN; `listenForClickEvents` w `src/lib/analytics.ts` (nasłuchiwacz w fazie capture, parametry bez prefiksu `data-event-`). Sprawdzone na `next start`: bez klucza chunk SDK niepobierany, zero żądań zewnętrznych; z kluczem testowym i lokalnym odbiornikiem — jedyne żądania `POST /e/` (bez `/flags`, configu i CDN), SDK pobierany po `load`, `$pageview` przy wejściu i każdej nawigacji klienta, `phone_click` / `email_click` na `/kontakt`, `enroll_click` `{offer: "kurs", state: "closed"}`; `$cookieless_mode: true`, `distinct_id` `$posthog_cookieless`, bez profilu osoby; ciasteczka, `localStorage`, `sessionStorage` puste. **Następny: 11c-2 (weryfikacja na podglądzie)** |
| 11d Rebuild i monitoring | ⬜ | |
| 11e Testy na podglądzie | ⬜ | |
| 11f DNS i przełączenie | ⬜ | |
| 11g Runbook | ⬜ | |
