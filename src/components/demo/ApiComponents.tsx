import type { ReactNode } from 'react'
import { useAppStore } from '../../store'

export function ReferenceImplBanner({
  endpoint,
  mode,
}: {
  endpoint: string
  mode: 'attribution' | 'site' | 'analyst' | 'ev'
}) {
  const setAppMode = useAppStore((s) => s.setAppMode)

  const labels = {
    attribution: 'CMO view',
    site: 'Strategy view',
    analyst: 'Data science view',
    ev: 'Network ops view',
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="min-w-0 text-xs text-[var(--vm-muted)]">
        <span className="font-medium text-slate-400">{labels[mode]}</span>
        {' · '}
        Reference demo powered by{' '}
        <code className="font-mono text-[10px] text-teal-300/80">{endpoint}</code>
      </p>
      <button
        type="button"
        onClick={() => setAppMode('api')}
        className="shrink-0 rounded-lg border border-teal-400/25 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-200 transition hover:bg-teal-500/20"
      >
        View API →
      </button>
    </div>
  )
}

export function ApiChip() {
  return (
    <span className="inline-flex items-center rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-xs font-medium tracking-wide text-teal-200">
      API-first product
    </span>
  )
}

export function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#040810]">
      {label && (
        <div className="border-b border-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--vm-muted)]">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    POST: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  }
  return (
    <span
      className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${colors[method] ?? 'bg-slate-500/15 text-slate-300'}`}
    >
      {method}
    </span>
  )
}

export function TierBadge({ tier }: { tier: string }) {
  const labels: Record<string, string> = {
    starter: 'Starter',
    standard: 'Standard',
    enterprise: 'Enterprise',
  }
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--vm-muted)]">
      {labels[tier] ?? tier}
    </span>
  )
}

export function FlowStep({
  step,
  title,
  description,
  isLast,
}: {
  step: number
  title: string
  description: string
  isLast?: boolean
}) {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && (
        <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-gradient-to-b from-teal-400/40 to-transparent" />
      )}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-400/40 bg-teal-500/10 font-mono text-sm font-bold text-teal-300">
        {step}
      </div>
      <div>
        <h4 className="font-medium text-white">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-[var(--vm-muted)]">{description}</p>
      </div>
    </div>
  )
}

export function InlineLink({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-medium text-teal-400 underline decoration-teal-400/30 underline-offset-2 transition hover:text-teal-300 hover:decoration-teal-300/50"
    >
      {children}
    </button>
  )
}
