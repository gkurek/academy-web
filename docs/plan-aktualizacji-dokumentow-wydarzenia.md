# Zadanie: aktualizacja dokumentacji po decyzji o likwidacji działu „Wydarzenia”

**Tryb pracy:** edytujesz wyłącznie dokumenty (`docs/`, `CLAUDE.md`, briefy). **Nie zmieniaj kodu** w `src/` ani `content/`. Zmiany w kodzie trafiają do planów etapów 7 i 8 i zostaną zrobione w ramach tych etapów. Nie commituj (K-12). Na koniec pokaż listę zmienionych plików z jednozdaniowym opisem każdej zmiany.

**Najpierw znajdź pliki.** Nazwy w repo mogą się różnić od tych w tym dokumencie. Pełny brief może się nazywać np. `akademia-ikony-brief-v2.md`. Zrób `grep -rn -i "wydarzen\|/wydarzenia\|Event\b\|kategoria=\|wernisa\|poświęc\|oprowadz\|wyjazd"` po `docs/` i `CLAUDE.md`. Każde trafienie musi być po zadaniu zaktualizowane albo świadomie zostawione jako zapis historyczny (dzienniki, zamknięte plany etapów 01–06: tam **nie przepisuj historii**, najwyżej dopisz odsyłacz do K-50).

---

## 1. Decyzje do wpisania (rejestr §4 w `plan-claude-code.md`, data 2026-09-21)

| #    | Decyzja | Etap | Wybór |
|------|---------|------|-------|
| K-50 | Dział „Wydarzenia” | 7, 8 | **Likwidujemy jako sekcję i pozycję menu.** Menu główne: O Akademii · Warsztaty · Wykłady · Ikony · **Aktualności** · Kontakt. Trasa `/wydarzenia` nie powstaje; stare adresy przekierowane (§3). Uzasadnienie: jedyna żywa treść działu to coroczna wystawa; reszta to archiwum 2013–2020, a kategorie „Poświęcenia/Oprowadzania/Wyjazdy” pokazywałyby 1–3 wpisy sprzed dekady. |
| K-51 | Wystawa „Ikona – korzenie i owoce wiary” | 8 | **Własna strona `/ikony/wystawa`.** `SectionNav` Ikony: Galeria · Wystawa · Ikony na zamówienie. Stan faktyczny (potwierdzone przez EJK 2026-09-21): wystawa jest **w kościele na stałe**, a **zestaw ikon zmienia się co roku** (nowa edycja z wernisażem na koniec roku akademickiego, w okolicach wspomnienia św. Brata Alberta, 17.06). Strona: opis stały → bieżąca edycja → oprowadzania kuratorskie → poprzednie edycje. |
| K-52 | Aktualności jako jeden strumień | 7 | **Aktualności przejmują archiwum dawnych wydarzeń.** Każdy wpis ma typ (`kind`) wyświetlany jako mała etykieta. **Bez filtrów kategorii w v1.** Wpisy grupowane latami. K-06 (paginacja) pozostaje otwarte, ale do rozważenia w sesji etapu 7: grupowanie latami może zastąpić klasyczną paginację. |
| K-53 | Model treści | 7, 8 | **Typ `Event` usunięty.** `News` dostaje `kind`, `dateEnd?`, `images?`, `poster?`. Nowy typ `ExhibitionEdition` (§2). |
| K-54 | Edycja bez materiału | 8 | **Edycja wystawy bez zdjęć = jedna linijka** na liście poprzednich edycji (rok, tytuł/podtytuł), bez pustej karty. Karta z galerią tylko gdy są zdjęcia. Strona ma dobrze wyglądać przy rzadkich aktualizacjach. |
| K-55 | Poświęcenia ikon | 10 (+ Publikacje) | **Tekst przechodzi do Publikacji jako artykuł** („Podpisanie i poświęcenie ikony”). EJK zgodziła się na przeniesienie i redakcję (2026-09-21). Do poprawy przy redakcji: porównanie do chrztu i sakramentów (poświęcenie jest sakramentalium). Układ Publikacji zostaje do osobnej sesji (odłożone). Krótka wzmianka na `/ikony/na-zamowienie` zależy od D-05 (nadal otwarte). |
| K-56 | Wyjazdy studyjne | 6, 7 | **Nie są obecnie planowane, ale nie zostały zakończone.** Copy w czasie teraźniejszym **zostaje** (OA-62 bez zmian, decyzja EJK). Dawne wyjazdy trafiają do Aktualności jako wpisy `kind: 'wyjazd'`. Brak osobnej podstrony. |
| K-57 | Historia plenerów | 8 | **Nowa sekcja „Gdzie byliśmy” na `/warsztaty/letnia-szkola-swiatla`**: lista miejsc dotychczasowych plenerów (Święta Lipka, Wesoła, Supraśl, Gruzja, Litwa; Gródek do potwierdzenia). Część „wyjazdów studyjnych” z WP to w rzeczywistości plenery. |
| K-58 | Strona główna | 8 | Kafel 3 „Najbliższe” przestaje być `[przykład]`: wystawa realnie istnieje (K-51). Link → `/ikony/wystawa`. Treść zależna od stanu (§2). Opis filaru „Ikony” skrócony do: galeria, wystawa, ikony na zamówienie (bez poświęceń, oprowadzań, wyjazdów). |

