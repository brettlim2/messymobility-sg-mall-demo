# VectorMobility · Mall Operations Intelligence (demo)

A public demo of VectorMobility's mall operator dashboard, styled in the
MessyNet "Signal in the Dark" design system. It shows how a July 2026 Singapore
mobility panel reads three mall archetypes — **Jem** (transit town-centre),
**VivoCity** (harbourfront destination) and **Waterway Point** (suburban
heartland) — from catchment down to an illustrative in-mall Wi‑Fi scenario.

Use the mall selector at the top to switch between the three malls.

## What's real vs. illustrative

- **Observed** metrics (KPIs, mobility index, catchment decay, hourly rhythm,
  cross-shopping, behavioral peers, June→July audience drift) are transcribed
  from a July 2026 Singapore Veraset panel. They are **relative panel signals,
  not absolute mall totals.**
- **Modelled** attributes (SES mix, behavior segments, trip-chain archetypes)
  are area-level, illustrative signals.
- The **indoor Wi‑Fi scenario** (zone presence/dwell/capture, journey funnels)
  and the **synthetic floor plans** for VivoCity and Waterway Point are
  demonstrations with no backing data. Jem uses its public accessibility plan.

No raw mobility data or proprietary analytics code is included in this repo — it
is a self-contained frontend build.

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
