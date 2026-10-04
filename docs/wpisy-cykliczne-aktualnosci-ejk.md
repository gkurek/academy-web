# Wpisy cykliczne w Aktualnościach — propozycja dla EJK

**Data:** 2026-10-03  
**Kontekst:** decyzje **K-69** (kierunek B), **K-128**, discovery w `docs/archive/plans/10-k3-news.md` (D3–D4).  
**Cel dokumentu:** opis formuły każdego wpisu cyklicznego — pola w CMS, co dostarcza redakcja, układ (`layout`) — do przekazania EJK (mail / rozmowa). Nie zastępuje treści w `content/`; nowe zdania w produkcie nadal przez gate treści.

---

## Zasady wspólne

| Temat | Ustalenie |
| --- | --- |
| Strumień | Jeden kanał Aktualności (zapowiedzi + kronika). „Co teraz” na stronie głównej = sekcja **Najbliższe** (osobny kawałek etapu 10), nie osobna „Kronika”. |
| Jeden wpis, dwie fazy | Wydarzenia z datą (wernisaż, Nowy rok, plener) = **jeden slug**: najpierw **zapowiedź** (przed końcem wydarzenia), potem **relacja** (po terminie + zdjęcia od EJK). Minimum sensowne dla czytelnika = relacja; zaproszenie i tak widoczne w „Najbliższe” i na `/ikony/wystawy` tam, gdzie dotyczy wystawy. |
| Faza w kodzie | Dla `layout: wydarzenie`: **zapowiedź** = dzień builda ≤ koniec wydarzenia; **relacja** = po terminie i `images[]` niepuste; **po terminie** = po terminie, bez zdjęć (bez pełnego CTA, blok „Powiązane”). Koniec wydarzenia: `dateEnd` jeśli jest, inaczej `date` (dzień po = „po terminie”). Stan zależy od daty **builda** strony. |
| `kind` vs `layout` | **`kind`** — etykieta typu na liście (`wyklady`, `wystawa`, `warsztaty`, …). **`layout`** — szablon wpisu (`wydarzenie`, `galeria`, `tekst`, `program`). Formatka CMS ustawia oba. |
| Lead | Z reguły **`excerpt`** = lead na stronie wpisu (powtórzenie początku treści z listy jest zamierzone). Wyjątek: `hideLead: true`. |
| CTA | Pełne przyciski zapisów **tylko w fazie zapowiedzi** (`wydarzenie`). Po terminie: spokojne **„Powiązane”** (link do kursu, wykładów, wystaw, LSŚ — z `kind` lub ręcznie `related[]`). |
| Galeria | Kolejność na stronie: **tekst, potem galeria** (relacja nie „wypycha” krótkiego tekstu pod dziesiątki miniaturek). |
| Plakaty | Bez osobnego pola `poster` — plakat jako **pierwsze zdjęcie** w `images[]` z podpisem „Plakat” (jeśli dotyczy). |

---

## Rytm roku (4 wpisy + rezerwy)

### 1. IX — „Nowy rok w Akademii {sezon}”

| | |
| --- | --- |
| **Kiedy** | Wrzesień (start sezonu akademickiego) |
| **`kind`** | `wyklady` (lub `aktualnosc` jeśli szerszy ton — do ustalenia w CMS) |
| **`layout`** | `wydarzenie` |
| **Cel** | Jednym wpisem: **nabór na kurs** + **program wykładów** na sezon (D3 — zastępuje osobny cykl „wykłady {sezon}” w przyszłości; 15 archiwalnych wpisów wykładowych zostaje jako kronika). |
| **Faza zapowiedź** | Tytuł z sezonem; `excerpt` jako zaproszenie; `facts[]` (np. terminy naboru, start zajęć, miejsce — wg briefu §8); treść MDX: skrót programu lub odnośnik do `/wyklady`; **jedno CTA** (np. zapis na kurs / program wykładów). Zdjęcia opcjonalne lub brak. |
| **Faza relacja** | Po zakończeniu naboru / po pierwszym spotkaniu: 1–3 zdania „rozpoczęliśmy sezon…”, zdjęcia z zajęć lub wernisażu programu; CTA znika, „Powiązane” → `/wyklady`, `/warsztaty/…`. |
| **Co dostarcza EJK** | Tytuł, daty (`date`, opcjonalnie `dateEnd` naboru), `facts`, excerpt, krótki tekst; po evencie — zdjęcia + aktualizacja treści (bez nowego sluga). |
| **Uwagi** | Wpływa na przyszły CMS wykładów (kawałek 6 etapu 10) — jeden wpis zamiast dwóch strumieni. |

### 2. III — „Z pracowni” + zapisy na Letnią Szkołę Światła

| | |
| --- | --- |
| **Kiedy** | Marzec |
| **`kind`** | `warsztaty` lub `aktualnosc` |
| **`layout`** | `wydarzenie` (zapisy) lub `galeria` / `tekst` (jeśli dominuje fotorelacja z pracowni — wtedy bez CTA zapisów w szablonie) |
| **Cel** | Pokazać pracę w pracowni + otworzyć zapisy na **LSŚ** nadchodzącego lata. |
| **Zapowiedź** | `facts` (termin pleneru, miejsce, nabór); CTA → `/warsztaty/letnia-szkola-swiatla`. |
| **Relacja** | Po plenerze ten sam wpis może przejść w relację z galerią (jeśli slug łączy zapisy + relację w jednym roku — alternatywa: osobny wpis VIII/IX, patrz punkt 4). |
| **Co dostarcza EJK** | Kadry z pracowni, daty naboru LSŚ, miejsce roku; po plenerze — zdjęcia i krótki opis. |

