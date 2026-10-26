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

Zakres: PostHog Cloud EU (K-07) — `posthog-js` jako dependency z npm (w bundlu, bez skryptu z CDN); init z `cookieless_mode: "always"`, `person_profiles: "never"`, `api_host` / `ui_host` z konfiguracji (na podglądzie bezpośrednio `eu.i.posthog.com`, proxy dopiero w 11f); w projekcie PostHog włączony „Cookieless server hash mode” (inaczej zdarzenia przepadają); zdarzenia przez jeden nasłuchiwacz `data-event` (brief §7, `src/lib/analytics.ts`); weryfikacja w oficjalnej dokumentacji mechanizmu hasha (dzienna sól) przed włączeniem; akapit o analityce w polityce prywatności (K-119, copy do akceptacji K-122, `lastUpdated`); pomiar wpływu skryptu na wydajność (baza po 11b).
Kryterium „gotowe”: zdarzenia `enroll_click`, `email_click`, `phone_click` i odsłony widoczne w panelu PostHog z podglądu; brak ciasteczek, `localStorage` i `sessionStorage`; kryteria 11b nadal spełnione.

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
| 11a Cloudflare w repo | 🟡 | 2026-10-26: konfiguracja w repo (`wrangler.jsonc` z Workers Logs, `open-next.config.ts`, skrypty `cf:*`); aktualizacja zależności (K-164: Next 16.4.3, React 19.3.1, adapter 1.20.13, TS 6.0, `npm audit` = 0); `.open-next`/`.wrangler` w ignorach ESLint; build, lint, `cf:build` OK; panel Workers Builds ustawiony i zweryfikowany (Production i Previews Base: `npm run cf:build`, `NODE_VERSION`; hook `manual-build` → `main`; Access na podglądach — 302 do logowania, produkcja 200); build podglądu `feat/11-going-live` na Cloudflare OK po dodaniu bloku `previews` w `wrangler.jsonc` (`wrangler preview` nie dziedziczy bindingów; `WORKER_SELF_REFERENCE` celowo pominięty); produkcyjny `workers.dev`: `Disallow: /`; pierwszy build produkcji z nową konfiguracją — po merge do `main` |
| 11b Wydajność obrazów | ⬜ | |
| 11c Analityka | ⬜ | |
| 11d Rebuild i monitoring | ⬜ | |
| 11e Testy na podglądzie | ⬜ | |
| 11f DNS i przełączenie | ⬜ | |
| 11g Runbook | ⬜ | |
