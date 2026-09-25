import { useMemo, useState, type ReactNode } from 'react'
import { GlassPanel } from '../ui/GlassPanel'
import { TEAL, TEAL_MID, DEEP, MIST, FAINT, VOLT, ICE } from './palette'
import type { Band, DriftSeg, Hotspot, LeakDest, MallProfile, MixItem, Peer, SchematicFloor, SegmentLift, TagLift, TripChain } from './types'
import { MALL_PROFILES, getMallProfile } from './profiles'
import { SchematicFloorPlan } from './SchematicFloorPlan'

type Metric = 'presence' | 'dwell' | 'capture'
type Daypart = 'Morning' | 'Lunch' | 'Afternoon' | 'Evening'

const DAYPART_HOURS: Record<Daypart, number[]> = {
  Morning: [8, 9, 10, 11],
  Lunch: [12, 13],
  Afternoon: [14, 15, 16, 17],
  Evening: [18, 19, 20, 21],
}
const OPEN_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
const METRIC_LABEL: Record<Metric, string> = { presence: 'Presence index', dwell: 'Median dwell', capture: 'Zone capture' }
const METRIC_UNIT: Record<Metric, string> = { presence: '', dwell: 'm', capture: '%' }

// Daypart weighting for the illustrative map, derived from each mall's real weekday rhythm.
function daypartFactor(profile: MallProfile, daypart: Daypart): number {
  const wk = profile.rhythm.weekday
  const mean = (hrs: number[]) => hrs.reduce((s, h) => s + (wk[h] ?? 0), 0) / hrs.length
  const base = mean(OPEN_HOURS) || 1
  return mean(DAYPART_HOURS[daypart]) / base
}

