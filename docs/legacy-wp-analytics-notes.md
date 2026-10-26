# Stara strona WP – notatki do analityki (K-07, k9)

**Po co ten dokument:** zapis analityki używanej dziś na stronie WP (narzędzia, gdzie są dane, co z nimi zrobić przy przejściu). Potrzebny przy wyborze narzędzia analitycznego i wyłączaniu WP w etapie 11 (K-07) — nie usuwać przed zamknięciem K-07.

Stan na 2026-10-25. Źródło: przegląd `akademiaikony.pl` i `wp-admin` (tylko odczyt, nic nie zmieniano).

## 1. Co jest na starej stronie

- WordPress, motyw `nisarg`.
- **Statystyki: WP Statistics 14.16.14 (aktywna).** Dane w bazie WP, tabele `wp_statistics_*`. To jedyne narzędzie analityczne znalezione w panelu.
- 10WebAnalytics: zainstalowana, **wyłączona**.
- **Brak śladu Google Analytics:** w HTML strony nie ma `gtag`, GA ani GTM; ustawienia banera cookies nie mają wklejonych skryptów (pole GTM to tylko placeholder `GTM-XXXXXX`). Do potwierdzenia w koncie GA (pkt 4).
- Baner zgody: wtyczka GDPR Cookie Compliance (Moove) – już istnieje, ale nie jest związana z GA.
- Pozostałe aktywne wtyczki: Content Views, FooGallery, Smush, Easy WP SMTP, UpdraftPlus (kopie), Prosty Google reCAPTCHA, Ograniczenie prób logowania, Easy HTTPS Redirection, Powiel wpis, Wyłączenie komentarzy, Zaawansowane narzędzia edytora.
- Nieaktywne: Akismet, Blogger Importer, Contact Form 7, LightStart, Yoast SEO, Starter Templates, Prosty Lightbox, Zmień typ treści.

## 2. Dane w WP Statistics (stan z przeglądu)

- Łącznie: 120,8 tys. odwiedzających, 423,8 tys. wyświetleń.
- Ostatnie 30 dni: ok. 1,3 tys. odwiedzających, ok. 2,2 tys. wyświetleń.
- `wp_statistics_summary_totals`: 3 314 wierszy (dzienne sumy) → ok. 9 lat historii, **początek ok. 2017 (szacunek, do potwierdzenia)**.
- `wp_statistics_visitor`: 120 844 wierszy; `wp_statistics_pages`: 89 182; `wp_statistics_historical`: 0; `wp_statistics_events`: 0 (brak zdarzeń, np. kliknięć CTA).
- **Jakość danych wątpliwa:** w 30 dniach 971 wyświetleń to „Strona logowania”; kraje: USA 26,5%, Polska 24,7%, Singapur 11%, Chiny 10,7%. To w dużej mierze boty. Realny ruch z Google (organiczny) to ok. 220 wejść/mies.
- Wniosek: stare liczby są zawyżone; porównanie z nowym narzędziem robić na trendach, nie na liczbach bezwzględnych.

## 3. Eksport danych (do zrobienia przed wyłączeniem WP)

- Panel: `Statystyka → Optymalizacja → Data Export` (`wp-admin/admin.php?page=wps_optimization_page&tab=export`).
- Formaty: CSV, TSV, XML. Tabele: `visitor`, `exclusions`, `pages`, `historical`, `visitor_relationships`, `summary_totals`, `events`.
- **Najważniejsza do archiwum: `wp_statistics_summary_totals`** (dzienne sumy, wystarcza do wykresu historii).
- `visitor` i `pages` zawierają dane osobowe (IP) → nie wkładamy do repo; jeśli eksportujemy, to poza repo i z oceną RODO.
- Przed eksportem: zrobić kopię (UpdraftPlus jest aktywny).
- Uwaga: w panelu wisi komunikat „Start Migration” (nowa tabela podsumowań) – nie uruchamiać bez kopii zapasowej.

## 4. Do sprawdzenia po stronie EJK (Google)

