import type { CareStats } from '../types'

interface StatsDisplayProps {
  stats: CareStats | null
  loading: boolean
  error: string | null
  onRetry?: () => void
}

export function StatsDisplay({ stats, loading, error, onRetry }: StatsDisplayProps) {
  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-clay-50 p-4 text-sm text-clay-700">
        <span>{error}</span>
        {onRetry && <button type="button" className="btn-secondary" onClick={onRetry}>Retry</button>}
      </div>
    )
  }
  if (!stats) {
    return loading
      ? <p role="status" className="text-sm text-muted">Loading figures…</p>
      : <p className="text-sm text-muted">No figures for this selection yet.</p>
  }

  const tiles: [string, string | number][] = [
    ['Notes', stats.total_notes],
    ['Notes per resident', stats.avg_notes_per_patient.toFixed(1)],
    ['Facilities reporting', Object.keys(stats.by_facility).length],
    ['Categories used', Object.keys(stats.by_category).length],
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-busy={loading}>
      {tiles.map(([label, value]) => (
        <div className="rounded-lg border border-pine-100 bg-pine-50 p-4" key={label}>
          <dt className="text-xs font-medium text-muted">{label}</dt>
          <dd className="mt-1 font-serif text-3xl font-semibold text-pine-800">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