---

## 2. Model treści: zmiany w `brief-claude-code.md` §4 (i odpowiedniku w pełnym briefie)

Zastąp `Event` i rozszerz `News`:

```ts
type NewsKind =
  | 'aktualnosc'
  | 'wyklady'
  | 'warsztaty'
  | 'plener'
  | 'wystawa'
  | 'oprowadzanie'
  | 'wyjazd'
  | 'spotkanie';

type News = {
  slug: string;
  title: string;
  date: string;
  dateEnd?: string;
  kind: NewsKind;
  excerpt?: string;
  body: string;
  cover?: Image;
  images?: Image[];
  poster?: Image;
};

type ExhibitionEdition = {
  year: number;
  title: string;                 // „Ikona – korzenie i owoce wiary”
  subtitle?: string;             // np. „Świętych obcowanie” (2019)
  vernissage?: string;           // ISO; data wernisażu
  seasonTheme?: string;          // temat sezonu wykładów, np. „Mistyka dziś”
  iconCount?: number;
  poster?: Image;
  photos?: Image[];              // brak lub [] → edycja jako linijka (K-54)
  summary?: string;              // 2–3 zdania: co nowego w tej edycji
  tours?: { date: string; topic: string }[];
  newsSlug?: string;             // opcjonalny wpis w Aktualnościach z relacją
};

// Wystawa jest w kościele stale (K-51), więc nie ma stanu „po wystawie”.
type ExhibitionState = 'zapowiedz' | 'biezaca';

const getExhibitionState = (next: ExhibitionEdition | undefined, now: Date): ExhibitionState =>
  next?.vernissage && now < new Date(next.vernissage) ? 'zapowiedz' : 'biezaca';

const editionsWithGallery = (editions: ExhibitionEdition[]) =>
  editions.filter((e) => (e.photos?.length ?? 0) > 0);
```

Kafel „Najbliższe” (K-58):
- stan `biezaca`: „Wystawa ikon · edycja {rok}”, tekst „Czynna w godzinach otwarcia kościoła”;
- stan `zapowiedz`: „Wernisaż {data}” z nową edycją, tekst o oprowadzaniach.

Źródło danych: `content/exhibition/editions.json` + treść stała `content/exhibition/page.mdx`. Opisz to w §4 briefu, bez implementacji.

Zasady kodu jak dotąd: TypeScript, bez `for`/`for…of`, tylko `map`/`filter`/`reduce`/`forEach`.

---

## 3. Mapa strony, nawigacja, przekierowania

**`brief-claude-code.md` §3 i pełny brief §3/§4.1:**
- Mapa strony: usuń `/wydarzenia`; dodaj `/ikony/wystawa  stała wystawa w kościele, edycje roczne, oprowadzania`; `/aktualnosci  lista z typem wpisu (w tym archiwum wystaw, oprowadzań, wyjazdów, plenerów)`.
- Menu główne: O Akademii · Warsztaty · Wykłady · Ikony · Aktualności · Kontakt.
- Huby sekcji: usuń `/wydarzenia` z listy hubów.
- `SectionNav`:
  - Ikony: **Galeria · Wystawa · Ikony na zamówienie**;
  - usuń wiersz „Wydarzenia: Wszystkie · Wystawy · Poświęcenia…” i zapis o `?kategoria=`.