export function MallSpatialAnalytics() {
  const [mallId, setMallId] = useState('jem')
  const profile = getMallProfile(mallId)
  const [floor, setFloor] = useState(profile.defaultFloor)
  const [metric, setMetric] = useState<Metric>('presence')
  const [daypart, setDaypart] = useState<Daypart>('Evening')
  const [selectedId, setSelectedId] = useState(profile.defaultZoneId(profile.defaultFloor))
  const [journeys, setJourneys] = useState(true)

  const zones = profile.hotspots[floor] ?? []
  const selected = zones.find((z) => z.id === selectedId) ?? zones[0]
  const factor = daypartFactor(profile, daypart)
  const displayValue = (zone: Hotspot) => (metric === 'presence' ? Math.round(zone.presence * factor) : zone[metric])

  function switchMall(id: string) {
    const next = getMallProfile(id)
    setMallId(id)
    setFloor(next.defaultFloor)
    setSelectedId(next.defaultZoneId(next.defaultFloor))
  }
  function switchFloor(next: string) {
    setFloor(next)
    setSelectedId(profile.defaultZoneId(next))
  }

  const isImage = profile.floorplan.type === 'image'
  const journeyPaths = isImage
    ? profile.floorplan.journeys?.[floor] ?? []
    : profile.floorplan.schematic?.[floor]?.journeys ?? []

  return <div className="space-y-5">
    {/* Mall selector */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Kicker>Mall</Kicker>
        <div className="flex flex-wrap gap-1 rounded-[8px] border border-[var(--mn-wire)] bg-[var(--mn-abyss)] p-1">
          {MALL_PROFILES.map((m) => {
            const active = m.id === mallId
            return <button key={m.id} type="button" onClick={() => switchMall(m.id)} className={`rounded-[6px] px-3 py-1.5 text-left transition-colors ${active ? 'bg-[var(--mn-teal)]' : 'hover:bg-[var(--mn-card)]'}`}>
              <span className={`block text-xs font-semibold leading-none ${active ? 'text-[var(--mn-logo-ink)]' : 'text-[var(--mn-ice)]'}`}>{m.name}</span>
              <span className={`mt-0.5 block text-[9px] leading-none ${active ? 'text-[var(--mn-logo-ink)]/70' : 'text-[var(--mn-faint)]'}`}>{m.archetype}</span>
            </button>
          })}
        </div>
      </div>
      <p className="text-[10px] text-[var(--mn-faint)]">3 mall archetypes · one July 2026 panel</p>
    </div>

    {/* ── Section 1 · Observed catchment → corridor ───────────────────────── */}
    <section className="overflow-hidden rounded-[10px] border border-[var(--mn-wire)] bg-[var(--mn-panel)]">
      <div className="border-b border-[var(--mn-wire)] border-t-2 border-t-[var(--mn-teal)] px-5 py-6 lg:px-8 lg:py-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2"><StatusChip kind="observed">Observed · Veraset panel</StatusChip><StatusChip kind={isImage ? 'map' : 'scenario'}>{isImage ? 'Official mall map' : 'Synthetic layout'}</StatusChip><StatusChip kind="scenario">Illustrative · Wi‑Fi</StatusChip></div>
            <Kicker>Singapore mall operations case study · {profile.archetype}</Kicker>
            <h2 className="mt-2 font-display text-4xl text-[var(--mn-heading)] lg:text-5xl">{profile.name} · {profile.tagline}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--mn-body)]">{profile.blurb}</p>
          </div>
          <div className="shrink-0 rounded-lg border border-[var(--mn-wire)] bg-[var(--mn-card)] px-4 py-3"><Label>Analysis window</Label><p className="mt-1 font-mono text-sm text-[var(--mn-heading)]">01–31 July 2026</p><p className="mt-0.5 text-[10px] text-[var(--mn-faint)]">{profile.address}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-[var(--mn-wire)] border-b border-[var(--mn-wire)] lg:grid-cols-4 lg:divide-y-0">
        {profile.kpis.map((kpi) => <ObservedKpi key={kpi.label} {...kpi} />)}
      </div>

      <div className="grid xl:grid-cols-[1.25fr_.75fr]">
        <div className="border-b border-[var(--mn-wire)] p-5 lg:p-7 xl:border-b-0 xl:border-r">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><Label>July mobility index</Label><h3 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">When {profile.name}’s observed audience moved</h3></div><div className="text-right"><p className="font-mono text-2xl text-[var(--mn-heading)]">{profile.meanDaily}</p><p className="text-[10px] text-[var(--mn-faint)]">mean panel devices / day</p></div></div>
          <TrendChart trend={profile.trend} peakIndex={profile.trendPeak.index} peakValue={profile.trendPeak.value} />
          {profile.panelSensitive
            ? <Caution><strong className="text-[var(--mn-ice)]">Relative index only.</strong> {profile.name}’s July trend is panel-composition sensitive; it should not be presented as absolute mall footfall until calibrated to mall counters or Wi‑Fi.</Caution>
            : <Caution><strong className="text-[var(--mn-ice)]">Relative index only.</strong> Normalised to a July mean of 100 — a shape, not absolute footfall. Calibrate to counters or Wi‑Fi before quoting visitor totals.</Caution>}
        </div>
        <div className="p-5 lg:p-7">
          <Label>Visit mission proxy</Label><h3 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">What kind of trip {profile.name} appears to serve</h3>
          <div className="mt-6 space-y-5">{profile.mission.map((m) => <MixBar key={m.label} {...m} color={m.color ?? TEAL} />)}</div>
          <div className="mt-6 grid grid-cols-2 gap-2">{profile.missionFacts.map((f) => <SmallFact key={f.label} {...f} />)}</div>
        </div>
      </div>

      {/* catchment decay + real hourly rhythm */}
      <div className="grid border-t border-[var(--mn-wire)] xl:grid-cols-2">
        <div className="border-b border-[var(--mn-wire)] p-5 lg:p-7 xl:border-b-0 xl:border-r">
          <div className="flex items-start justify-between gap-3"><div><Label>Observed catchment decay</Label><h3 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">Where {profile.name}’s July audience lives</h3></div><StatusChip kind="observed">Observed panel</StatusChip></div>
          <CatchmentCurve bands={profile.catchment.bands} markKm={profile.catchment.markKm} markLabel={profile.catchment.markLabel} />
          <div className="mt-4 grid grid-cols-3 gap-2"><SmallFact label="Median home" value={profile.catchment.medHome} /><SmallFact label="Weighted reach (est.)" value={profile.catchment.weightedVisitors} /><SmallFact label="Effective n" value={profile.catchment.ess} /></div>
          <p className="mt-3 text-[10px] leading-relaxed text-[var(--mn-faint)]">Cumulative share of panel devices whose modeled home lies within each radius. Weighted corrects for panel coverage bias; both are shown.</p>
        </div>
        <div className="p-5 lg:p-7">
          <div className="flex items-start justify-between gap-3"><div><Label>Observed hourly rhythm</Label><h3 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">When the mall fills through the day</h3></div><StatusChip kind="observed">Observed panel</StatusChip></div>
          <RhythmChart weekday={profile.rhythm.weekday} weekend={profile.rhythm.weekend} weekdayPeakH={profile.rhythm.weekdayPeakH} weekendPeakH={profile.rhythm.weekendPeakH} />
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-[var(--mn-mist)]"><LegendSwatch color={TEAL}>{profile.rhythm.weekdayNote}</LegendSwatch><LegendSwatch color={DEEP}>{profile.rhythm.weekendNote}</LegendSwatch></div>
          <p className="mt-2 text-[10px] leading-relaxed text-[var(--mn-faint)]">Mean panel visitors per hour across July. The map’s daypart weighting below is derived from this observed weekday curve.</p>
        </div>
      </div>
    </section>

    {/* ── Section 2 · Who visits & how the mall fits the day ──────────────── */}
    <section className="overflow-hidden rounded-[10px] border border-[var(--mn-wire)] bg-[var(--mn-panel)]">
      <div className="border-b border-[var(--mn-wire)] px-5 py-5 lg:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><StatusChip kind="observed">Observed audience</StatusChip><StatusChip kind="modelled">Modelled attributes</StatusChip></div><h3 className="mt-3 font-display text-3xl text-[var(--mn-heading)]">Who visits—and how {profile.name} fits into the day</h3><p className="mt-2 max-w-3xl text-xs leading-relaxed text-[var(--mn-body)]">July mobility links the mall to home catchments, recurring behavior and activity sequences. Socioeconomic propensity is a modeled area-level signal, never a claim about an individual’s income.</p></div><div className="shrink-0 text-left sm:text-right"><p className="font-mono text-xl text-[var(--mn-heading)]">{profile.sesAuc}</p><p className="text-[9px] uppercase tracking-[0.16em] text-[var(--mn-faint)]">SES model AUC</p></div></div>
      </div>

      <div className="grid border-b border-[var(--mn-wire)] xl:grid-cols-2">
        <div className="border-b border-[var(--mn-wire)] p-5 lg:p-7 xl:border-b-0 xl:border-r">
          <div className="flex items-start justify-between gap-3"><div><Label>Modelled visitor SES mix</Label><h4 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">Propensity mix across the modeled catchment</h4></div><StatusChip kind="modelled">Proxy</StatusChip></div>
          <div className="mt-6 flex h-10 overflow-hidden rounded-[6px] border border-[var(--mn-wire)]">{profile.ses.map((item) => <div key={item.label} className="flex items-center justify-center text-[10px] font-bold text-[var(--mn-logo-ink)]" style={{ width: `${item.value}%`, background: item.tone }} title={`${item.label}: ${item.value}%`}>{item.value >= 16 ? `${item.label} ${item.value}%` : item.label}</div>)}</div>
          <div className="mt-3 flex justify-between text-[9px] text-[var(--mn-faint)]"><span>Lower modeled propensity</span><span>Higher propensity</span></div>
          <div className="mt-5 grid grid-cols-3 gap-2">{profile.sesFacts.map((f) => <SmallFact key={f.label} {...f} />)}</div>
          <p className="mt-3 text-[9px] leading-relaxed text-[var(--mn-faint)]">Illustrative mix inferred from visitors’ modeled home areas and July catchment composition. Quintiles rank propensity within the Singapore panel; they are not household income bands.</p>
        </div>
        <div className="p-5 lg:p-7">
          <Label>{profile.name} audience behavior</Label><h4 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">{profile.behaviorHeadline}</h4>
          <div className="mt-5 space-y-3.5">{profile.behavior.map((item) => <AudienceBar key={item.label} {...item} max={profile.behavior[0].value} />)}</div>
          <p className="mt-4 text-[9px] leading-relaxed text-[var(--mn-faint)]">Audience shares are {profile.name}-specific July estimates. Average legs and multi-stop rates describe each segment across the broader Singapore July panel.</p>
        </div>
      </div>

      {/* who visits · behavioural mix + lifestyle lift */}
      <div className="grid border-b border-[var(--mn-wire)] xl:grid-cols-[1.3fr_1fr]">
        <div className="border-b border-[var(--mn-wire)] p-5 lg:p-7 xl:border-b-0 xl:border-r">
          <div className="flex items-start justify-between gap-3"><div><Label>Who visits · behavioural mix</Label><h4 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">{profile.name}’s audience vs the average mall-goer</h4></div><StatusChip kind="modelled">Modelled segments</StatusChip></div>
          <div className="mt-5 space-y-3">{profile.audience.segments.map((seg) => <SegmentLiftRow key={seg.label} {...seg} max={profile.audience.segments[0].share} />)}</div>
          <p className="mt-4 text-[9px] leading-relaxed text-[var(--mn-faint)]">Share = of {profile.name}’s July visitors in each modelled segment; lift compares that to the average visitor across covered malls (1.0× = typical).</p>
        </div>
        <div className="p-5 lg:p-7">
          <div className="flex items-start justify-between gap-3"><div><Label>Lifestyle lift</Label><h4 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">What they over-index on</h4></div><StatusChip kind="modelled">Index vs 1.0×</StatusChip></div>
          <div className="mt-5 space-y-2.5">{profile.audience.tags.map((tag) => <LiftRow key={tag.label} {...tag} />)}</div>
          <p className="mt-4 text-[9px] leading-relaxed text-[var(--mn-faint)]">{profile.audience.note}</p>
        </div>
      </div>

      <div className="border-b border-[var(--mn-wire)] p-5 lg:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><Label>Modeled trip-chain archetypes</Label><h4 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">The visit is one link in a wider activity chain</h4></div><p className="text-[9px] text-[var(--mn-faint)]">Illustrative allocation · structure informed by July tour model</p></div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">{profile.tripChains.map((chain) => <TripChainCard key={chain.label} chain={chain} mallName={profile.name} />)}</div>
      </div>

      {/* cross-shopping network + behavioural peers */}
      <div className="grid border-b border-[var(--mn-wire)] xl:grid-cols-[1.4fr_1fr]">
        <div className="border-b border-[var(--mn-wire)] p-5 lg:p-7 xl:border-b-0 xl:border-r">
          <div className="flex items-start justify-between gap-3"><div><Label>Observed competitive leakage</Label><h4 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">Where {profile.name}’s visitors also go</h4></div><StatusChip kind="observed">Observed panel</StatusChip></div>
          <div className="mt-5 space-y-2.5">{profile.leakage.dests.map((row) => <LeakageBar key={row.mall} {...row} max={profile.leakage.dests[0].leak} />)}</div>
          <p className="mt-3 text-[9px] leading-relaxed text-[var(--mn-faint)]">{profile.leakage.note}</p>
        </div>
        <div className="p-5 lg:p-7">
          <div className="flex items-start justify-between gap-3"><div><Label>Behavioral peers</Label><h4 className="mt-1 text-base font-semibold text-[var(--mn-heading)]">Malls {profile.name} behaves like</h4></div><StatusChip kind="modelled">Embedding</StatusChip></div>
          <div className="mt-5 space-y-3">{profile.peers.map((peer) => <PeerRow key={peer.mall} {...peer} />)}</div>
          <p className="mt-4 text-[9px] leading-relaxed text-[var(--mn-faint)]">Whitened-embedding cosine similarity (1.0 = identical audience behavior). This is behavioral similarity, <strong className="text-[var(--mn-ice)]">not co-visitation</strong>—{profile.peersNote}</p>
        </div>
      </div>

      {/* June → July audience drift */}
      <div className="p-5 lg:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><Label>June → July audience drift</Label>{profile.drift.significant
          ? <span className="flex items-center gap-1 rounded-full border border-[var(--mn-border)] bg-[var(--mn-card)] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em] text-[var(--mn-mist)]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: VOLT }} />Significant change</span>
          : <span className="rounded-full border border-[var(--mn-wire)] bg-[var(--mn-card)] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em] text-[var(--mn-faint)]">No significant change</span>}</div><h4 className="mt-2 text-base font-semibold text-[var(--mn-heading)]">{profile.drift.headline}</h4></div><StatusChip kind="modelled">Research preview</StatusChip></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div><DriftBars segments={profile.drift.segments} /><p className="mt-3 text-[9px] text-[var(--mn-faint)]">Change in each segment’s share of the {profile.name} panel between the June and July windows.</p></div>
          <div className="space-y-2">
            <DriftStat label="Embedding drift" value={profile.drift.embedding} detail={profile.drift.embeddingCi} />
            <DriftStat label="Matched-panel drift" value={profile.drift.matched} detail="devices seen in both windows" />
            <DriftStat label="New-visitor share" value={profile.drift.newVisitor} detail="July devices unseen in June" />
          </div>
        </div>
        <Caution><strong className="text-[var(--mn-ice)]">Composition drift only—not a footfall change.</strong> {profile.drift.window} Read this as who the audience skewed toward, not how many more people came.</Caution>
      </div>
    </section>

    {/* ── Section 3 · Inside the mall (Wi-Fi scenario) ────────────────────── */}
    <section className="overflow-hidden rounded-[10px] border border-[var(--mn-wire)] bg-[var(--mn-panel)]">
      <div className="border-b border-[var(--mn-wire)] px-5 py-5 lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><div className="flex flex-wrap items-center gap-2"><StatusChip kind="scenario">Wi‑Fi-enabled scenario</StatusChip><span className="text-[10px] text-[var(--mn-faint)]">Illustrative metrics on {isImage ? 'verified public geometry' : 'a synthetic layout'} · no backing data</span></div><h3 className="mt-3 font-display text-3xl text-[var(--mn-heading)]">Inside {profile.name}: where opportunity forms</h3><p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--mn-body)]">{isImage ? 'The map is the mall’s published accessibility plan.' : 'The map is a synthetic schematic anchored to the mall’s public campus geometry.'} Hotspots demonstrate the reporting layer we could calibrate from consented, anonymized access-point events—the numbers here are illustrative, not observed.</p></div>
          <div className="flex flex-wrap gap-2"><div className="flex rounded-[6px] border border-[var(--mn-wire)] bg-[var(--mn-abyss)] p-1">{profile.floors.map((item) => <button key={item} type="button" onClick={() => switchFloor(item)} className={`rounded-[5px] px-3 py-1.5 text-xs font-semibold transition-colors ${floor === item ? 'bg-[var(--mn-teal)] text-[var(--mn-logo-ink)]' : 'text-[var(--mn-mist)] hover:text-[var(--mn-ice)]'}`}>{item}</button>)}</div><select value={daypart} onChange={(e) => setDaypart(e.target.value as Daypart)} aria-label="Daypart" className="rounded-[6px] border border-[var(--mn-wire)] bg-[var(--mn-card)] px-3 py-2 text-xs text-[var(--mn-body)] outline-none focus:border-[var(--mn-teal)]">{(['Morning','Lunch','Afternoon','Evening'] as Daypart[]).map((item) => <option key={item}>{item}</option>)}</select></div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0 border-b border-[var(--mn-wire)] p-4 md:p-6 xl:border-b-0 xl:border-r">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><Label>{profile.planLabel} · {floor}</Label><p className="mt-1 text-sm font-semibold text-[var(--mn-heading)]">{zones.length}-zone operational heat layer</p></div><div className="flex gap-1 overflow-x-auto rounded-[6px] border border-[var(--mn-wire)] bg-[var(--mn-abyss)] p-1">{(['presence','dwell','capture'] as Metric[]).map((item) => <button key={item} type="button" onClick={() => setMetric(item)} className={`shrink-0 rounded-[5px] px-3 py-1.5 text-[10px] transition-colors ${metric === item ? 'bg-[var(--mn-teal)] text-[var(--mn-logo-ink)]' : 'text-[var(--mn-mist)] hover:text-[var(--mn-ice)]'}`}>{METRIC_LABEL[item]}</button>)}</div></div>
          <div className={`relative overflow-hidden rounded-[8px] border border-[var(--mn-border)] ${isImage ? 'bg-white' : 'bg-[var(--mn-abyss)]'}`}>
            {isImage
              ? <><img src={profile.floorplan.images![floor]} alt={`${profile.name} floor plan, ${floor}`} className="block h-auto w-full" /><div className="absolute inset-0 bg-[#0b0e18]/[0.05]" aria-hidden /></>
              : <SchematicFloorPlan floor={profile.floorplan.schematic![floor] as SchematicFloor} />}
            {journeys && <JourneyOverlay paths={journeyPaths} />}
            {zones.map((zone, index) => { const value = displayValue(zone); const active = zone.id === selected?.id; const size = 19 + Math.min(15, (value / (metric === 'dwell' ? 50 : 110)) * 15); return <button key={zone.id} type="button" onClick={() => setSelectedId(zone.id)} aria-label={`${zone.name}: ${value}${METRIC_UNIT[metric]}`} className={`group absolute flex min-h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 ${active ? 'z-20 scale-110' : 'z-10 hover:z-20 hover:scale-125'}`} style={{ left: `${zone.x}%`, top: `${zone.y}%` }}><span className="flex items-center justify-center rounded-full border-2 text-center" style={{ width: size, height: size, background: active ? VOLT : TEAL, borderColor: active ? '#0b0e18' : 'rgba(11,14,24,0.55)', color: '#03050a' }}><span className="font-mono text-[8px] font-bold leading-none">{metric === 'presence' ? index + 1 : `${value}${METRIC_UNIT[metric]}`}</span></span></button> })}
            <button type="button" onClick={() => setJourneys((v) => !v)} className={`absolute right-2 top-2 z-30 rounded-[6px] border px-2.5 py-1.5 text-[9px] font-semibold ${journeys ? 'border-[var(--mn-teal)] bg-[var(--mn-card)] text-[var(--mn-teal)]' : 'border-[var(--mn-border)] bg-[var(--mn-card)] text-[var(--mn-mist)]'}`}>Journey flows {journeys ? 'on' : 'off'}</button>
            <div className="absolute bottom-2 left-2 z-30 rounded-[5px] border border-[var(--mn-wire)] bg-[var(--mn-card)] px-2 py-1 text-[8px] font-medium text-[var(--mn-mist)]">{metric === 'presence' ? 'Zone number · size = presence' : `Circle size = ${METRIC_LABEL[metric].toLowerCase()}`}</div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-[9px] text-[var(--mn-faint)]"><span>Click a hotspot to inspect the operational scenario</span>{isImage && profile.floorplan.sourceUrl?.[floor]
            ? <a href={profile.floorplan.sourceUrl[floor]} target="_blank" rel="noreferrer" className="text-[var(--mn-mist)] underline decoration-[var(--mn-wire)] underline-offset-2 hover:text-[var(--mn-teal)]">{profile.planSourceLabel}</a>
            : <span className="text-[var(--mn-mist)]">{profile.planSourceLabel}</span>}</div>
        </div>

        <aside className="bg-[var(--mn-abyss)]">
          {selected && <>
          <div className="border-b border-[var(--mn-wire)] p-5"><div className="flex items-start justify-between gap-3"><div><Label>Selected Wi‑Fi zone</Label><h4 className="mt-2 text-xl font-semibold text-[var(--mn-heading)]">{selected.name}</h4><p className="mt-1 text-xs text-[var(--mn-mist)]">{selected.context}</p></div><ChangeTag change={selected.change} /></div><div className="mt-5 grid grid-cols-3 gap-2"><ZoneStat label="Presence" value={String(Math.round(selected.presence * factor))} /><ZoneStat label="Dwell" value={`${selected.dwell}m`} /><ZoneStat label="Capture" value={`${selected.capture}%`} /></div></div>
          <div className="border-b border-[var(--mn-wire)] p-5"><Label>Example movement funnel</Label><div className="mt-4 space-y-3"><FunnelRow label="Detected at approach" value={100} width={100} color={MIST} /><FunnelRow label="Entered mall" value={selected.capture} width={selected.capture} color={TEAL} /><FunnelRow label="Stayed 10+ min" value={Math.round(selected.capture * .64)} width={selected.capture * .64} color={TEAL_MID} /><FunnelRow label="Visited another zone" value={Math.round(selected.capture * .41)} width={selected.capture * .41} color={DEEP} /></div></div>
          <div className="p-5"><Label>Decision this enables</Label><p className="mt-2 text-sm leading-relaxed text-[var(--mn-body)]">{selected.opportunity}</p><div className="mt-4 rounded-[8px] border border-[var(--mn-wire)] bg-[var(--mn-card)] p-3"><p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[var(--mn-faint)]">Recommended experiment</p><p className="mt-1.5 text-xs leading-relaxed text-[var(--mn-mist)]">Run a two-week matched-day test and score uplift in zone capture, dwell and onward visitation—not just impressions.</p></div></div>
          </>}
        </aside>
      </div>
    </section>

    {/* ── Section 4 · The joined product + pilot ──────────────────────────── */}
    <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <GlassPanel className="overflow-hidden"><div className="border-b border-[var(--mn-wire)] px-5 py-4"><Label>The joined analytical product</Label><h3 className="mt-1 text-lg font-semibold text-[var(--mn-heading)]">Every source answers a different operator question</h3></div><div className="divide-y divide-[var(--mn-wire)]"><DataLayer color={TEAL} source="Veraset mobility · available now" scope="Catchment → mall" outputs="Audience origin, visit rhythm, dwell, repeat, mission proxy, cross-shopping" /><DataLayer color={TEAL_MID} source="Mall Wi‑Fi · operator partnership" scope="Entry → floor → zone" outputs="Entrances, paths, pass-through, zone capture, dwell, congestion, repeat routes" /><DataLayer color={DEEP} source="Counters / parking / POS · calibration" scope="Truth and value" outputs="Absolute footfall, mode split, conversion validation, campaign and tenant ROI" /></div><div className="m-5 rounded-[8px] border-l-2 border-l-[var(--mn-teal)] border-y border-r border-[var(--mn-wire)] bg-[var(--mn-callout-bg)] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--mn-teal)]">The pitch in one sentence</p><p className="mt-2 text-sm leading-relaxed text-[var(--mn-body)]">We already describe <strong className="text-[var(--mn-heading)]">who comes to each mall, from where and for what kind of trip</strong>; mall Wi‑Fi turns that into <strong className="text-[var(--mn-heading)]">where they enter, move, stop and respond inside the asset</strong>.</p></div></GlassPanel>
      <GlassPanel className="p-5"><Label>90-day operator pilot</Label><h3 className="mt-1 text-lg font-semibold text-[var(--mn-heading)]">A credible path from demo to decision</h3><div className="mt-5 space-y-4"><PilotStep n="01" title="Map and validate" text="Register AP locations, entry gates and floor geometry; agree privacy thresholds and business definitions." /><PilotStep n="02" title="Calibrate the mall" text="Reconcile Wi‑Fi devices to counters by entrance, hour and day type; quantify detection and consent bias." /><PilotStep n="03" title="Prove three use cases" text="Run one leasing, one operations and one campaign experiment with matched baselines and holdouts." /></div><div className="mt-5 rounded-[8px] border border-[var(--mn-wire)] bg-[var(--mn-card)] px-3 py-2.5 text-[10px] leading-relaxed text-[var(--mn-mist)]">Privacy design: rotating identifiers, aggregation, minimum cohort size, dwell thresholds and no individual-level operator view.</div></GlassPanel>
    </section>
    <p className="px-1 text-[9px] leading-relaxed text-[var(--mn-faint)]">Observed metrics, audience segments, catchment, rhythm, cross-shopping and audience drift are from MessyMobility’s July 2026 Singapore Veraset panel and are not absolute mall totals. SES, behavior segments and trip-chain allocations are illustrative, modeled signals. Indoor zone metrics, journey funnels and—for {profile.planKind === 'schematic' ? 'this mall' : 'the Wi‑Fi layer'}—the floor plan itself are synthetic demonstrations informed by broader July behavior and public campus geometry; tenant and layout details should be sense-checked with the operator before external circulation.</p>
  </div>
}

