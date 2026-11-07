# Runbook — akademiaikony.pl

Instrukcja utrzymania serwisu: wdrożenia, zmiany treści, logi, awarie. Konfiguracja techniczna (ustawienia panelu, skrypty) — `README.md` § CI and deploy. Decyzje — `docs/plan-claude-code.md` (K-09, K-159, K-161, K-162).

Stan na 2026-11-02 (przed przełączeniem domeny, 11f). Miejsca oznaczone **[po 11f]** zaczną obowiązywać po starcie na `www.akademiaikony.pl`.

## 1. Gdzie co jest

| Co | Gdzie |
| --- | --- |
| Kod i treść | GitHub `gkurek/academy-web`, gałąź `main` = produkcja |
| Hosting | Cloudflare → Workers & Pages → Worker `akademiaikony` (Next.js przez OpenNext) |
| Produkcja | dziś `akademiaikony.grzegorz-tomasz-kurek.workers.dev` (`noindex`); **[po 11f]** `https://www.akademiaikony.pl` |
| Podglądy gałęzi | `<gałąź>-akademiaikony.grzegorz-tomasz-kurek.workers.dev`, za Cloudflare Access (logowanie kontem Cloudflare) |
| Dobowy rebuild | `.github/workflows/daily-rebuild.yml` → deploy hook Cloudflare (sekret repo `CF_DEPLOY_HOOK_URL`) |
| Analityka | PostHog Cloud EU, organizacja „Akademia Ikony”, projekt `akademiaikony.pl` |
| DNS i poczta | **[po 11f]** strefa na Cloudflare; dziś Cyberfolks |

## 2. Jak wdrożyć

Każda zmiana (kod lub treść) idzie przez gita. Nie ma ręcznego wgrywania plików.

