import type { CareStats } from '../types'

interface StatsDisplayProps {
  stats: CareStats | null
  loading: boolean
  error: string | null
}

export function StatsDisplay({ stats, loading, error }: StatsDisplayProps) {
  if (loading) return <p role="status" className="text-sm text-slate-600">Loading statistics…</p>
  if (error) return <p role="alert" className="text-sm text-red-700">{error}</p>
  if (!stats) return <p className="text-sm text-slate-500">No statistics available for this selection.</p>

  const tiles: [string, string | number][] = [
    ['Total notes', stats.total_notes],
    ['Avg notes per patient', stats.avg_notes_per_patient.toFixed(1)],
    ['Active facilities', Object.keys(stats.by_facility).length],
    ['Categories', Object.keys(stats.by_category).length],
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map(([label, value]) => (
        <div className="rounded-lg bg-slate-50 p-4" key={label}>
          <dt className="text-xs text-slate-500">{label}</dt>
          <dd className="mt-2 text-2xl font-semibold text-teal-800">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
