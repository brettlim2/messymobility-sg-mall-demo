import { useCallback, useEffect, useRef } from 'react'
import type { AppMode } from '../../demo/types'
import { useAppStore } from '../../store'
import {
  Disclaimer,
  GlassPanel,
  KeyTakeaway,
  PersonaChip,
} from '../ui/GlassPanel'
import { ApiChip, CodeBlock } from './ApiComponents'
import { StoryBeatVisual } from './StoryBeatVisual'

const BEATS = [
  {
    step: '01',
    title: 'You know where to look.',
    body: 'VectorMobility is the intelligence layer for real-world decisions across Southeast Asia — where people go, what they say, and how the two connect.',
    takeaway: 'Real-world decisions need real-world signal — not just dashboards.',
    persona: null as string | null,
    showBegin: true,
  },
  {
    step: '02',
    title: 'The data loop breaks at the screen.',
    body: 'Social listening stops at engagement. Mobility data has no narrative. Three vendors and weeks of stitching — and the answer still arrives too late.',
    takeaway: 'Today\'s workaround: three vendors, a data team, and an answer that arrives too late.',
    persona: null,
  },
  {
    step: '03',
    title: 'Same gap. Both directions.',
    body: 'Strategy needs forward-looking corridors. Marketing needs campaign attribution. Nobody answers both from one platform.',
    takeaway: 'Strategy can\'t see early. Marketing can\'t see proof.',
    persona: 'dual',
  },
  {
    step: '04',
    title: 'Three inputs. One graph.',
    body: 'MessyNet social intelligence + mobility research + carrier-grade movement data — fused into a verifiable causal link.',
    takeaway: 'The moat is the fusion layer, not any single dataset.',
    persona: 'fusion',
  },
  {
    step: '05',
    title: 'The product is the feed.',
    body: 'VectorMobility ships as a programmatic API. Query fused social, mobility, and attribution endpoints directly — then build any dashboard on top.',
    takeaway: 'We sell the Consumer Behavior Graph as an API feed. You own the visualization.',
    persona: 'api',
  },
  {
    step: '06',
    title: 'Did it work?',
    body: 'When social buzz spikes, footfall follows — with a measurable lag. Campaign attribution in minutes, not months.',
    takeaway: 'Social narrative → physical movement. Verifiable. Quantified. One API call.',
    persona: 'caryl',
  },
  {
    step: '07',
    title: 'Where next?',
    body: 'Forward score ranks candidate parcels by fused foot-traffic, social growth, and mobility trends — before competitors move.',
    takeaway: 'See the corridor before the earthmovers arrive.',
    persona: 'marco',
  },
  {
    step: '08',
    title: 'The same graph charges the grid.',
    body: 'EV operators ask the identical question: where is unmet charging demand? The mobility graph ranks live-hub utilization and underserved corridors — one feed, a new vertical.',
    takeaway: 'One Consumer Behavior Graph. Retail siting today, EV networks tomorrow.',
    persona: 'reyes',
  },
  {
    step: '09',
    title: 'The category seat is empty.',
    body: '$850M SEA TAM · 18% CAGR · No player connects narrative back to movement. VectorMobility owns the fusion layer — API-first from day one.',
    takeaway: 'First-mover in a new data-licensing category.',
    persona: 'vision',
    cta: true,
  },
]