- Stopka: Aktualności są teraz w menu głównym; w stopce zostają w mapie strony. Publikacje zostają w stopce.

**Tabela przekierowań (§5 briefu Claude Code, tabela w pełnym briefie):**

| Stary URL | Nowy URL |
|---|---|
| `/ikona/wystawy/`, `/wernisaze/` | `/ikony/wystawa` |
| `/oprowadzania-kuratorskie/` | `/ikony/wystawa#oprowadzania` |
| `/wydarzenia/` | `/aktualnosci` |
| `/wyjazdy-studyjne/` | `/aktualnosci` |
| `/poswiecenia-ikon/` | docelowy artykuł w `/publikacje` (slug ustalony w sesji Publikacji); do tego czasu `/publikacje` |
| `/ikona-korzenie-i-owoce-wiary-2/` i wpisy wystaw z lat 2015–2018 | `/ikony/wystawa` |
| pojedyncze wpisy oprowadzań 2017 (`/ikony-emaliowane/`, `/ikona-trojcy-swietej/`, `/ikona-serca-jezusa/`, `/wystawa-ikona-korzenie-i-owoce-wiary-oprowadzania-kuratorskie/`) | jeden połączony wpis w `/aktualnosci/[slug]` (§5) |
| pozostałe wpisy wystaw i wyjazdów | odpowiadające wpisy `/aktualnosci/[slug]` |

Zasada ogólna w briefie: „brak osobnej trasy dla wydarzeń; wydarzenia to wpisy Aktualności z `kind`”.

---

## 4. Plan główny (`plan-claude-code.md`)

1. **§3, etap 7 — Aktualności:** do zakresu dopisz `kind` + etykieta typu na `NewsCard` i we wpisie, grupowanie latami, galeria zdjęć i plakat we wpisie (`images`, `poster`), dane `sample` z mieszanką typów (także wpisy archiwalne 2013–2020). Dopisz do DoD: „wpisy wszystkich `kind` renderują się w jednym szablonie; brak filtrów kategorii”. Do pytań: K-06 w kontekście grupowania latami.
2. **§3, etap 8 — Strony pozostałe:** usuń z zakresu `/wydarzenia` z `EventCard` i filtrami. Dodaj:
   - `/ikony/wystawa` (opis stały, bieżąca edycja, oprowadzania, poprzednie edycje wg K-54; `SectionNav` Ikony z nową pozycją);
   - aktualizacja nawigacji i stopki (K-50);
   - kafel „Najbliższe” zależny od stanu (K-58) i skrócony opis filaru „Ikony”;
   - sekcja „Gdzie byliśmy” na LSŚ (K-57).
   Zmień kawałki na: (1) kontakt + `MapBlock`; (2) wystawa + nawigacja + zmiany na home i LSŚ; (3) publikacje + polityka + 404. Przy „publikacje” dopisz: „**układ do ponownej sesji planistycznej** — obecny zakres (zakładki: artykuły, multimedia, plakaty) do rewizji”. Usuń pytanie „domyślna kategoria na `/wydarzenia`”.
3. **§3, etap 10 — Migracja:** dopisz zasady z §5 niniejszego dokumentu.
4. **§3, etap 9 — JSON-LD:** rozważ `ExhibitionEvent` dla bieżącej edycji wystawy (tylko notatka, bez decyzji).
5. **§5 Treści makietowe:**
   - wiersz „Najbliższe… trzeci wpis («Wystawa stała») pozostaje `[przykład]`” → zmień „Zastąpić czym” na „dane bieżącej edycji z `editions.json` (K-58); istnienie wystawy potwierdzone 2026-09-21”;
   - nowe wiersze (wszystkie ⬜):
     - edycje wystawy 2015–2026: tytuły, podtytuły, daty wernisaży, zdjęcia, liczba ikon (`content/exhibition/editions.json`, etap 8, EJK + archiwum WP + Facebook Akademii);
     - opis stały wystawy (`content/exhibition/page.mdx`, etap 8, redakcja na bazie wpisu WP „Podsumowanie roku 2019 i 2020”);
     - lista miejsc „Gdzie byliśmy” (`content/offers/plener.mdx`, etap 8, potwierdzenie EJK, w tym Gródek);
     - zgoda Roberta Rumina na publikację komentarza z metryczki ikony Serca Jezusa (etap 10);
     - korekta EJK w tekście o Trójcy Świętej (etap 10);
     - artykuł o poświęceniu ikon po redakcji (etap 10 / sesja Publikacji).
