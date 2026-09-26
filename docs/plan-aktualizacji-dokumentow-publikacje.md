# Plan aktualizacji dokumentów — Publikacje

> **Data sesji:** 2026-09-22  
> **Status:** zamknięta (tylko dokumentacja; kod w etapach 8–10)  
> **Powiązane:** `docs/plan-claude-code.md` §3–§6, `docs/brief-claude-code.md`, `docs/brief-full.md` v2.2, decyzje K-76…K-78, D-06

Sesja analogiczna do `docs/plan-aktualizacji-dokumentow-wydarzenia.md` (2026-09-21). Zmiany w `src/`, `content/`, `public/`, `design/` — poza zakresem tej sesji.

---

## 1. Stan starej strony WordPress

Przejrzane podstrony:

| Stary URL | Zawartość (skrót) |
|---|---|
| `/publikacje/` | hub z odnośnikami do podsekcji |
| `/publikacje/artykuly/` | lista artykułów (teksty z albumu + przedruki z mediów) |
| `/publikacje/multimedia/` | jeden osadzony film (stary wykład) |
| `/publikacje/plakaty/` | galeria ~20 plakatów (wystawy, sezony wykładów, premiera albumu, zapisy, plenery) |
| `/poswiecenia-ikon/` | tekst + 6 zdjęć z jednorazowego poświęcenia na plenerze |

Na stronie wisiało też zdjęcie `71496678_2332951640258695_1047240415494799360_n-1.jpg` — **nie przedstawia żadnego wydawnictwa Akademii** (co przedstawia — do ustalenia z EJK przed migracją).

Wcześniej wspominany katalog 2020 **nie istnieje** — potwierdzone przez EJK (2026-09-22).

---

## 2. Fakty od EJK (stan 2026-09-22)

### Album jubileuszowy — jedyne wydawnictwo Akademii

- Tytuł: **„IKONA DZIŚ. AKADEMIA IKONY 2010–2025”** — zapis do potwierdzenia (na WP był z przecinkiem).
- Wydawca: Fundacja IKONA DZIŚ (self-publishing), rok **2025**.
- **132** strony, format **23 × 23 cm**, cena **140 zł**.
- Dostępny; wysyłka pocztą; sprzedaż na wykładach w KŚT.
- ISBN istnieje — **do podania**.
- Zawiera teksty wykładowców oraz uczestników warsztatów i wykładów.
- Akademia ma pełne prawa do tekstów z albumu; zakres publikacji online (w tym tekstów uczestników) — **do pisemnego potwierdzenia**.
- EJK dostarczy spis treści i zdjęcia.

### Brak innych wydawnictw

Katalog 2020 nie istnieje. Kalendarze (2023, 2025, wcześniej) niedostępne, nowe raczej nie powstaną — nie pokazujemy.

### Artykuły — dwa źródła od startu

1. Wybrane teksty z albumu (w całości lub we fragmencie).
2. Teksty EJK pisane dla różnych mediów — prawa do przedruku zależą od umów; bez prawa: zajawka + link do oryginału.

### Brak materiałów medialnych o Akademii

Pytanie zamknięte. Film w dawnych Multimediach to stary wykład — **nie osadzamy**.

### Plakaty

Wszystkie (~20) zaprojektowała EJK; może zweryfikować (wydarzenie, rok). Docelowe pola: `News.poster`, `ExhibitionEdition.poster`.

### Poświęcenie ikon

Jednorazowe wydarzenie na jednym plenerze; nie część oferty; raczej nie wróci.

### Własność treści

Publikacje to treść Akademii; fundacja nie ma i nie będzie miała sekcji publikacji.

---

## 3. Decyzje

### K-76 — Publikacje: album + artykuły

**Układ.** `/publikacje` bez zakładek, bez `SectionNav`, bez filtrów. Dwie sekcje:

1. Duża sekcja albumu (okładka, pas 3–4 rozkładówek w `Lightbox`, opis, dane, CTA „Zobacz album” + „Zamów”).
2. Lista artykułów od najnowszego z etykietą źródła — sekcja warunkowa; stan startowy: lista z wpisami.

**Podstrona albumu** `/publikacje/[slug]`: blok metryczki/zakupu (jak `FactsBox`), 8–12 rozkładówek, opis, spis treści (linki do wykładowców i artykułów), autorzy z `toc`, fragmenty, opcjonalnie „Jak powstał album”, „Zobacz też” → premiera 29.11.2025.

**Artykuły** `/publikacje/[slug]`: szablon strony tekstowej + metadane źródła + blok źródła (album / media / tylko zajawka).

**Wspólna przestrzeń slugów** z walidacją unikalności przy buildzie.

**Zakup:** wykłady w KŚT lub `mailto:` na sekretariat; wysyłka — koszt w mailu.

**Brak sekcji albumu na stronie głównej** — linkowanie kontekstowe (`/o-akademii`, `/wyklady`, stopka, premiera, bloki w artykułach).

**JSON-LD:** `Book` (album), `Article` (artykuły), `isPartOf` → `Book` dla tekstów z albumu.

