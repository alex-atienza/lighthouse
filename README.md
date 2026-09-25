# Lighthouse — Voice of the Customer

A clickable, front-end prototype of **Project Lighthouse**, New Relic's unified Voice-of-the-Customer feedback engine. This is the "Direction A · Lighthouse Answer" concept built out to a full product: an editorial answer-engine front door on top of an analytical VoC substrate.

Pixel-faithful to the warm editorial design direction (Fraunces + Inter, rust/paper/ink). **No backend and no real AI** — every screen reads from one coherent, seeded, in-memory dataset so the whole app feels real and stays internally consistent.

**▶ Live demo:** https://pages.datanerd.us/aatienza/lighthouse/ (New Relic internal · GitHub Pages)

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173. A page reload resets the demo to a clean state (there's also a **Reset demo** button in the sidebar footer).

```bash
npm run build      # type-check (tsc) + production build
npm run typecheck  # types only
```

### Deploy the live demo

Publishes the built site to the `gh-pages` branch, which GitHub Pages serves at
the Live demo URL above:

```bash
npm run deploy
```

Routing is **hash-based** (`#/executive`, `#/signals`, …) and Vite's `base` is
relative (`./`) so deep links and refreshes work on the Pages sub-path with no
server rewrite.

## Stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** — design tokens live in `tailwind.config.js`
- **React Router** — 46 routes across 8 workflow areas
- **Recharts** — the sentiment-over-time area chart (all other charts are hand-built SVG/CSS)

## The 8 workflows (46 screens)

1. **Ask** — ask a question → sourced answer (with a live "reading the feedback" build) → evidence → thread → saved
2. **Themes** — explorer, theme detail, library, following, weekly digest
3. **Signals** — feed, detail, rules, routing, act (triage)
4. **Executive** — State of the Customer, Product Health, Where to Focus, Revenue Impact, Board Narrative + **Value & ROI** (dashboard, churn, expansion, efficiency, business case)
5. **Reports** — overview, builder, generating, report, share
6. **Prioritize** — board, impact–effort matrix, roadmap, Jira sync, outcomes, opportunity detail
7. **Research** — pipeline, find candidates, matches, candidate profile, notify AE
8. **Sources** — overview, connect, pipeline, taxonomy, coverage

## How the data works

- `src/data/types.ts` — the domain model (Source, FeedbackItem, Account, Theme, Signal, Rule, ResearchCandidate, Opportunity, Answer, Report, ROI).
- `src/data/seed.ts` — a **deterministic** generator (fixed PRNG seed + fixed "now" anchor) producing ~370 feedback items, 20 themes, 14 signals, 15 opportunities, 10 candidates, 35 accounts, 6 reports — all cross-referenced by ID.
- `src/store/` — a React Context + `useReducer` store. Screens read via typed selector hooks (`useThemes`, `useSignals`, `useExecutiveMetrics`, `useRoi`, …). All executive/ROI figures are **computed rollups** over the seed, not hardcoded, so numbers reconcile across screens. Filters, follows, statuses, pins, and generated reports are session mutations.

## Structure

```
src/
  components/    ui.tsx (kit), domain.tsx, charts.tsx, icons.tsx, shell/
  config/nav.ts  8-item workflow nav (drives sidebar + route map)
  data/          types.ts, seed.ts
  store/         LighthouseProvider.tsx, hooks.ts
  screens/       one folder per workflow
  router.tsx     all 46 routes
```

## Notes

- All ROI / value figures are **seeded assumptions**, labelled as such in the UI — this is a design prototype, not a data product.
- Charts follow a validated visualization method: single-hue for magnitude, a diverging red↔neutral↔green triad for sentiment/health, legends + direct labels, no dual axes.
