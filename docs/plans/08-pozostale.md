# Plan 08 — Strony pozostałe

> **Dokument historyczny.** Plan pierwszej implementacji etapu 8 (zamknięty 2026-09-22). Opis **wystawy** w tym pliku (`/ikony/wystawa`, `ExhibitionEdition`, `editions.json`, makiety 7a–7d) został **zastąpiony** w etapie **8b** — stan docelowy, decyzje K-82…K-118 i kawałki: [`08b-review-fixes.md`](./08b-review-fixes.md). Trasy kontakt, publikacje, polityka i 404 z tego planu pozostają aktualne; wystawa i home w zakresie wystawy — wyłącznie według 08b. Master plan: `docs/plan-claude-code.md` (etap 8 + 8b).

Status: zamknięty (historyczny) 2026-09-22 · wystawa przebudowana w 08b (2026-09-26)
Gałąź: feat/08-pozostale
Makiety: `design/Akademia Ikony - Wystawa i Aktualności.dc.html` — ekrany **7a–7d** (`/ikony/wystawa`; handoff: `design/README-wystawa-aktualnosci.md`, sloty WY-*); `design/Akademia Ikony - Publikacje.dc.html` — ekrany **8a–8j** (`/publikacje` + podstrony; handoff: `design/README-publikacje.md`, sloty PU-*). **Kontakt** i **404** — bez dedykowanej makiety; układ wg brief §6 i tokenów projektu (`design/README`).

## Cel i zakres

Domknięcie ostatnich tras z brief §3: `/kontakt`, `/ikony/wystawa`, `/publikacje` (+ `/publikacje/[slug]`), `/polityka-prywatnosci`, custom **404**. Koniec zaślepek `PagePlaceholder`. Wystawa: opis stały + bieżąca edycja + oprowadzania + poprzednie edycje (`ExhibitionEdition`, K-51, K-54). Home: kafel „Najbliższe” o wystawie wyliczany ze stanu edycji (K-58); skrócony filar „Ikony”. LSŚ: sekcja „Gdzie byliśmy” (K-57). Publikacje: album jubileuszowy + artykuły (K-76). K-77: usunięcie pozycji 5 z OA-62. **Nawigacja K-50** — zrobiona w etapie 7 (D-07-02). Poza zakresem: JSON-LD `Book`/`Article` (etap 10), migracja WP treści redakcyjnych (etap 9), przekierowania 301, sekcja albumu na stronie głównej, zmiany w `content/news/` (w tym cytat R. Rumina — etap 9).

## Decyzje podjęte w sesji planistycznej

- **K-79 / D-08-01:** Edycje wystawy w KŚT liczymy od **2015** — `content/exhibition/editions.json` obejmuje 2015–2026; wystawy poza KŚT zostają w Aktualnościach.
- **K-80 / D-08-02:** Zdjęcia edycji **0–5** gdy są; wiele edycji **bez zdjęć** (K-54: linijka na liście). Brak materiałów → **placeholdery** jak `PU-14`/`PU-51` na Publikacjach; bez pobierania z Facebooka w etapie 8.
- **K-81 / D-08-03:** **Notatka operacyjna** (bez funkcji w serwisie): po wernisażu EJK/sekretariat, do ~2 tyg., minimum: data, podtytuł, 0–5 zdjęć, tematy oprowadzań — edycja `editions.json` ręcznie do czasu CMS.
- **D-08-04:** „Gdzie byliśmy” w sample: **Święta Lipka, Wesoła, Supraśl, Gruzja, Litwa**; **Gródek** — do potwierdzenia EJK, nie w sample.
- **D-08-05:** Komentarz R. Rumina (oprowadzania 2017) — **poza etapem 8**; wpisy w `content/news/` bez zmian; decyzja w etapie 9.
- **D-08-06:** **4 kawałki** (zamiast 3 z pierwotnego master planu) — publikacje osobno od polityki i 404.
- **D-08-07:** Trzeci kafel „Najbliższe” **wyliczany** w `UpcomingHighlights` z `editions.json` + `getExhibitionState()`; copy stanów w `pl.ts`; link `/ikony/wystawa`. Nabór i wykłady zostają w `settings.json`.
- **D-08-08:** `/polityka-prywatnosci` — **import treści z WP** w kawałku 4 (nie placeholder).
- **D-08-09:** Publikacje wg makiety **8a–8j**; slug albumu sample: **`ikona-dzis`**; placeholdery rozkładówek zgodnie z README-publikacje.
- **D-08-10:** **404** — H1, krótki akapit, linki „Strona główna” + „Kontakt” + lista **6 pozycji `mainNav`** jako mapa ratunkowa.

