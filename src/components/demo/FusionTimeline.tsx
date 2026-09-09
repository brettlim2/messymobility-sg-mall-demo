import { useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buildFusionSeries } from '../../demo/analytics'
import type { Campaign, FootfallDay, SocialDay } from '../../demo/types'
import { SectionEyebrow } from '../ui/GlassPanel'

interface Props {
  social: SocialDay[]
  footfall: FootfallDay[]
  campaign: Campaign
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function FusionTimeline({ social, footfall, campaign }: Props) {
  const data = buildFusionSeries(
    social,
    footfall,
    campaign.narrativeId,
    campaign.targetVenueIds[0] ?? '',
    campaign.startDate,
    campaign.endDate,
  ).slice(-45)

  const { buzzPeakDate, footfallResponseDate } = useMemo(() => {
    let buzzPeakDate = campaign.startDate
    let maxBuzz = -Infinity
    for (const p of data) {
      if (p.buzz > maxBuzz) {
        maxBuzz = p.buzz
        buzzPeakDate = p.date
      }
    }

    const targetDate = shiftDate(buzzPeakDate, Math.round(campaign.causalLagDays))
    const footfallResponseDate =
      data.find((p) => p.date >= targetDate)?.date ?? targetDate

    return { buzzPeakDate, footfallResponseDate }
  }, [data, campaign])

  return (
    <div>
      <SectionEyebrow>Fusion timeline</SectionEyebrow>
      <h3 className="mt-1 font-display text-xl text-white">Social buzz → footfall</h3>
      <p className="mt-1 text-xs text-[var(--vm-muted)]">
        Shaded region = campaign window · Dashed verticals = buzz peak and footfall response
      </p>

      <div className="vm-chart-box mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 28, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#8b9cb8', fontSize: 11 }}
              tickFormatter={(d: string) => d.slice(5)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="buzz"
              tick={{ fill: '#2dd4bf', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <YAxis
              yAxisId="foot"
              orientation="right"
              tick={{ fill: '#a78bfa', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: '#0c1220',
                border: '1px solid rgba(148,163,184,0.15)',
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: '#e8edf5', marginBottom: 4 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <ReferenceArea
              x1={campaign.startDate}
              x2={campaign.endDate}
              fill="#2dd4bf"
              fillOpacity={0.06}
              strokeOpacity={0}
            />
            <ReferenceLine
              x={buzzPeakDate}
              yAxisId="buzz"
              stroke="#2dd4bf"
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={{
                value: 'Buzz peak',
                position: 'top',
                fill: '#2dd4bf',
                fontSize: 10,
              }}
            />
            <ReferenceLine
              x={footfallResponseDate}
              yAxisId="foot"
              stroke="#a78bfa"
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={{
                value: `Footfall +${campaign.causalLagDays}d`,
                position: 'top',
                fill: '#a78bfa',
                fontSize: 10,
              }}
            />
            <Area
              yAxisId="buzz"
              type="monotone"
              dataKey="buzz"
              name="Social buzz"
              stroke="#2dd4bf"
              fill="#2dd4bf"
              fillOpacity={0.12}
              strokeWidth={2}
            />
            <Line
              yAxisId="foot"
              type="monotone"
              dataKey="footfall"
              name="Footfall"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="foot"
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-[11px] text-slate-600">
        Causal lag: {campaign.causalLagDays} days between buzz peak and footfall response
      </p>
    </div>
  )
}
