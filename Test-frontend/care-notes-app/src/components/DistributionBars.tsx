interface DistributionRow {
  key: string
  label: string
  count: number
}

export function DistributionBars({ title, rows }: { title: string; rows: DistributionRow[] }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0)

  return (
    <section className="panel">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {total === 0 ? (
        <p className="py-4 text-center text-sm text-muted">No notes in this range.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map(row => {
            const percentage = (row.count / total) * 100
            return (
              <li key={row.key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{row.label}</span>
                  <span className="text-muted">{row.count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-pine-50" aria-hidden="true">
                  <div className="h-2 rounded-full bg-pine-600" style={{ width: `${percentage}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