## Pliki i komponenty

| Plik | Nowy/zmiana | Odpowiedzialność |
| ---- | ----------- | ---------------- |
| `src/content/types.ts` | zmiana | `ExhibitionEdition`, `ExhibitionState`, `getExhibitionState`, `editionsWithGallery`; `Publication`, `Article`, `ArticleSource`, `Author` (brief §4) |
| `src/content/exhibition.ts` | nowy | `getExhibitionEditions()`, `getCurrentEdition()`, `getExhibitionState()`; odczyt `editions.json` + `page.mdx` |
| `content/exhibition/editions.json` | nowy | Edycje 2015–2026, `"sample": true`; tytuły/dat z WP; `photos[]` tylko gdzie są pliki |
| `content/exhibition/page.mdx` | nowy | Opis stały wystawy (redakcja na bazie WP „Podsumowanie roku 2019 i 2020”) |
| `src/components/contact/MapBlock.tsx` | nowy | Embed mapy (`SiteSettings.mapEmbedUrl`) + blok „Akademia w sieci” (blog, fundacja, social) |
| `src/components/contact/ContactPage.tsx` | nowy | Adres, maile, telefon, body MDX (zakrystia), `MapBlock` |
| `content/pages/kontakt.mdx` | nowy | Treść o wejściu od zakrystii (redakcja; fakty z brief §8) |
| `src/app/kontakt/page.tsx` | zmiana | `ContactPage` zamiast `PagePlaceholder` |
| `src/components/exhibition/ExhibitionPage.tsx` | nowy | Składanie `/ikony/wystawa`: WY-* — praktyczny blok, bieżąca edycja, stały opis, oprowadzania, poprzednie edycje |
| `src/components/exhibition/ExhibitionEditionCard.tsx` | nowy | Karta z galerią gdy `photos.length > 0`; linijka gdy brak (K-54) |
| `src/components/exhibition/ExhibitionEditionGallery.tsx` | nowy, Client | Duże zdjęcie + miniatury → reuse `Lightbox` (jak galeria/wpisy) |
| `src/app/ikony/wystawa/page.tsx` | zmiana | `ExhibitionPage` + `SectionNav` aktywna „Wystawa” |
| `src/components/home/UpcomingHighlights.tsx` | zmiana | Dwa kafle z `settings.upcoming` + trzeci z logiki wystawy (D-08-07) |
| `src/i18n/pl.ts` | zmiana | Copy kafela wystawy (`zapowiedz`/`biezaca`); filar „Ikony” (K-58); `contact.*`, `publications.*`, `exhibition.*`, `notFound.*` |
| `content/settings.json` | zmiana | Usunięcie trzeciego wpisu `[przykład]` z `upcoming` (zastąpiony logiką wystawy) |
| `content/pages/o-akademii.json` | zmiana | Usunięcie pozycji 5 „Poświęcenia ikon” (K-77) |
| `content/offers/plener.mdx` | zmiana | Sekcja „Gdzie byliśmy” — lista miejsc (D-08-04) |
| `src/content/publications.ts` | nowy | `getPublications()`, `getPublicationBySlug()`, walidacja `toc[].articleSlug` |
| `src/content/articles.ts` | nowy | `getArticles()`, `getArticleBySlug()`, sortowanie po `year` malejąco |
| `src/content/publication-slugs.ts` | nowy | Walidacja unikalności slugów album/artykuł przy buildzie (błąd przy kolizji) |
| `content/publications/ikona-dzis.mdx` | nowy | Album sample: metryczka z brief §8, fikcyjny ISBN, `sample: true` |
| `content/articles/*.mdx` | nowe | 5 artykułów sample: 3× `source.kind: album`, 2× `media` (jeden `excerptOnly: true`) |
| `public/media/sample/publications/*` | nowe | Okładka z makiety (`design/uploads/`) + placeholdery rozkładówek |
| `src/components/publications/PublicationsHubPage.tsx` | nowy | Hub 8a/8b: sekcja albumu + lista artykułów (PU-00…PU-30) |
| `src/components/publications/PublicationSpreadStrip.tsx` | nowy, Client | Pas 3–4 rozkładówek + `Lightbox` (PU-14) |
| `src/components/publications/PublicationMetricsBox.tsx` | nowy | Blok metryczki/zakupu jak `FactsBox` (PU-44); stany `dostepny`/`wyczerpany` |
| `src/components/publications/PublicationAlbumPage.tsx` | nowy | Podstrona albumu 8c/8d na `TextPageShell` |
| `src/components/publications/ArticlePage.tsx` | nowy | Artykuł na `TextPageShell` + bloki źródła PU-A* / PU-B* |
| `src/components/publications/ArticleSourceBlock.tsx` | nowy | Album / media / excerptOnly |
| `src/components/publications/ArticleList.tsx` | nowy | Lista z etykietą źródła (PU-22) |
| `src/app/publikacje/page.tsx` | zmiana | `PublicationsHubPage` |
| `src/app/publikacje/[slug]/page.tsx` | nowy | Router: album vs artykuł po slugu; `generateStaticParams` |
| `content/pages/polityka-prywatnosci.mdx` | nowy | Import z WP (`/strona-glowna/polityka-prywatnosci/`) |
| `src/app/polityka-prywatnosci/page.tsx` | zmiana | `TextPageShell` lub prosty layout tekstowy (bez TOC jeśli krótka) |
| `src/app/not-found.tsx` | nowy | Custom 404 (D-08-10) |
| `scripts/fetch-privacy-policy.ts` | nowy (opcjonalny) | Jednorazowy import HTML→MDX z WP REST; uruchomienie przed kawałkiem 4 lub ręczna konwersja |