- **Google Analytics:** https://analytics.google.com – zalogować się kontem EJK/fundacji; czy istnieje usługa dla `akademiaikony.pl` (Administracja → Strumienie danych → adres strony), czy w Raportach → Czas rzeczywisty lub Pozyskiwanie są dane z ostatnich 28 dni. Brak usługi lub brak ruchu = GA nie jest używane.
- **Google Search Console:** https://search.google.com/search-console – zwykle jest, trzyma ok. 16 miesięcy zapytań i wyświetleń w Google. Warto wyeksportować.
- Tag Assistant (https://tagassistant.google.com) – wpisać adres strony; pokaże każdy tag Google na stronie.
- Dostęp administratora do GA/GSC: kto go ma?
- **Sprawdzone 2026-10-25 na koncie Google użytkownika (grzegorz.tomasz.kurek@gmail.com):** istnieje konto GA „akademia ikony” (id `a107415066`), jedyny użytkownik to ten sam adres (Administrator), **0 usług (properties)**, kosz pusty. Brak strumienia danych i brak danych historycznych. Wygląda na puste konto założone pod nowy serwis; stare dane GA (jeśli istniały) musiałyby być na innym koncie Google (EJK/fundacja).

- **GA najpewniej nigdy nie było:** konto GA na Gmailu właściciela repo jest puste, a stara strona nie ma kodu GA. Do potwierdzenia u EJK (czy miała własne konto Google z GA/GSC).
- **Search Console – przydatne:** historia zapytań z Google (ok. 16 mies., dostępna od razu po weryfikacji), wysyłka `sitemap.xml` (k9), kontrola indeksacji i 404/301 po wdrożeniu. Weryfikacja domeny: rekord TXT w DNS (`google-site-verification=…`), metoda „Domain” przetrwa zmianę WP → Next.js. Token nie trafia do repo.
- **Domena `akademiaikony.pl`:** zarządzana przez właściciela repo w panelu cyberfolks; rejestrator możliwe że OVH – do ustalenia (whois `.pl`: https://www.dns.pl/whois, pole `REGISTRAR`, oraz serwery nazw NS = tam leży edytowalny DNS). Rekord TXT dodajemy w panelu, który faktycznie obsługuje DNS (wskazują go serwery NS).
- **Whois dns.pl (2026-10-25):** domena aktywna, utworzona 2015-05-18, opłacona do 2027-05-18. Rejestrator: Consulting Service Sp. z o.o. (Warszawa, marka LinuxPL; należy do grupy cyber_Folks – do potwierdzenia, że to ten sam panel). Serwery nazw: `dns10.linuxpl.com`, `ns10.linuxpl.com` → DNS edytowany w panelu cyberfolks/LinuxPL, **nie w OVH**. Etap 11: przy zmianie hostingu zachować rekordy DNS (w tym TXT weryfikacji i poczty).
- **Strefa DNS w panelu cyberfolks (serwer „gkurek”, IP 195.78.67.12), stan 2026-10-25:** `A` dla `@`, `www`, `ftp`, `mail`, `pop`, `smtp` → 195.78.67.12; `MX 10 mail.akademiaikony.pl`; TXT: SPF (`-all`), DMARC `p=none`, DKIM (`x._domainkey`), kilka starych TXT (hex, nieznane pochodzenie – nie ruszać). Poczta (3 skrzynki) działa na tym samym serwerze co WP. **Etap 11:** przy przełączeniu na nowy hosting zmieniać tylko `A` dla `@` i `www`; `mail`, `MX`, SPF/DKIM/DMARC zostawić, żeby nie zepsuć poczty.
- Przed dodaniem rekordu: sprawdzić, czy EJK nie ma już własnej Search Console (wtedy wystarczy dodać użytkownika).

## 5. Decyzja K-07 (stan wiedzy)

- Import danych: Plausible importuje z GA4, Umami **nie** (tylko Umami/CSV, przez zespół, plan Pro). Z WP Statistics nie importuje żadne z nich → archiwum w CSV.
- Umami 3.4 (09.2026) ma adnotacje (datowane znaczniki na wykresie) – do potwierdzenia w dokumentacji; przydatne do oznaczenia daty wdrożenia.
- **K-07 ZAWIESZONE do sesji discovery o hostingu (etap 11).** Wynik tej analizy (2026-10-25):
  - Wymagania właściciela: tanio/za darmo, mały ruch, śledzenie tylko najważniejszych rzeczy, bez ciasteczek, **API** – docelowo zakładka analityki w panelu CMS (EJK ma widzieć wyniki bez wchodzenia do narzędzia dostawcy, doświadczenie zbliżone do WP Statistics).
  - **Umami Cloud Hobby (darmowy) odpada:** brak API (cennik umami.is); API od planu Pro, 20 USD/mies. Do potwierdzenia na koncie (Accounts → API Keys).
  - Kandydaci: **Umami self-hosted** (0 zł, pełne API, wymaga Node + Postgres) · **Plausible Cloud** (~9 USD/mies., Stats API, import z GA4, zero utrzymania) · **Matomo self-hosted** (0 zł, bogate API, działa na zwykłym PHP + MySQL, ciężki) · **GoatCounter** (0 zł, API, bardzo prosty, skromne wykresy) · **własny moduł w CMS** (liczenie wejść w własnej bazie; pełna kontrola, ale praca + filtrowanie botów).
  - **PostHog Cloud (region UE)** – kandydat: darmowy plan 1 mln zdarzeń/mies. (analityka + Web Analytics), retencja 1 rok, API w chmurze (zapytania HogQL, `Query API`). Tryb bez ciasteczek: `cookieless_mode: "always"` (nic w cookies/`localStorage`/`sessionStorage`, baner niepotrzebny) + włączyć „Cookieless server hash mode” w Project Settings → Web analytics, inaczej zdarzenia są ignorowane. Koszt trybu: zawyżone tygodniowe/miesięczne liczby unikalnych użytkowników, możliwe kolizje (to samo IP + UA), brak lokalizacji/mapy (IP usuwane przed GeoIP), bez replay/ankiet/`identify()`. Wada: ciężki skrypt, panel zbyt rozbudowany. **Do sprawdzenia:** limity API w darmowym planie (dokumentacja nieodczytana), mechanizm trybu cookieless w aktualnej wersji `posthog-js`.
  - **Umami – tryb bez ciasteczek (domyślny):** `session = hash(websiteId, IP, User-Agent, salt)`, `Visitors` = liczba unikalnych sesji, sól rotuje **co miesiąc** (`SALT_ROTATION` w self-hosted), `visit` = hash sesji + sól godzinna. IP nie jest zapisywane w rekordach analitycznych, ale służy do lokalizacji (kraj/region/miasto) – za reverse proxy trzeba przekazywać prawdziwe IP. Ograniczenia analogiczne do PostHog, lecz łagodniejsze: unikalni odwiedzający liczeni w obrębie miesiąca, lokalizacja działa.
  - **Cloudflare Web Analytics** – kandydat do sprawdzenia: darmowe, bez ciasteczek, jeden skrypt, API przez GraphQL Analytics API (token z uprawnieniem Account Analytics: Read). Skromne metryki. **Do sprawdzenia w oficjalnej dokumentacji:** retencja danych (źródła wtórne: ok. 6 miesięcy; surowe niepróbkowane krócej) i zakres przeglądarek.
  - **GA4 odpada:** brak trybu bez ciasteczek; Consent Mode zaawansowany nadal wymaga banera, a modelowanie działa dopiero przy dużym ruchu. Inne (Ackee, Simple Analytics, Fathom, Pirsch) – nie sprawdzano, płatne lub mało rozwijane.
  - Odpadają: Plausible CE i Rybbit (ClickHouse, min. 2 GB RAM – za ciężkie).
  - **Rekomendacja warunkowa:** serwer z Node + Postgres → Umami self-hosted; hosting tylko PHP/MySQL → Matomo; brak chęci utrzymania i akceptacja kosztu → Plausible Cloud.
  - **Warunek odblokowania:** decyzja o hostingu nowej strony (sesja discovery). Po niej wrócić do tej tabeli, zamknąć K-07 i dopiero uruchomić k9 (analityka).
  - Eksport WP Statistics: format importu Umami CSV nieopisany (tylko Pro, przez zespół); nie planujemy importu – archiwum `summary_totals` + wykres porównawczy + adnotacja daty wdrożenia.
- Baner cookies: nowy serwis bez ciasteczek → baner zbędny, polityka prywatności (K-119) do aktualizacji.
- Zdarzenia do mierzenia: klik CTA zapisów, `mailto:`, `tel:` (stara strona ich nie mierzy: `events` = 0).
- Data wdrożenia na produkcję: do wpisania ______ (znacznik na osi czasu).

## 6. Pytania otwarte

1. Czy konto GA istnieje i kto ma dostęp? (pkt 4)
2. Od kiedy dokładnie WP Statistics zbiera dane? (najstarszy wiersz w `summary_totals`)
3. Czy domena nowej strony będzie ta sama (`akademiaikony.pl`)?
4. Czy stare dane mają trafić do panelu nowego narzędzia (CSV, ręcznie), czy wystarczy archiwum + wykres porównawczy?
5. Jak długo trzymać stary WP po wdrożeniu (do eksportu i porównania)?
6. **Hosting nowej strony (sesja discovery)** – od niego zależy wybór narzędzia analitycznego (pkt 5, K-07).
7. ~~Weryfikacja domeny w Google Search Console~~ — **zrobione 2026-10-25:** usługa domenowa `akademiaikony.pl` zweryfikowana (rekord TXT w DNS cyberfolks; nie usuwać go – utrzymuje weryfikację). Panel pokazuje „Processing data, please check again in a day or so” (Performance, Indexing). Następny krok: po ok. dobie sprawdzić, czy widać historię zapytań (do ok. 16 mies.) i wyeksportować ją do archiwum (Performance → Export).
