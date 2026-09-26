# Akademia Ikony — brief techniczny dla Claude Code

> **Cel dokumentu:** wersja `akademia-ikony-brief-v2.md` skrócona do tego, co potrzebne w fazie implementacji. Makiety w Claude Design są zatwierdzone i zhandoffowane — ten dokument nie opisuje procesu ich tworzenia, tylko to, co z nich wynika dla kodu.
> **Repo:** `academy-web`. **Pełny brief (kontekst biznesowy, audyt, decyzje marketingowe):** `docs/brief-full.md` — czytaj przy niejasnościach co do treści/copy, nie przy pytaniach technicznych.
> **Dokument nadrzędny:** `CLAUDE.md` w korzeniu repo (konwencje kodu, patrz niżej) ma pierwszeństwo przy konflikcie.

---

## 1. Kontekst w skrócie

Akademia Ikony (akademiaikony.pl) — instytucja edukacyjna prowadząca warsztaty pisania ikon, cykl wykładów i plenery, działająca przy fundacji IKONA DZIŚ. Strona ma trzy cele w tej kolejności: (1) wizerunek instytucji, (2) zapisy na warsztaty/plener, (3) zapisy na wykłady. Odbiorcy: 35–70 lat, często z telefonu, niekoniecznie techniczni — stąd wymagania dostępności i prostoty nawigacji są równie ważne jak funkcje.

Odświeżenie zastępuje starą stronę WordPress (motyw Nisarg, 2015) — stąd duży komponent migracji treści w projekcie.

Strona jest częścią szerszego ekosystemu (Akademia + Fundacja + planowana strona autorska Elżbiety Jackowskiej-Kurek), ale **to repo dotyczy wyłącznie Akademii**. Jedyna konsekwencja tego dla kodu: nazwy pól w `IconWork` powinny zostać zgodne z tym, co jest w brief §7 (współdzielony model danych na przyszłość) — nie zmieniać nazw pól bez potrzeby.

---

## 2. Stack i decyzje techniczne

- **Frontend:** Next.js (App Router), TypeScript strict, React Server Components domyślnie; Client Components tylko gdy potrzebna interakcja (menu, lightbox, akordeon).
- **Stylowanie:** Tailwind; tokeny z handoffu Claude Design jako zmienne w `globals.css` (`@theme` / CSS variables), używane przez klasy Tailwind (patrz `design/README`).
- **Treść (v1):** pliki w repo — `content/` (MDX + JSON), zgodne z typami w `src/content/types.ts` (patrz §4). **Nie baza danych w v1.**
- **Treść (v2, później):** ten sam model danych przeniesiony na SQLite/Postgres + panel `/admin` (Auth.js, 2–3 konta). Strony publiczne czytają z tej samej warstwy `src/content/*`, żeby zmiana źródła nie dotykała komponentów.
- **Obrazy:** `next/image`; oryginały z WP zmigrowane do `public/media/` (na start) lub object storage; automatyczne WebP/AVIF.
- **Zapisy (v1):** przyciski `mailto:` z ujednoliconymi tematami (lista w §6) + `tel:+48601734705`. Żaden backend formularzy w v1.
- **Analityka:** Plausible lub Umami (bez ciasteczek), zdarzenia na klikach CTA zapisów, telefonu, `mailto:`. **Brak banera cookies** (nic go nie wymaga w v1).
- **Hosting:** dowolny wspierający Next.js; przekierowania 301 w `next.config.ts` z `docs/redirects.json`.
- **Język:** PL only w v1; wszystkie stringi UI w `src/i18n/pl.ts` (nie hardkodować w JSX) — przygotowanie pod EN w przyszłości.
- **Repo:** osobne (nie monorepo). Wspólne typy/tokeny dla przyszłej strony EJK trzymane jako plik do skopiowania, nie jako workspace.

---

## 3. Architektura informacji (routing)