1. **Gałąź:** `feat/…` albo `chore/…` od `main`, zmiana, commit, `git push`.
2. **Podgląd:** Workers Builds sam buduje każdą gałąź inną niż `main` (ok. 4 min). Adres podglądu: w PR (check Cloudflare) albo w panelu Worker → Deployments. Wymaga zalogowania w Cloudflare.
3. **PR do `main`:** CI (`.github/workflows/staging.yml`) uruchamia lint i build; check Cloudflare buduje podgląd.
4. **Produkcja:** merge PR do `main` → Workers Builds buduje i wdraża produkcję (ok. 4–8 min od merge'a). Sprawdzenie: strona otwiera się, zmiana jest widoczna.

Build zatrzymuje się sam, jeśli w `content/` jest błąd: `prebuild` uruchamia `check:content` (spójność plików i rejestrów) i `check:media` (czy istnieją obrazy wskazane w treści). Komunikat w logu buildu mówi, który plik i co zrobić.

**Rebuild bez commita** (np. żeby od razu przeliczyć daty): GitHub → Actions → „Daily rebuild” → *Run workflow* (gałąź `main`). Alternatywa: panel Cloudflare → Worker → Settings → Builds → deploy hook.

Lokalnie przed pushem (opcjonalnie): `npm run build`, `npm run lint`; wersja jak na Cloudflare — `npm run cf:preview`.

## 3. Dobowy rebuild

Strony są generowane w buildzie, więc wszystko, co zależy od dzisiejszej daty — kafle „Najbliższe” na stronie głównej, stan wystawy, stan zapisów liczony z dat — zmienia się dopiero po nowym buildzie (K-159). Dlatego workflow „Daily rebuild” codziennie o `00:17 UTC` (01:17 zimą, 02:17 latem) wywołuje deploy hook i produkcja buduje się od nowa z `main`.

- GitHub opóźnia zdarzenia `schedule` — w praktyce start bywa kilka godzin później. Rebuild nadal kończy się zwykle przed rankiem.
- Sprawdzenie: GitHub → Actions → „Daily rebuild” (zielone przebiegi `schedule`); panel Cloudflare → Deployments (wpis „deploy hook” każdego dnia).
- **Ryzyko — wyłączenie crona:** w publicznym repo GitHub wyłącza zaplanowane workflow po **60 dniach bez aktywności w repozytorium** (commit, PR). Wcześniej wysyła maila do właściciela. Gdy się to stanie, daty na stronie przestają się odświeżać. Naprawa: GitHub → Actions → „Daily rebuild” → *Enable workflow*; dowolny commit też zeruje licznik.
- Jeśli deploy hook zostanie usunięty lub wygenerowany na nowo w Cloudflare, nowy URL trzeba wpisać do sekretu `CF_DEPLOY_HOOK_URL` (GitHub → Settings → Secrets and variables → Actions). Bez sekretu workflow kończy się błędem.

## 4. Jak zmienić treść (do czasu panelu, etap 12)

Treść jest wyłącznie w `content/` (JSON i MDX); obrazy w `public/media/`. Zmiana treści = zmiana pliku + wdrożenie jak w § 2.

| Co zmieniasz | Plik |
| --- | --- |
| Dane kontaktowe, telefon, maile, stopka | `content/settings.json` |
| Teksty stron | `content/pages/<strona>.json` / `.mdx` |
| Oferty: kurs, Letnia Szkoła Światła, wykłady (terminy, ceny, zapisy otwarte/zamknięte, temat maila) | `content/offers/<oferta>.mdx` — m.in. `enrollmentOpen`, `enrollmentSubject` |
| Program wykładów sezonu | `content/lectures/<sezon>.json` |
| Wystawa coroczna | `content/exhibition/annual.json`, `page.mdx`, `body.mdx` |
| Ikony w galerii | `content/icons.json` + pliki w `public/media/icons/` |
| Wykładowcy | `content/lecturers.json`, `content/lecturer-directory.json` |
| Aktualności | `content/news/<slug>.mdx` + obrazy w `public/media/news/<slug>/` |

**Nowy wpis w Aktualnościach:**

1. Skopiuj podobny wpis z `content/news/` pod nowym `slug` (nazwa pliku = `slug` = adres `/aktualnosci/<slug>`).
2. Uzupełnij `frontmatter` (`title`, `date`, `kind`, `layout`, `excerpt`, `cover`/`images` z `alt` i wymiarami) i tekst.
3. Obrazy do `public/media/news/<slug>/`.
4. `npm run content:index` — odświeża `content/news/manifest.json` i `src/content/news-registry.ts` (oba się commituje).
5. Wdrożenie jak w § 2.

Formuła wpisów cyklicznych (nabór, wystawa, plener — co roku ten sam układ): `docs/wpisy-cykliczne-plan-redakcja-ejk.md` i `docs/wpisy-cykliczne-aktualnosci-ejk.md`.

**Podmiana obrazu pod tą samą ścieżką:** po wdrożeniu przeglądarki mogą przez dobę pokazywać starą wersję (`/media/*` ma cache 1 dzień, `public/_headers`). Jeśli zmiana ma być widoczna od razu — zapisz obraz pod nową nazwą i zmień ścieżkę w treści.

Treści stałe (nazwa, adres, maile, tematy `mailto:`) — wpisywać dosłownie wg `docs/brief-claude-code.md` § 8.

## 5. Logi, błędy, analityka

| Co | Gdzie |
| --- | --- |
| Logi buildu (czemu wdrożenie nie przeszło) | Cloudflare → Worker → Deployments → build → *View logs*; w PR — link z checku Cloudflare |
| Logi żądań na produkcji | Cloudflare → Worker → Observability (Workers Logs) |
| Błędy zgrupowane (5xx, wyjątki, limit CPU) | Cloudflare → Worker → Issues (Workers Issues, `observability.issues` w `wrangler.jsonc` — nie wyłączać, bo kolejny deploy wyłączy Issues) |
| Alert mailowy przy błędach 5xx | **[po 11f]** Cloudflare → Notifications / Monitor (K-162) |
| Dobowy rebuild | GitHub → Actions → „Daily rebuild” |
| CI | GitHub → Actions → „CI” |
| Ruch i kliknięcia (odsłony, `enroll_click`, `email_click`, `phone_click`) | PostHog → projekt `akademiaikony.pl` → Web analytics; bez ciasteczek, bez profili osób |

Ruch testowy w PostHogu rozróżnia się po `$host` (`workers.dev` vs `www.akademiaikony.pl`).

## 6. Jak cofnąć wdrożenie

**Szybko (minuty):** Cloudflare → Worker `akademiaikony` → Deployments → poprzednia działająca wersja → *Rollback*. Produkcja od razu serwuje starą wersję.

**Uwaga:** rollback działa tylko do następnego buildu z `main` — najpóźniej najbliższej nocy dobowy rebuild wdroży z powrotem to, co jest w `main`. Dlatego po rollbacku zawsze także:

1. `git revert <commit>` (albo poprawka) na gałęzi, PR do `main`, merge;
2. sprawdzenie, że nowe wdrożenie z `main` działa.

Jeśli trzeba wstrzymać nocny rebuild na czas naprawy: GitHub → Actions → „Daily rebuild” → *Disable workflow* — i włączyć go z powrotem po naprawie.

## 7. Typowe problemy

| Objaw | Co sprawdzić |
| --- | --- |
| Build w Cloudflare czerwony | Log buildu: błąd `check:content` / `check:media` → popraw plik wskazany w komunikacie (często: brak `npm run content:index` po zmianie wpisu albo zła ścieżka obrazu) |
| Zmiana treści niewidoczna po merge'u | Czy build produkcji się skończył (Deployments); twarde odświeżenie (Ctrl+Shift+R); przy obrazie — cache 1 dzień (§ 4) |
| „Najbliższe” / stan wystawy nieaktualne | Czy dobowy rebuild przeszedł (§ 3); ręczny *Run workflow* |
| 5xx / strona nie działa | Issues i Workers Logs (§ 5); rollback (§ 6) |
| Podgląd gałęzi prosi o logowanie | Tak ma być — Cloudflare Access; zaloguj się kontem Cloudflare |
