import { useEffect, useState } from 'react'
import { MallIntelligencePanel } from './mall/MallIntelligencePanel'
import { ControlPanel } from './ControlPanel'
import {
  DestinationsChart,
  MotifDistributionChart,
  TripsChart,
} from './DistributionCharts'
import { KpiBar } from './KpiBar'
import { MotifGallery } from './MotifGallery'
import { TimeOfDayHeatmap } from './TimeOfDayHeatmap'
import { UserExplorer } from './UserExplorer'
import { GlassPanel, SectionEyebrow } from './ui/GlassPanel'
import { ReferenceImplBanner } from './demo/ApiComponents'

function ChartCard({ children }: { children: React.ReactNode }) {
  return <GlassPanel className="min-h-[280px] p-4 lg:p-5">{children}</GlassPanel>
}

export function AnalystDashboard() {
  const [sampleMeta, setSampleMeta] = useState<{
    pingCount: number
    userCount: number
    dateRange: [string, string]
  } | null>(null)

  useEffect(() => {
    const metaUrl = new URL(
      `${import.meta.env.BASE_URL}singapore_veraset_sample.meta.json`,
      window.location.href,
    ).href
    fetch(metaUrl)
      .then((r) => r.json())
      .then((meta) =>
        setSampleMeta({
          pingCount: meta.pingCount,
          userCount: meta.userCount,
          dateRange: meta.dateRange,
        }),
      )
      .catch(() => setSampleMeta(null))
  }, [])

  const subtitle = sampleMeta
    ? `Jiang, Ferreira & González (2015) · Veraset Singapore GPS · ${sampleMeta.userCount.toLocaleString()} users · ${sampleMeta.pingCount.toLocaleString()} pings · ${sampleMeta.dateRange[0]} – ${sampleMeta.dateRange[1]}`
    : 'Jiang, Ferreira & González (2015) · Veraset Singapore GPS · Jun 1–7, 2026'

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <ReferenceImplBanner
        mode="analyst"
        endpoint="GET /v1/mobility/footfall?city=makati&date_start=2024-03-04"
      />

      <GlassPanel variant="bright" className="p-5">
        <SectionEyebrow>Mobility pipeline</SectionEyebrow>
        <p className="mt-1 font-display text-xl text-white">Activity-based human mobility</p>
        <p className="mt-1 text-xs text-[var(--vm-muted)]">{subtitle}</p>
        <div className="mt-4">
          <KpiBar />
        </div>
      </GlassPanel>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard>
          <MotifDistributionChart />
        </ChartCard>
        <ChartCard>
          <TripsChart />
        </ChartCard>
        <ChartCard>
          <DestinationsChart />
        </ChartCard>
        <ChartCard>
          <TimeOfDayHeatmap />
        </ChartCard>
      </div>

      <GlassPanel className="p-4 lg:p-5">
        <MotifGallery />
      </GlassPanel>

      <MallIntelligencePanel />

      <GlassPanel className="p-4 lg:p-5">
        <UserExplorer />
      </GlassPanel>

      <p className="pb-2 text-center text-[11px] text-slate-600">
        Population expansion uses illustrative Singapore zone figures (§4.5). Paper reference values from
        the 2015 Singapore CDR study — Veraset GPS sample compared directly on the same geography.
      </p>
    </div>
  )
}

export function AnalystSidebar() {
  return (
    <GlassPanel className="max-h-[calc(100vh-88px)] overflow-hidden">
      <ControlPanel />
    </GlassPanel>
  )
}
