---
name: start-code
description: >-
  Starts the next implementation chunk (kawałek) for an academy-web stage plan.
  User passes only the plan file path (e.g. docs/plans/09-migration.md). The
  agent infers stage number, branch, and which chunk is pending from the plan
  Postęp table, reads CLAUDE.md and the plan, then implements that single chunk
  and stops with a checkpoint meldunek. Use when the user invokes /start-code
  or asks to start the next kawałek from a plan file.
disable-model-invocation: true
---

# start-code

Begin **one** implementation chunk from an approved stage plan. Do not start the following chunk in the same turn.

## Input

User provides **one argument**: path to the stage plan, e.g. `docs/plans/09-migration.md`.

If missing, ask for it. Do not guess the plan.

## Workflow

### 1. Read the plan and gate on status

Read the plan file. Extract:

| Field | Where |
| --- | --- |
| Stage `NN` | Title `# Plan NN — …` |
| Branch | `Gałąź:` / `Branch:` line |
| Plan status | `Status:` line |
| Chunks | `## Kawałki` → `### Kawałek N — …` (count M) |
| Next chunk | `## Postęp` table (see below) |
| Scope / DoD | `## Cel i zakres`, chunk „Kryterium gotowe”, stage DoD |
| Decisions | `## Decyzje z sesji planistycznej` (or Polish variant) |

**Do not implement** if status is still „plan w przygotowaniu” / „plan in preparation”. Tell the user to finish planning and approve the plan first.

### 2. Pick the chunk to implement

Read `## Postęp` in order (row 1 = kawałek 1, etc.):

- **Next chunk** = first row whose `Status` is ⬜, empty, or not marked done (✅ / „zamknięty” / „done”).
- If **every** row is done → do not code. Report that implementation chunks are finished; suggest running `/evaluate-chunk` on the same plan and closing stage DoD.
- If `## Postęp` is missing → default to **Kawałek 1** and note it in the opening message.

Match the row to `### Kawałek N` in `## Kawałki` and load that section’s **Zakres** and **Kryterium „gotowe”**.

### 3. Repo sanity (read-only)

```bash
git branch --show-current
git status --short
git log -5 --oneline
```

- If current branch ≠ plan `Gałąź`, **warn** and ask whether to switch before coding (do not switch without user confirmation).
- If there are uncommitted changes and `Postęp` still shows the same chunk as ⬜, assume **work in progress on that chunk** — continue or finish it; do not skip to the next chunk.

### 4. Read project rules

Always read before coding:

- `CLAUDE.md`
- The full plan file (especially the target kawałek)
- `docs/brief-claude-code.md` — sections relevant to this chunk (routing §3, content model §4, migration §5 if WP/migrate script, §7–§8 if contact/facts)

Read `design/README` and mockups **only** if the chunk touches UI (stage 9 migration usually does not).

Read `docs/plan-claude-code.md` §3 for the stage when the plan points there (e.g. legacy „Wydarzenia” rules on chunk 4).

### 5. Stage 9 migration — gate w czacie (plan `09-migration`, `migrate-wp`, K-122)

**Nie** stosuj starego rytmu „dry-run → pełny zapis całej domeny”. Treść redakcyjna idzie **pozycja po pozycji w czacie**; użytkownik decyduje przed każdym zapisem.

Dla bieżącego kawałka (`--only=<domain>` z planu):

1. **Pobierz z WP** — REST (K-121); dane do porównania, **bez** masowego nadpisywania `content/` / `public/media/` (skrypt może `--dry-run` lub fetch tylko do raportu).
2. **Mapowanie** — dla każdej pozycji: trasa URL, komponent, plik w `content/` (i ewentualnie media), gdzie użytkownik to **zobaczy**.
3. **Lista decyzyjna w czacie** — **jedna pozycja na turę** (użytkownik potwierdził: w czacie, nie jedna wielka tabela na cały kawałek bez dialogu):
   - treść / pole z WP (skrót lub cytat),
   - to samo **u nas teraz**,
   - krótko: różnice.
   - Czekaj na decyzję: **WP** / **zostawiamy** / **mix** (mix = konkretnie co z czego).