```
/                          strona główna
/o-akademii                historia, misja, EJK, zespół, miejsce
/pracownia                 pracownia ikonograficzna (osobna strona tekstowa; treść ze starego WP)
/warsztaty                 hub: dwie ścieżki
/warsztaty/kurs-roczny-i-trzyletni
/warsztaty/letnia-szkola-swiatla
/wyklady                   hub: bieżący sezon + jak się zapisać
/wyklady/archiwum          15 sezonów archiwalnych, rozwijane (bieżący 2026/2027 — szesnasty)
/wyklady/wykladowcy
/ikony                     galeria: sekcje Elżbieta / uczniowie + filtr tematu
/ikony/[slug]              pojedyncza ikona (opcjonalnie w v1)
/ikony/na-zamowienie       strona ofertowa (treść wymienna w przyszłości — nie istotne teraz)
/ikony/wystawy             trzy formy wystaw w KŚT: ekspozycja codzienna, doroczna, wyjazdowe (K-82…K-90; historia K-51)
/aktualnosci               lista z typem wpisu (`kind`), w tym archiwum wystaw, oprowadzań, wyjazdów, plenerów (K-50, K-52)
/aktualnosci/[slug]
/publikacje                album Akademii + artykuły (K-76)
/publikacje/[slug]         album lub artykuł (wspólna przestrzeń slugów)
/kontakt
/polityka-prywatnosci
```

**Menu główne (max 6 pozycji):** O Akademii · Warsztaty · Wykłady · Ikony · Aktualności · Kontakt.

> **K-50 (2026-09-21):** dział „Wydarzenia” zlikwidowany jako sekcja i pozycja menu. Trasa `/wydarzenia` nie powstaje; stare adresy przekierowane (§5). Uzasadnienie: coroczna wystawa w kościele ma własną stronę (→ `/ikony/wystawy`, K-90; wcześniej K-51 `/ikony/wystawa`); reszta to archiwum 2013–2020 w Aktualnościach jako wpisy z `kind` (K-52).

**Wzorzec nawigacji drugiego poziomu (obowiązkowy, zaimplementowany w makietach jako `SectionNav`):**
1. Strona sekcji (`/warsztaty`, `/wyklady`, `/ikony`) jest hubem z dużymi klikalnymi blokami podstron, nie tylko opisem.
2. `SectionNav` — pozioma listwa linków drugiego poziomu pod nagłówkiem, na każdej podstronie sekcji. Na mobile: zwykła zawijana lista, nie select, nie skryta.
3. Stopka z pełną mapą strony (nawigacja ratunkowa + SEO).

Zawartość `SectionNav` per sekcja:
- O Akademii: O Akademii · Pracownia *(para stron tekstowych; `/o-akademii` = pierwsza pozycja — K-48, makieta 6a–6d)*
- Warsztaty: Przegląd · Kurs roczny i trzyletni · Letnia Szkoła Światła *(pierwsza pozycja = hub, nie nazwa sekcji — K-23)*
- Wykłady: Bieżący sezon · Archiwum · Wykładowcy
- Ikony: Galeria · Wystawy · Ikony na zamówienie (K-90; wcześniej „Wystawa”, K-51)
- Aktualności: bez `SectionNav` — jedna chronologiczna lista wpisów z nawigacją po latach (K-70), bez filtrów kategorii w v1 (K-52)

Menu główne (desktop): **płaska lista 6 linków** — bez dropdownu; drugi poziom wyłącznie przez `SectionNav` na stronach sekcji (zgodnie z makietą). W menu mobilnym: akordeon per sekcja, nagłówek sekcji zawsze też linkiem do huba.

---

## 4. Model treści (`src/content/types.ts`)

Skopiować bez zmian nazw pól (współdzielony model z przyszłą stroną EJK):

