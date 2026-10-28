# WP Statistics — eksport starej strony (2026-10-28)

Źródło: `wp-admin` → Statystyka → Optymalizacja → Data Export (CSV), WP Statistics 14.16.14. Zakres: 2017-09-28 – 2026-10-27. Do porównania ruchu starej i nowej strony (K-07). Liczby zawyżone przez boty — porównywać trendy.

| Plik | Zawartość |
| --- | --- |
| `wp-statistics-summary-totals.csv` | surowa tabela `summary_totals`: dzienne `visitors`, `views` |
| `wp-statistics-pages-monthly.csv` | tabela `pages` zsumowana do miesięcy: `month`, `path` (bez query stringu, małe litery, bez końcowego `/`), `views` |
| `wp-statistics-visitors-monthly.csv` | tabela `visitor` zsumowana do miesięcy: `month`, `dimension` (`device`, `platform`, `agent`, `source_channel`, `source_name`, `location`, `honeypot`, `referrer_host`), `value`, `visitors` |

Tabela `visitor` zawiera IP i User-Agent — nie zapisywana surowo, tylko sumy liczone w przeglądarce.
