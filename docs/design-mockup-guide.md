# Jak poprawnie czytać `design/*.dc.html`

> Powstało po pod-etapie 2 (Hero na stronie głównej), gdzie dwa razy zgadłem
> zamiast odczytać — raz zły plik obrazu, raz zły rozmiar. Czytaj to przed
> każdym kawałkiem, w którym bierzesz obraz albo dokładną wartość stylu
> wprost z makiety `Akademia Ikony - kierunki wizualne.dc.html`.

## 1. `design/uploads/` — nie tylko `design/assets/`

`design/README` opisuje `assets/icons/` i `assets/photos/` jako foldery handoffu
i to jedyne, na które wskazuje jego „Indeks”. Ale markup `.dc.html` odwołuje się
do obrazów po **oryginalnych nazwach WordPressa** (`src="uploads/Chrystus212m_n.jpg"`,
`src="uploads/17499269_...n.jpg"` itd.), a te pliki — pod dokładnie tymi nazwami —
leżą w `design/uploads/`, folderze nigdzie w README nie wymienionym.

**Zasada:** dla każdego slotu obrazu znajdź literalny `src="uploads/NAZWA"` w
`.dc.html` (grep po tekście z sekcji, np. nagłówku), i skopiuj dokładnie ten plik
z `design/uploads/`. Nie wybieraj „pasującego tematycznie” zdjęcia z `assets/` na
oko — to zgadywanie, nawet jeśli czasem trafne.

Jeśli obraz do danego slotu już wziąłeś z `assets/`, możesz sprawdzić, czy to na
pewno ten sam plik co w `uploads/`, porównując rozmiar w bajtach (albo hash):

```bash
node -e "console.log(require('fs').statSync('design/uploads/X.jpg').size, require('fs').statSync('design/assets/photos/Y.jpg').size)"
```

Zgodność rozmiaru w bajtach = to ten sam plik (assets/ to zmieniona tylko nazwa,
nie przetworzone od nowa zdjęcie).

## 2. Nigdy nie otwieraj `.dc.html` jako `file://` w Browser tool

Plik ma placeholdery `{{ nazwaZmiennej }}` (np. `{{ heroStyleDesktop }}`,
`{{ heroSrc }}`), rozwiązywane w przeglądarce przez `design/support.js` w czasie
działania. Browser tool renderuje pliki `file://` spoza serwera jako **statyczny
snapshot bez wykonania JS** — placeholdery zostają dosłownym tekstem, obrazy się
nie ładują (404), style są puste. Wygląda to na błąd/małe wymiary, a to tylko
tryb podglądu.

**Zasada:** zawsze serwuj `design/` lokalnie przed odczytem:

```bash
cd design && python -m http.server 8791
```

(port dowolny wolny; `python`/`py` jest na tej maszynie — sprawdzone). Potem w
Browser tool:

```
navigate → http://localhost:8791/Akademia%20Ikony%20-%20kierunki%20wizualne.dc.html
```

Dopiero na tak wczytanej stronie `getComputedStyle()` / `getBoundingClientRect()`
(przez `javascript_tool`) dają realne, rozwiązane wartości — nie zgaduj z surowego
tekstu `.dc.html`, bo tam wartość może być literalnym, nierozwiązanym `{{ }}`.

Po skończonej weryfikacji **zabij serwer**, żeby nie zostawiać sierocych procesów:

```bash
taskkill //F //IM python.exe
```

(Windows; dostosuj jeśli użyjesz innego serwera).

### Nawigacja po sekcjach

- Plik ma dziesiątki sekcji (`id="1a"`, `id="2a-wyklady"`, …) i skoki przez
  `#kotwica` w URL nie zawsze trafiają we właściwe miejsce przy pierwszym
  ładowaniu — użyj `find` po fragmencie tekstu z szukanej sekcji, potem
  `scroll_to` na zwróconym `ref`, zamiast polegać wyłącznie na kotwicy.
- Strona home ma **dwie kopie** tego samego nagłówka (desktop `#1a` i mobile
  `#3b`) — `find` zwróci oba. Nie zgaduj po samym tekście, który jest który;
  zweryfikuj przez `getBoundingClientRect()`/screenshot, sprawdzając szerokość
  karty (`width: 1180px` desktop vs `width: 390px` mobile) albo obecność stylu
  `heroStyleMobile` vs `heroStyleDesktop` w atrybucie `style` znalezionego
  obrazu.

## 3. `{{ }}` w surowym markupie = makieta nie ma tu specyfikacji

Jeśli dany atrybut w `.dc.html` to nierozwiązany placeholder, to znaczy że
makieta **nie definiuje** konkretnej wartości dla tego miejsca — nie ma czego
kopiować. Nie wolno wymyślić liczby i zapisać jej w kodzie jako „zgodną z
makietą". Zamiast tego: wczytaj przez lokalny serwer (punkt 2) i odczytaj
realnie wyrenderowaną wartość. Jeśli i to nic nie da (bo np. wartość zależy od
treści, której jeszcze nie ma), zgłoś to jako otwarte pytanie w checkpoincie,
zamiast zgadywać.

## 4. Przykład z tej sesji (Hero na stronie głównej, pod-etap 2)

- **Zły traf:** `design/assets/photos/wystawa-stala.jpg` jako obraz Hero —
  temat (wystawa ikon) pasował skojarzeniowo, ale to nie jest zdjęcie użyte w
  makiecie; plan (`docs/plan-claude-code.md` §3) zresztą wprost mówi „Hero
  (**ikona** + …)", nie „zdjęcie".
- **Dobry traf, ten sam plik:** `design/uploads/Chrystus212m_n.jpg` ==
  `design/assets/icons/chrystus.jpg` (identyczne bajty) — to jest właściwy
  obraz Hero.
- **Zgadnięty (źle) rozmiar:** wymyśliłem `height: 420px` desktop / stałą
  wysokość `260px` mobile, bo tyle miał domyślny przykład w
  `design/components/content/Hero.jsx` (komponent ogólnego przeznaczenia, nie
  ta konkretna instancja na stronie głównej).
- **Realny rozmiar** (z rozwiązanego DOM, odczytany przez lokalny serwer):
  - desktop: `height: 760px; width: auto; max-width: 100%; object-fit: contain;
    margin: 0 auto; box-shadow: 0 30px 70px rgba(0,0,0,.55)`
  - mobile: `width: 62%; height: auto; margin: 0 auto; box-shadow: 0 20px 50px
    rgba(0,0,0,.5)` — i obraz na mobile jest **nieopakowanym rodzeństwem**
    karty w DOM, więc `62%` liczy się od pełnej szerokości karty (390px), nie
    od kolumny tekstu już pomniejszonej o jej własny padding boczny.