6. **§6 Dziennik:** wpis 2026-09-21: „Likwidacja działu Wydarzenia (K-50…K-58). Wystawa → `/ikony/wystawa`, archiwum wydarzeń → Aktualności z `kind`, poświęcenia → Publikacje, plenery → LSŚ. Odpowiedzi EJK: wystawa stała w kościele z roczną wymianą ikon; wyjazdy obecnie niezaplanowane, copy w czasie teraźniejszym zostaje; zgoda na przeniesienie i redakcję tekstu o poświęceniu. Publikacje odłożone do osobnej sesji.”

---

## 5. Zasady migracji treści do etapu 10 (dopisz do planu i do §5 briefu Claude Code)

- **Wpis zbiorczy „IKONA – KORZENIE I OWOCE WIARY 2018…2025”:** rozbić na rekordy `ExhibitionEdition`. Tytuł z listą lat nie jest migrowany. Zdjęcia 2025 przypisać do edycji 2025.
- **„Podsumowanie roku 2019 i 2020 – wystawy”:** akapit opisujący aranżację wystawy (ikony Chrystusa, Matki Bożej, Trójcy i świąteczne z przodu lewej nawy; ikony świętych przy wejściu zwrócone ku ołtarzowi; stolik ikonografa z ćwiczeniami, paletą i metryczkami; księga pamiątkowa; dyżury uczniów) jest **źródłem opisu stałego** na `/ikony/wystawa` — redakcja, nie kopia 1:1. Pozostałe wydarzenia z tego wpisu (Noc Świątyń 21.09.2019, „Ikona okno duszy” X 2019, plener w Świętej Lipce 3–10.08.2019) → osobne wpisy Aktualności z właściwym `kind`.
- **Oprowadzania 2017 (4 wpisy) → jeden wpis** `kind: 'oprowadzanie'`, 2017, „Oprowadzania po wystawie: Serce Jezusa, Trójca Święta, ikony emaliowane”, krótkie zredagowane opisy + 3–4 najlepsze zdjęcia.
  - **Serce Jezusa: NIE migrować części merytorycznej.** Tekst od „Biblia wspomina o sercu ludzkim prawie 300 razy…” do końca jest niemal dosłowną, niepodpisaną kopią artykułu z gotquestions.org/Polski/serce.html (protestancki serwis apologetyczny). Zachować tylko informację o oprowadzaniu, zdjęcie ikony i komentarz Roberta Rumina — ten ostatni wyłącznie po jego zgodzie (§5 planu).
  - **Trójca Święta:** zdanie o „jedynym kanonicznym przedstawieniu Boga” do korekty przez EJK (chodzi o przedstawienie Trójcy).
  - **Ikony emaliowane:** usunąć ostatnie zdanie („Dzieciom się to podobało…”); wątek warsztatów EJK z dziećmi w Gruzji odnotować jako materiał do biogramu/Pracowni.
