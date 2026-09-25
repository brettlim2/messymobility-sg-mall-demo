import { useState } from 'react'
import type { ApiEndpoint } from '../../demo/types'
import type { AppMode } from '../../demo/types'
import { useAppStore } from '../../store'
import {
  Disclaimer,
  GlassPanel,
  KeyTakeaway,
  SectionEyebrow,
} from '../ui/GlassPanel'
import {
  ApiChip,
  CodeBlock,
  FlowStep,
  MethodBadge,
  TierBadge,
} from './ApiComponents'

const ENDPOINT_MODE_LINKS: Record<string, { mode: 'attribution' | 'site' | 'analyst'; label: string }> = {
  attribution: { mode: 'attribution', label: 'See attribution demo →' },
  corridors: { mode: 'site', label: 'See site intelligence demo →' },
  graph: { mode: 'attribution', label: 'See graph viz demo →' },
  footfall: { mode: 'analyst', label: 'See mobility demo →' },
}

export function ApiFeedPanel() {
  const demoData = useAppStore((s) => s.demoData)
  const setAppMode = useAppStore((s) => s.setAppMode)
  const [selectedId, setSelectedId] = useState<string>('attribution')

  if (!demoData?.apiCatalog) {
    return (
      <GlassPanel className="p-8 text-center text-[var(--vm-muted)]">Loading API catalog…</GlassPanel>
    )
  }

  const { apiCatalog } = demoData
  const endpoint =
    apiCatalog.endpoints.find((e) => e.id === selectedId) ?? apiCatalog.endpoints[0]

  return (
    <div className="space-y-5">
      {/* Hero */}
      <GlassPanel variant="bright" className="p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>MessyMobility API</SectionEyebrow>
            <div className="mt-2">
              <ApiChip />
            </div>
            <h2 className="mt-3 font-display text-3xl text-white lg:text-4xl">
              The product is the feed.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--vm-muted)] lg:text-base">
              MessyMobility delivers a fused <strong className="text-white">Consumer Behavior Graph</strong>{' '}
              as a programmatic API — social narrative, mobility signal, and causal attribution in one
              queryable layer. Clients pipe it into any BI tool, internal dashboard, CRM, or site-selection
              platform.{' '}
              <strong className="text-white">This demo is a reference implementation</strong>, not the
              product itself.
            </p>
            <div className="mt-5">
              <KeyTakeaway>
                You own the visualization. We own the fusion. One API call replaces three vendors and weeks
                of stitching.
              </KeyTakeaway>
            </div>
          </div>

          <div className="w-full shrink-0 lg:max-w-xs">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--vm-muted)]">
              Base URL
            </p>
            <CodeBlock label="Production">{apiCatalog.baseUrl}</CodeBlock>
            <p className="mt-3 text-[11px] text-[var(--vm-muted)]">{apiCatalog.auth}</p>
          </div>
        </div>
      </GlassPanel>

      {/* Client flow + tiers */}
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <GlassPanel className="p-6">
          <SectionEyebrow>How clients integrate</SectionEyebrow>
          <h3 className="mt-1 font-display text-xl text-white">Three steps to your own analytics</h3>
          <div className="mt-6">
            {apiCatalog.clientFlow.map((step, i) => (
              <FlowStep
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                isLast={i === apiCatalog.clientFlow.length - 1}
              />
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--vm-muted)]">
              Architecture
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-violet-200">
                MessyNet · Social
              </span>
              <span className="text-slate-600">+</span>
              <span className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-amber-200">
                Globe · Mobility
              </span>
              <span className="text-slate-600">→</span>
              <span className="rounded-lg border border-teal-400/30 bg-teal-500/15 px-3 py-1.5 font-medium text-teal-200">
                Fusion Engine
              </span>
              <span className="text-slate-600">→</span>
              <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white">
                REST API
              </span>
              <span className="text-slate-600">→</span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[var(--vm-muted)]">
                Your stack
              </span>
            </div>
            <p className="mt-3 text-xs text-[var(--vm-muted)]">
              MessyNet already powers social intelligence feeds for enterprise clients. MessyMobility
              extends that pattern with fused mobility and causal attribution endpoints.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <SectionEyebrow>Subscription tiers</SectionEyebrow>
          <div className="mt-3 space-y-3">
            {apiCatalog.tiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-white">{tier.name}</span>
                  <span className="font-mono text-sm text-teal-300">{tier.price}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[var(--vm-muted)]">{tier.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tier.access.slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[9px] text-slate-500"
                    >
                      {a}
                    </span>
                  ))}
                  {tier.access.length > 3 && (
                    <span className="text-[9px] text-slate-600">+more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Endpoint explorer */}
      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <GlassPanel className="p-3">
          <p className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--vm-muted)]">
            Endpoints
          </p>
          <div className="space-y-1">
            {apiCatalog.endpoints.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => setSelectedId(ep.id)}
                className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                  ep.id === selectedId
                    ? 'bg-teal-500/10 ring-1 ring-teal-400/25'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MethodBadge method={ep.method} />
                  <TierBadge tier={ep.tier} />
                </div>
                <p className="mt-1 truncate font-mono text-xs text-teal-300/90">{ep.path}</p>
                <p className="mt-0.5 truncate text-[11px] text-[var(--vm-muted)]">{ep.summary}</p>
              </button>
            ))}
          </div>
        </GlassPanel>

        {endpoint && <EndpointDetail endpoint={endpoint} />}
      </div>

      {/* Build your own CTA */}
      <GlassPanel variant="bright" className="p-6 text-center lg:p-8">
        <h3 className="font-display text-2xl text-white">Build your own — in an afternoon</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--vm-muted)]">
          Every view in this demo — attribution charts, corridor maps, mobility motifs — is powered by the
          endpoints above. Your team queries the same feed and renders it however you want.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setAppMode('attribution')}
            className="rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20"
          >
            Caryl demo (CMO view)
          </button>
          <button
            type="button"
            onClick={() => setAppMode('site')}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-200"
          >
            Marco demo (Strategy view)
          </button>
          <button
            type="button"
            onClick={() => setAppMode('analyst')}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-[var(--vm-muted)]"
          >
            Data science demo
          </button>
        </div>
        <div className="mt-6">
          <Disclaimer />
        </div>
      </GlassPanel>
    </div>
  )
}