4. **Zapis** — tylko po decyzji dla tej pozycji (lub małego batcha, jeśli użytkownik tak powie). Zaktualizuj `scripts/migrate-report.md`: sekcja kawałka + tabela **zamrożeń** (plik/pole → decyzja → data).
5. **Źródło prawdy** — wersja po decyzji użytkownika jest **zamrożona**. Kolejne uruchomienia `migrate-wp` **nie mogą** jej nadpisać (wyłącz w migratorze / rejestrze zamrożeń). Przy ponownym fetchu z WP, jeśli skrypt lub diff „chce” zmienić zamrożoną pozycję → **nie zapisuj**; zgłoś **konflikt** w kroku 3 przy następnym przebiegu tego kawałka lub domeny.
6. **Koniec kawałka** — wszystkie pozycje z zakresu kawałka w planie przejrzane i zamrożone (lub świadomie odłożone do EJK / etap 10 z wpisem w raporcie). Potem checkpoint (§7) i `npm run build` + `npm run lint`.

**K-122:** `--force` nie zastępuje gate — służy tylko tam, gdzie plan/skrypt jawnie przewiduje re-run techniczny **po** Twojej decyzji o nadpisaniu zamrożenia.

Inne etapy: pomiń tę podsekcję.

### 6. Implement exactly one chunk

- Scope = **only** the selected kawałek. No „porządki przy okazji”, no next chunk.
- **Etap 9:** implementacja = infrastruktura migracji + gate z §5; **nie** zamykaj kawałka jednym masowym `--only=` bez przejścia listy w czacie (chyba że użytkownik wyraźnie prosi tylko o suchy fetch / suchy dry-run).
- Follow plan file table `## Pliki i komponenty` / `## Pliki i skrypty`.
- No new npm dependencies without proposing in checkpoint „Do decyzji”.
- Do not touch `.env*`, `design/`, or `next.config.ts` unless this chunk’s plan explicitly allows it.

When done:

```bash
npm run build
npm run lint
```

### 7. Stop — checkpoint meldunek (Polish, fixed format)

Do **not** start the next kawałek. Output:

```markdown
## Checkpoint N/M — [nazwa kawałka z planu]
Zrobione: [pliki + jednym zdaniem co w każdym]
Odstępstwa od planu / makiety: [… albo „brak”]
Do decyzji: [… albo „brak”]
Następny krok: [kawałek N+1, jednym zdaniem]
Build/lint: [OK / co nie przechodzi]
Czekam na OK.
```

**Etap 9:** jeśli gate w czacie nie domknięty, checkpoint może być częściowy — w „Do decyzji” / „Następny krok” podaj **następną pozycję na liście gate**, nie przejście do kawałka N+1.

### 8. After user „OK” (not in this skill turn)

On a **later** message when user approves the checkpoint:

- Update `## Postęp` in the plan (status ✅, short note).
- Update `docs/plan-claude-code.md` §2 if stage status should move to 🟠 w implementacji (N/M).
- Propose commit message `NN/K: …` (English); do not commit unless user asks.

Invoking `/start-code` again should then pick kawałek N+1.

## Rules

- One chunk per `/start-code` invocation.
- No commit/push unless user explicitly requests (see `CLAUDE.md` §Git).
- No improvising outside the plan; if plan is wrong, stop and propose plan fix.
- UI strings in `src/i18n/pl.ts`; editorial content in `content/` only.
- No `for` / `for-of` loops in new code.

## Example

```
/start-code @docs/plans/09-migration.md
```

Agent: reads plan → Postęp shows kawałek 1 ⬜ → (etap 9) fetch WP + pierwsza pozycja gate w czacie → po decyzjach i zapisach checkpoint 1/7 → waits.
