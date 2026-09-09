import { AnalystDashboard, AnalystSidebar } from './components/AnalystDashboard'
import { ApiFeedPanel } from './components/demo/ApiFeedPanel'
import { AttributionPanel } from './components/demo/AttributionPanel'
import { EvChargingPanel } from './components/demo/EvChargingPanel'
import { ModeNav } from './components/demo/ModeNav'
import { SiteIntelligencePanel } from './components/demo/SiteIntelligencePanel'
import { StoryMode } from './components/demo/StoryMode'
import { MapView } from './components/MapView'
import { MallSpatialAnalytics } from './components/mall/MallSpatialAnalytics'
import { useDemoData } from './hooks/useDemoData'
import { useAppStore } from './store'

function App() {
  useDemoData()

  const demoLoading = useAppStore((s) => s.demoLoading)
  const demoError = useAppStore((s) => s.demoError)
  const appMode = useAppStore((s) => s.appMode)

  const isStory = appMode === 'story'
  const isApi = appMode === 'api'
  const showAnalystSidebar = appMode === 'analyst'
  const showMap = !isStory && !isApi && appMode !== 'mall'
  const isMall = appMode === 'mall'

  return (
    <div className="vm-page-bg min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[var(--mn-wire)] bg-[var(--mn-night)]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-5 py-2.5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--mn-border)] bg-[var(--mn-card)] font-display text-sm font-bold text-[var(--mn-teal)]">
              V
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-lg tracking-tight text-[var(--mn-heading)] lg:text-xl">
                VectorMobility
              </h1>
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--mn-mist)]">
                {isMall ? 'Mall Operations Intelligence' : 'Consumer Behavior Graph'}
              </p>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-3 lg:w-auto">
            {!isMall && <ModeNav />}
            {isMall && (
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--mn-faint)]">
                <span className="rounded-full border border-[var(--mn-border)] bg-[var(--mn-card)] px-2.5 py-1 text-[var(--mn-teal)]">
                  Mall operations
                </span>
                <span>Singapore · 3 malls</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {demoLoading ? (
                <span className="animate-pulse rounded-full border border-[var(--mn-border)] bg-[var(--mn-card)] px-2.5 py-1 text-xs text-[var(--mn-teal)]">
                  Loading
                </span>
              ) : (
                <span className="rounded-full border border-[var(--mn-wire)] bg-[var(--mn-card)] px-2.5 py-1 text-xs text-[var(--mn-mist)]">
                  Demo data
                </span>
              )}
              {demoError && (
                <span className="max-w-[200px] truncate rounded-full border border-[var(--mn-border)] bg-[var(--mn-card)] px-2.5 py-1 text-xs text-[var(--mn-faint)]">
                  {demoError}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {isStory ? (
        <main className="relative min-h-[calc(100vh-56px)]">
          <div className="fixed inset-0 top-[56px] z-0">
            <MapView className="h-full min-h-0 rounded-none border-0" />
            <div className="pointer-events-none absolute inset-0 vm-map-scrim" aria-hidden />
          </div>
          <div className="relative z-10">
            <StoryMode />
          </div>
        </main>
      ) : isApi ? (
        <main className="mx-auto max-w-[1600px] px-4 py-5 lg:px-8">
          <ApiFeedPanel />
        </main>
      ) : (
        <main className="mx-auto max-w-[1600px] px-4 py-5 lg:px-8">
          <div
            className={`grid gap-5 ${showAnalystSidebar ? 'lg:grid-cols-[300px_1fr]' : 'grid-cols-1'}`}
          >
            {showAnalystSidebar && (
              <div className="lg:sticky lg:top-[68px] lg:self-start">
                <AnalystSidebar />
              </div>
            )}

            <div className="flex min-w-0 flex-col gap-5">
              {showMap && (
                <MapView className="h-[380px] min-h-[320px] shrink-0 lg:h-[420px]" />
              )}

              {appMode === 'attribution' && <AttributionPanel />}
              {appMode === 'site' && <SiteIntelligencePanel />}
              {appMode === 'ev' && <EvChargingPanel />}
              {appMode === 'mall' && <MallSpatialAnalytics />}
              {appMode === 'analyst' && <AnalystDashboard />}
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
