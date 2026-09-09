import type { AppMode } from '../../demo/types'
import { useAppStore } from '../../store'

const STORY_MODE = {
  id: 'story' as const,
  label: 'Story',
  desc: 'Pitch narrative',
}

const DEEP_DIVES: { id: AppMode; label: string; desc: string; isApi?: boolean }[] = [
  { id: 'api', label: 'API', desc: 'The product', isApi: true },
  { id: 'attribution', label: 'Attribution', desc: 'CMO view' },
  { id: 'site', label: 'Site Intel', desc: 'Strategy view' },
  { id: 'mall', label: 'Mall Intel', desc: 'Operator view' },
  { id: 'ev', label: 'EV Charging', desc: 'Network ops view' },
  { id: 'analyst', label: 'Analyst', desc: 'Data science view' },
]

function NavButton({
  label,
  desc,
  active,
  onClick,
}: {
  label: string
  desc: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={desc}
      className={`group relative shrink-0 rounded-md px-3 py-2 text-left transition-colors duration-200 ${
        active
          ? 'bg-[var(--mn-teal)] text-[var(--mn-logo-ink)]'
          : 'text-[var(--mn-mist)] hover:bg-[var(--mn-card)] hover:text-[var(--mn-ice)]'
      }`}
    >
      <span className="block text-xs font-semibold leading-none lg:text-sm">{label}</span>
      <span
        className={`mt-0.5 hidden text-[10px] leading-none lg:block ${
          active ? 'text-[var(--mn-logo-ink)]/70' : 'text-[var(--mn-faint)] group-hover:text-[var(--mn-mist)]'
        }`}
      >
        {desc}
      </span>
    </button>
  )
}

export function ModeNav() {
  const appMode = useAppStore((s) => s.appMode)
  const setAppMode = useAppStore((s) => s.setAppMode)

  return (
    <nav
      className="flex min-w-0 max-w-full items-center gap-0.5 overflow-x-auto rounded-lg border border-[var(--mn-wire)] bg-[var(--mn-abyss)] p-1"
      aria-label="Demo mode"
    >
      <NavButton
        label={STORY_MODE.label}
        desc={STORY_MODE.desc}
        active={appMode === STORY_MODE.id}
        onClick={() => setAppMode(STORY_MODE.id)}
      />

      <span className="mx-0.5 hidden h-6 w-px shrink-0 bg-[var(--mn-wire)] lg:block" aria-hidden />

      <span className="hidden px-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--mn-faint)] lg:inline">
        Deep dives
      </span>

      {DEEP_DIVES.map((m) => (
        <NavButton
          key={m.id}
          label={m.label}
          desc={m.desc}
          active={appMode === m.id}
          onClick={() => setAppMode(m.id)}
        />
      ))}
    </nav>
  )
}
