---
name: evaluate-chunk
description: >-
  Technical evaluation of a completed academy-web stage (etap) before commit/merge.
  Reads the stage plan file, git diff vs main, CLAUDE.md and brief-claude-code.md,
  runs build/lint, and returns a structured verdict with refactor priorities.
  Use when the user invokes evaluate-chunk or asks for technical evaluation of an
  etap before closing it, e.g. with @docs/plans/09-migracja.md.
disable-model-invocation: true
---

# evaluate-chunk

Technical evaluation of one etap implementation **before commit / stage closure**.

## Input

User provides **one argument**: path to the stage plan file, e.g. `docs/plans/09-migracja.md`.

If missing, ask for it. Do not guess the stage.

## Workflow

### 1. Read and parse the plan

Read the plan file. Extract:

| Field | Source in plan |
| --- | --- |
| Stage number `NN` | Title `# Plan NN — …` |
| Stage name | Title after em dash |
| Branch | Line `Gałąź: feat/NN-slug` |
| Scope | `## Cel i zakres` |
| Decisions | `## Decyzje podjęte w sesji planistycznej` |
| Expected files | Table `## Pliki i komponenty` (column `Plik`) |
| DoD | `## Kryteria ukończenia etapu` checkboxes, or chunk criteria in `## Kawałki` if no DoD section |
| Merytoryczna context | `## Postęp` — last checkpoint notes, cleanup rows |
| Sample data | `## Dane sample dodawane w tym etapie` |

Also read:
- `CLAUDE.md`
- `docs/brief-claude-code.md` — at minimum §2 (stack), §3 (routing if routes touched), §4 (content model), §7/§8 if mailto/tel/facts appear in plan

### 2. Determine file scope

Run (read-only):

```bash
git branch --show-current
git diff main...HEAD --name-only
git diff main...HEAD --stat
```

Evaluation scope = **union** of:
1. Files from `git diff main...HEAD --name-only`
2. Files listed in plan table `## Pliki i komponenty`

**Exclude:** `.next/`, build artifacts, unrelated untracked noise.

If not on the plan's branch (`Gałąź:`), note it in the report — still evaluate diff vs `main`, but flag branch mismatch.

If diff is empty, check `git status` and warn — evaluation may be incomplete.

### 3. Infer stage-specific focus

From plan scope / file table, add **one extra priority block** (point 5 in evaluation) — pick all that apply:

| Signal in plan | Extra focus |
| --- | --- |
| MDX, `@next/mdx`, `mdx-components` | MDX pipeline: mapa tagów, frontmatter w `src/content/*`, brak treści w JSX |
| Client Component, akordeon, filtry, lightbox, menu | Interakcja: klawiatura, fokus, `aria-*`, sensowny DOM bez JS |
| `types.ts` changes | Zgodność z brief §4; czy rozszerzenia są uzasadnione w decyzjach planu |
| `content/` JSON/MDX | Warstwa `src/content/*` czyta dane; brak hardkodu; `sample` oznaczone |
| `globals.css` / tokeny | Nowe tokeny vs reuse istniejących |
| `mailto:` / `tel:` / FactsBox | Tematy §7, telefon §8, oba stany naboru |
| Trasy `src/app/` | K-11: foldery PL = URL; default export po angielsku |

### 4. Run verification

```bash
npm run build
npm run lint
```

Record pass/fail. If build/lint cannot run, say so and continue with code review.

### 5. Review changed code

For each file in scope, check against priorities below. Skim related existing components from earlier stages for reuse opportunities (`Button`, `SectionPageShell`, `Hero`, `FactsBox`, `OfferPage`, `IconGrid`, `Testimonial`, layout patterns from stages 1–2).

**Do not re-evaluate merytoryka:** copy, §8 facts, mailto subjects, editorial decisions closed in plan — skip unless obvious code bug (wrong string wired in code).

## Evaluation priorities (in order)

1. **Prostota** — minimal solutions; flag over-engineering (extra context, unnecessary Client Components, indirection).
2. **Reuse** — new code replaceable by existing components/patterns from prior etapy?
3. **Standaryzacja** — design tokens from `globals.css` / `@theme`; no arbitrary Tailwind (`text-[…]`, `bg-[#…]`); banned: `#8d7d69`, 13px, shadows/radius outside `Lightbox`, IBM Plex Mono.
4. **Konwencje repo** — K-11, no `for`/`for-of`, UI strings in `pl.ts`, RSC default, `next/image` with dimensions, no unapproved `types.ts` changes, editorial content only in `content/`.
5. **Stage-specific focus** — from step 3.
6. **DoD from plan** — technical compliance with plan checklist (not merytoryka).
7. **Build/lint** — results from step 4.
8. **Accessibility** — visible focus (2px `#e8c765`, 2px offset), mailto/tel CTA, keyboard on interactive elements; `prefers-reduced-motion` where animations added.

## Output format

Use this structure exactly:

```markdown
# Ewaluacja techniczna — Etap NN ([nazwa])

**Gałąź:** `feat/NN-slug` (actual: …)
**Plan:** `docs/plans/NN-slug.md`
**Zakres:** N plików (git diff + plan)
**Build/lint:** OK / [errors]

## Werdykt

[Gotowe do zamknięcia etapu / Wymaga poprawek — one sentence why]

## Tabela

| Obszar | Status | Plik(i) | Rekomendacja |
| --- | --- | --- | --- |
| … | OK / do poprawy / do decyzji | … | … |

## Refaktory (od najprostszych diffów)

1. …
2. …

## Kolejność poprawek

[If any — ordered list; else „brak”]

## Uwagi

- Merytoryka: nie oceniana (zamknięta w planie).
- [Branch mismatch / empty diff / other caveats]
```

Status legend:
- **OK** — no action needed
- **do poprawy** — clear fix, no product decision
- **do decyzji** — needs owner call (tradeoff, scope, design)

Refactor list priority: **remove dead code → reuse existing → token instead of custom → larger refactors last**.

## Rules

- Do **not** propose new dependencies.
- Do **not** commit or edit code unless user explicitly asks after evaluation.
- Do **not** change `content/` except flag obvious data bugs.
- Do **not** evaluate files outside this etap's diff.
- Do **not** duplicate merytoryczna review.

## Example invocation

```
/evaluate-chunk @docs/plans/09-migracja.md
```

or:

```
evaluate-chunk docs/plans/10-wykonczenie.md
```
