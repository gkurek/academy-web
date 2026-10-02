# Plan 09 — Migracja treści z WordPressa

Status: **zamknięty** (implementacja wg `09-migration-v2.md`, 2026-10-01); CLI i gate — ten dokument.  
Gałąź: `feat/09-migration`  
Makiety: brak (etap wyłącznie treści; UI bez zmian). Trasy i model treści: `docs/brief-claude-code.md` §3–§5.

## Cel i zakres

Zastąpić wszystkie redakcyjne dane `sample` w `content/` i `public/media/` treścią zmigrowaną z działającego WordPressa (`https://www.akademiaikony.pl`), przez istniejącą warstwę `src/content/*` i typy — **bez zmian komponentów i layoutu**, chyba że build wymusi minimalną poprawkę (zgłosić w checkpoincie).

**W zakresie:** `scripts/migrate-wp.ts` (REST jako główne źródło, WXR jako rezerwa — **K-121**), CLI po kawałkach (`--only`, `--dry-run`, `--force`), `scripts/migrate-report.md`, oryginały mediów z `href`, nie z cache `src` (brief §5), reguły transformacji dawnych „Wydarzeń” (**K-50…K-58**, pełny opis: `docs/plan-claude-code.md` §3 etap 9), `docs/redirects.json`, podłączenie 301 w `next.config.ts` (kawałek 7), usunięcie wszystkich plików i znaczników `sample`, przegląd otwartych pozycji z `docs/plan-claude-code.md` §5.

**Poza zakresem:** SEO/metadata/sitemap (etap 10), hosting/DNS (etap 11), nowe zależności npm bez zgody właściciela repo, redesign, import blogspot (tylko link w stopce), migracja hubu `/wydarzenia/`.

## Rytm pracy (ustalone w sesji planistycznej)

1. **Jedna gałąź**, siedem kawałków; każdy kawałek = jedna spójna domena treści (`--only=` zgodnie z kawałkiem).
2. **Gate w czacie (uzupełnienie 2026-09-26)** — treść redakcyjna **nie** idzie masowym zapisem z WP. W obrębie kawałka, **pozycja po pozycji**:
   1. Pobranie z WP (REST, **K-121**); na tym etapie **bez** masowego nadpisywania `content/` / `public/media/` (dopuszczalny `--dry-run`, fetch do raportu lub diffu).
   2. Mapowanie: trasa URL, komponent, plik w `content/` (i media) — gdzie użytkownik to **zobaczy**.
   3. W czacie **jedna pozycja na turę**: treść z WP vs treść **u nas teraz**; krótko różnice. Decyzja właściciela: **WP** / **zostawiamy** / **mix** (mix = konkretnie co z czego).
   4. **Zapis** tylko po decyzji dla tej pozycji (lub małym batchu, jeśli właściciel tak powie).
   5. **Źródło prawdy:** wersja po decyzji jest **zamrożona** — kolejne `migrate-wp` **nie nadpisuje** zamrożonych plików/pól (rejestr w `scripts/migrate-report.md`, sekcja kawałka + tabela zamrożeń). Jeśli WP lub skrypt „chce” zmienić zamrożoną pozycję → **nie zapisuj**; zgłoś **konflikt** w kroku 3 przy następnym przebiegu tej domeny.
3. **Koniec kawałka:** wszystkie pozycje z zakresu kawałka przejrzane i zamrożone (lub świadomie odłożone → `## EJK — otwarte` w raporcie + `docs/plan-claude-code.md` §5). `npm run build`, `npm run lint`, przegląd w `npm run dev`, checkpoint.
4. **`--dry-run` / `--force` (K-122):** `--dry-run` = podgląd liczników i ostrzeżeń bez zapisu treści; **`--force` nie zastępuje gate** — tylko jawny re-run techniczny tam, gdzie właściciel po gate zdecydował o nadpisaniu zamrożenia.
5. Etap **10:** korekty merytoryczne z EJK oraz zmiany UI/UX po prezentacji.

Implementacja agenta: `.cursor/skills/start-code/SKILL.md` §5 (etap 9).

## Decyzje z sesji planistycznej