- **Wpisy wystaw 2013–2018** (Wilno 2013, „Ikona dziś” 2015, Powsin 2015/16, „Niebo na ziemi” 2016, „Sztuka i modlitwa” — Katedra 2018, „Korzenie i owoce wiary” 2018): wystawy w KŚT kończące rok → edycje w `editions.json` (od 2015; rok początkowy do potwierdzenia z EJK); wystawy poza KŚT → wpisy Aktualności `kind: 'wystawa'`.
- **Wyjazdy studyjne:** „Wyjazd śladami ikon prof. Jerzego Nowosielskiego” i „Spotkania z Grzegorzem Zinkiewiczem” → Aktualności `kind: 'wyjazd'` / `'spotkanie'`. „Wakacyjne wyjazdy studyjne – Gródek” → `kind: 'plener'`, jeśli EJK potwierdzi, że był to plener LSŚ; miejsce trafia też do „Gdzie byliśmy”.
- **Poświęcenia:** tekst + 6 zdjęć → materiał artykułu (K-55), redakcja z EJK.
- **Hub `/wydarzenia/` (akapit „Wydarzeniem jest dla nas coś nieprzewidywalnego…”):** nie migrować.
- **Plakaty z `/publikacje/plakaty/`:** propozycja do sesji Publikacji — przypisać plakaty do edycji wystaw (`poster`) i wpisów Aktualności. Na razie tylko zanotuj, bez decyzji.

---

## 6. Pozostałe dokumenty

- **`docs/copy-o-akademii-pracownia.md`:**
  - OA-55 i OA-63 (`TextLink → /wydarzenia`) → zmień cel na `/aktualnosci`, etykieta „Aktualności” (lub oznacz do decyzji, jeśli etykieta ma zostać „Wydarzenia” — wtedy link do `/aktualnosci` z tą etykietą jest mylący; zaproponuj „Z życia Akademii” jako wariant);
  - OA-62 `ActivityList`: **bez zmian w treści** (K-56);
  - pytanie 8 w „Pytania do klientki”: oznacz jako rozstrzygnięte dla wyjazdów (2026-09-21, K-56); część o koncertach, udostępnianiu ikon i konsultacjach zostaje otwarta;
  - pozycja 5 ActivityList (Poświęcenia): dopisz uwagę, że docelowo może linkować do artykułu (K-55).
- **`docs/plans/06-o-akademii.md`:** jeśli wdrożone linki OA-55/OA-63 prowadzą do `/wydarzenia`, dopisz w sekcji odstępstw/backlogu: „link do podmiany na `/aktualnosci` w etapie 8 (K-50)”. Nie zmieniaj statusów.
- **`docs/plans/01-skeleton.md`:** tylko dopisek pod decyzją o `sectionNav.wydarzenia`: „zastąpione przez K-50/K-51 (2026-09-21), zmiana w kodzie w etapie 8”.
- **`docs/plans/02-homepage.md`:** dopisek przy kaflu „Wystawa stała”: „rozstrzygnięte K-58”.
- **`CLAUDE.md`:** jeśli zawiera mapę strony, menu lub `Event` — zaktualizuj zgodnie z §2–3.
- **Instrukcja pracy (`instrukcja-pracy.md` lub odpowiednik):** w kolejności stron zamień „wydarzenia/publikacje” na „wystawa/publikacje”.
- **Pełny brief, §10.3 (macierz własności treści):** wiersz „Aktualności Akademii, wydarzenia (wystawy, poświęcenia, wyjazdy)” → „Aktualności Akademii (w tym wystawy, oprowadzania, wyjazdy, plenery); wystawa roczna w dziale Ikony”.
- **Pełny brief, §2 (tabela problemów, „Duplikaty w nawigacji”):** dopisz „rozwiązane K-50/K-51”.
- **Pełny brief, dziennik zmian:** nowa wersja (2.x) z opisem zmian z tego dokumentu.

---

## 7. Otwarte pytania do EJK (dopisz do odpowiedniej listy pytań w repo)

1. Od którego roku liczymy edycje wystawy w KŚT: 2015 („Ikona dziś”), 2016 („Niebo na ziemi”) czy 2017 (pierwsza pod obecną nazwą)?
2. Czy są zdjęcia z wernisaży z lat 2018–2025 (np. na Facebooku Akademii)?
3. Kto po każdym wernisażu przesyła materiały (10–15 zdjęć, 2–3 zdania, daty i tematy oprowadzań) i w jakim terminie?
4. Czy Gródek był plenerem Letniej Szkoły Światła? Czy lista „Gdzie byliśmy” jest pełna?
5. D-05: czy ikony na zamówienie są oferowane z poświęceniem?
6. Zgoda Roberta Rumina na publikację komentarza z metryczki.