### 3. VI — Wystawa doroczna {rok} (wernisaż)

| | |
| --- | --- |
| **Kiedy** | Wernisaż (zwykle ostatni wykład sezonu — daty z `annual.json` / wykładów) |
| **`kind`** | `wystawa` |
| **`layout`** | `wydarzenie` |
| **Cel** | Zaproszenie na wernisaż → fotorelacja z ekspozycji. Hero wystawy i kafel „Najbliższe” i tak czerpią daty z danych wystawy; wpis jest **pełnym zaproszeniem i relacją w Aktualnościach**. |
| **Zapowiedź** | `date` / `dateEnd` wernisażu i trwania; `venue`; `facts` (godzina, adres — spójnie z `content/settings.json`); CTA → `/ikony/wystawy`. Bez zdjęć lub jeden kadr zapowiedzi. |
| **Relacja** | Po wernisażu: galeria 4–12+ zdjęć, 1–3 zdania; „Powiązane” → `/ikony/wystawy`. |
| **Co dostarcza EJK** | Tekst zaproszenia; po wernisażu — zdjęcia (alt obowiązkowy), ewentualna korekta tytułu pod temat roku. |

### 4. VIII / IX — Letnia Szkoła Światła {rok} (relacja)

| | |
| --- | --- |
| **Kiedy** | Po plenerze (sierpień–wrzesień) |
| **`kind`** | `wyjazd` |
| **`layout`** | `galeria` (domyślnie) lub `tekst` przy dłuższym opisie |
| **Cel** | Relacja z pleneru, poświęcenia ikon, atmosfery miejsca. |
| **Treść** | Krótki wstęp + galeria; opcjonalnie `venue` (miejsce pleneru). Bez pełnego CTA (zapisy były w III). „Powiązane” → LSŚ. |
| **Co dostarcza EJK** | Wybór zdjęć, podpisy, 1–2 akapity; `date` = dzień poświęcenia lub zakończenia pleneru. |

---

## Rezerwy (1–2 razy w roku lub rzadziej)

| Wzorzec | `kind` (typowo) | `layout` | Uwagi |
| --- | --- | --- | --- |
| Wystawa wyjazdowa / gościnna | `wystawa` | `galeria` lub `wydarzenie` | Spójność z sekcją `#wyjazdowe` na `/ikony/wystawy`; link w `travelingPlaces` gdy jest dedykowany wpis. |
| Spotkanie z gościem | `spotkanie` | `tekst` lub `program` | Lista terminów w MDX (`NewsProgram` w treści) bez nowego pola w modelu. |
| Noc Muzeów / Noc Świątyń | `oprowadzanie` / `aktualnosc` | `galeria` | Krótka zapowiedź → relacja zdjęciowa. |
| Wspomnienie (np. święty patron) | `aktualnosc` | `tekst` | Bez fazy `wydarzenie` jeśli brak daty wydarzenia. |

---

## Pola w CMS (skrót techniczny dla implementacji przyszłego CMS)

Wymagane przy każdym wpisie: `slug`, `title`, `date`, `kind`, `layout`, `body` (MDX).

| Pole | Kiedy |
| --- | --- |
| `excerpt` | Zalecane (lista + lead); `hideLead` tylko wyjątkowo |
| `dateEnd` | Zakres wydarzenia / naboru; wpływa na fazę `wydarzenie` |
| `venue` | Miejsce w meta nagłówka |
| `facts[]` | Tylko `layout: wydarzenie`, faza zapowiedź (i ewentualnie „Odbyło się” w relacji — wg szablonu) |
| `images[]` | Galeria; pierwsze zdjęcie z caption „Plakat” jeśli plakat |
| `cover` | Tylko gdy `featured: true` (max jeden wyróżniony w archiwum) |
| `featured` | Ręcznie; bez automatycznego wygaśnięcia datą |
| `related[]` | Nadpisanie domyślnych „Powiązanych” (max 2 linki) |

Program wykładów w treści: komponent MDX w body, **bez** osobnego pola JSON (E7).

---

## Otwarte po stronie redakcji (nie blokują szablonu)

- Finalna decyzja: czy IX łączy nabór i wykłady w jednym slugu co roku (rekomendacja D3: tak).
- Uzupełnienie `facts` w istniejących zapowiedziach (np. nabór archiwalny) — opcjonalnie w fali treści EJK.
- Szerokość kolumny wpisu na ekranach ≥ 1600 px — wybór wariantu w kodzie (`newsArticleWideAlign.ts`); do obejrzenia na stagingu.

---

*Powiązane: `docs/archive/plans/10-k3-news.md`, `design/README-wpis-aktualnosci.md`, `docs/brief-claude-code.md` §4 (`News`).*