**Makiety (oczekiwany handoff):** `design/Akademia Ikony - Publikacje.dc.html` + `design/README-publikacje.md` (sloty `PU-*`).

**Model:** `Publication`, `Article`, `ArticleSource`, `Author` — patrz `brief-claude-code.md` §4.

### K-77 — Poświęcenie ikon → Aktualności (zastępuje K-55)

- Tekst nie trafia do Publikacji, `/pracownia` ani `/ikony/na-zamowienie`.
- Wpis Aktualności `kind: 'plener'`, datowany na plener, 6 zdjęć, redakcja EJK.
- Pozycja 5 OA-62 (`ActivityList`) — **usunięta** (opisuje praktykę jako powtarzalną).
- `/poswiecenia-ikon/` → `/aktualnosci/[slug]`.
- D-05 (poświęcenie jako opcja zamówienia) — bez zmian.

### K-78 — Plakaty i multimedia

- Brak stron plakatów i multimediów.
- Plakaty po weryfikacji EJK → `News.poster` lub `ExhibitionEdition.poster`.
- Film nie osadzany; YouTube w stopce.

### D-06 — Właściciel artykułów EJK z mediów po starcie strony autorskiej

- Teraz: Akademia.
- Po starcie: do decyzji wg tematyki (nauczanie → Akademia; własna twórczość → strona autorska kanoniczna).
- Teksty z albumu — zawsze Akademia.
- Termin: razem z D-01/D-02 (sesja 0b).

---

## 4. Zasada terminologiczna

W treści, UI, CTA, temacie `mailto:` i dokumentacji używamy słowa **„album”**. Nie używamy „książka” ani „katalog”. Wyjątek: nazwy plików istniejących na starej stronie (np. `plakat_premiera_ksiazki_…`).

---

## 5. Uzasadnienie skrótowe

| Temat | Dlaczego |
|---|---|
| Bez zakładek | Jedyne wydawnictwo + artykuły; multimedia i plakaty jako osobne strony nie mają sensu |
| Album na liście, nie w kartach | Jedno wydawnictwo zasługuje na sekcję hero, nie kartę obok artykułów |
| Poświęcenie → Aktualności | Jednorazowe wydarzenie; OA-62 kłamał o powtarzalnej praktyce |
| Plakaty w kontekście | Plakat bez wpisu wystawy/sezonu jest bezużyteczny dla użytkownika |
| Brak albumu na home | Strona główna pod zapisy; album to dorobek + drobna sprzedaż; ruch z artykułów |

---

## 6. Otwarte pytania (do EJK / migracji)

1. ISBN albumu.
2. Zapis tytułu albumu i tematu `mailto:` (przecinek vs kropka w tytule).
3. Slug albumu.
4. Spis treści (tytuł + autor, oznaczenie wykładowców).
5. Okładka + 8–12 rozkładówek.
6. 2–3 fragmenty albumu.
7. Opcjonalny tekst „Jak powstał album”.
8. Wybór tekstów z albumu do publikacji jako artykuły (rekomendacja 3–5 w całości).
9. Pisemne potwierdzenie zakresu praw do publikacji online tekstów z albumu (zwł. uczestnicy).
10. Lista tekstów EJK z mediów (tytuł, medium, data, link, status praw).
11. Co przedstawia zdjęcie `71496678_…_n-1.jpg`.
12. Weryfikacja plakatów (~20: wydarzenie + rok).
13. Miejsce i data pleneru poświęcenia (dla wpisu Aktualności i daty `date`).

---

## 7. Zmienione dokumenty

| Plik | Zakres zmian |
|---|---|
| `docs/plan-claude-code.md` | §3 etapy 8–10, §4 K-55/K-76–78, §5, §6; wersja 0.5 |
| `docs/brief-claude-code.md` | §3, §4, §5, §6, §7, §8 |
| `docs/brief-full.md` | §3, §4, §9, §10.2, §10.5 D-06; wersja 2.2 |
| `docs/copy-o-akademii-pracownia.md` | OA-62 poz. 5 do usunięcia, uwaga K-77 |
| `docs/plan-aktualizacji-dokumentow-publikacje.md` | ten plik |

**Nie zmieniano:** `docs/plan-aktualizacji-dokumentow-wydarzenia.md` (zapis historyczny 2026-09-21; K-55/K-77 go supersedują — odnotowane w dzienniku `plan-claude-code.md` §6). Zamknięte plany `docs/plans/01…07b`.

---

## 8. Sprzeczności z zamkniętymi planami

| Źródło | Stare brzmienie | Zastąpione przez |
|---|---|---|
| `docs/plans/07-aktualnosci.md` (generator) | poświęcenia → publikacje | K-77 → Aktualności |
| K-55 w §4 | poświęcenie → Publikacje | K-77 |
| `plan-claude-code.md` v0.4 (dziennik) | poświęcenia → Publikacje | K-77 (wpis 2026-09-22) |
| Etap 8 (przed sesją) | `/publikacje` z zakładkami | K-76 |

Implementacja — w etapach 8–10 po zatwierdzeniu planu `docs/plans/08-pozostale.md`.
