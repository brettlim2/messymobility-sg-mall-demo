import { formatPct } from '../../demo/analytics'
import type { Campaign } from '../../demo/types'
import { useAppStore } from '../../store'
import {
  Disclaimer,
  GlassPanel,
  KeyTakeaway,
  PersonaChip,
  SectionEyebrow,
  TakeawayStat,
} from '../ui/GlassPanel'
import { ReferenceImplBanner } from './ApiComponents'
import { ConsumerBehaviorGraph } from './ConsumerBehaviorGraph'
import { FusionTimeline } from './FusionTimeline'
import { SocialFeed } from './SocialFeed'

export function AttributionPanel() {
  const demoData = useAppStore((s) => s.demoData)
  const selectedCampaign = useAppStore((s) => s.selectedCampaign)
  const setSelectedCampaign = useAppStore((s) => s.setSelectedCampaign)

  if (!demoData) {
    return (
      <GlassPanel className="p-8 text-center text-[var(--vm-muted)]">Loading demo data…</GlassPanel>
    )
  }

  const campaign =
    demoData.campaigns.find((c) => c.id === selectedCampaign) ?? demoData.campaigns[0]
  if (!campaign) return null

  const narrative = demoData.narratives.find((n) => n.id === campaign.narrativeId)

  return (
    <div className="space-y-5">
      <ReferenceImplBanner
        mode="attribution"
        endpoint="GET /v1/fusion/attribution?campaign_id=camp-pg-sustain-q1"
      />

      {/* Hero takeaway row */}
      <GlassPanel variant="bright" className="p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <SectionEyebrow>Campaign attribution</SectionEyebrow>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <PersonaChip persona="caryl" />
            </div>
            <h2 className="mt-3 font-display text-3xl text-white lg:text-4xl">So did it work?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--vm-muted)]">
              {campaign.description}
            </p>
            <div className="mt-4">
              <KeyTakeaway>
                Social buzz leads footfall by {campaign.causalLagDays} days — estimated{' '}
                {formatPct(campaign.liftPct)} lift with {campaign.confidence}% model confidence.
              </KeyTakeaway>
            </div>
          </div>

          <div className="grid w-full shrink-0 grid-cols-3 gap-3 sm:max-w-md lg:w-auto">
            <TakeawayStat
              value={formatPct(campaign.liftPct)}
              label="Lift"
              sub="vs baseline"
              accent="teal"
            />
            <TakeawayStat
              value={`${campaign.causalLagDays}d`}
              label="Causal lag"
              sub="buzz → footfall"
              accent="violet"
            />
            <TakeawayStat
              value={`${campaign.confidence}%`}
              label="Confidence"
              sub="fusion model"
              accent="amber"
            />
          </div>
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-5">
          {demoData.campaigns.length > 1 ? (
            <>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--vm-muted)]">
                Campaign
              </label>
              <select
                value={campaign.id}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full max-w-lg rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-teal-400/40 focus:ring-1 focus:ring-teal-400/20"
              >
                {demoData.campaigns.map((c: Campaign) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <p className="text-sm text-[var(--vm-muted)]">
              <span className="font-medium text-white">{campaign.name}</span>
              {' · '}
              {campaign.brand}
            </p>
          )}
        </div>
      </GlassPanel>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <GlassPanel className="overflow-hidden p-5 lg:p-6">
            <FusionTimeline
              social={demoData.socialTimeseries}
              footfall={demoData.footfallTimeseries}
              campaign={campaign}
            />
          </GlassPanel>

          <GlassPanel className="p-5">
            <ConsumerBehaviorGraph graph={demoData.behaviorGraph} />
          </GlassPanel>
        </div>

        <GlassPanel className="flex max-h-[640px] flex-col p-5">
          <SocialFeed narratives={demoData.narratives} narrativeId={narrative?.id} />
          <div className="mt-auto border-t border-white/[0.06] pt-4">
            <Disclaimer />
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
