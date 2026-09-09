import type { ReactNode } from 'react'

export function GlassPanel({
  children,
  className = '',
  variant = 'default',
}: {
  children: ReactNode
  className?: string
  variant?: 'default' | 'bright' | 'flat'
}) {
  const base =
    variant === 'bright'
      ? 'vm-glass-bright'
      : variant === 'flat'
        ? 'border border-[var(--vm-border)] bg-[var(--vm-surface-solid)]'
        : 'vm-glass'
  return <div className={`rounded-2xl ${base} ${className}`}>{children}</div>
}

export function PersonaChip({
  persona,
}: {
  persona: 'caryl' | 'marco' | 'reyes' | 'fusion' | 'neutral'
}) {
  const styles = {
    caryl: 'border-violet-400/30 bg-violet-500/10 text-violet-200',
    marco: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
    reyes: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    fusion: 'border-teal-400/30 bg-teal-500/10 text-teal-200',
    neutral: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  }
  const labels = {
    caryl: 'CMO view',
    marco: 'Strategy view',
    reyes: 'Network ops view',
    fusion: 'Consumer Behavior Graph',
    neutral: 'VectorMobility',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${styles[persona]}`}>
      {labels[persona]}
    </span>
  )
}

export function TakeawayStat({
  value,
  label,
  sub,
  accent = 'teal',
}: {
  value: string
  label: string
  sub?: string
  accent?: 'teal' | 'violet' | 'amber' | 'rose'
}) {
  const accents = {
    teal: 'text-teal-300',
    violet: 'text-violet-300',
    amber: 'text-amber-300',
    rose: 'text-rose-300',
  }
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--vm-muted)]">
        {label}
      </span>
      <span className={`font-display text-3xl leading-none ${accents[accent]}`}>{value}</span>
      {sub && <span className="text-xs text-[var(--vm-muted)]">{sub}</span>}
    </div>
  )
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-400/80">
      {children}
    </p>
  )
}

export function KeyTakeaway({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-teal-400/60 pl-4 text-sm leading-relaxed text-[var(--vm-muted)]">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-teal-400/70">
        Key takeaway
      </span>
      {children}
    </div>
  )
}

export function Disclaimer() {
  return (
    <p className="text-[11px] leading-relaxed text-slate-600">
      Illustrative demo — synthetic data for presentation. Production feeds pending carrier partnership.
    </p>
  )
}