export function StoryMode() {
  const storyStep = useAppStore((s) => s.storyStep)
  const setStoryStep = useAppStore((s) => s.setStoryStep)
  const setAppMode = useAppStore((s) => s.setAppMode)
  const demoData = useAppStore((s) => s.demoData)
  const beatRefs = useRef<(HTMLElement | null)[]>([])

  const scrollToBeat = useCallback((idx: number) => {
    const el = beatRefs.current[idx]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setStoryStep(idx)
    }
  }, [setStoryStep])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = beatRefs.current.indexOf(entry.target as HTMLElement)
            if (idx >= 0) setStoryStep(idx)
          }
        }
      },
      { root: null, threshold: 0.5, rootMargin: '-10% 0px -10% 0px' },
    )

    beatRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [setStoryStep])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
        return
      }
      if (e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault()
        scrollToBeat(Math.min(storyStep + 1, BEATS.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        scrollToBeat(Math.max(storyStep - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [storyStep, scrollToBeat])

  const campaign = demoData?.campaigns[0]
  const topCorridor = demoData?.corridors.slice().sort((a, b) => a.roiRank - b.roiRank)[0]

  const handleNavigate = (mode: AppMode) => setAppMode(mode)

  return (
    <div className="vm-story-scroll">
      <nav
        className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 lg:flex xl:right-8"
        aria-label="Story progress"
      >
        {BEATS.map((b, i) => (
          <button
            key={b.step}
            type="button"
            onClick={() => scrollToBeat(i)}
            className="group flex items-center gap-2 rounded-lg px-1 py-0.5 transition hover:bg-white/[0.04]"
            aria-label={`Go to beat ${b.step}`}
            aria-current={i === storyStep ? 'step' : undefined}
          >
            <span
              className={`text-[10px] font-mono tabular-nums transition ${
                i === storyStep ? 'text-teal-400' : 'text-slate-600 group-hover:text-slate-400'
              }`}
            >
              {b.step}
            </span>
            <div
              className={`h-px transition-all duration-500 ${
                i === storyStep ? 'w-10 bg-teal-400' : 'w-4 bg-slate-700 group-hover:bg-slate-500'
              }`}
            />
          </button>
        ))}
      </nav>

      {BEATS.map((beat, i) => {
        const isActive = i === storyStep
        return (
          <section
            key={beat.step}
            ref={(el) => {
              beatRefs.current[i] = el
            }}
            className="vm-story-beat flex min-h-[calc(100vh-56px)] items-center px-5 py-12 lg:px-8"
          >
            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
              <GlassPanel
                variant={isActive ? 'bright' : 'default'}
                className={`p-7 transition-all duration-500 lg:p-9 ${
                  isActive ? 'opacity-100' : 'opacity-50 scale-[0.98]'
                }`}
              >
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-teal-400/70">
                    {beat.step} / {String(BEATS.length).padStart(2, '0')}
                  </span>
                  {beat.persona === 'caryl' && <PersonaChip persona="caryl" />}
                  {beat.persona === 'marco' && <PersonaChip persona="marco" />}
                  {beat.persona === 'reyes' && <PersonaChip persona="reyes" />}
                  {beat.persona === 'fusion' && <PersonaChip persona="fusion" />}
                  {beat.persona === 'api' && <ApiChip />}
                  {beat.persona === 'dual' && (
                    <>
                      <PersonaChip persona="caryl" />
                      <PersonaChip persona="marco" />
                    </>
                  )}
                </div>

                <h2 className="font-display text-3xl leading-[1.15] text-white lg:text-4xl xl:text-[2.75rem]">
                  {beat.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--vm-muted)] lg:text-lg">
                  {beat.body}
                </p>

                <div className="mt-6">
                  <KeyTakeaway>{beat.takeaway}</KeyTakeaway>
                </div>

                {beat.showBegin && (
                  <button
                    type="button"
                    onClick={() => scrollToBeat(1)}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:brightness-110"
                  >
                    Begin
                    <span aria-hidden>↓</span>
                  </button>
                )}

                {beat.persona === 'api' && (
                  <div className="mt-8 space-y-3">
                    <CodeBlock label="Example — campaign attribution">
                      {`GET /v1/fusion/attribution?campaign_id=camp-pg-sustain-q1

→ { "lift_pct": 21.0, "causal_lag_days": 3.2, "confidence": 91 }`}
                    </CodeBlock>
                    <button
                      type="button"
                      onClick={() => setAppMode('api')}
                      className="text-sm font-medium text-teal-400 underline decoration-teal-400/30 underline-offset-2 hover:text-teal-300"
                    >
                      Explore full API catalog →
                    </button>
                  </div>
                )}

                {beat.cta && (
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => setAppMode('api')}
                      className="rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:brightness-110"
                    >
                      Explore API →
                    </button>
                  </div>
                )}

                {i === BEATS.length - 1 && (
                  <div className="mt-6">
                    <Disclaimer />
                  </div>
                )}
              </GlassPanel>

              <div className="hidden lg:block">
                <StoryBeatVisual
                  beatIndex={i}
                  demoData={demoData}
                  campaign={campaign}
                  topCorridor={topCorridor}
                  isActive={isActive}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </section>
        )
      })}

      <p className="pointer-events-none fixed bottom-4 left-1/2 z-20 hidden -translate-x-1/2 text-[10px] text-slate-600 lg:block">
        ↑ ↓ or Space to navigate
      </p>
    </div>
  )
}