| ID | Decyzja |
| --- | --- |
| **K-08** | Kanoniczny host produkcyjny: **`https://www.akademiaikony.pl`**; apex/http → www przy wdrożeniu (etap 11). W `docs/redirects.json` tam, gdzie potrzebne pełne URL. |
| **K-121** | Źródło migracji: **WordPress REST API**; eksport WXR tylko jako rezerwa. |
| **K-122** | CLI po kawałkach: domeny **`--only=`**; **`--dry-run`** do podglądu bez masowego zapisu; **gate w czacie** (pozycja po pozycji, decyzja WP / zostaw / mix) przed zapisem — patrz § Rytm pracy; **zamrożenia** w `scripts/migrate-report.md`; **`--force`** nie zastępuje gate. Backlog EJK: raport + **`docs/plan-claude-code.md` §5**. |

## Pliki i skrypty

| Plik | Nowy/zmiana | Odpowiedzialność |
| ---- | ----------- | ---------------- |
| `scripts/migrate-wp.ts` | nowy | Pobieranie REST, HTML→MDX, zapisy per domena, flagi CLI, log do raportu |
| `scripts/migrate-report.md` | nowy | Log per kawałek, **tabela zamrożeń** (plik/pole → decyzja → data), konflikty przy re-run, pozycje EJK, redirecty |
| `package.json` | zmiana | Skrypt `migrate:wp` → `tsx scripts/migrate-wp.ts` |
| `docs/redirects.json` | nowy | Stara ścieżka → nowa (tabela brief §5 + wygenerowane slugi wpisów) |
| `next.config.ts` | zmiana (kawałek 7) | Odczyt `docs/redirects.json` dla 301 |
| `content/**` | zmiana | Dane z WP; usuwanie `sample` per kawałek |
| `public/media/**` | zmiana | Oryginały (ścieżki bez `sample`, wg konwencji repo) |

Wzorce z `scripts/generate-news-sample.ts`, `scripts/fetch-privacy-policy.ts`, `scripts/fetch-wp-gallery-sample.mjs`, `scripts/wp-gallery-manifest.json` — tam, gdzie pasują.

**Domeny CLI (`--only`):** `static`, `offers`, `lectures`, `news`, `gallery`, `publications`, `finalize` (patrz kawałki).

## Kawałki

### Kawałek 1 — Rdzeń skryptu + strony statyczne + `settings.json`

**`--only=static`**

Zakres: szkielet CLI (`--dry-run`, `--only`, `--force`); wspólne helpery HTML→MDX i obrazów (brief §5 kroki 2–3); pobranie stron WP mapowanych na trasy statyczne (`/o-akademii`, `/pracownia`, `/kontakt`; polityka częściowo już importowana — wyrównać z WP); aktualizacja `content/settings.json` z WP tam, gdzie są pola (nie zgadywać nad brief §8). Usunięcie `sample` w dotkniętych `content/pages/` dopiero po gate. Inne domeny — jeszcze nie.

Kryterium „gotowe”: szkielet `migrate-wp` + helpery; gate w czacie dla wszystkich pozycji domeny `static` (zamrożenia w raporcie); `npm run build` i `npm run lint` OK; sekcja raportu dla kawałka 1.

### Kawałek 2 — Strony ofertowe

**`--only=offers`**

Zakres: HTML ofert z WP do istniejących `content/offers/*.mdx` (frontmatter + body); zachować `OfferFacts` i pola naboru już w repo — scalić tekst z WP, nie wymyślać faktów. Usunąć powiązane media `sample` ofert, jeśli zastąpione.

Kryterium „gotowe”: wszystkie trasy ofert na prawdziwej treści; `FactsBox` nadal z frontmatter; gate OK.

### Kawałek 3 — Wykłady

**`--only=lectures`**

Zakres: posty `wyklady-YYYY-YYYY` → `content/lectures/<season>.json` (brief §5 krok 4); niejednoznaczne linie prowadzących → raport/EJK.

Kryterium „gotowe”: archiwum i bieżący sezon zgodne ze strukturą WP; `/wyklady` i `/wyklady/archiwum` budują się; gate OK.

### Kawałek 4 — Aktualności (+ reguły dawnych „Wydarzeń”)

**`--only=news`**

Zakres: posty → `content/news/*.mdx` + `manifest.json`; mapowanie kategoria → `kind` jak w `generate-news-sample.ts`; **wszystkie** transformacje „Wydarzeń” z `docs/plan-claude-code.md` §3 (splity, scalone oprowadzania 2017, pominięcie hubu `/wydarzenia/`, poświęcenia → Aktualności itd.; `NewsKind` — tylko `wyjazd` dla plenerów archiwalnych, K-125). Plakaty (**K-78**, **K-98**) — kandydaci do `News.poster`; nierozstrzygnięte → sekcja EJK w raporcie.

