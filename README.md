# MessyMobility · Mall Operations Intelligence (demo)

A public demo of MessyMobility's mall operator dashboard, styled in the
MessyNet "Signal in the Dark" design system. It shows how a July 2026 Singapore
mobility panel reads three mall archetypes — **Jem** (transit town-centre),
**VivoCity** (harbourfront destination) and **Waterway Point** (suburban
heartland) — from catchment down to an illustrative in-mall Wi‑Fi scenario.

Use the mall selector at the top to switch between the three malls.

## What's real vs. illustrative

- **Observed** metrics (KPIs, mobility index, catchment decay, hourly rhythm,
  competitive leakage, audience segment mix, lifestyle lift, behavioral peers,
  June→July audience drift) are transcribed
  from a July 2026 Singapore Veraset panel. They are **relative panel signals,
  not absolute mall totals.**
- **Modelled** attributes (SES mix, behavior segments, trip-chain archetypes)
  are area-level, illustrative signals.
- The **indoor Wi‑Fi scenario** (zone presence/dwell/capture, journey funnels)
  and the **synthetic floor plans** for VivoCity and Waterway Point are
  demonstrations with no backing data. Jem uses its public accessibility plan.

No raw mobility data or proprietary analytics code is included in this repo — it
is a self-contained frontend build.

## Relationship to the analytics repo

This repo is a **frontend mirror** of the mall dashboard in the source-of-truth
analytics repo, `messynet/MessyMobility_Analytics`. It is deliberately a
**lightweight presentation build**: the consumer-graph mode renders from the
precomputed data in `public/demo/`, so — relative to the source repo — it
intentionally omits:

- the client-side pipeline worker in `App.tsx` (`usePipelineWorker`), and
- the raw datasets it would process — `public/singapore_veraset_sample.csv`
  (~60 MB) and `public/metro_manila_movement_10k.csv` (~5 MB) — plus the
  unreferenced full-resolution floor-plan PNGs (`jem-level-*.png`; the app uses
  the `*-display.png` variants).

Everything else under `src/` and `public/demo/` is kept **byte-identical** to the
source repo. The mall figures come from the source repo's mall analytics, which
regenerate `data/analytics_out_july/mall.json`; that file is copied here as
`public/demo/mall.json`.

**To update:** re-sync `src/components/mall/`, any other changed `src/` files, and
`public/demo/mall.json` from `messynet/MessyMobility_Analytics`. Do **not**
re-introduce the pipeline worker or the raw CSVs — that divergence is intentional
and keeps the client demo fast to load.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploys automatically to GitHub Pages on push to `main`
(`.github/workflows/deploy.yml`).

## Stack

React + TypeScript + Vite + Tailwind CSS v4.