/* ── Shared primitives ──────────────────────────────────────────────────── */

function Kicker({ children }: { children: ReactNode }) { return <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--mn-mist)]">{children}</p> }
function Label({ children }: { children: ReactNode }) { return <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mn-faint)]">{children}</p> }

function StatusChip({ children, kind }: { children: ReactNode; kind: 'observed' | 'modelled' | 'map' | 'scenario' }) {
  const dot = kind === 'observed' ? TEAL : kind === 'map' ? ICE : 'transparent'
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--mn-border)] bg-[var(--mn-card)] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[var(--mn-body)]"><span className="h-1.5 w-1.5 rounded-full border" style={{ background: dot, borderColor: dot === 'transparent' ? 'var(--mn-mist)' : dot }} />{children}</span>
}

function Caution({ children }: { children: ReactNode }) { return <div className="mt-3 rounded-[8px] border-l-2 border-l-[var(--mn-teal)] border-y border-r border-[var(--mn-wire)] bg-[var(--mn-callout-bg)] px-3 py-2.5 text-[10px] leading-relaxed text-[var(--mn-mist)]">{children}</div> }

function LegendSwatch({ color, children }: { color: string; children: ReactNode }) { return <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2.5 rounded-[2px]" style={{ background: color }} />{children}</span> }

function ObservedKpi({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="p-4 lg:px-6 lg:py-5"><div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[var(--mn-faint)]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} />{label}</div><p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-[var(--mn-heading)]">{value}</p><p className="mt-1 text-[9px] text-[var(--mn-faint)]">{detail}</p></div> }

function TrendChart({ trend, peakIndex, peakValue }: { trend: number[]; peakIndex: number; peakValue: number }) {
  const n = trend.length
  const points = useMemo(() => trend.map((value, index) => ({ x: 24 + index * (572 / (n - 1)), y: 154 - ((value - 65) / 95) * 126, value, day: index + 1 })), [trend, n])
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const peak = points[peakIndex]
  return <svg viewBox="0 0 620 180" className="block h-auto w-full" role="img" aria-label="Daily mobility index, normalized to a mean of 100">{[80,100,120,140].map((value) => { const y = 154 - ((value - 65) / 95) * 126; return <g key={value}><line x1="24" x2="596" y1={y} y2={y} stroke={MIST} strokeOpacity={value === 100 ? .28 : .1} strokeDasharray={value === 100 ? '4 4' : undefined}/><text x="2" y={y + 3} fill={FAINT} fontSize="8" fontFamily="JetBrains Mono, monospace">{value}</text></g> })}<path d={`${line} L596,154 L24,154 Z`} fill={TEAL} fillOpacity="0.1"/><path d={line} fill="none" stroke={TEAL} strokeWidth="2" strokeLinejoin="round"/>{points.map((p, i) => i === peakIndex ? null : <circle key={p.day} cx={p.x} cy={p.y} r="1.7" fill={TEAL}><title>July {p.day}: index {p.value}</title></circle>)}{peak && <circle cx={peak.x} cy={peak.y} r="3.4" fill={VOLT}><title>Peak · July {peak.day}: index {peak.value}</title></circle>}<text x="24" y="173" fill={FAINT} fontSize="8" fontFamily="JetBrains Mono, monospace">Jul 1</text><text x="310" y="173" fill={FAINT} fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">Jul {Math.round(n / 2)}</text><text x="596" y="173" fill={FAINT} fontSize="8" textAnchor="end" fontFamily="JetBrains Mono, monospace">Jul {n}</text>{peak && <text x="596" y={peak.y - 8} fill={VOLT} fontSize="9" textAnchor="end" fontFamily="JetBrains Mono, monospace">{peakValue} · Jul {peak.day}</text>}</svg>
}

function CatchmentCurve({ bands, markKm, markLabel }: { bands: Band[]; markKm: number; markLabel: string }) {
  const yMax = Math.max(20, Math.ceil(Math.max(...bands.map((b) => Math.max(b.uw, b.w))) / 20) * 20)
  const xOf = (km: number) => 24 + (km / 10) * 572
  const yOf = (share: number) => 150 - (share / yMax) * 130
  const seq = (key: 'uw' | 'w') => bands.map((b, i) => `${i ? 'L' : 'M'}${xOf(b.km).toFixed(1)},${yOf(b[key]).toFixed(1)}`).join(' ')
  const grid = [1, 2, 3, 4].map((i) => Math.round((yMax / 4) * i))
  const markX = xOf(markKm)
  return <svg viewBox="0 0 620 172" className="mt-4 block h-auto w-full" role="img" aria-label="Cumulative catchment share by distance band">{grid.map((v) => { const y = yOf(v); return <g key={v}><line x1="24" x2="596" y1={y} y2={y} stroke={MIST} strokeOpacity=".1"/><text x="2" y={y + 3} fill={FAINT} fontSize="8" fontFamily="JetBrains Mono, monospace">{v}</text></g> })}<line x1={markX} x2={markX} y1="20" y2="150" stroke={MIST} strokeOpacity=".45" strokeDasharray="3 3"/><text x={markX + 4} y="30" fill={TEAL} fontSize="8" fontFamily="JetBrains Mono, monospace">{markLabel}</text><path d={seq('uw')} fill="none" stroke={DEEP} strokeWidth="1.6" strokeDasharray="4 3"/><path d={seq('w')} fill="none" stroke={TEAL} strokeWidth="2.2" strokeLinejoin="round"/>{bands.map((b) => <g key={b.km}><circle cx={xOf(b.km)} cy={yOf(b.w)} r="2.6" fill={TEAL}><title>{b.label} weighted {b.w}%</title></circle><text x={xOf(b.km)} y="166" fill={FAINT} fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{b.label}</text></g>)}<text x="596" y={yOf(bands[bands.length - 1].w) - 6} fill={TEAL} fontSize="8" textAnchor="end" fontFamily="JetBrains Mono, monospace">weighted</text><text x="596" y={yOf(bands[bands.length - 1].uw) + 14} fill={MIST} fontSize="8" textAnchor="end" fontFamily="JetBrains Mono, monospace">unweighted</text></svg>
}

function RhythmChart({ weekday, weekend, weekdayPeakH, weekendPeakH }: { weekday: number[]; weekend: number[]; weekdayPeakH: number; weekendPeakH: number }) {
  const max = Math.max(...weekday, ...weekend, 1)
  const xOf = (h: number) => 24 + (h / 23) * 572
  const yOf = (v: number) => 150 - (v / max) * 128
  const seq = (arr: number[]) => arr.map((v, h) => `${h ? 'L' : 'M'}${xOf(h).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ')
  return <svg viewBox="0 0 620 172" className="mt-4 block h-auto w-full" role="img" aria-label="Hourly visitor rhythm, weekday vs weekend">{[0,6,12,18,23].map((h) => <text key={h} x={xOf(h)} y="166" fill={FAINT} fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{String(h).padStart(2,'0')}:00</text>)}<line x1="24" x2="596" y1="150" y2="150" stroke={MIST} strokeOpacity=".12"/><path d={seq(weekend)} fill="none" stroke={DEEP} strokeWidth="1.6"/><path d={seq(weekday)} fill="none" stroke={TEAL} strokeWidth="2.2" strokeLinejoin="round"/><circle cx={xOf(weekdayPeakH)} cy={yOf(weekday[weekdayPeakH])} r="3" fill={TEAL}><title>Weekday {String(weekdayPeakH).padStart(2,'0')}:00 · {weekday[weekdayPeakH]}</title></circle><circle cx={xOf(weekendPeakH)} cy={yOf(weekend[weekendPeakH])} r="3" fill={DEEP} stroke={MIST} strokeWidth=".5"><title>Weekend {String(weekendPeakH).padStart(2,'0')}:00 · {weekend[weekendPeakH]}</title></circle></svg>
}

function MixBar({ label, value, note, color }: MixItem & { color: string }) { return <div><div className="mb-1.5 flex items-end justify-between"><div><span className="text-xs font-medium text-[var(--mn-ice)]">{label}</span><span className="ml-2 text-[9px] text-[var(--mn-faint)]">{note}</span></div><span className="font-mono text-sm text-[var(--mn-heading)]">{value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--mn-wire)]"><div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} /></div></div> }

function SmallFact({ label, value }: { label: string; value: string }) { return <div className="rounded-[8px] border border-[var(--mn-wire)] bg-[var(--mn-card)] p-3"><p className="text-[9px] uppercase tracking-[0.13em] text-[var(--mn-faint)]">{label}</p><p className="mt-1 font-mono text-sm text-[var(--mn-ice)]">{value}</p></div> }

function LeakageBar({ mall, leak, capture, max }: LeakDest & { max: number }) { return <div className="grid grid-cols-[128px_1fr_44px] items-center gap-2 sm:grid-cols-[150px_1fr_44px]"><div><p className="truncate text-[11px] font-medium text-[var(--mn-body)]">{mall}</p><p className="truncate text-[8px] text-[var(--mn-faint)]">we hold {capture}% of theirs</p></div><div className="h-2 overflow-hidden rounded-full bg-[var(--mn-wire)]"><div className="h-full rounded-full" style={{ width: `${(leak / max) * 100}%`, background: TEAL }} /></div><span className="text-right font-mono text-[11px] text-[var(--mn-body)]">{leak}%</span></div> }

function SegmentLiftRow({ label, share, lift, max }: SegmentLift & { max: number }) { const over = lift >= 1; return <div className="grid grid-cols-[132px_1fr_46px] items-center gap-2 sm:grid-cols-[150px_1fr_46px]"><div><p className="truncate text-[11px] font-medium text-[var(--mn-body)]">{label}</p><p className="truncate text-[8px] text-[var(--mn-faint)]">{share}% of visitors</p></div><div className="h-2 overflow-hidden rounded-full bg-[var(--mn-wire)]"><div className="h-full rounded-full" style={{ width: `${(share / max) * 100}%`, background: TEAL }} /></div><span className={`text-right font-mono text-[11px] ${over ? 'text-[var(--mn-teal)]' : 'text-[var(--mn-faint)]'}`}>{lift}×</span></div> }

function LiftRow({ label, lift }: TagLift) { const over = lift >= 1; const w = Math.min(Math.max(lift, 0) / 2, 1) * 100; return <div className="grid grid-cols-[112px_1fr_46px] items-center gap-2 sm:grid-cols-[128px_1fr_46px]"><p className="truncate text-[11px] font-medium text-[var(--mn-body)]">{label}</p><div className="relative h-2 rounded-full bg-[var(--mn-wire)]"><div className="h-full rounded-full" style={{ width: `${w}%`, background: over ? TEAL : MIST }} /><span className="absolute -top-0.5 -bottom-0.5 left-1/2 w-px bg-[var(--mn-faint)]" /></div><span className={`text-right font-mono text-[11px] ${over ? 'text-[var(--mn-teal)]' : 'text-[var(--mn-faint)]'}`}>{lift}×</span></div> }

function AudienceBar({ label, value, note, max }: MixItem & { max: number }) { return <div className="grid grid-cols-[112px_1fr_42px] items-center gap-2 sm:grid-cols-[130px_1fr_48px]"><div><p className="truncate text-[11px] font-medium text-[var(--mn-body)]">{label}</p><p className="truncate text-[8px] text-[var(--mn-faint)]">{note}</p></div><div className="h-2 overflow-hidden rounded-full bg-[var(--mn-wire)]"><div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: TEAL }} /></div><span className="text-right font-mono text-[11px] text-[var(--mn-body)]">{value}%</span></div> }

function TripChainCard({ chain, mallName }: { chain: TripChain; mallName: string }) { return <div className="rounded-[8px] border border-[var(--mn-wire)] bg-[var(--mn-card)] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[var(--mn-heading)]">{chain.label}</p><p className="mt-0.5 text-[9px] text-[var(--mn-faint)]">{chain.segment}</p></div><span className="font-mono text-sm text-[var(--mn-teal)]">{chain.share}</span></div><div className="mt-4 flex items-center overflow-x-auto pb-1">{chain.stops.map((stop, index) => <div key={`${stop}-${index}`} className="contents"><div className="shrink-0 text-center"><span className="mx-auto block h-2.5 w-2.5 rounded-full" style={{ background: stop.includes(mallName) ? TEAL : FAINT }} /><span className="mt-1.5 block max-w-[88px] text-[8px] leading-tight text-[var(--mn-mist)]">{stop}</span></div>{index < chain.stops.length - 1 && <span className="mx-2 mb-4 h-px min-w-5 flex-1 bg-[var(--mn-border)] after:float-right after:-mt-[3px] after:h-1.5 after:w-1.5 after:rotate-45 after:border-r after:border-t after:border-[var(--mn-faint)]" />}</div>)}</div></div> }


function PeerRow({ mall, sim }: Peer) { return <div className="flex items-center gap-3"><div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--mn-wire)]"><div className="h-full rounded-full" style={{ width: `${sim * 100}%`, background: TEAL_MID }} /></div><span className="flex-1 truncate text-[11px] text-[var(--mn-body)]">{mall}</span><span className="font-mono text-[11px] text-[var(--mn-ice)]">{sim.toFixed(3)}</span></div> }

function DriftBars({ segments }: { segments: DriftSeg[] }) {
  const max = Math.max(...segments.map((d) => Math.abs(d.delta)), 1)
  return <div className="space-y-2.5">{segments.map((row) => { const pos = row.delta >= 0; const pct = (Math.abs(row.delta) / max) * 50; return <div key={row.segment} className="grid grid-cols-[118px_1fr_46px] items-center gap-2 sm:grid-cols-[140px_1fr_52px]"><span className="truncate text-[11px] text-[var(--mn-body)]">{row.segment}</span><div className="relative h-3"><span className="absolute left-1/2 top-0 h-full w-px bg-[var(--mn-border)]" />{pos ? <span className="absolute left-1/2 top-0.5 h-2 rounded-r-full" style={{ width: `${pct}%`, background: TEAL }} /> : <span className="absolute top-0.5 h-2 rounded-l-full" style={{ right: '50%', width: `${pct}%`, background: FAINT }} />}</div><span className="text-right font-mono text-[11px]" style={{ color: pos ? TEAL : MIST }}>{pos ? '▲' : '▼'}{Math.abs(row.delta).toFixed(1)}</span></div> })}</div>
}

function DriftStat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-[8px] border border-[var(--mn-wire)] bg-[var(--mn-card)] p-3"><div className="flex items-baseline justify-between"><p className="text-[9px] uppercase tracking-[0.13em] text-[var(--mn-faint)]">{label}</p><p className="font-mono text-base text-[var(--mn-heading)]">{value}</p></div><p className="mt-0.5 text-[9px] text-[var(--mn-faint)]">{detail}</p></div> }

function ChangeTag({ change }: { change: number }) { const pos = change >= 0; return <span className="shrink-0 rounded-full border border-[var(--mn-border)] bg-[var(--mn-card)] px-2 py-1 font-mono text-[9px] font-semibold" style={{ color: pos ? TEAL : MIST }}>{pos ? '▲' : '▼'}{Math.abs(change)}%</span> }

function JourneyOverlay({ paths }: { paths: string[] }) { return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[5] h-full w-full" aria-hidden>{paths.map((d, i) => <path key={i} d={d} fill="none" stroke={i === 0 ? TEAL : DEEP} strokeWidth={i === 0 ? .9 : .75} strokeDasharray={i === 0 ? '2 1.5' : '1.7 1.4'} vectorEffect="non-scaling-stroke" className={i === 0 ? 'vm-mall-flow' : 'vm-mall-flow vm-mall-flow-delay'} />)}</svg> }

function ZoneStat({ label, value }: { label: string; value: string }) { return <div className="rounded-[8px] border border-[var(--mn-wire)] bg-[var(--mn-card)] p-2.5"><p className="text-[8px] uppercase tracking-[0.13em] text-[var(--mn-faint)]">{label}</p><p className="mt-1 font-mono text-base text-[var(--mn-heading)]">{value}</p></div> }

function FunnelRow({ label, value, width, color }: { label: string; value: number; width: number; color: string }) { return <div><div className="mb-1 flex justify-between text-[9px]"><span className="text-[var(--mn-mist)]">{label}</span><span className="font-mono text-[var(--mn-body)]">{value}%</span></div><div className="h-1 overflow-hidden rounded-full bg-[var(--mn-wire)]"><div className="h-full rounded-full" style={{ width: `${width}%`, background: color }} /></div></div> }

function DataLayer({ color, source, scope, outputs }: { color: string; source: string; scope: string; outputs: string }) { return <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_120px_1.4fr] sm:items-center"><div className="flex items-center gap-2 text-xs font-medium text-[var(--mn-heading)]"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />{source}</div><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--mn-faint)]">{scope}</p><p className="text-xs leading-relaxed text-[var(--mn-mist)]">{outputs}</p></div> }

function PilotStep({ n, title, text }: { n: string; title: string; text: string }) { return <div className="flex gap-3"><span className="font-mono text-xs text-[var(--mn-teal)]">{n}</span><div><p className="text-sm font-medium text-[var(--mn-heading)]">{title}</p><p className="mt-1 text-xs leading-relaxed text-[var(--mn-mist)]">{text}</p></div></div> }
