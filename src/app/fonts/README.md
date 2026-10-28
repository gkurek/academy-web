# Fonts

Self-hosted subsets loaded by `next/font/local` in `src/app/layout.tsx` (11b, K-163). Licence: SIL OFL 1.1 (`OFL-*.txt`).

| File | Source (github.com/google/fonts, `main`) | Axes kept |
| --- | --- | --- |
| `eb-garamond-pl.woff2` | `ofl/ebgaramond/EBGaramond[wght].ttf` (v1.003) | `wght` 400–600 |
| `ibm-plex-sans-pl.woff2` | `ofl/ibmplexsans/IBMPlexSans[wdth,wght].ttf` (v3.201) | `wght` 400–700, `wdth` pinned to 100 |

Character set: Basic Latin, Latin-1, Polish letters, Œ/œ, typographic punctuation (dashes, quotes, ellipsis, bullet, ‰, ‹ ›), €, ™, arrows ← ↑ → ↓ ↗, − ≤ ≥, and the Greek letters used in content (ε κ ν ώ ἰ). Anything else falls back to the system font — check new content for characters outside this set.

Regenerate (fonttools + brotli, e.g. in a throwaway venv):

```bash
U="U+0020-007E,U+00A0-00FF,U+0104-0107,U+0118-0119,U+0141-0144,U+015A-015B,U+0179-017C,U+0152-0153,U+0131,U+02C6,U+02DC,U+03B5,U+03BA,U+03BD,U+03CE,U+1F30,U+2010-2027,U+2030,U+2039-203A,U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2264-2265"
FEAT="kern,liga,clig,calt,ccmp,locl,mark,mkmk,tnum,lnum,pnum"
python -m fontTools.varLib.instancer "EBGaramond[wght].ttf" wght=400:600 -o garamond.ttf
python -m fontTools.varLib.instancer "IBMPlexSans[wdth,wght].ttf" wght=400:700 wdth=100 -o plex.ttf
python -m fontTools.subset garamond.ttf --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file=eb-garamond-pl.woff2
python -m fontTools.subset plex.ttf --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file=ibm-plex-sans-pl.woff2
```