```ts
type Image = { src: string; alt: string; width: number; height: number; caption?: string };

type Page = {
  slug: string; title: string; lead?: string;
  body: string;                 // MDX
  hero?: Image; seo?: { description: string; ogImage?: string };
};

type OfferFacts = {             // blok „W skrócie”
  seasonLabel?: string;         // „2026/2027”
  when?: string;                // „raz w tygodniu, październik–czerwiec”
  where?: string;
  audience?: string;
  price?: string;               // „400 zł / rok”
  enrollmentDeadline?: string;  // tekst wiersza w FactsBox (np. „Do 24 września 2026”, „do końca września 2026”); nie ISO — daty maszynowe w `firstMeeting`
  enrollmentStart?: string;     // plener: wiersz „Nabór” (np. „Rusza w marcu 2027”)
  enrollmentRule?: string;      // plener: wiersz „Zasada naboru” (np. „Kolejność zgłoszeń”)
  enrollmentEmail: string;
  enrollmentPhone?: string;
  enrollmentSubject: string;    // ujednolicony temat mailto
  firstMeeting?: string;        // ISO
  enrollmentOpen: boolean;
  leadTime?: string;            // zamówienia: orientacyjny czas realizacji
};

type Offer = Page & {
  kind: 'kurs' | 'plener' | 'wyklady' | 'zamowienie';
  facts: OfferFacts;
  testimonials?: Testimonial[];
};

type Lecturer = {
  slug: string; name: string; titles?: string;
  affiliation?: string;       // skrót w programie wykładów, np. „UKSW”
  affiliationFull?: string;   // pełna nazwa instytucji na stronie wykładowców
  bio?: string; photo?: Image;
};

/** Etykiety prowadzących w programie — osobny plik `content/lecturer-directory.json`. */
type LecturerDirectoryEntry = { slug: string; name: string; titles?: string; affiliation?: string };

type Lecture = { date: string; title: string; lecturerSlugs: string[]; note?: string };

type LectureSeason = {
  slug: string; label: string;  // „2026/2027”
  cycleTitle: string;           // „Ikona – korzenie i owoce wiary. Mistyka dziś”
  intro?: string;
  introSecondary?: string;      // drugi akapit leadu na hubie wykładów
  lectures: Lecture[]; gallery?: Image[];
};

// Podzbiór przyszłego `Product` ze strony autorskiej EJK — nazwy pól
// zgodne celowo, żeby przeniesienie/współdzielenie danych było mechaniczne.
type IconWork = {
  slug: string; title: string;  // „Chrystus Pantokrator”
  author: 'ejk' | 'student';
  authorName?: string;          // EJK: pełne imię i nazwisko; uczeń: mianownik, gdy znany (K-42)
  technique?: string;           // „tempera jajowa na desce, złocenie”
  size?: { w: number; h: number };
  image: Image; tags?: string[];
};

// K-50/K-53 (2026-09-21): typ `Event` usunięty. „Wydarzenia” to teraz wpisy
// Aktualności z `kind`; wystawy w KŚT mają model `PermanentExhibition` + `AnnualExhibition` niżej.
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
  featured?: boolean;
  featuredUntil?: string;       // YYYY-MM-DD; tylko przy featured: true; po dacie wpis traci wyróżnienie przy buildzie (K-73)
  venue?: string;               // wystawy wyjazdowe — wiersz na `/ikony/wystawy#wyjazdowe` (K-87)
};
// K-72: na liście (`NewsCard`) wyświetlana jest tylko `date` z rokiem — bez zakresu `dateEnd`.
// We wpisie pojedynczym i w wyróżnionym: `formatDateRange` z `dateEnd` gdy jest.

// K-82…K-90 (08b): w KŚT są trzy formy wystawy — ekspozycja codzienna (6–10 ikon EJK),
// wystawa doroczna (40–50 ikon, wernisaż na ostatnim wykładzie sezonu), wystawy wyjazdowe
// (wpisy Aktualności `kind: 'wystawa'` z `venue`). Strona `/ikony/wystawy`, H1 „Wystawy ikon”.
// Szczegóły merytoryczne i układ: `docs/plans/08b-review-fixes.md` §1–§2. K-51: historia wydzielenia
// wystawy z Aktualności (2026-09-21); model `ExhibitionEdition` zastąpiony w 08b.
type PermanentExhibition = {
  title: string;
  lead: string;
  iconCount: { from: number; to: number };
  interiorPhotos: Image[];
  sample?: boolean;
};

type AnnualExhibition = {
  seasonSlug: string;           // „2026-2027” → walidacja `LectureSeason` przy buildzie
  title: string;                // osobne pole (K-84), np. „Mistyka dziś”
  vernissage?: string;          // domyślnie data ostatniego wykładu sezonu
  dateEnd?: string;             // domyślnie 31 sierpnia roku wernisażu
  iconCount?: number;
  summary?: string;
  photos?: Image[];
  newsSlug?: string;            // relacja doroczna ↔ wpis Aktualności (K-103)
};
```

Źródło danych wystawy: `content/exhibition/page.mdx` (frontmatter `PermanentExhibition`) + `content/exhibition/body.mdx` + `content/exhibition/annual.json` (`AnnualExhibition[]`, 15 sezonów od 2012/2013). Stan wystawy dorocznej wyliczany z dat (`vernissage`…`dateEnd`); ISR `revalidate` na `/` i `/ikony/wystawy` (K-85). Trasa `/ikony/wystawa` → `/ikony/wystawy` (redirect w aplikacji; 301 w etapie 9).

```ts
// K-76: Publikacje — jeden album jubileuszowy + artykuły (bez zakładek, bez SectionNav).
type Author = { name: string; lecturerSlug?: string };