Kryterium „gotowe”: strumień aktualności buduje się; slugi docelowe kluczowych 301 istnieją; gate OK (największy przegląd merytoryczny).

### Kawałek 5 — Galeria + media

**`--only=gallery`**

Zakres: HTML strony galerii + pomocniczo `foogallery` → `content/icons.json`; oryginały do `public/media/` (nie `/cache/`); regex podpisów (brief §5 krok 5); log niejasnych podpisów. Zastąpienie zestawu sample z etapu 5b. Korekty tytułów/wymiarów/autorów głównie **EJK → etap 10**, chyba że Greg poprawi oczywiste błędy w gate.

Kryterium „gotowe”: `/ikony` na zmigrowanych plikach; gate OK.

### Kawałek 6 — Publikacje + wystawy

**`--only=publications`**

Zakres: album i artykuły z WP do `content/publications/` i `content/articles/` (**K-76**); `content/exhibition/annual.json` + `page.mdx` / dane wystaw (**K-82…**, splity doroczne K-84, K-90); relacje wernisaż ↔ aktualności, gdzie znane. Slug albumu i prawa do artykułów (`excerptOnly`) wg briefu — niewiadome → EJK w raporcie.

Kryterium „gotowe”: `/publikacje`, `/ikony/wystawy` na prawdziwych danych; gate OK.

### Kawałek 7 — Redirecty, usunięcie `sample`, przegląd wizualny

**`--only=finalize`**

Zakres: wygenerować/uzupełnić `docs/redirects.json` (host kanoniczny **K-08**); 301 w `next.config.ts`; usunąć **wszystkie** pozostałe pliki/flagi `sample` i `public/media/sample` wg §5; podsumowanie w raporcie; smoke wizualny 390 px i desktop na trasach z brief §3 (długie teksty po migracji).

Kryterium „gotowe”: `grep -r sample content/ public/media/` pusty; wiersze §5 z migracji przejrzane; DoD etapu poniżej; gate OK.

## Dane sample w tym etapie

Nowych sample nie dodajemy. Każdy wiersz `sample` z `docs/plan-claude-code.md` §5 — rozstrzygnięty w gate albo świadomie przeniesiony do etapu 10 z wpisem EJK.

## Kryteria ukończenia etapu (DoD)

- [ ] `grep -r sample content/ public/media/` bez wyników
- [ ] Dotyczące migracji pozycje §5 odhaczone lub przeniesione do etapu 10 z wpisem w raporcie EJK
- [ ] `scripts/migrate-report.md` przejrzany; pozycje EJK wymienione
- [ ] Daty w `content/` sprawdzone pod kątem archiwum 2025 vs bieżące 2026
- [ ] `npm run build` i `npm run lint` na pełnych danych
- [ ] Reprezentatywne strony ponownie na 390 px i desktopie

## Ryzyka i otwarte kwestie

- **Długie MDX** mogą ujawnić problemy layoutu niewidoczne na krótkim `sample` — naprawa tylko przy blokadzie buildu lub nieczytelności (inaczej etap 10).
- **Prawa / wybór artykułów z albumu** — zależne od EJK; placeholdery i `excerptOnly` wg briefu, bez wymyślania artykułów.
- **Cytat R. Rumina** — publikacja tylko za zgodą (**§5**); do czasu zgody — pominąć lub zablokować treść.
- **Nowa zależność npm** (np. konwerter HTML→MDX): zaproponować w checkpoincie kawałka 1 przed instalacją.

## Postęp

| Kawałek | Status | Gate / uwagi |
| ------- | ------ | ------------ |
| 1 — static + rdzeń | ✅ | Gate zamknięty 2026-09-26; zamrożenia w `migrate-report.md`; treść static bez zmian, import 20 pl. bez podpinania |
| 2 — oferta | ⬜ | |
| 3 — wykłady | ⬜ | |
| 4 — aktualności | ⬜ | |
| 5 — galeria | ⬜ | |
| 6 — publikacje + wystawy | ⬜ | |
| 7 — finalize | ⬜ | |
