# Plan wpisów cyklicznych w Aktualnościach — dla redakcji (EJK)

**Data:** 2026-10-04  
**Cel:** w jednym miejscu opisać, **co co roku publikujemy**, **kiedy to aktualizować**, **co ma być w treści**, oraz **co dziś robi się ręcznie**, a **co później może pomóc CMS**.  
Techniczny opis pól i szablonów: `docs/wpisy-cykliczne-aktualnosci-ejk.md`.

---

## Idea w skrócie

Aktualności to jeden kanał: zapowiedzi i relacje z tego samego miejsca. Co ważne „teraz” (nabór, wernisaż, plener) widać też na **stronie głównej** w sekcji **Najbliższe** oraz na stronach ofert / wystaw — wpis w Aktualnościach to **pełniejszy tekst, zdjęcia i archiwum**.

Dla wydarzeń z datą stosujemy **jeden adres wpisu (slug)** na cały rok:

1. **Zapowiedź** — zanim wydarzenie się skończy (zaproszenie, terminy, przyciski zapisów).
2. **Relacja** — po terminie, gdy są zdjęcia i krótki opis „jak było”.

Nie zakładamy osobnego wpisu „tylko zaproszenie” i drugiego „tylko relacja”, chyba że redakcja świadomie zdecyduje inaczej (wyjątek).

---

## Rytm roku — cztery filary

| Kiedy (orientacyjnie) | Temat wpisu | Po co |
| --- | --- | --- |
| **Wrzesień (IX)** | Nowy rok w Akademii + nabór na kurs + program wykładów | Jeden wpis zastępuje dawną osobną „zapowiedź wykładów”; start sezonu |
| **Marzec (III)** | „Z pracowni” + zapisy na Letnią Szkołę Światła | Pokazać pracę w pracowni i otworzyć nabór na plener |
| **Czerwiec (VI)** | Wernisaż wystawy dorocznej | Zaproszenie → fotorelacja z ekspozycji w KŚT |
| **Sierpień–wrzesień (VIII–IX)** | Relacja z Letniej Szkoły Światła | Plener, modlitwa, poświęcenie ikon — głównie galeria |

**Rezerwy (1–2× w roku lub rzadziej):** wystawa wyjazdowa, spotkanie z gościem, Noc Muzeów / Noc Świątyń, krótkie wspomnienie — według potrzeb, bez sztywnego harmonogramu.

---

## Co ma zawierać typowy wpis

### Wspólne dla wszystkich

- **Tytuł** z rokiem lub sezonem (np. „Wystawa doroczna 2026”, „Nowy rok w Akademii 2026/2027”).
- **Data** publikacji (data wydarzenia lub data pierwszego ogłoszenia).
- **Lead (zajawka)** — 1–3 zdania widoczne na liście i na górze wpisu.
- **Treść** — krótki tekst; przy relacji często wystarczy 1–3 akapity + galeria.
- **Zdjęcia:** każde z **podpisem dla niewidomych (alt)**; opcjonalnie podpis widoczny pod zdjęciem.
- **Plakat:** bez osobnego pola — jeśli jest, jako **pierwsze zdjęcie** w galerii z podpisem „Plakat”.

### Zapowiedź (`layout: wydarzenie`, przed końcem terminu)

- Terminy w **bloku faktów** (godzina, miejsce, nabór do kiedy, cena jeśli dotyczy).
- **Przyciski zapisów** (mail / strona kursu / wykłady / wystawy).
- Zdjęcia opcjonalne (plakat lub jeden kadr).

### Relacja (po terminie, galeria uzupełniona)

- Tekst „jak było”; **4–12+ zdjęć** (wystawa, plener).
- Zamiast przycisków zapisów — spokojne linki **„Powiązane”** (kurs, wykłady, wystawy, LSŚ).

---

## Kiedy co zmieniać — kalendarz redakcyjny

| Miesiąc | Działanie |
| --- | --- |
| **VIII–IX** | Wpis „Nowy rok…”: najpierw zapowiedź naboru i wykładów; po rozpoczęciu zajęć — dopisać relację / zdjęcia (ten sam slug). |
| **III** | Wpis z pracowni + CTA na LSŚ; po naborze można zostawić sam tekst lub przejść w relację po plenerze (ten sam slug albo osobny wpis po plenerze — do ustalenia co roku). |
| **VI** | Wpis wernisażu: zapowiedź przed datą; w ciągu ~2 tygodni po wernisażu — zdjęcia i relacja (zgodnie z notatką operacyjną: data, podtytuł, 0–5 zdjęć minimum). |
| **VIII–IX** | Relacja LSŚ po plenerze. |
| **Ad hoc** | Wyjazdy, oprowadzania, spotkania — gdy są materiały. |