function EndpointDetail({ endpoint }: { endpoint: ApiEndpoint }) {
  const setAppMode = useAppStore((s) => s.setAppMode)
  const link = ENDPOINT_MODE_LINKS[endpoint.id]

  const goToDemo = (mode: AppMode) => setAppMode(mode)

  return (
    <GlassPanel className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <MethodBadge method={endpoint.method} />
            <TierBadge tier={endpoint.tier} />
          </div>
          <h3 className="mt-2 font-mono text-lg text-teal-300">{endpoint.path}</h3>
          <p className="mt-1 text-sm text-white">{endpoint.summary}</p>
        </div>
        {link && (
          <button
            type="button"
            onClick={() => goToDemo(link.mode)}
            className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-teal-300 transition hover:bg-teal-500/10"
          >
            {link.label}
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-[var(--vm-muted)]">
        <span className="font-medium text-slate-400">Use case: </span>
        {endpoint.useCase}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {endpoint.queryParams.map((p) => (
          <span
            key={p}
            className="rounded-full border border-white/[0.06] bg-black/20 px-2 py-0.5 font-mono text-[10px] text-slate-400"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <CodeBlock label="Sample request">{endpoint.sampleRequest}</CodeBlock>
        <CodeBlock label="Sample response">
          {JSON.stringify(endpoint.sampleResponse, null, 2)}
        </CodeBlock>
      </div>
    </GlassPanel>
  )
}