## Kawałki

### Kawałek 1 — Kontakt + `MapBlock`

Zakres: `MapBlock` (iframe `mapEmbedUrl`, tytuł sekcji, linki: blog, fundacja, Facebook, YouTube z `SiteSettings`); `ContactPage` (breadcrumb, H1, adres i `place` z settings, dwa maile z `emails[]` + `contactName`, `tel:` + wyświetlany numer, body MDX); `content/pages/kontakt.mdx` (zakrystia — treść redakcyjna, bez wymyślania); `pl.ts` (`contact.*`); zamiana zaślepki `/kontakt`.

Kryterium „gotowe”: osadzona mapa (nie surowy link); dwa maile klikalne (`mailto:`); telefon `tel:+48601734705`; blok „Akademia w sieci” w `MapBlock`; treść tylko z `content/` + `settings`; fokus i 390 px; build/lint OK.

### Kawałek 2 — Wystawa + home + LSŚ + K-77

Zakres: typy i `exhibition.ts`; `editions.json` (2015–2026, sample) + `page.mdx`; komponenty wystawy (WY-*: blok praktyczny, stany 7a/7c/7d, bieżąca edycja, opis stały, `#oprowadzania`, poprzednie edycje z K-54); `/ikony/wystawa`; `UpcomingHighlights` — trzeci kafel z `getExhibitionState()` (D-08-07); skrócony filar „Ikony” w `pl.ts`; usunięcie OA-62 poz. 5; sekcja „Gdzie byliśmy” w `plener.mdx`; czyszczenie `settings.json` (`upcoming` → 2 wpisy).