**Ważne:** daty w treści (nabór, wernisaż, koniec wystawy) wpływają na to, co pokazuje **Najbliższe** na stronie głównej. Po zmianie dat w ofercie lub w `annual.json` warto sprawdzić staging po **odświeżeniu strony** (dziś: codzienny rebuild — patrz etap 11).

---

## Wersja obecna (bez CMS)

| Co | Jak to dziś działa |
| --- | --- |
| **Pliki** | Każdy wpis = plik `content/news/[slug].mdx` + zdjęcia w `public/media/news/…` |
| **Publikacja zmian** | Edycja w repozytorium → build → wdrożenie (Vercel). Redakcja nie klika „Opublikuj” w panelu. |
| **Zapowiedź vs relacja** | System **sam** przełącza fazę wpisu `layout: wydarzenie` wg daty w pliku (`date`, `dateEnd`) i tego, czy w `images[]` są zdjęcia — **przy buildzie**. Żeby pokazać relację, trzeba uzupełnić zdjęcia i ewentualnie tekst, potem znów wdrożyć. |
| **Program wykładów w IX** | Tekst / lista w MDX (tabela lub lista); link do `/wyklady`. |
| **Wystawa doroczna** | Daty i zapowiedź także na `/ikony/wystawy`; wpis w Aktualnościach = pełniejsza zapowiedź i relacja. |
| **Co robi EJK / sekretariat** | Dostarcza tekst, daty, zdjęcia z altami; ktoś techniczny wstawia do plików (gate przed merge). |
| **Czego nie da się „kliknąć”** | Automatyczne wysłanie maila, zapamiętanie szkicu w przeglądarce, zaplanowanie publikacji na przyszłą godzinę — wszystko przez commit i deploy. |

---

## Wersja z CMS (później, osobny projekt)

| Co | Oczekiwany zysk |
| --- | --- |
| **Formularz wpisu** | Pola: tytuł, data, rodzaj (`kind`), układ (`layout`), lead, treść, galeria, fakty, powiązane linki — bez dotykania MDX. |
| **Fazy zapowiedź / relacja** | Te same reguły dat co dziś, ale redaktor **widzi podgląd** („teraz widać zapowiedź / relację”) przed publikacją. |
| **Szablony cykliczne** | Przycisk „Nowy wpis: wernisaż 2027” — wstawia szkielet tytułu, `kind: wystawa`, `layout: wydarzenie`, przykładowe `facts`. |
| **Najbliższe** | Nadal liczone z dat w ofertach i wystawach; CMS nie zastępuje tych danych — tylko wpisy Aktualności. |
| **Wykłady** | Docelowo program sezonu może ciągnąć dane z **CMS wykładów**; wpis IX może być skrótem + link (decyzja K-128 / D3). |
| **Co nadal ręcznie** | Wybór zdjęć, altów, merytoryczna redakcja, akceptacja przed publikacją; ewentualnie zdjęcia nadal upload + kadrowanie poza CMS. |
| **Automatyzacja ograniczona** | Przypomnienia „za tydzień wernisaż — uzupełnij relację” możliwe jako workflow mailowy, nie jako magia w stronie. |

---

## Checklist dla EJK przed każdym filarem

**IX — Nowy rok**

- [ ] Tytuł z sezonem 202X/202Y  
- [ ] Daty naboru na kurs (z briefu / oferty)  
- [ ] Skrót programu wykładów lub odesłanie do `/wyklady`  
- [ ] Po starcie: 1–3 zdjęcia z zajęć  

**III — Pracownia + LSŚ**

- [ ] 2–4 kadry z pracowni  
- [ ] Termin i miejsce pleneru z oferty LSŚ  
- [ ] CTA na stronę LSŚ  

**VI — Wernisaż**

- [ ] Tekst zaproszenia, godzina, adres KŚT  
- [ ] Po wernisażu: galeria + alt każdego zdjęcia  

**VIII–IX — LSŚ**

- [ ] Relacja, miejsce pleneru, galeria poświęcenia / pracy  

---

## Powiązane dokumenty

- `docs/wpisy-cykliczne-aktualnosci-ejk.md` — pola techniczne i `layout`  
- `docs/plans/10-finishing.md` k8, `docs/plan-claude-code.md` §5 poz. T15  
- Decyzje: K-128, K-136 (Najbliższe), K-139 (wykłady ↔ wpisy)
