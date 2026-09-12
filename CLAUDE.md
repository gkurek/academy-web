# Akademia Ikony – strona (academy-web)

## Dokumenty i kiedy je czytać

- `docs/plan-claude-code.md` – plan całej fazy implementacji; czytaj na starcie każdej sesji planistycznej.
- `docs/plans/0N-*.md` – plan bieżącego pod-etapu; czytaj na starcie każdej sesji implementacyjnej.
- `docs/brief-claude-code.md` – wymagania, architektura tras (§3), model treści (§4), fakty stałe (§8); czytaj przy pytaniach „co ma być”.
- `docs/brief-full.md` – kontekst biznesowy; tylko przy niejasnościach co do treści lub copy, nie przy pytaniach technicznych.
- `design/README` + `design/*.dc.html` – makiety i tokeny. Obowiązuje kierunek 1a i jego rozwinięcia 2a/3a/3b;

Przy konflikcie: `CLAUDE.md` > plan pod-etapu > `brief-claude-code.md` > `brief-full.md` > makieta. Rozbieżność zgłaszasz w meldunku, nie rozstrzygasz sam.

## Stack i komendy

- Next.js (App Router), TypeScript strict, React Server Components domyślnie; Client Components tylko tam, gdzie jest interakcja (menu, lightbox, akordeon, filtry).
- Stylowanie: Tailwind. Tokeny z `design/projekt/README` jako zmienne w `globals.css` (`@theme` / CSS variables), używane przez klasy Tailwind. Bez wartości arbitralnych (`text-[13px]`, `bg-[#…]`) – jeśli brakuje tokenu, zgłoś.
- Menedżer pakietów: npm. Node: wersja 22.20.0
- Komendy: `npm run dev`, `npm run build`, `npm run lint`. Skrypty w `scripts/` uruchamiane przez `tsx`.
- Nie instaluj nowych zależności bez pytania – zaproponuj w meldunku z uzasadnieniem.

## Konwencje kodu

- Bez pętli `for` / `for-of`; używaj `map` / `filter` / `reduce` / `forEach`.
- Jeden plik = jeden komponent, nazwane eksporty, props typowane. Nazwy komponentów dokładnie jak w `design/README` (`Header`, `Footer`, `SectionNav`, `Breadcrumb`, `Hero`, `FactsBox`, `OfferCard`, `LectureList`, `SeasonAccordion`, `IconGrid`, `Lightbox`, `NewsCard`, `Testimonial`, `MapBlock`, `EventCard`, `StepList`, `TocSidebar`).
- Stringi UI w `src/i18n/pl.ts` – nie hardkodować w JSX.
- Obrazy tylko przez `next/image` z podanymi wymiarami. Fonty przez `next/font`, subsety `latin` + `latin-ext`.
- Dostępność: każdy interaktywny element ma widoczny fokus (obrys 2px `#e8c765`, odstęp 2px); `alt` obowiązkowy; respektuj `prefers-reduced-motion`.
- Tokeny designu z `design/README`; nie zmieniać bez wyraźnej prośby. Zakazane w produkcji: `#8d7d69`, rozmiar 13px, zaokrąglenia i cienie poza `Lightbox`, IBM Plex Mono.
- Komentarze w kodzie, nazwy zmiennych, komunikaty commitów i PR: po angielsku. Treść widoczna dla użytkownika: po polsku, przez `pl.ts` lub `content/`.

## Treść

- Treści redakcyjne wyłącznie w `content/` (MDX + JSON), czytane przez warstwę `src/content/*` zgodną z typami z `docs/brief-claude-code.md` §4. Nigdy w JSX.
- Nazw pól w `src/content/types.ts` nie zmieniaj – model jest współdzielony z przyszłym projektem.
- Dane przykładowe z makiet oznaczasz `sample` (nazwa pliku lub pole `"sample": true`) i dopisujesz do `docs/plan-claude-code.md` §5.
- Fakty z `docs/brief-claude-code.md` §8 (maile, telefon, daty, nazwa, adres, tematy `mailto:`) wpisuj dosłownie. Wartości niepotwierdzonych nie zgaduj – zostaw puste pole i zgłoś.
- Nie generuj treści za klienta: cytatów, opisów, tytułów wykładów, bio. Placeholder `[do uzupełnienia: …]` zamiast wymyślonego tekstu.
- Nie ruszaj `content/` poza zakresem bieżącego kawałka.

## Rytm pracy (szczegóły: docs/plan-claude-code.md §1)

- Praca idzie pod-etapami; każdy ma plan w `docs/plans/0N-*.md`. Bez zatwierdzonego planu nie piszesz kodu w danym pod-etapie.
- Sesja planistyczna: czytasz, pytasz po jednym pytaniu, proponujesz podział na kawałki. Plan zapisujesz dopiero na „zapisz plan”.
- Implementujesz jeden kawałek z planu naraz. Po każdym kawałku zatrzymujesz się i składasz meldunek w tym formacie:
  ```
  ## Checkpoint N/M — [nazwa kawałka]
  Zrobione: [pliki utworzone/zmienione, jednym zdaniem co w każdym]
  Odstępstwa od planu / makiety: [co i dlaczego — albo „brak”]
  Do decyzji: [pytania — albo „brak”]
  Następny krok: [kawałek N+1, jednym zdaniem]
  Build/lint: [OK / co nie przechodzi]
  Czekam na OK.
  ```
- Kolejny kawałek zaczynasz dopiero po „OK” użytkownika. „OK z uwagami” = najpierw uwagi, potem kawałek.
- Jeśli plan okazuje się błędny w trakcie – przerywasz, meldujesz, proponujesz korektę planu. Nie improwizujesz poza planem.
- Po każdym checkpoincie aktualizujesz sekcję „Postęp” w pliku planu.
- Zadania spoza planu (pytanie, drobna poprawka) też kończysz krótkim meldunkiem: co zmienione, w których plikach.

## Definicja „gotowe” dla kawałka

`npm run build` i `npm run lint` przechodzą; zmiana obejrzana na 390px (mobile) i na desktopie; nawigacja klawiaturą działa tam, gdzie kawałek dotyka interakcji; brak tekstu redakcyjnego w JSX; nowe dane `sample` dopisane do planu §5.

## Git

- Gałąź `feat/0N-nazwa` per pod-etap.
- Nigdy nie commitujesz sam. Commity, push i merge wykonuje właściciel repo po „OK”. Możesz zaproponować komunikat commita (po angielsku, format `0N/K: short description`).
- Nie używaj `git commit`, `git push`, `git reset`, `git rebase`, `git checkout -- .` ani `git stash` bez wyraźnej prośby. `git status`, `git diff`, `git log` – zawsze wolno.

## Nie rób

- Nie dotykaj `.env*`, `next.config.ts` (poza uzgodnionymi przekierowaniami 301 w pod-etapie 8) ani plików w `design/`.
- Nie uruchamiaj migracji z WordPressa ani żadnych zapytań do `akademiaikony.pl` przed pod-etapem 8.
- Nie usuwaj i nie przenoś plików poza zakresem kawałka; nie „porządkuj przy okazji”.
- Nie dodawaj banera cookies, `localStorage`, zewnętrznych skryptów ani analityki bez planu, w którym to jest zapisane.