Kryterium „gotowe”: zgodność z makietą 7a–7d (desktop + 390 px); `SectionNav` „Wystawa” aktywna, **bez `Breadcrumb`** (jak Galeria i Ikony na zamówienie); stany `zapowiedz`/`biezaca` z danych; edycje bez zdjęć = linijka; kafel home i filar Ikony zgodne z K-58; build/lint OK; nawigacja klawiaturą na galerii/lightboxie edycji.

### Kawałek 3 — Publikacje (K-76)

Zakres: typy `Publication`/`Article`/…; `publications.ts`, `articles.ts`, walidacja slugów; `PublicationMetricsBox`, `PublicationSpreadStrip`, hub `PublicationsHubPage` (8a/8b), `PublicationAlbumPage` (8c/8d), `ArticlePage` + `ArticleSourceBlock` (8e–8h); trasy `/publikacje`, `/publikacje/[slug]`; sample: `ikona-dzis.mdx` + 5 artykułów; media z `design/uploads/` + placeholdery rozkładówek; `mailto:` z brief §7; terminologia „album” w UI.

Kryterium „gotowe”: bez `SectionNav` i zakładek; sekcja albumu + lista artykułów; podstrona albumu z metryczką, spisem treści (linki do wykładowców i artykułów), autorami z `toc`, fragmentami; artykuł z albumu i z mediów (+ wariant `excerptOnly`); kolizja slugów przerywa build; zgodność z 8a–8j; build/lint OK.

### Kawałek 4 — Polityka + 404 + DoD

Zakres: import polityki z WP → `content/pages/polityka-prywatnosci.mdx`; `/polityka-prywatnosci`; `not-found.tsx` (D-08-10); przegląd DoD całego etapu (wszystkie trasy §3, brak zaślepek); aktualizacja §5 w `plan-claude-code.md`; odhaczenie postępu.

Kryterium „gotowe”: polityka renderuje treść z WP (nie placeholder); 404 w layoutcie projektu z `mainNav`; wszystkie checkboxy DoD poniżej; build/lint OK; mobile 390 px na reprezentatywnych trasach (kontakt, wystawa, publikacje, 404).

## Dane sample dodawane w tym etapie

→ wpisy do `docs/plan-claude-code.md` §5 (uzupełnienia w kawałkach):

| Treść | Gdzie | Zastąpić czym |
| ----- | ----- | ------------- |
| Edycje wystawy 2015–2026 | `content/exhibition/editions.json` | tytuły/dat z WP + EJK; zdjęcia 0–5 (K-80) |
| Opis stały wystawy | `content/exhibition/page.mdx` | redakcja EJK |
| Treść kontaktu (zakrystia) | `content/pages/kontakt.mdx` | weryfikacja EJK |
| Lista plenerów | `content/offers/plener.mdx` | Gródek — potwierdzenie EJK |
| Album + rozkładówki | `content/publications/`, `public/media/sample/publications/` | skany i spis treści od EJK |
| Artykuły sample (5) | `content/articles/*.mdx` | wybór tekstów EJK (etap 9) |
| ISBN fikcyjny | frontmatter albumu | prawdziwy ISBN od EJK |
| Polityka prywatności | `content/pages/polityka-prywatnosci.mdx` | aktualizacja prawna po wdrożeniu analityki (etap 10) |

## Kryteria ukończenia etapu

