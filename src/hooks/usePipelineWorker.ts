import { useEffect, useRef } from 'react'
import { useAppStore } from '../store'
import PipelineWorker from '../pipeline/worker?worker'

export function usePipelineWorker() {
  const workerRef = useRef<Worker | null>(null)
  const params = useAppStore((s) => s.params)
  const ready = useAppStore((s) => s.ready)
  const setResult = useAppStore((s) => s.setResult)
  const setLoading = useAppStore((s) => s.setLoading)
  const setReady = useAppStore((s) => s.setReady)
  const setError = useAppStore((s) => s.setError)

  useEffect(() => {
    const worker = new PipelineWorker()
    workerRef.current = worker

    worker.onmessage = (e: MessageEvent) => {
      const { type, result, message, userCount } = e.data
      if (type === 'ready') {
        setReady(true)
        setLoading(false)
        setError(null)
        console.info(`Pipeline ready: ${userCount} users loaded`)
      } else if (type === 'result') {
        setResult(result)
        setLoading(false)
      } else if (type === 'error') {
        setError(message)
        setLoading(false)
      }
    }

    // Resolve to an absolute URL against the document — a relative URL would
    // otherwise resolve against the worker's own location (the assets folder),
    // which breaks when the site is served from a subpath (e.g. GitHub Pages).
    const csvUrl = new URL(
      `${import.meta.env.BASE_URL}singapore_veraset_sample.csv`,
      window.location.href,
    ).href
    worker.postMessage({ type: 'init', csvUrl })

    return () => worker.terminate()
  }, [setError, setLoading, setReady, setResult])

  useEffect(() => {
    if (!ready || !workerRef.current) return
    setLoading(true)
    const timer = setTimeout(() => {
      workerRef.current?.postMessage({ type: 'run', params })
    }, 150)
    return () => clearTimeout(timer)
  }, [params, ready, setLoading])
}