type Publication = {
  slug: string;
  title: string;
  year: number;
  publisher: string;              // „Fundacja IKONA DZIŚ”
  isbn?: string;                  // do podania
  pages: number;
  format: string;                 // „23 × 23 cm”
  price?: number;                 // PLN; brak = nie w sprzedaży
  availability: 'dostepny' | 'wyczerpany';
  cover: Image;
  spreads: Image[];               // 8–12
  toc: { title: string; author: Author; articleSlug?: string }[];
  sample?: boolean;
};

type ArticleSource =
  | { kind: 'album'; publicationSlug: string }
  | { kind: 'media'; outlet: string; date: string; url?: string; excerptOnly?: boolean };

type Article = {
  slug: string;
  title: string;
  authors: Author[];
  year: number;
  excerpt: string;
  source: ArticleSource;
  sample?: boolean;
};
```

Lista autorów na podstronie albumu jest wyliczana z `toc` (unikalne nazwiska, podział wg `lecturerSlug`), nie przechowywana osobno. Źródła: `content/publications/*.mdx` (frontmatter = `Publication`, body = opis, fragmenty, „Jak powstał album”), `content/articles/*.mdx` (frontmatter = `Article`, body = tekst lub zajawka). Walidacje przy buildzie (K-76): `toc[].articleSlug` → istniejący artykuł; `source.publicationSlug` → istniejący album; artykuł `kind: 'album'` bez pozycji w `toc` — ostrzeżenie; kolizja slugów album/artykuł — błąd buildu.

Kafel „Najbliższe” na stronie głównej (K-58) zależy od stanu wystawy:
- stan `biezaca`: „Wystawa ikon · edycja {rok}”, tekst „Czynna w godzinach otwarcia kościoła”;
- stan `zapowiedz`: „Wernisaż {data}” z nową edycją, tekst o oprowadzaniach.

```ts

type Testimonial = { quote: string; author: string; role?: string };

type SiteSettings = {
  orgName: string; place: string; address: string;
  emails: { label: string; address: string; contactName?: string }[];
  phone: string; mapEmbedUrl: string; blogUrl: string;
  ecosystem: {
    foundationUrl: string;
    personalSiteUrl?: string;   // uzupełnić po starcie strony autorskiej EJK — puste teraz
    social: { facebook: string; youtube: string };
  };
  upcoming: { title: string; text: string; href: string; linkLabel: string }[];   // „Najbliższe” na stronie głównej (K-16)
};
```

---

## 5. Migracja z WordPressa

**Krok 1 — sprawdzić źródło:** `https://www.akademiaikony.pl/wp-json/wp/v2/pages?per_page=100` i `/posts`. Jeśli 200 → REST API. Jeśli 401/404 → eksport WXR (Narzędzia → Eksport w WP), parsować XML.

**Krok 2 — media:** z `content.rendered` wyciągnąć `<a href="…/uploads/YYYY/MM/x.jpg"><img title="…">`. **`href` to oryginał, `src` to cache — brać `href`.** Ignorować wszystko z `/wp-content/uploads/cache/`.

**Krok 3 — HTML → MDX**, np. `turndown` + korekta ręczna.

**Krok 4 — wykłady:** rozbić posty `wyklady-YYYY-YYYY` regexem na `Lecture[]`: wzorzec `DD.MM` + linie `**Tytuł,** Prowadzący`.

**Krok 5 — galeria → `IconWork`:** regex `^(.+?),\s*(\d+)x(\d+)\s*\(cm\)$` na podpis; wariant „pisany/pisana ręką X” → `author: 'student'`, `authorName: X`. Spodziewać się literówek w źródle (np. „Advokata” vs „Advocata”, „Matyaszczak” vs „Matyaszczyk”) — logować niejasne przypadki, nie zgadywać.

**Krok 6 — przekierowania:** wygenerować `docs/redirects.json` (stary → nowy URL) z tabeli poniżej, użyć w `next.config.ts`.

**Skrypt migracji** (`scripts/migrate-wp.ts`, uruchamiany przez `tsx`) ma:
1. pobrać pages/posts (REST albo WXR, oba źródła za flagą),
2. HTML → MDX do `content/pages`, `content/news`,
3. pobrać oryginały obrazów do `public/media/` (pomijając `/cache/`),
4. wygenerować `content/lectures/<season>.json`,
5. wygenerować `content/icons.json`,
6. wygenerować `docs/redirects.json`.

Być idempotentny, logować nieudane parsowania do `scripts/migrate-report.md`. Bez pętli `for`/`for-of` — `map`/`filter`/`reduce`/`forEach`.

Szacunek ręcznej korekty po migracji: ~10 stron statycznych, 16 sezonów wykładów (nazwiska), ~52 podpisy ikon (stan WP 2026-09-19: 23 prace Elżbiety, 3 z nich bez podpisu, + 29 prac uczniów, 10 bez nazwiska). ~60 wpisów aktualności bez korekty. Blog (blogspot) — nie migrować, tylko link w stopce.

### Tabela przekierowań (kluczowe wpisy)

| Stary URL | Nowy URL |
|---|---|
| `/` | zostaje treściowo inna strona; stare posty → `/aktualnosci` |
| `/strona-glowna/celem-dzialalnosci-...` | `/o-akademii` |
| `/strona-glowna/pracownia/` | `/pracownia` |
| `/strona-glowna/kontakt/` | `/kontakt` |
| `/strona-glowna/polityka-prywatnosci/` | `/polityka-prywatnosci` |
| `/warsztaty/` | `/warsztaty` |
| `/warsztaty/warsztaty-roczne/` | `/warsztaty/kurs-roczny-i-trzyletni` |
| `/warsztaty/warsztaty-wakacyjne/` | `/warsztaty/letnia-szkola-swiatla` |
| `/warsztaty/zapisy-na-warsztaty/` | scalone w sekcję „Jak się zapisać” na stronach kursów |
| `/wyklady/` | `/wyklady` |
| `/wyklady/tematy/` | `/wyklady` (bieżący) + `/wyklady/archiwum` |
| `/wyklady/wykladowcy/` | `/wyklady/wykladowcy` |
| `/wyklady/zapisy-na-wyklady/` | scalone w `/wyklady#zapisy` |
| `/ikona/`, `/ikona/galeria/` | `/ikony` |
| `/ikona/wystawy/`, `/wernisaze/` | `/ikony/wystawy` (K-90) |
| `/ikona/ikony-na-zamowienie/` | `/ikony/na-zamowienie` |
| `/oprowadzania-kuratorskie/` | `/ikony/wystawy#oprowadzania` (K-90) |
| `/ikony/wystawa` (adres z etapu 7–8) | `/ikony/wystawy` (301 w etapie 9) |
| `/wydarzenia/` | `/aktualnosci` |
| `/wyjazdy-studyjne/` | `/aktualnosci` |
| `/poswiecenia-ikon/` | wpis Aktualności (K-77; slug w migracji) |
| `/publikacje/` | `/publikacje` |
| `/publikacje/artykuly/` | `/publikacje#artykuly` |
| `/publikacje/multimedia/` | `/publikacje` |
| `/publikacje/plakaty/` | `/aktualnosci` |
| `/ikona-korzenie-i-owoce-wiary-2/` i wpisy wystaw z lat 2015–2018 | `/ikony/wystawy` (kotwice `#wystawa-{rok}` gdy relacja doroczna) |
| pojedyncze wpisy oprowadzań 2017 (`/ikony-emaliowane/`, `/ikona-trojcy-swietej/`, `/ikona-serca-jezusa/`, `/wystawa-ikona-korzenie-i-owoce-wiary-oprowadzania-kuratorskie/`) | jeden połączony wpis w `/aktualnosci/[slug]` |
| pozostałe wpisy wystaw i wyjazdów | odpowiadające wpisy `/aktualnosci/[slug]` |
| `/aktualnosci/wystawa-ikona-dzis-2` | `/aktualnosci/wystawa-ikona-dzis` (K-67, scalenie duplikatów) |
| `/aktualnosci/149` | `/aktualnosci/ikona-piekno-zanurzone-w-tajemnicy` (K-67, scalenie duplikatów) |

**Zasada ogólna (K-50):** brak osobnej trasy dla wydarzeń; wydarzenia to wpisy Aktualności z `kind`.

---

## 6. Wymagania funkcjonalne v1

**Musi być:**
- Strona główna: hero, sekcja „Najbliższe” (z CMS/danych), trzy filary, wybrane ikony, cytat, blok „Prowadząca” (mały, nie dominujący), miejsce, kontakt.
- Strony ofertowe (kurs, plener, wykłady, ikony na zamówienie) z blokiem `FactsBox`/„W skrócie” zasilanym z `OfferFacts` — nie z tekstu w body.
- Dwa stany `FactsBox`: nabór otwarty (CTA złote) i zamknięty (`enrollmentOpen: false` → przycisk drugorzędny + inny komunikat, np. „nabór rusza w marcu” lub „zapytaj o miejsce”).
- `/ikony/na-zamowienie` na szablonie strony ofertowej, sekcja „Jak przebiega zamówienie” jako sekwencja 3 kroków (Rozmowa · Zaliczka · Realizacja — makieta `#2a-zamowienie`), „Przykłady realizacji” (3–4 ikony), link do niej z Galerii.
- Zapisy: przyciski `mailto:` z tematami z §7 poniżej + `tel:`. Przygotować miejsce pod formularz w v2 (nie budować go teraz).
- Program bieżącego sezonu wykładów jako lista (data, tytuł, prowadzący); archiwum jako rozwijane sezony (`SeasonAccordion`).
- Galeria: dwie sztywne sekcje (ikony Elżbiety Jackowskiej-Kurek → ikony uczniów), filtr **tematu** przez query string (`?temat=<slug-tagu>`), bez filtra autora; lightbox. W siatce — sam tytuł; w lightboxie — pełny autor, wymiary i technika (`IconWork`). Lista nazwisk uczniów w sekcji uczniów, generowana z danych.
- Aktualności: jeden strumień wpisów z etykietą typu (`kind`), jedna chronologiczna lista z nawigacją po latach (K-70), wpis pojedynczy; bez filtrów kategorii w v1 (K-50, K-52).
- Publikacje (K-76): `/publikacje` — sekcja albumu + lista artykułów; podstrona albumu z blokiem metryczki/zakupu (`dostepny` / `wyczerpany`, wzorowany na `FactsBox`), zakup przez `mailto:` na sekretariat i na wykładach w KŚT; artykuły ze blokiem źródła (album / media / tylko zajawka + link); linki spis treści ↔ artykuł (`toc[].articleSlug`). Terminologia UI: **album**, nie „książka” ani „katalog”.
- Kontakt: adres, **osadzona** mapa (nie surowy link; `MapBlock` + `SiteSettings.mapEmbedUrl`), dwa maile z opisem, telefon, info o wejściu od strony zakrystii (treść redakcyjna w MDX), blok „Akademia w sieci” w `MapBlock`.
- Mobile-first, WCAG AA (kontrast, fokus, alt), `prefers-reduced-motion`.
- SEO: metadata + Open Graph per strona, sitemap, 301 ze starych URL.
- JSON-LD: `Organization` (z `parentOrganization` → Fundacja), `Person` (EJK, z `sameAs`), `Event` (wykłady bieżącego sezonu), `Course` (kurs, plener).
- Analityka bez ciasteczek od v1 (zdarzenia: klik CTA zapisów, telefonu, mailto).

**Poza zakresem v1:** formularze z backendem, płatności, sklep, wersja EN, konta użytkowników, wyszukiwarka, import listy ikon na sprzedaż z blogspota.

---

## 7. Z handoffu Claude Design — co musi trafić do kodu

*(Makiety zatwierdzone, pełny handoff w `design/`. Poniżej tylko to, co łatwo przeoczyć.)*

**Tematy `mailto:` (dokładne stringi, nie parafrazować):**
- `Zgłoszenie – kurs roczny 2026/2027`
- `Zgłoszenie – Letnia Szkoła Światła 2027`
- `Zgłoszenie – wykłady 2026/2027`
- `Zapytanie – ikona na zamówienie`
- `Zamówienie – album „Ikona dziś. Akademia Ikony 2010–2025”` (K-76; zapis do potwierdzenia razem z tytułem albumu)

Telefon jako `tel:+48601734705`.

**Nazwy komponentów (użyć tych nazw w kodzie, żeby zgadzały się z design/README):**
`Header`, `Footer`, `SectionNav`, `Breadcrumb`, `Hero`, `FactsBox`, `OfferCard`, `LectureList`, `SeasonAccordion`, `IconGrid`, `Lightbox`, `NewsCard`, `Testimonial`, `MapBlock`, `StepList` (proces zamówienia), `TocSidebar` (strona tekstowa). `EventCard` usunięty (K-50, 2026-09-21) — dział „Wydarzenia” zlikwidowany, wpisy renderują się przez `NewsCard`.

**Tokeny — kolory:** kolor `#8d7d69` był w makietach niedostatecznie kontrastowy (4,3:1 na tłach kart) i został **zamieniony na `#a2917c`** w całym systemie. `#8d7d69` może zostać wyłącznie w placeholderach makietowych (IBM Plex Mono) — **nie kopiować go do produkcji.**

**Tokeny — typografia:** EB Garamond (H1–H3, cytaty, daty), IBM Plex Sans (tekst, UI). IBM Plex Mono **nie jest tokenem produkcyjnym** — to tylko oznaczenia placeholderów w makiecie.

**Rozmiar tekstu:** minimalny stopień skali dla tekstu czytanego w **IBM Plex Sans** (podpisy UI, breadcrumb, etykiety) to 14px desktop / 15px mobile. **EB Garamond nie schodzi poniżej 16,5 px** — daty, meta i podpisy ikon: 16,5–17 px; jeśli etykieta ma zostać mniejsza, przechodzi do Plex 14,5 px (wyjątek marki: podtytuł logo 15 px desktop). **13px nie istnieje w skali produkcyjnej** — jeśli coś w handoffie ma 13px, to błąd makiety, zgłosić, nie kopiować.

**Fokus:** obrys 2px złoto `#e8c765`, odstęp 2px, musi być widoczny na ciemnym tle.

**Promień/cień:** brak zaokrągleń (radius 0) w całym projekcie poza lightboxem; brak cieni poza lightboxem.

**Treści makietowe — NIE przenosić do kodu jako prawdziwa treść (to placeholdery z makiet, nadpisać danymi z §8 lub z rzeczywistej treści klienta):**
- cytaty uczestników bez wskazanego źródła
- wpisy aktualności oznaczone `[przykład]`
- sekcja „Rytm dnia” na stronie Letniej Szkoły Światła — układ dnia jest propozycją, nie faktem
- tytuł wykładu inauguracyjnego („Otwarcie sezonu”) — nie pochodzi z briefu
- wymiary ikon oznaczone `[z podpisu WP]` — niezweryfikowane, sprawdzić przy migracji

**Potwierdzone:** liczba sezonów wykładów — 16 łącznie (od 2012/2013); bieżący sezon 2026/2027 to szesnasty; archiwum obejmuje 15 sezonów archiwalnych (2012/2013–2025/2026).

**Decyzje strukturalne z handoffu:**
- `/wyklady` = hub + bieżący sezon + zwinięte archiwum; `/wyklady/archiwum` = osobna trasa z pełną listą.
- `/publikacje` — układ wg K-76: album + artykuły, bez `SectionNav` i bez zakładek; podstrony albumu i artykułu na szablonie strony tekstowej. Makieta oczekiwana: `design/Akademia Ikony - Publikacje.dc.html` + `design/README-publikacje.md` (sloty `PU-*`).
- Terminologia wydawnicza: w treści, UI, CTA i `mailto:` używamy słowa **„album”**; nie „książka” ani „katalog” (wyjątek: nazwy plików ze starej strony WP).

---

## 8. Fakty stałe (źródło prawdy dla treści — wpisać dosłownie, nie parafrazować)

- Nazwa: AKADEMIA IKONY – Studium Ikonograficzne św. Andrzeja Apostoła. Założona 2010, w KŚT od 2012.
- Miejsce: Kościół Środowisk Twórczych pw. św. Andrzeja Apostoła i św. Brata Alberta Chmielowskiego, Plac Teatralny, Warszawa. Rektor: ks. Grzegorz Michalczyk. Przestrzeń bez barier architektonicznych.
- Mapa Google (embed, `SiteSettings.mapEmbedUrl`): `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2442.9544621239593!2d21.00606051625467!3d52.24421077976289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471eccf307a4ec4f%3A0x8f7c429c0465b439!2zS2_Fm2Npw7PFgiBwdy4gxZt3LiBCcmF0YSBBbGJlcnRhIGkgxZt3LiBBbmRyemVqYSBBcG9zdG_FgmE!5e0!3m2!1spl!2spl!4v1506790619997` (kościół pw. św. Brata Alberta i św. Andrzeja Apostoła — ze strony kontaktowej WP).
- Organizator: fundacja IKONA DZIŚ, www.ikonadzis.org.
- Kontakt ogólny/warsztaty/ikony: `akademiaikony@gmail.com`, tel. `601 734 705` (Elżbieta Jackowska-Kurek).
- Wykłady/sekretariat: `sekretariat.ikony22@gmail.com` (Maurycy Lubak).
- Blog: studiumikony.blogspot.com. Facebook: facebook.com/akademiaikony. YouTube: @akademiaikony3822.
- Warsztaty 2026/2027: zgłoszenia do 24.09.2026 mailem; rozmowa wstępna ~30 min; pierwsze spotkanie 6.10.2026, 18:00; raz w tygodniu, październik–czerwiec, grupy wieczorne i dzienne; materiały na miejscu.
- Wykłady 2026/2027: „Ikona – korzenie i owoce wiary. Mistyka dziś”; wybrane wtorki 18:00–20:30; 400 zł/rok; zapisy do końca września 2026; terminy: 06.10, 10.11, 08.12, 19.01, 16.02, 09.03, 13.04, 11.05, 08.06, 11.06, 12.06 (wernisaż, AGAPA).
- Letnia Szkoła Światła: plenery tygodniowe sierpień/wrzesień; nabór na 2027 rusza w marcu 2027, kolejność zgłoszeń.
- Ikony na zamówienie: kontakt jak wyżej; szczegóły procesu i czas realizacji — do potwierdzenia z EJK (nie zgadywać, zostawić placeholder w CMS-owalnym polu).
- Album jubileuszowy (K-76): tytuł **„IKONA DZIŚ. AKADEMIA IKONY 2010–2025”** (zapis do potwierdzenia; na starej stronie WP był z przecinkiem). Wydawca: Fundacja IKONA DZIŚ (self-publishing), rok **2025**. **132** strony, format **23 × 23 cm**, cena **140 zł**. Dostępny; wysyłka pocztą; sprzedaż na wykładach w KŚT. ISBN: **do podania**. Zamówienie: `mailto:` na sekretariat (`sekretariat.ikony22@gmail.com`) z tematem jak w §7; koszt wysyłki i dane do przelewu — w odpowiedzi mailowej, nie na stronie.
- Uwaga prawna (pełne zdanie, wielka litera na początku): „Nauczanie w Akademii Ikony nie niesie za sobą żadnych skutków formalnych.”

---

## 9. `CLAUDE.md` — konwencje (przypomnienie, plik ma być w repo)

- Bez pętli `for`/`for-of` — `map`/`filter`/`reduce`/`forEach`.
- Jeden plik = jeden komponent, nazwane eksporty, props typowane.
- Stringi UI w `src/i18n/pl.ts`, nie hardkodować w JSX.
- Obrazy tylko przez `next/image` z podanymi wymiarami.
- Każdy interaktywny element: widoczny fokus; `alt` obowiązkowy; `prefers-reduced-motion` respektowany.
- Fonty przez `next/font`, subsety `latin` + `latin-ext` (polskie znaki).
- Zadania >3 plików: najpierw plan, czekać na OK.
- Po każdym etapie: `npm run build` + `npm run lint` muszą przechodzić.
- Nie zmieniać tokenów designu bez wyraźnej prośby — odstępstwa od makiety zgłaszać, nie decydować samemu.
- `docs/brief-full.md` §9 (odzwierciedlone w §8 tutaj) jest źródłem prawdy dla maili/telefonu/dat — nie wymyślać innych wartości.

---

## Kolejność implementacji (przypomnienie)

Szczegóły i status: `docs/plan-claude-code.md` §2. Strony budujemy na danych `sample` z makiet; migracja WP zastępuje je na końcu, bez dotykania komponentów.

1. Szkielet, design system, warstwa treści
2. Strona główna
3. Strony ofertowe
4. Wykłady · 5. Galeria · 6. Pozostałe (kolejność 4–6 elastyczna)
7. Wykończenie: SEO, dane strukturalne, analityka
8. **Migracja treści z WordPressa** (zastąpienie wszystkich `sample`)
9. Wdrożenie (DNS, 301, GSC, runbook)