- [x] Szablon strony tekstowej użyty na ≥3 trasach bez rozgałęzień (z etapem 6: m.in. album, artykuł, polityka)
- [x] Wszystkie trasy z brief §3 mają realną treść lub `sample` — koniec `PagePlaceholder`
- [x] Pełny `MapBlock` na `/kontakt` (K-13)
- [x] `/ikony/wystawa` renderuje stany `zapowiedz`/`biezaca` z `ExhibitionEdition` (K-51, K-54)
- [x] Kafel „Najbliższe” o wystawie wyliczany z danych edycji (K-58, D-08-07)
- [x] `/publikacje` i podstrony zgodne z K-76 i makietą 8a–8j
- [x] OA-62 poz. 5 usunięta (K-77)
- [x] Custom 404 z mapą ratunkową `mainNav` (D-08-10)
- [x] Build/lint OK; interakcje (lightbox, `mailto:`, mapa) dostępne z klawiatury

## Ryzyka i pytania otwarte

- **Zdjęcia edycji wystawy:** większość lat bez zdjęć lub z placeholderami (D-08-02); uzupełnienie po wdrożeniu — wpis §5.
- **Gródek** na liście plenerów — do potwierdzenia EJK (D-08-04).
- **Album:** tytuł z kropką vs przecinek, temat `mailto:`, ISBN, spis treści, skany rozkładówek — `docs/plan-aktualizacji-dokumentow-publikacje.md` §6.
- **Artykuły z albumu:** prawa do publikacji online — pisemne potwierdzenie EJK przed pełnym wdrożeniem treści (etap 9).
- **R. Rumina:** cytat w archiwum news — etap 9 (D-08-05).
- **JSON-LD `Book`/`Article`:** etap 10.
- **Lighthouse a11y** na nowych trasach — etap 10 (jak `/aktualnosci`).
- **Procedura po wernisażu:** notatka operacyjna K-81 w runbooku / przekazaniu klientowi — poza kodem.

## Postęp

| Kawałek | Status | Uwagi z checkpointu |
| ------- | ------ | ------------------- |
| 1 — Kontakt + MapBlock | ✅ | ContactPage + MapBlock; układ 2×2 (Adres ↔ Organizator); maile wyrównane do dołu mapy; Organizator + Akademia w sieci wg makiety 2a-kontakt; bez `<br>` pod mailem (kontakt + stopka); zakrystia w MDX — weryfikacja EJK |
| 2 — Wystawa + home + LSŚ + K-77 | ✅ | typy + exhibition.ts; editions.json 2015–2026 + page.mdx/body.mdx; komponenty WY-*; /ikony/wystawa; UpcomingHighlights z getExhibitionUpcomingHighlight(); filar Ikony (K-58); OA-62 poz. 5 usunięta; „Gdzie byliśmy” w letnia-szkola-swiatla.mdx; settings upcoming → 2 wpisy; poprawka: usunięty `Breadcrumb` (SectionNav jak Galeria / Ikony na zamówienie) |
| 3 — Publikacje (K-76) | ✅ | typy + publications.ts/articles.ts + walidacja slugów; hub 8a/8b, album 8c/8d, artykuły 8e–8h; ikona-dzis.mdx + 5 artykułów sample; placeholdery mediów; mailto z brief §7; build/lint OK; poprawka review: okładka z `design/uploads/pasted-1790094969650-0.png`, metryczka 2 kolumny (hub + album), tytuły listy artykułów 25px/21px (osobna klasa), „Zobacz też” w jednym rzędzie (desktop), usunięta notka sample pod listą, wymiary rozkładówek w frontmatter zgodne z plikami (lightbox bez rozciągania) |
| 4 — Polityka + 404 + DoD | ✅ | `not-found.tsx` (D-08-10); koniec `PagePlaceholder`; DoD odhaczone; **poprawka:** polityka wg makiety **3a** (`kierunki wizualne.dc.html`) — `TextPageShell` + TOC, sekcje H2, lead, cookies, kontakt z brief §8, `lastUpdated`; treść prawna z WP w `polityka-prywatnosci.json` |
